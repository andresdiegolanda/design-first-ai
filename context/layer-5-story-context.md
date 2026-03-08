# Layer 5 — Story Context

> **What this is:** Task-specific context for the current story or feature. A new file for every task.
> **When to load it:** Every session. This is the only layer that changes every time.
> **How to fill it in:** Fill this out before opening the AI session. It takes 5–10 minutes and replaces 20 minutes of corrective back-and-forth.

---

## Story

**ID:** [JIRA-000 or equivalent]
**Title:** [story title]
**Type:** [new feature / bug fix / refactoring / test coverage / other]

## What Must Be Built

[2–5 sentences. The deliverable. Be specific about what done looks like.]

Example:
> A POST `/api/v1/questions/ask` endpoint that accepts a natural language question, retrieves the top 3 relevant documents from the vector store using cosine similarity, builds a prompt with those documents as context, and returns the chat model's answer as plain text.

## What Is Explicitly Out of Scope

[List anything the AI might reasonably assume is included but isn't.]

- [Example: No streaming response — synchronous only]
- [Example: No conversation history — stateless, single-turn only]
- [Example: No authentication — assume caller is trusted]

## Constraints

Technical or architectural constraints that apply to this task specifically.

- [Example: Must reuse the existing `VectorStoreConfig` bean — do not create a new one]
- [Example: Temperature must be configurable via `application.yml`, not hardcoded]
- [Example: Retrieved documents must be logged at DEBUG level before building the prompt]

## Decisions Already Made

Upstream decisions this task must respect. These are not open for discussion.

- [Example: We are using `pgvector` as the vector store — decided in architecture review]
- [Example: The model is `gpt-4o-mini` — cost decision, not negotiable]
- [Example: Similarity threshold is 0.7 — validated in spike]

## Open Questions

Things not yet decided that the design conversation should resolve.

- [Example: How many documents should we retrieve? 3 seems right but not validated]
- [Example: Should the answer include source references, or plain text only?]
- [Example: What is the correct error response when the vector store is unavailable?]

## Relevant Existing Code

Existing components this task interacts with or must align with.

| Component | Location | Relevance |
|-----------|----------|-----------|
| [ComponentName] | `[package.ClassName]` | [why it matters for this task] |

## Skills Needed

Which Layer 3 skills apply to this task.

- [ ] Error Handling
- [ ] Testing
- [ ] Logging
- [ ] Spring AI — RAG Pattern
- [ ] Configuration
