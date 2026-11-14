# Guía de Trabajo

#### _Desarrollo Web Full Stack Frontend — TypeScript en React_

Semana 9 | Proyecto integrador: Plataforma Web de Experiencias Interactivas — Quadrate pe

Producto articulador: Tarjeta de experiencia tipada con TypeScript y preparada para interacción inmersiva.

---

## 1. Datos generales

| Elemento | Descripción |
| --- | --- |
| **Semana** | 9 |
| **Tema** | TypeScript en React: interfaces, props, estado, colecciones y contratos de datos |
| **Modalidad** | Trabajo práctico en equipo |
| **Duración sugerida** | 2 a 3 horas |
| **Requisitos previos** | Aplicación React de la semana 8 (MVP Parcial), componentes modulares, props, useState y estructura base de Quadrate pe |
| **Entregable** | Componentes principales migrados a TypeScript y Card de experiencia de cochera tipada |
| **Equipo de desarrollo** | Grupo 04 · Sección 301 · Ciclo V |
| **Integrantes** | Pando Alanzo, Diego Iglesia (202310012)<br>Tapullima Herrera, Luciana del pilar (202310045)<br>Mendo Ruiz, Manuel (202310078)<br>Cueva Fabian, Eduardo (202310091)<br>Vilchez, José (202310103) |
| **Docente principal** | Mag. Ing. Juan Carlos Ramos |

---

## 2. Situación problemática

En la plataforma de **Quadrate pe**, la vista interactiva `Quadrate Live` gestiona un catálogo dinámico de estacionamientos en distritos neurálgicos de Lima Metropolitana (San Isidro, Miraflores, Surco, San Borja). Durante las fases previas desarrolladas únicamente en JavaScript, identificamos riesgos arquitectónicos críticos:
1. Una tarjeta de cochera podía recibir valores de calificación o tarifas como cadenas de texto (`"8.00"`) en lugar de números (`8.0`), rompiendo operaciones de ordenamiento o cálculo de fracciones horarias.
2. Campos indispensables como el identificador único (`id`) o las plazas disponibles podían ser omitidos inadvertidamente en componentes hijos.
3. El estado de aforo admitía cualquier cadena arbitraria en lugar de restringirse a los tres estados operativos del negocio (`disponible`, `medio`, `critico`).

Como equipo, requerimos establecer contratos de datos formales, inmutables y predecibles mediante TypeScript para erradicar errores en tiempo de compilación y optimizar la mantenibilidad a largo plazo del código.

---

## 3. Resultado de aprendizaje

Al concluir esta etapa, como equipo definimos tipos e interfaces estrictas para los modelos de datos y las props de React, aplicamos tipado estricto a estados interactivos (`useState<boolean>`) y funciones de callback, y migramos progresivamente el componente de tarjeta de cochera (`tarjeta-cochera.tsx`) a TypeScript, fundamentando de forma técnica la eliminación de defectos y la solidez estructural del producto.

---

## 4. Conceptos clave aplicados

| Concepto | Uso en Quadrate pe | Implementación en el proyecto |
| --- | --- | --- |
| **Type** | Modela uniones discriminadas y alias de dominios cerrados. | `type DistritoLima = "San Isidro" \| "Miraflores" \| "Surco" \| "San Borja";`<br>`type EstadoAforo = "disponible" \| "medio" \| "critico";` |
| **Interface** | Define la estructura obligatoria y extensible del modelo de datos de una cochera. | `interface ExperienciaCochera { id: string; nombre: string; tarifaHora: number; ... }` |
| **Props** | Contrato estricto entre el catálogo padre (`QuadrateLiveApp`) y la tarjeta hija. | `interface TarjetaCocheraProps { cochera: ExperienciaCochera; estaSeleccionada?: boolean; onSeleccionarCochera: (c: ExperienciaCochera) => void; }` |
| **Estado** | Tipado explícito de variables reactivas que cambian con la interacción. | `const [esFavorita, setEsFavorita] = useState<boolean>(false);` |
| **Tipo opcional** | Atributos que no siempre están presentes en todas las sedes del catálogo. | `imageUrl?: string;` (permite renderizar fallback visual cuando no hay fotografía). |
| **Colección** | Arreglo fuertemente tipado de experiencias. | `const cocheras: ExperienciaCochera[] = DATOS_COCHERAS_INICIALES;` |

