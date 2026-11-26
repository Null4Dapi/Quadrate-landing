/**
 * src/store/syncChannel.js
 * Sincronización multi-pestaña del tema en tiempo real mediante BroadcastChannel API.
 */

import { useAppStore } from "./appStore.js";
import { guardarTema, aplicarTemaDOM, sanitizarTema } from "../js/utils/theme.js";

const NOMBRE_CANAL = "experiencias-sync";
let channel = null;

if (typeof window !== "undefined" && "BroadcastChannel" in window) {
  try {
    channel = new BroadcastChannel(NOMBRE_CANAL);

    channel.onmessage = (event) => {
      if (event.data?.type === "THEME_CHANGED") {
        const nuevoTema = sanitizarTema(event.data.theme);
        useAppStore.getState().setTheme(nuevoTema);
        aplicarTemaDOM(nuevoTema);
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
  aplicarTemaDOM(tema);
}

/**
 * Conmuta y sincroniza el tema en el store y con las demás pestañas activas.
 * @param {'light' | 'dark'} theme
 */
export function changeTheme(theme) {
  const seguro = sanitizarTema(theme);
  guardarTema(seguro);
  useAppStore.getState().setTheme(seguro);
  aplicarTemaDOM(seguro);

  if (channel) {
    try {
      channel.postMessage({ type: "THEME_CHANGED", theme: seguro });
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
