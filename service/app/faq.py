"""Respuestas del asistente: preguntas frecuentes locales, sin IA ni servicios externos.

Cada afirmación debe estar publicada en la página de Quadrate pe (repo Null4Dapi/Quadrate-landing).
La disponibilidad de cocheras se calcula con datos de DEMOSTRACIÓN y así se dice siempre.
"""
import re
import unicodedata

from . import aforo

CONTACTO = "contacto@quadrate.pe"

SUGERENCIAS = (
    "¿Hay lugar en Miraflores?",
    "¿Cuánto cuesta la app?",
    "¿Cómo funciona la reserva?",
    "¿Cómo afilio mi cochera?",
)

DESCONOCIDA = f"Solo puedo ayudarte con información de Quadrate pe. Para otras consultas escríbenos a {CONTACTO}."

_ESTADO_TEXTO = {"disponible": "con lugares", "medio": "con pocos lugares", "critico": "casi llena"}


def normalizar(texto: str) -> str:
    descompuesto = unicodedata.normalize("NFD", texto.lower())
    sin_tildes = "".join(c for c in descompuesto if not unicodedata.combining(c))
    return re.sub(r"[^a-z0-9]+", " ", sin_tildes).strip()


def _coincide(token: str, raiz: str) -> bool:
    return token == raiz or (len(raiz) >= 4 and token.startswith(raiz))


def _puntaje(tokens: list[str], raices: tuple[str, ...]) -> int:
    return sum(1 for raiz in raices if any(_coincide(t, raiz) for t in tokens))


def _distrito_mencionado(texto_norm: str) -> str | None:
    for distrito in aforo.DISTRITOS:
        if normalizar(distrito) in texto_norm:
            return distrito
    return None


def _respuesta_disponibilidad(texto_norm: str, ahora: float) -> str:
    distrito = _distrito_mencionado(texto_norm)
    filas = sorted(aforo.listar(ahora, distrito), key=lambda c: c["plazasDisponibles"], reverse=True)
    ambito = f"en {distrito}" if distrito else "en las cocheras del piloto"
    if not filas:
        return f"No tengo cocheras {ambito}."
    lineas = [
        f"{c['nombre']}: {c['plazasDisponibles']} de {c['plazasTotales']} plazas libres "
        f"({'llena' if c['plazasDisponibles'] == 0 else _ESTADO_TEXTO[c['estadoAforo']]})"
        for c in filas[:4]
    ]
    return (f"Datos de demostración ahora mismo {ambito}: " + "; ".join(lineas)
            + ". Son datos simulados, no disponibilidad real.")


def _texto(valor: str):
    return lambda _texto_norm, _ahora: valor


# (identificador, raíces, respuesta). El orden desempata: gana la primera con mayor puntaje.
_INTENCIONES = (
    ("gratis", ("gratis", "gratuit", "costo", "cuesta", "cuanto", "precio", "pagar", "cobr", "tarifa", "plata"),
     _texto("La app es 100% gratuita para el conductor. Solo pagas la tarifa de la playa: la primera hora es una "
            "tarifa plana y después se cobra por fracciones de 15 minutos, así pagas el tiempo real.")),
    ("reserva", ("reserv", "eta", "apart", "asegur", "voy", "llegada"),
     _texto("Con la reserva dinámica por ETA, al tocar «Voy hacia allá» tu espacio queda apartado durante los "
            "últimos 15 minutos de tu trayecto.")),
    ("acceso", ("qr", "pin", "ingres", "garita", "entrar", "salir", "salida", "codigo"),
     _texto("Entras y sales con un código QR y un PIN alfanumérico; el acceso y la salida de garita toman "
            "menos de 3 segundos.")),
    ("afiliar", ("afili", "caseta", "hardware", "administro", "propietar", "dueno"),
     _texto("Para afiliar tu cochera usa la pestaña «Afiliar cochera». Se opera desde un celular o tableta, sin "
            f"hardware costoso, con check-in y check-out en menos de 3 segundos. Dudas: {CONTACTO}.")),
    ("piloto", ("piloto", "espera", "registr", "unirme", "convocatoria", "inscrib"),
     _texto("Estamos en una fase piloto en San Isidro y Miraflores y se seleccionan los primeros 100 conductores "
            "y 10 playas aliadas. Puedes dejar tus datos en el formulario de la convocatoria piloto.")),
    ("distritos", ("distrit", "donde", "zona", "ubica", "cobertura", "lima"),
     _texto("El piloto es en San Isidro y Miraflores. En la demostración también aparecen cocheras de Surco y "
            "San Borja.")),
    ("contacto", ("contacto", "contactar", "correo", "escribir", "email", "soporte", "hablar"),
     _texto(f"Puedes escribirnos a {CONTACTO}.")),
    ("disponibilidad", ("dispon", "libre", "lugar", "espacio", "plaza", "cupo", "quedan", "sitio", "aforo", "lleno"),
     _respuesta_disponibilidad),
    ("saludo", ("hola", "buenas", "buenos", "quadrate", "ayuda", "hey"),
     _texto("¡Hola! Quadrate pe conecta conductores con playas de estacionamiento independientes en Lima: tarifas "
            "transparentes, disponibilidad en vivo y reserva por ETA. ¿Qué te gustaría saber?")),
    ("gracias", ("gracias", "genial", "perfecto", "listo"),
     _texto("¡Con gusto! Si necesitas algo más sobre Quadrate pe, aquí estoy.")),
)


def responder(texto: str, ahora: float) -> str:
    texto_norm = normalizar(texto)
    tokens = texto_norm.split()
    if not tokens:
        return DESCONOCIDA
    mejor_puntaje, mejor = 0, None
    for _id, raices, respuesta in _INTENCIONES:
        puntaje = _puntaje(tokens, raices)
        if _id == "disponibilidad" and puntaje and _distrito_mencionado(texto_norm):
            puntaje += 1
        if puntaje > mejor_puntaje:
            mejor_puntaje, mejor = puntaje, respuesta
    return mejor(texto_norm, ahora) if mejor else DESCONOCIDA
