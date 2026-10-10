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

## Ejecución Local

Dado que utiliza módulos ES nativos de JavaScript (`type="module"`), se recomienda ejecutar un servidor HTTP local para evitar restricciones de CORS del protocolo `file://`:

### Opción 1: Python 3 (Sin dependencias)
```bash
python3 -m http.server 8000
```
Abrir en el navegador: [http://localhost:8000](http://localhost:8000)

### Opción 2: Node.js (npx serve)
```bash
npx serve .
```

### Opción 3: Extensión Live Server de VS Code
Hacer clic derecho sobre `index.html` y seleccionar **Open with Live Server**.

---

## Filosofía de Desarrollo

- **Mobile-First:** Diseñado prioritariamente para viewports móviles de 320px–430px y expandido progresivamente a escritorio.
- **Component-Driven UI:** Cada bloque BEM en HTML y CSS corresponde 1 a 1 a un futuro componente React (`<Hero />`, `<WhyUs />`, `<AppShowcase />`, `<Rates />`, `<WaitlistForm />`).
- **Datos Desacoplados:** Todos los textos y enlaces residen en `src/js/content.js`.
- **Cero Clichés Visuales:** Sin estética neón artificial ni iconitis; jerarquía sostenida en tipografía editorial (Satoshi), espacios en blanco y contrastes arquitectónicos.
