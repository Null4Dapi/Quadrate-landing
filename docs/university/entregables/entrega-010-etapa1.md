# Guía de Trabajo

#### _Desarrollo Web Full Stack Frontend — Context API y Gestión del Estado Compartido_

Semana 10 | Proyecto integrador: Plataforma Web de Experiencias Interactivas — Quadrate pe

Producto articulador: Arquitectura de estado global con Context API (`NotificationContext` y `ThemeContext`) para eliminación de prop drilling en el centro de operaciones y alertas de cocheras en Lima Metropolitana.

---

## 1. Datos generales

| Elemento | Descripción |
| --- | --- |
| **Semana** | 10 |
| **Tema** | Context API, Provider, useContext, erradicación de Prop Drilling y estado derivado |
| **Modalidad** | Trabajo práctico en equipo |
| **Duración sugerida** | 3 horas |
| **Requisitos previos** | MVP de Semana 8, componentes tipados con TypeScript y animaciones de Semana 9 |
| **Entregable** | `NotificationContext` tipado, `ThemeContext` operativo y componentes consumidores integrados |
| **Equipo de desarrollo** | Grupo 04 · Sección 301 · Ciclo V |
| **Integrantes** | Pando Alanzo, Diego Iglesia (202310012)<br>Tapullima Herrera, Luciana del pilar (202310045)<br>Mendo Ruiz, Manuel (202310078)<br>Cueva Fabian, Eduardo (202310091)<br>Vilchez, José (202310103) |
| **Docente principal** | Mag. Ing. Juan Carlos Ramos |

---

## 2. Situación problemática

En la plataforma **Quadrate pe**, la vista interactiva de monitoreo (`Quadrate Live`) conecta a conductores con playas de estacionamiento georreferenciadas en distritos de alta congestión (San Isidro, Miraflores, Surco, San Borja). Durante las semanas 8 y 9, los estados de la interfaz —tales como la selección de cochera, el contador de tiempo de sesión y la telemetría en vivo— residían de forma aislada en el componente raíz `QuadrateLiveApp`.

A medida que el sistema creció para incluir una campana de notificaciones operativas (`NotificationBell`) en la barra superior de `SaludoUsuario`, un panel desplegable de historial (`NotificationPanel`) y alertas de cambio tarifario y aforo crítico, nos enfrentamos a un problema crítico de **Prop Drilling**:
1. Para que el botón de la campana en `SaludoUsuario` mostrara el número de alertas no leídas, debíamos pasar propiedades reactivas a través de componentes intermedios que no las consumían ni necesitaban saber de su existencia.
2. Cada evento asíncrono entrante obligaba a re-renderizar todo el árbol jerárquico superior, degradando la reactividad de la aplicación.
3. Se carecía de un mecanismo desacoplado para conmutar el tema visual entre la visualización diurna de la landing y el **Modo Vigilancia Nocturna / Monitoreo de Garita** requerido por operadores de estacionamiento en turnos de madrugada.

Como equipo, requerimos establecer una arquitectura limpia basada en **Context API** nativa de React para centralizar el flujo de datos de alertas y preferencias de visualización, respetando la regla innegociable de cero librerías pesadas y separando de forma nítida el estado local del estado compartido.

---

## 3. Resultado de aprendizaje

Al finalizar esta etapa, como equipo diseñamos y estructuramos la provisión de estado global mediante `NotificationContext` y `ThemeContext` en React, erradicamos el acoplamiento por retransmisión de propiedades (`prop drilling`), modelamos estados derivados normalizados (`unreadCount`) y definimos el contrato de eventos bidireccionales que consumirá el servidor WebSocket en la Etapa 2 (Laboratorio), fundamentando cada decisión técnica desde los estándares de arquitectura de software.

---

## 4. Conceptos clave aplicados

