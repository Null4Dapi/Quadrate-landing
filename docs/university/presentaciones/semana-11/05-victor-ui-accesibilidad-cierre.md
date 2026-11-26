# Ficha Individual de Exposición — Víctor / Manuel (6:20 – 8:00)
### *Etapa 2: React UI Pura, Accesibilidad Universal (a11y), Demostración en Vivo y Cierre Ejecutivo*

**Tiempo asignado:** 1 minuto con 40 segundos (Máximo 2:00 min)  
**Objetivo principal:** Demostrar en vivo el catálogo paginado y los toasts en `demo.html`, verificar la ausencia de re-renderizados con DevTools, explicar la accesibilidad (`role="status"`, `aria-live="polite"`) y pronunciar el cierre ejecutivo del equipo.

---

## 1. Código y Demostración a Proyectar en Pantalla

1. **Demostración en vivo:** Navegador en `demo.html` con consola DevTools abierta (inspeccionar Network y consola de React).
2. **Código de Accesibilidad UI:** Abrir `docs/university/presentaciones/semana-11/05-victor-codigo.jsx` (o `src/js/react/toast-container.jsx` / `catalogo-cocheras.jsx`)

```jsx
// 1. ToastContainer con región viva para lectores de pantalla
export function ToastContainer({ notificaciones, onDescartar }) {
  return (
    <aside
      aria-label="Centro de notificaciones en tiempo real"
      aria-live="polite"
      aria-atomic="true"
      className="quadrate-live__toasts-container"
    >
      {notificaciones.map((n) => (
        <article
          key={n.id}
          role="status"
          className={`quadrate-live__toast quadrate-live__toast--${n.tipo}`}
        >
          <span className="quadrate-live__toast-icono" aria-hidden="true">🔔</span>
          <div className="quadrate-live__toast-cuerpo">
            <strong className="quadrate-live__toast-titulo">{n.titulo}</strong>
            <p className="quadrate-live__toast-mensaje">{n.mensaje}</p>
          </div>
          <button
            type="button"
            onClick={() => onDescartar(n.id)}
            aria-label={`Descartar notificación de ${n.titulo}`}
            className="quadrate-live__toast-cerrar"
          >
            ×
          </button>
        </article>
      ))}
    </aside>
  );
}
```

---

## 2. Puntos Clave a Señalar con el Mouse (Checklist)

1. **Interacción en vivo en `demo.html`:** Cambiar de la página 1 a la 2 del catálogo. Señalar que la primera carga tarda ~250ms y al regresar a la página 1 responde en **0 ms** desde la caché de TanStack Query.
2. **Conmutador de tema:** Hacer clic en el botón de tema (Sol/Luna). Mostrar que el catálogo de cocheras **no se re-renderiza** gracias a los selectores atómicos de Zustand.
3. **Líneas 5–7 (`aria-live="polite"`, `aria-atomic="true"`):** Explicar que los software lectores de pantalla vocalizan las alertas de telemetría sin interrumpir la lectura del usuario.
4. **Línea 23 (`aria-label` en botón cerrar):** Resaltar la navegación accesible por teclado con `Tab` y activación con `Enter`.

---

## 3. Discurso Palabra por Palabra (Directo al Grano)

> "Gracias Cueva. Concluimos proyectando la consola interactiva `Quadrate Live` en `demo.html`, donde ambas capas convergen en una interfaz editorial limpia y accesible.
> 
> Observen en pantalla:
> 1. **Consumo puro en el Catálogo:** El componente `CatalogoRemoto` / `CatalogoCocheras` consume `useCocherasQuery()`. Mientras los datos viajan por red, se proyecta un estado de carga con skeleton cards etiquetado con `role="status"` y `aria-busy="true"`. Si la red falla, se despliega un panel de error accesible con `role="alert"` y botón de reintento automático.
> 2. **Paginación Accesible:** Los botones 'Anterior' y 'Siguiente' informan `aria-disabled="true"` en los extremos y cuentan con anuncios de cambio de página para lectores de pantalla.
> 3. **Centro de Alertas Toasts con Accesibilidad:**  
> Cada notificación inyectada desde WebSocket hacia Zustand se renderiza en `ToastContainer` dentro de una región viva:  
> `aria-live="polite"` y `aria-atomic="true"`.  
> Esto permite que los software de asistencia (*screen readers*) comuniquen al conductor los cambios de tarifa o liberaciones de plaza sin interrumpir la navegación por teclado.
> 4. **Verificación en DevTools:**  
> Al alternar entre la página 1 y 2, observen la pestaña Network: la primera vez realiza la petición HTTP; al regresar a la página 1, la respuesta proviene de la memoria caché de TanStack Query en **0 milisegundos**. Y al conmutar el tema visual entre 'claro' y 'oscuro', la consola de componentes de React demuestra que el catálogo **no sufre un solo re-renderizado**.
> 
> **Conclusión del Equipo:**  
> En la Semana 11 hemos demostrado que una arquitectura desacoplada —asignando a TanStack Query el rol de gobernanza del servidor y a Zustand el control atómico del cliente— erradica por completo la sobrecarga de Providers, optimiza el consumo de memoria del navegador y proporciona una base sólida, escalable y accesible para el producto Quadrate pe.
> 
> Muchas gracias profesor, quedamos listos para su ronda de preguntas."
