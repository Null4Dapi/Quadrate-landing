**Desarrollo Web Full Stack - FrontEnd**\
**Proyecto Base:** DRIVE — Plataforma Web Automotriz\
**Tecnologías:** HTML5 Semántico, CSS3 Responsivo (Custom Properties, Grid, Flexbox), JavaScript ES6+ (DOM, Eventos, Constraint Validation API, Web Animations API)

**1. PARTE I — Evaluación Teórica**

**Pregunta 1: Papel del DOM entre HTML y JavaScript y Ejemplo de Modificación**

El DOM (Document Object Model) constituye la representación estructurada en memoria que el navegador genera al procesar el archivo HTML, operando como un puente de comunicación bidireccional entre el marcado declarativo estático y la lógica dinámica de JavaScript. Mientras que el HTML define la estructura inicial del documento, JavaScript no altera el archivo fuente, sino que interactúa directamente con los nodos vivos de este árbol en tiempo de ejecución. Por consiguiente, esta interfaz permite consultar el estado actual de la vista, responder a las interacciones del usuario y mutar el contenido, los atributos y las clases sin requerir la recarga de la página.

En la plataforma DRIVE, esta articulación se evidencia al desplegar el panel de citas; el código captura la referencia del nodo en el árbol y muta su visibilidad y comportamiento de desplazamiento:

const modal = document.getElementById('appointmentModal');\
modal.classList.add('active');\
document.body.style.overflow = 'hidd en';

**Pregunta 2: Diferenciación entre querySelector() y querySelectorAll()**

La distinción fundamental entre ambos métodos radica en el alcance de búsqueda y la estructura de retorno. Por un lado, *querySelector()* evalúa un selector CSS y retorna únicamente el primer elemento coincidente como una referencia directa (Element), deteniendo la exploración de inmediato o devolviendo null si no halla coincidencias. Por otro lado, *querySelectorAll()* examina la totalidad del subárbol para recopilar todas las coincidencias posibles, entregando una lista estática de nodos (NodeList) que permite iteración mediante métodos como *.forEach()*.

En consecuencia, querySelector() se emplea ante componentes únicos e identificables de la interfaz, como el botón de cierre #modalCloseBtn. En contraste, querySelectorAll() resulta indispensable cuando se aplican comportamientos homogéneos a grupos de elementos repetitivos, tal como seleccionar la totalidad de enlaces .nav-link para remover su estado activo y colapsar la barra de navegación móvil tras una selección.

**Pregunta 3: Diferencia entre Modificar style Directamente y Utilizar classList**

Manipular directamente la propiedad element.style aplica estilos en línea sobre el atributo del nodo con una especificidad máxima (1-0-0-0), lo que sobrescribe reglas externas y genera un acoplamiento perjudicial entre la lógica de programación y la capa de presentación visual. Por el contrario, recurrir a classList (add, remove, toggle) limita la responsabilidad de JavaScript a la gestión del estado semántico del componente, delegando la definición estética, transiciones y variables a la hoja de estilos externa.

Esta estrategia con clases confiere ventajas sustanciales: preserva la separación de incumbencias, aprovecha la aceleración por hardware en la GPU mediante transiciones declarativas y garantiza escalabilidad arquitectónica. En DRIVE, la alternancia entre tema claro y oscuro se ejecuta mediante una única mutación de clase en el cuerpo del documento, propagando la reasignación de tokens de color en cascada limpia:

document.body.classList.toggle('light-theme');

**Pregunta 4: Funciones de los Eventos click, input y submit en Interacciones Reales**

Estos tres eventos gestionan fases complementarias del ciclo de interacción del usuario. En primer término, el evento click captura una activación consciente y puntual mediante ratón, pantalla táctil o pulsación de teclado; en DRIVE se manifiesta cuando el cliente pulsa el conmutador de tema #themeToggleBtn o el botón de cotización en una tarjeta de vehículo.

En segundo término, el evento input se emite sincrónicamente cada vez que el valor de un campo es modificado al tipear, borrar o pegar contenido; en nuestro formulario se utiliza para evaluar en vivo el formato del correo en #clientEmail, retirando advertencias en cuanto el dato satisface el patrón exigido.

