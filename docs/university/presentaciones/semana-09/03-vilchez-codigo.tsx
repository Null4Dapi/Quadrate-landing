/**
 * QUADRATE PE — SEMANA 9: CÓDIGO INDIVIDUAL
 * Integrante: VÍLCHEZ (3:05 - 4:40)
 * Tema: Articulación con Motion, Animación de Entrada Suave y Variants
 * Archivo a proyectar en pantalla durante su grabación.
 */

import React from "react";

// 1. Declaración de Variants reutilizables y limpios
export const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 16 // Desplazamiento inicial sutil hacia abajo
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: { 
      duration: 0.35, // 350 milisegundos para no generar demoras artificiales
      ease: "easeOut" 
    }
  }
};

// 2. Uso sobre el contenedor sin alterar las props de TypeScript
export const animacionEntradaSnippet = `
<motion.article
  variants={cardVariants}
  initial="hidden"
  animate="visible"
  className="quadrate-live__card"
>
  {/* Contenido tipado intacto */}
</motion.article>
`;
