# Guía de Laboratorio N.° 2

## Laboratorio de Experiencias Web Inmersivas · Semana 2

### Implementación y validación de un layout responsive para experiencias web

#### ETAPA 2 · IMPLEMENTAR, EJECUTAR, VALIDAR Y CORREGIR

| Campo | Detalle |
| :--- | :--- |
| Modalidad | Laboratorio grupal |
| Duración sugerida | 3 horas |
| Entrada obligatoria | Plan de Adaptabilidad Responsive |
| Tecnologías | CSS Grid · Flexbox · Media Queries · rem / vw / vh / clamp() |
| Producto | Prototipo responsive funcional |
| Herramientas | VS Code + navegador + DevTools |

---

## 1. Propósito y flujo de trabajo

Implementar sobre el prototipo de la Semana 1 las decisiones de adaptabilidad definidas en el Plan de Adaptabilidad Responsive de la Etapa 1. El laboratorio se concentra en convertir el plan en código, ejecutarlo, probarlo en diferentes tamaños y corregir los problemas detectados sin rediseñar desde cero.

Flujo del laboratorio: plan grupal → código → navegador → DevTools → pruebas → correcciones → evidencias.

---

## 2. Actividad 0 — Recuperar el plan

Se recuperan e integran las decisiones de adaptabilidad registradas en la Etapa 1:

### 2.1 Áreas del Grid

- `services-mosaic`: mosaico de taller y postventa organizado con CSS Grid (1 columna en mobile, 2 en tablet, 4 en desktop).

![][image1]

- `footer-main-grid`: distribución de columnas del pie de página (1 columna en mobile, 2 en tablet, 3 columnas asimétricas `2fr 1fr 1fr` en desktop).

![][image2]

- `form-grid-2`: campos de nombre y correo del modal de citas (1 columna en mobile, 2 columnas `1fr 1fr` en desktop).

![][image3]

### 2.2 Comportamiento Mobile-First

- Flujo lineal vertical sin desbordamiento lateral.
- Navegación oculta bajo botón hamburguesa en pantallas pequeñas.
- Apilamiento secuencial de tarjetas de vehículos.

### 2.3 Uso de Flexbox

- `.header-top-inner` y `.main-nav` / `.nav-list`: alineación de cabecera y enlaces de navegación.
- `.vehicle-accordion`: acordeón interactivo horizontal en desktop y apilado vertical en mobile.
- `.panel-footer` y `.service-cta-inner`: distribución de precios con botones de acción (CTA).

### 2.4 Media Queries y breakpoints

- 768px (límite mobile/tablet): el acordeón colapsa a columna vertical, el menú de navegación pasa a panel desplegable y los grids se configuran a 1 columna.
- 1024px (límite tablet/desktop): el mosaico de servicios pasa a 2 columnas y el footer a 2 columnas en tablet; sobre 1024px el mosaico pasa a 4 columnas y el footer a 3 columnas.

### 2.5 Unidades responsivas

- `rem` para fuentes y espaciados base con respeto a la accesibilidad.
- `clamp()` para titulares fluidos (`slide-headline` y `section-heading`).
- `100vh` / `dvh` para altura visual completa del hero slider.
- `%` y `fr` para distribución proporcional de grillas y paneles.

### 2.6 Pruebas previstas

- inspección con DevTools en emulador de dispositivos (mobile, tablet, desktop);
- auditoría de accesibilidad con axe DevTools y navegación por teclado.

---

## 3. Actividad 1 — Preparar el proyecto

Se mantiene la estructura limpia del proyecto de la Semana 1 sin bifurcaciones.

---

## 4. Actividad 2 — Implementar CSS Grid Mobile-First

Se implementa la estructura de grilla iniciando desde la vista móvil en una sola columna vertical (`1fr`).

> Justificación: en un celular la pantalla es angosta. Si ponemos las cosas en una sola columna hacia abajo, la gente puede leer tranquila y tocar los botones con el dedo sin tener que hacer zoom ni mover la pantalla de lado.

---

## 5. Actividad 3 — Implementar el layout para pantallas grandes

Se aplican las media queries para reorganizar las áreas cuando existe suficiente espacio horizontal.

