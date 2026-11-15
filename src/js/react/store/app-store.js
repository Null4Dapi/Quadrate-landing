/**
 * Quadrate pe — Store Global Atómico con Zustand
 * Gestiona el estado de cliente (tema, preferencias de visualización y alertas de telemetría).
 */
import { create } from "../vendor/zustand.js";

const TEMA_INICIAL = (() => {
  try {
    return localStorage.getItem("quadrate_tema") || "claro";
  } catch {
    return "claro";
  }
})();

export const useAppStore = create((set, get) => ({
  // Estado de Tema y Preferencias
  tema: TEMA_INICIAL,
  distritoPreferido: "Todos",
  modoVista: "cuadricula", // "cuadricula" | "lista"

  // Estado de Notificaciones en Tiempo Real (Toasts)
  notificaciones: [],

  // Acciones (Actions)
  alternarTema: () => {
    const nuevoTema = get().tema === "claro" ? "oscuro" : "claro";
    try {
      localStorage.setItem("quadrate_tema", nuevoTema);
    } catch {}
    set({ tema: nuevoTema });
  },

  establecerDistritoPreferido: (distrito) => {
    set({ distritoPreferido: distrito });
  },

  alternarModoVista: () => {
    set((state) => ({
      modoVista: state.modoVista === "cuadricula" ? "lista" : "cuadricula",
    }));
  },

  agregarNotificacion: (item) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const timestamp = new Date().toLocaleTimeString("es-PE", { hour12: false });
    const nuevaNotificacion = { ...item, id, timestamp };

    set((state) => ({
      notificaciones: [nuevaNotificacion, ...state.notificaciones.slice(0, 4)],
    }));

    // Auto-cierre de la alerta a los 5 segundos
    const tiempo = item.tiempoExpiracionMs ?? 5000;
    setTimeout(() => {
      get().descartarNotificacion(id);
    }, tiempo);
  },

  descartarNotificacion: (id) => {
    set((state) => ({
      notificaciones: state.notificaciones.filter((n) => n.id !== id),
    }));
  },

  limpiarNotificaciones: () => {
    set({ notificaciones: [] });
  },
}));
