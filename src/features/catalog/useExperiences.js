/**
 * src/features/catalog/useExperiences.js
 * Custom hook reactivo para consulta y almacenamiento en caché del catálogo con TanStack Query.
 */

import { useQuery } from "@tanstack/react-query";
import { getExperiences } from "./api.js";

/** Tiempo de frescura en memoria: 2 minutos (120,000 ms) */
export const TIEMPO_FRESCURA_CACHE_MS = 1000 * 60 * 2;

/**
 * Hook para consultar y cachear la página solicitada del catálogo.
 * @param {number} pagina - Número de página actual.
 * @returns {import('@tanstack/react-query').UseQueryResult<import('./api.js').Experience[], Error>}
 */
export function useExperiences(pagina = 1) {
  return useQuery({
    queryKey: ["experiences", pagina],
    queryFn: () => getExperiences(pagina),
    staleTime: TIEMPO_FRESCURA_CACHE_MS,
  });
}
