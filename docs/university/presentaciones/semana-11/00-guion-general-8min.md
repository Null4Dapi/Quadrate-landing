# Guion Maestro de Exposición (8 Minutos) — Semana 11
### *Separación de Server State (TanStack Query) vs Client State (Zustand) con Sincronización en Tiempo Real y Desacoplamiento de Red*
**Proyecto:** Quadrate pe — Consola Operativa y Telemetría de Cocheras en Lima  
**Duración Total:** 8 minutos cronometrados (Exactos)  
**Integrantes:** Luciana (1) · Diego (2) · Vílchez (3) · Cueva (4) · Víctor / Manuel (5)  
**Modalidad de Presentación:** Directo al código, sin introducciones vacías, técnico y de alto impacto.

---

## Matriz de Tiempos y Roles

| # | Integrante | Minuto | Duración | Rol / Tema Técnico | Archivo o Vista a Proyectar |
| :-: | :--- | :-: | :-: | :--- | :--- |
| **1** | **Luciana** | 0:00 – 1:30 | 1m 30s | **Server State vs Client State y Contratos TypeScript** (Etapa 1) | Diagrama de 2 Niveles + `src/features/catalog/api.js` (Contratos) |
| **2** | **Diego** | 1:30 – 3:05 | 1m 35s | **Estado de Servidor con TanStack Query y Paginación** (Etapa 1 / 2) | `src/js/react/queries/use-cocheras-query.js` (o `useExperiences.js`) |
| **3** | **Vílchez** | 3:05 – 4:40 | 1m 35s | **Estado Global de Cliente Atómico con Zustand** (Etapa 2) | `src/store/appStore.js` (o `src/js/react/store/app-store.js`) |
| **4** | **Cueva** | 4:40 – 6:20 | 1m 40s | **Desacoplamiento de Red y Sincronización en Tiempo Real** (Etapa 2) | `src/store/syncChannel.js` + Handshake WebSocket Local |
| **5** | **Víctor / Manuel** | 6:20 – 8:00 | 1m 40s | **Consumo en React UI, Accesibilidad Universal y Cierre** (Etapa 2) | Demo en vivo (`demo.html`) + `toast-container.jsx` / `catalogo-remoto.jsx` |

---

## Guion Continuo con Acotaciones Escénicas

### [0:00 – 1:30] Bloque 1: Luciana — Diagnóstico de Arquitectura, Server State vs Client State y Contratos
> **[En pantalla: Proyectar diagrama de arquitectura de 2 niveles y abrir `01-luciana-codigo.ts` o contratos de tipos]**

**Luciana:**  
"Buenos días profesor. En la Semana 11 resolvemos una de las deudas técnicas más críticas en aplicaciones frontend modernas: la confusión estructural entre **Server State** (estado de servidor) y **Client State** (estado de cliente).

En la Semana 10 utilizamos `Context API` para distribuir temas y notificaciones. Sin embargo, al incorporar el catálogo dinámico de cocheras en Lima con filtros por distrito y tarifas dinámicas, `Context API` evidenció tres límites severos:
1. **Provider Hell:** Anidar múltiples proveedores provocaba cascadas de re-renderizados en componentes que no consumían los datos modificados.
2. **Carga y caché manual:** Obligaba a emular estados de red con `useState` y `useEffect` acoplados, careciendo de deduplicación de peticiones, retención en memoria y revalidación en segundo plano (*stale-while-revalidate*).
3. **Acoplamiento de red:** Depender de servicios de nube remotos bloqueaba el desarrollo local en caliente.

Para resolverlo, rediseñamos la consola `Quadrate Live` bajo una **arquitectura en dos niveles**:
- **Nivel 1 (Server State) con TanStack Query:** Para datos asíncronos que no le pertenecen al navegador (catálogo de playas, plazas disponibles, paginación y estados `isLoading`/`isError`).
- **Nivel 2 (Client State) con Zustand:** Para datos síncronos e interactivos de la interfaz (tema claro/oscuro, preferencias de vista en cuadrícula o lista y centro de toasts flotantes).

En pantalla observan nuestros contratos inmutables tipados: `Cochera`, `RespuestaCatalogoPaginado` y `AppStoreState`.

Paso con mi compañero Diego para ver cómo gobierna TanStack Query el estado asíncrono del servidor."

---

