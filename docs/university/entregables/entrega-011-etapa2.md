# GUÍA DE LABORATORIO

### _Laboratorio de Experiencias Web Inmersivas — Implementación de TanStack Query y Zustand con Sincronización en Tiempo Real_

Semana 11 | Proyecto integrador: Plataforma Web de Experiencias Interactivas — Quadrate pe

Producto articulador: Arquitectura React desacoplada en dos niveles para la consola interactiva de Quadrate Live: gestión del estado de servidor mediante TanStack Query (catálogo paginado de cocheras, ciclo de vida asíncrono, loading, error y caché) y gestión del estado global de cliente mediante Zustand (tema visual, preferencias del conductor y centro de notificaciones), sincronizados en tiempo real mediante eventos WebSocket locales en desarrollo y Cloud Run en producción.

---

## 1. Datos generales

| Elemento | Descripción |
| :--- | :--- |
| **Semana** | 11 |
| **Tema** | Implementación de TanStack Query y Zustand con WebSockets desacoplados por entorno |
| **Duración sugerida** | 3 horas |
| **Modalidad** | Laboratorio práctico sobre el proyecto integrador |
| **Requisitos previos** | Planificación arquitectónica y contratos de tipos aprobados en la Etapa 1 |
| **Entregable** | Módulos vendorizados de TanStack Query y Zustand, store `app-store.js`, query `use-cocheras-query.js`, componentes React puros y matriz de pruebas |
| **Equipo de desarrollo** | Grupo 04 · Sección 301 · Ciclo V |
| **Integrantes** | Pando Alanzo, Diego Iglesia (202310012)<br>Tapullima Herrera, Luciana del pilar (202310045)<br>Mendo Ruiz, Manuel (202310078)<br>Cueva Fabian, Eduardo (202310091)<br>Vilchez, José (202310103) |
| **Docente del laboratorio** | Ing. Roberto Sánchez Solís |

---

## 2. Propósito del laboratorio y resultado de aprendizaje

El propósito de esta sesión práctica es materializar la arquitectura diseñada en la Etapa 1 en la consola interactiva **Quadrate Live** (`demo.html`), erradicando definitivamente el manejo manual de estados de red con `useEffect` + `useState` e implementando un flujo desacoplado entre **Server State** (TanStack Query) y **Client State** (Zustand).

Al concluir la práctica, como equipo logramos:
1. Integrar **TanStack Query** de forma nativa en el navegador mediante módulos ES6, encapsulando el catálogo de cocheras con paginación numérica, estados de carga (`isLoading` con skeleton loaders), estados de error con reintento (`refetch`) y retención de datos en segundo plano (`keepPreviousData`).
2. Implementar un store atómico y global con **Zustand** (`useAppStore`), gobernando el tema visual (diurno/nocturno con persistencia en `localStorage`), las preferencias de visualización (cuadrícula/lista) y la cola de alertas flotantes (toasts).
3. Establecer un canal **WebSocket desacoplado por entorno**: en desarrollo local, el cliente conecta al servidor Node.js propio (`ws://localhost:3000/ws-telemetria`), sin realizar ninguna llamada a Google Cloud Run. En producción, conecta a Cloud Run.
4. Sincronizar reactivamente ambas capas: cada evento entrante por WebSocket inyecta un Toast en Zustand e invalida automáticamente la caché de TanStack Query (`queryClient.invalidateQueries(["cocheras"])`), refrescando la disponibilidad de las cocheras sin recargar la página.

---

## 3. Articulación técnica con Desarrollo Web (Contrato de Verdad)

Siguiendo el principio de **Single Source of Truth** y los contratos aprobados en la Etapa 1:
- El catálogo de cocheras respeta estrictamente la interfaz `Cochera` y devuelve metadatos paginados bajo el contrato `RespuestaCatalogoPaginado`.
- El store de Zustand implementa con exactitud los métodos definidos en `AppStoreState` (`alternarTema`, `establecerDistritoPreferido`, `alternarModoVista`, `agregarNotificacion`, `descartarNotificacion`).
- La capa de presentación consume ambos canales mediante selectores atómicos de Zustand y hooks de TanStack Query, garantizando que el catálogo no se re-renderice cuando llega una notificación ni cuando se conmuta el tema.

