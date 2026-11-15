/**
 * catalogo-cocheras.js — Compilado para Navegador
 */
const React = window.React;
const { useState, useEffect, useRef } = React;
import { useCocherasQuery } from "./queries/use-cocheras-query.js";
import { useAppStore } from "./store/app-store.js";
import { TarjetaCochera } from "./tarjeta-cochera.js";

/**
 * Catálogo Paginado de Cocheras con TanStack Query.
 * Maneja Server State: carga asíncrona, caché en memoria, reintento y paginación.
 */
export function CatalogoCocheras({
  cocheraSeleccionadaId,
  cocheraActualizadaId,
  onSeleccionarCochera
}) {
  const [pagina, setPagina] = useState(1);
  const distritoPreferido = useAppStore(state => state.distritoPreferido);
  const modoVista = useAppStore(state => state.modoVista);

  // Reiniciar a página 1 al cambiar de distrito
  useEffect(() => {
    setPagina(1);
  }, [distritoPreferido]);
  const {
    data,
    isLoading,
    isError,
    error,
    isFetching,
    refetch
  } = useCocherasQuery({
    distrito: distritoPreferido,
    pagina,
    limitePorPagina: 3
  });
  return /*#__PURE__*/React.createElement("section", {
    className: "qlive-catalogo",
    "aria-label": "Catálogo de cocheras disponibles"
  }, /*#__PURE__*/React.createElement("header", {
    className: "qlive-catalogo__cabecera"
  }, /*#__PURE__*/React.createElement("div", {
    className: "qlive-catalogo__titulos"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "qlive-catalogo__titulo"
  }, "Cocheras en ", distritoPreferido), /*#__PURE__*/React.createElement("span", {
    className: "qlive-catalogo__subtitulo"
  }, isFetching ? "Sincronizando disponibilidad…" : `${data?.totalRegistros ?? 0} registradas`))), isLoading && /*#__PURE__*/React.createElement("div", {
    className: "quadrate-live__grid quadrate-live__grid--skeleton",
    "aria-busy": "true"
  }, [1, 2, 3].map(i => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "quadrate-live__card quadrate-live__card--skeleton"
  }, /*#__PURE__*/React.createElement("div", {
    className: "qlive-skeleton qlive-skeleton--cabecera"
  }), /*#__PURE__*/React.createElement("div", {
    className: "qlive-skeleton qlive-skeleton--titulo"
  }), /*#__PURE__*/React.createElement("div", {
    className: "qlive-skeleton qlive-skeleton--texto"
  }), /*#__PURE__*/React.createElement("div", {
    className: "qlive-skeleton qlive-skeleton--metricas"
  })))), isError && /*#__PURE__*/React.createElement("div", {
    className: "quadrate-live__error",
    role: "alert"
  }, /*#__PURE__*/React.createElement("p", {
    className: "quadrate-live__error-mensaje"
  }, "No se pudo cargar el catálogo de cocheras: ", error?.message || "Error de red"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "qlive-boton",
    onClick: () => refetch()
  }, "Reintentar consulta")), !isLoading && !isError && data && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: `quadrate-live__grid ${modoVista === "lista" ? "quadrate-live__grid--lista" : ""}`
  }, data.datos.map(cochera => /*#__PURE__*/React.createElement(TarjetaCochera, {
    key: cochera.id,
    cochera: cochera,
    estaSeleccionada: cochera.id === cocheraSeleccionadaId,
    estaActualizada: cochera.id === cocheraActualizadaId,
    onSeleccionarCochera: onSeleccionarCochera
  }))), /*#__PURE__*/React.createElement("nav", {
    className: "qlive-paginacion",
    "aria-label": "Paginación del catálogo de cocheras"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "qlive-paginacion__boton",
    onClick: () => setPagina(p => Math.max(1, p - 1)),
    disabled: !data.tieneAnterior || isFetching,
    "aria-label": "Página anterior"
  }, "← Anterior"), /*#__PURE__*/React.createElement("span", {
    className: "qlive-paginacion__info"
  }, "Página ", /*#__PURE__*/React.createElement("strong", null, data.paginaActual), " de ", /*#__PURE__*/React.createElement("strong", null, data.totalPaginas)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "qlive-paginacion__boton",
    onClick: () => setPagina(p => p + 1),
    disabled: !data.tieneSiguiente || isFetching,
    "aria-label": "Página siguiente"
  }, "Siguiente →"))));
}
