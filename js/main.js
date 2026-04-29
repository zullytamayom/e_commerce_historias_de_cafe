function loadComponent(containerId, path, callback) {
  const container = document.getElementById(containerId);
  if (!container) return; // ✅ Si el contenedor no existe en esta página, no hace nada

  fetch(path)
    .then((res) => res.text())
    .then((data) => {
      container.innerHTML = data;
      if (callback) callback();
    })
    .catch((err) => console.error("Error cargando componente:", path, err));
}

//  Navbar logic
function initNavbar() {
  const links = document.querySelectorAll(".opcionesBarra");

  links.forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");

      if (
        window.location.pathname ===
        new URL(href, window.location.origin).pathname
      ) {
        return;
      }

      e.preventDefault();

      const transition = document.getElementById("coffecup-transition");
      if (!transition) {
        window.location.href = href;
        return;
      }

      sessionStorage.setItem("coffeeAnimation", "played");
      document.body.style.overflow = "hidden";
      transition.style.display = "flex";
      transition.classList.add("launching");

      setTimeout(() => {
        window.location.href = href;
      }, 900);
    });
  });

  const navLinks = document.querySelectorAll(".nav-link");
  const menuCollapse = document.getElementById("navbarMenu");

  navLinks.forEach((l) => {
    l.addEventListener("click", () => {
      if (window.innerWidth < 992) {
        const bsCollapse = new bootstrap.Collapse(menuCollapse);
        bsCollapse.hide();
      }
    });
  });
}

//  CONTROL DE ANIMACIÓN
function handlePageAnimation() {
  const transition = document.getElementById("coffecup-transition");
  const played = sessionStorage.getItem("coffeeAnimation");

  if (!transition) return;

  if (played === "played") {
    transition.style.display = "none";
    sessionStorage.removeItem("coffeeAnimation");
  } else {
    transition.style.display = "none";
  }
}

// UN SOLO DOMContentLoaded — aquí va TODO
document.addEventListener("DOMContentLoaded", () => {
  handlePageAnimation();

  loadComponent(
    "navbar-container",
    "/components/navBar/navBar.html",
    initNavbar,
  );
  loadComponent("footer-container", "/components/footer/footer.html");
  const formularioExistente = document.querySelector('form[action*="formspree.io"]');
  
  if (formularioExistente) {
    console.log("Formulario detectado en el HTML base. Activando validación...");
    cargarFormContact(); 
  } else {
    // Si no existe, quizás es porque se carga dinámicamente en otra página
    loadComponent("form", "/pages/contactanosParts/contactanos.html", cargarFormContact);
  }
  loadComponent(
  "carrito-container", 
  "/components/cart/cart.html", 
  (typeof initCart === 'function') ? initCart : () => console.warn("initCart no definida")
); //  carrito
  loadComponent(
    "productform-container",
    "/components/product/productForm.html",
    (typeof initProductLogic === 'function')? initProductLogic :() => console.warn("producto no definido") 
  );
 
});
// Validación del formulario — solo si existe en esta página
function cargarFormContact() {
  // 1. Buscamos el formulario dentro del contenedor con ID 'form'
  const form = document.querySelector('form[action*="formspree.io"]');

  if (!form) {
    console.warn("No se encontró el formulario dentro del contenedor #form.");
    return;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    // Limpiar errores previos
    form.querySelectorAll(".invalid-feedback").forEach((el) => el.remove());
    form.querySelectorAll(".is-invalid").forEach((el) => el.classList.remove("is-invalid"));

    let isValid = true;

    // 2. Buscamos los inputs DENTRO del formulario (más seguro que getElementById global)
    const nombreInput = form.querySelector("#name");
    const emailInput = form.querySelector("#email");
    const telefonoInput = form.querySelector("#number");
    const mensajeInput = form.querySelector("#message");

    // --- Validaciones ---
    
    // Nombre
    const nombreRegex = /^[a-zA-Z\s]+$/;
    const nombreVal = nombreInput.value.trim();
    if (nombreVal === "") {
      mostrarError(nombreInput, "Ingresa tu nombre");
      isValid = false;
    } else if (nombreVal.length < 3) {
      mostrarError(nombreInput, "Mínimo 3 caracteres");
      isValid = false;
    } else if (!nombreRegex.test(nombreVal)) {
      mostrarError(nombreInput, "Solo letras y espacios");
      isValid = false;
    }

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value.trim())) {
      mostrarError(emailInput, "Email no válido");
      isValid = false;
    }

    // Teléfono
    const telefonoRegex = /^[0-9+\s]+$/;
    const telefonoVal = telefonoInput.value.trim();
    if (telefonoVal.length < 10 || !telefonoRegex.test(telefonoVal)) {
      mostrarError(telefonoInput, "Teléfono inválido (mín. 10 dígitos)");
      isValid = false;
    }

    // Mensaje
    if (mensajeInput.value.trim().length < 10) {
      mostrarError(mensajeInput, "Mensaje demasiado corto");
      isValid = false;
    }

    if (isValid) {
      console.log("¡Formulario validado con éxito!");
      form.submit();
    }
  });
}


function mostrarError(input, mensaje) {
  input.classList.add("is-invalid");
  const error = document.createElement("div");
  error.className = "invalid-feedback";
  error.textContent = mensaje;
  input.parentElement.appendChild(error);

  input.addEventListener("input", function () {
    if (input.value.trim() !== "") {
      input.classList.remove("is-invalid");
      error.remove();
    }
  });
}
