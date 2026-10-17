/**
 * Quadrate pe — Datos de Caseta para el Módulo React
 * Catálogo inmutable de características del panel de control de caseta.
 */

export const CARACTERISTICAS_CASETA = Object.freeze([
  Object.freeze({
    id: "checkin",
    titulo: "Check-in y Check-out en menos de 3 segundos",
    detalle:
      "Escaneo veloz de pases QR o registro instantáneo por placa vehicular con la cámara del dispositivo.",
    tag: "Lectura < 3s",
  }),
  Object.freeze({
    id: "aforo",
    titulo: "Control automático de aforo y plazas libres",
    detalle:
      "El sistema descuenta ingresos y libera plazas al egreso, evitando la saturación del local en portón.",
    tag: "Aforo en vivo",
  }),
  Object.freeze({
    id: "valle",
    titulo: "Monetización dinámica de franjas valle",
    detalle:
      "Tarifas promocionales en horarios de baja demanda para aumentar la rotación y rentabilidad.",
    tag: "Tarifas dinámicas",
  }),
]);

export default CARACTERISTICAS_CASETA;
