/**
 * simulador-reserva.js — Compilado para Navegador
 */
const React = window.React;
const { useState, useEffect } = React;

/**
 * Simulador de Reserva Dinámica por ETA & Pase Digital con Código QR y PIN.
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
  const [segundosRestantes, setSegundosRestantes] = useState(15 * 60);
  const primeraHora = cochera.tarifaHora;
  const minutosExcedentes = Math.max(0, minutosPermanencia - 60);
  const cuartosDeHora = Math.ceil(minutosExcedentes / 15);
  const costoFracciones = cuartosDeHora * cochera.tarifaFraccion;
  const costoTotalEstimado = primeraHora + costoFracciones;
  useEffect(() => {
    if (!paseGenerado) return;
    setSegundosRestantes(paseGenerado.venceEnMinutos * 60);
    const intervalo = setInterval(() => {
      setSegundosRestantes(prev => {
        if (prev <= 1) {
          clearInterval(intervalo);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalo);
  }, [paseGenerado]);
  const manejarGenerarReserva = () => {
    const pinAcceso = Math.floor(1000 + Math.random() * 9000);
    const prefijoDistrito = (cochera.distrito || "LIM").slice(0, 3).toUpperCase();
    const codigoPase = `QP-${prefijoDistrito}-${pinAcceso}`;
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
  const formatoTiempo = totalSegundos => {
    const m = Math.floor(totalSegundos / 60).toString().padStart(2, "0");
    const s = (totalSegundos % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };
  return /*#__PURE__*/React.createElement("aside", {
    className: "quadrate-live__simulador",
    "aria-label": "Simulador y Reserva Dinámica"
  }, /*#__PURE__*/React.createElement("div", {
    className: "quadrate-live__simulador-header"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "quadrate-live__simulador-eyebrow"
  }, "Tarifa"), /*#__PURE__*/React.createElement("h3", {
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
    "aria-label": "Pase digital de estacionamiento"
  }, /*#__PURE__*/React.createElement("div", {
    className: "quadrate-live__pase-top"
  }, /*#__PURE__*/React.createElement("span", {
    className: "quadrate-live__pase-badge"
  }, /*#__PURE__*/React.createElement("span", {
    className: "quadrate-live__pase-dot",
    "aria-hidden": "true"
  }), "Pase Digital Activo"), /*#__PURE__*/React.createElement("div", {
    className: "quadrate-live__pase-countdown",
    title: "Tiempo restante para ingresar a garita"
  }, /*#__PURE__*/React.createElement("span", {
    className: "quadrate-live__pase-countdown-label"
  }, "Expira en"), /*#__PURE__*/React.createElement("strong", {
    className: "quadrate-live__pase-timer"
  }, formatoTiempo(segundosRestantes)))), /*#__PURE__*/React.createElement("div", {
    className: "quadrate-live__pase-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "quadrate-live__pase-qr-wrap"
  }, /*#__PURE__*/React.createElement("svg", {
    className: "quadrate-live__pase-qr",
    viewBox: "0 0 100 100",
    width: "78",
    height: "78",
    role: "img",
    "aria-label": `Código QR para el pase ${paseGenerado.codigo}`
  }, /*#__PURE__*/React.createElement("rect", {
    width: "100",
    height: "100",
    fill: "transparent"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "8",
    y: "8",
    width: "26",
    height: "26",
    rx: "4",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "4"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "15",
    y: "15",
    width: "12",
    height: "12",
    rx: "2",
    fill: "currentColor"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "66",
    y: "8",
    width: "26",
    height: "26",
    rx: "4",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "4"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "73",
    y: "15",
    width: "12",
    height: "12",
    rx: "2",
    fill: "currentColor"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "8",
    y: "66",
    width: "26",
    height: "26",
    rx: "4",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "4"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "15",
    y: "73",
    width: "12",
    height: "12",
    rx: "2",
    fill: "currentColor"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M42 10h6v6h-6z M52 10h6v6h-6z M40 22h6v6h-6z M50 22h8v4h-8z M44 32h8v4h-8z M10 42h6v6h-6z M22 42h6v4h-6z M34 42h6v6h-6z M46 42h6v4h-6z M56 42h6v4h-6z M68 42h8v4h-8z M82 42h8v6h-8z M12 54h6v6h-6z M24 54h8v4h-8z M38 54h6v6h-6z M48 54h4v4h-4z M58 54h6v6h-6z M70 54h6v4h-6z M82 54h8v4h-8z M42 66h6v6h-6z M52 66h8v4h-8z M66 66h6v6h-6z M76 66h6v4h-6z M86 66h4v8h-4z M40 78h6v4h-6z M52 78h4v8h-4z M68 78h8v4h-8z M82 78h6v6h-6z M44 88h8v4h-8z M66 88h6v4h-6z M78 88h10v4h-10z",
    fill: "currentColor"
  })), /*#__PURE__*/React.createElement("span", {
    className: "quadrate-live__pase-qr-caption"
  }, "Escanear portón")), /*#__PURE__*/React.createElement("div", {
    className: "quadrate-live__pase-info"
  }, /*#__PURE__*/React.createElement("div", {
    className: "quadrate-live__pase-field"
  }, /*#__PURE__*/React.createElement("span", {
    className: "quadrate-live__pase-label"
  }, "Código"), /*#__PURE__*/React.createElement("strong", {
    className: "quadrate-live__pase-codigo"
  }, paseGenerado.codigo)), /*#__PURE__*/React.createElement("div", {
    className: "quadrate-live__pase-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "quadrate-live__pase-field"
  }, /*#__PURE__*/React.createElement("span", {
    className: "quadrate-live__pase-label"
  }, "Plaza"), /*#__PURE__*/React.createElement("strong", {
    className: "quadrate-live__pase-valor"
  }, paseGenerado.plazaAsignada)), /*#__PURE__*/React.createElement("div", {
    className: "quadrate-live__pase-field"
  }, /*#__PURE__*/React.createElement("span", {
    className: "quadrate-live__pase-label"
  }, "PIN Garita"), /*#__PURE__*/React.createElement("strong", {
    className: "quadrate-live__pase-pin"
  }, paseGenerado.pin))), /*#__PURE__*/React.createElement("div", {
    className: "quadrate-live__pase-field"
  }, /*#__PURE__*/React.createElement("span", {
    className: "quadrate-live__pase-label"
  }, "Emisión"), /*#__PURE__*/React.createElement("span", {
    className: "quadrate-live__pase-emision"
  }, paseGenerado.horaEmision, " · Portón 1")))), /*#__PURE__*/React.createElement("div", {
    className: "quadrate-live__pase-footer"
  }, /*#__PURE__*/React.createElement("p", {
    className: "quadrate-live__pase-aviso"
  }, "Mostrá este QR al lector o digitá el PIN en el portón."), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "quadrate-live__pase-btn-nueva",
    onClick: () => setPaseGenerado(null)
  }, "Nueva reserva")))));
}
