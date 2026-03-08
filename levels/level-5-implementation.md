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

## What to Look for in the Implementation

- [ ] Every method signature matches what was approved at Level 4 exactly
- [ ] No new methods, classes, or abstractions were added without discussion
- [ ] Error handling matches the paths agreed at Level 3
- [ ] Logging follows the skill from Layer 3
- [ ] Configuration is externalized as agreed in the story context
- [ ] Test coverage matches the contracts — if you generated tests at Level 4, the implementation passes them

## The Most Common Level 5 Problem

The AI adds features. Retry logic, caching, metrics endpoints, admin utilities. These arrive "looking clean and reasonable" — Garg's phrase — and are easy to accept without questioning whether they belong.

They don't belong. The scope was fixed at Level 1. Any addition that wasn't in the approved scope is technical debt injection. Remove it explicitly:

"Remove [addition]. It was not in the approved scope. If it's needed, it goes in a separate story."

## When to Reject and Restart

If the implementation deviates significantly from the agreed contracts, do not try to fix it in-place through corrections. Reject it and re-request:

"This implementation doesn't match the approved contracts. Specifically: [list deviations]. Regenerate against the approved Level 4 contracts."

One clean implementation is better than an iteratively-patched one.

## What Done Looks Like

Implementation is complete when:
1. All approved contracts are implemented
2. All agreed error paths are handled
3. Tests cover the agreed contracts
4. Code follows project conventions from Layers 1 and 2
5. Nothing was added that wasn't in the approved scope
