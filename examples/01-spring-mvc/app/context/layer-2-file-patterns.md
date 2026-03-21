# Layer 2 — File-Pattern Instructions (spring-mvc-demo)

> **What this is:** Project structure, naming conventions, and canonical code patterns
> specific to this codebase.
> **Where it lives in Copilot:** This content is merged into `.github/copilot-instructions.md`
> alongside Layer 1. Both layers are auto-loaded at session start.
> **How to update:** Edit this file, then copy the changed sections into
> `copilot-instructions.md`. The standalone file is the source of record.

---

## Project Structure

```
src/main/java/com/example/springmvcdemo/
├── controller/    HTTP only — no logic
├── service/       Business logic and in-memory store
├── model/         Records: Product, CreateProductRequest
└── exception/     ProductNotFoundException, GlobalExceptionHandler, ErrorResponse

src/test/java/com/example/springmvcdemo/
├── controller/    @WebMvcTest controller tests
└── service/       Plain JUnit service tests

src/main/resources/
└── application.yml
```

**Rule:** New files go in the package matching their layer. Do not create new packages
without a clear layering reason. One class per file.

---

## Naming Conventions

| Element | Pattern | Example |
|---------|---------|---------|
| Controllers | `{Resource}Controller` | `ProductController` |
| Services | `{Resource}Service` | `ProductService` |
| Domain records | `{Entity}` | `Product` |
| Request records | `Create{Resource}Request` | `CreateProductRequest` |
| Exceptions | `{Resource}NotFoundException` | `ProductNotFoundException` |
| Error response | `ErrorResponse` | `ErrorResponse` |
| Tests | `{Class}Test` | `ProductServiceTest` |
| Test methods | `method_condition_expectedResult` | `getById_unknownId_throwsProductNotFoundException` |

---

## Canonical Code Patterns

### Controller — HTTP only, no logic

```java
@RestController
@RequestMapping("/api/v1/[resource]")
public class [Resource]Controller {

    private final [Resource]Service [resource]Service;

    public [Resource]Controller([Resource]Service [resource]Service) {
        this.[resource]Service = [resource]Service;
    }

    @GetMapping
    public ResponseEntity<List<[Resource]>> listAll() {
        return ResponseEntity.ok([resource]Service.listAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<[Resource]> getById(@PathVariable UUID id) {
        return ResponseEntity.ok([resource]Service.getById(id));
    }

    @PostMapping
    public ResponseEntity<[Resource]> create(@Valid @RequestBody Create[Resource]Request request) {
        return ResponseEntity.status(HttpStatus.CREATED).body([resource]Service.create(request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        [resource]Service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
```

### Service — owns logic and in-memory store

```java
@Service
public class [Resource]Service {

    private final Map<UUID, [Resource]> store = new ConcurrentHashMap<>();

    public List<[Resource]> listAll() {
        return new ArrayList<>(store.values());
    }

    public [Resource] getById(UUID id) {
        [Resource] item = store.get(id);
        if (item == null) throw new [Resource]NotFoundException(id);
        return item;
    }

    public [Resource] create(Create[Resource]Request request) {
        UUID id = UUID.randomUUID();
        [Resource] item = new [Resource](id, request.name(), ...);
        store.put(id, item);
        return item;
    }

    public void delete(UUID id) {
        if (store.remove(id) == null) throw new [Resource]NotFoundException(id);
    }
}
```

### Domain exception — named, single constructor

```java
public class [Resource]NotFoundException extends RuntimeException {
    public [Resource]NotFoundException(UUID id) {
        super("[Resource] not found: " + id);
    }
}
```

### Request record — validated

```java
public record Create[Resource]Request(
        @NotBlank String name,
        @Positive double price
) {}
```

---

## Design Constraints

- Do not create new packages without a layering justification
- Do not use `Long` or `int` for IDs — UUID only
- Do not name tests with `test` prefix — use `method_condition_expectedResult`
- Do not add files that don't follow the package-per-layer structure
