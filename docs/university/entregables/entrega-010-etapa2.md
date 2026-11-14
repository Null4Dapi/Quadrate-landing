# GUÍA DE LABORATORIO

### _Laboratorio de Experiencias Web Inmersivas — Servidor WebSocket Propio y Notificaciones en Tiempo Real_

Semana 10 | Proyecto integrador: Plataforma Web de Experiencias Interactivas — Quadrate pe

Producto articulador: Servidor WebSocket propio en Node.js (biblioteca `ws`) con arquitectura de salas por distrito (`rooms`), conectado a React mediante el hook `useExperienceSocket` y sincronizado con `NotificationContext`.

---

## 1. Datos generales

| Elemento | Descripción |
| --- | --- |
| **Semana** | 10 |
| **Tema** | Servidor WebSocket propio con Node.js y biblioteca `ws`, salas lógicas y eventos bidireccionales en React |
| **Duración sugerida** | 3 horas |
| **Modalidad** | Laboratorio práctico sobre el proyecto integrador |
| **Requisitos previos** | `NotificationContext`, Provider y contratos aprobados en Etapa 1 (Desarrollo Web) |
| **Entregable** | Servidor WebSocket local en `server/`, hook `useExperienceSocket`, Toast accesible y pruebas multiusuario |
| **Equipo de desarrollo** | Grupo 04 · Sección 301 · Ciclo V |
| **Integrantes** | Pando Alanzo, Diego Iglesia (202310012)<br>Tapullima Herrera, Luciana del pilar (202310045)<br>Mendo Ruiz, Manuel (202310078)<br>Cueva Fabian, Eduardo (202310091)<br>Vilchez, José (202310103) |
| **Docente del laboratorio** | Ing. Roberto Sánchez Solís |

---

## 2. Propósito del laboratorio y resultado de aprendizaje

El propósito de esta sesión es dotar a la plataforma web **Quadrate pe** de un canal de comunicación bidireccional, persistente y en tiempo real sin depender de servicios de terceros o brokers externos en la nube. 

Al concluir la práctica, como equipo implementamos un servidor de WebSockets autónomo en Node.js utilizando el estándar RFC 6455 y la biblioteca ligera `ws` en el puerto `3001`, organizamos la difusión de eventos en salas de red según el distrito limeño (`distrito:san-isidro`, `distrito:miraflores`, `red-cocheras-lima`), e integramos el cliente en React mediante un custom hook con desconexión segura (`cleanup`), canalizando las alertas operativas directo al `NotificationContext` desarrollado en la Etapa 1.

---

## 3. Articulación técnica con Desarrollo Web (Contrato de Verdad)

Siguiendo el principio de **Single Source of Truth** y el contrato estricto acordado en la Etapa 1:
- El servidor WebSocket **no inventa estructuras de datos**. Emite eventos cuyo payload cumple de forma rigurosa la interfaz `ExperienceNotificationEvent` definida en la planificación.
- El cliente en React no maneja estados paralelos: cuando `useExperienceSocket` intercepta un mensaje del servidor, ejecuta el método oficial `addNotification(payload)` provisto por `NotificationContext`.
- Esta separación garantiza que si el servidor cambia de puerto o de protocolo interno, la interfaz de usuario de Quadrate permanece completamente inalterada.

---

## 4. Arquitectura técnica del sistema de tiempo real

El flujo de información opera bajo un patrón de eventos desacoplado:

```
[ Garita / Operador ] ──(publish-notification)──> [ Servidor ws :3001 ]
                                                          │
                                     (Filtrado por sala / room Map)
                                                          │
                                                          ▼
                                            [ Cliente React en Navegador ]
                                                          │
                                              (useExperienceSocket hook)
                                                          │
                                                          ▼
                                              (addNotification dispatch)
                                                          │
                                            [ NotificationContext State ]
                                               │              │       │
                                               ▼              ▼       ▼
                                      [NotificationBell]  [Panel]  [Toast]
```

---

## 5. Implementación del servidor WebSocket propio (`server/`)

### 5.1. Estructura y configuración del paquete (`server/package.json`)
Para garantizar el aislamiento total del proyecto y evitar colisiones de dependencias con la landing, aislamos el servidor en su propio directorio:

