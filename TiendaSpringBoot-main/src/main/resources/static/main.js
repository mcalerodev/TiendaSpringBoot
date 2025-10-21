// ✅ Mostrar producto por ID (GET)
async function mostrarProducto() {
    const id = document.getElementById('productoId').value.trim();
    if (!id) {
        alert("Por favor ingresa un ID de producto");
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/api/productos/${id}`);
        if (response.ok) {
            const producto = await response.json();
            document.getElementById('resultado').innerHTML = `
                <h3>Producto encontrado:</h3>
                <p><b>ID:</b> ${producto.id}</p>
                <p><b>Nombre:</b> ${producto.nombre}</p>
                <p><b>SKU:</b> ${producto.sku}</p>
                <p><b>Descripción:</b> ${producto.descripcion}</p>
                <p><b>Precio:</b> $${producto.precio}</p>
                <p><b>Vencimiento:</b> ${producto.vencimiento}</p>
                <p><b>Categoría:</b> ${producto.categoria}</p>
            `;
        } else if (response.status === 404) {
            document.getElementById('resultado').innerHTML = `<p style="color:red;">Producto no encontrado.</p>`;
        } else {
            alert("Error al obtener el producto");
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
        alert("No se pudo conectar con el servidor");
    }
}

// 🗑️ Eliminar producto por ID (DELETE)
async function eliminarProducto() {
    const id = document.getElementById('productoId').value.trim();
    if (!id) {
        alert("Por favor ingresa un ID de producto");
        return;
    }

    if (confirm("¿Seguro que deseas eliminar este producto?")) {
        try {
            const response = await fetch(`http://localhost:8080/api/productos/${id}`, { method: 'DELETE' });
            if (response.status === 204) {
                alert("Producto eliminado correctamente");
                document.getElementById('resultado').innerHTML = "";
            } else if (response.status === 404) {
                alert("Producto no encontrado");
            } else {
                alert("Error al eliminar el producto");
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
            alert("No se pudo conectar con el servidor");
        }
    }
}
