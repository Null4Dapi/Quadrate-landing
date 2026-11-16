/**
 * Quadrate pe — Feature Tour Interactivo de Caseta
 * Orquesta la alternancia automatizada de características operativas
 * y sincronización de mockups SVG de caseta con intervalo optimizado (5.5s).
 */

import * as THREE from "../../assets/vendor/three.module.js";
import {
  crearMapaEntornoEstudio,
  crearMaterialesTelefono,
} from "./hero-phone/phone-materials.js";
import { construirModeloTelefono } from "./hero-phone/phone-geometry.js";

const IMAGENES_MOCKUP = [
  "src/assets/caseta-mockup-checkin.svg",
  "src/assets/caseta-mockup-aforo.svg",
  "src/assets/caseta-mockup-valle.svg",
];

const PANTALLAS_CASETA_3D = [
  "src/assets/app-screen-checkin.jpg",
  "src/assets/app-screen-aforo.jpg",
  "src/assets/app-screen-cupones.jpg",
];

const INTERVALO_CAMBIO_MS = 5500;

function montarTelefonoEstaticoCaseta(contenedor, figura) {
  try {
    const ancho = contenedor.clientWidth || 375;
    const alto = contenedor.clientHeight || 575;
    const escena = new THREE.Scene();
    const mapaEntorno = crearMapaEntornoEstudio(THREE);
    escena.environment = mapaEntorno;

    const camara = new THREE.PerspectiveCamera(36, ancho / alto, 0.1, 100);
    camara.position.set(0, 0, 10.6);

    const renderizador = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderizador.setSize(ancho, alto);
    renderizador.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderizador.toneMapping = THREE.ACESFilmicToneMapping;
    renderizador.toneMappingExposure = 1.15;
    contenedor.appendChild(renderizador.domElement);

    const luzAmbiente = new THREE.AmbientLight(0xffffff, 0.8);
    escena.add(luzAmbiente);
    const luzFrontal = new THREE.DirectionalLight(0xfffbf0, 1.6);
    luzFrontal.position.set(0, 4, 8);
    escena.add(luzFrontal);

    const canvasTextura = document.createElement("canvas");
    canvasTextura.width = 1024;
    canvasTextura.height = 2048;
    const ctx = canvasTextura.getContext("2d");
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.fillStyle = "#09090b";
    ctx.fillRect(0, 0, 1024, 2048);

    const texturaPantalla = new THREE.CanvasTexture(canvasTextura);
    texturaPantalla.minFilter = THREE.LinearMipmapLinearFilter;
    texturaPantalla.magFilter = THREE.LinearFilter;
    texturaPantalla.generateMipmaps = true;
    texturaPantalla.anisotropy = 8;
    if (THREE.sRGBEncoding) {
      texturaPantalla.encoding = THREE.sRGBEncoding;
    }

    const materiales = crearMaterialesTelefono(THREE, mapaEntorno, "natural", null);
    materiales.pantalla.map = texturaPantalla;

    const grupoTelefono = construirModeloTelefono(THREE, materiales);
    grupoTelefono.rotation.set(0, 0, 0); // Mirando recto al frente, completamente quieto
    escena.add(grupoTelefono);

    figura.classList.add("caseta__figure--3d-active");
    renderizador.render(escena, camara);

    return {
      cambiarPaso(indice) {
        const ruta = PANTALLAS_CASETA_3D[indice] || PANTALLAS_CASETA_3D[0];
        const img = new Image();
        img.crossOrigin = "anonymous";
        const pintar = () => {
          ctx.drawImage(img, 0, 0, 1024, 2048);
          texturaPantalla.needsUpdate = true;
          renderizador.render(escena, camara);
        };
        img.onload = pintar;
        img.src = ruta;
        if (img.complete) pintar();
      },
      redimensionar() {
        const w = contenedor.clientWidth;
        const h = contenedor.clientHeight;
        if (w === 0 || h === 0) return;
        camara.aspect = w / h;
        camara.updateProjectionMatrix();
        renderizador.setSize(w, h);
        renderizador.render(escena, camara);
      },
    };
  } catch (e) {
    return null;
  }
}

/**
 * Inicializa el tour interactivo y automático de la caseta.
 */
export function inicializarTourCaseta() {
  const seccionCaseta = document.getElementById("como-funciona");
  if (!seccionCaseta) return;

  const items = Array.from(seccionCaseta.querySelectorAll(".caseta__item"));
  const visorImagen = seccionCaseta.querySelector(".caseta__image");
  const contenedorCanvas = seccionCaseta.querySelector("#caseta-phone-canvas");
  const figuraCaseta = seccionCaseta.querySelector("#caseta-figure");

  if (items.length === 0) return;

  const controlador3D = contenedorCanvas && figuraCaseta
    ? montarTelefonoEstaticoCaseta(contenedorCanvas, figuraCaseta)
    : null;

  let indiceActivo = 0;
  let idIntervalo = null;
  let temporizadorTransicion = null;
  let pausadoPorUsuario = false;

  function actualizarVista(nuevoIndice) {
    if (nuevoIndice === indiceActivo && items[nuevoIndice].classList.contains("caseta__item--active")) {
      return;
    }

    indiceActivo = nuevoIndice;

    items.forEach((item, idx) => {
      const activo = idx === indiceActivo;
      item.classList.toggle("caseta__item--active", activo);
      item.setAttribute("aria-pressed", activo ? "true" : "false");
    });

    if (controlador3D) {
      controlador3D.cambiarPaso(indiceActivo);
    } else if (visorImagen) {
      visorImagen.classList.add("caseta__image--transitioning");
      if (temporizadorTransicion) clearTimeout(temporizadorTransicion);
      temporizadorTransicion = setTimeout(() => {
        visorImagen.src = IMAGENES_MOCKUP[indiceActivo] || IMAGENES_MOCKUP[0];
        visorImagen.classList.remove("caseta__image--transitioning");
      }, 180);
    }
  }

  function avanzarSiguiente() {
    if (pausadoPorUsuario) return;
    const siguiente = (indiceActivo + 1) % items.length;
    actualizarVista(siguiente);
  }

  function iniciarCicloAutomatico() {
    detenerCicloAutomatico();
    idIntervalo = setInterval(avanzarSiguiente, INTERVALO_CAMBIO_MS);
  }

  function detenerCicloAutomatico() {
    if (idIntervalo) {
      clearInterval(idIntervalo);
      idIntervalo = null;
    }
  }

  items.forEach((item, idx) => {
    item.addEventListener("click", () => {
      actualizarVista(idx);
      iniciarCicloAutomatico();
    });
    item.addEventListener("keydown", (evento) => {
      if (evento.key === "Enter" || evento.key === " ") {
        evento.preventDefault();
        actualizarVista(idx);
        iniciarCicloAutomatico();
      }
    });
    item.addEventListener("mouseenter", () => { pausadoPorUsuario = true; });
    item.addEventListener("mouseleave", () => { pausadoPorUsuario = false; });
    item.addEventListener("focusin", () => { pausadoPorUsuario = true; });
    item.addEventListener("focusout", () => { pausadoPorUsuario = false; });
  });

  if (controlador3D) {
    window.addEventListener("resize", () => controlador3D.redimensionar(), { passive: true });
  }

  actualizarVista(0);
  iniciarCicloAutomatico();
}
