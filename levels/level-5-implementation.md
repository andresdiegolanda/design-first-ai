# Level 5 — Implementation

> **Question this level answers:** Now write the code.
> **Output:** Complete implementation against the agreed design.
> **This level is reached only after Level 4 is approved.**

---

## What Changes at Level 5

Every level before this one was about alignment. Level 5 is about execution. The difference in what you're reviewing is fundamental:

Before Level 5: You are evaluating design decisions. One dimension at a time.
At Level 5: You are reviewing implementation quality against an agreed design.

This is still a review — but it is no longer a design conversation. The scope is fixed (Level 1). The components are fixed (Level 2). The flow is fixed (Level 3). The interfaces are fixed (Level 4). What remains is whether the implementation correctly executes what was agreed.

---

## Pass 1 — Spec Compliance

Ask this before evaluating code quality. These are binary checks — the implementation either matches the agreed design or it doesn't.

- [ ] Every method signature matches what was approved at Level 4 exactly — name, parameters, return type
- [ ] No new methods, classes, or abstractions were added without prior discussion
- [ ] Error handling covers exactly the paths agreed at Level 3 — no more, no fewer
- [ ] Empty/null/edge cases are handled as agreed — not guessed at
- [ ] Nothing in the approved scope is missing

**If any check fails:** Stop. Do not proceed to code quality review. State the specific deviation and request a targeted fix:

> "This implementation doesn't match the approved contracts. Specifically: [list deviations]. Fix these before I review code quality."

One clean implementation is better than an iteratively-patched one. Reject and re-request if deviations are structural.

---

## Pass 2 — Code Quality

Run this only after Pass 1 is clean. These check whether the implementation meets the project's quality bar from Layers 1 and 2.

- [ ] Logging follows the pattern from Layer 3 — correct levels, correct format, no PII
- [ ] Configuration is externalized as agreed — no hardcoded values
- [ ] Test coverage matches the contracts — each agreed contract has at least one test
- [ ] Code follows naming conventions from Layer 2
- [ ] No defensive additions that weren't in scope — retry logic, caching, metrics, admin endpoints

**The most common failure here:** The AI adds features. Retry logic, caching, metrics endpoints, admin utilities. These arrive looking clean and reasonable — Garg's phrase — and are easy to accept without questioning whether they belong.

They don't belong. The scope was fixed at Level 1. Any addition not in the approved scope is technical debt injection. Remove it explicitly:

> "Remove [addition]. It was not in the approved scope. If it's needed, it goes in a separate story."

---

## What Done Looks Like

Implementation is complete when both passes are clean:

1. All approved contracts are implemented — nothing missing, nothing added
2. All agreed error paths are handled — exactly as specified at Level 3
3. Tests cover the agreed contracts
4. Code follows project conventions from Layers 1 and 2
5. Scope is exactly what was approved at Level 1 — no more, no less
