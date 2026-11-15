/**
 * tarjeta-cochera.js — Compilado para Navegador
 */
const React = window.React;

/**
 * Componente funcional para renderizar tarjetas de cocheras con datos en vivo.
 *
 * @param {Object} props
 * @param {Object} props.cochera - Datos de la cochera
 * @param {boolean} props.estaSeleccionada - Estado de selección actual
 * @param {boolean} props.estaActualizada - Destello de actualización en vivo por telemetría
 * @param {Function} props.onSeleccionarCochera - Callback al seleccionar
 * @returns {JSX.Element}
 */
export function TarjetaCochera({
  cochera,
  estaSeleccionada = false,
  estaActualizada = false,
  onSeleccionarCochera
}) {
  const porcentajeOcupacion = Math.round((cochera.plazasTotales - cochera.plazasDisponibles) / cochera.plazasTotales * 100);
  const esAforoCritico = cochera.plazasDisponibles <= 5;
  return /*#__PURE__*/React.createElement("article", {
    className: `quadrate-live__card ${estaSeleccionada ? "quadrate-live__card--selected" : ""} ${estaActualizada ? "quadrate-live__card--actualizada" : ""}`,
    onClick: () => onSeleccionarCochera(cochera),
    role: "button",
    tabIndex: 0,
    onKeyDown: eventoTeclado => {
      if (eventoTeclado.key === "Enter" || eventoTeclado.key === " ") {
        onSeleccionarCochera(cochera);
      }
    },
    "aria-pressed": estaSeleccionada,
    "aria-label": `Seleccionar cochera ${cochera.nombre} en ${cochera.distrito}`
  }, /*#__PURE__*/React.createElement("header", {
    className: "quadrate-live__card-header"
  }, /*#__PURE__*/React.createElement("span", {
    className: "quadrate-live__card-distrito"
  }, cochera.distrito), /*#__PURE__*/React.createElement("span", {
    className: `quadrate-live__badge ${esAforoCritico ? "quadrate-live__badge--alerta" : "quadrate-live__badge--disponible"}`
  }, esAforoCritico ? "Aforo crítico" : "Aforo fluido")), /*#__PURE__*/React.createElement("h4", {
    className: "quadrate-live__card-nombre"
  }, cochera.nombre), /*#__PURE__*/React.createElement("p", {
    className: "quadrate-live__card-direccion"
  }, cochera.direccion), /*#__PURE__*/React.createElement("div", {
    className: "quadrate-live__card-metricas"
  }, /*#__PURE__*/React.createElement("div", {
    className: "quadrate-live__card-metrica"
  }, /*#__PURE__*/React.createElement("span", {
    className: "quadrate-live__card-metrica-etiqueta"
  }, "Plazas libres"), /*#__PURE__*/React.createElement("span", {
    className: "quadrate-live__card-metrica-valor"
  }, /*#__PURE__*/React.createElement("strong", null, cochera.plazasDisponibles), " / ", cochera.plazasTotales)), /*#__PURE__*/React.createElement("div", {
    className: "quadrate-live__card-metrica"
  }, /*#__PURE__*/React.createElement("span", {
    className: "quadrate-live__card-metrica-etiqueta"
  }, "Tarifa / h"), /*#__PURE__*/React.createElement("span", {
    className: "quadrate-live__card-metrica-valor"
  }, "S/ ", cochera.tarifaHora.toFixed(2))), /*#__PURE__*/React.createElement("div", {
    className: "quadrate-live__card-metrica"
  }, /*#__PURE__*/React.createElement("span", {
    className: "quadrate-live__card-metrica-etiqueta"
  }, "Fracción 15m"), /*#__PURE__*/React.createElement("span", {
    className: "quadrate-live__card-metrica-valor"
  }, "S/ ", cochera.tarifaFraccion.toFixed(2)))), /*#__PURE__*/React.createElement("div", {
    className: "quadrate-live__aforo-box"
  }, /*#__PURE__*/React.createElement("div", {
    className: "quadrate-live__aforo-info"
  }, /*#__PURE__*/React.createElement("span", {
    className: "quadrate-live__aforo-label"
  }, "Ocupación"), /*#__PURE__*/React.createElement("span", {
    className: "quadrate-live__aforo-pct"
  }, porcentajeOcupacion, "%")), /*#__PURE__*/React.createElement("progress", {
    className: `quadrate-live__aforo-barra ${esAforoCritico ? "quadrate-live__aforo-barra--critico" : ""}`,
    value: porcentajeOcupacion,
    max: "100",
    "aria-label": `Aforo al ${porcentajeOcupacion}%`
  })), /*#__PURE__*/React.createElement("footer", {
    className: "quadrate-live__card-footer"
  }, /*#__PURE__*/React.createElement("span", {
    className: "quadrate-live__card-eta"
  }, "ETA: ", /*#__PURE__*/React.createElement("strong", null, cochera.tiempoEstimadoLlegadaMinutos, " min")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: `quadrate-live__card-btn ${estaSeleccionada ? "quadrate-live__card-btn--active" : ""}`,
    onClick: eventoBoton => {
      eventoBoton.stopPropagation();
      onSeleccionarCochera(cochera);
    }
  }, estaSeleccionada ? "Seleccionada ✓" : "Simular reserva")));
}