> Justificación: como en tablets y computadoras sobra espacio a los costados, no tiene sentido dejar todo en una tira larga hacia abajo. Ponemos los bloques de a dos o de a cuatro para que la página sea más corta, cómoda y fácil de mirar de un solo vistazo.

---

## 6. Actividad 4 — Implementar Flexbox

Flexbox se implementó en componentes unidimensionales para alineación y dinamismo interactivo.

### 6.1 Barra superior y navegación

```css
.nav-list {
  display: flex;
  align-items: center;
  gap: 28px;
  list-style: none;
}
```

### 6.2 Acciones de tarjetas y bloque CTA

```css
.service-cta-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-8);
  flex-wrap: wrap;
}
```

---

## 7. Actividad 5 — Consolidar unidades responsivas

Se aplicaron unidades adaptativas para mantener coherencia en cada tamaño de pantalla:

- `vh` / `dvh`: en el banner de bienvenida para que llene toda la pantalla apenas entras, sin importar la altura del dispositivo.
- `%` y `fr`: en los anchos de las cajas y columnas para que se repartan el espacio disponible de forma pareja y elástica.

---

## 8. Actividad 6 — Probar en diferentes dispositivos

| Escenario | ¿Qué verificamos? | Problema encontrado | Corrección |
| :--- | :--- | :--- | :--- |
| Mobile (375px - 414px) | Menú de navegación, slider hero y acordeón de autos. | Los paneles horizontales del acordeón quedaban aplastados a menos de 100px de ancho y el menú desbordaba la pantalla. | Se programó botón hamburguesa con panel desplegable (`.main-nav.active`) y en mobile el acordeón pasa a `flex-direction: column` con tarjetas apiladas de altura mínima 180px. |
| Tablet (768px - 1024px) | Mosaico de servicios y pie de página. | 4 columnas en tablet comprimían el texto de las tarjetas de taller. | Se estableció media query intermedia a 1024px configurando `services-mosaic` a `repeat(2, 1fr)` y `footer` a `repeat(2, 1fr)`. |
| Desktop (1280px+) | Expansión del acordeón interactivo y legibilidad panorámica. | En pantallas ultra-wide las líneas de texto del slider y servicios se estiraban demasiado. | Se aplicó contenedor central con `max-width: 1240px` y `margin: 0 auto` para acotar la longitud de lectura óptima. |

---

## 9. Actividad 7 — Inspeccionar con DevTools

Pasos ejecutados durante la inspección técnica:

### 9.1 Inspección de CSS Grid

- Se activó el visor de cuadrícula en Chrome DevTools sobre `.services-mosaic`.
- Se comprobó la transición de 1 columna (mobile), 2 columnas (tablet) y 4 columnas (desktop).

### 9.2 Inspección de Flexbox

- Se inspeccionó `.vehicle-accordion`, comprobando `flex-direction: column` en viewport móvil y `flex-direction: row` en viewport de escritorio.
- Se verificó que `flex: 1 1 0` se distribuya equitativamente y aumente a `flex: 3.6 1 0` al aplicar `:hover` o `:focus-visible`.

### 9.3 Modificación interactiva de propiedades

- Se alternó `justify-content` entre `space-between` y `center` en `.header-top-inner`, comprobando que `space-between` mantiene la separación correcta entre el logo y los botones de acción.

### 9.4 Activación y desactivación de media queries

- En la pestaña Styles de DevTools se desmarcó temporalmente `@media (max-width: 768px)`, observando el colapso inmediato del menú y confirmando la necesidad de la regla responsive.

---

## 10. Actividad 8 — Comparar decisión vs. implementación

