import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { QuadrateLiveApp } from "./quadrate-live-app.jsx";
import { CasetaTour } from "./caseta-tour.jsx";

/**
 * Instancia única singleton de QueryClient para TanStack Query.
 * Configura staleTime en 2 minutos para demostración de reutilización de caché.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2, // 2 minutos
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
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
  raizReact.render(
    <QueryClientProvider client={queryClient}>
      <QuadrateLiveApp />
    </QueryClientProvider>
  );
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
