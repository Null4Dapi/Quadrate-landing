# GUÍA DE TRABAJO — SEMANA 12

#### _Desarrollo Web Full Stack Frontend — Next.js 15 App Router: Rutas, Layouts, Server/Client Components, Data Fetching y Metadata API_

Semana 12 | Proyecto integrador: Plataforma Web de Experiencias Interactivas — Quadrate pe

Producto articulador: Arquitectura moderna de producción con Next.js 15 App Router para Quadrate pe. Implementación de páginas declarativas (`/` y `/about`) articuladas mediante un layout compartido con inyección de `{children}`, separación estricta entre Server Components (renderizado en servidor con cero JavaScript cliente) y Client Components (`'use client'` confinado exclusivamente al microbotón reactivo de interacción), data fetching asíncrono en servidor con estrategia de revalidación controlada en Next.js 15 (`revalidate: 60`), y gestión declarativa de metadatos SEO mediante Metadata API.

---

## 1. Datos generales

| Elemento | Descripción |
| :--- | :--- |
| **Semana** | 12 |
| **Tema** | Next.js App Router: rutas, layouts, Server y Client Components, Data Fetching y Metadata |
| **Modalidad** | Trabajo práctico en equipo de ingeniería |
| **Duración sugerida** | 3 horas |
| **Requisitos previos** | Separación de Server State (TanStack Query) y Client State (Zustand) de la Semana 11 |
| **Entregable** | Documento oficial de planificación arquitectónica, ficha técnica Server vs Client, contratos TypeScript y respuestas de reflexión |
| **Equipo de desarrollo** | Grupo 04 · Sección 301 · Ciclo V |
| **Integrantes** | Pando Alanzo, Diego Iglesia (202310012)<br>Tapullima Herrera, Luciana del pilar (202310045)<br>Mendo Ruiz, Manuel (202310078)<br>Cueva Fabian, Eduardo (202310091)<br>Vilchez, José (202310103) |
| **Docente principal** | Mag. Ing. Juan Carlos Ramos |

---

## 2. Situación problemática y justificación técnica

Durante las semanas previas (Semanas 6 a 11), el equipo desarrolló **Quadrate pe** como una Single Page Application (SPA) sobre React montada de forma modular mediante scripts de transpilación y un servidor local en Node.js. Si bien esta arquitectura permitió desacoplar el estado del servidor con TanStack Query y el estado global con Zustand, evidenció limitaciones estructurales críticas para una plataforma comercial en producción:

1. **Sobrecarga de JavaScript en el cliente (*Hydration Overhead*):** En una SPA tradicional, el navegador del usuario debe descargar, parsear y ejecutar todo el bundle de React antes de renderizar el primer píxel interactivo. En conexiones móviles inestables en Lima (4G o redes congestionadas), esto penaliza severamente el tiempo hasta la primera pintura con contenido (*FCP*) y el contenido principal visible (*LCP*).
2. **Indexación y SEO deficientes en páginas institucionales:** Las páginas estáticas como *"Acerca de"* (`/about`) o la información de cobertura de cocheras no requieren reactividad, pero eran procesadas enteramente por JavaScript del lado del cliente, dificultando el rastreo óptimo por parte de los motores de búsqueda (Googlebot) y redes sociales al compartir enlaces.
3. **Duplicación de layouts y manipulación manual del `<head>`:** Sin un sistema de enrutamiento basado en archivos con layouts anidados, la cabecera institucional y el pie de página debían re-renderizarse o duplicarse en cada vista, requiriendo manipular el DOM directamente (`document.title`) para actualizar metadatos.
4. **Data fetching acoplado al cliente con cascadas de peticiones (*Request Waterfalls*):** Realizar peticiones `fetch` desde hooks en el cliente expone las credenciales internas de la API, genera latencia de red adicional (ida y vuelta cliente-servidor) y obliga a mostrar spinners de carga innecesarios para datos que son estables o semidinámicos.

