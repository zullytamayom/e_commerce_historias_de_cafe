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

  if (document.getElementById("contact-container")) {
    loadComponent("contact-container", "/components/contact/contact.html", cargarFormContact);
  }
  loadComponent("login-container", "/components/login/login.html"); 
  
 
  loadComponent("carrito-container","/components/cart/cart.html",(typeof initCart === 'function') ? initCart : () => console.warn("initCart no definida")
); //  carrito
loadComponent("productform-container","/components/product/productForm.html",(typeof initProductLogic === 'function')? initProductLogic :() => console.warn("producto no definido")
);

});





