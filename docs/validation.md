# Verificación de esta entrega

Se realizaron comprobaciones de sintaxis JavaScript y 11 pruebas enfocadas del DOM:

1. Identificadores únicos y enlaces internos con destino válido.
2. Existencia de los recursos locales referenciados.
3. Estado inicial del recorrido y una única escena accesible activa.
4. Navegación entre las cuatro escenas y regreso al inicio.
5. Control para reducir movimiento y comportamiento de desplazamiento.
6. Cambio conductor/propietario, enlaces a cada modo y selección con teclado.
7. Búsqueda ilustrativa, selección de estacionamiento y ruta de llegada de ejemplo.
8. Control de espacios y estado visible/en pausa de la demostración.
9. Apertura y cierre del menú móvil con Escape.
10. Apertura y cierre del diálogo informativo.
11. Texto de búsqueda tratado como texto, sin ejecutar HTML.

Resultado: las 11 comprobaciones pasaron. Las pruebas se ejecutaron en un DOM simulado; no equivalen a pruebas visuales en Chrome/Safari ni a pruebas de datos reales.

Las cuatro imágenes se abrieron y verificaron al generarse. Las versiones WebP conservan el encuadre y se sirven desde el proyecto. La tipografía y los recursos se incluyeron localmente.

## Límites pendientes

- No se efectuó revisión visual automatizada en navegador: la herramienta admitida de control de navegador del flujo Sites no estaba disponible en este entorno. La hoja de estilos contempla escritorio y móvil, pero esos tamaños requieren revisión visual posterior.
- El recorrido actual usa imágenes animadas, no clips de video. No se pudo verificar reproducción/seek de MP4 porque los vídeos todavía no se han generado.
- La conexión con disponibilidad real, publicación de estacionamientos y reservas pertenece al aplicativo y no está incluida en esta landing de presentación.

La publicación se comprueba mediante el resultado del servicio de alojamiento, no por estas pruebas locales.
