/**
 * QUADRATE PE — SEMANA 11: CÓDIGO INDIVIDUAL
 * Integrante: DIEGO (1:30 - 3:05)
 * Tema: Gestión de Server State con TanStack Query, Caché y Paginación Numérica
 * Archivo a proyectar en pantalla durante su intervención.
 */

import React from "react";
import { useQuery, queryClient } from "../vendor/tanstack-query.js";

/**
 * 1. Simulación del endpoint remoto de cocheras con paginación en servidor
 */
export async function obtenerCocherasRemotas({ distrito = "Todos", pagina = 1, limitePorPagina = 4 } = {}) {
  // Simulación de latencia de red asíncrona realista (250 ms)
  await new Promise((resolve) => setTimeout(resolve, 250));

  // Endpoint REST simulado con filtrado y slicing en backend
  const respuesta = await fetch(`/api/cocheras?distrito=${distrito}&page=${pagina}&limit=${limitePorPagina}`);
  if (!respuesta.ok) {
    throw new Error(`Fallo en el servicio de catálogo: HTTP ${respuesta.status}`);
  }
  return respuesta.json();
}

/**
 * 2. Custom Hook declarativo gobernado por TanStack Query
 */
export function useCocherasQuery({ distrito = "Todos", pagina = 1, limitePorPagina = 4 } = {}) {
  return useQuery({
    // Clave compuesta: cualquier cambio en distrito o página genera una entrada aislada
    queryKey: ["cocheras", { distrito, pagina, limitePorPagina }],

    // Función asíncrona de consulta
    queryFn: () => obtenerCocherasRemotas({ distrito, pagina, limitePorPagina }),

    // Política de frescura: 60 segundos antes de considerar los datos obsoletos
    staleTime: 60 * 1000,

    // Retención en memoria de consultas previas (5 minutos)
    cacheTime: 5 * 60 * 1000,

    // Paginación continua sin parpadeos: retiene los datos previos mientras resuelve la nueva página
    keepPreviousData: true,

    // Reintentos automáticos ante fallo temporal de conectividad
    retry: 2,
  });
}
