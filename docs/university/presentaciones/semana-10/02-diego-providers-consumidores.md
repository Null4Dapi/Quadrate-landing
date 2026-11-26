# Ficha Individual de Exposición — Diego (1:30 – 3:05)
### *Etapa 1: NotificationProvider, Estado Derivado y Consumo Defensivo*

**Tiempo asignado:** 1 minuto con 35 segundos (Máximo 2:00 min)  
**Objetivo principal:** Demostrar cómo se implementó el Provider, el cálculo del estado derivado sin redundancias y el diseño defensivo del custom hook `useNotifications()`.

---

## 1. Código a Proyectar en Pantalla

Abrir en el editor: `src/js/react/context/notification-context.jsx`

```javascript
import React, { createContext, useContext, useState } from "react";

const NotificationContext = createContext(undefined);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  // ESTADO DERIVADO: Sin redundancia de useState adicional
  const unreadCount = notifications.filter((n) => !n.read).length;

  const addNotification = (item) => {
    const nueva = { ...item, id: item.id || `notif-${Date.now()}`, read: false };
    setNotifications((prev) => [nueva, ...prev]);
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, addNotification, markAsRead }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

// CUSTOM HOOK CON CONSUMO DEFENSIVO
export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotifications debe consumirse dentro de un NotificationProvider");
  }
  return context;
}
```

---

## 2. Puntos Clave a Señalar con el Mouse (Checklist)

1. **Línea 9:** Señalar `const unreadCount = notifications.filter((n) => !n.read).length;`. Explicar qué es un **estado derivado**.
2. **Líneas 11–14:** Señalar `addNotification` y el operador spread `[nueva, ...prev]` para respetar inmutabilidad y ordenar lo más nuevo arriba.
3. **Líneas 29–35:** Señalar `useNotifications()` y el `throw new Error(...)`. Enfatizar el concepto de **diseño defensivo**.

---

## 3. Discurso Palabra por Palabra (Directo al Grano)

> "Gracias Luciana. En `notification-context.jsx`, implementamos el componente contenedor `<NotificationProvider>`.
> 
> El primer reto técnico fue calcular el número de alertas pendientes sin generar redundancia de memoria. **No creamos un `useState` adicional para el contador.** En su lugar, aplicamos el concepto de **estado derivado**:  
> `const unreadCount = notifications.filter(n => !n.read).length;`  
> Este cálculo se resuelve directamente durante el ciclo de renderizado, garantizando sincronización matemática absoluta sin riesgo de desalineación de estados.
> 
> En la línea 29 implementamos el custom hook `useNotifications()`. Diseñamos una guarda defensiva estricta: si un programador intenta consumir el hook fuera del árbol cubierto por el Provider, `context` retorna `undefined`, por lo que lanzamos de inmediato:  
> `throw new Error("useNotifications debe consumirse dentro de un NotificationProvider")`.  
> Esto previene excepciones silenciosas y fallos de puntero nulo en tiempo de ejecución.
> 
> Con este canal listo, componentes como `NotificationBell` y `NotificationPanel` consumen directamente `{ notifications, unreadCount, markAsRead }` sin recibir una sola prop intermedia.
> 
> Ahora mi compañero Vílchez presentará el servidor WebSocket propio implementado en el laboratorio."

---

## 4. Preguntas Rápidas del Docente y Respuestas Relámpago

* **P: ¿Por qué es una mala práctica guardar `unreadCount` en otro `useState`?**  
  * **R:** *"Porque generaría duplicidad de fuente de verdad. Obligaría a mantener manualmente sincronizados dos estados en cada inserción o marcado de lectura, arriesgando inconsistencias donde la lista tenga 3 elementos pero el contador marque 2."*

* **P: ¿Qué ventaja tiene encapsular `useContext` en un custom hook como `useNotifications`?**  
  * **R:** *"Evita tener que importar el objeto Context en cada archivo, previene accesos indebidos con guardas de error en desarrollo y facilita futuras refactorizaciones o migraciones (como hacia Zustand)."*
