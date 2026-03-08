# Layer 2 — File-Pattern Instructions

> **What this is:** Language and framework-specific rules. How code is structured, named, and organized in this project.
> **Where it lives:** Auto-loaded by your AI tool on every session.
> **How to fill it in:** Replace every `[BRACKET]` placeholder. Include at least one real code example.

---

## Project Structure

```
[paste your actual directory tree here — just the top 2 levels is enough]

Example:
src/
├── main/
│   ├── java/com/[company]/[project]/
│   │   ├── controller/     # REST controllers — HTTP only, no business logic
│   │   ├── service/        # Business logic
│   │   ├── repository/     # Data access
│   │   ├── model/          # Domain objects
│   │   ├── dto/            # Request/response objects
│   │   ├── config/         # Spring configuration classes
│   │   └── exception/      # Custom exceptions and handlers
│   └── resources/
│       ├── application.yml
│       └── application-[env].yml
└── test/
    └── java/com/[company]/[project]/
        ├── controller/     # MockMvc tests
        └── service/        # Unit tests with Mockito
```

## Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Classes | PascalCase | `QuestionService`, `VectorStoreConfig` |
| Methods | camelCase, verb-first | `findRelevantDocuments()`, `buildPrompt()` |
| Variables | camelCase | `chatClient`, `searchResults` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_RESULTS`, `DEFAULT_TEMPERATURE` |
| Packages | lowercase, singular | `service`, `controller`, `repository` |
| Test classes | suffix `Test` | `QuestionServiceTest` |
| Config classes | suffix `Config` | `VectorStoreConfig`, `ChatClientConfig` |

[Adjust the table to match your actual conventions. Every deviation from these conventions should be explicit.]

## Controller Pattern

Controllers handle HTTP only. No business logic. No direct repository access.

```java
@RestController
@RequestMapping("/api/v1/[resource]")
@RequiredArgsConstructor
public class [Resource]Controller {

    private final [Resource]Service [resource]Service;

    @PostMapping
    public ResponseEntity<[ResponseDto]> [action](@Valid @RequestBody [RequestDto] request) {
        [ResponseDto] response = [resource]Service.[action](request);
        return ResponseEntity.ok(response);
    }
}
```

## Service Pattern

Services own business logic. They throw domain exceptions. They do not catch and swallow exceptions.

```java
@Service
@RequiredArgsConstructor
public class [Resource]Service {

    private final [Dependency] dependency;

    /**
     * [What this method does in one sentence.]
     *
     * @param [param] [what it represents]
     * @return [what is returned]
     * @throws [DomainException] when [condition]
     */
    public [ReturnType] [action]([ParamType] [param]) {
        // implementation
    }
}
```

## Exception Handling

[Describe your exception strategy. Example below — replace with your actual approach.]

```java
// Custom base exception
public class [Project]Exception extends RuntimeException {
    private final ErrorCode errorCode;
    // constructor, getter
}

// Global handler
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler([Project]Exception.class)
    public ResponseEntity<ErrorResponse> handle[Project]Exception([Project]Exception ex) {
        return ResponseEntity
            .status(ex.getErrorCode().getHttpStatus())
            .body(new ErrorResponse(ex.getErrorCode(), ex.getMessage()));
    }
}
```

## Testing Pattern

[Describe your test strategy. Example below — replace with your actual approach.]

```java
@ExtendWith(MockitoExtension.class)
class [Resource]ServiceTest {

    @Mock
    private [Dependency] dependency;

    @InjectMocks
    private [Resource]Service service;

    @Test
    void [methodName]_[condition]_[expectedResult]() {
        // Arrange
        given(dependency.[method]()).willReturn([value]);

        // Act
        [ReturnType] result = service.[method]([args]);

        // Assert
        assertThat(result).[assertion];
        then(dependency).[verification];
    }
}
```

## Spring AI Specifics

[Fill this section only if your project uses Spring AI. Remove it otherwise.]

- **ChatClient:** Use the fluent builder pattern. Do not autowire `ChatModel` directly.
- **VectorStore:** Inject as `VectorStore` interface, not the concrete implementation.
- **Embeddings:** Do not call the embedding model directly from service code — use `VectorStore` methods.
- **Prompts:** System prompts live in `src/main/resources/prompts/` as `.st` files (StringTemplate). Do not hardcode prompts as Java strings.
- **Version:** Spring AI `[version]`. Do not use APIs from milestone or snapshot versions.
