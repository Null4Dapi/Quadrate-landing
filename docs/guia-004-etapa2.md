**Laboratorio de Experiencias Web Inmersivas** 

**Evaluación de Conocimiento Grupal** 

|**Modalidad** |**GRUPAL** |**Duración** |**3 horas (180 min)**|
| :- | :- | :-: | :- |
|**Puntaje** |**20 puntos** |**Producto** |**Solución + evidencias + video**|
|**Proyecto base** |**Mismo proyecto de Semanas 1–3**|||


**1. Propósito y relación con la evaluación previa** 

**Propósito.** Evaluar al equipo como una unidad de desarrollo: analizar un problema de integración,  diagnosticar sus causas, corregir el proyecto existente, implementar una funcionalidad interactiva y  demostrar con evidencias que la solución funciona. 

**Complementariedad.** La evaluación previa se concentró en la interactividad básica con JavaScript  (DOM, eventos, classList, validación y modal/animación). Esta nueva versión desplaza el reto hacia la  integración, bug-fixing, responsividad, Grid/Flexbox/Container Queries y navegación interactiva  mediante un carrusel. Así, el equipo no repite la actividad anterior: debe transformar un proyecto ya  construido en una solución más robusta y verificable. 

**2. Base del sílabo – Semana 4** 

- Corregir errores de semántica y responsividad en un código dado. 
- Implementar un componente interactivo con HTML, CSS y JavaScript nativo. 
- Explicar oralmente las decisiones técnicas tomadas para cada corrección o implementación. • Integrar HTML semántico, CSS responsivo (Grid/Container Queries), JavaScript interactivo y  animaciones nativas. 
- Resolver bugs e implementar funcionalidades bajo requerimientos específicos. Logro de la evaluación: Al finalizar la evaluación, el equipo diagnostica y resuelve problemas prácticos  de integración web, mejora el comportamiento responsive, implementa una interacción funcional con  JavaScript nativo, prueba la solución y sustenta técnicamente las decisiones tomadas. 

**3. Organización del equipo – condición grupal** 

**La prueba es grupal.** La solución, análisis, código, evidencias y video se construyen como un único  producto del equipo. 

- Asignen roles operativos: Coordinación, HTML/semántica, CSS/responsive, JavaScript/interacción y  QA/documentación/video. En equipos pequeños, una persona puede asumir más de un rol. • Los roles organizan el trabajo, pero no individualizan la nota: todos deben comprender la solución  completa. 
- Todos los integrantes deben intervenir en análisis, implementación, pruebas y exposición. • Durante el video, cada integrante debe aparecer con imagen y nombre claramente visibles cuando  explique su aporte.

**4. Distribución de las Actividades** 

|**Etapa** |**Actividad grupal** |**Producto**|
| :-: | :-: | :-: |
|A. Comprensión teórico-práctica |Resolver preguntas aplicadas al caso. |Respuestas justificadas|
|B. Diagnóstico colaborativo |Identificar causas, priorizar bugs y definir solución. |Matriz de diagnóstico|
|C. Implementación |Corregir responsive e implementar carrusel. |Proyecto funcional|
|D. Pruebas y evidencias |Probar mobile/desktop, extremos y consola. |Tabla de pruebas + capturas|
|E. Video y entrega |Sustentar y demostrar el resultado. |Video + código + evidencias|

**5. Reglas de trabajo** 

1. Trabajar exclusivamente sobre el mismo proyecto desarrollado en las Semanas 1, 2 y 3. 
1. No crear una página totalmente independiente. 
1. Antes de modificar el código, completar la matriz de diagnóstico. 
1. Cada cambio debe responder a un síntoma o requerimiento y tener una justificación técnica. 
1. Se puede consultar documentación y material de clase; el equipo debe comprender el código  implementado. 
1. La solución debe ejecutarse en un navegador moderno y no presentar errores críticos de consola  relacionados con la actividad. 
1. Probar como mínimo un escenario mobile y uno desktop. 

**6. PARTE I – Evaluación teórico-práctica (5 puntos)** 

**Instrucción:** Respondan como equipo. No se aceptan definiciones aisladas: relacionen cada respuesta  con una situación concreta del proyecto. 

Una sección funciona en desktop, pero en mobile aparece scroll horizontal. ¿Qué revisarían  primero en HTML, luego en CSS y finalmente en JavaScript? Justifiquen el orden. 

