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


/* =========================================
   PLAY / PAUSE VIDEOS HERO
========================================= */

const videoCards = document.querySelectorAll(".video-card");

const isMobile = () => window.matchMedia("(max-width: 768px)").matches;

videoCards.forEach(card => {

    const video = card.querySelector("video");

    /* DESKTOP */
    if(!isMobile()){

        card.addEventListener("mouseenter", () => {

            video.controls = true;

            video.play();

            card.classList.add("playing");
        });

        card.addEventListener("mouseleave", () => {

            video.pause();

            video.currentTime = 0;

            video.controls = false;

            card.classList.remove("playing");
        });
    }

    /* MOBILE */
    else{

        card.addEventListener("click", () => {

            const isPlaying = !video.paused;

            document.querySelectorAll(".product-video").forEach(v => {

                v.pause();

                v.controls = false;

                v.closest(".video-card")?.classList.remove("playing");
            });

            if(!isPlaying){

                video.controls = true;

                video.play();

                card.classList.add("playing");
            }
        });
    }
});