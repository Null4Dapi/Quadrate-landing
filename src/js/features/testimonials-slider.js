/**
 * Quadrate pe — Feature Slider de Testimonios
 * Gestiona el carrusel editorial de experiencias reales estilo Orbix Studio,
 * con controles por flechas, puntos de paginación y pausa al enfocar.
 */

/**
 * Inicializa el carrusel de testimonios en la sección de Manifiesto.
 */
export function inicializarSliderTestimonios() {
  const seccion = document.getElementById("manifiesto");
  if (!seccion) {
    return;
  }

  const track = seccion.querySelector(".manifesto__track");
  const slides = Array.from(seccion.querySelectorAll(".manifesto__slide"));
  const dots = Array.from(seccion.querySelectorAll(".manifesto__dot"));
  const btnAnterior = seccion.querySelector("[data-accion='anterior']");
  const btnSiguiente = seccion.querySelector("[data-accion='siguiente']");

  if (!track || slides.length === 0) {
    return;
  }

  let indiceActivo = 0;
  let idIntervalo = null;
  const INTERVALO_AUTOPLAY = 5500;

  function irADiapositiva(nuevoIndice) {
    indiceActivo = (nuevoIndice + slides.length) % slides.length;
    track.style.transform = `translateX(-${indiceActivo * 100}%)`;

    dots.forEach((dot, idx) => {
      const activo = idx === indiceActivo;
      dot.classList.toggle("manifesto__dot--active", activo);
      dot.setAttribute("aria-selected", activo ? "true" : "false");
      dot.setAttribute("tabindex", activo ? "0" : "-1");
    });

    slides.forEach((slide, idx) => {
      const activo = idx === indiceActivo;
      slide.setAttribute("aria-hidden", activo ? "false" : "true");
    });
  }

  function siguiente() {
    irADiapositiva(indiceActivo + 1);
  }

  function anterior() {
    irADiapositiva(indiceActivo - 1);
  }

  function iniciarAutoplay() {
    detenerAutoplay();
    idIntervalo = setInterval(siguiente, INTERVALO_AUTOPLAY);
  }

  function detenerAutoplay() {
    if (idIntervalo) {
      clearInterval(idIntervalo);
      idIntervalo = null;
    }
  }

  // Eventos de botones
  if (btnSiguiente) {
    btnSiguiente.addEventListener("click", () => {
      siguiente();
      iniciarAutoplay();
    });
  }

  if (btnAnterior) {
    btnAnterior.addEventListener("click", () => {
      anterior();
      iniciarAutoplay();
    });
  }

  // Eventos de dots
  dots.forEach((dot, idx) => {
    dot.addEventListener("click", () => {
      irADiapositiva(idx);
      iniciarAutoplay();
    });
  });

  // Pausa en hover y foco
  seccion.addEventListener("mouseenter", detenerAutoplay);
  seccion.addEventListener("mouseleave", iniciarAutoplay);
  seccion.addEventListener("focusin", detenerAutoplay);
  seccion.addEventListener("focusout", iniciarAutoplay);

  // Navegación por teclado accesible restringida a los controles del slider
  const zonaControles = seccion.querySelector(".manifesto__controls");
  if (zonaControles) {
    zonaControles.addEventListener("keydown", (evento) => {
      if (evento.key === "ArrowLeft") {
        evento.preventDefault();
        anterior();
        dots[indiceActivo]?.focus();
        iniciarAutoplay();
      } else if (evento.key === "ArrowRight") {
        evento.preventDefault();
        siguiente();
        dots[indiceActivo]?.focus();
        iniciarAutoplay();
      }
    });
  }

  irADiapositiva(0);
  iniciarAutoplay();
}
