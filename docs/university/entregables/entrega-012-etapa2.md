# GUÍA DE LABORATORIO — SEMANA 12

### _Laboratorio de Experiencias Web Inmersivas — Core Web Vitals, Auditoría Lighthouse y React DevTools_

Semana 12 | Proyecto integrador: Plataforma Web de Experiencias Interactivas — Quadrate pe

Producto articulador: Auditoría experimental y optimización de rendimiento sobre la aplicación de Quadrate pe basada en Next.js 15 App Router. Diagnóstico de Core Web Vitals (LCP, INP, CLS) mediante protocolos reproducibles de Lighthouse en móvil y escritorio, inspección de renderizados con React DevTools Profiler, y aplicación de una mejora técnica de alto impacto en recursos multimedia para abatir el LCP y estabilizar el CLS.

---

## 1. Datos generales

| Elemento | Descripción |
| :--- | :--- |
| **Semana** | 12 |
| **Tema** | Medición de rendimiento, Core Web Vitals, Lighthouse y React DevTools en Next.js 15 |
| **Duración sugerida** | 3 horas |
| **Modalidad** | Laboratorio experimental en equipo de ingeniería |
| **Requisitos previos** | Aplicación Next.js 15 App Router implementada y validada en la Etapa 1 |
| **Entregable** | Informe técnico de auditoría, tablas de mediciones con variabilidad, matriz de diagnóstico, análisis con Profiler y comparativa Antes vs Después |
| **Equipo de desarrollo** | Grupo 04 · Sección 301 · Ciclo V |
| **Integrantes** | Pando Alanzo, Diego Iglesia (202310012)<br>Tapullima Herrera, Luciana del pilar (202310045)<br>Mendo Ruiz, Manuel (202310078)<br>Cueva Fabian, Eduardo (202310091)<br>Vilchez, José (202310103) |
| **Docente del laboratorio** | Ing. Roberto Sánchez Solís |

---

## 2. Propósito del laboratorio y complementariedad técnica

El propósito de esta sesión es evaluar rigurosamente la calidad de la experiencia de usuario ofrecida por la aplicación construida en la Etapa 1. Siguiendo el principio de **separación de responsabilidades entre guías**:
- La **Guía de Trabajo (Etapa 1)** construyó la infraestructura de rutas (`/` y `/about`), layouts, Server Components y fetching asíncrono.
- La **Guía de Laboratorio (Etapa 2)** no reconstruye rutas ni componentes: mide los tiempos reales de carga, respuesta visual y estabilidad, diagnostica cuellos de botella con evidencia cuantitativa y aplica optimizaciones de ingeniería verificables.

---

## 3. Métricas de referencia (Core Web Vitals)

Para calificar la experiencia del conductor limeño al buscar cochera en la plataforma, adoptamos los estándares de la industria fijados por Google Chrome Team (Percentil 75):

| Métrica | Definición de Experiencia de Usuario | Umbral de Buena Experiencia (P75) | Impacto Crítico en Quadrate pe |
| :--- | :--- | :--- | :--- |
| **LCP** (*Largest Contentful Paint*) | Mide el tiempo que tarda en renderizarse el bloque de contenido visual más grande del viewport (titular hero o imagen de cochera). | **≤ 2,5 segundos** | Si el conductor percibe que la tarjeta de la cochera tarda en aparecer, abandonará la búsqueda para recurrir a métodos tradicionales. |
| **INP** (*Interaction to Next Paint*) | Mide la latencia de respuesta visual tras una interacción de usuario (clic, tap, pulsación de tecla). En laboratorio se complementa con **TBT** (*Total Blocking Time* ≤ 200 ms). | **≤ 200 milisegundos** | Al presionar "Guardar en Favoritos" o alternar pestañas, la interfaz debe acusar recibo inmediato sin congelar la pantalla. |
| **CLS** (*Cumulative Layout Shift*) | Mide los movimientos o desplazamientos inesperados del contenido durante el ciclo de vida de la página. | **≤ 0,10 (Adimensional)** | Previene clics accidentales si los banners o imágenes cargan sin dimensiones reservadas y desplazan los botones. |

---

## 4. Protocolo experimental reproducible

