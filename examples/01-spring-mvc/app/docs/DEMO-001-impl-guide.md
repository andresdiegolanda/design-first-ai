# DEMO-001 — Implementation Guide
## Product Catalog CRUD API

> **Story:** DEMO-001
> **Status:** Executed — see `docs/DEMO-001-execution-report.md`
> **App description:** `.github/copilot-layer-0-architecture.md`

---

## Scope

Build a four-endpoint REST API for an in-memory product catalog.

**What must be built:**
- `GET /api/v1/products` — list all products (empty list returns HTTP 200, not 404)
- `GET /api/v1/products/{id}` — get one product by UUID (404 if not found)
- `POST /api/v1/products` — create a product from a validated request body (201 on success)
- `DELETE /api/v1/products/{id}` — delete by UUID (204 on success, 404 if not found)

**Explicitly out of scope:**
- No update endpoint (PUT/PATCH)
- No search or filtering
- No pagination
- No database — in-memory only
- No authentication

---

## Components

| Component | Purpose |
|-----------|---------|
| `ProductController` | HTTP contract — delegates immediately to service, owns response status |
| `ProductService` | Business logic and `ConcurrentHashMap` store — owns all state |
| `Product` | Domain record — `UUID id`, `String name`, `double price` |
| `CreateProductRequest` | Validated request body — `@NotBlank String name`, `@Positive double price` |
| `ProductNotFoundException` | Domain exception — thrown when a UUID is not found in the store |
| `GlobalExceptionHandler` | Maps `ProductNotFoundException` → HTTP 404, validation errors → HTTP 400 |
| `ErrorResponse` | Standardised error body — `String code`, `String message` |

**Constraint:** No repository interface. `ProductService` owns the map directly.
An interface would add indirection with no benefit for a single in-memory implementation.

---

## Interactions

```
GET /api/v1/products
  → ProductController.listAll()
  → ProductService.listAll()
  → new ArrayList<>(store.values())
  → HTTP 200 List<Product> (empty list is valid)

GET /api/v1/products/{id}
  → ProductController.getById(UUID id)
  → ProductService.getById(UUID id)
  → store.get(id) — null → throw ProductNotFoundException(id)
  → GlobalExceptionHandler → HTTP 404 ErrorResponse
  → store.get(id) — found → HTTP 200 Product

POST /api/v1/products
  → ProductController.create(@Valid CreateProductRequest)
  → validation failure → MethodArgumentNotValidException
  → GlobalExceptionHandler → HTTP 400 ErrorResponse
  → ProductService.create(request)
  → UUID.randomUUID() + store.put(id, product)
  → HTTP 201 Product

DELETE /api/v1/products/{id}
  → ProductController.delete(UUID id)
  → ProductService.delete(UUID id)
  → store.remove(id) == null → throw ProductNotFoundException(id)
  → GlobalExceptionHandler → HTTP 404 ErrorResponse
  → HTTP 204 (no body)
```

---

## Contracts

### Records

```java
public record Product(UUID id, String name, double price) {}

public record CreateProductRequest(
    @NotBlank String name,
    @Positive double price
) {}

public record ErrorResponse(String code, String message) {}
```

### ProductController

```java
ResponseEntity<List<Product>> listAll()
ResponseEntity<Product> getById(@PathVariable UUID id)
ResponseEntity<Product> create(@Valid @RequestBody CreateProductRequest request)
ResponseEntity<Void> delete(@PathVariable UUID id)
```

### ProductService

```java
List<Product> listAll()
Product getById(UUID id) throws ProductNotFoundException
Product create(CreateProductRequest request)
void delete(UUID id) throws ProductNotFoundException
```

### ProductNotFoundException

```java
public class ProductNotFoundException extends RuntimeException {
    public ProductNotFoundException(UUID id) {
        super("Product not found: " + id);
    }
}
```

### GlobalExceptionHandler mappings

| Exception | HTTP status | Error code |
|-----------|-------------|------------|
| `ProductNotFoundException` | 404 | `NOT_FOUND` |
| `MethodArgumentNotValidException` | 400 | `VALIDATION_ERROR` |

---

## Constraints

- All IDs are `UUID` — never `Long` or `int`
- IDs are generated server-side with `UUID.randomUUID()` — never accepted from client
- Service tests: plain JUnit 5, `new ProductService()` in `@BeforeEach`, no Spring context
- Controller tests: `@WebMvcTest`, `@MockBean ProductService`, assert `$.code` not `$.message`
- Javadoc required on all public service methods
