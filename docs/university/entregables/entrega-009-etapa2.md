# GUÍA DE LABORATORIO

### _Laboratorio de Experiencias Web Inmersivas — Framer Motion_

Semana 9 | Proyecto integrador: Plataforma Web de Experiencias Interactivas — Quadrate pe

Producto articulador: Tarjeta de experiencia de cochera tipada con TypeScript y animada con Framer Motion.

---

## 1. Datos generales

| Elemento | Descripción |
| --- | --- |
| **Semana** | 9 |
| **Tema** | Animaciones de interfaz, microinteracciones y accesibilidad con Framer Motion (`motion`) |
| **Duración sugerida** | 2 a 3 horas |
| **Modalidad** | Laboratorio práctico sobre el proyecto integrador |
| **Requisitos previos** | MVP React de semana 8 y componente Card tipado preparado en Desarrollo Web (`tarjeta-cochera.tsx` y `experiencia-cochera.ts`) |
| **Entregable** | Card animada con entrada fluida, hover/tap, variants, viewport y microinteracción accesible de favoritos con soporte de movimiento reducido |
| **Equipo de desarrollo** | Grupo 04 · Sección 301 · Ciclo V |
| **Integrantes** | Pando Alanzo, Diego Iglesia (202310012)<br>Tapullima Herrera, Luciana del pilar (202310045)<br>Mendo Ruiz, Manuel (202310078)<br>Cueva Fabian, Eduardo (202310091)<br>Vilchez, José (202310103) |
| **Docente del laboratorio** | Ing. Roberto Sánchez Solís |

---

## 2. Propósito del laboratorio

Optimizar la experiencia de interacción de los conductores en la plataforma web **Quadrate pe** mediante la incorporación de animaciones intencionales, fluidas y ergonómicas. Las animaciones implementadas tienen el propósito específico de orientar la atención del usuario hacia la disponibilidad de espacios libres, confirmar acciones críticas (reserva y adición a favoritos) y proporcionar retroalimentación táctil inmediata, evitando sobrecargar la interfaz o comprometer la fluidez en dispositivos móviles.

---

## 3. Resultados de aprendizaje alcanzados

- Configuramos e integramos la arquitectura de animación reactiva basada en la API de Framer Motion (`motion`) dentro del ecosistema modular de Quadrate pe sin alterar la ligereza de la landing comercial.
- Aplicamos transiciones de entrada orquestada, microinteracciones de elevación al interactuar (`whileHover`) y compresión física de respuesta al clic o toque (`whileTap`).
- Estandarizamos los estados visuales del catálogo a través de variantes declarativas (`cardVariants`) y curvas de aceleración ergonómicas (`cubic-bezier(0.16, 1, 0.3, 1)`).
- Implementamos la carga progresiva de animaciones sincronizada con el desplazamiento vertical (`whileInView` con `viewport={{ once: true, amount: 0.2 }}`), garantizando que las tarjetas fuera de pantalla no consuman ciclos de renderizado.
- Auditamos la navegación por teclado (`Tab`, `Shift+Tab`, `Enter`, `Espacio`), visibilidad del anillo `:focus-visible` y adaptamos la interfaz mediante el hook `useReducedMotion()` para usuarios con sensibilidad al movimiento.

---

## 4. Escenario de trabajo en Quadrate pe

En la vista interactiva `Quadrate Live` (`#vista-live`), el catálogo presenta cocheras georreferenciadas en distritos de alta congestión de Lima. Sobre la base tipada de TypeScript desarrollada en la Etapa 1, incorporamos movimiento intencional:
1. Al renderizarse o filtrarse las cocheras por distrito, las tarjetas entran al viewport mediante un desplazamiento sutil en el eje vertical (`y: 16px ➔ 0px`) combinado con desvanecimiento de opacidad (`0 ➔ 1`).
2. Al posar el cursor, la tarjeta se eleva discretamente (`y: -4px`) con sombra controlada, indicando capacidad de interactividad.
3. El botón de reserva y el conmutador de favoritos responden con compresión elástica (`scale: 0.96`), otorgando confirmación física sin latencia perceptual.
4. Todo el comportamiento mantiene contraste WCAG 2.1 AA y cero desbordamientos en resoluciones de 360px a 1440px.