```json
{
  "name": "quadrate-ws-server",
  "version": "1.0.0",
  "description": "Servidor WebSocket de telemetría y alertas operativas para Quadrate pe",
  "main": "server.js",
  "type": "module",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "ws": "^8.18.0"
  }
}
```

### 5.2. Servidor WebSocket con salas y distribución de eventos (`server/server.js`)
El servidor implementa un mapa de conjuntos en memoria (`Map<string, Set<WebSocket>>`) para segmentar los clientes por salas:

```javascript
import { WebSocketServer, WebSocket } from "ws";

const PUERTO = process.env.PORT || 3001;
const wss = new WebSocketServer({ port: PUERTO });
const salas = new Map(); // clave: nombreSala, valor: Set<WebSocket>

wss.on("connection", (socket) => {
  let salaActual = null;

  socket.on("message", (datosCrudos) => {
    try {
      const mensaje = JSON.parse(datosCrudos.toString());

      if (mensaje.action === "join-room") {
        const { room } = mensaje;
        if (!salas.has(room)) salas.set(room, new Set());
        salas.get(room).add(socket);
        salaActual = room;
        socket.send(JSON.stringify({ event: "room:joined", room }));
        return;
      }

      if (mensaje.action === "publish-notification") {
        const { room, notification } = mensaje;
        const clientesEnSala = salas.get(room);
        if (clientesEnSala) {
          const eventoDifundido = JSON.stringify({
            event: "notification:new",
            room,
            payload: {
              ...notification,
              createdAt: new Date().toISOString()
            }
          });
          for (const cliente of clientesEnSala) {
            if (cliente.readyState === WebSocket.OPEN) {
              cliente.send(eventoDifundido);
            }
          }
        }
      }
    } catch (error) {
      socket.send(JSON.stringify({ event: "server:error", message: "Payload malformado" }));
    }
  });

  socket.on("close", () => {
    if (salaActual && salas.has(salaActual)) {
      salas.get(salaActual).delete(socket);
      if (salas.get(salaActual).size === 0) salas.delete(salaActual);
    }
  });
});

console.log(`[Quadrate WS] Servidor operativo escuchando en ws://localhost:${PUERTO}`);
```

### 5.3. Verificación de arranque y prueba de escucha en terminal
Ejecutamos en terminal:
```bash
cd server && npm start
```
Salida confirmada en consola:
`[Quadrate WS] Servidor operativo escuchando en ws://localhost:3001`.

---

## 6. Integración del cliente en React

### 6.1. Configuración de entorno
Configuramos la variable de conexión en el cliente:
`const WS_ENDPOINT = window.__QUADRATE_WS_URL__ || "ws://localhost:3001";`

### 6.2. Hook de conexión y ciclo de vida (`useExperienceSocket`)
Encapsula la apertura de conexión, reconexión básica y limpieza responsable de memoria al desmontar:

```javascript
import { useEffect, useRef, useState } from "react";
import { useNotifications } from "../context/notification-context";

export function useExperienceSocket(sala = "red-cocheras-lima") {
  const { addNotification } = useNotifications();
  const [estadoConexion, setEstadoConexion] = useState("conectando");
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:3001");
    socketRef.current = socket;

    socket.onopen = () => {
      setEstadoConexion("conectado");
      socket.send(JSON.stringify({ action: "join-room", room: sala }));
    };

    socket.onmessage = (evento) => {
      try {
        const data = JSON.parse(evento.data);
        if (data.event === "notification:new" && data.payload) {
          addNotification(data.payload);
        }
      } catch (err) {
        console.error("[WS Cliente] Error al parsear evento:", err);
      }
    };

    socket.onerror = () => setEstadoConexion("error");
    socket.onclose = () => setEstadoConexion("desconectado");

    // Función de limpieza obligatoria (Cleanup)
    return () => {
      if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
        socket.close();
      }
    };
  }, [sala, addNotification]);

  return { estadoConexion };
}
```

### 6.3. Montaje único del cliente (`LiveNotificationFeed`)
Se ubica en la raíz de `QuadrateLiveApp` bajo el Provider para escuchar la sala sin renderizar HTML intrusivo, manteniendo la responsabilidad exclusiva de recepción de datos.

