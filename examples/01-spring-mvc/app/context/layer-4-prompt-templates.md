# Layer 4 — Prompt Templates (spring-mvc-demo)

> **What this is:** Standardized opening prompts for recurring task types in this project.
> **When to load it:** When your task matches one of the categories below.
> **How to use it:** Load with `#file:context/layer-4-prompt-templates.md`, copy the relevant template, fill in `[BRACKETS]`, use as your opening Copilot Chat message.

---

## Template: New Resource — Full Design-First Flow

Use when: Adding a new resource type (e.g. orders, categories) with its own CRUD endpoints.

```
I need to add [resource name] to spring-mvc-demo.

Context loaded:
- Stack: Java 21 | Spring Boot 3.4.3 | spring-boot-starter-web | no database
- Pattern: controller → service → ConcurrentHashMap store
- IDs: UUID always — never Long or int
- No repository layer

Before writing any code, walk me through the design at each level.

Level 1 — Capabilities:
The resource must support: [list, get by ID, create, delete — or a subset].
It must NOT: [exclusion — e.g. no update endpoint, no search].

Level 2 — Components:
Existing: ProductController pattern, ProductService pattern, GlobalExceptionHandler.
Do not add components unless strictly necessary.
List only new components with one-line purposes. No code.

Level 3 — Interactions:
Entry point for each endpoint. Exit (response body + status). Error paths.

Level 4 — Contracts:
Record definitions (fields + types + validation annotations).
Controller method signatures (HTTP method, path, params, return type).
Service method signatures (params, return type, exceptions thrown).
No implementation. Wait for my approval.

No code until I approve Level 4.
```

---

## Template: New Endpoint on Existing Resource

Use when: Adding a single new endpoint to an existing controller.

```
I need to add [HTTP method] /api/v1/[resource]/[path] to spring-mvc-demo.

Purpose: [one sentence]
Existing service method to call (if any): [method name or "none — needs new service method"]

Constraints:
- Constructor injection, UUID IDs, named exceptions, Javadoc on public methods

Level 4 — Contracts first:
Controller method signature (mapping, params, return type).
Service method signature if new (params, return type, exception).
Any new request/response DTO records.
Wait for my approval before writing the implementation.
```

---

## Template: Test Coverage

Use when: Writing tests for a new or modified component.

```
I need tests for [ProductService / ProductController / both].

[If service:]
Scenarios: [list — e.g. create returns product with ID, getById unknown throws, delete removes]
Use: plain JUnit 5, new ProductService() in @BeforeEach, no Spring context.
Naming: method_condition_expectedResult

[If controller:]
Endpoint: [HTTP method] /api/v1/[resource]/[path]
Scenarios: [list — e.g. valid input returns 201, blank name returns 400, unknown ID returns 404]
Use: @WebMvcTest, @MockBean ProductService, assert $.code for errors.

Generate the tests. Follow patterns in ProductServiceTest and ProductControllerTest.
```

---

## Template: Bug Investigation

Use when: Diagnosing unexpected behavior.

```
I have unexpected behavior in [ProductController / ProductService / GlobalExceptionHandler].

Observed: [what is happening]
Expected: [what should happen]
Conditions: [always / specific input / specific HTTP method]

Relevant code:
[paste the method]

Do not propose a fix yet.
First identify the most likely causes in order of probability.
For each cause, tell me what evidence confirms or eliminates it.

Areas to check:
- ConcurrentHashMap null check (get vs getOrDefault)
- UUID parsing from path variable
- @Valid on request body — is the annotation present?
- GlobalExceptionHandler — is the exception type matched correctly?
```
