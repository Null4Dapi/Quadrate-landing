/**
 * src/store/appStore.js
 * Store centralizado de estado global con Zustand para Quadrate pe.
 * Aplica persistencia selectiva en localStorage exclusivamente para la preferencia de tema (theme).
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * @typedef {Object} Notice
 * @property {string} id
 * @property {string} message
 * @property {string} createdAt
 */

/**
 * @typedef {Object} AppState
 * @property {'light' | 'dark'} theme
 * @property {Notice[]} notifications
 * @property {(theme: 'light' | 'dark') => void} setTheme
 * @property {(notice: Notice) => void} addNotification
 * @property {() => void} clearNotifications
 */

export const useAppStore = create(
  persist(
    (set) => ({
      theme: "light",
      notifications: [],
      setTheme: (theme) => set({ theme }),
      addNotification: (notice) =>
        set((state) => ({
          notifications: [notice, ...state.notifications].slice(0, 20),
        })),
      clearNotifications: () => set({ notifications: [] }),
    }),
    {
      name: "experiencias-app-store",
      // Justificación: partialize evita almacenar notificaciones volátiles o datos sensibles en localStorage.
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);
