/**
 * Quadrate pe — Materiales y Texturas Procedurales para iPhone 15 Pro Max
 * Cero dependencias externas o imágenes pesadas; texturas generadas en canvas 2D.
 */

export const PALETAS_TITANIO = {
  natural: {
    nombre: "Titanio Natural",
    chasis: 0xbdb6ac,
    vidrioTrasero: 0xc8c2b9,
    moduloCamara: 0xc2bcb3,
    logo: "#9e978e",
  },
  azul: {
    nombre: "Titanio Azul",
    chasis: 0x3b4454,
    vidrioTrasero: 0x434b59,
    moduloCamara: 0x3d4654,
    logo: "#2d3440",
  },
  blanco: {
    nombre: "Titanio Blanco",
    chasis: 0xdedcd6,
    vidrioTrasero: 0xf0efeb,
    moduloCamara: 0xe8e6e1,
    logo: "#c7c5be",
  },
  negro: {
    nombre: "Titanio Negro",
    chasis: 0x363738,
    vidrioTrasero: 0x3f4042,
    moduloCamara: 0x38393b,
    logo: "#252627",
  },
};

/**
 * Genera mapa de reflejo de estudio fotográfico en canvas 2D (sin archivos HDR).
 * @param {object} THREE
 * @returns {object} THREE.CanvasTexture
 */
export function crearMapaEntornoEstudio(THREE) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");

  const gradienteBase = ctx.createLinearGradient(0, 0, 0, 256);
  gradienteBase.addColorStop(0, "#18181b");
  gradienteBase.addColorStop(0.5, "#27272a");
  gradienteBase.addColorStop(1, "#09090b");
  ctx.fillStyle = gradienteBase;
  ctx.fillRect(0, 0, 512, 256);

  ctx.fillStyle = "#ffffff";
  ctx.filter = "blur(12px)";
  ctx.fillRect(50, 20, 90, 200);

  ctx.fillStyle = "#fff5ea";
  ctx.fillRect(280, 15, 120, 220);

  ctx.fillStyle = "#d4d4d8";
  ctx.fillRect(440, 40, 40, 180);

  const textura = new THREE.CanvasTexture(canvas);
  textura.mapping = THREE.EquirectangularReflectionMapping;
  return textura;
}

/**
 * Genera textura de titanio cepillado para los bordes metálicos.
 * @param {object} THREE
 * @returns {object} THREE.CanvasTexture
 */
export function crearTexturaMetalCepillado(THREE) {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#808080";
  ctx.fillRect(0, 0, 256, 256);

  for (let i = 0; i < 1600; i++) {
    const y = Math.random() * 256;
    const brillo = 115 + Math.floor(Math.random() * 30);
    ctx.fillStyle = `rgb(${brillo},${brillo},${brillo})`;
    ctx.fillRect(0, y, 256, 1);
  }

  const textura = new THREE.CanvasTexture(canvas);
  textura.wrapS = THREE.RepeatWrapping;
  textura.wrapT = THREE.RepeatWrapping;
  textura.repeat.set(2, 2);
  return textura;
}

/**
 * Genera textura del panel posterior de vidrio con el isotipo oficial de Apple.
 * @param {object} THREE
 * @param {number} colorHexFondo
 * @param {string} colorTextoLogo
 * @returns {object} THREE.CanvasTexture
 */
export function crearTexturaVidrioTrasero(THREE, colorHexFondo, colorTextoLogo) {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 2048;
  const ctx = canvas.getContext("2d");

  const color = new THREE.Color(colorHexFondo);
  ctx.fillStyle = `rgb(${Math.round(color.r * 255)}, ${Math.round(color.g * 255)}, ${Math.round(color.b * 255)})`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.translate(512, 1020);
  ctx.scale(2.15, 2.15);
  ctx.fillStyle = colorTextoLogo;

  ctx.beginPath();
  ctx.moveTo(0, -48);
  ctx.bezierCurveTo(-18, -48, -34, -62, -55, -62);
  ctx.bezierCurveTo(-88, -62, -115, -32, -115, 12);
  ctx.bezierCurveTo(-115, 65, -72, 130, -44, 130);
  ctx.bezierCurveTo(-28, 130, -18, 118, 0, 118);
  ctx.bezierCurveTo(18, 118, 28, 130, 44, 130);
  ctx.bezierCurveTo(74, 130, 115, 62, 115, 12);
  ctx.bezierCurveTo(115, -32, 88, -62, 55, -62);
  ctx.bezierCurveTo(34, -62, 18, -48, 0, -48);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = `rgb(${Math.round(color.r * 255)}, ${Math.round(color.g * 255)}, ${Math.round(color.b * 255)})`;
  ctx.beginPath();
  ctx.arc(118, 8, 49, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = colorTextoLogo;
  ctx.beginPath();
  ctx.moveTo(2, -56);
  ctx.quadraticCurveTo(2, -98, 42, -112);
  ctx.quadraticCurveTo(44, -68, 2, -56);
  ctx.closePath();
  ctx.fill();

  ctx.restore();

  const textura = new THREE.CanvasTexture(canvas);
  textura.anisotropy = 4;
  return textura;
}

/**
 * Genera textura de pantalla OLED con gradiente editorial iOS o captura de la app.
 * @param {object} THREE
 * @param {string} [rutaImagen]
 * @returns {object} THREE.CanvasTexture
 */
export function crearTexturaPantalla(THREE, rutaImagen = "src/assets/app-screen-hero.jpg") {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 2048;
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  ctx.fillStyle = "#070709";
  ctx.fillRect(0, 0, 1024, 2048);

  const gradiente = ctx.createRadialGradient(512, 640, 40, 512, 750, 700);
  gradiente.addColorStop(0, "#e7dfd3");
  gradiente.addColorStop(0.35, "#9c9284");
  gradiente.addColorStop(0.7, "#3f3b36");
  gradiente.addColorStop(1, "#070709");
  ctx.fillStyle = gradiente;
  ctx.fillRect(0, 0, 1024, 2048);

  ctx.fillStyle = "rgba(255, 255, 255, 0.92)";
  ctx.font = "600 40px system-ui, -apple-system, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Sábado, 7 de noviembre", 512, 320);
  ctx.font = "700 200px system-ui, -apple-system, sans-serif";
  ctx.fillText("09:41", 512, 520);

  const textura = new THREE.CanvasTexture(canvas);
  textura.minFilter = THREE.LinearMipmapLinearFilter;
  textura.magFilter = THREE.LinearFilter;
  textura.generateMipmaps = true;
  textura.anisotropy = 8;
  if (THREE.sRGBEncoding) {
    textura.encoding = THREE.sRGBEncoding;
  }

  if (rutaImagen) {
    const img = new Image();
    img.crossOrigin = "anonymous";
    const pintar = () => {
      ctx.drawImage(img, 0, 0, 1024, 2048);
      textura.needsUpdate = true;
    };
    img.onload = pintar;
    img.src = rutaImagen;
    if (img.complete) pintar();
  }

  return textura;
}

