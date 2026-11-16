/**
 * Quadrate pe — Controlador Interactivo del Canvas de Design System (docs/design-system.js)
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Selector de Tema Claro / Oscuro
  const toggleBtn = document.getElementById("ds-theme-toggle");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme") || "light";
      const next = current === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("quadrate_theme", next);
      toggleBtn.setAttribute("aria-label", `Tema actual: ${next}. Click para cambiar.`);
    });
    const saved = localStorage.getItem("quadrate_theme");
    if (saved) document.documentElement.setAttribute("data-theme", saved);
  }

  // 2. Interacción de Píldoras de Filtro
  const pildoras = document.querySelectorAll(".catalogo-pildora");
  pildoras.forEach((btn) => {
    btn.addEventListener("click", () => {
      pildoras.forEach((p) => {
        p.classList.remove("catalogo-pildora--activa");
        p.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("catalogo-pildora--activa");
      btn.setAttribute("aria-pressed", "true");
    });
  });

  // 3. Interacción del Buscador
  const searchInput = document.getElementById("ds-search-input");
  const searchClear = document.getElementById("ds-search-clear");
  if (searchInput && searchClear) {
    searchInput.addEventListener("input", () => {
      searchClear.style.display = searchInput.value ? "inline-flex" : "none";
    });
    searchClear.addEventListener("click", () => {
      searchInput.value = "";
      searchClear.style.display = "none";
      searchInput.focus();
    });
  }

  // 4. Interacción del Botón de Reserva en Tarjetas
  const cardButtons = document.querySelectorAll(".cochera-boton");
  cardButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".cochera-tarjeta");
      const isPressed = btn.getAttribute("aria-pressed") === "true";
      btn.setAttribute("aria-pressed", !isPressed);
      if (!isPressed) {
        btn.classList.add("cochera-boton--activo");
        btn.textContent = "Seleccionada ✓";
        if (card) card.classList.add("cochera-tarjeta--activa");
      } else {
        btn.classList.remove("cochera-boton--activo");
        btn.textContent = "Reservar espacio";
        if (card) card.classList.remove("cochera-tarjeta--activa");
      }
    });
  });

  // 5. Interacción de la Demostración de Chat
  const chatForm = document.getElementById("ds-chat-form");
  const chatInput = document.getElementById("ds-chat-input");
  const chatLog = document.getElementById("ds-chat-log");
  const chatChips = document.querySelectorAll(".ds-chat-inline .qlive-chip");

  if (chatForm && chatInput && chatLog) {
    const appendMsg = (text, type = "usr") => {
      const bubble = document.createElement("p");
      bubble.className = `qlive-msg qlive-msg--${type}`;
      bubble.textContent = text;
      chatLog.appendChild(bubble);
      chatLog.scrollTop = chatLog.scrollHeight;
    };

    chatForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const val = chatInput.value.trim();
      if (!val) return;
      appendMsg(val, "usr");
      chatInput.value = "";
      setTimeout(() => {
        appendMsg(`Simulación UI: Respuesta para "${val}" con tarifas en tiempo real.`, "bot");
      }, 500);
    });

    chatChips.forEach((chip) => {
      chip.addEventListener("click", () => {
        chatInput.value = chip.textContent;
        chatInput.focus();
      });
    });
  }
});
