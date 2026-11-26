import React, { useState, useEffect, useRef } from "react";
import { useCocherasQuery } from "../../features/catalog/useExperiences.js";
import { DISTRITOS_DISPONIBLES } from "./datos-cocheras.js";
import { TarjetaCochera } from "./tarjeta-cochera.jsx";

/**
 * Skeleton accesible de tarjeta de cochera para estados de carga sin salto visual.
 */
function SkeletonTarjetaCochera() {
  return (
    <div className="cochera-skeleton" aria-hidden="true">
      <div className="cochera-skeleton__header">
        <div className="cochera-skeleton__bar cochera-skeleton__bar--sm" />
        <div className="cochera-skeleton__pill" />
      </div>
      <div className="cochera-skeleton__bar cochera-skeleton__bar--lg" />
      <div className="cochera-skeleton__bar cochera-skeleton__bar--md" />
      <div className="cochera-skeleton__metricas">
        <div className="cochera-skeleton__caja" />
        <div className="cochera-skeleton__caja" />
        <div className="cochera-skeleton__caja" />
      </div>
      <div className="cochera-skeleton__footer">
        <div className="cochera-skeleton__bar cochera-skeleton__bar--sm" />
        <div className="cochera-skeleton__btn" />
      </div>
    </div>
  );
}

/**
 * Catálogo inteligente de cocheras en Lima Metropolitana.
 * Conecta con la API REST paginada vía TanStack Query (Semana 11),
 * gestiona estados asíncronos rigurosos (isPending, isError, data),
 * paginación en red y reutilización automática de memoria caché (staleTime 2 min).
 *
 * @param {Object} props
 * @param {Object} [props.cocheraSeleccionada]
 * @param {Function} props.onSeleccionarCochera
 * @param {string|null} [props.cocheraActualizadaId]
 */
