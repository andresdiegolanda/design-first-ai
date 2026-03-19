package com.example.springmvcdemo.model;

import java.util.UUID;

/**
 * A product in the catalog.
 *
 * @param id    unique identifier, assigned on creation
 * @param name  display name, required
 * @param price price in the catalog currency, must be positive
 */
public record Product(UUID id, String name, double price) {}
