/**
 * notificaciones-panel.js — Compilado para Navegador
 */
const React = window.React;
import { useAppStore } from "../../store/appStore.js";
import { changeTheme } from "../../store/syncChannel.js";

/**
 * Componente consumidor de Zustand con selector granular para el conteo de alertas.
 */
export function NotificationBadge() {
  const count = useAppStore(state => state.notifications.length);
  return /*#__PURE__*/React.createElement("span", {
    className: "badge-notificaciones",
    "aria-live": "polite"
  }, "Alertas: ", count);
}

/**
 * Conmutador interactivo de tema claro / oscuro con sincronización multi-pestaña.
 */
export function ControlTemaZustand() {
  const theme = useAppStore(state => state.theme);
  const alternarTema = () => {
    const siguienteTema = theme === "light" ? "dark" : "light";
    changeTheme(siguienteTema);
  };
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn-conmutador-tema",
    onClick: alternarTema,
    "aria-label": `Cambiar a tema ${theme === "light" ? "oscuro" : "claro"}`,
    title: "Sincronizado entre pestañas vía BroadcastChannel"
  }, theme === "light" ? "🌙 Modo Garita Nocturna" : "☀️ Modo Diurno");
}

/**
 * Panel de historial de alertas operativas consumiendo el store de Zustand.
 */
export function NotificationPanel() {
  const items = useAppStore(state => state.notifications);
  const clear = useAppStore(state => state.clearNotifications);
  return /*#__PURE__*/React.createElement("section", {
    className: "panel-historial",
    "aria-label": "Historial de alertas operativas"
  }, /*#__PURE__*/React.createElement("header", {
    className: "panel-historial__header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "panel-historial__title-row"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "panel-historial__title"
  }, "Historial en Vivo (Zustand Store)"), /*#__PURE__*/React.createElement(NotificationBadge, null)), items.length > 0 && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: clear,
    className: "panel-historial__btn-clear"
  }, "Limpiar avisos")), /*#__PURE__*/React.createElement("div", {
    className: "panel-historial__lista"
  }, items.length === 0 ? /*#__PURE__*/React.createElement("p", {
    className: "panel-historial__empty"
  }, "Sin alertas operativas en este momento.") : items.map(n => /*#__PURE__*/React.createElement("article", {
    key: n.id,
    className: "tarjeta-alerta"
  }, /*#__PURE__*/React.createElement("p", {
    className: "tarjeta-alerta__mensaje"
  }, n.message), /*#__PURE__*/React.createElement("time", {
    className: "tarjeta-alerta__tiempo"
  }, new Date(n.createdAt).toLocaleTimeString())))));
}
