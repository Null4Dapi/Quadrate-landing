/**
 * QUADRATE PE — SEMANA 11: CÓDIGO INDIVIDUAL
 * Integrante: VÍCTOR / MANUEL (6:20 - 8:00)
 * Tema: Componentes React UI Puros, Accesibilidad Universal (WCAG 2.2) y Regiones Vivas
 * Archivo a proyectar en pantalla durante su intervención.
 */

import React from "react";
import { useAppStore } from "../store/app-store.js";
import { useCocherasQuery } from "../queries/use-cocheras-query.js";

/**
 * 1. Centro de Notificaciones Toast con Región Viva Accesible
 */
export function ToastContainer() {
  const notificaciones = useAppStore((state) => state.notificaciones);
  const descartarNotificacion = useAppStore((state) => state.descartarNotificacion);

  if (notificaciones.length === 0) return null;

  return (
    <aside
      aria-label="Alertas operativas de caseta en tiempo real"
      aria-live="polite"
      aria-atomic="true"
      className="quadrate-live__toasts-container"
    >
      {notificaciones.map((toast) => (
        <article
          key={toast.id}
          role="status"
          className={`quadrate-live__toast quadrate-live__toast--${toast.tipo}`}
        >
          <span className="quadrate-live__toast-icono" aria-hidden="true">🔔</span>
          <div className="quadrate-live__toast-cuerpo">
            <strong className="quadrate-live__toast-titulo">{toast.titulo}</strong>
            <p className="quadrate-live__toast-mensaje">{toast.mensaje}</p>
          </div>
          <button
            type="button"
            onClick={() => descartarNotificacion(toast.id)}
            aria-label={`Descartar alerta de ${toast.titulo}`}
            className="quadrate-live__toast-cerrar"
          >
            ×
          </button>
        </article>
      ))}
    </aside>
  );
}

/**
 * 2. Barra de Paginación Accesible vinculada a TanStack Query
 */
export function PaginacionAccesible({ paginaActual, totalPaginas, alCambiarPagina, tieneAnterior, tieneSiguiente }) {
  return (
    <nav aria-label="Navegación del catálogo de cocheras" className="quadrate-live__paginacion">
      <button
        type="button"
        disabled={!tieneAnterior}
        onClick={() => alCambiarPagina(paginaActual - 1)}
        aria-disabled={!tieneAnterior}
        className="quadrate-live__btn quadrate-live__btn--pag"
      >
        ← Anterior
      </button>

      <span className="quadrate-live__paginacion-info" aria-current="page">
        Página {paginaActual} de {totalPaginas}
      </span>

      <button
        type="button"
        disabled={!tieneSiguiente}
        onClick={() => alCambiarPagina(paginaActual + 1)}
        aria-disabled={!tieneSiguiente}
        className="quadrate-live__btn quadrate-live__btn--pag"
      >
        Siguiente →
      </button>
    </nav>
  );
}
