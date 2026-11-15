# Guía de Trabajo

#### _Desarrollo Web Full Stack Frontend | Integración con APIs usando TanStack Query_

Semana 11 | Proyecto integrador: Plataforma Web de Experiencias Interactivas — Quadrate pe

Producto articulador: Módulo de catálogo dinámico basado en API con consumo REST vía TanStack Query, manejo riguroso de estados asíncronos (`isPending`, `isError`, `data`), demostración de caché inteligente con `staleTime` y paginación para la red de playas de estacionamiento en Lima Metropolitana.

---

## 1. Datos generales

| Elemento | Descripción |
| --- | --- |
| **Semana** | 11 |
| **Tema** | Consumo de APIs REST con TanStack Query, estados de carga y error, caché y paginación |
| **Modalidad** | Trabajo práctico colaborativo en equipo |
| **Duración sugerida** | 3 horas |
| **Requisitos previos** | Cierre de Semana 10 (Context API y WebSockets), Node.js, npm, proyecto Quadrate pe |
| **Entregable** | Módulo de catálogo conectado a API pública, QueryClientProvider único, hook `useExperiences`, paginación y caché comprobada |
| **Equipo de desarrollo** | Grupo 04 · Sección 301 · Ciclo V |
| **Integrantes** | Pando Alanzo, Diego Iglesia (202310012)<br>Tapullima Herrera, Luciana del pilar (202310045)<br>Mendo Ruiz, Manuel (202310078)<br>Cueva Fabian, Eduardo (202310091)<br>Vilchez, José (202310103) |
| **Docente principal** | Mag. Ing. Juan Carlos Ramos |

*Nota.* Elaboración propia.

---

## 2. Articulación de los dos cursos

| Curso | Responsabilidad | Producto |
| --- | --- | --- |
| **Desarrollo Web Full Stack Frontend** | Consumo REST con TanStack Query, loading/error, caché y paginación. | Catálogo dinámico basado en API. |
| **Laboratorio de Experiencias Web Inmersivas** | Migración de Context API a Zustand, persistencia e integración WebSocket. | Estado global y notificaciones en tiempo real. |

*Nota.* Elaboración propia.

Se parte estrictamente del mismo repositorio integrador y de la versión consolidada al cierre de la semana 10. No se crea una segunda aplicación ni proyectos aislados. El producto articulador unificado es: **catálogo dinámico + estado global + notificaciones en tiempo real**.

---

## 3. Resultado esperado

Al finalizar la presente guía, como equipo habremos alcanzado los siguientes objetivos técnicos:
* Configurar `QueryClient` y `QueryClientProvider` una sola vez en el punto de entrada de la aplicación.
* Definir tipos rigurosos en TypeScript y una función fetch reutilizable para el consumo del catálogo.
* Implementar el hook de consulta `useQuery` con `queryKey` compuesta y `queryFn` desacoplada.
* Manejar y renderizar de forma accesible los estados de carga (`isPending`), error (`isError`) y éxito (`data`).
* Implementar paginación reactiva y demostrar en vivo el comportamiento y reutilización de la memoria caché.
* Fundamentar con criterio arquitectónico la diferencia entre datos remotos del servidor y estado local/global de la interfaz de usuario.

---

## 4. Recursos y condiciones

* **Material conceptual:** Presentación de la Semana 11 entregada por el docente (fuente de conceptos, comandos y fragmentos técnicos).
* **Entorno técnico:** Repositorio de Quadrate pe, rama frontend acordada, Node.js (v20+), npm, VS Code y navegador web.
* **API REST pública de práctica:** JSONPlaceholder (`https://jsonplaceholder.typicode.com/posts`).
* **Seguridad y credenciales:** No se requiere API key privada, token de autorización ni almacenamiento de credenciales.

---

## 5. Preparación

1. Abrir el repositorio integrador de Quadrate pe y crear la rama de trabajo:
   `git checkout -b feature/week11-tanstack-query`
2. Ejecutar `npm install` y verificar la compilación y ejecución de la versión previa con `npm run dev`.
3. Identificar el componente de catálogo (`CatalogoCocheras`) y las tarjetas actuales en la interfaz.
4. Registrar la rama y el commit inicial limpio, asegurando no sobrescribir los avances consolidados en la semana 10.

---

## 6. Desarrollo autónomo paso a paso

### Actividad 1. Configurar TanStack Query

1. Instalar el paquete oficial de TanStack Query:
   `npm install @tanstack/react-query`
2. Crear una única instancia singleton de `QueryClient` en el archivo de inicio (`src/main.jsx` o `src/index.js`).
3. Envolver el componente raíz de la aplicación con `QueryClientProvider`, garantizando no duplicar Providers en el árbol de componentes.
4. Reiniciar el servidor de desarrollo y verificar que la aplicación compile sin advertencias ni errores en la consola.

```javascript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

// Envoltura en el montaje raíz
<QueryClientProvider client={queryClient}>
  <App />
</QueryClientProvider>
```

