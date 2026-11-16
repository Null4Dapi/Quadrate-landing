# Bitácora de Desarrollo Académico (docs/university/CHANGELOG.md)

Registro cronológico interno del equipo para control de intervenciones, entregas y autoría sobre las guías de clase.

---

## [entrega-011-etapa1-y-etapa2] — 2026-11-15 18:30
- **Desarrollador:** Grupo 04 (Integración técnica Semana 11)
- **Archivos intervenidos:**
  - `src/features/catalog/api.js`
  - `src/features/catalog/useExperiences.js`
  - `src/store/appStore.js`
  - `src/store/syncChannel.js`
  - `src/js/react/catalogo-remoto.jsx`
  - `src/js/react/notificaciones-panel.jsx`
  - `src/js/react/quadrate-live-app.jsx`
  - `src/js/react/index.jsx`
  - `src/assets/vendor/tanstack-query.module.js`
  - `src/assets/vendor/zustand.module.js`
  - `src/assets/vendor/react-shim.js`
  - `src/assets/vendor/react-jsx-runtime.js`
  - `src/css/components/catalogo-remoto.css`
  - `scripts/compilar-react.cjs`
  - `demo.html`
  - `package.json`
  - `docs/university/entregables/entrega-011-etapa1.md`
  - `docs/university/TODO.md`
- **Cambios realizados:**
  - Configurado `QueryClient` singleton y `QueryClientProvider` único en el arranque de la aplicación de demostración aislada `demo.html`.
  - Creado módulo de acceso a API `src/features/catalog/api.js` con contrato `Experience` y función asíncrona paginada `getExperiences(page)` consumiendo `/posts?_page={page}&_limit=6` desde JSONPlaceholder con validación HTTP `response.ok`.
  - Implementado custom hook `useExperiences(page)` con TanStack Query, clave compuesta `['experiences', page]` y frescura en memoria controlada (`staleTime: 120000`).
  - Creado componente `CatalogoRemoto` con estados accesibles de carga (`role="status"`), error accesible (`role="alert"`) con botón de reintento, paginación reactiva bidireccional ("Anterior" inhabilitado en página 1) y comprobación de caché.
  - Implementado store global atómico con Zustand (`useAppStore`) con persistencia selectiva en `localStorage` (`experiencias-app-store`, `partialize: (state) => ({ theme: state.theme })`).
  - Implementada sincronización en tiempo real del tema entre pestañas abiertas del navegador utilizando `BroadcastChannel('experiencias-sync')`.
  - Integrado el flujo de telemetría WebSocket con despacho directo a `useAppStore.getState().addNotification(...)` y componentes consumidores desacoplados `NotificationBadge` y `NotificationPanel`.
  - Actualizado pipeline modular de compilación React (`compilar-react.cjs`) y verificado paso exitoso de la suite de pruebas.

---

## [entrega-011-etapa2] — 2026-11-15 15:43
- **Desarrollador:** Manuel Mendo (Integración técnica por equipo)
- **Archivos intervenidos:**
  - `src/js/react/vendor/zustand.js`
  - `src/js/react/vendor/tanstack-query.js`
  - `src/js/react/store/app-store.js`
  - `src/js/react/queries/use-cocheras-query.js`
  - `src/js/react/barra-preferencias.jsx`
  - `src/js/react/toast-container.jsx`
  - `src/js/react/catalogo-cocheras.jsx`
  - `src/js/react/quadrate-live-app.jsx`
  - `src/css/components/quadrate-live.css`
  - `scripts/compilar-react.cjs`
  - `docs/university/entregables/entrega-011-etapa2.md`
  - `docs/university/TODO.md`
- **Cambios realizados:**
  - Implementación nativa de TanStack Query (`QueryClient` y `useQuery`) con soporte de caché, `staleTime`, deduplicación y `keepPreviousData`.
  - Implementación nativa de Zustand (`create`) con `React.useSyncExternalStore` y selectores atómicos.
  - Creación de `useAppStore` para gobernar tema visual (persistido en `localStorage`), distrito preferido, modo de vista (cuadrícula/lista) y cola de notificaciones efímeras (toasts con auto-dismiss a los 5s).
  - Creación de `useCocherasQuery` para la carga asíncrona y paginación del catálogo de cocheras en Lima.
  - Creación de componentes React puros: `BarraPreferencias`, `CatalogoCocheras` (con skeleton loaders y controles de paginación) y `ToastContainer` con accesibilidad WCAG (`aria-live="polite"`).
  - Desacoplamiento estricto del canal WebSocket: conexión 100% local a `ws://localhost:3000/ws-telemetria` en desarrollo (cero llamadas a Cloud Run) y conexión a Cloud Run en producción.
  - Integración reactiva en `QuadrateLiveApp`: cada evento de garita inyecta un toast en Zustand e invalida la caché de TanStack Query (`queryClient.invalidateQueries(["cocheras"])`).
  - Actualización de `compilar-react.cjs` y transpilación exitosa a módulos ES6.
  - Documentación de la matriz de pruebas funcionales LAB1 a LAB8 en `entrega-011-etapa2.md`.

---

## [entrega-011-etapa1] — 2026-11-15 15:35
- **Desarrollador:** Manuel Mendo (Integración técnica por equipo)
- **Archivos intervenidos:**
  - `docs/university/entregables/entrega-011-etapa1.md`
  - `docs/university/TODO.md`
  - `docs/university/CHANGELOG.md`
- **Cambios realizados:**
  - Redacción y aprobación de la planificación arquitectónica de la Semana 11 (Desarrollo Web Full Stack Frontend).
  - Formalización de la separación entre Server State (TanStack Query) y Client State (Zustand).
  - Modelado de contratos TypeScript para catálogo paginado (`Cochera`, `RespuestaCatalogoPaginado`), store global (`AppStoreState`, `ToastNotificacion`) y eventos de red (`EventoTelemetriaGarita`).
  - Definición de la política estricta de transporte: aislamiento 100% local en desarrollo (`ws://localhost:3000/ws-telemetria` sin llamadas a Cloud Run) y conexión exclusiva a Cloud Run en producción.
  - Actualización del semáforo académico en `TODO.md`.

---

## [entrega-006-etapa2] — 2026-10-12 16:45
- **Desarrollador:** Manuel Mendo (Integración técnica por equipo)
- **Archivos intervenidos:**
  - `src/css/components/caseta.css`
  - `src/js/react/caseta-tour.jsx`
  - `src/js/react/caseta-fila.jsx`
  - `src/js/react/datos-caseta.js`
  - `src/js/features/tab-navigation.js`
  - `scripts/compilar-react.cjs`
  - `index.html`
  - `README.md`
- **Cambios realizados:**
  - Implementado el Feature Tour de Caseta (`CasetaTour`) con auto-play rotativo de 4 segundos utilizando `setInterval` y su correspondiente limpieza con `clearInterval`.
  - Diseñados controles accesibles de pausa y reanudación (`[estaReproduciendo]`) sin aceleración de intervalos, y botón de reinicio al paso inicial.
  - Implementado componente funcional puro con props (`CasetaFila`) con soporte de navegación accesible por teclado (`Enter` y `Espacio`).
  - Añadida carga simulada de sincronización con garitas (800ms) mediante `useEffect`, `setTimeout` y `clearTimeout`.
  - Conectado foco programático accesible (`useRef`) en el primer campo del formulario al activar la pestaña "Afiliar cochera".
  - Actualizado el pipeline de compilación modular de React y documentada la matriz completa de pruebas LAB1 a LAB9 en `README.md`.
