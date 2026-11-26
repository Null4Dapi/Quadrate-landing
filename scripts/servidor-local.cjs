const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const CLOUD_RUN_HOST = 'quadrate-live-365843518799.southamerica-west1.run.app';
const ORIGIN_PRODUCCION = 'https://quadratepe.dealforge.lat';

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8', '.jsx': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.woff2': 'font/woff2', '.json': 'application/json',
};

function proxyHttp(req, res) {
  const opciones = {
    hostname: CLOUD_RUN_HOST, port: 443, path: req.url, method: req.method,
    headers: { ...req.headers, host: CLOUD_RUN_HOST, origin: ORIGIN_PRODUCCION, referer: ORIGIN_PRODUCCION + '/' },
  };
  const proxyReq = https.request(opciones, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  });
  proxyReq.on('error', () => {
    res.writeHead(502, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ error: 'Error comunicando con servicio Cloud Run' }));
  });
  req.pipe(proxyReq);
}

const server = http.createServer((req, res) => {
  const urlLimpia = req.url.split('?')[0];

  if (urlLimpia === '/live/config.js') {
    res.writeHead(200, { 'Content-Type': 'application/javascript; charset=utf-8' });
    res.end(`window.QUADRATE_LIVE = {
  wsUrl: "ws://" + location.host + "/ws",
  wsTelemetriaUrl: "ws://" + location.host + "/ws-telemetria",
  httpUrl: location.protocol + "//" + location.host
};\n`);
    return;
  }

  if (urlLimpia.startsWith('/v1/')) return proxyHttp(req, res);

  const distExiste = fs.existsSync(path.join(__dirname, '..', 'dist', 'index.html'));
  const carpetaBase = distExiste ? path.join(__dirname, '..', 'dist') : path.join(__dirname, '..');
  let rutaArchivo = path.join(carpetaBase, urlLimpia);
  if (rutaArchivo.endsWith(path.sep) || rutaArchivo.endsWith('/')) rutaArchivo = path.join(rutaArchivo, 'index.html');

  if (!fs.existsSync(rutaArchivo) && urlLimpia.startsWith('/live/')) {
    const rutaOverlay = path.join(__dirname, '..', 'overlay', path.basename(urlLimpia));
    if (fs.existsSync(rutaOverlay)) rutaArchivo = rutaOverlay;
  }

  const ext = path.extname(rutaArchivo).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(rutaArchivo, (err, content) => {
    if (err) {
      res.writeHead(err.code === 'ENOENT' ? 404 : 500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(err.code === 'ENOENT' ? '404 Not Found' : '500 Server Error: ' + err.code);
      return;
    }
    if (!distExiste && (urlLimpia === '/demo.html' || urlLimpia === '/demo')) {
      let html = content.toString('utf8');
      if (!html.includes('<!-- quadrate-live -->')) {
        const estilo = '<link rel="stylesheet" href="/live/live.css">';
        const scripts = '<script src="/live/config.js"></script><script src="/live/shim-ws.js"></script><script type="module" src="/live/live.js"></script>';
        content = Buffer.from(html.replace(/<\/head>/i, `${estilo}</head>`).replace(/<\/body>/i, `${scripts}</body>`), 'utf8');
      }
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  });
});

/* -------------------------------------------------------------------------- */
/* Utilidades RFC 6455 WebSocket                                              */
/* -------------------------------------------------------------------------- */

function responderHandshake(req, socket) {
  const clave = req.headers['sec-websocket-key'];
  if (!clave) { socket.destroy(); return false; }
  const claveAceptada = crypto.createHash('sha1').update(clave + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11').digest('base64');
  socket.write(`HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Accept: ${claveAceptada}\r\n\r\n`);
  return true;
}

function decodificarTrama(buffer) {
  if (!buffer || buffer.length < 2) return null;
  const opcode = buffer[0] & 0x0f;
  if (opcode === 0x08) return { tipo: 'close' };
  if (opcode === 0x09) return { tipo: 'ping' };
  if (opcode === 0x0a) return { tipo: 'pong' };
  if (opcode === 0x01) {
    const esEnmascarado = (buffer[1] & 0x80) !== 0;
    let len = buffer[1] & 0x7f, offset = 2;
    if (len === 126) { if (buffer.length < 4) return null; len = buffer.readUInt16BE(2); offset = 4; }
    else if (len === 127) { if (buffer.length < 10) return null; len = Number(buffer.readBigUInt64BE(2)); offset = 10; }
    if (esEnmascarado) {
      if (buffer.length < offset + 4 + len) return null;
      const mascara = buffer.subarray(offset, offset + 4);
      const payload = Buffer.from(buffer.subarray(offset + 4, offset + 4 + len));
      for (let i = 0; i < payload.length; i++) payload[i] ^= mascara[i % 4];
      return { tipo: 'texto', texto: payload.toString('utf8') };
    }
    return { tipo: 'texto', texto: buffer.subarray(offset, offset + len).toString('utf8') };
  }
  return null;
}

function enviarTramaTexto(socket, texto) {
  if (socket.destroyed || !socket.writable) return;
  const payload = Buffer.from(texto, 'utf8'), len = payload.length;
  let header;
  if (len < 126) {
    header = Buffer.from([0x81, len]);
  } else if (len < 65536) {
    header = Buffer.alloc(4); header[0] = 0x81; header[1] = 126; header.writeUInt16BE(len, 2);
  } else {
    header = Buffer.alloc(10); header[0] = 0x81; header[1] = 127; header.writeBigUInt64BE(BigInt(len), 2);
  }
  try { socket.write(Buffer.concat([header, payload])); } catch {}
}

/* -------------------------------------------------------------------------- */
/* Telemetría Operativa Local para demo.html                                  */
/* -------------------------------------------------------------------------- */

const clientesTelemetria = new Set();
const EVENTOS_TELEMETRIA = [
  { tipo: 'ingreso', cocheraId: 1, nombreCochera: 'Playa Las Begonias Central', distrito: 'San Isidro', titulo: 'Check-in LPR: Ingreso vehicular', mensaje: 'Portón A2 registró acceso de vehículo (Placa BZ-492). Plaza asignada en lote.', datos: { plazasLibres: 4, porcentajeOcupacion: 92, estadoAforo: 'fluido' } },
  { tipo: 'salida', cocheraId: 2, nombreCochera: 'Estacionamiento Larco Miraflores', distrito: 'Miraflores', titulo: 'Check-out: Salida y cobro exacto', mensaje: 'Vehículo retirado. Fraccionamiento 45m liquidado vía app. Plaza liberada.', datos: { plazasLibres: 16, porcentajeOcupacion: 58, estadoAforo: 'disponible' } },
  { tipo: 'reserva_eta', cocheraId: 3, nombreCochera: 'Cochera Polo Hunt', distrito: 'Surco', titulo: 'Reserva activa por ETA', mensaje: 'Conductor en ruta (ETA 6 min). Plaza temporalmente congelada en portón.', datos: { plazasLibres: 7, porcentajeOcupacion: 78, estadoAforo: 'reservado', eta: '6 min' } },
  { tipo: 'tarifa_dinamica', cocheraId: 4, nombreCochera: 'Playas Javier Prado Express', distrito: 'San Borja', titulo: 'Tarifa dinámica: Franja valle', mensaje: 'Aforo al 45%. Tarifa de primera hora ajustada temporalmente a S/ 4.50.', datos: { plazasLibres: 22, porcentajeOcupacion: 45, estadoAforo: 'promocion', tarifaHora: 4.5 } },
  { tipo: 'aforo_critico', cocheraId: 5, nombreCochera: 'Estacionamiento Canaval y Moreyra', distrito: 'San Isidro', titulo: 'Umbral de saturación: 95%', mensaje: 'Últimas 2 plazas disponibles. Sugiriendo desvío inteligente a cocheras colindantes.', datos: { plazasLibres: 2, porcentajeOcupacion: 95, estadoAforo: 'critico' } },
];

let indiceEvento = 0;
function emitirSiguienteEvento() {
  if (clientesTelemetria.size === 0) return null;
  const evento = { ...EVENTOS_TELEMETRIA[indiceEvento], timestamp: new Date().toLocaleTimeString('es-PE', { hour12: false }) };
  for (const socket of clientesTelemetria) enviarTramaTexto(socket, JSON.stringify(evento));
  indiceEvento = (indiceEvento + 1) % EVENTOS_TELEMETRIA.length;
  return evento;
}

/* -------------------------------------------------------------------------- */
/* Manejador de Conexiones WebSocket (Chat /ws y Telemetría /ws-telemetria)   */
/* -------------------------------------------------------------------------- */

server.on('upgrade', (req, socket) => {
  const rutaWs = req.url.split('?')[0];

  if (rutaWs === '/ws-telemetria') {
    if (!responderHandshake(req, socket)) return;
    clientesTelemetria.add(socket);
    enviarTramaTexto(socket, JSON.stringify({
      tipo: 'conexion', titulo: 'Enlace WebSocket Establecido',
      mensaje: 'Centro de telemetría conectado a la red de 6 garitas en Lima Metropolitana.',
      timestamp: new Date().toLocaleTimeString('es-PE', { hour12: false }),
    }));
    socket.on('data', (buffer) => {
      const trama = decodificarTrama(buffer);
      if (!trama) return;
      if (trama.tipo === 'close') { clientesTelemetria.delete(socket); socket.end(); }
      else if (trama.tipo === 'ping') socket.write(Buffer.from([0x8a, 0x00]));
      else if (trama.tipo === 'texto') {
        try {
          if (JSON.parse(trama.texto).accion === 'simular_evento') emitirSiguienteEvento();
        } catch {}
      }
    });
    socket.on('close', () => clientesTelemetria.delete(socket));
    socket.on('error', () => clientesTelemetria.delete(socket));
    return;
  }

  if (rutaWs === '/ws') {
    if (!responderHandshake(req, socket)) return;
    let upstreamWs = null;
    const colaPendiente = [];
    try {
      upstreamWs = new WebSocket(`wss://${CLOUD_RUN_HOST}/ws`, { headers: { Origin: ORIGIN_PRODUCCION } });
    } catch {
      socket.destroy();
      return;
    }

    upstreamWs.onopen = () => {
      while (colaPendiente.length > 0) {
        try { upstreamWs.send(colaPendiente.shift()); } catch {}
      }
    };
    upstreamWs.onmessage = (evt) => enviarTramaTexto(socket, evt.data);
    upstreamWs.onclose = () => { try { socket.end(); } catch {} };
    upstreamWs.onerror = () => { try { socket.end(); } catch {} };

    socket.on('data', (buffer) => {
      const trama = decodificarTrama(buffer);
      if (!trama) return;
      if (trama.tipo === 'close') {
        try { upstreamWs.close(); socket.end(); } catch {}
      } else if (trama.tipo === 'ping') {
        socket.write(Buffer.from([0x8a, 0x00]));
      } else if (trama.tipo === 'texto') {
        if (upstreamWs.readyState === WebSocket.OPEN) upstreamWs.send(trama.texto);
        else if (upstreamWs.readyState === WebSocket.CONNECTING) colaPendiente.push(trama.texto);
      }
    });

    const limpiar = () => { try { upstreamWs.close(); } catch {} };
    socket.on('close', limpiar);
    socket.on('error', limpiar);
    return;
  }

  socket.destroy();
});

setInterval(emitirSiguienteEvento, 22000);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor local activo en http://localhost:${PORT}`);
});