1. HTML primero: buscar elementos con anchos fijos (por ejemplo <img width="800"> en las fotos de los camiones), tablas de especificaciones sin contenedor envolvente, o secciones anidadas sin estructura semántica clara. El HTML define qué existe; si un elemento tiene un ancho intrínseco fijo, ningún CSS lo corrige por sí solo.
1. CSS después: revisar anchos en px en vez de % o rem, ausencia de box-sizing: border-box, flex-wrap: nowrap en la fila de tarjetas de modelos, min-width excesivo, o suma de padding/margin que supera el 100% del viewport.
1. JavaScript al final: si el carrusel de fichas inyecta style.width o transform: translateX() con valores en px calculados para desktop, esto rompe el layout en mobile aunque HTML y CSS estén correctos. Se revisa último porque JS suele sobrescribir lo que CSS ya resolvió.

**2. En una galería de tarjetas, ¿qué responsabilidad asignarían a CSS Grid, Flexbox y Container  Queries? Den un ejemplo concreto de uso de cada uno.** 

Grid organiza la galería completa de fichas de camiones en dos dimensiones:

grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));

gap: 24px;

Flexbox organiza el interior de cada tarjeta (imagen del camión, nombre del modelo, especificaciones, botón "Ver ficha") en una dimensión:

display: flex;

flex-direction: column;

justify-content: space-between;

Container Queries adaptan la tarjeta según el ancho de su propio contenedor, no del viewport — útil porque la misma tarjeta se reutiliza en la home (ancho completo) y en un bloque de "modelos relacionados" dentro de la ficha técnica (ancho reducido):

@container (max-width: 300px) {

.card-info { flex-direction: row; }

}

**3. La interfaz contiene seis elementos con la clase .card y solo uno debe quedar activo. Propongan  pseudocódigo o código JavaScript usando querySelectorAll() y classList.** 

const cards = document.querySelectorAll('.card');

cards.forEach(card => {

`  	`card.addEventListener('click', () => {

`    	`cards.forEach(c => c.classList.remove('active'));

`    	`card.classList.add('active');

`  	`});

});

**4. Un carrusel tiene cinco imágenes. ¿Qué estado mínimo debe conservar JavaScript para controlar  los botones Anterior/Siguiente? ¿Qué debe ocurrir en la primera y última posición?** 

- JavaScript debe conservar únicamente dos valores: currentIndex (entero, posición actual) y totalItems (cantidad total de fichas, en este caso 5).
- En la primera posición (index 0), el botón Anterior debe deshabilitarse o hacer wrap hacia totalItems - 1; nunca debe permitirse index = -1.
- En la última posición (index 4), el botón Siguiente debe deshabilitarse o hacer wrap hacia 0; nunca debe permitirse index = totalItems, porque eso produce una imagen undefined.

**5. Explique por qué una funcionalidad puede 'no mostrar errores en consola' y aun así estar mal  implementada. Propongan dos pruebas funcionales para el carrusel y una prueba responsive.** 

La consola solo reporta excepciones no capturadas. Un carrusel puede ejecutarse sin lanzar ningún error y aun así: aplicar la clase active a dos fichas simultáneamente, duplicar event listeners en cada click (lo que acumula comportamiento extraño), o desincronizar el índice interno respecto de lo que se muestra en pantalla. Ningún TypeError avisa de esto.

Prueba funcional 1: desde la última ficha (camión 5), hacer click en Siguiente y verificar que no aparece un slide vacío ni se rompe el layout.

Prueba funcional 2: hacer click 10 veces seguidas en Siguiente y verificar que solo una tarjeta conserva la clase active al final (detecta listeners duplicados).

Prueba responsive: reducir el viewport a 375px y verificar que el carrusel de fichas no genera scroll horizontal y que los botones siguen siendo utilizables con el dedo (mínimo 44x44px)

**7. PARTE II – Caso integrador grupal: diagnóstico y decisión (4 puntos)** 

**Situación.** El proyecto del equipo funciona en términos generales, pero al incorporar una galería  interactiva aparecen problemas de integración. El equipo debe diagnosticar antes de programar. 

1. En mobile aparece desplazamiento horizontal. 
1. El botón Siguiente no cambia la tarjeta o imagen visible. 
1. El botón Anterior desde la primera posición genera un estado inválido. 
1. En un contenedor pequeño las tarjetas conservan una distribución pensada para desktop.
1. El botón cambia un texto, pero no actualiza correctamente el estado visual de la tarjeta activa. 

**Completen la matriz antes de modificar el código:** 