Como equipo de desarrollo, decidimos evolucionar la arquitectura hacia **Next.js 15 con App Router y React Server Components (RSC)**, aplicando el **Protocolo de los 3 Filtros** de `AGENTS.md` para preservar la identidad editorial y sobria de Quadrate pe:
- **Server Components por defecto:** Las páginas `/` y `/about` se renderizan en el servidor y viajan al navegador como HTML puro y RSC Payload, enviando 0 KB de JavaScript al cliente para el contenido estático.
- **Client Components quirúrgicos (`'use client'`):** La interactividad se confina de forma estricta a microcomponentes aislados (botón reactivo de "Cochera Favorita / Alerta de Plaza"), evitando que el árbol superior o el layout descarguen código innecesario.
- **Layout compartido y persistente (`app/layout.tsx`):** Un único contenedor raíz que mantiene el encabezado de navegación y el pie de página vivos entre transiciones de ruta, inyectando la página activa a través de `{children}`.
- **Data fetching nativo en servidor con revalidación:** Consulta asíncrona de disponibilidad y tarifas de cocheras directamente en el servidor mediante `fetch` con la política declarativa de Next.js 15 (`next: { revalidate: 60 }`), eliminando spinners iniciales y protegiendo la red.
- **Metadata API:** Configuración declarativa y tipada de títulos, descripciones y Open Graph mediante el objeto `metadata` exportado en cada ruta.

---

## 3. Resultado de aprendizaje

Al finalizar esta etapa de planificación, como equipo:
1. Diseñamos la estructura de carpetas y rutas bajo el estándar **App Router de Next.js 15**, mapeando de manera coherente las vistas `/` y `/about`.
2. Establecimos el contrato de **Layout compartido**, asegurando que los elementos estructurales (`header`, `nav`, `footer`) persistan entre navegaciones sin provocar re-renderizados completos ni parpadeos en el viewport.
3. Clasificamos rigurosamente cada componente bajo la dicotomía **Server Component vs Client Component**, justificando el uso exclusivo de `'use client'` para estados interactivos.
4. Definimos el modelo de datos asíncrono para la obtención de telemetría y catálogo de playas de estacionamiento desde un Server Component, estableciendo la directiva de caché y revalidación adecuada en Next.js 15.
5. Formulamos la configuración de **Metadata API** para garantizar indexación SEO y accesibilidad de títulos en pestaña.

---

## 4. Arquitectura del sistema y árbol de archivos

La aplicación se estructura siguiendo las convenciones del **App Router de Next.js 15** con TypeScript:

```
quadrate-landing/
├── app/
│   ├── layout.tsx              # Root Layout compartido (Server Component): html, body, header, nav, {children}, footer
│   ├── page.tsx                # Página de Inicio / (Server Component asíncrono): Hero, telemetría y tarjeta de experiencia
│   ├── globals.css             # Estilos globales y tokens visuales (BEM + variables CSS del diseño editorial)
│   ├── about/
│   │   └── page.tsx            # Página Acerca de /about (Server Component): Propósito, red de casetas y equipo de ingeniería
│   └── components/
│       ├── BotonFavorito.tsx   # Microcomponente interactivo (Client Component con 'use client'): estado local y accesibilidad
│       └── TarjetaCochera.tsx  # Tarjeta editorial de estacionamiento (Server Component puro)
├── public/
│   └── favicon.ico             # Recursos estáticos servidos sin procesamiento
├── package.json                # Dependencias (next: ^15.0.0, react: ^19.0.0, typescript, @types/react)
└── tsconfig.json               # Configuración estricta de compilador TypeScript con path aliases (@/*)
```

