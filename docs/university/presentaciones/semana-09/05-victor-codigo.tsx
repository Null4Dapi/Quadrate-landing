import React, { useState, useEffect } from "react";

// Hook que detecta la preferencia de movimiento reducido del sistema operativo
export function useReducedMotion(): boolean {
  const [reduceMotion, setReduceMotion] = useState<boolean>(() => {
    return typeof window !== "undefined" && window.matchMedia
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;
  });

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const listener = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, []);

  return reduceMotion;
}

// Desactivación de transforms para evitar cinetosis vestibular:
export const aplicacionAccesibleSnippet = `
whileHover={reduceMotion ? undefined : { y: -4, scale: 1.01 }}
whileTap={reduceMotion ? undefined : { scale: 0.96 }}
`;

/**
 * PASO AL NAVEGADOR WEB (DEMOSTRACIÓN FUNCIONAL EN VIVO):
 * 1. Probar navegación con teclado (Tab / Shift+Tab y activación con Enter/Espacio).
 * 2. Abrir Chrome DevTools (Ctrl+Shift+P -> Emulate prefers-reduced-motion) y mostrar anulación física.
 * 3. Dar el cierre formal del equipo.
 */
