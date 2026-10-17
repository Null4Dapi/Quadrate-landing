/**
 * Quadrate pe — Punto de Entrada Principal
 * Inicialización de módulos e interacción en cliente (<80 líneas).
 */

import { inicializarCabeceraAdaptativa } from "./features/adaptive-header.js";
import { inicializarMenuMovil } from "./features/mobile-menu.js";
import { inicializarNavegacionPestanas } from "./features/tab-navigation.js";
import { inicializarQuadrateLive, inicializarCasetaTour } from "./react/quadrate-live.js";
import { CONFIGURACION_APP } from "./config.js";

/**
 * Función orquestadora de inicio de la aplicación.
 */
function arrancarAplicacion() {
  console.info(
    `[${CONFIGURACION_APP.NOMBRE_PROYECTO}] Inicializado v${CONFIGURACION_APP.VERSION} - Entorno React integrado`
  );

  inicializarCabeceraAdaptativa();
  inicializarMenuMovil();
  inicializarNavegacionPestanas();
  inicializarQuadrateLive();
  inicializarCasetaTour();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", arrancarAplicacion, { once: true });
} else {
  arrancarAplicacion();
}
