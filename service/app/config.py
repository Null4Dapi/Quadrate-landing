"""Configuración del servicio en vivo de Quadrate pe, leída de variables de entorno."""
import os
from dataclasses import dataclass


@dataclass(frozen=True)
class Config:
    # Orígenes del navegador autorizados a abrir el WebSocket y a llamar por HTTP (CORS).
    origenes: tuple[str, ...] = ()
    max_conexiones: int = 150          # por instancia
    max_por_ip: int = 4                # conexiones simultáneas por IP
    chat_por_minuto: int = 8           # mensajes de chat por IP
    tope_diario_chat: int = 20000      # mensajes de chat por día y por instancia (acota el CPU)
    vida_max_seg: int = 840            # se cierra y el cliente reconecta (Cloud Run corta a los 900 s)
    inactividad_seg: int = 90          # sin mensajes del cliente (ni ping) se cierra
    periodo_aforo_seg: int = 5         # cada cuánto se calcula y difunde la disponibilidad
    max_bytes_mensaje: int = 2000
    max_chars_chat: int = 400
    pausa_fragmento_seg: float = 0.03  # ritmo del streaming del chat
    presupuesto_tele_seg_hora: int = 1800  # segundos de telemetría por IP y hora (acota el costo de pestañas olvidadas)
    pausa_simulacion_seg: float = 2.0  # separación mínima entre «simular evento»


def _entero(env: dict, nombre: str, defecto: int) -> int:
    try:
        return int(env.get(nombre, defecto))
    except (TypeError, ValueError):
        return defecto


def cargar(env: dict | None = None) -> Config:
    env = os.environ if env is None else env
    origenes = tuple(o.strip().rstrip("/") for o in env.get("ALLOWED_ORIGINS", "").split(",") if o.strip())
    base = Config()
    return Config(
        origenes=origenes,
        max_conexiones=_entero(env, "MAX_CONEXIONES", base.max_conexiones),
        max_por_ip=_entero(env, "MAX_POR_IP", base.max_por_ip),
        chat_por_minuto=_entero(env, "CHAT_POR_MINUTO", base.chat_por_minuto),
        tope_diario_chat=_entero(env, "TOPE_DIARIO_CHAT", base.tope_diario_chat),
        vida_max_seg=_entero(env, "VIDA_MAX_SEG", base.vida_max_seg),
        inactividad_seg=_entero(env, "INACTIVIDAD_SEG", base.inactividad_seg),
        periodo_aforo_seg=_entero(env, "PERIODO_AFORO_SEG", base.periodo_aforo_seg),
        presupuesto_tele_seg_hora=_entero(env, "PRESUPUESTO_TELE_SEG_HORA", base.presupuesto_tele_seg_hora),
    )
