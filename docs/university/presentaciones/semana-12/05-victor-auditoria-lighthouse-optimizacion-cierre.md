# Ficha Individual de Exposición — Víctor / Manuel (6:20 – 8:00)
### *Etapa 2: Auditoría Lighthouse (Core Web Vitals), React DevTools Profiler, Optimización y Cierre*

**Tiempo asignado:** 1 minuto con 40 segundos (Máximo 2:00 min)  
**Objetivo principal:** Presentar los resultados cuantitativos de la auditoría experimental con Lighthouse (LCP, INP/TBT, CLS), evidenciar el perfilado con React DevTools Profiler y demostrar la optimización multimedia con la comparativa Antes vs Después.

---

## 1. Código y Datos a Proyectar en Pantalla

Abrir en el editor de código: `docs/university/presentaciones/semana-12/05-victor-codigo.tsx` (o reporte de Lighthouse).

```
TABLA COMPARATIVA FINAL DE RENDIMIENTO (MÓVIL 4G LENTO - CHROME 131):
┌───────────────────────────────┬──────────────────┬───────────────────┬──────────────────────┐
│ Métrica                       │ Estado ANTES     │ Estado DESPUÉS    │ Variación / Impacto  │
├───────────────────────────────┼──────────────────┼───────────────────┼──────────────────────┤
│ Largest Contentful Paint (LCP)│ 3.10 segundos    │ 1.56 segundos     │  49.6% de reducción │
│ Cumulative Layout Shift (CLS) │ 0.18             │ 0.00              │ 100.0% de eliminación│
│ Total Blocking Time (TBT)     │ 140 ms           │ 40 ms             │  71.4% de mejora    │
│ Lighthouse Performance Score  │ 78 / 100         │ 99 / 100          │ +21 puntos ganados   │
└───────────────────────────────┴──────────────────┴───────────────────┴──────────────────────┘
```

---

## 2. Puntos Clave a Señalar con el Mouse (Checklist)

1. **Líneas 1–8:** Señalar la tabla comparativa: enfatizar la caída de LCP de 3.10 s a 1.56 s (dentro del umbral verde ≤ 2.5 s).
2. **Línea 4:** Señalar CLS: 0.18 reducido a **0.00**. Explicar cómo la eliminación del salto visual previene clics erróneos.
3. **Líneas 17–25:** Señalar el código optimizado: atributos `width={640}`, `height={360}` y `fetchpriority="high"`.

---

## 3. Discurso Palabra por Palabra (Directo al Grano)

> "Gracias Cueva. En la Guía de Laboratorio sometimos esta arquitectura a una auditoría científica bajo protocolo estricto en Google Chrome 131, modo incógnito y emulación móvil 4G, promediando tres mediciones consecutivas.
>
> En la línea base inicial detectamos dos problemas severos: un **LCP de 3.10 segundos** (fuera del umbral de 2.5 s) y un **CLS de 0.18**, producto de que la imagen de la cochera cargaba sin dimensiones reservadas, empujando los botones hacia abajo abruptamente.
>
> Grabamos la interacción en **React DevTools Profiler**: confirmamos que al interactuar con el botón de favoritos, el renderizado tardó apenas **0.8 milisegundos**, y los componentes padre no sufrieron ningún re-renderizado gracias al aislamiento de `'use client'`.
>
> Para corregir el LCP y el CLS aplicamos la optimización que ven en pantalla: reservamos el espacio con `aspect-ratio: 16 / 9`, definimos `width` y `height` exactos con `next/image` y priorizamos la descarga con `fetchPriority='high'`.
>
> Los resultados fueron contundentes:
> 1. El **LCP cayó en un 49.6%**, pasando de 3.10 a **1.56 segundos**.
> 2. El **CLS se redujo a 0.00 absoluto**, eliminando por completo cualquier salto de pantalla.
> 3. El **Performance Score en Mobile escaló de 78 a 99 sobre 100**, alcanzando un **100 perfecto** en la ruta institucional y en escritorio.
>
> Con esto demostramos que Next.js 15, combinado con disciplina de maquetación, entrega una experiencia sólida para los conductores de Lima. Quedamos listos para las preguntas del docente. Muchas gracias."

---

## 4. Preguntas Trampa del Docente y Respuestas Blindadas

**P: ¿Por qué en la Guía de Laboratorio se usó TBT y no INP si INP es el Core Web Vital oficial?**  
*R:* "Porque INP (*Interaction to Next Paint*) es una métrica de campo que exige interacción de un usuario humano real a lo largo de toda su sesión de navegación. En pruebas de laboratorio sintéticas y automatizadas como Lighthouse, TBT (*Total Blocking Time*) es el indicador indirecto (*proxy*) oficial que predice si el hilo principal estará libre para responder a los clics del usuario."

**P: ¿Tener un score de 100 en Lighthouse significa que la página será rápida para todos los usuarios en Lima?**  
*R:* "No necesariamente. Lighthouse mide condiciones de laboratorio ideales y controladas. En el mundo real, los usuarios en Lima enfrentan saturación de celdas móviles 4G, procesadores de gama baja con temperatura elevada y extensiones de navegador. El score de 100 certifica que el código frontend está óptimamente estructurado, pero la experiencia real requiere monitoreo continuo de campo con Real User Monitoring (RUM)."
