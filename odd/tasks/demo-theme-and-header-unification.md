# Feature: Unificación de Tema LocalStorage y Header Institucional en Demo
Status: completed
Route: direct inline

## Specs
- S1: "cuando la página principal está modo oscuro y paso a la demo la demo no hereda el tema"
- S2: "si vamos a tener un localStorage, tiene que planificarse y desarrollarse con las buenas practicas de código, diseño, seguridad, rendimiento, accesibilidad, escalabilidad."
- S3: "en la página de la demo es que e header es completamente diferente al de la landing"
- S4: "también cuenta con otro botón de cambio de tema. Son muchas cosas que creo que se debería modificar."

## Tasks
- [x] T1 (S1, S2): Implementar módulo agnóstico y seguro de tema `src/js/utils/theme.js` con whitelist, try/catch y eventos `storage`/`BroadcastChannel`. [inline, dbf0e08]
- [x] T2 (S1, S2): Inyectar script de precarga sin FOUC en `<head>` de `demo.html` y sincronizar `useAppStore` de Zustand con la clave canónica `quadrate_theme`. [inline, dbf0e08]
- [x] T3 (S3, S4): Reemplazar `.demo-nav` en `demo.html` por la estructura oficial `.header`, incluyendo logo oficial, switch sol/luna y botón de retorno `.header__cta`. [inline, dbf0e08]
- [x] T4 (S4): Armonizar o retirar botón redundante de cambio de turno en el lienzo de la demo para unificar con el conmutador de cabecera. [inline, dbf0e08]
- [x] T5 (S1-S4): Ejecutar suite de pruebas `npm test` y auditoría visual Playwright en Chromium verificando herencia bidireccional y contrastes. [inline, dbf0e08]

## Log
- L1: "Aún no, lo que sucede es que se ha trabajado en la landing principal, pero quadrate live no se adaptó a estos cambios. Mi duda es que cuando la página principal está modo oscuro y paso a la demo la demo no hereda el tema y además el header o botónes son distintos. Levanta el proyecto entero para indicarte esas notaciones."
- L2: "Sí, entonces esa práctica hay que utilizar de localStorage, más bien, lo que sucede en la página de la demo es que e header es completamente diferente al de la landing, también cuenta con otro botón de cambio de tema. Son muchas cosas que creo que se debería modificar."
- L3: "ok, pero si vamos a tener un localStorage, tiene que planificarse y desarrollarse con las buenas practicas de código, diseño, seguridad, rendimiento, accesibilidad, escalabilidad."
- L4: "Sí adelante. Usa ODD para llevar un orden de tareas y subagentes si los requiere"
- L5: Verificación automatizada con Chromium Playwright exitosa: herencia instantánea sin FOUC de landing a demo, cabecera oficial y botón de retorno con curva antialiasing, toast desfasado para no obstruir navegación, y herencia reactiva bidireccional de demo hacia landing confirmada. 11/11 tests unitarios pasando.