---

## 5. Preparación del entorno y arquitectura técnica

1. **Estado base comprobado:** Validamos que la aplicación base de Semana 8 ejecute sin anomalías mediante `npm start` en el puerto local asignado.
2. **Estrategia de adopción gradual:** Siguiendo la regla de oro de TypeScript y el principio KISS de nuestro repositorio, no forzamos una reescritura masiva de un solo golpe. Iniciamos declarando el módulo de tipos en `src/types/experiencia-cochera.ts` y migramos de forma quirúrgica el componente nuclear de presentación (`tarjeta-cochera.tsx`).
3. **Compatibilidad con el compilador modular:** Preservamos el pipeline modular de compilación del proyecto (`scripts/compilar-react.cjs`), asegurando que la transpilación de sintaxis TypeScript/JSX produzca módulos ECMAScript puros ejecutables de forma nativa por el navegador sin añadir bundlers pesados que violen los límites de dependencias.

---

## 6. Actividades desarrolladas

### Actividad 1. Definición del modelo de datos (`src/types/experiencia-cochera.ts`)

Diseñamos el contrato de datos formal para las cocheras asociadas a la plataforma, contemplando reglas del negocio limeño:

```typescript
export type DistritoLima = "San Isidro" | "Miraflores" | "Surco" | "San Borja" | "Todos";
export type EstadoAforo = "disponible" | "medio" | "critico";

export interface ExperienciaCochera {
  id: string;
  nombre: string;
  distrito: DistritoLima;
  direccion: string;
  tarifaHora: number;
  tarifaFraccion: number;
  plazasTotales: number;
  plazasDisponibles: number;
  tiempoEstimadoLlegadaMinutos: number;
  calificacion: number;
  distanciaKm: number;
  estadoAforo: EstadoAforo;
  imageUrl?: string;
}
```

*Decisión técnica del equipo:* Restringimos `estadoAforo` y `distrito` mediante tipos literales de unión (`Union Types`) en lugar de `string` genérico, previniendo incoherencias tipográficas en filtros y etiquetas.

---

### Actividad 2. Tipado de las props de la tarjeta (`tarjeta-cochera.tsx`)

Convertimos el componente funcional a TypeScript definiendo `TarjetaCocheraProps`. Incluimos gestión de fallback de imagen para garantizar resiliencia en caso de ausencia de recurso gráfico:

```typescript
import React, { useState } from "react";
import type { ExperienciaCochera } from "../../types/experiencia-cochera";

export interface TarjetaCocheraProps {
  cochera: ExperienciaCochera;
  estaSeleccionada?: boolean;
  onSeleccionarCochera: (cochera: ExperienciaCochera) => void;
}
```

Si `cochera.imageUrl` no está definido, renderizamos un marcador visual editorial sobrio con el logotipo de Quadrate pe y el nombre del distrito, evitando imágenes rotas o vacíos antiestéticos en la grilla.

---

### Actividad 3. Tipado de estado y eventos interactivos

Incorporamos el estado interactivo de cochera favorita mediante tipado genérico explícito en `useState`:

```typescript
const [esFavorita, setEsFavorita] = useState<boolean>(false);

const conmutarFavorito = (evento: React.MouseEvent<HTMLButtonElement>) => {
  evento.stopPropagation();
  setEsFavorita((estadoPrevio) => !estadoPrevio);
};
```

Renderizado accesible del control:

```tsx
<button
  type="button"
  className={`quadrate-live__btn-favorito ${esFavorita ? "quadrate-live__btn-favorito--activo" : ""}`}
  aria-pressed={esFavorita}
  aria-label={esFavorita ? `Quitar ${cochera.nombre} de favoritos` : `Guardar ${cochera.nombre} en favoritos`}
  onClick={conmutarFavorito}
>
  <span aria-hidden="true">{esFavorita ? "★" : "☆"}</span>
  <span class="quadrate-live__btn-favorito-texto">
    {esFavorita ? "Guardada" : "Guardar favorita"}
  </span>
</button>
```

---

### Actividad 4. Tipado de colecciones en el catálogo