---

## 4. Arquitectura técnica del sistema implementado

```
[ Garita / Servidor WebSocket Local :3000 ]
                     │
         (Evento RFC 6455 en vivo)
                     │
                     ▼
         [ quadrate-live-app.jsx ]
         ├── 1. useAppStore.getState().agregarNotificacion() ──> [ ToastContainer ]
         └── 2. queryClient.invalidateQueries(["cocheras"])  ──> [ TanStack Query Cache ]
                                                                       │
                                                               (Refetch en background)
                                                                       │
                                                                       ▼
                                                             [ CatalogoCocheras ]
```

---

## 5. Implementación de módulos y componentes

### 5.1. Micro-librerías vendorizadas (`src/js/react/vendor/`)
- `src/js/react/vendor/zustand.js`: Implementación de 47 líneas basada en `React.useSyncExternalStore` (React 18.3.1), con soporte de selectores atómicos y métodos `getState`, `setState` y `subscribe`.
- `src/js/react/vendor/tanstack-query.js`: Implementación de 152 líneas que emula el `QueryClient` oficial con serialización de `queryKey`, deduplicación de promesas concurrentes mediante `inFlight Map`, caché en memoria con `staleTime`, `keepPreviousData` y hook `useQuery`.

### 5.2. Store Global Zustand (`src/js/react/store/app-store.js`)
Centraliza el estado del cliente:
- `tema`: Conmuta entre `"claro"` y `"oscuro"`, persistiendo la preferencia en `localStorage.getItem("quadrate_tema")`.
- `distritoPreferido`: Filtro activo seleccionado por el usuario.
- `modoVista`: Conmuta la presentación del catálogo entre `"cuadricula"` y `"lista"`.
- `notificaciones`: Cola de hasta 5 alertas efímeras con auto-cierre programado a los 5 segundos (`setTimeout`).

### 5.3. Query de Catálogo Remoto (`src/js/react/queries/use-cocheras-query.js`)
Provee el hook `useCocherasQuery({ distrito, pagina, limitePorPagina })`:
- `queryKey: ["cocheras", { distrito, pagina, limitePorPagina }]`.
- `queryFn: () => obtenerCocherasRemotas(...)` con latencia asíncrona de 250 ms.
- `staleTime: 60000` (1 minuto de caché) y `keepPreviousData: true`.

### 5.4. Componentes React puros
- `BarraPreferencias.jsx`: Toolbar accesible con chips de distrito y botones para alternar tema y modo de visualización.
- `CatalogoCocheras.jsx`: Componente de presentación que maneja `isLoading` (esqueletos animados con gradiente CSS shimmer), `isError` (tarjeta de fallo con botón de reintento) y la paginación accesible ("Anterior", "Página X de Y", "Siguiente").
- `ToastContainer.jsx`: Región flotante con `role="status"` y `aria-live="polite"` que renderiza las alertas de aforo en tiempo real.

---

## 6. Matriz de verificación técnica (Pruebas LAB1 a LAB8)

