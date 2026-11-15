# Guía de Laboratorio

#### _Laboratorio de Experiencias Web Inmersivas | Estado global con Zustand_

Semana 11 | Proyecto integrador: Plataforma Web de Experiencias Interactivas — Quadrate pe

Producto articulador: Migración de Context API a un store atómico centralizado con Zustand, persistencia selectiva en localStorage (`persist` middleware para preferencia de tema de caseta), sincronización inter-pestañas en tiempo real con `BroadcastChannel` e integración reactiva con el flujo WebSocket de telemetría de cocheras en Lima Metropolitana.

---

## 1. Datos generales

| Elemento | Descripción |
| --- | --- |
| **Semana** | 11 |
| **Tema** | Gestión de estado global con Zustand, middleware persist, sincronización con BroadcastChannel y WebSockets |
| **Modalidad** | Trabajo práctico de laboratorio en equipo |
| **Duración sugerida** | 3 horas |
| **Requisitos previos** | Cierre de Semana 10 (servidor WebSocket operativo), Node.js, npm, proyecto Quadrate pe |
| **Entregable** | Store Zustand `appStore`, migración libre de Context API, tema persistido, sincronización entre pestañas y feed WebSocket |
| **Equipo de desarrollo** | Grupo 04 · Sección 301 · Ciclo V |
| **Integrantes** | Pando Alanzo, Diego Iglesia (202310012)<br>Tapullima Herrera, Luciana del pilar (202310045)<br>Mendo Ruiz, Manuel (202310078)<br>Cueva Fabian, Eduardo (202310091)<br>Vilchez, José (202310103) |
| **Docente principal** | Mag. Ing. Juan Carlos Ramos |

*Nota.* Elaboración propia.

---

## 2. Articulación con Desarrollo Web

| Elemento | Responsabilidad |
| --- | --- |
| **TanStack Query** | Datos remotos del catálogo, loading, error, caché y paginación (Desarrollo Web). |
| **Zustand** | Estado global del cliente: tema de interfaz, preferencias y notificaciones (Laboratorio). |
| **WebSocket** | Transporta eventos en tiempo real desde y hacia el servidor construido en la semana 10. |
| **React UI** | Consume TanStack Query y Zustand para presentar el catálogo dinámico y las alertas en vivo. |

*Nota.* Elaboración propia.

El laboratorio no repite el consumo REST de la API de catálogo. Toma el módulo elaborado en Desarrollo Web y transforma integralmente la gestión del estado global; los eventos asíncronos entrantes vía WebSocket actualizan el store de Zustand y sus componentes consumidores de manera granular.

---

## 3. Resultado de aprendizaje

Al finalizar la sesión de laboratorio, como equipo habremos logrado:
* Administrar el estado global del cliente mediante un store modular de Zustand.
* Implementar persistencia selectiva con middleware y sincronización reactiva simple entre pestañas mediante `BroadcastChannel`.
* Integrar el store de forma desacoplada con el flujo de eventos WebSocket implementado en la semana anterior.

---

## 4. Reglas de trabajo

* **Aislamiento en rama temática:** Trabajar en la rama de Laboratorio acordada (`feature/week11-zustand-store` o `immersive-lab`), partiendo estrictamente de la versión integrada al cierre de la semana 10.
* **Reutilización de infraestructura:** No crear una segunda aplicación ni levantar un servidor alternativo; reutilizar el servidor Node.js y el servicio WebSocket autónomo de la plataforma.
* **Migración segura sin regresiones:** No eliminar `Context API` hasta comprobar empíricamente que Zustand reemplaza a todos sus consumidores sin fugas de estado.
* **Fidelidad al contrato:** Adaptar los nombres de eventos y la estructura de payload al contrato real documentado por el equipo (`notification:new`, `salaActual`, etc.).
* **Seguridad en almacenamiento local:** Prohibido almacenar tokens de autenticación, contraseñas o datos sensibles en `localStorage`.

---

## 5. Preparación

1. Actualizar el repositorio de Quadrate pe y registrar el commit inicial de la etapa de laboratorio.
2. Ejecutar `npm install` y `npm run dev`; comprobar el funcionamiento del catálogo, las animaciones de motion y las notificaciones previas.
3. Identificar las referencias actuales a `ThemeContext` y `NotificationContext`, sus Providers y consumidores con `useContext`.
4. Identificar el servicio WebSocket: URL de desarrollo (`ws://localhost:3001`), protocolo, eventos soportados, payload y funciones de limpieza de listeners.
5. Instalar la librería Zustand en el proyecto:
   `npm install zustand`

---

