import React, { useState, useEffect, useRef } from "react";
import { DATOS_COCHERAS_INICIALES, DISTRITOS_DISPONIBLES } from "./datos-cocheras.js";
import { SaludoUsuario } from "./saludo-usuario.jsx";
import { TarjetaCochera } from "./tarjeta-cochera.jsx";
import { MonitorActividad } from "./monitor-actividad.jsx";
import { SimuladorReserva } from "./simulador-reserva.jsx";
import { ContenedorLive } from "./contenedor-live.jsx";

/**
 * Componente principal de Quadrate Live en React.
 * Integra hooks (useState, useEffect, useRef), eventos onClick,
 * composición padre-hijo y simulación asíncrona con temporizadores controlados.
 */
export function QuadrateLiveApp() {
  const [distritoSeleccionado, setDistritoSeleccionado] = useState("Todos");
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [cocheraSeleccionada, setCocheraSeleccionada] = useState(DATOS_COCHERAS_INICIALES[0]);
  const [cocheras, setCocheras] = useState([]);
  const [estaCargando, setEstaCargando] = useState(true);
  const [tiempoSesionTexto, setTiempoSesionTexto] = useState("00:00");
  const [contadorRecargas, setContadorRecargas] = useState(0);

  const campoBusquedaRef = useRef(null);

  const enfocarCampoBusqueda = () => {
    if (campoBusquedaRef.current) {
      campoBusquedaRef.current.focus();
    }
  };

  useEffect(() => {
    setEstaCargando(true);

    const temporizadorCarga = setTimeout(() => {
      const filtradas = distritoSeleccionado === "Todos"
        ? DATOS_COCHERAS_INICIALES
        : DATOS_COCHERAS_INICIALES.filter(
            (c) => c.distrito.toLowerCase() === distritoSeleccionado.toLowerCase()
          );

      setCocheras(filtradas);
      setEstaCargando(false);
    }, 750);

    return () => {
      clearTimeout(temporizadorCarga);
    };
  }, [distritoSeleccionado, contadorRecargas]);

  const manejarRefrescarCatalogo = () => {
    setContadorRecargas((previo) => previo + 1);
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
      titulo="Localizador y Monitor de Cocheras en Tiempo Real"
      subtitulo="Monitoreo de aforo sincronizado por telemetría y apartado inmediato por ETA en Lima."
      cabeceraSaludo={
        <SaludoUsuario
          nombreUsuario="Carlos Valdivia"
          rolUsuario="Conductor Premium"
          totalCocheras={DATOS_COCHERAS_INICIALES.length}
          tiempoActivo={tiempoSesionTexto}
        />
      }
      monitor={<MonitorActividad onTick={manejarTickMonitor} />}
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
                placeholder="Ej. Begonias, Larco, Canaval..."
                value={terminoBusqueda}
                onChange={(eventoInput) => setTerminoBusqueda(eventoInput.target.value)}
              />
              {terminoBusqueda && (
                <button
                  type="button"
                  className="quadrate-live__search-clear"
                  onClick={() => {
                    setTerminoBusqueda("");
                    enfocarCampoBusqueda();
                  }}
                  aria-label="Limpiar búsqueda"
                >
                  ✕
                </button>
              )}
            </div>
            <button
              type="button"
              className="quadrate-live__btn-focus"
              onClick={enfocarCampoBusqueda}
              aria-label="Enfocar campo de búsqueda"
            >
              Enfocar buscador
            </button>
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
            <button
              type="button"
              className="quadrate-live__btn-refresh"
              onClick={manejarRefrescarCatalogo}
              title="Simular recarga asíncrona de disponibilidad"
            >
              ↻ Sincronizar
            </button>
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
            Sincronizando aforo en tiempo real con garitas en {distritoSeleccionado}...
          </p>
        </div>
      ) : cocherasVisibles.length === 0 ? (
        <div className="quadrate-live__empty">
          <p>No se encontraron playas de estacionamiento para el criterio especificado.</p>
          <button
            type="button"
            className="quadrate-live__btn-reset"
            onClick={() => {
              setTerminoBusqueda("");
              setDistritoSeleccionado("Todos");
              enfocarCampoBusqueda();
            }}
          >
            Restablecer búsqueda y filtros
          </button>
        </div>
      ) : (
        <div className="quadrate-live__grid" role="region" aria-label="Catálogo de cocheras">
          {cocherasVisibles.map((cochera) => (
            <TarjetaCochera
              key={cochera.id}
              cochera={cochera}
              estaSeleccionada={cocheraSeleccionada?.id === cochera.id}
              onSeleccionarCochera={(cocheraElegida) => setCocheraSeleccionada(cocheraElegida)}
            />
          ))}
        </div>
      )}
    </ContenedorLive>
  );
}
