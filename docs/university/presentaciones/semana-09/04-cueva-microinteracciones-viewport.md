# Ficha Individual de Exposición — Cueva (4:40 – 6:20)
### *Etapa 2: Microinteracciones Táctiles, Rendimiento en Viewport y Descarte de Drag*

**Tiempo asignado:** 1 minuto con 40 segundos (Máximo 2:00 min)  
**Objetivo principal:** Explicar el diseño ergonómico de microinteracciones (`whileHover` vs `whileTap`), la optimización de recursos mediante `whileInView`, y la justificación técnica del descarte del arrastre (`drag`).

---

## 1. Código a Proyectar en Pantalla

Abrir en el editor: sección interactiva de la tarjeta en `src/js/react/tarjeta-cochera.tsx`

```tsx
<motion.article
  variants={cardVariants}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.2 }}
  whileHover={reduceMotion ? undefined : { y: -4, scale: 1.01 }}
  className="quadrate-live__card"
>
  {/* Botón con respuesta táctil elástica */}
  <motion.button
    type="button"
    whileTap={reduceMotion ? undefined : { scale: 0.96 }}
    onClick={manejarSeleccion}
    className="quadrate-live__card-btn"
  >
    Ver y Reservar
  </motion.button>
</motion.article>
```

---

## 2. Puntos Clave a Señalar con el Mouse (Checklist)

1. **Línea 4:** Señalar `viewport={{ once: true, amount: 0.2 }}`. Explicar el ahorro de ciclos de CPU al activarse al 20% de visibilidad una sola vez.
2. **Línea 5 y Línea 10:** Señalar la diferencia entre `whileHover` (`y: -4`) para punteros desktop y `whileTap` (`scale: 0.96`) para dispositivos táctiles.
3. **Mencionar firmemente:** La decisión de ingeniería de **descartar el arrastre (`drag`)**.

---

## 3. Discurso Palabra por Palabra (Directo al Grano)

> "Gracias Vílchez. En interfaces para conductores, la retroalimentación inmediata es indispensable.
> 
> Diseñamos dos respuestas físicas diferenciadas:
> 1. En desktop, `whileHover` eleva sutilmente la tarjeta 4 píxeles (`y: -4`) con escala de 1.01 para denotar que el contenedor es clickeable.
> 2. En móviles, como no existe hover táctil, implementamos `whileTap` con `scale: 0.96` tanto en el botón 'Ver y Reservar' como en la estrella de favoritos. Esta compresión elástica simula un botón físico real y le da certeza al usuario de que su toque fue registrado.
> 
> Para el rendimiento, miren el atributo `whileInView`. Enlazamos `viewport={{ once: true, amount: 0.2 }}`. La tarjeta solo anima su entrada cuando al menos el 20% entra al campo de visión del usuario y se ejecuta una sola vez (`once: true`). Así evitamos caídas de fotogramas por recálculos innecesarios en tarjetas fuera de pantalla.
> 
> Un punto clave de nuestra rúbrica: **evaluamos y descartamos técnicamente el arrastre (Drag)**. En una pantalla móvil de 375 píxeles, permitir arrastrar tarjetas colisiona directamente con el gesto natural de scroll vertical, atrapando el dedo del usuario. Además, en una app de cocheras el objetivo es consultar aforo y reservar, no desplazar cajas por la pantalla.
> 
> Le doy el pase a Víctor para ver la accesibilidad universal y las conclusiones."

---

## 4. Preguntas Rápidas del Docente y Respuestas Relámpago

* **P: ¿Por qué `:hover` no es suficiente para la experiencia de usuario en aplicaciones web modernas?**  
  * **R:** *"Porque más del 70% de nuestros usuarios acceden desde smartphones donde no existe cursor flotante; sin `whileTap`, el usuario móvil no recibe confirmación visual inmediata al pulsar el botón."*

* **P: ¿Qué problema de rendimiento se evita con `viewport={{ once: true }}`?**  
  * **R:** *"Evita que el motor del navegador re-ejecute cálculos continuos de renderizado cada vez que el usuario sube y baja por la lista, manteniendo una tasa estable de 60 fotogramas por segundo."*
