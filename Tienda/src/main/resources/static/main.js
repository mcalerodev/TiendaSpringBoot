const API_URL = 'http://localhost:8080/api/productos';

async function listarProductos() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Error al cargar productos');
    const productos = await response.json();

    const tbody = document.querySelector('#tabla-productos tbody');
    tbody.innerHTML = ''; // limpiar tabla

    productos.forEach(producto => {
      const fila = document.createElement('tr');

      fila.innerHTML = `
        <td>${producto.id}</td>
        <td>${producto.nombre}</td>
        <td>${producto.sku}</td>
        <td>${producto.descripcion}</td>
        <td>${producto.precio.toFixed(2)}</td>
        <td>${producto.vencimiento}</td>
        <td>${producto.categoria}</td>
        <td>
          <button onclick="mostrarProducto(${producto.id})">Mostrar</button>
          <button onclick="editarProducto(${producto.id})">Editar</button>
          <button onclick="eliminarProducto(${producto.id})">Eliminar</button>
        </td>
      `;

      tbody.appendChild(fila);
    });
  } catch (error) {
    console.error('Error:', error);
    alert('Error al cargar los productos');
  }
}

function mostrarProducto(id) {
  // Mostrar detalles del producto
}

function editarProducto(id) {
  // Editar producto
}

function eliminarProducto(id) {
  // Eliminar producto
}

// Cargar productos al iniciar la página
document.addEventListener('DOMContentLoaded', listarProductos);