| Decisión del equipo (Etapa 1) | Implementación (Etapa 2) | Evidencia | ¿Se modificó? | ¿Por qué? |
| :--- | :--- | :--- | :--- | :--- |
| Estructura macro con CSS Grid en áreas globales de página. | CSS Grid aplicado en macro-componentes específicos (`.services-mosaic`, `.footer-main-grid`, `.form-grid-2`) y flujo semántico estándar en secciones. | Archivo `css/styles.css` | Sí | Un Grid global en el elemento `body` o `main` restringe el uso de fondos decorativos de ancho completo (`full-bleed`) que requiere el diseño automotriz. |
| Acordeón horizontal interactivo para catálogo de vehículos. | Flexbox horizontal con transición de propiedad `flex` de `1` a `3.6` en `hover` y `focus`. | `.vehicle-accordion` y `.vehicle-panel` | No | Se mantuvo exactamente según el plan, logrando un catálogo visual moderno y eficiente en espacio. |
| Menú de navegación responsive colapsable. | Menú desplegable vertical mediante clase `.main-nav.active` controlado por `script.js` y accesible por teclado. | `script.js` y `styles.css` | No | Garantiza usabilidad táctil en móviles y accesibilidad mediante botón con `aria-label`. |
| Tipografía con breakpoints fijos. | Tipografía fluida implementada con `clamp()` y `rem`. | `.slide-headline`, `.section-heading` | Sí | `clamp()` proporciona una transición más suave y armónica sin requerir media queries intermedias para cada tamaño de pantalla. |

---

## 11. Actividad 9 — Reto: “Una experiencia, tres tamaños”

Demostración del comportamiento adaptativo de DRIVE en tres formatos.

### 11.1 Mobile (`< 768px`)

![][image4]![][image5]![][image6]

- Cabecera fija compacta de 60px con logotipo y botón hamburguesa.
- Hero slider con titular adaptado mediante `clamp(1.8rem, 6.5vw, 2.4rem)`.
- Acordeón de superdeportivos y camiones apilado en columna vertical accesible al tacto.
- Mosaico de taller en 1 columna lineal.
- Formulario de contacto y citas apilado a 1 columna.

### 11.2 Tablet (768px - 1023px)

- Mosaico de servicios ordenado en 2 columnas por 2 filas equilibradas.
- Acordeón de vehículos en formato horizontal con altura reducida a 480px.
- Pie de página distribuido en 2 columnas.
- Formulario modal organizado en 2 columnas.

### 11.3 Desktop (`>= 1024px`)

- Doble nivel de cabecera con datos de contacto directo y barra de navegación fija horizontal.
- Acordeón interactivo panorámico de 540px con animación dinámica de expansión al pasar el cursor o navegar con teclado.
- Mosaico de 4 especialidades de taller desplegado en 4 columnas continuas con bordes integrados.
- Pie de página a 3 columnas con marca, navegación y canales de atención.

### 11.4 Qué cambió y qué permaneció igual

- Cambió: la orientación de los ejes de distribución (de vertical a horizontal), el número de columnas de las grillas y la visibilidad directa del menú de navegación.
- Permaneció igual: la paleta cromática oscura, la jerarquía semántica del contenido, la accesibilidad de los botones y el acceso permanente al formulario de citas.

---

## 12. Actividad 10 — Verificación de accesibilidad

Verificaciones realizadas para asegurar la continuidad de los estándares de la Semana 1:

1. Contraste y legibilidad:
   - se validó con herramientas de contraste que los textos principales y secundarios sobre fondo oscuro superen holgadamente la relación 4.5:1 exigida por WCAG 2.1 AA.

2. Orden lógico de lectura:
   - al desactivar estilos o leer con lector de pantalla, la secuencia lógica de HTML se mantiene intacta: encabezado → slider → autos de élite → camiones pesados → servicios de taller → bloque CTA → pie de página → diálogo modal.

3. Navegabilidad por teclado:
   - los paneles del acordeón cuentan con `tabindex="0"` y la pseudo-clase `:focus-visible`, permitiendo abrirlos e inspeccionar precios y botones pulsando Tab;
   - el botón de menú móvil y los controles del slider cuentan con etiquetas descriptivas `aria-label`.

4. Ausencia de superposiciones y zoom 200%:
   - se comprobó mediante zoom de navegador al 200% que los textos no se cortan ni se montan sobre otros elementos gracias al uso de `rem`, `gap` y alturas flexibles.

---

## 13. Justificación técnica

### 13.1 ¿Por qué utilizar CSS Grid para la estructura principal de ciertos componentes?

Porque Grid es perfecto cuando necesitas ordenar cosas en filas y columnas al mismo tiempo. Por ejemplo, en la sección de servicios o en el pie de página, nos permite pasar de una sola columna en el celular a dos en la tablet y a cuatro en la computadora de forma muy limpia.

