import json

import pytest
from fastapi.testclient import TestClient
from starlette.websockets import WebSocketDisconnect

from app import aforo, telemetria
from app.config import Config
from app.main import crear_app

ORIGEN = "https://quadratepe.dealforge.lat"
TIPOS = {"ingreso", "salida", "reserva_eta", "tarifa_dinamica", "aforo_critico", "conexion"}


def cliente(**cambios) -> TestClient:
    base = dict(origenes=(ORIGEN,), periodo_aforo_seg=1, inactividad_seg=30, vida_max_seg=60, pausa_simulacion_seg=0.0)
    base.update(cambios)
    return TestClient(crear_app(Config(**base)))


def abrir(c, origen=ORIGEN):
    return c.websocket_connect("/ws-telemetria", headers={"origin": origen} if origen else {})


def recibir(ws) -> dict:
    return json.loads(ws.receive_text())


def test_la_bienvenida_y_la_sincronizacion_inicial_cubren_todas_las_cocheras():
    with abrir(cliente()) as ws:
        primera = recibir(ws)
        assert primera["tipo"] == "conexion" and "simulados" in primera["mensaje"]
        assert "cocheraId" not in primera
        sync = [recibir(ws) for _ in aforo.COCHERAS]
    assert {t["cocheraId"] for t in sync} == {c["id"] for c in aforo.COCHERAS}


def test_las_tramas_cumplen_el_contrato_que_lee_la_demo():
    with abrir(cliente()) as ws:
        recibir(ws)
        for _ in aforo.COCHERAS:
            t = recibir(ws)
            assert t["tipo"] in TIPOS
            assert len(t["timestamp"]) == 8 and t["timestamp"][2] == ":" and t["timestamp"][5] == ":"
            assert t["nombreCochera"] and t["mensaje"]
            datos = t["datos"]
            assert set(datos) == {"plazasDisponibles", "plazasLibres", "porcentajeOcupacion", "estadoAforo", "tarifaHora"}
            assert datos["plazasDisponibles"] == datos["plazasLibres"]
            assert 0 <= datos["porcentajeOcupacion"] <= 100
            assert datos["estadoAforo"] in {"disponible", "medio", "critico"}


def test_los_ids_coinciden_con_el_catalogo_de_la_pagina():
    ids = {c["id"] for c in aforo.COCHERAS}
    assert ids == {"cochera-begonias", "cochera-larco", "cochera-polo", "cochera-javier-prado", "cochera-canaval", "cochera-pardo"}


def test_cambios_de_aforo_generan_ingreso_salida_y_alerta_critica():
    previas = {c["id"]: (c["plazasDisponibles"], c["estadoAforo"]) for c in aforo.listar(1_700_000_000)}
    # barre el tiempo hasta ver cada tipo de cambio
    vistos, instante = set(), 1_700_000_000
    for _ in range(400):
        instante += 5
        tramas, previas = telemetria.eventos_por_cambio(previas, instante)
        vistos |= {t["tipo"] for t in tramas}
        if {"ingreso", "salida", "aforo_critico"} <= vistos:
            break
    assert {"ingreso", "salida", "aforo_critico"} <= vistos


def test_ingreso_baja_las_plazas_y_salida_las_sube():
    previas = {c["id"]: (c["plazasDisponibles"], c["estadoAforo"]) for c in aforo.listar(1_700_000_000)}
    instante = 1_700_000_000
    for _ in range(200):
        instante += 5
        tramas, nuevas = telemetria.eventos_por_cambio(previas, instante)
        for t in tramas:
            antes = previas[t["cocheraId"]][0]
            if t["tipo"] == "ingreso":
                assert t["datos"]["plazasDisponibles"] < antes
            if t["tipo"] == "salida":
                assert t["datos"]["plazasDisponibles"] > antes
        previas = nuevas


def test_simular_evento_responde_sin_alterar_el_aforo():
    with abrir(cliente()) as ws:
        for _ in range(1 + len(aforo.COCHERAS)):
            recibir(ws)
        ws.send_text(json.dumps({"accion": "simular_evento"}))
        t = recibir(ws)
    assert t["tipo"] in TIPOS and "datos" not in t and t["nombreCochera"]
    assert "simulad" in t["mensaje"].lower()


