/**
 * QUADRATE PE — SEMANA 12: CÓDIGO DE DEMOSTRACIÓN INTEGRAL
 * Archivo maestro que consolida la arquitectura completa de Next.js 15:
 * Root Layout, Server Components, Client Boundary, Data Fetching con ISR y Metadata.
 */

import React, { useState } from "react";
import type { Metadata } from "next";

// ============================================================================
// 1. CONTRATOS Y METADATOS (Metadata API)
// ============================================================================
export const metadata: Metadata = {
  title: {
    template: "%s | Quadrate pe",
    default: "Quadrate pe — Red Inteligente de Playas de Estacionamiento en Lima"
  },
  description: "Conectamos conductores con cocheras verificadas en tiempo real."
};

export interface CocheraData {
  readonly id: number;
  readonly nombre: string;
  readonly distrito: string;
  readonly tarifaHora: number;
  readonly plazasDisponibles: number;
  readonly aforoTotal: number;
  readonly imagenUrl: string;
}

// ============================================================================
// 2. MICROINTERACCIÓN CLIENTE CON 'use client' (Frontera de Hidratación)
// ============================================================================
export function BotonFavoritoCliente({ cocheraId, nombre }: { cocheraId: number; nombre: string }) {
  const [esFavorito, setEsFavorito] = useState(false);
  const [contador, setContador] = useState(142);

  return (
    <button
      type="button"
      className={`boton-favorito ${esFavorito ? "boton-favorito--activo" : ""}`}
      onClick={() => {
        setEsFavorito(!esFavorito);
        setContador((c) => (esFavorito ? c - 1 : c + 1));
      }}
      aria-pressed={esFavorito}
      aria-label={`Marcar ${nombre} como favorita`}
    >
      <span>{esFavorito ? "★ Guardado" : "☆ Guardar"}</span>
      <span>({contador})</span>
    </button>
  );
}

// ============================================================================
// 3. SERVER COMPONENT PRESENTACIONAL OPTIMIZADO (Sin JS cliente)
// ============================================================================
export function TarjetaCocheraServer({ cochera }: { cochera: CocheraData }) {
  return (
    <article className="tarjeta-cochera">
      <header className="tarjeta-cochera__encabezado">
        <span className="tarjeta-cochera__distrito">{cochera.distrito}</span>
        <h3 className="tarjeta-cochera__nombre">{cochera.nombre}</h3>
      </header>

      {/* Recurso multimedia optimizado: dimensiones explícitas para CLS = 0.00 */}
      <div className="tarjeta-cochera__media-container" style={{ aspectRatio: "16 / 9" }}>
        <img
          src={cochera.imagenUrl}
          alt={cochera.nombre}
          width={640}
          height={360}
          loading="eager"
          style={{ width: "100%", height: "auto", display: "block" }}
        />
      </div>

      <div className="tarjeta-cochera__metricas">
        <p>Tarifa: S/ {cochera.tarifaHora.toFixed(2)}/h</p>
        <p>Plazas Libres: {cochera.plazasDisponibles} de {cochera.aforoTotal}</p>
      </div>

      {/* Inyección del nodo cliente en el Server Component */}
      <BotonFavoritoCliente cocheraId={cochera.id} nombre={cochera.nombre} />
    </article>
  );
}

// ============================================================================
// 4. DATA FETCHING EN SERVIDOR CON REVALIDACIÓN (Next.js 15 ISR)
// ============================================================================
export async function obtenerDatosCocheraServidor(): Promise<CocheraData> {
  const respuesta = await fetch("https://jsonplaceholder.typicode.com/posts/1", {
    next: { revalidate: 60 } // Next.js 15: ISR explícito
  });
  const json = await respuesta.json();

  return {
    id: json.id,
    nombre: "Estacionamiento Financiero Las Begonias",
    distrito: "San Isidro",
    tarifaHora: 8.50,
    plazasDisponibles: 18,
    aforoTotal: 80,
    imagenUrl: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800&q=80"
  };
}
