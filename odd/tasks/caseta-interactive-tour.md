# Feature: Tour Interactivo de Caseta y Auto-foco Accesible (Semana 6 React)

## Contexto y Alcance
Adaptación de los requerimientos de la Guía de Trabajo Grupal N.° 4 (Semana 6 React) y Laboratorio N.° 4 al dominio de negocio real de Quadrate pe:
1. Transformar la sección estática `#playas` (`.caseta`) en un **Feature Tour interactivo de Caseta con auto-play rotativo**, componentes funcionales con props, simulación de carga con `setTimeout` y temporizador con `setInterval` / `clearInterval` y controles de pausa/reanudación/reinicio.
2. Implementar foco programático accesible mediante `useRef` al invocar la acción de afiliación de cocheras.
3. Actualizar `README.md` con la matriz de pruebas de aceptación (LAB1 a LAB9) y documentación de ejecución.

## Tareas

- [x] **1. Estilos CSS para el Tour de Caseta (`caseta.css`)**
  - Modificador `.caseta__item--active` con resalte editorial (borde lavanda y fondo translúcido).
  - Barra de progreso/contador sutil y botones de control accesibles (Pausar/Reanudar, Reiniciar).
  - Añadida transición suave para el mockup de teléfono.
  - Archivo mantenido en 191 líneas (< 200 según `AGENTS.md`).

- [x] **2. Componentes React del Tour de Caseta (`src/js/react/`)**
  - `<CasetaFila />` como componente funcional con props (`indice`, `titulo`, `detalle`, `estaActiva`, `alSeleccionar`).
  - `<CasetaTour />` con:
    - `useState` para índice activo, estado `estaReproduciendo`, y tiempo.
    - `useEffect` con `setTimeout` y `clearTimeout` para simulación de sincronización de garitas (800ms).
    - `useEffect` con `setInterval` y `clearInterval` dependiente de `[estaReproduciendo]` (auto-play de 4s).
    - Controles interactivos de Pausar/Reanudar y Reiniciar.
    - Mockup reactivo con transición visual según la fila activa.

- [x] **3. Integración en `index.html`, `useRef` y Pipeline de Compilación**
  - Montado `<CasetaTour />` en `#caseta-tour-root` dentro de `#playas`.
  - Integrado `useRef` en el formulario de afiliación con foco programático accesible al activar el flujo B2B.
  - Actualizado `scripts/compilar-react.cjs` para transpilar los nuevos componentes.
  - Recompilado y verificado con 0 errores de sintaxis y ejecución.

- [x] **4. Verificación técnica (LAB1–LAB9) y Documentación en `README.md`**
  - Verificado en el servidor local (`http://localhost:3000`) y con Chrome DevTools:
    - Auto-play no duplica intervalos al pausar y reanudar.
    - Se limpia correctamente al cambiar de pestaña.
    - Foco programático probado con éxito (`#afiliacion-nombre`).
  - Documentado en `README.md` los comandos de compilación, estructura de componentes y tabla de pruebas de aceptación (LAB1 a LAB9).