En `quadrate-live-app.jsx` y `datos-cocheras.js`, tipamos la lista como `ExperienciaCochera[]`. Esto garantiza que la iteración mediante `.map()` exponga propiedades autocompletadas y seguras:

```typescript
const cocherasVisibles: ExperienciaCochera[] = cocheras.filter((item: ExperienciaCochera) => {
  // Filtrado validado por compilador
  return item.plazasDisponibles >= 0;
});

// En el renderizado:
{cocherasVisibles.map((cochera: ExperienciaCochera) => (
  <TarjetaCochera
    key={cochera.id}
    cochera={cochera}
    estaSeleccionada={cocheraSeleccionada?.id === cochera.id}
    onSeleccionarCochera={(elegida: ExperienciaCochera) => setCocheraSeleccionada(elegida)}
  />
))}
```

---

### Actividad 5. Migración progresiva de componentes

1. Creamos `src/types/experiencia-cochera.ts`.
2. Migramos `src/js/react/tarjeta-cochera.jsx` a `src/js/react/tarjeta-cochera.tsx`.
3. Verificamos la estricta ausencia de tipos `any`.
4. Comprobamos que el recuento de líneas del componente migrado se mantenga estrictamente por debajo de las 160 líneas (muy inferior al límite máximo de 300 líneas de nuestro repositorio).

---

## 7. Reto de aplicación

La tarjeta `TarjetaCochera` cumple con:
- Capacidad de instanciarse con cualquiera de las cocheras del catálogo (San Isidro Begonias, Miraflores Larco, Surco Polo Hunt, etc.).
- Acepta la función opcional/obligatoria `onSeleccionarCochera` para transferir la selección al simulador de reserva.
- Manejo elegante de campos opcionales (`imageUrl` alternando entre imagen webp y banner vectorial tipográfico de fallback).

---

## 8. Pruebas y criterios de aceptación

| Prueba | Resultado esperado | Cumple |
| --- | --- | :---: |
| **Compilación** | El proyecto compila sin errores de sintaxis TypeScript ni tipos incompatibles. | **[X]** |
| **Datos** | Los objetos del catálogo respetan fielmente la interfaz `ExperienciaCochera`. | **[X]** |
| **Props** | La tarjeta recibe props tipadas y reutilizables validadas en tiempo de diseño. | **[X]** |
| **Estado** | El control de favorito cambia su estado booleano y atributos de accesibilidad al pulsarse. | **[X]** |
| **Campos opcionales** | La tarjeta renderiza el contenedor alternativo cuando `imageUrl` está ausente. | **[X]** |
| **Regresión** | Toda la interactividad previa (selección, ETA, simulador de reserva) se preserva intacta. | **[X]** |
| **Código limpio** | Cero uso de `any`, cero tipos duplicados y archivo menor a 300 líneas. | **[X]** |

---

## 9. Evidencias del entregable

### Comentario técnico de análisis de errores y limitaciones (198 palabras)

Como equipo de desarrollo, corroboramos que la adopción de TypeScript en React aporta beneficios inmediatos en la prevención de fallas antes de llegar a producción:

En primer lugar, **previene inconsistencias de tipo en datos numéricos de cálculo**. En nuestro simulador de tarifas, un desarrollador podría recibir accidentalmente la tarifa por fracción o la calificación como una cadena de texto proveniente de una carga HTTP (`"2.00"` en lugar de `2.00`). En JavaScript esto provocaría concatenaciones erróneas (`"2.00" + 1.50 = "2.001.50"`). TypeScript bloquea este fallo en tiempo de compilación exigiendo estrictamente el tipo `number`.

En segundo lugar, **evita excepciones de acceso a propiedades indefinidas (`null pointer`)**. Al marcar `imageUrl?: string` como opcional, el compilador obliga a verificar su existencia antes de manipularla (`cochera.imageUrl && ...`), impidiendo que el navegador arroje `TypeError: Cannot read properties of undefined`.

No obstante, **reconocemos una limitación fundamental:** TypeScript efectúa validaciones exclusivamente estáticas en tiempo de compilación; desaparece por completo en tiempo de ejecución. Si una API externa devuelve un objeto con campos incompletos o tipos adulterados en runtime, TypeScript no puede impedirlo por sí solo, requiriendo esquemas de validación de esquemas (como Zod) y pruebas funcionales de integración.

