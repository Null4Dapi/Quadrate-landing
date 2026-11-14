# Guía de Diseño Visual — Quadrate pe

Contrato humano del sistema visual. **Versión sincronizada a la realidad construida — 2026-10-23.** Esta guía describía una pila `system-ui` sin webfont y una paleta terracota/grafito que nunca existió como tokens; hoy documenta los tokens que de verdad viven en el código. Registro completo en la sección 1.

---

## 1. Registro de corrección de drift (2026-10-23)

- **Corregido:** la versión anterior (v1) describía una "Pila Tipográfica del Sistema" `system-ui` de 0 KB. La realidad es **Satoshi Variable self-hosted** con preload (ver sección 5.1). Ya no existe contraposición system-ui vs. webfont: la webfont es el sistema.
- **Corregido:** v1 listaba una paleta terracota/grafito (`#F8F9FA`, `#12161A`, `#1E2328`, `#4A5568`, `#718096`, `#E2E8F0`, `#C25E34`, `#A64D28`, `#FDF2EC`) presentada como tokens `:root`. **Ninguno de esos valores existe en `variables.css`.** Toda la paleta vigente se reconstruye en la sección 6.
- **Actualizado:** se documenta la escala completa (radios, sombras, motion, pastels de estado) que v1 omitía.
- **Remanente del drift en código (fuera de alcance de esta guía):** `src/css/components/quadrate-live.css` referencia nombres de token inexistentes (`--color-bg-primary`, `--color-border`, etc.) con valores de fallback de la v1. Pendiente de refactor — ver auditoría, sección 10.

## 2. Fuentes de verdad

| Artefacto | Rol |
| :--- | :--- |
| `src/css/variables.css` | **Runtime truth.** Única fuente viva; todo hex nuevo nace ahí como token. |
| `docs/design-tokens.json` | Espejo máquina 1:1 (convención camelCase declarada en su `meta`). Se regenera al cambiar tokens. |
| `docs/design-preview.html` | Referencia visual self-contained (cero requests externas). |

Regla dura: **prohibido hardcodear hexes** en componentes; siempre `var(--token)`. Excepción temporal documentada en auditoría.

## 3. Dirección artística y filosofía (vigente)

- **Estética editorial y arquitectónica:** tono sobrio, funcional y sofisticado, inspirado en publicaciones de diseño urbano y arquitectura contemporánea. Jerarquía por tipografía legible, blanco generoso y contrastes limpios.
- **Mobile-first obligatorio:** el 80%+ del tráfico objetivo interactúa desde móviles (320–430px). Layout concebido primero para pantallas reducidas y expandido hacia tablet (768px+) y desktop (1024–1280px).

## 4. Restricciones visuales explícitas (vigentes)

1. **Anti-cliché neón/cyberpunk:** cero fondos negros con gradientes fucsia/cian; prohibidos los efectos glow excesivos.
2. **Anti-cards uniformes:** cero tarjetas genéricas homogéneas con `border-radius` masivos envolviendo cada párrafo.
3. **Anti-iconitis:** íconos escasos, funcionales y contextuales; nunca un ícono-círculo por cada texto.
4. **Alternancia de layouts:** composiciones asimétricas y divisores tipográficos; tablas comparativas directas (Conductor vs. Playa) en vez de cuadrículas infinitas.

## 5. Tipografía

### 5.1 Estrategia de fuente

- **Satoshi Variable** (Fontshare / Indian Type Foundry; licencia libre para uso comercial) self-hosted en `src/assets/fonts/Satoshi-Variable.woff2`.
- Declarada en `src/css/fonts.css` como woff2 variable con ejes **300–900**, `font-display: swap`.
- **Preload** en `index.html` (`<link rel="preload" as="font" crossorigin>`) para eliminar el bloqueo de renderizado del texto y estabilizar el CLS del hero.
- Pilas vigentes (verbatim de `variables.css`):

```css
--font-family-sans: "Satoshi", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
--font-family-display: "Satoshi", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
--font-family-mono: ui-monospace, "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
```

### 5.2 Identidad display del hero — CONGELADA (no modificar)

Decisión del equipo (2026-10-23): esta construcción es **identidad de marca congelada**. Se documenta verbatim; ninguna iteración la toca.

| Propiedad | Valor (verbatim, `hero.css` `.hero__title`) |
| :--- | :--- |
| Fuente | `var(--font-family-display)` |
| Tamaño | `clamp(2.125rem, 5.6vw, 4.35rem)` |
| `line-height` | `1.04` |
| `letter-spacing` | `-0.025em` |
| `text-transform` | `uppercase` |
| Línea primaria | `700` (bold), `white-space: nowrap` |
| Línea de acento | `400` regular, `italic` |

### 5.3 Escala modular y pesos

