"""/ws atiende a la demo de la página (tramas de telemetría, {"accion": ...}) y al asistente ({"type": ...}) a la vez."""
import json
import logging

import pytest
from fastapi.testclient import TestClient
from starlette.websockets import WebSocketDisconnect

from app import aforo
from app.config import Config
from app.main import crear_app

ORIGEN = "https://quadratepe.dealforge.lat"
TIPOS = {"ingreso", "salida", "reserva_eta", "tarifa_dinamica", "aforo_critico", "conexion"}


def cliente(**cambios) -> TestClient:
    base = dict(origenes=(ORIGEN,), periodo_aforo_seg=1, pausa_fragmento_seg=0, pausa_simulacion_seg=0.0, vida_tele_seg=60)
    base.update(cambios)
    return TestClient(crear_app(Config(**base)))


def abrir(c, ruta="/ws", origen=ORIGEN):
    return c.websocket_connect(ruta, headers={"origin": origen} if origen else {})


def recibir(ws) -> dict:
    return json.loads(ws.receive_text())


def test_el_saludo_es_una_trama_que_la_demo_sabe_dibujar_y_el_asistente_sabe_leer():
    with abrir(cliente()) as ws:
        hola = recibir(ws)
    assert hola["tipo"] == "conexion" and hola["mensaje"] and len(hola["timestamp"]) == 8   # lo que lee la demo
    assert hola["type"] == "hola" and hola["sugerencias"] and "Miraflores" in hola["distritos"]   # lo que lee el asistente


def test_la_demo_recibe_la_sincronizacion_del_aforo_sin_pedirla():
    with abrir(cliente()) as ws:
        recibir(ws)
        sync = [recibir(ws) for _ in aforo.COCHERAS]
    assert {t["cocheraId"] for t in sync} == {c["id"] for c in aforo.COCHERAS}
    assert all(set(t["datos"]) >= {"plazasDisponibles", "estadoAforo", "tarifaHora"} for t in sync)


def test_el_boton_simular_de_la_demo_hace_viaje_de_ida_y_vuelta():
    with abrir(cliente()) as ws:
        for _ in range(1 + len(aforo.COCHERAS)):
            recibir(ws)
        ws.send_text(json.dumps({"accion": "simular_evento"}))
        respuesta = recibir(ws)
    assert respuesta["tipo"] in TIPOS and respuesta["nombreCochera"] and "simulad" in respuesta["mensaje"].lower()


def test_el_asistente_sigue_funcionando_por_el_mismo_endpoint():
    with abrir(cliente()) as ws:
        for _ in range(1 + len(aforo.COCHERAS)):
            recibir(ws)
        ws.send_text(json.dumps({"type": "chat", "id": "m1", "texto": "¿Cuánto cuesta la app?"}))
        texto = ""
        for _ in range(60):
            m = recibir(ws)
            if m.get("type") == "chat_delta":
                texto += m["texto"]
            if m.get("type") == "chat_fin":
                break
    assert "100% gratuita" in texto


def test_demo_y_asistente_conviven_en_la_misma_conexion():
    with abrir(cliente()) as ws:
        for _ in range(1 + len(aforo.COCHERAS)):
            recibir(ws)
        ws.send_text(json.dumps({"accion": "simular_evento"}))
        ws.send_text(json.dumps({"type": "ping"}))
        vistos = {recibir(ws).get("type") or "demo" for _ in range(2)}
    assert vistos == {"demo", "pong"}


def test_ws_chat_no_empuja_telemetria_y_ws_telemetria_no_atiende_chat():
    c = cliente()
    with abrir(c, "/ws-chat") as chat:
        assert recibir(chat)["type"] == "hola"
        chat.send_text(json.dumps({"type": "ping"}))
        assert recibir(chat)["type"] == "pong"          # nada de tramas de aforo en medio


def test_acepta_localhost_solo_si_se_permite_y_no_confunde_dominios_parecidos():
    cerrado = cliente()
    with pytest.raises(WebSocketDisconnect):
        with abrir(cerrado, origen="http://localhost:8791"):
            pass
    abierto = cliente(permitir_localhost=True)
    for origen in ("http://localhost:8791", "http://127.0.0.1:3000", "https://localhost"):
        with abrir(abierto, origen=origen) as ws:
            assert recibir(ws)["type"] == "hola", origen
    for origen in ("http://localhost.evil.example", "http://evil.example/localhost", "https://127.0.0.1.evil.example", "ftp://localhost"):
        with pytest.raises(WebSocketDisconnect):
            with abrir(abierto, origen=origen):
                pass


def test_cors_http_respeta_localhost_con_puerto_numerico():
    c = cliente(permitir_localhost=True)
    assert c.get("/v1/aforo", headers={"origin": "http://localhost:8791"}).headers["access-control-allow-origin"] == "http://localhost:8791"
    assert "access-control-allow-origin" not in c.get("/v1/aforo", headers={"origin": "http://localhost:abc"}).headers
    assert "access-control-allow-origin" not in cliente().get("/v1/aforo", headers={"origin": "http://localhost:8791"}).headers


def test_registra_el_origen_rechazado_para_poder_diagnosticar(caplog):
    with caplog.at_level(logging.WARNING, logger="quadrate.ws"):
        with pytest.raises(WebSocketDisconnect):
            with abrir(cliente(), origen="https://otro.example"):
                pass
    assert any("https://otro.example" in r.getMessage() for r in caplog.records)