### 13.2 ¿Por qué utilizar Flexbox dentro de determinados componentes?

Porque Flexbox es ideal para acomodar elementos en una sola línea, ya sea horizontal o vertical. Lo usamos para separar el logo del botón en la barra de arriba, para poner el precio al lado del botón en las tarjetas, y para lograr el efecto donde los autos se abren y cierran suavemente al pasar el mouse.

### 13.3 ¿Qué significa que su diseño sea Mobile-First?

Significa que primero pensamos y armamos la página para que se vea perfecta en un celular, todo ordenado hacia abajo y ocupando bien el espacio de la pantalla. Después, a medida que la pantalla se hace más ancha, le vamos diciendo que acomode las cosas una al lado de la otra.

### 13.4 ¿Qué problema resuelve la media query?

Evita que la página se rompa o se corte cuando cambia el tamaño de la pantalla. Le avisa al navegador: cuando la pantalla tenga cierto ancho, cambia la distribución para que no se vea todo apretado en un celular ni todo desparramado en un monitor grande.

### 13.5 ¿Por qué eligieron los breakpoints de 768px y 1024px?

Porque son los tamaños clásicos donde los dispositivos cambian de categoría: 768 píxeles es más o menos donde termina un celular y empieza una tablet, y 1024 píxeles es donde ya entramos al tamaño de tablets acostadas y laptops.

### 13.6 ¿Dónde utilizaron `rem`, `vw` o `vh` y por qué?

Usamos `rem` para los textos y espacios para que si una persona agranda la letra en su navegador por comodidad, la página no se rompa y lo respete. Usamos `vh` en la foto principal para que ocupe toda la pantalla al entrar, y `vw` con `clamp()` para que los títulos se achiquen o agranden según el ancho de la pantalla sin dar saltos bruscos.

### 13.7 ¿Qué cambió entre mobile y desktop?

En el celular el menú se esconde en el botón de hamburguesa, los autos se muestran como tarjetas una debajo de otra y los servicios van en fila hacia abajo. En la computadora el menú está siempre a la vista, los autos se ponen uno al lado del otro y se abren al pasarles el mouse, y los servicios se ven en cuatro columnas juntas.

### 13.8 ¿Qué parte de la experiencia se mantuvo igual en todos los tamaños?

La identidad visual de marca, la paleta de colores, la jerarquía de contenidos, las imágenes y la legibilidad accesible de la información.

### 13.9 ¿Qué problema encontraron durante las pruebas y cómo lo corrigieron?

Al principio, cuando achicábamos la pantalla al tamaño de un celular, los autos que estaban uno al lado del otro se apretaban tanto que quedaban finitos y no se podía leer nada. Lo solucionamos haciendo que en celulares se pongan uno debajo del otro como tarjetas normales, con espacio cómodo para tocar con el dedo.

---

