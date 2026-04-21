# Layer 4 — Prompt Templates

> **What this is:** Standardized opening prompts for recurring task types. Each template
> drives toward building an implementation guide before any code is written.
> **When to load it:** When your task matches one of the categories below.
> **How to use it:** Copy the template, fill in the `[BRACKETS]`, use as your opening message.

---

## Template: New Feature — Full Design-First Flow

Use when: Building a new feature that spans multiple components.

```
I need to build [feature name].

Context:
- Project: [project name] — [one-line description]
- Stack: [key technologies]
- App description: docs/app-description.md

Build an implementation guide for this story. Save it as docs/[STORY-ID]-impl-guide.md.
The guide must be usable as a prompt input and understandable by a human.

Scope:
The feature must [requirement 1], [requirement 2].
It must NOT [explicit exclusion 1], [explicit exclusion 2].

Components:
We already have [existing component 1] and [existing component 2] — use them.
Do not propose new abstractions unless there is no alternative.

Include:
- Scope section with explicit exclusions
- Components with single-line purposes
- Interactions with error paths for every external call
- Contracts: method signatures, types, DTOs — no implementation

Iterate until every section is correct and clear.
Wait for my approval before executing.
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

Build an implementation guide for this change. Save it as docs/[STORY-ID]-impl-guide.md.

Include:
- Scope: what changes and what explicitly does not
- Contracts: method signatures, types — no method bodies
- Error paths if any external calls are involved

Wait for my approval before executing.
```

---

## Template: Test Coverage

Use when: Writing tests for an existing component.

```
I need tests for [component name].

The component:
[paste the key method signatures or code]

Testing requirements:
- Framework: [Mockito / MockMvc / jasmine / other]
- Scenarios to cover:
  - [scenario 1 — e.g. happy path]
  - [scenario 2 — e.g. not-found case]
  - [scenario 3 — e.g. validation failure]

Follow the testing skill in context/skills/testing/SKILL.md.
Use the naming convention: method_condition_expectedResult.
Do not test framework wiring — only business behavior.
Generate the tests. Run them when done and report results.
```

---

## Template: Bug Investigation

Use when: Diagnosing unexpected behavior.

```
I have unexpected behavior in [component name].

Observed: [what is happening]
Expected: [what should happen]
Conditions: [always / specific input / specific environment]

Relevant code:
[paste the code]

Relevant logs:
[paste the logs, or describe what you see]

Do not propose a fix yet. Identify the most likely causes in order of probability.
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

Problem: [what is wrong — duplication / complexity / convention violation / other]

Constraints:
- Do not change the public interface
- Do not change behavior
- Follow [specific convention from Layer 1 or Layer 2]

Build an implementation guide for this refactor. Include:
- Scope: what changes and what must not change
- Contracts: the unchanged public signatures, confirmed
- The specific structural changes proposed

Wait for my approval before making any changes.
```

---

## Template: Address PR Review Comments

Use when: A PR has received review comments and you need to triage and respond.

```
Read pr[XXX]-diff-[NN].md and pr[XXX]-comments-[NN].md.

Use the /code-review skill.

For each review comment: classify as fix, clarify, or discuss.
- Fix: the reviewer is right — give me the corrected code.
- Clarify: the code is correct — write a reply with evidence from the diff.
- Discuss: it is a design question — give me options with trade-offs.

Apply fixes to the codebase. Do not commit.

Write a document pr[XXX]-comments-[NN]-response.md containing:
- Each comment and its classification
- What was changed and why (for fixes)
- Suggested reply text (for clarifications and discussions)
- A commit message summarising all changes
```

**File preparation:** Before running this prompt, copy two files from GitHub:
- `pr[XXX]-diff-[NN].md` — paste from the "Files changed" tab
- `pr[XXX]-comments-[NN].md` — paste from the "Conversation" tab

Where `XXX` is the PR number and `NN` is the review round (01, 02, ...).

**Output:** Code changes in the working tree (not committed) + `pr[XXX]-comments-[NN]-response.md`.
Review both before staging. See `context/skills/code-review/SKILL.md` for full details
including next-round file naming.
