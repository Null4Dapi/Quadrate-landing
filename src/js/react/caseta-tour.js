/**
 * caseta-tour.js — Compilado para Navegador
 */
const React = window.React;
const { useState, useEffect, useRef } = React;
import { CARACTERISTICAS_CASETA } from "./datos-caseta.js";
import { CasetaFila } from "./caseta-fila.js";

/**
 * Componente orquestador del Tour Interactivo de Caseta.
 * Gestiona el carrusel automatizado con temporizador, telemetría simulada
 * y navegación accesible por teclado o interacción de usuario.
 *
 * @returns {JSX.Element}
 */
export function CasetaTour() {
  const [indiceActivo, setIndiceActivo] = useState(0);
  const [estaReproduciendo, setEstaReproduciendo] = useState(true);
  const [tiempoRestante, setTiempoRestante] = useState(4);
  const [estaSincronizando, setEstaSincronizando] = useState(true);
  const [estaTransicionando, setEstaTransicionando] = useState(false);

  // Efecto 1: Simulación de conexión inicial a garitas (800ms)
  useEffect(() => {
    const timerId = setTimeout(() => {
      setEstaSincronizando(false);
    }, 800);
    return () => {
      clearTimeout(timerId);
    };
  }, []);

  // Efecto 2: Carrusel automático sincronizado cada 1000ms
  useEffect(() => {
    if (!estaReproduciendo) {
      return;
    }
    let temporizadorTransicion = null;
    const idIntervalo = setInterval(() => {
      setTiempoRestante(tiempoPrevio => {
        if (tiempoPrevio <= 1) {
          setIndiceActivo(indicePrevio => (indicePrevio + 1) % CARACTERISTICAS_CASETA.length);
          setEstaTransicionando(true);
          temporizadorTransicion = setTimeout(() => {
            setEstaTransicionando(false);
          }, 200);
          return 4;
        }
        return tiempoPrevio - 1;
      });
    }, 1000);
    return () => {
      clearInterval(idIntervalo);
      if (temporizadorTransicion) {
        clearTimeout(temporizadorTransicion);
      }
    };
  }, [estaReproduciendo]);
  const manejarPausarReanudar = () => {
    setEstaReproduciendo(reproduciendoPrevio => !reproduciendoPrevio);
  };
  const manejarReiniciar = () => {
    setIndiceActivo(0);
    setTiempoRestante(4);
    setEstaReproduciendo(true);
  };
  const manejarSeleccionarFila = indice => {
    setIndiceActivo(indice);
    setTiempoRestante(4);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "caseta__grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "caseta__content"
  }, /*#__PURE__*/React.createElement("span", {
    className: "caseta__eyebrow"
  }, "Panel de Control de Caseta · ", estaSincronizando ? "Sincronizando..." : "Garitas conectadas ✓"), /*#__PURE__*/React.createElement("h2", {
    id: "playa-titulo",
    className: "caseta__title"
  }, "Digitalización operativa para playas sin hardware costoso"), /*#__PURE__*/React.createElement("p", {
    className: "caseta__lead"
  }, "Operá tu estacionamiento desde cualquier smartphone o tableta existente. Cero barreras electromecánicas y cero sensores en el suelo."), /*#__PURE__*/React.createElement("ul", {
    className: "caseta__list",
    role: "list"
  }, CARACTERISTICAS_CASETA.map((caracteristica, indice) => /*#__PURE__*/React.createElement(CasetaFila, {
    key: caracteristica.id,
    indice: indice,
    titulo: caracteristica.titulo,
    detalle: caracteristica.detalle,
    estaActiva: indice === indiceActivo,
    alSeleccionar: () => manejarSeleccionarFila(indice)
  }))), /*#__PURE__*/React.createElement("div", {
    className: "caseta__controls"
  }, /*#__PURE__*/React.createElement("span", {
    className: "caseta__timer"
  }, estaReproduciendo ? `Tour activo: ${tiempoRestante}s` : "Tour pausado"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "caseta__btn-control",
    onClick: manejarPausarReanudar,
    "aria-label": estaReproduciendo ? "Pausar tour interactivo" : "Reanudar tour interactivo"
  }, estaReproduciendo ? "⏸ Pausar" : "▶ Reanudar"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "caseta__btn-control",
    onClick: manejarReiniciar,
    "aria-label": "Reiniciar tour interactivo"
  }, "↺ Reiniciar"))), /*#__PURE__*/React.createElement("div", {
    className: "caseta__visual"
  }, /*#__PURE__*/React.createElement("figure", {
    className: "caseta__figure"
  }, /*#__PURE__*/React.createElement("img", {
    src: "src/assets/mockup-phone.png",
    alt: "Mockup del panel operativo de Quadrate pe para caseta de estacionamiento",
    width: 320,
    height: 320,
    loading: "lazy",
    className: "caseta__image" + (estaTransicionando ? " caseta__image--transitioning" : "")
  }))));
}
export default CasetaTour;
