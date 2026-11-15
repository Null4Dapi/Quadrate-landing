# Feature: restructure-product-first — Landing de producto, una página

## Objetivo

Convertir la landing de 3 pestañas (Cómo funciona / Quadrate Live / Afiliar) en **una página de marketing completa, product-first**, según el plan aprobado por el usuario (conversación 2026-10-23). Sin tocar la paleta (tarea separada gated por aprobación visual del óxido).

## Fuente de decisiones del plan

Ficha de negocio consolidada (grilling 6 preguntas + correcciones): producto = PWA, suscripción del dueño, dolor = papel/caja, mecanismo híbrido (operador valida + QR/pin credencial), marketing aspiracional completo, Live fuera, piloto fuera, header/footer esqueleto intacto.
Skill guía: `.agents/skills/frontend-design/SKILL.md` + contrato de tokens vigente (`docs/DESIGN.md` v2 + `docs/design-tokens.json`).

## Alcance de archivos

| Archivo | Cambio |
|---|---|
| `index.html` | Re-estructura semántica completa: hero → app-en-acción → módulos → cómo-funciona → tarifas → manifiesto → contacto(form) → footer. Tabs/views muertos; nav por anclas. Presupuesto: objetivo ≈280–320 líneas, cap duros 400. |
| `src/js/content.js` (existe, 248 líneas) | Copy nueva de producto (módulos, pasos, tarifas, contacto, footer) — sin textos de piloto. Sigue siendo la única fuente de datos (nada duplicado en HTML promocional). |
| `src/js/main.js` (31 líneas) | Quitar import/wiring del módulo live; mantener features existentes (`features/adaptive-header.js`, `features/menu-toggle.js` …: verificar nombres reales en `src/js/features/`). Run rotation validation. Objetivo <80 líneas. |
| `src/css/main.css` + `src/css/components/*.css` | Import list limpia: OUT stats/why-us/community/caseta/quadrate-live/tab-view (archivos CSS quedan huérfanos: borrar del repo junto). IN `modules.css` nuevo (lista de manifesto) + `how-it-works.css` nuevo (pasos numerados secuenciales). Mantener hero/rates/manifesto/waitlist/footer/variables/reset/fonts. |
| `src/css/components/app-showcase.css` | Renombrar a `app-view.css` (kebab) o mantener nombre si el bloque sigue siendo "la app en acción" — preferencia writer consistente BEM. |
| Pantallas del producto (3) | Composiciones HTML/CSS puro dentro del device frame existente (sin imágenes stock): (1) conductor — mapa con disponibilidad/precio; (2) garita — registro de entrada con QR/pin; (3) dueño — panel de caja con liquidación del día. Marcar como interfaces referenciales en `data-` (para iteración futura), visuales de producto simulado. |

## Restricciones inamovibles

1. **Hero display congelado** (`.hero__title` verbatim de DESIGN.md §5.2): ninguna iteración toca clamp/lh/tracking/uppercase o la dupla primary-bold/acento-italic.
2. **Paleta:** solo tokens vigentes de `variables.css` — no se introduce la rampa óxido en CSS vivo en esta feature (queda en bloque `evolution` hasta aprobación visual).
3. **KISS:** cero librerías, cero bundler, cero estilos/scripts embebidos (`style=` y `onclick=` prohibidos), data en `content.js`, clases BEM kebab-case, ids para comportamiento no para estilizar.
4. **a11y:** un solo `h1` (hero), secciones con `h2`, `aria-live` del form intacto, sin `aria-label` sobre elementos sin rol.
5. **Line caps por archivo:** código ≤400 duro (objetivos según tipo); docs/md exentos.
6. Islands React no exportados quedan en repo (prototipos): no borrar `src/jsx/` ni `src/js/react/`; solo desenchufar del landing.
7. copy en **español neutral profesional** (idioma del proyecto extenso).

## Tareas (cada una termina en work-unit commit, rama feature)

- [ ] T1 — Esqueleto `index.html` + nav por anclas + hero recopy (CTA "Abrir la plataforma"). Sin badges store ni textos en inglés.
- [ ] T2 — `content.js` copy de producto completa (módulos, pasos, tarifas, contacto, footer) + `main.js` limpio de live.
- [ ] T3 — Import list HTTP + problemasussae derivaciónn temática CSS; borrado de CSS huérfanos (stats/why-us/community/caseta/quadrate-live/tab-view en `main.css` no deben quedar referidos); si `index.html` aún referencia `community`/`caseta`, quitar.
- [ ] T4 — Las 3 pantallas del producto JSX-free en CSS/HTML puro dentro de frames existentes.
- [ ] T5 — Header/footer micro: nav anclas (Producto/Módulos/Cómo funciona/Tarifas/Contacto) + CTA; footer anchors legales reales y texto limpio.
- [ ] T6 — Responsive + a11y pass (320/768): hero nowrap 320px flagged en DESIGN.md §10 (solo corregir si rompe formatting de línea, frozen identidad intacta); estados hover/focus del nav nuevo.
- [ ] T7 — Verificación parent (Playwright desktop/320/768 + interacciones + wc -l + consola limpia) y evidencia en este doc.

## Registro de verificación

- [ ] Playwright consola: 0 errores/warnings
- [ ] `wc -l`: index.html ≤400; content.js ≤400; main.js <80
- [ ] grep sin referencias a blocks muertos (stats/community/caseta/live/tab-view)
- [ ] Hero display intacto (clamp/1.04/−0.025em)
- [ ] Form: validación progresiva funciona (nombre/email/éxito)

## Notas de registro

- Engram MCP no disponible en esta sesión (catálogo retirado): mirror de este doc no se ejecuta; evidencia vive solo en repo + commits.
- Paleta óxido: feature separada pendiente de aprobación visual (preview ya vive en `docs/design-preview.html`).

## Progreso

- [x] Delegación writer único — T1–T5 + embedded responsive/a11y (T6) completados; scrolls task T7 en parent.
- [x] Micro-correcciones parent: favicon SVG + `<link rel="icon">` (error 404 de la auditoría original), `adaptive-header.js` generalizado (`main > section, footer.footer`) + re-cableado en `main.js`, meta del pie degradado "Proyecto de Formulación..." → "Quadrate pe" (política marketing completo).
- [x] Verificación en vivo (Playwright): consola 0 errores; hero frozen intacto (239 líneas index ≤400, content 163, main 67); desktop full-page coherente; mobile 320 con hero fluido sin overflow; form (vacío→error nombre, válido→"¡Recibido!...") en `aria-live`; scrollspy repintado confirmado sobre la banda del manifiesto (`header--contrast` + bg #231212).
- [x] Commits — `a7151cf` feat(landing): single product-first page with decoupled copy (5 files, +317/−406); `176eb37` feat(css): pure-css product screens, modules and steps; prune dead blocks and stock assets (28 files, +376/−1728, 6 CSS bloque + 14 assets stock borrados). Rama `feat/restructure-product-first` apilada sobre `feat/design-system-sync`.
- [x] Pendiente de otra feature: paleta óxido (gated por aprobación visual del preview) — bandas near-black del manifiesto/footer siguen vigentes por decisión de alcance.
