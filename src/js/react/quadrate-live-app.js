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
      const filtradas = distritoSeleccionado === "Todos" ? DATOS_COCHERAS_INICIALES : DATOS_COCHERAS_INICIALES.filter(c => c.distrito.toLowerCase() === distritoSeleccionado.toLowerCase());
      setCocheras(filtradas);
      setEstaCargando(false);
    }, 750);
    return () => {
      clearTimeout(temporizadorCarga);
    };
  }, [distritoSeleccionado, contadorRecargas]);
  const manejarRefrescarCatalogo = () => {
    setContadorRecargas(previo => previo + 1);
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
    titulo: "Localizador y Monitor de Cocheras en Tiempo Real",
    subtitulo: "Monitoreo de aforo sincronizado por telemetría y apartado inmediato por ETA en Lima.",
    cabeceraSaludo: /*#__PURE__*/React.createElement(SaludoUsuario, {
      nombreUsuario: "Carlos Valdivia",
      rolUsuario: "Conductor Premium",
      totalCocheras: DATOS_COCHERAS_INICIALES.length,
      tiempoActivo: tiempoSesionTexto
    }),
    monitor: /*#__PURE__*/React.createElement(MonitorActividad, {
      onTick: manejarTickMonitor
    }),
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
      placeholder: "Ej. Begonias, Larco, Canaval...",
      value: terminoBusqueda,
      onChange: eventoInput => setTerminoBusqueda(eventoInput.target.value)
    }), terminoBusqueda && /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "quadrate-live__search-clear",
      onClick: () => {
        setTerminoBusqueda("");
        enfocarCampoBusqueda();
      },
      "aria-label": "Limpiar búsqueda"
    }, "✕")), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "quadrate-live__btn-focus",
      onClick: enfocarCampoBusqueda,
      "aria-label": "Enfocar campo de búsqueda"
    }, "Enfocar buscador")), /*#__PURE__*/React.createElement("div", {
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
    }, distrito))), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "quadrate-live__btn-refresh",
      onClick: manejarRefrescarCatalogo,
      title: "Simular recarga asíncrona de disponibilidad"
    }, "↻ Sincronizar"))),
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
  }, "Sincronizando aforo en tiempo real con garitas en ", distritoSeleccionado, "...")) : cocherasVisibles.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "quadrate-live__empty"
  }, /*#__PURE__*/React.createElement("p", null, "No se encontraron playas de estacionamiento para el criterio especificado."), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "quadrate-live__btn-reset",
    onClick: () => {
      setTerminoBusqueda("");
      setDistritoSeleccionado("Todos");
      enfocarCampoBusqueda();
    }
  }, "Restablecer búsqueda y filtros")) : /*#__PURE__*/React.createElement("div", {
    className: "quadrate-live__grid",
    role: "region",
    "aria-label": "Catálogo de cocheras"
  }, cocherasVisibles.map(cochera => /*#__PURE__*/React.createElement(TarjetaCochera, {
    key: cochera.id,
    cochera: cochera,
    estaSeleccionada: cocheraSeleccionada?.id === cochera.id,
    onSeleccionarCochera: cocheraElegida => setCocheraSeleccionada(cocheraElegida)
  }))));
}