| Concepto | Uso en Quadrate pe | Implementación en el proyecto |
| --- | --- | --- |
| **Prop drilling** | Detección del transporte artificial de callbacks y contadores de alerta a través de contenedores intermedios. | Diagnóstico del árbol `QuadrateLiveApp → HeaderOperativo → SaludoUsuario → NotificationBell`, eliminando props intermedias. |
| **Context** | Canal declarativo que provee datos globales sin acoplar componentes hijos. | Definición de `NotificationContext` y `ThemeContext` en `src/js/react/context/`. |
| **Provider** | Componente contenedor que inyecta los valores y despachadores al árbol de la vista en vivo. | `<NotificationProvider>` y `<ThemeProvider>` envolviendo el montaje de `QuadrateLiveApp`. |
| **useContext** | Hook nativo de suscripción reactiva directa al canal de datos. | Custom hooks encapsulados `useNotifications()` y `useTheme()` con guardas de validación en tiempo de ejecución. |
| **Estado derivado** | Cálculo dinámico sin almacenamiento redundante en memoria. | `const unreadCount = notifications.filter(n => !n.read).length;` calculado puramente en render sin estados duplicados. |
| **Normalización** | Estructura homogénea e inmutable para las alertas emitidas por las garitas de Lima. | Contrato `Notification` con identificador único (`id`), distrito, timestamp ISO y bandera booleana `read`. |
| **ThemeContext** | Conmutación del entorno visual según la iluminación de la garita. | Alternancia entre tema `"light"` (editorial corporativo) y `"dark"` (alto contraste para garitas nocturnas). |

---

## 5. Diagnóstico de arquitectura y erradicación de prop drilling

### 5.1. Análisis del árbol de componentes previo (Semana 9)
En la versión previa, `QuadrateLiveApp` concentraba más de seis estados mediante `useState` independientes:
- `cocheraSeleccionada`
- `eventosTelemetria`
- `estadoWs`
- `estaPausado`
- `segundosTranscurridos`
- `distritoSeleccionado`

Para actualizar el feed y el contador de avisos, `QuadrateLiveApp` transfería `eventosTelemetria` a `SaludoUsuario` y a `MonitorActividad`, generando una cascada frágil donde cualquier alteración en la firma de las funciones reventaba los contratos de los componentes intermedios.

### 5.2. Propuesta de arquitectura centralizada con Providers
Diseñamos un esquema de encapsulamiento jerárquico limpio:
```
<ThemeProvider>
  <NotificationProvider>
    <QuadrateLiveApp>
      ├── <BarraOperativaCaseta>
      │     └── <NotificationBell />  --> consume useNotifications() directo
      ├── <CatalogoCocheras />        --> estado local de selección y filtros
      ├── <NotificationPanel />       --> consume useNotifications() directo
      └── <ToastAlertaFlotante />     --> consume useNotifications() directo
    </QuadrateLiveApp>
  </NotificationProvider>
</ThemeProvider>
```

### 5.3. Justificación técnica de estado local vs estado compartido
- **Estado Local (`useState`):** Pertenecen exclusivamente al componente que los origina: el término de búsqueda por texto, la pestaña de duración en el `SimuladorReserva` (60, 90, 120 min) y el acordeón abierto. Ningún otro componente necesita conocer estos valores.
- **Estado Compartido (`Context API`):** Notificaciones emitidas por garitas (afectan la campana, el panel y las alertas emergentes) y el tema de contraste visual (afecta a toda la interfaz de la consola). Centralizarlos en Context evita la polución de props y desacopla la lógica de negocio.

---

## 6. Modelo de datos y contratos de tipos

### 6.1. Contrato de Notificación Operativa (`Notification`)
```typescript
export type TipoAlertaOperativa =
  | "aforo_critico"
  | "tarifa_dinamica"
  | "reserva_eta"
  | "checkin_lpr"
  | "mantenimiento";

export interface Notification {
  readonly id: string;
  readonly title: string;
  readonly message: string;
  readonly distrito: string;
  readonly tipo: TipoAlertaOperativa;
  readonly createdAt: string; // Formato ISO 8601
  readonly read: boolean;
}
```

