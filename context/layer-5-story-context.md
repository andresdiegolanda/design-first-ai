# Layer 5 — Story Context Template

> **What this is:** A template for the structure and content of `docs/[STORY-ID]-impl-guide.md`.
> **How to use it:** When building an impl-guide, give the agent this file as structural guidance.
> **What it is not:** A file to load per session. Under the two-document rule, the impl-guide
> itself is the story context — persistent, not transient.

See `../docs/design-workflow.md` for the full workflow.

---

## [STORY-ID] — Implementation Guide
### [Story title]

> **Story:** [JIRA-000 or equivalent]
> **Status:** [Draft / Approved / Executed]
> **App description:** `docs/app-description.md`

---

## Scope

[2–5 sentences. The deliverable. Be specific about what done looks like.]

**What must be built:**
- [requirement 1]
- [requirement 2]

**Explicitly out of scope:**
- [exclusion 1 — something the agent might reasonably assume is included]
- [exclusion 2]

---

## Components

| Component | Purpose |
|-----------|---------|
| [ExistingComponent] | [why it's involved — one line] |
| [NewComponent] | [what it does — one line] |

**Constraint:** [any structural rule — e.g. no new abstractions, reuse existing service]

---

## Interactions

```
[Entry point — e.g. HTTP request, lifecycle event, user action]
  → [Component.method()]
  → [what happens]
  → [exit: response body + status / updated state]
  → [error path: what is thrown/set, how it surfaces]
```

---

## Contracts

[Method signatures, types, DTOs, exception classes. No implementation. No method bodies.]

```[language]
// Records / interfaces / DTOs
[TypeName]([field: type, ...])

// Method signatures
[returnType] methodName([params]) throws [ExceptionType]
```

---

## Constraints

[Technical constraints specific to this story.]

- [e.g. Must reuse existing X bean — do not create a new one]
- [e.g. All IDs are UUID — never Long or int]
- [e.g. Tests must not require Spring context — plain JUnit only]

## Open Questions

[Things not yet decided — resolve before execution, not during.]

- [question 1]
- [question 2]
