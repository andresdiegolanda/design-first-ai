# spring-mvc-demo

Minimal Spring MVC REST API for an in-memory product catalog.
Demonstrates the Design-First methodology on a plain Spring Boot + Web stack.
No database, no AI, no Docker, no API key.

This app lives at `examples/01-spring-mvc/app/`.
Story documents live at `app/docs/`.

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
git clone https://github.com/andresdiegolanda/design-first-ai
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
curl http://localhost:8080/api/v1/products/{id}

# Delete by ID
curl -X DELETE http://localhost:8080/api/v1/products/{id}
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

1. Open the workspace — `.github/copilot-instructions.md` auto-loaded (Layers 1+2)
2. For a new story, read `docs/[STORY-ID]-impl-guide.md` for context
3. Skills auto-discovered from `.github/skills/` — invoke with `/error-handling`, `/testing`, `/in-memory-store`
4. Use a template from `.github/copilot-layer-4-templates.md` as your opening message
5. Produce `docs/[STORY-ID]-impl-guide.md`, iterate until correct, then execute

---

## Project Structure

```
.github/
├── copilot-layer-0-architecture.md      ← Architecture + design constraints
├── copilot-layer-0-design-principles.md ← Conventions + anti-patterns
├── copilot-layer-1-base-instructions.md ← Project identity + non-negotiables (source)
├── copilot-layer-2-file-patterns.md     ← Structure, naming, canonical patterns (source)
├── copilot-layer-3-skills.md            ← Skills index
├── copilot-layer-4-templates.md         ← Task prompt templates
└── skills/                              ← Agent skills (auto-discovered by Copilot)
    ├── error-handling/SKILL.md          ← Named exceptions, global handler pattern
    ├── testing/SKILL.md                 ← JUnit + @WebMvcTest patterns
    └── in-memory-store/SKILL.md         ← ConcurrentHashMap CRUD pattern
docs/
├── DEMO-001-impl-guide.md              ← Story DEMO-001: intention (what + how)
└── DEMO-001-execution-report.md         ← Story DEMO-001: result (what was built)
.vscode/
├── settings.json                        ← Copilot model config
└── extensions.json                      ← Recommended extensions
src/main/java/com/example/springmvcdemo/
├── controller/  ProductController
├── service/     ProductService
├── model/       Product, CreateProductRequest
└── exception/   ProductNotFoundException, GlobalExceptionHandler, ErrorResponse
```

---

## Story Documents

Every story produces exactly two documents in `docs/`:

| File | Purpose |
|------|---------|
| `docs/[STORY-ID]-impl-guide.md` | Intention — scope, components, interactions, contracts. Written before any code. |
| `docs/[STORY-ID]-execution-report.md` | Result — what was built, deviations, how to run, how to test, commit message. |

See `docs/DEMO-001-impl-guide.md` and `docs/DEMO-001-execution-report.md` for the
initial build of this application.