### 4.1. Flujo de renderizado y composición arquitectónica

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                     SERVIDOR (Next.js 15 Server Runtime)                        │
│                                                                                 │
│   ┌─────────────────────────────────────────────────────────────────────────┐   │
│   │                         app/layout.tsx (Server)                         │   │
│   │  ┌───────────────────────────────────────────────────────────────────┐  │   │
│   │  │   <header> Identidad Quadrate pe + <nav> Links a "/" y "/about"   │  │   │
│   │  └───────────────────────────────────────────────────────────────────┘  │   │
│   │                                    │                                    │   │
│   │                         Inyección de {children}                         │   │
│   │                                    ▼                                    │   │
│   │  ┌───────────────────────────────────────────────────────────────────┐  │   │
│   │  │  app/page.tsx (Async Server)    │   app/about/page.tsx (Server)   │  │   │
│   │  │  • fetch() asíncrono en servidor│   • Manifiesto Quadrate pe      │  │   │
│   │  │  • Caché { revalidate: 60 }     │   • Red de garitas en Lima      │  │   │
│   │  │  • Renderizado a HTML puro      │   • Nómina Grupo 04             │  │   │
│   │  │                                 │                                 │  │   │
│   │  │  ┌───────────────────────────┐  │                                 │  │   │
│   │  │  │ TarjetaCochera (Server)   │  │                                 │  │   │
│   │  │  └─────────────┬─────────────┘  │                                 │  │   │
│   │  └────────────────┼────────────────┴─────────────────────────────────┘  │   │
│   │                   │                                                     │   │
│   │  ┌────────────────┼──────────────────────────────────────────────────┐  │   │
│   │  │    <footer> Copyright 2026 Quadrate pe · Todos los derechos       │  │   │
│   │  └────────────────┼──────────────────────────────────────────────────┘  │   │
│   └───────────────────┼─────────────────────────────────────────────────────┘   │
└───────────────────────┼─────────────────────────────────────────────────────────┘
                        │ (HTML + RSC Payload)
                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                     CLIENTE (Navegador Web / React Hydration)                   │
│                                                                                 │
│   ┌─────────────────────────────────────────────────────────────────────────┐   │
│   │                    BotonFavorito.tsx ('use client')                     │   │
│   │   • Estado local interactivo: [esFavorito, setEsFavorito]               │   │
│   │   • Manejo de eventos: onClick={alternarFavorito}                       │   │
│   │   • Feedback accesible: aria-pressed={esFavorito}                       │   │
│   │   • Hidratación quirúrgica: Cero JavaScript descargado para el layout   │   │
│   └─────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Ficha técnica de arquitectura: Server vs Client Components

En estricto cumplimiento de la Actividad 4 de la guía, la siguiente matriz documenta la clasificación de cada archivo, justificando qué exige el entorno cliente y qué permanece en el servidor:

| Archivo / Componente | Entorno de Ejecución | Directiva | Justificación Técnica de Negocio e Ingeniería |
| :--- | :--- | :--- | :--- |
| `app/layout.tsx` | Servidor | *Por defecto* | No requiere `useState` ni escuchadores de eventos. Renderiza la estructura global (`html`, `body`), la navegación semántica y el footer. Permanece en servidor para no enviar código de hidratación innecesario al cliente. |
| `app/page.tsx` | Servidor | *Por defecto* (`async`) | Realiza la llamada asíncrona a la API de datos para consultar el aforo de las cocheras de Lima. Al ejecutarse en servidor, la petición ocurre directamente en el backend, no expone URLs internas al cliente y envía HTML estático optimizado para LCP. |
| `app/about/page.tsx` | Servidor | *Por defecto* | Vista 100% de lectura editorial: misión institucional de descongestionamiento vehicular, red de casetas y nómina del equipo. Cero interactividad requerida; renderizado estático puro con impacto nulo en el bundle de JavaScript. |
| `TarjetaCochera.tsx` | Servidor | *Por defecto* | Componente de presentación pura que recibe datos por `props`. Renderiza la información de tarifa, aforo y distrito sin requerir estado. |
| `BotonFavorito.tsx` | Cliente | `'use client'` | **Exige ejecución en el cliente** debido a que maneja estado reactivo local (`useState`), escucha eventos de puntero (`onClick`), reproduce feedback visual instantáneo de guardado en memoria y actualiza atributos dinámicos de accesibilidad (`aria-pressed`). |

---

## 6. Modelo de datos y Data Fetching en Servidor

### 6.1. Contrato de la experiencia de estacionamiento (TypeScript)

Para evitar tipos `any` y asegurar robustez tipada en la obtención de datos:

