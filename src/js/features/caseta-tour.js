/**
 * Quadrate pe — Feature Tour Interactivo de Caseta
 * Orquesta la alternancia automatizada de características operativas
 * y sincronización de mockups SVG de caseta con intervalo optimizado (5.5s).
 */

const IMAGENES_MOCKUP = [
  "src/assets/caseta-mockup-checkin.svg",
  "src/assets/caseta-mockup-aforo.svg",
  "src/assets/caseta-mockup-valle.svg",
];

const INTERVALO_CAMBIO_MS = 5500;

/**
 * Inicializa el tour interactivo y automático de la caseta.
 */
export function inicializarTourCaseta() {
  const seccionCaseta = document.getElementById("como-funciona");
  if (!seccionCaseta) {
    return;
  }

  const items = Array.from(seccionCaseta.querySelectorAll(".caseta__item"));
  const visorImagen = seccionCaseta.querySelector(".caseta__image");

  if (items.length === 0 || !visorImagen) {
    return;
  }

  let indiceActivo = 0;
  let idIntervalo = null;
  let temporizadorTransicion = null;
  let pausadoPorUsuario = false;

  function actualizarVista(nuevoIndice) {
    if (nuevoIndice === indiceActivo && items[nuevoIndice].classList.contains("caseta__item--active")) {
      return;
    }

    indiceActivo = nuevoIndice;

    items.forEach((item, idx) => {
      const activo = idx === indiceActivo;
      item.classList.toggle("caseta__item--active", activo);
      item.setAttribute("aria-pressed", activo ? "true" : "false");
    });

    // Transición suave de la imagen de mockup
    visorImagen.classList.add("caseta__image--transitioning");
    if (temporizadorTransicion) {
      clearTimeout(temporizadorTransicion);
    }

    temporizadorTransicion = setTimeout(() => {
      visorImagen.src = IMAGENES_MOCKUP[indiceActivo] || IMAGENES_MOCKUP[0];
      visorImagen.classList.remove("caseta__image--transitioning");
    }, 180);
  }

  function avanzarSiguiente() {
    if (pausadoPorUsuario) return;
    const siguiente = (indiceActivo + 1) % items.length;
    actualizarVista(siguiente);
  }

  function iniciarCicloAutomatico() {
    detenerCicloAutomatico();
    idIntervalo = setInterval(avanzarSiguiente, INTERVALO_CAMBIO_MS);
  }

  function detenerCicloAutomatico() {
    if (idIntervalo) {
      clearInterval(idIntervalo);
      idIntervalo = null;
    }
  }

  // Interacción directa del usuario (clic o teclado)
  items.forEach((item, idx) => {
    item.addEventListener("click", () => {
      actualizarVista(idx);
      iniciarCicloAutomatico();
    });

    item.addEventListener("keydown", (evento) => {
      if (evento.key === "Enter" || evento.key === " ") {
        evento.preventDefault();
        actualizarVista(idx);
        iniciarCicloAutomatico();
      }
    });

    // Pausa temporal al posar el cursor o hacer foco en un elemento
    item.addEventListener("mouseenter", () => {
      pausadoPorUsuario = true;
    });
    item.addEventListener("mouseleave", () => {
      pausadoPorUsuario = false;
    });
    item.addEventListener("focusin", () => {
      pausadoPorUsuario = true;
    });
    item.addEventListener("focusout", () => {
      pausadoPorUsuario = false;
    });
  });

  // Estado inicial
  actualizarVista(0);
  iniciarCicloAutomatico();
}
