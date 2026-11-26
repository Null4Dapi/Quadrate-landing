# Guion Maestro de Exposición (8 Minutos) — Semana 12
### *Next.js 15 App Router: Rutas, Layouts Compartidos, Server/Client Components y Core Web Vitals*
**Proyecto:** Quadrate pe — Red Inteligente de Playas de Estacionamiento en Lima  
**Duración Total:** 8 minutos cronometrados (Exactos)  
**Integrantes:** Luciana (1) · Diego (2) · Vílchez (3) · Cueva (4) · Víctor / Manuel (5)  
**Modalidad de Presentación:** Directo al código, sin introducciones vacías, técnico y de alto impacto.

---

## Matriz de Tiempos y Roles

| # | Integrante | Minuto | Duración | Rol / Tema Técnico | Archivo o Vista a Proyectar |
| :-: | :--- | :-: | :-: | :--- | :--- |
| **1** | **Luciana** | 0:00 – 1:30 | 1m 30s | **Transición a Next.js 15 y Server Components por Defecto** (Etapa 1) | `01-luciana-codigo.tsx` (`app/about/page.tsx`) |
| **2** | **Diego** | 1:30 – 3:05 | 1m 35s | **Root Layout Compartido, Rutas y Preservación de `{children}`** (Etapa 1) | `02-diego-codigo.tsx` (`app/layout.tsx`) |
| **3** | **Vílchez** | 3:05 – 4:40 | 1m 35s | **Frontera de Hidratación `'use client'`, Microinteracción y A11y** (Etapa 1) | `03-vilchez-codigo.tsx` (`BotonFavorito.tsx`) |
| **4** | **Cueva** | 4:40 – 6:20 | 1m 40s | **Data Fetching en Servidor, Revalidación en Next.js 15 y Metadata API** (Etapa 1) | `04-cueva-codigo.tsx` (`app/page.tsx`) |
| **5** | **Víctor / Manuel** | 6:20 – 8:00 | 1m 40s | **Auditoría Lighthouse (LCP, CLS), React DevTools Profiler y Cierre** (Etapa 2) | `05-victor-codigo.tsx` + Tabla de Rendimiento |

---

## Guion Continuo con Acotaciones Escénicas

### [0:00 – 1:30] Bloque 1: Luciana — Diagnóstico y Server Components por Defecto
> **[En pantalla: Proyectar `01-luciana-codigo.tsx` en VS Code, resaltar que no existe directiva `'use client'` y que se exporta un componente asíncrono/servidor puro]**

**Luciana:**  
"Buenos días profesor. En la versión de la Semana 11, Quadrate pe dependía de una SPA tradicional en React donde el navegador descargaba un HTML vacío y un paquete masivo de JavaScript antes de pintar el primer píxel. En conexiones móviles inestables de conductores en Lima, esto causaba una latencia inaceptable y dejaba a las páginas institucionales sin indexación SEO.

Para erradicar esto, evolucionamos hacia **Next.js 15 con App Router**. Observen en pantalla `01-luciana-codigo.tsx`, que corresponde a la ruta `/about`. En Next.js 15, **todos los componentes dentro de la carpeta `app/` son Server Components por defecto**. 

Noten la ausencia deliberada de la directiva `'use client'`: este archivo se compila y ejecuta exclusivamente en el servidor Node.js. El navegador del conductor no recibe ni un solo byte de JavaScript para interpretar esta vista; recibe HTML puro ya estructurado con la misión de la empresa y la nómina de nuestro equipo. Esto aniquila el costo de hidratación y permite que motores de búsqueda indexen el contenido de forma inmediata.

Le doy el pase a Diego para explicar cómo articulamos este contenido en un layout persistente."

---

### [1:30 – 3:05] Bloque 2: Diego — Layout Compartido, App Router y Navegación Suave
> **[En pantalla: Cambiar a `02-diego-codigo.tsx`, resaltar la estructura `<header>`, `<nav>`, `{children}`, `<footer>` y el componente `<Link>`]**

**Diego:**  
"Gracias Luciana. En la Diapositiva 2 y en `02-diego-codigo.tsx` vemos el corazón arquitectónico de la aplicación: `app/layout.tsx`. 

En la versión previa, cada vez que navegábamos entre vistas, el encabezado y el pie de página se desmontaban y reconstruían en el DOM, provocando parpadeos visuales y pérdida del scroll. En Next.js 15, `RootLayout` actúa como un caparazón permanente.

Observen la línea 26: inyectamos la prop tipada `{children}` de tipo `React.ReactNode`. Aquí es donde Next.js monta dinámicamente la página activa: `app/page.tsx` para la raíz `/` o `app/about/page.tsx` para `/about`. Los elementos estructurales `<header>` y `<footer>` jamás se re-renderizan ni se descargan por duplicado.

Además, en las líneas 18 a 22 usamos el componente `<Link>` de Next.js. Esto habilita **navegación suave por el cliente (*Soft Navigation*)**: al hacer clic en 'Acerca de', Next.js únicamente solicita el payload RSC de la nueva página y reemplaza el nodo `{children}`, manteniendo la cabecera fija y otorgando una experiencia de velocidad nativa.

Paso el turno a Vílchez para revisar cómo confinamos la interactividad."

---