```typescript
export interface ExperienciaCochera {
  readonly id: number;
  readonly nombre: string;
  readonly distrito: "Miraflores" | "San Isidro" | "Surco" | "San Borja";
  readonly direccion: string;
  readonly tarifaHora: number;
  readonly plazasDisponibles: number;
  readonly aforoTotal: number;
  readonly estadoOperativo: "abierto" | "aforo_critico" | "cerrado";
  readonly imagenUrl: string;
  readonly tiempoPromedioAccesoMin: number;
}
```

### 6.2. Estrategia de Data Fetching y Caché en Next.js 15

En Next.js 15, las peticiones `fetch()` dentro de Server Components ya no aplican almacenamiento en caché estático por defecto (`cache: 'no-store'` es el nuevo comportamiento predeterminado). 

Para nuestro catálogo de cocheras, donde las tarifas y aforos cambian periódicamente pero no requieren consultar la base de datos en cada milisegundo, implementamos la estrategia **Incremental Static Regeneration (ISR)** mediante revalidación por tiempo:

```typescript
async function obtenerCocheraDestacada(): Promise<ExperienciaCochera> {
  try {
    // Consulta a API de telemetría de cocheras con revalidación a 60 segundos
    const respuesta = await fetch("https://jsonplaceholder.typicode.com/posts/1", {
      next: { revalidate: 60 } // Estrategia declarativa de caché en Next.js 15
    });

    if (!respuesta.ok) {
      throw new Error(`Fallo en el servicio de telemetría: ${respuesta.status}`);
    }

    const post = await respuesta.json();

    // Mapeo adaptado al dominio comercial de Quadrate pe
    return {
      id: post.id,
      nombre: "Estacionamiento Financiero Begonias",
      distrito: "San Isidro",
      direccion: "Calle Las Begonias 441, Lima",
      tarifaHora: 8.50,
      plazasDisponibles: 18,
      aforoTotal: 80,
      estadoOperativo: "abierto",
      imagenUrl: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800&q=80",
      tiempoPromedioAccesoMin: 3
    };
  } catch (error) {
    console.error("Error al obtener datos en servidor:", error);
    // Retorno de fallback resiliente para garantizar que la página no caiga
    return {
      id: 0,
      nombre: "Plaza Central Larco (Modo Respaldo)",
      distrito: "Miraflores",
      direccion: "Av. José Larco 812, Lima",
      tarifaHora: 9.00,
      plazasDisponibles: 12,
      aforoTotal: 65,
      estadoOperativo: "abierto",
      imagenUrl: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800&q=80",
      tiempoPromedioAccesoMin: 4
    };
  }
}
```

---

## 7. Estrategia de Metadatos y SEO (Metadata API)

Next.js 15 sustituye la inyección manual de etiquetas en `<head>` mediante la exportación del objeto fuertemente tipado `metadata: Metadata`. Esto asegura que los motores de búsqueda y navegadores reciban los encabezados correctos antes de la renderización del contenido:

### 7.1. Metadata global (`app/layout.tsx`)
```typescript
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | Quadrate pe — Cocheras Inteligentes en Lima",
    default: "Quadrate pe — Red Inteligente de Playas de Estacionamiento en Lima"
  },
  description: "Conectamos conductores con playas de estacionamiento verificadas en Lima Metropolitana. Aforo en tiempo real, tarifas transparentes y reserva de plazas.",
  keywords: ["estacionamiento lima", "cocheras san isidro", "parqueo miraflores", "aforo cocheras"],
  authors: [{ name: "Grupo 04 - Ingeniería de Software UAP" }]
};
```

### 7.2. Metadata específica de página (`app/about/page.tsx`)
```typescript
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Acerca de Nosotros y Red de Casetas",
  description: "Conoce el propósito de Quadrate pe, nuestra infraestructura tecnológica de casetas inteligentes y el equipo de desarrollo detrás de la plataforma."
};
```

---

## 8. Matriz de pruebas de aceptación (Criterios de Verificación)

