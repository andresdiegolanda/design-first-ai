# Layer 4 — Prompt Templates (spring-mvc-demo)

> **When to load:** When your task matches one of the categories below.
> **How to load:** Reference by path in agent mode, or `#file:.github/copilot-layer-4-templates.md`
> Copy the relevant template, fill in `[BRACKETS]`, use as your opening message.

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

Build an implementation guide for this story.
The guide must be usable as a prompt input and understandable by a human.

Scope:
The resource must support: [list, get by ID, create, delete — or a subset].
It must NOT: [explicit exclusion].

Components:
Existing: ProductController pattern, ProductService pattern, GlobalExceptionHandler.
Do not add components unless strictly necessary.

Include:
- Scope section with explicit exclusions
- Components with single-line purposes
- Interactions including error paths for every external call
- Contracts: record definitions, controller signatures, service signatures, exception types

No code in the guide. Wait for my approval before executing.
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

Build an implementation guide for this change.
Include: scope, contracts (controller + service signatures), error paths.
No code. Wait for my approval before executing.
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
Run the tests when done and report results.
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
```
