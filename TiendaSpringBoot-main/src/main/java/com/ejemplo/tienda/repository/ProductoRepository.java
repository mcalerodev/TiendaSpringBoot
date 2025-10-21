package com.ejemplo.tienda.repository;

import com.ejemplo.tienda.model.Producto;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 *
 * @author soporte
 */
public interface ProductoRepository extends JpaRepository<Producto, Long> {
    //Metodos adicionales

    //Encontrar productos por su SKU al ser unique
    Optional<Producto> findBySku(String sku);

    //Validacion de la existencia del SKU
    boolean existsBySku(String sku);
}