---

## 10. Preguntas de reflexión

### 1. ¿Qué error concreto podría detectarse antes de ejecutar gracias a la interfaz `ExperienciaCochera`?
*Respuesta del equipo:*
Un error concreto es la asignación de un estado de aforo inválido o mal escrito. Si un programador escribe `estadoAforo: "disponble"` (con falta ortográfica) o `estadoAforo: "lleno"` (estado inexistente en la lógica de negocio), TypeScript arroja inmediatamente el error:
`Type '"disponble"' is not assignable to type 'EstadoAforo'`.
En JavaScript tradicional, este error pasaría inadvertido hasta que el usuario final reportase que las insignias de color no se pintan en la interfaz o que los filtros de disponibilidad arrojan listas vacías.

### 2. ¿Cuándo conviene usar `interface` y cuándo un `type alias`?
*Respuesta del equipo:*
Como regla arquitectónica adoptada por el equipo:
- Usamos **`interface`** para definir la forma de los objetos y modelos de datos principales del dominio (`ExperienciaCochera`) y los contratos de props de componentes (`TarjetaCocheraProps`), debido a su claridad semántica, mejor rendimiento en el motor de inferencia de TypeScript y su capacidad natural de extensión (`extends`).
- Usamos **`type alias`** para definir uniones discriminadas (`type EstadoAforo = "disponible" | "medio" | "critico"`), alias primitivos compuestos, tuplas o funciones de callback complejas, donde la capacidad declarativa de unión (`|`) o intersección (`&`) es insustituible por una interfaz.

### 3. ¿Por qué es riesgoso usar `any` para resolver rápidamente un error?
*Respuesta del equipo:*
El uso de `any` desactiva intencionalmente el sistema de comprobación de tipos de TypeScript en la variable o expresión afectada, operando como un "agujero negro" que contagia al resto del código circundante. Al utilizar `any`:
1. Se pierde el autocompletado inteligente y la documentación viva del código.
2. Se ocultan errores graves de renombramiento en refactorizaciones.
3. Se genera una falsa sensación de seguridad técnica, trasladando fallas de tipado directo a fallos críticos en producción que terminarán congelando la interfaz del cliente final.

### 4. ¿Qué aspectos del componente no pueden validarse únicamente con TypeScript?
*Respuesta del equipo:*
TypeScript valida únicamente la coherencia estructural y los tipos de datos, pero no puede auditar:
1. **Accesibilidad visual y auditiva:** No puede determinar si el contraste de color cumple WCAG 2.1 AA (4.5:1) ni si el `aria-label` redactado tiene sentido comprensible para un usuario de lector de pantallas.
2. **Diseño responsivo:** No verifica si la tarjeta se desborda en pantallas móviles de 360px o si los elementos interactivos cumplen el tamaño táctil mínimo de 44x44px.
3. **Comportamiento dinámico en ejecución:** No valida si la animación es excesiva o fluida, ni la veracidad de los datos devueltos por servicios de red en tiempo real.

### 5. ¿Cómo se coordinará este componente con la animación que se realizará en el laboratorio inmersivo?
*Respuesta del equipo:*
El componente tipado `TarjetaCochera` funciona como el **contrato inmutable de datos y estructura**. En la Etapa 2 (Laboratorio de Experiencias Web Inmersivas):
- Envolveremos el contenedor semántico `<article>` con `motion.article` de Framer Motion (`motion/react`).
- Conectaremos las animaciones (`whileHover`, `whileTap`, `whileInView`) utilizando los estados del componente sin modificar en ningún momento los nombres de props ni los campos de la interfaz `ExperienciaCochera`.
- Enlazaremos el estado `esFavorita` con una microinteracción de rebote táctil elástico, garantizando que el diseño visual, la accesibilidad y el contrato tipado permanezcan en perfecta armonía.

---

## 11. Cierre y articulación con el laboratorio

La entrega de esta Etapa 1 en Desarrollo Web consolida un catálogo tipado, confiable y libre de errores de inconsistencia de datos. De acuerdo con el protocolo **Phase Gate**, la planificación queda formalmente cerrada y aprobada, habilitando el paso a la implementación del código fuente y a la posterior ejecución de la Etapa 2 con Framer Motion.

