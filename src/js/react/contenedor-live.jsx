import React from "react";

/**
 * Contenedor principal con jerarquía UX centrada en el usuario.
 * Prioriza el catálogo de cocheras y relega herramientas de diagnóstico a un dock flotante.
 *
 * @param {Object} props
 * @param {string} props.titulo - Título principal
 * @param {string} props.subtitulo - Subtítulo descriptivo
 * @param {React.ReactNode} [props.monitor] - Conmutador de turno o acciones de cabecera
 * @param {React.ReactNode} props.children - Catálogo de cocheras principal
 * @param {React.ReactNode} [props.panelDetalle] - Simulador de reserva modal/lateral
 * @param {React.ReactNode} [props.feedTelemetria] - Dock de diagnóstico y telemetría
 * @returns {JSX.Element}
 */
export function ContenedorLive({
  titulo,
  subtitulo,
  monitor,
  children,
  panelDetalle,
  feedTelemetria,
}) {
  return (
    <div className="quadrate-live__container">
      <header className="quadrate-live__header">
        <div className="quadrate-live__header-textos">
          <h1 className="quadrate-live__titulo">{titulo}</h1>
          <p className="quadrate-live__subtitulo">{subtitulo}</p>
        </div>
        {monitor && <div className="quadrate-live__header-monitor">{monitor}</div>}
      </header>

      <div className="quadrate-live__layout">
        <div className="quadrate-live__principal">
          {children}
        </div>
        {panelDetalle && (
          <div className="quadrate-live__secundario">
            {panelDetalle}
          </div>
        )}
      </div>

      {feedTelemetria}
    </div>
  );
}
