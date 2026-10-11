/**
 * saludo-usuario.js — Compilado para Navegador
 */
const React = window.React;

/**
 * Componente funcional de saludo personalizado para el usuario de la plataforma.
 * Recibe datos por medio de props y muestra el contexto del conductor en sesión.
 *
 * @param {Object} props
 * @param {string} props.nombreUsuario - Nombre del conductor o administrador
 * @param {string} props.rolUsuario - Rol del perfil (ej. "Conductor Verificado")
 * @param {number} props.totalCocheras - Total de playas activas sincronizadas
 * @param {string} props.tiempoActivo - Tiempo formateado de la sesión activa
 * @returns {JSX.Element}
 */
export function SaludoUsuario({
  nombreUsuario = "Conductor",
  rolUsuario = "Conductor Verificado",
  totalCocheras = 0,
  tiempoActivo = "00:00"
}) {
  return /*#__PURE__*/React.createElement("article", {
    className: "quadrate-live__saludo"
  }, /*#__PURE__*/React.createElement("div", {
    className: "quadrate-live__saludo-avatar",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("span", {
    className: "quadrate-live__saludo-inicial"
  }, nombreUsuario.charAt(0).toUpperCase())), /*#__PURE__*/React.createElement("div", {
    className: "quadrate-live__saludo-meta"
  }, /*#__PURE__*/React.createElement("div", {
    className: "quadrate-live__saludo-header"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "quadrate-live__saludo-nombre"
  }, "¡Hola, ", nombreUsuario, "!"), /*#__PURE__*/React.createElement("span", {
    className: "quadrate-live__badge quadrate-live__badge--rol"
  }, rolUsuario)), /*#__PURE__*/React.createElement("p", {
    className: "quadrate-live__saludo-texto"
  }, "Red activa: ", /*#__PURE__*/React.createElement("strong", null, totalCocheras, " cocheras"), " en Lima con aforo en vivo.", /*#__PURE__*/React.createElement("span", {
    className: "quadrate-live__saludo-tiempo"
  }, " ", "· Sesión activa: ", /*#__PURE__*/React.createElement("strong", null, tiempoActivo)))));
}
