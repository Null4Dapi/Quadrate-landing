import React from "react";

/**
 * Componente contenedor padre para ilustrar composición de componentes.
 * Recibe children y componentes secundarios como props.
 *
 * @param {Object} props
 * @param {string} props.titulo - Título principal de la sección
 * @param {string} props.subtitulo - Subtítulo descriptivo
 * @param {React.ReactNode} [props.cabeceraSaludo] - Componente de saludo
 * @param {React.ReactNode} [props.monitor] - Componente de monitor
 * @param {React.ReactNode} [props.barraBusqueda] - Barra de búsqueda con useRef
 * @param {React.ReactNode} props.children - Elementos hijos compuestos (cuadrícula de cocheras)
 * @param {React.ReactNode} [props.panelDetalle] - Panel lateral compuesto
 * @returns {JSX.Element}
 */
export function ContenedorLive({
  titulo,
  subtitulo,
  cabeceraSaludo,
  monitor,
  barraBusqueda,
  children,
  panelDetalle,
}) {
  return (
    <div className="quadrate-live__container">
      <header className="quadrate-live__header">
        <div className="quadrate-live__header-textos">
          <span className="quadrate-live__eyebrow">Módulo React en Vivo</span>
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
