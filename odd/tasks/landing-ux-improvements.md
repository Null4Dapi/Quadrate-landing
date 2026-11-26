# Feature: landing-ux-improvements — Mejoras de Diseño y Experiencia de Usuario

## Specs

- S1: El texto de `p.hero__description` debe ser: "Quadrate pe conecta conductores con playas de estacionamiento independientes. Tarifas transparentes, disponibilidad en vivo y reserva dinámica asegurada por tiempo estimado de llegada."
- S2: Eliminar el enlace `a.hero__app-label` ("Conocé los cuatro módulos") por ser innecesario.
- S3: El título del Hero ("Sin vueltas", "y pago exacto.") debe tener una animación de tipeado (efecto "typewriter") con CSS y JavaScript, tipeado carácter por carácter con intervalo de 100 ms y dos estados: Escribiendo y borrando.
- S4: Integrar en la sección Hero el asset móvil en perspectiva (`src/assets/mockup-iphone-lado.webp`).
- S5: Convertir la sección `section#modulos` en un formato Bento Grid interactivo y reactivo para los cuatro módulos del sistema.
- S6: Reemplazar el flujo estático de `section#como-funciona` por el Tour Interactivo de Caseta con telemetría, lista de características navegable y mockups dinámicos sincronizados.
- S7: Reformular `section#manifiesto` como un carrusel/slider editorial de testimonios de conductores y dueños de playas estilo Orbix Studio (calificación 5/5, citas de impacto, autor y controles).
- S8: Mantener intactos los colores, tipografías y tokens de diseño, verificando responsive (320px–1440px), cero errores de consola y límite estricto de líneas (≤ 400 líneas por archivo de código).

## Tasks

- T1: Actualizar copy y estructura del Hero (descripción S1, eliminación de enlace secundario S2, incorporación del asset móvil S4). (odd/tasks/landing-ux-improvements.md, T1, S1, S2, S4)
- T2: Desarrollar módulo JS y estilos para la animación Typewriter en el título del Hero a 100ms con estados escribiendo y borrando (S3). (odd/tasks/landing-ux-improvements.md, T2, S3)
- T3: Rediseñar la sección Módulos en Bento Grid interactivo y reactivo con micro-interfaces (S5). (odd/tasks/landing-ux-improvements.md, T3, S5)
- T4: Integrar el Tour Interactivo de Caseta en Cómo funciona con selector de características y mockups dinámicos (S6). (odd/tasks/landing-ux-improvements.md, T4, S6)
- T5: Desarrollar el Slider de Testimonios en Manifiesto con controles, autor, roles y calificación 5/5 (S7). (odd/tasks/landing-ux-improvements.md, T5, S7)
- T6: Verificación global visual, funcional, responsive (320px–1440px), consola limpia y límites de líneas (S8). (odd/tasks/landing-ux-improvements.md, T6, S8)

## Log

- L1: Solicitud del usuario: Mejorar el Hero (descripción, eliminar enlace secundario, animación typewriter a 100ms en el título, asset móvil), Bento Grid en Módulos, Tour de Caseta en Cómo funciona, y Slider de Testimonios en Manifiesto manteniendo colores y tipografía.
