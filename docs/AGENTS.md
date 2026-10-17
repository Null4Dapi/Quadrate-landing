# Instrucciones de Gestión Académica (docs/AGENTS.md)

Este documento define el **Scoped Context (Contexto Jerárquico)** para la carpeta `docs/`. Especializa el comportamiento del agente y de los desarrolladores frente a las guías de clase y entregables de la universidad, heredando las reglas globales del `AGENTS.md` de la raíz.

---

## 1. Arquitectura de Carpetas y Nomenclatura

- `docs/enunciados/`: Transcripciones fieles de los PDFs del docente. **Regla dura:** Solo lectura estricta. Prohibido editarlos una vez creados.
  - Formato de nombre: `enunciado-XXX-etapaY.md` (ej. `enunciado-006-etapa1.md`).
- `docs/entregables/`: Documentos oficiales del equipo adaptados a Quadrate pe.
  - Formato de nombre: `entrega-XXX-etapaY.md` (ej. `entrega-006-etapa1.md`).
- `docs/TODO.md`: Semáforo y lista de pendientes académicos del equipo.
  - El agente **debe consultar este archivo al inicio de sesión** para saber qué guías están pendientes (`[ ]`), en desarrollo (`[-]`) o listas (`[x]`).
  - Al completar o avanzar un entregable, el agente **debe mantener actualizado su estado** aquí.
- `docs/CHANGELOG.md`: Bitácora interna de trabajo del equipo (consumo interno exclusivo).
  - Orden cronológico inverso (lo más nuevo arriba).
  - El agente **debe consultar al desarrollador su nombre** antes de registrar un cambio.
  - Debe listar explícitamente los archivos intervenidos y usar viñetas detalladas.

---

## 2. Barrera Dura Infranqueable (Phase Gate)

> **SIN PLANIFICACIÓN APROBADA (ENTREGABLE ETAPA 1), ESTÁ TERMINANTEMENTE PROHIBIDO PICAR CÓDIGO FUENTE O INICIAR LA IMPLEMENTACIÓN (ENTREGABLE ETAPA 2).**

- Ante cualquier pedido de implementar código o redactar la Etapa 2, el agente auditará que `docs/entregables/entrega-XXX-etapa1.md` exista y esté cerrado.
- Si no existe o está incompleto, el agente **bloqueará la solicitud** y devolverá el control al humano para completar la planificación.

---

## 3. Contrato Sagrado de Encabezados (Contract-First)

- El humano crea el esqueleto en `docs/entregables/entrega-XXX-etapaY.md` con los encabezados oficiales (`#`, `##`, `###`), tablas vacías y preguntas de la rúbrica.
- **Prohibición dura para el agente:** El agente no puede agregar, renombrar ni eliminar ningún encabezado creado por el humano sin consulta previa y autorización explícita. Solo rellena el contenido *debajo* de los títulos existentes.

---

## 4. Flujo Operativo por Fases

### FASE 1: Planificación (Etapa 1 - Desarrollo Web Frontend)
1. `[HUMANO]` Transcribe PDF a `docs/enunciados/enunciado-XXX-etapa1.md`.
2. `[HUMANO]` Crea esqueleto en `docs/entregables/entrega-XXX-etapa1.md`.
3. `[HUMANO + AGENTE]` Diálogo iterativo: El agente aplica los 3 Filtros (concepto vs juguete, mapeo a landing de cocheras, confinamiento) y propone alternativas con fundamento técnico real de UI/UX. Se itera hasta la satisfacción del humano. Cero código en este paso.
4. `[HUMANO]` Autoriza la alternativa final.
5. `[AGENTE]` Rellena el entregable bajo los encabezados existentes.
6. `[AGENTE]` **Auditoría cruzada de integridad:** Lee `enunciado-XXX-etapa1.md` solo para verificar que no falte ningún punto de la rúbrica. Si detecta faltantes, avisa al humano en el chat para que decida. No modifica la planificación por su cuenta.
7. `[HUMANO]` Valida y cierra la Etapa 1.
8. `[AGENTE]` Pregunta el nombre del desarrollador y registra en `docs/CHANGELOG.md`.

### FASE 2: Implementación y Pruebas (Etapa 2 - Laboratorio)
1. `[HUMANO]` Transcribe PDF a `docs/enunciados/enunciado-XXX-etapa2.md`.
2. `[HUMANO]` Crea esqueleto en `docs/entregables/entrega-XXX-etapa2.md`.
3. `[AGENTE]` Define los archivos exactos a tocar en el proyecto (`src/...`) **basándose exclusivamente en lo pactado en `entrega-XXX-etapa1.md` (fuente de la verdad)**, ignorando nombres genéricos del enunciado.
4. `[HUMANO]` Autoriza la superficie de edición.
5. `[AGENTE]` Implementa el código (KISS, BEM, archivos < 300 líneas).
6. `[HUMANO + AGENTE]` Verifican en vivo (servidor local, consola limpia, pruebas en navegador).
7. `[AGENTE]` Rellena evidencias y respuestas técnicas en `docs/entregables/entrega-XXX-etapa2.md`.
8. `[HUMANO]` Valida la entrega final.
9. `[AGENTE]` Pregunta el nombre del desarrollador y anota en `docs/CHANGELOG.md`.

---

## 5. Estándares de Redacción para Entregables

- **Voz del equipo:** Redactar estrictamente en primera persona del plural (*"Como equipo decidimos..."*, *"Implementamos..."*, *"Optamos por..."*).
- **Tono documental sobrio:** Lenguaje técnico de ingeniería, explicativo y fundamentado.
- **Cero clichés de IA:** Prohibido el tono poético o dramático (*"En el vertiginoso mundo..."*, *"Es crucial destacar..."*).
- **Sintaxis limpia:** Conectores lógicos formales (*"Por consiguiente"*, *"Dado que"*, *"Sin embargo"*), oraciones directas sin encadenar párrafos con comas excesivas ni puntos innecesarios.
