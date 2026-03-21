# spring-mvc-demo — Copilot Instructions

> Auto-loaded by GitHub Copilot for every chat session in this workspace.
> This is Layers 1 and 2 of the Design-First AI Collaboration framework.
> Keep under 150 lines. Last reviewed: 2026-03-19.
>
> Layer 2 source: `context/layer-2-file-patterns.md`
> Load per task: `#file:context/layer-3-skills.md` | `#file:context/layer-4-prompt-templates.md`

---

## Project Identity

Minimal Spring MVC REST API for an in-memory product catalog.
Demonstrates the Design-First methodology on a plain Spring Boot + Web stack.
No database. No AI. No external dependencies. Runs with `mvn spring-boot:run`.

- **Stack:** Java 21 | Spring Boot 3.4.3 | spring-boot-starter-web | spring-boot-starter-validation
- **Build:** Maven 3.9+
- **Four endpoints:** GET /products, GET /products/{id}, POST /products, DELETE /products/{id}

---

## Architecture

One controller (`ProductController`) owns HTTP. One service (`ProductService`) owns logic
and in-memory state. `GlobalExceptionHandler` owns all exception-to-HTTP mapping.
No repository layer — `ConcurrentHashMap` in the service is the store.

Flow: `ProductController` → `ProductService` → `ConcurrentHashMap`

---

## Non-Negotiables

- No business logic in controllers — delegate to service immediately
- Constructor injection only — no `@Autowired` on fields
- All public service methods have Javadoc
- Named domain exceptions only — never throw bare `RuntimeException`
- `UUID` for all product identifiers — never `Long` or `int`

---

## What This Project Is NOT

- Not backed by a database — in-memory only, data resets on restart
- Not authenticated
- Not paginated
- Not using Spring Data, JPA, or any persistence layer

---

## Canonical Code Patterns

**Controller — HTTP only:**
```java
@RestController
@RequestMapping("/api/v1/[resource]")
public class [Resource]Controller {
    private final [Resource]Service [resource]Service;
    public [Resource]Controller([Resource]Service [resource]Service) {
        this.[resource]Service = [resource]Service;
    }
    @GetMapping("/{id}")
    public ResponseEntity<[Resource]> getById(@PathVariable UUID id) {
        return ResponseEntity.ok([resource]Service.getById(id));
    }
}
```

**Service — owns logic, throws named exceptions:**
```java
@Service
public class [Resource]Service {
    private final Map<UUID, [Resource]> store = new ConcurrentHashMap<>();
    public [Resource] getById(UUID id) {
        [Resource] item = store.get(id);
        if (item == null) throw new [Resource]NotFoundException(id);
        return item;
    }
}
```

**Exception — single constructor, message includes the ID:**
```java
public class [Resource]NotFoundException extends RuntimeException {
    public [Resource]NotFoundException(UUID id) {
        super("[Resource] not found: " + id);
    }
}
```

---

## Naming Conventions

| Element | Pattern | Example |
|---------|---------|---------|
| Controllers | `{Resource}Controller` | `ProductController` |
| Services | `{Resource}Service` | `ProductService` |
| Models | `{Entity}.java` record | `Product.java` |
| Request DTOs | `Create{Resource}Request` record | `CreateProductRequest` |
| Exceptions | `{Resource}NotFoundException` | `ProductNotFoundException` |
| Tests | `{Class}Test` | `ProductServiceTest` |
| Test methods | `method_condition_expectedResult` | `getById_unknownId_throwsProductNotFoundException` |

---

## Project Structure

```
src/main/java/com/example/springmvcdemo/
├── controller/    HTTP only — no logic
├── service/       Business logic and in-memory store
├── model/         Records: Product, CreateProductRequest
└── exception/     ProductNotFoundException, GlobalExceptionHandler, ErrorResponse
```

New files go in the package matching their layer. Do not create new packages without a clear layering reason.

---

## Anti-Patterns — Never Propose These

- Do not add `@Autowired` on fields — constructor injection only
- Do not use `Long` or `int` for IDs — UUID only
- Do not put logic in controllers — service layer owns it
- Do not throw `RuntimeException` directly — use a named exception
- Do not add `@SpringBootTest` for unit tests — use `@WebMvcTest` for controllers, plain JUnit for services
- Do not add Spring Data, JPA, or any database dependency — in-memory only
- Do not add pagination, sorting, or filtering — out of scope for this demo
