---
name: error-handling
description: Named exceptions and global handler for the Spring MVC demo. Use when adding any method that can fail with a domain reason.
---

# Skill: Error Handling (spring-mvc-demo)

## Pattern — one named exception per failure category

```java
public class ProductNotFoundException extends RuntimeException {
    public ProductNotFoundException(UUID id) {
        super("Product not found: " + id);
    }
}
```

## Rules

- Name the exception after the domain concept, not the HTTP status.
- Constructor takes the identifier — message includes it for debuggability.
- `GlobalExceptionHandler` owns the HTTP mapping — never put `ResponseEntity` in service code.
- Never catch and swallow. Never catch and rethrow as `RuntimeException`.

## Adding a new exception

1. Create `{Concept}Exception extends RuntimeException` in `exception/`.
2. Add `@ExceptionHandler` in `GlobalExceptionHandler` with the correct HTTP status.
3. Return `new ErrorResponse("SNAKE_CASE_CODE", ex.getMessage())`.

## Design Constraints

- Do not throw `RuntimeException` directly — always a named subclass
- Do not put HTTP status logic in service code
- Do not add checked exceptions — all exceptions extend `RuntimeException`
