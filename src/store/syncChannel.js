/**
 * src/store/syncChannel.js
 * Sincronización multi-pestaña del tema en tiempo real mediante BroadcastChannel API.
 */

import { useAppStore } from "./appStore.js";

const NOMBRE_CANAL = "experiencias-sync";
let channel = null;

if (typeof window !== "undefined" && "BroadcastChannel" in window) {
  try {
    channel = new BroadcastChannel(NOMBRE_CANAL);

    channel.onmessage = (event) => {
      if (event.data?.type === "THEME_CHANGED") {
        const nuevoTema = event.data.theme;
        useAppStore.getState().setTheme(nuevoTema);
        aplicarTemaVisualDOM(nuevoTema);
      }
    };
  } catch (error) {
    console.warn("[syncChannel] BroadcastChannel no admitido o restringido:", error);
  }
}

/**
 * Aplica el tema al elemento raíz del documento.
 * @param {'light' | 'dark'} tema
 */
export function aplicarTemaVisualDOM(tema) {
  if (typeof document !== "undefined") {
    document.documentElement.setAttribute("data-theme", tema);
    if (tema === "dark") {
      document.body.classList.add("tema-oscuro");
    } else {
      document.body.classList.remove("tema-oscuro");
    }
  }
}

/**
 * Conmuta y sincroniza el tema en el store y con las demás pestañas activas.
 * @param {'light' | 'dark'} theme
 */
export function changeTheme(theme) {
  useAppStore.getState().setTheme(theme);
  aplicarTemaVisualDOM(theme);

  if (channel) {
    try {
      channel.postMessage({ type: "THEME_CHANGED", theme });
    } catch (e) {
      console.warn("[syncChannel] Error al emitir mensaje en el canal:", e);
    }
  }
}

/**
 * Cierre responsable de recursos al desmontar el servicio.
 */
export function closeThemeSync() {
  if (channel) {
    channel.close();
    channel = null;
  }
}
