/**
 * QUADRATE PE — SEMANA 12: CÓDIGO INDIVIDUAL
 * Integrante: VÍLCHEZ (3:05 - 4:40)
 * Tema: Frontera de Hidratación Cliente, Microinteracción y Accesibilidad (A11y)
 * Archivo a proyectar en pantalla durante su intervención: app/components/BotonFavorito.tsx
 */

// 1. FRONTERA DE HIDRATACIÓN QUIRÚRGICA: Solo este archivo descarga JS al cliente
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
  // 2. Estado reactivo local que justifica estrictamente el uso de 'use client'
  const [esFavorito, setEsFavorito] = useState<boolean>(false);
  const [contadorFavoritos, setContadorFavoritos] = useState<number>(142);

  const alternarFavorito = (): void => {
    setEsFavorito((prev) => {
      const nuevo = !prev;
      setContadorFavoritos((actual) => (nuevo ? actual + 1 : actual - 1));
      return nuevo;
    });
  };

  return (
    // 3. Accesibilidad técnica WCAG 2.2 con aria-pressed y aria-label
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
      <span className="boton-favorito__contador">({contadorFavoritos})</span>
    </button>
  );
}
