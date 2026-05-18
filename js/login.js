function inicializarLogin() {
    const form = document.getElementById("login-form");
    const inputEmail = document.getElementById("log-email");
    const inputPassword = document.getElementById("log-password");

    if (!form) return;


    document.querySelectorAll(".toggle-pass").forEach(function (icono) {
        icono.addEventListener("click", function () {
            const input = document.getElementById(this.getAttribute("data-target"));
            const viendo = input.type === "text";
            input.type = viendo ? "password" : "text";
            this.classList.toggle("fa-eye", viendo);
            this.classList.toggle("fa-eye-slash", !viendo);
        });
    });


    form.addEventListener("submit", function (e) {
        e.preventDefault();

        [inputEmail, inputPassword].forEach(limpiarError);

        const emailOk = validarEmail(inputEmail);
        const passOk = validarPassword(inputPassword);

        if (!emailOk || !passOk) return;

        const email = inputEmail.value.trim();
        const password = inputPassword.value;

        const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

        const usuarioEncontrado = usuarios.find(user =>
            user.email === email && user.password === password
        );

        if (!usuarioEncontrado) {
            swal.fire({
                icon: 'error',
                iconColor: '#8B5E3C',
                title: '¡Correo o contraseña incorrectos!',
                confirmButtonColor: '#8B5E3C'
            });
            return;
        }

        localStorage.setItem("usuarioActivo", JSON.stringify(usuarioEncontrado));

        if (usuarioEncontrado.email.toLowerCase() === "admon@gmail.com") {
            swal.fire({
                icon: 'success',
                iconColor: '#8B5E3C',
                title: `¡OK! Ingresando al módulo de administración!`,
                confirmButtonColor: '#8B5E3C',
                timer: 3400,
                showConfirmButton: false
            }).then(() => {
                window.location.href = "/pages/admin/admin.html";
            });
        } else {
            swal.fire({
                icon: 'success',
                iconColor: '#8B5E3C',
                title: `¡Bienvenid@ ${usuarioEncontrado.name}!`,
                confirmButtonColor: '#8B5E3C',
                timer: 3400,
                showConfirmButton: false
            }).then(() => {
                window.location.href = "/pages/users/users.html";
            });
        }
    });

    //Validamos campo email

    function validarEmail(input) {
        const valor = input.value.trim();
        const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (valor === "") {
            mostrarError(input, "El correo es obligatorio");
            return false;
        }
        if (!formatoEmail.test(valor)) { mostrarError(input, "Formato inválido, ej: correo@dominio.com"); return false; }

        limpiarError(input);
        return true;
    }

    function validarPassword(input) {
        const valor = input.value;

        if (valor === "") { mostrarError(input, "La contraseña es obligatoria"); return false; }

        limpiarError(input);
        return true;
    }
}