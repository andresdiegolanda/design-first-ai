# Layer 3 — Skills (design-first-demo)

> **What this is:** Reusable knowledge patterns for recurring technical concerns in this project.
> **When to load it:** When your current task involves one of the skill areas below.
> **How to use it:** Load this file with `#file:context/layer-3-skills.md` and reference the relevant skill in your Layer 5 story context.

---

## Skill: Error Handling

Use when: Adding any service method that calls an external dependency (VectorStore or ChatClient).

**The pattern — two named exceptions, one handler:**

All domain failures map to one of two exception types:

| Exception | When | HTTP |
|-----------|------|------|
| `VectorStoreException` | `VectorStore.similaritySearch()` throws | 503 |
| `ModelException` | `ChatClient` call throws | 503 |

**Rules:**
- Wrap external calls in try-catch at the boundary where the call lives — not higher up.
- Throw the named exception with a descriptive message and the original cause.
- Never catch and swallow. Never log-and-rethrow with the same type. Never throw `RuntimeException` directly.
- `GlobalExceptionHandler` owns HTTP mapping — never put `ResponseEntity` or HTTP status logic in service code.
- Log once at the boundary: `log.error("message", ex)` in `GlobalExceptionHandler`. Do not log in service code before rethrowing.

**Pattern (from QuestionService):**
```java
try {
    List<Document> documents = vectorStore.similaritySearch(request);
    return documents;
} catch (Exception ex) {
    throw new VectorStoreException("Failed to retrieve documents from vector store", ex);
}
```

**Adding a new exception:**
1. Extend `DemoAppException` (two-argument constructor: message + cause).
2. Add `@ExceptionHandler` in `GlobalExceptionHandler` with the correct HTTP status.
3. Add a constant for the error code string in the handler.
4. Never add a third exception type for a condition that maps to the same HTTP status as an existing one — reuse the existing type.

**Design Constraints:**
- Do not add try-catch in `QuestionController` — errors propagate to `GlobalExceptionHandler`
- Do not create a checked exception — `DemoAppException` extends `RuntimeException`
- Do not add status logic in `QuestionService` — HTTP belongs in `GlobalExceptionHandler`

---

## Skill: Testing

Use when: Writing any test in this project.

**Service layer tests (`QuestionServiceTest` pattern):**
- `@ExtendWith(MockitoExtension.class)`. No Spring context.
- Mock `VectorStore`, `ChatClient.Builder`, `ChatClient`, and the call chain.
- Construct `QuestionService` manually in `@BeforeEach` with `given(chatClientBuilder.build()).willReturn(chatClient)`.
- Use `RagProperties` record directly: `new RagProperties(3, 0.7)` — no need to mock it.
- Use `assertThatThrownBy()` for exception tests, not `@Test(expected=...)`.

**Controller layer tests (`QuestionControllerTest` pattern):**
- `@WebMvcTest(QuestionController.class)`. No full Spring context.
- `@MockBean QuestionService` — mock the service, test HTTP contract only.
- Assert `status()` and `jsonPath()`. Never assert on exact error message strings — assert on `$.code`.
- Do not load `RagProperties`, `VectorStore`, or `ChatClient` — they are not in the web slice.

**Test naming:**
```
methodName_condition_expectedResult
findAnswer_noDocumentsFound_returnsDefaultAnswer
findAnswer_vectorStoreThrows_throwsVectorStoreException
ask_blankQuestion_returns400
```

**What is tested:**
- `QuestionServiceTest`: happy path, no documents, `VectorStoreException`, `ModelException`, config values passed through
- `QuestionControllerTest`: 200 with answer, 400 blank, 400 missing field, 503 VectorStore, 503 Model, 200 default answer

**What is NOT tested:**
- Spring wiring (auto-configuration, bean creation)
- `RagProperties` validation — it fails at startup, not in tests
- PGVector behavior — external dependency, not mocked at unit level

**Design Constraints:**
- Do not use `@SpringBootTest` — too slow and tests the wrong thing
- Do not assert on `$.message` text in controller tests — assert on `$.code` only
- Do not test `GlobalExceptionHandler` directly — it is covered by controller tests

---

## Skill: Logging

Use when: Adding log statements to any class in this project.

**Logger declaration (every class that logs):**
```java
private static final Logger log = LoggerFactory.getLogger(QuestionService.class);
```

**Log levels in use:**

