/**
 * QUADRATE PE — SEMANA 11: CÓDIGO INDIVIDUAL
 * Integrante: CUEVA (4:40 - 6:20)
 * Tema: Desacoplamiento de Red por Entorno y Sincronización Reactiva (WS + Zustand + React Query)
 * Archivo a proyectar en pantalla durante su intervención.
 */

import { useAppStore } from "../store/app-store.js";
import { queryClient } from "../queries/use-cocheras-query.js";

// 1. DESACOPLAMIENTO DE RED: Cero dependencias de Cloud Run durante desarrollo local
export const ES_PRODUCCION =
  typeof window !== "undefined" &&
  window.location.hostname !== "localhost" &&
  window.location.hostname !== "127.0.0.1";

export const URL_WEBSOCKET = ES_PRODUCCION
  ? "wss://quadrate-live-365843518799.southamerica-west1.run.app/ws"
  : `${window.location.protocol === "https:" ? "wss:" : "ws:"}//${window.location.host}/ws-telemetria`;

/**
 * 2. Orquestador de Sincronización en Tiempo Real
 */
export function configurarCanalTelemetria({ alCambiarEstado } = {}) {
  const socket = new WebSocket(URL_WEBSOCKET);

  socket.onopen = () => {
    alCambiarEstado?.("conectado");
  };

  socket.onmessage = (evento) => {
    try {
      const payload = JSON.parse(evento.data);

      // INYECCIÓN A: Estado de Cliente (Zustand) para desplegar el Toast ambiental
      useAppStore.getState().agregarNotificacion({
        tipo: payload.tipo || "aforo_critico",
        titulo: payload.nombreCochera || "Garita Quadrate Live",
        mensaje: payload.mensaje || "Actualización de telemetría vehicular recibida.",
        distrito: payload.distrito || "Lima",
      });

      // INYECCIÓN B: Invalidación de Caché en Estado de Servidor (TanStack Query)
      // Si el evento altera aforo, disponibilidad o tarifa, refresca la query en background
      if (payload.afectaAforo || payload.tipo === "ingreso" || payload.tipo === "salida") {
        queryClient.invalidateQueries(["cocheras"]);
      }
    } catch (error) {
      console.warn("[WS Telemetría] Formato de paquete inválido:", error);
    }
  };

  socket.onclose = () => {
    alCambiarEstado?.("desconectado");
  };

  return socket;
}
