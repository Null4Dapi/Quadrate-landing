/**
 * Quadrate pe — Controlador de Escena 3D e Interacción Hero
 * Carga modular de Three.js, animación amortiguada, interacción con mouse y
 * optimización con IntersectionObserver para pausa automática fuera de pantalla.
 */

import * as THREE from "../../../assets/vendor/three.module.js";
import {
  crearMapaEntornoEstudio,
  crearMaterialesTelefono,
} from "./phone-materials.js";
import { construirModeloTelefono } from "./phone-geometry.js";

const ROTACION_BASE = { x: 0.04, y: -0.22, z: 0.0 };
const ZOOM_BASE = 12.0;

/**
 * Comprueba compatibilidad con WebGL en el navegador del usuario.
 * @returns {boolean}
 */
function verificarCompatibilidadWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch (e) {
    return false;
  }
}

/**
 * Inicializa el modelo 3D del iPhone en el hero de la landing page.
 */
export function inicializarHeroTelefono3D() {
  const contenedor = document.getElementById("hero-phone-canvas");
  const figuraPadre = document.getElementById("hero-mockup-figure");
  const seccionHero = document.getElementById("inicio");

  if (!contenedor || !figuraPadre || !verificarCompatibilidadWebGL()) {
    return;
  }

  const prefiereMovimientoReducido = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // 1. Escena y Entorno
  const escena = new THREE.Scene();
  const mapaEntorno = crearMapaEntornoEstudio(THREE);
  escena.environment = mapaEntorno;

  // 2. Cámara
  const anchoInicial = contenedor.clientWidth || 340;
  const altoInicial = contenedor.clientHeight || 560;
  const camara = new THREE.PerspectiveCamera(
    36,
    anchoInicial / altoInicial,
    0.1,
    100
  );
  camara.position.set(0, 0, ZOOM_BASE);

  // 3. Renderizador optimizado para alto rendimiento y bajo consumo
  const renderizador = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderizador.setSize(anchoInicial, altoInicial);
  renderizador.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderizador.toneMapping = THREE.ACESFilmicToneMapping;
  renderizador.toneMappingExposure = 1.15;
  contenedor.appendChild(renderizador.domElement);

  // 4. Iluminación de estudio
  const luzAmbiente = new THREE.AmbientLight(0xffffff, 0.65);
  escena.add(luzAmbiente);

  const luzClave = new THREE.DirectionalLight(0xfffbf0, 1.8);
  luzClave.position.set(6, 8, 7);
  escena.add(luzClave);

  const luzBorde = new THREE.DirectionalLight(0xdbeafe, 1.3);
  luzBorde.position.set(-7, 4, -6);
  escena.add(luzBorde);

  const luzRelleno = new THREE.DirectionalLight(0xffffff, 0.6);
  luzRelleno.position.set(0, -8, 4);
  escena.add(luzRelleno);

  // 5. Construcción e inserción del modelo 3D
  const materiales = crearMaterialesTelefono(THREE, mapaEntorno, "natural");
  const grupoTelefono = construirModeloTelefono(THREE, materiales);
  grupoTelefono.rotation.x = ROTACION_BASE.x;
  grupoTelefono.rotation.y = ROTACION_BASE.y;
  grupoTelefono.rotation.z = ROTACION_BASE.z;
  escena.add(grupoTelefono);

  // 6. Estado de rotación e interactividad
  const rotacionObjetivo = { ...ROTACION_BASE };
  const rotacionActual = { ...ROTACION_BASE };
  let idAnimacion = null;
  let estaVisibleEnPantalla = true;

  function manejarMovimientoRaton(evento) {
    if (prefiereMovimientoReducido) return;
    const rect = figuraPadre.getBoundingClientRect();
    const centroX = rect.left + rect.width / 2;
    const centroY = rect.top + rect.height / 2;

    const deltaX = (evento.clientX - centroX) / (window.innerWidth * 0.45);
    const deltaY = (evento.clientY - centroY) / (window.innerHeight * 0.45);

    // Inclinación sutil y controlada (máximo ±0.2 rad)
    rotacionObjetivo.y = ROTACION_BASE.y + Math.max(-0.24, Math.min(0.24, deltaX * 0.35));
    rotacionObjetivo.x = ROTACION_BASE.x - Math.max(-0.16, Math.min(0.16, deltaY * 0.22));
  }

  function reiniciarRotacion() {
    rotacionObjetivo.x = ROTACION_BASE.x;
    rotacionObjetivo.y = ROTACION_BASE.y;
  }

  const objetivoInteraccion = seccionHero || window;
  objetivoInteraccion.addEventListener("mousemove", manejarMovimientoRaton, { passive: true });
  objetivoInteraccion.addEventListener("mouseleave", reiniciarRotacion, { passive: true });

  // 7. Ajuste responsivo de dimensiones
  function ajustarDimensiones() {
    const ancho = contenedor.clientWidth;
    const alto = contenedor.clientHeight;
    if (ancho === 0 || alto === 0) return;
    camara.aspect = ancho / alto;
    camara.updateProjectionMatrix();
    renderizador.setSize(ancho, alto);
  }
  window.addEventListener("resize", ajustarDimensiones, { passive: true });

  // 8. Bucle de animación amortiguado (Damping)
  function animar(tiempo) {
    if (!estaVisibleEnPantalla || document.hidden) {
      idAnimacion = null;
      return;
    }

    if (!prefiereMovimientoReducido) {
      rotacionActual.x += (rotacionObjetivo.x - rotacionActual.x) * 0.08;
      rotacionActual.y += (rotacionObjetivo.y - rotacionActual.y) * 0.08;
      grupoTelefono.rotation.x = rotacionActual.x;
      grupoTelefono.rotation.y = rotacionActual.y;
      grupoTelefono.rotation.z = ROTACION_BASE.z;
    }

    renderizador.render(escena, camara);
    idAnimacion = requestAnimationFrame(animar);
  }

  function reanudarAnimacionSiVisible() {
    if (estaVisibleEnPantalla && !document.hidden && !idAnimacion) {
      idAnimacion = requestAnimationFrame(animar);
    }
  }

  // 9. IntersectionObserver: Pausa el loop WebGL cuando el hero queda fuera de vista
  if ("IntersectionObserver" in window) {
    const observador = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          estaVisibleEnPantalla = entrada.isIntersecting;
          if (estaVisibleEnPantalla) {
            reanudarAnimacionSiVisible();
          }
        });
      },
      { threshold: 0.05 }
    );
    observador.observe(figuraPadre);
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      if (idAnimacion) {
        cancelAnimationFrame(idAnimacion);
        idAnimacion = null;
      }
    } else {
      reanudarAnimacionSiVisible();
    }
  });

  // Primer renderizado y transición suave del fallback
  renderizador.render(escena, camara);
  figuraPadre.classList.add("hero__mockup-figure--3d-active");
  idAnimacion = requestAnimationFrame(animar);
}
