package com.ejemplo.tienda.service;

import com.ejemplo.tienda.exception.ResourceNotFoundException;
import com.ejemplo.tienda.model.Producto;
import com.ejemplo.tienda.repository.ProductoRepository;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;

/**
 *
 * @author soporte
 */
@Service
//Implementa los metodos de la interfaz y les provee la logica
public class ProductoServiceImpl implements ProductoService {

    private final ProductoRepository productoRepository;

    // Inyección por constructor
    public ProductoServiceImpl(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
    }

    //Lista los productos haciendo uso de los metodos extendidos (findAll) desde JpaRepository mediante la interfaz ProductoRepository
    @Override
    public List<Producto> listarProductos() {
        return productoRepository.findAll();
    }

    //Obtiene un producto haciendo uso del metodo (findById) extendido desde JpaRepository mediante la interfaz ProductoRepository
    @Override
    public Optional<Producto> obtenerProductoPorId(Long id) {
        return productoRepository.findById(id);
    }

    //Crea un producto haciendo uso del metodo (save) extendido desde JpaRepository mediante la interfaz ProductoRepository
    //Ademas verifica la existencia de un SKU mediante el metodo personalizado existsBySku generado en la interfaz ProductoRepository
    @Override
    @Transactional //usar en metodos que modifican datos
    public Producto crearProducto(Producto producto) {
        // Validaciones básicas
        if (producto.getSku() != null && productoRepository.existsBySku(producto.getSku())) {
            throw new IllegalArgumentException("SKU ya existe: " + producto.getSku());
        }
        return productoRepository.save(producto);
    }

    //Actualiza un producto haciendo uso del metodo save(objeto) extendido desde JpaRepository mediante la interfaz ProductoRepository
    @Override
    @Transactional
    public Producto actualizarProducto(Long id, Producto producto) {
        //Verifica si el producto existe por su id
        Producto existente = productoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con id " + id));

        // Actualización de campos (sobrescribir todos los campos permitidos)
        existente.setNombre(producto.getNombre());
        existente.setSku(producto.getSku());
        existente.setDescripcion(producto.getDescripcion());
        existente.setPrecio(producto.getPrecio());
        existente.setVencimiento(producto.getVencimiento());
        existente.setCategoria(producto.getCategoria());

        //Validar SKU único (y no sea el mismo producto)
        if (producto.getSku() != null) {
            Optional<Producto> bySku = productoRepository.findBySku(producto.getSku());
            if (bySku.isPresent() && !bySku.get().getId().equals(id)) {
                throw new IllegalArgumentException("SKU ya en uso por otro producto: " + producto.getSku());
            }
        }

        //Mandar los datos actualizados 
        return productoRepository.save(existente);
    }

    //Elimina un producto haciendo uso del metodo deleteById(id) extendido desde JpaRepository mediante la interfaz ProductoRepository
    @Override
    @Transactional
    public void eliminarProducto(Long id) {
        //Comprueba si existe el id
        if (!productoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Producto no encontrado con id " + id);
        }

        //Elimina el producto si encuentra el id
        productoRepository.deleteById(id);
    }
}
