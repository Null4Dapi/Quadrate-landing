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

from fastapi import WebSocket
from starlette.websockets import WebSocketDisconnect

from . import aforo, faq, telemetria
from .config import Config
from .limites import ContadorConexiones, LimitadorVentana, PresupuestoTiempo, TopeDiario

log = logging.getLogger("quadrate.ws")

ID_VALIDO = re.compile(r"^[A-Za-z0-9_-]{1,40}$")
ENVIO_TIMEOUT_SEG = 5


def ip_de(ws: WebSocket) -> str:
    reenviado = ws.headers.get("x-forwarded-for", "")
    if reenviado:
        return reenviado.split(",")[0].strip()
    return ws.client.host if ws.client else "desconocido"


def origen_permitido(origen: str | None, config: Config) -> bool:
    """Un navegador siempre envía Origin al abrir un WebSocket; sin lista configurada no se acepta ninguno."""
    return bool(origen) and origen.rstrip("/") in config.origenes


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
    async def atender(self, ws: WebSocket) -> None:
        cfg = self.config
        if not origen_permitido(ws.headers.get("origin"), cfg):
            await ws.close(code=1008)
            return
        ip = ip_de(ws)
        if not self.conexiones.admitir(ip):
            await ws.close(code=1013)
            return
        cliente = Cliente(ws)
        inicio = time.monotonic()
        try:  # accept() va dentro del try: si el cliente se cae en el saludo, igual se libera el cupo
            await ws.accept()
            self.clientes[ws] = cliente
            self._asegurar_bucle()
            await cliente.enviar({
                "type": "hola", "version": 1, "demostracion": True,
                "distritos": list(aforo.DISTRITOS), "sugerencias": list(faq.SUGERENCIAS),
                "vida_max_seg": cfg.vida_max_seg, "inactividad_seg": cfg.inactividad_seg,
            })
            while True:
                restante = cfg.vida_max_seg - (time.monotonic() - inicio)
                if restante <= 0:
                    await ws.close(code=4000)
                    return
                try:
                    evento = await asyncio.wait_for(ws.receive(), timeout=min(cfg.inactividad_seg, restante))
                except asyncio.TimeoutError:
                    await ws.close(code=4000 if restante <= cfg.inactividad_seg else 4001)
                    return
                if evento["type"] == "websocket.disconnect":
                    return
                await self._procesar(cliente, evento.get("text"), ip)
        except (WebSocketDisconnect, RuntimeError, asyncio.TimeoutError, OSError):
            pass
        finally:
            self.clientes.pop(ws, None)
            self.conexiones.liberar(ip)

    async def atender_telemetria(self, ws: WebSocket) -> None:
        """Protocolo de la demo de Quadrate (demo.html): tramas de aforo y eventos. Esa demo reconecta sola."""
        cfg = self.config
        if not origen_permitido(ws.headers.get("origin"), cfg):
            await ws.close(code=1008)
            return
        ip = ip_de(ws)
        if not self.presupuesto.disponible(ip) or not self.conexiones.admitir(ip):
            await ws.close(code=1013)
            return
        cliente = Cliente(ws)
        inicio = time.monotonic()
        try:  # accept() va dentro del try: si el cliente se cae en el saludo, igual se libera el cupo
            await ws.accept()
            self.telemetria[ws] = cliente
            self._asegurar_bucle()
            await cliente.enviar(telemetria.bienvenida(time.time()))
            await self._enviar_tramas(cliente, time.time())  # sincroniza el aforo al conectar
            while True:
                # Vida corta: la demo no envía nada, así que una desconexión brusca no se detecta; al reconectar sola
                # (cada 4 s) la demo se recupera y los sockets fantasma no duran.
                restante = cfg.vida_tele_seg - (time.monotonic() - inicio)
                if restante <= 0:
                    await ws.close(code=4000)
                    return
                try:
                    evento = await asyncio.wait_for(ws.receive(), timeout=restante)
                except asyncio.TimeoutError:
                    await ws.close(code=4000)
                    return
                if evento["type"] == "websocket.disconnect":
                    return
                await self._procesar_telemetria(cliente, evento.get("text"))
        except (WebSocketDisconnect, RuntimeError, asyncio.TimeoutError, OSError):
            pass
        finally:
            self.telemetria.pop(ws, None)
            self.conexiones.liberar(ip)
            self.presupuesto.registrar(ip, time.monotonic() - inicio)

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
