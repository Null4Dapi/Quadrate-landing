/**
 * Quadrate pe — Subsistema de Gestión y Sincronización de Tema
 * Centraliza la persistencia segura, validación por lista blanca y
 * sincronización reactiva multi-pestaña (BroadcastChannel + storage event).
 */

export const CLAVE_TEMA = "quadrate_theme";

/**
 * Valida y sanitiza el valor del tema mediante lista blanca estricta.
 * @param {string|null|undefined} tema
 * @returns {'light' | 'dark'}
 */
export function sanitizarTema(tema) {
  return tema === "dark" ? "dark" : "light";
}

/**
 * Obtiene el tema almacenado de forma segura con fallback a prefers-color-scheme.
 * Tolera bloqueos de almacenamiento en navegación privada de Safari/Firefox.
 * @returns {'light' | 'dark'}
 */
export function obtenerTemaGuardado() {
  if (typeof window === "undefined") return "light";

  try {
    const valor = localStorage.getItem(CLAVE_TEMA);
    if (valor === "dark" || valor === "light") {
      return valor;
    }
  } catch (error) {
    // SecurityError en contextos sandbox o navegación privada estricta
  }

  try {
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
  } catch (error) {}

  return "light";
}

/**
 * Persiste el tema en localStorage de forma tolerante a fallos.
 * @param {'light' | 'dark'} tema
 * @returns {'light' | 'dark'}
 */
export function guardarTema(tema) {
  const seguro = sanitizarTema(tema);
  try {
    localStorage.setItem(CLAVE_TEMA, seguro);
    // Espejo de compatibilidad para el store de Zustand de la demo
    localStorage.setItem("quadrate_tema", seguro === "dark" ? "oscuro" : "claro");
  } catch (error) {}
  return seguro;
}

/**
 * Aplica el tema visual al DOM (atributo data-theme en html y clase en body).
 * @param {'light' | 'dark'} tema
 * @returns {'light' | 'dark'}
 */
export function aplicarTemaDOM(tema) {
  const seguro = sanitizarTema(tema);
  if (typeof document !== "undefined") {
    if (seguro === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
      document.body?.classList.add("tema-oscuro");
    } else {
      document.documentElement.removeAttribute("data-theme");
      document.body?.classList.remove("tema-oscuro");
    }
  }
  return seguro;
}

let canal = null;
if (typeof window !== "undefined" && "BroadcastChannel" in window) {
  try {
    canal = new BroadcastChannel("experiencias-sync");
  } catch (error) {}
}

/**
 * Modifica el tema, lo persiste en almacenamiento y lo propaga a otras pestañas.
 * @param {'light' | 'dark'} tema
 */
export function emitirCambioTema(tema) {
  const seguro = sanitizarTema(tema);
  guardarTema(seguro);
  aplicarTemaDOM(seguro);

  if (canal) {
    try {
      canal.postMessage({ type: "THEME_CHANGED", theme: seguro });
    } catch (error) {}
  }
}

/**
 * Suscribe un observador a cambios de tema provenientes de otras pestañas.
 * @param {(tema: 'light' | 'dark') => void} callback
 * @returns {() => void} Función de desuscripción
 */
export function suscribirCambiosTema(callback) {
  if (typeof window === "undefined") return () => {};

  const manejadorCanal = (evento) => {
    if (evento.data?.type === "THEME_CHANGED" && evento.data.theme) {
      const nuevo = sanitizarTema(evento.data.theme);
      aplicarTemaDOM(nuevo);
      callback(nuevo);
    }
  };

  if (canal) {
    canal.addEventListener("message", manejadorCanal);
  }

  const manejadorStorage = (evento) => {
    if (evento.key === CLAVE_TEMA && evento.newValue) {
      const nuevo = sanitizarTema(evento.newValue);
      aplicarTemaDOM(nuevo);
      callback(nuevo);
    }
  };
  window.addEventListener("storage", manejadorStorage);

  return () => {
    if (canal) canal.removeEventListener("message", manejadorCanal);
    window.removeEventListener("storage", manejadorStorage);
  };
}
