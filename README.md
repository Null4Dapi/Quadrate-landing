# ParkGO · Tu lugar en la ciudad

Landing de presentación para la app móvil de estacionamientos ParkGO. Incluye cuatro escenas originales, recorrido controlado por scroll, versión móvil y una demostración interactiva para conductores y propietarios.

## Abrir el proyecto

No requiere instalación ni compilación. Abre `dist/index.html` o sirve la carpeta:

```sh
python3 -m http.server 8000 --directory dist
```

Visita `http://localhost:8000`.

## Archivos

- `dist/index.html`: contenido y estructura.
- `dist/styles.css`: identidad visual, tamaños, móvil y animaciones.
- `dist/app.js`: recorrido, navegación, demostración, búsqueda ilustrativa, controles y preguntas.
- `dist/config.js`: orden de escenas, imágenes, encuadres y rutas opcionales de vídeo.
- `dist/assets/`: fotografías WebP, tipografía local con licencia y favicon SVG.
- `source-images/`: fotografías originales en PNG para edición o generación de vídeos.
- `docs/image-prompts.json`: prompts originales utilizados con ImageGen integrado.
- `docs/video-production.md`: plan y prompts para producir los clips conectados.
- `docs/validation.md`: alcance de las comprobaciones.

## Qué está implementado

El desplazamiento controla la posición, el acercamiento y la transición entre cuatro escenas. Puedes avanzar y volver atrás, usar la navegación por etapas y reducir el movimiento. Los enlaces saltan a las secciones correspondientes.

La demostración permite cambiar entre conductor y propietario. En conductor puedes introducir un destino de ejemplo, seleccionar puntos del mapa y ver una ruta ilustrativa. En propietario puedes cambiar la cantidad de espacios y alternar el estado visible/en pausa dentro de la demostración. Incluye navegación con teclado, estados ARIA y movimiento reducido.

## Alcance de esta entrega

Esta es la landing de presentación, no el backend del aplicativo. La disponibilidad, las ubicaciones y las acciones del teléfono son ejemplos claramente identificados. No se envían formularios, no se crean reservas y no se publican estacionamientos reales. No se han inventado enlaces de tiendas, testimonios ni cifras de usuarios.

El recorrido incluido utiliza **imágenes animadas**, con zoom, desplazamiento y disolvencias. **No incluye clips generados con IA ni un mundo 3D renderizado.** Para reproducir la continuidad cinematográfica de la referencia Arko se deben generar clips entre las imágenes. La cuenta de Higgsfield aún no estaba conectada al preparar esta versión.

## Integrar clips más adelante

1. Genera los clips con el primer y último fotograma según `docs/video-production.md`.
2. Copia los MP4 dentro de `dist/assets/video/`.
3. Cambia `video: ''` por la ruta correspondiente en cada escena de `dist/config.js`.
4. Sirve la web por HTTP. El motor vinculará `currentTime` al scroll y mantendrá la imagen como alternativa durante la carga o cuando se reduzca el movimiento.

La implementación es HTML, CSS y JavaScript nativos. El diseño no depende de librerías externas y las imágenes y fuentes se sirven desde el propio proyecto.

## Imágenes

Generadas con ImageGen integrado para esta entrega. Los originales están en `source-images/` y las versiones optimizadas en `dist/assets/`. La fotografía del propietario muestra a una persona ficticia. La ciudad y los estacionamientos son escenarios ilustrativos.

La tipografía Manrope se distribuye con su licencia SIL Open Font License en `dist/assets/Manrope-OFL.txt`.

## Publicación

La carpeta `dist/` puede publicarse en un alojamiento estático. La configuración de Sites permanece fuera del ZIP portátil de código para que puedas reutilizarlo en otro proveedor.
