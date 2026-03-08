# Layer 4 — Prompt Templates

> **What this is:** Standardized opening prompts for recurring task types. Load the relevant template when starting that type of task.
> **When to load it:** When your task matches one of the categories below.
> **How to use it:** Copy the template, fill in the `[BRACKETS]`, use as your opening message in the AI session.

---

## Template: New Feature — Full Design-First Flow

Use when: Building a new feature that spans multiple components.

```
I need to build [feature name].

Context is loaded:
- Project: [project name] — [one-line description]
- Stack: [key technologies]
- Constraints: [2–3 key constraints from Layer 1]

Before writing any code, walk me through the design at each level:

Level 1 — Capabilities: Confirm scope. The feature must [requirement 1], [requirement 2].
It must NOT [explicit exclusion 1], [explicit exclusion 2].

Level 2 — Components: Identify only the components needed. We already have [existing component 1]
and [existing component 2] — use them. Do not propose new abstractions unless there is no
alternative.

Level 3 — Interactions: Map the data flow. Entry point is [entry point].
Exit point is [exit point].

Level 4 — Contracts: Define method signatures, types, and DTOs. Use our naming conventions.
Align with existing types where they exist.

Present each level separately. Wait for my approval before moving to the next.
No code until I approve Level 4.
```

---

## Template: Single Component

Use when: Adding or modifying a single service, controller, or repository.

```
I need to [add / modify] [component name].

Context:
- This component [what it does]
- It belongs in [package/layer]
- It depends on [existing dependency 1], [existing dependency 2]
- Constraints: [any specific constraints]

Start at Level 4 — Contracts. Propose the method signatures and types.
Show me the interface before any implementation.
Wait for my approval before writing the implementation.
```

---

## Template: Test Coverage

Use when: Writing tests for an existing component.

```
I need tests for [component name].

The component:
[paste the actual code or the key method signatures]

Testing requirements:
- Layer: [unit / integration / both]
- Framework: [Mockito / MockMvc / other]
- Coverage needed: [happy path only / happy path + known error cases / full]

Known edge cases to cover:
- [case 1]
- [case 2]

Follow our testing skill (Layer 3). Use our naming convention: methodName_condition_expectedResult.
Do not test Spring wiring — only business behavior.
Generate the tests. Do not ask clarifying questions unless a case is genuinely ambiguous.
```

---

## Template: Bug Investigation

Use when: Diagnosing unexpected behavior.

```
I have unexpected behavior in [component name].

Observed: [what is happening]
Expected: [what should happen]
Conditions: [when does it happen — always / specific input / specific environment]

Relevant code:
[paste the code]

Relevant logs:
[paste the logs, or describe what you see]

Do not propose a fix yet. First, identify the most likely causes in order of probability.
For each cause, tell me what evidence would confirm or eliminate it.
Wait for me to investigate before proposing a solution.
```

---

## Template: Refactoring

Use when: Improving existing code without changing behavior.

```
I need to refactor [component name].

Current code:
[paste the code]

Problem: [what is wrong — duplication / complexity / violation of project conventions / other]

Constraints:
- Do not change the public interface
- Do not change behavior
- The refactored code must follow [specific convention from Layer 2]

Propose the refactored version. Explain what you changed and why.
Do not change anything that is not related to the stated problem.
```
