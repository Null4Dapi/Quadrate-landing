/**
 * barra-preferencias.js — Compilado para Navegador
 */
const React = window.React;
import { useAppStore } from "./store/app-store.js";
import { DISTRITOS_DISPONIBLES } from "./datos-cocheras.js";

/**
 * Barra de Preferencias de Usuario (Zustand).
 * Conmuta tema claro/oscuro, visualización y distrito preferido.
 */
export function BarraPreferencias() {
  const tema = useAppStore(state => state.tema);
  const alternarTema = useAppStore(state => state.alternarTema);
  const modoVista = useAppStore(state => state.modoVista);
  const alternarModoVista = useAppStore(state => state.alternarModoVista);
  const distritoPreferido = useAppStore(state => state.distritoPreferido);
  const establecerDistritoPreferido = useAppStore(state => state.establecerDistritoPreferido);
  return /*#__PURE__*/React.createElement("div", {
    className: "qlive-preferencias",
    role: "toolbar",
    "aria-label": "Preferencias de la consola"
  }, /*#__PURE__*/React.createElement("div", {
    className: "qlive-preferencias__distritos"
  }, /*#__PURE__*/React.createElement("span", {
    className: "qlive-preferencias__etiqueta"
  }, "Distrito:"), /*#__PURE__*/React.createElement("div", {
    className: "qlive-preferencias__pildoras",
    role: "radiogroup",
    "aria-label": "Filtro de distrito"
  }, DISTRITOS_DISPONIBLES.map(d => /*#__PURE__*/React.createElement("button", {
    key: d,
    type: "button",
    role: "radio",
    "aria-checked": distritoPreferido === d,
    className: `qlive-preferencias__pildora ${distritoPreferido === d ? "qlive-preferencias__pildora--activa" : ""}`,
    onClick: () => establecerDistritoPreferido(d)
  }, d)))), /*#__PURE__*/React.createElement("div", {
    className: "qlive-preferencias__acciones"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "qlive-preferencias__boton",
    onClick: alternarModoVista,
    "aria-label": `Cambiar a vista en ${modoVista === "cuadricula" ? "lista" : "cuadrícula"}`,
    title: "Alternar vista cuadrícula / lista"
  }, modoVista === "cuadricula" ? "Vista Lista" : "Vista Cuadrícula"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "qlive-preferencias__boton qlive-preferencias__boton--tema",
    onClick: alternarTema,
    "aria-label": `Cambiar a modo ${tema === "claro" ? "oscuro" : "claro"}`,
    title: "Alternar modo visual diurno/nocturno"
  }, tema === "claro" ? "Modo Nocturno" : "Modo Diurno")));
}
