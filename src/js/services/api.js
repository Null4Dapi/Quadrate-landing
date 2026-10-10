/**
 * Quadrate pe — Servicios de Red y API
 * Wrappers para llamadas de red (fetch) y simulación local para la versión 0.0.1.
 */

import { CONFIGURACION_APP, ENDPOINTS_API } from "../config.js";

/**
 * Simula el envío asíncrono del formulario de lista de espera con persistencia en localStorage.
 * @param {Object} datosRegistro
 * @param {string} datosRegistro.nombreCompleto
 * @param {string} datosRegistro.correoElectronico
 * @param {string} datosRegistro.rolSeleccionado
 * @param {string} [datosRegistro.detalleIdentificacion]
 * @returns {Promise<{ exito: boolean, mensaje: string, idRegistro?: string }>}
 */
export async function registrarEnListaEspera(datosRegistro) {
  // Simulación de latencia de red para validar experiencia de carga e INP
  await new Promise((resolver) => {
    setTimeout(resolver, CONFIGURACION_APP.SIMULAR_LATENCIA_RED_MS);
  });

  try {
    if (!datosRegistro.correoElectronico || !datosRegistro.nombreCompleto) {
      throw new Error("Datos requeridos incompletos.");
    }

    const registroConMetadatos = {
      ...datosRegistro,
      idRegistro: `WAIT-${Date.now().toString(36).toUpperCase()}`,
      fechaCreacion: new Date().toISOString(),
      versionCliente: CONFIGURACION_APP.VERSION,
    };

    // Almacenamiento local en navegador para simulación estática sin backend propio
    const registrosPrevios = obtenerRegistrosLocales();
    registrosPrevios.push(registroConMetadatos);
    guardarRegistrosLocales(registrosPrevios);

    return {
      exito: true,
      mensaje: "Registro completado con éxito.",
      idRegistro: registroConMetadatos.idRegistro,
    };
  } catch (error) {
    return {
      exito: false,
      mensaje: error instanceof Error ? error.message : "Error inesperado en el servicio.",
    };
  }
}

/**
 * Simula el envío asíncrono del formulario de afiliación de cocheras.
 * @param {Object} datosAfiliacion
 * @returns {Promise<{ exito: boolean, mensaje: string, idAfiliacion?: string }>}
 */
export async function registrarAfiliacionCochera(datosAfiliacion) {
  await new Promise((resolver) => {
    setTimeout(resolver, CONFIGURACION_APP.SIMULAR_LATENCIA_RED_MS);
  });

  try {
    if (!datosAfiliacion.nombre || !datosAfiliacion.correo || !datosAfiliacion.cochera) {
      throw new Error("Datos obligatorios incompletos.");
    }

    const registroConMetadatos = {
      ...datosAfiliacion,
      idAfiliacion: `PLAYA-${Date.now().toString(36).toUpperCase()}`,
      fechaCreacion: new Date().toISOString(),
      versionCliente: CONFIGURACION_APP.VERSION,
    };

    const registrosPrevios = obtenerAfiliacionesLocales();
    registrosPrevios.push(registroConMetadatos);
    guardarAfiliacionesLocales(registrosPrevios);

    return {
      exito: true,
      mensaje: "¡Solicitud recibida! Te contactaremos dentro de las 24 horas para coordinar la visita técnica.",
      idAfiliacion: registroConMetadatos.idAfiliacion,
    };
  } catch (error) {
    return {
      exito: false,
      mensaje: error instanceof Error ? error.message : "Error inesperado en el servicio de afiliación.",
    };
  }
}

/**
 * Obtiene las solicitudes de afiliación guardadas en localStorage.
 * @returns {Array<Object>}
 */
export function obtenerAfiliacionesLocales() {
  try {
    const datosSerializados = localStorage.getItem("quadrate_pe_afiliaciones");
    return datosSerializados ? JSON.parse(datosSerializados) : [];
  } catch {
    return [];
  }
}

/**
 * Guarda las solicitudes de afiliación en localStorage.
 * @param {Array<Object>} registros
 */
function guardarAfiliacionesLocales(registros) {
  try {
    localStorage.setItem("quadrate_pe_afiliaciones", JSON.stringify(registros));
  } catch {
    console.warn("No se pudo persistir en almacenamiento local.");
  }
}

/**
 * Obtiene los registros guardados localmente para propósitos de verificación.
 * @returns {Array<Object>}
 */
export function obtenerRegistrosLocales() {
  try {
    const datosSerializados = localStorage.getItem("quadrate_pe_lista_espera");
    return datosSerializados ? JSON.parse(datosSerializados) : [];
  } catch {
    return [];
  }
}

/**
 * Guarda los registros de lista de espera en localStorage.
 * @param {Array<Object>} registros
 */
function guardarRegistrosLocales(registros) {
  try {
    localStorage.setItem("quadrate_pe_lista_espera", JSON.stringify(registros));
  } catch {
    // Si localStorage no está disponible (modo incógnito estricto), se degrada silenciosamente
  }
}
