
function initCart()
{
  // 1. VARIABLES
  let cantidadItems = 0
  let totalAcumulado = 0

  // 2. LOCAL STORAGE
  let carritoGuardado =
      JSON.parse(localStorage.getItem("carritoCafe")) || []

  // 3. REFERENCIAS
  const carritoLateral = document.querySelector('#carrito-lateral')
  const carritoOverlay = document.querySelector('#carrito-overlay')
  const carritoItems = document.querySelector('#carrito-items')
  const subtotalValor = document.querySelector('#subtotal-valor')
  const conteoProductos = document.querySelector('.conteo-productos')
  const btnPagar = document.querySelector('.btn-pagar')
  const badgeNav = document.getElementById('conteo-productos-nav');

  carritoItems.innerHTML = ''

  // =========================================================
  // 4. FUNCIONES DE UTILERÍA Y CONTEO
  // =========================================================
  function guardarCarritoStorage() {
    localStorage.setItem(
        "carritoCafe",
        JSON.stringify(carritoGuardado)
    )
  }

  function alertaProducto(texto, icono = "success")
  {
    if (typeof Swal !== "undefined")
    {
      Swal.fire(
      {
        toast: true,
        position: "top-end",
        icon: icono,
        title: texto,
        showConfirmButton: false,
        timer: 1400
      })
    }
    else
    {
      alert(texto)
    }
  }

  function updateConteo()
  {
    if (conteoProductos) {
      conteoProductos.textContent =
        cantidadItems === 1
          ? '1 producto'
          : `${cantidadItems} productos`;
    }

    if (badgeNav) {
        badgeNav.textContent = cantidadItems;
        console.log("Badge actualizado a:", cantidadItems);
    } else {
        console.warn("No se encontró el badge con ID: conteo-productos-nav");
    }
  }

  function updateSubtotal()
  {
    if (subtotalValor) {
      subtotalValor.textContent =
          '$' +
          totalAcumulado.toLocaleString(
              'es-CO',
              {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              }
          )
    }
  }

  // ABRIR / CERRAR
  window.toggleCarrito = function ()
  {
    carritoLateral.classList.toggle('abierto')
    carritoOverlay.classList.toggle('activo')
  }

  function actualizarCantidadItem(div, nuevaCantidad)
  {
    const precio = parseFloat(div.dataset.precio)
    const nuevoSubtotal = precio * nuevaCantidad

    div.dataset.cantidad = nuevaCantidad
    div.querySelector('.item-cantidad').textContent = nuevaCantidad
    div.querySelector('.item-subtotal').textContent =
        '$' + nuevoSubtotal.toLocaleString('es-CO')
  }

  // =========================================================
  // 5. AGREGAR AL CARRITO (productId)
  // =========================================================
  function agregarAlCarrito(id, nombre, precio, imgSrc, desdeStorage = false)
  {
    const itemExistente =
        carritoItems.querySelector(
            `[data-nombre="${nombre}"]`
        )

    // SI YA EXISTE
    if (itemExistente)
    {
      const nuevaCantidad =
          parseInt(itemExistente.dataset.cantidad) + 1

      actualizarCantidadItem(itemExistente, nuevaCantidad)

      cantidadItems += 1
      totalAcumulado += precio

      updateConteo()
      updateSubtotal()

      if (!desdeStorage) {
        let prodExiste = carritoGuardado.find(p => p.nombre === nombre)
        if (prodExiste) {
          prodExiste.cantidad += 1
          guardarCarritoStorage()
        }
      }
      return
    }

    // CREAR NUEVO ITEM
    const div = document.createElement('div')
    div.className = 'carrito-item'
    div.dataset.productId = id // Guardamos el ID que requiere tu OrderDetailRequestDto
    div.dataset.nombre = nombre
    div.dataset.precio = precio
    div.dataset.cantidad = 1

    div.innerHTML = `
      <div class="prod-info">
        <div class="prod-img-placeholder">
          <img src="${imgSrc}" alt="${nombre}">
        </div>
        <div class="prod-detalles">
          <p>${nombre}</p>
          <button class="btn-eliminar">🗑️eliminar</button>
        </div>
      </div>
      <div class="prod-precio">
        $${precio.toLocaleString('es-CO')}
      </div>
      <div class="prod-cantidad">
        <div class="control-cantidad">
          <button class="btn-restar-item">−</button>
          <span class="item-cantidad">1</span>
          <button class="btn-sumar-item">+</button>
        </div>
      </div>
      <div class="prod-total item-subtotal">
        $${precio.toLocaleString('es-CO')}
      </div>
    `

    carritoItems.appendChild(div)

    // BOTON +
    div.querySelector('.btn-sumar-item').addEventListener('click', function ()
    {
      const nueva = parseInt(div.dataset.cantidad) + 1
      if (nueva > 99) return

      actualizarCantidadItem(div, nueva)
      cantidadItems += 1
      totalAcumulado += parseFloat(div.dataset.precio)

      let prodMas = carritoGuardado.find(p => p.nombre === div.dataset.nombre)
      if (prodMas) {
        prodMas.cantidad += 1
        guardarCarritoStorage()
      }

      updateConteo()
      updateSubtotal()
    })

    // BOTON -
    div.querySelector('.btn-restar-item').addEventListener('click', function ()
    {
      const nueva = parseInt(div.dataset.cantidad) - 1
      if (nueva < 1) return

      actualizarCantidadItem(div, nueva)
      cantidadItems -= 1
      totalAcumulado -= parseFloat(div.dataset.precio)

      let prodMenos = carritoGuardado.find(p => p.nombre === div.dataset.nombre)
      if (prodMenos && prodMenos.cantidad > 1) {
        prodMenos.cantidad -= 1
        guardarCarritoStorage()
      }

      updateConteo()
      updateSubtotal()
    })

    // ELIMINAR
    div.querySelector('.btn-eliminar').addEventListener('click', function ()
    {
      eliminarItem(div)
    })

    cantidadItems += 1
    totalAcumulado += precio

    updateConteo()
    updateSubtotal()

    if (!desdeStorage)
    {
      carritoGuardado.push({
        id: id, // Guardamos el ID también en el LocalStorage
        nombre: nombre,
        precio: precio,
        imgSrc: imgSrc,
        cantidad: 1
      })

      guardarCarritoStorage()
      Swal.fire({
            icon: 'success',
            iconColor: '#8B5E3C',
            title: '¡Producto Agregado al Carrito!',
            confirmButtonColor: '#8B5E3C',
            timer: 2400,
            showConfirmButton: false
      });
    }
  }

  // ELIMINAR ITEM
  function eliminarItem(div)
  {
    const nombreProducto = div.dataset.nombre
    const cantidad = parseInt(div.dataset.cantidad)
    const precio = parseFloat(div.dataset.precio)

    if (typeof Swal !== "undefined") {
      Swal.fire({
        title: "¿Eliminar producto?",
        text: `¿Deseas quitar ${nombreProducto} del carrito?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "No",
        confirmButtonColor: "#8B5E3C",
        cancelButtonColor: "#999"
      }).then((result) => {
        if (result.isConfirmed) {
          cantidadItems -= cantidad
          totalAcumulado -= precio * cantidad

          if (cantidadItems < 0) cantidadItems = 0
          if (totalAcumulado < 0) totalAcumulado = 0

          carritoGuardado = carritoGuardado.filter(item => item.nombre !== nombreProducto)
          guardarCarritoStorage()
          div.remove()

          updateConteo()
          updateSubtotal()
          alertaProducto("Producto eliminado", "success")
        }
      })
    } else {
      let confirmar = confirm(`¿Deseas quitar ${nombreProducto} del carrito?`)
      if (confirmar) {
        cantidadItems -= cantidad
        totalAcumulado -= precio * cantidad

        if (cantidadItems < 0) cantidadItems = 0
        if (totalAcumulado < 0) totalAcumulado = 0

        carritoGuardado = carritoGuardado.filter(item => item.nombre !== nombreProducto)
        guardarCarritoStorage()
        div.remove()

        updateConteo()
        updateSubtotal()
        alert("Producto eliminado")
      }
    }
  }

  // =========================================================
  // 6. BOTONES DEL CATÁLOGO (Capturan data-id)
  // =========================================================
  function adjuntarBotonesCarrito()
  {
    document.querySelectorAll('.btn-cart').forEach(function (boton)
    {
      if (boton.dataset.cartReady) return
      boton.dataset.cartReady = 'true'

      boton.addEventListener('click', function ()
      {
        const card = boton.closest('.card')
        
        // Buscamos el ID del producto que viene de tu DB (en el botón o en la card)
        const id = boton.dataset.id || card.dataset.id || "1"; 
        const nombre = card.querySelector('h3').textContent.trim()
        const imgSrc = card.querySelector('img')?.src || ''
        const precioTexto = card.querySelector('.price').textContent
                .replace('$', '')
                .replace(/\./g, '')
                .trim()
        const precio = parseFloat(precioTexto)

        agregarAlCarrito(id, nombre, precio, imgSrc)

        if (!carritoLateral.classList.contains('abierto')) {
          toggleCarrito()
        }
      })
    })
  }

  adjuntarBotonesCarrito()
  document.addEventListener('catalogoListo', adjuntarBotonesCarrito)

  // =========================================================
  // 7. API DE PAGO SINCRONIZADA
  // =========================================================
  const checkoutButton = document.getElementById("btn-pagar");

  if (checkoutButton) {
    checkoutButton.addEventListener("click", async () => {
      
      const details = [];
      document.querySelectorAll('.carrito-item').forEach(div => {
        details.push({
          productId: Number(div.dataset.productId || 1), // Asegura un Long válido
          quantityProducts: Number(div.dataset.cantidad)  // Mapea a Integer de quantityProducts
        });
      });

      if (details.length === 0) {
        return Swal.fire({
          icon: 'info',
          iconColor: '#8B5E3C',
          title: '¡Tu carretilla está vacía!',
          confirmButtonColor: '#8B5E3C',
          timer: 2400,
          showConfirmButton: false
        });
      }

      try {
        checkoutButton.textContent = "Cargando pago...";
        checkoutButton.disabled = true;

        const API_URL = (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
          ? "http://localhost:8080"
          : "https://e-commerce-historias-de-cafe-backend.onrender.com";

        const token = localStorage.getItem("authToken");
        const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));

        if (!token || !usuarioActivo || !(usuarioActivo.id || usuarioActivo.idUser)) {
          throw new Error("Debes iniciar sesión para procesar el pago.");
        }

        const authHeaders = {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        };

        // JSON estructurado idéntico a OrderRequestDto
        const orderPayload = {
          userId: usuarioActivo.id || usuarioActivo.idUser, 
          stateOrder: "En proceso", 
          details: details 
        };

        // PASO 1: Crear la orden
        const orderResponse = await fetch(`${API_URL}/orders`, {
          method: "POST",
          headers: authHeaders,
          body: JSON.stringify(orderPayload)
        });

        if (orderResponse.status === 401 || orderResponse.status === 403) {
          throw new Error("No tienes autorización para crear la orden. Verifica los permisos del rol CLIENTE en el backend.");
        }

        if (!orderResponse.ok) throw new Error("Error interno en /orders");

        const orderData = await orderResponse.json();
        const nuevoOrderId = orderData.id; 

        // PASO 2: Procesar el pago pasándole el ID real
        const paymentResponse = await fetch(`${API_URL}/payments`, {
          method: "POST",
          headers: authHeaders,
          body: JSON.stringify({ orderId: nuevoOrderId })
        });

        if (paymentResponse.status === 401 || paymentResponse.status === 403) {
          throw new Error("No tienes autorización para procesar el pago. Verifica los permisos del rol CLIENTE en el backend.");
        }

        if (!paymentResponse.ok) throw new Error("Error interno en /payments");

        const paymentData = await paymentResponse.json();
        const linkDePago = paymentData.paymentUrl;

        if (linkDePago) {
          window.location.href = linkDePago;
        } else {
          throw new Error("No se obtuvo paymentUrl de la respuesta.");
        }
      }
      catch (error) {
        console.error("Error:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error al conectar con el servidor',
          text: 'No se pudo procesar tu compra de café. Inténtalo de nuevo.',
          confirmButtonColor: '#8B5E3C'
        });
        checkoutButton.textContent = "Ir a pagar";
        checkoutButton.disabled = false;
      }
    });
  }

  // =========================================================
  // 8. CARGAR STORAGE
  // =========================================================
  if (carritoGuardado.length > 0)
  {
    carritoGuardado.forEach(producto =>
    {
      for (let i = 0; i < producto.cantidad; i++)
      {
        agregarAlCarrito(
            producto.id || "1",
            producto.nombre,
            producto.precio,
            producto.imgSrc,
            true
        )
      }
    })
  }
}