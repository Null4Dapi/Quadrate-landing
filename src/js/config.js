/**
 * Quadrate pe — Configuración Global
 * Constantes inmutables de la aplicación y endpoints para la versión 0.0.1.
 */

export const CONFIGURACION_APP = Object.freeze({
  NOMBRE_PROYECTO: "Quadrate pe",
  VERSION: "0.0.1",
  AMBITO_TERRITORIAL: "Lima Metropolitana, Perú",
  VENTANA_RESERVA_ETA_MINUTOS: 15,
  TIEMPO_MAXIMO_VALIDACION_SEGUNDOS: 3,
  LIMITE_TASA_SOLICITUDES_POR_MINUTO: 10,
  SIMULAR_LATENCIA_RED_MS: 750,
  CORREO_SOPORTE: "contacto@quadrate.pe",
  REDES_SOCIALES: Object.freeze({
    LINKEDIN: "https://www.linkedin.com/company/quadrate-pe",
    X: "https://x.com/quadrate_pe",
    INSTAGRAM: "https://instagram.com/quadrate.pe",
  }),
});

export const ENDPOINTS_API = Object.freeze({
  REGISTRO_LISTA_ESPERA: "/api/v1/lista-espera",
  CONSULTA_AFORO_PILOTO: "/api/v1/aforo-piloto",
  DESCARGA_APP_CONDUCTOR: "#descarga-conductor",
  DESCARGA_APP_CASETA: "#descarga-caseta",
});
