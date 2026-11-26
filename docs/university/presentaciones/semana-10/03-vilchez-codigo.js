/**
 * QUADRATE PE — SEMANA 10: CÓDIGO INDIVIDUAL
 * Integrante: VÍLCHEZ (3:05 - 4:40)
 * Tema: Servidor WebSocket Propio en Node.js, Biblioteca ws y Gestión de Salas
 * Archivo a proyectar en pantalla durante su grabación.
 */

import { WebSocketServer, WebSocket } from "ws";

const PUERTO = 3001;
const wss = new WebSocketServer({ port: PUERTO });

// 1. Mapeo en memoria de salas distritales (clave: room, valor: Set<WebSocket>)
const salas = new Map();

wss.on("connection", (socket) => {
  let salaActual = null;

  socket.on("message", (datosCrudos) => {
    try {
      const mensaje = JSON.parse(datosCrudos.toString());

      // 2. Suscripción a la sala distrital (ej. distrito:san-isidro)
      if (mensaje.action === "join-room") {
        const { room } = mensaje;
        if (!salas.has(room)) salas.set(room, new Set());
        salas.get(room).add(socket);
        salaActual = room;
        return;
      }

      // 3. Difusión selectiva exclusiva a los clientes de la sala
      if (mensaje.action === "publish-notification") {
        const clientesEnSala = salas.get(mensaje.room);
        if (clientesEnSala) {
          const evento = JSON.stringify({ event: "notification:new", payload: mensaje.notification });
          for (const cliente of clientesEnSala) {
            if (cliente.readyState === WebSocket.OPEN) cliente.send(evento);
          }
        }
      }
    } catch (err) { /* Manejo defensivo */ }
  });

  // 4. Liberación de memoria en desconexión (Zero Memory Leaks)
  socket.on("close", () => {
    if (salaActual && salas.has(salaActual)) {
      salas.get(salaActual).delete(socket);
      if (salas.get(salaActual).size === 0) salas.delete(salaActual);
    }
  });
});
