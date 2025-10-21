package com.ejemplo.tienda.service;

import com.ejemplo.tienda.model.Producto;
import java.util.List;
import java.util.Optional;

/**
 *
 * @author soporte
 */
public interface ProductoService {

    //Metodos a utilizar en el controlador
    List<Producto> listarProductos();

    Optional<Producto> obtenerProductoPorId(Long id);

    Producto crearProducto(Producto producto);

    Producto actualizarProducto(Long id, Producto producto);

    void eliminarProducto(Long id);
}
