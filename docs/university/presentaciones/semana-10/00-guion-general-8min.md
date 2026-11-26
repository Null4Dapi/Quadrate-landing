# Guion Maestro de Exposición (8 Minutos) — Semana 10
### *Context API, Erradicación de Prop Drilling y Servidor WebSocket Propio con Salas por Distrito*
**Proyecto:** Quadrate pe — Monitoreo Operativo y Telemetría de Cocheras en Lima  
**Duración Total:** 8 minutos cronometrados (Exactos)  
**Integrantes:** Luciana (1) · Diego (2) · Vílchez (3) · Cueva (4) · Víctor (5)  
**Modalidad de Presentación:** Directo al código, sin introducciones vacías, técnico y de alto impacto.

---

## Matriz de Tiempos y Roles

| # | Integrante | Minuto | Duración | Rol / Tema Técnico | Archivo o Vista a Proyectar |
| :-: | :--- | :-: | :-: | :--- | :--- |
| **1** | **Luciana** | 0:00 – 1:30 | 1m 30s | **Prop Drilling, Arquitectura de Contextos y Modelos** (Etapa 1) | Árbol jerárquico + `src/types/notification.ts` |
| **2** | **Diego** | 1:30 – 3:05 | 1m 35s | **NotificationProvider, Estado Derivado y Hook Defensivo** (Etapa 1) | `src/js/react/context/notification-context.jsx` |
| **3** | **Vílchez** | 3:05 – 4:40 | 1m 35s | **Servidor WebSocket Propio y Segmentación por Salas** (Etapa 2) | `server/server.js` en Node.js |
| **4** | **Cueva** | 4:40 – 6:20 | 1m 40s | **Hook `useExperienceSocket`, Ciclo de Vida y Cleanup** (Etapa 2) | `src/js/react/hooks/use-experience-socket.js` |
| **5** | **Víctor** | 6:20 – 8:00 | 1m 40s | **Pruebas de Aislamiento de Salas, Accesibilidad y Cierre** (Etapa 2) | Demo en vivo (2 pestañas) + `AlertaToast.jsx` |

---

## Guion Continuo con Acotaciones Escénicas

### [0:00 – 1:30] Bloque 1: Luciana — Diagnóstico de Prop Drilling y Arquitectura de Contextos
> **[En pantalla: Proyectar diagrama de árbol de componentes y abrir `src/types/notification.ts`]**

**Luciana:**  
"Buenos días profesor. En la Semana 10 escalamos la consola de monitoreo `Quadrate Live` para incorporar alertas operativas en vivo (aforo crítico, tarifas dinámicas e ingresos LPR en cocheras de Lima). 

En la arquitectura previa de la Semana 9 identificamos un grave problema de **Prop Drilling**: para que el botón de la campana (`NotificationBell`) en la barra superior supiera cuántas alertas no leídas existían, debíamos retransmitir callbacks y arreglos a través de 4 niveles jerárquicos (`QuadrateLiveApp → HeaderOperativo → SaludoUsuario → NotificationBell`). Esto acoplaba componentes intermedios que no necesitaban esos datos y provocaba re-renderizados innecesarios en todo el árbol ante cada evento entrante.

Para erradicarlo, dividimos la responsabilidad:
1. **Estado Local con `useState`:** Exclusivo de cada componente (búsqueda por texto o duración en el simulador).
2. **Estado Compartido con Context API:** Notificaciones operativas y el tema visual de garita.

Observen el contrato formal en pantalla: definimos `Notification` con campos inmutables (`id`, `tipo`, `distrito`, `timestamp` y bandera `read`). Además, tipamos `ThemeContextValue` con los modos `'light'` editorial y `'dark'` de alto contraste para garitas nocturnas. 

Paso con Diego para ver la implementación del Provider y el consumo defensivo."

---

### [1:30 – 3:05] Bloque 2: Diego — NotificationProvider, Estado Derivado y Consumo Defensivo
> **[En pantalla: Abrir `src/js/react/context/notification-context.jsx`, resaltar `unreadCount` y el error defensivo]**

**Diego:**  
"Gracias Luciana. En `notification-context.jsx`, implementamos el componente contenedor `<NotificationProvider>`.

El primer reto técnico fue calcular el número de alertas pendientes sin generar redundancia de memoria. **No creamos un `useState` adicional para el contador.** En su lugar, aplicamos el concepto de **estado derivado**:  
`const unreadCount = notifications.filter(n => !n.read).length;`  
Este cálculo se resuelve directamente durante el ciclo de renderizado, garantizando sincronización matemática absoluta sin riesgo de desalineación de estados.

En la línea 24 implementamos el custom hook `useNotifications()`. Diseñamos una guarda defensiva estricta: si un programador intenta consumir el hook fuera del árbol cubierto por el Provider, `context` retorna `undefined`, por lo que lanzamos de inmediato:  
`throw new Error("useNotifications debe consumirse dentro de un NotificationProvider")`.  
Esto previene excepciones silenciosas y fallos de puntero nulo en tiempo de ejecución.

