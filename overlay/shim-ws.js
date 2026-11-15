/* Quadrate pe — la demo (demo.html) abre un WebSocket a "/ws-telemetria" en su propio dominio, pero Firebase Hosting no sirve
 * WebSocket. Este shim redirige solo esa conexión al servicio de Cloud Run, sin modificar el código de la página.
 * Con la pestaña en segundo plano no abre el enlace (la demo reintenta cada 4 s) y cierra el abierto tras 60 s,
 * para que una pestaña olvidada no mantenga encendido el servicio. */
(function () {
  var cfg = window.QUADRATE_LIVE || {};
  var Nativo = window.WebSocket;
  if (!cfg.wsTelemetriaUrl || !Nativo) return;
  var OCULTA_MS = 60000;

  function vigilar(ws) {
    var temporizador = null;
    function alCambiar() {
      if (document.hidden) {
        temporizador = setTimeout(function () {
          if (document.hidden && ws.readyState <= 1) ws.close(4002, "segundo plano");
        }, OCULTA_MS);
      } else {
        clearTimeout(temporizador);
      }
    }
    document.addEventListener("visibilitychange", alCambiar);
    ws.addEventListener("close", function () {
      clearTimeout(temporizador);
      document.removeEventListener("visibilitychange", alCambiar);
    });
  }

  function QuadrateWebSocket(url, protocolos) {
    var ruta = "";
    try {
      ruta = new URL(url, location.href).pathname;
    } catch (error) {
      ruta = "";
    }
    var esTelemetria = ruta === "/ws-telemetria";
    var destino = url;
    if (esTelemetria) {
      if (document.hidden) throw new DOMException("Pestaña en segundo plano: no se abre el enlace en vivo.", "SyntaxError");
      destino = cfg.wsTelemetriaUrl;
    }
    var ws = protocolos === undefined ? new Nativo(destino) : new Nativo(destino, protocolos);
    if (esTelemetria) vigilar(ws);
    return ws;
  }

  QuadrateWebSocket.prototype = Nativo.prototype;
  ["CONNECTING", "OPEN", "CLOSING", "CLOSED"].forEach(function (clave) {
    QuadrateWebSocket[clave] = Nativo[clave];
  });
  window.WebSocket = QuadrateWebSocket;
})();
