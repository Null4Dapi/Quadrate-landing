/**
 * QUADRATE PE — SEMANA 10: CÓDIGO INDIVIDUAL
 * Integrante: CUEVA (4:40 - 6:20)
 * Tema: Hook Cliente useExperienceSocket, Despacho a Context y Función de Limpieza (Cleanup)
 * Archivo a proyectar en pantalla durante su grabación.
 */

import { useEffect, useRef, useState } from "react";
import { useNotifications } from "./02-diego-codigo";

export function useExperienceSocket(sala: string = "red-cocheras-lima") {
  const { addNotification } = useNotifications();
  const [estadoConexion, setEstadoConexion] = useState<string>("conectando");
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // 1. Instanciación del socket local al puerto 3001
    const socket = new WebSocket("ws://localhost:3001");
    socketRef.current = socket;

    socket.onopen = () => {
      setEstadoConexion("conectado");
      socket.send(JSON.stringify({ action: "join-room", room: sala }));
    };

    socket.onmessage = (evento: MessageEvent) => {
      try {
        const data = JSON.parse(evento.data);
        if (data.event === "notification:new" && data.payload) {
          // 2. Puente: WebSocket transporta, Context distribuye a la UI de React
          addNotification(data.payload);
        }
      } catch (err) {
        console.error("[WS Cliente] Error:", err);
      }
    };

    socket.onclose = () => setEstadoConexion("desconectado");

    // 3. FUNCIÓN DE LIMPIEZA OBLIGATORIA (CLEANUP): Cierra el socket al desmontar
    return () => {
      if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
        socket.close();
      }
    };
  }, [sala, addNotification]);

  return { estadoConexion };
}