export function CatalogoRemoto({
  cocheraSeleccionada,
  onSeleccionarCochera,
  cocheraActualizadaId,
}) {
  const [pagina, setPagina] = useState(1);
  const [distrito, setDistrito] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");
  const campoBusquedaRef = useRef(null);

  // Consulta asíncrona reactiva con TanStack Query y caché inteligente
  const { data, isPending, isError, error, refetch, isFetching } = useCocherasQuery({
    pagina,
    distrito,
    busqueda,
  });

  // Atajos de teclado accesibles: '/' enfocar búsqueda, 'Esc' limpiar
  useEffect(() => {
    const manejarTeclado = (e) => {
      if (e.key === "/" && document.activeElement !== campoBusquedaRef.current) {
        e.preventDefault();
        campoBusquedaRef.current?.focus();
      } else if (e.key === "Escape" && document.activeElement === campoBusquedaRef.current) {
        setBusqueda("");
        setPagina(1);
        campoBusquedaRef.current?.blur();
      }
    };
    window.addEventListener("keydown", manejarTeclado);
    return () => window.removeEventListener("keydown", manejarTeclado);
  }, []);

  const cambiarDistrito = (nuevoDistrito) => {
    setDistrito(nuevoDistrito);
    setPagina(1);
  };

  const cambiarBusqueda = (evento) => {
    setBusqueda(evento.target.value);
    setPagina(1);
  };

  const limpiarFiltros = () => {
    setBusqueda("");
    setDistrito("Todos");
    setPagina(1);
    campoBusquedaRef.current?.focus();
  };

  return (
    <section className="catalogo-remoto" aria-label="Catálogo de playas de estacionamiento en Lima">
      {/* Barra de herramientas: Búsqueda y distritos */}
      <div className="catalogo-remoto__toolbar">
        <div className="catalogo-remoto__search-box">
          <label htmlFor="catalogo-search-input" className="catalogo-remoto__search-label">
            Buscar playa o dirección:
          </label>
          <div className="catalogo-remoto__search-group">
            <input
              ref={campoBusquedaRef}
              id="catalogo-search-input"
              type="search"
              className="catalogo-remoto__search-input"
              placeholder="Begonias, Larco, Canaval... (Presioná / para buscar)"
              value={busqueda}
              onChange={cambiarBusqueda}
            />
            {busqueda && (
              <button
                type="button"
                className="catalogo-remoto__search-clear"
                onClick={limpiarFiltros}
                aria-label="Limpiar búsqueda"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div className="catalogo-remoto__filtros-barra">
          <div className="catalogo-remoto__filtros" role="toolbar" aria-label="Filtrar por distrito">
            <span className="catalogo-remoto__filtros-label">Distritos:</span>
            <div className="catalogo-remoto__pills-group">
              {DISTRITOS_DISPONIBLES.map((d) => (
                <button
                  key={d}
                  type="button"
                  className={`catalogo-remoto__filtro-btn ${
                    distrito === d ? "catalogo-remoto__filtro-btn--activo" : ""
                  }`}
                  onClick={() => cambiarDistrito(d)}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="catalogo-remoto__badge-cache" title="Almacenamiento en memoria para navegación instantánea">
            <span
              className={`catalogo-remoto__pill ${
                isFetching ? "catalogo-remoto__pill--sync" : "catalogo-remoto__pill--cache"
              }`}
            >
              {isFetching ? "Sincronizando..." : "TanStack Query · Caché 2m"}
            </span>
          </div>
        </div>
      </div>

      {/* Estado 1: Carga accesible con Skeletons */}
      {isPending && (
        <div
          className="quadrate-live__grid"
          role="status"
          aria-live="polite"
          aria-busy="true"
          aria-label="Cargando cocheras..."
        >
          <SkeletonTarjetaCochera />
          <SkeletonTarjetaCochera />
          <SkeletonTarjetaCochera />
        </div>
      )}

      {/* Estado 2: Error asíncrono con opción de reintento */}
      {isError && (
        <div className="catalogo-remoto__error-box" role="alert">
          <h4 className="catalogo-remoto__error-titulo">No se pudo consultar el catálogo de garitas</h4>
          <p className="catalogo-remoto__error-detalle">
            {error?.message || "Ocurrió un problema de enlace con el servidor de catálogo."}
          </p>
          <button
            type="button"
            className="catalogo-remoto__btn-reintentar"
            onClick={() => refetch()}
          >
            Reintentar consulta
          </button>
        </div>
      )}

      {/* Estado 3: Sin resultados */}
      {!isPending && !isError && data && data.cocheras.length === 0 && (
        <div className="catalogo-remoto__empty">
          <p>No se encontraron playas de estacionamiento para el filtro seleccionado.</p>
          <button
            type="button"
            className="catalogo-remoto__btn-reset"
            onClick={limpiarFiltros}
          >
            Restablecer filtros
          </button>
        </div>
      )}

      {/* Estado 4: Resultados renderizados */}
      {!isPending && !isError && data && data.cocheras.length > 0 && (
        <div className="quadrate-live__grid" role="region" aria-label="Playas de estacionamiento disponibles">
          {data.cocheras.map((cochera) => (
            <TarjetaCochera
              key={cochera.id}
              cochera={cochera}
              estaSeleccionada={cocheraSeleccionada?.id === cochera.id}
              estaActualizada={cocheraActualizadaId === cochera.id}
              onSeleccionarCochera={onSeleccionarCochera}
            />
          ))}
        </div>
      )}

      {/* Controles de paginación bidireccionales en red */}
      <footer className="catalogo-remoto__paginacion" aria-label="Paginación del catálogo">
        <button
          type="button"
          className="catalogo-remoto__btn-nav"
          disabled={pagina <= 1 || isPending}
          onClick={() => setPagina((p) => Math.max(1, p - 1))}
          aria-label="Página anterior"
        >
          ← Anterior
        </button>

        <span className="catalogo-remoto__pagina-info" aria-current="page">
          Página <strong>{data?.paginaActual || pagina}</strong> de {data?.totalPaginas || 1}
          {data?.totalRegistros ? ` · ${data.totalRegistros} playas` : ""}
        </span>

        <button
          type="button"
          className="catalogo-remoto__btn-nav"
          disabled={!data?.tieneSiguiente || isPending}
          onClick={() => setPagina((p) => p + 1)}
          aria-label="Página siguiente"
        >
          Siguiente →
        </button>
      </footer>
    </section>
  );
}
