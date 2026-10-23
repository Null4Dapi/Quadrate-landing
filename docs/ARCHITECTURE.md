# Arquitectura del Proyecto y Presupuesto de Rendimiento

## Propósito

Quadrate pe es una landing comercial estática para conectar conductores con playas de estacionamiento en Lima Metropolitana. El sitio se construye con HTML semántico, CSS modular BEM y JavaScript en módulos nativos. React se integra para las vistas interactivas existentes sin introducir un bundler.

## Estructura y responsabilidades

| Área | Responsabilidad |
| --- | --- |
| `index.html` | Estructura semántica de la landing y puntos de montaje de las vistas interactivas. |
| `src/css/` | Estilos globales, tokens y módulos BEM importados desde `main.css`. |
| `src/js/main.js` | Punto de entrada que inicializa cabecera, menú, pestañas y aplicaciones interactivas. |
| `src/js/features/` | Comportamientos desacoplados, como navegación y formulario de lista de espera. |
| `src/js/react/` | Componentes React/JSX del Tour de Caseta y Quadrate Live. |
| `src/js/content.js` y `src/js/config.js` | Contenido y configuración separados de la lógica de interfaz. |
| `src/js/services/` | Operaciones de servicio; actualmente incluyen persistencia local simulada. |
| `scripts/` | Servidor local y compilador que transforma JSX a módulos JavaScript para el navegador. |
| `src/assets/` | Recursos visuales y dependencias de React/Babel autoalojadas. |

El CSS se organiza por bloques y se importa desde `src/css/main.css`. `src/js/main.js` coordina la inicialización de módulos. `npm run build:react` compila los componentes JSX a archivos JavaScript consumibles por el navegador; `npm start` ejecuta el servidor local.

## Restricciones de implementación

- Priorizar capacidades nativas del navegador y evitar dependencias o bundlers pesados sin una necesidad aprobada.
- Mantener HTML semántico, estilos modulares BEM y responsabilidades JavaScript separadas.
- Las interacciones deben conservar navegación por teclado y feedback accesible.
- Ningún archivo del repositorio debe superar las 300 líneas, según la convención global.

## Presupuesto de rendimiento

Estos valores son presupuestos del proyecto, no resultados de una medición reciente. Medirlos de nuevo al cambiar assets, CSS, JavaScript o comportamiento de carga.

| Recurso | Límite | Objetivo ideal |
| --- | ---: | ---: |
| Peso total de primera carga, sin comprimir | < 500 KB | < 150 KB |
| HTML (`index.html`) | < 25 KB | < 15 KB |
| CSS combinado | < 45 KB | < 25 KB |
| JavaScript combinado | < 30 KB | < 15 KB |
| Activos gráficos SVG/WebP | < 300 KB | < 80 KB |

## Metas de experiencia

- **LCP:** `< 1.5 s` en conexión móvil 4G estándar; priorizar el contenido del Hero.
- **CLS:** `0.0`; declarar dimensiones de imágenes y reservar espacio para contenido dinámico.
- **INP:** `< 100 ms`; evitar bloqueos del hilo principal y mantener respuesta inmediata a las interacciones.

Estas cifras son metas internas y no implican que las Core Web Vitals hayan sido medidas o aprobadas.

## Políticas de fuentes y activos

- Evitar fuentes remotas y CDNs externos que añadan latencia de red o retrasen el renderizado.
- Autoalojar las fuentes personalizadas en `.woff2` y usar `font-display: swap`.
- Usar SVG para ilustraciones vectoriales y WebP o AVIF para imágenes rasterizadas.
- Aplicar `loading="lazy"` a imágenes debajo del pliegue.
- Mantener SVG sin metadatos innecesarios, con `viewBox` definido y paths optimizados.