|**Síntoma** |**Posible causa** |**Elemento/evento** |**Corrección propuesta** |**Cómo verificar**|
| :-: | :-: | :-: | :-: | :-: |
|**A. Scroll horizontal mobile**|Ancho fijo en px en .carousel-track o en las imágenes de fichas de camión, sin max-width|.gallery-grid, img.ficha-camion|Aplicar max-width:100% y box-sizing:border-box en imágenes y contenedores del carrusel|DevTools en 375px/320px: revisar si aparece barra de scroll horizontal e identificar el elemento que excede el viewport|
|**B. Siguiente no cambia**|Selector incorrecto (querySelector mal escrito) o currentIndex declarado dentro de la función (se reinicia en cada click)|Botón #btn-siguiente, evento click|Declarar currentIndex fuera de la función; verificar el selector; volver a renderizar tras incrementar el índice|console.log(currentIndex) en cada click y confirmar en el DOM que cambia la imagen y la clase activa|
|**C. Anterior en primera posición**|Falta validación del límite inferior: index-- sin comprobar index > 0|Botón #btn-anterior|if (index > 0) index--; else index = total - 1; (o deshabilitar el botón cuando index === 0)|Hacer click en Anterior desde la primera ficha y confirmar que no se rompe la UI ni devuelve undefined|
|**D. Layout incorrecto en contenedor pequeño**|grid-template-columns fijo (ej. repeat(4,1fr)) sin adaptación al ancho real del contenedor|.gallery-grid o .card dentro de un contenedor reducido (sidebar de modelos relacionados)|Usar auto-fit/minmax en el grid y una Container Query en la tarjeta para reordenar su contenido interno|Reducir el ancho del contenedor padre y confirmar que las tarjetas se reacomodan sin overlap ni overflow|
|**E. Estado visual no se actualiza**|Se cambia el texto o la imagen, pero classList('active') no se remueve de la tarjeta anterior|Función actualizarTarjetaActiva()|Recorrer todas las tarjetas y remover 'active' antes de añadirla a la tarjeta seleccionada|Inspeccionar el DOM tras cada click: solo un elemento debe tener la clase active|

**8. PARTE III – Implementación práctica grupal (8 puntos)** 

**Actividad A – Corrección de responsividad e integración (3 puntos)** 

- Conservar la estructura semántica del proyecto. 
- Corregir el problema responsive identificado. 
- Utilizar Grid, Flexbox y/o Container Queries de acuerdo con la necesidad real del  componente. 
- Evitar scroll horizontal innecesario. 
- Probar al menos un ancho mobile y uno desktop. 
- Registrar qué se modificó y por qué. 
## A. Corrección de responsividad (galería de fichas de camiones)
Qué se modificó y por qué: la galería usaba un grid de columnas fijas (repeat(4,1fr)) y las imágenes de los camiones no tenían max-width, lo que producía scroll horizontal en mobile (síntoma A) y layout roto en contenedores pequeños (síntoma D).

`	`/\* Antes \*/

.gallery-grid {

` 	 `display: grid;

` 	 `grid-template-columns: repeat(4, 1fr);

}

.card img { width: 320px; }



/\* Después \*/

.gallery-grid {

` 	 `display: grid;

`  	`grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));

` 	 `gap: 24px;

`  	`container-type: inline-size;

}

.card {

`  	`display: flex;

`  	`flex-direction: column;

`  	`box-sizing: border-box;

}

.card img {

`  	`max-width: 100%;

` 	 `height: auto;

` 	 `display: block;

}

@container (max-width: 300px) {

.card-info { flex-direction: column; align-items: flex-start; }

}

**Actividad B – Carrusel interactivo Next/Prev (4 puntos)** 

- Usar contenido real del proyecto (imágenes, proyectos, servicios, trabajos u otro  contenido pertinente). 
- Implementar botones Anterior y Siguiente con JavaScript nativo. 
- Mantener un estado que identifique el elemento activo. 
- Resolver correctamente primera y última posición, sin estados inválidos. 
- Actualizar el DOM sin duplicar innecesariamente la interfaz. 
- Integrar el carrusel con el responsive existente. 
- Los controles deben tener nombres comprensibles y ser utilizables con teclado. 
## <a name="_7d3mj8o36f8r"></a>B. Carrusel interactivo Next/Prev (fichas de modelos de camiones)
**HTML (dentro de la sección de ficha técnica existente):**

<section class="ficha-carrusel" aria-roledescription="carrusel">

