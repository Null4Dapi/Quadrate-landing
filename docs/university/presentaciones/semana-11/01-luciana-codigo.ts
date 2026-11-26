/**
 * QUADRATE PE — SEMANA 11: CÓDIGO INDIVIDUAL
 * Integrante: LUCIANA (0:00 - 1:30)
 * Tema: Diagnóstico de Arquitectura, Server State vs Client State y Contratos TypeScript
 * Archivo a proyectar en pantalla durante su intervención.
 */

// 1. CONTRATO DE ESTADO DE SERVIDOR (Server State) — Remoto, asíncrono y en caché
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

// 2. Metadatos de navegación para paginación numérica en TanStack Query
export interface RespuestaCatalogoPaginado {
  readonly datos: readonly Cochera[];
  readonly totalRegistros: number;
  readonly paginaActual: number;
  readonly totalPaginas: number;
  readonly tieneSiguiente: boolean;
  readonly tieneAnterior: boolean;
}

// 3. Contrato de Notificación Toast para feedback en vivo
export interface ToastNotificacion {
  readonly id: string;
  readonly tipo: "ingreso" | "salida" | "reserva_eta" | "tarifa_dinamica" | "aforo_critico";
  readonly titulo: string;
  readonly mensaje: string;
  readonly distrito: string;
  readonly timestamp: string;
}

// 4. CONTRATO DE ESTADO GLOBAL DE CLIENTE (Client State) — Síncrono y atómico con Zustand
export interface AppStoreState {
  // Estado reactivo de UI
  readonly tema: "claro" | "oscuro";
  readonly distritoPreferido: string;
  readonly modoVista: "cuadricula" | "lista";
  readonly notificaciones: readonly ToastNotificacion[];

  // Acciones (Actions)
  readonly alternarTema: () => void;
  readonly establecerDistritoPreferido: (distrito: string) => void;
  readonly alternarModoVista: () => void;
  readonly agregarNotificacion: (item: Omit<ToastNotificacion, "id" | "timestamp">) => void;
  readonly descartarNotificacion: (id: string) => void;
}
