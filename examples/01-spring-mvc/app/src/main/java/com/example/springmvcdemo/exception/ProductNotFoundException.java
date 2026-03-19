package com.example.springmvcdemo.exception;

import java.util.UUID;

/**
 * Thrown when a requested product does not exist in the catalog.
 */
public class ProductNotFoundException extends RuntimeException {

    public ProductNotFoundException(UUID id) {
        super("Product not found: " + id);
    }
}
