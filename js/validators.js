const Validators = {
  minLength: (value, min = 8) => value.length >= min,
  hasLetter: (value) => /[A-Za-z]/.test(value),
  hasUppercase: (value) => /[A-Z]/.test(value),
  hasNumber: (value) => /\d/.test(value),
  hasNoSpaces: (value) => !/ /.test(value),
  notEmpty: (value) => value.trim().length > 0,
  passwordsMatch: (p1, p2) => p1 === p2 && p1.length > 0,

  validatePassword(password, confirm = null) {
    const results = {
      length:  this.minLength(password),
      letter:  this.hasLetter(password),
      capital: this.hasUppercase(password),
      number:  this.hasNumber(password),
      blank:   this.hasNoSpaces(password),
    };
    if (confirm !== null) {
      results.match = this.passwordsMatch(password, confirm);
      results.null  = this.notEmpty(password) && this.notEmpty(confirm);
    }
    return results;
  },

  validateText(value, minLength = 2) {
    return {
      notEmpty:  this.notEmpty(value),
      minLength: value.trim().length >= minLength,
    };
  },

  validateEmail(value) {
    return {
      notEmpty: this.notEmpty(value),
      format:   /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    };
  },
};

// ── Utilidades DOM ─────────────────────────────────────────────────────────

function mostrarError(input, mensaje) {
  limpiarError(input);

  input.classList.add("is-invalid");

  const error = document.createElement("div");
  error.className = "invalid-feedback";
  error.setAttribute("data-error-for", input.id);
  error.textContent = mensaje;

  // Va DENTRO del .campo-wrapper → respeta el flujo, no se sale de .card
  const contenedor = input.closest(".campo-wrapper") || input.closest(".grupo-input");
  contenedor.appendChild(error);

  input.addEventListener("input", function limpiar() {
    limpiarError(input);
    input.removeEventListener("input", limpiar);
  });
}

function limpiarError(input) {
  input.classList.remove("is-invalid");
  document.querySelectorAll(`[data-error-for="${input.id}"]`)
    .forEach(el => el.remove());
}