/* Configuración del recorrido. Para incorporar clips reales, escribe las rutas
 * locales en video; cada clip se controla con el desplazamiento de su tramo.
 * Las imágenes funcionan por sí solas y también como póster durante la carga. */
window.PARKGO_CONFIG = {
  brand: 'ParkGO',
  sceneVh: 165,
  scenes: [
    { image: 'assets/city.webp', video: '', focus: 67, scale: 1.12, x: -2.5 },
    { image: 'assets/entrance.webp', video: '', focus: 65, scale: 1.15, x: 2 },
    { image: 'assets/parked.webp', video: '', focus: 66, scale: 1.12, x: -2 },
    { image: 'assets/owner.webp', video: '', focus: 67, scale: 1.10, x: 1.5 }
  ]
};
