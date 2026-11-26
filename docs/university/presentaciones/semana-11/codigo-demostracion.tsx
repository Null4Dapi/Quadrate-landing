/**
 * QUADRATE PE — SEMANA 11: CÓDIGO ARTICULADOR DE SUSTENTACIÓN
 * Separación de Server State (TanStack Query) y Client State (Zustand) + WebSockets
 *
 * Archivo unificado de demostración en vivo preparado para proyectar en VS Code.
 * Cada bloque está claramente rotulado por integrante con sus líneas de exposición.
 */

import React, { useEffect } from "react";
import { useQuery, queryClient } from "../vendor/tanstack-query.js";
import { create } from "../vendor/zustand.js";

// ============================================================================
// BLOQUE 1: LUCIANA — CONTRATOS FORMALES Y MODELOS DE DATOS (0:00 - 1:30)
// ============================================================================

export interface Cochera {
  readonly id: number;
  readonly nombre: string;
  readonly distrito: "San Isidro" | "Miraflores" | "Surco" | "San Borja";
  readonly direccion: string;
  readonly tarifaHora: number;
  readonly plazasTotales: number;
  readonly plazasLibres: number;
  readonly porcentajeOcupacion: number;
  readonly estadoAforo: "disponible" | "fluido" | "reservado" | "promocion" | "critico";
  readonly imagen: string;
  readonly permiteReservaEta: boolean;
}

export interface RespuestaCatalogoPaginado {
  readonly datos: readonly Cochera[];
  readonly totalRegistros: number;
  readonly paginaActual: number;
  readonly totalPaginas: number;
  readonly tieneSiguiente: boolean;
  readonly tieneAnterior: boolean;
}

export interface ToastNotificacion {
  readonly id: string;
  readonly tipo: "ingreso" | "salida" | "reserva_eta" | "tarifa_dinamica" | "aforo_critico";
  readonly titulo: string;
  readonly mensaje: string;
  readonly distrito: string;
  readonly timestamp: string;
}

export interface AppStoreState {
  readonly tema: "claro" | "oscuro";
  readonly distritoPreferido: string;
  readonly modoVista: "cuadricula" | "lista";
  readonly notificaciones: readonly ToastNotificacion[];
  readonly alternarTema: () => void;
  readonly establecerDistritoPreferido: (distrito: string) => void;
  readonly alternarModoVista: () => void;
  readonly agregarNotificacion: (item: Omit<ToastNotificacion, "id" | "timestamp">) => void;
  readonly descartarNotificacion: (id: string) => void;
}

// ============================================================================
// BLOQUE 2: DIEGO — SERVER STATE CON TANSTACK QUERY Y PAGINACIÓN (1:30 - 3:05)
// ============================================================================

export async function obtenerCocherasRemotas({ distrito = "Todos", pagina = 1, limitePorPagina = 4 } = {}) {
  await new Promise((resolve) => setTimeout(resolve, 250)); // Simulación de latencia de red
  const res = await fetch(`/api/cocheras?distrito=${distrito}&page=${pagina}&limit=${limitePorPagina}`);
  if (!res.ok) throw new Error("Fallo al obtener cocheras");
  return res.json();
}

export function useCocherasQuery({ distrito = "Todos", pagina = 1, limitePorPagina = 4 } = {}) {
  return useQuery({
    // 1. Clave compuesta serializada determinísticamente
    queryKey: ["cocheras", { distrito, pagina, limitePorPagina }],
    // 2. Función asíncrona de consulta
    queryFn: () => obtenerCocherasRemotas({ distrito, pagina, limitePorPagina }),
    // 3. Frescura de 60 segundos antes de considerar obsoleta la caché
    staleTime: 60 * 1000,
    // 4. Paginación sin parpadeos: retiene los datos anteriores mientras resuelve
    keepPreviousData: true,
  });
}

// ============================================================================
// BLOQUE 3: VÍLCHEZ — CLIENT STATE CON ZUSTAND Y ATOMICIDAD (3:05 - 4:40)
// ============================================================================

