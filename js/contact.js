const Validators = {
    validateText: (val, min) => ({
        notEmpty: val.length > 0,
        minLength: val.length >= min
    }),
    validateEmail: (val) => ({
        notEmpty: val.length > 0,
        format: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)
    }),
    notEmpty: (val) => val.length > 0
};

function mostrarError(input, mensaje) {
    input.classList.add("is-invalid");
    const errorDiv = document.createElement("div");
    errorDiv.className = "invalid-feedback";
    errorDiv.innerText = mensaje;
    input.parentElement.appendChild(errorDiv);
}
// Validación del formulario contactanos — solo si existe en esta página
function cargarFormContact() {
  // 1. Buscamos el formulario dentro del contenedor con ID 'form'
  const form = document.querySelector('#contact-container form');

  if (!form) {
    console.warn("No se encontró el formulario dentro del contenedor #contact-container.");
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

    // --- Validaciones usando Validators ---
    // Nombre
    const nombreVal = nombreInput.value.trim();
    const nombreValid = Validators.validateText(nombreVal, 3);
    if (!nombreValid.notEmpty) {
      mostrarError(nombreInput, "Ingresa tu nombre");
      isValid = false;
    } else if (!nombreValid.minLength) {
      mostrarError(nombreInput, "Mínimo 3 caracteres");
      isValid = false;
    } else if (!/^[a-zA-Z\s]+$/.test(nombreVal)) {
      mostrarError(nombreInput, "Solo letras y espacios");
      isValid = false;
    }

    // Email
    const emailVal = emailInput.value.trim();
    const emailValid = Validators.validateEmail(emailVal);
    if (!emailValid.notEmpty) {
      mostrarError(emailInput, "Ingresa tu email");
      isValid = false;
    } else if (!emailValid.format) {
      mostrarError(emailInput, "Email no válido");
      isValid = false;
    }

    // Teléfono
    const telefonoVal = telefonoInput.value.trim();
    if (telefonoVal.length < 10 || !/^[0-9+\s]+$/.test(telefonoVal)) {
      mostrarError(telefonoInput, "Teléfono inválido (mín. 10 dígitos)");
      isValid = false;
    }

    // Mensaje
    const mensajeVal = mensajeInput.value.trim();
    if (!Validators.notEmpty(mensajeVal)) {
      mostrarError(mensajeInput, "El mensaje no puede estar vacío");
      isValid = false;
    } else if (mensajeVal.length < 10) {
      mostrarError(mensajeInput, "Mensaje demasiado corto");
      isValid = false;
    }

    if (isValid) {
      console.log("¡Formulario validado con éxito!");
      form.submit();
    }
  });
}