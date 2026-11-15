/**
 * Quadrate pe — Contenido Desacoplado (página única product-first)
 * Única fuente de textos y datos promocionales del landing. El esqueleto HTML
 * apunta a las claves con data-texto / data-placeholder y main.js asigna.
 * Contrato estable: features/waitlist.js consume `formularioEspera`.
 */

export const CONTENIDO_LANDING = Object.freeze({
  encabezado: Object.freeze({
    logoAlt: "Logotipo de Quadrate pe",
    enlacesNavegacion: Object.freeze([
      { etiqueta: "Producto", enlace: "#inicio" },
      { etiqueta: "Módulos", enlace: "#modulos" },
      { etiqueta: "Cómo funciona", enlace: "#como-funciona" },
      { etiqueta: "Tarifas", enlace: "#tarifas" },
      { etiqueta: "Contacto", enlace: "#contacto" },
    ]),
    botonCtaNav: "Abrir la plataforma",
  }),

  hero: Object.freeze({
    tituloLinea1: "Sin vueltas",
    tituloLinea2: "y pago exacto.",
    descripcionCorta:
      "Quadrate pe conecta conductores con playas de estacionamiento independientes. Tarifas transparentes, disponibilidad en vivo y reserva dinámica asegurada por tiempo estimado de llegada.",
    textoBotonPrincipal: "Probar demo",
  }),

  modulos: Object.freeze({
    tituloSeccion: "Un sistema, cuatro módulos",
    descripcionSeccion:
      "Quadrate pe es una app web progresiva: funciona en el navegador del celular con la soltura de una app instalada. Las dos caras del negocio comparten la misma caseta digital.",
    filas: Object.freeze([
      {
        nombre: "Garita digital",
        tag: "Acceso Rápido",
        beneficio: "Credencial digital con QR o PIN en el portón. Abonados y conductores frecuentes pasan directo, sin papel ni filas.",
        badge: "Check-in < 3 seg",
      },
      {
        nombre: "Aforo en vivo",
        tag: "Disponibilidad Real",
        beneficio: "Cada entrada y salida actualiza el cupo real del estacionamiento: se ve al instante cuántos lugares quedan.",
        badge: "18 plazas disponibles",
      },
      {
        nombre: "Caja y liquidación",
        tag: "Cierre Automático",
        beneficio: "El registro automático concilia cada sol con el movimiento que le dio origen. El talonario de papel deja de resolver el cierre del día.",
        badge: "Cuadre sin planillas",
      },
      {
        nombre: "Demanda en tiempo real",
        tag: "Conexión Directa",
        beneficio: "La playa publica cupo y tarifas claras: el conductor elige con certidumbre antes de arrancar y la cochera recibe trámite formal.",
        badge: "Reserva dinámica por ETA",
      },
    ]),
  }),

  comoFunciona: Object.freeze({
    etiquetaSeccion: "Panel de Control de Caseta · Garitas conectadas ✓",
    tituloSeccion: "Digitalización operativa para playas sin hardware costoso",
    descripcionSeccion:
      "Opera tu estacionamiento desde cualquier smartphone o tableta existente. Cero barreras electromecánicas y cero sensores en el suelo.",
    pasos: Object.freeze([
      {
        titulo: "Check-in y Check-out en menos de 3 segundos",
        detalle:
          "Escaneo veloz de pases QR o registro instantáneo por placa vehicular con la cámara del dispositivo.",
      },
      {
        titulo: "Control automático de aforo y plazas libres",
        detalle:
          "El sistema descuenta ingresos y libera plazas al egreso, evitando la saturación del local en portón.",
      },
      {
        titulo: "Monetización dinámica de franjas valle",
        detalle:
          "Tarifas promocionales en horarios de baja demanda para aumentar la rotación y rentabilidad.",
      },
    ]),
  }),

  tarifas: Object.freeze({
    etiquetaSeccion: "Tarifas claras",
    tituloSeccion: "El precio que ves es el precio que pagas",
    descripcionSeccion:
      "Las tarifas claras benefician a las dos caras del sistema: el conductor conoce el precio antes de llegar y la cochera liquida cada estadía con ese mismo dato exacto.",
    filas: Object.freeze([
      {
        tag: "Tarifa plana publicada",
        categoria: "Primera hora",
        regla: "Tarifa plana publicada en el catálogo: se ve antes de llegar y rige por igual para todos los conductores.",
        impacto: "Precio visible antes de llegar",
      },
      {
        tag: "Ley de estacionamientos",
        categoria: "Fraccionamiento",
        regla: "Cobro reglamentario por cuartos de hora (15 min) posteriores a la primera hora; el sistema calcula solo.",
        impacto: "Pago exacto del tiempo real",
      },
      {
        tag: "Ingresos previsibles",
        categoria: "Abonados mensuales",
        regla: "Contratos digitales con cupo garantizado y avisos de vencimiento; ingresos previsibles para la cochera.",
        impacto: "Cierre sin planillas",
      },
    ]),
  }),

  manifiesto: Object.freeze({
    etiqueta: "Experiencias reales",
    titulo: "Lo que dicen quienes operan y se estacionan con Quadrate pe",
    descripcion:
      "Historias directas de administradores de playas y conductores en Lima que transformaron su rutina diaria.",
    testimonios: Object.freeze([
      {
        nombre: "Carlos Valdivia",
        rol: "Administrador de Playa · San Isidro",
        calificacion: "5/5",
        cita: "El talonario de papel era una fuga constante de dinero y tiempo. Con Quadrate pe cerramos la caja en 3 minutos y sabemos exactamente cuántos vehículos entraron y salieron en cada turno sin discutir en la garita.",
        avatarInicial: "CV",
      },
      {
        nombre: "Mariana Benavides",
        rol: "Conductora frecuente · Miraflores",
        calificacion: "5/5",
        cita: "Buscar estacionamiento antes de una reunión me costaba 20 minutos de vueltas inútiles. Ahora salgo con el lugar asegurado por mi tiempo estimado de llegada y pago la tarifa exacta sin sorpresas.",
        avatarInicial: "MB",
      },
      {
        nombre: "Jorge Alarcón",
        rol: "Gerente de Operaciones · Red Cocheras Lima",
        calificacion: "5/5",
        cita: "Monetizar las horas valle fue un cambio total. En las tardes llenamos espacios que antes estaban vacíos gracias a la visibilidad en tiempo real para los conductores de la zona.",
        avatarInicial: "JA",
      },
      {
        nombre: "Valeria Ugarte",
        rol: "Abonada mensual · Surco Empresarial",
        calificacion: "5/5",
        cita: "Tener mi credencial digital con PIN y QR en el celular hace que pase directo al portón. Se acabaron los tickets de papel que se pierden o se despintan con el sol.",
        avatarInicial: "VU",
      },
    ]),
  }),

  formularioEspera: Object.freeze({
    etiquetaFormulario: "Contacto",
    tituloFormulario: "Pide tu acceso a la plataforma",
    descripcionFormulario:
      "Ya sea que manejes o administres una playa, deja tus datos y te escribimos para abrirla contigo. Todo se opera desde el navegador del celular.",
    campos: Object.freeze({
      nombreLabel: "Nombre y apellido",
      nombrePlaceholder: "Ej. Roberto Mendoza",
      correoLabel: "Correo electrónico",
      correoPlaceholder: "roberto@ejemplo.pe",
      rolLabel: "Tu rol en el sistema",
      opcionPlaceholder: "Elige tu rol",
      opcionesRol: Object.freeze([
        { valor: "conductor", texto: "Soy conductor" },
        { valor: "playa", texto: "Administro una playa de estacionamiento" },
      ]),
      vehiculoOCocheraLabel: "Placa o nombre de la playa",
      vehiculoOCocheraPlaceholder: "Ej. Toyota Corolla / Playa San Isidro Centro",
      botonEnvio: "Solicitar acceso",
    }),
    mensajeExito: "¡Recibido! Te contactaremos para activar tu acceso a la plataforma.",
    mensajeError: "Ocurrió un error al procesar tu solicitud. Verifica los datos e intenta de nuevo.",
  }),

  piePagina: Object.freeze({
    declaracionMarca:
      "La caseta digital de las playas de estacionamiento de Lima: control de aforo, garita sin papel y liquidación automática en un solo sistema.",
    botonAccion: "Abrir la plataforma",
    columnas: Object.freeze({
      producto: Object.freeze({
        titulo: "Producto",
        enlaces: Object.freeze([
          { etiqueta: "App Web Progresiva", enlace: "#inicio" },
          { etiqueta: "Garita digital", enlace: "#modulos" },
          { etiqueta: "Aforo en vivo", enlace: "#modulos" },
          { etiqueta: "Caja y liquidación", enlace: "#modulos" },
          { etiqueta: "Demanda en tiempo real", enlace: "#modulos" },
        ]),
      }),
      operacion: Object.freeze({
        titulo: "Operación",
        enlaces: Object.freeze([
          { etiqueta: "Cómo funciona", enlace: "#como-funciona" },
          { etiqueta: "Credencial QR y PIN", enlace: "#como-funciona" },
          { etiqueta: "Tarifas y fraccionamiento", enlace: "#tarifas" },
          { etiqueta: "Abonados mensuales", enlace: "#tarifas" },
          { etiqueta: "Cierre de turno digital", enlace: "#manifiesto" },
        ]),
      }),
      cobertura: Object.freeze({
        titulo: "Lima Metropolitana",
        enlaces: Object.freeze([
          { etiqueta: "Centro de Lima", enlace: "#contacto" },
          { etiqueta: "La Victoria · Gamarra", enlace: "#contacto" },
          { etiqueta: "Lima Norte · Puente Piedra", enlace: "#contacto" },
          { etiqueta: "Lima Sur · Villa El Salvador", enlace: "#contacto" },
          { etiqueta: "Red de playas afiliadas", enlace: "#contacto" },
        ]),
      }),
      contacto: Object.freeze({
        titulo: "Contacto y Legal",
        enlaces: Object.freeze([
          { etiqueta: "Afiliar cochera", enlace: "#contacto" },
          { etiqueta: "Soporte técnico", enlace: "mailto:contacto@quadrate.pe" },
          { etiqueta: "contacto@quadrate.pe", enlace: "mailto:contacto@quadrate.pe" },
          { etiqueta: "Términos del servicio", enlace: "#contacto" },
          { etiqueta: "Privacidad de datos", enlace: "#contacto" },
        ]),
      }),
    }),
    estadoDisponibilidad: "PWA activa en Lima Metropolitana",
    hechoEn: "Desarrollado para Lima · Perú",
    derechosReservados: "© 2026 Quadrate pe. Todos los derechos reservados.",
    meta: "Quadrate pe",
  }),
});