### 6.2. Interfaz del contexto (`NotificationContextValue`)
```typescript
export interface NotificationContextValue {
  readonly notifications: readonly Notification[];
  readonly unreadCount: number;
  readonly addNotification: (item: Omit<Notification, "read">) => void;
  readonly markAsRead: (id: string) => void;
  readonly clearNotifications: () => void;
}
```

### 6.3. Interfaz del contexto de tema de caseta (`ThemeContextValue`)
```typescript
export type ThemeMode = "light" | "dark";

export interface ThemeContextValue {
  readonly theme: ThemeMode;
  readonly toggleTheme: () => void;
}
```

### 6.4. Contrato compartido con Laboratorio (`ExperienceNotificationEvent`)
Define la estructura del payload WebSocket emitido por el servidor Node.js en la Etapa 2:
```typescript
export interface ExperienceNotificationEvent {
  readonly event: "notification:new";
  readonly room: string; // ej. "distrito:san-isidro" o "red-general"
  readonly payload: {
    readonly id: string;
    readonly title: string;
    readonly message: string;
    readonly distrito: string;
    readonly tipo: TipoAlertaOperativa;
    readonly timestamp: string;
  };
}
```

---

## 7. Actividades de desarrollo planificadas

### Actividad 1. Diagnóstico e inventario de props retransmitidas
Identificamos y documentamos en la matriz de deuda técnica los 4 niveles de retransmisión existentes en `QuadrateLiveApp`, categorizando qué datos migran al Provider y cuáles se mantienen como estado local estricto.

### Actividad 2. Creación del NotificationContext y Provider
Implementación del módulo `src/js/react/context/notification-context.jsx` con:
- Estado inmutable de lista mediante función reductora o array spread: `setNotifications(prev => [nueva, ...prev])`.
- Cálculo inline memoizable del estado derivado `unreadCount`.
- Custom hook `useNotifications()` con verificación defensiva: si el valor recuperado es `undefined`, lanza un error explícito: `"useNotifications debe consumirse dentro de un NotificationProvider"`.

### Actividad 3. Envoltura jerárquica de la aplicación con Providers
Inyección de `<ThemeProvider>` y `<NotificationProvider>` en el punto de anclaje de React (`src/js/react/quadrate-live-root.js`), dejando a la vista interactiva con acceso inmediato a los canales sin requerir props en el contenedor padre.

### Actividad 4. Implementación de componentes consumidores (NotificationBell y NotificationPanel)
- `NotificationBell`: Renderiza el icono SVG de campana con insignia numérica reactiva (`unreadCount`), atributo `aria-label={`Alertas operativas: ${unreadCount} no leídas`}` y control de apertura del panel.
- `NotificationPanel`: Despliega el listado con tarjetas estilizadas en BEM, botón "Marcar como leída" (`markAsRead(id)`) y acción global "Limpiar historial" (`clearNotifications()`).

### Actividad 5. Especificación del contrato puente para Laboratorio
El método `addNotification` queda expuesto como la única puerta de entrada oficial para eventos de red. Cuando el cliente WebSocket reciba un mensaje del servidor en la Etapa 2, lo transformará al contrato y llamará directamente a `addNotification()`.

---

## 8. Reto aplicado: Simulación de alertas operativas de garitas

Diseñamos un panel de pruebas de desarrollo confinado en el pie de la consola de telemetría:
- Un botón "Simular Aforo Crítico (San Isidro)" que inyecta una alerta de ocupación al 94%.
- Un botón "Simular Tarifa Valle (Miraflores)" que anuncia la activación de la tarifa promocional de S/ 4.00 la hora.
- Se comprueba visualmente que al presionar el botón:
  1. La campana en la barra superior incrementa su insignia roja de forma instantánea.
  2. El panel despliega la tarjeta correspondiente con su respectivo badge.
  3. Al pulsar "Marcar como leída", la insignia decrementa de forma reactiva sin re-renderizar el catálogo de cocheras ni perder la selección de plaza actual.

