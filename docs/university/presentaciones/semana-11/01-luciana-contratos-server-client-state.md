# Ficha Individual de Exposición — Luciana (0:00 – 1:30)
### *Etapa 1: Diagnóstico de Arquitectura, Separación Server State vs Client State y Contratos TypeScript*

**Tiempo asignado:** 1 minuto con 30 segundos (Máximo 2:00 min)  
**Objetivo principal:** Fundamentar el diagnóstico técnico de la migración desde Context API, explicar la separación conceptual entre Server State y Client State, y presentar los contratos inmutables en TypeScript.

---

## 1. Código y Contratos a Proyectar en Pantalla

Abrir en el editor: `docs/university/presentaciones/semana-11/01-luciana-codigo.ts`

```typescript
// 1. CONTRATO DE ESTADO DE SERVIDOR (Server State) — Remoto y Asíncrono
export interface Cochera {
  readonly id: number;
  readonly nombre: string;
  readonly distrito: "San Isidro" | "Miraflores" | "Surco" | "San Borja";
  readonly direccion: string;
  readonly tarifaHora: number;
  readonly plazasTotales: number;
  readonly plazasLibres: number;
  readonly porcentajeOcupacion: number;
  readonly estadoAforo: "disponible" | "fluido" | "reservado" | "promocion" | "critico";
  readonly imagen: string;
  readonly permiteReservaEta: boolean;
}

export interface RespuestaCatalogoPaginado {
  readonly datos: readonly Cochera[];
  readonly totalRegistros: number;
  readonly paginaActual: number;
  readonly totalPaginas: number;
  readonly tieneSiguiente: boolean;
  readonly tieneAnterior: boolean;
}

// 2. CONTRATO DE ESTADO GLOBAL DE CLIENTE (Client State) — Síncrono y Atómico
export interface AppStoreState {
  readonly tema: "claro" | "oscuro";
  readonly distritoPreferido: string;
  readonly modoVista: "cuadricula" | "lista";
  readonly notificaciones: readonly ToastNotificacion[];
  readonly alternarTema: () => void;
  readonly establecerDistritoPreferido: (distrito: string) => void;
  readonly alternarModoVista: () => void;
  readonly agregarNotificacion: (item: Omit<ToastNotificacion, "id" | "timestamp">) => void;
  readonly descartarNotificacion: (id: string) => void;
}
```

---

## 2. Puntos Clave a Señalar con el Mouse (Checklist)

1. **Señalar el diagrama de separación:** Explicar por qué los datos del servidor (cocheras) no deben convivir en el mismo almacén que las preferencias del usuario (tema).
2. **Líneas 2–14 (`Cochera`):** Resaltar la inmutabilidad (`readonly`) y el tipado estricto de distritos y estados de aforo.
3. **Líneas 16–23 (`RespuestaCatalogoPaginado`):** Mostrar los metadatos de paginación (`totalPaginas`, `tieneSiguiente`) necesarios para el hook de TanStack Query.
4. **Líneas 26–36 (`AppStoreState`):** Resaltar la separación clara entre variables de estado de UI y acciones puras de Zustand.

---

## 3. Discurso Palabra por Palabra (Directo al Grano)

> "Buenos días profesor. En la Semana 11 resolvemos una de las deudas técnicas más críticas en aplicaciones frontend modernas: la confusión estructural entre **Server State** (estado de servidor) y **Client State** (estado de cliente).
> 
> En la Semana 10 utilizamos `Context API` para distribuir temas y notificaciones. Sin embargo, al incorporar el catálogo dinámico de cocheras en Lima con filtros por distrito y tarifas dinámicas, `Context API` evidenció tres límites severos:
> 1. **Provider Hell:** Anidar múltiples proveedores provocaba cascadas de re-renderizados en componentes que no consumían los datos modificados.
> 2. **Carga y caché manual:** Obligaba a emular estados de red con `useState` y `useEffect` acoplados, careciendo de deduplicación de peticiones, retención en memoria y revalidación en segundo plano (*stale-while-revalidate*).
> 3. **Acoplamiento de red:** Depender de servicios de nube remotos bloqueaba el desarrollo local en caliente.
> 
> Para resolverlo, rediseñamos la consola `Quadrate Live` bajo una **arquitectura en dos niveles**:
> - **Nivel 1 (Server State) con TanStack Query:** Para datos asíncronos que no le pertenecen al navegador (catálogo de playas, plazas disponibles, paginación y estados `isLoading`/`isError`).
> - **Nivel 2 (Client State) con Zustand:** Para datos síncronos e interactivos de la interfaz (tema claro/oscuro, preferencias de vista en cuadrícula o lista y centro de toasts flotantes).
> 
> En pantalla observan nuestros contratos inmutables tipados: `Cochera`, `RespuestaCatalogoPaginado` y `AppStoreState`.
> 
> Paso con mi compañero Diego para ver cómo gobierna TanStack Query el estado asíncrono del servidor."
