package com.example.springmvcdemo.service;

import com.example.springmvcdemo.exception.ProductNotFoundException;
import com.example.springmvcdemo.model.CreateProductRequest;
import com.example.springmvcdemo.model.Product;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class ProductServiceTest {

    private ProductService service;

    @BeforeEach
    void setUp() {
        service = new ProductService();
    }

    @Test
    void listAll_emptyStore_returnsEmptyList() {
        List<Product> result = service.listAll();
        assertThat(result).isEmpty();
    }

    @Test
    void create_validRequest_returnsProductWithId() {
        CreateProductRequest request = new CreateProductRequest("Widget", 9.99);
        Product product = service.create(request);

        assertThat(product.id()).isNotNull();
        assertThat(product.name()).isEqualTo("Widget");
        assertThat(product.price()).isEqualTo(9.99);
    }

    @Test
    void create_addsProductToStore() {
        service.create(new CreateProductRequest("Widget", 9.99));
        assertThat(service.listAll()).hasSize(1);
    }

    @Test
    void getById_existingId_returnsProduct() {
        Product created = service.create(new CreateProductRequest("Widget", 9.99));
        Product found = service.getById(created.id());

        assertThat(found).isEqualTo(created);
    }

    @Test
    void getById_unknownId_throwsProductNotFoundException() {
        UUID unknown = UUID.randomUUID();
        assertThatThrownBy(() -> service.getById(unknown))
                .isInstanceOf(ProductNotFoundException.class)
                .hasMessageContaining(unknown.toString());
    }

    @Test
    void delete_existingId_removesProduct() {
        Product created = service.create(new CreateProductRequest("Widget", 9.99));
        service.delete(created.id());

        assertThat(service.listAll()).isEmpty();
    }

    @Test
    void delete_unknownId_throwsProductNotFoundException() {
        UUID unknown = UUID.randomUUID();
        assertThatThrownBy(() -> service.delete(unknown))
                .isInstanceOf(ProductNotFoundException.class)
                .hasMessageContaining(unknown.toString());
    }

    @Test
    void listAll_afterMultipleCreates_returnsAllProducts() {
        service.create(new CreateProductRequest("Widget", 9.99));
        service.create(new CreateProductRequest("Gadget", 19.99));
        service.create(new CreateProductRequest("Doohickey", 4.49));

        assertThat(service.listAll()).hasSize(3);
    }
}
