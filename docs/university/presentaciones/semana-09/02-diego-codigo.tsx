/**
 * QUADRATE PE — SEMANA 9: CÓDIGO INDIVIDUAL
 * Integrante: DIEGO (1:30 - 3:05)
 * Tema: Componente React Tipado, Contrato de Props y Estado Interactivo
 * Archivo a proyectar en pantalla durante su grabación.
 */

import React, { useState } from "react";
import type { ExperienciaCochera } from "./01-luciana-codigo";

// 1. Contrato estricto de props entre el catálogo y la tarjeta (CERO uso de "any")
export interface TarjetaCocheraProps {
  cochera: ExperienciaCochera;
  estaSeleccionada?: boolean;
  onSeleccionarCochera: (cochera: ExperienciaCochera) => void;
}

export function TarjetaCocheraSeccionDiego({
  cochera,
  estaSeleccionada = false,
  onSeleccionarCochera,
}: TarjetaCocheraProps) {
  // 2. Tipado genérico explícito en el hook useState
  const [esFavorita, setEsFavorita] = useState<boolean>(false);

  // 3. Tipado seguro del evento del DOM y cancelación de propagación
  const conmutarFavorito = (evento: React.MouseEvent<HTMLButtonElement>) => {
    evento.stopPropagation();
    setEsFavorita((estadoPrevio) => !estadoPrevio);
  };

  return (
    <div>
      <button
        type="button"
        onClick={conmutarFavorito}
        aria-pressed={esFavorita}
        aria-label={esFavorita ? "Quitar de favoritos" : "Guardar favorita"}
      >
        <span>{esFavorita ? "★ Guardada" : "☆ Guardar favorita"}</span>
      </button>
    </div>
  );
}
