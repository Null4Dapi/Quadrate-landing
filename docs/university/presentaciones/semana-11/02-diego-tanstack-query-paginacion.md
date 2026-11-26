# Ficha Individual de Exposición — Diego (1:30 – 3:05)
### *Etapa 1 / 2: Estado de Servidor con TanStack Query, Claves Compuestas y Paginación*

**Tiempo asignado:** 1 minuto con 35 segundos (Máximo 2:00 min)  
**Objetivo principal:** Explicar el funcionamiento de TanStack Query para el catálogo de cocheras, justificar la estructura de la Query Key compuesta, la frescura con `staleTime` y la paginación fluida sin parpadeos (`keepPreviousData`).

---

## 1. Código a Proyectar en Pantalla

Abrir en el editor: `docs/university/presentaciones/semana-11/02-diego-codigo.jsx` (o `src/js/react/queries/use-cocheras-query.js`)

```jsx
import { useQuery, queryClient } from "../vendor/tanstack-query.js";
import { obtenerCocherasRemotas } from "./api-cocheras.js";

/**
 * Custom Hook para gobernar el Server State del catálogo de cocheras en Lima.
 */
export function useCocherasQuery({ distrito = "Todos", pagina = 1, limitePorPagina = 4 } = {}) {
  return useQuery({
    // 1. Clave compuesta y serializada determinísticamente
    queryKey: ["cocheras", { distrito, pagina, limitePorPagina }],

    // 2. Función asíncrona de consulta con cancelación nativa
    queryFn: () => obtenerCocherasRemotas({ distrito, pagina, limitePorPagina }),

    // 3. Ventana de frescura: 1 minuto sin re-consultas innecesarias
    staleTime: 60 * 1000,

    // 4. Retención de datos previos para eliminar saltos de pantalla
    keepPreviousData: true,
  });
}
```

---

## 2. Puntos Clave a Señalar con el Mouse (Checklist)

1. **Línea 10 (`queryKey`):** Mostrar el array compuesto `["cocheras", { distrito, pagina, limitePorPagina }]`. Explicar que actúa como clave primaria en la memoria de TanStack Query.
2. **Línea 13 (`queryFn`):** Explicar que recibe la función remota y maneja internamente las promesas rechazadas o resueltas.
3. **Línea 16 (`staleTime`):** Explicar la diferencia entre "datos en caché" y "datos frescos" (*stale* vs *fresh*).
4. **Línea 19 (`keepPreviousData`):** Señalar cómo esta bandera evita que la interfaz vuelva a `isLoading = true` cuando el usuario hace clic en "Página siguiente".

---

## 3. Discurso Palabra por Palabra (Directo al Grano)

> "Gracias Luciana. En el estado de servidor, sustituimos los `useEffect` imperativos por el hook declarativo de **TanStack Query**.
> 
> Observen en pantalla nuestro hook `useCocherasQuery({ distrito, pagina, limitePorPagina })`. Implementa tres principios fundamentales de ingeniería frontend:
> 
> Primero, **Query Keys jerárquicas y reactivas:**  
> `queryKey: ["cocheras", { distrito, pagina, limitePorPagina }]`  
> TanStack Query serializa esta clave de forma determinista. Si el usuario conmuta de la página 1 a la página 2, o filtra por 'Miraflores', se genera una entrada aislada en la memoria caché. Si el usuario regresa a una página previamente consultada, la respuesta es inmediata (cero milisegundos de latencia percibida).
> 
> Segundo, **Política de frescura y deduplicación:**  
> Definimos `staleTime: 60 * 1000` (1 minuto). Durante este intervalo, la consulta se considera fresca y no se re-dispara por eventos de ventana (*window focus*). Además, si dos componentes montan el catálogo en paralelo, TanStack Query deduplica la llamada ejecutando un único viaje de red.
> 
> Tercero, **Paginación fluida sin parpadeos:**  
> Activamos `keepPreviousData: true` (o `placeholderData: keepPreviousData`). Cuando el conductor avanza a la siguiente página, la interfaz retiene los datos de la página anterior hasta que los nuevos registros son resueltos por el servidor, eliminando layouts rotos o saltos de pantalla.
> 
> Todo esto entrega estados booleanos puros: `isLoading`, `isError` y la función `refetch()`.
> 
> Ahora mi compañero Vílchez explicará cómo administramos el estado global de cliente con Zustand sin utilizar un solo Provider."
