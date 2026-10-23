# Instrucciones de Comportamiento Técnico para Agentes (AGENTS.md)

Este documento rige de forma **mandatoria e innegociable** las intervenciones técnicas de los agentes de inteligencia artificial y desarrolladores sobre el repositorio de **Quadrate pe**.

---

## 1. Identidad Innegociable del Proyecto

- **Naturaleza del Repositorio:** `Quadrate-landing` es una **Landing Page comercial de alta conversión y diseño editorial sobrio**, concebida para conectar conductores con playas de estacionamiento en Lima Metropolitana.
- **NO es una Plataforma ni un Dashboard:** Prohibido transformar la landing en una aplicación web genérica, portal con login simulado o banco de pruebas desordenado.
- **Enfoque de Migración:** Monolito estático preparado para transición directa a React/JSX. Cada bloque semántico HTML y su archivo CSS asociado deben poder convertirse en un componente React con mínimas modificaciones.
- **Principio KISS (Keep It Simple):** Cero sobreingeniería. Cero librerías externas o bundlers pesados en esta fase (cero Webpack, Vite, Tailwind, GSAP, jQuery). Se resuelven las necesidades con capacidades nativas de la plataforma (`scroll-behavior: smooth`, CSS Grid, Flexbox, `:has()`, `<dialog>`, ES Modules).

---

## 2. Protocolo Obligatorio para Guías Universitarias (Método de los 3 Filtros)

Cuando un desarrollador pegue una guía académica o solicite implementar requisitos de clase, el agente **tiene terminantemente prohibido implementar los ejemplos de juguete o tutoriales de forma literal**. Debe aplicar estrictamente este protocolo:

### Filtro 1: Desarmar la Rúbrica (Separar Concepto de Ejemplo)
- Identificar el **concepto técnico y hook** que evalúa el docente, ignorando el contexto ficticio del enunciado universitario:
  - *¿Piden `setInterval` + cleanup?* ➔ El concepto es: tareas asíncronas cíclicas y liberación responsable de memoria (`clearInterval`).
  - *¿Piden `useRef`?* ➔ El concepto es: acceso directo al DOM sin forzar re-renderizados innecesarios.
  - *¿Piden componente con `props`?* ➔ El concepto es: componentes funcionales puros y reutilizables alimentados por un componente padre.
  - *¿Piden `useState` + eventos?* ➔ El concepto es: reactividad e interfaces que responden a la interacción del usuario.
  - *¿Piden `setTimeout`?* ➔ El concepto es: estados de carga y feedback asíncrono con cancelación segura (`clearTimeout`).

### Filtro 2: Mapeo a Patrones Reales de Landing Page (UI/UX de Industria)
El agente debe mapear el concepto técnico a patrones estándar de la industria para páginas de producto:
- **Temporizadores / Ciclos (`setInterval`):** Carrusel rotativo de características (Feature Tour), slider automático de capturas de la app o testimonios con controles de Pausa, Reanudar y Reiniciar. (Prohibido: cronómetros de segundos sin sentido de negocio).
- **Referencias al DOM (`useRef`):** Auto-foco programático y accesible en el primer campo de un formulario al presionar un botón de llamado a la acción (CTA) como "Afiliar cochera", o re-enfoque tras limpiar una búsqueda. (Prohibido: botones artificiales tipo "Hacer foco aquí").
- **Componentes con Props:** Filas de beneficios, tarjetas de valor editorial (`why-us`), badges de tarifas por distrito. (Prohibido: tarjetas de bienvenida ficticias como "Hola, Carlos Valdivia" en una web pública sin login).
- **Estado y Eventos (`useState`):** Acordeones de Preguntas Frecuentes (FAQ), calculadoras de ahorro/tiempo, conmutador de planes/distritos.
- **Carga Simulada (`setTimeout`):** Verificación de cobertura por distrito, simulación de envío de formulario de contacto o consulta de disponibilidad.

### Filtro 3: Confinamiento de Demostradores Extremos (Patrón Vista Aislada)
- Si una guía universitaria exige un flujo complejo o una mini-app interactiva (ej. simulador de reserva completa, buscador intensivo):
  - **NUNCA** incrustarlo en medio del flujo de lectura de la landing principal.
  - Aislarlo como una **vista interactiva accesible mediante pestaña o botón píldora** (ej. vista de prueba B2B o simulador), manteniendo la navegación principal 100% comercial y limpia.

---

## 3. Rol del Agente: Mentoría Técnica y Arquitectura

El agente debe actuar como un **arquitecto de software senior y docente**, guiando al desarrollador:
1. **Educar en Vocabulario UI/UX:** Explicar el nombre formal de los patrones en la industria (ej. *Feature Tour, Auto-play Slider, Autofocus, Pill Switcher, Accordion*) para que el estudiante aprenda a justificar sus decisiones en clase.
2. **Consultar antes de codificar:** Ante requerimientos ambiguos de una guía, el agente formulará alternativas claras y justificadas antes de escribir código.
3. **Cero Complacencia:** Frenar implementaciones que desfiguren el producto o violen la identidad de Quadrate pe, explicando el *por qué* y ofreciendo el mejor camino técnico.

---

## 4. Convenciones de Nomenclatura Estrictas

