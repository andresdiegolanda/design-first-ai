# Layer 3 — Skills (spring-mvc-demo)

> **What this is:** Reusable knowledge patterns for recurring technical concerns in this project.
> **When to load it:** When your current task involves one of the skill areas below.
> **How to use it:** Load with `#file:context/layer-3-skills.md` and reference the relevant skill in Layer 5.

---

## Skill: Error Handling

Use when: Adding any service method that can fail with a domain-meaningful reason.

**Pattern — one named exception per failure category:**
```java
public class ProductNotFoundException extends RuntimeException {
    public ProductNotFoundException(UUID id) {
        super("Product not found: " + id);
    }
}
```

**Rules:**
- Name the exception after the domain concept, not the HTTP status.
- Constructor takes the identifier — message includes it for debuggability.
- `GlobalExceptionHandler` owns the HTTP mapping — never put `ResponseEntity` in service code.
- Never catch and swallow. Never catch and rethrow as `RuntimeException`.

**Adding a new exception:**
1. Create `{Concept}Exception extends RuntimeException` in `exception/`.
2. Add `@ExceptionHandler` in `GlobalExceptionHandler` with the correct HTTP status.
3. Return `new ErrorResponse("SNAKE_CASE_CODE", ex.getMessage())`.

**Design Constraints:**
- Do not throw `RuntimeException` directly — always a named subclass
- Do not put HTTP status logic in service code
- Do not add checked exceptions — all exceptions extend `RuntimeException`

---

## Skill: Testing

Use when: Writing tests for any controller or service in this project.

**Service tests (plain JUnit, no Spring):**
```java
class ProductServiceTest {
    private ProductService service;

    @BeforeEach
    void setUp() {
        service = new ProductService();  // fresh store per test
    }
}
```

**Controller tests (`@WebMvcTest`):**
```java
@WebMvcTest(ProductController.class)
class ProductControllerTest {
    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper objectMapper;
    @MockBean ProductService productService;
}
```

**Rules:**
- Service tests: no Spring context, `new ProductService()` in `@BeforeEach`.
- Controller tests: `@WebMvcTest` only — no `@SpringBootTest`.
- Mock the service with `@MockBean`, never instantiate it in controller tests.
- Assert `$.code` in error responses — never `$.message`.
- Use `willThrow(new XxxException(id)).given(service).method(id)` for void methods.

**Test naming:** `method_condition_expectedResult`
- `getById_unknownId_throwsProductNotFoundException`
- `create_validRequest_returns201WithProduct`
- `delete_unknownId_returns404`

**Design Constraints:**
- Do not use `@SpringBootTest` — `@WebMvcTest` for controllers, plain JUnit for services
- Do not assert on `$.message` text — assert on `$.code` only
- Do not share service state between tests — always `new ProductService()` in `@BeforeEach`

---

## Skill: In-Memory Store

Use when: Adding a new resource type that needs in-memory CRUD.

**Pattern — `ConcurrentHashMap` in the service:**
```java
@Service
public class [Resource]Service {
    private final Map<UUID, [Resource]> store = new ConcurrentHashMap<>();

    public [Resource] create(Create[Resource]Request request) {
        UUID id = UUID.randomUUID();
        [Resource] item = new [Resource](id, request.name(), ...);
        store.put(id, item);
        return item;
    }

    public [Resource] getById(UUID id) {
        [Resource] item = store.get(id);
        if (item == null) throw new [Resource]NotFoundException(id);
        return item;
    }

    public void delete(UUID id) {
        if (store.remove(id) == null) throw new [Resource]NotFoundException(id);
    }
}
```

**Rules:**
- `ConcurrentHashMap` — thread-safe without external locking.
- `UUID.randomUUID()` for every new ID — never accept IDs from the client.
- `store.remove(id) == null` is the idiomatic not-found check for delete.
- `new ArrayList<>(store.values())` for list — returns a snapshot, safe to return.

**Design Constraints:**
- Do not accept IDs from the request body — always generate with `UUID.randomUUID()`
- Do not add a `ProductRepository` interface — the map is the store
- Do not expose the map directly — always through service methods
