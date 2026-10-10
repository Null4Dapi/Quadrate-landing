# Metas de Rendimiento, Optimización y Límites de Assets (PERFORMANCE.md)

Este documento especifica los presupuestos de rendimiento, políticas de activos y métricas Core Web Vitals para la versión 0.0.1 de **Quadrate pe**.

---

## 1. Presupuesto de Rendimiento (Performance Budget)

| Métrica | Presupuesto Límite | Objetivo Ideal |
| :--- | :--- | :--- |
| **Peso Total Primer Carga (First Load)** | < 500 KB (sin comprimir) | < 150 KB |
| **Documento HTML (`index.html`)** | < 25 KB | < 15 KB |
| **Hojas de Estilo CSS Combinadas** | < 45 KB | < 25 KB |
| **Scripts JS Combinados** | < 30 KB | < 15 KB |
| **Activos Gráficos (SVG / WebP)** | < 300 KB | < 80 KB |

---

## 2. Metas Core Web Vitals

- **LCP (Largest Contentful Paint):** `< 1.5s` en conexión móvil 4G estándar.
  - El elemento del Hero se renderiza con prioridad sin depender de fuentes remotas lentas.
- **CLS (Cumulative Layout Shift):** `= 0.0`
  - Todas las imágenes, íconos y mockups deben poseer atributos explícitos `width` y `height`.
  - Reserva de espacio en CSS para contenedores asíncronos o dinámicos.
- **INP (Interaction to Next Paint):** `< 100ms`
  - Lógica JavaScript reactiva sin bloqueos del hilo principal.
  - Interacciones táctiles optimizadas con respuesta visual inmediata.

---

## 3. Políticas de Fuentes y Tipografía

- Prohibido enlazar Google Fonts u otros CDNs externos que agreguen latencia DNS/TLS y generen saltos visuales (FOUT/FOIT).
- En Fase 1 se utiliza una pila de fuentes del sistema moderna (`system-ui`) que otorga renderizado nativo instantáneo a costo de 0 KB.
- En caso de incorporar fuentes personalizadas en fases posteriores, deberán ser exclusivamente formato `.woff2` autoalojadas con regla `font-display: swap`.

---

## 4. Políticas de Activos e Imágenes

1. **Formatos Obligatorios:** Exclusivamente `.svg` para ilustraciones vectoriales, logotipos y mockups esquemáticos; `.webp` o `.avif` para imágenes de mapa de bits.
2. **Carga Diferida:** Atributo `loading="lazy"` obligatorio para cualquier imagen debajo del pliegue (below-the-fold).
3. **Optimización SVG:** SVGs limpios de metadatos de exportación (sin comentarios de Illustrator/Figma, paths optimizados, viewbox definido).
