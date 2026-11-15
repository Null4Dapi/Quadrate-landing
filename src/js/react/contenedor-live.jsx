import React from "react";

/**
 * Componente contenedor principal para la composición de la demo Quadrate Live.
 *
 * @param {Object} props
 * @param {string} props.titulo - Título principal
 * @param {string} props.subtitulo - Subtítulo descriptivo
 * @param {React.ReactNode} [props.cabeceraSaludo] - Consola de estado operativo
 * @param {React.ReactNode} [props.monitor] - Monitor de latencia y sesión
 * @param {React.ReactNode} [props.barraBusqueda] - Barra de búsqueda y filtros
 * @param {React.ReactNode} [props.feedTelemetria] - Feed de telemetría en vivo
 * @param {React.ReactNode} props.children - Catálogo de cocheras
 * @param {React.ReactNode} [props.panelDetalle] - Simulador de reserva dinámica
 * @returns {JSX.Element}
 */
export function ContenedorLive({
  titulo,
  subtitulo,
  cabeceraSaludo,
  monitor,
  barraBusqueda,
  feedTelemetria,
  children,
  panelDetalle,
}) {
  return (
    <div className="quadrate-live__container">
      <header className="quadrate-live__header">
        <div className="quadrate-live__header-textos">
          <span className="quadrate-live__eyebrow">Quadrate Live</span>
          <h2 className="quadrate-live__titulo">{titulo}</h2>
          <p className="quadrate-live__subtitulo">{subtitulo}</p>
        </div>
        {monitor && <div className="quadrate-live__header-monitor">{monitor}</div>}
      </header>

      {cabeceraSaludo && (
        <section className="quadrate-live__saludo-wrapper">
          {cabeceraSaludo}
        </section>
      )}

      {feedTelemetria && (
        <section className="quadrate-live__feed-wrapper">
          {feedTelemetria}
        </section>
      )}

      {barraBusqueda && (
        <section className="quadrate-live__busqueda-wrapper">
          {barraBusqueda}
        </section>
      )}

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
    </div>
  );
}
