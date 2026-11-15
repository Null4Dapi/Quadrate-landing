# Guía de Laboratorio N°4

### Laboratorio de Experiencias Web Inmersivas – Semana 6
**Proyecto integrador:** Plataforma Web de Experiencias Interactivas  
**Tema:** React Hooks: `useEffect`, dependencias, temporizadores, `useRef` y cleanup

---

## 1. Datos generales

| Aspecto | Descripción |
| --- | --- |
| Modalidad | Trabajo colaborativo por equipos. |
| Prerrequisito | Producto funcional de la Guía de Trabajo Grupal de Desarrollo Web Full Stack – FrontEnd. |
| Tecnologías | React, JavaScript, Node.js/npm, editor, navegador y Git; Vite si corresponde. |
| Propósito | Ampliar el mismo proyecto con comportamiento temporal y reactivo, comprendiendo dependencias y limpieza. |
| Producto | La misma plataforma, ahora con carga simulada, monitor de actividad, búsqueda mejorada y recursos temporales gestionados correctamente. |

## 2. Continuidad con Desarrollo Web

Esta guía no propone comenzar una aplicación nueva ni repetir la construcción de componentes como objetivo final. El equipo recibe el repositorio de la Guía de Trabajo, ejecuta la aplicación, verifica las funciones existentes y la amplía.

| Se recibe de Desarrollo Web | Se completa en el Laboratorio |
| --- | --- |
| App y componentes reutilizables. | Se conservan y se integran nuevas funciones. |
| Props y catálogo con datos locales. | Se reutilizan para estados de carga y resultados. |
| `useState` y eventos: favoritos/filtro. | Se añade estado de carga y monitor activo/detenido. |
| Repositorio, README y commit identificable. | Se crea rama de laboratorio y se registra el commit de origen. |

> **Flujo:** OUTPUT de Desarrollo Web → INPUT del Laboratorio → ampliación → pruebas → entrega integrada.

## 3. Reto práctico

Convertir el catálogo existente en una experiencia que responda al paso del tiempo y a las acciones del usuario. Implementar una carga simulada, un monitor activable/detenible, búsqueda que pueda enfocar el campo y limpieza que evite intervalos duplicados o tareas innecesarias.

En esta etapa, “inmersiva” significa una experiencia más dinámica, con feedback visual y comportamiento consistente. No se requieren APIs externas, WebSockets ni animaciones avanzadas.

## 4. Resultados de aprendizaje

- Configurar `useEffect` con dependencias coherentes.
- Simular una carga con `setTimeout` y cancelarla mediante `clearTimeout`.
- Crear un monitor con `setInterval` y `clearInterval` controlado por estado.
- Explicar cleanup al desmontar y antes de volver a ejecutar un efecto por cambios de dependencias.
- Evitar dependencias incorrectas, intervalos duplicados y limpieza incompleta.
- Usar `useRef` para enfocar el campo de búsqueda sin confundir ref con estado.
- Probar, documentar y justificar el comportamiento temporal.

## 5. Preparación del entorno

1. Clonar o actualizar el repositorio de Desarrollo Web y leer el README.
2. Ejecutar `npm install` si corresponde.
3. Ejecutar el comando de desarrollo definido en `package.json` (por ejemplo, `npm run dev` en Vite).
4. Verificar que catálogo, favoritos y búsqueda/filtro base funcionan.
5. Crear una rama, por ejemplo `immersive-lab`, y registrar el commit inicial.
6. Si un error impide continuar, registrarlo y corregir lo mínimo indispensable; no sustituir el proyecto por uno nuevo.

## 6. Secuencia de trabajo (180 minutos)

| Fase | Tiempo | Actividad y evidencia |
| --- | --- | --- |
| **A. Recepción y diagnóstico** | 15 min | Ejecutar el producto de Semana 5 y registrar estado inicial. |
| **B. Carga simulada** | 25 min | Añadir “Cargando experiencias…” y luego “Experiencias cargadas” con `useEffect` + `setTimeout` + `clearTimeout`. |
| **C. Monitor de actividad** | 35 min | Crear contador por segundo con activar/detener/reiniciar y estado ACTIVO/DETENIDO. |
| **D. Dependencias y cleanup** | 30 min | Probar montaje, cambio de `active`, desmontaje y ausencia de intervalos duplicados. |
| **E. Búsqueda y useRef** | 25 min | Enfocar el input mediante `useRef` y mantener la búsqueda existente. |
| **F. Mejora e integración** | 20 min | Integrar funciones y, si aporta valor, extraer un hook personalizado. |
| **G. Pruebas y entrega** | 30 min | Ejecutar pruebas, guardar evidencias y actualizar README. |