| Level | Used for | Example |
|-------|----------|---------|
| `DEBUG` | Entry to public service methods, retrieved document count | `"Finding answer for question: {}"` |
| `INFO` | Business events with meaningful counts | `"Retrieved {} documents, generating answer"` |
| `WARN` | Recoverable conditions, fallback taken | `"No documents found above similarity threshold..."` |
| `ERROR` | Exception boundaries in `GlobalExceptionHandler` only | `log.error("Vector store unavailable", ex)` |

**Rules:**
- Log at `DEBUG` on entry to `findAnswer()` — the question text.
- Log at `DEBUG` after `similaritySearch()` — the count returned.
- Log at `INFO` before calling the model — confirms documents were found.
- Log at `WARN` when returning the default answer — no documents found above threshold.
- Log at `ERROR` only in `GlobalExceptionHandler` — once per exception, with full stack trace.
- Never log PII. Never log full request bodies. Log identifiers and counts.

**What not to log:**
- Do not log the question in `QuestionController` — it is already logged in `QuestionService`.
- Do not log inside `retrieveDocuments()` or `generateAnswer()` private methods — log at `findAnswer()` level.
- Do not add log statements inside the exception classes themselves.

**application.yml log configuration:**
```yaml
logging:
  level:
    com.example.designfirstdemo: DEBUG   # all project classes at DEBUG
    org.springframework.ai: INFO          # Spring AI at INFO — too noisy at DEBUG
```

**Design Constraints:**
- Do not use `System.out.println` anywhere
- Do not log inside private methods — log at the public method boundary
- Do not log in `GlobalExceptionHandler` at DEBUG or INFO — errors only

---

## Skill: Spring AI — RAG Pattern

Use when: Modifying `QuestionService` or adding a new RAG feature.

**The four-step pattern (as implemented in `QuestionService`):**

1. **Build `SearchRequest`** with explicit `topK` and `similarityThreshold` from `RagProperties`.
2. **Call `vectorStore.similaritySearch(request)`** — returns `List<Document>`.
3. **If empty → return default answer.** Never call the model with no context.
4. **Build system prompt** from document texts joined with `\n\n---\n\n` separator. Call `ChatClient` fluent API.

**The ChatClient call chain:**
```java
chatClient.prompt()
    .system(systemPrompt)
    .user(question)
    .call()
    .content();
```

**Document text extraction:**
```java
documents.stream()
    .map(Document::getText)
    .collect(Collectors.joining("\n\n---\n\n"));
```

**`RagProperties` — always use, never hardcode:**
```java
SearchRequest.builder()
    .query(question)
    .topK(ragProperties.k())                          // configured: 3
    .similarityThreshold(ragProperties.similarityThreshold())  // configured: 0.7
    .build();
```

**System prompt location:**
The prompt is currently inline in `buildSystemPrompt()`. The `resources/prompts/question.st` file documents what externalising it would look like. Do not move the prompt to the `.st` file without updating `QuestionService` to load it with `PromptTemplate`.

**Design Constraints:**
- Do not call the embedding model directly — use `VectorStore.similaritySearch()`
- Do not call the model when `documents.isEmpty()` — return the default answer
- Do not hardcode `k` or `similarityThreshold` — always read from `RagProperties`
- Do not use string concatenation to build the system prompt — use the `formatted()` pattern or `PromptTemplate`
- Do not inject `ChatClient` directly — inject `ChatClient.Builder` and call `.build()` in the constructor

---

## Skill: Configuration

Use when: Adding any new configurable value to the application.

**The pattern — `@ConfigurationProperties` record (as in `RagProperties`):**
```java
@ConfigurationProperties(prefix = "app.[feature]")
@Validated
public record [Feature]Properties(
        @Min(1) @Max(20) int [boundedInt],
        @DecimalMin("0.0") @DecimalMax("1.0") double [boundedDouble],
        @NotBlank String [requiredString]
) {}
```

**Rules:**
- All new config goes under `app.[feature]` prefix in `application.yml`.
- Use `@Validated` + JSR-303 annotations — fail at startup, not at runtime.
- Register the record as a `@ConfigurationPropertiesScan` target or add `@EnableConfigurationProperties` — Spring Boot auto-detects records annotated with `@ConfigurationProperties` in most cases.
- Provide the config in `application.yml` with a comment explaining the allowed range.
- Never use `@Value` for more than one related property — use a record.

**Existing config structure:**
```yaml
app:
  rag:
    k: 3                       # 1–20
    similarity-threshold: 0.7  # 0.0–1.0
```

New features add their own block under `app:`, never extend `app.rag`.

**Design Constraints:**
- Do not hardcode values in Java that belong in `application.yml`
- Do not use `@Value` for RAG parameters — `RagProperties` already owns them
- Do not add nullable fields to config records — all required values must be present at startup