Finalmente, el evento submit intercepta la intención formal de despacho del formulario; su captura permite invocar e.preventDefault(), bloqueando la recarga del navegador para validar los campos obligatorios y desplegar la tarjeta de confirmación #modalConfirmed sin perder el contexto de la aplicación.

**Pregunta 5: La Constraint Validation API y Manejo de Campos Obligatorios**

La Constraint Validation API resuelve la dispersión técnica y la sobrecarga de código de las validaciones tradicionales, reemplazando expresiones regulares redundantes por un modelo nativo integrado al navegador que expone propiedades de estado (validity.valueMissing, validity.typeMismatch) y métodos estándar (checkValidity()).

Ante la ausencia de un campo obligatorio marcado con required, la propiedad validity.valueMissing evalúa como verdadera e invalida el envío. Frente a este evento, el controlador detiene el despacho con e.preventDefault(), preserva los datos previamente ingresados y traslada de inmediato el foco con .focus() al primer campo con error para garantizar navegación accesible. Simultáneamente, el contenedor añade la clase de error visual y actualiza los atributos aria-invalid="true" y aria-describedby, asegurando que tanto usuarios videntes como aquellos que utilizan lectores de pantalla identifiquen con precisión qué dato deben subsanar.

**Pregunta 6: Web Animations API (WAAPI) en Animaciones Activadas por el Usuario**

La Web Animations API (WAAPI) es una interfaz nativa que proporciona control dinámico en JavaScript sobre el motor de renderizado y composición del navegador, ejecutando transformaciones aceleradas en la GPU sin penalizar el hilo principal de procesamiento.

Al vincularse a una interacción, el método element.animate() sincroniza fotogramas clave y temporización en respuesta al usuario. En DRIVE, al activar la solicitud de cita, la caja de diálogo ejecuta una transición fluida de desplazamiento y escala, garantizando que la animación no bloquee la interacción y encadenando el foco al primer campo interactivo al resolver su promesa interna:

modalDialog.animate([\
`    `{ opacity: 0, transform: 'translateY(24px) scale(0.96)' },\
`    `{ opacity: 1, transform: 'translateY(0) scale(1)' }\
], { duration: 300, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'forwards' })\
.finished.then(() => document.getElementById('clientName').focus());

**2. PARTE II — Caso Integrador (Matriz de Análisis)**

|**Requerimiento Funcional**|**Elemento (DOM)**|**Evento**|**Respuesta Esperada**|**Decisión Técnica / Justificación**|
| :-: | :-: | :-: | :-: | :-: |
|**RF1 — Selector de tema**|#themeToggleBtndocument.body|click|Alternar la clase .light-theme en el body, actualizar el icono visible y sincronizar aria-pressed. Persistir la elección en localStorage.|Uso de classList.toggle() sobre body para disparar la cascada de Custom Properties sin manipular estilos en línea. Mantiene la separación de responsabilidades y asegura contraste WCAG 2 AA en ambos modos.|
|**RF2 — Formulario interactivo**|Formulario #appointmentFormCampos input[required]|submitinput|Cancelar recarga con e.preventDefault(). Si hay errores, marcar los campos infractores y enfocar el primero. Si es válido, ocultar formulario y mostrar #modalConfirmed.|Empleo de la **Constraint Validation API** (checkValidity(), validity) combinada con HTML5 semántico. Proporciona validación estándar y retroalimentación inmediata sin requerir librerías externas.|
|**RF3 — Modal animado**|Botones de apertura y cierreBackdrop #appointmentModalDiálogo .modal-dialog|clickkeydown (Escape)|Desplegar backdrop, bloquear scroll del body y ejecutar entrada fluida con WAAPI. Al cerrar, revertir animación y devolver el foco al disparador.|Implementación de **Web Animations API** (element.animate()) sobre propiedades compuestas (transform, opacity). Optimiza el rendimiento en GPU y habilita interacción inmediata tras la promesa .finished.|
|**RF4 — Accesibilidad**|Controles interactivos, modal dialog y mensajes de error|keydown (Tab, Escape)focus, blur|Nombres accesibles mediante aria-label. Trampa de foco (*focus trap*) dentro del modal abierto. Vinculación de alertas de error con aria-describedby y aria-invalid.|Adopción de pautas **WAI-ARIA 1.2**. Garantiza que usuarios de teclado y lectores de pantalla operen la interfaz con total autonomía y predictibilidad.|
|**RF5 — Responsividad**|Header, modal dialog y grilla .form-grid-2|resize del viewport|Adaptación fluida sin desbordamiento horizontal: modal al 92% de ancho en móviles con grilla a 1 columna; expansión a 2 columnas en desktop (>768px).|Arquitectura **Mobile-First** fundamentada en CSS Grid (1fr a repeat(2, 1fr)), dimensiones relativas porcentuales con tope máximo (max-width: 580px) y unidades relativas rem.|

