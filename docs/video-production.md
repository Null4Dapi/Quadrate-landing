# Continuidad cinematográfica del recorrido

Estado: imágenes creadas y motor preparado; clips pendientes de generación. Estos prompts son una guía de producción y no implican que los vídeos hayan sido generados.

## Dirección visual

Cámara estable, lentes naturales, arquitectura realista de Lima, reflejos físicamente coherentes, colores azul profundo y luces cálidas. Mantener el mismo automóvil azul en los tres primeros planos. Evitar cambios de modelo, logos, objetos que aparecen de la nada, deformaciones, cortes y transiciones artificiales. No incrustar textos ni interfaces; esos elementos ya están en HTML.

Usar las imágenes originales de `source-images/` como primer y último fotograma. El final de un clip debe coincidir con el inicio del siguiente. Preparar imágenes con el mismo encuadre 16:9 y revisar la continuidad del automóvil y el entorno antes de generar.

## Clip 1 · Ciudad → entrada

- Inicio: `city.png`.
- Final: `entrance.png`.
- Duración orientativa: 8–10 segundos, 16:9, sin audio.

Prompt:

> A continuous cinematic camera move connecting the supplied first and last frames. Follow the exact same cobalt-blue compact crossover as it slowly approaches the parking entrance. The camera smoothly arcs from the street-facing three-quarter view toward the rear three-quarter view, revealing the same contemporary urban parking entrance. Preserve the vehicle's design, proportions, paint, wheels and all architectural continuity. Natural grounded camera motion, no teleporting, no cuts, no dissolves, no morphing. Consistent blue-hour ambient light and warm parking illumination. Settle exactly on the supplied final frame. No text, no logos, no interface, no audio.

## Clip 2 · Entrada → estacionado

- Inicio: `entrance.png`.
- Final: `parked.png`.
- Duración orientativa: 8–10 segundos, 16:9, sin audio.

Prompt:

> One continuous stabilized camera shot connecting the supplied entrance and parked-car frames. The same cobalt-blue compact crossover enters slowly, moves into its bay, and comes to a gentle stop. The camera follows and gradually arcs to the final front three-quarter perspective. Match the exact supplied final composition. Maintain consistent vehicle identity, realistic tire motion, bay lines, columns and architectural scale. No car transformation, no camera shake, no abrupt zoom, no cuts, no fades. Natural commercial cinematography with blue ambient shadows and warm practical lights. No text, no logos, no interface, no audio.

## Clip 3 · Lugar → propietario

- Inicio: `parked.png`.
- Final: `owner.png`.
- Duración orientativa: 8–10 segundos, 16:9, sin audio.

Prompt:

> A continuous, realistic camera move from the supplied parked-car frame to the supplied parking-owner frame. Move gently through the parking entrance area and reveal the owner already standing with his smartphone. Keep the person and all objects physically present throughout their visible movement; nothing materializes. Preserve the supplied owner's appearance, navy overshirt and smartphone. Reconcile the lighting naturally while preserving the location's materials and architectural continuity. Settle exactly on the final frame. No cuts, no dissolves, no morphing, no impossible geometry, no camera shake, no text, no logos, no audio.

## Clip 4 · Propietario, cierre opcional

Usar `owner.png` como imagen inicial y generar únicamente un movimiento de cámara muy leve y respiración natural. Mantener rostro, ropa, manos y teléfono. Alternativamente, conservar la imagen final sin vídeo.

## Codificación para scroll

MP4 H.264, 1080p, 24 fps y fotogramas clave frecuentes ayudan a buscar posiciones de vídeo. Ejemplo de preparación:

```sh
ffmpeg -i entrada.mp4 -an -vf "scale=1920:-2,fps=24" -c:v libx264 -preset slow -crf 25 -g 6 -keyint_min 6 -sc_threshold 0 -pix_fmt yuv420p -movflags +faststart salida.mp4
```

Configurar `dist/config.js` con las rutas finales y probar avance, retroceso y cambios de sección. El código no consume una API de generación al visitar la web; los clips se producen una vez y se sirven como archivos.
