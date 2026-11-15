import React, { useState } from "react";
import { useExperiences } from "../../features/catalog/useExperiences.js";

/**
 * Componente de Catálogo Remoto con TanStack Query.
 * Demuestra estados asíncronos rigurosos (isPending, isError, data),
 * paginación interactiva y reutilización automática de memoria caché (staleTime: 2 min).
 */
export function CatalogoRemoto() {
  const [page, setPage] = useState(1);
  const { data, isPending, isError, error, refetch, isFetching } = useExperiences(page);

  return (
    <section className="catalogo-remoto" aria-label="Catálogo dinámico de experiencias y cocheras">
      <header className="catalogo-remoto__header">
        <div className="catalogo-remoto__header-texto">
          <h3 className="catalogo-remoto__title">Catálogo Dinámico (TanStack Query)</h3>
          <p className="catalogo-remoto__subtitle">
            Consumo REST paginado desde JSONPlaceholder con caché inteligente (staleTime: 2 min).
          </p>
        </div>
        <div className="catalogo-remoto__badge-cache">
          <span className="catalogo-remoto__pill">
            {isFetching ? "⏳ Sincronizando red..." : "⚡ Datos frescos en caché"}
          </span>
        </div>
      </header>

      {/* Estado 1: Carga accesible */}
      {isPending && (
        <div className="catalogo-remoto__estado catalogo-remoto__estado--loading" role="status" aria-live="polite">
          <div className="catalogo-remoto__spinner" aria-hidden="true" />
          <p className="catalogo-remoto__mensaje">
            Consultando catálogo remoto (página {page})...
          </p>
        </div>
      )}

      {/* Estado 2: Error accesible */}
      {isError && (
        <div className="catalogo-remoto__estado catalogo-remoto__estado--error" role="alert">
          <p className="catalogo-remoto__error-titulo">No se pudo cargar el catálogo de experiencias</p>
          <p className="catalogo-remoto__error-detalle">
            {error?.message || "Ocurrió un error inesperado al consultar el servidor."}
          </p>
          <button
            type="button"
            className="catalogo-remoto__btn catalogo-remoto__btn--reintentar"
            onClick={() => refetch()}
          >
            Reintentar consulta
          </button>
        </div>
      )}

      {/* Estado 3: Datos renderizados */}
      {!isPending && !isError && data && (
        <div className="catalogo-remoto__grid" role="region" aria-label="Tarjetas del catálogo">
          {data.map((item) => (
            <article key={item.id} className="catalogo-remoto__card">
              <header className="catalogo-remoto__card-header">
                <span className="catalogo-remoto__card-id">Ref #{item.id}</span>
                <span className="catalogo-remoto__card-tag">Red Lima</span>
              </header>
              <h4 className="catalogo-remoto__card-title">{item.title}</h4>
              <p className="catalogo-remoto__card-body">{item.body}</p>
            </article>
          ))}
        </div>
      )}

      {/* Controles de paginación bidireccionales */}
      <footer className="catalogo-remoto__paginacion" aria-label="Navegación de páginas">
        <button
          type="button"
          className="catalogo-remoto__btn-nav"
          disabled={page === 1 || isPending}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          aria-label="Página anterior"
        >
          ← Anterior
        </button>

        <span className="catalogo-remoto__pagina-indicador" aria-current="page">
          Página <strong>{page}</strong>
        </span>

        <button
          type="button"
          className="catalogo-remoto__btn-nav"
          disabled={isPending}
          onClick={() => setPage((p) => p + 1)}
          aria-label="Página siguiente"
        >
          Siguiente →
        </button>
      </footer>
    </section>
  );
}
