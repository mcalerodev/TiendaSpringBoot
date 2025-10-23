// ============================================
// CONFIGURACIÓN DE LA API
// ============================================
const API_URL = 'http://localhost:8080/api/productos';

// ============================================
// VARIABLES GLOBALES
// ============================================
let modoEdicion = false;
let idProductoEditar = null;

// ============================================
// INICIALIZACIÓN
// ============================================

// Cargar productos al iniciar la página
document.addEventListener('DOMContentLoaded', function() {
    cargarProductos();
    configurarFechaMinima();
    configurarFormulario();
});

// ============================================
// CONFIGURACIÓN INICIAL
// ============================================

// Configurar fecha mínima (hoy)
function configurarFechaMinima() {
    const hoy = new Date().toISOString().split('T')[0];
    document.getElementById('vencimiento').setAttribute('min', hoy);
}

// Configurar el evento submit del formulario
function configurarFormulario() {
    document.getElementById('formularioProducto').addEventListener('submit', manejarSubmitFormulario);
}

// ============================================
// FUNCIONES DE UI - ALERTAS
// ============================================

// Mostrar alerta
function mostrarAlerta(mensaje, tipo = 'success') {
    const alertContainer = document.getElementById('alertContainer');
    const alerta = document.createElement('div');
    alerta.className = `alert alert-${tipo} alert-dismissible fade show`;
    alerta.innerHTML = `
        ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    alertContainer.appendChild(alerta);
    
    // Auto-cerrar después de 5 segundos
    setTimeout(() => {
        alerta.remove();
    }, 5000);
}

// ============================================
// FUNCIONES DE UI - FORMULARIO
// ============================================

// Mostrar formulario para agregar nuevo producto
function mostrarFormularioAgregar() {
    modoEdicion = false;
    idProductoEditar = null;
    document.getElementById('tituloFormulario').textContent = 'Agregar Nuevo Producto';
    document.getElementById('btnTexto').textContent = 'Guardar';
    document.getElementById('formularioProducto').reset();
    document.getElementById('productoId').value = '';
    document.getElementById('formularioCard').style.display = 'block';
    document.getElementById('sku').removeAttribute('readonly');
    document.getElementById('formularioProducto').classList.remove('was-validated');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Cancelar formulario y ocultarlo
function cancelarFormulario() {
    document.getElementById('formularioCard').style.display = 'none';
    document.getElementById('formularioProducto').reset();
    document.getElementById('formularioProducto').classList.remove('was-validated');
    document.getElementById('productoId').value = '';
    modoEdicion = false;
    idProductoEditar = null;
}

// ============================================
// FUNCIONES DE UI - TABLA
// ============================================

// Mostrar productos en la tabla
function mostrarProductos(productos) {
    const tbody = document.getElementById('cuerpoTabla');
    const totalProductos = document.getElementById('totalProductos');
    
    // Actualizar contador
    totalProductos.textContent = productos.length;
    
    if (productos.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center text-muted py-5">
                    <i class="bi bi-inbox fs-1"></i>
                    <p class="mt-3">No hay productos registrados</p>
                    <button class="btn btn-primary mt-2" onclick="mostrarFormularioAgregar()">
                        <i class="bi bi-plus-circle"></i> Agregar Primer Producto
                    </button>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = productos.map(producto => `
        <tr>
            <td class="text-center"><strong>${producto.id}</strong></td>
            <td>${producto.nombre}</td>
            <td class="text-center"><span class="badge bg-info">${producto.sku}</span></td>
            <td>${producto.descripcion.substring(0, 50)}${producto.descripcion.length > 50 ? '...' : ''}</td>
            <td class="text-end"><strong>$${parseFloat(producto.precio).toFixed(2)}</strong></td>
            <td class="text-center">${formatearFecha(producto.vencimiento)}</td>
            <td class="text-center"><span class="badge bg-secondary">${producto.categoria}</span></td>
            <td class="text-center">
                <div class="btn-group btn-group-sm" role="group">
                    <button class="btn btn-outline-info" onclick='mostrarProducto(${producto.id})' title="Ver Detalles">
                        <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn btn-outline-warning" onclick="editarProducto(${producto.id})" title="Editar">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-outline-danger" onclick="confirmarEliminar(${producto.id}, '${producto.nombre.replace(/'/g, "\\'")}')" title="Eliminar">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// ============================================
