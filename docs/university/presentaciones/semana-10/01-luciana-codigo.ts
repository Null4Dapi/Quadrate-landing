/**
 * QUADRATE PE — SEMANA 10: CÓDIGO INDIVIDUAL
 * Integrante: LUCIANA (0:00 - 1:30)
 * Tema: Diagnóstico de Prop Drilling, Modelos Inmutables y Contratos de Context API
 * Archivo a proyectar en pantalla durante su grabación.
 */

// 1. Tipos de eventos emitidos por las garitas de Lima
export type TipoAlertaOperativa =
  | "aforo_critico"
  | "tarifa_dinamica"
  | "reserva_eta"
  | "checkin_lpr"
  | "mantenimiento";

// 2. Contrato formal e inmutable para las notificaciones operativas
export interface Notification {
  readonly id: string;
  readonly title: string;
  readonly message: string;
  readonly distrito: string;
  readonly tipo: TipoAlertaOperativa;
  readonly createdAt: string; // Formato ISO 8601
  readonly read: boolean;
}

// 3. Contrato de tema visual (diurno editorial vs vigilancia nocturna de caseta)
export interface ThemeContextValue {
  readonly theme: "light" | "dark";
  readonly toggleTheme: () => void;
}
