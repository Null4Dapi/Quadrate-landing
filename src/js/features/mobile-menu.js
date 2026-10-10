/**
 * Quadrate pe — Menú Móvil
 * Control de apertura, cierre y accesibilidad de la navegación en pantallas móviles (BEM).
 */

/**
 * Inicializa el comportamiento del menú hamburguesa para vistas móviles.
 */
export function inicializarMenuMovil() {
  const botonAlternar = document.querySelector(".header__menu-toggle");
  const elementoNav = document.querySelector(".header__nav");
  const elementoCabecera = document.querySelector(".header");

  if (!botonAlternar || !elementoNav || !elementoCabecera) {
    return;
  }

  const enlacesNavegacion = elementoNav.querySelectorAll(".header__nav-link");

  /**
   * Abre el menú móvil y actualiza los atributos de accesibilidad.
   */
  function abrirMenu() {
    botonAlternar.setAttribute("aria-expanded", "true");
    botonAlternar.setAttribute("aria-label", "Cerrar menú de navegación");
    botonAlternar.classList.add("header__menu-toggle--active");
    elementoNav.classList.add("header__nav--open");
    elementoCabecera.classList.add("header--menu-open");
  }

  /**
   * Cierra el menú móvil y restaura el estado accesible.
   */
  function cerrarMenu() {
    botonAlternar.setAttribute("aria-expanded", "false");
    botonAlternar.setAttribute("aria-label", "Abrir menú de navegación");
    botonAlternar.classList.remove("header__menu-toggle--active");
    elementoNav.classList.remove("header__nav--open");
    elementoCabecera.classList.remove("header--menu-open");
  }

  /**
   * Alterna el estado del menú entre abierto y cerrado.
   */
  function alternarMenu() {
    const estaAbierto = botonAlternar.getAttribute("aria-expanded") === "true";
    if (estaAbierto) {
      cerrarMenu();
    } else {
      abrirMenu();
    }
  }

  // Evento de clic en el botón hamburguesa
  botonAlternar.addEventListener("click", (evento) => {
    evento.stopPropagation();
    alternarMenu();
  });

  // Cerrar automáticamente al hacer clic en cualquier enlace del menú
  enlacesNavegacion.forEach((enlace) => {
    enlace.addEventListener("click", () => {
      cerrarMenu();
    });
  });

  // Cerrar al presionar la tecla Escape
  document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape" && botonAlternar.getAttribute("aria-expanded") === "true") {
      cerrarMenu();
      botonAlternar.focus();
    }
  });

  // Cerrar al hacer clic fuera de la cabecera
  document.addEventListener("click", (evento) => {
    if (!elementoCabecera.contains(evento.target)) {
      cerrarMenu();
    }
  });

  // Cerrar automáticamente si la pantalla se redimensiona a escritorio (>= 768px)
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 768 && botonAlternar.getAttribute("aria-expanded") === "true") {
      cerrarMenu();
    }
  });
}
