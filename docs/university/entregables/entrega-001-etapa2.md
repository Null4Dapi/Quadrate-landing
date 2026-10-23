# Guía de Laboratorio N.° 1

## Experiencias Web Inmersivas · Semana 1

### Etapa 2: implementar, ejecutar, validar y corregir

**Fecha:** Sábado, 5 de septiembre del 2026

| Campo | Detalle |
| :--- | :--- |
| Modalidad | Laboratorio grupal |
| Duración sugerida | 3 horas |
| Entrada obligatoria | Especificación del prototipo |
| Tecnologías | HTML5 + CSS3 |
| Producto | Prototipo ejecutable y validado |
| Herramientas | VS Code + navegador + validadores |

---

## 1. Propósito

Convertir en código las decisiones tomadas en la guía de trabajo grupal. En esta etapa, el equipo construirá el prototipo con HTML5 y CSS3, lo ejecutará en el navegador, validará su estructura y realizará una revisión inicial de accesibilidad.

> Importante: no deben volver a diseñar el prototipo desde cero. La especificación del trabajo grupal es la entrada de esta práctica.

---

## 2. Flujo de trabajo

Trabajo grupal → Especificación → Implementación → Ejecución → Validación → Corrección → Evidencias

Si durante la implementación descubren que una decisión del trabajo grupal no funciona, pueden modificarla, pero deben registrar qué cambiaron y por qué.

---

## 3. Herramientas de software

| Herramienta | Uso en el laboratorio | Evidencia |
| :--- | :--- | :--- |
| Visual Studio Code | Crear y editar archivos HTML/CSS | Captura del proyecto |
| Chrome o Edge | Ejecutar e inspeccionar | Captura de la página |
| Validador HTML de W3C | Comprobar el marcado | Resultado y correcciones |
| axe DevTools | Revisar accesibilidad | Hallazgos y correcciones |

---

## 4. Actividad 0: recuperar la especificación del equipo

Antes de escribir código, abran la especificación del primer prototipo elaborada en la guía de trabajo grupal.

- Identifiquen las cinco regiones definidas.
- Revisen las etiquetas semánticas propuestas.
- Revisen el contenido de las tres experiencias.
- Revisen las decisiones de accesibilidad.
- Revisen las tres decisiones técnicas que deben demostrar.

**Resultado:** el equipo debe comenzar la implementación a partir de un diseño previamente acordado.

---

## 5. Actividad 1: crear la estructura del proyecto

**Tiempo sugerido:** 15 minutos.

```text
plataforma-experiencias/
├── index.html
├── css/
│   └── styles.css
└── img/
```

Crear los archivos y vincular correctamente la hoja de estilos.

---

## 6. Actividad 2: implementar la estructura semántica

**Tiempo sugerido:** 35 minutos.

Trasladen la estructura definida en la guía grupal al archivo `index.html`. Utilicen las etiquetas que el equipo justificó.

```html
<header>...</header>
<nav>...</nav>
<main>
  <section>
    <article>...</article>
    <article>...</article>
    <article>...</article>
  </section>
</main>
<footer>...</footer>
```

No copien una plantilla sin analizarla: comparen cada etiqueta con la decisión registrada por el equipo.

---

## 7. Actividad 3: implementar las tres experiencias

**Tiempo sugerido:** 25 minutos.

Utilicen exactamente el contenido acordado en la especificación: título, descripción, imagen/recurso y acción.

**Comprobación del equipo:** ¿las tres experiencias corresponden realmente a lo que se definió en la guía grupal?

---

## 8. Actividad 4: aplicar CSS

**Tiempo sugerido:** 40 minutos.

Apliquen mediante `styles.css` la propuesta visual definida por el equipo. Como mínimo:

- Tipografía y tamaños.
- Colores de texto y fondo.
- Margin y padding.
- Bordes y/o bordes redondeados.
- Distribución de las experiencias.
- Estilos diferenciados para navegación, títulos y tarjetas.

Pueden utilizar variables CSS para centralizar valores visuales.

```css
:root {
  --primary-color: #2f6fab;
  --text-color: #222;
  --background-color: #f5f7fa;
}
```

---

## 9. Actividad 5: ejecutar e inspeccionar

**Tiempo sugerido:** 15 minutos.

1. Abrir `index.html` en el navegador.
2. Verificar que CSS se aplica.
3. Usar DevTools → Inspect para identificar elementos.
4. Modificar temporalmente una propiedad CSS y observar el resultado.
5. Comparar la implementación con el boceto del trabajo grupal.

Regístren al menos una diferencia entre el diseño previsto y el resultado implementado, si existe.

### Respuesta

