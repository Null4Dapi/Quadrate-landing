"""Límites de uso en memoria, por instancia (Cloud Run corre con pocas instancias)."""
import time
from collections import deque

MAX_CLIENTES_RASTREADOS = 5000


class LimitadorVentana:
    """Ventana deslizante de 60 s por cliente."""

    def __init__(self, limite_por_minuto: int) -> None:
        self.limite = limite_por_minuto
        self._eventos: dict[str, deque[float]] = {}

    def permitir(self, cliente: str) -> bool:
        ahora = time.monotonic()
        if len(self._eventos) > MAX_CLIENTES_RASTREADOS:
            self._eventos.clear()
        cola = self._eventos.setdefault(cliente, deque())
        while cola and ahora - cola[0] > 60:
            cola.popleft()
        if len(cola) >= self.limite:
            return False
        cola.append(ahora)
        return True


class TopeDiario:
    """Contador por día (UTC) para acotar el trabajo del chat."""

    def __init__(self, limite: int) -> None:
        self.limite = limite
        self._dia = ""
        self._usado = 0

    def consumir(self) -> bool:
        dia = time.strftime("%Y-%m-%d", time.gmtime())
        if dia != self._dia:
            self._dia, self._usado = dia, 0
        if self._usado >= self.limite:
            return False
        self._usado += 1
        return True


class ContadorConexiones:
    """Conexiones abiertas en total y por IP."""

    def __init__(self, maximo_total: int, maximo_por_ip: int) -> None:
        self.maximo_total = maximo_total
        self.maximo_por_ip = maximo_por_ip
        self._por_ip: dict[str, int] = {}
        self.total = 0

    def admitir(self, ip: str) -> bool:
        if self.total >= self.maximo_total or self._por_ip.get(ip, 0) >= self.maximo_por_ip:
            return False
        self._por_ip[ip] = self._por_ip.get(ip, 0) + 1
        self.total += 1
        return True

    def liberar(self, ip: str) -> None:
        restantes = self._por_ip.get(ip, 0) - 1
        if restantes <= 0:
            self._por_ip.pop(ip, None)
        else:
            self._por_ip[ip] = restantes
        self.total = max(0, self.total - 1)


class PresupuestoTiempo:
    """Segundos de enlace en vivo por IP y por hora. La demo de Quadrate reconecta sola cada 4 s, así que
    sin un tope una pestaña olvidada mantendría una instancia de Cloud Run encendida todo el día."""

    def __init__(self, segundos_por_hora: int) -> None:
        self.limite = segundos_por_hora
        self._usado: dict[tuple[str, int], float] = {}

    @staticmethod
    def _clave(ip: str) -> tuple[str, int]:
        return ip, int(time.time() // 3600)

    def disponible(self, ip: str) -> bool:
        return self._usado.get(self._clave(ip), 0.0) < self.limite

    def registrar(self, ip: str, segundos: float) -> None:
        if len(self._usado) > MAX_CLIENTES_RASTREADOS:
            hora = int(time.time() // 3600)
            self._usado = {k: v for k, v in self._usado.items() if k[1] == hora}
        clave = self._clave(ip)
        self._usado[clave] = self._usado.get(clave, 0.0) + segundos
