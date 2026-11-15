# Guía de Trabajo Grupal N°4

### Desarrollo Web Full Stack Frontend · Semana 6 React

---

## 1. Propósito de la actividad

Los equipos continuarán trabajando sobre el mismo proyecto desarrollado en las sesiones anteriores. La finalidad es evolucionar la aplicación incorporando los conceptos de React estudiados en la sesión: JSX, componentes funcionales, props, estado interno con `useState`, eventos, composición de componentes, `useEffect`, asincronía y funciones de limpieza.

## 2. Resultados de aprendizaje

- Implementar componentes React mediante componentes funcionales con props y gestión de estado interno con `useState`, con creatividad.
- Gestionar efectos secundarios mediante `useEffect` para la simulación de carga de datos y actualización asincrónica, incorporando funciones de limpieza.
- Integrar los nuevos componentes dentro del proyecto existente, evitando construir una aplicación independiente.

## 3. Situación problemática

La aplicación desarrollada en las sesiones anteriores ya cuenta con una estructura inicial. El reto del equipo consiste en transformar esa interfaz en una aplicación React más dinámica. Para ello, deberán identificar partes de la interfaz que puedan convertirse en componentes reutilizables y agregar comportamientos que permitan demostrar el uso de props, estado y efectos.

## 4. Producto grupal

Al finalizar la actividad, el equipo deberá entregar una versión funcional del proyecto existente que incluya, como mínimo:

- Un componente funcional reutilizable.
- Un componente `Saludo` o equivalente que reciba información mediante props.
- Un componente interactivo que utilice `useState`.
- Al menos un evento de usuario, por ejemplo `onClick`.
- Composición de varios componentes.
- Un efecto con `useEffect` que simule una carga de datos mediante `setTimeout`.
- Un contador automático mediante `setInterval`.
- La función de limpieza correspondiente: `clearTimeout` y/o `clearInterval`.
- Una presentación visual coherente con el proyecto original.

## 5. Organización de los equipos

| Rol | Responsabilidad | Evidencia |
| --- | --- | --- |
| Coordinador/a | Organiza tareas, controla tiempos y verifica la integración. | Registro de tareas. |
| Desarrollador/a React | Implementa componentes, props y `useState`. | Código funcional. |
| Desarrollador/a Hooks | Implementa `useEffect`, asincronía y cleanup. | Código y demostración. |
| Integrador/a | Integra las funcionalidades en el proyecto existente. | Aplicación ejecutable. |
| Documentador/a | Registra decisiones, dificultades y evidencias. | Informe breve / capturas. |

## 6. Actividad 1 – Revisar el proyecto existente

Antes de modificar el código, el equipo deberá analizar el proyecto desarrollado previamente.

1. Ejecutar la aplicación y comprobar que funciona.
2. Identificar las páginas, secciones o componentes existentes.
3. Determinar qué elementos pueden convertirse en componentes React.
4. Identificar una funcionalidad que necesite estado.
5. Identificar una funcionalidad que pueda utilizar un efecto secundario.

> **Pregunta orientadora:** ¿Qué parte del proyecto necesita convertirse en una interfaz realmente interactiva?

## 7. Actividad 2 – Crear componentes y utilizar props

El equipo deberá seleccionar una parte real del proyecto y convertirla en un componente funcional.

- Crear un componente funcional con una responsabilidad clara.
- Recibir al menos un dato mediante props.
- Utilizar ese dato dentro del JSX.
- Reutilizar el componente con diferentes valores.

### Ejemplo orientativo:

```jsx
function Saludo({ nombre }) {
  return <h2>Hola, {nombre}</h2>;
}
```

## 8. Actividad 3 – Incorporar estado con useState

Seleccionar una funcionalidad de la aplicación que requiera recordar información que cambia.

- Implementar `useState`.
- Crear una acción del usuario que modifique el estado.
- Actualizar la interfaz a partir del nuevo estado.
- Evitar modificar directamente la variable de estado.

*Ejemplos posibles:* contador de favoritos, cantidad seleccionada, mostrar/ocultar información, contador de interacciones o selector.