| ID Prueba | Escenario de Prueba | Criterio de Aceptación Exigido | Verificación Técnica Realizada |
| :--- | :--- | :--- | :--- |
| **PA-01** | Ruta `/` | La ruta raíz carga la página de Inicio sin errores de consola ni advertencias de compilación. | Carga `app/page.tsx` con el título principal, bienvenida, descripción de la plataforma y tarjeta de la cochera destacada. |
| **PA-02** | Ruta `/about` | Al ingresar directamente a `http://localhost:3000/about` la página carga de forma independiente. | Muestra el propósito de descongestionamiento en Lima, el mapa de garitas y la nómina de los 5 integrantes de Grupo 04. |
| **PA-03** | Navegación | Los enlaces en el header permiten transicionar entre `/` y `/about` mediante el componente `<Link>`. | Navegación instantánea por el cliente (Soft Navigation) sin recargar la ventana completa del navegador. |
| **PA-04** | Layout compartido | La cabecera institucional (`header`) y el pie de página (`footer`) permanecen estables durante la navegación. | El contenido interior cambia dinámicamente en `{children}` sin parpadeo del encabezado ni pérdida de scroll en la barra superior. |
| **PA-05** | Interacción en cliente | El botón "Guardar en Favoritos" reacciona al clic cambiando su estado visual y texto. | Conmuta entre "☆ Guardar en Favoritos" y "★ Guardado en Favoritos", actualizando `aria-pressed="true"`. |
| **PA-06** | Data fetching | Los datos de la cochera destacada se obtienen en el servidor y se renderizan sin spinners parpadeantes en el cliente. | Datos visibles desde el primer byte de HTML generado por el servidor, con gestión de contingencia (fallback) ante caídas de red. |
| **PA-07** | Metadata API | El título de la pestaña del navegador refleja con exactitud la página activa. | Pestaña de inicio: `Quadrate pe — Red Inteligente...`; pestaña de About: `Acerca de Nosotros y Red de Casetas \| Quadrate pe`. |
| **PA-08** | Adaptabilidad responsive | El diseño se ajusta de forma fluida a dispositivos móviles (375px) y pantallas de escritorio (1280px). | Layout con CSS Grid y Flexbox adaptable; navegación y tarjetas totalmente legibles sin desbordamiento horizontal. |

---

## 9. Respuestas a las preguntas de reflexión de la guía

### Pregunta 10: ¿Qué convención crea la ruta `/about`?
**Respuesta del equipo:** En el App Router de Next.js, el enrutamiento se define enteramente por el sistema de archivos (*File-system Based Routing*). Para crear la ruta `/about`, se crea un directorio llamado `about` dentro de la carpeta `app/`, y dentro de él un archivo obligatorio denominado `page.tsx` (o `page.js`). El nombre de la carpeta define el segmento de la URL, mientras que el archivo `page.tsx` define la interfaz pública que se expone a esa ruta. Cualquier archivo con otro nombre (como `styles.css` o `helper.ts`) en esa carpeta no se convierte en ruta, lo que permite la colocación de archivos privados (*colocation*).

### Pregunta 11: ¿Por qué header y footer se implementan en layout?
**Respuesta del equipo:** Porque el archivo `app/layout.tsx` actúa como el envoltorio estructural compartido por todas las páginas de ese nivel o niveles inferiores. Al colocar el `header` y el `footer` en el layout:
1. **Se erradica la duplicación de código:** No es necesario importar ni renderizar los encabezados en cada página individual.
2. **Se preserva el estado y se evitan re-renderizados costosos:** Durante la navegación entre rutas, Next.js mantiene montado el layout y únicamente reemplaza el nodo `{children}` correspondiente a la nueva página, garantizando una navegación ultrafluida, sin parpadeos y sin perder estados como el scroll del encabezado.

### Pregunta 12: ¿Qué representa `children`?
**Respuesta del equipo:** En TypeScript/React, `children` es una prop especial de tipo `React.ReactNode` que representa los elementos secundarios anidados dentro de un componente contenedor. En el contexto de `app/layout.tsx`, `{children}` representa dinámicamente la página o layout anidado que coincide con la URL activa en el navegador (por ejemplo, el contenido retornado por `app/page.tsx` cuando se visita `/`, o por `app/about/page.tsx` cuando se visita `/about`).

