// initCart — callback de loadComponent en main.js
// Se ejecuta cuando cart.html ya está en el DOM

function initCart()
{

  // VARIABLES
  let cantidadItems = 0
  let totalAcumulado = 0

  // LOCAL STORAGE
  let carritoGuardado =
      JSON.parse(localStorage.getItem("carritoCafe")) || []

  function guardarCarritoStorage() {
    localStorage.setItem(
        "carritoCafe",
        JSON.stringify(carritoGuardado)
    )
  }

  // REFERENCIAS
  const carritoLateral = document.querySelector('#carrito-lateral')
  const carritoOverlay = document.querySelector('#carrito-overlay')
  const carritoItems = document.querySelector('#carrito-items')
  const subtotalValor = document.querySelector('#subtotal-valor')
  const conteoProductos = document.querySelector('.conteo-productos')
  const btnPagar = document.querySelector('.btn-pagar')
  const badgeNav = document.getElementById('conteo-productos-nav');


  carritoItems.innerHTML = ''

  // ALERTAS
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

  // ABRIR / CERRAR
  window.toggleCarrito = function ()
  {
    carritoLateral.classList.toggle('abierto')
    carritoOverlay.classList.toggle('activo')
  }

  // BOTONES DEL CATÁLOGO
  function adjuntarBotonesCarrito()
  {

    document.querySelectorAll('.btn-cart').forEach(function (boton)
    {

      if (boton.dataset.cartReady) return
      boton.dataset.cartReady = 'true'

      boton.addEventListener('click', function ()
      {

        const card = boton.closest('.card')

        const nombre =
            card.querySelector('h3').textContent.trim()

        const imgSrc =
            card.querySelector('img')?.src || ''

        const precioTexto =
            card.querySelector('.price').textContent
                .replace('$', '')
                .replace(/\./g, '')
                .trim()

        const precio = parseFloat(precioTexto)

        agregarAlCarrito(nombre, precio, imgSrc)

        if (!carritoLateral.classList.contains('abierto'))
        {
          toggleCarrito()
        }

      })

    })

  }

  adjuntarBotonesCarrito()
  document.addEventListener(
      'catalogoListo',
      adjuntarBotonesCarrito
  )


  // AGREGAR AL CARRITO

  function agregarAlCarrito(nombre, precio, imgSrc, desdeStorage = false)
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

      actualizarCantidadItem(
          itemExistente,
          nuevaCantidad
      )

      cantidadItems += 1
      totalAcumulado += precio

      updateConteo()
      updateSubtotal()

      if (!desdeStorage) {
        let prodExiste =
            carritoGuardado.find(
                p => p.nombre === nombre
            )

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
    div.querySelector('.btn-sumar-item')
        .addEventListener('click', function ()
        {

          const nueva =
              parseInt(div.dataset.cantidad) + 1

          if (nueva > 99) return

          actualizarCantidadItem(div, nueva)

          cantidadItems += 1
          totalAcumulado += parseFloat(div.dataset.precio)

          let prodMas =
              carritoGuardado.find(
                  p => p.nombre === div.dataset.nombre
              )

          if (prodMas) {
            prodMas.cantidad += 1
            guardarCarritoStorage()
          }

          updateConteo()
          updateSubtotal()

        })

    // BOTON -
    div.querySelector('.btn-restar-item')
        .addEventListener('click', function ()
        {

          const nueva =
              parseInt(div.dataset.cantidad) - 1

          if (nueva < 1) return

          actualizarCantidadItem(div, nueva)

          cantidadItems -= 1
          totalAcumulado -= parseFloat(div.dataset.precio)

          let prodMenos =
              carritoGuardado.find(
                  p => p.nombre === div.dataset.nombre
              )

          if (prodMenos && prodMenos.cantidad > 1)
          {
            prodMenos.cantidad -= 1
            guardarCarritoStorage()
          }

          updateConteo()
          updateSubtotal()

        })

    // ELIMINAR
    div.querySelector('.btn-eliminar')
        .addEventListener('click', function ()
        {
          eliminarItem(div)
        })

    cantidadItems += 1
    totalAcumulado += precio

    updateConteo()
    updateSubtotal()

    if (!desdeStorage)
    {

      carritoGuardado.push(
      {
        nombre: nombre,
        precio: precio,
        imgSrc: imgSrc,
        cantidad: 1
      })

      guardarCarritoStorage()
      swal.fire({
            icon: 'info',
            iconColor: '#8B5E3C',
            //background: '#999',
            title: '¡Producto Agregado al Carrito!',
            confirmButtonColor: '#8B5E3C',
            timer: 2400,
            showConfirmButton: false
          });
        textArea.value = "";
    }

  }

 
  // ACTUALIZAR ITEM
 
  function actualizarCantidadItem(div, nuevaCantidad)
  {

    const precio =
        parseFloat(div.dataset.precio)

    const nuevoSubtotal =
        precio * nuevaCantidad

    div.dataset.cantidad = nuevaCantidad

    div.querySelector('.item-cantidad')
        .textContent = nuevaCantidad

    div.querySelector('.item-subtotal')
        .textContent =
        '$' + nuevoSubtotal.toLocaleString('es-CO')

  }

  
  // ELIMINAR
  
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

        if (result.isConfirmed)
        {

          cantidadItems -= cantidad
          totalAcumulado -= precio * cantidad

          if (cantidadItems < 0) cantidadItems = 0
          if (totalAcumulado < 0) totalAcumulado = 0

          carritoGuardado = carritoGuardado.filter(
              item => item.nombre !== nombreProducto
          )

          guardarCarritoStorage()

          div.remove()

          updateConteo()
          updateSubtotal()

          alertaProducto("Producto eliminado", "success")
        }

      })

    }
    else
    {

      let confirmar = confirm(
          `¿Deseas quitar ${nombreProducto} del carrito?`
      )

      if (confirmar)
      {

        cantidadItems -= cantidad
        totalAcumulado -= precio * cantidad

        if (cantidadItems < 0) cantidadItems = 0
        if (totalAcumulado < 0) totalAcumulado = 0

        carritoGuardado = carritoGuardado.filter(
            item => item.nombre !== nombreProducto
        )

        guardarCarritoStorage()

        div.remove()

        updateConteo()
        updateSubtotal()

        alert("Producto eliminado")
      }

    }

  }

  //API DE PAGO

 const checkoutButton = document.getElementById("btn-pagar");

  if (checkoutButton) {
    checkoutButton.addEventListener("click", async () => {
      
      const items = [];
      document.querySelectorAll('.carrito-item').forEach(div =>
      {
        items.push({
          title: div.dataset.nombre,
          unit_price: Number(div.dataset.precio),
          quantity: Number(div.dataset.cantidad),
          currency_id: 'COP'
        });
      });

      if (items.length === 0) return swal.fire({
            icon: 'info',
            iconColor: '#8B5E3C',
            //background: '#999',
            title: '¡Tu carretilla está vacía!',
            confirmButtonColor: '#8B5E3C',
            timer: 2400,
            showConfirmButton: false
          });
        textArea.value = "";
      

      try {
        checkoutButton.textContent = "Cargando pago...";
        checkoutButton.disabled = true;

        const response = await fetch("http://localhost:3000/create_preference",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items })
        });

        const data = await response.json();

        if (data.init_point)
        {
          // REDIRECCIÓN DIRECTA: Esto ignora el error del SDK
          window.location.href = data.init_point;
        } else
        {
          throw new Error("No se pudo obtener el link de pago");
        }

      }
      catch (error)
      {
        console.error("Error:", error);
        alert("Error al conectar con el servidor de pagos");
        checkoutButton.textContent = "Ir a pagar";
        checkoutButton.disabled = false;
      }
    });
  }

  // CONTEO

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

  // SUBTOTAL
  function updateSubtotal()
  {

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


  // CARGAR STORAGE
  if (carritoGuardado.length > 0)
  {

    carritoGuardado.forEach(producto =>
    {

      for (let i = 0; i < producto.cantidad; i++)
      {

        agregarAlCarrito(
            producto.nombre,
            producto.precio,
            producto.imgSrc,
            true
        )
      }
    })
  }
}