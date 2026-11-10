/**
 * Quadrate pe — Pila Reactiva de Tarifas (Rates Stack)
 * Controla el efecto de cobertura (--rates-covered) de tarjetas apilables
 * y sincroniza el indicador de progreso lateral durante el desplazamiento.
 */

/**
 * Inicializa la reactividad de la pila de tarifas en la landing.
 */
export function inicializarPilaTarifas() {
  const contenedorSeccion = document.getElementById("tarifas");
  if (!contenedorSeccion) {
    return;
  }

  const listaTarjetas = Array.from(
    contenedorSeccion.querySelectorAll(".rates__card")
  );
  const listaIndicadores = Array.from(
    contenedorSeccion.querySelectorAll(".rates__progress-item")
  );

  if (listaTarjetas.length === 0) {
    return;
  }

  let animacionEnCurso = false;
  let ultimoIndiceActivo = -1;
  const mapaCoberturaPrevia = new Map();

  const prefiereMovimientoReducido = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /**
   * Obtiene las variables numéricas computadas de la sección (--rates-top y --rates-step).
   * @returns {{ distanciaSuperior: number, pasoEscalon: number }}
   */
  function obtenerMetricasCss() {
    const estiloComputado = window.getComputedStyle(contenedorSeccion);
    const distanciaSuperiorStr = estiloComputado
      .getPropertyValue("--rates-top")
      .trim();
    const pasoEscalonStr = estiloComputado
      .getPropertyValue("--rates-step")
      .trim();

    const distanciaSuperior = parseFloat(distanciaSuperiorStr) || 96;
    const pasoEscalon = parseFloat(pasoEscalonStr) || 56;

    return { distanciaSuperior, pasoEscalon };
  }

  /**
   * Sincroniza la clase o atributo data-active en la lista de progreso lateral.
   * @param {number} nuevoIndiceActivo
   */
  function actualizarProgresoLateral(nuevoIndiceActivo) {
    if (nuevoIndiceActivo === ultimoIndiceActivo) {
      return;
    }
    ultimoIndiceActivo = nuevoIndiceActivo;

    listaIndicadores.forEach((indicador, indice) => {
      if (indice === nuevoIndiceActivo) {
        indicador.setAttribute("data-active", "");
      } else {
        indicador.removeAttribute("data-active");
      }
    });
  }

  /**
   * Calcula la cobertura y el estado de apilamiento en cada cuadro de animación.
   */
  function calcularApilamientoTarjetas() {
    const { distanciaSuperior, pasoEscalon } = obtenerMetricasCss();
    const totalTarjetas = listaTarjetas.length;
    let indiceTarjetaEnFoco = 0;

    for (let indice = 0; indice < totalTarjetas; indice++) {
      const tarjetaActual = listaTarjetas[indice];
      const tarjetaSiguiente = listaTarjetas[indice + 1];
      const rectActual = tarjetaActual.getBoundingClientRect();
      const puntoStickyActual = distanciaSuperior + indice * pasoEscalon;

      // Determinamos cuál tarjeta ha alcanzado su anclaje sticky
      if (rectActual.top <= puntoStickyActual + 12) {
        indiceTarjetaEnFoco = indice;
      }

      // Si el usuario prefiere movimiento reducido, no calculamos transformaciones
      if (prefiereMovimientoReducido) {
        continue;
      }

      let factorCobertura = 0;

      if (tarjetaSiguiente) {
        const rectSiguiente = tarjetaSiguiente.getBoundingClientRect();
        const puntoStickySiguiente = distanciaSuperior + (indice + 1) * pasoEscalon;

        const inicioSolapamiento = rectActual.bottom;
        const finSolapamiento = puntoStickySiguiente;
        const recorridoTotal = inicioSolapamiento - finSolapamiento;

        if (recorridoTotal > 0) {
          const distanciaRecorrida = inicioSolapamiento - rectSiguiente.top;
          factorCobertura = Math.max(0, Math.min(1, distanciaRecorrida / recorridoTotal));
        }
      }

      // Optimización: solo modificar el DOM si el valor varía significativamente
      const valorPrevio = mapaCoberturaPrevia.get(tarjetaActual) ?? -1;
      if (Math.abs(factorCobertura - valorPrevio) > 0.005) {
        mapaCoberturaPrevia.set(tarjetaActual, factorCobertura);
        tarjetaActual.style.setProperty(
          "--rates-covered",
          factorCobertura.toFixed(3)
        );
      }
    }

    actualizarProgresoLateral(indiceTarjetaEnFoco);
    animacionEnCurso = false;
  }

  /**
   * Manejador de evento scroll throttled mediante requestAnimationFrame.
   */
  function manejarDesplazamiento() {
    if (!animacionEnCurso) {
      animacionEnCurso = true;
      window.requestAnimationFrame(calcularApilamientoTarjetas);
    }
  }

  // Ejecución inicial para sincronizar el estado
  calcularApilamientoTarjetas();

  window.addEventListener("scroll", manejarDesplazamiento, { passive: true });
  window.addEventListener("resize", manejarDesplazamiento, { passive: true });
}
