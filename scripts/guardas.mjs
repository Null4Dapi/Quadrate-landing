/**
 * Guardas de seguridad para el contenido que viene del repo público antes de publicarlo.
 * Falla cerrado: cualquier hallazgo detiene la publicación y deja el sitio como estaba.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, relative } from "node:path";

const OMITIR = new Set([".git", "node_modules"]);
const TEXTO = new Set([".html", ".htm", ".js", ".mjs", ".cjs", ".jsx", ".css", ".json", ".svg", ".xml", ".txt", ".webmanifest"]);
const PROHIBIDAS = new Set([".exe", ".dll", ".bat", ".cmd", ".ps1", ".sh", ".php", ".jar", ".msi", ".scr", ".com", ".apk"]);
const MAX_ARCHIVO = 8 * 1024 * 1024;
const MAX_TOTAL = 40 * 1024 * 1024;
const CRECIMIENTO_MAX = 2; // el sitio no puede más que duplicar su tamaño de una publicación a otra

const SECRETOS = [
  [/sk-ant-[A-Za-z0-9_-]{8,}/, "clave de Anthropic"],
  [/AIza[0-9A-Za-z_-]{30,}/, "clave de API de Google"],
  [/AKIA[0-9A-Z]{16}/, "clave de acceso de AWS"],
  [/gh[pousr]_[A-Za-z0-9]{30,}/, "token de GitHub"],
  [/-----BEGIN (?:RSA |OPENSSH |EC |DSA )?PRIVATE KEY-----/, "clave privada"],
  [/(?:password|passwd|secret|api[_-]?key|token)\s*[:=]\s*["'][A-Za-z0-9/+_-]{16,}["']/i, "credencial en el código"],
];

const HOST = "[^\\s\"'`)/?#>]*";            // la coincidencia incluye el host para poder compararlo con los autorizados
const COMILLA = "[\"'`]";
const ES_EXTERNA = `(?:https?:)?//${HOST}`;
const HTML_RECURSO = new RegExp(String.raw`<(script|img|iframe|source|video|audio|embed|object|track|input)\b[^>]*?\b(?:src|data)\s*=\s*["']\s*${ES_EXTERNA}`, "gi");
const HTML_LINK = new RegExp(String.raw`<link\b[^>]*?\bhref\s*=\s*["']\s*${ES_EXTERNA}[^>]*>`, "gi");
const LINK_INOFENSIVO = /\brel\s*=\s*["'](?:canonical|alternate|author|license|me|help|prev|next)["']/i;
const CSS_EXTERNO = new RegExp(String.raw`(?:url\(\s*["']?|@import\s+(?:url\(\s*)?["']?)\s*${ES_EXTERNA}`, "gi");
const JS_RED = new RegExp(String.raw`\b(?:fetch|import|WebSocket|EventSource|importScripts|Worker|SharedWorker)\s*\(\s*` + COMILLA + String.raw`\s*(?:https?|wss?)://` + HOST, "g");
const JS_BEACON = new RegExp(String.raw`\b(?:sendBeacon|\.open)\s*\(\s*(?:` + COMILLA + String.raw`[A-Z]+` + COMILLA + String.raw`\s*,\s*)?` + COMILLA + String.raw`\s*https?://` + HOST, "g");
const JS_SRC = new RegExp(String.raw`\.(?:src|href)\s*=\s*` + COMILLA + String.raw`\s*(?:https?:)?//` + HOST, "g");

function recorrer(raiz) {
  const salida = [];
  const pendientes = [raiz];
  while (pendientes.length) {
    const dir = pendientes.pop();
    for (const entrada of readdirSync(dir, { withFileTypes: true })) {
      if (OMITIR.has(entrada.name)) continue;
      const ruta = join(dir, entrada.name);
      if (entrada.isDirectory()) pendientes.push(ruta);
      else if (entrada.isFile()) salida.push(ruta);
      else salida.push(ruta); // enlaces simbólicos u otros: se reportan abajo
    }
  }
  return salida;
}

function hostDe(coincidencia) {
  const m = coincidencia.match(/(?:https?:|wss?:)?\/\/([^/"'`\s)?#]+)/i);
  return m ? m[1].toLowerCase() : "";
}

function permitido(coincidencia, hosts) {
  const host = hostDe(coincidencia);
  return Boolean(host) && hosts.some((h) => host === h || host.endsWith(`.${h}`));
}

/**
 * @param {string} raiz carpeta con el contenido del repo público
 * @param {{bytesPrevios?: number, hostsPermitidos?: string[], excluir?: (rutaRelativa: string) => boolean}} opciones
 */
