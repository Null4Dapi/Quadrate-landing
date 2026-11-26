/**
 * QUADRATE PE — SEMANA 9: CÓDIGO INDIVIDUAL
 * Integrante: LUCIANA (0:00 - 1:30)
 * Tema: Modelo de Dominio, Union Types y Contratos de Datos en TypeScript
 * Archivo a proyectar en pantalla durante su grabación.
 */

// 1. Union Types literales para dominios cerrados (evita cadenas arbitrarias o erratas ortográficas)
export type DistritoLima = "San Isidro" | "Miraflores" | "Surco" | "San Borja" | "Todos";
export type EstadoAforo = "disponible" | "medio" | "critico";

// 2. Interfaz principal inmutable de la experiencia de cochera
export interface ExperienciaCochera {
  id: string;
  nombre: string;
  distrito: DistritoLima;
  direccion: string;
  tarifaHora: number;        // number estricto (bloquea errores de concatenación como "8.00" + 2)
  tarifaFraccion: number;    // fracción de 15 minutos
  plazasTotales: number;
  plazasDisponibles: number;
  tiempoEstimadoLlegadaMinutos: number;
  calificacion: number;
  distanciaKm: number;
  estadoAforo: EstadoAforo;
  imageUrl?: string;         // Campo opcional (obliga a prever un fallback visual)
}
