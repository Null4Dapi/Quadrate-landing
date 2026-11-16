/**
 * Quadrate pe — capa en vivo: asistente (chat con respuesta en streaming) por WebSocket, con respaldo HTTP.
 * La disponibilidad en vivo de /demo.html la entrega el shim de WebSocket (shim-ws.js) a la propia demo de la página.
 * Se inyecta al publicar; no modifica el código de la página. Sin dependencias; todo texto va con textContent.
 */
const CFG = window.QUADRATE_LIVE || {};
const PING_MS = 25000;
const OCULTA_MS = 60000;
const MAX_INTENTOS = 6;
const ESPERA_ABIERTA_MS = 8000;

const TEXTO_ERROR = {
  limite: "Demasiados mensajes seguidos. Intenta de nuevo en un minuto.",
  ocupado: "Espera a que termine la respuesta anterior.",
  mensaje_largo: "El mensaje es demasiado largo (máximo 400 caracteres).",
};

function h(etiqueta, atributos = {}, ...hijos) {
  const el = document.createElement(etiqueta);
  for (const [clave, valor] of Object.entries(atributos)) {
    if (valor === false || valor == null) continue;
    if (clave === "class") el.className = valor;
    else el.setAttribute(clave, valor === true ? "" : valor);
  }
  for (const hijo of hijos) el.append(hijo);
  return el;
}

/* ---------------------------------------------------------------------------------------------
 * Conexión: abre solo cuando alguien la necesita, reconecta con espera creciente y se cierra
 * con la pestaña oculta o sin uso (así Cloud Run puede escalar a cero).
 * ------------------------------------------------------------------------------------------- */
class Conexion extends EventTarget {
  constructor(url) {
    super();
    this.url = url;
    this.ws = null;
    this.estado = "cerrada"; // cerrada | conectando | abierta | reconectando | inactiva | sin_conexion
    this.usuarios = new Set();
    this.intentos = 0;
    this.pausada = false;
    this.temporizadores = { reconexion: null, ping: null, oculta: null };
    document.addEventListener("visibilitychange", () => this._visibilidad());
  }

  pedir(quien) {
    this.usuarios.add(quien);
    this.pausada = false;
    this._abrir();
  }

  soltar(quien) {
    this.usuarios.delete(quien);
    if (!this.usuarios.size) this._cerrar("cerrada");
  }

  reanudar() {
    this.intentos = 0;
    this.pausada = false;
    this._abrir();
  }

  enviar(objeto) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(objeto));
      return true;
    }
    return false;
  }

  _cambiar(estado) {
    if (this.estado === estado) return;
    this.estado = estado;
    this.dispatchEvent(new CustomEvent("estado", { detail: estado }));
  }

  _abrir() {
    if (!this.url || !this.usuarios.size || document.hidden || this.pausada) return;
    if (this.ws && this.ws.readyState <= WebSocket.OPEN) return;
    clearTimeout(this.temporizadores.reconexion);
    this._cambiar(this.intentos ? "reconectando" : "conectando");
    let ws;
    try {
      ws = new WebSocket(this.url);
    } catch {
      this._cambiar("sin_conexion");
      return;
    }
    this.ws = ws;
    ws.onopen = () => {
      clearInterval(this.temporizadores.ping);
      this.temporizadores.ping = setInterval(() => this.enviar({ type: "ping" }), PING_MS);
    };
    ws.onmessage = (evento) => {
      let mensaje;
      try {
        mensaje = JSON.parse(evento.data);
      } catch {
        return;
      }
      if (mensaje.type === "hola") {
        this.intentos = 0;
        this._cambiar("abierta");
      }
      this.dispatchEvent(new CustomEvent("mensaje", { detail: mensaje }));
    };
    ws.onclose = (evento) => {
      if (this.ws !== ws) return;
      this.ws = null;
      clearInterval(this.temporizadores.ping);
      if (!this.usuarios.size || this.pausada) return;
      if (evento.code === 4001) {          // inactividad: no reabrir hasta que la persona lo pida
        this.pausada = true;
        this._cambiar("inactiva");
        return;
      }
      if (document.hidden) {
        this._cambiar("cerrada");
        return;
      }
      if (this.intentos >= MAX_INTENTOS) {
        this._cambiar("sin_conexion");
        return;
      }
      const espera = evento.code === 4000 ? 200 : Math.min(30000, 1000 * 2 ** this.intentos) + Math.random() * 400;
      this.intentos += 1;
      this._cambiar("reconectando");
      this.temporizadores.reconexion = setTimeout(() => this._abrir(), espera);
    };
  }

  _cerrar(estado) {
    clearTimeout(this.temporizadores.reconexion);
    clearInterval(this.temporizadores.ping);
    const ws = this.ws;
    this.ws = null;
    if (ws) {
      ws.onclose = null;
      try {
        ws.close(1000);
      } catch { /* ya cerrada */ }
    }
    this._cambiar(estado);
  }

  _visibilidad() {
    if (document.hidden) {
      clearTimeout(this.temporizadores.oculta);
      this.temporizadores.oculta = setTimeout(() => {
        if (document.hidden && this.ws) this._cerrar("cerrada");
      }, OCULTA_MS);
    } else {
      clearTimeout(this.temporizadores.oculta);
      if (this.usuarios.size && !this.ws && !this.pausada) {
        this.intentos = 0;
        this._abrir();
      }
    }
  }
}

