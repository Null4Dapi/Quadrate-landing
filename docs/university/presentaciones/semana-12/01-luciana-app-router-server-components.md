# Ficha Individual de Exposición — Luciana (0:00 – 1:30)
### *Etapa 1: Transición a Next.js 15 App Router y Server Components por Defecto*

**Tiempo asignado:** 1 minuto con 30 segundos (Máximo 1:45 min)  
**Objetivo principal:** Demostrar por qué migramos de React SPA a Next.js 15, fundamentar que en App Router los componentes son Server Components por defecto y evidenciar que la página `/about` viaja con 0 KB de JavaScript cliente.

---

## 1. Código a Proyectar en Pantalla

Abrir en el editor de código: `docs/university/presentaciones/semana-12/01-luciana-codigo.tsx` (o `app/about/page.tsx`).

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Acerca de",
  description: "Propósito institucional de Quadrate pe, nuestra infraestructura de casetas en Lima..."
};

// SERVER COMPONENT POR DEFECTO: Cero 'use client'
export default function AboutPage() {
  return (
    <article className="about-view__articulo">
      <h1 className="hero-hub__title">Acerca de Quadrate pe</h1>
      <p className="about-view__parrafo">
        Conectamos conductores en Lima con cocheras verificadas en tiempo real...
      </p>
      <ul className="about-view__equipo-lista">
        {INTEGRANTES_GRUPO_04.map((integrante) => (
          <li key={integrante.codigo} className="about-view__integrante">
            <span className="about-view__integrante-nombre">{integrante.nombre}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
```

---

## 2. Puntos Clave a Señalar con el Mouse (Checklist)

1. **Línea 1:** Señalar la ausencia total de `'use client'`. Explicar que el componente es un **Server Component puro**.
2. **Líneas 3–6:** Señalar `export const metadata: Metadata`. Enfatizar cómo los metadatos SEO se generan en el servidor antes del renderizado.
3. **Línea 9:** Resaltar la función `AboutPage()`. Explicar que el mapeo del array de integrantes se resuelve en Node.js, enviando HTML estático limpio sin costo de hidratación en el navegador.

---

## 3. Discurso Palabra por Palabra (Directo al Grano)

> "Buenos días profesor. En la versión de la Semana 11, Quadrate pe dependía de una SPA tradicional en React donde el navegador descargaba un HTML vacío y un paquete masivo de JavaScript antes de pintar el primer píxel. En conexiones móviles inestables de conductores en Lima, esto causaba una latencia inaceptable y dejaba a las páginas institucionales sin indexación SEO.
>
> Para erradicar esto, evolucionamos hacia **Next.js 15 con App Router**. Observen en pantalla `01-luciana-codigo.tsx`, que corresponde a la ruta `/about`. En Next.js 15, **todos los componentes dentro de la carpeta `app/` son Server Components por defecto**.
>
> Noten la ausencia deliberada de la directiva `'use client'`: este archivo se compila y ejecuta exclusivamente en el servidor Node.js. El navegador del conductor no recibe ni un solo byte de JavaScript para interpretar esta vista; recibe HTML puro ya estructurado con la misión de la empresa y la nómina de nuestro equipo. Esto aniquila el costo de hidratación y permite que motores de búsqueda indexen el contenido de forma inmediata.
>
> Le doy el pase a Diego para explicar cómo articulamos este contenido en un layout persistente."

---

## 4. Preguntas Trampa del Docente y Respuestas Blindadas

**P: ¿Qué sucedería si le añades `'use client'` a `AboutPage`?**  
*R:* "Funcionaría visualmente igual, pero enviaríamos innecesariamente el código de React y del componente al bundle del cliente para hidratar contenido que es 100% estático. Perderíamos la ventaja de rendimiento de los Server Components sin obtener ningún beneficio interactivo a cambio."

**P: ¿Por qué no utilizaste `next/router` o `react-router-dom` para manejar esta ruta?**  
*R:* "Porque en Next.js 15 App Router las rutas son declarativas y gobernadas por el sistema de archivos (*File-system Based Routing*). Al ubicar `page.tsx` dentro de la carpeta `app/about/`, el framework crea automáticamente el endpoint `/about` sin requerir configuraciones de routing en el cliente."
