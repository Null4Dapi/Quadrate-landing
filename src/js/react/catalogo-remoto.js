/**
 * catalogo-remoto.js — Compilado para Navegador
 */
const React = window.React;
const { useState, useEffect, useRef } = React;
import { useCocherasQuery } from "../../features/catalog/useExperiences.js";
import { DISTRITOS_DISPONIBLES } from "./datos-cocheras.js";
import { TarjetaCochera } from "./tarjeta-cochera.js";

/**
 * Skeleton accesible de tarjeta de cochera para estados de carga sin salto visual.
 */
function SkeletonTarjetaCochera() {
  return /*#__PURE__*/React.createElement("div", {
    className: "cochera-skeleton",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cochera-skeleton__header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cochera-skeleton__bar cochera-skeleton__bar--sm"
  }), /*#__PURE__*/React.createElement("div", {
    className: "cochera-skeleton__pill"
  })), /*#__PURE__*/React.createElement("div", {
    className: "cochera-skeleton__bar cochera-skeleton__bar--lg"
  }), /*#__PURE__*/React.createElement("div", {
    className: "cochera-skeleton__bar cochera-skeleton__bar--md"
  }), /*#__PURE__*/React.createElement("div", {
    className: "cochera-skeleton__metricas"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cochera-skeleton__caja"
  }), /*#__PURE__*/React.createElement("div", {
    className: "cochera-skeleton__caja"
  }), /*#__PURE__*/React.createElement("div", {
    className: "cochera-skeleton__caja"
  })), /*#__PURE__*/React.createElement("div", {
    className: "cochera-skeleton__footer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cochera-skeleton__bar cochera-skeleton__bar--sm"
  }), /*#__PURE__*/React.createElement("div", {
    className: "cochera-skeleton__btn"
  })));
}

/**
 * Catálogo inteligente de cocheras en Lima Metropolitana.
 * Conecta con la API REST paginada vía TanStack Query (Semana 11),
 * gestiona estados asíncronos rigurosos (isPending, isError, data),
 * paginación en red y reutilización automática de memoria caché (staleTime 2 min).
 *
 * @param {Object} props
 * @param {Object} [props.cocheraSeleccionada]
 * @param {Function} props.onSeleccionarCochera
 * @param {string|null} [props.cocheraActualizadaId]
 */