export const useAppStore = create((set, get) => ({
  // Estado inicial con hidratación segura desde localStorage
  tema: typeof window !== "undefined" ? localStorage.getItem("quadrate_tema") || "claro" : "claro",
  distritoPreferido: "Todos",
  modoVista: "cuadricula",
  notificaciones: [],

  alternarTema: () => {
    const nuevoTema = get().tema === "claro" ? "oscuro" : "claro";
    try {
      localStorage.setItem("quadrate_tema", nuevoTema);
    } catch {}
    set({ tema: nuevoTema });
  },

  establecerDistritoPreferido: (distrito: string) => set({ distritoPreferido: distrito }),

  alternarModoVista: () =>
    set((state: any) => ({
      modoVista: state.modoVista === "cuadricula" ? "lista" : "cuadricula",
    })),

  agregarNotificacion: (item: any) => {
    const id = `toast-${Date.now()}`;
    const timestamp = new Date().toLocaleTimeString("es-PE", { hour12: false });
    const nuevaAlerta = { ...item, id, timestamp };

    set((state: any) => ({
      notificaciones: [nuevaAlerta, ...state.notificaciones.slice(0, 3)],
    }));

    setTimeout(() => get().descartarNotificacion(id), 5000);
  },

  descartarNotificacion: (id: string) =>
    set((state: any) => ({
      notificaciones: state.notificaciones.filter((n: any) => n.id !== id),
    })),
}));

// ============================================================================
// BLOQUE 4: CUEVA — DESACOPLAMIENTO DE RED Y SYNC EN TIEMPO REAL (4:40 - 6:20)
// ============================================================================

export const ES_PRODUCCION =
  typeof window !== "undefined" &&
  window.location.hostname !== "localhost" &&
  window.location.hostname !== "127.0.0.1";

export const URL_WEBSOCKET = ES_PRODUCCION
  ? "wss://quadrate-live-365843518799.southamerica-west1.run.app/ws"
  : "ws://localhost:3000/ws-telemetria";

export function iniciarTelemetriaWS() {
  const ws = new WebSocket(URL_WEBSOCKET);

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);

      // A: Inyección de Toast en Zustand (Client State)
      useAppStore.getState().agregarNotificacion({
        tipo: data.tipo || "aforo_critico",
        titulo: data.nombreCochera || "Garita Quadrate Live",
        mensaje: data.mensaje || "Evento operativo detectado.",
        distrito: data.distrito || "Lima",
      });

      // B: Invalidación de caché en TanStack Query (Server State)
      if (data.afectaAforo || data.tipo === "ingreso" || data.tipo === "salida") {
        queryClient.invalidateQueries(["cocheras"]);
      }
    } catch (e) {
      console.warn("Error parseando evento WS:", e);
    }
  };

  return ws;
}

// ============================================================================
// BLOQUE 5: VÍCTOR / MANUEL — REACT UI, ACCESIBILIDAD Y CIERRE (6:20 - 8:00)
// ============================================================================

export function ToastContainerLive() {
  // Suscripción atómica: solo re-renderiza cuando cambian las notificaciones
  const notificaciones = useAppStore((state: any) => state.notificaciones);
  const descartarNotificacion = useAppStore((state: any) => state.descartarNotificacion);

  if (notificaciones.length === 0) return null;

  return (
    <aside
      aria-label="Alertas operativas en tiempo real"
      aria-live="polite"
      aria-atomic="true"
      className="quadrate-live__toasts-container"
    >
      {notificaciones.map((toast: any) => (
        <article key={toast.id} role="status" className={`quadrate-live__toast quadrate-live__toast--${toast.tipo}`}>
          <span className="quadrate-live__toast-icono" aria-hidden="true">🔔</span>
          <div className="quadrate-live__toast-cuerpo">
            <strong>{toast.titulo}</strong>
            <p>{toast.mensaje}</p>
          </div>
          <button
            type="button"
            onClick={() => descartarNotificacion(toast.id)}
            aria-label={`Descartar alerta de ${toast.titulo}`}
            className="quadrate-live__toast-cerrar"
          >
            ×
          </button>
        </article>
      ))}
    </aside>
  );
}
