# Layer 1 — Base Instructions (spring-mvc-demo)

> **Source of record for Layer 1 content.**
> The content below is merged into `copilot-instructions.md` (auto-loaded).
> Edit this file, then update `copilot-instructions.md` accordingly.

## Project Identity

- **Name:** spring-mvc-demo
- **Purpose:** Minimal Spring MVC REST API demonstrating the Design-First methodology on a plain Java/Spring stack
- **Type:** REST microservice, in-memory store
- **Status:** Demo project — exists to illustrate the Design-First framework

## Architecture Overview

Four-endpoint CRUD API for a product catalog stored in a `ConcurrentHashMap`.
No database, no external dependencies. One controller, one service, one exception handler.
The service owns all state and logic. The controller owns HTTP only.

## Tech Stack

| Component | Technology | Version |
|-----------|------------|---------|
| Language | Java | 21 |
| Framework | Spring Boot | 3.4.3 |
| Web | spring-boot-starter-web | — |
| Validation | spring-boot-starter-validation | — |
| Build | Maven | 3.9.x |

## Non-Negotiables

- No business logic in controllers
- Constructor injection only
- All public service methods have Javadoc
- Named domain exceptions — never bare `RuntimeException`
- `UUID` for all product identifiers

## What This Project Is Not

- Not database-backed — in-memory only
- Not authenticated
- Not paginated
- Not using Spring Data or any persistence layer

## Anti-Patterns

- No `@Autowired` on fields
- No `Long` or `int` IDs — UUID only
- No repository interfaces — the service owns the map
- No `@SpringBootTest` — use `@WebMvcTest` for controllers
