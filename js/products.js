const listaProductos = [];

// --- 1. LÓGICA DEL FORMULARIO (CORREGIDA Y SINCRONIZADA) ---
function initProductLogic() {
  const form = document.getElementById("form-producto");
  const modal = document.getElementById("modal-producto");

  if (!form) {
    console.error("No se encontró el formulario con id 'form-producto'");
    return;
  }

  // IMPORTANTE: Clonar el formulario elimina cualquier addEventListener previo acumulado
  const nuevoForm = form.cloneNode(true);
  form.parentNode.replaceChild(nuevoForm, form);

  nuevoForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Limpiar errores anteriores
    document.querySelectorAll(".invalid-feedback").forEach((el) => el.remove());
    document
      .querySelectorAll(".is-invalid")
      .forEach((el) => el.classList.remove("is-invalid"));

    let isValid = true;

    // --- ENLAZAR INPUTS (Sincronizado con el nuevo HTML) ---
    const marcaInput = document.getElementById("marca"); // Ajustado: id="marca"
    const origenInput = document.getElementById("origen");
    const tostadoInput = document.getElementById("tostado");
    const regionInput = document.getElementById("region");
    const imagenInput = document.getElementById("imagen");
    const stockInput = document.getElementById("stock");
    const precioInput = document.getElementById("precio");
    const descInput = document.getElementById("descripcion");

    // --- VALIDACIONES ---
    if (!marcaInput || marcaInput.value.trim().length < 3) {
      if (marcaInput) mostrarError(marcaInput, "La marca es obligatoria (mín. 3 caracteres)");
      isValid = false;
    }

    if (!origenInput || origenInput.value.trim().length < 3) {
      if (origenInput) mostrarError(origenInput, "La finca de origen es obligatoria (mín. 3 caracteres)");
      isValid = false;
    }

    if (!tostadoInput || !tostadoInput.value) {
      if (tostadoInput) mostrarError(tostadoInput, "Selecciona un tipo de tostión");
      isValid = false;
    }

    if (!regionInput || !regionInput.value) {
      if (regionInput) mostrarError(regionInput, "Selecciona la región del café");
      isValid = false;
    }

    if (!imagenInput || !imagenInput.files[0]) {
      if (imagenInput) mostrarError(imagenInput, "Debes cargar una imagen");
      isValid = false;
    }

    if (!stockInput || stockInput.value === "" || parseInt(stockInput.value) < 0) {
      if (stockInput) mostrarError(stockInput, "Stock no válido");
      isValid = false;
    }

    if (!precioInput || precioInput.value === "" || parseFloat(precioInput.value) <= 0) {
      if (precioInput) mostrarError(precioInput, "El precio debe ser mayor a 0");
      isValid = false;
    }

    if (!descInput || descInput.value.trim().length < 10) {
      if (descInput) mostrarError(descInput, "Descripción demasiado corta (mín. 10 caracteres)");
      isValid = false;
    }

    // --- PROCESO DE GUARDADO ASINCRÓNICO ---
    if (isValid) {
      const file = imagenInput.files[0];
      const reader = new FileReader();

      reader.onload = function () {
        const base64Image = reader.result;
        
        const producto = {
          id: Date.now(),
          nombre: marcaInput.value.trim(), // Se mapea marca a la propiedad 'nombre' para la tabla
          origen: origenInput.value.trim(),
          tostado: tostadoInput.value,
          region: regionInput.value,
          estado: "Activo", // Estado lógico controlado por el sistema por defecto
          stock: parseInt(stockInput.value),
          precio: parseFloat(precioInput.value),
          descripcion: descInput.value.trim(),
          imagen: base64Image
        };

        // Guardar en el estado de la aplicación
        listaProductos.push(producto);
        
        // Guardar en LocalStorage
        localStorage.setItem("productos", JSON.stringify(listaProductos));

        // Actualizar la interfaz física
        actualizarTabla();

        // Limpiar el formulario y cerrar el modal ANTES de la alerta para mejorar UX
        nuevoForm.reset();
        modal.style.display = "none";

        // Lanzar alerta estética de SweetAlert2
        setTimeout(() => {
          Swal.fire({
            icon: "success",
            iconColor: "#532721",
            title: "¡Producto Agregado!",
            text: "El producto se guardó correctamente en Historias de Café",
            confirmButtonColor: "#B08D57",
            confirmButtonText: "Genial",
          });
        }, 100);
      };
      
      reader.readAsDataURL(file);
    }
  });
}

