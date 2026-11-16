import React, { useState, useEffect } from "react";
import { useAppStore } from "../../store/appStore.js";
import { changeTheme } from "../../store/syncChannel.js";

/**
 * Conteo granular de alertas operativas con selector de Zustand.
 */
export function NotificationBadge() {
  const count = useAppStore((state) => state.notifications.length);
  return (
    <span className="telemetria-feed__badge" aria-live="polite">
      {count} {count === 1 ? "alerta" : "alertas"}
    </span>
  );
}

/**
 * Conmutador arquitectónico de turno de garita (tema claro / oscuro).
 * Sincronizado multi-pestaña con BroadcastChannel y persistido en localStorage con Zustand.
 */
export function ControlTemaZustand() {
  const theme = useAppStore((state) => state.theme);
  const esOscuro = theme === "dark";

  return (
    <button
      type="button"
      className={`btn-turno-garita ${esOscuro ? "btn-turno-garita--nocturno" : ""}`}
      onClick={() => changeTheme(esOscuro ? "light" : "dark")}
      aria-label={`Cambiar a turno ${esOscuro ? "diurno" : "nocturno"}`}
      title="Sincronizado entre pestañas vía BroadcastChannel"
    >
      <span className="btn-turno-garita__icono" aria-hidden="true">
        {esOscuro ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        )}
      </span>
      <span className="btn-turno-garita__texto">
        {esOscuro ? "Turno Nocturno" : "Turno Diurno"}
      </span>
    </button>
  );
}

/**
 * Toast flotante no intrusivo para el usuario (UX).
 * Muestra alertas contextuales de disponibilidad en tiempo real sin romper el flujo de navegación.
 */
