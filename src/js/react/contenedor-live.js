/**
 * contenedor-live.js — Compilado para Navegador
 */
const React = window.React;

/**
 * Contenedor principal con jerarquía UX centrada en el usuario.
 * Prioriza el catálogo de cocheras y relega herramientas de diagnóstico a un dock flotante.
 *
 * @param {Object} props
 * @param {string} props.titulo - Título principal
 * @param {string} props.subtitulo - Subtítulo descriptivo
 * @param {React.ReactNode} [props.monitor] - Conmutador de turno o acciones de cabecera
 * @param {React.ReactNode} props.children - Catálogo de cocheras principal
 * @param {React.ReactNode} [props.panelDetalle] - Simulador de reserva modal/lateral
 * @param {React.ReactNode} [props.feedTelemetria] - Dock de diagnóstico y telemetría
 * @returns {JSX.Element}
 */
export function ContenedorLive({
  titulo,
  subtitulo,
  monitor,
  children,
  panelDetalle,
  feedTelemetria
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "quadrate-live__container"
  }, /*#__PURE__*/React.createElement("header", {
    className: "quadrate-live__header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "quadrate-live__header-textos"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "quadrate-live__titulo"
  }, titulo), /*#__PURE__*/React.createElement("p", {
    className: "quadrate-live__subtitulo"
  }, subtitulo)), monitor && /*#__PURE__*/React.createElement("div", {
    className: "quadrate-live__header-monitor"
  }, monitor)), /*#__PURE__*/React.createElement("div", {
    className: "quadrate-live__layout"
  }, /*#__PURE__*/React.createElement("div", {
    className: "quadrate-live__principal"
  }, children), panelDetalle && /*#__PURE__*/React.createElement("div", {
    className: "quadrate-live__secundario"
  }, panelDetalle)), feedTelemetria);
}
