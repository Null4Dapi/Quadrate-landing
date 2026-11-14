/**
 * contenedor-live.js — Compilado para Navegador
 */
const React = window.React;

/**
 * Componente contenedor principal para la composición de la demo Quadrate Live.
 *
 * @param {Object} props
 * @param {string} props.titulo - Título principal
 * @param {string} props.subtitulo - Subtítulo descriptivo
 * @param {React.ReactNode} [props.cabeceraSaludo] - Consola de estado operativo
 * @param {React.ReactNode} [props.monitor] - Monitor de latencia y sesión
 * @param {React.ReactNode} [props.barraBusqueda] - Barra de búsqueda y filtros
 * @param {React.ReactNode} [props.feedTelemetria] - Feed de telemetría en vivo
 * @param {React.ReactNode} props.children - Catálogo de cocheras
 * @param {React.ReactNode} [props.panelDetalle] - Simulador de reserva dinámica
 * @returns {JSX.Element}
 */
export function ContenedorLive({
  titulo,
  subtitulo,
  cabeceraSaludo,
  monitor,
  barraBusqueda,
  feedTelemetria,
  children,
  panelDetalle
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "quadrate-live__container"
  }, /*#__PURE__*/React.createElement("header", {
    className: "quadrate-live__header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "quadrate-live__header-textos"
  }, /*#__PURE__*/React.createElement("span", {
    className: "quadrate-live__eyebrow"
  }, "Quadrate Live"), /*#__PURE__*/React.createElement("h2", {
    className: "quadrate-live__titulo"
  }, titulo), /*#__PURE__*/React.createElement("p", {
    className: "quadrate-live__subtitulo"
  }, subtitulo)), monitor && /*#__PURE__*/React.createElement("div", {
    className: "quadrate-live__header-monitor"
  }, monitor)), cabeceraSaludo && /*#__PURE__*/React.createElement("section", {
    className: "quadrate-live__saludo-wrapper"
  }, cabeceraSaludo), feedTelemetria && /*#__PURE__*/React.createElement("section", {
    className: "quadrate-live__feed-wrapper"
  }, feedTelemetria), barraBusqueda && /*#__PURE__*/React.createElement("section", {
    className: "quadrate-live__busqueda-wrapper"
  }, barraBusqueda), /*#__PURE__*/React.createElement("div", {
    className: "quadrate-live__layout"
  }, /*#__PURE__*/React.createElement("div", {
    className: "quadrate-live__principal"
  }, children), panelDetalle && /*#__PURE__*/React.createElement("div", {
    className: "quadrate-live__secundario"
  }, panelDetalle)));
}
