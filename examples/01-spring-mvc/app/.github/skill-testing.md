# Skill: Testing (spring-mvc-demo)

> **Use when:** Writing tests for any controller or service in this project.

## Service tests (plain JUnit, no Spring)

```java
class ProductServiceTest {
    private ProductService service;

    @BeforeEach
    void setUp() {
        service = new ProductService();  // fresh store per test
    }
}
```

## Controller tests (`@WebMvcTest`)

```java
@WebMvcTest(ProductController.class)
class ProductControllerTest {
    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper objectMapper;
    @MockBean ProductService productService;
}
```

## Rules

- Service tests: no Spring context, `new ProductService()` in `@BeforeEach`.
- Controller tests: `@WebMvcTest` only — no `@SpringBootTest`.
- Mock the service with `@MockBean`, never instantiate it in controller tests.
- Assert `$.code` in error responses — never `$.message`.
- Use `willThrow(new XxxException(id)).given(service).method(id)` for void methods.

## Test naming

`method_condition_expectedResult`

## Design Constraints

- Do not use `@SpringBootTest` — `@WebMvcTest` for controllers, plain JUnit for services
- Do not assert on `$.message` text — assert on `$.code` only
- Do not share service state between tests — always `new ProductService()` in `@BeforeEach`
