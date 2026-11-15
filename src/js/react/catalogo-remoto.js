/**
 * catalogo-remoto.js — Compilado para Navegador
 */
const React = window.React;
const { useState } = React;
import { useExperiences } from "../../features/catalog/useExperiences.js";

/**
 * Componente de Catálogo Remoto con TanStack Query.
 * Demuestra estados asíncronos rigurosos (isPending, isError, data),
 * paginación interactiva y reutilización automática de memoria caché (staleTime: 2 min).
 */
export function CatalogoRemoto() {
  const [page, setPage] = useState(1);
  const {
    data,
    isPending,
    isError,
    error,
    refetch,
    isFetching
  } = useExperiences(page);
  return /*#__PURE__*/React.createElement("section", {
    className: "catalogo-remoto",
    "aria-label": "Catálogo dinámico de experiencias y cocheras"
  }, /*#__PURE__*/React.createElement("header", {
    className: "catalogo-remoto__header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "catalogo-remoto__header-texto"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "catalogo-remoto__title"
  }, "Catálogo Dinámico (TanStack Query)"), /*#__PURE__*/React.createElement("p", {
    className: "catalogo-remoto__subtitle"
  }, "Consumo REST paginado desde JSONPlaceholder con caché inteligente (staleTime: 2 min).")), /*#__PURE__*/React.createElement("div", {
    className: "catalogo-remoto__badge-cache"
  }, /*#__PURE__*/React.createElement("span", {
    className: "catalogo-remoto__pill"
  }, isFetching ? "⏳ Sincronizando red..." : "⚡ Datos frescos en caché"))), isPending && /*#__PURE__*/React.createElement("div", {
    className: "catalogo-remoto__estado catalogo-remoto__estado--loading",
    role: "status",
    "aria-live": "polite"
  }, /*#__PURE__*/React.createElement("div", {
    className: "catalogo-remoto__spinner",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("p", {
    className: "catalogo-remoto__mensaje"
  }, "Consultando catálogo remoto (página ", page, ")...")), isError && /*#__PURE__*/React.createElement("div", {
    className: "catalogo-remoto__estado catalogo-remoto__estado--error",
    role: "alert"
  }, /*#__PURE__*/React.createElement("p", {
    className: "catalogo-remoto__error-titulo"
  }, "No se pudo cargar el catálogo de experiencias"), /*#__PURE__*/React.createElement("p", {
    className: "catalogo-remoto__error-detalle"
  }, error?.message || "Ocurrió un error inesperado al consultar el servidor."), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "catalogo-remoto__btn catalogo-remoto__btn--reintentar",
    onClick: () => refetch()
  }, "Reintentar consulta")), !isPending && !isError && data && /*#__PURE__*/React.createElement("div", {
    className: "catalogo-remoto__grid",
    role: "region",
    "aria-label": "Tarjetas del catálogo"
  }, data.map(item => /*#__PURE__*/React.createElement("article", {
    key: item.id,
    className: "catalogo-remoto__card"
  }, /*#__PURE__*/React.createElement("header", {
    className: "catalogo-remoto__card-header"
  }, /*#__PURE__*/React.createElement("span", {
    className: "catalogo-remoto__card-id"
  }, "Ref #", item.id), /*#__PURE__*/React.createElement("span", {
    className: "catalogo-remoto__card-tag"
  }, "Red Lima")), /*#__PURE__*/React.createElement("h4", {
    className: "catalogo-remoto__card-title"
  }, item.title), /*#__PURE__*/React.createElement("p", {
    className: "catalogo-remoto__card-body"
  }, item.body)))), /*#__PURE__*/React.createElement("footer", {
    className: "catalogo-remoto__paginacion",
    "aria-label": "Navegación de páginas"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "catalogo-remoto__btn-nav",
    disabled: page === 1 || isPending,
    onClick: () => setPage(p => Math.max(1, p - 1)),
    "aria-label": "Página anterior"
  }, "← Anterior"), /*#__PURE__*/React.createElement("span", {
    className: "catalogo-remoto__pagina-indicador",
    "aria-current": "page"
  }, "Página ", /*#__PURE__*/React.createElement("strong", null, page)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "catalogo-remoto__btn-nav",
    disabled: isPending,
    onClick: () => setPage(p => p + 1),
    "aria-label": "Página siguiente"
  }, "Siguiente →")));
}
