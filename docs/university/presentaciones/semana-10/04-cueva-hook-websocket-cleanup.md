# Ficha Individual de Exposición — Cueva (4:40 – 6:20)
### *Etapa 2: Custom Hook `useExperienceSocket`, Ciclo de Vida y Limpieza (Cleanup)*

**Tiempo asignado:** 1 minuto con 40 segundos (Máximo 2:00 min)  
**Objetivo principal:** Explicar cómo el cliente React se conecta al WebSocket, despacha eventos a `NotificationContext` y ejecuta la función de limpieza obligatoria (`cleanup`) para evitar conexiones zombis.

---

## 1. Código a Proyectar en Pantalla

Abrir en el editor: `src/js/react/hooks/use-experience-socket.js` (o sección en el código articulador)

```javascript
import { useEffect, useRef, useState } from "react";
import { useNotifications } from "../context/notification-context";

export function useExperienceSocket(sala = "red-cocheras-lima") {
  const { addNotification } = useNotifications();
  const [estadoConexion, setEstadoConexion] = useState("conectando");
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:3001");
    socketRef.current = socket;

    socket.onopen = () => {
      setEstadoConexion("conectado");
      socket.send(JSON.stringify({ action: "join-room", room: sala }));
    };

    socket.onmessage = (evento) => {
      try {
        const data = JSON.parse(evento.data);
        if (data.event === "notification:new" && data.payload) {
          addNotification(data.payload); // Puente reactivo al Context
        }
      } catch (err) { /* error silencioso controlado */ }
    };

    socket.onclose = () => setEstadoConexion("desconectado");

    // FUNCIÓN DE LIMPIEZA OBLIGATORIA (CLEANUP)
    return () => {
      if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
        socket.close();
      }
    };
  }, [sala, addNotification]);

  return { estadoConexion };
}
```

---

## 2. Puntos Clave a Señalar con el Mouse (Checklist)

1. **Línea 5:** Señalar `const { addNotification } = useNotifications();`. Resaltar que el hook consume el Contexto de la Etapa 1.
2. **Línea 19:** Señalar `addNotification(data.payload);`. Enfatizar la articulación: WebSocket transporta, Context API distribuye a la UI.
3. **Líneas 26–30:** Señalar el bloque `return () => { socket.close(); };`. Explicar qué es la **función de limpieza (*cleanup*)** y por qué evita sockets zombis.

---

## 3. Discurso Palabra por Palabra (Directo al Grano)

> "Gracias Vílchez. En el cliente React construimos el custom hook `useExperienceSocket(sala)`. Su función es ser el puente entre el socket del sistema operativo y nuestro `NotificationContext`.
> 
> Observen la integración:
> 1. Al montarse el hook, se instancia `new WebSocket("ws://localhost:3001")`. Al emitirse el evento `onopen`, enviamos inmediatamente el handshake de suscripción con `join-room` para la sala del distrito activo.
> 2. Al dispararse `onmessage`, parseamos el payload y en lugar de manipular variables locales, invocamos directamente `addNotification(data.payload)`. Esto demuestra que **WebSocket es el protocolo de transporte y Context API es el distribuidor de estado en la UI**.
> 
> Un aspecto evaluado con máxima rigurosidad en la rúbrica es la **función de limpieza (*cleanup*) del `useEffect`**:  
> Observen las líneas 26 a 30: cuando el usuario cambia de vista o desmonta el componente, retornamos:  
> ```javascript
> return () => {
>   if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
>     socket.close();
>   }
> };
> ```
> Esto asegura que no queden sockets zombis en segundo plano enviando peticiones ni saturando puertos locales.
> 
> Le doy el pase a Víctor para ver las pruebas multiusuario y la accesibilidad."

---

## 4. Preguntas Rápidas del Docente y Respuestas Relámpago

* **P: ¿Por qué usaron `useRef` para guardar la instancia del socket?**  
  * **R:** *"Porque `useRef` preserva la referencia inmutable del objeto socket entre re-renderizados sin disparar ciclos adicionales de renderizado en el componente."*

* **P: ¿Qué sucedería si olvidamos la función de limpieza en el `return` del `useEffect`?**  
  * **R:** *"En React (especialmente con StrictMode), cada montaje dejaría una conexión abierta huérfana en el servidor. Si el usuario navega 10 veces, se crearían 10 conexiones simultáneas recibiendo alertas duplicadas y saturando la memoria del navegador."*
