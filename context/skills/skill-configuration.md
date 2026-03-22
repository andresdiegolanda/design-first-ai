# Skill: Configuration

> **What this is:** A reusable skill for externalising configurable values correctly.
> **When to load it:** When adding any new configurable value or environment-specific
> behaviour to a feature.
> **How to load it:** Reference by path in agent mode, or `#file:context/skills/skill-configuration.md`

---

## What This Skill Does

Produces type-safe, validated configuration properties bound from `application.yml`.
Enforces fail-fast validation at startup and keeps configurable values out of Java source.

---

## Rules

1. All configurable values go in `application.yml`. Never hardcoded in Java source.
2. Group related properties under a `@ConfigurationProperties` class. Do not use `@Value`
   for more than one related property.
3. Validate at startup with `@Validated`. Fail fast — a misconfiguration discovered at
   runtime is worse than a failed startup.
4. Provide sensible defaults for non-critical values. Do not require configuration for
   things with an obvious default.
5. Document each property in `application.yml` with a comment.

---

## Pattern

```java
@ConfigurationProperties(prefix = "[feature]")
@Validated
public record [Feature]Properties(
    @NotBlank String [requiredProperty],
    @Min(1) @Max(100) int [boundedProperty],
    @Positive double [positiveProperty]
) {}
```

```yaml
# application.yml
[feature]:
  # [What this property controls. Required.]
  [required-property]: [value]
  # [What this property controls. Range: 1–100. Default: 10.]
  [bounded-property]: 10
  # [What this property controls. Must be positive.]
  [positive-property]: 0.7
```

Register in Spring Boot:
```java
@Configuration
@EnableConfigurationProperties([Feature]Properties.class)
public class [Feature]Config {}
```

---

## Design Constraints

- Do not hardcode configurable values in Java source — always `application.yml`
- Do not use `@Value` when two or more related properties exist — use `@ConfigurationProperties`
- Do not skip `@Validated` — startup validation is not optional
- Do not provide a default for required values — required means no default
