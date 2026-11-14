/**
 * Verifica la publicación: el marcador del sitio debe tener el commit esperado y las páginas deben traer la capa en vivo.
 * Uso: node scripts/verificar.mjs <sha-esperado>
 */
import { leerDestino } from "./build.mjs";

const esperado = process.argv[2];
const destino = leerDestino();
const base = destino.urlPublica;

async function obtener(ruta) {
  const respuesta = await fetch(`${base}${ruta}?v=${Date.now()}`, { signal: AbortSignal.timeout(20000), cache: "no-store" });
  if (!respuesta.ok) throw new Error(`${ruta} respondió ${respuesta.status}`);
  return respuesta;
}

async function intentar(veces, espera, accion) {
  let ultimo;
  for (let i = 1; i <= veces; i++) {
    try {
      return await accion();
    } catch (error) {
      ultimo = error;
      if (i < veces) await new Promise((r) => setTimeout(r, espera));
    }
  }
  throw ultimo;
}

try {
  const marcador = await intentar(6, 5000, async () => {
    const m = await (await obtener("/upstream.json")).json();
    if (esperado && m.sha !== esperado) throw new Error(`el sitio sirve ${String(m.sha).slice(0, 7)} y se esperaba ${esperado.slice(0, 7)}`);
    return m;
  });
  for (const pagina of ["/", "/live/live.js", "/live/shim-ws.js"]) await obtener(pagina);
  const html = await (await obtener("/")).text();
  if (!html.includes("/live/live.js")) throw new Error("la página principal no trae la capa en vivo");
  const config = await (await obtener("/live/config.js")).text();
  if (destino.wsUrl && !config.includes(destino.wsUrl)) throw new Error("config.js no apunta al servicio en vivo");
  console.log(`Publicación verificada: upstream ${marcador.sha.slice(0, 7)}, capa ${marcador.overlay}, ${marcador.bytes} bytes.`);
} catch (error) {
  console.error(`Verificación fallida: ${error.message}`);
  process.exitCode = 1;
}