## 6. Desarrollo paso a paso

### Actividad 1. Diseñar el estado global

| Dato | Dónde se usa | ¿Persistir? | Decisión técnica fundamentada |
| --- | --- | --- | --- |
| **Tema claro/oscuro** | Header, caseta y fondo principal. | **Sí** | Se guarda la preferencia del operador en `localStorage` para recordarla entre sesiones. |
| **Notificaciones** | Badge de campana y panel de historial. | **No necesariamente** | Se mantienen en memoria; se define límite de capacidad para no sobrecargar el navegador. |
| **Usuario de demostración** | Header y perfil operativo. | **Depende** | Se almacena únicamente nombre o rol visual; nunca se guardan credenciales ni tokens. |
| **Catálogo** | Vista de cocheras y tarjetas. | **No en Zustand** | Lo administra de manera óptima `TanStack Query` con su propia memoria caché. |

*Nota.* Elaboración propia.

### Actividad 2. Crear store Zustand

Crear el módulo `src/store/appStore.js` (o `appStore.ts`). Adaptar los tipos y nombres al dominio real de Quadrate pe:

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Notice = {
  id: string;
  message: string;
  createdAt: string;
};

export type AppState = {
  theme: 'light' | 'dark';
  notifications: Notice[];
  setTheme: (theme: 'light' | 'dark') => void;
  addNotification: (notice: Notice) => void;
  clearNotifications: () => void;
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'light',
      notifications: [],
      setTheme: (theme) => set({ theme }),
      addNotification: (notice) =>
        set((state) => ({ notifications: [notice, ...state.notifications] })),
      clearNotifications: () => set({ notifications: [] }),
    }),
    {
      name: 'experiencias-app-store',
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);
```

**Justificación técnica de `partialize`:** La función `partialize` restringe la persistencia exclusivamente a la propiedad `theme`. Las notificaciones operativas permanecen en la memoria volátil del navegador para prevenir la reaparición de avisos antiguos o caducados al reiniciar la sesión.

### Actividad 3. Migrar Context API a Zustand

1. Localizar de forma exhaustiva cada invocación de `useContext(ThemeContext)` y `useContext(NotificationContext)`.
2. Sustituir cada llamada por selectores atómicos de Zustand (por ejemplo: `const theme = useAppStore((state) => state.theme);`).
3. Actualizar los botones conmutadores de tema y paneles de alerta para invocar las acciones expuestas por el store.
4. Retirar los antiguos `<ThemeProvider>` y `<NotificationProvider>` del árbol de montaje únicamente cuando no reste ningún consumidor activo.
5. Ejecutar una búsqueda de referencias residuales en el código y verificar que la aplicación arranque limpiamente.

### Actividad 4. Persistir tema

1. Alternar entre modo claro y modo oscuro desde el botón interactivo de la caseta de operaciones.
2. Verificar que el tema se aplique de forma consistente en el elemento raíz del DOM (`data-theme` o clases CSS correspondientes).
3. Recargar la página mediante `F5` y validar que el navegador conserve la preferencia seleccionada.
4. Abrir las herramientas de desarrollo: `DevTools → Application → Local Storage` y localizar la entrada `experiencias-app-store`.
5. Inspeccionar el contenido del JSON persistido y ratificar la estricta ausencia de datos sensibles o secretos.

### Actividad 5. Conectar WebSocket de semana 10

Reutilizar el servicio y hook de WebSocket ya implementado en la semana 10. No abrir conexiones de socket dentro del cuerpo de renderizado de React. En el callback del listener del evento real, despachar la acción hacia el store:

```javascript
import { useAppStore } from '../store/appStore';

// Suscripción al evento real de la telemetría de cocheras
socket.on('notification:new', (payload) => {
  useAppStore.getState().addNotification({
    id: String(payload.id ?? crypto.randomUUID()),
    message: String(payload.message ?? 'Alerta operativa de cochera en Lima'),
    createdAt: new Date().toISOString(),
  });
});
```

*Nota arquitectónica:* Si el backend implementado en la semana 10 utiliza WebSocket nativo (`ws`) o protocolo con salas personalizadas (`join-room`), conectar el listener en el manejador del mensaje deserializado (`socket.onmessage`). Se recuerda que WebSocket estándar y librerías como Socket.IO no son protocolos intercambiables.

### Actividad 6. Mostrar notificaciones

Implementar los componentes consumidores optimizados con selectores granulares para evitar re-renderizados innecesarios:

```jsx
import { useAppStore } from '../store/appStore';

