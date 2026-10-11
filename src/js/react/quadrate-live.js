/**
 * quadrate-live.js — Compilado para Navegador
 */
const React = window.React;
const ReactDOM = window.ReactDOM;
import { QuadrateLiveApp } from "./quadrate-live-app.js";

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
