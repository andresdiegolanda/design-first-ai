package com.example.springmvcdemo.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

/**
 * Request body for creating a product.
 *
 * @param name  display name — must not be blank
 * @param price price — must be positive
 */
public record CreateProductRequest(
        @NotBlank String name,
        @Positive double price
) {}
