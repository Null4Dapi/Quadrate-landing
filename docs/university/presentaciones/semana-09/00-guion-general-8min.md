# Guion Maestro de Exposición (8 Minutos) — Semana 9
### *TypeScript en React y Microinteracciones Inmersivas con Framer Motion*
**Proyecto:** Quadrate pe — Landing Page y Vista Interactiva de Cocheras en Lima  
**Duración Total:** 8 minutos cronometrados (Exactos)  
**Integrantes:** Luciana (1) · Diego (2) · Vílchez (3) · Cueva (4) · Víctor (5)  
**Modalidad de Presentación:** Directo al código, sin introducciones vacías, técnico y de alto impacto.

---

## Matriz de Tiempos y Roles

| # | Integrante | Minuto | Duración | Rol / Tema Técnico | Archivo o Vista a Proyectar |
| :-: | :--- | :-: | :-: | :--- | :--- |
| **1** | **Luciana** | 0:00 – 1:30 | 1m 30s | **Modelo de Dominio y Tipos Estrictos** (Etapa 1) | `src/types/experiencia-cochera.ts` |
| **2** | **Diego** | 1:30 – 3:05 | 1m 35s | **Componente React Tipado, Props y Estado** (Etapa 1) | `src/js/react/tarjeta-cochera.tsx` |
| **3** | **Vílchez** | 3:05 – 4:40 | 1m 35s | **Integración de Motion, Entrada y Variants** (Etapa 2) | Bloque `motion.article` + `cardVariants` |
| **4** | **Cueva** | 4:40 – 6:20 | 1m 40s | **Microinteracciones, Viewport y Descarte de Drag** (Etapa 2) | Atributos `whileHover`, `whileTap`, `whileInView` |
| **5** | **Víctor** | 6:20 – 8:00 | 1m 40s | **Accesibilidad, Reduced Motion y Cierre** (Etapa 2) | Hook `useReducedMotion()` + Demo DevTools |

---

## Guion Continuo con Acotaciones Escénicas

### [0:00 – 1:30] Bloque 1: Luciana — Arquitectura de Tipos y Contratos de Datos
> **[En pantalla: Abrir `src/types/experiencia-cochera.ts` en el editor]**

**Luciana:**  
"Buenos días profesor. En Quadrate pe gestionamos disponibilidad de estacionamientos en distritos de alta congestión de Lima. En la versión previa en JavaScript puro detectamos dos riesgos críticos de runtime: recibir tarifas numéricas como strings rompiendo cálculos de fracciones horarias, o asignar estados de aforo con erratas ortográficas que dejaban filtros en blanco.

Para erradicar esto implementamos la arquitectura de tipos en `experiencia-cochera.ts`.  
Observen las líneas 1 y 2: en lugar de usar `string` genérico, declaramos `DistritoLima` y `EstadoAforo` como **Union Types literales**: solo admitimos `'disponible'`, `'medio'` o `'critico'`. Si un desarrollador escribe `'disponble'` con error ortográfico, TypeScript detiene la compilación al instante.

En la línea 5 definimos la interfaz `ExperienciaCochera`. Modelamos de forma inmutable tarifas por hora y por fracción de 15 minutos como tipo `number` obligatorio. Noten además el atributo `imageUrl?: string`: está tipado como opcional con el operador de interrogación. Esto nos obliga arquitectónicamente a prever un fallback visual cuando la sede no dispone de fotografía, evitando excepciones de tipo `Cannot read properties of undefined`.

Con este contrato cerramos la fase de datos puros. Le doy el pase a Diego para ver cómo consumimos esta interfaz en el componente React."

---

### [1:30 – 3:05] Bloque 2: Diego — Componente React Tipado, Props y Estado
> **[En pantalla: Cambiar a `src/js/react/tarjeta-cochera.tsx`, resaltar `TarjetaCocheraProps` y el estado]**

**Diego:**  
"Gracias Luciana. En el componente `tarjeta-cochera.tsx`, el primer paso fue erradicar cualquier uso de `any` para no perforar el sistema de tipos.

Definimos `TarjetaCocheraProps` importando la interfaz `ExperienciaCochera`. Exigimos la prop `cochera`, el booleano opcional `estaSeleccionada` y la función de callback `onSeleccionarCochera`, tipada explícitamente para recibir un objeto de tipo `ExperienciaCochera` y retornar `void`. Al desestructurar las props en la función, TypeScript infiere automáticamente cada propiedad interna con autocompletado nativo.

En la línea 20 tipamos el estado interactivo de favoritos mediante el genérico `useState<boolean>(false)`. Para el manejador `conmutarFavorito`, tipamos el parámetro como `React.MouseEvent<HTMLButtonElement>`. Esto nos permite invocar `evento.stopPropagation()` de forma totalmente segura, impidiendo que al marcar una cochera como favorita se dispare accidentalmente el clic de selección de toda la tarjeta.

Finalmente, en el catálogo padre la colección se tipa como `ExperienciaCochera[]`. Métodos como `.filter()` o `.map()` quedan blindados contra accesos a propiedades inexistentes.

