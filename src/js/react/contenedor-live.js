/**
 * contenedor-live.js — Compilado para Navegador
 */
const React = window.React;
const { useState, useEffect, useRef } = React;

/**
 * Componente contenedor padre para ilustrar composición de componentes.
 * Recibe children y componentes secundarios como props.
 *
 * @param {Object} props
 * @param {string} props.titulo - Título principal de la sección
 * @param {string} props.subtitulo - Subtítulo descriptivo
 * @param {React.ReactNode} [props.cabeceraSaludo] - Componente de saludo
 * @param {React.ReactNode} [props.monitor] - Componente de monitor
 * @param {React.ReactNode} [props.barraBusqueda] - Barra de búsqueda con useRef
 * @param {React.ReactNode} props.children - Elementos hijos compuestos (cuadrícula de cocheras)
 * @param {React.ReactNode} [props.panelDetalle] - Panel lateral compuesto
 * @returns {JSX.Element}
 */
export function ContenedorLive({
  titulo,
  subtitulo,
  cabeceraSaludo,
  monitor,
  barraBusqueda,
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
  }, "Módulo React en Vivo"), /*#__PURE__*/React.createElement("h2", {
    className: "quadrate-live__titulo"
  }, titulo), /*#__PURE__*/React.createElement("p", {
    className: "quadrate-live__subtitulo"
  }, subtitulo)), monitor && /*#__PURE__*/React.createElement("div", {
    className: "quadrate-live__header-monitor"
  }, monitor)), cabeceraSaludo && /*#__PURE__*/React.createElement("section", {
    className: "quadrate-live__saludo-wrapper"
  }, cabeceraSaludo), barraBusqueda && /*#__PURE__*/React.createElement("section", {
    className: "quadrate-live__busqueda-wrapper"
  }, barraBusqueda), /*#__PURE__*/React.createElement("div", {
    className: "quadrate-live__layout"
  }, /*#__PURE__*/React.createElement("div", {
    className: "quadrate-live__principal"
  }, children), panelDetalle && /*#__PURE__*/React.createElement("div", {
    className: "quadrate-live__secundario"
  }, panelDetalle)));
}