// --- 2. ELIMINAR PRODUCTO ---
function eliminarProducto(id) {
  const producto = listaProductos.find(prod => prod.id === id);
  if (!producto) return;

  Swal.fire({
    title: '¿Estás seguro?',
    text: `Vas a eliminar "${producto.nombre}" de Historias de Café.`,
    icon: 'warning',
    iconColor: '#d33',
    showCancelButton: true,
    confirmButtonColor: '#532721',
    cancelButtonColor: '#7a7a7a',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    reverseButtons: true 
  }).then((result) => {
    if (result.isConfirmed) {
      const index = listaProductos.findIndex(prod => prod.id === id);
      
      if (index !== -1) {
        listaProductos.splice(index, 1);
        localStorage.setItem("productos", JSON.stringify(listaProductos));
        actualizarTabla();
        
        Swal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: 'El producto ha sido removido con éxito.',
          confirmButtonColor: '#B08D57',
          timer: 2000,
          showConfirmButton: false
        });
      }
    }
  });
}

// --- 3. MOSTRAR ERRORES ---
function mostrarError(input, mensaje) {
  input.classList.add("is-invalid");
  const error = document.createElement("div");
  error.className = "invalid-feedback";
  error.textContent = mensaje;
  input.parentElement.appendChild(error);

  input.addEventListener("input", function handleInput() {
    if (input.value.trim() !== "") {
      input.classList.remove("is-invalid");
      error.remove();
      input.removeEventListener("input", handleInput);
    }
  });
}

// --- 4. RENDERIZAR TABLA CON DISEÑO PREMIUM ---
function actualizarTabla() {
  const tbody = document.getElementById("cuerpo-tabla");
  if (!tbody) return;

  tbody.innerHTML = ""; 

  listaProductos.forEach((prod) => {
    // Salvaguarda: si viene de un registro viejo sin estado, se asigna 'Activo'
    const estadoActual = prod.estado || "Activo";
    const badgeClass = estadoActual === "Activo" ? "badge-activo" : "badge-inactivo";

    const fila = `
            <tr>
                <td class="text-left">
                  <strong>${prod.nombre}</strong>
                  <br><small style="color: #888; font-size: 0.8rem;">📍 ${prod.region || 'Región no especificada'}</small>
                </td>
                <td class="text-right"><strong>$${prod.precio.toLocaleString()}</strong></td>
                <td class="text-right">${prod.stock} uds</td>
                <td class="text-center">
                    <span class="${badgeClass}">${estadoActual}</span>
                </td>
                <td class="text-center">
                    <div class="actions-wrapper">
                        <button class="btn-table-edit" title="Editar">
                            <i class="bi bi-pencil"></i> Editar
                        </button>
                        <button class="btn-table-delete" title="Borrar" data-id="${prod.id}" onclick="eliminarProducto(${prod.id})">
                            <i class="bi bi-trash"></i> Borrar
                        </button>
                    </div>
                </td>
            </tr>
        `;
    tbody.innerHTML += fila;
  });
}

// --- 5. MODAL (OPEN/CLOSE) ---
const btnAdd = document.querySelector(".btn-add");
const modal = document.getElementById("modal-producto");
const btnClose = document.querySelector(".close-btn");

if (btnAdd) {
  btnAdd.addEventListener("click", async () => {
    modal.style.display = "block";

    try {
      const respuesta = await fetch("/components/product/productForm.html");
      if (!respuesta.ok) throw new Error("No se pudo cargar el formulario");

      const htmlFormulario = await respuesta.text();
      document.getElementById("productform-container").innerHTML = htmlFormulario;
      
      initProductLogic();
    } catch (error) {
      console.error("Error cargando el form:", error);
    }
  });
}

if (btnClose) {
  btnClose.onclick = () => (modal.style.display = "none");
}

window.onclick = (event) => {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

// --- 6. PERSISTENCIA: Cargar datos al iniciar ---
function cargarDesdeStorage() {
  const datosGuardados = localStorage.getItem("productos");
  if (datosGuardados) {
    const productosRecuperados = JSON.parse(datosGuardados);
    listaProductos.length = 0; 
    listaProductos.push(...productosRecuperados);
    actualizarTabla();
  }
}

// Ejecución inicial de persistencia
cargarDesdeStorage();