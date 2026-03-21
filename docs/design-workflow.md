# Design Workflow — Implementation Guide + Agent Execution

> **Scope:** How to design and build a feature using Copilot in agent mode.
> This document describes the three-step workflow, how to iterate on the design,
> and what quality bar each section of the implementation guide must meet.

---

## The Core Principle

Design before code. The implementation guide is the whiteboard — the place where scope,
components, interactions, and contracts are agreed before the agent writes a single line.

This is Rahul Garg's Design-First Collaboration principle, implemented through documents
rather than through a sequential conversation protocol. The output is the same. The
mechanism is different: you build a document iteratively until it's right, then hand it
to the agent for execution.

---

## The Three Steps

```
STEP 1 — Application description
  Input:   The codebase (workspace files)
  Ask:     "Build an md explaining this application."
  Output:  docs/app-description.md
  Purpose: Establishes shared vocabulary before any story work begins.
           The agent reads this in every subsequent step.
           You read it to verify the agent understood correctly.
           Write it once. Update it when the architecture changes significantly.

STEP 2 — Implementation guide
  Input:   The story + docs/app-description.md
  Ask:     "Given the application description in docs/app-description.md and
            this story [paste story], build an implementation guide. The guide
            must be usable as a prompt input and understandable by a human."
  Output:  docs/impl-guide.md
  Purpose: The design document. Contains scope, components, interactions,
           contracts, and constraints. Review it. Iterate until every section
           is correct and clear. This is the authoritative input to Step 3.

STEP 3 — Execution
  Input:   docs/impl-guide.md
  Ask:     "Execute the implementation guide in docs/impl-guide.md. Run the
            tests to verify everything works. Then create a new document
            explaining what you did, any differences from the guide, how to
            run the app, how to run the tests, how to test manually, and
            include a compliant git commit message."
  Output:  Code in the expected locations + docs/execution-report.md
  Purpose: The agent implements against the guide. The execution report is the
           permanent record of what was built, how it deviates from the plan
           (if it does), and everything needed to operate and verify the result.
```

---

## Step 2 Is Iterative

The implementation guide is not produced in a single pass. Expect two or three iterations.

After the first draft, read every section. For anything that is unclear, technically wrong,
or that you would not be able to explain to a colleague, ask for a rewrite:

> "In impl-guide.md, the components section proposes a [X] — this is unnecessary
> abstraction. Remove it and describe how [Y] handles this directly."

> "The interactions section does not describe what happens when [external call] fails.
> Add the error paths."

Iterate until the guide is correct. Only then proceed to Step 3.

The discipline: **do not execute an implementation guide you could not explain yourself.**
If a section is unclear, the agent will make assumptions. Those assumptions become code.

---

## What a Good Implementation Guide Contains

Garg's Design-First model identifies five dimensions of design, each representing a
different category of decision. A rigorous implementation guide covers all five.

Use these as a review checklist when reading your impl-guide drafts.

### 1 — Scope

What the feature must do, and what it must not do.

**What to check:**
- Every requirement from the story is present
- Explicit exclusions are listed — not implied
- No implementation detail has crept in at this section (no class names, no API paths)
- The scope matches the story — not larger, not smaller

**Common problem:** The agent added capabilities you didn't ask for — caching, analytics
hooks, admin endpoints, rate limiting. If it is not in the story, it does not go in scope.

---

### 2 — Components

The building blocks and their single-line purpose each.

**What to check:**
- Every component has a clear, single responsibility
- Existing components are reused, not duplicated
- No new abstraction wraps something that already works

**Common problem:** Unnecessary abstractions. For every new component proposed, ask:
"What does this do that the underlying dependency doesn't already do?" If the answer
is nothing — remove it.

---

### 3 — Interactions

How the components communicate: data flow, API calls, events, error paths.

**What to check:**
- The flow starts at the correct entry point
- Every component from section 2 appears in the flow
- The flow is direct — no unnecessary hops
- **Error paths are described for every external call**

**Common problem:** Missing error paths. A flow that only describes the happy path
is incomplete. For every external call — database, model, external API — the impl-guide
must state what happens when it fails. If the agent omitted them, ask explicitly:
"Add the error paths for each external call."

---

### 4 — Contracts

Method signatures, types, DTOs, exception classes.

**What to check:**
- Every type is specific — no `Object`, no `Map<String, Object>`
- Exception types are named — not just `throws RuntimeException`
- Signatures follow the project's naming conventions (from Layer 2)
- No method bodies have appeared — signatures only

**Common problem:** Vague types. `List<Object>` or `Map<String, String>` where domain
types should exist. Correct before executing.

---

### 5 — No unrequested additions at execution

This applies to Step 3, not the guide itself. When the agent executes, it may add
features the guide didn't specify — retry logic, caching, metrics endpoints.

Check the execution report against the impl-guide. Anything added that wasn't in scope
goes in a separate story.

---

## The Execution Report

The execution report (`docs/execution-report.md`) is the permanent record of what was
built. It must contain:

- What was implemented and where
- Any deviations from the implementation guide and why
- How to run the application
- How to run the tests
- How to test manually
- A compliant git commit message

This document, together with `docs/impl-guide.md` and `docs/app-description.md`, gives
any engineer — or any future agent session — everything needed to understand, operate,
and continue the work without asking anyone.

---

## This Is Context Anchoring

Garg's third pattern — Context Anchoring — describes exactly this: after the design
conversation, capture the decisions in a living document that serves as external memory
across sessions.

> *"The feature document is a living ADR — one that evolves in real-time as decisions
> are made. When the feature ships, significant decisions graduate to formal ADRs."*

The `impl-guide.md` is the feature document. The `execution-report.md` is the ADR in
progress. Together they make the design durable — not dependent on conversation history,
not dependent on the engineer who built it, not dependent on memory.

This is what deletability looks like at the feature level.

---

## Connection to the Layer Structure

The app description and implementation guide connect directly to the context layer
architecture:

| Layer / Level | Document-driven equivalent |
|---------------|---------------------------|
| Layer 0 — codebase analysis | `docs/app-description.md` |
| Layers 1–2 — project conventions | `.github/copilot-instructions.md` (auto-loaded) |
| Garg's design levels 1–4 | Sections of `docs/impl-guide.md` |
| Level 5 — implementation | Agent executes `docs/impl-guide.md` |
| Context Anchoring | `docs/execution-report.md` |

The context layers prime the agent with project knowledge. The implementation guide
provides the task-specific design. The agent executes against both.
