/**
 * Quadrate pe — Query de Catálogo Remoto con TanStack Query
 * Maneja datos de servidor: paginación, filtros, estados asíncronos y caché reactivo.
 */
import { useQuery, queryClient } from "../vendor/tanstack-query.js";
import { DATOS_COCHERAS_INICIALES } from "../datos-cocheras.js";

/**
 * Simulador de endpoint remoto de cocheras con filtrado y paginación en servidor.
 */
export async function obtenerCocherasRemotas({ distrito = "Todos", pagina = 1, limitePorPagina = 3 } = {}) {
  // Latencia de red asíncrona realista (250 ms)
  await new Promise((resolve) => setTimeout(resolve, 250));

  let cocherasFiltradas = DATOS_COCHERAS_INICIALES;
  if (distrito && distrito !== "Todos") {
    cocherasFiltradas = cocherasFiltradas.filter(
      (c) => c.distrito.toLowerCase() === distrito.toLowerCase()
    );
  }

  const totalRegistros = cocherasFiltradas.length;
  const totalPaginas = Math.max(1, Math.ceil(totalRegistros / limitePorPagina));
  const paginaValida = Math.min(Math.max(1, pagina), totalPaginas);

  const inicio = (paginaValida - 1) * limitePorPagina;
  const datos = cocherasFiltradas.slice(inicio, inicio + limitePorPagina);

  return {
    datos,
    totalRegistros,
    paginaActual: paginaValida,
    totalPaginas,
    tieneSiguiente: paginaValida < totalPaginas,
    tieneAnterior: paginaValida > 1,
  };
}

/**
 * Hook de TanStack Query para el catálogo de cocheras paginado.
 */
export function useCocherasQuery({ distrito = "Todos", pagina = 1, limitePorPagina = 3 } = {}) {
  return useQuery({
    queryKey: ["cocheras", { distrito, pagina, limitePorPagina }],
    queryFn: () => obtenerCocherasRemotas({ distrito, pagina, limitePorPagina }),
    staleTime: 60 * 1000, // 1 minuto de frescura en caché
    keepPreviousData: true, // Evita parpadeo durante la paginación
  });
}

export { queryClient };
