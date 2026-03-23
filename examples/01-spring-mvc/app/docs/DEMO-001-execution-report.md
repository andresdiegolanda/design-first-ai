# DEMO-001 — Execution Report
## Product Catalog CRUD API

> **Story:** DEMO-001
> **Implementation guide:** `docs/DEMO-001-impl-guide.md`
> **Status:** Complete

---

## What Was Implemented

| File | Change | Location |
|------|--------|----------|
| `ProductController.java` | New — four endpoints (list, get, create, delete) | `controller/` |
| `ProductService.java` | New — business logic + ConcurrentHashMap store | `service/` |
| `Product.java` | New — domain record (UUID, name, price) | `model/` |
| `CreateProductRequest.java` | New — validated request record | `model/` |
| `ProductNotFoundException.java` | New — domain exception | `exception/` |
| `GlobalExceptionHandler.java` | New — maps exceptions to HTTP responses | `exception/` |
| `ErrorResponse.java` | New — standardised error body | `exception/` |
| `ProductServiceTest.java` | New — 8 plain JUnit tests | `test/service/` |
| `ProductControllerTest.java` | New — 9 `@WebMvcTest` tests | `test/controller/` |

**Test results:** 17 tests, 0 failures, 100% coverage (statements, branches, functions, lines).

---

## Deviations from Implementation Guide

None. All contracts from the guide were implemented as specified.

Minor addition during execution: Javadoc added to `SpringMvcDemoApplication.main()` —
omitted from the guide's scope but required by the non-negotiable "all public methods
have Javadoc."

---

## Design Review Corrections

Two corrections were made during implementation guide review, before any code was written.

**Correction 1 — No repository layer (Components)**

The initial impl-guide draft proposed `ProductRepository` interface +
`InMemoryProductRepository` implementation. Removed — a single `ConcurrentHashMap`
does not justify an abstraction. The constraint is in `.github/copilot-layer-0-architecture.md`:
"Do not add a repository layer — service owns the store directly."

Cost if missed: 2 files + Spring bean + injection wiring + test refactor.

**Correction 2 — UUID not Long (Contracts)**

The initial impl-guide draft used `Long` for all IDs — a common Java default.
Replaced with `UUID` throughout. The constraint is in `.github/copilot-instructions.md`
Non-Negotiables: "UUID for all product identifiers — never Long or int."

Cost if missed: every method signature, every test, every URL example — full rewrite.

Both corrections required one iteration of the impl-guide. Neither required touching production code.

---

## How to Run

```bash
mvn spring-boot:run
```

API available at `http://localhost:8080`.

```bash
# Create a product
curl -X POST http://localhost:8080/api/v1/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Widget","price":9.99}'

# List all products
curl http://localhost:8080/api/v1/products

# Get by ID (replace with UUID from create response)
curl http://localhost:8080/api/v1/products/{id}

# Delete by ID
curl -X DELETE http://localhost:8080/api/v1/products/{id}
```

---

## How to Run Tests

```bash
mvn test
```

17 tests. No external dependencies required.

---

## How to Test Manually

1. Start: `mvn spring-boot:run`
2. Create a product — verify HTTP 201 and UUID in response
3. List products — verify the created product appears
4. Get by UUID — verify HTTP 200
5. Get by unknown UUID — verify HTTP 404 with `{"code":"PRODUCT_NOT_FOUND",...}`
6. Create with blank name — verify HTTP 400 with `{"code":"VALIDATION_ERROR",...}`
7. Delete by UUID — verify HTTP 204
8. Get after delete — verify HTTP 404

---

## Commit Message

```
feat(DEMO-001): product catalog CRUD API

Four-endpoint REST API for in-memory product catalog.
GET/POST /api/v1/products, GET/DELETE /api/v1/products/{id}.
UUID identifiers. ConcurrentHashMap store.
17 tests: 8 plain JUnit service, 9 @WebMvcTest controller.
```
