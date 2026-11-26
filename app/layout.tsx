import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | Quadrate pe — Cocheras Inteligentes en Lima",
    default: "Quadrate pe — Red Inteligente de Playas de Estacionamiento en Lima"
  },
  description: "Conectamos conductores con playas de estacionamiento verificadas en Lima Metropolitana. Aforo en tiempo real, tarifas transparentes y reserva de plazas.",
  keywords: ["estacionamiento lima", "cocheras san isidro", "parqueo miraflores", "aforo cocheras"],
  authors: [{ name: "Grupo 04 - Ingeniería de Software UAP" }]
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="quadrate-app">
        <header className="header-app">
          <div className="header-app__container">
            <Link href="/" className="header-app__brand" aria-label="Quadrate pe - Inicio">
              <span className="header-app__logo">QUADRATE</span>
              <span className="header-app__badge">LIMA PE</span>
            </Link>
            <nav className="header-app__nav" aria-label="Navegación principal">
              <ul className="header-app__list">
                <li className="header-app__item">
                  <Link href="/" className="header-app__link">Inicio</Link>
                </li>
                <li className="header-app__item">
                  <Link href="/about" className="header-app__link">Acerca de</Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>

        <main className="main-content" id="main-content">
          {children}
        </main>

        <footer className="footer-app">
          <div className="footer-app__container">
            <p className="footer-app__copy">
              &copy; 2026 Quadrate pe · Plataforma de Experiencias Interactivas. Todos los derechos reservados.
            </p>
            <p className="footer-app__meta">
              Universidad Autónoma del Perú · Facultad de Ingeniería · Grupo 04 (Ciclo V)
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
