/**
 * Quadrate pe — Feature: Formulario de Lista de Espera
 * Lógica de validación, interacción accesible y envío asíncrono (ES Modules).
 */

import { registrarEnListaEspera } from "../services/api.js";
import { CONTENIDO_LANDING } from "../content.js";

/**
 * Expresión regular estándar para validación sintáctica de correo electrónico.
 */
const PATRON_CORREO_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Inicializa los eventos del formulario de lista de espera.
 */
export function inicializarFormularioListaEspera() {
  const formularioElemento = document.querySelector(".waitlist__form");
  if (!formularioElemento) {
    return;
  }

  formularioElemento.addEventListener("submit", manejarEnvioFormulario);
}

/**
 * Maneja el evento de envío del formulario.
 * @param {SubmitEvent} eventoEnvio
 */
async function manejarEnvioFormulario(eventoEnvio) {
  eventoEnvio.preventDefault();

  const formularioActual = eventoEnvio.currentTarget;
  if (!(formularioActual instanceof HTMLFormElement)) {
    return;
  }

  const botonEnvioElemento = formularioActual.querySelector(".waitlist__submit");
  const contenedorFeedbackElemento = formularioActual.querySelector(".waitlist__feedback");

  ocultarMensajeFeedback(contenedorFeedbackElemento);

  const datosFormulario = extraerValoresFormulario(formularioActual);
  const errorValidacion = validarDatosFormulario(datosFormulario);

  if (errorValidacion) {
    mostrarMensajeFeedback(contenedorFeedbackElemento, errorValidacion, "error");
    return;
  }

  establecerEstadoCarga(botonEnvioElemento, true);

  try {
    const respuestaServicio = await registrarEnListaEspera(datosFormulario);

    if (respuestaServicio.exito) {
      mostrarMensajeFeedback(
        contenedorFeedbackElemento,
        CONTENIDO_LANDING.formularioEspera.mensajeExito,
        "success"
      );
      formularioActual.reset();
    } else {
      mostrarMensajeFeedback(
        contenedorFeedbackElemento,
        respuestaServicio.mensaje || CONTENIDO_LANDING.formularioEspera.mensajeError,
        "error"
      );
    }
  } catch {
    mostrarMensajeFeedback(
      contenedorFeedbackElemento,
      CONTENIDO_LANDING.formularioEspera.mensajeError,
      "error"
    );
  } finally {
    establecerEstadoCarga(botonEnvioElemento, false);
  }
}

/**
 * Extrae los valores ingresados por el usuario en el formulario.
 * @param {HTMLFormElement} formulario
 * @returns {Object}
 */
function extraerValoresFormulario(formulario) {
  const objetoDatos = new FormData(formulario);
  return {
    nombreCompleto: (objetoDatos.get("nombre") || "").toString().trim(),
    correoElectronico: (objetoDatos.get("correo") || "").toString().trim(),
    rolSeleccionado: (objetoDatos.get("rol") || "").toString().trim(),
    detalleIdentificacion: (objetoDatos.get("detalle") || "").toString().trim(),
  };
}

/**
 * Valida los datos del formulario aplicando reglas de negocio.
 * @param {Object} datos
 * @returns {string | null} Mensaje de error o null si es válido.
 */
function validarDatosFormulario(datos) {
  if (!datos.nombreCompleto || datos.nombreCompleto.length < 3) {
    return "Por favor ingresá tu nombre completo (mínimo 3 caracteres).";
  }

  if (!datos.correoElectronico || !PATRON_CORREO_VALIDO.test(datos.correoElectronico)) {
    return "Por favor ingresá un correo electrónico válido.";
  }

  if (!datos.rolSeleccionado) {
    return "Por favor seleccioná tu tipo de usuario (Conductor o Playa de Estacionamiento).";
  }

  return null;
}

/**
 * Alterna el estado visual y funcional del botón de envío.
 * @param {Element | null} botonElemento
 * @param {boolean} estaCargando
 */
function establecerEstadoCarga(botonElemento, estaCargando) {
  if (!(botonElemento instanceof HTMLButtonElement)) {
    return;
  }

  botonElemento.disabled = estaCargando;
  botonElemento.textContent = estaCargando
    ? "Procesando registro..."
    : CONTENIDO_LANDING.formularioEspera.campos.botonEnvio;
}

/**
 * Muestra el mensaje accesible de feedback al usuario.
 * @param {Element | null} contenedorElemento
 * @param {string} mensajeTexto
 * @param {"success" | "error"} tipoMensaje
 */
function mostrarMensajeFeedback(contenedorElemento, mensajeTexto, tipoMensaje) {
  if (!(contenedorElemento instanceof HTMLElement)) {
    return;
  }

  contenedorElemento.textContent = mensajeTexto;
  contenedorElemento.className = "waitlist__feedback waitlist__feedback--visible";

  if (tipoMensaje === "success") {
    contenedorElemento.classList.add("waitlist__feedback--success");
  } else {
    contenedorElemento.classList.add("waitlist__feedback--error");
  }
}

/**
 * Oculta el mensaje de feedback previo.
 * @param {Element | null} contenedorElemento
 */
function ocultarMensajeFeedback(contenedorElemento) {
  if (!(contenedorElemento instanceof HTMLElement)) {
    return;
  }

  contenedorElemento.textContent = "";
  contenedorElemento.className = "waitlist__feedback";
}
