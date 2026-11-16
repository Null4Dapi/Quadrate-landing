# Guía de Trabajo

#### _Desarrollo Web Full Stack Frontend — Gestión de Estado Remoto con TanStack Query y Estado Global Atómico con Zustand_

Semana 11 | Proyecto integrador: Plataforma Web de Experiencias Interactivas — Quadrate pe

Producto articulador: Arquitectura desacoplada en dos niveles para la consola interactiva de Quadrate Live: gestión del estado de servidor mediante TanStack Query (catálogo paginado de cocheras, ciclo de vida asíncrono, loading, error y caché) y gestión del estado global de cliente mediante Zustand (tema visual, preferencias del conductor y centro de notificaciones), sincronizados en tiempo real mediante eventos WebSocket locales en desarrollo y Cloud Run en producción.

---

## 1. Datos generales

| Elemento | Descripción |
| :--- | :--- |
| **Semana** | 11 |
| **Tema** | Separación de Server State vs Client State: TanStack Query (React Query) y Zustand integrados con WebSockets |
| **Modalidad** | Trabajo práctico en equipo de ingeniería |
| **Duración sugerida** | 3 horas |
| **Requisitos previos** | Context API y servidor WebSocket propio implementados en la Semana 10 |
| **Entregable** | Documento oficial de planificación de arquitectura, contratos de interfaces TypeScript, modelo de Store y matriz de calidad |
| **Equipo de desarrollo** | Grupo 04 · Sección 301 · Ciclo V |
| **Integrantes** | Pando Alanzo, Diego Iglesia (202310012)<br>Tapullima Herrera, Luciana del pilar (202310045)<br>Mendo Ruiz, Manuel (202310078)<br>Cueva Fabian, Eduardo (202310091)<br>Vilchez, José (202310103) |
| **Docente principal** | Mag. Ing. Juan Carlos Ramos |

---

## 2. Situación problemática

En la versión desarrollada durante la Semana 10, la consola interactiva de **Quadrate pe** (`Quadrate Live` en `demo.html`) implementó un servidor de WebSockets propio y una estructura de distribución basada en `Context API` (`NotificationContext` y `ThemeContext`). No obstante, al avanzar hacia una experiencia integral de búsqueda y reserva de plazas en Lima Metropolitana, identificamos dos cuellos de botella estructurales:

1. **Confusión entre Server State y Client State:** Los datos del catálogo de cocheras (tarifas por hora, aforo dinámico, coordenadas y disponibilidad por distrito) continuaban manejándose como si fueran estado local síncrono mediante `useState` y arrays estáticos. Esto obligaba a programar temporizadores manuales (`setTimeout`) para simular cargas, careciendo de mecanismos de revalidación en segundo plano (*stale-while-revalidate*), deduplicación de consultas concurrentes, manejo estructurado de estados de error con reintento y paginación limpia.
2. **Sobrecarga de Providers y re-renderizados en Context API:** Para preferencias transversales (como el distrito favorito del usuario y la alternancia de tema diurno/nocturno), envolver el árbol con múltiples `<Provider>` genera una jerarquía anidada ("Provider Hell") y re-renderiza componentes hijos innecesariamente cuando cambian propiedades no consumidas por ellos.
3. **Acoplamiento de red en entornos de desarrollo vs producción:** Intentar conectar el WebSocket del cliente directamente al endpoint de Google Cloud Run durante pruebas locales generaba fallos de origen (`Origin 1008`) y dependía de una conexión a Internet externa, impidiendo el trabajo autónomo en caliente exigido en las sesiones de clase.

Como equipo de desarrollo, requerimos rediseñar la arquitectura bajo el principio de **separación estricta de responsabilidades**:
- **TanStack Query** para gobernar el estado asíncrono del servidor (catálogo, paginación, caché y estados de red).
- **Zustand** para gestionar el estado atómico del cliente (tema, preferencias de usuario y cola de notificaciones).
- **WebSocket desacoplado por entorno:** Conexión local a nuestro servidor de telemetría sin depender de Cloud Run en desarrollo, reservando la conexión a la nube exclusivamente para el despliegue productivo.
- **React UI:** Componentes funcionales puros que consumen ambos canales de datos de forma declarativa y accesible.

