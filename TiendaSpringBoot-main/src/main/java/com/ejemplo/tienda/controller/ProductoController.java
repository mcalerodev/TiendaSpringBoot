package com.ejemplo.tienda.controller;

import com.ejemplo.tienda.model.Producto;
import com.ejemplo.tienda.service.ProductoService;
import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

/**
 *
 * @author soporte
 */
@RestController
@RequestMapping("/api/productos")
public class ProductoController {

    //Invocacion a la interfaz ProductoService
    @Autowired
    private ProductoService productoService;

    public ProductoController(ProductoService productoService) {
        this.productoService = productoService;
    }
    
    //Metodo para listar los productos
    @GetMapping
    public List<Producto> listar() {
        return productoService.listarProductos();
    }
    
    //Metodo para obtener un producto por id
    @GetMapping("/{id}")
    public Producto obtener(@PathVariable Long id) {
        return productoService.obtenerProductoPorId(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no encontrado"));
    }

    //Metodo para crear un producto
    @PostMapping
    public ResponseEntity<Producto> crear(@Valid @RequestBody Producto producto) {
        Producto creado = productoService.crearProducto(producto);
        return ResponseEntity.status(HttpStatus.CREATED).body(creado);
    }

    //Metodo para actualizar un producto por su id
    @PutMapping("/{id}")
    public ResponseEntity<Producto> actualizar(@PathVariable Long id, @Valid @RequestBody Producto producto) {
        Producto actualizado = productoService.actualizarProducto(id, producto);
        return ResponseEntity.ok(actualizado);
    }

    //Metodo para eliminar un producto por su id
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        productoService.eliminarProducto(id);
        
        //Estructura de la respuesta exitosa al eliminar
        Map<String, Object> respuesta = new HashMap<>();
        respuesta.put("mensaje", "Producto eliminado correctamente");
        respuesta.put("estado", "OK");
        respuesta.put("codigo", 200);
        respuesta.put("idEliminado", id);
        
        //En caso falle, la respuesta devuelta sera la de la clase GlobalExceptionHandler
        return ResponseEntity.ok(respuesta);
    }
}
