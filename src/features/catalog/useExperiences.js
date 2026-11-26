/**
 * src/features/catalog/useExperiences.js
 * Custom hook reactivo para consulta y almacenamiento en caché del catálogo con TanStack Query.
 */

import { useQuery } from "@tanstack/react-query";
import { getCocherasCatalogo, getExperiences } from "./api.js";

/** Tiempo de frescura en memoria: 2 minutos (120,000 ms) */
export const TIEMPO_FRESCURA_CACHE_MS = 1000 * 60 * 2;

/**
 * Hook reactivo para el catálogo de cocheras en Lima con filtrado y paginación.
 * @param {Object} [params]
 * @param {number} [params.pagina=1]
 * @param {string} [params.distrito="Todos"]
 * @param {string} [params.busqueda=""]
 */
export function useCocherasQuery({ pagina = 1, distrito = "Todos", busqueda = "" } = {}) {
  return useQuery({
    queryKey: ["cocheras-catalogo", { pagina, distrito, busqueda }],
    queryFn: () => getCocherasCatalogo({ pagina, distrito, busqueda }),
    staleTime: TIEMPO_FRESCURA_CACHE_MS,
  });
}

/**
 * Hook para compatibilidad directa con el enunciado académico.
 * @param {number} [pagina=1]
 */
export function useExperiences(pagina = 1) {
  return useQuery({
    queryKey: ["experiences", pagina],
    queryFn: () => getExperiences(pagina),
    staleTime: TIEMPO_FRESCURA_CACHE_MS,
  });
}