### Actividad 2. Definir el contrato de datos y el acceso a API

1. Crear el módulo `src/features/catalog/api.js` (o `api.ts` según la configuración del proyecto).
2. Definir el tipo/contrato del recurso `Experience` (o `CocheraRemota`) contemplando los campos `userId`, `id`, `title` y `body`.
3. Implementar la función asíncrona `getExperiences(page)` consumiendo el endpoint paginado con límite de 6 elementos:
   `GET /posts?_page={page}&_limit=6`
4. Comprobar la propiedad `response.ok` y disparar un error descriptivo si el código de estado HTTP no es exitoso.
5. Probar el endpoint directamente en el navegador y registrar la respuesta de muestra.

```typescript
export type Experience = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

export async function getExperiences(page: number): Promise<Experience[]> {
  const response = await fetch(`https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=6`);
  if (!response.ok) {
    throw new Error('No se pudo cargar el catálogo de experiencias');
  }
  return response.json();
}
```

### Actividad 3. Crear el hook de consulta

1. Crear el hook personalizado `useExperiences(page)` en un archivo desacoplado (`src/features/catalog/useExperiences.js`).
2. Configurar la `queryKey` como un arreglo compuesto `['experiences', page]` y asignar `queryFn` a `() => getExperiences(page)`.
3. Consumir el hook directamente desde el componente de presentación del catálogo.
4. Validar que la vista diferencie con claridad los tres estados principales: `isPending`, `isError` y `data`.

```javascript
import { useQuery } from '@tanstack/react-query';
import { getExperiences } from './api';

export function useExperiences(page) {
  return useQuery({
    queryKey: ['experiences', page],
    queryFn: () => getExperiences(page),
  });
}
```

### Actividad 4. Construir la vista

1. Renderizar cada elemento de la colección como una tarjeta visual, reutilizando los componentes editoriales del proyecto Quadrate pe.
2. Asignar de manera estricta `item.id` como propiedad `key` de React en la lista iterada.
3. Representar el estado de carga mediante un indicador semántico accesible con `role="status"` y texto informativo.
4. Renderizar el estado de fallo mediante un contenedor con `role="alert"` y un mensaje claro para el usuario.
5. Mantener la coherencia del diseño responsivo (CSS Grid / Flexbox), la navegación por teclado y las microinteracciones previas.

### Actividad 5. Implementar paginación

1. Crear el estado local `page` en el componente contenedor del catálogo con valor inicial `1`:
   `const [page, setPage] = useState(1);`
2. Incorporar controles de navegación interactivos: botones "Anterior" y "Siguiente".
3. Deshabilitar el botón "Anterior" mediante el atributo `disabled={page === 1}` para evitar consultas con índices inválidos.
4. Comprobar que al modificar `page` se dispare automáticamente la nueva consulta con la `queryKey` actualizada.
5. Regresar a una página previamente visitada y verificar en la pestaña Network que los datos se recuperan inmediatamente desde la memoria caché.

```javascript
const [page, setPage] = useState(1);
const { data, isPending, isError, error } = useExperiences(page);
```

### Actividad 6. Verificar caché y errores

1. Configurar un tiempo de frescura controlado (`staleTime: 1000 * 60 * 2` o 2 minutos) en las opciones de la consulta.
2. Navegar secuencialmente por las páginas 1 y 2, regresar a la página 1 y documentar el tiempo de respuesta instantáneo.
3. Simular un fallo de red desconectando la conexión o alterando temporalmente la URL del endpoint.
4. Comprobar que se despliegue el mensaje de error accesible y restablecer posteriormente el servicio.
5. Redactar la fundamentación técnica de por qué la caché en memoria del cliente no sustituye a una base de datos persistente.

---

## 7. Pruebas obligatorias

| Prueba | Procedimiento | Resultado esperado |
| --- | --- | --- |
| **Carga** | Abrir o recargar el catálogo. | Se despliega el indicador accesible de carga y posteriormente las tarjetas de datos. |
| **API** | Navegar entre páginas 1 y 2. | La consulta remota responde exitosamente y la vista actualiza el contenido. |
| **Paginación** | Pulsar "Anterior" en página 1 y "Siguiente". | "Anterior" permanece deshabilitado en página 1; "Siguiente" incrementa el índice y muestra nuevos registros. |
| **Caché** | Visitar página 1, luego 2 y regresar a 1. | Reutilización inmediata de datos desde caché mientras no se supere el `staleTime`. |
| **Error** | Simular URL inválida o desconexión de red. | Mensaje de error visible en pantalla con `role="alert"` sin romper la aplicación. |
| **Responsive** | Probar en viewport móvil (375 px) y escritorio (1200 px). | Las tarjetas y los controles de paginación se adaptan fluidamente sin desbordes horizontales. |

*Nota.* Elaboración propia.

---

## 8. Entregables

