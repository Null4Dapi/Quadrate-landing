"""Disponibilidad simulada de cocheras (DATOS DE DEMOSTRACIÓN), determinista en el tiempo.

El valor depende solo del instante, así que todas las instancias de Cloud Run calculan lo mismo sin compartir
estado ni usar una base de datos. Catálogo portado de datos-cocheras.js de la página de Quadrate pe.
"""
import math
import zlib

PERIODO_SEG = 5

DISTRITOS = ("San Isidro", "Miraflores", "Surco", "San Borja")

# plazasBase es el valor de referencia del catálogo; la simulación oscila alrededor de él.
COCHERAS = (
    {"id": "cochera-begonias", "nombre": "Playa Las Begonias Central", "distrito": "San Isidro",
     "direccion": "Calle Las Begonias 441", "tarifaHora": 8.0, "tarifaFraccion": 2.0,
     "plazasTotales": 60, "plazasBase": 14, "etaMinutos": 8, "calificacion": 4.8, "distanciaKm": 1.2},
    {"id": "cochera-larco", "nombre": "Estacionamiento Larco Miraflores", "distrito": "Miraflores",
     "direccion": "Av. José Larco 780", "tarifaHora": 7.5, "tarifaFraccion": 1.88,
     "plazasTotales": 45, "plazasBase": 4, "etaMinutos": 12, "calificacion": 4.6, "distanciaKm": 2.5},
    {"id": "cochera-polo", "nombre": "Cochera Polo Hunt", "distrito": "Surco",
     "direccion": "Av. La Encalada 1120", "tarifaHora": 6.0, "tarifaFraccion": 1.5,
     "plazasTotales": 35, "plazasBase": 18, "etaMinutos": 15, "calificacion": 4.9, "distanciaKm": 3.8},
    {"id": "cochera-javier-prado", "nombre": "Playas Javier Prado Express", "distrito": "San Borja",
     "direccion": "Av. Javier Prado Este 2450", "tarifaHora": 6.5, "tarifaFraccion": 1.63,
     "plazasTotales": 50, "plazasBase": 9, "etaMinutos": 10, "calificacion": 4.7, "distanciaKm": 2.1},
    {"id": "cochera-canaval", "nombre": "Estacionamiento Canaval y Moreyra", "distrito": "San Isidro",
     "direccion": "Av. Canaval y Moreyra 390", "tarifaHora": 9.0, "tarifaFraccion": 2.25,
     "plazasTotales": 70, "plazasBase": 22, "etaMinutos": 6, "calificacion": 4.9, "distanciaKm": 0.9},
    {"id": "cochera-pardo", "nombre": "Cochera Parque Kennedy Pardo", "distrito": "Miraflores",
     "direccion": "Av. José Pardo 230", "tarifaHora": 8.0, "tarifaFraccion": 2.0,
     "plazasTotales": 40, "plazasBase": 2, "etaMinutos": 14, "calificacion": 4.5, "distanciaKm": 2.8},
)


def _crc(texto: str) -> int:
    return zlib.crc32(texto.encode("utf-8"))


def plazas_disponibles(cochera: dict, ahora: float) -> int:
    cubeta = int(ahora // PERIODO_SEG)
    periodo = 300 + _crc(cochera["id"]) % 180                    # onda lenta de 5 a 8 minutos
    fase = (_crc(cochera["id"][::-1]) % 628) / 100
    amplitud = max(2, round(cochera["plazasTotales"] * 0.2))
    onda = math.sin(2 * math.pi * (cubeta * PERIODO_SEG) / periodo + fase)
    ruido = _crc(f"{cochera['id']}:{cubeta}") % 3 - 1             # -1, 0 o +1 por cada cubeta
    valor = cochera["plazasBase"] + round(onda * amplitud) + ruido
    return max(0, min(cochera["plazasTotales"], valor))


def estado_aforo(disponibles: int, totales: int) -> str:
    libre = disponibles / totales if totales else 0
    if libre <= 0.10:
        return "critico"
    if libre < 0.20:
        return "medio"
    return "disponible"


def _normalizar_distrito(distrito: str | None) -> str | None:
    if not distrito or distrito.strip().lower() == "todos":
        return None
    return distrito.strip().lower()


def listar(ahora: float, distrito: str | None = None) -> list[dict]:
    filtro = _normalizar_distrito(distrito)
    salida = []
    for c in COCHERAS:
        if filtro and c["distrito"].lower() != filtro:
            continue
        disponibles = plazas_disponibles(c, ahora)
        fila = {k: v for k, v in c.items() if k != "plazasBase"}
        fila["plazasDisponibles"] = disponibles
        fila["estadoAforo"] = estado_aforo(disponibles, c["plazasTotales"])
        salida.append(fila)
    return salida


def instantanea(ahora: float, distrito: str | None = None) -> dict:
    """Mensaje que se envía por el WebSocket y por HTTP."""
    return {
        "type": "aforo",
        "ts": int(ahora),
        "demostracion": True,
        "distrito": distrito or "todos",
        "cocheras": listar(ahora, distrito),
    }


def firma(instantanea_: dict) -> tuple:
    """Huella para difundir solo cuando algo cambió."""
    return tuple((c["id"], c["plazasDisponibles"]) for c in instantanea_["cocheras"])
