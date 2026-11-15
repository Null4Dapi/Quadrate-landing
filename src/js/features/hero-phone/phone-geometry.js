/**
 * Quadrate pe — Construcción Geométrica 3D del iPhone 15 Pro Max
 * Geometrías procedurales exactas a escala milimétrica con curvas continuas de Apple.
 */

/**
 * Genera un THREE.Shape de rectángulo con esquinas redondeadas.
 * @param {object} THREE
 * @param {number} ancho
 * @param {number} alto
 * @param {number} radio
 * @returns {object} THREE.Shape
 */
export function crearFormaRectanguloRedondeado(THREE, ancho, alto, radio) {
  const forma = new THREE.Shape();
  const x = -ancho / 2;
  const y = -alto / 2;

  forma.moveTo(x, y + radio);
  forma.lineTo(x, y + alto - radio);
  forma.quadraticCurveTo(x, y + alto, x + radio, y + alto);
  forma.lineTo(x + ancho - radio, y + alto);
  forma.quadraticCurveTo(x + ancho, y + alto, x + ancho, y + alto - radio);
  forma.lineTo(x + ancho, y + radio);
  forma.quadraticCurveTo(x + ancho, y, x + ancho - radio, y);
  forma.lineTo(x + radio, y);
  forma.quadraticCurveTo(x, y, x, y + radio);

  return forma;
}

/**
 * Construye el conjunto de lentes y sensores del módulo de cámara trasero Pro.
 * @param {object} THREE
 * @param {object} mats Materiales
 * @param {number} ancho
 * @param {number} alto
 * @param {number} profundidad
 * @returns {object} THREE.Group
 */
function construirModuloCamaras(THREE, mats, ancho, alto, profundidad) {
  const grupoCamaras = new THREE.Group();
  const anchoMeseta = 1.48;
  const altoMeseta = 1.54;
  const formaMeseta = crearFormaRectanguloRedondeado(THREE, anchoMeseta, altoMeseta, 0.34);
  const geoMeseta = new THREE.ExtrudeGeometry(formaMeseta, {
    depth: 0.08,
    bevelEnabled: true,
    bevelSegments: 4,
    steps: 1,
    bevelSize: 0.03,
    bevelThickness: 0.03,
  });
  geoMeseta.center();

  const mallaMeseta = new THREE.Mesh(geoMeseta, mats.moduloCamara);
  grupoCamaras.position.set(
    ancho / 2 - anchoMeseta / 2 - 0.16,
    alto / 2 - altoMeseta / 2 - 0.16,
    -(profundidad / 2 + 0.07)
  );
  grupoCamaras.add(mallaMeseta);

  const coordenadasLentes = [
    { x: 0.34, y: 0.38 },
    { x: 0.34, y: -0.38 },
    { x: -0.34, y: 0.0 },
  ];

  coordenadasLentes.forEach((pos) => {
    const lente = new THREE.Group();
    lente.position.set(pos.x, pos.y, -0.06);

    const geoAnillo = new THREE.CylinderGeometry(0.32, 0.34, 0.11, 32);
    geoAnillo.rotateX(Math.PI / 2);
    lente.add(new THREE.Mesh(geoAnillo, mats.chasisTitanio));

    const geoBarril = new THREE.CylinderGeometry(0.27, 0.27, 0.115, 32);
    geoBarril.rotateX(Math.PI / 2);
    const barril = new THREE.Mesh(geoBarril, mats.cilindroInterno);
    barril.position.z = -0.002;
    lente.add(barril);

    const geoCristal = new THREE.CircleGeometry(0.26, 32);
    const cristal = new THREE.Mesh(geoCristal, mats.lenteOscuro);
    cristal.position.z = -0.06;
    cristal.rotation.y = Math.PI;
    lente.add(cristal);

    const geoOptica = new THREE.CircleGeometry(0.11, 24);
    const optica = new THREE.Mesh(geoOptica, mats.capaOptica);
    optica.position.z = -0.062;
    optica.rotation.y = Math.PI;
    lente.add(optica);

    const geoBorde = new THREE.RingGeometry(0.11, 0.135, 24);
    const borde = new THREE.Mesh(geoBorde, mats.anilloInterno);
    borde.position.z = -0.061;
    lente.add(borde);

    grupoCamaras.add(lente);
  });

  const geoFlash = new THREE.CylinderGeometry(0.13, 0.13, 0.05, 24);
  geoFlash.rotateX(Math.PI / 2);
  const flash = new THREE.Mesh(geoFlash, mats.flash);
  flash.position.set(-0.34, 0.43, -0.04);
  grupoCamaras.add(flash);

  const geoLidar = new THREE.CylinderGeometry(0.13, 0.13, 0.05, 24);
  geoLidar.rotateX(Math.PI / 2);
  const lidar = new THREE.Mesh(geoLidar, mats.lidar);
  lidar.position.set(-0.34, -0.43, -0.04);
  grupoCamaras.add(lidar);

  const geoMic = new THREE.CircleGeometry(0.032, 12);
  const mic = new THREE.Mesh(geoMic, new THREE.MeshBasicMaterial({ color: 0x09090b }));
  mic.position.set(-0.56, -0.22, -0.06);
  mic.rotation.y = Math.PI;
  grupoCamaras.add(mic);

  return grupoCamaras;
}