---

## 9. Pruebas de aceptación y criterios de calidad

| ID | Criterio de Calidad | Procedimiento de Validación | Resultado Esperado | Estado |
| --- | --- | --- | --- | --- |
| **PAC1** | Provider montado correctamente | Renderizar `QuadrateLiveApp` dentro de `NotificationProvider`. | Componentes acceden al estado sin arrojar excepciones de contexto nulo. | Conforme |
| **PAC2** | Consumo defensivo fuera del Provider | Invocar `useNotifications()` en un componente aislado sin Provider. | El hook lanza `Error: useNotifications debe consumirse dentro de un NotificationProvider`. | Conforme |
| **PAC3** | Inserción y reactividad | Despachar alerta mediante `addNotification()`. | El elemento aparece primero en la lista y `unreadCount` suma 1 de inmediato. | Conforme |
| **PAC4** | Estado derivado y lectura | Invocar `markAsRead(id)` sobre un elemento no leído. | `notification.read` cambia a `true` y `unreadCount` se reduce sin alterar el total de alertas. | Conforme |
| **PAC5** | Erradicación total de Prop Drilling | Auditar los props de `SaludoUsuario` y `QuadrateLiveApp`. | Cero retransmisión de callbacks o listas de eventos a través de contenedores intermedios. | Conforme |
| **PAC6** | Tipado y consistencia de contratos | Verificar compilación y tipos TypeScript / JSDoc estricto. | Interfaces `Notification` y `NotificationContextValue` sin tipos `any`. | Conforme |

---

## 10. Preguntas orientadoras de reflexión

### Pregunta 1: ¿Qué diferencia hay entre estado local y estado compartido?
*Respuesta del equipo:*
El **estado local** es aquel cuya vigencia, impacto y ciclo de vida conciernen únicamente a un componente individual (por ejemplo, el texto en un campo de búsqueda, el estado abierto/cerrado de un menú o el tiempo de permanencia seleccionado en una tarjeta). No tiene repercusión sobre otros módulos.

El **estado compartido**, en cambio, representa información que múltiples componentes ubicados en ramas no contiguas del árbol jerárquico necesitan leer o modificar de manera sincronizada (por ejemplo, el catálogo de alertas operativas que alimenta la campana del Header, la lista del panel lateral y el banner de advertencia). Centralizarlo en Context API asegura una única fuente de la verdad (*single source of truth*), eliminando inconsistencias entre vistas.

### Pregunta 2: ¿Por qué Context API no reemplaza a WebSockets?
*Respuesta del equipo:*
Porque operan en capas de abstracción completamente diferentes de la arquitectura:
- **WebSockets** es un **protocolo de transporte de red bidireccional (RFC 6455)** sobre TCP. Su función es mantener un socket persistente y de ultra-baja latencia entre el navegador y el servidor para transmitir eventos en tiempo real.
- **Context API** es un **patrón arquitectónico de inyección de dependencias y gestión de estado dentro del runtime de React**. No transporta datos por la red; se encarga de propagar reactivamente los datos ya recibidos a los componentes que los necesitan.

En nuestra arquitectura, WebSockets es el *emisor de eventos de transporte* y Context API es el *distribuidor reactivo en la UI*.

### Pregunta 3: ¿Qué ventaja tiene una conexión persistente frente a consultar cada pocos segundos (polling)?
*Respuesta del equipo:*
1. **Eficiencia de red y sobrecarga HTTP:** El polling periódico (`setInterval` con `fetch`) envía cabeceras HTTP completas (cookies, user-agents, headers de seguridad) cada 3 o 5 segundos, consumiendo ancho de banda incluso cuando no hay cambios en las cocheras. WebSocket realiza un solo handshake HTTP inicial y luego transmite tramas binarias mínimas (frames de pocos bytes).
2. **Latencia inmediata:** Con polling, un cambio crítico de aforo o tarifa tarda en reflejarse hasta que se cumpla el ciclo de consulta (hasta 5 segundos de retraso). Con WebSocket, la garita emite el cambio y el servidor lo empuja instantáneamente (*server push*) al conductor en milisegundos.
3. **Escalabilidad del servidor:** Miles de clientes haciendo polling saturan el servidor web con peticiones concurrentes continuas; con WebSockets, el servidor gestiona conexiones inactivas con mínimo consumo de CPU.

