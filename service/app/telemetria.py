"""Tramas de telemetría con el formato que ya espera la demo de Quadrate pe (demo.html -> /ws-telemetria).

Cliente -> servidor: {"accion": "simular_evento"}
Servidor -> cliente: {"tipo", "timestamp", "nombreCochera", "mensaje", "cocheraId", "datos": {...}}
tipo: ingreso | salida | reserva_eta | tarifa_dinamica | aforo_critico | conexion
TODO es de demostración y los mensajes lo dicen cuando no se desprende del contexto.
"""
import zlib
from datetime import datetime, timedelta, timezone

from . import aforo

LIMA = timezone(timedelta(hours=-5))  # Lima no tiene horario de verano


def hora_lima(ahora: float) -> str:
    return datetime.fromtimestamp(ahora, LIMA).strftime("%H:%M:%S")


def trama(tipo: str, cochera: dict | None, mensaje: str, ahora: float, con_datos: bool = True) -> dict:
    salida = {"tipo": tipo, "timestamp": hora_lima(ahora), "mensaje": mensaje}
    if cochera is None:
        return salida
    salida["nombreCochera"] = cochera["nombre"]
    salida["cocheraId"] = cochera["id"]
    if con_datos:
        total, libres = cochera["plazasTotales"], cochera["plazasDisponibles"]
        salida["datos"] = {
            "plazasDisponibles": libres,
            "plazasLibres": libres,
            "porcentajeOcupacion": round((total - libres) / total * 100),
            "estadoAforo": cochera["estadoAforo"],
            "tarifaHora": cochera["tarifaHora"],
        }
    return salida


def bienvenida(ahora: float) -> dict:
    return trama("conexion", None, "Enlace de demostración activo: los datos de aforo son simulados.", ahora)


def eventos_por_cambio(previas: dict[str, tuple[int, str]] | None, ahora: float) -> tuple[list[dict], dict[str, tuple[int, str]]]:
    """Compara con lo último enviado y devuelve las tramas nuevas. La primera vez sincroniza todo el aforo."""
    tramas: list[dict] = []
    actuales: dict[str, tuple[int, str]] = {}
    for c in aforo.listar(ahora):
        libres, estado = c["plazasDisponibles"], c["estadoAforo"]
        actuales[c["id"]] = (libres, estado)
        anterior = (previas or {}).get(c["id"])
        total = c["plazasTotales"]
        if previas is None or anterior is None:
            tramas.append(trama("conexion", c, f"Aforo sincronizado: {libres} de {total} plazas libres.", ahora))
            continue
        if libres < anterior[0]:
            tramas.append(trama("ingreso", c, f"Ingreso registrado en garita. Plazas libres: {libres} de {total}.", ahora))
        elif libres > anterior[0]:
            tramas.append(trama("salida", c, f"Salida registrada en garita. Plazas libres: {libres} de {total}.", ahora))
        if estado == "critico" and anterior[1] != "critico":
            tramas.append(trama("aforo_critico", c, f"Aforo crítico: quedan {libres} plazas libres.", ahora))
    return tramas, actuales


def evento_simulado(ahora: float) -> dict:
    """Evento de muestra para el botón «simular»: determinista por segundo, sin tocar el aforo."""
    semilla = zlib.crc32(str(int(ahora)).encode())
    cochera = aforo.COCHERAS[semilla % len(aforo.COCHERAS)]
    tipo = ("reserva_eta", "tarifa_dinamica", "ingreso", "salida")[(semilla >> 3) % 4]
    base = {"nombre": cochera["nombre"], "id": cochera["id"]}
    textos = {
        "reserva_eta": f"Reserva ETA simulada: un conductor llega en ~{cochera['etaMinutos']} min.",
        "tarifa_dinamica": f"Franja valle simulada: S/ {cochera['tarifaHora']:.2f} la hora.",
        "ingreso": "Ingreso simulado en garita.",
        "salida": "Salida simulada en garita.",
    }
    return trama(tipo, base, textos[tipo], ahora, con_datos=False)
