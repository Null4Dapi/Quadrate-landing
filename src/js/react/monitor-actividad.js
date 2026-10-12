/**
 * monitor-actividad.js — Compilado para Navegador
 */
const React = window.React;
const { useState, useEffect, useRef } = React;

/**
 * Monitor automático de actividad con setInterval y clearInterval.
 * Controla el tiempo transcurrido sin duplicar intervalos.
 *
 * @param {Object} props
 * @param {Function} [props.onTick] - Notificación periódica de segundo transcurrido
 * @returns {JSX.Element}
 */
export function MonitorActividad({
  onTick
}) {
  const [segundosTranscurridos, setSegundosTranscurridos] = useState(0);
  const [latenciaGarita, setLatenciaGarita] = useState(1.4);
  const [estadoConexion, setEstadoConexion] = useState("sincronizado");
  useEffect(() => {
    const idIntervalo = setInterval(() => {
      setSegundosTranscurridos(segundosPrevios => {
        const siguienteSegundo = segundosPrevios + 1;
        if (typeof onTick === "function") {
          onTick(siguienteSegundo);
        }
        return siguienteSegundo;
      });
      setLatenciaGarita(latenciaPrevia => {
        const variacion = Math.random() * 0.4 - 0.2;
        const nuevaLatencia = Math.max(0.8, Math.min(2.8, latenciaPrevia + variacion));
        return parseFloat(nuevaLatencia.toFixed(1));
      });
    }, 1000);
    return () => {
      clearInterval(idIntervalo);
    };
  }, [onTick]);
  const minutos = Math.floor(segundosTranscurridos / 60).toString().padStart(2, "0");
  const segundos = (segundosTranscurridos % 60).toString().padStart(2, "0");
  const tiempoFormateado = `${minutos}:${segundos}`;
  return /*#__PURE__*/React.createElement("div", {
    className: "quadrate-live__monitor",
    role: "status",
    "aria-live": "polite"
  }, /*#__PURE__*/React.createElement("div", {
    className: "quadrate-live__monitor-indicator",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("span", {
    className: "quadrate-live__monitor-dot"
  })), /*#__PURE__*/React.createElement("div", {
    className: "quadrate-live__monitor-info"
  }, /*#__PURE__*/React.createElement("span", {
    className: "quadrate-live__monitor-label"
  }, "Monitor en Vivo"), /*#__PURE__*/React.createElement("span", {
    className: "quadrate-live__monitor-tiempo"
  }, tiempoFormateado)), /*#__PURE__*/React.createElement("div", {
    className: "quadrate-live__monitor-telemetria"
  }, /*#__PURE__*/React.createElement("span", {
    className: "quadrate-live__monitor-telemetria-item"
  }, "Garitas: ", /*#__PURE__*/React.createElement("strong", null, latenciaGarita, "s")), /*#__PURE__*/React.createElement("span", {
    className: "quadrate-live__monitor-telemetria-item"
  }, "Estado: ", /*#__PURE__*/React.createElement("strong", {
    className: "quadrate-live__monitor-status--ok"
  }, estadoConexion))));
}
