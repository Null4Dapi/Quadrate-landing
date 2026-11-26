/**
 * Quadrate pe — Efecto Typewriter para Título del Hero
 * Animación de tipeado carácter por carácter con alternancia de frases en bucle:
 * Frase 1: "Sin vueltas" / "y pago exacto."
 * Frase 2: "BUSCA, QUADRA" / "Y LISTO."
 * Intervalo de tipeado: 100 ms exactos con estados de escritura y borrado.
 */

/**
 * Inicializa la animación de tipeado cíclica en las líneas del Hero.
 * @returns {(() => void) | undefined} Función de limpieza del temporizador.
 */
export function inicializarTypewriter() {
  const elementoLinea1 = document.querySelector(".hero__title-line--primary");
  const elementoLinea2 = document.querySelector(".hero__title-line--accent");

  if (!elementoLinea1 || !elementoLinea2) {
    return;
  }

  // Respeto estricto a accesibilidad y movimiento reducido
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  const FRASES = [
    {
      linea1: elementoLinea1.textContent.trim() || "Sin vueltas",
      linea2: elementoLinea2.textContent.trim() || "y pago exacto.",
    },
    {
      linea1: "BUSCA, QUADRA",
      linea2: "Y LISTO.",
    },
  ];

  // Elemento cursor visual accesible
  const cursor = document.createElement("span");
  cursor.className = "hero__cursor";
  cursor.setAttribute("aria-hidden", "true");

  let indiceFrase = 0;
  let estado = "borrando"; // Inicia con el texto ya completo y visible
  let indiceLinea = 2; // Inicia al final de la segunda línea
  let longitudActual = FRASES[0].linea2.length;
  let temporizador = null;

  const INTERVALO_TIPEADO = 90; // ms por carácter
  const PAUSA_TEXTO_COMPLETO = 3500; // ms de lectura cómoda antes de iniciar rotación
  const PAUSA_TEXTO_VACIO = 400; // ms de espera antes de cambiar a la siguiente frase

  // Mantenemos el contenido ya renderizado y anexamos el cursor al final
  elementoLinea2.appendChild(cursor);

  function ejecutarPasoTipeado() {
    const fraseActual = FRASES[indiceFrase];

    if (estado === "escribiendo") {
      if (indiceLinea === 1) {
        longitudActual++;
        elementoLinea1.textContent = fraseActual.linea1.slice(0, longitudActual);
        elementoLinea1.appendChild(cursor);

        if (longitudActual >= fraseActual.linea1.length) {
          indiceLinea = 2;
          longitudActual = 0;
        }
        temporizador = setTimeout(ejecutarPasoTipeado, INTERVALO_TIPEADO);
      } else {
        longitudActual++;
        elementoLinea2.textContent = fraseActual.linea2.slice(0, longitudActual);
        elementoLinea2.appendChild(cursor);

        if (longitudActual >= fraseActual.linea2.length) {
          estado = "borrando";
          temporizador = setTimeout(ejecutarPasoTipeado, PAUSA_TEXTO_COMPLETO);
        } else {
          temporizador = setTimeout(ejecutarPasoTipeado, INTERVALO_TIPEADO);
        }
      }
    } else if (estado === "borrando") {
      if (indiceLinea === 2) {
        longitudActual--;
        elementoLinea2.textContent = fraseActual.linea2.slice(0, longitudActual);
        elementoLinea2.appendChild(cursor);

        if (longitudActual <= 0) {
          elementoLinea2.textContent = "";
          indiceLinea = 1;
          longitudActual = fraseActual.linea1.length;
          elementoLinea1.appendChild(cursor);
        }
        temporizador = setTimeout(ejecutarPasoTipeado, INTERVALO_TIPEADO);
      } else {
        longitudActual--;
        elementoLinea1.textContent = fraseActual.linea1.slice(0, longitudActual);
        elementoLinea1.appendChild(cursor);

        if (longitudActual <= 0) {
          elementoLinea1.textContent = "";
          estado = "escribiendo";
          indiceFrase = (indiceFrase + 1) % FRASES.length;
          indiceLinea = 1;
          longitudActual = 0;
          temporizador = setTimeout(ejecutarPasoTipeado, PAUSA_TEXTO_VACIO);
        } else {
          temporizador = setTimeout(ejecutarPasoTipeado, INTERVALO_TIPEADO);
        }
      }
    }
  }

  temporizador = setTimeout(ejecutarPasoTipeado, PAUSA_TEXTO_COMPLETO);

  return () => {
    if (temporizador) {
      clearTimeout(temporizador);
    }
    if (cursor.parentElement) {
      cursor.remove();
    }
  };
}
