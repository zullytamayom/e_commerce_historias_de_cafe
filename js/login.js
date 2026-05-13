function inicializarLogin() {
    const form = document.getElementById("login-form");

    if (!form) return;

    form.addEventListener("submit", function(e) {
        e.preventDefault();

        // IDs correctos según tu HTML
        const email = document.getElementById("log-email").value.trim();
        const password = document.getElementById("log-password").value;

        // Buscamos en la clave "usuarios" (la misma que arreglamos en registro)
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
        }

        localStorage.setItem("usuarioActivo", JSON.stringify(usuarioEncontrado));
        swal.fire({
            icon: 'success',
            iconColor: '#8B5E3C',
            title: `¡Bienvenido! ${usuarioEncontrado.name}!`,
            confirmButtonColor: '#8B5E3C',
            timer: 3400,
            showConfirmButton: false
        });
        
        if (usuarioEncontrado.email.toLowerCase() === "admon@gmail.com") {
            swal.fire({
            icon: 'success',
            iconColor: '#8B5E3C',
            title: `¡OK! Ingresando al módulo de administración!`,
            confirmButtonColor: '#8B5E3C',
            timer: 3400,
            showConfirmButton: false
        });
            window.location.href = "/pages/admin/admin.html"; 
        } else {
            // Si es cualquier otro usuario, va al catálogo
            window.location.href = "/pages/catalogo/catalogo.html";
        }
    });
}