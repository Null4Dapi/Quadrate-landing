import React from "react";
import type { Notification } from "./01-luciana-codigo";

export function AlertaToast({
  notificacion,
  onCerrar,
}: {
  notificacion?: Notification | null;
  onCerrar: () => void;
}) {
  if (!notificacion) return null;

  return (
    // Live Region accesible para lectores de pantalla bajo WCAG 2.1
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className={`quadrate-live__toast quadrate-live__toast--${notificacion.tipo}`}
    >
      <div className="quadrate-live__toast-icono" aria-hidden="true">🔔</div>
      <div className="quadrate-live__toast-cuerpo">
        <strong>{notificacion.title}</strong>
        <p>{notificacion.message}</p>
      </div>
      <button type="button" onClick={onCerrar} aria-label="Cerrar notificación">
        ×
      </button>
    </div>
  );
}

/**
 * PASO AL NAVEGADOR WEB (DEMOSTRACIÓN FUNCIONAL EN VIVO MULTIUSUARIO):
 * 1. Abrir 2 ventanas de navegador lado a lado:
 *    - Ventana A en distrito:san-isidro
 *    - Ventana B en distrito:miraflores
 * 2. Emitir alerta a San Isidro: evidenciar que solo la Ventana A incrementa la campana
 *    y muestra el Toast en < 12ms sin tocar la Ventana B.
 * 3. Dar la conclusión técnica final y despedir al equipo.
 */
