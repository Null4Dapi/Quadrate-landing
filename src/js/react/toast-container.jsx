import React from "react";
import { useAppStore } from "./store/app-store.js";

/**
 * Contenedor de Alertas Toast en Tiempo Real (Zustand).
 * Notificaciones efímeras de telemetría operativa con accesibilidad WCAG.
 */
export function ToastContainer() {
  const notificaciones = useAppStore((state) => state.notificaciones);
  const descartarNotificacion = useAppStore((state) => state.descartarNotificacion);

  if (!notificaciones || notificaciones.length === 0) {
    return null;
  }

  return (
    <aside
      className="qlive-toaster"
      role="status"
      aria-live="polite"
      aria-atomic="false"
      aria-label="Alertas operativas en tiempo real"
    >
      {notificaciones.map((n) => (
        <div key={n.id} className={`qlive-toast qlive-toast--${n.tipo || "info"}`}>
          <div className="qlive-toast__contenido">
            <header className="qlive-toast__cabecera">
              <span className="qlive-toast__tag">{n.distrito || "Lima"}</span>
              <span className="qlive-toast__hora">{n.timestamp}</span>
            </header>
            <strong className="qlive-toast__titulo">{n.titulo}</strong>
            <p className="qlive-toast__mensaje">{n.mensaje}</p>
          </div>
          <button
            type="button"
            className="qlive-toast__cerrar"
            onClick={() => descartarNotificacion(n.id)}
            aria-label={`Descartar alerta ${n.titulo}`}
          >
            ×
          </button>
        </div>
      ))}
    </aside>
  );
}
