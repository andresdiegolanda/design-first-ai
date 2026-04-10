---
name: error-handling
description: Consistent error handling with named exceptions and global handler. Use when implementing any method that can fail with a business reason.
---

# Skill: Error Handling

> **When to load it:** When implementing any service method that can fail with a meaningful
> business reason, or when adding exception handling to an existing feature.

---

## What This Skill Does

Produces consistent, named exception classes and a global handler that translates domain
failures to HTTP responses. Keeps error logic out of service code and ensures every failure
category has an explicit type.

---

## Rules

1. Define a domain-specific exception for each failure category. Never one generic exception
   for everything.
2. Throw at the point of failure. Message describes the business condition, not the technical
   cause.
3. Let the `GlobalExceptionHandler` translate to HTTP. Never catch-and-translate inside
   service code.
4. Never swallow exceptions with empty catch blocks.
5. Log once at the boundary. Not at every catch site.

---

## Failure Categories to Define Per Feature

| Category | When to throw |
|----------|--------------|
| Not found | Resource does not exist |
| Validation failure | Input does not meet business rules |
| External service failure | Downstream unavailable or returned unexpected response |
| Configuration error | Required config missing or invalid at runtime |

---

## Pattern

**Named exception:**
```java
public class [Resource]NotFoundException extends RuntimeException {
    public [Resource]NotFoundException([IdType] id) {
        super("[Resource] not found: " + id);
    }
}
```

**Global handler:**
```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler([Resource]NotFoundException.class)
    public ResponseEntity<ErrorResponse> handle([Resource]NotFoundException ex) {
        return ResponseEntity
            .status(HttpStatus.NOT_FOUND)
            .body(new ErrorResponse(ex.getMessage()));
    }
}
```

---

## Design Constraints

- Do not throw `RuntimeException` directly — always a named exception class
- Do not catch exceptions in service code and re-throw as the same type — let them propagate
- Do not log and rethrow at the same site — log once at the global handler
- Do not use HTTP status codes inside service code — that belongs in the handler
