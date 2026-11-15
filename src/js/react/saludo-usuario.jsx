import React from "react";

/**
 * Panel de contexto operativo de la red de estacionamientos.
 * Reemplaza los saludos ficticios por un resumen editorial de infraestructura en vivo.
 *
 * @param {Object} props
 * @param {number} props.totalCocheras - Total de playas enlazadas
 * @param {string} props.estadoWs - Estado del enlace WebSocket ('en vivo', 'reconectando', etc.)
 * @param {Function} [props.onSimularEvento] - Disparo manual de telemetría para demostración
 * @param {boolean} [props.estaPausado] - Indicador de pausa de telemetría
 * @param {Function} [props.onAlternarPausa] - Callback para alternar pausa/reanudación
 * @returns {JSX.Element}
 */
export function SaludoUsuario({
  totalCocheras = 6,
  estadoWs = "en vivo",
  onSimularEvento,
  estaPausado = false,
  onAlternarPausa,
}) {
  return (
    <article className="quadrate-live__operaciones" aria-label="Consola de estado operativo">
      <div className="quadrate-live__operaciones-info">
        <div className="quadrate-live__operaciones-header">
          <span className="quadrate-live__operaciones-dot" aria-hidden="true" />
          <h3 className="quadrate-live__operaciones-titulo">
            Consola de Operaciones Lima
          </h3>
          <span className="quadrate-live__badge quadrate-live__badge--nodo">
            Nodo Central
          </span>
        </div>
        <p className="quadrate-live__operaciones-meta">
          <strong>{totalCocheras} garitas digitales</strong> conectadas por telemetría.
          {" "}Aforo, tarifas dinámicas y reservas por ETA sincronizadas en tiempo real.
        </p>
      </div>

      <div className="quadrate-live__operaciones-acciones">
        <button
          type="button"
          className="quadrate-live__btn quadrate-live__btn--secundario"
          onClick={onAlternarPausa}
          title={estaPausado ? "Reanudar recepción de telemetría" : "Pausar eventos automáticos"}
          aria-pressed={estaPausado}
        >
          {estaPausado ? "▶ Reanudar flujo" : "⏸ Pausar flujo"}
        </button>

        {onSimularEvento && (
          <button
            type="button"
            className="quadrate-live__btn quadrate-live__btn--primario"
            onClick={onSimularEvento}
            title="Disparar un evento de garita en tiempo real para evaluar reactividad"
          >
            ⚡ Simular evento de garita
          </button>
        )}
      </div>
    </article>
  );
}
