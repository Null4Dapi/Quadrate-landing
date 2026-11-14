# quadrate-publisher

Publica la página de **Quadrate pe** (repo público [Null4Dapi/Quadrate-landing](https://github.com/Null4Dapi/Quadrate-landing))
en Firebase Hosting (`quadratepe`) y le agrega una **capa en vivo** servida por Cloud Run: WebSocket con disponibilidad de
cocheras y un asistente con respuesta en streaming. El repo público no se modifica ni se copia a mano: cada hora se vuelve
a clonar y, si cambió, se publica solo.

```
Null4Dapi/Quadrate-landing ──(cada hora, GitHub Actions)──► guardas ► capa en vivo ► Firebase Hosting (quadratepe)
                                                                                         │
navegador ◄── página estática ─────────────────────────────────────────────────────────┘
    │
    └── wss://quadrate-live-….run.app/ws            chat en streaming
        wss://quadrate-live-….run.app/ws-telemetria disponibilidad en vivo para la demo (/demo.html) de la propia página
```

| Carpeta | Qué es |
|---|---|
| `scripts/` | `cambios` (¿hay algo nuevo?), `build` (arma `dist/`), `guardas` (seguridad), `verificar` (post-publicación) |
| `overlay/` | `live.js/css` (asistente), `shim-ws.js` (redirige la demo al servicio) — se inyectan, no tocan el código de la página |
| `service/` | Cloud Run `quadrate-live` (FastAPI): `/ws`, `/ws-telemetria`, `/v1/chat`, `/v1/aforo`, `/salud` |
| `config/destino.json` | repo de origen, sitio de Firebase, URLs del servicio, hosts externos permitidos |
| `.github/workflows/publicar.yml` | automatización (cron cada hora, manual y al cambiar este repo) |

Detalles de seguridad, costos y operación: [`docs/OPERACION.md`](docs/OPERACION.md).

## Desarrollo

```powershell
node --test tests/*.test.mjs                                  # generador y guardas
cd service; python -m venv .venv; .venv\Scripts\pip install -r requirements-dev.txt; .venv\Scripts\python -m pytest
node scripts/build.mjs                                        # clona el repo público y arma dist/ (aplica las guardas)
```

## Datos de demostración

La disponibilidad de cocheras es **simulada** (determinista en el tiempo, sin base de datos). El asistente lo dice cada vez.
El chat responde con preguntas frecuentes locales (sin IA ni claves) y solo afirma lo que la página publica.