---

## 3. Resultado de aprendizaje

Al culminar esta etapa de planificación, como equipo estructuramos la separación formal entre Server State y Client State para la plataforma Quadrate pe, definimos las interfaces tipadas del catálogo y del store global, modelamos la estrategia de invalidación de caché ante eventos de red bidireccionales y garantizamos que el entorno de desarrollo local opere de manera 100% aislada de Cloud Run, fundamentando cada decisión técnica desde las buenas prácticas de la industria y el protocolo de confinamiento de vistas de `AGENTS.md`.

---

## 4. Matriz de separación de responsabilidades

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                             REACT UI (demo.html)                                 │
│  ┌─────────────────────────┐  ┌───────────────────────┐  ┌────────────────────┐  │
│  │    CatalogoCocheras     │  │   BarraPreferencias   │  │   CentroNotifica   │  │
│  │ (Paginación + Loading)  │  │ (Tema + Filtro Rápido)│  │ (Toasts en Tiempo) │  │
│  └────────────┬────────────┘  └───────────┬───────────┘  └─────────┬──────────┘  │
└───────────────┼───────────────────────────┼────────────────────────┼─────────────┘
                │                           │                        │
       (useQuery / Server)                  │ (useStore / Client)    │ (useStore / Client)
                ▼                           ▼                        ▼
┌───────────────────────────────┐   ┌──────────────────────────────────────────────┐
│        TANSTACK QUERY         │   │                   ZUSTAND                    │
│   [ Estado de Servidor ]      │   │             [ Estado de Cliente ]            │
│ ───────────────────────────── │   │ ──────────────────────────────────────────── │
│ • Datos remotos del catálogo  │   │ • Tema visual: "claro" | "oscuro"            │
│ • Estados: isLoading, isError │   │ • Preferencias: distrito y vista lista/grid  │
│ • Caché y deduplicación       │   │ • Cola de notificaciones activas             │
│ • Paginación por bloques (4)  │   │ • Acciones: cambiarTema, agregarToast...     │
└───────────────▲───────────────┘   └──────────────────────▲───────────────────────┘
                │ (Invalidación automática)                │ (Inyección directa)
                └───────────────────────────┬──────────────┘
                                            │
                             ┌──────────────┴──────────────┐
                             │       CANAL WEBSOCKET       │
                             │ ─────────────────────────── │
                             │ • Local: ws://localhost:... │
                             │ • Prod:  wss://...run.app   │
                             └─────────────────────────────┘
```

| Capa / Tecnología | Responsabilidad Principal | Datos que Gobierna | Ciclo de Vida y Persistencia |
| :--- | :--- | :--- | :--- |
| **TanStack Query** | Manejo de datos remotos de servidor (*Server State*). | Catálogo de cocheras, plazas libres, estado de aforo, metadatos de paginación (`paginaActual`, `totalPaginas`, `totalRegistros`). | Asíncrono. Gestiona automáticamente `isLoading`, `isError`, reintentos en fallo y expiración de caché (`staleTime: 60000`). |
| **Zustand** | Estado global atómico del cliente (*Client State*). | Tema de visualización (`temaVisual`), preferencias del usuario (`distritoFavorito`, `modoVisualizacion`) y cola de alertas flotantes (`notificaciones`). | Síncrono en memoria RAM del navegador, con persistencia opcional en `localStorage`. Modificación mediante selectores atómicos. |
| **WebSocket** | Transporte bidireccional en tiempo real. | Eventos de garita en Lima Metropolitana: check-in vehicular, liberación de plaza, aforo crítico y actualización tarifaria. | Persistente. En **local** apunta al servidor Node.js propio; en **producción**, a Google Cloud Run. |
| **React UI** | Renderizado declarativo y accesibilidad. | Interfaz del catálogo con skeleton loaders, controles de paginación, conmutador de tema y centro de alertas toast accesibles. | Reactivo. Consume `useCocherasQuery()` para el catálogo y `useAppStore()` para preferencias y notificaciones. |

---

## 5. Modelo de datos y contratos de tipos (TypeScript)

### 5.1. Contrato del catálogo y respuesta paginada (`Cochera` y `RespuestaCatalogoPaginado`)
```typescript
export interface Cochera {
  readonly id: number;
  readonly nombre: string;
  readonly distrito: "San Isidro" | "Miraflores" | "Surco" | "San Borja";
  readonly direccion: string;
  readonly tarifaHora: number;
  readonly plazasTotales: number;
  readonly plazasLibres: number;
  readonly porcentajeOcupacion: number;
  readonly estadoAforo: "disponible" | "fluido" | "reservado" | "promocion" | "critico";
  readonly imagen: string;
  readonly permiteReservaEta: boolean;
}