* **Repositorio de código:** Rama `feature/week11-tanstack-query` con código limpio, modular y sin dependencias no autorizadas.
* **Evidencias gráficas:** Capturas de pantalla documentando estado de carga, catálogo renderizado, navegación paginada y pantalla de error simulada.
* **Informe técnico:** Documento consolidado (2 a 4 páginas) detallando arquitectura, endpoint, `queryKey`, `queryFn`, `staleTime` y matriz de pruebas.
* **Video de demostración:** Registro audiovisual (3 a 5 minutos) recorriendo el flujo completo desde la llamada de red hasta la interfaz.
* **Metadatos de entrega:** Enlace directo al repositorio, nombre de la rama y hash abreviado del commit final.

---

## 9. Responsabilidades del equipo

| Rol | Responsabilidad |
| --- | --- |
| **Integración** | Configuración de `QueryClient` y `QueryClientProvider` en el punto de arranque. |
| **Datos / API** | Definición de tipos TypeScript, contratos de interfaz, servicio fetch y validación de errores HTTP. |
| **Interfaz de Usuario** | Integración del hook `useQuery`, estados `isPending`/`isError`, tarjetas y accesibilidad. |
| **Pruebas y Documentación** | Verificación de paginación, auditoría de caché y registro de evidencias en el informe. |

*Nota.* Elaboración propia.

---

## 10. Preguntas de reflexión a ser respondidas en la exposición

### Pregunta 1: ¿Qué diferencia existe entre el estado de una consulta remota y el estado de un botón o preferencia?
**Respuesta del equipo:** El estado remoto proviene de una fuente externa y asíncrona sobre la cual el cliente no tiene control total de disponibilidad; requiere sincronización periódica, manejo de latencia, estados intermedios (carga/error) y caducidad temporal (caché). En contraste, el estado de un botón o preferencia (como el tema visual o un menú desplegable) es sincrónico, determinista, pertenece de manera exclusiva al cliente y cambia instantáneamente ante la interacción del usuario.

### Pregunta 2: ¿Por qué `page` debe formar parte de `queryKey`?
**Respuesta del equipo:** Porque en TanStack Query la `queryKey` actúa como la clave única de indexación en la memoria caché. Al incluir `page` en el arreglo `['experiences', page]`, cada página remota genera una entrada independiente en la caché, permitiendo que la biblioteca detecte cuándo cambian los parámetros de consulta, dispare una nueva petición o reutilice de inmediato los datos previamente almacenados.

### Pregunta 3: ¿Qué ocurriría si cada componente ejecutara `fetch` por separado?
**Respuesta del equipo:** Se generaría duplicación masiva de peticiones HTTP en red (sobrecarga del servidor y desperdicio de ancho de banda), condiciones de carrera (*race conditions*) por tiempos de respuesta dispares, desincronización visual entre componentes y la necesidad de reimplementar manualmente la lógica de carga, reintentos y almacenamiento temporal en cada lugar.

### Pregunta 4: ¿Por qué una respuesta de error debe comunicarse al usuario?
**Respuesta del equipo:** Porque una interfaz accesible y usable debe ofrecer visibilidad continua del estado del sistema (primer principio heurístico de Nielsen). Silenciar el error o dejar la pantalla en blanco genera frustración, incertidumbre y abandono. Comunicar el fallo con un mensaje comprensible y mecanismos de reintento orienta al usuario sobre cómo proceder.

### Pregunta 5: ¿Qué información debe venir de la API y cuál pertenece al estado global?
**Respuesta del equipo:** De la API deben provenir los datos del dominio de negocio que residen en el servidor (catálogo de cocheras, tarifas actualizadas, aforo en tiempo real y disponibilidad). Al estado global del cliente le pertenecen las preferencias de la sesión de usuario (tema claro/oscuro de caseta, notificaciones operativas efímeras y filtros de búsqueda activos).

---

## 11. Verificación final

* [ ] La aplicación inicia correctamente desde la rama de trabajo `feature/week11-tanstack-query` y conserva los módulos de semanas anteriores.
* [ ] TanStack Query cuenta con una única instancia de `QueryClientProvider` en el punto de montaje raíz.
* [ ] El catálogo consume dinámicamente los datos de la API REST externa y no depende de arreglos estáticos hardcodeados.
* [ ] Se validan visual y funcionalmente los tres estados: carga (`isPending`), error (`isError`) y datos cargados (`data`).
* [ ] La paginación funciona bidireccionalmente y el botón "Anterior" queda inhabilitado en la página inicial.
* [ ] Se demuestra la reutilización de caché al volver a páginas visitadas dentro del período de `staleTime`.
* [ ] Se consolidaron los entregables obligatorios: repositorio actualizado, commit final, capturas, informe técnico y video.

---

## 12. Referencias técnicas

TanStack. (2024). *TanStack Query Documentation: Overview and Quick Start*. TanStack. https://tanstack.com/query/latest/docs/framework/react/overview

MDN Web Docs. (2024). *Using the Fetch API*. Mozilla Corporation. https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch

W3C. (2023). *ARIA: alert role - Accessibility guidelines*. World Wide Web Consortium. https://www.w3.org/WAI/ARIA/apg/patterns/alert/
