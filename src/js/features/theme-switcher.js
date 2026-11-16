/**
 * Quadrate pe — Conmutador de Modo Claro / Modo Oscuro
 * Permite al usuario alternar entre tema diurno y nocturno en toda la web.
 * Persiste la preferencia en localStorage y sincroniza la accesibilidad aria.
 */

export function inicializarConmutadorTema() {
  const botonToggle = document.getElementById("tema-toggle");
  if (!botonToggle) return;

  function obtenerTemaActual() {
    return (
      document.documentElement.getAttribute("data-theme") ||
      localStorage.getItem("quadrate_theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
    );
  }

  function aplicarTema(tema) {
    if (tema === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
      botonToggle.setAttribute("aria-label", "Tema actual: oscuro. Cambiar a modo claro");
      botonToggle.setAttribute("title", "Tema actual: oscuro. Clic para cambiar a modo claro");
    } else {
      document.documentElement.removeAttribute("data-theme");
      botonToggle.setAttribute("aria-label", "Tema actual: claro. Cambiar a modo oscuro");
      botonToggle.setAttribute("title", "Tema actual: claro. Clic para cambiar a modo oscuro");
    }
    try {
      localStorage.setItem("quadrate_theme", tema);
      localStorage.setItem("quadrate_tema", tema === "dark" ? "oscuro" : "claro");
    } catch {}
  }

  // Sincronizar estado inicial
  aplicarTema(obtenerTemaActual());

  botonToggle.addEventListener("click", () => {
    const temaActual = obtenerTemaActual();
    const siguienteTema = temaActual === "dark" ? "light" : "dark";
    aplicarTema(siguienteTema);
  });
}