export interface FiltrosCatalogo {
  readonly distrito: string;
  readonly pagina: number;
  readonly limitePorPagina: number;
}

export interface RespuestaCatalogoPaginado {
  readonly datos: readonly Cochera[];
  readonly totalRegistros: number;
  readonly paginaActual: number;
  readonly totalPaginas: number;
  readonly tieneSiguiente: boolean;
  readonly tieneAnterior: boolean;
}
```

### 5.2. Contrato del Store global con Zustand (`AppStoreState`)
```typescript
export type TemaVisual = "claro" | "oscuro";
export type ModoVista = "cuadricula" | "lista";

export interface ToastNotificacion {
  readonly id: string;
  readonly tipo: "ingreso" | "salida" | "reserva_eta" | "tarifa_dinamica" | "aforo_critico";
  readonly titulo: string;
  readonly mensaje: string;
  readonly distrito: string;
  readonly timestamp: string;
  readonly tiempoExpiracionMs?: number;
}

export interface AppStoreState {
  // Estado de Tema y Preferencias
  readonly tema: TemaVisual;
  readonly distritoPreferido: string;
  readonly modoVista: ModoVista;
  
  // Estado de Notificaciones
  readonly notificaciones: readonly ToastNotificacion[];
  
  // Acciones (Actions)
  readonly alternarTema: () => void;
  readonly establecerDistritoPreferido: (distrito: string) => void;
  readonly alternarModoVista: () => void;
  readonly agregarNotificacion: (notificacion: Omit<ToastNotificacion, "id" | "timestamp">) => void;
  readonly descartarNotificacion: (id: string) => void;
  readonly limpiarNotificaciones: () => void;
}
```

### 5.3. Contrato de eventos WebSocket (`EventoTelemetriaGarita`)
```typescript
export interface EventoTelemetriaGarita {
  readonly tipo: "ingreso" | "salida" | "reserva_eta" | "tarifa_dinamica" | "aforo_critico" | "conexion";
  readonly cocheraId?: number;
  readonly nombreCochera?: string;
  readonly distrito?: string;
  readonly titulo: string;
  readonly mensaje: string;
  readonly timestamp: string;
  readonly datos?: {
    readonly plazasLibres?: number;
    readonly porcentajeOcupacion?: number;
    readonly estadoAforo?: string;
    readonly tarifaHora?: number;
  };
}
```

---

## 6. Diseño arquitectónico de las capas

### 6.1. Implementación de TanStack Query para el catálogo
Diseñamos el custom hook `useCocherasCatalogo(filtros)`:
- **Query Key estructurada:** `["cocheras", { distrito: filtros.distrito, pagina: filtros.pagina }]`. Cualquier cambio en el distrito o en la página genera una clave única y rescata datos de la caché si ya fueron consultados.
- **Configuración de caché:**
  - `staleTime: 60 * 1000` (1 minuto de frescura antes de revalidar en segundo plano).
  - `cacheTime: 5 * 60 * 1000` (5 minutos de retención en memoria).
  - `keepPreviousData: true` (evita parpadeos en la interfaz al cambiar de página, manteniendo los datos anteriores mientras cargan los nuevos).
- **Simulador de endpoint remoto (`obtenerCocherasRemotas`):** Función asíncrona que aplica latencia de red realista (300 ms), filtra el dataset por distrito y devuelve el slice correspondiente a la página solicitada (`(pagina - 1) * limite`).

### 6.2. Implementación de Zustand para el estado global del cliente
A diferencia de Context API:
- No requiere `<Provider>` envolviendo la aplicación; el store `useAppStore` se crea mediante la función `create` y queda disponible para cualquier componente en cualquier nivel del árbol.
- **Selectores atómicos:**
  ```javascript
  // Solo se suscribe al cambio de tema, ignorando cambios en notificaciones
  const tema = useAppStore((state) => state.tema);
  const alternarTema = useAppStore((state) => state.alternarTema);
  ```
  Esto previene re-renderizados accidentales en el catálogo cuando llega una notificación en tiempo real.

### 6.3. Sincronización WebSocket desacoplada por entorno
Establecemos la política innegociable de conexión:
```javascript
const ES_PRODUCCION = window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1";