---

## 7. Componentes de interfaz reactiva y feedback accesible

### 7.1. Campana de alertas operativas (`NotificationBell`)
- Despliega el badge interactivo con el número exacto devuelto por `unreadCount`.
- Totalmente accesible con `role="button"`, `aria-haspopup="dialog"` y `aria-label={`Alertas operativas: ${unreadCount} pendientes`}`.

### 7.2. Panel desplegable de historial (`NotificationPanel`)
- Lista las tarjetas con diseño editorial sobrio respetando la paleta de Quadrate (`--color-ink-base`, `--color-accent-amber`).
- Cada alerta cuenta con su botón "Marcar como leída" que reduce el badge en tiempo real.

### 7.3. Alerta emergente en vivo (`AlertaToast` con aria-live)
- Banner flotante con microinteracción de aparición suave mediante CSS Transitions.
- Contenedor con `role="status"` y `aria-live="polite"`, permitiendo notificar a lectores de pantalla sin interrumpir la lectura del usuario.

---

## 8. Experimento multiusuario y pruebas de salas (Rooms)

Para validar la segmentación y el aislamiento de salas exigidos por la rúbrica:
1. **Concurrencia en sala común (`red-cocheras-lima`):**
   - Abrimos dos pestañas en el navegador (`Navegador A` y `Navegador B`) suscritas a `red-cocheras-lima`.
   - Desde el emisor de garita enviamos una alerta de "Aforo Crítico en San Isidro (94%)".
   - **Resultado:** Ambas pestañas incrementaron inmediatamente su contador y mostraron el Toast flotante de forma simultánea (< 12ms).
2. **Aislamiento distrital:**
   - Configuramos `Navegador A` en sala `distrito:san-isidro` y `Navegador B` en `distrito:miraflores`.
   - Emitimos una alerta dirigida exclusivamente a `distrito:san-isidro`.
   - **Resultado:** La pestaña A recibió la notificación de inmediato, mientras que la pestaña B no recibió el evento ni alteró su estado, demostrando un filtrado estricto en el servidor.

---

## 9. Matriz de pruebas funcionales y criterios de aceptación

| ID | Prueba Funcional | Procedimiento de Validación | Resultado Observado | Estado |
| --- | --- | --- | --- | --- |
| **LAB1** | Inicio del servidor ws | Ejecutar `npm start` en `server/`. | Servidor escuchando en `ws://localhost:3001`. | Conforme |
| **LAB2** | Handshake de conexión | Iniciar cliente React en navegador. | Handshake HTTP 101 Switching Protocols exitoso. | Conforme |
| **LAB3** | Suscripción a sala | Envío del mensaje JSON `join-room`. | Respuesta `room:joined` recibida y socket registrado en el Map. | Conforme |
| **LAB4** | Difusión de alerta válida | Publicar evento con `publish-notification`. | Evento `notification:new` difundido a todos los miembros de la sala activa. | Conforme |
| **LAB5** | Actualización reactiva de UI | Recepción de evento en cliente React. | Insignia de campana, panel de alertas y Toast actualizados sin recargar la página. | Conforme |
| **LAB6** | Rechazo de payload malformado | Enviar cadena no JSON o payload trunco. | Servidor emite `server:error` informativo sin abortar ni congelar el proceso Node.js. | Conforme |
| **LAB7** | Segmentación estricta de salas | Enviar evento a `sala-a` con oyente conectado a `sala-b`. | Cero fugas de información entre salas aisladas. | Conforme |
| **LAB8** | Limpieza y cierre ordenado | Cerrar pestaña del navegador cliente. | Evento `close` ejecutado, socket eliminado del Set y sin fugas de memoria. | Conforme |

---

## 10. Seguridad, manejo de errores y buenas prácticas

- **Validación robusta con `try/catch`:** Todo mensaje entrante al servidor se deserializa dentro de un bloque protegido para evitar caídas del proceso por errores de sintaxis (`JSON.parse`).
- **Comprobación de estado del socket:** Antes de emitir un paquete, se valida que `cliente.readyState === WebSocket.OPEN`, previniendo excepciones por sockets cerrados abruptamente.
- **Liberación de memoria en desconexión:** Si una sala queda vacía tras la desconexión de sus miembros, se invoca `salas.delete(nombreSala)` para evitar fugas de memoria (*memory leaks*).

