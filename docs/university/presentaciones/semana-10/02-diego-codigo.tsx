/**
 * QUADRATE PE — SEMANA 10: CÓDIGO INDIVIDUAL
 * Integrante: DIEGO (1:30 - 3:05)
 * Tema: NotificationProvider, Estado Derivado (unreadCount) y Consumo Defensivo
 * Archivo a proyectar en pantalla durante su grabación.
 */

import React, { createContext, useContext, useState } from "react";
import type { Notification } from "./01-luciana-codigo";

const NotificationContext = createContext<any>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // 1. ESTADO DERIVADO: Sin useState redundante (fuente única de verdad)
  const unreadCount = notifications.filter((n) => !n.read).length;

  const addNotification = (item: Omit<Notification, "read">) => {
    const nueva: Notification = {
      ...item,
      id: item.id || `notif-${Date.now()}`,
      read: false,
    };
    setNotifications((prev) => [nueva, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, addNotification, markAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
}

// 2. CUSTOM HOOK DEFENSIVO: Lanza error explícito si se consume fuera del Provider
export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotifications debe consumirse dentro de un NotificationProvider");
  }
  return context;
}
