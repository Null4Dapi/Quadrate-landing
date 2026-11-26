# Ficha Individual de Exposición — Luciana (0:00 – 1:30)
### *Etapa 1: Diagnóstico de Prop Drilling, Arquitectura de Contextos y Modelos de Datos*

**Tiempo asignado:** 1 minuto con 30 segundos (Máximo 2:00 min)  
**Objetivo principal:** Explicar el diagnóstico técnico de la deuda previa por Prop Drilling, justificar la separación entre estado local vs compartido y presentar los contratos de datos de Context API.

---

## 1. Código y Diagrama a Proyectar en Pantalla

Abrir en el editor: `src/types/notification.ts` (o sección correspondiente en el código unificado)

```typescript
// Contrato inmutable para las alertas operativas de garitas en Lima
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
  readonly createdAt: string; // ISO 8601
  readonly read: boolean;
}

export interface ThemeContextValue {
  readonly theme: "light" | "dark";
  readonly toggleTheme: () => void;
}
```

---

## 2. Puntos Clave a Señalar con el Mouse (Checklist)

1. **Explicar el árbol de Prop Drilling:** Señalar la cadena `QuadrateLiveApp → HeaderOperativo → SaludoUsuario → NotificationBell` que existía en la Semana 9.
2. **Líneas 2–7:** Señalar `TipoAlertaOperativa`. Explicar que son tipos literales para las incidencias de las garitas.
3. **Líneas 9–17:** Señalar `readonly id`, `readonly read: boolean`. Explicar la inmutabilidad de los eventos.
4. **Línea 19:** Señalar `ThemeContextValue` con modo claro (editorial) y oscuro (garita nocturna).

---

## 3. Discurso Palabra por Palabra (Directo al Grano)

> "Buenos días profesor. En la Semana 10 escalamos la consola de monitoreo `Quadrate Live` para incorporar alertas operativas en vivo (aforo crítico, tarifas dinámicas e ingresos LPR en cocheras de Lima).
> 
> En la arquitectura previa de la Semana 9 identificamos un grave problema de **Prop Drilling**: para que el botón de la campana (`NotificationBell`) en la barra superior supiera cuántas alertas no leídas existían, debíamos retransmitir callbacks y arreglos a través de 4 niveles jerárquicos (`QuadrateLiveApp → HeaderOperativo → SaludoUsuario → NotificationBell`). Esto acoplaba componentes intermedios que no necesitaban esos datos y provocaba re-renderizados innecesarios en todo el árbol ante cada evento entrante.
> 
> Para erradicarlo, dividimos la responsabilidad:
> 1. **Estado Local con `useState`:** Exclusivo de cada componente (búsqueda por texto o duración en el simulador).
> 2. **Estado Compartido con Context API:** Notificaciones operativas y el tema visual de garita.
> 
> Observen el contrato formal en pantalla: definimos `Notification` con campos inmutables (`id`, `tipo`, `distrito`, `timestamp` y bandera `read`). Además, tipamos `ThemeContextValue` con los modos `'light'` editorial y `'dark'` de alto contraste para garitas nocturnas.
> 
> Paso con Diego para ver la implementación del Provider y el consumo defensivo."

---

## 4. Preguntas Rápidas del Docente y Respuestas Relámpago

* **P: ¿Por qué no pusieron toda la información de la aplicación en Context API?**  
  * **R:** *"Porque saturar Context con estados locales de UI (como textos de inputs o acordeones) provoca re-renderizados innecesarios en todos los consumidores cada vez que se teclea una letra. Solo compartimos en Context lo que múltiples ramas desconectadas necesitan consumir."*

* **P: ¿Por qué marcaron los atributos de `Notification` como `readonly`?**  
  * **R:** *"Para garantizar inmutabilidad funcional en React: un evento emitido por una garita no debe mutarse directamente en memoria, sino mediante copias con el operador spread (`[nueva, ...prev]`)."*