## 7. Actividad 1: Carga simulada con setTimeout

**Objetivo:** Representar una carga y comprobar que el temporizador se cancela si el componente se desmonta antes de terminar. La demora es didáctica; no representa una llamada real a un servidor.

```jsx
import { useEffect, useState } from "react";

function LoadStatus() {
  const [message, setMessage] = useState("Cargando experiencias...");

  useEffect(() => {
    const id = setTimeout(() => {
      setMessage("Experiencias cargadas");
    }, 1500);

    return () => clearTimeout(id);
  }, []);

  return <p role="status">{message}</p>;
}
```

- Integrar `LoadStatus` sin reemplazar el catálogo existente.
- Comprobar que el mensaje cambia tras el tiempo indicado.
- Desmontar el componente antes de que termine el tiempo y explicar `clearTimeout`.
- No crear el temporizador directamente durante el renderizado.

## 8. Actividad 2: Reto creativo — Monitor de actividad

**Objetivo:** Crear un contador que aumente cada segundo, permita activar/detener el intervalo y libere el recurso cuando el efecto deja de estar activo o el componente se desmonta.

```jsx
import { useEffect, useState } from "react";

function ActivityMonitor() {
  const [seconds, setSeconds] = useState(0);
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (!active) return;

    const id = setInterval(() => {
      setSeconds((value) => value + 1);
    }, 1000);

    return () => clearInterval(id);
  }, [active]);

  return (
    <section aria-label="Monitor de actividad">
      <h2>Monitor de actividad</h2>
      <p>Tiempo de actividad: {seconds} s</p>
      <p>Estado: {active ? "ACTIVO" : "DETENIDO"}</p>
      <button onClick={() => setActive((value) => !value)}>
        {active ? "Detener" : "Activar"}
      </button>
      <button onClick={() => setSeconds(0)}>Reiniciar</button>
    </section>
  );
}
```

Personalizar el diseño para que encaje con la plataforma y ubicar el monitor en una sección adecuada. El equipo debe explicar el estado, el efecto, las dependencias y el cleanup; no basta con copiar el código.

## 9. Dependencias y limpieza: Casos que deben probarse

| Caso | Comportamiento correcto | Error que se debe evitar |
| --- | --- | --- |
| **Dependencias `[]`** | Efecto configurado para el montaje; cleanup al desmontar. | Usar `[]` si el efecto depende de un valor reactivo que debe actualizarse. |
| **Dependencias `[active]`** | Al cambiar `active`, se ejecuta cleanup anterior y luego el nuevo efecto. | Omitir `active` y dejar el temporizador activo tras pulsar Detener. |
| **Sin `clearInterval`** | Cleanup cancela el intervalo creado por ese efecto. | Dejar intervalos tras desactivar o desmontar. |
| **Intervalos repetidos** | Solo existe el intervalo del efecto activo. | Crear `setInterval` durante cada renderizado o no cancelar el anterior. |
| **Cleanup incompleto** | Cada recurso iniciado tiene su liberación correspondiente. | Cancelar un timeout y olvidar un intervalo/suscripción adicional. |
| **Actualización de estado** | Usar `setSeconds(value => value + 1)`. | Usar valores capturados que queden desactualizados. |

> **Nota técnica:** Cuando cambian las dependencias, React ejecuta primero la limpieza del efecto anterior y después ejecuta el efecto con los valores actualizados. Al desmontar, ejecuta la limpieza final. En modo estricto de desarrollo pueden observarse ciclos adicionales de configuración/limpieza; el código debe tolerarlos.

## 10. Actividad 3: Búsqueda y useRef

Conservar la búsqueda de Semana 5 o mejorarla. Añadir, si resulta útil, un botón que enfoque el campo de búsqueda.

