# Operación, seguridad y costos

## Cómo se publica
1. `scripts/cambios.mjs` lee el último commit del repo público (`git ls-remote`) y la huella de nuestra capa; los compara con
   `https://quadratepe.web.app/upstream.json`. Si coinciden, termina sin publicar.
2. `scripts/build.mjs` clona el repo (solo lectura), **ejecuta las guardas**, copia el sitio, inyecta la capa en `index.html` y
   `demo.html`, y escribe `upstream.json` (commit, huella, tamaño, fecha).
3. Autenticación a Google Cloud por **federación de identidad** (sin claves guardadas): el pool `github-pool` solo acepta tokens
   de `Kyndecueva/quadrate-publisher` y solo puede usar la cuenta `quadrate-publisher@…` (roles `firebasehosting.admin` y
   `serviceusage.serviceUsageConsumer`).
4. `firebase deploy --only hosting` al sitio `quadratepe`. Después `scripts/verificar.mjs` comprueba el marcador y la capa.

Publicar a mano: pestaña *Actions → Publicar Quadrate → Run workflow* (casilla «Publicar aunque no haya cambios»).

## Guardas (fallan cerradas)
Si el repo público trae cualquiera de estas cosas, **no se publica** y el flujo falla (GitHub avisa por correo); el sitio
sigue como estaba:
- secretos o claves privadas; extensiones peligrosas (`.exe`, `.ps1`, `.sh`, `.php`, …); archivos de más de 8 MB o un sitio de más de 40 MB;
- un tamaño más del doble que el publicado; ausencia de `index.html`;
- **recursos o conexiones a hosts externos** (scripts, estilos, imágenes, `fetch`, `WebSocket`, …) que no estén en `hostsPermitidos`.

Aprobar un host nuevo: agregarlo a `config/destino.json → hostsPermitidos` (decisión humana, queda en git).
Riesgo residual: las guardas no leen la lógica del código. Quien tenga permiso de escritura en el repo público puede publicar
JavaScript propio del mismo origen. Revisar el historial del repo público de vez en cuando y usar la reversión si algo no cuadra.

## Reversión
```powershell
firebase hosting:rollback --site quadratepe --project dealforge-512304
```
Para detener la automatización: *Actions → Publicar Quadrate → ⋯ → Disable workflow*.

## Servicio en vivo (Cloud Run `quadrate-live`, región `southamerica-west1`)
- Sin base de datos, sin claves, sin permisos de GCP (cuenta de servicio `quadrate-live@…` sin roles). Los datos de aforo se
  calculan en función del reloj, así que todas las instancias coinciden.
- Orígenes permitidos (`ALLOWED_ORIGINS`): el WebSocket y CORS solo aceptan las páginas de Quadrate; un navegador siempre envía `Origin`.
- Límites: 4 conexiones por IP, 150 por instancia, 8 mensajes de chat por minuto y por IP, 400 caracteres por mensaje, 2 KB por
  trama, vida máxima de 14 min en el chat y de 5 min en la telemetría (el cliente reconecta; así una desconexión brusca no deja sockets fantasma), cierre a los 90 s sin actividad en `/ws`, y un
  **presupuesto de 30 min de telemetría por IP y hora** (la demo de la página reconecta sola cada 4 s).
- Privacidad: no se guardan ni se registran los mensajes del chat; el `--no-access-log` de uvicorn evita registrar las rutas.
- Firebase Hosting no reenvía WebSocket: el navegador se conecta directo a la URL `*.run.app` del servicio.

## Costos (estimación; revisar en la calculadora de precios de Google Cloud)
- **Cloud Run**: 0 instancias mínimas, máximo 2, 1 vCPU/512 MiB, facturación por solicitud (solo hay cargo mientras haya una
  conexión abierta). Con tráfico bajo cabe en el nivel gratuito mensual (2 M solicitudes, 180 000 vCPU-s, 360 000 GiB-s).
  Una pestaña abierta 24 h mantendría una instancia viva: por eso el shim cierra con la pestaña oculta y el servidor corta por presupuesto.
- **Firebase Hosting**: sitio estático de ~3 MB; dentro del nivel gratuito con poco tráfico.
- **GitHub Actions**: una ejecución por hora de ~1 min ≈ 720 min/mes (repo privado: 2 000 gratis).
- **Cloud Build**: cada redeploy del servicio usa unos minutos de build (120 min/día gratis).
- Recomendado: crear un **presupuesto con alerta** en Facturación (p. ej. 5 USD/mes).

## Operar el servicio
```powershell
gcloud run services describe quadrate-live --region southamerica-west1 --project dealforge-512304
gcloud run deploy quadrate-live --source service --region southamerica-west1 --project dealforge-512304   # conserva la configuración
gcloud run services update quadrate-live --region southamerica-west1 --max-instances 1                      # reducir costo/escala
```
Cambiar los orígenes: `--update-env-vars "^@^ALLOWED_ORIGINS=https://a,https://b"` (la coma exige el delimitador `^@^`).
Si cambia la URL del servicio, actualizar `config/destino.json` y hacer *push*: se publica sola.
