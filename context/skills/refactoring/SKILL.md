---
name: refactoring
description: Team standard for improving existing code without changing behaviour. Use when refactoring code.
---

# Skill: Refactoring

> **When to load it:** When improving existing code without changing observable behaviour.

---

## What This Skill Does

Applies the team's refactoring philosophy to a specific piece of code. Proposes
improvements that reduce complexity, remove duplication, and align with project
conventions — without changing the public interface or adding unrequested behaviour.
Output is a proposed change with explanation of what each transformation does and why.

---

## Rules

1. Preserve the public contract. Method signatures, return types, and exception types
   visible to callers must not change unless the refactoring scope explicitly includes them.
2. Propose incremental changes. One transformation per pass — extract, rename, simplify,
   or inline. Not all at once.
3. Identify the specific problem first. State what is wrong (duplication, premature
   abstraction, unclear naming, violation of a project convention) before proposing a fix.
4. Stop at the boundary of the stated problem. Do not refactor code adjacent to the
   target unless it is required to complete the transformation safely.
5. Validate test coverage before changing. If the code under refactoring has no tests,
   say so before proposing structural changes.

---

## Pattern

Opening prompt structure:

```
I need to refactor [ComponentName / method / file].

Problem: [what is wrong — duplication / complexity / convention violation / other]

Constraints:
- Do not change the public interface
- Do not change observable behaviour
- Follow [specific convention from Layer 1 or Layer 2]

Current code:
[paste the code]

Propose the refactored version. Explain each transformation.
Do not change anything not related to the stated problem.
```

Response structure the skill produces:

```
Problem identified: [one sentence]

Transformations:
1. [transformation name] — [what changed and why]
2. [transformation name] — [what changed and why]

Refactored code:
[code]

Public interface unchanged: [confirm or flag deviations]
Tests required: [list any new tests needed to verify the transformation]
```

---

## Design Constraints

- Do not propose changes that alter observable behaviour without flagging them explicitly
- Do not refactor code that has no test coverage without stating this upfront
- Do not combine multiple independent transformations in a single pass
- Do not add new functionality during refactoring — that belongs in a separate story
- Do not apply this skill to generated code mid-execution — refactoring and generation
  are separate phases