## 9. Actividad 4 – Eventos y composición

- Implementar al menos un evento, como `onClick`.
- Separar la interfaz en componentes con responsabilidades claras.
- Combinar los componentes para construir una sección de la aplicación.
- Explicar qué componente es padre y cuáles son hijos.

> **Reto:** El equipo debe justificar por qué decidió separar la interfaz de esa manera.

## 10. Actividad 5 – useEffect y simulación de carga

Implementar una simulación de carga de datos utilizando `setTimeout` dentro de `useEffect`.

- Inicialmente mostrar un mensaje como `'Cargando...'`.
- Después de un tiempo determinado mostrar `'Datos cargados'`.
- Implementar cleanup con `clearTimeout`.
- Explicar qué problema evita la limpieza.

```jsx
useEffect(() => {
  const id = setTimeout(() => {
    setMensaje("Datos cargados");
  }, 2000);

  return () => clearTimeout(id);
}, []);
```

## 11. Actividad 6 – Contador automático con useEffect

Implementar un componente que actualice automáticamente su valor cada segundo.

- Utilizar `useState` para conservar el valor.
- Utilizar `setInterval` dentro de `useEffect`.
- Actualizar el estado cada segundo.
- Utilizar `clearInterval` en la función cleanup.
- Comprobar que el intervalo se detiene correctamente cuando el componente deja de utilizarse.

```jsx
useEffect(() => {
  const id = setInterval(() => {
    setSegundos((s) => s + 1);
  }, 1000);

  return () => clearInterval(id);
}, []);
```

## 12. Actividad 7 – Integración y reto creativo

Integrar todas las funcionalidades en el proyecto existente.

- El componente con props debe formar parte real de la aplicación.
- El estado debe tener utilidad dentro del proyecto.
- El efecto de carga debe representar una situación coherente con la aplicación.
- El contador automático debe tener una finalidad definida.
- La interfaz debe mantener consistencia visual.
- Agregar una mejora creativa propuesta por el equipo.

*Ejemplos de mejora creativa:* indicador de actividad, mensaje dinámico, contador de favoritos, estado activo/inactivo o una pequeña experiencia de interacción.

## 13. Flujo de trabajo recomendado

1. Recuperar y ejecutar el proyecto anterior.
2. Analizar la estructura actual.
3. Seleccionar una sección para convertirla/mejorarla con React.
4. Crear componentes funcionales.
5. Agregar props.
6. Agregar `useState` y eventos.
7. Agregar `useEffect` con `setTimeout`.
8. Agregar `setInterval` y cleanup.
9. Integrar, probar y corregir.
10. Preparar la demostración del equipo.

## 14. Evidencias que debe presentar el equipo

- Captura de la aplicación funcionando.
- Captura o fragmento del componente con props.
- Evidencia de `useState` y del evento.
- Evidencia de `useEffect` con la carga simulada.
- Evidencia del contador automático.
- Evidencia del cleanup.
- Breve explicación de la mejora creativa implementada.

## 15. Preguntas de reflexión

1. ¿Por qué convertir una interfaz en componentes en lugar de mantener todo el código en un único componente?
2. ¿Cuál es la diferencia entre una prop y un estado?
3. ¿Qué sucede cuando cambia un estado?
4. ¿Por qué un `setInterval` requiere cleanup?
5. ¿Qué problema podría producir un temporizador que continúa ejecutándose después de desmontar un componente?
6. ¿Qué parte de la solución demuestra creatividad o innovación?

## 16. Entregable final

El equipo presentará el proyecto actualizado funcionando y realizará una demostración breve. Durante la demostración deberá mostrar el componente con props, el estado con `useState`, los eventos, el efecto de carga, el contador automático y la función de limpieza. Cada integrante deberá poder explicar la parte que desarrolló.

## 17. Conexión con las siguientes sesiones

El trabajo realizado servirá como base para continuar evolucionando el proyecto. Los componentes, el estado y los efectos implementados en esta actividad deberán mantenerse dentro de la misma aplicación y podrán posteriormente integrarse con datos reales, APIs y funcionalidades más avanzadas.
