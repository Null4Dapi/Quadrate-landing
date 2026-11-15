/**
 * src/features/catalog/api.js
 * Módulo de acceso a datos para el catálogo de cocheras y experiencias interactivas.
 * Consume la API REST paginada de JSONPlaceholder con límite de 6 registros por página.
 */

/**
 * @typedef {Object} Experience
 * @property {number} userId
 * @property {number} id
 * @property {string} title
 * @property {string} body
 */

const URL_BASE_CATALOGO = "https://jsonplaceholder.typicode.com/posts";
const ELEMENTOS_POR_PAGINA = 6;

/**
 * Obtiene la lista paginada de experiencias/cocheras desde la API remota.
 * @param {number} [pagina=1] - Número de página actual (índice 1-based).
 * @returns {Promise<Experience[]>} Promesa con el listado de 6 registros.
 * @throws {Error} Si la respuesta HTTP no es exitosa (response.ok === false).
 */
export async function getExperiences(pagina = 1) {
  const url = `${URL_BASE_CATALOGO}?_page=${pagina}&_limit=${ELEMENTOS_POR_PAGINA}`;
  const respuesta = await fetch(url);

  if (!respuesta.ok) {
    throw new Error(
      `Error de red (${respuesta.status}): No se pudo cargar el catálogo de experiencias`
    );
  }

  return respuesta.json();
}
