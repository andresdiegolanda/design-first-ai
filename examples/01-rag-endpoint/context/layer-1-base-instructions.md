# Layer 1 — Base Instructions (Demo App)

## Project Identity

- **Name:** design-first-demo
- **Purpose:** Minimal Spring AI service that answers natural language questions using retrieval-augmented generation
- **Type:** REST microservice
- **Status:** Demo project — exists to illustrate the Design-First methodology

## Architecture Overview

Stateless REST API. Accepts a question via POST, retrieves relevant documents from a PGVector store, builds a prompt with those documents as context, and returns a generated answer from an OpenAI chat model. No user sessions. No conversation history. Single-turn only.

## Tech Stack

| Component | Technology | Version |
|-----------|------------|---------|
| Language | Java | 21 |
| Framework | Spring Boot | 3.4.x |
| AI Library | Spring AI | 1.0.x |
| Vector Store | PGVector (PostgreSQL) | 16.x |
| Build Tool | Maven | 3.9.x |

## Non-Negotiables

- No business logic in controllers — controllers call services, services do the work
- All configurable values (model name, temperature, k, threshold) go in `application.yml`
- All public service methods must have Javadoc
- Exceptions must be named domain exceptions — no bare `RuntimeException`

## What This Project Is Not

- Not multi-tenant
- Not authenticated
- Not a streaming API
- Not responsible for document ingestion — assume documents are pre-loaded in the vector store

## Anti-Patterns

- No `@Value` for more than one related property — use `@ConfigurationProperties`
- No hardcoded prompts as Java strings — use `.st` template files in `resources/prompts/`
- No `Optional.get()` without guard
- No `System.out.println`