### Pregunta 13: ¿Qué funcionalidades justifican `'use client'`?
**Respuesta del equipo:** La directiva `'use client'` marca la frontera entre el código que se ejecuta exclusivamente en el servidor y el código que debe descargarse, compilarse e hidratarse en el navegador. Las funcionalidades que justifican estrictamente su uso son:
1. **Manejo de estado interactivo:** Hooks como `useState`, `useReducer` o stores reactivos.
2. **Efectos y ciclo de vida del cliente:** Hooks como `useEffect`, `useLayoutEffect`.
3. **Escuchadores de eventos del DOM:** `onClick`, `onChange`, `onSubmit`, `onKeyDown`.
4. **Acceso a APIs exclusivas del navegador:** `window`, `document`, `localStorage`, geolocalización, WebSockets o Canvas.  
Cualquier componente puramente presentacional, que solo reciba props y devuelva JSX, debe permanecer como Server Component.

### Pregunta 14: ¿Qué ventajas y riesgos tiene obtener datos en servidor?
**Respuesta del equipo:**
- **Ventajas:**
  1. *Rendimiento y LCP:* La consulta ocurre con baja latencia en el servidor y el HTML viaja pre-renderizado con los datos embebidos, eliminando spinners de carga iniciales.
  2. *Seguridad:* Las claves secretas de API, tokens de base de datos o URLs internas nunca viajan al navegador del usuario.
  3. *Bundle size cero:* Las librerías de conexión (SDKs pesados, ORMs, utilitarios de parseo) no incrementan el peso del JavaScript del cliente.
- **Riesgos:**
  1. *Bloqueo del renderizado:* Si una consulta asíncrona es lenta y no se utiliza streaming con `<Suspense>`, puede demorar el envío de la respuesta al navegador (*TTFB* elevado).
  2. *Falta de reactividad inmediata:* Los datos renderizados en servidor no cambian ante interacciones de puntero del cliente a menos que se invoque una revalidación o acción de servidor (*Server Action*).

### Pregunta 15: ¿Qué cambió respecto a la aplicación React previa?
**Respuesta del equipo:** En la aplicación previa (Semanas 6 a 11), el navegador descargaba un archivo `index.html` prácticamente vacío con un `div id="root"`, y el cliente descargaba todo el código de React, TanStack Query y Zustand para montar la vista. En esta nueva arquitectura con Next.js 15:
1. El servidor despacha HTML completo e inmediatamente legible por el usuario y los motores de búsqueda desde la primera solicitud.
2. Se eliminó la necesidad de empaquetar manualmente shims o configuraciones complejas de build para vistas estáticas.
3. El enrutamiento dejó de requerir bibliotecas cliente como `react-router` o listeners de eventos `hashchange`, adoptando la convención declarativa basada en directorios del App Router.
4. El bundle de JavaScript transmitido al navegador se redujo drásticamente al limitar la hidratación a microcomponentes interactivos.

---

## 10. Conclusión y autorización del Phase Gate hacia el Laboratorio (Etapa 2)

La presente planificación formaliza la arquitectura completa de Next.js 15 para Quadrate pe, delimitando con precisión matemática las fronteras entre servidor y cliente, el esquema de rutas `/` y `/about`, y la estrategia de fetching resiliente.

En estricta observancia del **Phase Gate de `AGENTS.md`**, habiendo validado y cerrado este documento sin omitir ningún requerimiento de la rúbrica, el equipo autoriza formalmente el inicio de la **Etapa 2 (Laboratorio de Rendimiento y Auditoría)**.

---

## 11. Referencias técnicas

- Next.js Core Team. (2024). *Next.js 15 App Router: Project Structure and File Conventions*. Vercel Inc. https://nextjs.org/docs/app
- React Working Group. (2024). *React Server Components Architecture and Boundaries*. React Foundation. https://react.dev/reference/rsc/server-components
- W3C Web Accessibility Initiative. (2023). *WAI-ARIA Authoring Practices: Button Pattern (aria-pressed)*. World Wide Web Consortium. https://www.w3.org/WAI/ARIA/apg/patterns/button/
