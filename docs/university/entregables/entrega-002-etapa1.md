# Guía de Laboratorio N.° 2

## Laboratorio de Experiencias Web Inmersivas · Semana 2

### Implementación y validación de un layout responsive para experiencias web

#### ETAPA 1 · ANALIZAR, DISEÑAR Y PLANIFICAR LA ADAPTABILIDAD

| Campo | Detalle |
| :--- | :--- |
| Modalidad | Laboratorio grupal |
| Duración sugerida | 3 horas |
| Entrada obligatoria | Plan de Adaptabilidad Responsive |
| Tecnologías | CSS Grid · Flexbox · Media Queries · rem / vw / vh / clamp() |
| Producto | Prototipo responsive funcional |
| Herramientas | VS Code + navegador + DevTools |

---

## 1. Propósito de la actividad

Analizar el prototipo construido en la Semana 1 para la plataforma web DRIVE y diseñar cómo debe reorganizarse para diferentes tamaños de pantalla (mobile, tablet y desktop). En esta etapa no se desarrolla código, sino que se documenta la planificación y la especificación técnica que servirá como entrada directa para la implementación en el laboratorio (Etapa 2).

Se respeta rigurosamente la estructura semántica, los criterios de accesibilidad (WCAG) y el sistema de diseño visual establecido previamente.

---

## 2. Complementariedad: trabajo grupal vs. laboratorio

| Trabajo grupal (Etapa 1 - Planificación) | Laboratorio (Etapa 2 - Implementación) | Producto de conexión |
| :--- | :--- | :--- |
| Analizar el prototipo de semana 1 | Implementar el layout responsive | El laboratorio usa las decisiones tomadas |
| Definir comportamiento Mobile-First | Construir Grid para las áreas | El layout implementado sigue el plan |
| Decidir dónde usar Flexbox | Aplicar Flexbox internamente | Se comprueba la decisión |
| Definir cuándo cambia el layout | Crear Media Queries | Se prueba el breakpoint |
| Seleccionar unidades relativas | Aplicar rem / vw / vh donde corresponda | Se comprueba adaptabilidad |
| Definir pruebas en mobile/desktop | Redimensionar e inspeccionar | Se registran resultados |

> Regla rectora: “En el trabajo grupal decido cómo debe adaptarse la experiencia; en el laboratorio hago que esa adaptación funcione.”

---

## 3. Reto de la experiencia

La plataforma web automotriz debe brindar una experiencia táctil intuitiva y fluida en pantallas pequeñas (smartphones), optimizando al mismo tiempo el espacio horizontal en pantallas mayores (tablets y computadoras) para resaltar la naturaleza visual y de alta gama de los vehículos y servicios comerciales.

---

## Actividad 1 — Diagnóstico del prototipo actual