**3. PARTE III — Implementación Práctica**

**Actividad A — Selector de Tema**

Marcado HTML del Control

<button class="theme-toggle-btn" id="themeToggleBtn" type="button" aria-label="Cambiar a modo claro" aria-pressed="false">\
`    `<svg class="theme-icon icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">\
`        `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>\
`    `</svg>\
`    `<svg class="theme-icon icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">\
`        `<circle cx="12" cy="12" r="5"></circle>\
`        `<line x1="12" y1="1" x2="12" y2="3"></line>\
`        `<line x1="12" y1="21" x2="12" y2="23"></line>\
`        `<line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>\
`        `<line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>\
`        `<line x1="1" y1="12" x2="3" y2="12"></line>\
`        `<line x1="21" y1="12" x2="23" y2="12"></line>\
`        `<line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>\
`        `<line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>\
`    `</svg>\
</button>

Reglas CSS de Cascada y Tokens de Color

body.light-theme {\
`    `--surface-dark: #f8fafc;\
`    `--surface-subtle: #f1f5f9;\
`    `--surface-card: #ffffff;\
`    `--surface-border: rgba(15, 23, 42, 0.08);\
`    `--text-primary: #0f172a;\
`    `--text-secondary: #475569;\
`    `--text-muted: #64748b;\
`    `--accent-gold: #b38e5d;\
}\
\
.theme-toggle-btn .icon-sun { display: none; }\
.theme-toggle-btn .icon-moon { display: block; }\
body.light-theme .theme-toggle-btn .icon-sun { display: block; }\
body.light-theme .theme-toggle-btn .icon-moon { display: none; }

Lógica JavaScript de Alternancia y Persistencia