[image1]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAkMAAABKCAYAAAC4qVB6AAAUWUlEQVR4Xu2cf2heRbrH339aSNl2sSLNhXLL2w2FRcGETREpdGkuWojExZQN20jVbFu5aWmlzZWt2KKpoXa3ofHquys1oYaWrBdrFCJZ3UICS9m4VoiE0nSl11QaJJSikW3xlVth7jwz85yZM3NOfjQ/9O35DnzsOc/8es7MvDPfM3NMLpfLCQAAAACADBMYAAAAAACyRGAAAAAAAMgSgQEAAAAAIEsEBgAAAACALBEYAAAAAACyRGAAAAAAAMgSgQEAAAAAIEsEBgAAAACALBEYAAAAAACyRGAAAAAAAMgSgQEAAAAAIEsEBgAAAACALBEYAAAAAACyRGAAAAAAAMgSgQH8WKmuFY3bGkVtdUIcAGBGcPDtU5NXv73QDrLA2rVrxXf/9z0oUYb+8XHQpwkEhtui65KeYEZP1sbsFLoS0i8kA5Pal5aEuJLm5Khp44S4O4zbGTem2wM7yCZp8wCFocP5IH0aE0UzsEyoTUgD7mz8xRWUHn6fJhAYbgsWQxRaKqydwmwXtbnSf6UoijeKYre8buybUD4M7AvTlRwlIIZ0GA3ss4X6r5Bgn4qxG7rffftsaP9UP4Fv/3HRvmg+cnss9m94PnDnAT9upuTNb05MjorGbc/r64n+IB24s/EXVlB6+H2aQGCYnn0Dak5wF2VXDAlhFyQKdiKtFcVbNtXYYLsts6IxFjfxSU8UV/sHXR+H9jpbrxt6mvXbnvtG6AedLy8XTmtzy6MJNMnO9Fzg/Qf5/Kd2O3HxZ2t/lyZRKwraB8ds5K1i9HapwqUeJ25S5KMyq8SkU2b/OV0Gt/vodRsnrtu6tIfmv4Mt1kczsfc67dkohatbB91zejdw23LfDxy3PnM7+YHLSfOTgltO8cpALE6NmwSfJz8pJPrs7wy5feyWTemS6o2PYUdAV++O2eP9TrQo++SgFikU3PoIv//d56T+18+j26bxuH1Wv5xcriuKU2FyIOoTt68p+DsiaeXqEB8/NMb89qAxFc+jw8Dx5OOjAee3JG6MOePaUrXHGfsy9P+Bd5bjv1HfX3881L46HN3zeAh2htx+lL+zKrZPMaYZ9l2VeWs4eA5wZ+MvrKD08Ps0gcAwPdu6xOiFUdF7yNp44hx4Vi8MFGjBp6AWtaZ+bbxsRE6dntTb5XX+uJnIihNq0qlqMhP+rTHRrzd2RI+ZnLou6Ql2+HjOLJR6gs5v7VELLU1wsUnQLKbuzlCvEjQ6H6clP1oG9U2PmUyL48OxCXz3G0Mq3hUyE31yIago6EKkCKyhvNXbzb1eYMwjRPlGzRrBZVCgCVw9gwp6seRrNWlLschBiSE1sfOiWmtiJtQ9iwLli+M/t4WY1JM5h14SOk75FNclhRcfefZc1vb+bblo4dDtVxXlqXHaxC6seXPPiyjfu8+u4543bS+u9EZxrhhinweMsEry2RVDKsjxo+vl9nHTJdfLY0Dnk/HnTGdNDKn7xuN6DAw5Y5/FEIXePVW2fqHLaTzcq655x1TV8Kl+EeDQ1aTz5be2RflyFabcYPHV9uh+BmKIyx14Votat1wdQjFE19we9oWmRt0XL+v22v0uizxua1s/hd3q+7YqwbKo5yGbhn/bkxf0nND2F22ga/c36reDzhQfD6Ko6+8x84OKc+aBeD/mo7Gi+jE2pq3vPKb9Z3JtIBv4CysoPfw+TSAwTM9UYkiKjlpewMyUQxNp+JapA026riDx60oNl7pkvNm2lmHyylD0pjedGCLaTsV3m9Rk/1DaDo2l5tmCGLtu33jVAmTqGDtlv0N [truncated]

