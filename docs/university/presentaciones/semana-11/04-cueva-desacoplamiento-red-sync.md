# Ficha Individual de Exposición — Cueva (4:40 – 6:20)
### *Etapa 2: Desacoplamiento de Red por Entorno, WebSockets y Sincronización Reactiva*

**Tiempo asignado:** 1 minuto con 40 segundos (Máximo 2:00 min)  
**Objetivo principal:** Demostrar cómo se desacopla la conexión WebSocket (local sin Cloud Run en desarrollo vs productiva), cómo se integran los eventos entrantes con Zustand y cómo se invalidan las queries de TanStack Query en tiempo real.

---

## 1. Código a Proyectar en Pantalla

Abrir en el editor: `docs/university/presentaciones/semana-11/04-cueva-codigo.js` (o `src/store/syncChannel.js` y `src/js/react/quadrate-live-app.jsx`)

```javascript
import { useAppStore } from "./store/app-store.js";
import { queryClient } from "./queries/use-cocheras-query.js";

// 1. Desacoplamiento estricto de red por entorno
const ES_PRODUCCION = window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1";

const URL_WS = ES_PRODUCCION
  ? "wss://quadrate-live-365843518799.southamerica-west1.run.app/ws"
  : `${window.location.protocol === "https:" ? "wss:" : "ws:"}//${window.location.host}/ws-telemetria`;

// 2. Handshake y ciclo de vida del WebSocket nativo (RFC 6455)
export function iniciarSincronizacionEnVivo() {
  const socket = new WebSocket(URL_WS);

  socket.onmessage = (evento) => {
    try {
      const telemetria = JSON.parse(evento.data);

      // Paso A: Inyección reactiva inmediata en el Store Zustand (Toast)
      useAppStore.getState().agregarNotificacion({
        tipo: telemetria.tipo || "aforo_critico",
        titulo: telemetria.titulo || "Actualización de Caseta",
        mensaje: telemetria.mensaje,
        distrito: telemetria.distrito || "Lima",
      });

      // Paso B: Invalidación de caché en TanStack Query (refresco en segundo plano)
      if (telemetria.afectaAforo || telemetria.tipo === "ingreso" || telemetria.tipo === "salida") {
        queryClient.invalidateQueries(["cocheras"]);
      }
    } catch (err) {
      console.warn("Payload no estructurado recibido:", err);
    }
  };

  return socket;
}
```

---

## 2. Puntos Clave a Señalar con el Mouse (Checklist)

1. **Líneas 5–10 (`URL_WS`):** Explicar la directiva de `AGENTS.md`: en desarrollo local la aplicación jamás llama a Cloud Run, garantizando trabajo en caliente offline y sin errores CORS (`Origin 1008`).
2. **Línea 20 (`useAppStore.getState().agregarNotificacion`):** Mostrar cómo se despacha la acción de Zustand desde fuera de un componente de React.
3. **Línea 28 (`queryClient.invalidateQueries(["cocheras"])`):** Señalar la revalidación reactiva automática: TanStack Query detecta el cambio y actualiza el aforo sin que el usuario recargue la página.
4. **BroadcastChannel:** Mencionar brevemente la sincronización del tema visual entre múltiples pestañas del navegador.

---

## 3. Discurso Palabra por Palabra (Directo al Grano)

> "Gracias Vílchez. Uno de los requerimientos innegociables de la rúbrica y de nuestro `AGENTS.md` era resolver el **acoplamiento de red en entornos de desarrollo vs producción**.
> 
> En la Semana 10, conectar directamente al contenedor de Google Cloud Run durante pruebas en clase provocaba errores de CORS, fallos de origen (`Origin 1008`) y dependía de una conexión a Internet externa.
> 
> Para la Semana 11 implementamos una **estrategia de desacoplamiento de red por entorno**:
> ```javascript
> const ES_PRODUCCION = window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1";
> const URL_WS = ES_PRODUCCION
>   ? "wss://quadrate-live-365843518799.southamerica-west1.run.app/ws"
>   : `${window.location.protocol === "https:" ? "wss:" : "ws:"}//${window.location.host}/ws-telemetria`;
> ```
> En desarrollo local, el cliente se conecta de forma 100% autónoma a nuestro servidor Node.js propio mediante el protocolo estándar RFC 6455 (`/ws-telemetria`), sin enviar un solo paquete a Cloud Run.
> 
> Pero lo más importante es **cómo sincronizamos las dos capas**:
> 1. Al recibir un evento vehicular de garita (ej. 'Ingreso LPR' o 'Liberación de plaza'), el callback inyecta de inmediato la alerta visual en Zustand:  
> `useAppStore.getState().addNotification(dato);`
> 2. E inmediatamente después, ejecutamos la revalidación reactiva en TanStack Query:  
> `queryClient.invalidateQueries(["cocheras"]);`  
> Esto le indica a React Query que los datos en caché de aforo están obsoletos y gatilla un re-fetch en segundo plano sin congelar la pantalla.
> 3. Además, utilizamos `BroadcastChannel('experiencias-sync')` para propagar el tema visual de forma instantánea entre pestañas abiertas sin recargar la página.
> 
> Paso con Víctor / Manuel para ver la interfaz de usuario en acción, la accesibilidad universal y las conclusiones del equipo."
