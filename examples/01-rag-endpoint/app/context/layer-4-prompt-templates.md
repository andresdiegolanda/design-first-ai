# Layer 4 — Prompt Templates (design-first-demo)

> **What this is:** Standardized opening prompts for recurring task types in this project.
> **When to load it:** When your task matches one of the categories below.
> **How to use it:** Load with `#file:context/layer-4-prompt-templates.md`, copy the relevant template, fill in `[BRACKETS]`, use as your opening Copilot Chat message.

---

## Template: New RAG Feature — Full Design-First Flow

Use when: Adding a new endpoint or a new RAG capability to the service.

```
I need to build [feature name] in design-first-demo.

Context loaded:
- Stack: Java 21 | Spring Boot 3.4.3 | Spring AI 1.0.x | PGVector
- Entry point: POST /api/v1/[resource]/[action]
- Flow: Controller → Service → VectorStore → ChatClient → response
- Constraint: stateless, synchronous, no auth, no sessions

Before writing any code, walk me through the design at each level.

Level 1 — Capabilities:
The feature must [requirement 1], [requirement 2].
It must NOT [exclusion 1 — e.g. no streaming, no conversation history].

Level 2 — Components:
We already have QuestionController, QuestionService, VectorStore, ChatClient, RagProperties,
GlobalExceptionHandler. Use these. Do not add new components unless there is no alternative.
If a new component is needed, name it and explain what it owns.

Level 3 — Interactions:
Entry: [HTTP method + path]
Flow: [describe data flow step by step]
Error paths: [what can fail and what exception is thrown]

Level 4 — Contracts:
Method signatures for any new or changed service methods.
New DTO record definitions (fields + types).
New exception class if needed (name + extends DemoAppException).
New config properties if needed (prefix + field names + types + validation annotations).
Use existing naming conventions: {Resource}Controller, {Resource}Service, {Action}Request,
{Action}Response, {Failure}Exception, {Feature}Properties.

No code until I approve Level 4.
```

---

## Template: New Endpoint (Single Component)

Use when: Adding a new controller endpoint that delegates to an existing or slightly extended service.

```
I need to add a new endpoint to design-first-demo.

Endpoint: [HTTP method] /api/v1/[resource]/[action]
Purpose: [one sentence]

What exists:
- [existing service method if reusing, or "none — needs new service method"]
- [existing DTOs if reusing, or "none — need new request/response records"]

Start at Level 4 — Contracts.
Show me:
1. The controller method signature and mapping annotation
2. The request and response DTO record definitions with field names, types, and @Valid constraints
3. The service method signature (if new)
4. Any new exception (if new failure case)

Use these naming conventions:
- Controller method: camelCase verb-first
- Request DTO: {Action}Request record
- Response DTO: {Action}Response record
- Exception: {Failure}Exception extends DemoAppException

Wait for my approval before writing the implementation.
```

---

## Template: Test Coverage

Use when: Writing tests for a new or modified component.

```
I need tests for [QuestionService / QuestionController / both].

[If service tests:]
Component: QuestionService
Method: [method name]
Scenarios to cover:
- [scenario 1 — e.g. documents found → answer returned]
- [scenario 2 — e.g. no documents → default answer]
- [scenario 3 — e.g. VectorStore throws → VectorStoreException]
- [scenario 4 — e.g. ChatClient throws → ModelException]

Use: @ExtendWith(MockitoExtension.class), no Spring context.
Mocks: VectorStore, ChatClient.Builder, ChatClient, ChatClient.ChatClientRequestSpec,
       ChatClient.CallResponseSpec
Config: new RagProperties(3, 0.7) — construct directly.
Naming: methodName_condition_expectedResult

[If controller tests:]
Component: QuestionController
Endpoint: [HTTP method] /api/v1/[resource]/[action]
Scenarios to cover:
- [scenario 1 — e.g. valid request → 200 + response body]
- [scenario 2 — e.g. blank field → 400 VALIDATION_ERROR]
- [scenario 3 — e.g. VectorStoreException → 503 VECTOR_STORE_UNAVAILABLE]

Use: @WebMvcTest(QuestionController.class), @MockBean QuestionService.
Assert: status() and jsonPath(). Use $.code not $.message for error assertions.

Generate the tests. Follow the patterns in QuestionServiceTest and QuestionControllerTest.
```

---

## Template: Bug Investigation

Use when: Diagnosing unexpected behavior in the RAG flow.

```
I have unexpected behavior in design-first-demo.

Component: [QuestionService / QuestionController / GlobalExceptionHandler / other]
Observed: [what is happening]
Expected: [what should happen]
Conditions: [always / specific input / specific environment]

Relevant code:
[paste the method or class]

Relevant logs (DEBUG level — set logging.level.com.example.designfirstdemo: DEBUG):
[paste log output, or describe what you see]

Relevant test failure (if applicable):
[paste test name and assertion failure]

Do not propose a fix yet.
First: identify the most likely causes in order of probability.
For each cause: tell me what evidence would confirm or eliminate it.

Likely areas to check:
- SearchRequest parameters (k and similarityThreshold from RagProperties)
- Document.getText() return value — is it null or empty?
- ChatClient call chain — is the fluent API being called in correct order?
- GlobalExceptionHandler — is the right exception type being caught?
```

---

## Template: Extend the RAG Prompt

Use when: Modifying the system prompt or externalising it to `resources/prompts/question.st`.

```
I need to [modify the system prompt inline / externalise the prompt to question.st].

Current prompt location: buildSystemPrompt() private method in QuestionService.
Current behaviour: [describe what the prompt does now]
Required change: [describe what needs to change]

[If externalising to question.st:]
The .st file is StringTemplate format. The variable name for the context is {context}.
Use PromptTemplate.create(resource, Map.of("context", context)) to load and render it.
The PromptTemplate is not a Spring bean — create it per-call or inject the resource.

[If modifying inline:]
Constraints:
- Keep the instruction to answer only from provided context
- Keep the fallback instruction ("say so" if context is insufficient)
- Do not add instructions that reference external knowledge

Start at Level 4 — Contracts:
Show me the updated buildSystemPrompt() signature (if it changes) and the full new prompt text.
For externalisation: show me the updated QuestionService constructor and the findAnswer() change.
Wait for approval before writing the implementation.
```