### [1:30 – 3:05] Bloque 2: Diego — Estado de Servidor con TanStack Query, Claves de Caché y Paginación
> **[En pantalla: Abrir `src/js/react/queries/use-cocheras-query.js` o `src/features/catalog/useExperiences.js`, resaltar `queryKey` y `staleTime`]**

**Diego:**  
"Gracias Luciana. En el estado de servidor, sustituimos los `useEffect` imperativos por el hook declarativo de **TanStack Query**.

Observen en pantalla nuestro hook `useCocherasQuery({ distrito, pagina, limitePorPagina })`. Implementa tres principios fundamentales de ingeniería frontend:

Primero, **Query Keys jerárquicas y reactivas:**  
`queryKey: ["cocheras", { distrito, pagina, limitePorPagina }]`  
TanStack Query serializa esta clave de forma determinista. Si el usuario conmuta de la página 1 a la página 2, o filtra por 'Miraflores', se genera una entrada aislada en la memoria caché. Si el usuario regresa a una página previamente consultada, la respuesta es inmediata (cero milisegundos de latencia percibida).

Segundo, **Política de frescura y deduplicación:**  
Definimos `staleTime: 60 * 1000` (1 minuto). Durante este intervalo, la consulta se considera fresca y no se re-dispara por eventos de ventana (*window focus*). Además, si dos componentes montan el catálogo en paralelo, TanStack Query deduplica la llamada ejecutando un único viaje de red.

Tercero, **Paginación fluida sin parpadeos:**  
Activamos `keepPreviousData: true` (o `placeholderData: keepPreviousData`). Cuando el conductor avanza a la siguiente página, la interfaz retiene los datos de la página anterior hasta que los nuevos registros son resueltos por el servidor, eliminando layouts rotos o saltos de pantalla.

Todo esto entrega estados booleanos puros: `isLoading`, `isError` y la función `refetch()`.

Ahora mi compañero Vílchez explicará cómo administramos el estado global de cliente con Zustand sin utilizar un solo Provider."

---

### [3:05 – 4:40] Bloque 3: Vílchez — Estado Global de Cliente con Zustand y Atomicidad sin Providers
> **[En pantalla: Abrir `src/store/appStore.js` o `src/js/react/store/app-store.js`, resaltar selectores y persistencia]**

**Vílchez:**  
"Gracias Diego. Para el estado propio de la interfaz del cliente no necesitamos la complejidad asíncrona de TanStack Query, pero tampoco la pesadez de `Context API`. Implementamos **Zustand**.

Observen la definición de `useAppStore` en pantalla:  
A diferencia de Context API, **Zustand no requiere envolver el árbol de componentes con ningún `<Provider>`**. El store se instancia como un almacén atómico en memoria al que cualquier componente accede directamente vía hooks funcionales.

Destaco tres ventajas técnicas aplicadas a Quadrate pe:

1. **Suscripción atómica mediante selectores:**  
Si un componente solo necesita alternar el tema visual, escribe:  
`const theme = useAppStore((state) => state.theme);`  
Si en ese instante ingresa un evento por telemetría vehicular y se agrega una notificación a la cola `notificaciones`, este componente **no se re-renderiza**. Zustand compara por identidad estricta la porción del selector, resolviendo de raíz el problema de re-renderizado masivo de Context.

2. **Persistencia selectiva con `localStorage`:**  
Utilizamos un inicializador seguro con bloque defensivo `try/catch` para `quadrate_tema`. Cuando el conductor elige la vista nocturna para garitas de baja iluminación, la preferencia se persiste en el almacenamiento local del cliente y se hidrata al recargar la sesión.

3. **Inmutabilidad y mutaciones predecibles:**  
Acciones como `agregarNotificacion` o `descartarNotificacion` operan con funciones puras utilizando el operador spread, encolando un máximo de 4 toasts activos y programando un timer de auto-descarte de 5 segundos.

Paso con Cueva para explicar el canal de comunicación en tiempo real y el desacoplamiento de entornos."

---

### [4:40 – 6:20] Bloque 4: Cueva — Desacoplamiento de Red, WebSockets Locales y Sincronización Reactiva
> **[En pantalla: Abrir `src/store/syncChannel.js` y el bloque de conexión WebSocket en `quadrate-live-app.jsx`]**