| Nivel | Valor | px aprox. |
| :--- | :--- | ---: |
| `--font-size-xs` | `0.75rem` | 12 |
| `--font-size-sm` | `0.875rem` | 14 |
| `--font-size-base` | `1rem` | 16 |
| `--font-size-md` | `1.125rem` | 18 |
| `--font-size-lg` | `1.375rem` | 22 |
| `--font-size-xl` | `1.75rem` | 28 |
| `--font-size-2xl` | `2.25rem` | 36 |
| `--font-size-3xl` | `3rem` | 48 |
| `--font-size-display` | `clamp(2.25rem, 5.5vw, 3.75rem)` | 36–60 |
| `--font-size-giant` | `clamp(2.75rem, 7vw, 4.5rem)` | 44–72 |

Pesos: regular 400 · medium 500 · semibold 600 · bold 700. Alturas de línea: `tight` 1.15 · `snug` 1.3 · `normal` 1.5 · `relaxed` 1.65.

## 6. Color vigente

### 6.1 Superficies (`--color-bg-*`)

| Token | Valor | Uso |
| :--- | :--- | :--- |
| `--color-bg-base` | `#f4f4f4` | Fondo general (papel neutro cálido) |
| `--color-bg-surface` | `#ffffff` | Superficies elevadas |
| `--color-bg-contrast` | `#231212` | Banda de contraste (dark) — **sale del sistema, sección 9** |
| `--color-bg-contrast-soft` | `#301a1a` | Banda de contraste suave — **sale del sistema, sección 9** |
| `--color-bg-subtle` | `#ececec` | Fondo sutil de secciones |
| `--color-bg-accent-subtle` | `#e3e2f7` | Tinte lavender para etiquetas/detalles |

### 6.2 Texto (`--color-text-*`)

| Token | Valor | Uso |
| :--- | :--- | :--- |
| `--color-text-primary` | `#231212` | Tinta principal sobre superficies claras |
| `--color-text-secondary` | `#4d3d3d` | Texto de apoyo |
| `--color-text-muted` | `#756767` | Metadatos/leyendas |
| `--color-text-contrast` | `#ffffff` | Texto sobre bandas dark y acentos |
| `--color-text-contrast-muted` | `#c9bfbf` | Texto secundario sobre bandas dark |

### 6.3 Bordes (`--color-border-*`)

| Token | Valor | Uso |
| :--- | :--- | :--- |
| `--color-border-subtle` | `#e2e2e2` | Divisores sutiles |
| `--color-border-medium` | `#d0d0d0` | Bordes estándar |
| `--color-border-strong` | `#9c9292` | Delimitadores marcados |
| `--color-border-contrast` | `#3a2222` | Bordes sobre bandas dark — **sale del sistema, sección 9** |

### 6.4 Acentos (`--color-accent-*`)

| Token | Valor | Uso |
| :--- | :--- | :--- |
| `--color-accent-primary` | `#231212` | Acento editorial actual — **sale del sistema, sección 9** |
| `--color-accent-hover` | `#3d2323` | Hover del acento — **sale del sistema, sección 9** |
| `--color-accent-focus` | `rgba(35, 18, 18, 0.2)` | Anillo de foco |
| `--color-accent-secondary` | `#e3e2f7` | Contraparte clara del acento |

### 6.5 Estados funcionales (pares fg + bg)

| Par | Texto | Fondo |
| :--- | :--- | :--- |
| Éxito | `--color-status-success` `#1b7a4b` | `--color-status-success-bg` `#edf7f2` |
| Error | `--color-status-error` `#b91c1c` | `--color-status-error-bg` `#fdf2f2` |
| Información | `--color-status-info` `#2b6cb0` | `--color-status-info-bg` `#ebf8ff` |

Regla de emparejado: siempre usar el par fg+bg del mismo estado; no mezclar pastel de un estado con texto de otro.

## 7. Espaciado y layout

- **Ritmo 4px / 8px** con 11 tokens: `--space-1` 4 · `--space-2` 8 · `--space-3` 12 · `--space-4` 16 · `--space-5` 20 · `--space-6` 24 · `--space-8` 32 · `--space-10` 40 · `--space-12` 48 · `--space-16` 64 · `--space-20` 80 (px).
- **Contenedor:** `--container-max-width: 1160px` + padding-inline fluido `clamp(1rem, 4vw, 2.5rem)`.

## 8. Radios, sombras y motion

- **Radios restringidos:** `--radius-xs` 2 · `sm` 4 · `md` 6 · `lg` 8 · `xl` 12 · `2xl` 20 · `pill` 9999 (px).
- **Sombras (4 niveles, direccionalidad sutil):** `--shadow-subtle`, `--shadow-card`, `--shadow-elevated`, `--shadow-floating` — todas con kernel `rgba(18, 22, 26, alfa)` (no hay token hex de sombra). Sin difusiones artificiales pesadas.
- **Motion:** exactamente dos tokens — `--transition-fast` `150ms cubic-bezier(0.16, 1, 0.3, 1)` y `--transition-base` `250ms cubic-bezier(0.16, 1, 0.3, 1)`. Fast para micro-feedback (hover/focus), base para paneles y reveals. Prohibido sumar animaciones gratuitas de scroll.