/**
 * Agrega los botones laterales de titanio y antenas mmWave al grupo.
 * @param {object} THREE
 * @param {object} grupo
 * @param {object} mats
 * @param {number} ancho
 * @param {number} alto
 * @param {number} profundidad
 */
function agregarBotonesYAntenas(THREE, grupo, mats, ancho, alto, profundidad) {
  const crearBotonLateral = (altoBtn, posY, esLadoIzquierdo) => {
    const formaBtn = crearFormaRectanguloRedondeado(THREE, 0.055, altoBtn, 0.025);
    const geoBtn = new THREE.ExtrudeGeometry(formaBtn, {
      depth: 0.04,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.01,
      bevelThickness: 0.01,
    });
    geoBtn.center();
    const mallaBtn = new THREE.Mesh(geoBtn, mats.chasisTitanio);
    mallaBtn.rotation.y = Math.PI / 2;
    const xPos = esLadoIzquierdo ? -(ancho / 2 + 0.045) : ancho / 2 + 0.045;
    mallaBtn.position.set(xPos, posY, 0);
    return mallaBtn;
  };

  // Botón lateral de encendido (derecha)
  grupo.add(crearBotonLateral(0.72, 1.05, false));

  // Ventana de antena 5G mmWave
  const formaAntena = crearFormaRectanguloRedondeado(THREE, 0.065, 0.68, 0.032);
  const geoAntena = new THREE.ShapeGeometry(formaAntena, 12);
  const mallaAntena = new THREE.Mesh(geoAntena, mats.antena);
  mallaAntena.rotation.y = Math.PI / 2;
  mallaAntena.position.set(ancho / 2 + 0.047, -0.65, 0);
  grupo.add(mallaAntena);

  // Lado izquierdo: Botón de Acción y Controles de Volumen
  grupo.add(crearBotonLateral(0.28, 1.82, true));
  grupo.add(crearBotonLateral(0.48, 1.25, true));
  grupo.add(crearBotonLateral(0.48, 0.62, true));

  // Bandas aislantes de antena
  const posYBandas = [alto / 2 - 0.62, -(alto / 2 - 0.62)];
  posYBandas.forEach((y) => {
    const bandaIzq = new THREE.Mesh(
      new THREE.BoxGeometry(0.02, 0.045, profundidad + 0.092),
      mats.bandaAislante
    );
    bandaIzq.position.set(-(ancho / 2 + 0.038), y, 0);
    grupo.add(bandaIzq);

    const bandaDer = bandaIzq.clone();
    bandaDer.position.set(ancho / 2 + 0.038, y, 0);
    grupo.add(bandaDer);
  });
}

/**
 * Construye el modelo completo en 3D del iPhone 15 Pro Max.
 * @param {object} THREE
 * @param {object} mats Materiales instanciados
 * @returns {object} THREE.Group
 */
