import React from "react";

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
  onSeleccionarCochera,
}) {
  const porcentajeOcupacion = Math.round(
    ((cochera.plazasTotales - cochera.plazasDisponibles) / cochera.plazasTotales) * 100
  );

  const esAforoCritico = cochera.plazasDisponibles <= 5;

  return (
    <article
      className={`quadrate-live__card ${
        estaSeleccionada ? "quadrate-live__card--selected" : ""
      }`}
      onClick={() => onSeleccionarCochera(cochera)}
      role="button"
      tabIndex={0}
      onKeyDown={(eventoTeclado) => {
        if (eventoTeclado.key === "Enter" || eventoTeclado.key === " ") {
          onSeleccionarCochera(cochera);
        }
      }}
      aria-pressed={estaSeleccionada}
      aria-label={`Seleccionar cochera ${cochera.nombre} en ${cochera.distrito}`}
    >
      <header className="quadrate-live__card-header">
        <span className="quadrate-live__card-distrito">{cochera.distrito}</span>
        <span
          className={`quadrate-live__badge ${
            esAforoCritico
              ? "quadrate-live__badge--alerta"
              : "quadrate-live__badge--disponible"
          }`}
        >
          {esAforoCritico ? "¡Últimos cupos!" : "Aforo normal"}
        </span>
      </header>

      <h4 className="quadrate-live__card-nombre">{cochera.nombre}</h4>
      <p className="quadrate-live__card-direccion">{cochera.direccion}</p>

      <div className="quadrate-live__card-metricas">
        <div className="quadrate-live__card-metrica">
          <span className="quadrate-live__card-metrica-etiqueta">Disponibles</span>
          <span className="quadrate-live__card-metrica-valor">
            <strong>{cochera.plazasDisponibles}</strong> / {cochera.plazasTotales}
          </span>
        </div>
        <div className="quadrate-live__card-metrica">
          <span className="quadrate-live__card-metrica-etiqueta">Tarifa / h</span>
          <span className="quadrate-live__card-metrica-valor">
            S/ {cochera.tarifaHora.toFixed(2)}
          </span>
        </div>
        <div className="quadrate-live__card-metrica">
          <span className="quadrate-live__card-metrica-etiqueta">Fracción 15m</span>
          <span className="quadrate-live__card-metrica-valor">
            S/ {cochera.tarifaFraccion.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="quadrate-live__aforo-box">
        <div className="quadrate-live__aforo-info">
          <span className="quadrate-live__aforo-label">Ocupación estimada</span>
          <span className="quadrate-live__aforo-pct">{porcentajeOcupacion}%</span>
        </div>
        <progress
          className={`quadrate-live__aforo-barra ${
            esAforoCritico ? "quadrate-live__aforo-barra--critico" : ""
          }`}
          value={porcentajeOcupacion}
          max="100"
          aria-label={`Aforo al ${porcentajeOcupacion}%`}
        />
      </div>

      <footer className="quadrate-live__card-footer">
        <span className="quadrate-live__card-eta">
          ETA aprox: <strong>{cochera.tiempoEstimadoLlegadaMinutos} min</strong>
        </span>
        <button
          type="button"
          className={`quadrate-live__card-btn ${
            estaSeleccionada ? "quadrate-live__card-btn--active" : ""
          }`}
          onClick={(eventoBoton) => {
            eventoBoton.stopPropagation();
            onSeleccionarCochera(cochera);
          }}
        >
          {estaSeleccionada ? "Seleccionada ✓" : "Ver y Reservar"}
        </button>
      </footer>
    </article>
  );
}