export function NotificationBadge() {
  const count = useAppStore((state) => state.notifications.length);
  return (
    <span className="badge-notificaciones" aria-live="polite">
      Alertas: {count}
    </span>
  );
}

export function NotificationPanel() {
  const items = useAppStore((state) => state.notifications);
  const clear = useAppStore((state) => state.clearNotifications);

  return (
    <section className="panel-historial" aria-label="Historial de alertas operativas">
      <header className="panel-historial__header">
        <h3>Historial en Vivo</h3>
        <button type="button" onClick={clear} className="panel-historial__btn-clear">
          Limpiar avisos
        </button>
      </header>
      <div className="panel-historial__lista">
        {items.map((n) => (
          <article key={n.id} className="tarjeta-alerta">
            <p className="tarjeta-alerta__mensaje">{n.message}</p>
            <time className="tarjeta-alerta__tiempo">{new Date(n.createdAt).toLocaleTimeString()}</time>
          </article>
        ))}
      </div>
    </section>
  );
}
```

### Actividad 7. Sincronizar dos pestañas

La persistencia en `localStorage` no sincroniza de forma inmediata pestañas abiertas en tiempo real sin una recarga de página. Para lograr sincronización instantánea del tema visual, implementamos la API nativa `BroadcastChannel`:

```javascript
const channel = new BroadcastChannel('experiencias-sync');

export function changeTheme(theme) {
  useAppStore.getState().setTheme(theme);
  channel.postMessage({ type: 'THEME_CHANGED', theme });
}

channel.onmessage = (event) => {
  if (event.data?.type === 'THEME_CHANGED') {
    useAppStore.getState().setTheme(event.data.theme);
  }
};

// Cierre responsable de recursos al desmontar el servicio
export function closeThemeSync() {
  channel.close();
}
```

*Nota:* `BroadcastChannel` sincroniza instancias activas dentro del mismo navegador y origen; no sustituye la comunicación cliente-servidor entre diferentes computadoras, la cual sigue canalizada a través del servidor WebSocket.

---

## 7. Pruebas obligatorias

| Prueba | Procedimiento | Resultado esperado |
| --- | --- | --- |
| **Migración** | Conmutar tema y generar notificaciones en la interfaz. | Todas las interacciones funcionan con normalidad tras haber eliminado los Providers antiguos. |
| **Persistencia** | Cambiar el tema a oscuro y recargar la página (`F5`). | Se mantiene el modo oscuro de forma inmediata sin parpadeos (*flash of unstyled theme*). |
| **WebSocket** | Emitir evento de alerta desde el servidor de garita. | La campana (`badge`) y el panel se actualizan en vivo sin necesidad de recargar la vista. |
| **Conexión única** | Provocar re-renderizados sucesivos y navegar entre vistas. | No se generan sockets duplicados ni listeners huérfanos en memoria. |
| **Sincronización** | Abrir dos pestañas simultáneas y cambiar el tema en una de ellas. | Ambas pestañas reflejan el nuevo tema instantáneamente gracias a `BroadcastChannel`. |
| **Regresión** | Probar el catálogo paginado y las animaciones de tarjetas. | El consumo con TanStack Query, el responsive y las animaciones previas continúan operando al 100%. |

*Nota.* Elaboración propia.

---

## 8. Entregables

* **Repositorio de código:** Rama de laboratorio (`feature/week11-zustand-store` o `immersive-lab`) con el store de Zustand completamente integrado.
* **Persistencia comprobada:** Registro en `localStorage` con la preferencia de tema documentada mediante captura de pantalla de DevTools.
* **Integración en tiempo real:** Notificaciones entrantes desde el servidor WebSocket reflejadas en tiempo real en los componentes consumidores.
* **Sincronización multi-pestaña:** Demostración en vivo de la sincronización de estado entre dos ventanas del navegador.
* **Diagrama de arquitectura:** Flujo secuencial: Servidor WebSocket → Evento de red → Acción en store Zustand → Componentes React suscritos.
* **Informe técnico:** Documento consolidado detallando decisiones de diseño, matriz de pruebas, dificultades y capturas de soporte.
* **Video de demostración:** Grabación técnica (4 a 6 minutos) con la sustentación y explicación del equipo.

---

## 9. Referencias bibliográficas

Zustand Documentation. (2024). *Zustand: Bear necessities for state management in React*. GitHub. https://github.com/pmndrs/zustand

MDN Web Docs. (2024). *BroadcastChannel API*. Mozilla Corporation. https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel

Fette, I. & Melnikov, A. (2011). *RFC 6455: The WebSocket Protocol*. Internet Engineering Task Force (IETF). https://doi.org/10.17487/RFC6455
