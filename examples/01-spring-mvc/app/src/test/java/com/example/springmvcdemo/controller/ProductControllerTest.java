package com.example.springmvcdemo.controller;

import com.example.springmvcdemo.exception.ProductNotFoundException;
import com.example.springmvcdemo.model.CreateProductRequest;
import com.example.springmvcdemo.model.Product;
import com.example.springmvcdemo.service.ProductService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.willThrow;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ProductController.class)
class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @SuppressWarnings("deprecation")
    @MockBean
    private ProductService productService;

    private static final UUID PRODUCT_ID = UUID.fromString("00000000-0000-0000-0000-000000000001");

    @Test
    void listAll_returns200WithProductList() throws Exception {
        Product product = new Product(PRODUCT_ID, "Widget", 9.99);
        given(productService.listAll()).willReturn(List.of(product));

        mockMvc.perform(get("/api/v1/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(PRODUCT_ID.toString()))
                .andExpect(jsonPath("$[0].name").value("Widget"))
                .andExpect(jsonPath("$[0].price").value(9.99));
    }

    @Test
    void listAll_emptyStore_returns200WithEmptyArray() throws Exception {
        given(productService.listAll()).willReturn(List.of());

        mockMvc.perform(get("/api/v1/products"))
                .andExpect(status().isOk())
                .andExpect(content().json("[]"));
    }

    @Test
    void getById_existingProduct_returns200() throws Exception {
        Product product = new Product(PRODUCT_ID, "Widget", 9.99);
        given(productService.getById(PRODUCT_ID)).willReturn(product);

        mockMvc.perform(get("/api/v1/products/{id}", PRODUCT_ID))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(PRODUCT_ID.toString()))
                .andExpect(jsonPath("$.name").value("Widget"));
    }

    @Test
    void getById_unknownProduct_returns404() throws Exception {
        given(productService.getById(PRODUCT_ID))
                .willThrow(new ProductNotFoundException(PRODUCT_ID));

        mockMvc.perform(get("/api/v1/products/{id}", PRODUCT_ID))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code").value("NOT_FOUND"));
    }

    @Test
    void create_validRequest_returns201WithProduct() throws Exception {
        CreateProductRequest request = new CreateProductRequest("Widget", 9.99);
        Product product = new Product(PRODUCT_ID, "Widget", 9.99);
        given(productService.create(any(CreateProductRequest.class))).willReturn(product);

        mockMvc.perform(post("/api/v1/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(PRODUCT_ID.toString()))
                .andExpect(jsonPath("$.name").value("Widget"));
    }

    @Test
    void create_blankName_returns400() throws Exception {
        mockMvc.perform(post("/api/v1/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"\",\"price\":9.99}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("VALIDATION_ERROR"));
    }

    @Test
    void create_negativePrice_returns400() throws Exception {
        mockMvc.perform(post("/api/v1/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Widget\",\"price\":-1.0}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("VALIDATION_ERROR"));
    }

    @Test
    void delete_existingProduct_returns204() throws Exception {
        mockMvc.perform(delete("/api/v1/products/{id}", PRODUCT_ID))
                .andExpect(status().isNoContent());
    }

    @Test
    void delete_unknownProduct_returns404() throws Exception {
        willThrow(new ProductNotFoundException(PRODUCT_ID))
                .given(productService).delete(PRODUCT_ID);

        mockMvc.perform(delete("/api/v1/products/{id}", PRODUCT_ID))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code").value("NOT_FOUND"));
    }
}