export function CatalogoRemoto({
  cocheraSeleccionada,
  onSeleccionarCochera,
  cocheraActualizadaId
}) {
  const [pagina, setPagina] = useState(1);
  const [distrito, setDistrito] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");
  const campoBusquedaRef = useRef(null);

  // Consulta asíncrona reactiva con TanStack Query y caché inteligente
  const {
    data,
    isPending,
    isError,
    error,
    refetch,
    isFetching
  } = useCocherasQuery({
    pagina,
    distrito,
    busqueda
  });

  // Atajos de teclado accesibles: '/' enfocar búsqueda, 'Esc' limpiar
  useEffect(() => {
    const manejarTeclado = e => {
      if (e.key === "/" && document.activeElement !== campoBusquedaRef.current) {
        e.preventDefault();
        campoBusquedaRef.current?.focus();
      } else if (e.key === "Escape" && document.activeElement === campoBusquedaRef.current) {
        setBusqueda("");
        setPagina(1);
        campoBusquedaRef.current?.blur();
      }
    };
    window.addEventListener("keydown", manejarTeclado);
    return () => window.removeEventListener("keydown", manejarTeclado);
  }, []);
  const cambiarDistrito = nuevoDistrito => {
    setDistrito(nuevoDistrito);
    setPagina(1);
  };
  const cambiarBusqueda = evento => {
    setBusqueda(evento.target.value);
    setPagina(1);
  };
  const limpiarFiltros = () => {
    setBusqueda("");
    setDistrito("Todos");
    setPagina(1);
    campoBusquedaRef.current?.focus();
  };
  return /*#__PURE__*/React.createElement("section", {
    className: "catalogo-remoto",
    "aria-label": "Catálogo de playas de estacionamiento en Lima"
  }, /*#__PURE__*/React.createElement("header", {
    className: "catalogo-remoto__header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "catalogo-remoto__titulos"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "catalogo-remoto__titulo"
  }, "Red de Playas Conectadas"), /*#__PURE__*/React.createElement("p", {
    className: "catalogo-remoto__subtitulo"
  }, "Disponibilidad de aforo y tarifas dinámicas en Lima Metropolitana")), /*#__PURE__*/React.createElement("div", {
    className: "catalogo-remoto__badge-cache",
    title: "Almacenamiento en memoria para navegación instantánea"
  }, /*#__PURE__*/React.createElement("span", {
    className: `catalogo-remoto__pill ${isFetching ? "catalogo-remoto__pill--sync" : "catalogo-remoto__pill--cache"}`
  }, isFetching ? "Sincronizando red..." : "TanStack Query · Caché 2m"))), /*#__PURE__*/React.createElement("div", {
    className: "catalogo-remoto__toolbar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "catalogo-remoto__search-box"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "catalogo-search-input",
    className: "catalogo-remoto__search-label"
  }, "Buscar playa o dirección:"), /*#__PURE__*/React.createElement("div", {
    className: "catalogo-remoto__search-group"
  }, /*#__PURE__*/React.createElement("input", {
    ref: campoBusquedaRef,
    id: "catalogo-search-input",
    type: "search",
    className: "catalogo-remoto__search-input",
    placeholder: "Begonias, Larco, Canaval... (Presioná / para buscar)",
    value: busqueda,
    onChange: cambiarBusqueda
  }), busqueda && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "catalogo-remoto__search-clear",
    onClick: limpiarFiltros,
    "aria-label": "Limpiar búsqueda"
  }, "✕"))), /*#__PURE__*/React.createElement("div", {
    className: "catalogo-remoto__filtros"
  }, /*#__PURE__*/React.createElement("span", {
    className: "catalogo-remoto__filtros-label"
  }, "Distritos:"), /*#__PURE__*/React.createElement("div", {
    className: "catalogo-remoto__pills-group"
  }, DISTRITOS_DISPONIBLES.map(d => /*#__PURE__*/React.createElement("button", {
    key: d,
    type: "button",
    className: `catalogo-remoto__filtro-btn ${distrito === d ? "catalogo-remoto__filtro-btn--activo" : ""}`,
    onClick: () => cambiarDistrito(d)
  }, d))))), isPending && /*#__PURE__*/React.createElement("div", {
    className: "quadrate-live__grid",
    role: "status",
    "aria-live": "polite",
    "aria-busy": "true",
    "aria-label": "Cargando cocheras..."
  }, /*#__PURE__*/React.createElement(SkeletonTarjetaCochera, null), /*#__PURE__*/React.createElement(SkeletonTarjetaCochera, null), /*#__PURE__*/React.createElement(SkeletonTarjetaCochera, null)), isError && /*#__PURE__*/React.createElement("div", {
    className: "catalogo-remoto__error-box",
    role: "alert"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "catalogo-remoto__error-titulo"
  }, "No se pudo consultar el catálogo de garitas"), /*#__PURE__*/React.createElement("p", {
    className: "catalogo-remoto__error-detalle"
  }, error?.message || "Ocurrió un problema de enlace con el servidor de catálogo."), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "catalogo-remoto__btn-reintentar",
    onClick: () => refetch()
  }, "Reintentar consulta")), !isPending && !isError && data && data.cocheras.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "catalogo-remoto__empty"
  }, /*#__PURE__*/React.createElement("p", null, "No se encontraron playas de estacionamiento para el filtro seleccionado."), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "catalogo-remoto__btn-reset",
    onClick: limpiarFiltros
  }, "Restablecer filtros")), !isPending && !isError && data && data.cocheras.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "quadrate-live__grid",
    role: "region",
    "aria-label": "Playas de estacionamiento disponibles"
  }, data.cocheras.map(cochera => /*#__PURE__*/React.createElement(TarjetaCochera, {
    key: cochera.id,
    cochera: cochera,
    estaSeleccionada: cocheraSeleccionada?.id === cochera.id,
    estaActualizada: cocheraActualizadaId === cochera.id,
    onSeleccionarCochera: onSeleccionarCochera
  }))), /*#__PURE__*/React.createElement("footer", {
    className: "catalogo-remoto__paginacion",
    "aria-label": "Paginación del catálogo"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "catalogo-remoto__btn-nav",
    disabled: pagina <= 1 || isPending,
    onClick: () => setPagina(p => Math.max(1, p - 1)),
    "aria-label": "Página anterior"
  }, "← Anterior"), /*#__PURE__*/React.createElement("span", {
    className: "catalogo-remoto__pagina-info",
    "aria-current": "page"
  }, "Página ", /*#__PURE__*/React.createElement("strong", null, data?.paginaActual || pagina), " de ", data?.totalPaginas || 1, data?.totalRegistros ? ` · ${data.totalRegistros} playas` : ""), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "catalogo-remoto__btn-nav",
    disabled: !data?.tieneSiguiente || isPending,
    onClick: () => setPagina(p => p + 1),
    "aria-label": "Página siguiente"
  }, "Siguiente →")));
}
