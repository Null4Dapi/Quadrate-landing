# Ficha Individual de Exposición — Diego (1:30 – 3:05)
### *Etapa 1: Componente React Tipado, Props, Estado y Colecciones*

**Tiempo asignado:** 1 minuto con 35 segundos (Máximo 2:00 min)  
**Objetivo principal:** Demostrar cómo se consumen los tipos de TypeScript dentro del componente funcional React sin usar `any`, tipando props, estados interactivos y callbacks.

---

## 1. Código a Proyectar en Pantalla

Abrir en el editor: `src/js/react/tarjeta-cochera.tsx`

```typescript
import React, { useState } from "react";
import type { ExperienciaCochera } from "../../types/experiencia-cochera";

export interface TarjetaCocheraProps {
  cochera: ExperienciaCochera;
  estaSeleccionada?: boolean;
  onSeleccionarCochera: (cochera: ExperienciaCochera) => void;
}

export function TarjetaCochera({
  cochera,
  estaSeleccionada = false,
  onSeleccionarCochera,
}: TarjetaCocheraProps) {
  const [esFavorita, setEsFavorita] = useState<boolean>(false);

  const conmutarFavorito = (evento: React.MouseEvent<HTMLButtonElement>) => {
    evento.stopPropagation();
    setEsFavorita((previo) => !previo);
  };

  // Renderizado del componente...
}
```

---

## 2. Puntos Clave a Señalar con el Mouse (Checklist)

1. **Líneas 4–8:** Señalar la interfaz `TarjetaCocheraProps`. Mostrar que `cochera` está fuertemente tipada con `ExperienciaCochera` y que `onSeleccionarCochera` recibe `(cochera: ExperienciaCochera) => void`.
2. **Línea 15:** Señalar `useState<boolean>(false)`. Enfatizar el tipado genérico explícito en el hook.
3. **Línea 17:** Señalar `(evento: React.MouseEvent<HTMLButtonElement>)`. Explicar la seguridad al llamar a `evento.stopPropagation()`.

---

## 3. Discurso Palabra por Palabra (Directo al Grano)

> "Gracias Luciana. En el componente `tarjeta-cochera.tsx`, el primer paso fue erradicar cualquier uso de `any` para no perforar el sistema de tipos.
> 
> Definimos `TarjetaCocheraProps` importando la interfaz `ExperienciaCochera`. Exigimos la prop `cochera`, el booleano opcional `estaSeleccionada` y la función de callback `onSeleccionarCochera`, tipada explícitamente para recibir un objeto de tipo `ExperienciaCochera` y retornar `void`. Al desestructurar las props en la función, TypeScript infiere automáticamente cada propiedad interna con autocompletado nativo.
> 
> En la línea 15 tipamos el estado interactivo de favoritos mediante el genérico `useState<boolean>(false)`. Para el manejador `conmutarFavorito`, tipamos el parámetro como `React.MouseEvent<HTMLButtonElement>`. Esto nos permite invocar `evento.stopPropagation()` de forma totalmente segura, impidiendo que al marcar una cochera como favorita se dispare accidentalmente el clic de selección de toda la tarjeta.
> 
> Finalmente, en el catálogo padre la colección se tipa como `ExperienciaCochera[]`. Métodos como `.filter()` o `.map()` quedan blindados contra accesos a propiedades inexistentes.
> 
> Ahora mi compañero Vílchez explicará cómo articulamos esta base tipada con Framer Motion en el laboratorio."

---

## 4. Preguntas Rápidas del Docente y Respuestas Relámpago

* **P: ¿Por qué es una mala práctica usar `any` para corregir rápido un error de compilación?**  
  * **R:** *"Porque `any` desactiva el verificador estático en cascada, anula el autocompletado inteligente y traslada fallos estructurales a excepciones fatales en el navegador del usuario final."*

* **P: ¿Cómo garantiza TypeScript que no se envíe una función vacía o un id roto en `onSeleccionarCochera`?**  
  * **R:** *"Porque la firma `(cochera: ExperienciaCochera) => void` obliga al componente padre a suministrar un manejador que acepte exactamente esa estructura de datos; de lo contrario, el compilador rechaza el build."*
