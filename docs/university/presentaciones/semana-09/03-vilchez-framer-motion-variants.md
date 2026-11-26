# Ficha Individual de Exposición — Vílchez (3:05 – 4:40)
### *Etapa 2: Articulación con Framer Motion, Animación de Entrada y Variants*

**Tiempo asignado:** 1 minuto con 35 segundos (Máximo 2:00 min)  
**Objetivo principal:** Demostrar cómo se conectó el componente tipado de React con Framer Motion sin inflar el bundle ni modificar el contrato de TypeScript, aplicando el patrón de Variants.

---

## 1. Código a Proyectar en Pantalla

Abrir en el editor: sección de animación en `src/js/react/tarjeta-cochera.tsx` (o archivo de integración)

```javascript
// 1. Declaración de Variants reutilizables y limpios
const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" }
  }
};

// 2. Aplicación directa sobre el contenedor semántico
<motion.article
  variants={cardVariants}
  initial="hidden"
  animate="visible"
  className="quadrate-live__card"
>
  {/* Contenido tipado intacto */}
</motion.article>
```

---

## 2. Puntos Clave a Señalar con el Mouse (Checklist)

1. **Línea 2:** Señalar la constante `cardVariants`. Destacar la separación entre estados visuales (`hidden`, `visible`) y la estructura JSX.
2. **Líneas 5–6:** Señalar `duration: 0.35` y `ease: "easeOut"`. Explicar que 350ms es el estándar perceptual para no crear demoras artificiales.
3. **Línea 11:** Señalar `<motion.article>`. Resaltar que no alteramos ninguna prop previa (`cochera`, `onSeleccionarCochera`), preservando intacto el contrato de TypeScript de la Etapa 1.

---

## 3. Discurso Palabra por Palabra (Directo al Grano)

> "Gracias Diego. En la Etapa 2 de laboratorio, el desafío fue incorporar movimiento inmersivo sin romper el contrato tipado ni violar nuestra regla innegociable de mantener una landing liviana.
> 
> Para lograrlo, reemplazamos el elemento semántico `<article>` por `<motion.article>` de la API de Motion. No modificamos una sola prop de las que explicó Diego; la animación actúa exclusivamente como una capa visual envolvente.
> 
> Para evitar animaciones desordenadas o repetitivas, implementamos el patrón declarativo de **Variants** en la constante `cardVariants`. Definimos dos estados puros:
> 1. `hidden`: opacidad 0 con un desplazamiento inicial en el eje Y de 16 píxeles hacia abajo.
> 2. `visible`: opacidad 1 y posición neutra en Y de 0 píxeles.
> 
> En la transición aplicamos una duración exacta de 350 milisegundos con curva de desaceleración `easeOut`. Esto garantiza una entrada limpia y fluida al recargar o filtrar distritos en Lima, permitiendo que el conductor perciba la actualización de cocheras sin saltos bruscos ni demoras artificiales para interactuar.
> 
> Paso con mi compañero Cueva para revisar las microinteracciones táctiles y la optimización de viewport."

---

## 4. Preguntas Rápidas del Docente y Respuestas Relámpago

* **P: ¿Por qué es preferible usar `variants` en lugar de pasar las propiedades directamente en `animate={{ ... }}`?**  
  * **R:** *"Porque las `variants` desacoplan la lógica de animación del renderizado, permiten orquestación jerárquica padre-hijo (staggering) y facilitan la reutilización en múltiples componentes del catálogo."*

* **P: ¿Cómo influye la animación de entrada en la experiencia de usuario (UX)?**  
  * **R:** *"Le comunica al conductor que los datos se han refrescado con éxito tras un filtro o recarga de aforo en vivo, eliminando la sensación de interfaz congelada sin retrasar el acceso a la información."*