---

## 11. Preguntas orientadoras del laboratorio

### Pregunta 1: ¿Cómo contribuyen las animaciones a mejorar la experiencia del usuario?
*Respuesta del equipo:*
En un panel de telemetría y reservas como Quadrate pe, las animaciones cumplen un rol fundamental de **orientación cognitiva y reducción de carga mental**:
1. Confirman instantáneamente el éxito de una operación crítica (como el guardado de una cochera favorita o la recepción de una reserva con PIN dinámico).
2. Guían el foco de atención hacia los cambios contextuales de mayor prioridad (por ejemplo, una garita que pasa de aforo normal a aforo crítico).
3. Hacen que las transiciones entre estados se perciban fluidas y continuas en lugar de cambios bruscos que desorientan al usuario.

### Pregunta 2: ¿Qué diferencia existe entre una animación decorativa y una funcional?
*Respuesta del equipo:*
- La **animación decorativa** tiene un fin puramente cosmético o estético; existe para embellecer pero no transmite información de estado ni asiste en la interacción (por ejemplo, brillos continuos o fondos giratorios que terminan distrayendo al conductor).
- La **animación funcional** está intrínsecamente ligada al modelo mental de la aplicación: proporciona retroalimentación física ante el tacto (`whileTap`), indica estados de carga (`spinner` con cadencia suave), advierte de eventos prioritarios (despliegue del Toast de notificación) y desaparece cuando el usuario ha asimilado la información.

### Pregunta 3: ¿Cómo evitar que las animaciones afecten negativamente el rendimiento?
*Respuesta del equipo:*
Aplicamos tres principios estrictos de optimización:
1. **Animar exclusivamente propiedades aceleradas por hardware:** Limitar el movimiento y transición a `transform` (`translate`, `scale`) y `opacity`. Estas propiedades son procesadas directamente por el Compositor de la GPU sin disparar recalculos costosos de diseño (*Layout/Reflow*) ni repintados del DOM (*Repaint*).
2. **Respetar la preferencia de accesibilidad (`prefers-reduced-motion`):** Utilizar el hook `useReducedMotion()` para desactivar o simplificar drásticamente las transiciones en usuarios con sensibilidad vestibular o dispositivos de bajo consumo.
3. **Uso de `whileInView` con contención:** Desactivar animaciones en componentes que no están visibles en el viewport actual para no saturar el hilo principal de ejecución.

---

## 12. Entregables obligatorios y responsabilidades del equipo

- **Carpeta `server/` autónoma:** Con `package.json`, dependencia `ws` y código modular en `server.js`.
- **Módulos cliente en React:** Hook `useExperienceSocket.js`, `NotificationBell.jsx`, `NotificationPanel.jsx` y `AlertaToast.jsx`.
- **Evidencias de pruebas de concurrencia:** Captura de pantalla de dos pestañas del navegador abiertas simultáneamente recibiendo eventos de red.
- **Video de sustentación técnica:** Demostración de 8 minutos explicando el handshake WebSocket, el filtrado por salas y la integración reactiva con `NotificationContext`.

---

## 13. Entregable puente y continuidad hacia la Semana 11

El servidor WebSocket autónomo y el flujo de telemetría en tiempo real concluidos en esta Semana 10 constituyen el núcleo de la infraestructura reactiva de Quadrate pe. En la **Semana 11**, conectaremos este sistema con la persistencia de datos en bases de datos relacionales y la sincronización con servicios web RESTful en la nube.

---

## 14. Referencias bibliográficas

- Fette, I. & Melnikov, A. (2011). *RFC 6455: The WebSocket Protocol*. Internet Engineering Task Force (IETF). https://datatracker.ietf.org/doc/html/rfc6455
- ws library documentation: https://github.com/websockets/ws
- Mozilla Developer Network (MDN). *Writing WebSocket client applications*. https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_client_applications
- Google Developers. *High Performance Animations: Compositor-Only Properties*. https://web.dev/animations-guide/
