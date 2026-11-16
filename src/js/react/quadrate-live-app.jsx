import React, { useState, useEffect, useRef } from "react";
import { ContenedorLive } from "./contenedor-live.jsx";
import { SaludoUsuario } from "./saludo-usuario.jsx";
import { MonitorActividad } from "./monitor-actividad.jsx";
import { SimuladorReserva } from "./simulador-reserva.jsx";
import { CatalogoRemoto } from "./catalogo-remoto.jsx";
import { TelemetriaFeedZustand, ControlTemaZustand } from "./notificaciones-panel.jsx";
import { useAppStore } from "../../store/appStore.js";
import { aplicarTemaVisualDOM } from "../../store/syncChannel.js";

/**
 * Componente principal de Quadrate Live — Arquitectura integrada Semana 11.
 * Articula TanStack Query (catálogo REST paginado y caché) con Zustand (estado global,
 * persistencia de tema, sincronización multi-pestaña y telemetría WebSocket).
 */
export function QuadrateLiveApp() {
  const [cocheraSeleccionada, setCocheraSeleccionada] = useState(null);
  const [estadoWs, setEstadoWs] = useState("conectando");
  const [cocheraActualizadaId, setCocheraActualizadaId] = useState(null);
  const [estaPausado, setEstaPausado] = useState(false);
  const socketRef = useRef(null);

  // Sincronización del tema visual (Zustand + BroadcastChannel)
  const temaStore = useAppStore((state) => state.theme);
  useEffect(() => {
    aplicarTemaVisualDOM(temaStore);
  }, [temaStore]);

  // Conexión WebSocket RFC 6455 nativa integrada con el Store Zustand
  useEffect(() => {
    let ws = null;
    let reconexionTimer = null;

    function conectarWebSocket() {
      const protocolo = window.location.protocol === "https:" ? "wss:" : "ws:";
      const urlWs = `${protocolo}//${window.location.host}/ws-telemetria`;

      try {
        ws = new WebSocket(urlWs);
        socketRef.current = ws;

        ws.onopen = () => {
          setEstadoWs("en vivo");
        };

        ws.onmessage = (evento) => {
          if (estaPausado) return;

          try {
            const dato = JSON.parse(evento.data);
            const idItem = Date.now() + Math.random().toString(36).slice(2, 6);

            // Integración reactiva con el Store Zustand (Semana 11)
            useAppStore.getState().addNotification({
              id: String(idItem),
              tipo: dato.tipo || "operativo",
              nombreCochera: dato.nombreCochera || "",
              timestamp: dato.timestamp || new Date().toLocaleTimeString(),
              message: String(dato.mensaje || `Evento operativo: Cochera ${dato.cocheraId || "Lima"}`),
              createdAt: new Date().toISOString(),
            });

            if (dato.cocheraId) {
              setCocheraActualizadaId(dato.cocheraId);
              setTimeout(() => setCocheraActualizadaId(null), 2500);
            }
          } catch (err) {
            console.error("Error al procesar trama de telemetría:", err);
          }
        };

        ws.onclose = () => {
          setEstadoWs("reconectando");
          reconexionTimer = setTimeout(conectarWebSocket, 4000);
        };

        ws.onerror = () => {
          setEstadoWs("desconectado");
          if (ws) ws.close();
        };
      } catch (e) {
        setEstadoWs("desconectado");
        reconexionTimer = setTimeout(conectarWebSocket, 4000);
      }
    }

    conectarWebSocket();

    return () => {
      if (ws) ws.close();
      if (reconexionTimer) clearTimeout(reconexionTimer);
    };
  }, [estaPausado]);

  const simularEventoGarita = () => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ accion: "simular_evento" }));
    }
  };

  return (
    <ContenedorLive
      titulo="Centro de Operaciones y Catálogo Inteligente"
      subtitulo="Plataforma de cocheras en Lima. Integración TanStack Query + Zustand Store y Telemetría WebSocket."
      cabeceraSaludo={
        <SaludoUsuario
          totalCocheras={6}
          estadoWs={estadoWs}
          onSimularEvento={simularEventoGarita}
          estaPausado={estaPausado}
          onAlternarPausa={() => setEstaPausado((p) => !p)}
        />
      }
      monitor={
        <div className="quadrate-live__monitor-group">
          <MonitorActividad estadoWs={estadoWs} />
          <ControlTemaZustand />
        </div>
      }
      feedTelemetria={
        <TelemetriaFeedZustand
          estaPausado={estaPausado}
          onAlternarPausa={() => setEstaPausado((p) => !p)}
        />
      }
      panelDetalle={
        cocheraSeleccionada && (
          <SimuladorReserva
            cochera={cocheraSeleccionada}
            onCerrar={() => setCocheraSeleccionada(null)}
          />
        )
      }
    >
      <CatalogoRemoto
        cocheraSeleccionada={cocheraSeleccionada}
        onSeleccionarCochera={(c) => setCocheraSeleccionada(c)}
        cocheraActualizadaId={cocheraActualizadaId}
      />
    </ContenedorLive>
  );
}
