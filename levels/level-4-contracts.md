# Level 4 — Contracts

> **Question this level answers:** What are the interfaces?
> **Output:** Method signatures, types, DTOs, exception classes. No method bodies.
> **Approve when:** Every interface is correct, named to convention, and aligned with existing types in the project.

---

## What to Look for Before Approving

Before approving Level 4 and moving to Level 5, verify:

- [ ] Every method signature matches your project's naming convention (from Layer 2)
- [ ] Parameter types and return types are correct and specific — no `Object`, no `Map<String, Object>`
- [ ] New types (DTOs, records) don't duplicate existing ones
- [ ] Exception types are named and typed — not just `throws RuntimeException`
- [ ] No method bodies have appeared — signatures only
- [ ] If practicing TDD: you can write tests against these contracts before implementation begins

## The TDD Opportunity

Level 4 creates the preconditions for test-driven development as a side effect. Once you have agreed-upon method signatures and types, you have everything you need to ask the AI to write tests before any implementation.

Approved contracts → generate tests → implement against tests.

For teams that don't practice TDD, the contracts still serve as a concrete specification that makes misunderstandings visible before they become bugs.

## What to Push Back On

**Vague types:** `List<Object>`, `Map<String, String>`, `Object` as a parameter or return type. Every type should be specific to its domain.

**Missing exception contracts:** A method that calls an external service but declares no exception is incomplete. The exception type should be named at this level.

**Signature drift from conventions:** A method named `getAnswer` instead of `findAnswer`, or a DTO named `Response` instead of `QuestionAnswerResponse`. Correct before implementation.

**Overloaded contracts:** AI proposed five methods when the flow described in Level 3 only needed two. Extra methods are scope creep at the interface level.

## Template: Your Approval Message

```
Level 4 approved with changes.

Contracts confirmed:

[ServiceName]:
  [returnType] [methodName]([paramType] [param]) throws [ExceptionType]
  [returnType] [methodName]([paramType] [param])

[DtoName] (record/class):
  [fieldType] [fieldName]
  [fieldType] [fieldName]

[ExceptionName] extends [BaseException]

Changes from your proposal:
- Renamed [method] to [method] — convention alignment
- Changed [param] type from [X] to [Y] — [reason]
- Removed [method] — not in the agreed flow

Proceed to Level 5 — Implementation.
```