[image2]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAj8AAACxCAYAAAAridy2AAAsrUlEQVR4Xu2de0xd153v+w+IhIIfZAKVaeNUkDG41zRDAMc4sXFsXGPXuNDwKD62A8aO8QMyPkMAG4ywIRjEYJPjRwKxTMjN4NF1e4MaXVfJdCr/0etIVW8iRWoqRWqr0fRGvWoTdaq0mon0u+u3fmvt1zk4Jklt8P4ifXTOXnu99t6Lsz5nrX32+tKXvvQlAgAAAAAIEHkBAAAAAAB3L2lpaQQAAAAAEBa+lJScQgAAAAAAYQHyAwAAAIBQAfkBAAAAQKiA/AAAAAAgVEB+AAAAABAqID8AAAAACBWQHwAAAACECsgPAAAAAEIF5AcAAAAAoQLyAwAAAIBQAfkBAAAAQKiA/AAAAAAgVEB+AAAAABAqID8AAAAACBWQHwAAAACECsgPAAAAAEIF5AcAAAAAoQLyAwAAAIBQAfkBAAAAQKiA/AAAAAAgVEB+AAAAABAqID8AAAAACBWQHwAAAACECsgPAAAAAEIF5AcAAAAAoQLyAwAAAIBQAfkBAAAAQKiA/AAAAAAgVEB+AAAAABAqID8AAAAACBWQHwAAAACECsgPAAAAAEIF5AcAAAwvT75KDQnCAfCyreclevmlgbhwsHCA/AAA7gg/+t0n9M5LlWa7nX709/Fx/tq885+f0FG73fNT+ssffx4XByww+Dqq6/ryt9ywht018fHmxEv0l9/9i7P9kcp/aEUwzqfD7e1Fb1jlP+q6WhpMnvxeXn8fl8dsPFK5i7atjg8HiYH8AADuCCw//CF/VH/ge+RndaUegdloOoKG2s1OeMNuI0srNtPLL/i/efe98Cq9OLCftu3eZcJW0Isqn76mYifOxvZzKu+XnG2Om+NJ//JYj7OPO5ONK4p1nt5ywPzm+h8+obd+9j795f3vS9jq/VoinLaTXKzb19GNK/S2vc4c9ognH952206xpx3u1/u8osFy1TTwki+9IG3Qbgflx23/KZTT/i9KsES+rfx4pe3o2Ktum1ftv6GymMY8x/GBSvPLK3wsJr+N7bqe/voAy5zkp/0nH5Hv78MPKJIXHy8p+q/+eOrvn9pK4uJdeo/3/MIX9n/+S+J7wyI//ECHffiTZ29aBv8FywAAzE9Yfn40qT7w//NP5MjP2nN6+9iRAd0BbEx2OwLu1K73qTgr+Nvyn6jvh6qD+/hdve+XKs5H7/+U/vkn73u+Natv/wOt9JuPVboeLlN1gr97n17+4btOHDvyw9/kP3j7dfrRe793vm2/+K6Ssz/+u3Qq//910fGDeI9d2s3ONk3q+r9+/8zbLEIvQJ3RMSS9fV25z9jp728Vr/6b2XXmVPlBt5zevsfy6Iz+6XU1KnlbY+f1bP3zVLdNTF26D0sYTyM8ffuqL7z8Gd+TnrT+qerx5Trf5F3lE6+/5/+YT+mdTj2Mqzm/U/8dHv36XXtytxOcff66PqYH/j951ZR+4fCb5+fN//NknHD/uWOGPa8Xkv/7si3tpiz+/RPKTe+5tHdcb9iuTft9NyrD46gEAmLdo+VGdx8vvqc7nt+86Hclrb/+7/kBnWEy09PSscDqEo2+yoLhTBRzm7XS4U+PXg5M/pY8+ljjvvKT2vSSi5MXKj3d6wZbLnaJNhw5kgaA7/Z9Tg5Kb36jr+NpuCXeuL19LT9vh6+pcZx0vvj0JVn6UpLebMM7LI0SJ0nnbIG/Hyc/HiadZ3fyk3t46f/Bmu8iPKdv+H3mPw46qCrc+dRYmPpP8uGElRksCIy5GTJyRmqf+l3/bkEh+GP773/12+1tSAH1w8zIAAAsK+6HN73nkRb/nDuU9Gaq3EpL0LflG7QgId3D6g38FvXhEpiW4o+NvxgfH5Bsxd1L2Q5+/xetOYffrquNaIeX9VkTIdkacZhvnvYLTScfDnYlTJ8jPguAtJRofvPcuvfO24td/or/82+s63BE [truncated]

