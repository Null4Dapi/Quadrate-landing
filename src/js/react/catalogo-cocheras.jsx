import React, { useState, useEffect } from "react";
import { useCocherasQuery } from "./queries/use-cocheras-query.js";
import { useAppStore } from "./store/app-store.js";
import { TarjetaCochera } from "./tarjeta-cochera.jsx";

/**
 * Catálogo Paginado de Cocheras con TanStack Query.
 * Maneja Server State: carga asíncrona, caché en memoria, reintento y paginación.
 */
export function CatalogoCocheras({
  cocheraSeleccionadaId,
  cocheraActualizadaId,
  onSeleccionarCochera,
}) {
  const [pagina, setPagina] = useState(1);
  const distritoPreferido = useAppStore((state) => state.distritoPreferido);
  const modoVista = useAppStore((state) => state.modoVista);

  // Reiniciar a página 1 al cambiar de distrito
  useEffect(() => {
    setPagina(1);
  }, [distritoPreferido]);

  const { data, isLoading, isError, error, isFetching, refetch } = useCocherasQuery({
    distrito: distritoPreferido,
    pagina,
    limitePorPagina: 3,
  });

  return (
    <section className="qlive-catalogo" aria-label="Catálogo de cocheras disponibles">
      <header className="qlive-catalogo__cabecera">
        <div className="qlive-catalogo__titulos">
          <h3 className="qlive-catalogo__titulo">Cocheras en {distritoPreferido}</h3>
          <span className="qlive-catalogo__subtitulo">
            {isFetching ? "Sincronizando disponibilidad…" : `${data?.totalRegistros ?? 0} registradas`}
          </span>
        </div>
      </header>

      {/* Estado de Carga: Skeleton Loaders */}
      {isLoading && (
        <div className="quadrate-live__grid quadrate-live__grid--skeleton" aria-busy="true">
          {[1, 2, 3].map((i) => (
            <div key={i} className="quadrate-live__card quadrate-live__card--skeleton">
              <div className="qlive-skeleton qlive-skeleton--cabecera" />
              <div className="qlive-skeleton qlive-skeleton--titulo" />
              <div className="qlive-skeleton qlive-skeleton--texto" />
              <div className="qlive-skeleton qlive-skeleton--metricas" />
            </div>
          ))}
        </div>
      )}

      {/* Estado de Error: Tarjeta accesible con reintento */}
      {isError && (
        <div className="quadrate-live__error" role="alert">
          <p className="quadrate-live__error-mensaje">
            No se pudo cargar el catálogo de cocheras: {error?.message || "Error de red"}
          </p>
          <button type="button" className="qlive-boton" onClick={() => refetch()}>
            Reintentar consulta
          </button>
        </div>
      )}

      {/* Catálogo Renderizado */}
      {!isLoading && !isError && data && (
        <>
          <div
            className={`quadrate-live__grid ${
              modoVista === "lista" ? "quadrate-live__grid--lista" : ""
            }`}
          >
            {data.datos.map((cochera) => (
              <TarjetaCochera
                key={cochera.id}
                cochera={cochera}
                estaSeleccionada={cochera.id === cocheraSeleccionadaId}
                estaActualizada={cochera.id === cocheraActualizadaId}
                onSeleccionarCochera={onSeleccionarCochera}
              />
            ))}
          </div>

          {/* Barra de Paginación */}
          <nav
            className="qlive-paginacion"
            aria-label="Paginación del catálogo de cocheras"
          >
            <button
              type="button"
              className="qlive-paginacion__boton"
              onClick={() => setPagina((p) => Math.max(1, p - 1))}
              disabled={!data.tieneAnterior || isFetching}
              aria-label="Página anterior"
            >
              ← Anterior
            </button>

            <span className="qlive-paginacion__info">
              Página <strong>{data.paginaActual}</strong> de <strong>{data.totalPaginas}</strong>
            </span>

            <button
              type="button"
              className="qlive-paginacion__boton"
              onClick={() => setPagina((p) => p + 1)}
              disabled={!data.tieneSiguiente || isFetching}
              aria-label="Página siguiente"
            >
              Siguiente →
            </button>
          </nav>
        </>
      )}
    </section>
  );
}
