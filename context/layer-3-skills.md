# Layer 3 — Skills

> **What this is:** Reusable knowledge patterns for recurring technical concerns in this project.
> **When to load it:** When your current task involves one of the skill areas below.
> **How to use it:** Reference the relevant skill section in your Layer 5 story context, or load the whole file when multiple skills apply.

---

## Skill: Error Handling

Use when: Implementing any service method that can fail with a meaningful business reason.

**Pattern:**
1. Define a domain-specific exception for each failure category (not one generic exception).
2. Throw at the point of failure with a message that explains the business condition, not the technical cause.
3. Let the `GlobalExceptionHandler` translate to HTTP responses — never catch-and-translate inside service code.
4. Never swallow exceptions with empty catch blocks.

**Error categories to define per feature:**
- Not found (resource does not exist)
- Validation failure (input does not meet business rules)
- External service failure (downstream unavailable or returned unexpected response)
- Configuration error (required config missing or invalid)

**What not to do:**
- Do not throw `RuntimeException` with a string message — always a named exception class.
- Do not catch exceptions in service code and re-throw as the same type — let them propagate.
- Do not log and rethrow — log once at the boundary.

---

## Skill: Testing

Use when: Writing any test in this project.

**Unit tests (service layer):**
- Use Mockito. No Spring context. Fast.
- Test method behavior, not implementation. Mock the boundary, not internals.
- One assertion per test is a guideline, not a rule. Assert what matters.
- Test naming: `methodName_condition_expectedResult`. Example: `findAnswer_noDocumentsFound_throwsNotFoundException`.

**Integration tests (controller layer):**
- Use `@WebMvcTest` for controller tests. Do not load the full Spring context.
- Use `MockMvc`. Assert HTTP status and response body shape.
- Mock the service layer with `@MockBean`.

**What not to do:**
- Do not test Spring wiring in unit tests — that is what `@WebMvcTest` is for.
- Do not use `@SpringBootTest` for tests that only need one layer.
- Do not assert on exact error message strings — assert on error codes or status.

---

## Skill: Logging

Use when: Adding any log statement.

**Rules:**
- Use SLF4J (`LoggerFactory.getLogger()`). Never `System.out.println`.
- Log at entry and exit of public service methods at `DEBUG` level.
- Log business events (document retrieved, answer generated) at `INFO` level.
- Log warnings for recoverable conditions (empty result set, fallback used).
- Log errors only at exception boundaries — once, with full stack trace.
- Never log personally identifiable information.
- Never log full request/response bodies in production — log identifiers only.

**Pattern:**
```java
private static final Logger log = LoggerFactory.getLogger([ClassName].class);

// Service entry
log.debug("Finding answer for question id={}", questionId);

// Business event
log.info("Retrieved {} documents for question id={}", documents.size(), questionId);

// Warning
log.warn("No documents found for question id={}, returning empty answer", questionId);

// Error (at exception boundary only)
log.error("Failed to query vector store for question id={}", questionId, ex);
```

---

## Skill: Spring AI — RAG Pattern

Use when: Implementing any retrieval-augmented generation feature.

**The pattern has four steps. Always all four:**
1. **Embed the query** — convert user input to vector (handled by VectorStore internally).
2. **Retrieve documents** — similarity search against VectorStore with explicit `k` (number of results) and score threshold.
3. **Build prompt** — inject retrieved documents into system prompt template. Never concatenate strings — use `.st` template files.
4. **Generate answer** — call ChatClient with the built prompt. Return the response content.

**Configuration that must be explicit:**
- `k` (number of documents to retrieve) — default of 4 is rarely right for your use case. Set it explicitly.
- Score threshold — without it, irrelevant documents contaminate the context.
- Max tokens — set a ceiling to prevent runaway generation costs.
- Temperature — default (1.0) is too high for factual Q&A. Use 0.2–0.4 for deterministic answers.

**What not to do:**
- Do not call the embedding model directly — use VectorStore's similarity search.
- Do not build prompts with Java string concatenation — use template files.
- Do not ignore the score threshold — low-relevance documents degrade answer quality.
- Do not let the ChatClient call escape to a try-catch in service code — define a specific exception for model failures.

---

## Skill: Configuration

Use when: Adding any new configurable value.

**Rules:**
- All configurable values go in `application.yml`. Never hardcoded in Java.
- Group related properties under a custom `@ConfigurationProperties` class. Do not use `@Value` for more than one related property.
- Validate at startup with `@Validated` on the `@ConfigurationProperties` class. Fail fast — a missing config that is discovered at runtime is worse than a failed startup.
- Provide sensible defaults for non-critical values. Do not require configuration for things that have an obvious default.

**Pattern:**
```java
@ConfigurationProperties(prefix = "[feature]")
@Validated
public record [Feature]Properties(
    @NotBlank String [requiredProperty],
    @Min(1) @Max(20) int [boundedProperty],
    @Positive double [positiveProperty]
) {
    // Compact constructor for derived defaults if needed
}
```