// UTILIDADES
// ============================================

// Formatear fecha a formato local
function formatearFecha(fecha) {
    const opciones = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(fecha + 'T00:00:00').toLocaleDateString('es-SV', opciones);
}

// ============================================
// OPERACIONES CRUD - CREATE
// ============================================

// Manejar el envío del formulario
async function manejarSubmitFormulario(e) {
    e.preventDefault();
    
    // Validar formulario
    if (!this.checkValidity()) {
        e.stopPropagation();
        this.classList.add('was-validated');
        return;
    }

    // Crear objeto producto con los datos del formulario
    const producto = {
        nombre: document.getElementById('nombre').value.trim(),
        sku: document.getElementById('sku').value.toUpperCase().trim(),
        descripcion: document.getElementById('descripcion').value.trim(),
        precio: parseFloat(document.getElementById('precio').value),
        vencimiento: document.getElementById('vencimiento').value,
        categoria: document.getElementById('categoria').value
    };

    // Determinar si es creación o actualización
    if (modoEdicion) {
        await actualizarProducto(idProductoEditar, producto);
    } else {
        await agregarProducto(producto);
    }
}

// Agregar nuevo producto - POST /api/productos
async function agregarProducto(producto) {
    try {
        console.log('Enviando producto:', producto);
        
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(producto)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al crear producto');
        }

        const nuevoProducto = await response.json();
        console.log('Producto creado:', nuevoProducto);
        
        mostrarAlerta(`<i class="bi bi-check-circle"></i> Producto "${nuevoProducto.nombre}" agregado exitosamente`, 'success');
        cancelarFormulario();
        cargarProductos();
    } catch (error) {
        console.error('Error al agregar producto:', error);
        mostrarAlerta(`<i class="bi bi-exclamation-triangle"></i> ${error.message}`, 'danger');
    }
}
// ============================================
// OPERACIONES CRUD - SHOW
// ============================================
// Mostrar detalle de un producto
 async function mostrarProducto(id) {

    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (response.ok) {
            const producto = await response.json();
            verDetalles(producto);

        } else {
            mostrarAlerta(`<i class="bi bi-exclamation-triangle"></i> ${response.message}`, 'danger');

        }
    } catch (error) {
        mostrarAlerta(`<i class="bi bi-exclamation-triangle"></i> No se pudo conectar con el servidor.`, 'danger');
    }
}

// Ver detalles del producto en modal
function verDetalles(producto) {
    document.getElementById('detalleId').textContent = producto.id;
    document.getElementById('detalleSku').textContent = producto.sku;
    document.getElementById('detalleNombre').textContent = producto.nombre;
    document.getElementById('detalleDescripcion').textContent = producto.descripcion;
    document.getElementById('detallePrecio').textContent = '$' + parseFloat(producto.precio).toFixed(2);
    document.getElementById('detalleVencimiento').textContent = formatearFecha(producto.vencimiento);
    document.getElementById('detalleCategoria').textContent = producto.categoria;
    
    // Mostrar modal
    const modal = new bootstrap.Modal(document.getElementById('modalDetalles'));
    modal.show();
}

// ============================================
// OPERACIONES CRUD - READ
// ============================================

