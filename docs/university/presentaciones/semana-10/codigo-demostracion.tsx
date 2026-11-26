/**
 * QUADRATE PE — SEMANA 10: CÓDIGO ARTICULADOR DE SUSTENTACIÓN
 * Context API y Prop Drilling (Etapa 1) + Servidor WebSocket Propio y Salas (Etapa 2)
 *
 * Archivo unificado de demostración en vivo preparado para proyectar en VS Code.
 * Cada bloque está claramente rotulado por integrante con sus líneas de exposición.
 */

import React, { createContext, useContext, useState, useEffect, useRef } from "react";

// ============================================================================
// BLOQUE 1: LUCIANA — MODELOS DE DATOS Y CONTRATOS FORMALES (0:00 - 1:30)
// ============================================================================

export type TipoAlertaOperativa =
  | "aforo_critico"
  | "tarifa_dinamica"
  | "reserva_eta"
  | "checkin_lpr"
  | "mantenimiento";

export interface Notification {
  readonly id: string;
  readonly title: string;
  readonly message: string;
  readonly distrito: string;
  readonly tipo: TipoAlertaOperativa;
  readonly createdAt: string; // ISO 8601
  readonly read: boolean;
}

export interface NotificationContextValue {
  readonly notifications: readonly Notification[];
  readonly unreadCount: number;
  readonly addNotification: (item: Omit<Notification, "read">) => void;
  readonly markAsRead: (id: string) => void;
  readonly clearNotifications: () => void;
}

export interface ThemeContextValue {
  readonly theme: "light" | "dark";
  readonly toggleTheme: () => void;
}


// ============================================================================
// BLOQUE 2: DIEGO — PROVIDER, ESTADO DERIVADO Y CONSUMO DEFENSIVO (1:30 - 3:05)
// ============================================================================

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // 1. ESTADO DERIVADO: Cero useState adicional redundante
  const unreadCount = notifications.filter((n) => !n.read).length;

  const addNotification = (item: Omit<Notification, "read">) => {
    const nueva: Notification = {
      ...item,
      id: item.id || `notif-${Date.now()}`,
      read: false,
    };
    // Inmutabilidad estricta: lo nuevo arriba
    setNotifications((prev) => [nueva, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, addNotification, markAsRead, clearNotifications }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

// 2. CUSTOM HOOK CON GUARDIA DEFENSIVA CONTRA CONSUMO INDEBIDO
export function useNotifications(): NotificationContextValue {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotifications debe consumirse dentro de un NotificationProvider");
  }
  return context;
}


// ============================================================================
// BLOQUE 3: VÍLCHEZ — LÓGICA DEL SERVIDOR WEBSOCKET CON SALAS (3:05 - 4:40)
// ============================================================================

/**
 * Representación de la lógica nuclear en Node.js (server/server.js):
 * - Mapa de conjuntos en memoria: Map<string, Set<WebSocket>>
 * - Cero brokers externos (Pusher / Firebase)
 * - Liberación responsable de memoria en socket.on("close")
 */
export const logicaServidorWebSocketSnippet = `
const salas = new Map(); // clave: room, valor: Set<WebSocket>

wss.on("connection", (socket) => {
  let salaActual = null;

  socket.on("message", (datosCrudos) => {
    const mensaje = JSON.parse(datosCrudos.toString());
    
    // Suscripción a sala distrital
    if (mensaje.action === "join-room") {
      if (!salas.has(mensaje.room)) salas.set(mensaje.room, new Set());
      salas.get(mensaje.room).add(socket);
      salaActual = mensaje.room;
    }

    // Difusión selectiva exclusiva a la sala
    if (mensaje.action === "publish-notification") {
      const clientes = salas.get(mensaje.room);
      if (clientes) {
        for (const cliente of clientes) {
          if (cliente.readyState === 1) cliente.send(JSON.stringify(mensaje));
        }
      }
    }
  });

  // Limpieza en desconexión para evitar memory leaks
  socket.on("close", () => {
    if (salaActual && salas.has(salaActual)) {
      salas.get(salaActual).delete(socket);
      if (salas.get(salaActual).size === 0) salas.delete(salaActual);
    }
  });
});
`;


// ============================================================================
// BLOQUE 4: CUEVA — HOOK useExperienceSocket Y CLEANUP SEGURO (4:40 - 6:20)
// ============================================================================

export function useExperienceSocket(sala: string = "red-cocheras-lima") {
  const { addNotification } = useNotifications();
  const [estadoConexion, setEstadoConexion] = useState<string>("conectando");
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:3001");
    socketRef.current = socket;

    socket.onopen = () => {
      setEstadoConexion("conectado");
      socket.send(JSON.stringify({ action: "join-room", room: sala }));
    };

    socket.onmessage = (evento: MessageEvent) => {
      try {
        const data = JSON.parse(evento.data);
        if (data.event === "notification:new" && data.payload) {
          // Puente directo: WebSocket transporta, Context distribuye a la UI
          addNotification(data.payload);
        }
      } catch (err) {
        console.error("[WS Cliente] Error:", err);
      }
    };

    socket.onclose = () => setEstadoConexion("desconectado");

    // FUNCIÓN DE LIMPIEZA OBLIGATORIA (CLEANUP): Evita sockets zombis
    return () => {
      if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
        socket.close();
      }
    };
  }, [sala, addNotification]);

  return { estadoConexion };
}


// ============================================================================
// BLOQUE 5: VÍCTOR — ALERTA TOAST ACCESIBLE (aria-live) Y CONSUMIDOR (6:20 - 8:00)
// ============================================================================

export function AlertaToast({
  notificacion,
  onCerrar,
}: {
  notificacion?: Notification | null;
  onCerrar: () => void;
}): JSX.Element | null {
  if (!notificacion) return null;

  return (
    // Live Region accesible para lectores de pantalla bajo WCAG 2.1
    <aside
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className={`quadrate-live__toast quadrate-live__toast--${notificacion.tipo}`}
    >
      <div className="quadrate-live__toast-header">
        <span aria-hidden="true">🔔</span>
        <strong>{notificacion.title}</strong>
        <span className="quadrate-live__toast-distrito">[{notificacion.distrito}]</span>
      </div>
      <p className="quadrate-live__toast-mensaje">{notificacion.message}</p>
      <button
        type="button"
        onClick={onCerrar}
        aria-label="Cerrar notificación de telemetría"
        className="quadrate-live__toast-btn-cerrar"
      >
        ×
      </button>
    </aside>
  );
}

// Botón de campana consumidor sin prop drilling
export function NotificationBell({ onAbrirPanel }: { onAbrirPanel: () => void }): JSX.Element {
  const { unreadCount } = useNotifications();

  return (
    <button
      type="button"
      onClick={onAbrirPanel}
      role="button"
      aria-haspopup="dialog"
      aria-label={`Alertas operativas de caseta: ${unreadCount} no leídas`}
      className="quadrate-live__bell-btn"
    >
      <span aria-hidden="true">🔔</span>
      {unreadCount > 0 && (
        <span className="quadrate-live__bell-badge">{unreadCount}</span>
      )}
    </button>
  );
}