---

## 5. Preparación e integración arquitectónica

1. **Estrategia de compatibilidad:** Para respetar la regla innegociable de cero librerías sobredimensionadas en el bundle del navegador, construimos el módulo `src/js/react/motion.js`, el cual expone la API oficial de Motion (`motion.article`, `motion.button`, etc.) y el hook `useReducedMotion()`.
2. **Preservación del pipeline:** Mantenemos la compilación modular mediante `scripts/compilar-react.cjs`, asegurando que `tarjeta-cochera.jsx` (y su especificación TypeScript en `tarjeta-cochera.tsx`) se transpilen a módulos ES6 nativos sin requerir bundlers pesados de desarrollo.

---

## 6. Experimento 1: Animación de entrada

Reemplazamos el nodo semántico `<article>` por `motion.article`, configurando los estados de aparición:

```tsx
<motion.article
  initial={{ opacity: 0, y: 16 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.35, ease: "easeOut" }}
  className="quadrate-live__card"
>
  {/* Estructura editorial de la tarjeta */}
</motion.article>
```

*Observación del equipo:* La transición suave de 350ms permite al ojo humano reconocer la actualización del catálogo sin percibir parpadeos ni demoras artificiales para interactuar.

---

## 7. Experimento 2: Hover y Tap (Microinteracciones)

Configuramos retroalimentación física para el cursor y para dispositivos táctiles:

```tsx
<motion.article
  whileHover={reduceMotion ? undefined : { y: -4, scale: 1.01 }}
  className="quadrate-live__card"
>
  {/* Contenido */}
  <motion.button
    type="button"
    whileTap={reduceMotion ? undefined : { scale: 0.96 }}
    onClick={manejarSeleccion}
    className="quadrate-live__card-btn"
  >
    Ver y Reservar
  </motion.button>
</motion.article>
```

*Decisión de accesibilidad del equipo:* No restringimos la señal únicamente al hover. En móviles táctiles, donde no existe puntero hover, el estado `whileTap` proporciona la confirmación háptica/visual inmediata.

---

## 8. Experimento 3: Variants reutilizables

Centralizamos los estados de animación en una constante inmutable `cardVariants`:

```javascript
const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" }
  }
};
```

Uso en el componente:

```tsx
<motion.article
  variants={cardVariants}
  initial="hidden"
  animate="visible"
  whileHover={reduceMotion ? undefined : { y: -4, scale: 1.01 }}
>
  {/* Contenido */}
</motion.article>
```

---

## 9. Experimento 4: Animación al entrar en pantalla (Viewport)

Para evitar la ejecución simultánea de animaciones en elementos fuera del ángulo de visión, enlazamos `whileInView` respaldado por `IntersectionObserver`:

```tsx
<motion.article
  variants={cardVariants}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.2 }}
>
  {/* Contenido de la cochera */}
</motion.article>
```

*Resultado:* La animación solo se dispara una vez (`once: true`) cuando al menos el 20% de la tarjeta entra en el viewport visible, ahorrando ciclos de CPU y batería en dispositivos móviles.

---

## 10. Experimento 5: Arrastre (Drag) y justificación de descarte

En concordancia con las indicaciones del enunciado (*"El arrastre es opcional en el reto final. Si no aporta valor real al usuario, documenta por qué decidiste no incorporarlo"*), **como equipo evaluamos y descartamos formalmente el arrastre (drag) en las tarjetas principales del catálogo**.

*Justificación técnica y ergonómica:*
1. **Conflicto severo con el scroll vertical en móviles:** Permitir arrastre (`drag`) en tarjetas que ocupan el ancho de una pantalla táctil (360px–414px) intercepta los gestos de desplazamiento nativo del navegador, atrapando el dedo del conductor e impidiendo continuar navegando por la landing.
2. **Ausencia de sentido de negocio en la interacción:** En una plataforma de estacionamientos, el usuario requiere pulsar para consultar aforo y reservar por ETA, no mover físicamente las cocheras por la pantalla. Introducir arrastre en este componente degradaría la usabilidad sin aportar ninguna ventaja funcional.

