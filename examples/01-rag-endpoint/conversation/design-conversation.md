# Design Conversation — RAG Endpoint (DEMO-001)

This is a complete example of the Design-First conversation for the `/ask` RAG endpoint. It shows the full exchange: what was asked at each level, what the AI proposed, and what was approved or corrected.

Context loaded before this conversation:
- `layer-1-base-instructions.md` (this example's version)
- `layer-2-file-patterns.md` (project templates)
- `layer-3-skills.md` (RAG Pattern + Error Handling + Logging skills)
- `layer-5-story-context.md` (this story)

---

## Opening Message (Master Prompt)

```
I need to build the /ask RAG endpoint (DEMO-001).

Before writing any code, walk me through the design one level at a time:

Level 1 — Capabilities
What this must do:
- Accept POST /api/v1/questions/ask with { "question": "..." }
- Retrieve top 3 documents from vector store, similarity > 0.7
- Build prompt with retrieved documents as context
- Return { "answer": "..." }

What this must NOT do:
- No streaming
- No conversation history
- No source references in answer
- No document ingestion

Present only confirmed scope. Wait for my approval.

Level 2 — Components
Existing: VectorStore bean (Spring AI), ChatClient bean (Spring AI)
Constraint: Do not introduce new abstractions unless strictly necessary.
Present only component list with one-line purpose each. No code. Wait for my approval.

Level 3 — Interactions
Entry: POST /api/v1/questions/ask
Exit: JSON answer
Present only data flow. No signatures. Wait for my approval.

Level 4 — Contracts
Present method signatures, types, DTOs. No implementation. Wait for my approval.

Level 5 — Implementation
Only after Level 4 approval.
```

---

## Level 1 — Capabilities

**AI proposed:**
> Scope: Accept a natural language question, retrieve relevant documents, generate a contextual answer.
> In scope: POST endpoint, vector similarity search, prompt construction, answer generation.
> Out of scope: Streaming, history, source attribution, ingestion.

**Human approved:**
> Level 1 approved. Confirmed: single-turn RAG, returns plain answer, no history, no ingestion.
> One open question to resolve at Level 2: what handles the case where no documents are found?
> Proceed to Level 2.

---

## Level 2 — Components

**AI proposed:**
> 1. `QuestionController` — handles HTTP, delegates to service
> 2. `QuestionService` — orchestrates RAG flow
> 3. `PromptBuilder` — constructs prompt from documents (new component)
> 4. `VectorStore` — existing Spring AI bean
> 5. `ChatClient` — existing Spring AI bean

**Human pushed back:**
> Remove `PromptBuilder`. Prompt construction is a single method in `QuestionService` backed by a `.st` template file. It does not justify its own component.

**AI revised:**
> 1. `QuestionController` — handles HTTP, delegates to service
> 2. `QuestionService` — orchestrates RAG flow, builds prompt internally using template
> 3. `VectorStore` — existing Spring AI bean
> 4. `ChatClient` — existing Spring AI bean

**Human approved:**
> Level 2 approved. Four components. PromptBuilder removed.
> Resolving the open question here: if no documents are found above threshold, QuestionService returns a standard "no information available" answer — does not call the model. HTTP 200.
> Proceed to Level 3.

---

## Level 3 — Interactions

**AI proposed:**
```
1. POST /api/v1/questions/ask → QuestionController receives AskRequest
2. QuestionController → QuestionService.findAnswer(question)
3. QuestionService → VectorStore.similaritySearch(question, k=3, threshold=0.7)
4. VectorStore returns List<Document>
5. If empty → QuestionService returns "No information available"
6. If documents found → QuestionService builds prompt from template + documents
7. QuestionService → ChatClient.call(prompt)
8. ChatClient returns answer string
9. QuestionService returns AskResponse(answer)
10. QuestionController returns HTTP 200 with AskResponse

Error paths:
- VectorStore unavailable → QuestionService throws VectorStoreException → HTTP 503
- ChatClient unavailable → QuestionService throws ModelException → HTTP 503
```

**Human approved:**
> Level 3 approved. Flow is correct. Error paths are correct.
> Confirming: empty result → "No information available" as answer string, not an exception. HTTP 200.
> Proceed to Level 4.

---

## Level 4 — Contracts

**AI proposed:**
```java
// Controller
@RestController
@RequestMapping("/api/v1/questions")
class QuestionController {
    ResponseEntity<AskResponse> ask(@Valid @RequestBody AskRequest request)
}

// Service
interface QuestionService {
    AskResponse findAnswer(String question)
}

// DTOs
record AskRequest(@NotBlank String question) {}
record AskResponse(String answer) {}

// Exceptions
class VectorStoreException extends DemoAppException {}
class ModelException extends DemoAppException {}
class DemoAppException extends RuntimeException {
    DemoAppException(String message, Throwable cause)
}
```

**Human approved with one change:**
> Level 4 approved. One change: QuestionService is a class annotated @Service, not an interface. This project does not use service interfaces — see Layer 1 non-negotiables.
> Proceed to Level 5.

---

## What This Conversation Demonstrates

**Unnecessary abstraction caught at Level 2.** `PromptBuilder` would have been a class, a test file, and an injection point — all for three lines of code that belong in the service. Removed in 10 seconds before any code existed.

**Open question resolved at the right level.** The empty-result behavior was an open question in Layer 5. It was resolved at Level 2 during component discussion — before the flow was drawn — which meant Level 3 reflected the decision correctly without revision.

**Convention violation caught at Level 4.** Service interface vs. service class is a 30-second correction at Level 4. It would have been a refactor request after 80 lines of generated code at Level 5.

**Total conversation before implementation:** approximately 15 minutes. Total corrections required in the generated code: zero structural changes.
