/**
 * QUADRATE PE — SEMANA 12: CÓDIGO INDIVIDUAL
 * Integrante: DIEGO (1:30 - 3:05)
 * Tema: Root Layout Compartido, Rutas y Preservación con {children}
 * Archivo a proyectar en pantalla durante su intervención: app/layout.tsx
 */

import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

// 1. Plantilla global de metadatos con title.template
export const metadata: Metadata = {
  title: {
    template: "%s | Quadrate pe — Cocheras Inteligentes en Lima",
    default: "Quadrate pe — Red Inteligente de Playas de Estacionamiento en Lima"
  },
  description: "Conectamos conductores con playas de estacionamiento verificadas en Lima Metropolitana."
};

// 2. ROOT LAYOUT: Servidor puro, envoltorio global persistente
export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="quadrate-app">
        {/* Cabecera persistente: jamás se desmonta entre navegaciones */}
        <header className="header-app">
          <div className="header-app__container">
            <Link href="/" className="header-app__brand">
              <span className="header-app__logo">QUADRATE</span>
              <span className="header-app__badge">LIMA PE</span>
            </Link>
            <nav className="header-app__nav">
              <ul className="header-app__list">
                <li><Link href="/" className="header-app__link">Inicio</Link></li>
                <li><Link href="/about" className="header-app__link">Acerca de</Link></li>
              </ul>
            </nav>
          </div>
        </header>

        {/* 3. Inyección dinámica de la página activa mediante {children} */}
        <main className="main-content" id="main-content">
          {children}
        </main>

        {/* Pie institucional compartido */}
        <footer className="footer-app">
          <p>&copy; 2026 Quadrate pe · Todos los derechos reservados.</p>
        </footer>
      </body>
    </html>
  );
}
