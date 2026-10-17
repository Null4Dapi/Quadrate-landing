# Quadrate pe — Landing Page

Landing page oficial de **Quadrate pe**, la plataforma móvil para la gestión operativa de playas de estacionamiento y localización inteligente para conductores en Lima Metropolitana.

Sitio estático de alto rendimiento desarrollado con HTML5 semántico, CSS3 modular (BEM) y Vanilla JavaScript (ES Modules), organizado como un monolito desacoplado listo para migrar a componentes React/JSX.

---

## Estructura del Proyecto

```text
├── index.html           # Documento principal semántico
├── AGENTS.md            # Reglas técnicas y convenciones para agentes de IA
├── DESIGN.md            # Tokens visuales y restricciones estéticas editoriales
├── PERFORMANCE.md       # Metas de carga, Core Web Vitals y budgets
├── CHANGELOG.md         # Registro de cambios (Keep a Changelog)
├── README.md            # Este documento
├── src/
│   ├── assets/          # Logotipo SVG, fuentes Satoshi y mockups vectoriales/webp
│   ├── css/
│   │   ├── variables.css # Tokens CSS (:root)
│   │   ├── reset.css     # Reseteo CSS moderno
│   │   ├── fonts.css     # Tipografía Satoshi
│   │   ├── main.css      # Orquestador CSS de importaciones
│   │   └── components/   # Módulos CSS por bloque BEM
│   │       ├── header.css
│   │       ├── hero.css
│   │       ├── why-us.css
│   │       ├── caseta.css
│   │       ├── community.css
│   │       ├── app-showcase.css
│   │       ├── rates.css
│   │       ├── tab-view.css
│   │       ├── manifesto.css
│   │       ├── waitlist.css
│   │       └── footer.css
│   └── js/
│       ├── config.js     # Configuración y constantes inmutables
│       ├── content.js    # Textos, copys y datos crudos desacoplados
│       ├── services/     # Llamadas a red y wrappers API
│       │   └── api.js
│       ├── features/     # Lógica de componentes interactivos
│       │   ├── adaptive-header.js
│       │   ├── mobile-menu.js
│       │   ├── tab-navigation.js
│       │   └── waitlist.js
│       └── main.js       # Punto de entrada e inicialización de listeners
```

---

## Ejecución Local y Compilación React

El proyecto cuenta con scripts nativos en `package.json` sin bundlers pesados:

### 1. Iniciar Servidor Local
```bash
npm start
```
Inicia el servidor HTTP nativo en [http://localhost:3000](http://localhost:3000) con soporte para tipos MIME (HTML, CSS, JS módulos, WebP, WOFF2).

### 2. Compilar Componentes React (JSX → ES Modules)
```bash
npm run build:react
```
Ejecuta `scripts/compilar-react.cjs` transpilando los archivos `.jsx` en `src/js/react/` a módulos `.js` estándar consumibles por el navegador con inyección de hooks.

---

## Módulos React Integrados (Semana 6)

1. **Tour Interactivo de Caseta (`CasetaTour` y `CasetaFila`):**
   - **Props:** `<CasetaFila />` recibe `indice`, `titulo`, `detalle`, `estaActiva` y `alSeleccionar`.
   - **Auto-play y Temporizador:** Rota automáticamente de característica cada 4 segundos mediante `setInterval`.
   - **Limpieza de Recursos:** `useEffect` con `clearInterval` que libera el timer al desmontar o pausar.
   - **Controles de Usuario:** Botones para **Pausar / Reanudar** (`active`) y **Reiniciar** al paso inicial.
   - **Carga Simulada:** `useEffect` con `setTimeout` (800ms) y `clearTimeout` simulando conexión con garitas.

2. **Demostrador en Vivo (`QuadrateLiveApp`):**
   - **Estado y Eventos:** Filtros de cocheras por distrito, buscador reactivo y simulador de reserva por ETA.
   - **Foco Programático (`useRef`):** Foco accesible en el buscador al limpiar texto (`✕`) y foco automático en el primer campo al conmutar a la pestaña de afiliación.

---

## Matriz de Pruebas de Aceptación (Laboratorio N.° 4)

| ID | Prueba | Comportamiento en Quadrate pe | Estado |
| :--- | :--- | :--- | :---: |
| **LAB1** | Arranque e Integración | La landing page conserva intactas todas sus secciones previas y arranca en `http://localhost:3000`. | ✅ Aprobado |
| **LAB2** | Carga Simulada | `CasetaTour` y `QuadrateLiveApp` aplican `setTimeout` y cancelan con `clearTimeout`. | ✅ Aprobado |
| **LAB3** | Monitor / Timer Activo | El temporizador rota las características de caseta en intervalos continuos de 1 segundo. | ✅ Aprobado |
| **LAB4** | Detener / Reactivar | Al presionar **Pausar**, se ejecuta `clearInterval` y el contador se detiene sin duplicarse al reanudar. | ✅ Aprobado |
| **LAB5** | Reiniciar | Al presionar **Reiniciar**, el carrusel vuelve al paso 1 (índice 0) y el tiempo se restablece a 4s. | ✅ Aprobado |
| **LAB6** | Limpieza al Desmontar | Al conmutar de pestaña en el header, los efectos limpian sus temporizadores pendientes. | ✅ Aprobado |
| **LAB7** | Dependencias | El array `[estaReproduciendo]` garantiza que el efecto recree el intervalo solo al cambiar el estado de pausa. | ✅ Aprobado |
| **LAB8** | Uso de `useRef` | Enfoca programáticamente inputs reales (buscador y formulario de afiliación) sin re-renders. | ✅ Aprobado |
| **LAB9** | Consola Limpia | Ejecución fluida en navegador sin errores de sintaxis ni fugas de memoria. | ✅ Aprobado |

---

## Filosofía de Desarrollo

- **Mobile-First:** Diseñado prioritariamente para viewports móviles de 320px–430px y expandido progresivamente a escritorio.
- **Component-Driven UI:** Cada bloque BEM en HTML y CSS corresponde 1 a 1 a un futuro componente React (`<Hero />`, `<WhyUs />`, `<AppShowcase />`, `<Rates />`, `<WaitlistForm />`).
- **Datos Desacoplados:** Todos los textos y enlaces residen en `src/js/content.js`.
- **Cero Clichés Visuales:** Sin estética neón artificial ni iconitis; jerarquía sostenida en tipografía editorial (Satoshi), espacios en blanco y contrastes arquitectónicos.
