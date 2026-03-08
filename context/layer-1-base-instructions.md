# Layer 1 — Base Instructions

> **What this is:** Project-level rules that apply to every session, every task, every file.
> **Where it lives:** Auto-loaded by your AI tool on every session.
> **How to fill it in:** Replace every `[BRACKET]` placeholder. Keep it under one page.

---

## Project Identity

- **Name:** [project or application name]
- **Purpose:** [one sentence — what does this application do?]
- **Type:** [microservice / monolith / library / CLI / other]
- **Team size:** [number of developers]
- **Status:** [greenfield / active development / maintenance]

## Architecture Overview

[2–4 sentences. What are the major components? How do they interact? What does this service own vs. delegate?]

Example:
> REST API that accepts natural language questions, retrieves relevant context from a vector store, and returns AI-generated answers via a chat model. Stateless. No user sessions. Delegates model calls to Spring AI, delegates vector storage to PGVector.

## Tech Stack

| Component | Technology | Version |
|-----------|------------|---------|
| Language | [Java / Kotlin / other] | [version] |
| Framework | [Spring Boot / Quarkus / other] | [version] |
| AI library | [Spring AI / LangChain4j / other] | [version] |
| Database | [PostgreSQL / MySQL / other] | [version] |
| Build tool | [Maven / Gradle] | [version] |
| Java version | [21 / 17 / other] | [version] |

## Non-Negotiables

Rules that apply without exception. The AI must not propose alternatives to these.

- [Example: All public methods must have Javadoc]
- [Example: No business logic in controllers — controllers delegate to services]
- [Example: All exceptions must be handled at the service layer and translated to domain exceptions]
- [Example: No `var` keyword — explicit types always]

## What This Project Is Not

Explicit exclusions prevent scope creep in AI suggestions.

- [Example: This is not a multi-tenant application — no tenantId anywhere]
- [Example: This is not responsible for authentication — assume caller is authenticated]
- [Example: This is not a streaming API — no SSE or WebSocket]

## Anti-Patterns

Tell the AI what to avoid. These are patterns it will default to from training data.

- [Example: No class-based configuration — use `@Bean` methods in `@Configuration` classes]
- [Example: No `ResponseEntity` wrapping in service layer — only in controllers]
- [Example: No `Optional.get()` without `isPresent()` check]
- [Example: No hardcoded strings — constants in a dedicated `Constants` class]
