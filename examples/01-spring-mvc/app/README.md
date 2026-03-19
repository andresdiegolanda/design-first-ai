# spring-mvc-demo

Minimal Spring MVC REST API for an in-memory product catalog.
Demonstrates the Design-First methodology on a plain Spring Boot + Web stack.
No database, no AI, no Docker, no API key.

This app lives at `examples/01-spring-mvc/app/`. The design conversation that produced it
is at `examples/01-spring-mvc/conversation/design-conversation.md`.

---

## What It Does

Four CRUD endpoints for a product catalog stored in memory:

```
GET    /api/v1/products          → 200 list of all products
GET    /api/v1/products/{id}     → 200 product | 404 if not found
POST   /api/v1/products          → 201 created product | 400 if invalid
DELETE /api/v1/products/{id}     → 204 | 404 if not found
```

---

## Stack

| Component | Technology | Version |
|-----------|------------|---------|
| Language | Java | 21 |
| Framework | Spring Boot | 3.4.3 |
| Web | spring-boot-starter-web | — |
| Validation | spring-boot-starter-validation | — |
| Build | Maven | 3.9.x |

---

## Prerequisites

- Java 21
- Maven 3.9+

No Docker. No API key. No external dependencies.

---

## Setup

```bash
git clone https://github.com/[your-username]/design-first-ai
cd design-first-ai/examples/01-spring-mvc/app
code .
```

Install recommended extensions when prompted (`.vscode/extensions.json`):
GitHub Copilot, GitHub Copilot Chat, Java Extension Pack, Spring Boot Extension Pack.

---

## Run

```bash
mvn spring-boot:run
```

The API is available at `http://localhost:8080`.

```bash
# Create a product
curl -X POST http://localhost:8080/api/v1/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Widget","price":9.99}'

# List all products
curl http://localhost:8080/api/v1/products

# Get by ID (replace with actual UUID from create response)
curl http://localhost:8080/api/v1/products/00000000-0000-0000-0000-000000000001

# Delete by ID
curl -X DELETE http://localhost:8080/api/v1/products/00000000-0000-0000-0000-000000000001
```

---

## Run Tests

```bash
mvn test
```

17 tests. No external dependencies required.
Service tests use plain JUnit 5. Controller tests use `@WebMvcTest`.

---

## Using Copilot with This Project

1. Copilot Chat opens → `.github/copilot-instructions.md` auto-loaded (Layers 1 and 2)
2. Load Layer 3 skills: `#file:context/layer-3-skills.md`
3. Write a Layer 5 story context for your task
4. Use a template from `context/layer-4-prompt-templates.md` as your opening message
5. Work through Levels 1–4 before any code is generated

---

## Project Structure

```
.github/
└── copilot-instructions.md     ← Layers 1+2 auto-loaded by Copilot
.vscode/
├── settings.json               ← Copilot model config
└── extensions.json             ← Recommended extensions
context/
├── layer-0-architecture.md     ← Architecture + design constraints
├── layer-0-design-principles.md ← Conventions + anti-patterns
├── layer-1-base-instructions.md ← Project identity + non-negotiables
├── layer-3-skills.md           ← Error handling, testing, in-memory store
├── layer-4-prompt-templates.md ← Task prompt templates
└── layer-5-story-context.md    ← Story context (template — write new per task)
src/main/java/com/example/springmvcdemo/
├── controller/  ProductController
├── service/     ProductService
├── model/       Product, CreateProductRequest
└── exception/   ProductNotFoundException, GlobalExceptionHandler, ErrorResponse
```

---

## This App Was Designed Using the Methodology

See `../conversation/design-conversation.md` for the complete Design-First conversation:
two corrections caught before any code was written — repository abstraction removed at
Level 2, `Long` IDs replaced with `UUID` at Level 4.