Con este canal listo, componentes como `NotificationBell` y `NotificationPanel` consumen directamente `{ notifications, unreadCount, markAsRead }` sin recibir una sola prop intermedia.

Ahora mi compañero Vílchez presentará el servidor WebSocket propio implementado en el laboratorio."

---

### [3:05 – 4:40] Bloque 3: Vílchez — Servidor WebSocket Propio en Node.js y Salas por Distrito
> **[En pantalla: Abrir `server/server.js`, resaltar `WebSocketServer` y el `Map` de salas]**

**Vílchez:**  
"Gracias Diego. En la Etapa 2 de laboratorio, el requisito era dotar a Quadrate pe de comunicación bidireccional en tiempo real sin depender de servicios de terceros como Pusher o Firebase.

Construimos un servidor WebSocket autónomo en Node.js sobre el estándar RFC 6455 en el puerto 3001, utilizando la biblioteca ligera `ws`. 

Observen la línea 7 de `server.js`: implementamos un mapa de conjuntos en memoria:  
`const salas = new Map(); // clave: room, valor: Set<WebSocket>`

Cuando un cliente se conecta, envía un mensaje JSON con la acción `join-room`. El servidor registra su socket dentro de una sala lógica (`distrito:san-isidro`, `distrito:miraflores` o `red-general`).

Cuando una garita publica una alerta con `publish-notification`, el servidor recupera el `Set` de clientes suscritos a esa sala específica y difunde el payload `notification:new` exclusivamente a ellos, verificando antes que `cliente.readyState === WebSocket.OPEN`.

Al desconectarse un cliente, el evento `close` remueve el socket del conjunto, y si la sala queda vacía, ejecuta `salas.delete(room)`, garantizando **cero fugas de memoria (*memory leaks*)** en el proceso Node.js.

Paso con Cueva para explicar la integración en React mediante el custom hook."

---

### [4:40 – 6:20] Bloque 4: Cueva — Hook Cliente `useExperienceSocket`, Ciclo de Vida y Cleanup
> **[En pantalla: Abrir `src/js/react/hooks/use-experience-socket.js`, resaltar el return del `useEffect`]**

**Cueva:**  
"Gracias Vílchez. En el cliente React construimos el custom hook `useExperienceSocket(sala)`. Su función es ser el puente entre el socket del sistema operativo y nuestro `NotificationContext`.

Observen la integración:
1. Al montarse el hook, se instancia `new WebSocket("ws://localhost:3001")`. Al emitirse el evento `onopen`, enviamos inmediatamente el handshake de suscripción con `join-room` para la sala del distrito activo.
2. Al dispararse `onmessage`, parseamos el payload y en lugar de manipular variables locales, invocamos directamente `addNotification(data.payload)`. Esto demuestra que **WebSocket es el protocolo de transporte y Context API es el distribuidor de estado en la UI**.

Un aspecto evaluado con máxima rigurosidad en la rúbrica es la **función de limpieza (*cleanup*) del `useEffect`**:  
Observen las líneas 25 a 29: cuando el usuario cambia de vista o desmonta el componente, retornamos:  
```javascript
return () => {
  if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
    socket.close();
  }
};
```
Esto asegura que no queden sockets zombis en segundo plano enviando peticiones ni saturando puertos locales.

Le doy el pase a Víctor para ver las pruebas multiusuario y la accesibilidad."

---

### [6:20 – 8:00] Bloque 5: Víctor — Pruebas de Aislamiento de Salas, Accesibilidad y Cierre
> **[En pantalla: Demostración en vivo de 2 ventanas de navegador lado a lado + código de `AlertaToast.jsx`]**

**Víctor:**  
"Gracias Cueva. Para validar la arquitectura ejecutamos el experimento multiusuario exigido:

Observen en pantalla: tenemos dos navegadores conectados simultáneamente:
- Ventana A en `distrito:san-isidro`.
- Ventana B en `distrito:miraflores`.

*(Acción en vivo de 5 segundos)*: Emitimos una alerta de 'Aforo Crítico (94%)' en San Isidro. Como pueden ver, la Ventana A actualiza su campana instantáneamente en menos de 12 milisegundos, mientras que la Ventana B permanece inalterada. Esto demuestra que **el particionamiento en salas del servidor funciona sin fugas de datos**.

Respecto a la **Accesibilidad Universal (WCAG 2.1)**:
En `AlertaToast.jsx`, el banner flotante está encapsulado en un contenedor semántico con:  
`role="status"` y `aria-live="polite"`.  
Esto permite que los lectores de pantalla anuncien la alerta de la garita de forma auditiva y educada, sin interrumpir la lectura del conductor. Además, `NotificationBell` implementa `aria-haspopup="dialog"` y anuncia dinámicamente el total de alertas pendientes.

**Conclusión del equipo:**  
Consolidamos una arquitectura desacoplada: Context API eliminó el 100% del prop drilling en la interfaz, y nuestro servidor WebSocket en Node.js entrega telemetría segmentada en tiempo real con limpieza garantizada.

Quedamos a su disposición para sus preguntas, profesor."

---
*Fin del Guion Maestro — Semana 10 (Tiempo exacto: 8 minutos).*