const conexion = new Conexion(CFG.wsChatUrl || CFG.wsUrl);

function etiquetaDeEstado(estado) {
  return {
    cerrada: "Sin conexión activa",
    conectando: "Conectando…",
    abierta: "En vivo",
    reconectando: "Reconectando…",
    inactiva: "Pausada por inactividad",
    sin_conexion: "Sin conexión",
  }[estado];
}

/* ---------------------------------------------------------------------------------------------
 * Asistente (chat por WebSocket con respaldo HTTP)
 * ------------------------------------------------------------------------------------------- */
function crearAsistente() {
  if (document.getElementById("qlive-panel")) return;
  const lanzador = h("button", {
    type: "button", class: "qlive-lanzador", "aria-expanded": "false", "aria-controls": "qlive-panel",
    "aria-label": "Abrir asistente de Quadrate pe",
  }, "Asistente");
  const registro = h("div", { class: "qlive-registro", role: "log", "aria-live": "polite", "aria-relevant": "additions text", tabindex: "0", "aria-label": "Conversación" });
  const sugerencias = h("div", { class: "qlive-sugerencias" });
  const entrada = h("input", { id: "qlive-entrada", class: "qlive-entrada", type: "text", maxlength: "400", autocomplete: "off", enterkeyhint: "send", placeholder: "Escribe tu consulta..." });
  const enviar = h("button", { type: "submit", class: "qlive-boton qlive-boton--enviar", "aria-label": "Enviar mensaje" }, "➤");
  const estado = h("p", { class: "qlive-panel__estado", role: "status" });
  const cerrar = h("button", { type: "button", class: "qlive-boton qlive-boton--sec qlive-boton--cerrar", "aria-label": "Cerrar asistente" }, "✕");
  const formulario = h("form", { class: "qlive-formulario", novalidate: true },
    h("label", { for: "qlive-entrada", class: "qlive-solo-lectores" }, "Escribe tu pregunta"), entrada, enviar);
  const panel = h("section", { id: "qlive-panel", class: "qlive-panel", role: "dialog", "aria-label": "Asistente de Quadrate pe", hidden: true },
    h("header", { class: "qlive-panel__cab" },
      h("div", {}, h("h2", { class: "qlive-panel__titulo" }, "Asistente de Quadrate pe"), estado), cerrar),
    registro, sugerencias, formulario,
    h("p", { class: "qlive-panel__nota" },
      "Responde con la información de esta página. La disponibilidad es de demostración. Tus mensajes no se guardan."));
  document.body.append(lanzador, panel);
  // En la demo las alertas de la página se apilan abajo a la derecha: el asistente se coloca a la izquierda para no taparlas.
  if (document.getElementById("quadrate-live-root")) {
    lanzador.classList.add("qlive--izq");
    panel.classList.add("qlive--izq");
    document.documentElement.classList.add("qlive-en-demo"); // el CSS reubica las alertas de la página en pantallas pequeñas
  }

  let contador = 0;
  let enCurso = null; // {id, burbuja}
  const burbujas = new Map();

  function agregar(rol, texto) {
    const burbuja = h("p", { class: `qlive-msg qlive-msg--${rol}` }, texto);
    registro.append(burbuja);
    registro.scrollTop = registro.scrollHeight;
    return burbuja;
  }

  function abrir() {
    panel.hidden = false;
    lanzador.setAttribute("aria-expanded", "true");
    lanzador.hidden = true;
    conexion.pedir("chat");
    entrada.focus();
  }

  function cerrarPanel() {
    panel.hidden = true;
    lanzador.hidden = false;
    lanzador.setAttribute("aria-expanded", "false");
    conexion.soltar("chat");
    lanzador.focus();
  }

  function esperarAbierta() {
    if (conexion.estado === "abierta") return Promise.resolve(true);
    return new Promise((resolver) => {
      const limite = setTimeout(() => fin(false), ESPERA_ABIERTA_MS);
      const alCambiar = (e) => {
        if (e.detail === "abierta") fin(true);
        else if (e.detail === "sin_conexion" || e.detail === "inactiva") fin(false);
      };
      function fin(valor) {
        clearTimeout(limite);
        conexion.removeEventListener("estado", alCambiar);
        resolver(valor);
      }
      conexion.addEventListener("estado", alCambiar);
    });
  }

  async function respaldoHttp(texto, burbuja) {
    try {
      const respuesta = await fetch(`${CFG.httpUrl}/v1/chat`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ texto }),
      });
      if (!respuesta.ok) throw new Error(String(respuesta.status));
      burbuja.textContent = (await respuesta.json()).respuesta;
    } catch {
      burbuja.textContent = "No pude responder ahora. Escribe a contacto@quadrate.pe.";
    }
  }

  async function preguntar(texto) {
    texto = texto.trim();
    if (!texto || enCurso) return;
    sugerencias.hidden = true;
    agregar("usuario", texto);
    const id = `m${Date.now().toString(36)}${++contador}`;
    const burbuja = agregar("bot", "…");
    enCurso = { id, burbuja };
    registro.setAttribute("aria-busy", "true");
    enviar.disabled = true;
    try {
      if (conexion.estado === "inactiva" || conexion.estado === "sin_conexion" || conexion.estado === "cerrada") conexion.reanudar();
      const abierta = await esperarAbierta();
      if (abierta && conexion.enviar({ type: "chat", id, texto })) {
        burbujas.set(id, burbuja);
        return; // la respuesta llega por el WebSocket
      }
      await respaldoHttp(texto, burbuja);
    } finally {
      if (!burbujas.has(id)) terminar();
    }
  }

  function terminar() {
    enCurso = null;
    registro.setAttribute("aria-busy", "false");
    enviar.disabled = false;
    registro.scrollTop = registro.scrollHeight;
  }

  conexion.addEventListener("mensaje", (e) => {
    const m = e.detail;
    if (m.type === "hola") {
      if (!sugerencias.childElementCount) {
        for (const s of m.sugerencias || []) {
          sugerencias.append(h("button", { type: "button", class: "qlive-chip" }, s));
        }
      }
      return;
    }
    const burbuja = burbujas.get(m.id);
    if (!burbuja) return;
    if (m.type === "chat_inicio") {
      burbuja.textContent = "";
    } else if (m.type === "chat_delta") {
      burbuja.append(document.createTextNode(m.texto));
      registro.scrollTop = registro.scrollHeight;
    } else if (m.type === "chat_fin" || m.type === "error") {
      if (m.type === "error") burbuja.textContent = TEXTO_ERROR[m.codigo] || m.mensaje || "No pude responder.";
      burbujas.delete(m.id);
      terminar();
    }
  });

  conexion.addEventListener("estado", (e) => {
    estado.textContent = panel.hidden ? "" : etiquetaDeEstado(e.detail);
  });

  lanzador.addEventListener("click", abrir);
  cerrar.addEventListener("click", cerrarPanel);
  panel.addEventListener("keydown", (e) => {
    if (e.key === "Escape") cerrarPanel();
  });
  formulario.addEventListener("submit", (e) => {
    e.preventDefault();
    const texto = entrada.value;
    entrada.value = "";
    preguntar(texto);
  });
  sugerencias.addEventListener("click", (e) => {
    const chip = e.target.closest(".qlive-chip");
    if (chip) preguntar(chip.textContent);
  });

  agregar("bot", "¡Hola! Soy el asistente de Quadrate pe. Puedo contarte cómo funciona la app, las tarifas y la disponibilidad de cocheras (de demostración).");
  for (const s of ["¿Hay lugar en Miraflores?", "¿Cuánto cuesta la app?", "¿Cómo funciona la reserva?", "¿Cómo afilio mi cochera?"]) {
    sugerencias.append(h("button", { type: "button", class: "qlive-chip" }, s));
  }
}

function iniciar() {
  if (!(CFG.wsChatUrl || CFG.wsUrl)) return; // sin destino configurado la capa no se activa
  crearAsistente();
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar);
else iniciar();
