# Level 4 — Spec Document Template

> **What this is:** The structured output of Level 4 approval. Fill this in immediately after approving Level 4 contracts.
> **When to use it:** After every Level 4 approval, before opening the Level 5 session.
> **Why it exists:** The design conversation produces agreement scattered across a chat session. This template captures the agreed decisions in a single, scannable document — the authoritative input to Level 5.

---

## How to Use This

1. After approving Level 4, copy this template.
2. Fill in each section from the approved conversation.
3. Save as `spec-[story-id].md` alongside your story context.
4. Load it at the start of your Level 5 session with `#file:spec-[story-id].md`.

The Level 5 session starts from this document, not from the conversation history. Keep it to one page.

---

# Spec: [Story ID] — [Story Title]

**Date:** [YYYY-MM-DD]
**Status:** Approved at Level 4 — ready for implementation

---

## Agreed Scope (from Level 1)

What must be built — one sentence per deliverable:
- [deliverable 1]
- [deliverable 2]

What is explicitly out of scope:
- [exclusion 1]
- [exclusion 2]

---

## Agreed Components (from Level 2)

| Component | Responsibility | New / Existing |
|-----------|---------------|----------------|
| [ComponentName] | [one line] | [New / Existing] |

---

## Agreed Data Flow (from Level 3)

Entry point: [HTTP method + path / event / trigger]

Flow (numbered, one line each):
1. [step]
2. [step]
3. [step]

Error paths:
- [failure condition] → [exception thrown] → [HTTP status or outcome]
- [failure condition] → [exception thrown] → [HTTP status or outcome]

---

## Agreed Contracts (from Level 4)

**Method signatures:**
```
[ReturnType] [methodName]([ParamType] [paramName]) throws [ExceptionType]
[ReturnType] [methodName]([ParamType] [paramName])
```

**DTOs / Records:**
```
record [Name]([Type] [field], [Type] [field])
```

**New exceptions (if any):**
```
class [ExceptionName] extends [BaseException]
```

**New config properties (if any):**
```
prefix: [app.feature]
fields: [type] [name] (range: [min–max])
```

---

## Implementation Notes

Constraints that apply to the Level 5 session specifically:
- [constraint — e.g. "Reuse existing VectorStoreConfig bean — do not create a new one"]
- [constraint]

Layer 3 skills that apply:
- [ ] Error Handling
- [ ] Testing
- [ ] Logging
- [ ] [other]

---

## Hard Gate

> This spec is the contract. The Level 5 implementation must match it exactly.
> Any deviation — addition, omission, or signature change — requires a spec amendment before proceeding.
> Scope additions go in a new story.
