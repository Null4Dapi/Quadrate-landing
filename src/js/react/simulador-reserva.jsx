import React, { useState } from "react";

/**
 * Mejora Creativa: Simulador de Reserva Dinámica por ETA & Calculadora de Fraccionamiento.
 *
 * @param {Object} props
 * @param {Object} props.cochera - Cochera seleccionada
 * @param {Function} props.onCerrar - Función para cerrar el panel
 * @returns {JSX.Element}
 */
export function SimuladorReserva({ cochera, onCerrar }) {
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
      horaEmision: new Date().toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" }),
    });
  };

  return (
    <aside className="quadrate-live__simulador" aria-label="Simulador y Reserva Dinámica">
      <div className="quadrate-live__simulador-header">
        <div>
          <span className="quadrate-live__simulador-eyebrow">Simulador de Tarifa & ETA</span>
          <h3 className="quadrate-live__simulador-titulo">{cochera.nombre}</h3>
        </div>
        <button
          type="button"
          className="quadrate-live__simulador-btn-cerrar"
          onClick={onCerrar}
          aria-label="Cerrar panel de reserva"
        >
          ✕
        </button>
      </div>

      <div className="quadrate-live__simulador-body">
        <div className="quadrate-live__simulador-grupo">
          <label className="quadrate-live__simulador-label">
            Tu tiempo estimado de llegada (ETA):
          </label>
          <div className="quadrate-live__simulador-pills">
            {[5, 10, 15].map((minutos) => (
              <button
                key={minutos}
                type="button"
                className={`quadrate-live__simulador-pill ${
                  etaSeleccionado === minutos ? "quadrate-live__simulador-pill--activo" : ""
                }`}
                onClick={() => setEtaSeleccionado(minutos)}
              >
                {minutos} min
              </button>
            ))}
          </div>
        </div>

        <div className="quadrate-live__simulador-grupo">
          <label className="quadrate-live__simulador-label">
            Tiempo proyectado de estacionamiento:
          </label>
          <div className="quadrate-live__simulador-pills">
            {[
              { label: "1 hora", val: 60 },
              { label: "1h 30m", val: 90 },
              { label: "2 horas", val: 120 },
              { label: "3 horas", val: 180 },
            ].map((opcion) => (
              <button
                key={opcion.val}
                type="button"
                className={`quadrate-live__simulador-pill ${
                  minutosPermanencia === opcion.val
                    ? "quadrate-live__simulador-pill--activo"
                    : ""
                }`}
                onClick={() => setMinutosPermanencia(opcion.val)}
              >
                {opcion.label}
              </button>
            ))}
          </div>
        </div>

        <div className="quadrate-live__simulador-desglose">
          <div className="quadrate-live__simulador-fila">
            <span>Primera Hora (Plana):</span>
            <strong>S/ {primeraHora.toFixed(2)}</strong>
          </div>
          <div className="quadrate-live__simulador-fila">
            <span>Fracciones ({cuartosDeHora} x 15 min):</span>
            <strong>S/ {costoFracciones.toFixed(2)}</strong>
          </div>
          <div className="quadrate-live__simulador-fila quadrate-live__simulador-fila--total">
            <span>Costo Total Estimado:</span>
            <span className="quadrate-live__simulador-total-monto">
              S/ {costoTotalEstimado.toFixed(2)}
            </span>
          </div>
        </div>

        {!paseGenerado ? (
          <button
            type="button"
            className="quadrate-live__simulador-btn-reservar"
            onClick={manejarGenerarReserva}
          >
            Apartar Plaza por {etaSeleccionado} min (Sin costo previo)
          </button>
        ) : (
          <div className="quadrate-live__pase" role="region" aria-label="Pase de estacionamiento emitido">
            <div className="quadrate-live__pase-header">
              <span className="quadrate-live__pase-badge">Pase Digital Activo</span>
              <span className="quadrate-live__pase-hora">{paseGenerado.horaEmision}</span>
            </div>
            <div className="quadrate-live__pase-body">
              <div className="quadrate-live__pase-codigo">{paseGenerado.codigo}</div>
              <div className="quadrate-live__pase-detalle">
                Plaza: <strong>{paseGenerado.plazaAsignada}</strong> · PIN Garita:{" "}
                <strong>{paseGenerado.pin}</strong>
              </div>
              <p className="quadrate-live__pase-aviso">
                Tu plaza está apartada durante los próximos {paseGenerado.venceEnMinutos} minutos. Validación en portón &lt; 3 seg.
              </p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
