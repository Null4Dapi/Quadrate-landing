/**
 * notificaciones-panel.js — Compilado para Navegador
 */
const React = window.React;
const { useState, useEffect } = React;
import { useAppStore } from "../../store/appStore.js";
import { changeTheme } from "../../store/syncChannel.js";

/**
 * Conteo granular de alertas operativas con selector de Zustand.
 */
export function NotificationBadge() {
  const count = useAppStore(state => state.notifications.length);
  return /*#__PURE__*/React.createElement("span", {
    className: "telemetria-feed__badge",
    "aria-live": "polite"
  }, count, " ", count === 1 ? "alerta" : "alertas");
}

/**
 * Conmutador arquitectónico de turno de garita (tema claro / oscuro).
 * Sincronizado multi-pestaña con BroadcastChannel y persistido en localStorage con Zustand.
 */
export function ControlTemaZustand() {
  const theme = useAppStore(state => state.theme);
  const esOscuro = theme === "dark";
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: `btn-turno-garita ${esOscuro ? "btn-turno-garita--nocturno" : ""}`,
    onClick: () => changeTheme(esOscuro ? "light" : "dark"),
    "aria-label": `Cambiar a turno ${esOscuro ? "diurno" : "nocturno"}`,
    title: "Sincronizado entre pestañas vía BroadcastChannel"
  }, /*#__PURE__*/React.createElement("span", {
    className: "btn-turno-garita__icono",
    "aria-hidden": "true"
  }, esOscuro ? /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "5"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "12",
    y1: "1",
    x2: "12",
    y2: "3"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "12",
    y1: "21",
    x2: "12",
    y2: "23"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "4.22",
    y1: "4.22",
    x2: "5.64",
    y2: "5.64"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "18.36",
    y1: "18.36",
    x2: "19.78",
    y2: "19.78"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "1",
    y1: "12",
    x2: "3",
    y2: "12"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "21",
    y1: "12",
    x2: "23",
    y2: "12"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "4.22",
    y1: "19.78",
    x2: "5.64",
    y2: "18.36"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "18.36",
    y1: "5.64",
    x2: "19.78",
    y2: "4.22"
  })) : /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
  }))), /*#__PURE__*/React.createElement("span", {
    className: "btn-turno-garita__texto"
  }, esOscuro ? "Turno Nocturno" : "Turno Diurno"));
}

/**
 * Toast flotante no intrusivo para el usuario (UX).
 * Muestra alertas contextuales de disponibilidad en tiempo real sin romper el flujo de navegación.
 */
