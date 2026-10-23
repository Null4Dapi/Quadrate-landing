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
      { etiqueta: "Producto", enlace: "#app" },
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
      "Quadrate pe es la app web progresiva de las playas de estacionamiento de Lima: sabés dónde hay lugar y a qué precio antes de llegar, y la caseta registra y liquida cada movimiento sin papel.",
    textoBotonPrincipal: "Abrir la plataforma",
    textoEnlaceSecundario: "Conocé los cuatro módulos",
  }),

  appEnAccion: Object.freeze({
    tituloLinea1: "Dónde hay lugar",
    tituloLinea2: "y a qué precio",
    subtituloLinea1: "antes de arrancar",
    subtituloLinea2: "sin dar vueltas",
    botonTexto: "Abrir la plataforma",
    pantallaConductor: Object.freeze({
      marca: "Quadrate pe",
      encabezadoEstado: "Miraflores · en vivo",
      pinUno: "S/ 4.00 · libre",
      pinDos: "Cupo lleno",
      pinTres: "S/ 3.50 · libre",
      rutaActiva: "Voy hacia allá · ETA 12 min",
      aforoVisible: "Quedan 7 espacios libres en la zona",
      accionDestino: "Reservar en camino",
    }),
  }),

  modulos: Object.freeze({
    tituloSeccion: "Un sistema, cuatro módulos",
    descripcionSeccion:
      "Quadrate pe es una app web progresiva: funciona en el navegador del celular con la soltura de una app instalada. Las dos caras del negocio comparten la misma caseta digital.",
    filas: Object.freeze([
      {
        nombre: "Garita digital",
        beneficio: "Credencial digital con QR o PIN en el portón. Abonados y conductores frecuentes pasan directo, sin papel ni filas.",
      },
      {
        nombre: "Aforo en vivo",
        beneficio: "Cada entrada y salida actualiza el cupo real del estacionamiento: se ve al instante cuántos lugares quedan.",
      },
      {
        nombre: "Caja y liquidación",
        beneficio: "El registro automático reconcilia cada peso con el movimiento que le dio origen. El talonario de papel deja de resolver el cierre del día.",
      },
      {
        nombre: "Demanda",
        beneficio: "La playa publica cupo y tarifas claras: el conductor elige con certidumbre antes de arrancar y la cochera recibe trámite formal.",
      },
    ]),
  }),

  comoFunciona: Object.freeze({
    tituloSeccion: "Así funciona, paso a paso",
    descripcionSeccion: "Tres movimientos entre tu llegada y la liquidación del día. Ninguna planilla de por medio.",
    pasos: Object.freeze([
      {
        titulo: "Llegás al estacionamiento",
        detalle: "Conducís hasta el portón de la playa y el operador de la caseta te recibe con el sistema ya abierto y el cupo actualizado.",
      },
      {
        titulo: "Mostrás tu QR o tu PIN",
        detalle: "Presentás tu credencial digital en la garita. Abonados y conductores frecuentes entran directo, sin papel ni trámites.",
      },
      {
        titulo: "Todo queda registrado",
        detalle: "El operador valida el ingreso en el sistema: cada movimiento queda registrado con liquidación automática y el cierre del día se hace solo.",
      },
    ]),
  }),

  tarifas: Object.freeze({
    etiquetaSeccion: "Tarifas claras",
    tituloSeccion: "El precio que ves es el precio que pagás",
    descripcionSeccion:
      "Las tarifas claras benefician a las dos caras del sistema: el conductor conoce el precio antes de llegar y la cochera liquida cada estadía con ese mismo dato exacto.",
    filas: Object.freeze([
      {
        categoria: "Primera hora",
        regla: "Tarifa plana publicada en el catálogo: se ve antes de llegar y rige por igual para todos los conductores.",
        impacto: "Precio visible antes de llegar",
      },
      {
        categoria: "Fraccionamiento",
        regla: "Cobro reglamentario por cuartos de hora (15 min) posteriores a la primera hora; el sistema calcula solo.",
        impacto: "Pago exacto del tiempo real",
      },
      {
        categoria: "Abonados mensuales",
        regla: "Contratos digitales con cupo garantizado y avisos de vencimiento; ingresos previsibles para la cochera.",
        impacto: "Cierre sin planillas",
      },
    ]),
  }),

  manifiesto: Object.freeze({
    etiqueta: "Manifiesto",
    declaracion:
      "Gestionar una playa con talonario sale caro: la caseta anota a pulso, el conductor espera y el cierre del día se discute en el portón. Quadrate pe digitaliza ese trámite completo: cada ingreso, cada salida y cada peso queda ordenado en una sola caseta digital.",
    metricaCifra: "4",
    metricaRotulo: "Módulos de un mismo sistema",
    metricaDetalle:
      "Garita digital, aforo en vivo, caja con liquidación automática y demanda para conductores: todas las caras del negocio, una caseta digital.",
    botonAccion: "Abrir la plataforma",
  }),

  formularioEspera: Object.freeze({
    etiquetaFormulario: "Contacto",
    tituloFormulario: "Pedí tu acceso a la plataforma",
    descripcionFormulario:
      "Sea que manejas o que administras una playa, dejá tus datos y te escribimos para abrirla contigo. Todo se opera desde el navegador del celular.",
    campos: Object.freeze({
      nombreLabel: "Nombre y apellido",
      nombrePlaceholder: "Ej. Roberto Mendoza",
      correoLabel: "Correo electrónico",
      correoPlaceholder: "roberto@ejemplo.pe",
      rolLabel: "Tu rol en el sistema",
      opcionPlaceholder: "Elegí tu rol",
      opcionesRol: Object.freeze([
        { valor: "conductor", texto: "Soy conductor" },
        { valor: "playa", texto: "Administro una playa de estacionamiento" },
      ]),
      vehiculoOCocheraLabel: "Placa o nombre de la playa",
      vehiculoOCocheraPlaceholder: "Ej. Toyota Corolla / Playa San Isidro Centro",
      botonEnvio: "Solicitar acceso",
    }),
    mensajeExito: "¡Recibido! Te contactaremos para activar tu acceso a la plataforma.",
    mensajeError: "Ocurrió un error al procesar tu solicitud. Verificá los datos e intentá de nuevo.",
  }),

  piePagina: Object.freeze({
    descripcionMarca:
      "Quadrate pe es la app web progresiva de las playas de estacionamiento de Lima Metropolitana: garita digital, aforo en vivo, caja con liquidación automática y demanda visible.",
    derechosReservados: "© 2026 Quadrate pe. Todos los derechos reservados.",
    meta: "Quadrate pe",
    enlaces: Object.freeze([
      { etiqueta: "Producto", enlace: "#app" },
      { etiqueta: "Módulos", enlace: "#modulos" },
      { etiqueta: "Tarifas", enlace: "#tarifas" },
      { etiqueta: "Contacto", enlace: "#contacto" },
      { etiqueta: "Soporte", enlace: "mailto:contacto@quadrate.pe" },
    ]),
  }),
});