```jsx
import { useRef } from "react";

function SearchTools() {
  const searchInputRef = useRef(null);

  function focusSearch() {
    searchInputRef.current?.focus();
  }

  return (
    <div>
      <input ref={searchInputRef} type="search" placeholder="Buscar experiencias" />
      <button onClick={focusSearch}>Ir al buscador</button>
    </div>
  );
}
```

- Integrar el ejemplo con el buscador real, evitando dos campos innecesarios.
- Comprobar que el botón coloca el cursor en el campo.
- Explicar que cambiar una ref no provoca por sí mismo un nuevo renderizado; para un valor visible normalmente se utiliza estado.

## 11. Actividad de ampliación: Cleanup al desmontar y cambiar dependencias

Crear un control para mostrar/ocultar el monitor o cambiar una opción que afecte al efecto. Observar cuándo se inicia y se limpia el intervalo. El objetivo es demostrar que cleanup ocurre al desmontar y antes de repetir el efecto por cambio de dependencia.

```jsx
useEffect(() => {
  if (!active) return;

  const id = setInterval(() => {
    setSeconds((value) => value + 1);
  }, 1000);

  console.log("Intervalo iniciado");

  return () => {
    clearInterval(id);
    console.log("Intervalo limpiado");
  };
}, [active]);
```

- **Criterio de logro:** Al pulsar Detener, el contador deja de aumentar; al volver a Activar, retoma sin acelerarse.
- Al ocultar/desmontar el componente, no queda un intervalo ejecutándose.

## 12. Pruebas de aceptación

| ID | Prueba | Resultado esperado |
| --- | --- | --- |
| LAB1 | Arranque | El proyecto recibido inicia y mantiene las funciones de Semana 5. |
| LAB2 | Carga simulada | El mensaje cambia y `clearTimeout` se aplica correctamente. |
| LAB3 | Monitor activo | El contador aumenta aproximadamente una vez por segundo. |
| LAB4 | Detener/reactivar | Deja de aumentar y vuelve a hacerlo sin intervalos duplicados. |
| LAB5 | Reiniciar | El contador vuelve a cero y sigue el comportamiento esperado. |
| LAB6 | Desmontaje | Cleanup cancela el temporizador. |
| LAB7 | Dependencias | El equipo explica por qué `active` está en las dependencias. |
| LAB8 | useRef | El campo recibe foco, si se implementó. |
| LAB9 | Consola | No hay errores relevantes y las trazas coinciden con las acciones. |

## 13. Entregables del laboratorio

- Código integrado sobre la aplicación recibida, conservando sus funciones.
- Carga simulada con `useEffect`, `setTimeout` y `clearTimeout`.
- Monitor con `useState`, `useEffect`, `setInterval`, `clearInterval` y controles activar/detener/reiniciar.
- Evidencia de que el contador no se acelera y se detiene correctamente.
- Búsqueda mejorada y uso justificado de `useRef` integrado al campo real.
- Hook personalizado solo si aporta reutilización clara y puede explicarse.
- README actualizado con ejecución, cambios, pruebas y limitaciones.
- Enlace al repositorio, rama de laboratorio y commit base de Desarrollo Web.
- Video explicativo del trabajo realizado.

## 14. Preguntas de reflexión y verificación

1. ¿Qué significa el arreglo de dependencias de `useEffect`?
2. ¿Qué sucede cuando cambia `active` en el monitor?
3. ¿Por qué se debe ejecutar `clearInterval` antes de iniciar un nuevo intervalo?
4. ¿Cuál es la diferencia entre `clearTimeout` y `clearInterval`?
5. ¿Qué defecto podría aparecer si se crean intervalos duplicados?
6. ¿Por qué cleanup es necesario al desmontar y al cambiar dependencias?
7. ¿Cuándo conviene `useRef` y cuándo `useState`?
8. ¿Qué funcionalidad de Semana 5 se conservó y qué comportamiento nuevo se agregó?

## 15. Cierre: Una aplicación que evoluciona

El equipo entrega una sola aplicación React integrada. Desarrollo Web aporta estructura, componentes, props y las interacciones base; el Laboratorio añade carga simulada, monitor controlable, búsqueda mejorada y gestión responsable del ciclo de vida. La calidad se demuestra por el funcionamiento y por la capacidad de explicar por qué funciona.
