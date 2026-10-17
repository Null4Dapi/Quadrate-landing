# Bitácora de Desarrollo Académico (docs/CHANGELOG.md)

Registro cronológico interno del equipo para control de intervenciones, entregas y autoría sobre las guías de clase.

---

## [entrega-006-etapa2] — 2026-10-12 16:45
- **Desarrollador:** Manuel Mendo (Integración técnica por equipo)
- **Archivos intervenidos:**
  - `src/css/components/caseta.css`
  - `src/js/react/caseta-tour.jsx`
  - `src/js/react/caseta-fila.jsx`
  - `src/js/react/datos-caseta.js`
  - `src/js/features/tab-navigation.js`
  - `scripts/compilar-react.cjs`
  - `index.html`
  - `README.md`
- **Cambios realizados:**
  - Implementado el Feature Tour de Caseta (`CasetaTour`) con auto-play rotativo de 4 segundos utilizando `setInterval` y su correspondiente limpieza con `clearInterval`.
  - Diseñados controles accesibles de pausa y reanudación (`[estaReproduciendo]`) sin aceleración de intervalos, y botón de reinicio al paso inicial.
  - Implementado componente funcional puro con props (`CasetaFila`) con soporte de navegación accesible por teclado (`Enter` y `Espacio`).
  - Añadida carga simulada de sincronización con garitas (800ms) mediante `useEffect`, `setTimeout` y `clearTimeout`.
  - Conectado foco programático accesible (`useRef`) en el primer campo del formulario al activar la pestaña "Afiliar cochera".
  - Actualizado el pipeline de compilación modular de React y documentada la matriz completa de pruebas LAB1 a LAB9 en `README.md`.
