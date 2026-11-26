"""WebSocket de Quadrate pe: disponibilidad en tiempo real y chat con respuesta en streaming.

Protocolo (JSON de texto):
  cliente -> {"type":"suscribir","distrito":"Miraflores"|"todos"} | {"type":"chat","id":"...","texto":"..."} | {"type":"ping"}
  servidor -> {"type":"hola",...} | {"type":"aforo",...} | {"type":"chat_inicio"|"chat_delta"|"chat_fin",...}
              | {"type":"pong"} | {"type":"error","codigo":"...","mensaje":"..."}
Cierres: 1008 origen no permitido, 1013 servicio saturado, 4000 renovar (vida máxima), 4001 inactividad.
"""
import asyncio
import json
import logging
import re
import time
from urllib.parse import urlsplit

from fastapi import WebSocket
from starlette.websockets import WebSocketDisconnect

from . import aforo, faq, telemetria
from .config import Config
from .limites import ContadorConexiones, LimitadorVentana, PresupuestoTiempo, TopeDiario

log = logging.getLogger("quadrate.ws")

ID_VALIDO = re.compile(r"^[A-Za-z0-9_-]{1,40}$")
ENVIO_TIMEOUT_SEG = 5


def _habla_la_demo(texto: str | None) -> bool:
    """La demo de Quadrate envía {"accion": ...}; el asistente envía {"type": ...}."""
    try:
        mensaje = json.loads(texto or "")
    except ValueError:
        return False
    return isinstance(mensaje, dict) and "accion" in mensaje and "type" not in mensaje


def ip_de(ws: WebSocket) -> str:
    reenviado = ws.headers.get("x-forwarded-for", "")
    if reenviado:
        return reenviado.split(",")[0].strip()
    return ws.client.host if ws.client else "desconocido"


def origen_permitido(origen: str | None, config: Config) -> bool:
    """Un navegador siempre envía Origin al abrir un WebSocket; sin lista configurada no se acepta ninguno."""
    if not origen:
        return False
    if origen.rstrip("/") in config.origenes:
        return True
    if config.permitir_localhost:
        partes = urlsplit(origen)
        return partes.scheme in ("http", "https") and partes.hostname in ("localhost", "127.0.0.1")
    return False


class Cliente:
    def __init__(self, ws: WebSocket) -> None:
        self.ws = ws
        self.distrito: str | None = None
        self.suscrito = False
        self.ultima_firma: tuple | None = None
        self.chat_activo = False
        self.previas: dict | None = None      # telemetría: último aforo enviado, por cochera
        self.ultimo_simulado = 0.0            # telemetría: instante del último «simular evento»
        self._candado = asyncio.Lock()

    async def enviar(self, mensaje: dict) -> None:
        async with self._candado:
            await asyncio.wait_for(self.ws.send_text(json.dumps(mensaje, ensure_ascii=False)), ENVIO_TIMEOUT_SEG)