### Pregunta 4: ¿Por qué el servidor debe controlar a qué room (sala) pertenece cada usuario?
*Respuesta del equipo:*
Por dos motivos fundamentales: **eficiencia de distribución y aislamiento de dominio**:
- **Optimización de recursos:** Si un conductor está buscando cochera exclusivamente en San Isidro, es ineficiente y molesto que reciba alertas de aforo o incidencias de estacionamientos en Surco o Los Olivos. El particionamiento en salas (`distrito:san-isidro`, `distrito:miraflores`) permite al servidor difundir eventos únicamente a los sockets interesados (*pub/sub dirigido*), ahorrando procesamiento y tráfico de red.
- **Seguridad y privilegios:** En un entorno empresarial como Quadrate, los operadores de caseta de un operador privado deben recibir telemetría sensible de su propia garita (ingresos de caja, sensores LPR), la cual jamás debe filtrarse a conductores públicos en la sala general.

### Pregunta 5: ¿Qué debe ocurrir en la interfaz cuando llega una notificación nueva?
*Respuesta del equipo:*
Desde la perspectiva de UI/UX profesional y accesibilidad:
1. **Señal visual discreta y no bloqueante:** El contador de la campana (`NotificationBell`) debe actualizar su número de forma inmediata con una microinteracción sutil (pulsación o cambio de color), sin interrumpir la navegación del usuario.
2. **Notificación emergente efímera (Toast):** Debe desplegarse una alerta flotante en el margen superior de la pantalla durante 4 a 5 segundos con el resumen del evento, permitiendo cerrarla manualmente.
3. **Accesibilidad para lectores de pantalla:** La alerta debe estar contenida en una región ARIA con `role="status"` y `aria-live="polite"`, permitiendo que el software de asistencia la vocalice sin interrumpir lo que el usuario estaba leyendo.
4. **Persistencia en el panel de historial:** La alerta debe agregarse al inicio del listado en el `NotificationPanel`, marcada con estado visual de "no leída" hasta que el usuario decida interactuar con ella.

---

## 11. Entregables y organización del equipo

- **Repositorio de código:** Rama `feature/context-api-semana10` con la estructura modular de `src/js/react/context/`.
- **Archivos entregados:** `notification-context.jsx`, `theme-context.jsx`, contratos de interfaz `notification.ts` y componentes consumidores.
- **Matriz de evidencias:** Capturas comparativas de la consola de desarrollo demostrando la ausencia de advertencias y la erradicación de props en cascada.
- **Video demostrativo:** Presentación técnica de 8 minutos exponiendo la arquitectura de proveedores y el flujo reactivo.

---

## 12. Puente hacia la Semana 11

La culminación de esta Etapa 1 en Desarrollo Web establece los cimientos para la conexión con el servidor propio en el Laboratorio (Etapa 2) y sienta la arquitectura de datos que en la **Semana 11** se integrará formalmente con APIs REST externas mediante `fetch` asíncrono y persistencia en servicios web de producción.

---

## 13. Referencias técnicas

- React Documentation — Passing Data Deeply with Context: https://react.dev/learn/passing-data-deeply-with-context
- React Documentation — Scaling Up with Reducer and Context: https://react.dev/learn/scaling-up-with-reducer-and-context
- RFC 6455 — The WebSocket Protocol: https://datatracker.ietf.org/doc/html/rfc6455
- W3C Web Content Accessibility Guidelines (WCAG) 2.1 — Live Regions: https://www.w3.org/TR/WCAG21/#live-regions