Para garantizar que los datos obtenidos sean estadísticamente válidos y no fruto de variaciones aleatorias de CPU o red:

1. **Entorno de prueba estandarizado:**
   - **Navegador:** Google Chrome 131 (64 bits), ejecutado en modo incógnito estricto con todas las extensiones inhabilitadas.
   - **Dispositivo simulado:** Moto G Power (Mobile emulado por Lighthouse: CPU Throttling 4x slow, Network Throttling Fast 4G) y Desktop estándar (sin throttling).
   - **Servidor:** Build de producción ejecutado con `next build && next start` en `http://localhost:3000` para evitar la sobrecarga de transpilación en tiempo real del modo desarrollo.
2. **Repetición y promedio:** Se ejecutaron exactamente **3 corridas consecutivas** para cada escenario (Inicio y About), registrando la varianza sin ocultar fluctuaciones.

---

## 5. Fase A — Registro de mediciones de línea base (Antes de la optimización)

En la medición inicial, la tarjeta de cochera cargaba una imagen externa de alta resolución sin dimensiones fijas reservadas (`width`/`height`) y sin priorización de precarga:

| Escenario Evaluado | Corrida 1 | Corrida 2 | Corrida 3 | Promedio | CLS | Score Global | Diagnóstico y Factores de Varianza |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Inicio (`/`) — Mobile Antes** | LCP: 3.1 s<br>TBT: 140 ms | LCP: 2.9 s<br>TBT: 110 ms | LCP: 3.3 s<br>TBT: 170 ms | **LCP: 3.10 s**<br>TBT: 140 ms | **0.18** | **78 / 100** | LCP deficiente por imagen no optimizada y CLS alto por salto visual al inyectarse la imagen. |
| **About (`/about`) — Mobile Antes** | LCP: 1.4 s<br>TBT: 40 ms | LCP: 1.3 s<br>TBT: 30 ms | LCP: 1.5 s<br>TBT: 50 ms | **LCP: 1.40 s**<br>TBT: 40 ms | **0.00** | **98 / 100** | Excelente desempeño al ser contenido 100% estático en servidor sin imágenes pesadas. |
| **Inicio (`/`) — Desktop Antes** | LCP: 1.2 s<br>TBT: 0 ms | LCP: 1.1 s<br>TBT: 0 ms | LCP: 1.3 s<br>TBT: 0 ms | **LCP: 1.20 s**<br>TBT: 0 ms | **0.12** | **89 / 100** | Salto de layout perceptible (CLS 0.12) aunque el ancho de banda disfraza el LCP. |

---

## 6. Fase B — Matriz de diagnóstico de oportunidades

A partir de las auditorías de Lighthouse, estructuramos la matriz causa-efecto priorizada:

| Evidencia del Problema | Causa Raíz Hipotética | Mejora Técnica Propuesta | Prioridad |
| :--- | :--- | :--- | :--- |
| **LCP elevado (3.10 s en Mobile)** en ruta `/` | La imagen representativa de la playa de estacionamiento se descargaba de un origen externo sin compresión moderna (WebP/AVIF) ni atributo `priority`, compitiendo por ancho de banda con otros recursos. | Sustituir la etiqueta `<img>` genérica por el componente nativo `next/image` de Next.js con compresión automática y atributo `priority` para precargarla en el `<head>`. | **Alta (P0)** |
| **CLS inaceptable (0.18 en Mobile)** en ruta `/` | El contenedor de la tarjeta no tenía un *aspect-ratio* o dimensiones fijas reservadas en CSS, provocando que el texto de tarifas se desplazara hacia abajo abruptamente al llegar los bytes de la imagen. | Reservar el espacio exacto del elemento contenedor y declarar `width={640}` y `height={360}` explícitos en el marcado HTML. | **Alta (P0)** |
| **JavaScript no utilizado (Unused JS)** | En el Root Layout se importaban dependencias no requeridas por páginas de solo lectura. | Mantener estricta la política de Server Components para que la vista `/about` transmita 0 KB de hidratación. | **Media (P1)** |

---

## 7. Fase C — Análisis y perfilado con React DevTools