const themeToggleBtn = document.getElementById('themeToggleBtn');\
if (localStorage.getItem('drive-theme') === 'light') {\
`    `document.body.classList.add('light-theme');\
`    `themeToggleBtn?.setAttribute('aria-pressed', 'true');\
}\
\
themeToggleBtn?.addEventListener('click', () => {\
`    `const isLight = document.body.classList.toggle('light-theme');\
`    `themeToggleBtn.setAttribute('aria-pressed', isLight);\
`    `themeToggleBtn.setAttribute('aria-label', isLight ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro');\
`    `localStorage.setItem('drive-theme', isLight ? 'light' : 'dark');\
});

Actividad B — Formulario con Validación y Retroalimentación sin Recarga

Marcado HTML Semántico

<form class="modal-form-body" id="appointmentForm" novalidate>\
`    `<div class="form-grid-2">\
`        `<div class="input-field">\
`            `<label for="clientName">Nombre y Apellidos \*</label>\
`            `<input type="text" id="clientName" required minlength="3" placeholder="Ej. Fernando González" aria-describedby="nameError">\
`            `<span class="error-msg" id="nameError" role="alert"></span>\
`        `</div>\
`        `<div class="input-field">\
`            `<label for="clientEmail">Correo Electrónico \*</label>\
`            `<input type="email" id="clientEmail" required placeholder="fernando@empresa.com" aria-describedby="emailError">\
`            `<span class="error-msg" id="emailError" role="alert"></span>\
`        `</div>\
`    `</div>\
`    `<div class="input-field">\
`        `<label for="clientPhone">Teléfono de Contacto \*</label>\
`        `<input type="tel" id="clientPhone" required pattern="[0-9+ ]{8,15}" placeholder="+51 987 098 654" aria-describedby="phoneError">\
`        `<span class="error-msg" id="phoneError" role="alert"></span>\
`    `</div>\
`    `<button type="submit" class="btn btn-solid btn-full">Confirmar Solicitud</button>\
</form>

Lógica JavaScript con Constraint Validation API

const form = document.getElementById('appointmentForm');\
const modalConfirmed = document.getElementById('modalConfirmed');\
\
function validateField(field) {\
`    `const errorSpan = document.getElementById(`${field.id.replace('client', '').toLowerCase()}Error`);\
`    `if (!field.checkValidity()) {\
`        `field.classList.add('is-invalid');\
`        `field.setAttribute('aria-invalid', 'true');\
`        `if (errorSpan) errorSpan.textContent = field.validity.valueMissing ? 'Este campo es obligatorio.' : field.validationMessage;\
`        `return false;\
`    `}\
`    `field.classList.remove('is-invalid');\
`    `field.removeAttribute('aria-invalid');\
`    `if (errorSpan) errorSpan.textContent = '';\
`    `return true;\
}\
\
form.querySelectorAll('input[required]').forEach(input => {\
`    `input.addEventListener('input', () => { if (input.classList.contains('is-invalid')) validateField(input); });\
`    `input.addEventListener('blur', () => validateField(input));\
});\
\
form.addEventListener('submit', (e) => {\
`    `e.preventDefault();\
`    `let firstInvalid = null;\
`    `form.querySelectorAll('input[required]').forEach(input => {\
`        `if (!validateField(input) && !firstInvalid) firstInvalid = input;\
`    `});\
\
`    `if (firstInvalid) {\
`        `firstInvalid.focus();\
`        `return;\
`    `}\
\
`    `form.style.display = 'none';\
`    `modalConfirmed.style.display = 'block';\
`    `document.getElementById('closeConfirmedBtn')?.focus();\
});

Actividad C — Modal Animado con Web Animations API (WAAPI)

Lógica JavaScript de Apertura, Cierre y Foco Accesible

const modal = document.getElementById('appointmentModal');\
const dialog = modal?.querySelector('.modal-dialog');\
let triggerElement = null;\
\
function openAppointmentModal() {\
`    `triggerElement = document.activeElement;\
`    `modal.classList.add('active');\
`    `document.body.style.overflow = 'hidden';\
\
`    `dialog.animate([\
`        `{ opacity: 0, transform: 'translateY(24px) scale(0.96)' },\
`        `{ opacity: 1, transform: 'translateY(0) scale(1)' }\
`    `], { duration: 300, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'forwards' })\
.finished.then(() => document.getElementById('clientName')?.focus());\
}\
\
function closeModal() {\
`    `dialog.animate([\
`        `{ opacity: 1, transform: 'translateY(0) scale(1)' },\
`        `{ opacity: 0, transform: 'translateY(16px) scale(0.96)' }\
`    `], { duration: 200, easing: 'ease', fill: 'forwards' })\
.finished.then(() => {\
`        `modal.classList.remove('active');\
`        `document.body.style.overflow = '';\
`        `form.reset();\
`        `form.style.display = 'block';\
`        `modalConfirmed.style.display = 'none';\
`        `triggerElement?.focus();\
`    `});\
}\
\
document.getElementById('modalCloseBtn')?.addEventListener('click', closeModal);\
document.getElementById('closeConfirmedBtn')?.addEventListener('click', closeModal);\
modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });\
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('active')) closeModal(); });

**Actividad D — Tabla de Pruebas y Depuración**