[image3]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARYAAADvCAYAAAA3p/sqAAAp30lEQVR4Xu2dCXRW1bn3Weuu795b2++2t84DEiAESCAQCATCFOZ5DhAgzCSE0UBAkElB5nkSEUFEBJkEQUG99n63ra21g15tbXu91jq2Ko4giq2u7i//Jz6HnX3eN8PxJOZN/q71W+fseXz+5zmHuN9a//wv3zHJzdPMD6++mRBCvhHQEmhKre//4Epz9XV1fRkIIaS8XHN9PQNNqdWmXWdfIiGEBAWaUis+oZkvgRBCggJNqXXdjfV9CYQQEhRoSi03khBCvikUFkJI6FBYCCGhQ2EhpIZSO66xaZbSVj62xtVPMnXqJZp6DZqaRkktTeMmqb785YHCQkgNBGJyc93GJVI/IVnyuWXLAoWFkBpGYtNWPhEpCeR36ygNCgshNYiyeCqRcOspDQoLITUEfFNxBaOsNGlWvv+fkMJCSA0BH2pdwQBL1u7x7pundjQTpi/y5QHX3lDPV2c0KCyE1BAaNGzuEwuwbtdxs2LbQZOa3s3sOPCEiY+SL6FRiq/OaFBYCKkh4J+UXbFQVu94SESlaUo7X5qSnNLGV2c0Yk5Yfn5osS+OEFI6+DsVVyxAekZfEZV1dx8za3Ye9aUrzVuk++qMRqjCsnXxBNOlXdFHnlUFo829K3PNzmWTJIx7BeEdtxfFJzVOMlNG9pH7Vi1SzMm7ZptxmT0l3KltazOoVyev/hVzRplDm2aaunEJXht223ZftK1GDYu+aGtY87npV11TxxzcMN0snj7cq2Non07m1N1zzPB+Xbw47XeduAZm0bRhco9+bl1yuX3EI13DOgfunGhacpMmXp1Iv3vZZHPDTZf/51A7DyFBwd+l+MQitaOICq4IL99ywKzacdiXD5Tnn51DExYY5o/2LTAntud7cU/dN9+7/+mDi4rlf/bIUrNkxnARk9VzsyXu4e23yHXNvGzTv3sHMeyp2f0kDnW3Smku90/ed6tc0dbZ3fN8bWkark8fLPJw7H5FSt+3ZqppmNBYRKR7p3QzZ9Jgs/G2cZIGoYCo4R7jgKE3aNBIyiDu6JZZ0j/MgdaFdG3LHfvmRUX1QiDP7p5r7ludJ2G7zif33Cpi4uYhJCjl/fsVF3g8bp3RCE1YcrJ6Cz8+sNCLs40dQgLUyHCF8fTt2sETFoiMXactLHZdiMcV4rCqsOy83KE+Yfmv/Qvl6a/90fZVUJC+d9UUL71taktJP7xlpoRVsBStH/0+vi1fPCkVAdSBsUOMEC5JWB5cP927v2NWloxfX+9sYcEYV8we5ctDSFDwZ/quWJSV8v4FbmjC8h+FhqfGmzWg6NWhJI8FYTzhf3F4qScs8GBwHdG/q7yi2MICz0I9AjVOFQkIlCss0TwUOzxpRG+vbfVIRg/uJm3CW9FXoC7t25gH1k2Tex0HDF1FQMcNrwXhaMIyuFCMjm8t8so0Xst2Sm9dTFjgofTMSPflscdASHmJ9i9DpVGe1yAQirBcf2M988SeotcTuO6n7y6Q+0geC0BYjQ3fJ9S44X0g/ZGdcyRsCwu+OTx9sMjI9JuMigUEpzRh0bY1n6bD20Dd8fENzTOHl/gETLyYzUVeDNB+N26YKCKAq37zwRxgLhAfaaxoW+NRDq9QiE9t3ky+70BYkIZ+5I3uK2luHntMhJQX/uUtIaRCKO+3lvJ6K4DCQkgNpCyeC/4grrzfVhQKCyE1GPyZPgQEf/yGv1OBd1Kef/2JBoWFEBI6FBZCSOhQWAghoUNhIYSEDoWFEBI6FBZCSOhQWKopa9dvMc+/+JL59XMv+tIIqWhCFZYhw7LN+U8/M1/8/Svz2aW/+dKjsW//ISmD+3fee9988NF5Xx4X5ClLvqBo/alpGb40l12790leXN20ygBtv/nWX4vFvfPeBzKnty9b7csfBus3bjMXP/9C2rj0ty/Nzl17vTSdD7cMqTm [truncated]

