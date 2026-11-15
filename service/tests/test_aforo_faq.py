from app import aforo, faq


def test_la_simulacion_es_determinista_y_esta_acotada():
    for t in (0, 1_700_000_000, 1_700_000_017.5, 1_800_000_000):
        a, b = aforo.listar(t), aforo.listar(t)
        assert a == b
        for c in a:
            assert 0 <= c["plazasDisponibles"] <= c["plazasTotales"]
            assert c["estadoAforo"] in {"disponible", "medio", "critico"}


def test_la_disponibilidad_cambia_con_el_tiempo():
    instantes = [1_700_000_000 + i * 5 for i in range(120)]
    firmas = {aforo.firma(aforo.instantanea(t)) for t in instantes}
    assert len(firmas) > 10


def test_filtra_por_distrito_sin_distinguir_mayusculas():
    miraflores = aforo.listar(1_700_000_000, "miraflores")
    assert {c["distrito"] for c in miraflores} == {"Miraflores"}
    assert len(aforo.listar(1_700_000_000, "todos")) == len(aforo.COCHERAS)
    assert aforo.listar(1_700_000_000, "Narnia") == []


def test_estados_segun_porcentaje_libre():
    assert aforo.estado_aforo(2, 40) == "critico"
    assert aforo.estado_aforo(9, 50) == "medio"
    assert aforo.estado_aforo(14, 60) == "disponible"


def test_la_instantanea_se_declara_demostracion():
    assert aforo.instantanea(1_700_000_000)["demostracion"] is True


def test_faq_responde_lo_que_publica_la_pagina():
    casos = {
        "¿Cuánto cuesta la app?": "100% gratuita",
        "como funciona la reserva": "Voy hacia allá",
        "Tiene QR para entrar?": "QR y un PIN",
        "quiero afiliar mi cochera": "Afiliar cochera",
        "¿Dónde está el piloto?": "San Isidro y Miraflores",
        "tengo un correo de contacto?": faq.CONTACTO,
        "hola": "Quadrate pe conecta",
    }
    for pregunta, esperado in casos.items():
        assert esperado in faq.responder(pregunta, 1_700_000_000), pregunta


def test_faq_disponibilidad_usa_datos_de_demostracion_y_lo_dice():
    r = faq.responder("¿Hay lugar en Miraflores?", 1_700_000_000)
    assert "Datos de demostración" in r and "no disponibilidad real" in r
    assert "Larco" in r and "Canaval" not in r


def test_faq_no_inventa_fuera_de_tema():
    for pregunta in ("cual es la capital de francia", "dame una receta de ceviche", "quien gano el mundial", "   "):
        assert faq.responder(pregunta, 1_700_000_000) == faq.DESCONOCIDA


def test_faq_no_afirma_plazos_ni_cifras_que_la_pagina_no_publica():
    textos = " ".join(faq.responder(p, 1_700_000_000) for p in (
        "afiliar cochera", "piloto", "gratis", "reserva", "qr", "contacto", "hola"))
    assert "24 horas" not in textos
    assert "suscripción" not in textos.lower()
