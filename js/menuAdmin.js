// Carga el componente sidebar en admin.html
// BASE_URL se define en main.js (cargado antes que este script)
const sidebarUrl = (typeof BASE_URL !== 'undefined' ? BASE_URL : '../../') + 'components/menuAdmin/menuAdmin.html';

fetch(sidebarUrl)
  .then(response => response.text())
  .then(html => {
    document.getElementById('sidebar-container').innerHTML = html;

    // Activar la navegación y componentes del sidebar DESPUÉS de cargarlo
    activarMenu();
    inicializarAuth(); // <--- Nueva función para manejar el botón de salir de forma segura
  })
  .catch(err => console.error('Error cargando sidebar:', err));


function activarMenu() {
  const items = document.querySelectorAll('.sidebar nav ul li');

  items.forEach(item => {
    item.addEventListener('click', () => {
      items.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      const view = item.getAttribute('data-view');
      const titleMain = document.querySelector('.main-content h1');
      if (titleMain) titleMain.textContent = view;
    });
  });
}

// Separamos la lógica del botón de salida para asegurarnos de que ya exista en el DOM
function inicializarAuth() {
  const authBtn = document.getElementById("authBtn"); // <--- Ahora sí está declarado
  
  if (authBtn) {
    authBtn.onclick = () => {
      localStorage.removeItem("usuarioActivo");
      localStorage.removeItem("token"); // Te sugiero limpiar también el token aquí si lo usas
      window.location.href = "/pages/home/home.html"; 
    };
  } else {
    console.warn("No se encontró el botón #authBtn en el DOM del sidebar.");
  }
}


document.addEventListener("DOMContentLoaded", () => {
    // Nota: Como tus menuItems están dentro del sidebar que se carga dinámicamente,
    // es mejor que esta lógica también se mueva o se valide con cuidado.
    const menuItems = document.querySelectorAll(".sidebar ul li");
    const title = document.querySelector(".top-bar span");
    const mainContent = document.querySelector(".content-padding");

    const views = {
        "Dashboard": "<h2>Dashboard</h2>",
        "Productos": "<h2>Productos</h2><div id='productform-container'></div>",
        "Ordenes": "<h2>Órdenes</h2>",
        "Usuarios": "<h2>Usuarios</h2>",
        "Configuración": "<h2>Configuración</h2>",
        "Salir": "<h2>Salir</h2>"
    };

    menuItems.forEach(item => {
        item.addEventListener("click", () => {
            menuItems.forEach(i => i.classList.remove("active"));
            item.classList.add("active");

            const view = item.dataset.view;

            if (mainContent) {
                mainContent.classList.add("fade-out");

                setTimeout(() => {
                    if (title) title.textContent = view;
                    mainContent.innerHTML = views[view] || "<h2>Vista</h2>";

                    mainContent.classList.remove("fade-out");
                    mainContent.classList.add("fade-in");

                    setTimeout(() => {
                        mainContent.classList.remove("fade-in");
                    }, 300);

                }, 200);
            }
        });
    });

    // Toggle sidebar
    const sidebar = document.querySelector(".sidebar");
    const topBar = document.querySelector(".top-bar");

    if (topBar && sidebar) {
        const toggleBtn = document.createElement("button");
        toggleBtn.innerHTML = "<i class='bi bi-list'></i>";
        toggleBtn.classList.add("toggle-btn");

        topBar.prepend(toggleBtn);

        toggleBtn.addEventListener("click", () => {
            sidebar.classList.toggle("collapsed");
        });
    }
});

// Usamos un listener seguro por si el botón "openModal" tarda en renderizar
const openModalBtn = document.getElementById("openModal");
if (openModalBtn) {
    openModalBtn.onclick = () => {
        const modal = document.getElementById("modal-producto");
        if (modal) modal.style.display = "flex";
    };
}