function loadComponent(containerId, path, callback) {
  const container = document.getElementById(containerId);
  if (!container) return; //  Si el contenedor no existe en esta página, no hace nada

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
  const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));
  const userContent = document.getElementById("user-status-content");
  const authBtn = document.getElementById("nav-auth-btn");

  if (usuarioActivo && authBtn && userContent) {
    // ESTADO: LOGUEADO
    const primerNombre = usuarioActivo.name.split(" ")[0];
    userContent.innerHTML = `<span class="welcome-msg">Hola, <strong>${primerNombre}</strong></span>`;
    
    authBtn.textContent = "Salir";
    authBtn.classList.add("btn-logout"); // Clase para estilo diferente

    authBtn.onclick = () => {
      localStorage.removeItem("usuarioActivo");
      window.location.href = "/pages/home.html"; // AJUSTAR AQUI CUANDO ESTE LISTO EL HOME.
    };
  } else if (authBtn && userContent) {
    // ESTADO: INVITADO
    userContent.innerHTML = ""; // No hay saludo
    authBtn.textContent = "Entrar";
    authBtn.classList.remove("btn-logout");

    authBtn.onclick = () => {
      window.location.href = "/pages/users/users.html";
    };
  }

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

  loadComponent("navbar-container","/components/navBar/navBar.html", initNavbar);
  loadComponent("footer-container", "/components/footer/footer.html");
if (document.getElementById("register-container")) {
    loadComponent("register-container", "/components/register/register.html", cargarFormRegister);
  }

  if (document.getElementById("login-container")) {
    loadComponent("login-container", "/components/login/login.html", inicializarLogin); 
  }

  if (document.getElementById("contact-container")) {
    loadComponent("contact-container", "/components/contact/contact.html", cargarFormContact);
  }

  
 
  loadComponent("carrito-container","/components/cart/cart.html",(typeof initCart === 'function') ? initCart : () => console.warn("initCart no definida")
); //  carrito
loadComponent("productform-container","/components/product/productForm.html",(typeof initProductLogic === 'function')? initProductLogic :() => console.warn("producto no definido")
);

});





