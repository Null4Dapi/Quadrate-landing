import json

import pytest
from fastapi.testclient import TestClient
from starlette.websockets import WebSocketDisconnect

from app.config import Config, cargar
from app.main import crear_app

ORIGEN = "https://quadratepe.dealforge.lat"


def cliente(**cambios) -> TestClient:
    base = dict(origenes=(ORIGEN, "https://quadratepe.web.app"), periodo_aforo_seg=1,
                pausa_fragmento_seg=0, inactividad_seg=30, vida_max_seg=60)
    base.update(cambios)
    return TestClient(crear_app(Config(**base)))


def abrir(c: TestClient, origen: str | None = ORIGEN):
    return c.websocket_connect("/ws-chat", headers={"origin": origen} if origen else {})


def recibir(ws) -> dict:
    return json.loads(ws.receive_text())


def enviar(ws, **mensaje) -> None:
    ws.send_text(json.dumps(mensaje))


def test_rechaza_origenes_no_autorizados_o_ausentes():
    c = cliente()
    for origen in ("https://malo.example", "https://quadratepe.dealforge.lat.malo.example", None):
        with pytest.raises(WebSocketDisconnect) as error:
            with abrir(c, origen):
                pass
        assert error.value.code == 1008


def test_sin_lista_de_origenes_no_acepta_a_nadie():
    with pytest.raises(WebSocketDisconnect):
        with abrir(cliente(origenes=())):
            pass


def test_saluda_con_el_contrato_y_las_sugerencias():
    with abrir(cliente()) as ws:
        hola = recibir(ws)
    assert hola["type"] == "hola" and hola["demostracion"] is True
    assert "Miraflores" in hola["distritos"] and len(hola["sugerencias"]) >= 3


def test_suscribir_entrega_la_disponibilidad_y_la_filtra():
    with abrir(cliente()) as ws:
        recibir(ws)
        enviar(ws, type="suscribir", distrito="Miraflores")
        aforo = recibir(ws)
    assert aforo["type"] == "aforo" and aforo["demostracion"] is True
    assert {c["distrito"] for c in aforo["cocheras"]} == {"Miraflores"}


def test_difunde_cambios_sin_que_el_cliente_pregunte():
    with abrir(cliente()) as ws:
        recibir(ws)
        enviar(ws, type="suscribir")
        primero = recibir(ws)
        # el bucle de difusión solo envía cuando algo cambia; con el reloj real puede tardar varios periodos
        siguiente = None
        for _ in range(40):
            candidato = recibir(ws)
            if candidato["type"] == "aforo":
                siguiente = candidato
                break
        assert siguiente is not None
        assert siguiente["ts"] >= primero["ts"]


def test_chat_responde_en_streaming_y_el_texto_coincide_con_la_faq():
    with abrir(cliente()) as ws:
        recibir(ws)
        enviar(ws, type="chat", id="m1", texto="¿Cuánto cuesta la app?")
        assert recibir(ws) == {"type": "chat_inicio", "id": "m1"}
        trozos = []
        while True:
            m = recibir(ws)
            if m["type"] == "chat_fin":
                break
            assert m["type"] == "chat_delta" and m["id"] == "m1"
            trozos.append(m["texto"])
    assert len(trozos) > 3
    assert "100% gratuita" in "".join(trozos)
    assert m["fuente"] == "preguntas frecuentes"


def test_ping_pong():
    with abrir(cliente()) as ws:
        recibir(ws)
        enviar(ws, type="ping")
        assert recibir(ws)["type"] == "pong"


def test_mensajes_invalidos_dan_error_sin_cerrar_la_conexion():
    with abrir(cliente()) as ws:
        recibir(ws)
        ws.send_text("esto no es json")
        assert recibir(ws)["codigo"] == "mensaje_invalido"
        enviar(ws, type="no-existe")
        assert recibir(ws)["codigo"] == "tipo_desconocido"
        enviar(ws, type="chat", id="x y", texto="hola")
        assert recibir(ws)["codigo"] == "mensaje_invalido"
        enviar(ws, type="ping")
        assert recibir(ws)["type"] == "pong"


