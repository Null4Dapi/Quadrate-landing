# Ficha Individual de Exposición — Luciana (0:00 – 1:30)
### *Etapa 1: Arquitectura de Tipos y Modelo de Dominio en TypeScript*

**Tiempo asignado:** 1 minuto con 30 segundos (Máximo 2:00 min)  
**Objetivo principal:** Justificar por qué pasamos de JavaScript a TypeScript en el modelo de datos de cocheras y mostrar la prevención de errores de compilación.

---

## 1. Código a Proyectar en Pantalla

Abrir en el editor de código: `src/types/experiencia-cochera.ts`

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

---

## 2. Puntos Clave a Señalar con el Mouse (Checklist)

1. **Líneas 1–2:** Señalar `DistritoLima` y `EstadoAforo`. Resaltar que son **Union Types literales**, no `string` genéricos.
2. **Líneas 7–8:** Señalar `tarifaHora: number` y `tarifaFraccion: number`. Enfatizar la prevención de concatenaciones erróneas.
3. **Línea 15:** Señalar `imageUrl?: string`. Explicar la importancia del operador de interrogación (`?`) para campos opcionales.

---

## 3. Discurso Palabra por Palabra (Directo al Grano)

> "Buenos días profesor. En Quadrate pe gestionamos disponibilidad de estacionamientos en distritos de alta congestión de Lima. En la versión previa en JavaScript puro detectamos dos riesgos críticos de runtime: recibir tarifas numéricas como strings rompiendo cálculos de fracciones horarias, o asignar estados de aforo con erratas ortográficas que dejaban filtros en blanco.
> 
> Para erradicar esto implementamos la arquitectura de tipos en `experiencia-cochera.ts`.
> 
> Observen las líneas 1 y 2: en lugar de usar `string` genérico, declaramos `DistritoLima` y `EstadoAforo` como **Union Types literales**: solo admitimos `'disponible'`, `'medio'` o `'critico'`. Si un desarrollador escribe `'disponble'` con error ortográfico, TypeScript detiene la compilación al instante.
> 
> En la línea 5 definimos la interfaz `ExperienciaCochera`. Modelamos de forma inmutable tarifas por hora y por fracción de 15 minutos como tipo `number` obligatorio. Noten además el atributo `imageUrl?: string`: está tipado como opcional con el operador de interrogación. Esto nos obliga arquitectónicamente a prever un fallback visual cuando la sede no dispone de fotografía, evitando excepciones de tipo `Cannot read properties of undefined`.
> 
> Con este contrato cerramos la fase de datos puros. Le doy el pase a Diego para ver cómo consumimos esta interfaz en el componente React."

---

## 4. Preguntas Rápidas del Docente y Respuestas Relámpago

* **P: ¿Por qué usaron `interface` para `ExperienciaCochera` pero `type` para `EstadoAforo`?**  
  * **R:** *"Usamos `interface` para objetos de dominio extensibles y con mejor rendimiento de inferencia, y `type` para uniones de tipos literales cerrados (`|`) donde `interface` no aplica sintácticamente."*

* **P: ¿Qué pasa si una API externa devuelve un dato mal tipado en tiempo de ejecución?**  
  * **R:** *"TypeScript valida en tiempo de compilación y desaparece en runtime; para APIs externas complementamos este contrato con esquemas de validación como Zod en la capa de integración."*
