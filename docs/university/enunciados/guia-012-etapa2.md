**UNIVERSIDAD AUTÓNOMA DEL PERÚ** 

# **GUÍA DE LABORATORIO – SEMANA 12** 

### **_Laboratorio de Experiencias Web Inmersivas_** 

### **_Core Web Vitals, Lighthouse y React DevTools_** 

## **1. Propósito** 

La app creada en la Guía de Trabajo debe ofrecer una experiencia fluida. Aquí se medirán sus tiempos, se identificarán problemas y se recomendarán mejoras respaldadas por evidencia. No se reconstruyen páginas ni layouts: se audita el producto integrado. 

## **2. Resultados** 

- Explicar LCP, INP y CLS en términos de experiencia de usuario. 

- Ejecutar Lighthouse con un protocolo reproducible. 

- Interpretar hallazgos y relacionarlos con causas posibles. 

- Usar React DevTools para observar componentes y renderizados. 

- Priorizar una mejora y comparar resultados. 

## **3. Complementariedad entre guías** 

|**Guía de Trabajo / Desarrollo Web**|**Guía de Laboratorio**|
|---|---|
|**Construye rutas, layout, componentesy datos.**|**Mide carga, interaccióny estabilidad visual.**|
|**Entrega repo y ficha arquitectónica.**|**Entrega auditoría, diagnósticoy comparación.**|
|**No hace Lighthouse.**|**No reconstruye rutas/layout; trabaja con evidencia de rendimiento.**|



## **4. Métricas de referencia** 

|**Métrica**|**Qué significa**|**Referencia de buena experiencia**|
|---|---|---|
|**LCP**|**Tiempo hasta mostrar elprincipal contenido visible.**|**≤ 2,5 s**|
|**INP**|**Respuesta visual tras una interacción.**|**≤ 200 ms**|
|**CLS**|**Desplazamientos inesperados de elementos.**|**≤ 0,1 **|



Los umbrales se interpretan como referencia de buena experiencia, idealmente en el percentil 75 de usuarios reales. Lighthouse es una prueba de laboratorio; no equivale a datos reales. Si INP no aparece, registren TBT como indicador diagnóstico, sin confundirlo con INP. 

## **5. Preparación** 

- Usar la app de la guía anterior; comprobar que inicia sin errores. 

- Auditar Inicio y About; anotar URL, fecha, Chrome, dispositivo simulado y modo. 

- Abrir DevTools (F12) → Lighthouse. 

- Para comparar, mantener iguales las condiciones y documentar si se mide desarrollo o build de producción. 

## **6. Procedimiento** 

**Fase A – Línea base** 

1. Seleccionar Performance y modo Mobile en Lighthouse; ejecutar la auditoría. 

2. Guardar capturas del resumen y métricas; registrar score, LCP, CLS y oportunidades. 

3. Repetir tres veces. Anotar todas las ejecuciones y calcular promedio de LCP y CLS. 

4. Realizar el mismo protocolo en About y, si hay tiempo, en Desktop. No mezclar perfiles. 

5. Registrar variaciones por caché, red, CPU u otros factores. 

#### **Fase B – Diagnóstico de oportunidades** 

|**Señal**|**Qué investigar**|
|---|---|
|**LCP alto**|**Elementoprincipal; imagen o recursopesado; prioridady tiempo de carga.**|
|**CLS alto**|**Dimensiones reservadas, fuentes, imágenes o contenido tardíoque desplaza.**|
|**Interacción lenta**|**JavaScript pesado, tareas largas, eventosy renders; TBT comopista en laboratorio.**|
|**Recursos**|**Imágenes, CSS/JS no usado, fuentesy solicitudes de red.**|



**Fase C – React DevTools** 

6. Activar React Developer Tools en Chrome. 

7. En Components, localizar componentes y revisar props/state. 

8. En Profiler, grabar una interacción real (por ejemplo, botón interactivo). 

9. Identificar renderizados y posibles repeticiones innecesarias. 

10. Documentar al menos un hallazgo. No añadir memoización sin justificar el problema. 

#### **Fase D – Mejora y comparación** 

11. Elegir una oportunidad real y de bajo riesgo (optimizar imagen, declarar dimensiones, reducir recursos, ajustar componente). 

12. Describir problema, evidencia e hipótesis antes de cambiar. 

13. Aplicar la mejora en una rama mejora-performance o documentar una propuesta si no se puede intervenir. 

14. Repetir exactamente las mediciones de línea base. 

15. Comparar y discutir: una intervención puede mejorar una métrica y no otra, o no mostrar mejora por variación. 

## **7. Registro de resultados** 

|**Escenario**|**LCP 1**|**LCP 2**|**LCP 3**|**Promedio**|**CLS**|**Score**|**Notas**|
|---|---|---|---|---|---|---|---|
|**Inicio antes**||||||||
|**About antes**||||||||
|**Inicio después**||||||||
|**About después**||||||||



## **8. Matriz de diagnóstico** 

|**Evidencia**<br>**Problema**|**Causa hipotética**|**Mejora**<br>**Prioridad**|
|---|---|---|



## **9. Entregable** 

- Informe de 2–4 páginas: objetivo, entorno y protocolo reproducible. 

- Capturas de Lighthouse antes y después, si aplicaron mejora. 

- Tabla de mediciones sin ocultar variación. 

- Diagnóstico de al menos dos hallazgos y una mejora aplicada o propuesta con sustento. 

- Captura/registro de Profiler y explicación. 

- Video de 3–5 minutos: app, métricas y razonamiento. 

- Repositorio actualizado y commit de mejora/reporte. 

## **10. Cierre** 

16. ¿Lighthouse alto garantiza rapidez percibida por todos? 

17. ¿Por qué repetir pruebas? 

18. ¿Cuál es la diferencia entre INP y TBT? 

19. ¿Qué hallazgo impacta más al usuario y qué evidencia lo respalda? 

20. ¿La arquitectura Next.js por sí sola garantiza rendimiento? 

## **11. Referencias** 

- Web Vitals: https://web.dev/articles/vitals 

- Lighthouse: https://developer.chrome.com/docs/lighthouse 

- React Developer Tools: https://react.dev/learn/react-developer-tools 

- Next.js: https://nextjs.org/docs/app 