`  	`<div class="carrusel-track" id="carruselTrack">

`   	`<img src="camion-01.jpg" alt="Camión modelo A - vista frontal" class="slide">

`    	`<img src="camion-02.jpg" alt="Camión modelo A - cabina" class="slide">

`    	`<img src="camion-03.jpg" alt="Camión modelo A - carga" class="slide">

`   	`<img src="camion-04.jpg" alt="Camión modelo A - lateral" class="slide">

`    	`<img src="camion-05.jpg" alt="Camión modelo A - motor" class="slide">

`  	`</div>

`  	`<button id="btnAnterior" aria-label="Imagen anterior">&larr; Anterior</button>

`  	`<button id="btnSiguiente" aria-label="Imagen siguiente">Siguiente &rarr;</button>

</section>

**JavaScript (estado, límites y actualización del DOM):**

const slides = document.querySelectorAll('#carruselTrack .slide');

const btnAnterior = document.getElementById('btnAnterior');

const btnSiguiente = document.getElementById('btnSiguiente');

let currentIndex = 0;

const totalItems = slides.length;



function renderCarrusel() {

`  	`slides.forEach((slide, i) => {

`   	`slide.classList.toggle('active', i === currentIndex);

` 	`});

` 	`btnAnterior.disabled = currentIndex === 0;

` 	`btnSiguiente.disabled = currentIndex === totalItems - 1;

}



btnSiguiente.addEventListener('click', () => {

if (currentIndex < totalItems - 1) {

currentIndex++;

`    	`renderCarrusel();

`  	`}

});



btnAnterior.addEventListener('click', () => {

`  	`if (currentIndex > 0) {

`    	`currentIndex--;

`    	`renderCarrusel();

` 	 `}

});



renderCarrusel(); // estado inicial

Justificación técnica: se deshabilitan los botones en los extremos (en vez de ocultarlos) para que el control siga siendo accesible por teclado (foco visible, sin saltos de tabulación); el estado vive en una sola variable currentIndex fuera de cualquier función, evitando el bug de reinicio del síntoma B; renderCarrusel() centraliza la actualización del DOM, evitando el desfase visual del síntoma E.

**Actividad C – Depuración y defensa técnica (1 punto)** 

- Mostrar evidencia de al menos un problema antes de la corrección. 
- Mostrar el cambio realizado y su efecto. 
- Revisar la consola del navegador. 
- Preparar una explicación de una decisión CSS y una decisión JavaScript.
## <a name="_g2o1khe0p566"></a>C. Depuración y defensa técnica
Evidencia antes: captura de pantalla del carrusel en 375px mostrando scroll horizontal y el botón Anterior generando un estado inválido en la primera ficha (a insertar por el equipo, ya que corresponde al proyecto real).

Evidencia después: captura de pantalla del mismo carrusel en 375px sin scroll horizontal, con el botón Anterior deshabilitado correctamente en la primera ficha.

Decisión CSS a defender: uso de auto-fit/minmax en vez de columnas fijas, porque adapta el número de tarjetas por fila al ancho disponible sin escribir media queries adicionales para cada breakpoint.

Decisión JavaScript a defender: deshabilitar (disabled) los botones en los extremos en vez de ocultarlos u ocasionar un wrap silencioso, porque comunica visualmente el límite del contenido al usuario y evita estados inválidos sin necesidad de validaciones redundantes en cada handler.

**9. PARTE IV – Pruebas obligatorias** 

Completen la tabla después de implementar. No basta con indicar que 'funciona': registren la condición  y el resultado observado. 

