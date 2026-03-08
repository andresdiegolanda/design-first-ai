# Level 2 — Components

> **Question this level answers:** What are the building blocks?
> **Output:** A list of components with a one-line purpose each. No code.
> **Approve when:** The component list fits your architecture, uses existing infrastructure, and introduces no unnecessary abstractions.

---

## What to Look for Before Approving

Before approving Level 2 and moving to Level 3, verify:

- [ ] Every proposed component has a clear, single purpose
- [ ] Existing components are being reused, not duplicated
- [ ] No new abstraction exists just to wrap something that already works
- [ ] Component names follow your project's naming conventions (from Layer 2)
- [ ] No method signatures or code have appeared — this is structure only

## What to Push Back On

**Unnecessary abstractions:** The most common Level 2 mistake. AI introduces wrapper classes, adapter layers, and facade objects that add indirection without value. Garg's example: a `RetryQueue` wrapping BullMQ when BullMQ already handles retries natively.

For every new abstraction proposed, ask: "What does this component do that the underlying dependency doesn't already do?" If the answer is "nothing," remove it.

**Too many components:** A feature that spans one service method and one controller endpoint does not need five components. Push back with the scope from Level 1.

**Missing components:** AI proposed components for the new code but forgot existing infrastructure. Example: proposing a new `ModelConfig` class when `ChatClientConfig` already exists in the project.

## Template: Your Approval Message

```
Level 2 approved with changes.

Component list:
- [ComponentName] — [one-line purpose]
- [ComponentName] — [one-line purpose]

Changes from your proposal:
- Removed [component] — [reason: wraps X which already handles this / out of scope / already exists as Y]
- Renamed [component] to [name] — [reason: aligns with naming convention]

Proceed to Level 3 — Interactions.
```
