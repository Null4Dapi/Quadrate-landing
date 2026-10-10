/**
 * Quadrate pe — Cabecera Adaptativa
 * Ajusta el color de fondo y contraste de la barra superior según la sección activa bajo ella.
 */

/**
 * Determina si un valor de color RGB/RGBA corresponde a un tono oscuro.
 * @param {string} colorRgb - Cadena en formato rgb(r, g, b) o rgba(r, g, b, a).
 * @returns {boolean} Verdadero si la luminancia es menor a 128.
 */
function evaluarSiColorEsOscuro(colorRgb) {
  const componentes = colorRgb.match(/\d+/g);
  if (!componentes || componentes.length < 3) {
    return false;
  }

  const [rojo, verde, azul] = componentes.map(Number);
  const luminancia = (rojo * 299 + verde * 587 + azul * 114) / 1000;
  return luminancia < 128;
}

/**
 * Obtiene el color de fondo visible efectivo de un elemento recorriendo hacia arriba si es transparente.
 * @param {HTMLElement} elemento - Elemento del DOM a inspeccionar.
 * @returns {string} Valor de color en formato rgb(...) o fallback base.
 */
function obtenerColorFondoEfectivo(elemento) {
  let elementoActual = elemento;

  while (elementoActual && elementoActual !== document.documentElement) {
    const estilo = window.getComputedStyle(elementoActual);
    const colorFondo = estilo.backgroundColor;

    if (
      colorFondo &&
      colorFondo !== "transparent" &&
      colorFondo !== "rgba(0, 0, 0, 0)"
    ) {
      return colorFondo;
    }

    elementoActual = elementoActual.parentElement;
  }

  return "rgb(244, 244, 244)";
}

/**
 * Inicializa el observador de desplazamiento para sincronizar el fondo de la cabecera.
 */
export function inicializarCabeceraAdaptativa() {
  const elementoCabecera = document.querySelector(".header");
  const listaSecciones = Array.from(
    document.querySelectorAll("#vista-conductores > section, #vista-afiliacion, footer.footer")
  );

  if (!elementoCabecera || listaSecciones.length === 0) {
    return;
  }

  let mapaDatosSecciones = [];
  let seccionPrevia = null;
  let animacionEnCurso = false;

  /**
   * Recopila y cachea los colores de fondo computados de cada sección.
   */
  function actualizarCacheSecciones() {
    mapaDatosSecciones = listaSecciones.map((seccion) => {
      const colorFondo = obtenerColorFondoEfectivo(seccion);
      const esOscuro = evaluarSiColorEsOscuro(colorFondo);
      return {
        elemento: seccion,
        colorFondo,
        esOscuro,
      };
    });
  }

  /**
   * Evalúa la sección que toca la cabecera y aplica el color correspondiente.
   */
  function sincronizarColorCabecera() {
    const rectCabecera = elementoCabecera.getBoundingClientRect();
    const puntoDisparoY = rectCabecera.bottom;

    const estaAlFinalDePagina =
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 4;

    let seccionActual = mapaDatosSecciones[0];

    if (estaAlFinalDePagina) {
      seccionActual = mapaDatosSecciones[mapaDatosSecciones.length - 1];
    } else {
      for (const datos of mapaDatosSecciones) {
        const rect = datos.elemento.getBoundingClientRect();
        if (rect.top <= puntoDisparoY && rect.bottom > puntoDisparoY) {
          seccionActual = datos;
          break;
        }
      }
    }

    if (seccionActual && seccionActual !== seccionPrevia) {
      seccionPrevia = seccionActual;
      elementoCabecera.style.backgroundColor = seccionActual.colorFondo;

      if (seccionActual.esOscuro) {
        elementoCabecera.classList.add("header--contrast");
      } else {
        elementoCabecera.classList.remove("header--contrast");
      }
    }

    actualizarEnlaceActivo();
    animacionEnCurso = false;
  }

  const enlacesNavegacion = Array.from(
    document.querySelectorAll(".header__nav-link[href^='#']")
  );

  /**
   * Actualiza la clase activa del enlace de navegación según la posición de scroll.
   */
  function actualizarEnlaceActivo() {
    const vistaAfiliacion = document.getElementById("vista-afiliacion");
    if (vistaAfiliacion && !vistaAfiliacion.hidden) {
      return;
    }

    let mejorEnlace = null;
    let mejorVisibilidad = 0;

    for (const enlace of enlacesNavegacion) {
      const hash = enlace.getAttribute("href");
      if (hash && hash !== "#") {
        const objetivo = document.querySelector(hash);
        if (objetivo) {
          const rect = objetivo.getBoundingClientRect();
          // Calcular cuánto de la sección es visible en la ventana
          const visibleTop = Math.max(0, rect.top);
          const visibleBottom = Math.min(window.innerHeight, rect.bottom);
          const visibleHeight = Math.max(0, visibleBottom - visibleTop);

          if (visibleHeight > mejorVisibilidad) {
            mejorVisibilidad = visibleHeight;
            mejorEnlace = enlace;
          }
        }
      }
    }

    if (mejorEnlace) {
      enlacesNavegacion.forEach((l) =>
        l.classList.remove("header__nav-link--active")
      );
      mejorEnlace.classList.add("header__nav-link--active");
    }
  }

  /**
   * Manejador de evento scroll optimizado mediante requestAnimationFrame.
   */
  function manejarDesplazamiento() {
    if (!animacionEnCurso) {
      animacionEnCurso = true;
      window.requestAnimationFrame(sincronizarColorCabecera);
    }
  }

  /**
   * Manejador de evento resize para recalcular colores y dimensiones.
   */
  function manejarRedimension() {
    actualizarCacheSecciones();
    manejarDesplazamiento();
  }

  actualizarCacheSecciones();
  sincronizarColorCabecera();

  window.addEventListener("scroll", manejarDesplazamiento, { passive: true });
  window.addEventListener("resize", manejarRedimension, { passive: true });
}