// Cargar todos los productos - GET /api/productos
async function cargarProductos() {
    const tbody = document.getElementById('cuerpoTabla');
    
    // Mostrar spinner de carga
    tbody.innerHTML = `
        <tr>
            <td colspan="8" class="text-center py-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Cargando...</span>
                </div>
                <p class="mt-2 text-muted">Cargando productos...</p>
            </td>
        </tr>
    `;
    
    try {
        console.log('Cargando productos desde:', API_URL);
        
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const productos = await response.json();
        console.log('Productos cargados:', productos);
        
        mostrarProductos(productos);
    } catch (error) {
        console.error('Error al cargar productos:', error);
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center text-danger py-5">
                    <i class="bi bi-exclamation-triangle fs-1"></i>
                    <p class="mt-3"><strong>Error al cargar los productos</strong></p>
                    <p class="text-muted">Verifica que el servidor esté en ejecución en: ${API_URL}</p>
                    <button class="btn btn-primary mt-2" onclick="cargarProductos()">
                        <i class="bi bi-arrow-clockwise"></i> Reintentar
                    </button>
                </td>
            </tr>
        `;
        document.getElementById('totalProductos').textContent = '0';
    }
}

// ============================================
// OPERACIONES CRUD - UPDATE
// ============================================

// Cargar datos de un producto para editar
async function editarProducto(id) {
    try {
        console.log('Cargando producto para editar, ID:', id);
        
        const response = await fetch(`${API_URL}/${id}`);
        
        if (!response.ok) {
            throw new Error('Error al obtener producto');
        }
        
        const producto = await response.json();
        console.log('Producto a editar:', producto);
        
        // Activar modo edición
        modoEdicion = true;
        idProductoEditar = id;
        document.getElementById('tituloFormulario').textContent = 'Actualizar Producto';
        document.getElementById('btnTexto').textContent = 'Actualizar';
        
        // Llenar el formulario con los datos del producto
        document.getElementById('productoId').value = producto.id;
        document.getElementById('nombre').value = producto.nombre;
        document.getElementById('sku').value = producto.sku;
        document.getElementById('sku').setAttribute('readonly', 'true');
        document.getElementById('descripcion').value = producto.descripcion;
        document.getElementById('precio').value = producto.precio;
        document.getElementById('vencimiento').value = producto.vencimiento;
        document.getElementById('categoria').value = producto.categoria;
        
        // Mostrar formulario
        document.getElementById('formularioCard').style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
        console.error('Error al cargar producto:', error);
        mostrarAlerta(`<i class="bi bi-exclamation-triangle"></i> Error al cargar el producto para editar`, 'danger');
    }
}

// Actualizar producto existente - PUT /api/productos/{id}
async function actualizarProducto(id, producto) {
    try {
        console.log('Actualizando producto ID:', id);
        console.log('Datos a enviar:', producto);
        
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(producto)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al actualizar producto');
        }

        const productoActualizado = await response.json();
        console.log('Producto actualizado:', productoActualizado);
        
        mostrarAlerta(`<i class="bi bi-check-circle"></i> Producto "${productoActualizado.nombre}" actualizado exitosamente`, 'info');
        cancelarFormulario();
        cargarProductos();
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        mostrarAlerta(`<i class="bi bi-exclamation-triangle"></i> ${error.message}`, 'danger');
    }
}

// ============================================
// OPERACIONES CRUD - DELETE
// ============================================

// Confirmar eliminación de producto
function confirmarEliminar(id, nombre) {
    if (confirm(`¿Está seguro de eliminar el producto "${nombre}"?\n\nEsta acción no se puede deshacer.`)) {
        eliminarProducto(id);
    }
}

// Eliminar producto - DELETE /api/productos/{id}
async function eliminarProducto(id) {
    try {
        console.log('Eliminando producto ID:', id);
        
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Error al eliminar producto');
        }
        
        const resultado = await response.json();
        console.log('Producto eliminado:', resultado);
        
        mostrarAlerta(`<i class="bi bi-check-circle"></i> ${resultado.mensaje}`, 'warning');
        cargarProductos();
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        mostrarAlerta(`<i class="bi bi-exclamation-triangle"></i> Error al eliminar el producto`, 'danger');
    }
}