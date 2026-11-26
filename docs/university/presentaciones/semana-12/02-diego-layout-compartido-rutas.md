# Ficha Individual de Exposición — Diego (1:30 – 3:05)
### *Etapa 1: Root Layout Compartido, Rutas y Preservación de `{children}`*

**Tiempo asignado:** 1 minuto con 35 segundos (Máximo 1:50 min)  
**Objetivo principal:** Demostrar cómo `app/layout.tsx` erradica la duplicación de código de cabecera y pie de página, explicar el rol de la prop `{children}` y evidenciar la navegación suave (*Soft Navigation*) mediante `<Link>`.

---

## 1. Código a Proyectar en Pantalla

Abrir en el editor de código: `docs/university/presentaciones/semana-12/02-diego-codigo.tsx` (o `app/layout.tsx`).

```tsx
export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="quadrate-app">
        <header className="header-app">
          <nav className="header-app__nav">
            <Link href="/" className="header-app__link">Inicio</Link>
            <Link href="/about" className="header-app__link">Acerca de</Link>
          </nav>
        </header>

        {/* Inyección dinámica de la página activa */}
        <main className="main-content">
          {children}
        </main>

        <footer className="footer-app">...</footer>
      </body>
    </html>
  );
}
```

---

## 2. Puntos Clave a Señalar con el Mouse (Checklist)

1. **Líneas 1–5:** Señalar `children: React.ReactNode`. Explicar que representa dinámicamente la vista activa (`/` o `/about`) montada por Next.js.
2. **Líneas 7–12:** Señalar la etiqueta `<header>` y los enlaces `<Link>`. Resaltar que pertenecen al layout y no están duplicados en `page.tsx` ni en `about/page.tsx`.
3. **Línea 15:** Señalar el nodo `<main>{children}</main>`. Demostrar cómo Next.js reemplaza únicamente el contenido interno durante la navegación suave.

---

## 3. Discurso Palabra por Palabra (Directo al Grano)

> "Gracias Luciana. En la Diapositiva 2 y en `02-diego-codigo.tsx` vemos el corazón arquitectónico de la aplicación: `app/layout.tsx`.
>
> En la versión previa, cada vez que navegábamos entre vistas, el encabezado y el pie de página se desmontaban y reconstruían en el DOM, provocando parpadeos visuales y pérdida del scroll. En Next.js 15, `RootLayout` actúa como un caparazón permanente.
>
> Observen la línea 26: inyectamos la prop tipada `{children}` de tipo `React.ReactNode`. Aquí es donde Next.js monta dinámicamente la página activa: `app/page.tsx` para la raíz `/` o `app/about/page.tsx` para `/about`. Los elementos estructurales `<header>` y `<footer>` jamás se re-renderizan ni se descargan por duplicado.
>
> Además, en las líneas 18 a 22 usamos el componente `<Link>` de Next.js. Esto habilita **navegación suave por el cliente (*Soft Navigation*)**: al hacer clic en 'Acerca de', Next.js únicamente solicita el payload RSC de la nueva página y reemplaza el nodo `{children}`, manteniendo la cabecera fija y otorgando una experiencia de velocidad nativa.
>
> Paso el turno a Vílchez para revisar cómo confinamos la interactividad."

---

## 4. Preguntas Trampa del Docente y Respuestas Blindadas

**P: ¿Qué pasa si colocas una etiqueta `<header>` también dentro de `app/page.tsx`?**  
*R:* "Violaríamos la regla de oro de la Actividad 3 de la guía ('No duplicar header/footer en page.tsx'). El usuario vería dos cabeceras superpuestas o una duplicación redundante en el DOM semántico, degradando la accesibilidad y el diseño."

**P: ¿Por qué usamos `<Link href="...">` en lugar de una etiqueta tradicional `<a href="...">`?**  
*R:* "Porque la etiqueta `<a>` desencadena una recarga completa de la ventana del navegador (*Hard Navigation*), destruyendo el estado en memoria, solicitando todo el HTML desde cero y causando parpadeo en pantalla. `<Link>` intercepta el evento de clic, realiza una navegación suave y precarga la ruta en segundo plano."