### [3:05 – 4:40] Bloque 3: Vílchez — Frontera de Hidratación Cliente y Accesibilidad WCAG
> **[En pantalla: Proyectar `03-vilchez-codigo.tsx` en VS Code, resaltar `'use client'` en la línea 1 y el atributo `aria-pressed`]**

**Vílchez:**  
"Gracias Diego. La directiva `'use client'` no debe colocarse a la ligera. Si la hubiéramos puesto en el layout o en la página principal, habríamos anulado las ventajas de Next.js obligando al cliente a descargar todo el árbol de componentes.

Por ello, aplicamos el principio de **confinamiento de componentes cliente**: aislamos la interactividad en la hoja más profunda del árbol: el microcomponente `BotonFavorito.tsx`.

Observen la línea 1: `'use client'` marca la **frontera de hidratación (*Component Boundary*)**. Solo este archivo descarga código JavaScript al navegador. ¿Por qué lo exige? Porque en las líneas 8 y 9 requerimos estado reactivo local mediante `useState` para conmutar el estado de guardado y actualizar el contador social en memoria.

Pero en Quadrate pe cuidamos rigurosamente la accesibilidad técnica: en la línea 24 implementamos el atributo `aria-pressed={esFavorito}`. Cuando un usuario utiliza un lector de pantalla como TalkBack o NVDA, el sintetizador vocal anuncia explícitamente si la cochera está marcada o no como favorita. El botón es además 100% operable mediante teclado con `Enter` y `Espacio`, sin recurrir a estilos embebidos.

Doy paso a Cueva para explicar el data fetching en servidor."

---

### [4:40 – 6:20] Bloque 4: Cueva — Data Fetching Asíncrono en Servidor, Revalidación ISR y Metadata
> **[En pantalla: Proyectar `04-cueva-codigo.tsx`, resaltar `async function InicioPage()`, el bloque `fetch` con `next: { revalidate: 60 }` y el objeto `metadata`]**

**Cueva:**  
"Gracias Vílchez. En la Actividad 5 de la guía se nos exigió obtener datos desde un Server Component asíncrono. Observen `04-cueva-codigo.tsx`: `InicioPage` es una función asíncrona declarada directamente como `async function`.

Aquí aplicamos un cambio arquitectónico crítico de Next.js 15. En Next.js 14, las peticiones `fetch()` se cacheaban de forma estática indefinida. En Next.js 15, el equipo de Vercel modificó el comportamiento por defecto a `cache: 'no-store'`. 

Para una plataforma de cocheras en Lima donde las tarifas y aforos cambian periódicamente, consultar la base de datos en cada milisegundo saturaría el backend. Por ello declaramos explícitamente:
`fetch(url, { next: { revalidate: 60 } })`.  
Esto activa **Regeneración Estática Incremental (ISR)**: servimos una respuesta en caché ultrarrápida y Next.js revalida los datos en segundo plano cada 60 segundos. Noten además las líneas 21 a 27: encapsulamos la llamada en `try/catch` con un objeto de contingencia (*fallback*), garantizando que si la red externa cae, el conductor jamás reciba una pantalla de error 500.

Por último, en las líneas 1 a 6 exportamos el objeto tipado `metadata: Metadata`, permitiendo que el navegador y Googlebot conozcan el título y descripción canónicos de la página sin manipular `document.title` en el cliente.

Doy el pase a Víctor para presentar la auditoría experimental del laboratorio."

---

### [6:20 – 8:00] Bloque 5: Víctor / Manuel — Evidencia de Core Web Vitals, Profiler y Optimización
> **[En pantalla: Proyectar `05-victor-codigo.tsx` con la tabla comparativa de Core Web Vitals y el reporte de Lighthouse]**

**Víctor / Manuel:**  
"Gracias Cueva. En la Guía de Laboratorio sometimos esta arquitectura a una auditoría científica bajo protocolo estricto en Google Chrome 131, modo incógnito y emulación móvil 4G, promediando tres mediciones consecutivas.

En la línea base inicial detectamos dos problemas severos: un **LCP de 3.10 segundos** (fuera del umbral de 2.5 s) y un **CLS de 0.18**, producto de que la imagen de la cochera cargaba sin dimensiones reservadas, empujando los botones hacia abajo abruptamente.

Grabamos la interacción en **React DevTools Profiler**: confirmamos que al interactuar con el botón de favoritos, el renderizado tardó apenas **0.8 milisegundos**, y los componentes padre no sufrieron ningún re-renderizado gracias al aislamiento de `'use client'`.

Para corregir el LCP y el CLS aplicamos la optimización que ven en pantalla: reservamos el espacio con `aspect-ratio: 16 / 9`, definimos `width` y `height` exactos con `next/image` y priorizamos la descarga con `fetchPriority='high'`.

Los resultados fueron contundentes:
1. El **LCP cayó en un 49.6%**, pasando de 3.10 a **1.56 segundos**.
2. El **CLS se redujo a 0.00 absoluto**, eliminando por completo cualquier salto de pantalla.
3. El **Performance Score en Mobile escaló de 78 a 99 sobre 100**, alcanzando un **100 perfecto** en la ruta institucional y en escritorio.

Con esto demostramos que Next.js 15, combinado con disciplina de maquetación, entrega una experiencia sólida para los conductores de Lima. Quedamos listos para las preguntas del docente. Muchas gracias."