|**N° Prueba**|**Funcionalidad / Entorno**|**Condición Inicial**|**Procedimiento y Entrada**|**Resultado Esperado**|**Resultado Observado**|**Estado**|
| :-: | :-: | :-: | :-: | :-: | :-: | :-: |
|**01**|**RF1 — Selector de Tema**Desktop & Mobile|Modo Oscuro activo (--surface-dark: #090a0d).|Clic en #themeToggleBtn y recarga del navegador.|Clase .light-theme aplicada, variables redefinidas a colores claros y estado conservado en localStorage.|Transición visual inmediata y consistente. Al recargar la página se mantuvo el modo claro sin parpadeos.|**APROBADO**|
|**02**|**RF2 — Formulario: Inválido**Mobile (375px)|Modal abierto con campos requeridos vacíos.|Clic en *"Confirmar Solicitud"* sin ingresar datos.|e.preventDefault() detiene envío. Bordes rojos en campos vacíos, mensajes visibles y foco en #clientName.|Sin recarga de página. Se destacaron los errores en rojo y el cursor se posicionó en el primer campo faltante.|**APROBADO**|
|**03**|**RF2 — Formulario: Válido**Desktop (1440px)|Formulario con datos válidos cargados.|Clic en *"Confirmar Solicitud"*.|Formulario oculto y despliegue inmediato de #modalConfirmed con botón enfocado.|Transición limpia sin parpadeo. Se visualizó el mensaje de éxito y el foco pasó al botón de cierre.|**APROBADO**|
|**04**|**RF3 / RF4 — Modal WAAPI y Teclado**Desktop|Modal cerrado; foco en botón *"Cotizar / Cita"*.|Presionar Enter para abrir y luego Escape.|Apertura animada con WAAPI a 60 fps. Al pulsar Escape, cierre fluido y retorno de foco al botón disparador.|Animación fluida acelerada por GPU. El cierre con teclado funcionó y devolvió el foco exactamente al botón de origen.|**APROBADO**|

**4. PARTE IV — Guion Técnico del Video de Exposición (6 a 8 Minutos)**

GUION TÉCNICO DE EXPOSICIÓN (DURACIÓN TOTAL: 7 MINUTOS EXACTOS)\
\
[00:00 - 00:45] INTEGRANTE 1 — PRESENTACIÓN Y OBJETIVO\
"Saludos. Somos el equipo del proyecto DRIVE, concesionario oficial de superdeportivos y taller técnico. \
Nuestro objetivo hoy es sustentar la evolución del prototipo hacia una aplicación web interactiva, \
accesible y de alto rendimiento, integrando JavaScript nativo sobre una arquitectura semántica y responsiva."\
\
[00:45 - 01:45] INTEGRANTE 2 — DIAGNÓSTICO DEL PROBLEMA\
"Partimos de una maqueta responsiva sólida pero estática. Identificamos tres limitaciones críticas: \
primero, la falta de alternancia visual para entornos luminosos; segundo, la dependencia de recargas \
completas al enviar formularios; y tercero, la necesidad de modales fluidos que respeten el teclado \
y se ejecuten directamente en la GPU sin cargar librerías pesadas."


\
[01:45 - 04:15] INTEGRANTE 3 — ARQUITECTURA Y DECISIONES TÉCNICAS\
"En la arquitectura, el DOM opera como puente en memoria viva donde JavaScript gobierna estados y CSS \
defininiría la presentación. Para el selector de tema descartaremos estilos en línea y optaremos por classList \
con Custom Properties, haciendo mutar decenas de tokens en una sola instrucción. En el formulario adoptaremos la Constraint Validation API, garantizando una retroalimentación inmediata sin recarga mediante preventDefault \
y estados de validez nativos. Por último, se implementará la Web Animations API para el modal, logrando \
animaciones fluidas en el hilo del compositor con control asíncrono de foco mediante promesas."\
\
[04:15 - 06:15] INTEGRANTE 4 (o distribución equitativa) — DEMOSTRACIÓN PRÁCTICA\
"En pantalla observamos la plataforma en funcionamiento:\
1\. Al pulsar el selector de tema, la paleta cambia instantáneamente a modo claro y persiste en localStorage.\
2\. Al intentar enviar el formulario vacío, la página no se recarga: se señalan los campos obligatorios \
`   `y el cursor se traslada al primer error. Al completar datos válidos, transiciona a la confirmación.\
3\. El modal abre con una animación de escala a 60 cuadros por segundo y cierra limpiamente con la tecla \
`   `Escape, devolviendo el foco al botón de apertura. La consola de DevTools certifica cero errores."\
\
[06:15 - 07:15] CIERRE GRUPAL — APORTE Y CONCLUSIÓN POR INTEGRANTE\
• Integrante 1: "Aporté en la gestión de foco WAI-ARIA y la estructura accesible del modal."\
• Integrante 2: "Diseñé los tokens de color y la preservación de ratios de contraste WCAG 2 AA."\
• Integrante 3: "Implementé la Constraint Validation API y el control de errores en cliente."\
• Integrante 4: "Orquesté la Web Animations API y la tabla formal de pruebas experimentales."\
"Gracias por su atención."