| Elemento actual | Problema posible en pantalla pequeña | Decisión propuesta |
| :--- | :--- | :--- |
| Menú y barra superior (`.header-top-inner`, `.main-nav`) | En móvil, el teléfono de ventas y el botón CTA compiten por espacio horizontal con el logotipo, y los enlaces de navegación desbordan la pantalla generando scroll lateral no deseado. | Ocultar datos de contacto secundarios en la barra superior compacta y trasladar los enlaces de navegación a un menú desplegable vertical gestionado por un botón hamburguesa (`.mobile-toggle`) accesible. |
| Hero Slider (`.slide-headline`, `.slider-section`) | Tipografías con tamaños fijos provocan desbordamientos de texto sobre los controles inferiores, o la altura del contenedor empuja la información fuera del viewport inicial. | Implementar escalado tipográfico fluido mediante `clamp()` con unidades relativas (`rem` / `vw`) y fijar alturas relativas dinámicas (`100vh` / `100dvh`), reposicionando las flechas de navegación a la esquina inferior derecha. |
| Acordeón de vehículos (`.vehicle-accordion`) | Configurado en fila horizontal (`flex-direction: row`) con altura fija de 540px. En móviles los paneles se comprimen a pocos píxeles, haciendo ilegibles títulos, precios y botones. | Pasar a una disposición en columna vertical (`flex-direction: column`) con altura automática (`auto`), convirtiendo cada vehículo en una tarjeta táctil apilable con expansión clara. |
| Mosaico de servicios (`.services-mosaic`) | Matriz fija de 4 columnas (`repeat(4, 1fr)`). En resoluciones angostas los textos colapsan, los iconos quedan apretados y se fragmenta la lectura. | Reorganizar con CSS Grid: 1 columna en móvil (`< 768px`), 2 columnas en tablet (`768px - 1023px`) y 4 columnas en desktop (`>= 1024px`). |
| Footer multicolumna (`.footer-main-grid`) | Grilla de 3 columnas asimétricas (`2fr 1fr 1fr`) que apiña enlaces de navegación y legales en pantallas pequeñas. | Colapsar a 1 columna vertical en móvil, distribuyendo la marca, enlaces y datos de atención en bloques secuenciales con áreas de toque separadas. |
| Formulario del modal (`.form-grid-2`) | Dos columnas contiguas para campos de nombre y correo (`1fr 1fr`), lo que reduce el ancho de los inputs e incomoda la escritura táctil. | Reconfigurar a 1 sola columna en dispositivos móviles para que cada campo ocupe el 100% del ancho del diálogo. |

---

## Actividad 2 — Diseñar el comportamiento Mobile-First

| Área | Comportamiento en mobile | Justificación |
| :--- | :--- | :--- |
| Header | Barra fija superior de altura compacta (60px) con logotipo y botón de acción directa (“Cotizar / Cita”). Se complementa con botón toggle. | Prioriza la identidad visual y el objetivo de conversión principal sin saturar el espacio disponible. |
| Nav | Menú desplegable vertical colapsado por defecto, superpuesto debajo de la barra superior al activarse. | Elimina el desbordamiento horizontal y proporciona áreas de toque (hit targets) cómodas de al menos 44px de altura. |
| Main / Experiencias | Flujo de lectura vertical continuo de 1 columna: hero slider adaptado, tarjetas de autos y camiones apiladas verticalmente y servicios en lista. | Coincide con el patrón ergonómico natural de desplazamiento con el pulgar en dispositivos móviles. |
| Aside / CTA Taller | Bloque de ancho completo donde el texto de propuesta precede al botón de reserva en formato ancho (`100%`). | Asegura que el usuario comprenda el valor del servicio técnico antes de interactuar con el botón de agendamiento. |
| Footer | Apilamiento secuencial de bloques de navegación, información de contacto y avisos legales centrados o alineados a la izquierda. | Facilita el escaneo vertical rápido al final de la página sin forzar zoom ni toques accidentales. |

> Principio aplicado: se diseña y optimiza primero para el escenario más restringido de recursos y espacio, expandiendo progresivamente las capacidades hacia pantallas mayores.

---

## Actividad 3 — Diseñar el esquema con CSS Grid

| Pantalla | Columnas | Áreas conceptuales | Justificación |
| :--- | :--- | :--- | :--- |
| Mobile (`< 768px`) | `1fr` | `header`, `nav`, `main`, `aside-cta`, `footer` | Estructura 100% lineal de una sola columna que garantiza flujo continuo sin quiebres ni desbordes laterales. |
| Desktop (`>= 1024px`) | Modular por sección | Servicios: `repeat(4, 1fr)`; footer: `2fr 1fr 1fr` (`brand nav contact`); modal: `1fr 1fr` (`name email`) | Aprovecha la amplitud del ancho horizontal para presentar información complementaria en paralelo, reduciendo la altura total de scroll. |

---

## Actividad 4 — Decidir dónde usar Flexbox

Regla arquitectónica: CSS Grid define el macro-esqueleto estructural; Flexbox organiza la distribución y alineación de los elementos internos de cada área.

