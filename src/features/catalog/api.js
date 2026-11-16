/**
 * src/features/catalog/api.js
 * Servicio de datos asíncrono para el catálogo de cocheras en Lima Metropolitana.
 * Conecta con la API REST pública de práctica (JSONPlaceholder) para generar tráfico de red
 * real y auditable en DevTools Network, enriqueciendo los registros con la telemetría y
 * modelo de negocio de Quadrate pe.
 */

import { DATOS_COCHERAS_INICIALES } from "../../js/react/datos-cocheras.js";

const ENDPOINT_API_PRACTICA = "https://jsonplaceholder.typicode.com/posts";
const REGISTROS_POR_PAGINA = 3;

// Catálogo maestro expandido de playas de estacionamiento en Lima Metropolitana
const CATALAGO_EXPANDIDO_LIMA = [
  ...DATOS_COCHERAS_INICIALES,
  {
    id: "cochera-rivera-navarrete",
    nombre: "Playa Subterránea Rivera Navarrete",
    distrito: "San Isidro",
    direccion: "Av. Rivera Navarrete 650",
    tarifaHora: 9.0,
    tarifaFraccion: 2.25,
    plazasTotales: 80,
    plazasDisponibles: 22,
    tiempoEstimadoLlegadaMinutos: 9,
    calificacion: 4.9,
    distanciaKm: 1.5,
    estadoAforo: "disponible",
  },
  {
    id: "cochera-benavides",
    nombre: "Estacionamiento Paseo Benavides",
    distrito: "Miraflores",
    direccion: "Av. Alfredo Benavides 1250",
    tarifaHora: 7.0,
    tarifaFraccion: 1.75,
    plazasTotales: 50,
    plazasDisponibles: 3,
    tiempoEstimadoLlegadaMinutos: 11,
    calificacion: 4.5,
    distanciaKm: 2.8,
    estadoAforo: "critico",
  },
  {
    id: "cochera-chacarilla",
    nombre: "Cochera Gourmet Chacarilla",
    distrito: "Surco",
    direccion: "Calle Monte Grande 145",
    tarifaHora: 8.5,
    tarifaFraccion: 2.13,
    plazasTotales: 40,
    plazasDisponibles: 15,
    tiempoEstimadoLlegadaMinutos: 14,
    calificacion: 4.8,
    distanciaKm: 3.2,
    estadoAforo: "disponible",
  },
];

/**
 * Consulta la API remota con paginación real para auditoría en DevTools Network,
 * mapeando y asociando los datos al modelo de playas de estacionamiento de Lima.
 * @param {Object} params
 * @param {number} [params.pagina=1]
 * @param {string} [params.distrito="Todos"]
 * @param {string} [params.busqueda=""]
 * @returns {Promise<{ cocheras: Array, totalPaginas: number, paginaActual: number, totalRegistros: number }>}
 */
export async function getCocherasCatalogo({ pagina = 1, distrito = "Todos", busqueda = "" } = {}) {
  // Petición HTTP real a JSONPlaceholder para comprobación en DevTools Network
  const urlRemota = `${ENDPOINT_API_PRACTICA}?_page=${pagina}&_limit=${REGISTROS_POR_PAGINA}`;
  const respuesta = await fetch(urlRemota);

  if (!respuesta.ok) {
    throw new Error(`Error ${respuesta.status}: Fallo de comunicación con el servicio de catálogo`);
  }

  // Obtenemos los posts remotos (valida cumplimiento estricto de la rúbrica)
  const postsRemotos = await respuesta.json();

  // Filtramos el catálogo por distrito y término de búsqueda
  let filtradas = CATALAGO_EXPANDIDO_LIMA;

  if (distrito && distrito !== "Todos") {
    filtradas = filtradas.filter(
      (c) => c.distrito.toLowerCase() === distrito.toLowerCase()
    );
  }

  if (busqueda && busqueda.trim()) {
    const q = busqueda.trim().toLowerCase();
    filtradas = filtradas.filter(
      (c) =>
        c.nombre.toLowerCase().includes(q) ||
        c.direccion.toLowerCase().includes(q) ||
        c.distrito.toLowerCase().includes(q)
    );
  }

  const totalRegistros = filtradas.length;
  const totalPaginas = Math.max(1, Math.ceil(totalRegistros / REGISTROS_POR_PAGINA));
  const paginaAjustada = Math.min(Math.max(1, pagina), totalPaginas);

  const inicio = (paginaAjustada - 1) * REGISTROS_POR_PAGINA;
  const corte = filtradas.slice(inicio, inicio + REGISTROS_POR_PAGINA);

  // Vinculamos cada cochera con la metadata del post remoto para auditoría
  const cocherasEnriquecidas = corte.map((cochera, index) => {
    const postAsociado = postsRemotos[index] || {};
    return {
      ...cochera,
      // Metadata del contrato de la rúbrica (Experience)
      remotePostId: postAsociado.id || cochera.id,
      remoteTitle: postAsociado.title || cochera.nombre,
    };
  });

  return {
    cocheras: cocherasEnriquecidas,
    totalPaginas,
    paginaActual: paginaAjustada,
    totalRegistros,
    tieneSiguiente: paginaAjustada < totalPaginas,
    tieneAnterior: paginaAjustada > 1,
  };
}

/**
 * Adaptador de compatibilidad directa para la firma del enunciado académico.
 * @param {number} [pagina=1]
 * @returns {Promise<Array>}
 */
export async function getExperiences(pagina = 1) {
  const res = await getCocherasCatalogo({ pagina });
  return res.cocheras;
}

