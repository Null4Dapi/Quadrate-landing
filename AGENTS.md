# Instrucciones de Comportamiento Técnico para Agentes (AGENTS.md)

Este documento rige de forma mandatoria las intervenciones técnicas de los agentes de inteligencia artificial y desarrolladores sobre el repositorio de **Quadrate pe**.

---

## 1. Filosofía de Arquitectura y Diseño

- **Patrón:** Component-Driven UI desacoplado en Vanilla (HTML5, CSS3, ES Modules nativos).
- **Enfoque de Migración:** Monolito estático preparado para transición directa a React/JSX. Cada bloque semántico HTML y su archivo CSS asociado deben poder convertirse en un componente React con mínimas modificaciones.
- **Principio KISS (Keep It Simple):** Prohibida la sobreingeniería. Cero librerías externas o bundlers en esta fase (cero Webpack, Vite, Tailwind, GSAP, jQuery). Se resuelven las necesidades con capacidades nativas de la plataforma (`scroll-behavior: smooth`, CSS Grid, Flexbox, `:has()`, `<dialog>`).

---

## 2. Convenciones de Nomenclatura Estrictas

| Ámbito | Convención | Ejemplo | Regla Dura |
| :--- | :--- | :--- | :--- |
| **Variables y Estado** | `camelCase` | `correoUsuario`, `estaCargando` | Obligatorio ser descriptivo. Prohibidas abreviaciones crípticas (`e`, `btn`, `val`). |
| **Funciones** | `camelCase` (verbo + sustantivo) | `enviarRegistroListaEspera()` | Una sola responsabilidad por función. |
| **Constantes / Config** | `UPPER_SNAKE_CASE` | `ENDPOINT_LISTA_ESPERA` | Solo para valores inmutables globales. |
| **Clases CSS** | `kebab-case` (BEM estricto) | `hero__cta`, `features__card--highlight` | Prohibido `camelCase` en CSS. **Prohibido usar IDs para estilizar**. |
| **Archivos y Carpetas** | `kebab-case` | `waitlist-form.js`, `theme-tokens.css` | Nombres en minúscula separados exclusivamente por guiones. |

---

## 3. Reglas Estructurales y Semántica

1. **HTML Limpio:** Prohibido el uso de `<div>` innecesarios o anidados sin propósito semántico. Utilizar estrictamente `<header>`, `<nav>`, `<main>`, `<section id="...">`, `<article>`, `<figure>`, `<footer>`.
2. **Cero Estilos o Scripts Embebidos:**
   - Prohibido `style="..."` en cualquier etiqueta.
   - Prohibido JavaScript en línea (`onclick="..."`, `onsubmit="..."`).
3. **Límites de Líneas por Archivo:**
   - `index.html`: Máximo 250 – 300 líneas. Si supera 300, externalizar datos o plantillas.
   - Archivos CSS (`*.css`): Máximo 150 – 200 líneas (1 archivo por bloque BEM).
   - Archivos JS (`*.js`): Máximo 150 – 250 líneas (`main.js` < 80 líneas).
   - **Regla dura universal:** Ningún archivo del repositorio debe superar las 300 líneas.

---

## 4. Gestión de Datos y Contenido

- Prohibido hardcodear textos y cadenas promocionales en múltiples bloques HTML.
- Todo texto, copy, enlace y característica se define de manera centralizada en `src/js/content.js` o mediante atributos semánticos `data-*` para facilitar la futura transición a props de React.

---

## 5. Accesibilidad (a11y) y Rendimiento

- Todas las imágenes deben incluir dimensiones explícitas (`width`, `height`), `alt` descriptivo y formato `.webp` o `.svg`.
- Botones interactivos que solo contengan íconos deben portar obligatoriamente `aria-label`.
- Formularios deben contar con `<label>` asociados por `for`/`id` y mensajes de estado en regiones `aria-live`.
- Respetar el presupuesto de rendimiento establecido en `PERFORMANCE.md` (< 500 KB First Load).
