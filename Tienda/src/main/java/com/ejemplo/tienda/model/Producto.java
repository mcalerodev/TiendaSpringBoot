package com.ejemplo.tienda.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;

/**
 *
 * @author soporte
 */
@Entity
@Table(name = "productos")
public class Producto {

    //Campos de la tabla productos
    //Definicion de los tipos de datos
    //Validaciones por cada campo
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 100, nullable = false)
    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 100, message = "Nombre máximo 100 caracteres")
    private String nombre;

    @Column(length = 50, nullable = false, unique = true)
    @NotBlank(message = "El SKU es obligatorio")
    @Size(max = 50, message = "SKU máximo 50 caracteres")
    @Pattern(regexp = "^[A-Z0-9\\-]+$", message = "SKU sólo puede tener letras mayúsculas, números y guiones")
    private String sku;

    @Column(columnDefinition = "TEXT")
    @NotNull(message = "La descripcion es obligatoria")
    private String descripcion;

    @Column(precision = 10, scale = 2, nullable = false)
    @NotNull(message = "El precio es obligatorio")
    @DecimalMin(value = "0.0", inclusive = false, message = "El precio debe ser mayor que 0")
    @Digits(integer = 8, fraction = 2, message = "Precio con hasta 2 decimales")
    private BigDecimal precio;

    @Column(nullable = false)
    @NotNull(message = "La fecha de vencimiento es obligatoria")
    @FutureOrPresent(message = "La fecha de vencimiento debe ser hoy o en el futuro")
    private LocalDate vencimiento;

    @Column(length = 50, nullable = false)
    @NotBlank(message = "La categoría es obligatoria")
    @Size(max = 50, message = "Categoría máximo 50 caracteres")
    private String categoria;

    //Constructor vacio
    public Producto() {
    }

    //Getters y setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getSku() {
        return sku;
    }

    public void setSku(String sku) {
        this.sku = sku;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public BigDecimal getPrecio() {
        return precio;
    }

    public void setPrecio(BigDecimal precio) {
        this.precio = precio;
    }

    public LocalDate getVencimiento() {
        return vencimiento;
    }

    public void setVencimiento(LocalDate vencimiento) {
        this.vencimiento = vencimiento;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }
    
}
