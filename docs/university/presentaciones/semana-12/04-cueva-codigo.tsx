/**
 * QUADRATE PE — SEMANA 12: CÓDIGO INDIVIDUAL
 * Integrante: CUEVA (4:40 - 6:20)
 * Tema: Data Fetching Asíncrono en Servidor, Revalidación ISR y Metadata API
 * Archivo a proyectar en pantalla durante su intervención: app/page.tsx
 */

import type { Metadata } from "next";
import TarjetaCochera, { type DatosCochera } from "./components/TarjetaCochera";

// 1. Metadata declarativa para SEO y títulos de pestaña
export const metadata: Metadata = {
  title: "Inicio",
  description: "Explora la disponibilidad en vivo y tarifas de cocheras verificadas en Lima Metropolitana con Quadrate pe."
};

// 2. Data Fetching en Servidor con revalidación declarativa en Next.js 15
async function obtenerCocheraDestacada(): Promise<DatosCochera> {
  try {
    // Consulta a API con ISR (revalidación cada 60s en lugar de cache 'no-store')
    const respuesta = await fetch("https://jsonplaceholder.typicode.com/posts/1", {
      next: { revalidate: 60 } // Estrategia declarativa de caché en Next.js 15
    });

    if (!respuesta.ok) {
      throw new Error(`Código de estado HTTP: ${respuesta.status}`);
    }

    const json = await respuesta.json();

    return {
      id: json.id,
      nombre: "Estacionamiento Financiero Las Begonias",
      distrito: "San Isidro",
      direccion: "Calle Las Begonias 441, Lima",
      tarifaHora: 8.50,
      plazasDisponibles: 18,
      aforoTotal: 80,
      estadoOperativo: "abierto",
      tiempoPromedioAccesoMin: 3
    };
  } catch (error) {
    // Resiliencia: Fallback seguro que previene pantallas de error
    return {
      id: 1,
      nombre: "Plaza Central Larco (Modo Respaldo)",
      distrito: "Miraflores",
      direccion: "Av. José Larco 812, Lima",
      tarifaHora: 9.00,
      plazasDisponibles: 14,
      aforoTotal: 70,
      estadoOperativo: "abierto",
      tiempoPromedioAccesoMin: 4
    };
  }
}

// 3. ASYNC SERVER COMPONENT: Obtención directa sin useEffect ni spinners
export default async function InicioPage() {
  const cochera = await obtenerCocheraDestacada();

  return (
    <section className="hero-hub">
      <header className="hero-hub__header">
        <h1 className="hero-hub__title">
          Encuentra tu estacionamiento seguro en Lima sin dar vueltas
        </h1>
      </header>
      <TarjetaCochera cochera={cochera} />
    </section>
  );
}
