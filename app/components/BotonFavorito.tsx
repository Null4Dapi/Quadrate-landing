"use client";

import { useState } from "react";

interface BotonFavoritoProps {
  readonly cocheraId: number;
  readonly nombreCochera: string;
}

export default function BotonFavorito({
  cocheraId,
  nombreCochera
}: BotonFavoritoProps) {
  const [esFavorito, setEsFavorito] = useState<boolean>(false);
  const [contadorFavoritos, setContadorFavoritos] = useState<number>(142);

  const alternarFavorito = (): void => {
    setEsFavorito((prev) => {
      const nuevoEstado = !prev;
      setContadorFavoritos((actual) => (nuevoEstado ? actual + 1 : actual - 1));
      return nuevoEstado;
    });
  };

  return (
    <button
      type="button"
      className={`boton-favorito ${esFavorito ? "boton-favorito--activo" : ""}`}
      onClick={alternarFavorito}
      aria-pressed={esFavorito}
      aria-label={`Marcar ${nombreCochera} como cochera favorita`}
    >
      <span className="boton-favorito__icono" aria-hidden="true">
        {esFavorito ? "★" : "☆"}
      </span>
      <span className="boton-favorito__texto">
        {esFavorito ? "Guardado en Favoritos" : "Guardar en Favoritos"}
      </span>
      <span className="boton-favorito__contador" aria-label={`${contadorFavoritos} usuarios la guardaron`}>
        ({contadorFavoritos})
      </span>
    </button>
  );
}