---

## 11. Accesibilidad y movimiento reducido (WCAG 2.1 Criterio 2.3.3)

Implementamos el hook `useReducedMotion()` en `src/js/react/motion.js`:

```javascript
export function useReducedMotion() {
  const [reduceMotion, setReduceMotion] = React.useState(() => {
    return typeof window !== "undefined" && window.matchMedia
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;
  });

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const listener = (e) => setReduceMotion(e.matches);
    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, []);

  return reduceMotion;
}
```

Cuando el usuario activa la opción de accesibilidad en su sistema operativo:
- Los desplazamientos en `y` y las transformaciones de escala se anulan por completo (`transform: none`).
- Las transiciones se reducen a una atenuación de opacidad mínima e instantánea (100ms), previniendo síntomas vestibulares o cinetosis en usuarios vulnerables.
- Todos los controles conservan su navegación por teclado (`Tab`, `Enter`, `Espacio`) y foco visible `:focus-visible` terracota de alto contraste.

---

## 12. Reto integrador

Integramos la tarjeta tipada de Desarrollo Web (`tarjeta-cochera.tsx`) con el motor de animaciones, logrando:
1. Animación suave en viewport mediante `variants`.
2. Microinteracción de elevación hover y tap activo en el botón de reserva y en el selector de favorito.
3. Fallback fotográfico verificado: cuando no hay `imageUrl`, se muestra la insignia editorial de sede verificada sin saltos de maquetación ni parpadeos.
4. Conmutación accesible de favoritos con actualización inmediata de `aria-pressed` y feedback visual en color terracota institucional.

---

## 13. Protocolo de pruebas y matriz de aceptación

| Prueba | Procedimiento | Criterio de aceptación | Cumple |
| --- | --- | --- | :---: |
| **Entrada** | Recargar la vista o conmutar filtros de distrito. | La tarjeta aparece suavemente con desvanecimiento sin retrasar la navegación. | **[X]** |
| **Hover** | Pasar el cursor sobre el contenedor de la tarjeta. | Elevación discreta de 4px (`y: -4`) sin temblores ni saltos de diseño. | **[X]** |
| **Tap** | Pulsar el botón principal "Ver y Reservar" o "Guardar favorita". | Retroalimentación elástica instantánea (`scale: 0.96`); la acción dispara el modal o el estado. | **[X]** |
| **Viewport** | Desplazarse verticalmente por la lista de cocheras. | La animación se activa al 20% de visibilidad y no se repite molestamente al volver a subir (`once: true`). | **[X]** |
| **Teclado** | Navegar con `Tab` / `Shift+Tab` y activar con `Enter` / `Espacio`. | Foco visible destacado y activación funcional completa sin ratón. | **[X]** |
| **Movimiento reducido** | Simular `@media (prefers-reduced-motion: reduce)` en Chrome DevTools. | Se anula el movimiento físico (`transform`); la información se presenta estática y clara. | **[X]** |
| **Responsive** | Probar en viewport móvil (360px), tablet (768px) y desktop (1280px). | Cero desbordamiento horizontal, márgenes fluidos y scroll táctil libre. | **[X]** |
| **Integración** | Operar con datos reales tipados del catálogo de Lima. | El contrato tipado de TypeScript se mantiene 100% íntegro en tiempo de ejecución. | **[X]** |

---

## 14. Evidencias del laboratorio y reflexión técnica

### Reflexión del equipo sobre microinteracciones (210 palabras)

Como equipo de desarrollo, corroboramos que la microinteracción de mayor valor introducida es la **respuesta táctil con cambio de estado en el botón de favoritos (`btn-favorito`)**. Al pulsar la estrella, la escala se comprime ligeramente (`scale: 0.92`) y transiciona en 150 milisegundos hacia un estado relleno con borde terracota, acompañado de la actualización del atributo accesible `aria-pressed="true"`. Esta respuesta entrega certeza inmediata al conductor de que su preferencia fue registrada sin necesidad de mostrar alertas intrusivas que bloqueen la navegación comercial.

