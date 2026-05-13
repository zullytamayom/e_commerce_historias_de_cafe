function cargarFormRegister() {
  const form       = document.getElementById("register-form");
  const inputName  = document.getElementById("reg-name");
  const inputEmail = document.getElementById("reg-email");
  const inputPass1 = document.getElementById("password1");
  const inputPass2 = document.getElementById("password2");
  const pswd_info  = document.getElementById("pswd_info");

  if (!form) return;

  // ── Ojito: mostrar / ocultar contraseña ────────────────────────────────
  document.querySelectorAll(".toggle-pass").forEach(function(icono) {
    icono.addEventListener("click", function() {
      const input = document.getElementById(this.getAttribute("data-target"));
      const viendo = input.type === "text";
      input.type = viendo ? "password" : "text";
      this.classList.toggle("fa-eye",       viendo);
      this.classList.toggle("fa-eye-slash", !viendo);
    });
  });

  // ── Indicadores de fortaleza en tiempo real ────────────────────────────
  function setIndicator(id, isValid) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.toggle("valid",   isValid);
    el.classList.toggle("invalid", !isValid);
  }

  function handlePasswordInput() {
    const p1 = inputPass1.value;
    const p2 = inputPass2.value;
    const r  = Validators.validatePassword(p1, p2);

    setIndicator("length",  r.length);
    setIndicator("letter",  r.letter);
    setIndicator("capital", r.capital);
    setIndicator("number",  r.number);
    setIndicator("blank",   r.blank);
    setIndicator("match",   r.match);
    setIndicator("null",    r.null);

    if (p2.length > 0) {
      validarContrasenas(inputPass1, inputPass2);
    } else {
      limpiarError(inputPass2);
    }
  }

  inputPass1.addEventListener("keyup", handlePasswordInput);
  inputPass2.addEventListener("keyup", handlePasswordInput);
  inputPass1.addEventListener("focus", () => pswd_info.style.display = "block");
  inputPass1.addEventListener("blur",  () => {
    pswd_info.style.display = "none";
    validarFortaleza(inputPass1);
  });
  inputPass2.addEventListener("blur", () => validarContrasenas(inputPass1, inputPass2));

  inputName.addEventListener("blur",  () => validarNombre(inputName));
  inputEmail.addEventListener("blur", () => validarEmail(inputEmail));

  // ── Submit ─────────────────────────────────────────────────────────────
  form.addEventListener("submit", function(e) {
    e.preventDefault();

    [inputName, inputEmail, inputPass1, inputPass2].forEach(limpiarError);

    const nombreOk = validarNombre(inputName);
    const emailOk  = validarEmail(inputEmail);
    const passOk   = validarFortaleza(inputPass1);
    const matchOk  = validarContrasenas(inputPass1, inputPass2);
  
    if (nombreOk && emailOk && passOk && matchOk) {
      console.log("Formulario válido ✓ — enviar datos");

    const formRegisterLocalStorage = {
      name: inputName.value.trim(),
      email: inputEmail.value.trim(),
      password: inputPass1.value,
    }; 

    localStorage.setItem("formRegister", JSON.stringify(formRegisterLocalStorage));

    } else {
      console.warn("Corrige los errores antes de continuar");
    }


  });
  


// ── Validaciones por campo ─────────────────────────────────────────────────

function validarNombre(input) {
  const valor      = input.value.trim();
  const soloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;

  if (valor === "")            { mostrarError(input, "El nombre es obligatorio");           return false; }
  if (valor.length < 3)        { mostrarError(input, "Mínimo 3 caracteres");                return false; }
  if (!soloLetras.test(valor)) { mostrarError(input, "Solo letras y espacios, sin números"); return false; }

  limpiarError(input);
  return true;
}

function validarEmail(input) {
  const valor        = input.value.trim();
  const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (valor === "")               { mostrarError(input, "El correo es obligatorio");                 return false; }
  if (!formatoEmail.test(valor))  { mostrarError(input, "Formato inválido, ej: correo@dominio.com"); return false; }

  limpiarError(input);
  return true;
}

function validarFortaleza(input) {
  const valor = input.value;

  if (valor === "")         { mostrarError(input, "La contraseña es obligatoria");       return false; }
  if (valor.length < 8)     { mostrarError(input, "Mínimo 8 caracteres");                return false; }
  if (!/[A-Z]/.test(valor)) { mostrarError(input, "Debe tener al menos una mayúscula");  return false; }
  if (!/\d/.test(valor))    { mostrarError(input, "Debe tener al menos un número");      return false; }
  if (/ /.test(valor))      { mostrarError(input, "No puede contener espacios");         return false; }

  limpiarError(input);
  return true;
}

function validarContrasenas(input1, input2) {
  const p1 = input1.value;
  const p2 = input2.value;

  if (p2 === "") { mostrarError(input2, "Confirma tu contraseña");       return false; }
  if (p1 !== p2) { mostrarError(input2, "Las contraseñas no coinciden"); return false; }

  limpiarError(input2);
  return true;
}
}