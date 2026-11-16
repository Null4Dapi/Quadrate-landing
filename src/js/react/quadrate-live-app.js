/**
 * quadrate-live-app.js — Compilado para Navegador
 */
const React = window.React;
const { useState, useEffect, useRef } = React;
import { DATOS_COCHERAS_INICIALES } from "./datos-cocheras.js";
import { SaludoUsuario } from "./saludo-usuario.js";
import { MonitorActividad } from "./monitor-actividad.js";
import { SimuladorReserva } from "./simulador-reserva.js";
import { ContenedorLive } from "./contenedor-live.js";
import { BarraPreferencias } from "./barra-preferencias.js";
import { CatalogoCocheras } from "./catalogo-cocheras.js";
import { ToastContainer } from "./toast-container.js";
import { useAppStore } from "./store/app-store.js";
import { queryClient } from "./queries/use-cocheras-query.js";

/**
 * Componente principal de la demo Quadrate Live (Semana 11).
 * Arquitectura desacoplada:
 * - TanStack Query para Server State (catálogo paginado, loading, error y caché).
 * - Zustand para Client State (tema, preferencias de visualización y centro de toasts).
 * - WebSocket desacoplado: en local apunta a servidor propio; en producción a Cloud Run.
 */
export function QuadrateLiveApp() {
  const tema = useAppStore(state => state.tema);
  const agregarNotificacion = useAppStore(state => state.agregarNotificacion);
  const [cocheraSeleccionada, setCocheraSeleccionada] = useState(DATOS_COCHERAS_INICIALES[0]);
  const [cocheraActualizadaId, setCocheraActualizadaId] = useState(null);
  const [estadoWs, setEstadoWs] = useState("conectando");
  const [estaPausado, setEstaPausado] = useState(false);
  const [tiempoSesionTexto, setTiempoSesionTexto] = useState("00:00");
  const socketRef = useRef(null);

  // Conexión WebSocket RFC 6455 condicionada por entorno
  useEffect(() => {
    let ws = null;
    let reconexionTimer = null;
    function conectarWebSocket() {
      // Política estricta: en local NUNCA apuntar a Cloud Run; usar servidor propio
      const esLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
      const protocolo = window.location.protocol === "https:" ? "wss:" : "ws:";
      const urlWs = esLocal ? `${protocolo}//${window.location.host}/ws-telemetria` : "wss://quadrate-live-365843518799.southamerica-west1.run.app/ws";
      try {
        ws = new WebSocket(urlWs);
        socketRef.current = ws;
        ws.onopen = () => {
          setEstadoWs("en vivo");
        };
        ws.onmessage = evento => {
          if (estaPausado) return;
          try {
            const dato = JSON.parse(evento.data);

            // 1. Inyectar alerta al Store global de Zustand (Centro de Toasts)
            if (dato.titulo && dato.mensaje) {
              agregarNotificacion({
                tipo: dato.tipo || "info",
                titulo: dato.titulo,
                mensaje: dato.mensaje,
                distrito: dato.distrito || dato.nombreCochera || "Lima"
              });
            }

            // 2. Destello de cochera y sincronización reactiva de TanStack Query
            if (dato.cocheraId) {
              setCocheraActualizadaId(dato.cocheraId);
              setTimeout(() => setCocheraActualizadaId(null), 2500);

              // Invalida la caché del catálogo remoto para refrescar plazas
              queryClient.invalidateQueries(["cocheras"]);
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
  }, [estaPausado, agregarNotificacion]);
  const simularEventoGarita = () => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        accion: "simular_evento"
      }));
    }
  };
  const manejarTickMonitor = segundosTotales => {
    const minutos = Math.floor(segundosTotales / 60).toString().padStart(2, "0");
    const segundos = (segundosTotales % 60).toString().padStart(2, "0");
    setTiempoSesionTexto(`${minutos}:${segundos}`);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "qlive-app-wrapper",
    "data-tema": tema
  }, /*#__PURE__*/React.createElement(ContenedorLive, {
    titulo: "Centro de Operaciones y Catálogo en Vivo",
    subtitulo: "Monitoreo de red de cocheras en Lima. Telemetría de garitas, aforo y reservas dinámicas por ETA.",
    cabeceraSaludo: /*#__PURE__*/React.createElement(SaludoUsuario, {
      totalCocheras: DATOS_COCHERAS_INICIALES.length,
      estadoWs: estadoWs,
      onSimularEvento: simularEventoGarita,
      estaPausado: estaPausado,
      onAlternarPausa: () => setEstaPausado(p => !p)
    }),
    monitor: /*#__PURE__*/React.createElement(MonitorActividad, {
      onTick: manejarTickMonitor,
      estadoWs: estadoWs
    }),
    feedTelemetria: /*#__PURE__*/React.createElement(BarraPreferencias, null),
    panelDetalle: cocheraSeleccionada && /*#__PURE__*/React.createElement(SimuladorReserva, {
      cochera: cocheraSeleccionada,
      onCerrar: () => setCocheraSeleccionada(null)
    })
  }, /*#__PURE__*/React.createElement(CatalogoCocheras, {
    cocheraSeleccionadaId: cocheraSeleccionada?.id,
    cocheraActualizadaId: cocheraActualizadaId,
    onSeleccionarCochera: c => setCocheraSeleccionada(c)
  })), /*#__PURE__*/React.createElement(ToastContainer, null));
}