def test_rechaza_mensajes_demasiado_largos():
    with abrir(cliente()) as ws:
        recibir(ws)
        ws.send_text(json.dumps({"type": "chat", "id": "a", "texto": "x" * 3000}))
        assert recibir(ws)["codigo"] == "mensaje_invalido"
        enviar(ws, type="chat", id="b", texto="x" * 401)
        assert recibir(ws)["codigo"] == "mensaje_largo"


def test_limita_los_mensajes_de_chat_por_minuto():
    with abrir(cliente(chat_por_minuto=2)) as ws:
        recibir(ws)
        for i in range(2):
            enviar(ws, type="chat", id=f"m{i}", texto="hola")
            while recibir(ws)["type"] != "chat_fin":
                pass
        enviar(ws, type="chat", id="m3", texto="hola")
        assert recibir(ws)["codigo"] == "limite"


def test_limita_conexiones_por_ip():
    c = cliente(max_por_ip=1)
    with abrir(c) as primera:
        recibir(primera)
        with pytest.raises(WebSocketDisconnect) as error:
            with abrir(c):
                pass
        assert error.value.code == 1013
    with abrir(c) as de_nuevo:  # al cerrar la primera se libera el cupo
        assert recibir(de_nuevo)["type"] == "hola"


def test_cierra_por_inactividad():
    with abrir(cliente(inactividad_seg=1)) as ws:
        recibir(ws)
        with pytest.raises(WebSocketDisconnect) as error:
            ws.receive_text()
        assert error.value.code == 4001


def test_cierra_al_agotar_la_vida_maxima_para_que_el_cliente_reconecte():
    with abrir(cliente(vida_max_seg=1, inactividad_seg=30)) as ws:
        recibir(ws)
        with pytest.raises(WebSocketDisconnect) as error:
            ws.receive_text()
        assert error.value.code == 4000


def test_http_salud_aforo_y_chat_de_respaldo():
    c = cliente()
    assert c.get("/salud").json()["estado"] == "ok"
    assert c.get("/v1/aforo", params={"distrito": "Surco"}).json()["cocheras"][0]["distrito"] == "Surco"
    respuesta = c.post("/v1/chat", json={"texto": "hola"}, headers={"origin": ORIGEN})
    assert respuesta.status_code == 200 and "Quadrate pe" in respuesta.json()["respuesta"]
    assert respuesta.headers["access-control-allow-origin"] == ORIGEN
    assert respuesta.headers["x-content-type-options"] == "nosniff"


def test_http_no_da_cors_a_otros_origenes_ni_expone_documentacion():
    c = cliente()
    r = c.get("/v1/aforo", headers={"origin": "https://malo.example"})
    assert "access-control-allow-origin" not in r.headers
    assert c.get("/docs").status_code == 404 and c.get("/openapi.json").status_code == 404


def test_http_limita_el_chat():
    c = cliente(chat_por_minuto=1)
    assert c.post("/v1/chat", json={"texto": "hola"}).status_code == 200
    assert c.post("/v1/chat", json={"texto": "hola"}).status_code == 429
    assert c.post("/v1/chat", json={"texto": ""}).status_code in (422, 429)


def test_la_configuracion_se_lee_del_entorno_con_valores_seguros_por_defecto():
    cfg = cargar({"ALLOWED_ORIGINS": " https://a.test/ , https://b.test ", "MAX_POR_IP": "9", "VIDA_MAX_SEG": "x"})
    assert cfg.origenes == ("https://a.test", "https://b.test")
    assert cfg.max_por_ip == 9 and cfg.vida_max_seg == Config().vida_max_seg
    assert cargar({}).origenes == ()
