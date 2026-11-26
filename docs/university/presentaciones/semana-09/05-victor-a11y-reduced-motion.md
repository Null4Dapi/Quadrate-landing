# Ficha Individual de Exposición — Víctor (6:20 – 8:00)
### *Etapa 2: Accesibilidad Universal, Hook `useReducedMotion` y Cierre Ejecutivo*

**Tiempo asignado:** 1 minuto con 40 segundos (Máximo 2:00 min)  
**Objetivo principal:** Demostrar el cumplimiento riguroso de accesibilidad (WCAG 2.1 Criterio 2.3.3), la desactivación de animaciones ante `prefers-reduced-motion`, la navegación por teclado y el cierre formal del equipo.

---

## 1. Código a Proyectar en Pantalla

Abrir en el editor: Hook en `src/js/react/motion.js` y controles accesibles en `tarjeta-cochera.tsx`

```javascript
// Hook de accesibilidad para movimiento reducido
export function useReducedMotion() {
  const [reduceMotion, setReduceMotion] = React.useState(() => {
    return typeof window !== "undefined" && window.matchMedia
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;
  });

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const listener = (e) => setReduceMotion(e.matches);
    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, []);

  return reduceMotion;
}

// Aplicación en el componente
whileHover={reduceMotion ? undefined : { y: -4, scale: 1.01 }}
whileTap={reduceMotion ? undefined : { scale: 0.96 }}
```

---

## 2. Puntos Clave a Señalar con el Mouse (Checklist)

1. **Líneas 4–6:** Señalar la consulta nativa `window.matchMedia("(prefers-reduced-motion: reduce)")`.
2. **Líneas 18–19:** Señalar la condición ternaria: si `reduceMotion` es `true`, la animación física se convierte en `undefined` (cero transformaciones físicas).
3. **Señalar en el JSX:** Los atributos `aria-pressed={esFavorita}` y `tabIndex={0}` para navegación por teclado (`Enter`/`Espacio`).
4. **Demostración visual opcional (5 seg):** En Chrome DevTools (`Ctrl+Shift+P` ➔ *Emulate CSS prefers-reduced-motion*).

---

## 3. Discurso Palabra por Palabra (Directo al Grano)

> "Gracias Cueva. Culminamos con el aspecto más crítico de la arquitectura: la accesibilidad bajo el criterio WCAG 2.1 Criterio 2.3.3.
> 
> Creamos el hook modular `useReducedMotion()`. Escucha la directiva `@media (prefers-reduced-motion: reduce)` del sistema operativo. Si un usuario con sensibilidad vestibular o mareos por movimiento tiene activa esta preferencia, nuestro código desactiva instantáneamente los desplazamientos en Y y las escalas, reduciendo la animación a una atenuación estática de opacidad de 100 milisegundos.
> 
> *(Demostración rápida de 5 segundos con el inspector de DevTools simulando reduced motion).*
> 
> Asimismo, blindamos la accesibilidad motriz: la tarjeta se navega 100% con teclado mediante `tabIndex={0}`, escucha eventos `Enter` y `Espacio`, proyecta un anillo `:focus-visible` de alto contraste en color terracota y actualiza dinámicamente el atributo `aria-pressed` en el botón de favoritos.
> 
> **Conclusión del equipo:**  
> Logramos articular TypeScript como garante del contrato de datos de negocio y Framer Motion como experiencia inmersiva ergonómica, sin sobrecargar el navegador y cumpliendo al 100% las matrices de prueba de ambas etapas.
> 
> Quedamos listos para sus preguntas, profesor."

---

## 4. Preguntas Rápidas del Docente y Respuestas Relámpago

* **P: ¿Por qué descartaron la animación continua de pulso (`pulse`) en las tarjetas de aforo crítico?**  
  * **R:** *"Porque las animaciones continuas e infinitas generan fatiga cognitiva en los conductores, violan directrices WCAG para usuarios neurodivergentes y distraen de la lectura de tarifas. Optamos por alto contraste de color fijo (`#B91C1C`) y datos numéricos precisos."*

* **P: ¿Qué valida TypeScript y qué queda fuera de su alcance respecto a la accesibilidad?**  
  * **R:** *"TypeScript valida la presencia sintáctica de props como `aria-label: string`, pero no puede auditar si el texto es semánticamente útil para un lector de pantalla ni si la relación de contraste de color cumple el ratio mínimo de 4.5:1."*