export function ToastNotificacionZustand() {
  const notifications = useAppStore(state => state.notifications);
  const [toastVisible, setToastVisible] = useState(null);
  useEffect(() => {
    if (notifications.length > 0) {
      const ultima = notifications[0];
      setToastVisible(ultima);
      const timer = setTimeout(() => {
        setToastVisible(prev => prev?.id === ultima.id ? null : prev);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [notifications]);
  if (!toastVisible) return null;
  return /*#__PURE__*/React.createElement("aside", {
    className: "toast-operativo",
    role: "status",
    "aria-live": "polite"
  }, /*#__PURE__*/React.createElement("div", {
    className: "toast-operativo__dot",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("div", {
    className: "toast-operativo__cuerpo"
  }, toastVisible.nombreCochera && /*#__PURE__*/React.createElement("strong", {
    className: "toast-operativo__cochera"
  }, toastVisible.nombreCochera, ": "), /*#__PURE__*/React.createElement("span", {
    className: "toast-operativo__mensaje"
  }, toastVisible.message)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "toast-operativo__cerrar",
    onClick: () => setToastVisible(null),
    "aria-label": "Cerrar notificación"
  }, "✕"));
}

/**
 * Drawer / Consola colapsable de telemetría y diagnóstico para evaluadores (DX).
 * Confinado en un dock inferior que no interfiere con la experiencia del usuario.
 */
export function TelemetriaDrawerZustand({
  estaPausado = false,
  onAlternarPausa,
  onSimularEvento,
  estadoWs = "en vivo"
}) {
  const [estaAbierto, setEstaAbierto] = useState(false);
  const notifications = useAppStore(state => state.notifications);
  const clearNotifications = useAppStore(state => state.clearNotifications);
  return /*#__PURE__*/React.createElement("div", {
    className: `telemetria-dock ${estaAbierto ? "telemetria-dock--abierto" : ""}`
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "telemetria-dock__trigger",
    onClick: () => setEstaAbierto(v => !v),
    "aria-expanded": estaAbierto,
    "aria-controls": "telemetria-panel-drawer",
    title: "Abrir consola de telemetría y diagnóstico"
  }, /*#__PURE__*/React.createElement("div", {
    className: "telemetria-dock__trigger-left"
  }, /*#__PURE__*/React.createElement("span", {
    className: `telemetria-dock__trigger-dot ${estaPausado ? "telemetria-dock__trigger-dot--pausa" : "telemetria-dock__trigger-dot--activo"}`,
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("span", {
    className: "telemetria-dock__trigger-label"
  }, "Consola de Telemetría & Diagnóstico"), /*#__PURE__*/React.createElement(NotificationBadge, null)), /*#__PURE__*/React.createElement("span", {
    className: "telemetria-dock__trigger-chevron",
    "aria-hidden": "true"
  }, estaAbierto ? "Ocultar ▲" : "Desplegar ▼")), estaAbierto && /*#__PURE__*/React.createElement("section", {
    id: "telemetria-panel-drawer",
    className: "telemetria-drawer",
    "aria-label": "Consola de telemetría operativa y diagnóstico"
  }, /*#__PURE__*/React.createElement("header", {
    className: "telemetria-drawer__header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "telemetria-drawer__header-info"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "telemetria-drawer__titulo"
  }, "Consola de Telemetría (WebSocket + Zustand)"), /*#__PURE__*/React.createElement("p", {
    className: "telemetria-drawer__subtitulo"
  }, "Enlace WebSocket ", estadoWs, " · Auditoría en vivo para evaluadores y desarrolladores")), /*#__PURE__*/React.createElement("div", {
    className: "telemetria-drawer__acciones"
  }, onSimularEvento && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onSimularEvento,
    className: "telemetria-drawer__btn telemetria-drawer__btn--simular",
    title: "Simular trama de telemetría de garita"
  }, "Simular evento"), onAlternarPausa && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onAlternarPausa,
    className: "telemetria-drawer__btn",
    title: estaPausado ? "Reanudar recepción" : "Pausar eventos"
  }, estaPausado ? "Reanudar flujo" : "Pausar flujo"), notifications.length > 0 && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: clearNotifications,
    className: "telemetria-drawer__btn telemetria-drawer__btn--limpiar",
    title: "Limpiar avisos en el store de Zustand"
  }, "Limpiar historial"))), /*#__PURE__*/React.createElement("div", {
    className: "telemetria-drawer__feed",
    role: "log",
    "aria-live": "polite"
  }, notifications.length === 0 ? /*#__PURE__*/React.createElement("p", {
    className: "telemetria-drawer__vacio"
  }, "Enlace de garitas activo. Esperando reportes automáticos de control vehicular en Lima...") : notifications.map(n => /*#__PURE__*/React.createElement("article", {
    key: n.id,
    className: "telemetria-drawer__item"
  }, /*#__PURE__*/React.createElement("time", {
    className: "telemetria-drawer__tiempo"
  }, n.timestamp || new Date(n.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  })), n.tipo && /*#__PURE__*/React.createElement("span", {
    className: `telemetria-drawer__etiqueta telemetria-drawer__etiqueta--${n.tipo}`
  }, n.tipo === "ingreso" && "Check-in LPR", n.tipo === "salida" && "Check-out", n.tipo === "reserva_eta" && "Reserva ETA", n.tipo === "tarifa_dinamica" && "Tarifa Valle", n.tipo === "aforo_critico" && "Alerta Aforo", n.tipo !== "ingreso" && n.tipo !== "salida" && n.tipo !== "reserva_eta" && n.tipo !== "tarifa_dinamica" && n.tipo !== "aforo_critico" && (n.tipo || "Operación")), /*#__PURE__*/React.createElement("div", {
    className: "telemetria-drawer__cuerpo"
  }, n.nombreCochera && /*#__PURE__*/React.createElement("strong", {
    className: "telemetria-drawer__cochera"
  }, n.nombreCochera, " · "), /*#__PURE__*/React.createElement("span", {
    className: "telemetria-drawer__texto"
  }, n.message)))))));
}

/** Compatibilidad de importaciones existentes */
export const TelemetriaFeedZustand = TelemetriaDrawerZustand;
export const NotificationPanel = TelemetriaDrawerZustand;
