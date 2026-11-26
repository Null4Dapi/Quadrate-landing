import {
  obtenerTemaGuardado,
  aplicarTemaDOM,
  emitirCambioTema,
  suscribirCambiosTema,
} from "../utils/theme.js";

/**
 * Quadrate pe — Conmutador de Modo Claro / Modo Oscuro
 * Permite al usuario alternar entre tema diurno y nocturno en toda la web.
 * Persiste la preferencia en localStorage y sincroniza la accesibilidad aria.
 */
export function inicializarConmutadorTema() {
  const botonToggle = document.getElementById("tema-toggle");
  if (!botonToggle) return;

  function actualizarAria(tema) {
    if (tema === "dark") {
      botonToggle.setAttribute("aria-label", "Tema actual: oscuro. Cambiar a modo claro");
      botonToggle.setAttribute("title", "Tema actual: oscuro. Clic para cambiar a modo claro");
    } else {
      botonToggle.setAttribute("aria-label", "Tema actual: claro. Cambiar a modo oscuro");
      botonToggle.setAttribute("title", "Tema actual: claro. Clic para cambiar a modo oscuro");
    }
  }

  function sincronizarUI(tema) {
    aplicarTemaDOM(tema);
    actualizarAria(tema);
  }

  // Estado inicial
  const temaInicial = obtenerTemaGuardado();
  sincronizarUI(temaInicial);

  // Escuchar clics en el botón
  botonToggle.addEventListener("click", () => {
    const temaActual = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
    const siguienteTema = temaActual === "dark" ? "light" : "dark";
    emitirCambioTema(siguienteTema);
    actualizarAria(siguienteTema);
  });

  // Escuchar cambios de tema originados en otras pestañas o en la demo
  suscribirCambiosTema((nuevoTema) => {
    actualizarAria(nuevoTema);
  });
}