Se realizó el cotejo visual frente a los wireframes preliminares, adaptando la propuesta para mejorar la UX/UI:

- **Diferencia 1:** En el boceto preliminar se contempló una barra de parámetros flotante en cada tarjeta de auto y camión (potencia, aceleración, peso). Al implementarlo y probarlo en pantalla, se evidenció una sobrecarga visual. Se decidió suprimir dicha barra para priorizar un diseño limpio tipo catálogo con fotografías y llamada a la acción directa.
- **Diferencia 2:** El prototipo original incluía tres botones de acción dentro del slider principal: “Solicitar Asignación”, “Ver Autos” y “Ver Camiones”. En la inspección se determinó que competían visualmente con el vehículo y saturaban el primer pantallazo. Se eliminaron dichos botones, dejando un banner limpio con flechas laterales minimalistas.
- **Diferencia 3:** El boceto original consideraba una sección de “Sedes”. Esta fue reemplazada por un componente modal interactivo accesible, lo que agiliza el contacto inmediato y evita enlaces rotos hacia páginas que no aportan a la experiencia del usuario.

---

## 10. Actividad 6: validar y corregir HTML

**Tiempo sugerido:** 20 minutos.

Ejecuten la validación HTML. Registren los problemas y corrijan el código.

| Problema | Causa | Corrección | Resultado |
| :--- | :--- | :--- | :--- |
| Los botones para cambiar las imágenes del slider no tenían un nombre claro. | Los botones solo mostraban un ícono sin indicar qué función cumplían. | Se agregaron nombres como “Vehículo anterior” y “Vehículo siguiente”. | Los botones ahora son más fáciles de identificar y usar, incluso con lectores de pantalla. |
| Los campos del formulario no tenían etiquetas. | Solo se utilizaba el texto de ejemplo dentro de cada campo. | Se agregaron etiquetas para identificar cada campo, como nombre, correo, teléfono y vehículo. | El formulario quedó más claro y fácil de utilizar. |
| Había un problema en el orden de los títulos de la página. | Algunos títulos pasaban de un nivel a otro sin seguir un orden correcto. | Se ordenaron los títulos para mantener una estructura más organizada. | La página ahora tiene mejor organización y es más fácil de entender. |
| Algunos enlaces no funcionaban correctamente. | Algunos enlaces no tenían un destino válido o no llevaban a la sección correspondiente. | Se corrigieron los enlaces y se agregaron destinos correctos para las diferentes secciones de la página. | La navegación funciona correctamente y permite desplazarse fácilmente por la página. |

---

## 11. Actividad 7: auditar accesibilidad

**Tiempo sugerido:** 25 minutos.

Ejecuten axe DevTools. Revisen los hallazgos y relacionen cada uno con las decisiones de accesibilidad planteadas en la guía de trabajo grupal.

| Hallazgo | Impacto | Corrección | Verificación |
| :--- | :--- | :--- | :--- |
| Algunos textos se veían muy oscuros sobre el fondo oscuro. | Serio | Se cambiaron los colores de los textos para que fueran más claros y fáciles de leer. | Los textos ahora tienen mejor visibilidad y se pueden leer con mayor facilidad. |
| El botón del menú para celulares no tenía una descripción para lectores de pantalla. | Crítico | Se agregó un nombre al botón para indicar que sirve para abrir el menú. | El botón ahora puede ser identificado correctamente por los lectores de pantalla. |
| Algunas imágenes podían no tener una descripción adecuada. | Serio | Se revisaron las imágenes y se agregaron descripciones relacionadas con cada vehículo. | Las imágenes ahora tienen descripciones claras y adecuadas. |
| El formulario emergente podía presentar problemas al usar solamente el teclado. | Crítico | Se agregó la posibilidad de cerrar la ventana utilizando la tecla `Escape` y se mejoró la navegación con el teclado. | El usuario puede navegar y cerrar la ventana correctamente sin necesidad de utilizar el mouse. |

---

## 12. Actividad 8: comparar decisión vs. implementación

Este paso evita que el laboratorio sea solamente “hacer código”. Revisen las tres decisiones técnicas tomadas en el trabajo grupal.

