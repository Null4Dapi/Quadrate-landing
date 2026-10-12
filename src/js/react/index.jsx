import React from "react";
import ReactDOM from "react-dom/client";
import { QuadrateLiveApp } from "./quadrate-live-app.jsx";

/**
 * Punto de montaje de la aplicación React de Quadrate Live.
 */
export function inicializarQuadrateLive() {
  const contenedorRaiz = document.getElementById("quadrate-live-root");
  if (!contenedorRaiz) {
    return;
  }

  const raizReact = ReactDOM.createRoot(contenedorRaiz);
  raizReact.render(<QuadrateLiveApp />);
}