| Componente | ¿Cómo usaríamos Flexbox? | Propiedades clave |
| :--- | :--- | :--- |
| Navegación (`.nav-list`) | En mobile: disposición en columna vertical (`column`) alineada al inicio. En desktop: fila horizontal (`row`) distribuida con separación equitativa. | `display: flex`, `flex-direction`, `align-items`, `gap`, `justify-content` |
| Acciones y tarjetas (`.panel-footer`) | Alinear el bloque de precio a la izquierda y el botón de asignación a la derecha; permitir envoltura (`wrap`) si el espacio es reducido. | `display: flex`, `justify-content: space-between`, `align-items: center`, `flex-wrap: wrap`, `gap` |
| Encabezado superior (`.header-top-inner`) | Separar los extremos (marca/hamburguesa a la izquierda y enlaces/CTA a la derecha) con alineación vertical perfecta. | `display: flex`, `justify-content: space-between`, `align-items: center` |
| Controles de slider (`.slider-arrows`) | Agrupar las flechas de navegación previa y siguiente con un espaciado regular de fácil acceso. | `display: flex`, `align-items: center`, `gap: 16px` |

---

## Actividad 5 — Definir el cambio de layout (breakpoints)

| Condición (Media Query) | Layout inicial (mobile) | Cambio esperado | ¿Por qué? |
| :--- | :--- | :--- | :--- |
| `@media (min-width: 768px)` (Tablet) | Servicios en 1 columna; footer en 1 columna; modal en 1 columna; acordeón apilado en vertical. | Servicios pasa a 2 columnas (`repeat(2, 1fr)`); footer pasa a 2 columnas; formulario del modal pasa a 2 columnas; botón de contacto superior visible. | Existe ancho suficiente para emparejar elementos sin comprimir la tipografía ni saturar la vista. |
| `@media (min-width: 1024px)` (Desktop) | Menú en botón hamburguesa; servicios en 2 columnas; acordeón vertical. | Menú de navegación visible en sub-barra horizontal; servicios se despliega a 4 columnas continuas; acordeón se transforma en fila horizontal interactiva (`flex-direction: row`) con expansión fluida por hover/foco. | La pantalla completa permite una experiencia inmersiva de alto impacto visual y exploración directa con mouse. |

---

## Actividad 6 — Unidades responsivas

| Elemento | Unidad propuesta | Justificación |
| :--- | :--- | :--- |
| Tipografía y espaciados (`margin`, `padding`, `gap`) | `rem` | Garantiza accesibilidad. Si el usuario modifica el tamaño de fuente base en su navegador, todos los espaciados y textos escalan armónicamente. |
| Titulares (`.slide-headline`, `.section-heading`) | `clamp(min, vw, max)` | Fluidez tipográfica sin saltos bruscos: escala proporcionalmente según el ancho del viewport (`vw`) asegurando un tamaño mínimo legible y un tamaño máximo controlado. |
| Altura de slider hero (`.slider-section`) | `100vh` / `100dvh` | Logra un impacto visual a pantalla completa exacta en cualquier resolución, adaptándose a las barras de interfaz dinámicas de navegadores móviles (`dvh`). |
| Contenedores generales (`.container`) | `%` con `max-width` en `px` / `rem` | Proporciona fluidez elástica en pantallas pequeñas (100% menos márgenes laterales) y fija un ancho máximo de lectura óptima en monitores panorámicos. |

---

## Actividad 7 — Bocetos responsive

### Boceto mobile

Pantallas angostas: 360px a 767px.

En este boceto puedes observar:

- el encabezado compacto con el botón hamburguesa a la derecha;
- el espacio designado para el “Hero Slider” en la parte superior;
- las tarjetas de los vehículos (autos y camiones) apiladas en una sola columna vertical;
- el pie de página con los enlaces apilados.

### Boceto desktop

Pantallas amplias: 1024px o más.

En este boceto puedes observar:

- el encabezado expandido mostrando los enlaces de navegación completos y el botón de llamada a la acción (CTA) a la derecha;
- un espacio panorámico muy amplio para el “Hero Slider”;
- las tarjetas de los vehículos organizadas en formato de cuadrícula, mostrando 3 al mismo tiempo horizontalmente;
- el pie de página organizado en múltiples columnas lado a lado.

