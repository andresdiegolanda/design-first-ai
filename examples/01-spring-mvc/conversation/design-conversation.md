# Design Conversation — Product Catalog API (DEMO-001)

This is a complete example of the Design-First conversation for the product catalog CRUD API.
It shows the full exchange: what was asked at each level, what Copilot proposed, and what
was approved or corrected.

Context loaded before this conversation:
- `context/layer-0-architecture.md`
- `context/layer-0-design-principles.md`
- `context/layer-1-base-instructions.md`
- `context/layer-3-skills.md` (Error Handling + Testing + In-Memory Store)
- `context/layer-5-story-context.md`

---

## Opening Message (Master Prompt)

```
I need to build the product catalog CRUD API (DEMO-001).

Before writing any code, walk me through the design one level at a time.

Level 1 — Capabilities
What this must do:
- GET /api/v1/products — list all
- GET /api/v1/products/{id} — get one by UUID
- POST /api/v1/products — create (name + price)
- DELETE /api/v1/products/{id} — delete by UUID

What this must NOT do:
- No update endpoint
- No search or filtering
- No pagination
- No database

Present only confirmed scope. Wait for my approval.

Level 2 — Components
No existing components. Starting from scratch.
Constraint: Do not introduce abstractions unless strictly necessary.
Present only component list with one-line purpose. No code. Wait for my approval.

Level 3 — Interactions
Entry and exit for each endpoint. Error paths.
Present only data flow. No signatures. Wait for my approval.

Level 4 — Contracts
Present record definitions, controller method signatures, service method signatures.
No implementation. Wait for my approval.

Level 5 — Implementation
Only after Level 4 approval.
```

---

## Level 1 — Capabilities

**Copilot proposed:**
> In scope: four endpoints (list, get by ID, create, delete). UUID identifiers. In-memory store.
> Out of scope: update, search, pagination, authentication, persistence.

**Human approved:**
> Level 1 approved. Confirmed four endpoints, UUID IDs, in-memory only.
> Open question to resolve at Level 2: do we need a ProductRepository interface?
> Proceed to Level 2.

---

## Level 2 — Components

**Copilot proposed:**
> 1. `ProductController` — HTTP endpoints, delegates to service
> 2. `ProductService` — business logic
> 3. `ProductRepository` — interface abstracting the in-memory store (new)
> 4. `InMemoryProductRepository` — implements ProductRepository with ConcurrentHashMap
> 5. `Product` — domain record
> 6. `CreateProductRequest` — validated request body
> 7. `GlobalExceptionHandler` — exception → HTTP mapping

**Human pushed back:**
> Remove `ProductRepository` and `InMemoryProductRepository`. A single ConcurrentHashMap
> does not justify an abstraction layer. The service owns the map directly.
> See layer-0-architecture.md Design Constraints: "Do not add a repository layer."

**Copilot revised:**
> 1. `ProductController` — HTTP endpoints, delegates to service
> 2. `ProductService` — business logic and ConcurrentHashMap store
> 3. `Product` — domain record
> 4. `CreateProductRequest` — validated request body
> 5. `GlobalExceptionHandler` — exception → HTTP mapping

**Human approved:**
> Level 2 approved. Five components. No repository layer.
> Proceed to Level 3.

---

## Level 3 — Interactions

**Copilot proposed:**
```
GET /api/v1/products
  → ProductController.listAll()
  → ProductService.listAll()
  → new ArrayList<>(store.values()) → HTTP 200

GET /api/v1/products/{id}
  → ProductController.getById(UUID)
  → ProductService.getById(UUID)
  → store.get(id) — null → ProductNotFoundException → HTTP 404
  → Product → HTTP 200

POST /api/v1/products
  → ProductController.create(@Valid CreateProductRequest)
  → ProductService.create(request)
  → UUID.randomUUID() + store.put() → Product → HTTP 201

DELETE /api/v1/products/{id}
  → ProductController.delete(UUID)
  → ProductService.delete(UUID)
  → store.remove(id) — null → ProductNotFoundException → HTTP 404
  → HTTP 204
```

**Human approved:**
> Level 3 approved. Flow is correct. HTTP statuses are correct.
> Confirming: empty list on GET /products returns HTTP 200, not 404.
> Proceed to Level 4.

---

## Level 4 — Contracts

**Copilot proposed:**
```java
// Records
record Product(Long id, String name, double price) {}
record CreateProductRequest(@NotBlank String name, @Positive double price) {}
record ErrorResponse(String code, String message) {}

// Controller
ResponseEntity<List<Product>> listAll()
ResponseEntity<Product> getById(@PathVariable Long id)
ResponseEntity<Product> create(@Valid @RequestBody CreateProductRequest request)
ResponseEntity<Void> delete(@PathVariable Long id)

// Service
List<Product> listAll()
Product getById(Long id) throws ProductNotFoundException
Product create(CreateProductRequest request)
void delete(Long id) throws ProductNotFoundException
```

**Human pushed back:**
> Reject `Long` for IDs. This project uses `UUID` — see layer-0-design-principles.md
> and layer-1-base-instructions.md Non-Negotiables. Replace `Long` with `UUID` everywhere.

**Copilot revised:**
```java
record Product(UUID id, String name, double price) {}
record CreateProductRequest(@NotBlank String name, @Positive double price) {}
record ErrorResponse(String code, String message) {}

ResponseEntity<List<Product>> listAll()
ResponseEntity<Product> getById(@PathVariable UUID id)
ResponseEntity<Product> create(@Valid @RequestBody CreateProductRequest request)
ResponseEntity<Void> delete(@PathVariable UUID id)

List<Product> listAll()
Product getById(UUID id) throws ProductNotFoundException
Product create(CreateProductRequest request)
void delete(UUID id) throws ProductNotFoundException
```

**Human approved:**
> Level 4 approved. UUID confirmed throughout.
> Proceed to Level 5.

---

## What This Conversation Demonstrates

**Unnecessary abstraction caught at Level 2.** `ProductRepository` + `InMemoryProductRepository`
would have been two files, an interface, a Spring bean, and injection wiring — all for a map
that the service can own directly. The constraint in `layer-0-architecture.md` made the
correction immediate: the human referenced the document, not an explanation.

**Wrong type caught at Level 4.** Copilot defaulted to `Long` for IDs — a common Java
convention. The design constraint "UUID only" in `layer-1-base-instructions.md` made it
visible before any code was written. A `Long`-to-UUID refactor after Level 5 would have
touched every method signature, every test, and every request example.

**Total conversation before implementation:** approximately 10 minutes. Total structural
corrections required in the generated code: zero.
