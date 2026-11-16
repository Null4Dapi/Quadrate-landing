import React from "react";
import { useAppStore } from "./store/app-store.js";
import { DISTRITOS_DISPONIBLES } from "./datos-cocheras.js";

/**
 * Barra de Preferencias de Usuario (Zustand).
 * Conmuta tema claro/oscuro, visualización y distrito preferido.
 */
export function BarraPreferencias() {
  const tema = useAppStore((state) => state.tema);
  const alternarTema = useAppStore((state) => state.alternarTema);
  const modoVista = useAppStore((state) => state.modoVista);
  const alternarModoVista = useAppStore((state) => state.alternarModoVista);
  const distritoPreferido = useAppStore((state) => state.distritoPreferido);
  const establecerDistritoPreferido = useAppStore((state) => state.establecerDistritoPreferido);

  return (
    <div className="qlive-preferencias" role="toolbar" aria-label="Preferencias de la consola">
      <div className="qlive-preferencias__distritos">
        <span className="qlive-preferencias__etiqueta">Distrito:</span>
        <div className="qlive-preferencias__pildoras" role="radiogroup" aria-label="Filtro de distrito">
          {DISTRITOS_DISPONIBLES.map((d) => (
            <button
              key={d}
              type="button"
              role="radio"
              aria-checked={distritoPreferido === d}
              className={`qlive-preferencias__pildora ${
                distritoPreferido === d ? "qlive-preferencias__pildora--activa" : ""
              }`}
              onClick={() => establecerDistritoPreferido(d)}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div className="qlive-preferencias__acciones">
        <button
          type="button"
          className="qlive-preferencias__boton"
          onClick={alternarModoVista}
          aria-label={`Cambiar a vista en ${modoVista === "cuadricula" ? "lista" : "cuadrícula"}`}
          title="Alternar vista cuadrícula / lista"
        >
          {modoVista === "cuadricula" ? "Vista Lista" : "Vista Cuadrícula"}
        </button>

        <button
          type="button"
          className="qlive-preferencias__boton qlive-preferencias__boton--tema"
          onClick={alternarTema}
          aria-label={`Cambiar a modo ${tema === "claro" ? "oscuro" : "claro"}`}
          title="Alternar modo visual diurno/nocturno"
        >
          {tema === "claro" ? "Modo Nocturno" : "Modo Diurno"}
        </button>
      </div>
    </div>
  );
}
