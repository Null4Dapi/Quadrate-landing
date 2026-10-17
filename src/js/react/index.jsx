import React from "react";
import ReactDOM from "react-dom/client";
import { QuadrateLiveApp } from "./quadrate-live-app.jsx";
import { CasetaTour } from "./caseta-tour.jsx";

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

/**
 * Punto de montaje del componente Tour Interactivo de Caseta.
 */
export function inicializarCasetaTour() {
  const contenedor = document.getElementById("caseta-tour-root");
  if (!contenedor) {
    return;
  }

  const raizReact = ReactDOM.createRoot(contenedor);
  raizReact.render(<CasetaTour />);
}

