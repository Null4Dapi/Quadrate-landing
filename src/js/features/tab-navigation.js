/**
 * Quadrate pe — Feature: Navegación por Pestañas y Enlaces Directos (Tab Navigation)
 * Conmutación de vistas, scroll suave para anclas del header y formulario de afiliación.
 */

import { registrarAfiliacionCochera } from "../services/api.js";

const PATRON_CORREO_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PATRON_TELEFONO_VALIDO = /^[0-9+() -]{7,15}$/;

/**
 * Inicializa la navegación por pestañas y el desplazamiento suave para accesos directos.
 */
export function inicializarNavegacionPestanas() {
  const vistaConductores = document.getElementById("vista-conductores");
  const vistaLive = document.getElementById("vista-live");
  const vistaAfiliacion = document.getElementById("vista-afiliacion");
  const tabConductores = document.getElementById("tab-conductores");
  const tabLive = document.getElementById("tab-live");
  const tabAfiliar = document.getElementById("tab-afiliar");

  if (!vistaConductores || !vistaAfiliacion) {
    return;
  }

  /**
   * Conmuta la pestaña activa entre la vista principal, Quadrate Live y afiliación.
   * @param {"conductores" | "live" | "afiliacion"} identificador
   * @param {boolean} actualizarHash
   * @param {boolean} desplazarAlInicio
   */
  function conmutarPestana(identificador, actualizarHash = true, desplazarAlInicio = true) {
    const esConductores = identificador === "conductores";
    const esLive = identificador === "live";
    const esAfiliacion = identificador === "afiliacion";

    vistaConductores.hidden = !esConductores;
    if (vistaLive) {
      vistaLive.hidden = !esLive;
    }
    vistaAfiliacion.hidden = !esAfiliacion;

    if (tabConductores) {
      tabConductores.setAttribute("aria-selected", esConductores ? "true" : "false");
      tabConductores.classList.toggle("header__nav-link--active", esConductores);
    }

    if (tabLive) {
      tabLive.setAttribute("aria-selected", esLive ? "true" : "false");
      tabLive.classList.toggle("header__nav-link--active", esLive);
    }

    if (tabAfiliar) {
      tabAfiliar.setAttribute("aria-selected", esAfiliacion ? "true" : "false");
      tabAfiliar.classList.toggle("header__nav-link--active", esAfiliacion);
    }

    if (actualizarHash) {
      if (esAfiliacion) {
        if (window.location.hash !== "#afiliar-cochera") {
          window.location.hash = "afiliar-cochera";
        }
      } else if (esLive) {
        if (window.location.hash !== "#live") {
          window.location.hash = "live";
        }
      } else if (window.location.hash === "#afiliar-cochera" || window.location.hash === "#live") {
        window.history.pushState(null, "", window.location.pathname);
      }
    }

    if (desplazarAlInicio) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  // Delegación de eventos para disparadores específicos de vista (data-tab-target)
  document.querySelectorAll("[data-tab-target]").forEach((disparador) => {
    disparador.addEventListener("click", (evento) => {
      const objetivo = disparador.getAttribute("data-tab-target");
      if (objetivo === "afiliacion") {
        evento.preventDefault();
        conmutarPestana("afiliacion", true, true);
      } else if (objetivo === "live") {
        evento.preventDefault();
        conmutarPestana("live", true, true);
      } else if (objetivo === "conductores") {
        const href = disparador.getAttribute("href");
        if (!href || href === "#" || href === "#conductores") {
          evento.preventDefault();
          conmutarPestana("conductores", true, true);
        }
      }
    });
  });

  // Manejo de accesos directos por ancla (#conductores, #app, #tarifas, #)
  document.querySelectorAll('a[href^="#"]').forEach((enlace) => {
    enlace.addEventListener("click", (evento) => {
      const destinoHash = enlace.getAttribute("href");

      if (destinoHash === "#afiliar-cochera") {
        evento.preventDefault();
        conmutarPestana("afiliacion", true, true);
        return;
      }

      if (destinoHash === "#live") {
        evento.preventDefault();
        conmutarPestana("live", true, true);
        return;
      }

      // Si estábamos en otra pestaña, volver a conductores para navegar anclas
      if (vistaConductores.hidden) {
        conmutarPestana("conductores", false, false);
      }

      if (destinoHash && destinoHash !== "#") {
        const elementoDestino = document.querySelector(destinoHash);
        if (elementoDestino) {
          evento.preventDefault();
          elementoDestino.scrollIntoView({ behavior: "smooth" });
          window.history.pushState(null, "", destinoHash);
        }
      } else if (destinoHash === "#") {
        evento.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
        window.history.pushState(null, "", window.location.pathname);
      }
    });
  });

  // Sincronizar estado inicial y cambio manual de hash en el historial
  window.addEventListener("hashchange", () => {
    if (window.location.hash === "#afiliar-cochera") {
      conmutarPestana("afiliacion", false, true);
    } else if (window.location.hash === "#live") {
      conmutarPestana("live", false, true);
    } else {
      conmutarPestana("conductores", false, false);
    }
  });

  if (window.location.hash === "#afiliar-cochera") {
    conmutarPestana("afiliacion", false, false);
  } else if (window.location.hash === "#live") {
    conmutarPestana("live", false, false);
  }

  // Inicializar formulario de afiliación integrado
  const formulario = vistaAfiliacion.querySelector(".affiliation-view__form");
  if (formulario instanceof HTMLFormElement) {
    configurarFormularioAfiliacion(formulario);
  }
}

/**
 * Configura la validación y envío del formulario integrado de afiliación.
 * @param {HTMLFormElement} formulario
 */
function configurarFormularioAfiliacion(formulario) {
  const botonEnvio = formulario.querySelector(".affiliation-view__submit");
  const contenedorFeedback = formulario.querySelector(".affiliation-view__feedback");

  formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    limpiarFeedback(contenedorFeedback);

    const formData = new FormData(formulario);
    const datos = {
      nombre: (formData.get("nombre") || "").toString().trim(),
      cochera: (formData.get("cochera") || "").toString().trim(),
      correo: (formData.get("correo") || "").toString().trim(),
      telefono: (formData.get("telefono") || "").toString().trim(),
      distrito: (formData.get("distrito") || "").toString().trim(),
      plazas: parseInt((formData.get("plazas") || "0").toString(), 10) || null,
    };

    const mensajeError = validarDatosAfiliacion(datos);
    if (mensajeError) {
      desplegarFeedback(contenedorFeedback, mensajeError, "error");
      return;
    }

    if (botonEnvio) {
      botonEnvio.disabled = true;
      botonEnvio.textContent = "Procesando solicitud...";
    }

    try {
      const respuesta = await registrarAfiliacionCochera(datos);
      if (respuesta.exito) {
        desplegarFeedback(contenedorFeedback, respuesta.mensaje, "exito");
        formulario.reset();
      } else {
        desplegarFeedback(contenedorFeedback, respuesta.mensaje, "error");
      }
    } catch {
      desplegarFeedback(
        contenedorFeedback,
        "No pudimos procesar tu solicitud en este momento. Intentá nuevamente.",
        "error"
      );
    } finally {
      if (botonEnvio) {
        botonEnvio.disabled = false;
        botonEnvio.textContent = "Enviar solicitud de afiliación";
      }
    }
  });
}

function validarDatosAfiliacion(datos) {
  if (!datos.nombre || datos.nombre.length < 3) {
    return "Por favor ingresá un nombre y apellido válido.";
  }
  if (!datos.cochera || datos.cochera.length < 3) {
    return "Por favor ingresá el nombre de tu cochera o playa.";
  }
  if (!datos.correo || !PATRON_CORREO_VALIDO.test(datos.correo)) {
    return "Por favor ingresá un correo electrónico válido.";
  }
  if (!datos.telefono || !PATRON_TELEFONO_VALIDO.test(datos.telefono)) {
    return "Por favor ingresá un número de teléfono o WhatsApp válido (al menos 7 dígitos).";
  }
  if (!datos.distrito) {
    return "Por favor seleccioná el distrito de Lima donde opera tu cochera.";
  }
  return null;
}

function desplegarFeedback(contenedor, mensaje, tipo) {
  if (!contenedor) return;
  contenedor.textContent = mensaje;
  contenedor.className = `affiliation-view__feedback affiliation-view__feedback--${tipo}`;
}

function limpiarFeedback(contenedor) {
  if (!contenedor) return;
  contenedor.textContent = "";
  contenedor.className = "affiliation-view__feedback";
}
