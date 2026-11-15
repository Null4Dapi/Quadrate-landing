/**
 * toast-container.js — Compilado para Navegador
 */
const React = window.React;
import { useAppStore } from "./store/app-store.js";

/**
 * Contenedor de Alertas Toast en Tiempo Real (Zustand).
 * Notificaciones efímeras de telemetría operativa con accesibilidad WCAG.
 */
export function ToastContainer() {
  const notificaciones = useAppStore(state => state.notificaciones);
  const descartarNotificacion = useAppStore(state => state.descartarNotificacion);
  if (!notificaciones || notificaciones.length === 0) {
    return null;
  }
  return /*#__PURE__*/React.createElement("aside", {
    className: "qlive-toaster",
    role: "status",
    "aria-live": "polite",
    "aria-atomic": "false",
    "aria-label": "Alertas operativas en tiempo real"
  }, notificaciones.map(n => /*#__PURE__*/React.createElement("div", {
    key: n.id,
    className: `qlive-toast qlive-toast--${n.tipo || "info"}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "qlive-toast__contenido"
  }, /*#__PURE__*/React.createElement("header", {
    className: "qlive-toast__cabecera"
  }, /*#__PURE__*/React.createElement("span", {
    className: "qlive-toast__tag"
  }, n.distrito || "Lima"), /*#__PURE__*/React.createElement("span", {
    className: "qlive-toast__hora"
  }, n.timestamp)), /*#__PURE__*/React.createElement("strong", {
    className: "qlive-toast__titulo"
  }, n.titulo), /*#__PURE__*/React.createElement("p", {
    className: "qlive-toast__mensaje"
  }, n.mensaje)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "qlive-toast__cerrar",
    onClick: () => descartarNotificacion(n.id),
    "aria-label": `Descartar alerta ${n.titulo}`
  }, "×"))));
}
