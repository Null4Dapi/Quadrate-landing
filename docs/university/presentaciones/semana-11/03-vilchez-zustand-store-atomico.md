# Ficha Individual de Exposición — Vílchez (3:05 – 4:40)
### *Etapa 2: Estado Global de Cliente con Zustand, Atomicidad sin Providers y Persistencia*

**Tiempo asignado:** 1 minuto con 35 segundos (Máximo 2:00 min)  
**Objetivo principal:** Demostrar cómo Zustand administra el Client State de la consola sin recurrir a `<Provider>`, explicar la suscripción selectiva atómica y la persistencia en `localStorage`.

---

## 1. Código a Proyectar en Pantalla

Abrir en el editor: `docs/university/presentaciones/semana-11/03-vilchez-codigo.js` (o `src/js/react/store/app-store.js`)

```javascript
import { create } from "../vendor/zustand.js";

export const useAppStore = create((set, get) => ({
  // 1. Estado Reactivo del Cliente (UI)
  tema: localStorage.getItem("quadrate_tema") || "claro",
  distritoPreferido: "Todos",
  modoVista: "cuadricula",
  notificaciones: [],

  // 2. Acciones Atómicas e Inmutables
  alternarTema: () => {
    const nuevoTema = get().tema === "claro" ? "oscuro" : "claro";
    try {
      localStorage.setItem("quadrate_tema", nuevoTema);
    } catch {}
    set({ tema: nuevoTema });
  },

  establecerDistritoPreferido: (distrito) => set({ distritoPreferido: distrito }),

  alternarModoVista: () =>
    set((state) => ({
      modoVista: state.modoVista === "cuadricula" ? "lista" : "cuadricula",
    })),

  agregarNotificacion: (item) => {
    const id = `toast-${Date.now()}`;
    const timestamp = new Date().toLocaleTimeString("es-PE", { hour12: false });
    const nuevoToast = { ...item, id, timestamp };

    set((state) => ({
      notificaciones: [nuevoToast, ...state.notificaciones.slice(0, 3)],
    }));

    setTimeout(() => get().descartarNotificacion(id), 5000);
  },

  descartarNotificacion: (id) =>
    set((state) => ({
      notificaciones: state.notificaciones.filter((n) => n.id !== id),
    })),
}));
```

---

## 2. Puntos Clave a Señalar con el Mouse (Checklist)

1. **Línea 3 (`create`):** Destacar que Zustand crea un hook autónomo; no existe ningún componente `<AppStoreProvider>` en la raíz de la aplicación.
2. **Líneas 10–16 (`alternarTema`):** Resaltar la lectura segura con `get()`, la persistencia en `localStorage` y la actualización parcial con `set()`.
3. **Suscripción con Selectores:** Explicar cómo `useAppStore(state => state.tema)` aísla a los componentes de cambios en `notificaciones`.
4. **Líneas 24–33 (`agregarNotificacion`):** Señalar la inmutabilidad (`[nuevoToast, ...slice]`), el tope de 4 toasts concurrentes y el temporizador de auto-cierre.

---

## 3. Discurso Palabra por Palabra (Directo al Grano)

> "Gracias Diego. Para el estado propio de la interfaz del cliente no necesitamos la complejidad asíncrona de TanStack Query, pero tampoco la pesadez de `Context API`. Implementamos **Zustand**.
> 
> Observen la definición de `useAppStore` en pantalla:  
> A diferencia de Context API, **Zustand no requiere envolver el árbol de componentes con ningún `<Provider>`**. El store se instancia como un almacén atómico en memoria al que cualquier componente accede directamente vía hooks funcionales.
> 
> Destaco tres ventajas técnicas aplicadas a Quadrate pe:
> 
> 1. **Suscripción atómica mediante selectores:**  
> Si un componente solo necesita alternar el tema visual, escribe:  
> `const theme = useAppStore((state) => state.theme);`  
> Si en ese instante ingresa un evento por telemetría vehicular y se agrega una notificación a la cola `notificaciones`, este componente **no se re-renderiza**. Zustand compara por identidad estricta la porción del selector, resolviendo de raíz el problema de re-renderizado masivo de Context.
> 
> 2. **Persistencia selectiva con `localStorage`:**  
> Utilizamos un inicializador seguro con bloque defensivo `try/catch` para `quadrate_tema`. Cuando el conductor elige la vista nocturna para garitas de baja iluminación, la preferencia se persiste en el almacenamiento local del cliente y se hidrata al recargar la sesión.
> 
> 3. **Inmutabilidad y mutaciones predecibles:**  
> Acciones como `agregarNotificacion` o `descartarNotificacion` operan con funciones puras utilizando el operador spread, encolando un máximo de 4 toasts activos y programando un timer de auto-descarte de 5 segundos.
> 
> Paso con Cueva para explicar el canal de comunicación en tiempo real y el desacoplamiento de entornos."
