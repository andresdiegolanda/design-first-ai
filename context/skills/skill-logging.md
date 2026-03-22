# Skill: Logging

> **What this is:** A reusable skill for adding consistent, safe log statements.
> **When to load it:** When adding any new log statement, or when reviewing log coverage
> in an existing feature.
> **How to load it:** Reference by path in agent mode, or `#file:context/skills/skill-logging.md`

---

## What This Skill Does

Produces log statements at the correct level, with safe content (no PII, no full
request/response bodies), following a consistent pattern across the codebase.

---

## Rules

- Use SLF4J (`LoggerFactory.getLogger()`). Never `System.out.println`.
- `DEBUG` — service method entry and exit. Verbose, for local diagnosis.
- `INFO` — business events. Something meaningful happened (resource created, query returned results).
- `WARN` — recoverable conditions. Something unexpected but handled (empty result, fallback used).
- `ERROR` — exception boundaries only. Once per failure, with full stack trace.
- Never log personally identifiable information — names, emails, phone numbers, addresses.
- Never log full request or response bodies in production — log identifiers only.

---

## Pattern

```java
private static final Logger log = LoggerFactory.getLogger([ClassName].class);

// Service entry (DEBUG)
log.debug("Finding [resource] id={}", id);

// Business event (INFO)
log.info("Created [resource] id={}", resource.getId());

// Recoverable condition (WARN)
log.warn("No [resource] found for id={}, returning empty result", id);

// Exception boundary (ERROR — once, with stack trace)
log.error("Failed to retrieve [resource] id={}", id, ex);
```

---

## Design Constraints

- Do not use `System.out.println` or `System.err.println`
- Do not log at `ERROR` inside service methods — only at exception boundaries (global handler)
- Do not use string concatenation in log statements — use parameterised placeholders `{}`
- Do not log PII under any log level
- Do not log full request or response bodies — log the request ID or entity ID only
