# Instrucciones de Gestión Académica (docs/university/AGENTS.md)

Este documento define el **Scoped Context (Contexto Jerárquico)** para la subcarpeta `docs/university/`. Especializa el comportamiento del agente y de los desarrolladores frente a las guías de clase y entregables de la universidad, heredando las reglas globales del `AGENTS.md` de la raíz.

---

## 1. Arquitectura de Carpetas y Nomenclatura

- `docs/university/enunciados/`: Transcripciones fieles de los PDFs del docente y guías originales. **Regla dura:** Solo lectura estricta. Prohibido editarlos una vez creados.
  - Formato de nombre: `enunciado-XXX-etapaY.md` (ej. `enunciado-006-etapa1.md`) o `guia-XXX-etapaY.md`.
- `docs/university/entregables/`: Documentos oficiales del equipo adaptados a Quadrate pe.
  - Formato de nombre: `entrega-XXX-etapaY.md` (ej. `entrega-006-etapa1.md`).
- `docs/university/TODO.md`: Semáforo y lista de pendientes académicos del equipo.
  - El agente **debe consultar este archivo al inicio de sesión** para saber qué guías están pendientes (`[ ]`), en desarrollo (`[-]`) o listas (`[x]`).
  - Al completar o avanzar un entregable, el agente **debe mantener actualizado su estado** aquí.
- `docs/university/CHANGELOG.md`: Bitácora interna de trabajo del equipo (consumo interno exclusivo).
  - Orden cronológico inverso (lo más nuevo arriba).
  - El agente **debe consultar al desarrollador su nombre** antes de registrar un cambio.
  - Debe listar explícitamente los archivos intervenidos y usar viñetas detalladas.
- **Límite de líneas (excepción):** `docs/university/enunciados/` queda exento del techo global de líneas definido en el `AGENTS.md` raíz. Son transcripciones de material ajeno y no admiten partición sin corromper el original.
- **PDF originales:** cualquier PDF vive únicamente en el equipo local y **nunca se commitea** al repositorio. Si por exigencia estricta se requiriera versionar uno, debe consultarse al equipo y obtener autorización explícita antes de hacerlo.

---

## 2. Barrera Dura Infranqueable (Phase Gate)

> **SIN PLANIFICACIÓN APROBADA (ENTREGABLE ETAPA 1), ESTÁ TERMINANTEMENTE PROHIBIDO PICAR CÓDIGO FUENTE O INICIAR LA IMPLEMENTACIÓN (ENTREGABLE ETAPA 2).**

- Ante cualquier pedido de implementar código o redactar la Etapa 2, el agente auditará que `docs/university/entregables/entrega-XXX-etapa1.md` exista y esté cerrado.
- Si no existe o está incompleto, el agente **bloqueará la solicitud** y devolverá el control al humano para completar la planificación.

---

## 3. Contrato Sagrado de Encabezados (Contract-First)

- El humano crea el esqueleto en `docs/university/entregables/entrega-XXX-etapaY.md` con los encabezados oficiales (`#`, `##`, `###`), tablas vacías y preguntas de la rúbrica.
- **Prohibición dura para el agente:** El agente no puede agregar, renombrar ni eliminar ningún encabezado creado por el humano sin consulta previa y autorización explícita. Solo rellena el contenido *debajo* de los títulos existentes.

---

## 4. Flujo Operativo por Fases

### FASE 0: Conversión del PDF del docente a Markdown (obligatoria)

Requisito: Node 20 o superior. No requiere instalación local ni agregar dependencias al proyecto; `npx` obtiene el binario en la primera ejecución. **anydoc no es una librería del producto:** es una herramienta de desarrollo y no se integra a la landing.

1. `[HUMANO]` Descarga el PDF del docente en su carpeta local (por ejemplo `~/Downloads`). El PDF nunca se copia ni se commitea al repositorio.
2. `[AGENTE]` Verifica que el destino no exista. Si el archivo destino ya existe, **detenerse y consultar**: los enunciados son de solo lectura estricta.
3. `[AGENTE]` Ejecuta la conversión con ruta absoluta al PDF local:

   ```bash
   npx -y @firecrawl/anydoc "<ruta-absoluta>.pdf" -o docs/university/enunciados/<nombre>.md
   ```

   El nombre del destino es espejo del origen (`guia-NNN-etapaY.pdf` → `guia-NNN-etapaY.md`).