Por el contrario, **el efecto que descartamos explícitamente fue la animación continua o cíclica de pulso (`pulse`) en las insignias de aforo crítico**. Si bien en un inicio se consideró hacer que la etiqueta *"¡Últimos cupos!"* parpadeara indefinidamente para llamar la atención, las pruebas de usabilidad revelaron que este movimiento continuo genera agotamiento cognitivo, distrae la lectura de tarifas y viola las directrices de accesibilidad cognitiva WCAG. Mantener la insignia fija con alto contraste de color (`#B91C1C`) y comunicar la escasez de plazas mediante datos numéricos precisos demostró ser una solución técnica mucho más sobria, elegante y respetuosa con el usuario.

---

## 15. Preguntas de análisis técnico

### 1. ¿Qué intención de usuario comunica la animación de entrada?
*Respuesta del equipo:*
La animación de entrada comunica que la interfaz ha procesado la consulta de sincronización y que los datos presentados son frescos y relevantes. En un localizador de estacionamientos donde el aforo varía constantemente, una entrada sutil ayuda al ojo humano a registrar que la lista se ha filtrado o reordenado con éxito, eliminando la sensación de interfaz estática o congelada.

### 2. ¿Qué diferencia hay entre una animación decorativa y una microinteracción útil?
*Respuesta del equipo:*
- Una **animación decorativa** carece de vínculo con la tarea del usuario; suele ser pasiva, continua o desmesurada (ej. logotipos giratorios, fondos ondulantes), aumentando el consumo de recursos sin mejorar la usabilidad.
- Una **microinteracción útil** está directamente vinculada a una acción del usuario y persigue un propósito informativo o de confirmación: indica que un botón fue presionado, que un elemento es accionable, o que un proceso asíncrono concluyó, reduciendo la incertidumbre operativa.

### 3. ¿Por qué hover no es suficiente para dispositivos táctiles?
*Respuesta del equipo:*
Porque en las pantallas táctiles (smartphones y tablets) no existe el concepto de cursor flotante ni eventos continuos de `pointermove` sin contacto. Si un desarrollador confía únicamente en `:hover` para mostrar información o dar feedback, los usuarios móviles tendrán que pulsar dos veces o sufrirán comportamientos anómalos de "foco pegajoso". Por ello, es mandatorio diseñar estados `whileTap` y mantener el contenido visible de forma permanente.

### 4. ¿Qué problemas puede generar animar demasiados elementos al desplazarse?
*Respuesta del equipo:*
Animar múltiples nodos durante el scroll genera:
1. **Caídas severas de tasa de refresco (*jank* o tartamudeo):** Fuerza al motor del navegador a recalcular capas y composiciones (`paint` y `composite`) en pleno desplazamiento vertical, degradando la experiencia a menos de 30 FPS.
2. **Sobrecarga cognitiva:** Un catálogo donde cada tarjeta entra desde diferentes ángulos genera distracción y fatiga visual.
3. **Retraso en la interacción:** Si el usuario desea pulsar una cochera que está en pleno vuelo de animación, corre el riesgo de errar el toque.

### 5. ¿Cómo se relaciona una Card tipada con una Card animada dentro del proyecto compartido?
*Respuesta del equipo:*
La **Card tipada** (Desarrollo Web) define la *estructura, el contrato semántico y la lógica de negocio* (qué propiedades existen, qué tipos admiten y cómo se comunican con el componente padre). La **Card animada** (Laboratorio Inmersivo) actúa como una *capa de presentación sensorial* que envuelve dicha estructura mediante componentes `motion`. Esta relación modular garantiza que el comportamiento visual pueda evolucionar, ajustarse o silenciarse (según preferencias de accesibilidad) sin alterar ni una sola línea del contrato de datos de TypeScript ni vulnerar la estabilidad de la plataforma.

---

## 16. Cierre

La culminación de la Semana 9 consolida la evolución del catálogo de **Quadrate pe**: una arquitectura tipada y robusta gracias a TypeScript en React, combinada con microinteracciones sobrias y accesibles mediante Framer Motion. El producto preserva la identidad editorial de alta conversión, respeta estrictamente los estándares de accesibilidad universal y mantiene la integridad del código fuente sin sobreingeniería.

