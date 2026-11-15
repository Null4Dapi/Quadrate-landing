const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.jsx': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.woff2': 'font/woff2',
  '.json': 'application/json',
};

const server = http.createServer((req, res) => {
  let filePath = path.join(__dirname, '..', req.url.split('?')[0]);
  if (filePath.endsWith(path.sep) || filePath.endsWith('/')) {
    filePath = path.join(filePath, 'index.html');
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Server Error: ' + err.code);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

/* -------------------------------------------------------------------------- */
/* Servidor WebSocket RFC 6455 Nativo para Telemetría Operativa en Vivo       */
/* -------------------------------------------------------------------------- */

const clientesWebSocket = new Set();

function enviarMensajeWebSocket(socket, datos) {
  if (socket.destroyed || !socket.writable) return;
  const cargaUtil = Buffer.from(JSON.stringify(datos), 'utf8');
  const longitud = cargaUtil.length;
  let encabezado;

  if (longitud < 126) {
    encabezado = Buffer.from([0x81, longitud]);
  } else if (longitud < 65536) {
    encabezado = Buffer.alloc(4);
    encabezado[0] = 0x81;
    encabezado[1] = 126;
    encabezado.writeUInt16BE(longitud, 2);
  } else {
    encabezado = Buffer.alloc(10);
    encabezado[0] = 0x81;
    encabezado[1] = 127;
    encabezado.writeBigUInt64BE(BigInt(longitud), 2);
  }

  try {
    socket.write(Buffer.concat([encabezado, cargaUtil]));
  } catch (error) {
    clientesWebSocket.delete(socket);
  }
}

function difundirTelemetria(mensaje) {
  for (const socket of clientesWebSocket) {
    enviarMensajeWebSocket(socket, mensaje);
  }
}

/* Eventos de telemetría operativa real de cocheras en Lima */
const EVENTOS_TELEMETRIA = [
  {
    tipo: 'ingreso',
    cocheraId: 1,
    nombreCochera: 'Playa Las Begonias Central',
    distrito: 'San Isidro',
    titulo: 'Check-in LPR: Ingreso vehicular',
    mensaje: 'Portón A2 registró acceso de vehículo (Placa BZ-492). Plaza asignada en lote.',
    datos: { plazasLibres: 4, porcentajeOcupacion: 92, estadoAforo: 'fluido' },
  },
  {
    tipo: 'salida',
    cocheraId: 2,
    nombreCochera: 'Estacionamiento Larco Miraflores',
    distrito: 'Miraflores',
    titulo: 'Check-out: Salida y cobro exacto',
    mensaje: 'Vehículo retirado. Fraccionamiento 45m liquidado vía app. Plaza liberada.',
    datos: { plazasLibres: 16, porcentajeOcupacion: 58, estadoAforo: 'disponible' },
  },
  {
    tipo: 'reserva_eta',
    cocheraId: 3,
    nombreCochera: 'Cochera Polo Hunt',
    distrito: 'Surco',
    titulo: 'Reserva activa por ETA',
    mensaje: 'Conductor en ruta (ETA 6 min). Plaza temporalmente congelada en portón.',
    datos: { plazasLibres: 7, porcentajeOcupacion: 78, estadoAforo: 'reservado', eta: '6 min' },
  },
  {
    tipo: 'tarifa_dinamica',
    cocheraId: 4,
    nombreCochera: 'Playas Javier Prado Express',
    distrito: 'San Borja',
    titulo: 'Tarifa dinámica: Franja valle',
    mensaje: 'Aforo al 45%. Tarifa de primera hora ajustada temporalmente a S/ 4.50.',
    datos: { plazasLibres: 22, porcentajeOcupacion: 45, estadoAforo: 'promocion', tarifaHora: 4.5 },
  },
  {
    tipo: 'aforo_critico',
    cocheraId: 5,
    nombreCochera: 'Estacionamiento Canaval y Moreyra',
    distrito: 'San Isidro',
    titulo: 'Umbral de saturación: 95%',
    mensaje: 'Últimas 2 plazas disponibles. Sugiriendo desvío inteligente a cocheras colindantes.',
    datos: { plazasLibres: 2, porcentajeOcupacion: 95, estadoAforo: 'critico' },
  },
];

let indiceEvento = 0;

function emitirSiguienteEvento() {
  if (clientesWebSocket.size === 0) return null;
  const eventoBase = EVENTOS_TELEMETRIA[indiceEvento];
  const ahora = new Date().toLocaleTimeString('es-PE', { hour12: false });
  const evento = { ...eventoBase, timestamp: ahora };
  difundirTelemetria(evento);
  indiceEvento = (indiceEvento + 1) % EVENTOS_TELEMETRIA.length;
  return evento;
}

server.on('upgrade', (req, socket) => {
  if (req.url !== '/ws-telemetria') {
    socket.destroy();
    return;
  }

  const claveCliente = req.headers['sec-websocket-key'];
  if (!claveCliente) {
    socket.destroy();
    return;
  }

  const claveAceptacion = crypto
    .createHash('sha1')
    .update(claveCliente + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11')
    .digest('base64');

  const respuestaHandshake = [
    'HTTP/1.1 101 Switching Protocols',
    'Upgrade: websocket',
    'Connection: Upgrade',
    `Sec-WebSocket-Accept: ${claveAceptacion}`,
    '',
  ].join('\r\n') + '\r\n';

  socket.write(respuestaHandshake);
  clientesWebSocket.add(socket);

  const ahora = new Date().toLocaleTimeString('es-PE', { hour12: false });
  enviarMensajeWebSocket(socket, {
    tipo: 'conexion',
    titulo: 'Enlace WebSocket Establecido',
    mensaje: 'Centro de telemetría conectado a la red de 6 garitas en Lima Metropolitana.',
    timestamp: ahora,
  });

  socket.on('data', (buffer) => {
    const opcode = buffer[0] & 0x0f;
    if (opcode === 0x08) {
      clientesWebSocket.delete(socket);
      socket.end();
    } else if (opcode === 0x09) {
      socket.write(Buffer.from([0x8a, 0x00])); // Pong
    } else if (opcode === 0x01) {
      // Trama de texto del cliente (desenmascarar RFC 6455)
      const esEnmascarado = (buffer[1] & 0x80) !== 0;
      let len = buffer[1] & 0x7f;
      let offset = 2;
      if (len === 126) {
        len = buffer.readUInt16BE(2);
        offset = 4;
      }
      if (esEnmascarado) {
        const mascara = buffer.slice(offset, offset + 4);
        offset += 4;
        const payload = buffer.slice(offset, offset + len);
        for (let i = 0; i < payload.length; i++) {
          payload[i] ^= mascara[i % 4];
        }
        try {
          const mensajeCliente = JSON.parse(payload.toString('utf8'));
          if (mensajeCliente.accion === 'simular_evento') {
            emitirSiguienteEvento();
          }
        } catch (e) {
          /* JSON no parseable, ignorar */
        }
      }
    }
  });

  socket.on('close', () => clientesWebSocket.delete(socket));
  socket.on('error', () => clientesWebSocket.delete(socket));
});

/* Intervalo pasivo pausado y realista: cada 22 segundos */
setInterval(() => {
  emitirSiguienteEvento();
}, 22000);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor local activo en http://localhost:${PORT}`);
});