/**
 * Compone todos los materiales PBR físicos del iPhone 15 Pro Max.
 * @param {object} THREE
 * @param {object} mapaEntorno
 * @param {string} claveColor
 * @param {string} [rutaImagen]
 * @returns {object}
 */
export function crearMaterialesTelefono(THREE, mapaEntorno, claveColor = "natural", rutaImagen = "src/assets/app-screen-hero.jpg") {
  const paleta = PALETAS_TITANIO[claveColor] || PALETAS_TITANIO.natural;
  const texturaCepillada = crearTexturaMetalCepillado(THREE);
  const texturaTrasera = crearTexturaVidrioTrasero(THREE, paleta.vidrioTrasero, paleta.logo);
  const texturaPantalla = crearTexturaPantalla(THREE, rutaImagen);

  return {
    chasisTitanio: new THREE.MeshStandardMaterial({
      color: paleta.chasis,
      metalness: 0.88,
      roughness: 0.26,
      bumpMap: texturaCepillada,
      bumpScale: 0.003,
      envMap: mapaEntorno,
      envMapIntensity: 1.35,
    }),
    vidrioTrasero: new THREE.MeshPhysicalMaterial({
      map: texturaTrasera,
      roughness: 0.38,
      metalness: 0.12,
      clearcoat: 0.35,
      clearcoatRoughness: 0.4,
      envMap: mapaEntorno,
      envMapIntensity: 0.8,
    }),
    moduloCamara: new THREE.MeshPhysicalMaterial({
      color: paleta.moduloCamara,
      roughness: 0.25,
      metalness: 0.2,
      clearcoat: 0.85,
      clearcoatRoughness: 0.15,
      envMap: mapaEntorno,
    }),
    pantalla: new THREE.MeshBasicMaterial({
      map: texturaPantalla,
      toneMapped: false,
    }),
    bisel: new THREE.MeshBasicMaterial({ color: 0x050505 }),
    islaDinamica: new THREE.MeshBasicMaterial({ color: 0x020202 }),
    lenteSelfie: new THREE.MeshBasicMaterial({ color: 0x111827 }),
    lenteOscuro: new THREE.MeshPhysicalMaterial({
      color: 0x05070a,
      roughness: 0.05,
      metalness: 0.1,
      clearcoat: 1.0,
      envMapIntensity: 1.6,
    }),
    cilindroInterno: new THREE.MeshStandardMaterial({
      color: 0x111318,
      roughness: 0.6,
      metalness: 0.5,
    }),
    capaOptica: new THREE.MeshBasicMaterial({
      color: 0x1e3a8a,
      transparent: true,
      opacity: 0.45,
    }),
    anilloInterno: new THREE.MeshBasicMaterial({
      color: 0x3f3f46,
      side: THREE.DoubleSide,
    }),
    flash: new THREE.MeshStandardMaterial({
      color: 0xfef3c7,
      roughness: 0.2,
      metalness: 0.1,
      emissive: 0xfef3c7,
      emissiveIntensity: 0.15,
    }),
    lidar: new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.2,
      metalness: 0.6,
    }),
    antena: new THREE.MeshStandardMaterial({
      color: 0x8f8a81,
      roughness: 0.5,
      metalness: 0.3,
    }),
    bandaAislante: new THREE.MeshBasicMaterial({ color: 0x78746d }),
  };
}