[image4]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQEAAAG/CAYAAABYLGL4AACAAElEQVR4XuydB5RkZ3mmVzOdc3VXd3XlnDpUdVXn3NNhunuiZjQjaZQDQcCCEBh7d0HIXky2CevjY1jAgA1mMd6z9toGY0DgNcHskhYJgQQYYSRjewFFJASSvn3f79atrq6q7pmRNBKo/j7nOff+4Ya6977v/33/vSP9u5aWFqlGc0s7lqSjQHuhziqb9mdP+9n0Ne3PtvYW+Xfl4i81ga2NrXVTfnaWd2sz5Wd7eTcTaG63sDcy5Wdvebc2U35Wl09jAm0F7I1M+dlb3q3NlJ/N5d1NgI7RWkZpnWl/9rSfTd9qdab9V7b9yZnA6ajWt1rdTlTrW61uJ6r1rVa3E9X6VqvbiWp9q9XtRLW+1ep2olrfanU71Ver24lqfavV7US1vtXqdqJa32p1O1Gtb7W6najWt1rdTlTrW61uJ6r1rVZXhV1NoKmlTWkuYMrP3vJubab87C6fxgTaFXWUAqXlam3l7dX6VFuv1r+8XL5Ntbby9mp9qq1X619eLt+mWlt5e7U+1dar9S8vl29Tra28vVqfndbPtG+1/na53+2T337t6+SlN7xcMtm8uD3+s9q+vE+19Wr9y8vl21RrK2+v1qfaerX+5eXybaq1lbeXlts7HHr9Dh06otfz2PETZ7V9+TGrtdl1u5pAs75fBK0FTPnZW96t7QzLh48ck7e9/b9IIBSt2m7KT6zM63nBiYv0+lZrf7Ll05iA7RzcYLuTbK8z7c+e9rPpa5EfnZTf+d237Nh+uu1N+5m3Ly6t4HpP7Nh+uu2rte9qAqUhg71erc60P3vaz6avDQ2AoetO7afb3rRXX69Wx3VebxrBTu2n2768fVcTKL5TLGz8dJY/9rG/kd/6rdfs2G7KT3F5t7Zdyr/2il/ftd2Uz015cXF51/azKe9uAoUN7E8N7c8Nq61XfopYWSZz84un3X4effhHI6jWp9p6teNx/dprn1sB93+67fP5cbnqqmsqtj3d+XMCh/2uvPJqicVT2/rwuPZ++vrcFdvzmOXtpzsfm83NQ1V/f/kxytufSF+7fPjI+XpOT3T78vZqfaqtV+tfXi7fplpbeXu1PtXWq/UvL5dvU62tvL1an2rrdpnX/8lsv1V3GhMo3bB8Z2fbXiruau2Ebfxj32rtu+2/vI7rjz/++I7ce++9O27/ute9Xn72s59VbGPzh3/43qrH/8Ztt2n7/fffr+IsbaOw7e3/4A/esW17/t7vfe9ObeNxS8/lTM7n5ptvrtim2vnt1H42fW0uOHHhru2n2960V1+vVdetndf/OAadndpPt/1W3W4msO1TQ3u9Wt2Zt9sin5tbrGhnXTEC2GH76nU7t9siefDBB+W+++6XX/ziF9vE84Y3vKnq9q997ZboHn74Yd32/vsfKG73k5/8RK677gUVx//GNywTYH+aQHn7o48+qu1f+cpXS47XLjfc8HJ54IEHte3OO+8sO6f2qudTyl/91V+X9N9+zGq/b+f2M+8bCIQr6s50+2RyQD7zmb+zzLBK++m2N+3W9X/Na167Y3v1usr23U2g5OOCpxKG1EWxF+qK5qARQOU2TxRbtK/FSFpaf/OnPy2PPfaYtv3933+2Yjv2t0X3KYyydv0rX/kq+elPf6r1n/7MZyq2syOB+wqRQHn7V77yFW3/+c9/Lm9929uK9d/+9ne0/qGHHpJXv/qmiu12Op9nimPHL6ioO1Ne85rflq9+9avbyuV9qpHPj8nffuITxXv6r//6r/Ib/+E/VvTbCd4b3pfy+ifK//2//1d+8zd/q1heX9+UL33pS8Xz+853vivXXPOc4r3r3/6pgN8RlNedLbubQOGdYov9brGE0ron0l4U/cKSzIOiKVTZptr2Z9q+ZQJv2NZ+/rEL5F/+5V+07cc//nHF9q9Df1t0N9/86WL9tc95nj5 [truncated]
