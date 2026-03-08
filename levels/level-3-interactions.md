# Level 3 — Interactions

> **Question this level answers:** How do the components communicate?
> **Output:** Data flow diagram in text — entry point, sequence of calls, exit point. No signatures yet.
> **Approve when:** The data flow is correct, direct, and matches how your existing infrastructure actually works.

---

## What to Look for Before Approving

Before approving Level 3 and moving to Level 4, verify:

- [ ] The flow starts at the correct entry point (matches your architecture — controller, message listener, scheduler, etc.)
- [ ] Every component from Level 2 appears in the flow
- [ ] No component appears that wasn't in Level 2
- [ ] The flow is direct — no unnecessary hops between components
- [ ] The error paths are described, not just the happy path
- [ ] No method signatures have appeared yet — this is flow only

## What to Look for in Error Paths

A data flow without error paths is incomplete. For every external call in the flow (database, AI model, vector store, external API), there should be a stated error path:

- What happens when the vector store is unavailable?
- What happens when the model returns an error?
- What happens when the result is empty (not an error, but an edge case)?

If the AI described only the happy path, say: "Add the error paths for each external call."

## What to Push Back On

**Indirect flow:** The data passes through a component that adds no transformation. Remove the intermediary. Direct is better.

**Missing error paths:** Accepting a flow without error paths means discovering them at Level 5 inside the implementation. That's the implementation trap at a smaller scale.

**Assumptions about infrastructure:** The AI described the flow as if it knows how your VectorStore, MessageQueue, or external API works. Correct any assumption that doesn't match your actual infrastructure.

## Template: Your Approval Message

```
Level 3 approved.

Flow confirmed:
1. [Entry point] receives [input]
2. [Component A] calls [Component B] with [data]
3. [Component B] retrieves [data] from [infrastructure]
4. [Component A] builds [output] from [data]
5. Returns [output] to [caller]

Error paths confirmed:
- [Component B] unavailable → [how it fails]
- [Infrastructure] returns empty → [how it's handled]

Proceed to Level 4 — Contracts.
```
