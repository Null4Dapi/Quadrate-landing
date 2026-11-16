/**
 * Arma dist/ = repo público de Quadrate pe + capa en vivo (overlay/) + marcador upstream.json.
 *
 * Uso: node scripts/build.mjs [--upstream <carpeta|url>] [--out dist] [--sha <commit>] [--sin-guardas]
 * Códigos de salida: 0 correcto, 2 las guardas de seguridad bloquearon la publicación.
 */
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

import { analizar } from "./guardas.mjs";

export const VERSION_BUILD = 1;
const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const MARCA = "<!-- quadrate-live -->";

// Lo que no es parte del sitio publicado (mismo criterio que el firebase.json original de Quadrate).
const EXCLUIDOS = [
  /^\.(git|github|devcontainer|agents|firebase|gitignore|upstream-commit)(\/|$)/,
  /^(docs|odd|scripts|service|tests|config|overlay|dist|node_modules)(\/|$)/,
  /^(package\.json|package-lock\.json|skills-lock\.json|AGENTS\.md|CHANGELOG\.md|README\.md|firebase\.json|\.firebaserc)$/,
  /\.(md|jsx)$/,
  /(^|\/)babel\.min\.js$/,
  /(^|\/)\.[^/]+$/
];
export const esExcluido = (rel) => EXCLUIDOS.some((patron) => patron.test(rel));

export function leerDestino(ruta = join(RAIZ, "config", "destino.json")) {
  return JSON.parse(readFileSync(ruta, "utf8"));
}

function archivosDe(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? archivosDe(join(dir, e.name)) : [join(dir, e.name)]));
}

/** Huella de todo lo que añadimos nosotros: si cambia, hay que volver a publicar aunque el repo no cambie. */
export function huellaOverlay({ raiz = RAIZ, destino = leerDestino(join(raiz, "config", "destino.json")) } = {}) {
  const h = createHash("sha256");
  h.update(`v${VERSION_BUILD}|${destino.wsUrl}|${destino.httpUrl}|`);
  for (const archivo of archivosDe(join(raiz, "overlay")).sort()) {
    h.update(relative(raiz, archivo).replace(/\\/g, "/"));
    h.update(readFileSync(archivo));
  }
  return h.digest("hex").slice(0, 16);
}

/** Inserta la capa en vivo en el HTML de la página. Es idempotente. */
export function inyectar(html, version) {
  if (html.includes(MARCA)) return html;
  if (!/<\/head>/i.test(html) || !/<\/body>/i.test(html)) {
    throw new Error("index.html no tiene </head> o </body>: no se puede inyectar la capa en vivo.");
  }
  const estilo = `${MARCA}<link rel="stylesheet" href="/live/live.css?v=${version}">`;
  // config.js y shim-ws.js son scripts clásicos: corren al analizar la página, antes que los módulos de la demo.
  const scripts = `${MARCA}<script src="/live/config.js?v=${version}"></script><script src="/live/shim-ws.js?v=${version}"></script>`
    + `<script type="module" src="/live/live.js?v=${version}"></script>`;
  return html.replace(/<\/head>/i, `${estilo}</head>`).replace(/<\/body>/i, `${scripts}</body>`);
}

/** wss://host/ws -> wss://host/ws-chat (el asistente tiene su propio endpoint; /ws queda para la demo de la página). */
export function urlChat(wsUrl) {
  return wsUrl ? wsUrl.replace(/\/ws\/?$/, "/ws-chat") : "";
}

/** wss://host/ws -> wss://host/ws-telemetria (el protocolo que ya habla la demo de Quadrate). */
export function urlTelemetria(wsUrl) {
  return wsUrl ? wsUrl.replace(/\/ws\/?$/, "/ws-telemetria") : "";
}

export function clonarUpstream(url, destino) {
  execFileSync("git", ["clone", "--quiet", "--depth", "1", "--config", "remote.origin.pushurl=disabled://solo-lectura", url, destino], { stdio: "inherit" });
  return execFileSync("git", ["-C", destino, "rev-parse", "HEAD"], { encoding: "utf8" }).trim();
}

