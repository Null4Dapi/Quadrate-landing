/**
 * simulador-reserva.js — Compilado para Navegador
 */
const React = window.React;
const { useState, useEffect, useRef } = React;

/**
 * Mejora Creativa: Simulador de Reserva Dinámica por ETA & Calculadora de Fraccionamiento.
 *
 * @param {Object} props
 * @param {Object} props.cochera - Cochera seleccionada
 * @param {Function} props.onCerrar - Función para cerrar el panel
 * @returns {JSX.Element}
 */
export function SimuladorReserva({
  cochera,
  onCerrar
}) {
  const [minutosPermanencia, setMinutosPermanencia] = useState(60);
  const [etaSeleccionado, setEtaSeleccionado] = useState(cochera.tiempoEstimadoLlegadaMinutos);
  const [paseGenerado, setPaseGenerado] = useState(null);
  const primeraHora = cochera.tarifaHora;
  const minutosExcedentes = Math.max(0, minutosPermanencia - 60);
  const cuartosDeHora = Math.ceil(minutosExcedentes / 15);
  const costoFracciones = cuartosDeHora * cochera.tarifaFraccion;
  const costoTotalEstimado = primeraHora + costoFracciones;
  const manejarGenerarReserva = () => {
    const pinAcceso = Math.floor(1000 + Math.random() * 9000);
    const codigoPase = `QP-${cochera.distrito.slice(0, 3).toUpperCase()}-${pinAcceso}`;
    setPaseGenerado({
      codigo: codigoPase,
      pin: pinAcceso,
      venceEnMinutos: 15,
      plazaAsignada: `Lote ${String.fromCharCode(65 + Math.floor(Math.random() * 4))}-${Math.floor(1 + Math.random() * 20)}`,
      horaEmision: new Date().toLocaleTimeString("es-PE", {
        hour: "2-digit",
        minute: "2-digit"
      })
    });
  };
  return /*#__PURE__*/React.createElement("aside", {
    className: "quadrate-live__simulador",
    "aria-label": "Simulador y Reserva Dinámica"
  }, /*#__PURE__*/React.createElement("div", {
    className: "quadrate-live__simulador-header"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "quadrate-live__simulador-eyebrow"
  }, "Simulador de Tarifa & ETA"), /*#__PURE__*/React.createElement("h3", {
    className: "quadrate-live__simulador-titulo"
  }, cochera.nombre)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "quadrate-live__simulador-btn-cerrar",
    onClick: onCerrar,
    "aria-label": "Cerrar panel de reserva"
  }, "✕")), /*#__PURE__*/React.createElement("div", {
    className: "quadrate-live__simulador-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "quadrate-live__simulador-grupo"
  }, /*#__PURE__*/React.createElement("label", {
    className: "quadrate-live__simulador-label"
  }, "Tu tiempo estimado de llegada (ETA):"), /*#__PURE__*/React.createElement("div", {
    className: "quadrate-live__simulador-pills"
  }, [5, 10, 15].map(minutos => /*#__PURE__*/React.createElement("button", {
    key: minutos,
    type: "button",
    className: `quadrate-live__simulador-pill ${etaSeleccionado === minutos ? "quadrate-live__simulador-pill--activo" : ""}`,
    onClick: () => setEtaSeleccionado(minutos)
  }, minutos, " min")))), /*#__PURE__*/React.createElement("div", {
    className: "quadrate-live__simulador-grupo"
  }, /*#__PURE__*/React.createElement("label", {
    className: "quadrate-live__simulador-label"
  }, "Tiempo proyectado de estacionamiento:"), /*#__PURE__*/React.createElement("div", {
    className: "quadrate-live__simulador-pills"
  }, [{
    label: "1 hora",
    val: 60
  }, {
    label: "1h 30m",
    val: 90
  }, {
    label: "2 horas",
    val: 120
  }, {
    label: "3 horas",
    val: 180
  }].map(opcion => /*#__PURE__*/React.createElement("button", {
    key: opcion.val,
    type: "button",
    className: `quadrate-live__simulador-pill ${minutosPermanencia === opcion.val ? "quadrate-live__simulador-pill--activo" : ""}`,
    onClick: () => setMinutosPermanencia(opcion.val)
  }, opcion.label)))), /*#__PURE__*/React.createElement("div", {
    className: "quadrate-live__simulador-desglose"
  }, /*#__PURE__*/React.createElement("div", {
    className: "quadrate-live__simulador-fila"
  }, /*#__PURE__*/React.createElement("span", null, "Primera Hora (Plana):"), /*#__PURE__*/React.createElement("strong", null, "S/ ", primeraHora.toFixed(2))), /*#__PURE__*/React.createElement("div", {
    className: "quadrate-live__simulador-fila"
  }, /*#__PURE__*/React.createElement("span", null, "Fracciones (", cuartosDeHora, " x 15 min):"), /*#__PURE__*/React.createElement("strong", null, "S/ ", costoFracciones.toFixed(2))), /*#__PURE__*/React.createElement("div", {
    className: "quadrate-live__simulador-fila quadrate-live__simulador-fila--total"
  }, /*#__PURE__*/React.createElement("span", null, "Costo Total Estimado:"), /*#__PURE__*/React.createElement("span", {
    className: "quadrate-live__simulador-total-monto"
  }, "S/ ", costoTotalEstimado.toFixed(2)))), !paseGenerado ? /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "quadrate-live__simulador-btn-reservar",
    onClick: manejarGenerarReserva
  }, "Apartar Plaza por ", etaSeleccionado, " min (Sin costo previo)") : /*#__PURE__*/React.createElement("div", {
    className: "quadrate-live__pase",
    role: "region",
    "aria-label": "Pase de estacionamiento emitido"
  }, /*#__PURE__*/React.createElement("div", {
    className: "quadrate-live__pase-header"
  }, /*#__PURE__*/React.createElement("span", {
    className: "quadrate-live__pase-badge"
  }, "Pase Digital Activo"), /*#__PURE__*/React.createElement("span", {
    className: "quadrate-live__pase-hora"
  }, paseGenerado.horaEmision)), /*#__PURE__*/React.createElement("div", {
    className: "quadrate-live__pase-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "quadrate-live__pase-codigo"
  }, paseGenerado.codigo), /*#__PURE__*/React.createElement("div", {
    className: "quadrate-live__pase-detalle"
  }, "Plaza: ", /*#__PURE__*/React.createElement("strong", null, paseGenerado.plazaAsignada), " · PIN Garita:", " ", /*#__PURE__*/React.createElement("strong", null, paseGenerado.pin)), /*#__PURE__*/React.createElement("p", {
    className: "quadrate-live__pase-aviso"
  }, "Tu plaza está apartada durante los próximos ", paseGenerado.venceEnMinutos, " minutos. Validación en portón < 3 seg.")))));
}
