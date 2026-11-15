import React, { useState, useEffect } from "react";
import { CARACTERISTICAS_CASETA } from "./datos-caseta.js";
import { CasetaFila } from "./caseta-fila.jsx";

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
      setTiempoRestante((tiempoPrevio) => {
        if (tiempoPrevio <= 1) {
          setIndiceActivo((indicePrevio) => (indicePrevio + 1) % CARACTERISTICAS_CASETA.length);
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
    setEstaReproduciendo((reproduciendoPrevio) => !reproduciendoPrevio);
  };

  const manejarReiniciar = () => {
    setIndiceActivo(0);
    setTiempoRestante(4);
    setEstaReproduciendo(true);
  };

  const manejarSeleccionarFila = (indice) => {
    setIndiceActivo(indice);
    setTiempoRestante(4);
  };

  return (
    <div className="caseta__grid">
      <div className="caseta__content">
        <span className="caseta__eyebrow">
          Panel de Control de Caseta · {estaSincronizando ? "Sincronizando..." : "Garitas conectadas ✓"}
        </span>

        <h2 id="playa-titulo" className="caseta__title">
          Digitalización operativa para playas sin hardware costoso
        </h2>

        <p className="caseta__lead">
          Operá tu estacionamiento desde cualquier smartphone o tableta existente. Cero barreras electromecánicas y cero sensores en el suelo.
        </p>

        <ul className="caseta__list" role="list">
          {CARACTERISTICAS_CASETA.map((caracteristica, indice) => (
            <CasetaFila
              key={caracteristica.id}
              indice={indice}
              titulo={caracteristica.titulo}
              detalle={caracteristica.detalle}
              estaActiva={indice === indiceActivo}
              alSeleccionar={() => manejarSeleccionarFila(indice)}
            />
          ))}
        </ul>

        <div className="caseta__controls">
          <span className="caseta__timer">
            {estaReproduciendo ? `Tour activo: ${tiempoRestante}s` : "Tour pausado"}
          </span>
          <button
            type="button"
            className="caseta__btn-control"
            onClick={manejarPausarReanudar}
            aria-label={estaReproduciendo ? "Pausar tour interactivo" : "Reanudar tour interactivo"}
          >
            {estaReproduciendo ? "⏸ Pausar" : "▶ Reanudar"}
          </button>
          <button
            type="button"
            className="caseta__btn-control"
            onClick={manejarReiniciar}
            aria-label="Reiniciar tour interactivo"
          >
            ↺ Reiniciar
          </button>
        </div>
      </div>

      <div className="caseta__visual">
        <figure className="caseta__figure">
          <img
            src="src/assets/mockup-phone.png"
            alt="Mockup del panel operativo de Quadrate pe para caseta de estacionamiento"
            width={320}
            height={320}
            loading="lazy"
            className={"caseta__image" + (estaTransicionando ? " caseta__image--transitioning" : "")}
          />
        </figure>
      </div>
    </div>
  );
}

export default CasetaTour;