**Cueva:**  
"Gracias Vílchez. Uno de los requerimientos innegociables de la rúbrica y de nuestro `AGENTS.md` era resolver el **acoplamiento de red en entornos de desarrollo vs producción**.

En la Semana 10, conectar directamente al contenedor de Google Cloud Run durante pruebas en clase provocaba errores de CORS, fallos de origen (`Origin 1008`) y dependía de una conexión a Internet externa.

Para la Semana 11 implementamos una **estrategia de desacoplamiento de red por entorno**:
```javascript
const ES_PRODUCCION = window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1";
const URL_WS = ES_PRODUCCION
  ? "wss://quadrate-live-365843518799.southamerica-west1.run.app/ws"
  : `${window.location.protocol === "https:" ? "wss:" : "ws:"}//${window.location.host}/ws-telemetria`;
```
En desarrollo local, el cliente se conecta de forma 100% autónoma a nuestro servidor Node.js propio mediante el protocolo estándar RFC 6455 (`/ws-telemetria`), sin enviar un solo paquete a Cloud Run.

Pero lo más importante es **cómo sincronizamos las dos capas**:
1. Al recibir un evento vehicular de garita (ej. 'Ingreso LPR' o 'Liberación de plaza'), el callback inyecta de inmediato la alerta visual en Zustand:  
`useAppStore.getState().addNotification(dato);`
2. E inmediatamente después, ejecutamos la revalidación reactiva en TanStack Query:  
`queryClient.invalidateQueries(["cocheras"]);`  
Esto le indica a React Query que los datos en caché de aforo están obsoletos y gatilla un re-fetch en segundo plano sin congelar la pantalla.
3. Además, utilizamos `BroadcastChannel('experiencias-sync')` para propagar el tema visual de forma instantánea entre pestañas abiertas sin recargar la página.

Paso con Víctor / Manuel para ver la interfaz de usuario en acción, la accesibilidad universal y las conclusiones del equipo."

---

### [6:20 – 8:00] Bloque 5: Víctor / Manuel — Consumo en React UI, Accesibilidad Universal y Cierre Ejecutivo
> **[En pantalla: Abrir `demo.html` en el navegador con DevTools abierto a la derecha, alternar tema y páginas, mostrar lector de pantalla / toast]**

**Víctor / Manuel:**  
"Gracias Cueva. Concluimos proyectando la consola interactiva `Quadrate Live` en `demo.html`, donde ambas capas convergen en una interfaz editorial limpia y accesible.

Observen en pantalla:
1. **Consumo puro en el Catálogo:** El componente `CatalogoRemoto` / `CatalogoCocheras` consume `useCocherasQuery()`. Mientras los datos viajan por red, se proyecta un estado de carga con skeleton cards etiquetado con `role="status"` y `aria-busy="true"`. Si la red falla, se despliega un panel de error accesible con `role="alert"` y botón de reintento automático.
2. **Paginación Accesible:** Los botones 'Anterior' y 'Siguiente' informan `aria-disabled="true"` en los extremos y cuentan con anuncios de cambio de página para lectores de pantalla.
3. **Centro de Alertas Toasts con Accesibilidad:**  
Cada notificación inyectada desde WebSocket hacia Zustand se renderiza en `ToastContainer` dentro de una región viva:  
`aria-live="polite"` y `aria-atomic="true"`.  
Esto permite que los software de asistencia (*screen readers*) comuniquen al conductor los cambios de tarifa o liberaciones de plaza sin interrumpir la navegación por teclado.
4. **Verificación en DevTools:**  
Al alternar entre la página 1 y 2, observen la pestaña Network: la primera vez realiza la petición HTTP; al regresar a la página 1, la respuesta proviene de la memoria caché de TanStack Query en **0 milisegundos**. Y al conmutar el tema visual entre 'claro' y 'oscuro', la consola de componentes de React demuestra que el catálogo **no sufre un solo re-renderizado**.

**Conclusión del Equipo:**  
En la Semana 11 hemos demostrado que una arquitectura desacoplada —asignando a TanStack Query el rol de gobernanza del servidor y a Zustand el control atómico del cliente— erradica por completo la sobrecarga de Providers, optimiza el consumo de memoria del navegador y proporciona una base sólida, escalable y accesible para el producto Quadrate pe.

Muchas gracias profesor, quedamos listos para su ronda de preguntas."