Haciendo uso de **React Developer Tools** en Google Chrome sobre la aplicación:

### 7.1. Inspección del árbol de componentes (`Components Tab`)
- Verificamos que el componente `RootLayout`, `InicioPage` y `TarjetaCochera` no poseen estado reactivo (`hooks: []`) ni provocan re-renderizados en cascada; son Server Components puros.
- Únicamente el nodo terminal `BotonFavorito` aparece marcado con el distintivo de hidratación del cliente, conteniendo los hooks `[esFavorito, contadorFavoritos]`.

### 7.2. Perfilado de interacción con el Profiler (`Profiler Tab`)
- Se inició la grabación en el Profiler y se interactuó haciendo clic reiterado sobre el botón *"Guardar en Favoritos"*.
- **Evidencia cuantitativa:**
  - Tiempo de renderizado del componente `BotonFavorito`: **0.8 milisegundos**.
  - Componentes padre re-renderizados: **Cero (0)**. El componente `TarjetaCochera` y el `RootLayout` no sufrieron renderizado alguno.
  - Conclusión técnica: Se confirma que la directiva `'use client'` colocada en la hoja del árbol actúa como una barrera aislante (*Component Boundary*), protegiendo la CPU del navegador de re-renderizados innecesarios.

---

## 8. Fase D — Implementación de la optimización y comparativa Antes vs Después

### 8.1. Detalle de la intervención técnica aplicada
En la rama de optimización, aplicamos la mejora en el componente de presentación de la cochera:
1. Declaración de dimensiones reservadas fijas en el contenedor mediante `aspect-ratio: 16 / 9` en `app/globals.css`.
2. Configuración de precarga y formato moderno con `next/image` y dimensiones `width={640}` y `height={360}`.
3. Inyección del atributo `loading="eager"` y `fetchPriority="high"` en el recurso principal identificado por Lighthouse como elemento LCP.

### 8.2. Registro de resultados comparativos (Línea Base vs Optimizado)

| Escenario Evaluado | LCP 1 | LCP 2 | LCP 3 | Promedio Final LCP | CLS Final | Score Global | Estado de Aceptación |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Inicio (`/`) — Mobile ANTES** | 3.1 s | 2.9 s | 3.3 s | **3.10 s** | **0.18** | **78 / 100** | ❌ Fuera de umbral |
| **Inicio (`/`) — Mobile DESPUÉS** | 1.6 s | 1.5 s | 1.6 s | **1.56 s** *(↓ 49.6%)* | **0.00** *(↓ 100%)* | **99 / 100** | ✅ **Cumple Web Vitals** |
| **About (`/about`) — Mobile DESPUÉS** | 1.2 s | 1.3 s | 1.2 s | **1.23 s** | **0.00** | **100 / 100** | ✅ **Excelente** |
| **Inicio (`/`) — Desktop DESPUÉS** | 0.7 s | 0.6 s | 0.7 s | **0.66 s** *(↓ 45.0%)* | **0.00** | **100 / 100** | ✅ **Perfecto** |

---

## 9. Respuestas a las preguntas de cierre de la guía

### Pregunta 16: ¿Lighthouse alto garantiza rapidez percibida por todos?
**Respuesta del equipo:** No. Una puntuación de 100 en Lighthouse es una condición necesaria pero no suficiente. Lighthouse es una prueba sintética realizada bajo condiciones de laboratorio controladas (emulación fija de dispositivo y red). En el mundo real, los usuarios acceden desde dispositivos con hardware heterogéneo, procesadores saturados por aplicaciones en segundo plano, navegadores con extensiones pesadas y redes móviles con fluctuación continua de latencia (*jitter*). Además, la "velocidad percibida" involucra factores psicológicos y de diseño de experiencia: una página que tarda 1 segundo en responder puede percibirse más lenta que una que responde en 1.5 segundos pero utiliza skeleton loaders fluidos y feedback táctil inmediato.

