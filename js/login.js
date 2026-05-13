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

            swal.fire({
                icon: 'error',
                iconColor: '#8B5E3C',
                title: '¡Correo o contraseña incorrectos!',
                confirmButtonColor: '#8B5E3C'
            }); 
            
            return;
        }

        // sesión activa
        localStorage.setItem(
            "usuarioActivo",
            JSON.stringify(usuarioEncontrado)
        );

        if (usuarioEncontrado.isAdmin) {

            swal.fire({
                icon: 'success',
                iconColor: '#8B5E3C',
                title: `¡Bienvenido Admin! ${usuarioEncontrado.name}!`,
                confirmButtonColor: '#8B5E3C',
                timer: 2400,
                showConfirmButton: false
            });
        } else {
            swal.fire({
                icon: 'success',
                iconColor: '#8B5E3C',
                title: `¡Ahora eres un Coffee Lover Bienvenido! ${usuarioEncontrado.name}!`,
                confirmButtonColor: '#8B5E3C',
            timer: 2400,
            showConfirmButton: false
        });

            window.location.href =
            "/pages/catalogo/catalogo.html";
        }
    });
}