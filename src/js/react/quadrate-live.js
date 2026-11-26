/**
 * quadrate-live.js — Compilado para Navegador
 */
const React = window.React;
const ReactDOM = window.ReactDOM;
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { QuadrateLiveApp } from "./quadrate-live-app.js";
import { CasetaTour } from "./caseta-tour.js";

/**
 * Instancia única singleton de QueryClient para TanStack Query.
 * Configura staleTime en 2 minutos para demostración de reutilización de caché.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,
      // 2 minutos
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
});

/**
 * Punto de montaje de la aplicación React de Quadrate Live con QueryClientProvider.
 */
export function inicializarQuadrateLive() {
  const contenedorRaiz = document.getElementById("quadrate-live-root");
  if (!contenedorRaiz) {
    return;
  }
  const raizReact = ReactDOM.createRoot(contenedorRaiz);
  raizReact.render(/*#__PURE__*/React.createElement(QueryClientProvider, {
    client: queryClient
  }, /*#__PURE__*/React.createElement(QuadrateLiveApp, null)));
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
