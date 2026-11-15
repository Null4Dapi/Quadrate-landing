import React, { useState, useEffect, useRef } from "react";
import { DATOS_COCHERAS_INICIALES, DISTRITOS_DISPONIBLES } from "./datos-cocheras.js";
import { SaludoUsuario } from "./saludo-usuario.jsx";
import { TarjetaCochera } from "./tarjeta-cochera.jsx";
import { MonitorActividad } from "./monitor-actividad.jsx";
import { SimuladorReserva } from "./simulador-reserva.jsx";
import { ContenedorLive } from "./contenedor-live.jsx";

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
      const filtradas = distritoSeleccionado === "Todos"
        ? DATOS_COCHERAS_INICIALES
        : DATOS_COCHERAS_INICIALES.filter(
            (c) => c.distrito.toLowerCase() === distritoSeleccionado.toLowerCase()
          );
      setCocheras(filtradas);
      setEstaCargando(false);
    }, 350);

    return () => clearTimeout(timer);
  }, [distritoSeleccionado]);

  // Atajo de teclado: presionar '/' para enfocar buscador, 'Esc' para limpiar
  useEffect(() => {
    const manejarTecladoGlobal = (evento) => {
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

        ws.onmessage = (evento) => {
          if (estaPausado) return;

          try {
            const dato = JSON.parse(evento.data);
            const idItem = Date.now() + Math.random().toString(36).slice(2, 6);
            const nuevoEvento = { ...dato, id: idItem };

            setEventosTelemetria((previos) => [nuevoEvento, ...previos.slice(0, 3)]);

            if (dato.cocheraId && dato.datos) {
              setCocheraActualizadaId(dato.cocheraId);
              setTimeout(() => setCocheraActualizadaId(null), 2500);

              setCocheras((cocherasPrevias) =>
                cocherasPrevias.map((c) => {
                  if (c.id === dato.cocheraId) {
                    const actualizado = {
                      ...c,
                      plazasDisponibles: dato.datos.plazasDisponibles ?? dato.datos.plazasLibres ?? c.plazasDisponibles,
                      plazasLibres: dato.datos.plazasLibres ?? dato.datos.plazasDisponibles ?? c.plazasLibres,
                      porcentajeOcupacion: dato.datos.porcentajeOcupacion ?? c.porcentajeOcupacion,
                      estadoAforo: dato.datos.estadoAforo ?? c.estadoAforo,
                      tarifaHora: dato.datos.tarifaHora ?? c.tarifaHora,
                    };
                    setCocheraSeleccionada((sel) => (sel?.id === c.id ? actualizado : sel));
                    return actualizado;
                  }
                  return c;
                })
              );
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

  const manejarTickMonitor = (segundosTotales) => {
    const minutos = Math.floor(segundosTotales / 60).toString().padStart(2, "0");
    const segundos = (segundosTotales % 60).toString().padStart(2, "0");
    setTiempoSesionTexto(`${minutos}:${segundos}`);
  };

  const cocherasVisibles = cocheras.filter((item) => {
    const busquedaLimpia = terminoBusqueda.trim().toLowerCase();
    if (!busquedaLimpia) return true;
    return (
      item.nombre.toLowerCase().includes(busquedaLimpia) ||
      item.direccion.toLowerCase().includes(busquedaLimpia) ||
      item.distrito.toLowerCase().includes(busquedaLimpia)
    );
  });

  return (
    <ContenedorLive
      titulo="Centro de Operaciones y Aforo en Vivo"
      subtitulo="Monitoreo de red de cocheras en Lima. Telemetría de garitas, aforo y reservas dinámicas por ETA."
      cabeceraSaludo={
        <SaludoUsuario
          totalCocheras={cocheras.length}
          estadoWs={estadoWs}
          onSimularEvento={simularEventoGarita}
          estaPausado={estaPausado}
          onAlternarPausa={() => setEstaPausado((p) => !p)}
        />
      }
      monitor={<MonitorActividad onTick={manejarTickMonitor} estadoWs={estadoWs} />}
      feedTelemetria={
        <div className="quadrate-live__feed" role="region" aria-label="Registro de telemetría operativa en vivo">
          <div className="quadrate-live__feed-header">
            <span className="quadrate-live__feed-title">
              Registro de Telemetría Operativa
            </span>
            <span className="quadrate-live__feed-status">
              {estaPausado ? "⏸ En pausa" : "● Recibiendo eventos"}
            </span>
          </div>

          <div className="quadrate-live__feed-lista">
            {eventosTelemetria.length === 0 ? (
              <p className="quadrate-live__feed-empty">
                Enlace activo. Esperando el próximo reporte de garitas en Lima...
              </p>
            ) : (
              eventosTelemetria.map((evento) => (
                <div key={evento.id} className={`quadrate-live__feed-item quadrate-live__feed-item--${evento.tipo}`}>
                  <span className="quadrate-live__feed-time">{evento.timestamp}</span>
                  <span className="quadrate-live__feed-badge">
                    {evento.tipo === "ingreso" && "Check-in LPR"}
                    {evento.tipo === "salida" && "Check-out"}
                    {evento.tipo === "reserva_eta" && "Reserva ETA"}
                    {evento.tipo === "tarifa_dinamica" && "Franja Valle"}
                    {evento.tipo === "aforo_critico" && "Alerta Aforo"}
                    {evento.tipo === "conexion" && "Enlace"}
                  </span>
                  <span className="quadrate-live__feed-cochera">
                    {evento.nombreCochera ? `${evento.nombreCochera} · ` : ""}
                  </span>
                  <span className="quadrate-live__feed-msg">{evento.mensaje}</span>
                </div>
              ))
            )}
          </div>
        </div>
      }
      barraBusqueda={
        <div className="quadrate-live__toolbar">
          <div className="quadrate-live__search-box">
            <label htmlFor="quadrate-live-input" className="quadrate-live__search-label">
              Buscar cochera o calle:
            </label>
            <div className="quadrate-live__search-input-group">
              <input
                ref={campoBusquedaRef}
                id="quadrate-live-input"
                type="search"
                className="quadrate-live__search-input"
                placeholder="Begonias, Larco, Canaval... (Presioná / para buscar)"
                value={terminoBusqueda}
                onChange={(e) => setTerminoBusqueda(e.target.value)}
              />
              {terminoBusqueda && (
                <button
                  type="button"
                  className="quadrate-live__search-clear"
                  onClick={() => {
                    setTerminoBusqueda("");
                    campoBusquedaRef.current?.focus();
                  }}
                  aria-label="Limpiar búsqueda"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <div className="quadrate-live__filtros">
            <span className="quadrate-live__filtros-label">Distritos:</span>
            <div className="quadrate-live__filtros-pills">
              {DISTRITOS_DISPONIBLES.map((distrito) => (
                <button
                  key={distrito}
                  type="button"
                  className={`quadrate-live__filtro-pill ${
                    distritoSeleccionado === distrito
                      ? "quadrate-live__filtro-pill--activo"
                      : ""
                  }`}
                  onClick={() => setDistritoSeleccionado(distrito)}
                >
                  {distrito}
                </button>
              ))}
            </div>
          </div>
        </div>
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
      {estaCargando ? (
        <div className="quadrate-live__loading" role="status" aria-live="polite">
          <div className="quadrate-live__spinner" aria-hidden="true" />
          <p className="quadrate-live__loading-text">
            Consultando aforo con garitas en {distritoSeleccionado}...
          </p>
        </div>
      ) : cocherasVisibles.length === 0 ? (
        <div className="quadrate-live__empty">
          <p>No se encontraron playas de estacionamiento para el criterio especificado.</p>
          <button
            type="button"
            className="quadrate-live__btn quadrate-live__btn--secundario"
            onClick={() => {
              setTerminoBusqueda("");
              setDistritoSeleccionado("Todos");
              campoBusquedaRef.current?.focus();
            }}
          >
            Restablecer filtros
          </button>
        </div>
      ) : (
        <div className="quadrate-live__grid" role="region" aria-label="Catálogo de cocheras">
          {cocherasVisibles.map((cochera) => (
            <TarjetaCochera
              key={cochera.id}
              cochera={cochera}
              estaSeleccionada={cocheraSeleccionada?.id === cochera.id}
              estaActualizada={cocheraActualizadaId === cochera.id}
              onSeleccionarCochera={(c) => setCocheraSeleccionada(c)}
            />
          ))}
        </div>
      )}
    </ContenedorLive>
  );
}
