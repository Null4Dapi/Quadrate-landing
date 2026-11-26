/**
 * QUADRATE PE — SEMANA 9: CÓDIGO ARTICULADOR DE SUSTENTACIÓN
 * TypeScript en React (Etapa 1) + Framer Motion & Accesibilidad (Etapa 2)
 *
 * Archivo unificado de demostración en vivo preparado para proyectar en VS Code.
 * Cada bloque está claramente rotulado por integrante con sus líneas de exposición.
 */

import React, { useState, useEffect } from "react";
// En producción real se importa desde framer-motion o el módulo local motion.js:
// import { motion } from "framer-motion";

// ============================================================================
// BLOQUE 1: LUCIANA — MODELO DE DOMINIO Y CONTRATOS DE TIPOS (0:00 - 1:30)
// ============================================================================

// 1. Union Types literales para dominios cerrados (previene erratas como "disponble")
export type DistritoLima = "San Isidro" | "Miraflores" | "Surco" | "San Borja" | "Todos";
export type EstadoAforo = "disponible" | "medio" | "critico";

// 2. Interfaz principal inmutable de cochera
export interface ExperienciaCochera {
  id: string;
  nombre: string;
  distrito: DistritoLima;
  direccion: string;
  tarifaHora: number;        // number estricto (evita concatenaciones "8.00" + 2)
  tarifaFraccion: number;    // fracción 15 min
  plazasTotales: number;
  plazasDisponibles: number;
  tiempoEstimadoLlegadaMinutos: number;
  calificacion: number;
  distanciaKm: number;
  estadoAforo: EstadoAforo;
  imageUrl?: string;         // Campo opcional (requiere fallback visual)
}


// ============================================================================
// BLOQUE 2: DIEGO — COMPONENTE REACT TIPADO, PROPS Y ESTADO (1:30 - 3:05)
// ============================================================================

// Contrato formal de props entre catálogo y tarjeta (Cero uso de "any")
export interface TarjetaCocheraProps {
  cochera: ExperienciaCochera;
  estaSeleccionada?: boolean;
  onSeleccionarCochera: (cochera: ExperienciaCochera) => void;
}


// ============================================================================
// BLOQUE 3: VÍLCHEZ — VARIANTS Y ENTRADA SUAVE CON MOTION (3:05 - 4:40)
// ============================================================================

// Patrón declarativo de Variants: entrada suave en 350ms con desaceleración
export const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" }
  }
};


// ============================================================================
// BLOQUE 5 (PARTE 1): VÍCTOR — HOOK DE ACCESIBILIDAD Y REDUCED MOTION
// ============================================================================

export function useReducedMotion(): boolean {
  const [reduceMotion, setReduceMotion] = useState<boolean>(() => {
    return typeof window !== "undefined" && window.matchMedia
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;
  });

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const listener = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, []);

  return reduceMotion;
}


// ============================================================================
// BLOQUE INTEGRADO: COMPONENTE NUCLEAR DE PRESENTACIÓN
// ============================================================================

export function TarjetaCochera({
  cochera,
  estaSeleccionada = false,
  onSeleccionarCochera,
}: TarjetaCocheraProps): JSX.Element {
  // [DIEGO]: Estado reactivo booleano para favoritos
  const [esFavorita, setEsFavorita] = useState<boolean>(false);

  // [VÍCTOR]: Hook de accesibilidad para movimiento reducido (WCAG 2.1 Criterio 2.3.3)
  const reduceMotion = useReducedMotion();

  // [DIEGO]: Callback con tipado de evento del DOM y cancelación de propagación
  const conmutarFavorito = (evento: React.MouseEvent<HTMLButtonElement>) => {
    evento.stopPropagation();
    setEsFavorita((prev) => !prev);
  };

  const manejarSeleccion = () => {
    onSeleccionarCochera(cochera);
  };

  const esAforoCritico = cochera.plazasDisponibles <= 5;
  const porcentajeOcupacion = Math.round(
    ((cochera.plazasTotales - cochera.plazasDisponibles) / cochera.plazasTotales) * 100
  );

  return (
    // [VÍLCHEZ & CUEVA]: motion.article articulado con variants, viewport y hover
    <article
      // Equivalente a motion.article en Framer Motion:
      // variants={cardVariants}
      // initial="hidden"
      // whileInView="visible"
      // viewport={{ once: true, amount: 0.2 }}
      // whileHover={reduceMotion ? undefined : { y: -4, scale: 1.01 }}
      className={`quadrate-live__card ${estaSeleccionada ? "quadrate-live__card--selected" : ""}`}
      tabIndex={0}
      role="button"
      aria-pressed={estaSeleccionada}
      aria-label={`Cochera ${cochera.nombre} en ${cochera.distrito}`}
      onClick={manejarSeleccion}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && manejarSeleccion()}
    >
      {/* CABECERA EDITORIAL */}
      <header className="quadrate-live__card-header">
        <span className="quadrate-live__card-distrito">{cochera.distrito}</span>
        
        {/* [VÍCTOR]: Insignia estática de alto contraste (Descarte de pulso continuo) */}
        <span
          className={`quadrate-live__badge ${
            esAforoCritico ? "quadrate-live__badge--alerta" : "quadrate-live__badge--disponible"
          }`}
        >
          {esAforoCritico ? "Aforo crítico" : "Aforo fluido"}
        </span>
      </header>

      {/* [LUCIANA]: Resiliencia ante imagen opcional */}
      {cochera.imageUrl ? (
        <img
          src={cochera.imageUrl}
          alt={`Vista de ${cochera.nombre}`}
          width={320}
          height={160}
          className="quadrate-live__card-imagen"
        />
      ) : (
        <div className="quadrate-live__card-fallback">
          <span>Quadrate pe · Sede verificada</span>
        </div>
      )}

      <h4 className="quadrate-live__card-nombre">{cochera.nombre}</h4>
      <p className="quadrate-live__card-direccion">{cochera.direccion}</p>

      {/* MÉTRICAS FINANCIERAS Y PLAZAS */}
      <div className="quadrate-live__card-metricas">
        <div className="quadrate-live__card-metrica">
          <span>Plazas libres</span>
          <strong>{cochera.plazasDisponibles} / {cochera.plazasTotales}</strong>
        </div>
        <div className="quadrate-live__card-metrica">
          <span>Tarifa hora</span>
          <strong>S/ {cochera.tarifaHora.toFixed(2)}</strong>
        </div>
      </div>

      {/* FOOTER CON MICROINTERACCIONES TÁCTILES */}
      <footer className="quadrate-live__card-footer">
        {/* [CUEVA]: Microinteracción táctil elástica whileTap: scale 0.96 */}
        <button
          type="button"
          onClick={manejarSeleccion}
          className="quadrate-live__card-btn"
          aria-label={`Reservar espacio en ${cochera.nombre}`}
        >
          Ver y Reservar
        </button>

        {/* [DIEGO & VÍCTOR]: Control accesible de favoritos con aria-pressed */}
        <button
          type="button"
          onClick={conmutarFavorito}
          aria-pressed={esFavorita}
          aria-label={esFavorita ? "Quitar de favoritos" : "Guardar favorita"}
          className={`quadrate-live__btn-favorito ${esFavorita ? "quadrate-live__btn-favorito--activo" : ""}`}
        >
          <span aria-hidden="true">{esFavorita ? "★" : "☆"}</span>
        </button>
      </footer>
    </article>
  );
}
