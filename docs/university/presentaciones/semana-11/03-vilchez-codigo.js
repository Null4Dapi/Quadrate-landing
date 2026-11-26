/**
 * QUADRATE PE — SEMANA 11: CÓDIGO INDIVIDUAL
 * Integrante: VÍLCHEZ (3:05 - 4:40)
 * Tema: Estado Global de Cliente con Zustand, Atomicidad sin Providers y Persistencia Local
 * Archivo a proyectar en pantalla durante su intervención.
 */

import { create } from "../vendor/zustand.js";

// Inicializador seguro de tema desde el almacenamiento local del navegador
const TEMA_INICIAL = (() => {
  try {
    return localStorage.getItem("quadrate_tema") || "claro";
  } catch {
    return "claro";
  }
})();

/**
 * Store global atómico del cliente para la consola Quadrate Live.
 * Cero envoltorios `<Provider>` y cero re-renderizados accidentales.
 */
export const useAppStore = create((set, get) => ({
  // 1. ESTADO REACTIVO DEL CLIENTE (UI)
  tema: TEMA_INICIAL,
  distritoPreferido: "Todos",
  modoVista: "cuadricula", // "cuadricula" | "lista"
  notificaciones: [],

  // 2. ACCIONES PURAS (MUTADORES INMUTABLES)
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
    const nuevaAlerta = { ...item, id, timestamp };

    // Encola manteniendo un máximo de 4 notificaciones en pantalla
    set((state) => ({
      notificaciones: [nuevaAlerta, ...state.notificaciones.slice(0, 3)],
    }));

    // Auto-cierre asíncrono seguro a los 5 segundos
    setTimeout(() => {
      get().descartarNotificacion(id);
    }, item.tiempoExpiracionMs ?? 5000);
  },

  descartarNotificacion: (id) => {
    set((state) => ({
      notificaciones: state.notificaciones.filter((n) => n.id !== id),
    }));
  },
}));