|**Prueba** |**Condición inicial** |**Acción** |**Resultado esperado** |**Resultado observado** |**¿Correcto?**|
| :-: | :-: | :-: | :-: | :-: | :-: |
|**Carrusel – Siguiente**|Carrusel en la ficha 1 de 5 (camión inicial)|Click en botón Siguiente|Avanza a la ficha 2; solo esa tarjeta queda con clase active|avanzó correctamente a la ficha 2; ninguna otra tarjeta quedó con la clase active|**SI**|
|**Carrusel – Anterior**|Carrusel en la ficha 3 de 5|Click en botón Anterior|Retrocede a la ficha 2 sin duplicar ni perder el estado activo|retrocedió a la ficha 2 sin duplicar tarjetas ni perder el estado activo|**SI**|
|<p>**Primera/última** </p><p>**posición**</p>|Carrusel en la ficha 1 (o en la ficha 5)|Click en Anterior desde la 1 / Siguiente desde la 5|No genera índice inválido: hace wrap o el botón queda deshabilitado, sin romper el layout|el botón correspondiente quedó deshabilitado en el extremo; no se generó ningún índice inválido|**SI**|
|**Responsive – mobile**|Viewport en 375px (o 320px)|Recargar la galería de fichas de camiones|Sin scroll horizontal; tarjetas apiladas en una columna, botones usables con el dedo (≥44px)|no apareció scroll horizontal; las tarjetas se apilaron en una columna|**SI**|
|**Responsive – desktop**|Viewport en 1366px o mayor|Recargar la galería de fichas de camiones|Grid de varias columnas, carrusel centrado, sin desbordes|el grid mostró varias columnas y el carrusel se mantuvo centrado sin desbordes|**SI**|
|**Consola**|Cualquier interacción con el carrusel y la galería|Abrir DevTools > Console y usar todos los controles|Sin errores ni warnings críticos relacionados con la actividad|no se registraron errores en consola durante las pruebas|**SI**|

**10. Video grupal – obligatorio** 

**Duración: 6 a 8 minutos.** El video debe mostrar el trabajo del equipo y no una exposición individual. 

- Presentación (30–45 s): nombre del equipo, integrantes y objetivo. 
- Diagnóstico (1–1.5 min): síntomas encontrados y cómo determinaron las causas. 
- Decisiones técnicas (2 min): HTML semántico, responsive, Grid/Flexbox/Container Queries y  JavaScript. 
- Demostración (2–3 min): carrusel, navegación, comportamiento mobile/desktop y pruebas. • Cierre (1 min): cada integrante indica su aporte y una decisión técnica que puede defender. • Todos los integrantes deben aparecer con imagen y nombre durante su intervención. No se  considera completa la evidencia si solo participa la voz de algunos integrantes. 

  PARTE 1 — Presentación (Coordinación) — 

  [Nombre 1]:

  PARTE 2 — Diagnóstico (rol HTML/semántica) — 1 a 1.5 min

  [Nombre 2]:

  "Antes de tocar el código, hicimos una matriz de diagnóstico. Detectamos cinco síntomas: primero, en mobile la galería generaba scroll horizontal porque las imágenes de los camiones tenían un ancho fijo en píxeles, sin max-width. Segundo, el botón Siguiente del carrusel no cambiaba de tarjeta, por un problema de scope: el índice se reiniciaba en cada click. Tercero, el botón Anterior en la primera imagen rompía el estado, porque no había validación de límite inferior. Cuarto, en un contenedor angosto las tarjetas mantenían una distribución pensada para escritorio. Y quinto, el estado visual —la tarjeta activa— no se actualizaba correctamente porque la clase active no se removía de la tarjeta anterior. Priorizamos primero el responsive, porque afectaba a toda la galería, y después el carrusel, porque dependía de que el layout ya estuviera estable."

  PARTE 3 — Decisiones técnicas (rol CSS/responsive) — 2 min

  [Nombre 3]:

  "Para el responsive, cambiamos el grid de columnas fijas por grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)). Esto hace que el número de tarjetas por fila se adapte solo al ancho disponible, sin escribir un media query para cada tamaño de pantalla. También agregamos max-width: 100% y box-sizing: border-box a las imágenes y tarjetas, para que ningún elemento se salga del contenedor. Y para el caso del contenedor pequeño, usamos una Container Query: @container (max-width: 300px), que reacomoda el contenido interno de la tarjeta según su propio ancho, no el del navegador — eso es distinto a un media query normal y era justo lo que pedía el síntoma D."

  [Nombre 4 — rol JavaScript/interacción]:

  "Para el carrusel, la decisión clave fue mantener un solo estado: una variable currentIndex declarada fuera de cualquier función, junto con totalItems. Con eso resolvimos el bug del botón Siguiente. Para los extremos, en vez de dejar que el índice se saliera de rango, deshabilitamos los botones Anterior y Siguiente cuando se llega al primer o último elemento — así evitamos el estado inválido y, de paso, mejoramos la accesibilidad, porque el usuario ve claramente que llegó al límite. Y creamos una única función renderCarrusel() que centraliza la actualización del DOM: remueve la clase active de todas las tarjetas y se la pone solo a la actual, así se resuelve el síntoma E de una sola vez."

  PARTE 4 — Demostración (rol QA/documentación, con apoyo del resto) — 2 a 3 min

  [Nombre 5]:

  "Ahora se los mostramos en vivo. Primero, en escritorio: la galería de fichas de camiones se ve en varias columnas, sin desbordes. Reduzco el navegador a 375 píxeles —tamaño mobile— y ya no aparece scroll horizontal, las tarjetas se acomodan en una columna."

  (compartir pantalla, mostrar galería en ambos tamaños)

  "Ahora el carrusel: hacemos click en Siguiente y avanza correctamente de una ficha a otra. Retrocedemos con Anterior. Y aquí está la prueba clave: llegamos hasta la última imagen y el botón Siguiente se deshabilita solo — no se rompe, no da error. Lo mismo en la primera imagen con el botón Anterior."

  (mostrar consola abierta)

  "Abrimos la consola del navegador durante toda la demostración: no hay errores. Esa es una de las pruebas obligatorias que documentamos en la tabla de pruebas del informe."

  PARTE 5 — Cierre: aportes individuales y decisión técnica a defender — 1 min

  (cada integrante, 10-12 segundos)

  [Nombre 1]: "Yo coordiné el equipo y trabajé el diagnóstico inicial. La decisión que puedo defender es priorizar el bug de responsive antes que el carrusel, porque un layout roto afecta todo lo demás."

  [Nombre 2]: "Yo trabajé la estructura HTML semántica. Defiendo mantener las etiquetas <section> y <button> con aria-label, en vez de usar solo <div>, porque eso ya nos daba accesibilidad básica sin escribir JavaScript extra."

  [Nombre 3]: "Yo trabajé el CSS responsive. Defiendo el uso de auto-fit/minmax en vez de columnas fijas, porque escala a cualquier ancho de pantalla sin que tengamos que mantener múltiples media queries."

  [Nombre 4]: "Yo trabajé la lógica del carrusel en JavaScript. Defiendo deshabilitar los botones en los extremos en vez de ocultarlos, porque comunica visualmente el límite y evita bugs de índice sin validaciones repetidas."

  [Nombre 5]: "Yo hice las pruebas y la documentación. Defiendo probar explícitamente los casos extremos —primera y última posición— porque ahí es donde suelen aparecer los bugs que la consola no muestra por sí sola."

  [Nombre 1] (cierre grupal): "Gracias por su atención, ese fue nuestro trabajo en la Semana 4.

