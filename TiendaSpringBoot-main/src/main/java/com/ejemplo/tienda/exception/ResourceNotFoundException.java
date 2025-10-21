package com.ejemplo.tienda.exception;

/**
 *
 * @author soporte
 */
public class ResourceNotFoundException extends RuntimeException {
    //Manejo de excepcion personalizada
    public ResourceNotFoundException(String mensaje) {
        super(mensaje);
    }
}
