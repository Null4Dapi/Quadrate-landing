/**
 * saludo-usuario.js — Compilado para Navegador
 */
const React = window.React;

/**
 * Panel de contexto operativo de la red de estacionamientos.
 * Reemplaza los saludos ficticios por un resumen editorial de infraestructura en vivo.
 *
 * @param {Object} props
 * @param {number} props.totalCocheras - Total de playas enlazadas
 * @param {string} props.estadoWs - Estado del enlace WebSocket ('en vivo', 'reconectando', etc.)
 * @param {Function} [props.onSimularEvento] - Disparo manual de telemetría para demostración
 * @param {boolean} [props.estaPausado] - Indicador de pausa de telemetría
 * @param {Function} [props.onAlternarPausa] - Callback para alternar pausa/reanudación
 * @returns {JSX.Element}
 */
export function SaludoUsuario({
  totalCocheras = 6,
  estadoWs = "en vivo",
  onSimularEvento,
  estaPausado = false,
  onAlternarPausa
}) {
  return /*#__PURE__*/React.createElement("article", {
    className: "quadrate-live__operaciones",
    "aria-label": "Consola de estado operativo"
  }, /*#__PURE__*/React.createElement("div", {
    className: "quadrate-live__operaciones-info"
  }, /*#__PURE__*/React.createElement("div", {
    className: "quadrate-live__operaciones-header"
  }, /*#__PURE__*/React.createElement("span", {
    className: "quadrate-live__operaciones-dot",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("h3", {
    className: "quadrate-live__operaciones-titulo"
  }, "Consola de Operaciones Lima"), /*#__PURE__*/React.createElement("span", {
    className: "quadrate-live__badge quadrate-live__badge--nodo"
  }, "Nodo Central")), /*#__PURE__*/React.createElement("p", {
    className: "quadrate-live__operaciones-meta"
  }, /*#__PURE__*/React.createElement("strong", null, totalCocheras, " garitas digitales"), " conectadas por telemetría.", " ", "Aforo, tarifas dinámicas y reservas por ETA sincronizadas en tiempo real.")), /*#__PURE__*/React.createElement("div", {
    className: "quadrate-live__operaciones-acciones"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "quadrate-live__btn quadrate-live__btn--secundario",
    onClick: onAlternarPausa,
    title: estaPausado ? "Reanudar recepción de telemetría" : "Pausar eventos automáticos",
    "aria-pressed": estaPausado
  }, estaPausado ? "▶ Reanudar flujo" : "⏸ Pausar flujo"), onSimularEvento && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "quadrate-live__btn quadrate-live__btn--primario",
    onClick: onSimularEvento,
    title: "Disparar un evento de garita en tiempo real para evaluar reactividad"
  }, "⚡ Simular evento de garita")));
}
