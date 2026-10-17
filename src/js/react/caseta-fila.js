/**
 * caseta-fila.js — Compilado para Navegador
 */
const React = window.React;

/**
 * Fila interactiva para una característica del tour de caseta.
 *
 * @param {Object} props
 * @param {number} props.indice - Índice posicional de la característica
 * @param {string} props.titulo - Título principal de la funcionalidad
 * @param {string} props.detalle - Descripción detallada del beneficio
 * @param {boolean} props.estaActiva - Indica si la fila se encuentra activa
 * @param {Function} props.alSeleccionar - Callback invocado al seleccionar
 * @returns {JSX.Element}
 */
export function CasetaFila({
  indice,
  titulo,
  detalle,
  estaActiva = false,
  alSeleccionar
}) {
  const handleKeyDown = eventoTeclado => {
    if (eventoTeclado.key === "Enter" || eventoTeclado.key === " ") {
      eventoTeclado.preventDefault();
      alSeleccionar();
    }
  };
  return /*#__PURE__*/React.createElement("li", {
    className: "caseta__item" + (estaActiva ? " caseta__item--active" : ""),
    tabIndex: 0,
    role: "button",
    "aria-pressed": estaActiva,
    onClick: alSeleccionar,
    onKeyDown: handleKeyDown
  }, /*#__PURE__*/React.createElement("h3", {
    className: "caseta__item-title"
  }, titulo), /*#__PURE__*/React.createElement("p", {
    className: "caseta__item-detail"
  }, detalle));
}
export default CasetaFila;