export function analizar(raiz, { bytesPrevios = 0, hostsPermitidos = [], excluir = () => false } = {}) {
  const hallazgos = [];
  const agregar = (tipo, archivo, detalle) => hallazgos.push({ tipo, archivo, detalle });
  let bytes = 0;
  let archivos = 0;

  const lista = recorrer(raiz);
  if (!lista.some((r) => relative(raiz, r).replace(/\\/g, "/") === "index.html")) {
    agregar("estructura", "index.html", "No existe index.html en la raíz del repo.");
  }

  for (const ruta of lista) {
    const rel = relative(raiz, ruta).replace(/\\/g, "/");
    if (excluir(rel)) continue;
    const info = statSync(ruta, { throwIfNoEntry: false });
    if (!info || !info.isFile()) {
      agregar("archivo", rel, "No es un archivo normal (enlace simbólico u otro).");
      continue;
    }
    archivos += 1;
    bytes += info.size;
    const extension = extname(rel).toLowerCase();
    if (PROHIBIDAS.has(extension)) agregar("archivo", rel, `Extensión no permitida (${extension}).`);
    if (info.size > MAX_ARCHIVO) agregar("tamaño", rel, `Archivo de ${(info.size / 1048576).toFixed(1)} MB (máximo 8 MB).`);
    if (!TEXTO.has(extension)) continue;

    const texto = readFileSync(ruta, "utf8");
    for (const [patron, nombre] of SECRETOS) {
      if (patron.test(texto)) agregar("secreto", rel, `Posible ${nombre}.`);
    }
    const externo = (tipo, regex) => {
      for (const m of texto.matchAll(regex)) {
        if (!permitido(m[0], hostsPermitidos)) agregar("externo", rel, `${tipo}: ${m[0].slice(0, 90).replace(/\s+/g, " ")}`);
      }
    };
    if (extension === ".html" || extension === ".htm") {
      externo("recurso externo", HTML_RECURSO);
      for (const m of texto.matchAll(HTML_LINK)) {
        if (!LINK_INOFENSIVO.test(m[0]) && !permitido(m[0], hostsPermitidos)) agregar("externo", rel, `enlace de recurso externo: ${m[0].slice(0, 90)}`);
      }
    } else if (extension === ".css") {
      externo("CSS externo", CSS_EXTERNO);
    } else if ([".js", ".mjs", ".cjs", ".jsx"].includes(extension)) {
      externo("conexión externa", JS_RED);
      externo("carga externa", JS_SRC);
      externo("petición externa", JS_BEACON);
    } else if (extension === ".svg") {
      externo("SVG externo", CSS_EXTERNO);
      externo("SVG externo", HTML_RECURSO);
    }
  }

  if (bytes > MAX_TOTAL) agregar("tamaño", "(total)", `El sitio pesa ${(bytes / 1048576).toFixed(1)} MB (máximo 40 MB).`);
  if (bytesPrevios > 0 && bytes > bytesPrevios * CRECIMIENTO_MAX) {
    agregar("tamaño", "(total)", `El sitio creció de ${bytesPrevios} a ${bytes} bytes (más de ×${CRECIMIENTO_MAX}).`);
  }
  return { ok: hallazgos.length === 0, hallazgos, bytes, archivos };
}
