/**
 * Quadrate pe — Punto de Entrada (página única product-first)
 * Asigna content.js al esqueleto HTML (data-texto / data-placeholder) y conecta
 * los features nativos que sobreviven: menú móvil, cabecera adaptativa y
 * formulario de lista de espera.
 */

import { inicializarMenuMovil } from "./features/mobile-menu.js";
import { inicializarFormularioListaEspera } from "./features/waitlist.js";
import { inicializarCabeceraAdaptativa } from "./features/adaptive-header.js";
import { CONTENIDO_LANDING } from "./content.js";
import { CONFIGURACION_APP } from "./config.js";

/**
 * Resuelve una ruta de claves ("modulos.filas.0.nombre") dentro del contenido.
 * @param {string} rutaClaves
 * @returns {string | undefined}
 */
function resolverRutaContenido(rutaClaves) {
  return rutaClaves.split(".").reduce(
    (valor, clave) => (valor instanceof Object ? valor[clave] : undefined),
    CONTENIDO_LANDING
  );
}

/**
 * Renderiza el copy de content.js sobre el esqueleto semántico del HTML.
 */
function renderizarContenido() {
  for (const nodo of document.querySelectorAll("[data-texto]")) {
    const valor = resolverRutaContenido(nodo.dataset.texto);
    if (typeof valor === "string") nodo.textContent = valor;
  }
  for (const campo of document.querySelectorAll("[data-placeholder]")) {
    const valor = resolverRutaContenido(campo.dataset.placeholder);
    if (typeof valor === "string") campo.setAttribute("placeholder", valor);
  }
}

/**
 * Versión única: la metainformación del pie la compone config.js.
 */
function renderizarMetaVersion() {
  const metaPie = document.querySelector("[data-meta='version']");
  if (metaPie) {
    metaPie.textContent = `${CONTENIDO_LANDING.piePagina.meta} · v${CONFIGURACION_APP.VERSION}`;
  }
}

/**
 * Función orquestadora de inicio de la página única.
 */
function arrancarAplicacion() {
  renderizarContenido();
  renderizarMetaVersion();
  inicializarMenuMovil();
  inicializarFormularioListaEspera();
  inicializarCabeceraAdaptativa();
  console.info(
    `[${CONFIGURACION_APP.NOMBRE_PROYECTO}] Página product-first inicializada · v${CONFIGURACION_APP.VERSION}`
  );
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", arrancarAplicacion, { once: true });
} else {
  arrancarAplicacion();
}
