import React from "react";
import { useAppStore } from "../../store/appStore.js";
import { changeTheme } from "../../store/syncChannel.js";

/**
 * Componente consumidor de Zustand con selector granular para el conteo de alertas.
 */
export function NotificationBadge() {
  const count = useAppStore((state) => state.notifications.length);
  return (
    <span className="badge-notificaciones" aria-live="polite">
      Alertas: {count}
    </span>
  );
}

/**
 * Conmutador interactivo de tema claro / oscuro con sincronización multi-pestaña.
 */
export function ControlTemaZustand() {
  const theme = useAppStore((state) => state.theme);

  const alternarTema = () => {
    const siguienteTema = theme === "light" ? "dark" : "light";
    changeTheme(siguienteTema);
  };

  return (
    <button
      type="button"
      className="btn-conmutador-tema"
      onClick={alternarTema}
      aria-label={`Cambiar a tema ${theme === "light" ? "oscuro" : "claro"}`}
      title="Sincronizado entre pestañas vía BroadcastChannel"
    >
      {theme === "light" ? "🌙 Modo Garita Nocturna" : "☀️ Modo Diurno"}
    </button>
  );
}

/**
 * Panel de historial de alertas operativas consumiendo el store de Zustand.
 */
export function NotificationPanel() {
  const items = useAppStore((state) => state.notifications);
  const clear = useAppStore((state) => state.clearNotifications);

  return (
    <section className="panel-historial" aria-label="Historial de alertas operativas">
      <header className="panel-historial__header">
        <div className="panel-historial__title-row">
          <h4 className="panel-historial__title">Historial en Vivo (Zustand Store)</h4>
          <NotificationBadge />
        </div>
        {items.length > 0 && (
          <button type="button" onClick={clear} className="panel-historial__btn-clear">
            Limpiar avisos
          </button>
        )}
      </header>
      <div className="panel-historial__lista">
        {items.length === 0 ? (
          <p className="panel-historial__empty">Sin alertas operativas en este momento.</p>
        ) : (
          items.map((n) => (
            <article key={n.id} className="tarjeta-alerta">
              <p className="tarjeta-alerta__mensaje">{n.message}</p>
              <time className="tarjeta-alerta__tiempo">
                {new Date(n.createdAt).toLocaleTimeString()}
              </time>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
