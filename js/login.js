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
            alert("Correo o contraseña incorrectos");
            return;
        }

        localStorage.setItem("usuarioActivo", JSON.stringify(usuarioEncontrado));
        alert(`¡Bienvenido ${usuarioEncontrado.name}!`);
        
        if (usuarioEncontrado.email.toLowerCase() === "admon@gmail.com") {

            window.location.href = "/pages/admin/admin.html"; 
        } else {
            // Si es cualquier otro usuario, va al catálogo
            window.location.href = "/pages/catalogo/catalogo.html";
        }
    });
}