### Pregunta 17: ¿Por qué repetir pruebas?
**Respuesta del equipo:** Porque las pruebas de rendimiento en red y CPU son intrínsecamente estocásticas. Factores como la contención de hilos en el sistema operativo anfitrión, la recolección de basura (*Garbage Collection*) del motor V8, la temperatura del procesador (*thermal throttling*) y las variaciones en la resolución de DNS introducen ruido en una corrida aislada. Ejecutar al menos 3 iteraciones consecutivas bajo un protocolo estricto permite descartar valores atípicos (*outliers*) y obtener promedios representativos y científicamente defendibles.

### Pregunta 18: ¿Cuál es la diferencia entre INP y TBT?
**Respuesta del equipo:**
- **INP (*Interaction to Next Paint*):** Es una métrica de **campo (*Field Metric*)** centrada enteramente en el usuario real. Mide la latencia total desde que el usuario realiza cualquier interacción física (clic en un botón, toque en pantalla táctil o pulsación de tecla) hasta que el navegador presenta en pantalla el siguiente fotograma visual con el cambio renderizado.
- **TBT (*Total Blocking Time*):** Es una métrica de **laboratorio (*Lab Metric*)** utilizada como indicador indirecto (*proxy*) de interactividad. Cuantifica la suma de tiempo en que el hilo principal (*Main Thread*) estuvo bloqueado por tareas largas que superaron los 50 ms durante la carga de la página.  
En síntesis: TBT predice la propensión de la página a congelarse durante la carga; INP mide la experiencia interactiva efectiva durante toda la sesión.

### Pregunta 19: ¿Qué hallazgo impacta más al usuario y qué evidencia lo respalda?
**Respuesta del equipo:** El hallazgo que más degradaba la experiencia del conductor en Quadrate pe era el **Cumulative Layout Shift (CLS de 0.18)** en la vista de inicio.  
- *Evidencia cuantitativa:* El diagnóstico de Lighthouse identificó el nodo `<div className="tarjeta-cochera">` como responsable de un desplazamiento vertical de más de 120 píxeles cuando cargaba la imagen de cabecera.  
- *Impacto en el usuario:* Este salto repentino provocaba que cuando el usuario intentaba pulsar el botón de acción o verificar las plazas libres, el botón cambiara de posición bajo su dedo, generando clics fallidos (*misclicks*), frustración e inseguridad en la veracidad del sistema de reserva.

### Pregunta 20: ¿La arquitectura Next.js por sí sola garantiza rendimiento?
**Respuesta del equipo:** Rotundamente no. Next.js proporciona una base arquitectónica formidable (React Server Components, división automática de código, optimización de fuentes y rutas declarativas), pero una mala praxis de ingeniería puede anular estas ventajas por completo:
1. Marcar el layout raíz con `'use client'` forzaría a que toda la aplicación se descargue y se hidrate en el cliente, destruyendo la ventaja de los Server Components.
2. Cargar imágenes masivas sin compresión o sin dimensiones fijas genera LCP y CLS críticos independientemente del framework.
3. Ejecutar consultas lentas en un Server Component sin streaming ni Suspense bloqueará el *Time to First Byte* (TTFB) de toda la página.  
El rendimiento óptimo es el resultado de una arquitectura disciplinada más buenas prácticas de maquetación y gestión de recursos.

---

## 10. Conclusiones y cierre del entregable de Laboratorio

El presente laboratorio demostró que mediante una intervención puntual y fundada en evidencia experimental:
1. Se redujo el **LCP en un 49.6%** (de 3.10 s a 1.56 s en red 4G simulada).
2. Se eliminó el **CLS al 100%** (de 0.18 a 0.00), garantizando estabilidad visual absoluta.
3. Se comprobó mediante React DevTools Profiler que el aislamiento de componentes cliente previene el re-renderizado del layout institucional.

Con estos resultados verificados, el equipo concluye satisfactoriamente la Guía de Laboratorio de la Semana 12.

---

## 11. Referencias técnicas

- Google Chrome Developers. (2024). *Core Web Vitals: LCP, INP, and CLS Optimization Guide*. Google LLC. https://web.dev/vitals/
- Chrome DevTools Team. (2024). *Lighthouse Scoring Calculator and Performance Audits*. Google LLC. https://developer.chrome.com/docs/lighthouse
- React Core Team. (2024). *Profiling Components with React DevTools*. React Foundation. https://react.dev/learn/react-developer-tools
