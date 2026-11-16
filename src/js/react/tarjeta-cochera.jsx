import React from "react";

/**
 * Componente accesible de tarjeta de cochera con datos en vivo.
 * Sigue los principios de WCAG 2.2: jerarquía semántica, ratios de contraste
 * y eliminación del anti-patrón de botones anidados.
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
  onSeleccionarCochera,
}) {
  const porcentajeOcupacion = Math.round(
    ((cochera.plazasTotales - cochera.plazasDisponibles) / cochera.plazasTotales) * 100
  );

  const esAforoCritico = cochera.plazasDisponibles <= 5;
  const tituloId = `cochera-nombre-${cochera.id}`;

  return (
    <article
      className={`quadrate-live__card ${
        estaSeleccionada ? "quadrate-live__card--selected" : ""
      } ${estaActualizada ? "quadrate-live__card--actualizada" : ""}`}
      aria-labelledby={tituloId}
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
          {esAforoCritico ? "Aforo crítico" : "Aforo fluido"}
        </span>
      </header>

      <h4 id={tituloId} className="quadrate-live__card-nombre">{cochera.nombre}</h4>
      <p className="quadrate-live__card-direccion">{cochera.direccion}</p>

      <div className="quadrate-live__card-metricas" aria-label="Métricas de tarifa y capacidad">
        <div className="quadrate-live__card-metrica">
          <span className="quadrate-live__card-metrica-etiqueta">Plazas libres</span>
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
          aria-label={`Ocupación actual al ${porcentajeOcupacion}%`}
        />
      </div>

      <footer className="quadrate-live__card-footer">
        <div className="quadrate-live__card-eta">
          <span>ETA estimado: </span>
          <strong>{cochera.tiempoEstimadoLlegadaMinutos} min</strong>
        </div>
        <button
          type="button"
          className={`quadrate-live__card-btn ${
            estaSeleccionada ? "quadrate-live__card-btn--active" : ""
          }`}
          onClick={() => onSeleccionarCochera(cochera)}
          aria-pressed={estaSeleccionada}
          aria-label={`Simular reserva en ${cochera.nombre}, ${cochera.distrito}`}
        >
          {estaSeleccionada ? "Seleccionada ✓" : "Simular reserva"}
        </button>
      </footer>
    </article>
  );
}