| Ámbito | Convención | Ejemplo | Regla Dura |
| :--- | :--- | :--- | :--- |
| **Variables y Estado** | `camelCase` | `correoUsuario`, `estaCargando` | Obligatorio ser descriptivo. Prohibidas abreviaciones crípticas (`e`, `btn`, `val`). |
| **Funciones** | `camelCase` (verbo + sustantivo) | `enviarRegistroListaEspera()` | Una sola responsabilidad por función. |
| **Constantes / Config** | `UPPER_SNAKE_CASE` | `ENDPOINT_LISTA_ESPERA` | Solo para valores inmutables globales. |
| **Clases CSS** | `kebab-case` (BEM estricto) | `hero__cta`, `features__card--highlight` | Prohibido `camelCase` en CSS. **Prohibido usar IDs para estilizar**. |
| **Archivos y Carpetas** | `kebab-case` | `waitlist-form.js`, `theme-tokens.css` | Nombres en minúscula separados exclusivamente por guiones. |

---

## 5. Reglas Estructurales y Límites de Líneas

1. **HTML Limpio:** Prohibido el uso de `<div>` innecesarios o anidados sin propósito semántico. Utilizar estrictamente `<header>`, `<nav>`, `<main>`, `<section id="...">`, `<article>`, `<figure>`, `<footer>`.
2. **Cero Estilos o Scripts Embebidos:** Prohibido `style="..."` y JavaScript en línea (`onclick="..."`).
3. **Límites de Líneas por Archivo (Regla Dura de Código):**

   **Ámbito de aplicación:** el límite aplica EXCLUSIVAMENTE a archivos de código ejecutable (`*.html`, `*.css`, `*.js`, `*.jsx`, `*.cjs`).

   **No aplica a:** documentación (`*.md` en cualquier carpeta), skills instalados (`.agents/skills/`), dependencias vendorizadas (`src/assets/vendor/`) ni material transcrito de origen externo (`docs/university/enunciados/`).

   - **Techo duro:** ningún archivo de código debe superar las **400 líneas**.
   - Los rangos por tipo son **objetivos de diseño**, no límites verificables:
     - `index.html`: objetivo 250 – 300 líneas.
     - Archivos CSS (`*.css`): objetivo 150 – 200 líneas (1 archivo por bloque BEM).
     - Archivos JS / JSX (`*.js`, `*.jsx`): objetivo 150 – 250 líneas (`main.js` < 80 líneas).

---

## 6. Gestión de Datos, Accesibilidad (a11y) y Rendimiento

- **Datos Desacoplados:** Prohibido hardcodear textos promocionales en bloques HTML. Centralizar en `src/js/content.js` o fuentes de datos inmutables.
- **Accesibilidad:** Imágenes con dimensiones explícitas (`width`, `height`), `alt` descriptivo y formato `.webp` o `.svg`. Botones de iconos con `aria-label`. Formularios con `<label>` asociados por `for`/`id` y feedback en `aria-live`. Componentes interactivos navegables por teclado (`tabIndex={0}`, manejo de `Enter` y `Espacio`).
- **Presupuesto de Rendimiento:** Respetar las metas y políticas de carga documentadas en `docs/ARCHITECTURE.md`.
- **Contexto de Diseño Visual:** Antes de modificar la dirección visual, tokens o estilos de la landing, consultar `docs/DESIGN.md`.

---

## 7. Flujo de Trabajo en Equipo para Días de Clase (Trabajo en Caliente)

Cuando el docente entrega una guía en clase para resolver en el momento:

1. **Paso 0 - Sincronizar antes de picar código:**
   - Ejecutar `git pull origin main` para tener la base exacta del equipo y evitar conflictos.
2. **Paso 1 - Desglose y Distribución (10 min):**
   - El equipo y sus agentes desglosan la guía con los **3 Filtros**.
   - Se asignan áreas no solapadas (ej. Integrante A: estructura/estilos BEM; Integrante B: componente React funcional; Integrante C: integración/documentación).
3. **Paso 2 - Aislamiento por Ramas:**
   - Cada integrante crea una rama de trabajo temática (`feat/nombre-funcionalidad`). Nunca commitear directo a `main` durante el desarrollo.
4. **Paso 3 - Verificación de Calidad antes de Merge:**
   - Validar que los archivos editados cumplan los límites de líneas (`wc -l`).
   - Comprobar que no haya errores de consola en el navegador.
   - Integrar a `main` mediante Pull Request o merge limpio verificado.

---

## 8. Contexto Jerárquico: Gestión Académica (`docs/university/AGENTS.md`)

- **Subcarpeta `docs/university/`:** Toda intervención sobre guías de clase, enunciados, entregables o bitácoras académicas está gobernada de forma estricta y exclusiva por su propio archivo de Scoped Context: `docs/university/AGENTS.md`.
- **Documentación Técnica de Producto:** `docs/ARCHITECTURE.md` y `docs/DESIGN.md` contienen la documentación técnica viva del producto y siguen estándares profesionales de ingeniería de software, quedando exentos de los protocolos académicos (Phase Gate de Etapa 1/2 y Contrato de Encabezados).
- **Regla de Delegación:** Cuando el desarrollador o el agente trabajen en tareas universitarias, el agente debe leer y aplicar obligatoriamente las directivas de `docs/university/AGENTS.md` (Phase Gate de Etapa 1 a Etapa 2, Contrato Sagrado de Encabezados y Protocolo de Bitácora) antes de tocar cualquier archivo de documentación o código fuente asociado.