const URL_WEBSOCKET = ES_PRODUCCION
  ? "wss://quadrate-live-365843518799.southamerica-west1.run.app/ws"
  : `${window.location.protocol === "https:" ? "wss:" : "ws:"}//${window.location.host}/ws-telemetria`;
```
- **Comportamiento en Local:** El navegador conecta al WebSocket local (`scripts/servidor-local.cjs`) sirviendo telemetría y alertas sin tocar la cuota de Cloud Run ni requerir conexión a internet.
- **Comportamiento al recibir un evento:**
  1. El hook del WebSocket recibe `EventoTelemetriaGarita`.
  2. Llama a `useAppStore.getState().agregarNotificacion(...)` para desplegar el Toast.
  3. Si el evento afecta el aforo o tarifas de una cochera, invoca `queryClient.invalidateQueries(["cocheras"])` para que TanStack Query refresque la lista de cocheras en pantalla sin intervención del usuario.

---

## 7. Plan de actividades de desarrollo (Laboratorio / Etapa 2)

| Actividad | Archivos Intervenidos | Responsabilidad Técnica |
| :--- | :--- | :--- |
| **Actividad 1: Infraestructura de Librerías** | `src/assets/vendor/` | Proveer las librerías `@tanstack/react-query` y `zustand` autoalojadas para entorno de navegador nativo sin bundlers pesados, respetando [AGENTS.md](file:///C:/Startup/quadrate-publisher/AGENTS.md). |
| **Actividad 2: Creación del Store Zustand** | `src/js/react/store/app-store.js` | Crear el store global con selectores para `tema`, `distritoPreferido`, `modoVista` y la gestión de la cola de toasts de alertas. |
| **Actividad 3: Hook de Catálogo con TanStack Query** | `src/js/react/queries/use-cocheras-query.js` | Implementar `useCocherasQuery` con soporte de filtrado por distrito, paginación numérica, estados `isLoading`, `isError` y caché. |
| **Actividad 4: Componentes de UI Puros** | `src/js/react/catalogo-cocheras.jsx`, `src/js/react/toast-container.jsx` | Construir la vista paginada del catálogo con skeleton loaders y el contenedor de notificaciones flotantes con accesibilidad WCAG. |
| **Actividad 5: Integración y Conexión WebSocket** | `src/js/react/quadrate-live-app.jsx` | Integrar TanStack Query, Zustand y el hook de WebSocket condicional (local vs producción), verificando que en local no se llame a Cloud Run. |

---

## 8. Criterios de aceptación y matriz de pruebas

| ID | Criterio de Calidad | Procedimiento de Validación | Resultado Esperado |
| :--- | :--- | :--- | :--- |
| **CA-01** | Carga asíncrona y Skeleton | Montar el catálogo por primera vez o cambiar de distrito. | `isLoading` en `true` muestra esqueletos sobrios; finalizada la carga muestra las tarjetas. |
| **CA-02** | Paginación reactiva | Presionar botón "Página 2" en el catálogo. | Se recupera el bloque 2 de cocheras sin recargar la página, actualizando el indicador "Página 2 de N". |
| **CA-03** | Caché en segundo plano | Volver a la "Página 1" previamente consultada. | Muestra los datos de forma instantánea desde la caché de TanStack Query sin estado de carga prolongado. |
| **CA-04** | Aislamiento de Zustand | Despachar una notificación por WebSocket. | La alerta aparece en el centro de toasts sin forzar el re-renderizado de los componentes del catálogo. |
| **CA-05** | Conmutación de tema | Accionar el botón de conmutación de tema. | Se alterna `tema: "claro" \| "oscuro"` reflejándose en las variables CSS del contenedor interactivo. |
| **CA-06** | Aislamiento de red local | Inspeccionar panel Network en `http://localhost:3000`. | El WebSocket conecta exclusivamente a `ws://localhost:3000/ws-telemetria`. Cero solicitudes dirigidas a `*.run.app`. |

