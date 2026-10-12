/**
 * tarjeta-cochera.js — Compilado para Navegador
 */
const React = window.React;

/**
 * Componente funcional reutilizable para renderizar tarjetas de cocheras.
 * Recibe datos y callbacks por medio de props.
 *
 * @param {Object} props
 * @param {Object} props.cochera - Datos de la cochera
 * @param {boolean} props.estaSeleccionada - Estado de selección actual
 * @param {Function} props.onSeleccionarCochera - Callback disparado al hacer clic
 * @returns {JSX.Element}
 */
export function TarjetaCochera({
  cochera,
  estaSeleccionada = false,
  onSeleccionarCochera
}) {
  const porcentajeOcupacion = Math.round((cochera.plazasTotales - cochera.plazasDisponibles) / cochera.plazasTotales * 100);
  const esAforoCritico = cochera.plazasDisponibles <= 5;
  return /*#__PURE__*/React.createElement("article", {
    className: `quadrate-live__card ${estaSeleccionada ? "quadrate-live__card--selected" : ""}`,
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
  }, esAforoCritico ? "¡Últimos cupos!" : "Aforo normal")), /*#__PURE__*/React.createElement("h4", {
    className: "quadrate-live__card-nombre"
  }, cochera.nombre), /*#__PURE__*/React.createElement("p", {
    className: "quadrate-live__card-direccion"
  }, cochera.direccion), /*#__PURE__*/React.createElement("div", {
    className: "quadrate-live__card-metricas"
  }, /*#__PURE__*/React.createElement("div", {
    className: "quadrate-live__card-metrica"
  }, /*#__PURE__*/React.createElement("span", {
    className: "quadrate-live__card-metrica-etiqueta"
  }, "Disponibles"), /*#__PURE__*/React.createElement("span", {
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
  }, "Ocupación estimada"), /*#__PURE__*/React.createElement("span", {
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
  }, "ETA aprox: ", /*#__PURE__*/React.createElement("strong", null, cochera.tiempoEstimadoLlegadaMinutos, " min")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: `quadrate-live__card-btn ${estaSeleccionada ? "quadrate-live__card-btn--active" : ""}`,
    onClick: eventoBoton => {
      eventoBoton.stopPropagation();
      onSeleccionarCochera(cochera);
    }
  }, estaSeleccionada ? "Seleccionada ✓" : "Ver y Reservar")));
}
