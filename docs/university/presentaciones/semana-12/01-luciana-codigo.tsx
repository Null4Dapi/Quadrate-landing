/**
 * QUADRATE PE — SEMANA 12: CÓDIGO INDIVIDUAL
 * Integrante: LUCIANA (0:00 - 1:30)
 * Tema: Transición a Next.js 15 App Router y Server Components por Defecto
 * Archivo a proyectar en pantalla durante su intervención: app/about/page.tsx
 */

import type { Metadata } from "next";

// 1. Metadata declarativa tipada para SEO sin JavaScript en cliente
export const metadata: Metadata = {
  title: "Acerca de",
  description: "Propósito institucional de Quadrate pe, nuestra infraestructura de casetas en Lima y el equipo de ingeniería de software."
};

interface IntegranteEquipo {
  readonly nombre: string;
  readonly codigo: string;
  readonly rol: string;
}

const INTEGRANTES_GRUPO_04: readonly IntegranteEquipo[] = [
  { nombre: "Pando Alanzo, Diego Iglesia", codigo: "202310012", rol: "Arquitectura de Software & App Router" },
  { nombre: "Tapullima Herrera, Luciana del pilar", codigo: "202310045", rol: "Especialista UI/UX & Componentes de Servidor" },
  { nombre: "Mendo Ruiz, Manuel", codigo: "202310078", rol: "Data Fetching, Caché & Metadata API" },
  { nombre: "Cueva Fabian, Eduardo", codigo: "202310091", rol: "Auditoría de Rendimiento & Core Web Vitals" },
  { nombre: "Vilchez, José", codigo: "202310103", rol: "Optimización de Recursos & Profiler" }
];

// 2. SERVER COMPONENT PURO: Cero 'use client', renderizado 100% en servidor
export default function AboutPage() {
  return (
    <article className="about-view__articulo">
      <h1 className="hero-hub__title">Acerca de Quadrate pe</h1>
      <p className="about-view__parrafo">
        Conectamos conductores en Lima Metropolitana con cocheras verificadas,
        reduciendo entre 20 y 35 minutos el tiempo promedio de búsqueda.
      </p>

      {/* Renderizado estático de la nómina con cero KB de hidratación */}
      <ul className="about-view__equipo-lista">
        {INTEGRANTES_GRUPO_04.map((integrante) => (
          <li key={integrante.codigo} className="about-view__integrante">
            <span className="about-view__integrante-nombre">{integrante.nombre}</span>
            <span className="about-view__integrante-codigo">({integrante.codigo})</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