class Hub:
    def __init__(self, config: Config) -> None:
        self.config = config
        self.clientes: dict[WebSocket, Cliente] = {}
        self.telemetria: dict[WebSocket, Cliente] = {}
        self.presupuesto = PresupuestoTiempo(config.presupuesto_tele_seg_hora)
        self.conexiones = ContadorConexiones(config.max_conexiones, config.max_por_ip)
        self.limite_chat = LimitadorVentana(config.chat_por_minuto)
        self.tope_chat = TopeDiario(config.tope_diario_chat)
        self._bucle: asyncio.Task | None = None

    # --- difusión de disponibilidad -------------------------------------------------------------
    def _asegurar_bucle(self) -> None:
        if self._bucle is None or self._bucle.done():
            self._bucle = asyncio.create_task(self._difundir())

    async def _difundir(self) -> None:
        """Calcula y difunde la disponibilidad solo mientras haya clientes (permite escalar a cero)."""
        while self.clientes or self.telemetria:
            await asyncio.sleep(self.config.periodo_aforo_seg)
            ahora = time.time()
            for cliente in list(self.clientes.values()):
                if cliente.suscrito:
                    await self._enviar_aforo(cliente, ahora, solo_si_cambio=True)
            for cliente in list(self.telemetria.values()):
                await self._enviar_tramas(cliente, ahora)

    async def _enviar_tramas(self, cliente: Cliente, ahora: float) -> None:
        tramas, cliente.previas = telemetria.eventos_por_cambio(cliente.previas, ahora)
        try:
            for t in tramas:
                await cliente.enviar(t)
        except (asyncio.TimeoutError, RuntimeError, WebSocketDisconnect, OSError):
            self.telemetria.pop(cliente.ws, None)

    async def _enviar_aforo(self, cliente: Cliente, ahora: float, solo_si_cambio: bool) -> None:
        instantanea = aforo.instantanea(ahora, cliente.distrito)
        huella = aforo.firma(instantanea)
        if solo_si_cambio and huella == cliente.ultima_firma:
            return
        cliente.ultima_firma = huella
        try:
            await cliente.enviar(instantanea)
        except (asyncio.TimeoutError, RuntimeError, WebSocketDisconnect, OSError):
            self.clientes.pop(cliente.ws, None)  # cliente lento o caído: se descarta

    # --- ciclo de vida de una conexión ------------------------------------------------------------
    # modo "chat": asistente (/ws-chat) · "telemetria": demo de Quadrate (/ws-telemetria) ·
    # "mixto" (/ws): atiende a las dos cosas, porque la demo de la página abre /ws en producción y el asistente
    # de versiones anteriores también.
    async def atender(self, ws: WebSocket) -> None:
        await self._sesion(ws, "mixto")

    async def atender_chat(self, ws: WebSocket) -> None:
        await self._sesion(ws, "chat")

    async def atender_telemetria(self, ws: WebSocket) -> None:
        await self._sesion(ws, "telemetria")

    async def _sesion(self, ws: WebSocket, modo: str) -> None:
        cfg = self.config
        origen = ws.headers.get("origin")
        if not origen_permitido(origen, cfg):
            log.warning("WebSocket rechazado en %s: origen no permitido (%s)", modo, (origen or "sin origen")[:80])
            await ws.close(code=1008)
            return
        ip = ip_de(ws)
        con_telemetria = modo in ("telemetria", "mixto")
        if (con_telemetria and not self.presupuesto.disponible(ip)) or not self.conexiones.admitir(ip):
            await ws.close(code=1013)
            return
        cliente = Cliente(ws)
        inicio = time.monotonic()
        vida = cfg.vida_max_seg if modo == "chat" else cfg.vida_tele_seg
        inactividad = cfg.inactividad_seg if modo == "chat" else None  # la demo no envía nada: no hay inactividad que medir
        try:  # accept() va dentro del try: si el cliente se cae en el saludo, igual se libera el cupo
            await ws.accept()
            self.clientes[ws] = cliente
            if con_telemetria:
                self.telemetria[ws] = cliente
            self._asegurar_bucle()
            await self._saludar(cliente, modo, vida)
            while True:
                restante = vida - (time.monotonic() - inicio)
                if restante <= 0:
                    await ws.close(code=4000)
                    return
                espera = restante if inactividad is None else min(inactividad, restante)
                try:
                    evento = await asyncio.wait_for(ws.receive(), timeout=espera)
                except asyncio.TimeoutError:
                    await ws.close(code=4000 if inactividad is None or restante <= inactividad else 4001)
                    return
                if evento["type"] == "websocket.disconnect":
                    return
                await self._despachar(cliente, modo, evento.get("text"), ip)
        except (WebSocketDisconnect, RuntimeError, asyncio.TimeoutError, OSError):
            pass
        finally:
            self.clientes.pop(ws, None)
            self.telemetria.pop(ws, None)
            self.conexiones.liberar(ip)
            if con_telemetria:
                self.presupuesto.registrar(ip, time.monotonic() - inicio)

    async def _saludar(self, cliente: Cliente, modo: str, vida: int) -> None:
        ahora = time.time()
        datos_chat = {"type": "hola", "version": 1, "demostracion": True, "distritos": list(aforo.DISTRITOS),
                      "sugerencias": list(faq.SUGERENCIAS), "vida_max_seg": vida}
        if modo == "chat":
            await cliente.enviar({**datos_chat, "inactividad_seg": self.config.inactividad_seg})
            return
        # En telemetría y mixto el primer mensaje es una trama que la demo sabe dibujar (tipo/timestamp/mensaje);
        # en mixto además lleva los campos del asistente, que la demo ignora.
        saludo = telemetria.bienvenida(ahora)
        if modo == "mixto":
            saludo = {**saludo, **datos_chat}
        await cliente.enviar(saludo)
        await self._enviar_tramas(cliente, ahora)  # sincroniza el aforo al conectar

    async def _despachar(self, cliente: Cliente, modo: str, texto: str | None, ip: str) -> None:
        if modo == "chat" or (modo == "mixto" and not _habla_la_demo(texto)):
            await self._procesar(cliente, texto, ip)
        else:
            await self._procesar_telemetria(cliente, texto)

    async def _procesar_telemetria(self, cliente: Cliente, texto: str | None) -> None:
        if texto is None or len(texto.encode("utf-8")) > self.config.max_bytes_mensaje:
            return
        try:
            accion = json.loads(texto).get("accion")
        except (ValueError, AttributeError):
            return
        if accion == "simular_evento":
            ahora = time.time()
            if ahora - cliente.ultimo_simulado < self.config.pausa_simulacion_seg:
                return
            cliente.ultimo_simulado = ahora
            await cliente.enviar(telemetria.evento_simulado(ahora))

    async def _procesar(self, cliente: Cliente, texto: str | None, ip: str) -> None:
        if texto is None or len(texto.encode("utf-8")) > self.config.max_bytes_mensaje:
            await self._error(cliente, "mensaje_invalido", "Mensaje no válido o demasiado largo.")
            return
        try:
            mensaje = json.loads(texto)
            tipo = mensaje["type"]
        except (ValueError, KeyError, TypeError):
            await self._error(cliente, "mensaje_invalido", "Mensaje no válido.")
            return

        if tipo == "ping":
            await cliente.enviar({"type": "pong", "ts": int(time.time())})
        elif tipo == "suscribir":
            distrito = mensaje.get("distrito")
            if distrito is not None and not isinstance(distrito, str):
                await self._error(cliente, "mensaje_invalido", "Distrito no válido.")
                return
            cliente.distrito = None if not distrito or distrito.lower() == "todos" else distrito[:40]
            cliente.suscrito = True
            await self._enviar_aforo(cliente, time.time(), solo_si_cambio=False)
        elif tipo == "chat":
            await self._chat(cliente, mensaje, ip)
        else:
            await self._error(cliente, "tipo_desconocido", "Tipo de mensaje no reconocido.")

    async def _chat(self, cliente: Cliente, mensaje: dict, ip: str) -> None:
        id_ = mensaje.get("id")
        texto = mensaje.get("texto")
        if not isinstance(id_, str) or not ID_VALIDO.match(id_) or not isinstance(texto, str) or not texto.strip():
            await self._error(cliente, "mensaje_invalido", "Falta el texto o el identificador del mensaje.")
            return
        if len(texto) > self.config.max_chars_chat:
            await self._error(cliente, "mensaje_largo", f"Máximo {self.config.max_chars_chat} caracteres.", id_)
            return
        if cliente.chat_activo:
            await self._error(cliente, "ocupado", "Espera a que termine la respuesta anterior.", id_)
            return
        if not self.limite_chat.permitir(ip) or not self.tope_chat.consumir():
            await self._error(cliente, "limite", "Demasiados mensajes. Intenta de nuevo en un minuto.", id_)
            return

        cliente.chat_activo = True
        try:
            respuesta = faq.responder(texto, time.time())
            await cliente.enviar({"type": "chat_inicio", "id": id_})
            for fragmento in _fragmentos(respuesta):
                await cliente.enviar({"type": "chat_delta", "id": id_, "texto": fragmento})
                await asyncio.sleep(self.config.pausa_fragmento_seg)
            await cliente.enviar({"type": "chat_fin", "id": id_, "fuente": "preguntas frecuentes"})
        finally:
            cliente.chat_activo = False

    @staticmethod
    async def _error(cliente: Cliente, codigo: str, mensaje: str, id_: str | None = None) -> None:
        carga = {"type": "error", "codigo": codigo, "mensaje": mensaje}
        if id_:
            carga["id"] = id_
        await cliente.enviar(carga)


def _fragmentos(texto: str, palabras: int = 3):
    """Parte la respuesta en grupos de palabras conservando los espacios, para mostrarla fluida."""
    piezas = re.findall(r"\S+\s*", texto)
    for i in range(0, len(piezas), palabras):
        yield "".join(piezas[i:i + palabras])
