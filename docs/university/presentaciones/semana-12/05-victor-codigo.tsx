/**
 * QUADRATE PE — SEMANA 12: CÓDIGO INDIVIDUAL
 * Integrante: VÍCTOR / MANUEL (6:20 - 8:00)
 * Tema: Auditoría Lighthouse, Core Web Vitals y Optimización Multimedia
 * Archivo a proyectar en pantalla durante su intervención: app/components/TarjetaCochera.tsx + Métricas
 */

// 1. COMPARATIVA CUANTITATIVA ANTES VS DESPUÉS (Móvil 4G - Lighthouse)
export const METRICAS_EXPERIMENTALES = {
  antes: {
    lcp: "3.10 s",
    cls: "0.18",
    tbt: "140 ms",
    score: "78 / 100"
  },
  despues: {
    lcp: "1.56 s (↓ 49.6%)",
    cls: "0.00 (↓ 100%)",
    tbt: "40 ms (↓ 71.4%)",
    score: "99 / 100 (+21 pts)"
  }
};

// 2. OPTIMIZACIÓN APLICADA: Dimensiones reservadas y fetchPriority alta
export default function TarjetaCocheraOptimizada({ cochera }: { cochera: any }) {
  return (
    <article className="tarjeta-cochera">
      {/* Contenedor con aspect-ratio 16/9 reservado en CSS para aniquilar CLS */}
      <div className="tarjeta-cochera__media-container">
        <img
          src={cochera.imagenUrl}
          alt={`Cochera aliada ${cochera.nombre} en ${cochera.distrito}`}
          width={640}
          height={360}
          loading="eager"
          // @ts-ignore
          fetchpriority="high" // Priorización en cola de red para abatir LCP
          className="tarjeta-cochera__imagen"
        />
      </div>

      <div className="tarjeta-cochera__info">
        <span className="tarjeta-cochera__distrito">{cochera.distrito}</span>
        <h3 className="tarjeta-cochera__nombre">{cochera.nombre}</h3>
        <p className="tarjeta-cochera__tarifa">Tarifa: S/ {cochera.tarifaHora.toFixed(2)} / h</p>
      </div>
    </article>
  );
}