## 9. Dirección aprobada (próxima iteración) — PROPUESTA pendiente de aprobación visual

Dos decisiones ligadas de la conversación del equipo (2026-10-23):

1. **Hero display congelado** (documentado en 5.2): no se modifica.
2. **La familia near-black/marrón oscuro sale del sistema** hacia una paleta cálida de **ocre/tierra**: `--color-bg-contrast`, `--color-bg-contrast-soft`, `--color-border-contrast`, `--color-accent-primary` y `--color-accent-hover` serán reemplazados. La base clara `#f4f4f4` se conserva.

Candidatos de rampa cálida (cada uno reemplaza los 5 tokens; valores **sólo propuesta**, no vigentes):

| Opción | bg-contrast | bg-contrast-soft | border-contrast | accent-primary | accent-hover |
| :--- | --- | --- | --- | --- | --- |
| A — ocre tostado | `#3d280e` | `#5a3c14` | `#745625` | `#b8791f` | `#95601a` |
| B — tierra café | `#40270d` | `#5c3d18` | `#75512b` | `#b3621a` | `#8b4b15` |
| C — óxido arcilla | `#3a2218` | `#5c3826` | `#7a4f35` | `#bb5322` | `#8c3f1b` |

Notas de alcance:

- `--color-text-primary` comparte el valor de la familia dark pero **permanece** como tinta tipográfica de alto contraste; su salida se decidiría en otra iteración.
- Ningún valor de esta tabla pisa `variables.css` hoy; hasta la aprobación visual final ni un hex migra.
- Mirrors: candidatos reproducidos en `docs/design-tokens.json` (bloque `evolution`, `status: proposal`) y en `docs/design-preview.html` (sección Propuesta de evolución).

## 10. Auditoría rápida del sistema (10 dimensiones, 2026-10-23)

| # | Dimensión | Puntaje | Evidencia | Corrección |
| :-- | :--- | ---: | :--- | :--- |
| 1 | Consistencia de color | 7 | 20 hexes centralizados en `variables.css`; pero 4 componentes saltan el sistema: `tab-view.css:126,183` hardcodea success/error, `why-us.css:105` usa un hex fuera de tokens, `quadrate-live.css:7-35` apunta a tokens inexistentes con fallbacks de la v1 | Migrar a `--color-status-*` y refactorizar `quadrate-live.css` hacia `--color-bg-*` |
| 2 | Jerarquía tipográfica | 8 | Escala de 10 niveles con 2 clamps + pesos y alturas tokenizados; hero display congelado de gran fuerza | Auditar tamaños ad-hoc en componentes y devolverlos a la escala |
| 3 | Ritmo de espaciado | 8 | 11 tokens de malla 4/8; componentes núcleo consumen `var(--space-*)` | Barrer paddings/margins ad-hoc en la re-estructuración de secciones |
| 4 | Consistencia de componentes | 7 | BEM, un CSS por bloque, cero CSS embebido en el núcleo | Normalizar presets (`radius`, `shadow`, `transition`) en islas nuevas |
| 5 | Responsive | 7 | Mobile-first con clamps fluidos y grid; `white-space: nowrap` en la línea primaria del hero (`hero.css:43`) es riesgo en 320px | Verificar hero en 320px; al estar congelada, sólo reportar si rompe |
| 6 | Dark mode | 3 | No existe theme oscuro ni estrategia invertida (landing editorial light-first) | Declararlo explícitamente fuera de alcance 1.0 o agendar tokens invertidos |
| 7 | Animación | 7 | Dos transiciones con `cubic-bezier(0.16, 1, 0.3, 1)`; sin scroll-jacking | Mantener el presupuesto de motion en el rediseño |
| 8 | Accesibilidad | 6 | Contraste cubierto por pares text/surface y `--color-accent-focus`; el markup del header tiene una tablist rota que mezcla links y botones | Restablecer el patrón tablist correcto (HTML/JS del header, fuera de esta feature) |
| 9 | Densidad de información | 8 | Secciones aireadas con divisores tipográficos; sin saturación de cards (restricciones §4) | Sostener la sobriedad en la re-estructuración product-first |
| 10 | Polish | 7 | 4 presets de sombra + estados hover/focus tokenizados | Completar estados empty/loading con los pares de §6.5 donde falten |

**Total: 70/100.** Fortaleza: sistema de tokens centralizado + tipografía con identidad. Debilidades activas: direccionalidad del color (familia dark, §9) y resto del drift en dos componentes.

## 11. Referencias

- `docs/design-tokens.json` — espejo máquina de los tokens.
- `docs/design-preview.html` — referencia visual self-contained.
- `docs/ARCHITECTURE.md` — presupuesto de performance y estructura técnica.
