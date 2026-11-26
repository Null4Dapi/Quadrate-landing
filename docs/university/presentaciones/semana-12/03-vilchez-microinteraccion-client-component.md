# Ficha Individual de Exposición — Vílchez (3:05 – 4:40)
### *Etapa 1: Frontera de Hidratación `'use client'`, Microinteracción y Accesibilidad (A11y)*

**Tiempo asignado:** 1 minuto con 35 segundos (Máximo 1:50 min)  
**Objetivo principal:** Justificar técnicamente el uso de `'use client'` bajo el principio de confinamiento, explicar el manejo de estado reactivo local con `useState` y demostrar el cumplimiento de accesibilidad WCAG 2.2 con `aria-pressed`.

---

## 1. Código a Proyectar en Pantalla

Abrir en el editor de código: `docs/university/presentaciones/semana-12/03-vilchez-codigo.tsx` (o `app/components/BotonFavorito.tsx`).

```tsx
"use client";
import { useState } from "react";

export default function BotonFavorito({ cocheraId, nombreCochera }) {
  const [esFavorito, setEsFavorito] = useState(false);
  const [contadorFavoritos, setContadorFavoritos] = useState(142);

  const alternarFavorito = () => {
    setEsFavorito(prev => !prev);
    setContadorFavoritos(c => esFavorito ? c - 1 : c + 1);
  };

  return (
    <button
      type="button"
      className={`boton-favorito ${esFavorito ? "boton-favorito--activo" : ""}`}
      onClick={alternarFavorito}
      aria-pressed={esFavorito}
      aria-label={`Marcar ${nombreCochera} como cochera favorita`}
    >
      <span>{esFavorito ? "★ Guardado" : "☆ Guardar"}</span>
      <span>({contadorFavoritos})</span>
    </button>
  );
}
```

---

## 2. Puntos Clave a Señalar con el Mouse (Checklist)

1. **Línea 1:** Señalar la directiva `"use client"`. Resaltar que actúa como una **frontera de hidratación (*Component Boundary*)**.
2. **Líneas 6–7:** Señalar `useState<boolean>(false)`. Justificar que el manejo de estado y eventos `onClick` son los únicos motivos que exigen el runtime cliente.
3. **Líneas 18–19:** Señalar `aria-pressed={esFavorito}` y `aria-label`. Explicar cómo los lectores de pantalla leen el cambio de estado sin ambigüedad.

---

## 3. Discurso Palabra por Palabra (Directo al Grano)

> "Gracias Diego. La directiva `'use client'` no debe colocarse a la ligera. Si la hubiéramos puesto en el layout o en la página principal, habríamos anulado las ventajas de Next.js obligando al cliente a descargar todo el árbol de componentes.
>
> Por ello, aplicamos el principio de **confinamiento de componentes cliente**: aislamos la interactividad en la hoja más profunda del árbol: el microcomponente `BotonFavorito.tsx`.
>
> Observen la línea 1: `'use client'` marca la **frontera de hidratación (*Component Boundary*)**. Solo este archivo descarga código JavaScript al navegador. ¿Por qué lo exige? Porque en las líneas 8 y 9 requerimos estado reactivo local mediante `useState` para conmutar el estado de guardado y actualizar el contador social en memoria.
>
> Pero en Quadrate pe cuidamos rigurosamente la accesibilidad técnica: en la línea 24 implementamos el atributo `aria-pressed={esFavorito}`. Cuando un usuario utiliza un lector de pantalla como TalkBack o NVDA, el sintetizador vocal anuncia explícitamente si la cochera está marcada o no como favorita. El botón es además 100% operable mediante teclado con `Enter` y `Espacio`, sin recurrir a estilos embebidos.
>
> Doy paso a Cueva para explicar el data fetching en servidor."

---

## 4. Preguntas Trampa del Docente y Respuestas Blindadas

**P: ¿Por qué no utilizaste Zustand o Context API para este botón como en la Semana 10 y 11?**  
*R:* "Porque aplicamos el principio KISS y la consigna de la Actividad 4: este botón gestiona un estado efímero y estrictamente local de la tarjeta. Introducir un store global o un Provider para un contador puntual introduciría sobreingeniería innecesaria. Cuando un estado no necesita compartirse entre ramas lejanas del árbol, `useState` en un Client Component es la solución óptima."

**P: ¿Qué pasa si el usuario desactiva JavaScript en su navegador?**  
*R:* "Toda la página, el layout, el texto, las tarifas y las métricas de aforo se verán a la perfección porque son Server Components pre-renderizados en HTML. Únicamente la animación y el cambio de estado del botón quedarán inertes, cumpliendo con el principio de degradación elegante."