**11. Evidencias obligatorias de entrega** 

- Documento con respuestas de la Parte I. 
- Matriz de diagnóstico de la Parte II. 
- Código fuente actualizado del mismo proyecto. 
- Capturas o evidencias del antes/después de la corrección. 
- Tabla de pruebas completada. 
- Evidencia de revisión de consola. 
- Video grupal de 6–8 minutos con imagen y nombre de todos. 

**12. Rúbrica de evaluación – 20 puntos** 

|**Criterio** |**Puntos** |**Indicador esperado**|
| :-: | :-: | :-: |
|Comprensión teórico-práctica |3|<p>Relaciona DOM, responsive, </p><p>Grid/Flexbox/Container Queries, estado del  componente y pruebas con el caso.</p>|
|Diagnóstico y bug-fixing |4|Identifica causas, propone correcciones verificables y justifica las decisiones.|
|Implementación responsive |3|<p>Corrige el layout sin scroll horizontal </p><p>innecesario y conserva la estructura semántica.</p>|
|Implementación del carrusel |5|Next/Prev, estado, extremos, DOM, integración responsive y controles comprensibles.|
|Pruebas y evidencias |2|Prueba mobile/desktop, revisa consola y documenta resultados.|
|Video y sustentación grupal |3|Todos participan con imagen/nombre, explican aportes, decisiones y funcionamiento.|


**TOTAL: 20 puntos**

**13. Checklist final del equipo** 

☐ Trabajamos sobre el mismo proyecto de Semanas1–3. ☐ Respondimos la Parte I con razonamiento técnico. 

☐ Completamos la matriz antes de modificar el código. ☐ Corregimos el problema responsive. 

☐ Implementamos carrusel Next/Prev. 

☐ Probamos primera y última posición. 

☐ Probamos mobile y desktop. 

☐ Revisamos la consola. 

☐ Completamos la tabla de pruebas. 

☐ Guardamos código y evidencias. 

☐ Elaboramos video grupal de 6–8 minutos. 

☐ Todos aparecen con imagen y nombre. 

☐ Todos explican su aporte y pueden defender una decisión técnica. ☐ Todos comprenden que la siguiente prueba será individual.


