document.addEventListener("DOMContentLoaded", () => {
    cargarFormLogin();
});

function cargarFormLogin() {

    const form = document.getElementById("login-form");

    if (!form) return;

    // ojito
    document.querySelectorAll(".toggle-pass").forEach(icono => {

        icono.addEventListener("click", function () {

            const input = document.getElementById(
                this.dataset.target
            );

            const isPassword = input.type === "password";

            input.type = isPassword ? "text" : "password";

            this.classList.toggle("fa-eye");
            this.classList.toggle("fa-eye-slash");
        });
    });

    form.addEventListener("submit", function(e){

        e.preventDefault();

        const email = document
        .getElementById("login-email")
        .value
        .trim();

        const password = document
        .getElementById("login-pass")
        .value;

        const usuarios = JSON.parse(
            localStorage.getItem("usuarios")
        ) || [];

        const usuarioEncontrado = usuarios.find(user => {

            return (
                user.email === email &&
                user.password === password
            );
        });

        if (!usuarioEncontrado) {

            alert("Correo o contraseña incorrectos");

            return;
        }

        // sesión activa
        localStorage.setItem(
            "usuarioActivo",
            JSON.stringify(usuarioEncontrado)
        );

        alert(`Bienvenido ${usuarioEncontrado.name}`);

        window.location.href =
        "/pages/catalogo/catalogo.html";
    });
}