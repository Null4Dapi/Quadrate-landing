/**
 * Quadrate pe — Contenido Desacoplado
 * Textos, enlaces y datos crudos para desacoplar presentación y facilitar migración a React/JSX.
 */

export const CONTENIDO_LANDING = Object.freeze({
  encabezado: Object.freeze({
    logoAlt: "Logotipo de Quadrate pe",
    enlacesNavegacion: Object.freeze([
      { id: "conductores", etiqueta: "Cómo funciona" },
      { id: "app", etiqueta: "App" },
      { id: "tarifas", etiqueta: "Tarifas" },
      { id: "playas", etiqueta: "Afiliar cochera" },
    ]),
    botonCtaNav: "Descargar App",
  }),

  hero: Object.freeze({
    tituloPrincipal: "BUSCA, QUADRA\nY LISTO.",
    tituloLinea1: "BUSCA, QUADRA",
    tituloLinea2: "Y LISTO.",
    descripcionCorta: "Quadrate pe conecta conductores con playas de estacionamiento independientes. Tarifas por hora y fracción transparentes, disponibilidad en vivo y reserva dinámica asegurada por tiempo estimado de llegada.",
    textoBotonPrincipal: "Comenzar",
    disponibilidadApp: "The mobile app is available now",
    badgesFlotantes: Object.freeze([
      { tipo: "eta", etiqueta: "RESERVA ACTIVA", valor: "ETA: 12 min restantes" },
      { tipo: "plaza", etiqueta: "PLAZA ASEGURADA", valor: "A-08 · Cochera Las Begonias" },
      { tipo: "tarifa", etiqueta: "FRACCIÓN JUSTA", valor: "S/ 1.50 / 15 min" },
    ]),
  }),

  metricasDisplay: Object.freeze([
    {
      cifra: "80%",
      etiqueta: "Reducción de búsqueda",
      detalle: "Menos circulación improductiva (cruising) saturando arterias viales.",
    },
    {
      cifra: "< 3s",
      etiqueta: "Validación en garita",
      detalle: "Lectura digital instantánea de pases QR sin frenar el flujo vehicular.",
    },
    {
      cifra: "100%",
      etiqueta: "Tarifas transparentes",
      detalle: "Desglose por hora y fracciones de 15 minutos reglamentarias.",
    },
  ]),

  appShowcase: Object.freeze({
    tituloLinea1: "DISPONIBILIDAD Y",
    tituloLinea2: "RESERVA EN VIVO",
    subtituloLinea1: "TRANSFORMAMOS LA BÚSQUEDA",
    subtituloLinea2: "EN CERTEZA VIAL",
    botonTexto: "Conocer la app",
    botonEnlace: "#conductores",
    imagenSrc: "src/assets/mockup-trio-iphones.webp",
    imagenAlt: "Mockup de la aplicación móvil Quadrate pe en tres terminales iPhone",
    imagenWidth: 790,
    imagenHeight: 778,
  }),

  porQueElegirnos: Object.freeze({
    tituloPrincipal: "POR QUÉ LOS CONDUCTORES NOS ELIGEN",
    subtituloDisplay: "LA SOLUCIÓN A LA INEFICIENCIA DEL PARQUEO",
    subtituloDetalle: "Tecnología ligera concebida para los distritos de alta congestión de Lima.",
    tarjetas: Object.freeze([
      {
        tipo: "lavanda",
        icono: "app",
        titulo: "INTERFAZ CLARA Y LIGERA",
        detalle: "Localizá y reservá tu plaza en menos de dos toques. Sin pasos confusos ni publicidad invasiva.",
      },
      {
        tipo: "blanco",
        icono: "gratis",
        titulo: "ACCESO 100% GRATUITO",
        detalle: "Uso sin costo para el conductor. Sin suscripciones forzadas ni cargos ocultos por servicio.",
      },
      {
        tipo: "salvia",
        icono: "justo",
        titulo: "FRACCIONAMIENTO JUSTO",
        detalle: "Cobro reglamentario por cuartos de hora posteriores a la primera hora. Pagás el tiempo real.",
      },
    ]),
  }),

  comunidadConductores: Object.freeze({
    columnaIzquierda: Object.freeze({
      tituloPrincipal: "SUMATE A LA COMUNIDAD",
      descripcion: "Descargá la app y transformá la manera en que te desplazás por Lima. Menos vueltas en calzada, cero estrés y parqueo asegurado.",
      botonTexto: "Descargar App",
      botonEnlace: "#conductores",
    }),
    mockupCentral: Object.freeze({
      src: "src/assets/mockup-community-phone.webp",
      alt: "Mockup de la aplicación móvil Quadrate pe mostrando búsqueda y reserva de cocheras en Lima",
      width: 520,
      height: 1048,
    }),
    columnaDerecha: Object.freeze({
      tituloDisplayLinea1: "LA MEJOR",
      tituloDisplayLinea2: "EXPERIENCIA",
      tituloDisplayLinea3: "EN PARQUEO",
      subtitulo: "Más de 1,000 conductores y playas ya integran la red. ¿Y vos?",
      contadorComunidad: "+1K",
      avatares: Object.freeze([
        "src/assets/avatar-1.webp",
        "src/assets/avatar-2.webp",
        "src/assets/avatar-3.webp",
        "src/assets/avatar-4.webp",
      ]),
    }),
    tarjetasPilares: Object.freeze([
      {
        titulo: "Catálogo georreferenciado",
        detalle: "Tarifas reales, horarios y accesos verificados en San Isidro, Miraflores, Surco y San Borja.",
        etiqueta: "Tarifas en vivo",
      },
      {
        titulo: "Reserva dinámica por ETA",
        detalle: "Tu espacio queda apartado durante los últimos 15 minutos de trayecto vehicular.",
        etiqueta: "Cero cruising",
      },
      {
        titulo: "Pase digital instantáneo",
        detalle: "Acceso y salida de garita en menos de 3 segundos mediante código QR y PIN alfanumérico.",
        etiqueta: "Lectura < 3s",
      },
      {
        titulo: "Aforo y cupo garantizado",
        detalle: "Sincronización en tiempo real con caseta para evitar saturación en el portón.",
        etiqueta: "Plaza segura",
      },
    ]),
  }),

  perfilConductor: Object.freeze({
    etiquetaRol: "EXPERIENCIA DEL CONDUCTOR",
    tituloRol: "Certidumbre y ahorro de tiempo antes de salir a la vía pública",
    descripcionRol: "Una aplicación móvil concebida para planificar la parada vehicular antes de encender el motor o durante la ruta en áreas de alta congestión.",
    beneficios: Object.freeze([
      {
        titulo: "Catálogo georreferenciado con tarifas reales",
        detalle: "Consultá el costo exacto de la primera hora, fracciones de 15 minutos y tarifas planas por jornada antes de comprometer tu ruta.",
      },
      {
        titulo: "Reserva dinámica activada por ETA",
        detalle: "Al activar 'Voy hacia allá', el sistema asegura tu espacio temporalmente durante los últimos 15 minutos de trayecto.",
      },
      {
        titulo: "Pase digital con QR y PIN alfanumérico",
        detalle: "Presentá tu pantalla en garita para un ingreso sin papeles ni demoras en menos de tres segundos.",
      },
    ]),
    imagenAlt: "Mockup de la interfaz móvil de Quadrate pe para conductores",
  }),

  perfilPlaya: Object.freeze({
    etiquetaRol: "PANEL DE CONTROL DE CASETA",
    tituloRol: "Digitalización operativa para playas sin hardware costoso",
    descripcionRol: "Operá tu estacionamiento desde cualquier smartphone o tableta existente. Cero barreras electromecánicas y cero sensores en el suelo.",
    beneficios: Object.freeze([
      {
        titulo: "Check-in y Check-out en menos de 3 segundos",
        detalle: "Escaneo veloz de pases QR o registro instantáneo por placa vehicular directamente con la cámara del dispositivo móvil.",
      },
      {
        titulo: "Control automático de aforo y plazas libres",
        detalle: "El sistema descuenta ingresos y libera plazas al egreso, evitando la saturación del local y discusiones con usuarios en el portón.",
      },
      {
        titulo: "Monetización dinámica de franjas valle",
        detalle: "Publicá tarifas promocionales en horarios de baja demanda para aumentar la rotación y rentabilidad de tu infraestructura.",
      },
      {
        titulo: "Administración formal de clientes abonados",
        detalle: "Registro de vehículos mensuales, control de pagos y alertas de vencimiento para formalizar tu recaudación sin planillas manuales.",
      },
    ]),
    imagenAlt: "Mockup del panel operativo móvil de Quadrate pe para operadores de caseta",
  }),

  manifiesto: Object.freeze({
    etiqueta: "TESIS DE IMPACTO URBANO",
    declaracion: "El déficit de infraestructura y la gestión precaria obligan al conductor a deambular 25 minutos buscando parqueo. Quadrate pe sustituye el talonario de papel por certidumbre digital en tiempo real.",
    metricaCifra: "100+",
    metricaRotulo: "Conductores y 10 Playas Aliadas en el Piloto",
    metricaDetalle: "Cohorte controlada en San Isidro y Miraflores para certificar la reducción de tiempos de ingreso y aumento de rotación.",
    botonAccion: "Postular mi cochera o vehículo",
  }),

  transparencia: Object.freeze({
    etiquetaSeccion: "POLÍTICA DE PRECIOS",
    tituloSeccion: "Transparencia tarifaria sin letras chicas ni sorpresas",
    descripcionSeccion: "La plataforma aplica estrictamente los principios de cobro justo y formalidad en cada establecimiento asociado.",
    pilares: Object.freeze([
      {
        categoria: "Primera Hora",
        regla: "Tarifa plana fija visible en el catálogo antes de ingresar.",
        impacto: "Elimina cobros arbitrarios según la cara del cliente.",
      },
      {
        categoria: "Fraccionamiento Reglamentario",
        regla: "Cálculo exacto por cuartos de hora (15 minutos) posteriores a la hora inicial.",
        impacto: "Pagás estrictamente el tiempo que tu vehículo estuvo aparcado.",
      },
      {
        categoria: "Abonados Mensuales",
        regla: "Contratos digitales claros con asignación de cupo garantizado.",
        impacto: "Seguridad para el cliente frecuente y flujo predecible para la playa.",
      },
    ]),
  }),

  formularioEspera: Object.freeze({
    etiquetaFormulario: "CONVOCATORIA PILOTO",
    tituloFormulario: "Sumate a la fase piloto en San Isidro y Miraflores",
    descripcionFormulario: "Estamos seleccionando a los primeros 100 conductores y a 10 playas de estacionamiento aliadas para validar la experiencia en campo.",
    campos: Object.freeze({
      nombreLabel: "Nombre y apellido",
      nombrePlaceholder: "Ej. Roberto Mendoza",
      correoLabel: "Correo electrónico corporativo o personal",
      correoPlaceholder: "roberto@ejemplo.pe",
      rolLabel: "Tipo de usuario",
      opcionesRol: Object.freeze([
        { valor: "conductor", texto: "Soy Conductor vehicular" },
        { valor: "playa", texto: "Administro una Playa de Estacionamiento" },
      ]),
      vehiculoOCocheraLabel: "Información adicional (Placa o Nombre del local)",
      vehiculoOCocheraPlaceholder: "Ej. Toyota Corolla / Playa San Isidro Centro",
      botonEnvio: "Registrarme en la lista de espera",
    }),
    mensajeExito: "¡Registro completado! Te contactaremos con las credenciales de la versión piloto.",
    mensajeError: "Ocurrió un error al procesar tu solicitud. Por favor verificá los datos e intentá nuevamente.",
  }),

  piePagina: Object.freeze({
    descripcionMarca: "Plataforma móvil bilateral para la gestión de estacionamientos y movilidad urbana en Lima Metropolitana.",
    derechosReservados: "© 2026 Quadrate pe. Todos los derechos reservados.",
    enlacesLegales: Object.freeze([
      { etiqueta: "Términos de Servicio", enlace: "#terminos" },
      { etiqueta: "Privacidad de Datos", enlace: "#privacidad" },
      { etiqueta: "Soporte Técnico", enlace: "mailto:contacto@quadrate.pe" },
    ]),
  }),
});
