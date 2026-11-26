/**
 * QUADRATE PE — SEMANA 9: CÓDIGO INDIVIDUAL
 * Integrante: CUEVA (4:40 - 6:20)
 * Tema: Microinteracciones Táctiles (whileTap), Rendimiento en Viewport y Descarte de Drag
 * Archivo a proyectar en pantalla durante su grabación.
 */

import React from "react";

export const microinteraccionesSnippet = `
<motion.article
  variants={cardVariants}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.2 }} // Se activa al 20% y solo una vez (Ahorro de CPU)
  whileHover={reduceMotion ? undefined : { y: -4, scale: 1.01 }} // Desktop
  className="quadrate-live__card"
>
  {/* Botón con respuesta elástica inmediata al tacto (Móvil) */}
  <motion.button
    type="button"
    whileTap={reduceMotion ? undefined : { scale: 0.96 }}
    className="quadrate-live__card-btn"
  >
    Ver y Reservar
  </motion.button>
</motion.article>
`;

/**
 * JUSTIFICACIÓN TÉCNICA DEL DESCARTE DE DRAG (ARRASTRE):
 * 1. Conflicto con el scroll nativo vertical en pantallas táctiles de 375px.
 * 2. Ausencia de valor funcional: el usuario requiere reservar y ver aforo, no mover tarjetas.
 */