export function ToastNotificacionZustand() {
  const notifications = useAppStore((state) => state.notifications);
  const [toastVisible, setToastVisible] = useState(null);

  useEffect(() => {
    if (notifications.length > 0) {
      const ultima = notifications[0];
      setToastVisible(ultima);
      const timer = setTimeout(() => {
        setToastVisible((prev) => (prev?.id === ultima.id ? null : prev));
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [notifications]);

  if (!toastVisible) return null;

  return (
    <aside className="toast-operativo" role="status" aria-live="polite">
      <div className="toast-operativo__dot" aria-hidden="true" />
      <div className="toast-operativo__cuerpo">
        {toastVisible.nombreCochera && (
          <strong className="toast-operativo__cochera">{toastVisible.nombreCochera}: </strong>
        )}
        <span className="toast-operativo__mensaje">{toastVisible.message}</span>
      </div>
      <button
        type="button"
        className="toast-operativo__cerrar"
        onClick={() => setToastVisible(null)}
        aria-label="Cerrar notificación"
      >
        ✕
      </button>
    </aside>
  );
}

/**
 * Drawer / Consola colapsable de telemetría y diagnóstico para evaluadores (DX).
 * Confinado en un dock inferior que no interfiere con la experiencia del usuario.
 */
export function TelemetriaDrawerZustand({
  estaPausado = false,
  onAlternarPausa,
  onSimularEvento,
  estadoWs = "en vivo",
}) {
  const [estaAbierto, setEstaAbierto] = useState(false);
  const notifications = useAppStore((state) => state.notifications);
  const clearNotifications = useAppStore((state) => state.clearNotifications);

  return (
    <div className={`telemetria-dock ${estaAbierto ? "telemetria-dock--abierto" : ""}`}>
      {/* Línea divisoria minimalista 'Modo desarrollador' desplegable */}
      <button
        type="button"
        className="telemetria-dock__trigger dev-mode-trigger"
        onClick={() => setEstaAbierto((v) => !v)}
        aria-expanded={estaAbierto}
        aria-controls="telemetria-panel-drawer"
        title="Modo desarrollador: alternar panel de diagnóstico y tramas en vivo"
      >
        <span className="dev-mode-trigger__label">Modo desarrollador</span>
        <span className="dev-mode-trigger__line" aria-hidden="true" />
        <span className="dev-mode-trigger__status">
          <span
            className={`dev-mode-trigger__dot ${
              estaPausado ? "dev-mode-trigger__dot--pausa" : "dev-mode-trigger__dot--activo"
            }`}
            aria-hidden="true"
          />
          {notifications.length > 0 && (
            <span className="dev-mode-trigger__count">{notifications.length} tramas</span>
          )}
          <span className="dev-mode-trigger__chevron">{estaAbierto ? "Contraer ▲" : "Desplegar ▼"}</span>
        </span>
      </button>

      {/* Consola DevTools desplegable */}
      {estaAbierto && (
        <section
          id="telemetria-panel-drawer"
          className="telemetria-drawer dev-console"
          aria-label="Consola de telemetría operativa y diagnóstico"
        >
          <header className="dev-console__header">
            <div className="dev-console__meta">
              <span className="dev-console__tag">DEV CONSOLE</span>
              <span className="dev-console__endpoint">ws://cloudrun/v1/eventos</span>
              <span className="dev-console__estado">
                {estaPausado ? "⏸ PAUSADO" : `● ENLACE ${estadoWs.toUpperCase()}`}
              </span>
            </div>
            <div className="dev-console__acciones">
              {onSimularEvento && (
                <button
                  type="button"
                  onClick={onSimularEvento}
                  className="dev-console__btn dev-console__btn--simular"
                  title="Inyectar evento simulado de garita"
                >
                  ⚡ Simular evento
                </button>
              )}
              {onAlternarPausa && (
                <button
                  type="button"
                  onClick={onAlternarPausa}
                  className="dev-console__btn"
                  title={estaPausado ? "Reanudar recepción" : "Pausar eventos"}
                >
                  {estaPausado ? "▶ Reanudar" : "⏸ Pausar"}
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  type="button"
                  onClick={clearNotifications}
                  className="dev-console__btn dev-console__btn--limpiar"
                  title="Vaciar buffer de eventos"
                >
                  Limpiar
                </button>
              )}
            </div>
          </header>

          <div className="telemetria-drawer__feed dev-console__terminal" role="log" aria-live="polite">
            <div className="dev-console__table-header" aria-hidden="true">
              <span className="dev-col dev-col--time">TIMESTAMP</span>
              <span className="dev-col dev-col--type">EVENTO</span>
              <span className="dev-col dev-col--node">NODO / COCHERA</span>
              <span className="dev-col dev-col--data">PAYLOAD / MENSAJE</span>
            </div>
            {notifications.length === 0 ? (
              <div className="dev-console__empty">
                <code>&gt; Conexión WebSocket activa. Esperando tramas de garitas en Lima Metropolitana...</code>
              </div>
            ) : (
              notifications.map((n) => (
                <article key={n.id} className="dev-console__row telemetria-drawer__item">
                  <time className="dev-col dev-col--time telemetria-drawer__tiempo">
                    {n.timestamp ||
                      new Date(n.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                  </time>
                  <span className={`dev-col dev-col--type telemetria-drawer__etiqueta telemetria-drawer__etiqueta--${n.tipo}`}>
                    {n.tipo === "ingreso" && "LPR_IN"}
                    {n.tipo === "salida" && "CHECKOUT"}
                    {n.tipo === "reserva_eta" && "ETA_HOLD"}
                    {n.tipo === "tarifa_dinamica" && "VALLE_RATE"}
                    {n.tipo === "aforo_critico" && "ALERT_CAP"}
                    {n.tipo !== "ingreso" &&
                      n.tipo !== "salida" &&
                      n.tipo !== "reserva_eta" &&
                      n.tipo !== "tarifa_dinamica" &&
                      n.tipo !== "aforo_critico" &&
                      (n.tipo ? n.tipo.toUpperCase() : "EVENT")}
                  </span>
                  <span className="dev-col dev-col--node">
                    {n.nombreCochera || "Sistema central"}
                  </span>
                  <span className="dev-col dev-col--data">
                    {n.message}
                  </span>
                </article>
              ))
            )}
          </div>
        </section>
      )}
    </div>
  );
}

/** Compatibilidad de importaciones existentes */
export const TelemetriaFeedZustand = TelemetriaDrawerZustand;
export const NotificationPanel = TelemetriaDrawerZustand;
