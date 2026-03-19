package com.example.springmvcdemo.controller;

import com.example.springmvcdemo.model.CreateProductRequest;
import com.example.springmvcdemo.model.Product;
import com.example.springmvcdemo.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * REST controller for the product catalog.
 * HTTP contract only — all business logic lives in {@link ProductService}.
 */
@RestController
@RequestMapping("/api/v1/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    /**
     * Lists all products in the catalog.
     *
     * @return HTTP 200 with a (possibly empty) list of products
     */
    @GetMapping
    public ResponseEntity<List<Product>> listAll() {
        return ResponseEntity.ok(productService.listAll());
    }

    /**
     * Returns a single product by ID.
     *
     * @param id the product UUID
     * @return HTTP 200 with the product, or HTTP 404 if not found
     */
    @GetMapping("/{id}")
    public ResponseEntity<Product> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(productService.getById(id));
    }

    /**
     * Creates a new product in the catalog.
     *
     * @param request the creation request — name and price required
     * @return HTTP 201 with the created product
     */
    @PostMapping
    public ResponseEntity<Product> create(@Valid @RequestBody CreateProductRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(productService.create(request));
    }

    /**
     * Deletes a product from the catalog.
     *
     * @param id the product UUID
     * @return HTTP 204 on success, or HTTP 404 if not found
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        productService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
