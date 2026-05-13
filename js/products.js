const listaProductos = [];

// --- 1. LÓGICA DEL FORMULARIO ---
function initProductLogic() {
    const form = document.getElementById('form-producto');
    const modal = document.getElementById('modal-producto');

    if (!form) {
        console.error("No se encontró el formulario con id 'form-producto'");
        return;
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Limpiar errores anteriores
        document.querySelectorAll(".invalid-feedback").forEach(el => el.remove());
        document.querySelectorAll(".is-invalid").forEach(el => el.classList.remove("is-invalid"));

        let isValid = true;

        // --- VALIDACIONES ---
        const nombreInput = document.getElementById('nombre');
        const origenInput = document.getElementById('origen');
        const tostadoInput = document.getElementById('tostado');
        const estadoInput = document.getElementById('estado');
        const imagenInput = document.getElementById('imagen');
        const stockInput = document.getElementById('stock');
        const precioInput = document.getElementById('precio');
        const descInput = document.getElementById('descripcion');

        if (nombreInput.value.trim().length < 3) {
            mostrarError(nombreInput, 'Nombre obligatorio (mín. 3 caracteres)');
            isValid = false;
        }

        if (origenInput.value.trim().length < 3) {
            mostrarError(origenInput, 'Origen obligatorio (mín. 3 caracteres)');
            isValid = false;
        }

        if (!tostadoInput.value) {
            mostrarError(tostadoInput, 'Selecciona un tipo de tostión');
            isValid = false;
        }

        if (!estadoInput.value) {
            mostrarError(estadoInput, 'Selecciona el estado');
            isValid = false;
        }

        if (!imagenInput.files[0]) {
            mostrarError(imagenInput, 'Debes cargar una imagen');
            isValid = false;
        }

        if (stockInput.value === '' || parseInt(stockInput.value) < 0) {
            mostrarError(stockInput, 'Stock no válido');
            isValid = false;
        }

        if (precioInput.value === '' || parseFloat(precioInput.value) <= 0) {
            mostrarError(precioInput, 'Precio debe ser mayor a 0');
            isValid = false;
        }

        if (descInput.value.trim().length < 10) {
            mostrarError(descInput, 'Descripción demasiado corta');
            isValid = false;
        }

        // --- GUARDADO ---
        if (isValid) {
            const file = imagenInput.files[0];
            const reader = new FileReader();
            

            reader.onload = function (e){
            const base64Image = reader.result
            const producto = {
                id: Date.now(),
                nombre: nombreInput.value.trim(),
                origen: origenInput.value.trim(),
                tostado: tostadoInput.value,
                estado: estadoInput.value,
                stock: parseInt(stockInput.value),
                precio: parseFloat(precioInput.value),
                descripcion: descInput.value.trim(),
                imagen: base64Image      //imagenInput.files[0].name
            };

            listaProductos.push(producto);
            console.log("%c☕ Nuevo Producto Agregado:", "color: #6F4E37; font-weight: bold; font-size: 12px;");
            console.table(listaProductos);


            /// local stage (simulación)
            localStorage.setItem('productos', JSON.stringify(listaProductos));
            
            // Actualizar la tabla visualmente
            actualizarTabla();

            // Reset y cierre
            form.reset();
            modal.style.display = "none"; 

            setTimeout(() => {
                swal.fire({
                    icon: 'success',
                    iconColor: '#8B5E3C',
                    title: `¡Producto de Historias de Café agregado con éxito!`,
                    confirmButtonColor: '#8B5E3C',
                    timer: 3400,
                    showConfirmButton: false    
                });
            }, 100);
            };
            reader.readAsDataURL(file);
        }
    
    });
    
}

// --- MOSTRAR ERRORES ---
function mostrarError(input, mensaje) {
    input.classList.add('is-invalid');
    const error = document.createElement('div');
    error.className = 'invalid-feedback';
    error.textContent = mensaje;
    input.parentElement.appendChild(error);

    input.addEventListener('input', function handleInput() {
        if (input.value.trim() !== '') {
            input.classList.remove('is-invalid');
            error.remove();
            input.removeEventListener('input', handleInput);
        }
    });
}

// --- RENDERIZAR TABLA EN ADMIN.HTML ---
function actualizarTabla() {
    const tbody = document.getElementById('cuerpo-tabla');
    if (!tbody) return;

    tbody.innerHTML = ""; // Limpiar tabla

    listaProductos.forEach(prod => {
        const fila = `
            <tr>
                <td>${prod.nombre}</td>
                <td>$${prod.precio.toLocaleString()}</td>
                <td>${prod.stock}</td>
                <td><span class="badge ${prod.estado === 'Activo' ? 'bg-success' : 'bg-secondary'}">${prod.estado}</span></td>
                <td>
                    <button class="btn-edit">✏️</button>
                    <button class="btn-delete">🗑️</button>
                </td>
            </tr>
        `;
        tbody.innerHTML += fila;
    });
}

// --- MODAL (OPEN/CLOSE) ---
const btnAdd = document.querySelector('.btn-add');
const modal = document.getElementById('modal-producto');
const btnClose = document.querySelector('.close-btn');

if (btnAdd) {
    btnAdd.addEventListener("click", async () => {
        modal.style.display = "block";

        try {
            const respuesta = await fetch('/components/product/productForm.html');
            if (!respuesta.ok) throw new Error("No se pudo cargar el formulario");

            const htmlFormulario = await respuesta.text();
            document.getElementById('productform-container').innerHTML = htmlFormulario;
            initProductLogic();

        } catch (error) {
            console.error("Error cargando el form:", error);
        }
    });
}

// Cerrar modal
if (btnClose) {
    btnClose.onclick = () => modal.style.display = "none";
}

window.onclick = (event) => {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};

// --- PERSISTENCIA: Cargar datos al iniciar ---
function cargarDesdeStorage() {
    const datosGuardados = localStorage.getItem('productos');
    if (datosGuardados) {
        // Limpiamos el array actual y le pasamos los datos del storage
        const productosRecuperados = JSON.parse(datosGuardados);
        
        // Usamos spread operator para meter los datos en nuestra lista constante
        listaProductos.push(...productosRecuperados);
        
        // Refrescamos la tabla para que se vean
        actualizarTabla();
    }
}

// Ejecutar cuando cargue el script
cargarDesdeStorage();
