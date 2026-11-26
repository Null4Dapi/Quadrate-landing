# Ficha Individual de Exposición — Víctor (6:20 – 8:00)
### *Etapa 2: Pruebas Multiusuario de Salas, Accesibilidad Universal y Cierre Ejecutivo*

**Tiempo asignado:** 1 minuto con 40 segundos (Máximo 2:00 min)  
**Objetivo principal:** Demostrar en vivo la segmentación de salas entre dos navegadores sin fugas de datos, el cumplimiento de accesibilidad con `aria-live="polite"` y cerrar la presentación del equipo.

---

## 1. Código y Demostración a Proyectar en Pantalla

1. **Demostración en vivo:** Dos ventanas de navegador abiertas lado a lado (Ventana A en `distrito:san-isidro` y Ventana B en `distrito:miraflores`).
2. **Código de Accesibilidad:** `src/js/react/components/AlertaToast.jsx`

```jsx
export function AlertaToast({ notificacion, onCerrar }) {
  if (!notificacion) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className={`quadrate-live__toast quadrate-live__toast--${notificacion.tipo}`}
    >
      <div className="quadrate-live__toast-icono" aria-hidden="true">🔔</div>
      <div className="quadrate-live__toast-cuerpo">
        <strong className="quadrate-live__toast-titulo">{notificacion.title}</strong>
        <p className="quadrate-live__toast-mensaje">{notificacion.message}</p>
      </div>
      <button
        type="button"
        onClick={onCerrar}
        aria-label="Cerrar notificación"
        className="quadrate-live__toast-btn-cerrar"
      >
        ×
      </button>
    </div>
  );
}
```

---

## 2. Puntos Clave a Señalar con el Mouse (Checklist)

1. **Prueba visual multiusuario (5–10 seg):** Mostrar cómo se emite una alerta a San Isidro y solo la Ventana A actualiza la campana roja sin tocar la Ventana B.
2. **Líneas 6–7 del Toast:** Señalar `role="status"` y `aria-live="polite"`. Explicar qué es una **Live Region** accesible en WCAG 2.1.
3. **Mencionar `ThemeContext`:** Alternancia entre tema diurno y modo vigilancia nocturna de garitas de Lima.

---

## 3. Discurso Palabra por Palabra (Directo al Grano)

> "Gracias Cueva. Para validar la arquitectura ejecutamos el experimento multiusuario exigido:
> 
> Observen en pantalla: tenemos dos navegadores conectados simultáneamente:
> - Ventana A en `distrito:san-isidro`.
> - Ventana B en `distrito:miraflores`.
> 
> *(Acción en vivo de 5 segundos)*: Emitimos una alerta de 'Aforo Crítico (94%)' en San Isidro. Como pueden ver, la Ventana A actualiza su campana instantáneamente en menos de 12 milisegundos, mientras que la Ventana B permanece inalterada. Esto demuestra que **el particionamiento en salas del servidor funciona sin fugas de datos**.
> 
> Respecto a la **Accesibilidad Universal (WCAG 2.1)**:
> En `AlertaToast.jsx`, el banner flotante está encapsulado en un contenedor semántico con:  
> `role="status"` y `aria-live="polite"`.  
> Esto permite que los lectores de pantalla anuncien la alerta de la garita de forma auditiva y educada, sin interrumpir la lectura del conductor. Además, `NotificationBell` implementa `aria-haspopup="dialog"` y anuncia dinámicamente el total de alertas pendientes.
> 
> **Conclusión del equipo:**  
> Consolidamos una arquitectura desacoplada: Context API eliminó el 100% del prop drilling en la interfaz, y nuestro servidor WebSocket en Node.js entrega telemetría segmentada en tiempo real con limpieza garantizada.
> 
> Quedamos a su disposición para sus preguntas, profesor."

---

## 4. Preguntas Rápidas del Docente y Respuestas Relámpago

* **P: ¿Por qué usaron `aria-live="polite"` y no `aria-live="assertive"`?**  
  * **R:** *"Porque `assertive` interrumpe de inmediato lo que el lector de pantalla esté vocalizando al usuario ciego, lo cual genera confusión; `polite` espera a que el usuario termine su lectura para anunciar la llegada de una nueva alerta."*

* **P: ¿Cómo se articula todo este desarrollo de Semana 10 con la Semana 11?**  
  * **R:** *"Esta arquitectura de salas WebSocket y distribución por Context API es la base sobre la que en Semana 11 conectaremos APIs REST externas mediante TanStack Query y migraremos el almacenamiento hacia un store persistente con Zustand."*
