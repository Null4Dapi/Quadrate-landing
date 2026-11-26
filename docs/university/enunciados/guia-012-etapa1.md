**UNIVERSIDAD AUTÓNOMA DEL PERÚ** 

# **GUÍA DE TRABAJO – SEMANA 12** 

### **_Desarrollo Web Full Stack Frontend_** 

### **_Next.js App Router: rutas, layouts y Server/Client Components_** 

## **1. Contexto** 

La Plataforma Web de Experiencias Interactivas, desarrollada durante las semanas previas, evoluciona hacia Next.js. Esta guía se centra en la estructura y arquitectura de páginas. La guía de laboratorio complementaria se ocupará de medir y diagnosticar el rendimiento; no repetiremos esas actividades aquí. 

## **2. Resultado de aprendizaje** 

Organiza una aplicación web con App Router, rutas y layouts; distingue Server y Client Components y obtiene datos para presentar contenido, justificando las decisiones. 

## **3. Acuerdos de trabajo** 

- Trabajar sobre el proyecto común de la Plataforma Web de Experiencias. 

- Actualizar repositorio, crear rama semana-12-nextjs y registrar un commit al finalizar. 

- Usar TypeScript, nombres consistentes y componentes claros. 

- La auditoría Lighthouse, métricas y diagnóstico se reservan para la guía de laboratorio. 

- Cada integrante debe comprender y explicar el código que presenta. 

## **4. Actividades** 

#### **Actividad 1. Preparación** 

1. Verificar Node.js y npm; anotar versiones. 

2. Crear o reutilizar proyecto Next.js 15 con TypeScript, ESLint y App Router. 

3. Ejecutar npm run dev y confirmar localhost:3000 antes de modificar. 

4. Reconocer app/, public/, package.json y tsconfig.json. 

#### **Actividad 2. Crear páginas** 

|**Archivo**|**Contenido mínimo**|
|---|---|
|**app/page.tsx**|**Inicio: título, bienvenida, descripcióny tarjeta de experiencia.**|
|**app/about/page.tsx**|**About:propósito, equipo o descripción de laplataforma.**|



Ambas páginas deben exportar una función default, presentar contenido propio y funcionar al ingresar directamente a su URL. 

#### **Actividad 3. Layout compartido** 

5. En app/layout.tsx conservar html y body. 

6. Añadir header con identidad, nav con enlaces Inicio y Acerca y footer. 

7. Insertar {children} donde debe aparecer la página activa. 

8. No duplicar header/footer en page.tsx. 

9. Aplicar CSS, espaciado y diseño adaptable. 

#### **Actividad 4. Server y Client Components** 

Las páginas y layouts son Server Components por defecto. Conserven en servidor el contenido sin interacción y creen un componente cliente solo si necesita estado, eventos o API del navegador. 

- Crear un pequeño botón Favorito o contador con 'use client' al inicio del archivo. 

- Integrarlo en una página sin convertir todo el layout a cliente. 

- En la ficha explicar qué exige cliente y qué puede quedarse en servidor. 

#### **Actividad 5. Data fetching** 

Desde un Server Component asíncrono, consultar una API pública (p. ej., JSONPlaceholder), presentar un dato y contemplar error. En Next.js 15, revisar y declarar explícitamente la estrategia de caché/revalidación adecuada. 

#### **Actividad 6. Metadata** 

Definir metadata de Inicio y About: título y descripción. Explicar por qué se usa Metadata API en lugar de insertar manualmente etiquetas head. 

## **5. Pruebas de aceptación** 

|**Prueba**|**Criterio**|
|---|---|
|**Ruta /**|**Carga Inicio**|
|**Ruta /about**|**Carga About directamente**|
|**Navegación**|**Enlaces llevan a ambaspáginas**|
|**Layout**|**Header/footerpermaneceny contenido cambia**|
|**Interacción**|**Componente cliente responde**|
|**API**|**Dato visibley error contemplado**|
|**Metadata**|**Título depestaña identificable**|
|**Responsive**|**Usable en móvily escritorio**|



## **6. Entregable** 

- Repositorio con mini-app Next.js 15 integrada (o rama acordada). 

- Capturas de / y /about y de navegación/layout. 

- README con instalación y ejecución. 

- Ficha de arquitectura de máximo una página: archivos/rutas, Server vs Client y justificación, origen del dato. 

- Commit identificable semana-12-nextjs. 

## **7. Preguntas de reflexión** 

10. ¿Qué convención crea la ruta /about? 

11. ¿Por qué header y footer se implementan en layout? 

12. ¿Qué representa children? 

13. ¿Qué funcionalidades justifican 'use client'? 

14. ¿Qué ventajas y riesgos tiene obtener datos en servidor? 

15. ¿Qué cambió respecto a la aplicación React previa? 

## **8. Referencias** 

- Next.js App Router: https://nextjs.org/docs/app 

- Layouts & Pages: https://nextjs.org/docs/app/getting-started/layouts-and-pages 

- Server & Client: https://nextjs.org/docs/app/getting-started/server-and-client-components 

- Metadata: https://nextjs.org/docs/app/api-reference/functions/generate-metadata 

