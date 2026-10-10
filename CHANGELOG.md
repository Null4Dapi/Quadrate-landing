# Registro de Cambios (CHANGELOG.md)

Todos los cambios notables en este proyecto se documentan en este archivo bajo el formato [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/) y siguiendo [Versionado Semántico](https://semver.org/lang/es/).

---

## [0.0.1] - 2026-10-03

### Añadido
- Estructura base del proyecto estático monolítico preparado para migración a JSX/React.
- Documentos de gobierno técnico y contexto: `AGENTS.md`, `DESIGN.md`, `PERFORMANCE.md` y `README.md`.
- Sistema de tokens de diseño globales (`src/css/variables.css`) con estética editorial sobria y libre de clichés cyberpunk.
- Reseteo CSS moderno (`src/css/reset.css`) y hoja de estilos modular orquestadora (`src/css/main.css`).
- Módulos de estilo BEM por sección: `header.css`, `hero.css`, `features.css`, `rates.css`, `waitlist.css` y `footer.css`.
- Activos vectoriales limpios y optimizados: logotipo de Quadrate pe y mockups arquitectónicos para perfiles de Conductor y Caseta.
- Capa desacoplada de datos crudos (`src/js/content.js`) y configuración centralizada (`src/js/config.js`).
- Módulo de formulario interactivo de lista de espera (`src/js/features/waitlist.js`) con validación y accesibilidad semántica.
- Wrapper de llamadas de red nativo (`src/js/services/api.js`) y punto de entrada modular (`src/js/main.js`).
- Documento `index.html` estrictamente semántico (<300 líneas), accesible (a11y) y maquetado bajo enfoque mobile-first.
