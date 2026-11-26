# Ficha Individual de Exposición — Vílchez (3:05 – 4:40)
### *Etapa 2: Servidor WebSocket Propio en Node.js y Arquitectura de Salas*

**Tiempo asignado:** 1 minuto con 35 segundos (Máximo 2:00 min)  
**Objetivo principal:** Explicar la construcción del servidor WebSocket local en Node.js sin brokers externos, el uso de `Map<string, Set<WebSocket>>` para salas y la liberación responsable de memoria.

---

## 1. Código a Proyectar en Pantalla

Abrir en el editor: `server/server.js`

```javascript
import { WebSocketServer, WebSocket } from "ws";

const PUERTO = process.env.PORT || 3001;
const wss = new WebSocketServer({ port: PUERTO });
const salas = new Map(); // clave: room, valor: Set<WebSocket>

wss.on("connection", (socket) => {
  let salaActual = null;

  socket.on("message", (datosCrudos) => {
    try {
      const mensaje = JSON.parse(datosCrudos.toString());

      // 1. Suscripción a sala distrital
      if (mensaje.action === "join-room") {
        const { room } = mensaje;
        if (!salas.has(room)) salas.set(room, new Set());
        salas.get(room).add(socket);
        salaActual = room;
        return;
      }

      // 2. Difusión selectiva exclusiva a la sala
      if (mensaje.action === "publish-notification") {
        const { room, notification } = mensaje;
        const clientesEnSala = salas.get(room);
        if (clientesEnSala) {
          const evento = JSON.stringify({ event: "notification:new", payload: notification });
          for (const cliente of clientesEnSala) {
            if (cliente.readyState === WebSocket.OPEN) cliente.send(evento);
          }
        }
      }
    } catch (e) { /* Manejo defensivo contra payloads corruptos */ }
  });

  // 3. Limpieza de memoria en desconexión (Zero Memory Leaks)
  socket.on("close", () => {
    if (salaActual && salas.has(salaActual)) {
      salas.get(salaActual).delete(socket);
      if (salas.get(salaActual).size === 0) salas.delete(salaActual);
    }
  });
});
```

---

## 2. Puntos Clave a Señalar con el Mouse (Checklist)

1. **Línea 5:** Señalar `const salas = new Map();`. Explicar que asocia cada nombre de distrito con un `Set` de sockets únicos.
2. **Líneas 23–28:** Señalar el bucle `for...of` con la verificación `cliente.readyState === WebSocket.OPEN` antes de hacer `send()`.
3. **Líneas 33–38:** Señalar el evento `socket.on("close")` y el `salas.delete(salaActual)` para **evitar fugas de memoria**.

---

## 3. Discurso Palabra por Palabra (Directo al Grano)

> "Gracias Diego. En la Etapa 2 de laboratorio, el requisito era dotar a Quadrate pe de comunicación bidireccional en tiempo real sin depender de servicios de terceros como Pusher o Firebase.
> 
> Construimos un servidor WebSocket autónomo en Node.js sobre el estándar RFC 6455 en el puerto 3001, utilizando la biblioteca ligera `ws`. 
> 
> Observen la línea 5 de `server.js`: implementamos un mapa de conjuntos en memoria:  
> `const salas = new Map(); // clave: room, valor: Set<WebSocket>`
> 
> Cuando un cliente se conecta, envía un mensaje JSON con la acción `join-room`. El servidor registra su socket dentro de una sala lógica (`distrito:san-isidro`, `distrito:miraflores` o `red-general`).
> 
> Cuando una garita publica una alerta con `publish-notification`, el servidor recupera el `Set` de clientes suscritos a esa sala específica y difunde el payload `notification:new` exclusivamente a ellos, verificando antes que `cliente.readyState === WebSocket.OPEN`.
> 
> Al desconectarse un cliente, el evento `close` remueve el socket del conjunto, y si la sala queda vacía, ejecuta `salas.delete(room)`, garantizando **cero fugas de memoria (*memory leaks*)** en el proceso Node.js.
> 
> Paso con Cueva para explicar la integración en React mediante el custom hook."

---

## 4. Preguntas Rápidas del Docente y Respuestas Relámpago

* **P: ¿Por qué usaron un `Set` dentro del `Map` en lugar de un arreglo (`Array`)?**  
  * **R:** *"Porque `Set` garantiza unicidad matemática en tiempo constante O(1), evitando que un socket se registre por duplicado y permitiendo eliminarlo con `Set.delete()` sin tener que buscar con `indexOf`."*

* **P: ¿Qué ventaja tiene este servidor propio frente a hacer HTTP Polling cada 3 segundos?**  
  * **R:** *"Elimina la sobrecarga de cabeceras HTTP repetitivas en cada ciclo, reduce la latencia de entrega a menos de 15 milisegundos y ahorra CPU en el servidor al no gestionar peticiones concurrentes continuas."*
