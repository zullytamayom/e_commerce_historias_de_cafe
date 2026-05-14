// --- 1. CONFIGURACIÓN INICIAL DEL CARRITO ---
const contadorUI = document.getElementById('contadorCarrito');


// --- 2. FUNCIONALIDAD DEL CARRUSEL ---
const next = document.querySelector('.next');
const prev = document.querySelector('.prev');

next?.addEventListener('click', () => {
    let items = document.querySelectorAll('.item');
    document.querySelector('.slide-list').appendChild(items[0]);
});

prev?.addEventListener('click', () => {
    let items = document.querySelectorAll('.item');
    document.querySelector('.slide-list').prepend(items[items.length - 1]);
});

// --- 3. TRANSICIÓN DE COHETE (MENU) ---
document.querySelectorAll('.opcionesBarra').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        const transition = document.getElementById('rocket-transition');
        const rocket = transition.querySelector('.rocket');

        transition.style.display = 'flex';
        rocket.classList.add('launching');

        setTimeout(() => {
            targetSection.scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => {
                transition.style.display = 'none';
                rocket.classList.remove('launching');
            }, 300);
        }, 400);
    });
});

// 4. LÓGICA DE COMPRA (POPUP)
const modalCompra = new bootstrap.Modal(document.getElementById('modalCompra'));
const btnConfirmar = document.getElementById('btnConfirmar');
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
const contador = document.getElementById('contadorCarrito');
let botonActual = null;
let productoActual = null;

function actualizarCarritoUI() {
    contador.textContent = carrito.length;

    const total = carrito.reduce((acc, item) => acc + item.precio, 0);

    console.log("TOTAL:", total);

    localStorage.setItem('carrito', JSON.stringify(carrito));
}


document.querySelectorAll('.btn-cart').forEach(boton => {
    boton.addEventListener('click', (e) => {

        const item = e.target.closest('.item');
        const titulo = item.querySelector('.title').innerText;

        const precio = Number(boton.dataset.precio);

        document.getElementById('mensajePaquete').innerText =
            `¿Deseas reservar tu lugar en: ${titulo}?`;

        document.getElementById('precioPaquete').innerText =
            `$ ${precio.toLocaleString('es-CO')}`;

        botonActual = boton;

        productoActual = {
            nombre: titulo,
            precio: precio
        };

        modalCompra.show();
    });
});

btnConfirmar.addEventListener('click', () => {

    if (!productoActual) return;

    const existe = carrito.find(item => item.nombre === productoActual.nombre);

    if (existe) {
        alert("Este paquete ya fue comprado 🚀");
        modalCompra.hide();
        return;
    }

    carrito.push(productoActual);

    actualizarCarritoUI();

    modalCompra.hide();
    
    if(botonActual) {
        botonActual.innerText = "¡Comprado! ✅";
        botonActual.classList.add('btn-success');
        crearParticulas(window.innerWidth / 2, window.innerHeight / 2);
    }

    alert("¡Felicidades! Tu ticket intergaláctico ha sido procesado.");
});

// --- 5. FUNCIÓN DE PARTÍCULAS ---
function crearParticulas(x, y) {
    for (let i = 0; i < 15; i++) {
        const particula = document.createElement('div');
        particula.className = 'particula-espacial';
        document.body.appendChild(particula);
        particula.style.left = `${x}px`;
        particula.style.top = `${y}px`;

        particula.animate([
            { transform: 'translate(0,0) scale(1)', opacity: 1 },
            { transform: `translate(${(Math.random()-0.5)*200}px, ${(Math.random()-0.5)*200}px) scale(0)`, opacity: 0 }
        ], { duration: 1000 }).onfinish = () => particula.remove();
    }
}



// Consumo API de la NASA
// const apiKey = '3f38bc39ylKXHyVWWRZLFRg6efC5HUFsnmXYW1Jd';

// async function obtenerFotoNasa() {
//   try {
//     const respuesta = await fetch(url);
    
//     // Validar si la respuesta es correcta (status 200)
//     if (!respuesta.ok) {
//       throw new Error(`Error en la petición: ${respuesta.status}`);
//     }

//     const datos = await respuesta.json();

//     // Insertar los datos en el HTML
//     document.getElementById('titulo').innerText = datos.title;
//     document.getElementById('explicacion').innerText = datos.explanation;
    
//     const imgElement = document.getElementById('imagen-nasa');
    
//     // Manejar si el contenido es un video.
//     if (datos.media_type === 'image') {
//       imgElement.src = datos.url;
//     } else {
//       imgElement.alt = "El contenido de hoy es un video: " + datos.url;
//     }

//   } catch (error) {
//     console.error("Hubo un error al consultar la API:", error);
//   }
// }

// Ejecutar la función
// obtenerFotoNasa();


// function cargarNASA() {
//     const url = "https://api.nasa.gov/planetary/apod?api_key=3f38bc39ylKXHyVWWRZLFRg6efC5HUFsnmXYW1Jd";

//     fetch(url)
//         .then(res => res.json())
//         .then(data => {
//             const img = document.getElementById("nasa-img");
//             const title = document.getElementById("nasa-title");
//             const footer = document.querySelector(".footer");

//             if (data.media_type === "image") {
//                 img.src = data.url;
//                 title.textContent = data.title;

//                 const testImg = new Image();
//                 testImg.crossOrigin = "Anonymous";
//                 testImg.src = data.url;

//                 testImg.onload = function() {
//                     try {
//                         const canvas = document.createElement("canvas");
//                         const ctx = canvas.getContext("2d");
//                         canvas.width = 10; 
//                         canvas.height = 10;
//                         ctx.drawImage(testImg, 0, 0, 10, 10);
                        
//                         // Sacamos dos puntos de color
//                         const p1 = ctx.getImageData(0, 0, 1, 1).data;
//                         const p2 = ctx.getImageData(9, 9, 1, 1).data;

                        
//                     } catch (e) {
//                         console.log("CORS evitó extraer colores, usando defecto.");
//                     }
//                 };
//             }
//         })
//         .catch(err => console.error("Error NASA:", err));
// }

function animarFooter() {
    const footer = document.querySelector(".footer");
    if(!footer) return;

    const top = footer.getBoundingClientRect().top;
    const trigger = window.innerHeight * 0.9;

    if (top < trigger) {
        footer.classList.add("visible");
    }
}

window.addEventListener("scroll", animarFooter);
// Ejecutar al cargar con un mini delay para que el DOM esté listo
window.addEventListener("load", () => setTimeout(animarFooter, 100));