---

## Actividad 8 — Plan de pruebas

| Prueba | Qué observaremos | Resultado esperado |
| :--- | :--- | :--- |
| Mobile (360px - 480px) | Visualización de cabecera con botón hamburguesa, slider con tipografía adaptada, acordeones de autos y camiones apilados verticalmente, mosaico de servicios en 1 columna. Ausencia de scroll horizontal (`overflow-x`). | Interfaz compacta, navegación accesible mediante panel desplegable, hit targets cómodos (`>= 44px`) y textos legibles sin zoom. |
| Tablet (768px - 1023px) | Activación del breakpoint intermedio. Servicios distribuidos en 2 columnas, formulario modal en 2 columnas, footer reorganizado. | Mayor aprovechamiento del ancho disponible sin provocar saltos bruscos ni espacios en blanco excesivos. |
| Desktop (`>= 1024px`) | Menú de navegación horizontal visible en sub-barra, acordeón de vehículos expandible horizontalmente por hover/foco, mosaico de servicios en 4 columnas continuas. | Experiencia rica e inmersiva con interacción de puntero ágil y visualización panorámica de los vehículos. |
| Redimensionamiento progresivo (Resize en DevTools) | Comportamiento continuo de la página al arrastrar el ancho de la ventana desde 320px hasta 1920px. | Las transiciones entre breakpoints son fluidas, sin desbordamiento de cajas, sin colapso de textos y manteniendo la armonía de la rejilla. |

---

## 9. Decisiones técnicas que deberán defenderse

### 1. Estrategia Mobile-First con progresión a acordeón interactivo

- Problema que resuelve: un acordeón horizontal en pantallas reducidas es inoperable debido a que los paneles se comprimen a pocos píxeles y el texto se quiebra.
- Justificación técnica: se diseña la base en móvil con paneles apilados verticalmente, y a partir de `min-width: 1024px` se promueve mediante Flexbox a un acordeón interactivo de fila horizontal (`flex: 1` expandible), ofreciendo la mejor experiencia adaptada al tipo de dispositivo y al puntero.

### 2. Arquitectura combinada: CSS Grid para macro-layouts y Flexbox para micro-componentes

- Problema que resuelve: el uso forzado de un único modelo de caja para toda la interfaz genera código redundante, frágil o difícil de mantener.
- Justificación técnica: CSS Grid se reserva para los sistemas bidimensionales ordenados en filas y columnas estructuradas (mosaico de 4 servicios, columnas del footer y campos del modal), mientras que Flexbox resuelve los ordenamientos unidimensionales y alineaciones de eje (navbar, distribución precio/botón de tarjetas y flechas del slider).

### 3. Tipografía y escala fluida con `clamp()` y unidades relativas

- Problema que resuelve: el uso de píxeles fijos genera textos desproporcionados en pantallas pequeñas o ignora las preferencias de accesibilidad del usuario.
- Justificación técnica: el uso de `rem` respeta la configuración de accesibilidad del sistema operativo y navegador del usuario. La función `clamp()` en titulares permite que el tamaño de letra escale suavemente en función del ancho del viewport entre límites seguros, reduciendo la necesidad de declarar decenas de media queries independientes para cada elemento de texto.

---

## 10. Estructura del entregable

1. Documento técnico: este documento compila formalmente las 8 actividades y las 3 decisiones de diseño responsive.
2. Video didáctico (máximo 15 minutos): exposición del equipo recorriendo el diagnóstico, la justificación Mobile-First, los esquemas de Grid y Flexbox, y la demostración de la planificación previa al desarrollo de código.

---

## 11. Cierre

El objetivo de esta etapa no es implementar aún el layout de forma completa, sino definir una base técnica clara, consistente y validada que facilite la ejecución del laboratorio posterior. La planificación debe responder a la pregunta central: ¿cómo debe adaptarse la experiencia para que funcione bien en cada pantalla, sin perder claridad, accesibilidad ni intención comercial?
