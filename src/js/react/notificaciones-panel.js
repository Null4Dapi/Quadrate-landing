/**
 * notificaciones-panel.js — Compilado para Navegador
 */
const React = window.React;
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
  const alternarTema = () => {
    changeTheme(esOscuro ? "light" : "dark");
  };
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: `btn-turno-garita ${esOscuro ? "btn-turno-garita--nocturno" : ""}`,
    onClick: alternarTema,
    "aria-label": `Cambiar a turno ${esOscuro ? "diurno" : "nocturno"}`,
    title: "Sincronizado entre garitas vía BroadcastChannel"
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
  }, esOscuro ? "Turno Garita: Nocturno" : "Turno Garita: Diurno"));
}

/**
 * Feed unificado de telemetría operativa en vivo consumiendo Zustand.
 * Elimina la redundancia visual y canaliza los eventos WebSocket con precisión editorial.
 */
export function TelemetriaFeedZustand({
  estaPausado = false,
  onAlternarPausa
}) {
  const notifications = useAppStore(state => state.notifications);
  const clearNotifications = useAppStore(state => state.clearNotifications);
  return /*#__PURE__*/React.createElement("section", {
    className: "telemetria-feed",
    "aria-label": "Registro de telemetría operativa en vivo"
  }, /*#__PURE__*/React.createElement("header", {
    className: "telemetria-feed__header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "telemetria-feed__header-izq"
  }, /*#__PURE__*/React.createElement("span", {
    className: `telemetria-feed__dot ${estaPausado ? "telemetria-feed__dot--pausa" : "telemetria-feed__dot--activo"}`,
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("h3", {
    className: "telemetria-feed__titulo"
  }, "Telemetría de Red"), /*#__PURE__*/React.createElement(NotificationBadge, null)), /*#__PURE__*/React.createElement("div", {
    className: "telemetria-feed__acciones"
  }, onAlternarPausa && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onAlternarPausa,
    className: "telemetria-feed__btn-accion",
    title: estaPausado ? "Reanudar recepción de telemetría" : "Pausar flujo en pantalla"
  }, estaPausado ? "Reanudar" : "Pausar"), notifications.length > 0 && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: clearNotifications,
    className: "telemetria-feed__btn-accion telemetria-feed__btn-accion--limpiar",
    title: "Limpiar historial de avisos"
  }, "Limpiar"))), /*#__PURE__*/React.createElement("div", {
    className: "telemetria-feed__lista",
    role: "log",
    "aria-live": "polite"
  }, notifications.length === 0 ? /*#__PURE__*/React.createElement("p", {
    className: "telemetria-feed__vacio"
  }, "Enlace de garitas activo. Esperando reportes automáticos de control vehicular en Lima...") : notifications.slice(0, 4).map(n => /*#__PURE__*/React.createElement("article", {
    key: n.id,
    className: "telemetria-feed__item"
  }, /*#__PURE__*/React.createElement("time", {
    className: "telemetria-feed__tiempo"
  }, n.timestamp || new Date(n.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  })), n.tipo && /*#__PURE__*/React.createElement("span", {
    className: `telemetria-feed__etiqueta telemetria-feed__etiqueta--${n.tipo}`
  }, n.tipo === "ingreso" && "Check-in LPR", n.tipo === "salida" && "Check-out", n.tipo === "reserva_eta" && "Reserva ETA", n.tipo === "tarifa_dinamica" && "Tarifa Valle", n.tipo === "aforo_critico" && "Alerta Aforo", n.tipo !== "ingreso" && n.tipo !== "salida" && n.tipo !== "reserva_eta" && n.tipo !== "tarifa_dinamica" && n.tipo !== "aforo_critico" && (n.tipo || "Operación")), /*#__PURE__*/React.createElement("div", {
    className: "telemetria-feed__cuerpo"
  }, n.nombreCochera && /*#__PURE__*/React.createElement("strong", {
    className: "telemetria-feed__cochera"
  }, n.nombreCochera, " · "), /*#__PURE__*/React.createElement("span", {
    className: "telemetria-feed__texto"
  }, n.message))))));
}

/** Alias para compatibilidad de importaciones existentes */
export const NotificationPanel = TelemetriaFeedZustand;
