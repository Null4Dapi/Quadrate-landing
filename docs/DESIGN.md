# Guía de Diseño Visual y Restricciones Estéticas (`docs/DESIGN.md`)

Este documento define los tokens visuales, directrices de maquetación y restricciones estilísticas para la landing page de **Quadrate pe**.

---

## 1. Dirección Artística y Filosofía

- **Estética Editorial y Arquitectónica:** Tono sobrio, funcional y sofisticado, inspirado en publicaciones de diseño urbano y arquitectura contemporánea. La jerarquía se construye a través de tipografía legible, espacios en blanco generosos y contrastes limpios.
- **Enfoque Mobile-First Obligatorio:** El 80%+ del tráfico objetivo interactuará desde teléfonos móviles (320px–430px). El layout se concibe inicialmente para pantallas reducidas y se expande progresivamente hacia tablet (768px+) y desktop (1024px–1280px).

---

## 2. Restricciones Visuales Explícitas

1. **Prohibido el Cliché Neón / Cyberpunk:** Cero fondos `#000` con gradientes fucsia, cian o morado fosforescente. Prohibidos los efectos glow excesivos.
2. **Cero Bordes en Bloque Repetitivos:** Prohibido encerrar cada párrafo o elemento en tarjetas genéricas con `border: 1px solid var(--neon)` o `border-radius: 24px` masivos y homogéneos.
3. **Cero Iconitis:** Prohibido el uso de íconos genéricos en círculos para acompañar cada texto (cohetes, bombillas, diamantes). Los íconos deben ser escasos, funcionales y contextuales.
4. **Alternancia de Layouts:** Prohibido estructurar la landing como una cuadrícula infinita de tarjetas idénticas de 3 columnas. Se emplean composiciones asimétricas, divisores tipográficos marcados y tablas comparativas directas (Conductor vs. Playa de Estacionamiento).

---

## 3. Tokens de Diseño Globales (`:root`)

### 3.1. Paleta de Colores
- **Fondo Principal:** `#F8F9FA` (Blanco hueso / papel neutro)
- **Fondo Secundario / Elevado:** `#FFFFFF` (Superficie limpia)
- **Fondo Contraste / Invertido:** `#12161A` (Grafito profundo / asfalto noble)
- **Texto Principal:** `#1E2328` (Tinta oscura de alto contraste)
- **Texto Secundario:** `#4A5568` (Gris pizarra neutro)
- **Texto Muted:** `#718096` (Gris de apoyo)
- **Líneas y Bordes:** `#E2E8F0` (Borde sutil, no invasivo)
- **Acento Primario (Editorial):** `#C25E34` (Terracota cálido / arcilla arquitectónica)
- **Acento Hover:** `#A64D28` (Terracota profundo)
- **Acento Suave:** `#FDF2EC` (Fondo tenue para etiquetas activas)
- **Éxito:** `#1B7A4B` (Verde bosque sereno)
- **Error:** `#B91C1C` (Rojo teja controlado)

### 3.2. Tipografía
- **Pila Tipográfica del Sistema (0 KB overhead, 0 CLS):**
  - Titulares y Cuerpo: `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`
  - Código y Metadatos: `ui-monospace, "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace`
- **Escala Modular:**
  - `font-size-xs`: `0.75rem` (12px)
  - `font-size-sm`: `0.875rem` (14px)
  - `font-size-base`: `1rem` (16px)
  - `font-size-md`: `1.125rem` (18px)
  - `font-size-lg`: `1.375rem` (22px)
  - `font-size-xl`: `1.75rem` (28px)
  - `font-size-2xl`: `2.25rem` (36px)
  - `font-size-3xl`: `3rem` (48px)

### 3.3. Espaciado y Ritmo Vertical
- Malla base de 4px / 8px: `0.25rem`, `0.5rem`, `1rem`, `1.5rem`, `2rem`, `3rem`, `4rem`, `5rem`.

### 3.4. Bordes y Sombras
- Radios restringidos y funcionales: `2px`, `4px`, `8px` máximo para botones y campos; `12px` para contenedores mayores.
- Sombras sutiles y directas (sin difusiones artificiales pesadas).
