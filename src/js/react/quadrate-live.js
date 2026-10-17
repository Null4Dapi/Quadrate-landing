/**
 * quadrate-live.js — Compilado para Navegador
 */
const React = window.React;
const ReactDOM = window.ReactDOM;
import { QuadrateLiveApp } from "./quadrate-live-app.js";
import { CasetaTour } from "./caseta-tour.js";

/**
 * Punto de montaje de la aplicación React de Quadrate Live.
 */
export function inicializarQuadrateLive() {
  const contenedorRaiz = document.getElementById("quadrate-live-root");
  if (!contenedorRaiz) {
    return;
  }
  const raizReact = ReactDOM.createRoot(contenedorRaiz);
  raizReact.render(/*#__PURE__*/React.createElement(QuadrateLiveApp, null));
}

/**
 * Punto de montaje del componente Tour Interactivo de Caseta.
 */
export function inicializarCasetaTour() {
  const contenedor = document.getElementById("caseta-tour-root");
  if (!contenedor) {
    return;
  }
  const raizReact = ReactDOM.createRoot(contenedor);
  raizReact.render(/*#__PURE__*/React.createElement(CasetaTour, null));
}
