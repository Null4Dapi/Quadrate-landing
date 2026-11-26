**Curso:** Desarrollo Web Full Stack Frontend - Semana 1

**Etapa:** Etapa 1 - Analizar, Diseñar y Especificar el Prototipo

**Fecha:** Sábado, 5 de Septiembre del 2026

**Modalidad:** Trabajo grupal (60-75 min)

**Entregable:** Especificación del prototipo

# Especificación del Primer Prototipo: Plataforma de Experiencias

## 1. Propósito y Contexto

En esta actividad el equipo analiza el reto, define la estructura e
interacciones de la primera versión de la Plataforma de Experiencias y
toma las decisiones metodológicas, estructurales y técnicas que luego
serán implementadas en la Guía de Laboratorio.

## 2. Organización del Equipo y Roles Ágiles

Distribución de responsabilidades:

  ---------------------------------------------------------------------------
  Rol             Responsabilidad      Enfoque UX / Ágil         Integrante
  --------------- -------------------- ------------------------- ------------
  Coordinador     Organiza tiempos,    Scrum Facilitator:        Diego Pando
                  acuerdos y la        Mantiene el Timebox       
                  entrega final de la  (60-75 min) y gestiona    
                  especificación.      los compromisos del       
                                       equipo.                   

  Analista de     Define las secciones UX Architect / PO: Diseña Luciana
  estructura      de la página y la    la arquitectura de        Tapullima
                  jerarquía de         información y jerarquía   
                  contenidos.          navegable orientada al    
                                       usuario.                  

  Diseñador de    Define y redacta las UX Content Writer:        Victor
  contenido       tres experiencias    Redacción clara,          Manuel\
                  iniciales y sus      persuasiva y definición   José Vilchez
                  detalles.            de llamadas a la acción   
                                       (CTAs).                   

  Responsable de  Propone criterios    Accessibility Specialist: Eduardo
  accesibilidad   iniciales de         Inclusión digital,        Cueva
                  accesibilidad,       contraste y navegabilidad 
                  usabilidad y         bajo normas WCAG 2.1 AA.  
                  legibilidad.                                   
  ---------------------------------------------------------------------------

## 3. Actividad 1 - Descomposición de la Página (Arquitectura de Información)

Identificación de las regiones principales de la página inicial y
levantamiento de necesidades del usuario:

  -----------------------------------------------------------------------
  Región                  ¿Qué contenido tendrá?  ¿Qué necesita el
                                                  usuario?
  ----------------------- ----------------------- -----------------------
  Encabezado e identidad  Logotipo principal,     Identificar
                          isotipo y nombre        inmediatamente la marca
                          comercial de la         y confirmar la
                          plataforma.             autenticidad del sitio.

  Navegación              Menú principal con      Orientarse fácilmente y
                          enlaces a: Inicio,      desplazarse de manera
                          Experiencias, Sobre     ágil a las secciones
                          Nosotros, Contacto.     clave.

  Contenido principal     Título principal de     Comprender el propósito
                          impacto, propuesta de   del sitio rápidamente e
                          valor resumida y botón  identificar el primer
                          de acción principal     paso.
                          (CTA).                  

  Sección de experiencias Grilla con 3 tarjetas   Explorar opciones de
                          de contenido (título,   interés, comparar
                          descripción breve,      experiencias y
                          imagen/recurso y        seleccionar una para
                          botón).                 interactuar.

  Pie de página           Derechos reservados,    Encontrar canales de
                          enlaces a políticas de  soporte, información
                          privacidad, redes       legal y un cierre
                          sociales y contacto.    formal del flujo
                                                  vertical.
  -----------------------------------------------------------------------

## 4. Actividad 2 - Decisión Semántica

Selección de etiquetas basadas puramente en el significado del contenido
y no en su estilo visual:

  -----------------------------------------------------------------------
  Región         Elemento      Justificación Semántica
                 propuesto     
  -------------- ------------- ------------------------------------------
  Encabezado     \<header\>    Agrupa el contenido introductorio y los
                               elementos de identidad de la cabecera
                               global.

  Navegación     \<nav\>       Define una sección dedicada exclusivamente
                               a los enlaces de navegación del sitio.

  Contenido      \<main\>      Encapsula el contenido central e
  principal                    ideológicamente único del documento,
                               excluyendo barras laterales/recursivas.

  Experiencias   \<section\> y \<section\> agrupa el bloque temático de
                 \<article\>   experiencias y cada experiencia individual
                               es un \<article\> independiente.

  Pie de página  \<footer\>    Representa el cierre formal del documento
                               con créditos, derechos y navegación
                               secundaria.
  -----------------------------------------------------------------------

## 5. Actividad 3 - Especificación de las Tres Experiencias