4. `[AGENTE]` Interpreta el código de salida:
   - `0` → continuar al paso 5.
   - `3` → el PDF está escaneado y requiere OCR. **Detenerse:** no generar archivo alternativo ni transcribir por cuenta propia. Informar al humano para que consiga el PDF digital o transcriba manualmente.
   - `1` o `2` → error de conversión o de uso. Reportar. No inventar una salida alternativa.
5. `[AGENTE]` Control de integridad obligatorio sobre el `.md` generado:
   - Contrasta la jerarquía de encabezados contra el documento original.
   - Busca caracteres de reemplazo (`�`), tablas vacías o filas corridas.
   - Verifica que el volumen de líneas sea proporcional a las páginas del PDF.

   Si hay discrepancias, las reporta. **No corrige ni reescribe el contenido.**
6. `[HUMANO]` Valida la transcripción y autoriza el commit.
7. `[AGENTE]` Actualiza `docs/university/TODO.md` y registra en `docs/university/CHANGELOG.md` (pidiendo el nombre del desarrollador, según §1), incluyendo archivo original, fecha y comando utilizado.

**Nota:** el Protocolo de los 3 Filtros no aplica a este paso. Rige para diseñar la implementación de los requisitos de una guía, no para convertir material fuente.

### FASE 1: Planificación (Etapa 1 - Desarrollo Web Frontend)
1. `[HUMANO + AGENTE]` Convertir el PDF a `docs/university/enunciados/enunciado-XXX-etapa1.md` siguiendo la Fase 0.
2. `[HUMANO]` Crea esqueleto en `docs/university/entregables/entrega-XXX-etapa1.md`.
3. `[HUMANO + AGENTE]` Diálogo iterativo: El agente aplica los 3 Filtros (concepto vs juguete, mapeo a landing de cocheras, confinamiento) y propone alternativas con fundamento técnico real de UI/UX. Se itera hasta la satisfacción del humano. Cero código en este paso.
4. `[HUMANO]` Autoriza la alternativa final.
5. `[AGENTE]` Rellena el entregable bajo los encabezados existentes.
6. `[AGENTE]` **Auditoría cruzada de integridad:** Lee `enunciado-XXX-etapa1.md` solo para verificar que no falte ningún punto de la rúbrica. Si detecta faltantes, avisa al humano en el chat para que decida. No modifica la planificación por su cuenta.
7. `[HUMANO]` Valida y cierra la Etapa 1.
8. `[AGENTE]` Pregunta el nombre del desarrollador y registra en `docs/university/CHANGELOG.md`.

### FASE 2: Implementación y Pruebas (Etapa 2 - Laboratorio)
1. `[HUMANO + AGENTE]` Convertir el PDF a `docs/university/enunciados/enunciado-XXX-etapa2.md` siguiendo la Fase 0.
2. `[HUMANO]` Crea esqueleto en `docs/university/entregables/entrega-XXX-etapa2.md`.
3. `[AGENTE]` Define los archivos exactos a tocar en el proyecto (`src/...`) **basándose exclusivamente en lo pactado en `entrega-XXX-etapa1.md` (fuente de la verdad)**, ignorando nombres genéricos del enunciado.
4. `[HUMANO]` Autoriza la superficie de edición.
5. `[AGENTE]` Implementa el código (KISS, BEM, archivos < 300 líneas).
6. `[HUMANO + AGENTE]` Verifican en vivo (servidor local, consola limpia, pruebas en navegador).
7. `[AGENTE]` Rellena evidencias y respuestas técnicas en `docs/university/entregables/entrega-XXX-etapa2.md`.
8. `[HUMANO]` Valida la entrega final.
9. `[AGENTE]` Pregunta el nombre del desarrollador y anota en `docs/university/CHANGELOG.md`.

---

## 5. Estándares de Redacción para Entregables

- **Voz del equipo:** Redactar estrictamente en primera persona del plural (*"Como equipo decidimos..."*, *"Implementamos..."*, *"Optamos por..."*).
- **Tono documental sobrio:** Lenguaje técnico de ingeniería, explicativo y fundamentado.
- **Cero clichés de IA:** Prohibido el tono poético o dramático (*"En el vertiginoso mundo..."*, *"Es crucial destacar..."*).
- **Sintaxis limpia:** Conectores lógicos formales (*"Por consiguiente"*, *"Dado que"*, *"Sin embargo"*), oraciones directas sin encadenar párrafos con comas excesivas ni puntos innecesarios.