export function ensamblar({ upstream, salida, destino, sha, raiz = RAIZ, bytesPrevios = 0, conGuardas = true }) {
  if (conGuardas) {
    const informe = analizar(upstream, { bytesPrevios, hostsPermitidos: destino.hostsPermitidos || [], excluir: esExcluido });
    if (!informe.ok) return { ok: false, informe };
  }
  rmSync(salida, { recursive: true, force: true });
  mkdirSync(salida, { recursive: true });
  const salidaRes = resolve(salida);
  const upstreamRes = resolve(upstream);
  if (salidaRes === upstreamRes || salidaRes.startsWith(upstreamRes + sep)) {
    for (const entrada of readdirSync(upstream)) {
      const rutaOrigen = join(upstream, entrada);
      if (resolve(rutaOrigen) === salidaRes) continue;
      const rel = relative(upstream, rutaOrigen).replace(/\\/g, "/");
      if (esExcluido(rel)) continue;
      cpSync(rutaOrigen, join(salida, entrada), {
        recursive: true,
        filter: (origen) => !esExcluido(relative(upstream, origen).replace(/\\/g, "/")),
      });
    }
  } else {
    cpSync(upstream, salida, { recursive: true, filter: (origen) => !esExcluido(relative(upstream, origen).replace(/\\/g, "/")) });
  }

  const version = huellaOverlay({ raiz, destino });
  // La capa va en todas las páginas de la raíz (index.html y demo.html); index.html es obligatorio.
  for (const pagina of readdirSync(salida).filter((f) => f.endsWith(".html"))) {
    const ruta = join(salida, pagina);
    try {
      writeFileSync(ruta, inyectar(readFileSync(ruta, "utf8"), version));
    } catch (error) {
      if (pagina === "index.html") throw error;
      console.warn(`Aviso: ${pagina} no se modificó (${error.message})`);
    }
  }

  const carpetaLive = join(salida, "live");
  mkdirSync(carpetaLive, { recursive: true });
  for (const nombre of ["live.js", "live.css", "shim-ws.js"]) cpSync(join(raiz, "overlay", nombre), join(carpetaLive, nombre));
  writeFileSync(join(carpetaLive, "config.js"),
    `window.QUADRATE_LIVE=${JSON.stringify({ wsUrl: destino.wsUrl, wsChatUrl: urlChat(destino.wsUrl), wsTelemetriaUrl: urlTelemetria(destino.wsUrl), httpUrl: destino.httpUrl })};\n`);

  const bytes = archivosDe(salida).reduce((total, f) => total + statSync(f).size, 0);
  const marcador = { sha, overlay: version, repo: destino.upstream, bytes, publicado: new Date().toISOString() };
  writeFileSync(join(salida, "upstream.json"), `${JSON.stringify(marcador, null, 2)}\n`);
  return { ok: true, marcador };
}

function argumentos(lista) {
  const salida = {};
  for (let i = 0; i < lista.length; i++) {
    if (!lista[i].startsWith("--")) continue;
    const clave = lista[i].slice(2);
    salida[clave] = lista[i + 1] && !lista[i + 1].startsWith("--") ? lista[++i] : true;
  }
  return salida;
}

async function bytesPublicados(urlPublica) {
  try {
    const respuesta = await fetch(`${urlPublica}/upstream.json`, { signal: AbortSignal.timeout(15000), cache: "no-store" });
    return respuesta.ok ? Number((await respuesta.json()).bytes) || 0 : 0;
  } catch {
    return 0;
  }
}

async function principal() {
  const args = argumentos(process.argv.slice(2));
  const destino = leerDestino();
  const salida = resolve(RAIZ, args.out || "dist");
  let upstream = args.upstream || destino.upstream;
  let temporal = null;
  let sha = args.sha || "local";
  if (/^https?:\/\//.test(upstream)) {
    temporal = mkdtempSync(join(tmpdir(), "quadrate-upstream-"));
    sha = clonarUpstream(upstream, join(temporal, "repo"));
    upstream = join(temporal, "repo");
  } else if (!existsSync(upstream)) {
    throw new Error(`No existe la carpeta del upstream: ${upstream}`);
  }
  try {
    const resultado = ensamblar({
      upstream, salida, destino, sha, conGuardas: !args["sin-guardas"],
      bytesPrevios: args["sin-guardas"] ? 0 : await bytesPublicados(destino.urlPublica),
    });
    if (!resultado.ok) {
      console.error("LAS GUARDAS BLOQUEARON LA PUBLICACIÓN:");
      for (const h of resultado.informe.hallazgos) console.error(` - [${h.tipo}] ${h.archivo}: ${h.detalle}`);
      process.exitCode = 2;
      return;
    }
    console.log(`Sitio armado en ${salida} (upstream ${sha.slice(0, 7)}, capa ${resultado.marcador.overlay}, ${resultado.marcador.bytes} bytes).`);
  } finally {
    if (temporal) rmSync(temporal, { recursive: true, force: true });
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  principal().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
