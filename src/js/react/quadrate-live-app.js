/**
 * quadrate-live-app.js — Compilado para Navegador
 */
const React = window.React;
const { useState, useEffect, useRef } = React;
import { DATOS_COCHERAS_INICIALES, DISTRITOS_DISPONIBLES } from "./datos-cocheras.js";
import { SaludoUsuario } from "./saludo-usuario.js";
import { TarjetaCochera } from "./tarjeta-cochera.js";
import { MonitorActividad } from "./monitor-actividad.js";
import { SimuladorReserva } from "./simulador-reserva.js";
import { ContenedorLive } from "./contenedor-live.js";

/**
 * Componente principal de la demo Quadrate Live.
 * Arquitectura React con telemetría WebSocket nativa, estado reactivo,
 * catálogo de disponibilidad y simulador de reserva por ETA.
 */
export function QuadrateLiveApp() {
  const [distritoSeleccionado, setDistritoSeleccionado] = useState("Todos");
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [cocheraSeleccionada, setCocheraSeleccionada] = useState(DATOS_COCHERAS_INICIALES[0]);
  const [cocheras, setCocheras] = useState(DATOS_COCHERAS_INICIALES);
  const [estaCargando, setEstaCargando] = useState(false);
  const [tiempoSesionTexto, setTiempoSesionTexto] = useState("00:00");
  const [estadoWs, setEstadoWs] = useState("conectando");
  const [eventosTelemetria, setEventosTelemetria] = useState([]);
  const [cocheraActualizadaId, setCocheraActualizadaId] = useState(null);
  const [estaPausado, setEstaPausado] = useState(false);
  const campoBusquedaRef = useRef(null);
  const socketRef = useRef(null);

  // Filtrado reactivo por distrito con feedback asíncrono
  useEffect(() => {
    setEstaCargando(true);
    const timer = setTimeout(() => {
      const filtradas = distritoSeleccionado === "Todos" ? DATOS_COCHERAS_INICIALES : DATOS_COCHERAS_INICIALES.filter(c => c.distrito.toLowerCase() === distritoSeleccionado.toLowerCase());
      setCocheras(filtradas);
      setEstaCargando(false);
    }, 350);
    return () => clearTimeout(timer);
  }, [distritoSeleccionado]);

  // Atajo de teclado: presionar '/' para enfocar buscador, 'Esc' para limpiar
  useEffect(() => {
    const manejarTecladoGlobal = evento => {
      if (evento.key === "/" && document.activeElement !== campoBusquedaRef.current) {
        evento.preventDefault();
        campoBusquedaRef.current?.focus();
      } else if (evento.key === "Escape" && document.activeElement === campoBusquedaRef.current) {
        setTerminoBusqueda("");
        campoBusquedaRef.current?.blur();
      }
    };
    window.addEventListener("keydown", manejarTecladoGlobal);
    return () => window.removeEventListener("keydown", manejarTecladoGlobal);
  }, []);

  // Conexión WebSocket RFC 6455 nativa para telemetría operativa
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
        ws.onmessage = evento => {
          if (estaPausado) return;
          try {
            const dato = JSON.parse(evento.data);
            const idItem = Date.now() + Math.random().toString(36).slice(2, 6);
            const nuevoEvento = {
              ...dato,
              id: idItem
            };
            setEventosTelemetria(previos => [nuevoEvento, ...previos.slice(0, 3)]);
            if (dato.cocheraId && dato.datos) {
              setCocheraActualizadaId(dato.cocheraId);
              setTimeout(() => setCocheraActualizadaId(null), 2500);
              setCocheras(cocherasPrevias => cocherasPrevias.map(c => {
                if (c.id === dato.cocheraId) {
                  const actualizado = {
                    ...c,
                    plazasDisponibles: dato.datos.plazasDisponibles ?? dato.datos.plazasLibres ?? c.plazasDisponibles,
                    plazasLibres: dato.datos.plazasLibres ?? dato.datos.plazasDisponibles ?? c.plazasLibres,
                    porcentajeOcupacion: dato.datos.porcentajeOcupacion ?? c.porcentajeOcupacion,
                    estadoAforo: dato.datos.estadoAforo ?? c.estadoAforo,
                    tarifaHora: dato.datos.tarifaHora ?? c.tarifaHora
                  };
                  setCocheraSeleccionada(sel => sel?.id === c.id ? actualizado : sel);
                  return actualizado;
                }
                return c;
              }));
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
  const cocherasVisibles = cocheras.filter(item => {
    const busquedaLimpia = terminoBusqueda.trim().toLowerCase();
    if (!busquedaLimpia) return true;
    return item.nombre.toLowerCase().includes(busquedaLimpia) || item.direccion.toLowerCase().includes(busquedaLimpia) || item.distrito.toLowerCase().includes(busquedaLimpia);
  });
  return /*#__PURE__*/React.createElement(ContenedorLive, {
    titulo: "Centro de Operaciones y Aforo en Vivo",
    subtitulo: "Monitoreo de red de cocheras en Lima. Telemetría de garitas, aforo y reservas dinámicas por ETA.",
    cabeceraSaludo: /*#__PURE__*/React.createElement(SaludoUsuario, {
      totalCocheras: cocheras.length,
      estadoWs: estadoWs,
      onSimularEvento: simularEventoGarita,
      estaPausado: estaPausado,
      onAlternarPausa: () => setEstaPausado(p => !p)
    }),
    monitor: /*#__PURE__*/React.createElement(MonitorActividad, {
      onTick: manejarTickMonitor,
      estadoWs: estadoWs
    }),
    feedTelemetria: /*#__PURE__*/React.createElement("div", {
      className: "quadrate-live__feed",
      role: "region",
      "aria-label": "Registro de telemetría operativa en vivo"
    }, /*#__PURE__*/React.createElement("div", {
      className: "quadrate-live__feed-header"
    }, /*#__PURE__*/React.createElement("span", {
      className: "quadrate-live__feed-title"
    }, "Registro de Telemetría Operativa"), /*#__PURE__*/React.createElement("span", {
      className: "quadrate-live__feed-status"
    }, estaPausado ? "⏸ En pausa" : "● Recibiendo eventos")), /*#__PURE__*/React.createElement("div", {
      className: "quadrate-live__feed-lista"
    }, eventosTelemetria.length === 0 ? /*#__PURE__*/React.createElement("p", {
      className: "quadrate-live__feed-empty"
    }, "Enlace activo. Esperando el próximo reporte de garitas en Lima...") : eventosTelemetria.map(evento => /*#__PURE__*/React.createElement("div", {
      key: evento.id,
      className: `quadrate-live__feed-item quadrate-live__feed-item--${evento.tipo}`
    }, /*#__PURE__*/React.createElement("span", {
      className: "quadrate-live__feed-time"
    }, evento.timestamp), /*#__PURE__*/React.createElement("span", {
      className: "quadrate-live__feed-badge"
    }, evento.tipo === "ingreso" && "Check-in LPR", evento.tipo === "salida" && "Check-out", evento.tipo === "reserva_eta" && "Reserva ETA", evento.tipo === "tarifa_dinamica" && "Franja Valle", evento.tipo === "aforo_critico" && "Alerta Aforo", evento.tipo === "conexion" && "Enlace"), /*#__PURE__*/React.createElement("span", {
      className: "quadrate-live__feed-cochera"
    }, evento.nombreCochera ? `${evento.nombreCochera} · ` : ""), /*#__PURE__*/React.createElement("span", {
      className: "quadrate-live__feed-msg"
    }, evento.mensaje))))),
    barraBusqueda: /*#__PURE__*/React.createElement("div", {
      className: "quadrate-live__toolbar"
    }, /*#__PURE__*/React.createElement("div", {
      className: "quadrate-live__search-box"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: "quadrate-live-input",
      className: "quadrate-live__search-label"
    }, "Buscar cochera o calle:"), /*#__PURE__*/React.createElement("div", {
      className: "quadrate-live__search-input-group"
    }, /*#__PURE__*/React.createElement("input", {
      ref: campoBusquedaRef,
      id: "quadrate-live-input",
      type: "search",
      className: "quadrate-live__search-input",
      placeholder: "Begonias, Larco, Canaval... (Presioná / para buscar)",
      value: terminoBusqueda,
      onChange: e => setTerminoBusqueda(e.target.value)
    }), terminoBusqueda && /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "quadrate-live__search-clear",
      onClick: () => {
        setTerminoBusqueda("");
        campoBusquedaRef.current?.focus();
      },
      "aria-label": "Limpiar búsqueda"
    }, "✕"))), /*#__PURE__*/React.createElement("div", {
      className: "quadrate-live__filtros"
    }, /*#__PURE__*/React.createElement("span", {
      className: "quadrate-live__filtros-label"
    }, "Distritos:"), /*#__PURE__*/React.createElement("div", {
      className: "quadrate-live__filtros-pills"
    }, DISTRITOS_DISPONIBLES.map(distrito => /*#__PURE__*/React.createElement("button", {
      key: distrito,
      type: "button",
      className: `quadrate-live__filtro-pill ${distritoSeleccionado === distrito ? "quadrate-live__filtro-pill--activo" : ""}`,
      onClick: () => setDistritoSeleccionado(distrito)
    }, distrito))))),
    panelDetalle: cocheraSeleccionada && /*#__PURE__*/React.createElement(SimuladorReserva, {
      cochera: cocheraSeleccionada,
      onCerrar: () => setCocheraSeleccionada(null)
    })
  }, estaCargando ? /*#__PURE__*/React.createElement("div", {
    className: "quadrate-live__loading",
    role: "status",
    "aria-live": "polite"
  }, /*#__PURE__*/React.createElement("div", {
    className: "quadrate-live__spinner",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("p", {
    className: "quadrate-live__loading-text"
  }, "Consultando aforo con garitas en ", distritoSeleccionado, "...")) : cocherasVisibles.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "quadrate-live__empty"
  }, /*#__PURE__*/React.createElement("p", null, "No se encontraron playas de estacionamiento para el criterio especificado."), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "quadrate-live__btn quadrate-live__btn--secundario",
    onClick: () => {
      setTerminoBusqueda("");
      setDistritoSeleccionado("Todos");
      campoBusquedaRef.current?.focus();
    }
  }, "Restablecer filtros")) : /*#__PURE__*/React.createElement("div", {
    className: "quadrate-live__grid",
    role: "region",
    "aria-label": "Catálogo de cocheras"
  }, cocherasVisibles.map(cochera => /*#__PURE__*/React.createElement(TarjetaCochera, {
    key: cochera.id,
    cochera: cochera,
    estaSeleccionada: cocheraSeleccionada?.id === cochera.id,
    estaActualizada: cocheraActualizadaId === cochera.id,
    onSeleccionarCochera: c => setCocheraSeleccionada(c)
  }))));
}
