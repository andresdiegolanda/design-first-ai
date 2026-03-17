# design-first-demo

Minimal Spring AI service. Exists solely as the baseline for the 01-rag-endpoint example in this repo.
Pre-configured for **VS Code + GitHub Copilot**. Default Copilot model: Claude Sonnet 4.6.

This app lives at `examples/01-rag-endpoint/app/`. The design conversation that produced it
is at `examples/01-rag-endpoint/conversation/design-conversation.md`.

---

## What It Is

One REST endpoint. One `ChatClient` call. One `VectorStore` query.

**Endpoint:** `POST /api/v1/questions/ask`

```json
// Request
{ "question": "What is retrieval-augmented generation?" }

// Response — documents found
{ "answer": "Retrieval-augmented generation is..." }

// Response — no documents above similarity threshold
{ "answer": "No information available for this question." }

// Response — downstream unavailable
{ "code": "VECTOR_STORE_UNAVAILABLE", "message": "..." }  // HTTP 503
```

---

## Stack

| Component | Technology | Version |
|-----------|------------|---------|
| Language | Java | 21 |
| Framework | Spring Boot | 3.4.3 |
| AI library | Spring AI | 1.0.0 |
| Vector store | PGVector (PostgreSQL 16) | via Docker |
| Build | Maven | 3.9.x |
| IDE | VS Code | 1.90+ |
| AI assistant | GitHub Copilot | — |

---

## Prerequisites

- Java 21
- Maven 3.9+ (installed globally, or add the wrapper — see below)
- Docker
- VS Code 1.90+
- GitHub Copilot subscription

---

## Setup

### 1. Open in VS Code

Open the `app` folder directly in VS Code — not the repo root and not the example folder:

```bash
git clone https://github.com/[your-username]/design-first-ai
cd design-first-ai/examples/01-rag-endpoint/app
code .
```

VS Code will prompt you to install recommended extensions (`.vscode/extensions.json`).
Install them: GitHub Copilot, GitHub Copilot Chat, Java Extension Pack, Spring Boot Extension Pack.

### 2. Verify Copilot model

The workspace is pre-configured in `.vscode/settings.json`:

```json
{
  "github.copilot.chat.defaultModel": "claude-sonnet-4-5",
  "github.copilot.chat.codeGeneration.useInstructionFiles": true
}
```

Open Copilot Chat (`Ctrl+Alt+I` / `Cmd+Alt+I`) and check the model selector at the bottom of the panel shows a Claude Sonnet variant. If `claude-sonnet-4-5` is unavailable in your plan, open the model picker and select the most recent Claude Sonnet or Opus listed, then update `settings.json` with the correct identifier.

The Copilot instructions file (`.github/copilot-instructions.md`) is auto-loaded. It contains Layers 1 and 2 of the Design-First framework already configured for this project — no action required.

### 3. Start PGVector

```bash
docker compose up -d
```

Spring AI initializes the vector store schema automatically on first run (`initialize-schema: true` in `application.yml`).

### 4. Set your OpenAI API key

```bash
export SPRING_AI_OPENAI_API_KEY=your-key-here
```

Or create `src/main/resources/application-local.yml` (gitignored):
```yaml
spring:
  ai:
    openai:
      api-key: your-key-here
```

### 5. Run

If Maven is installed globally:
```bash
mvn spring-boot:run
mvn spring-boot:run -Dspring-boot.run.profiles=local  # with local profile
```

If you want the Maven wrapper (so `./mvnw` works):
```bash
mvn wrapper:wrapper
./mvnw spring-boot:run
```

### 6. Load documents (optional for testing)

The app has no ingestion endpoint. Add a temporary `CommandLineRunner` to load test data:

```java
@Bean
CommandLineRunner loadDocuments(VectorStore vectorStore) {
    return args -> vectorStore.add(List.of(
        new Document("Spring AI is a framework for building AI-powered Java applications."),
        new Document("Retrieval-augmented generation combines vector search with language models.")
    ));
}
```

Remove after loading. Documents persist in PGVector between restarts.

### 7. Test the endpoint

```bash
curl -X POST http://localhost:8080/api/v1/questions/ask \
  -H "Content-Type: application/json" \
  -d '{"question": "What is Spring AI?"}'
```

---

## Using Copilot with This Project

### The flow

1. Copilot Chat opens → `.github/copilot-instructions.md` auto-loaded (Layers 1 and 2)
2. Load Layer 3 skills: `#file:context/layer-3-skills.md`
3. Load Layer 5 story context: write a new `layer-5-story-context.md` or paste inline
4. Use a template from `context/layer-4-prompt-templates.md` as your opening message
5. Work through Levels 1–4 before any code is generated
6. Level 5: Copilot generates against the approved contracts

### Inline suggestions and the implementation trap

Inline suggestions (`Tab` to accept) fire as you type — before any design conversation.
During Levels 1–4, keep your cursor in a comment block or a markdown note, not in a `.java` file.
Only accept inline suggestions after Level 4 contracts are approved.

### Choosing a model

**Claude Sonnet 4.6** (default): faster responses, lower cost per token. Suitable for iterative level conversations, generating service and controller code, writing tests.

**Claude Opus 4.6**: stronger reasoning on complex architectural problems. Consider switching at Levels 2–3 for large multi-component features. Switch via the model picker in Copilot Chat.

---

## Running Tests

```bash
mvn test
```

11 tests, no external dependencies required. Service tests use Mockito. Controller tests use `@WebMvcTest`.

---

## Project Structure

```
.github/
└── copilot-instructions.md     ← Layers 1+2: auto-loaded by Copilot
.vscode/
├── settings.json               ← Model config + Copilot settings
└── extensions.json             ← Recommended extensions
context/
├── layer-0-architecture.md     ← Layer 0 output: architecture + design constraints
├── layer-0-design-principles.md ← Layer 0 output: conventions + anti-patterns
├── layer-1-base-instructions.md ← Layer 1: project identity + non-negotiables
├── layer-3-skills.md           ← Layer 3: error handling, testing, logging, RAG, config
├── layer-4-prompt-templates.md ← Layer 4: task prompt templates
└── layer-5-story-context.md    ← Layer 5: story context (template — write new per task)
src/
├── main/java/com/example/designfirstdemo/
│   ├── controller/QuestionController.java
│   ├── service/QuestionService.java
│   ├── dto/                    AskRequest, AskResponse, ErrorResponse
│   ├── exception/              DemoAppException, VectorStoreException,
│   │                           ModelException, GlobalExceptionHandler
│   └── config/RagProperties.java
└── main/resources/
    ├── application.yml
    └── prompts/question.st
```

---

## Key Configuration

```yaml
app:
  rag:
    k: 3                       # documents to retrieve (validated: 1–20)
    similarity-threshold: 0.7  # minimum cosine similarity (validated: 0.0–1.0)

spring:
  ai:
    openai:
      chat:
        options:
          model: gpt-4o-mini
          temperature: 0.3
          max-tokens: 500
```

All values are configurable via environment variables or profile yml files. None are hardcoded.

---

## This App Was Designed Using the Methodology

See `../conversation/design-conversation.md` for the complete Design-First conversation:
the context layers loaded, the full exchange at each level, and two corrections
caught before any code was written.