| ID | Prueba Funcional | Procedimiento de Validación | Resultado Observado | Estado |
| :--- | :--- | :--- | :--- | :--- |
| **LAB1** | Conexión WebSocket Local | Iniciar `http://localhost:3000/demo.html` y abrir panel Network. | WebSocket conecta a `ws://localhost:3000/ws-telemetria`. Cero llamadas a `*.run.app`. | Conforme |
| **LAB2** | Carga inicial del catálogo | Cargar la página y observar el catálogo de cocheras. | `isLoading` en `true` muestra skeletons; tras 250 ms aparecen las 3 primeras cocheras. | Conforme |
| **LAB3** | Paginación numérica | Pulsar el botón "Siguiente →" en la barra de paginación. | Muestra la página 2 con las siguientes 3 cocheras. Indicador cambia a "Página 2 de 2". | Conforme |
| **LAB4** | Caché en segundo plano | Pulsar "← Anterior" para regresar a la página 1. | La página 1 carga instantáneamente desde la caché de TanStack Query sin parpadeo. | Conforme |
| **LAB5** | Filtrado por distrito | Seleccionar la píldora "San Isidro" en la barra de preferencias. | QueryKey cambia a `["cocheras", { distrito: "San Isidro", pagina: 1 }]`, mostrando 2 cocheras. | Conforme |
| **LAB6** | Conmutación de tema con Zustand | Pulsar el botón "Modo Nocturno" en la barra superior. | Atributo `data-tema="oscuro"` inyectado al contenedor; variables CSS aplicadas sin recarga. | Conforme |
| **LAB7** | Alerta en tiempo real (Toast) | Esperar la emisión de evento o pulsar "Simular Evento Garita". | Alerta flotante aparece abajo a la derecha con badge distrital y se descarta sola a los 5s. | Conforme |
| **LAB8** | Invalidación reactiva de aforo | Llegada de evento de garita por WebSocket. | `queryClient.invalidateQueries(["cocheras"])` actualiza plazas libres en pantalla. | Conforme |

---

## 7. Preguntas orientadoras del laboratorio

### Pregunta 1: ¿Por qué es crucial desacoplar el WebSocket en local respecto a Cloud Run?
*Respuesta del equipo:*
Por tres razones técnicas innegociables:
1. **Autonomía en desarrollo:** Garantiza que el equipo pueda trabajar y realizar demostraciones en clase sin conexión a Internet externa ni caídas por latencia de red.
2. **Políticas de origen (CORS / RFC 6455):** Cloud Run rechaza conexiones de orígenes no autorizados (`http://localhost:3000`). Forzar su uso local exigiría exponer el entorno de desarrollo en las variables de producción.
3. **Optimización de costos:** Evita consumir innecesariamente el presupuesto de horas de CPU y solicitudes de Cloud Run durante ciclos de prueba repetitivos.

### Pregunta 2: ¿Cómo previene TanStack Query las condiciones de carrera (*race conditions*)?
*Respuesta del equipo:*
TanStack Query gestiona internamente la concurrencia asíncrona mediante la clave de consulta (`queryKey`). Si el usuario cambia rápidamente de "San Isidro" a "Miraflores", cada consulta genera una promesa independiente registrada en el `inFlight Map`. Si una respuesta desactualizada llega después de la consulta más reciente, TanStack Query descarta la respuesta obsoleta basándose en la marca de tiempo de la clave activa, asegurando que la interfaz siempre muestre los datos correspondientes al último filtro seleccionado.

### Pregunta 3: ¿Cómo mejora Zustand el rendimiento frente a Context API en esta consola?
*Respuesta del equipo:*
En Context API, cualquier actualización en el valor provisto fuerza el re-renderizado de todos los componentes que consumen el contexto mediante `useContext`, incluso si solo les interesa una propiedad secundaria. Zustand, en cambio, utiliza **selectores atómicos** (`useAppStore(state => state.tema)`): el componente se suscribe únicamente al resultado de esa función selector. Cuando llega una notificación y muta el array `notificaciones`, el componente `CatalogoCocheras` o el selector de tema ni siquiera se enteran, manteniendo cero re-renderizados innecesarios en el árbol de React.

---

## 8. Criterios de aceptación y conclusión de la entrega

Todos los criterios de calidad han sido verificados satisfactoriamente:
- Las librerías autoalojadas cumplen con la política de cero dependencias externas de [AGENTS.md](file:///C:/Startup/quadrate-publisher/AGENTS.md).
- Ningún archivo de código supera el límite estricto de 400 líneas.
- La consola interactiva en [demo.html](file:///C:/Startup/quadrate-publisher/demo.html) opera de forma 100% autónoma en local.
- Con esta entrega se da por concluida la Semana 11 de forma exitosa.
