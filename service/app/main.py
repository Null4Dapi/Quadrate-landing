"""Servicio en vivo de Quadrate pe (Cloud Run): WebSocket + respaldo HTTP, sin base de datos ni claves."""
import time

from fastapi import FastAPI, HTTPException, Query, Request, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from . import aforo, faq
from .config import Config, cargar
from .ws import Hub, ip_de


class ChatEntrada(BaseModel):
    texto: str = Field(min_length=1, max_length=400)


def _ip_http(request: Request) -> str:
    reenviado = request.headers.get("x-forwarded-for", "")
    if reenviado:
        return reenviado.split(",")[0].strip()
    return request.client.host if request.client else "desconocido"


def crear_app(config: Config | None = None) -> FastAPI:
    config = config or cargar()
    app = FastAPI(title="Quadrate pe en vivo", version="1.0.0", docs_url=None, redoc_url=None, openapi_url=None)
    app.state.config = config
    app.state.hub = hub = Hub(config)

    if config.origenes:
        app.add_middleware(CORSMiddleware, allow_origins=list(config.origenes),
                           allow_methods=["GET", "POST"], allow_headers=["Content-Type"], max_age=600)

    @app.middleware("http")
    async def cabeceras(request: Request, call_next):
        respuesta = await call_next(request)
        respuesta.headers.setdefault("X-Content-Type-Options", "nosniff")
        respuesta.headers.setdefault("Referrer-Policy", "no-referrer")
        respuesta.headers.setdefault("Cache-Control", "no-store")
        return respuesta

    @app.get("/salud")
    async def salud() -> dict:
        return {"estado": "ok", "conexiones": hub.conexiones.total}

    @app.get("/v1/aforo")
    async def ver_aforo(distrito: str | None = Query(default=None, max_length=40)) -> dict:
        return aforo.instantanea(time.time(), distrito)

    @app.post("/v1/chat")
    async def chat_http(entrada: ChatEntrada, request: Request) -> dict:
        """Respaldo para navegadores o redes que bloquean WebSocket."""
        if not hub.limite_chat.permitir(_ip_http(request)) or not hub.tope_chat.consumir():
            raise HTTPException(status_code=429, detail="Demasiados mensajes. Intenta de nuevo en un minuto.")
        return {"respuesta": faq.responder(entrada.texto, time.time()), "fuente": "preguntas frecuentes"}

    @app.websocket("/ws")
    async def websocket(ws: WebSocket) -> None:
        await hub.atender(ws)

    @app.websocket("/ws-telemetria")
    async def websocket_telemetria(ws: WebSocket) -> None:
        await hub.atender_telemetria(ws)

    return app


app = crear_app()
