/**
 * Decide si hay que publicar: compara el commit del repo público y la huella de la capa en vivo
 * con el marcador que el sitio ya publicado expone en /upstream.json.
 *
 * Uso: node scripts/cambios.mjs [--forzar]   (en GitHub Actions escribe `deploy=true|false` y `sha=` en GITHUB_OUTPUT)
 */
import { execFileSync } from "node:child_process";
import { appendFileSync } from "node:fs";

import { huellaOverlay, leerDestino } from "./build.mjs";

const forzar = process.argv.includes("--forzar");
const destino = leerDestino();
const linea = execFileSync("git", ["ls-remote", destino.upstream, "HEAD"], { encoding: "utf8" }).trim();
const sha = linea.split(/\s+/)[0];
if (!/^[0-9a-f]{40}$/.test(sha)) throw new Error(`No pude leer el commit de ${destino.upstream}`);
const overlay = huellaOverlay();

let publicado = null;
try {
  const respuesta = await fetch(`${destino.urlPublica}/upstream.json`, { signal: AbortSignal.timeout(15000), cache: "no-store" });
  if (respuesta.ok) publicado = await respuesta.json();
} catch { /* sin marcador: se publica */ }

const motivo = forzar ? "forzado" : !publicado ? "no hay marcador publicado"
  : publicado.sha !== sha ? `el repo cambió (${publicado.sha?.slice(0, 7)} → ${sha.slice(0, 7)})`
  : publicado.overlay !== overlay ? "cambió la capa en vivo" : "";
const deploy = Boolean(motivo);
console.log(deploy ? `Publicar: ${motivo}.` : `Sin cambios (repo ${sha.slice(0, 7)}, capa ${overlay}).`);

if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `deploy=${deploy}\nsha=${sha}\n`);
