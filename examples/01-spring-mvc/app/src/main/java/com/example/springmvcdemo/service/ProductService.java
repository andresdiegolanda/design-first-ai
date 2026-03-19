package com.example.springmvcdemo.service;

import com.example.springmvcdemo.exception.ProductNotFoundException;
import com.example.springmvcdemo.model.CreateProductRequest;
import com.example.springmvcdemo.model.Product;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Manages an in-memory product catalog.
 *
 * <p>Thread-safe via {@link ConcurrentHashMap}. Data does not persist between restarts.
 * This is a demo — production use would replace the map with a repository.
 */
@Service
public class ProductService {

    private final Map<UUID, Product> store = new ConcurrentHashMap<>();

    /**
     * Returns all products in the catalog. Order is not guaranteed.
     */
    public List<Product> listAll() {
        return new ArrayList<>(store.values());
    }

    /**
     * Returns a single product by ID.
     *
     * @param id the product identifier
     * @return the product
     * @throws ProductNotFoundException if no product with that ID exists
     */
    public Product getById(UUID id) {
        Product product = store.get(id);
        if (product == null) {
            throw new ProductNotFoundException(id);
        }
        return product;
    }

    /**
     * Creates a new product and adds it to the catalog.
     *
     * @param request the creation request with name and price
     * @return the created product with its assigned ID
     */
    public Product create(CreateProductRequest request) {
        UUID id = UUID.randomUUID();
        Product product = new Product(id, request.name(), request.price());
        store.put(id, product);
        return product;
    }

    /**
     * Removes a product from the catalog.
     *
     * @param id the product identifier
     * @throws ProductNotFoundException if no product with that ID exists
     */
    public void delete(UUID id) {
        if (store.remove(id) == null) {
            throw new ProductNotFoundException(id);
        }
    }
}