Definición del contenido:

  -------------------------------------------------------------------------------
  Experiencia   Título       Descripción        Imagen / Recurso    Acción (CTA)
  ------------- ------------ ------------------ ------------------- -------------
  Exp. 1        Autos y SUVs Enfocada en el     Fotografía          Cotizar Auto
                de Lujo      cliente particular panorámica de la    o SUV
                             que busca confort  sala principal de   
                             y aventura .       modelos de autos    

  Exp. 2        Camiones y   Orientada a        Ilustración de      Contacto con
                Transporte   empresas de        Flotas de           Asesor de
                Pesado       logística y        transporte pesado   venta
                             minería .                              

  Exp. 3        Servicio     Diseñada para la   Marcas reconocidas  Agendar Cita
                Posventa y   fidelización y     de talleres         de Taller
                Repuestos    atención continua  mecánicos           
                             en talleres                            
  -------------------------------------------------------------------------------

## 

## 6. Actividad 4 - Propuesta Visual 

Esquema de distribución estructural basado en el patrón de lectura
visual en \"F/Z\":

## ![](media/image1.png){width="6.5in" height="3.2222222222222223in"}

## 7. Actividad 5 - Decisiones de Accesibilidad 

1.  **Jerarquía Lógica de Encabezados (\<h1\> a \<h3\>):**

    -   *¿Por qué es importante?:* Permite a los usuarios de lectores de
        > pantalla navegar estructuradamente sin perderse.

    -   *¿Cómo lo implementaremos?:* Utilizando un único \<h1\> en la
        > sección principal, \<h2\> para secciones mayores y \<h3\> en
        > títulos de tarjetas.

2.  **Atributos Alt Descriptivos en Imágenes:**

    -   *¿Por qué es importante?:* Otorga contexto visual completo a
        > personas con discapacidad visual o en conexiones lentas donde
        > la imagen no carga.

    -   *¿Cómo lo implementaremos?Especificando* textos en alt contexto
        > (ej. alt=\"Vista carrusel de autos\").

3.  **Navegabilidad Completa por Teclado y Contraste de Color:**

    -   *¿Por qué es importante?:* Permite operar el sitio a usuarios
        > que no usan ratón y asegura legibilidad en condiciones de luz
        > variables.

    -   *¿Cómo lo implementaremos?:* Garantizando una relación de
        > contraste mínima de 4.5:1 entre fondo y texto, e indicando el
        > foco activo (focus outline) al pulsar TAB.

## 8. Actividad 6 - Decisiones Técnicas a Defender en Laboratorio

1.  **Separación de Responsabilidades (HTML Semántico vs CSS Visual):**

    -   *Justificación técnica:* Optimiza la velocidad de renderizado,
        > simplifica el mantenimiento del código y mejora el
        > posicionamiento SEO.

    -   *Evidencia esperada:* La página mantendrá orden y sentido de
        > lectura incluso si se deshabilitan por completo las hojas de
        > estilo CSS.

2.  **Arquitectura Modular Basada en Componentes Autónomos
    > (\<article\>):**

    -   *Justificación técnica:* Permite reutilizar o mover las tarjetas
        > de experiencias en cualquier otra sección del sitio sin
        > alterar su semántica.

    -   *Evidencia esperada:* Cada tarjeta de experiencia incluirá su
        > título, descripción, recurso visual y acción de manera
        > totalmente independiente.

3.  **Enfoque de Maquetación Responsive Mobile-First:**

    -   *Justificación técnica:* Garantiza un rendimiento óptimo y una
        > usabilidad cómoda en dispositivos móviles antes de escalar a
        > pantallas de escritorio.

    -   *Evidencia esperada:* Adaptación fluida de la grilla de tarjetas
        > sin desbordamientos ni apariciones de barras de desplazamiento
        > horizontal.

## 9. Preparación para el Laboratorio (Checklist de Validación)

-   **¿Qué vamos a construir?:** La primera versión de la página de
    > inicio de la Plataforma de Experiencias.

-   **¿Qué secciones tendrá?:** Encabezado con navegación, hero section
    > principal, catálogo de 3 experiencias y pie de página.

-   **¿Qué etiqueta semántica corresponde a cada sección?:** \<header\>,
    > \<nav\>, \<main\>, \<section\>, \<article\> y \<footer\>.

-   **¿Qué contenido tendrá cada experiencia?** Imágenes interactivas de
    > los tres sectores ofrecidos por la marca , transporte urbano
    > ,maquinaria pesada y servicio postventa.

-   **¿Qué criterios de accesibilidad debemos respetar?:** Jerarquía de
    > encabezados, textos alternativos explícitos y foco visible por
    > teclado.

-   **¿Qué decisiones tendremos que comprobar durante la
    > implementación?:** Validación W3C del código, auditoría con
    > extensión axe y prueba de diseño adaptable.