| Decisión original | ¿Se implementó? | Evidencia | ¿Fue necesario modificarla? ¿Por qué? |
| :--- | :--- | :--- | :--- |
| 1. Catálogo de vehículos organizado en 3 columnas. | Sí | Se organizaron los vehículos en 3 columnas usando CSS Grid. | Se agregó adaptación para tablets y celulares, donde las columnas se reducen para que el contenido se vea correctamente. |
| 2. Uso de etiquetas HTML5 para organizar mejor la página. | Sí | Se utilizaron etiquetas como `<header>`, `<nav>`, `<section>`, `<article>` y `<footer>`. | No fue necesario hacer cambios, porque la estructura ya estaba bien organizada y permite encontrar fácilmente cada parte de la página. |
| 3. Uso de una ventana para solicitar información o agendar una cita. | Sí | Se creó una ventana que aparece cuando el usuario quiere solicitar información sobre un vehículo. | En lugar de enviar al usuario a otra página, se decidió mostrar el formulario directamente en la misma página. Esto hace que el proceso sea más rápido y sencillo para el usuario. |

---

## 13. Reto de laboratorio: “Haz que funcione y demuestra por qué”

El equipo debe presentar el prototipo funcionando y demostrar una cadena completa: una decisión tomada en la guía grupal, su implementación en HTML/CSS, la evidencia en el navegador y, cuando corresponda, su validación o corrección.

Decidimos usar la etiqueta semántica `<article>` para cada vehículo y camión porque cada uno de ellos constituye una unidad de contenido independiente, autónoma y reutilizable, con sentido por sí misma. Para garantizar una alineación visual sin saltos tipográficos entre modelos, implementamos en CSS `display: flex; flex-direction: column; height: 100%;` en la tarjeta, asignando `margin-top: auto;` al contenedor de acciones.

**Evidencia:** al inspeccionar el DOM en el navegador, todas las tarjetas de la cuadrícula de 3 columnas comparten la misma altura y sus botones de solicitud quedan rigurosamente alineados en la misma línea horizontal.

---

## 14. Entregables del laboratorio

- Carpeta completa del proyecto.
- `index.html`.
- `css/styles.css`.
- Tres o más experiencias implementadas.
- Captura del prototipo ejecutándose.
- Evidencia de validación HTML y correcciones.
- Evidencia de auditoría de accesibilidad y correcciones.
- Tabla decisión → implementación → evidencia.
- Prototipo final de la sesión.

> (Adjuntado en la sección de anexos)

---

## 15. Lista de verificación

| Criterio | Sí | Parcial | No | Justificación |
| :--- | :---: | :---: | :---: | :--- |
| La implementación corresponde a la especificación grupal. | ✔️ | ☐ | ☐ | Se implementaron todas las secciones solicitadas y se realizaron algunos cambios para mejorar el diseño y facilitar su uso. |
| Se aplicó maquetación responsive con CSS Grid y Flexbox. | ✔️ | ☐ | ☐ | Los autos y camiones están organizados en 3 columnas y los servicios en 4 columnas. El diseño también se adapta a tablets y celulares. |
| Tres o más experiencias implementadas. | ✔️ | ☐ | ☐ | El código está ordenado, utiliza una estructura correcta y no presenta enlaces rotos ni elementos antiguos. |
| El código HTML cumple con el estándar de validación W3C. | ✔️ | ☐ | ☐ | Se mejoraron los colores para que los textos sean fáciles de leer y se agregó soporte para navegar correctamente con el teclado. |
| Se realizaron pruebas y correcciones de accesibilidad (axe DevTools). | ✔️ | ☐ | ☐ | Se mejoraron los colores para que el texto sea fácil de leer y se pueda navegar correctamente usando el teclado. |
| Se implementó diseño modular mediante CSS custom properties. | ✔️ | ☐ | ☐ | Los colores, tipos de letra y otros estilos principales se organizaron para que sea más fácil modificar el diseño. |
| La navegación y los componentes interactivos funcionan fluidamente. | ✔️ | ☐ | ☐ | Se agregó un slider principal con cambios automáticos y manuales, además de una ventana para solicitar una cotización mediante un formulario. |
| La trazabilidad técnica (decisión vs. implementación) está documentada. | ✔️ | ☐ | ☐ | Se elaboraron tablas comparativas para explicar de manera clara las decisiones tomadas durante el desarrollo de la página. |

---

## 16. Reflexión final

Responda las siguientes preguntas:

- ¿Qué decisión del trabajo grupal pude implementar con mayor facilidad?
- ¿Qué decisión tuve que modificar durante el laboratorio y por qué?
- ¿Qué problema detecté mediante una herramienta de validación?
- ¿Qué aprendí al convertir una especificación en código?

**Respuesta:**

____________________________________________________________________
____________________________________________________________________
____________________________________________________________________
____________________________________________________________________

---

## Anexos

A continuación se incorporan las evidencias gráficas:

- Evidencia gráfica 1
- Evidencia gráfica 2
- Evidencia gráfica 3
- Evidencia gráfica 4
- Evidencia gráfica 5

![][image1]

![][image2]

![][image3]

![][image4]

![][image5]
