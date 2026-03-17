# Layer 5 — Story Context (Example: RAG Endpoint)

## Story

**ID:** DEMO-001
**Title:** Implement `/ask` endpoint with RAG
**Type:** New feature

## What Must Be Built

A POST `/api/v1/questions/ask` endpoint that accepts a JSON body with a `question` field, retrieves the top 3 documents from the vector store with a similarity score above 0.7, builds a prompt using those documents as context, and returns the model's answer as a JSON body with an `answer` field.

## What Is Explicitly Out of Scope

- No streaming response
- No conversation history — single-turn only
- No source references in the answer
- No document ingestion — assume documents are already in the vector store

## Constraints

- Temperature must be 0.3 — configured in `application.yml`, not hardcoded
- Retrieved documents must be logged at DEBUG level before building the prompt
- The endpoint must return HTTP 200 for a successful answer, HTTP 503 if the vector store or model is unavailable

## Decisions Already Made

- Vector store: PGVector via Spring AI's `VectorStore` interface
- Model: `gpt-4o-mini` — cost decision, not negotiable
- Similarity threshold: 0.7 — validated in prior spike
- k: 3 — validated in prior spike

## Open Questions

- Should the endpoint return HTTP 404 when no documents are found, or return a "no information available" answer from the model?

## Skills Needed

- [x] Error Handling
- [x] Logging
- [x] Spring AI — RAG Pattern
- [x] Configuration
