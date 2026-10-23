# Feature: design-system-sync — Sistema de diseño sincronizado con la realidad construida

## Objetivo

Extraer el sistema visual que realmente vive en el código (`src/css/variables.css` + componentes), materializarlo en `docs/design-tokens.json`, corregir `docs/DESIGN.md` (hoy describe una pila system-ui que no existe) y generar una previsualización HTML self-contained de los tokens.

## Problema / por qué

- `docs/DESIGN.md` está desincronizado: habla de pila `system-ui` y la página preloada/carga **Satoshi Variable** self-hosted. El equipo modificó la landing "sobre la marcha" sin actualizar el contrato (reconocido por el usuario como error del equipo).
- La dirección equivalida del diseño necesita un sistema verdadero antes de la re-estructuración de secciones.

## Decisiones del equipo que liga este trabajo (conversación 2026-10-23)

1. **Hero display: congelado como identidad.** Construcción `--font-family-display` (Satoshi) + `hero__title` (uppercase, line-height 1.04, tracking −0.025em, clamp) con línea primaria bold y línea de acento regular-italic. No se modifica.
2. **Los near-black/marrón obscuras salen.** No gustan los colores tipo negro: `--color-bg-contrast: #231212`, `--color-bg-contrast-soft: #301a1a`, `--color-border-contrast: #3a2222`, `--color-accent-primary/hover #231212/#3d2323` migrarán a paleta cálida tipo **ocres/tierra**. (Interpretación registrada: "óxido/cálido" — pendiente de confirmar con usuario si otra cosa.)
3. El resto de decisiones de diseño se toman con la skill `design-system` y criterio del agente.

## Alcance (solo esta feature)

- `docs/design-tokens.json` — nuevo; espejo exacto de `variables.css` + bloque `evolution` con dirección aprobada.
- `docs/DESIGN.md` — reescrito a la realidad construida; conserva las restricciones vigentes que siguen siendo válidas (anti-neón, anti-cards uniformes, sobrieta editorial), corrige tipografía real, tokens reales, escala 4/8/16.
- `docs/design-preview.html` — nuevo; self-contained (cero red/dependencias), renderiza paleta + escala tipográfica + espaciado + radios; incluye sección evolución con propuesta de rampa cálida.
- **NO toca:** `src/**`, `index.html`, ni ningún CSS vivo — este trabajo no cambia bytes de la página todavía.

## Fuente de verdad

- CSS: `src/css/variables.css` (única fuente de verdad en el runtime).
- `design-tokens.json` = espejo legible para consumo máquina/otros runtimes.
- `docs/DESIGN.md` = contrato humano; cero hexes fuera del bloque evolución que no luzcan en `variables.css`.

## Tareas

- [ ] T1 — `docs/design-tokens.json`: grupos color (bg/text/border/accent/state), typografía (families/scale/weights/lineHeights), spacing (ritmo 4px/8px), radius, shadow, motion, layout (container). Meta con fuente y fecha. Bloque `evolution` con dirección aprobada (rampa órche propuesta, marcada *propuesta pendiente de aprobación visual*).
- [ ] T2 — `docs/DESIGN.md` v2: corrección sincera de la realidad (Satoshi con preload + fallbacks; escala y tokens de `variables.css`; radios y sombras actuales) + restricciones vigentes + sección **Dirección aprobada** con las 2 decisiones del equipo. Registro del drift corregido con fecha.
- [ ] T3 — `docs/design-preview.html`: página única inspect árano-dependencias para ver el sistema (e instrucciones de uso del token).
- [ ] T4 — Audit rápido 10 dimensiones (design-system) con puntaje 0–10 y evidencia, entregado en el reporte del agente + sección corta en `DESIGN.md`.

Cada tarea cierra con work-unit commit en rama de feature (`feat/design-system-sync`), Conventional Commits, sin atribución de IA.

## Criterios de aceptación

- JSON parsea y coincide 1:1 con `variables.css` salvo bloque `evolution` (marcado).
- `DESIGN.md` menciona Satoshi self-hosted + fallback stack real; ya no contrapone system-ui.
- Preview carga sin ninguna request externa (fuente local @font-face pointing a asset real o fallback serif/sans nativo descrito).
- Cada check reporta `<command>: <resultado>`.

## Ruta / progreso

- [x] Extracción parent (batch limitado): tokens, hero display, uso de darks, hex inventory — completada antes del primer write.
- [x] Delegación writer único — completada; 3 artifacts escritos (DESIGN.md v2 186 líneas, design-tokens.json 196, design-preview.html 268).
- [x] Verificación readback structural del parent — JSON válido re-chequeado; audit 10 dims Total 70/100 visto en §10 del doc; hallazgo nuevo: `quadrate-live.css` referencia 6 tokens inexistentes (drift embebido).
- [x] Work-unit commits — T2/T3/T4 evidencia: `6343eb3` (docs(design): sync visual tokens and DESIGN.md to built reality, rama feat/design-system-sync, 3 files, +636/−44).
- [x] Mirror Engram — PENDIENTE DE CONFIRMACIÓN (se ejecuta tras este commit; topic `odd/design-system-sync/tasks`).

## Próximo paso después

Plan de re-estructura de secciones (orden product-first, copy, header/footer micro-ajustes) usando este sistema como base.