---

## 9. Preguntas orientadoras de reflexión

### Pregunta 1: ¿Por qué TanStack Query es superior a manejar `useEffect` + `useState` para el catálogo?
*Respuesta del equipo:*
Manejar datos de red con `useEffect` y `useState` manual presenta serias deficiencias en aplicaciones reales:
1. **Condiciones de carrera (*Race Conditions*):** Si el usuario cambia rápidamente de "Miraflores" a "San Isidro", las respuestas pueden llegar en desorden y mostrar datos erróneos si no se implementa lógica compleja con banderas o `AbortController`.
2. **Cero caché:** Cada renderizado o navegación vuelve a pedir los datos a la red desde cero.
3. **Boilerplate excesivo:** Se deben declarar manualmente al menos tres estados (`datos`, `cargando`, `error`) por cada endpoint.
TanStack Query resuelve esto de forma declarativa: proporciona deduplicación de peticiones en curso, revalidación automática al reenfocar la pestaña (*focus refetching*), caché configurable en memoria y estados estandarizados (`isLoading`, `isError`, `isFetching`).

### Pregunta 2: ¿Qué ventajas aporta Zustand frente a Context API y Redux?
*Respuesta del equipo:*
1. **Frente a Context API:** Elimina el "Provider Hell" al no requerir envolver el árbol con `<Provider>`. Permite **suscripciones atómicas mediante selectores** (`state => state.tema`), garantizando que un componente solo se re-renderice si la porción exacta de estado que consume ha mutado.
2. **Frente a Redux:** No requiere configuraciones complejas, dispatchers ceremoniales, acciones separadas ni reducers verbosos. Se define un store atómico en pocas líneas con una función `set` directa y ergonómica, manteniendo el principio KISS de nuestro repositorio.

### Pregunta 3: ¿Por qué el catálogo debe ser Server State y el tema Client State?
*Respuesta del equipo:*
- El **Server State** (catálogo de cocheras) es propiedad del servidor: reside de forma remota, su veracidad depende de la base de datos externa, puede cambiar sin que el usuario interactúe (por ejemplo, cuando otro conductor ocupa una plaza) y requiere sincronización asíncrona.
- El **Client State** (tema visual, vista en lista o cuadrícula) es propiedad exclusiva del navegador del usuario: es síncrono, no depende de ningún servidor y gobierna únicamente cómo se presenta la información en este dispositivo específico. Mezclarlos en una misma herramienta ensucia la arquitectura y genera estados inconsistentes.

### Pregunta 4: ¿Por qué en desarrollo local se debe desacoplar el WebSocket de Cloud Run?
*Respuesta del equipo:*
1. **Autonomía y resiliencia:** Permite al equipo desarrollar y probar en clase o sin conexión a internet, sin fallos bloqueantes si la nube no está accesible.
2. **Políticas de seguridad de origen:** Google Cloud Run valida estrictamente el encabezado `Origin`. El puerto local `localhost:3000` no debe exponerse innecesariamente en la lista blanca de producción para no comprometer cuotas ni seguridad.
3. **Control de costes de infraestructura:** Evita gastar el presupuesto gratuito de tiempo de CPU y solicitudes en Cloud Run durante sesiones prolongadas de depuración y pruebas locales.

---

## 10. Conclusión y pase al Laboratorio (Etapa 2)

La presente planificación define con exactitud la frontera entre datos asíncronos y estado de interfaz, erradica la dependencia de la nube en desarrollo local y establece contratos limpios y reutilizables. Con esta arquitectura aprobada, el equipo queda habilitado para proceder a la fase de implementación de código (Etapa 2 - Laboratorio) en estricta conformidad con [AGENTS.md](file:///C:/Startup/quadrate-publisher/AGENTS.md).