export function construirModeloTelefono(THREE, mats) {
  const grupoTelefono = new THREE.Group();

  const ancho = 3.06;
  const alto = 6.38;
  const profundidad = 0.27;
  const radioEsquina = 0.52;

  // 1. Chasis de titanio con bordes redondeados y bisel
  const formaChasis = crearFormaRectanguloRedondeado(THREE, ancho, alto, radioEsquina);
  const geoChasis = new THREE.ExtrudeGeometry(formaChasis, {
    depth: profundidad,
    bevelEnabled: true,
    bevelSegments: 6,
    steps: 1,
    bevelSize: 0.045,
    bevelThickness: 0.045,
    curveSegments: 28,
  });
  geoChasis.center();
  grupoTelefono.add(new THREE.Mesh(geoChasis, mats.chasisTitanio));

  // 2. Panel posterior de vidrio mate con mapeo UV para isotipo
  const formaTrasera = crearFormaRectanguloRedondeado(THREE, ancho - 0.04, alto - 0.04, radioEsquina - 0.02);
  const geoTrasera = new THREE.ShapeGeometry(formaTrasera, 28);
  const posTrasera = geoTrasera.attributes.position;
  const uvsTrasera = geoTrasera.attributes.uv;
  const anchoT = ancho - 0.04;
  const altoT = alto - 0.04;
  for (let i = 0; i < posTrasera.count; i++) {
    const u = 1.0 - (posTrasera.getX(i) + anchoT / 2) / anchoT;
    const v = (posTrasera.getY(i) + altoT / 2) / altoT;
    uvsTrasera.setXY(i, u, v);
  }
  const mallaTrasera = new THREE.Mesh(geoTrasera, mats.vidrioTrasero);
  mallaTrasera.position.z = -(profundidad / 2 + 0.047);
  mallaTrasera.rotation.y = Math.PI;
  grupoTelefono.add(mallaTrasera);

  // 3. Bisel ultrafino frontal
  const formaBisel = crearFormaRectanguloRedondeado(THREE, ancho - 0.03, alto - 0.03, radioEsquina - 0.015);
  const geoBisel = new THREE.ShapeGeometry(formaBisel, 28);
  const mallaBisel = new THREE.Mesh(geoBisel, mats.bisel);
  mallaBisel.position.z = profundidad / 2 + 0.046;
  grupoTelefono.add(mallaBisel);

  // 4. Pantalla OLED con mapeo UV
  const anchoPantalla = ancho - 0.14;
  const altoPantalla = alto - 0.14;
  const formaPantalla = crearFormaRectanguloRedondeado(
    THREE,
    anchoPantalla,
    altoPantalla,
    radioEsquina - 0.06
  );
  const geoPantalla = new THREE.ShapeGeometry(formaPantalla, 28);
  const posP = geoPantalla.attributes.position;
  const uvsP = geoPantalla.attributes.uv;
  for (let i = 0; i < posP.count; i++) {
    uvsP.setXY(
      i,
      (posP.getX(i) + anchoPantalla / 2) / anchoPantalla,
      (posP.getY(i) + altoPantalla / 2) / altoPantalla
    );
  }
  const mallaPantalla = new THREE.Mesh(geoPantalla, mats.pantalla);
  mallaPantalla.position.z = profundidad / 2 + 0.048;
  grupoTelefono.add(mallaPantalla);

  // 5. Dynamic Island y Lente frontal
  const formaIsla = crearFormaRectanguloRedondeado(THREE, 0.82, 0.23, 0.115);
  const mallaIsla = new THREE.Mesh(new THREE.ShapeGeometry(formaIsla, 16), mats.islaDinamica);
  mallaIsla.position.set(0, alto / 2 - 0.34, profundidad / 2 + 0.05);
  grupoTelefono.add(mallaIsla);

  const mallaSelfie = new THREE.Mesh(new THREE.CircleGeometry(0.055, 16), mats.lenteSelfie);
  mallaSelfie.position.set(0.24, alto / 2 - 0.34, profundidad / 2 + 0.052);
  grupoTelefono.add(mallaSelfie);

  // 6. Módulo Pro de Cámaras
  grupoTelefono.add(construirModuloCamaras(THREE, mats, ancho, alto, profundidad));

  // 7. Botones laterales y antenas
  agregarBotonesYAntenas(THREE, grupoTelefono, mats, ancho, alto, profundidad);

  return grupoTelefono;
}
