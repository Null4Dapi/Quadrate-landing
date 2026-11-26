import type { Metadata } from "next";
import TarjetaCochera, { type DatosCochera } from "./components/TarjetaCochera";

export const metadata: Metadata = {
  title: "Inicio",
  description: "Explora la disponibilidad en vivo y tarifas de cocheras verificadas en Lima Metropolitana con Quadrate pe."
};

// Data Fetching en Servidor con revalidación declarativa en Next.js 15
async function obtenerCocheraDestacada(): Promise<DatosCochera> {
  try {
    const respuesta = await fetch("https://jsonplaceholder.typicode.com/posts/1", {
      next: { revalidate: 60 } // Estrategia declarativa de caché Next.js 15
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
    console.error("Error al obtener telemetría remota de cochera:", error);
    // Retorno de contingencia (fallback) para asegurar resiliencia en renderizado
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

export default async function InicioPage() {
  const cochera = await obtenerCocheraDestacada();

  return (
    <section className="hero-hub" aria-labelledby="hero-titulo">
      <header className="hero-hub__header">
        <span className="hero-hub__tag">Red de Cocheras Inteligentes</span>
        <h1 className="hero-hub__title" id="hero-titulo">
          Encuentra tu estacionamiento seguro en Lima sin dar vueltas
        </h1>
        <p className="hero-hub__lead">
          Bienvenido a la consola interactiva de Quadrate pe. Monitorea aforo en tiempo real,
          consulta tarifas reguladas y guarda tus playas aliadas con disponibilidad garantizada.
        </p>
      </header>

      <section className="seccion-experiencia" aria-labelledby="seccion-destacada-titulo">
        <h2 className="visually-hidden" id="seccion-destacada-titulo">
          Cochera destacada del día
        </h2>
        <TarjetaCochera cochera={cochera} />
      </section>
    </section>
  );
}