Ahora mi compañero Vílchez explicará cómo articulamos esta base tipada con Framer Motion en el laboratorio."

---

### [3:05 – 4:40] Bloque 3: Vílchez — Articulación con Motion, Entrada y Variants
> **[En pantalla: Resaltar la importación de `motion` y la constante `cardVariants` en el código]**

**Vílchez:**  
"Gracias Diego. En la Etapa 2 de laboratorio, el desafío fue incorporar movimiento inmersivo sin romper el contrato tipado ni violar nuestra regla innegociable de mantener una landing liviana.

Para lograrlo, reemplazamos el elemento semántico `<article>` por `<motion.article>` de la API de Motion. No modificamos una sola prop de las que explicó Diego; la animación actúa exclusivamente como una capa visual envolvente.

Para evitar animaciones desordenadas o repetitivas, implementamos el patrón declarativo de **Variants** en la constante `cardVariants`. Definimos dos estados puros:
1. `hidden`: opacidad 0 con un desplazamiento inicial en el eje Y de 16 píxeles hacia abajo.
2. `visible`: opacidad 1 y posición neutra en Y de 0 píxeles.

En la transición aplicamos una duración exacta de 350 milisegundos con curva de desaceleración `easeOut`. Esto garantiza una entrada limpia y fluida al recargar o filtrar distritos en Lima, permitiendo que el conductor perciba la actualización de cocheras sin saltos bruscos ni demoras artificiales para interactuar.

Paso con mi compañero Cueva para revisar las microinteracciones táctiles y la optimización de viewport."

---

### [4:40 – 6:20] Bloque 4: Cueva — Microinteracciones, Viewport y Descarte de Drag
> **[En pantalla: Mostrar las props `whileHover`, `whileTap` y `whileInView` en el editor]**

**Cueva:**  
"Gracias Vílchez. En interfaces para conductores, la retroalimentación inmediata es indispensable.

Diseñamos dos respuestas físicas diferenciadas:
1. En desktop, `whileHover` eleva sutilmente la tarjeta 4 píxeles (`y: -4`) con escala de 1.01 para denotar que el contenedor es clickeable.
2. En móviles, como no existe hover táctil, implementamos `whileTap` con `scale: 0.96` tanto en el botón 'Ver y Reservar' como en la estrella de favoritos. Esta compresión elástica simula un botón físico real y le da certeza al usuario de que su toque fue registrado.

Para el rendimiento, miren el atributo `whileInView`. Enlazamos `viewport={{ once: true, amount: 0.2 }}`. La tarjeta solo anima su entrada cuando al menos el 20% entra al campo de visión del usuario y se ejecuta una sola vez (`once: true`). Así evitamos caídas de fotogramas por recálculos innecesarios en tarjetas fuera de pantalla.

Un punto clave de nuestra rúbrica: **evaluamos y descartamos técnicamente el arrastre (Drag)**. En una pantalla móvil de 375 píxeles, permitir arrastrar tarjetas colisiona directamente con el gesto natural de scroll vertical, atrapando el dedo del usuario. Además, en una app de cocheras el objetivo es consultar aforo y reservar, no desplazar cajas por la pantalla.

Le doy el pase a Víctor para ver la accesibilidad universal y las conclusiones."

---

### [6:20 – 8:00] Bloque 5: Víctor — Accesibilidad (Reduced Motion), Pruebas y Cierre
> **[En pantalla: Mostrar hook `useReducedMotion()`, simular en DevTools `prefers-reduced-motion` y foco por teclado]**

**Víctor:**  
"Gracias Cueva. Culminamos con el aspecto más crítico de la arquitectura: la accesibilidad bajo el criterio WCAG 2.1 Criterio 2.3.3.

Creamos el hook modular `useReducedMotion()`. Escucha la directiva `@media (prefers-reduced-motion: reduce)` del sistema operativo. Si un usuario con sensibilidad vestibular o mareos por movimiento tiene activa esta preferencia, nuestro código desactiva instantáneamente los desplazamientos en Y y las escalas, reduciendo la animación a una atenuación estática de opacidad de 100 milisegundos.

*(Demostración rápida en pantalla de 5 segundos con el inspector de DevTools simulando reduced motion).*

Asimismo, blindamos la accesibilidad motriz: la tarjeta se navega 100% con teclado mediante `tabIndex={0}`, escucha eventos `Enter` y `Espacio`, proyecta un anillo `:focus-visible` de alto contraste en color terracota y actualiza dinámicamente el atributo `aria-pressed` en el botón de favoritos.

**Conclusión del equipo:**  
Logramos articular TypeScript como garante del contrato de datos de negocio y Framer Motion como experiencia inmersiva ergonómica, sin sobrecargar el navegador y cumpliendo al 100% las matrices de prueba de ambas etapas.

Quedamos listos para sus preguntas, profesor."

---
*Fin del Guion Maestro (Tiempo exacto: 8 minutos).*
