# Ficha Individual de Exposición — Cueva (4:40 – 6:20)
### *Etapa 1: Data Fetching Asíncrono en Servidor, Revalidación ISR y Metadata API*

**Tiempo asignado:** 1 minuto con 40 segundos (Máximo 2:00 min)  
**Objetivo principal:** Explicar cómo los Server Components asíncronos obtienen datos sin spinners parpadeantes en el cliente, justificar el cambio de comportamiento de caché en Next.js 15 (`revalidate: 60` vs `no-store`) y demostrar el uso de la Metadata API.

---

## 1. Código a Proyectar en Pantalla

Abrir en el editor de código: `docs/university/presentaciones/semana-12/04-cueva-codigo.tsx` (o `app/page.tsx`).

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inicio",
  description: "Explora la disponibilidad en vivo y tarifas de cocheras..."
};

// Data Fetching en Servidor con revalidación declarativa
async function obtenerCocheraDestacada(): Promise<DatosCochera> {
  const respuesta = await fetch("https://jsonplaceholder.typicode.com/posts/1", {
    next: { revalidate: 60 } // Next.js 15: ISR explícito
  });
  return mapearCochera(await respuesta.json());
}

// ASYNC SERVER COMPONENT: Ejecución directa en servidor
export default async function InicioPage() {
  const cochera = await obtenerCocheraDestacada();
  return <TarjetaCochera cochera={cochera} />;
}
```

---

## 2. Puntos Clave a Señalar con el Mouse (Checklist)

1. **Líneas 3–6:** Señalar el objeto `metadata: Metadata`. Resaltar que define el título de pestaña sin manipular el DOM en el cliente.
2. **Línea 10:** Señalar `{ next: { revalidate: 60 } }`. Explicar que en Next.js 15 `cache: 'no-store'` es el valor por defecto, y que nosotros declaramos ISR explícito a 60 segundos.
3. **Línea 15:** Señalar `export default async function InicioPage()`. Resaltar que en Server Components React permite usar `async/await` directamente en la función componente.

---

## 3. Discurso Palabra por Palabra (Directo al Grano)

> "Gracias Vílchez. En la Actividad 5 de la guía se nos exigió obtener datos desde un Server Component asíncrono. Observen `04-cueva-codigo.tsx`: `InicioPage` es una función asíncrona declarada directamente como `async function`.
>
> Aquí aplicamos un cambio arquitectónico crítico de Next.js 15. En Next.js 14, las peticiones `fetch()` se cacheaban de forma estática indefinida. En Next.js 15, el equipo de Vercel modificó el comportamiento por defecto a `cache: 'no-store'`.
>
> Para una plataforma de cocheras en Lima donde las tarifas y aforos cambian periódicamente, consultar la base de datos en cada milisegundo saturaría el backend. Por ello declaramos explícitamente:
> `fetch(url, { next: { revalidate: 60 } })`.  
> Esto activa **Regeneración Estática Incremental (ISR)**: servimos una respuesta en caché ultrarrápida y Next.js revalida los datos en segundo plano cada 60 segundos. Noten además las líneas 21 a 27: encapsulamos la llamada en `try/catch` con un objeto de contingencia (*fallback*), garantizando que si la red externa cae, el conductor jamás reciba una pantalla de error 500.
>
> Por último, en las líneas 1 a 6 exportamos el objeto tipado `metadata: Metadata`, permitiendo que el navegador y Googlebot conozcan el título y descripción canónicos de la página sin manipular `document.title` en el cliente.
>
> Doy el pase a Víctor para presentar la auditoría experimental del laboratorio."

---

## 4. Preguntas Trampa del Docente y Respuestas Blindadas

**P: ¿Por qué en un Server Component no necesitas `useEffect` para llamar a `fetch`?**  
*R:* "Porque `useEffect` es un hook de ciclo de vida del navegador que se dispara después de que el componente se monta en el DOM. En el servidor no hay DOM ni montaje; el servidor simplemente ejecuta la función asíncrona de arriba a abajo, espera la promesa y genera el HTML pre-renderizado."

**P: ¿Qué ventaja de seguridad ofrece hacer el `fetch` en el servidor y no en el cliente?**  
*R:* "Que las URLs internas, tokens de autenticación o claves de base de datos nunca viajan al navegador del usuario, blindando la arquitectura contra inspecciones maliciosas en la pestaña Network de DevTools."
