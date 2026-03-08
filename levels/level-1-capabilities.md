# Level 1 — Capabilities

> **Question this level answers:** What does this feature need to do?
> **Output:** Confirmed scope — requirements and explicit exclusions.
> **Approve when:** You and the AI agree on what is in and what is out, with no ambiguity.

---

## What to Look for Before Approving

Before approving Level 1 and moving to Level 2, verify:

- [ ] Every requirement you stated is reflected in the AI's scope summary
- [ ] The explicit exclusions are listed — not just implied
- [ ] No implementation detail has crept in (no mention of class names, method names, or technology choices)
- [ ] The scope matches the story — not larger, not smaller

## What to Push Back On

**Scope too large:** AI added capabilities you didn't ask for. Common additions to watch for:
- Caching ("for better performance")
- Analytics hooks ("to track usage")
- Admin endpoints ("for operational visibility")
- Rate limiting ("for production readiness")

If it's not in the story, it doesn't go in the scope. Say: "Remove [addition]. That is out of scope for this story."

**Scope too vague:** AI confirmed requirements that are still ambiguous. Push for specificity.
"The feature retrieves relevant documents" is not enough. "The feature retrieves the top K documents with similarity above threshold T" is.

**Implementation leaked:** AI mentioned a class, framework, or approach. That belongs at Level 2 or later. Say: "That's an implementation detail. Keep this level focused on what the feature does, not how."

## Template: Your Approval Message

```
Level 1 approved.

Confirmed scope:
- [requirement 1 — rephrased in your words to verify mutual understanding]
- [requirement 2]
- [exclusion 1]
- [exclusion 2]

[Any correction or clarification before proceeding]

Proceed to Level 2 — Components.
```