def test_ignora_mensajes_que_no_conoce_y_sigue_vivo():
    with abrir(cliente()) as ws:
        for _ in range(1 + len(aforo.COCHERAS)):
            recibir(ws)
        for basura in ("no es json", json.dumps([1, 2]), json.dumps({"accion": "otra"}), json.dumps({"x": 1})):
            ws.send_text(basura)
        ws.send_text(json.dumps({"accion": "simular_evento"}))
        assert recibir(ws)["tipo"] in TIPOS


def test_telemetria_rechaza_origenes_no_autorizados():
    for origen in ("https://malo.example", None):
        with pytest.raises(WebSocketDisconnect) as error:
            with abrir(cliente(), origen):
                pass
        assert error.value.code == 1008


def test_presupuesto_de_tiempo_corta_a_quien_reconecta_sin_parar():
    c = cliente(presupuesto_tele_seg_hora=1)
    with abrir(c) as ws:
        recibir(ws)
        ws.close()
    c.app.state.hub.presupuesto.registrar("testclient", 5)  # la IP de TestClient consumió su hora
    with pytest.raises(WebSocketDisconnect) as error:
        with abrir(c):
            pass
    assert error.value.code == 1013


def test_cierra_por_vida_maxima_y_el_cliente_reconecta_solo():
    with abrir(cliente(vida_tele_seg=1)) as ws:
        with pytest.raises(WebSocketDisconnect) as error:
            while True:
                ws.receive_text()
        assert error.value.code == 4000


def test_el_chat_y_la_telemetria_comparten_limite_de_conexiones_por_ip():
    c = cliente(max_por_ip=1)
    with abrir(c) as tele:
        recibir(tele)
        with pytest.raises(WebSocketDisconnect) as error:
            with c.websocket_connect("/ws", headers={"origin": ORIGEN}):
                pass
        assert error.value.code == 1013


def test_las_conexiones_se_liberan_al_cerrar_en_ambos_protocolos():
    c = cliente()
    hub = c.app.state.hub
    with abrir(c) as tele:
        recibir(tele)
        with c.websocket_connect("/ws", headers={"origin": ORIGEN}) as chat:
            chat.receive_text()
            assert hub.conexiones.total == 2
    assert hub.conexiones.total == 0 and not hub.clientes and not hub.telemetria


def test_la_telemetria_vive_menos_que_el_chat():
    from app.config import Config as C
    assert C().vida_tele_seg < C().vida_max_seg


def test_las_tramas_de_sincronizacion_no_generan_alerta_pero_si_parpadeo_de_tarjeta():
    tramas, _ = telemetria.eventos_por_cambio(None, 1_700_000_000)
    assert len(tramas) == len(aforo.COCHERAS)
    assert all("titulo" not in t and t["cocheraId"] and t["distrito"] for t in tramas)


def test_solo_un_evento_por_ciclo_lleva_titulo_para_no_inundar_de_alertas():
    previas = {c["id"]: (c["plazasDisponibles"], c["estadoAforo"]) for c in aforo.listar(1_700_000_000)}
    instante, con_titulo = 1_700_000_000, 0
    for _ in range(300):
        instante += 5
        tramas, previas = telemetria.eventos_por_cambio(previas, instante)
        titulados = [t for t in tramas if "titulo" in t]
        assert len(titulados) <= 1
        for t in titulados:
            assert t["titulo"] == telemetria.TITULOS[t["tipo"]] and t["mensaje"]
        con_titulo += len(titulados)
    assert con_titulo > 20


def test_la_alerta_prioriza_el_aforo_critico():
    previas = {c["id"]: (c["plazasDisponibles"], c["estadoAforo"]) for c in aforo.listar(1_700_000_000)}
    instante = 1_700_000_000
    for _ in range(600):
        instante += 5
        tramas, previas = telemetria.eventos_por_cambio(previas, instante)
        if any(t["tipo"] == "aforo_critico" for t in tramas):
            assert next(t for t in tramas if "titulo" in t)["tipo"] == "aforo_critico"
            return
    raise AssertionError("no apareció ningún aforo crítico en el barrido")


def test_simular_evento_trae_lo_que_la_demo_necesita_para_la_alerta_y_el_parpadeo():
    t = telemetria.evento_simulado(1_700_000_000)
    assert t["titulo"] == telemetria.TITULOS[t["tipo"]] and t["mensaje"] and t["cocheraId"] and t["distrito"]
    assert "datos" not in t
