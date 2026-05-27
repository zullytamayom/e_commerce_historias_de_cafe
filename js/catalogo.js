const API_URL_PRODUCTS = (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
  ? "http://localhost:8080/products"
  : "https://e-commerce-historias-de-cafe-backend.onrender.com/products";

async function renderizarProductosDesdeBackend() {
  const contenedor = document.getElementById('catalogo-container');
  if (!contenedor) return;

  try {
    // Consultar al Backend de Spring Boot
    const response = await fetch(API_URL_PRODUCTS);
    if (!response.ok) throw new Error("No se pudo obtener la lista de cafés del servidor.");
    
    const listaProductos = await response.json();


    // ProductResponseDTO
    listaProductos.forEach(prod => {
      // Validar caídas de imágenes o usar la URL de Cloudinary procesada
      const urlImagen = prod.imagen || 'https://via.placeholder.com/300x400?text=Historias+de+Cafe';
      const nombreProd = prod.name || "Café Premium";
      const regionProd = prod.categoryName || "Región Origen";
      const descripcionProd = prod.description || "Sin descripción disponible.";
      const precioProd = prod.price || 0;

      const cardHTML = `
        <article class="card">
          <div class="image-placeholder">
            <img src="${urlImagen}" onerror="this.src='https://via.placeholder.com/300x400?text=Historias+de+Cafe'"
                 alt="${nombreProd}" style="width:auto; height:100%; object-fit:contain;">
          </div>
          <div class="card-content">
            <h3>${nombreProd}</h3>
            <p class="finca">📍 ${regionProd}</p>
            <div class="stars">★★★★★</div>
            <p class="description">${descripcionProd}</p>
            <p class="price">$${precioProd.toLocaleString('es-CO')}</p>
            <div class="card-buttons">
              <button class="btn-cart">AÑADIR AL CARRITO</button>
              <button class="btn-detail">👁️ MOSTRAR DETALLE</button>
            </div>
          </div>
        </article>
      `;
      contenedor.innerHTML += cardHTML;
    });

  } catch (error) {
    console.error("Error cargando el catálogo dinámico:", error);
  }

  // Avisar al carrito que las tarjetas dinámicas ya se crearon en el DOM
  document.dispatchEvent(new CustomEvent('catalogoListo'));
}

// Cambiar el disparador para ejecutar la nueva función asíncrona
document.addEventListener('DOMContentLoaded', renderizarProductosDesdeBackend);