const form = document.getElementById('productoForm');
const tablaBody = document.getElementById('tablaProductos');
const formTitulo = document.getElementById('formTitulo');
const btnCancelar = document.getElementById('btnCancelar');

let productos = obtenerProductos();
let imagenActualEdicion = ''; // Guarda la imagen previa si se está editando

function renderizarTabla() {
    tablaBody.innerHTML = '';

    productos.forEach(prod => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><img src="${prod.imagen}" alt="${prod.nombre}" class="thumb"></td>
            <td><strong>${prod.nombre}</strong></td>
            <td>${prod.categoria}</td>
            <td>$${Number(prod.precio).toLocaleString('es-AR')}</td>
            <td>
                <div class="acciones">
                    <button class="btn-sm btn-edit" onclick="cargarEdicion(${prod.id})">Editar</button>
                    <button class="btn-sm btn-delete" onclick="eliminarProducto(${prod.id})">Eliminar</button>
                </div>
            </td>
        `;
        tablaBody.appendChild(tr);
    });
}

// Alta y Modificación
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('productoId').value;
    const nombre = document.getElementById('nombre').value.trim();
    const categoria = document.getElementById('categoria').value;
    const precio = parseFloat(document.getElementById('precio').value);
    
    const inputImagen = document.getElementById('imagen');

    let imagenBase64 = 'https://placehold.co/300x200/e2e8f0/1e293b?text=Sin+Imagen';

    if (inputImagen.files && inputImagen.files[0]) {
        imagenBase64 = await procesarImagen(inputImagen.files[0]);
    } else if (id) {
        // Si estamos editando y no subió nueva imagen, conservar la existente
        imagenBase64 = imagenActualEdicion;
    }

    if (id) {
        // Modificación
        const index = productos.findIndex(p => p.id == id);
        if (index !== -1) {
            productos[index] = { id: Number(id), nombre, categoria, precio, imagen: imagenBase64 };
        }
    } else {
        // Alta
        const nuevoProducto = {
            id: Date.now(),
            nombre,
            categoria,
            precio,
            imagen: imagenBase64
        };
        productos.push(nuevoProducto);
    }

    guardarProductos(productos);
    renderizarTabla();
    resetearFormulario();
});

// Preparar formulario para editar
window.cargarEdicion = function(id) {
    const prod = productos.find(p => p.id === id);
    if (!prod) return;

    document.getElementById('productoId').value = prod.id;
    document.getElementById('nombre').value = prod.nombre;
    document.getElementById('categoria').value = prod.categoria;
    document.getElementById('precio').value = prod.precio;
    imagenActualEdicion = prod.imagen;

    formTitulo.textContent = 'Editando Producto';
    btnCancelar.style.display = 'block';
};

// Baja
window.eliminarProducto = function(id) {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
        productos = productos.filter(p => p.id !== id);
        guardarProductos(productos);
        renderizarTabla();
    }
};

function resetearFormulario() {
    form.reset();
    document.getElementById('productoId').value = '';
    imagenActualEdicion = '';
    formTitulo.textContent = 'Nuevo Producto';
    btnCancelar.style.display = 'none';
}

btnCancelar.addEventListener('click', resetearFormulario);

// Inicializar tabla
renderizarTabla();