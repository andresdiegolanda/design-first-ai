# design-first-demo — Copilot Instructions

> Auto-loaded by GitHub Copilot for every chat session in this workspace.
> This is Layers 1 and 2 of the Design-First AI Collaboration framework.
> Keep under 150 lines. Last reviewed: 2026-03-08.

---

## Project Identity

Stateless REST API that answers natural language questions using retrieval-augmented generation.
Accepts a question, retrieves relevant documents from PGVector, returns a model-generated answer.

- **Stack:** Java 21 | Spring Boot 3.4.3 | Spring AI 1.0.x | PGVector (PostgreSQL 16)
- **Build:** Maven 3.9+
- **Single endpoint:** POST `/api/v1/questions/ask`

---

## Architecture

Two outbound dependencies: PGVector (vector store) and OpenAI via Spring AI (chat model).
No sessions. No auth. No conversation history. Stateless and single-turn.

Flow: `QuestionController` → `QuestionService.findAnswer()` → `VectorStore` → `ChatClient` → answer

Empty result from vector store → return default message. Never call the model with no context.

---

## Non-Negotiables

- No business logic in controllers — delegate to service immediately
- All configurable values in `application.yml` — nothing hardcoded in Java
- All public methods have Javadoc
- Constructor injection only — no `@Autowired` on fields
- Named domain exceptions only — never throw bare `RuntimeException`

---

## What This Project Is NOT

- Not multi-tenant — no tenantId anywhere
- Not authenticated — assume caller is trusted
- Not a streaming API — synchronous only
- Not responsible for document ingestion — vector store is pre-populated

---

## Canonical Code Patterns

**Controller — HTTP only, delegate immediately:**
```java
@RestController
@RequestMapping("/api/v1/[resource]")
public class [Resource]Controller {
    private final [Resource]Service [resource]Service;
    public [Resource]Controller([Resource]Service [resource]Service) {
        this.[resource]Service = [resource]Service;
    }
    @PostMapping("/[action]")
    public ResponseEntity<[Response]> [action](@Valid @RequestBody [Request] request) {
        return ResponseEntity.ok([resource]Service.[action](request.[field]()));
    }
}
```

**Service — owns all logic, throws named exceptions:**
```java
@Service
public class [Resource]Service {
    private static final Logger log = LoggerFactory.getLogger([Resource]Service.class);
    // constructor injection
    public [Return] [action]([Param] param) {
        log.debug("[action] called with {}", param);
        try {
            // logic
        } catch (Exception ex) {
            throw new [Domain]Exception("message", ex);
        }
    }
}
```

**Exception — named, extends DemoAppException:**
```java
public class [Domain]Exception extends DemoAppException {
    public [Domain]Exception(String message, Throwable cause) { super(message, cause); }
}
```

---

## Naming Conventions

| Element | Pattern | Example |
|---------|---------|---------|
| Controllers | `{Resource}Controller` | `QuestionController` |
| Services | `{Resource}Service` | `QuestionService` |
| Request DTOs | `{Action}Request` | `AskRequest` |
| Response DTOs | `{Action}Response` | `AskResponse` |
| Exceptions | `{Failure}Exception` | `VectorStoreException` |
| Config records | `{Feature}Properties` | `RagProperties` |
| Tests | `{Class}Test` | `QuestionServiceTest` |
| Test methods | `method_condition_result` | `findAnswer_noDocumentsFound_returnsDefault` |

---

## Project Structure

```
src/main/java/com/example/designfirstdemo/
├── controller/     HTTP only — no logic
├── service/        Business logic and RAG orchestration
├── dto/            Records: AskRequest, AskResponse, ErrorResponse
├── exception/      DemoAppException, VectorStoreException, ModelException, GlobalExceptionHandler
└── config/         RagProperties (@ConfigurationProperties)

src/main/resources/
├── application.yml       All config — model, temperature, k, threshold
└── prompts/question.st   Prompt template reference
```

New files go in the package that matches their layer. A service class goes in `service/`. A DTO goes in `dto/`. Do not create new packages without a clear layering reason.

---

## Anti-Patterns — Never Propose These

- Do not use `@Autowired` on fields — constructor injection only
- Do not use `var` keyword — explicit types always
- Do not put logic in controllers — service layer owns logic
- Do not throw `RuntimeException` directly — use a named subclass of `DemoAppException`
- Do not create service interfaces — `@Service` class directly, no interface unless multiple implementations exist
- Do not use `Optional.get()` without `isPresent()` — always guard
- Do not add `@SpringBootTest` for unit tests — use `@WebMvcTest` for controllers, Mockito for services
- Do not call the embedding model directly — use `VectorStore.similaritySearch()`
- Do not build prompts with string concatenation — use the `.st` template file
- Do not add streaming, caching, rate limiting, or retry logic — out of scope for this demo
