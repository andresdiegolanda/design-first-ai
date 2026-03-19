# Changelog

All notable changes to this project are documented here.

---

## [Unreleased]

### Fixed

- **`context/skill-business-story-narration.md`** — Three issues corrected:
  1. Example output now labels all four sections to match the Output Format spec
     (`User story statement`, `Business description`, `Acceptance criteria`, `Technical notes`).
  2. "Out of scope" declaration moved out of the acceptance criteria bullet list into its
     own labeled line — scope exclusions are not testable criteria.
  3. Technical notes section added to the example (was declared optional in the spec but
     absent from the example with no indication). Now shown with a brief implementation
     reference to clarify when and how to use it.
  4. Design Constraints section updated: added "Do not list out of scope items as
     acceptance criteria" and "Do not omit technical notes when implementation details
     are known."

---

## v1.2.0 — 2026-03-19

### Added

- **`context/skill-business-story-narration.md`** — New cross-cutting Layer 3 skill.
  Produces two layers from technical context: a business description in plain language
  (no component names, no implementation details, readable by a product owner) and
  acceptance criteria in Given/When/Then format (technical precision allowed).
  Stack-agnostic — load with `#file:context/skill-business-story-narration.md` alongside
  any Layer 5 story context. Includes before/after example.

- **`examples/01-spring-mvc/`** — Replaced `examples/01-rag-endpoint/`. New first example
  is a plain Spring MVC in-memory product catalog CRUD API. No database, no AI, no Docker,
  no API key — runs with `mvn spring-boot:run` on Java 21 + Maven.

  Contents:
  - **`app/`** — Spring Boot 3.4.3 | Java 21 | spring-boot-starter-web only.
    `ProductController`, `ProductService` (ConcurrentHashMap), `Product` /
    `CreateProductRequest` records, `ProductNotFoundException`, `GlobalExceptionHandler`.
    17 tests: 8 plain JUnit service tests, 9 `@WebMvcTest` controller tests.
  - **`app/context/`** — Layer 0 (architecture, design principles), Layer 1, Layer 3
    (error handling, testing, in-memory store), Layer 4 (four prompt templates),
    Layer 5 (story context for DEMO-001).
  - **`app/.github/copilot-instructions.md`** — Layers 1+2 auto-loaded for this app.
  - **`conversation/design-conversation.md`** — Full Level 1–5 exchange. Two corrections:
    `ProductRepository` interface removed at Level 2; `Long` IDs replaced with `UUID` at
    Level 4.
  - **`outcome.md`** — What was built, what was caught, what the Layer 0 constraints added.

### Changed

- **`examples/01-rag-endpoint/` removed** — replaced by `examples/01-spring-mvc/`.
  The RAG endpoint example required Docker and an OpenAI API key. The Spring MVC example
  has no external dependencies.

- **`.github/copilot-instructions.md`** (root) — Load hint added at the top:
  `framework-layer-3-skills.md`, `framework-layer-4-templates.md`, and
  `skill-business-story-narration.md` for story writing. Anti-patterns updated to flag
  `01-rag-endpoint/` as a stale reference. File naming conventions table updated to
  include the `skill-name.md` pattern.

- **`README.md`** — Quick Start updated to reference `examples/01-spring-mvc/`. Structure
  diagram updated. "The Example Apps" section updated. Narration skill added to `context/`
  block in diagram.

---

## v1.1.0 — 2026-03-18

### Added

**`examples/02-angular-component/`** — Second worked example. Angular 17 standalone
component with debounced search, explicit state management, and 8 unit tests.
No Docker, no API key — runs with `npm install && ng serve`.

Contents:
- **`app/`** — Buildable Angular 17 app: `UserSearchComponent`, `UserService`, `User` model,
  8 Jasmine tests. Standalone components throughout, no NgModule.
- **`app/context/`** — Layer 0 (architecture, design principles), Layer 1, Layer 3 (four
  skills: subscriptions, debounced search, explicit state, Angular testing), Layer 4 (four
  prompt templates), Layer 5 (story context for DEMO-002).
- **`app/.github/copilot-instructions.md`** — Layers 1+2 auto-loaded for this app.
- **`conversation/design-conversation.md`** — Full Level 1–5 exchange. Two corrections:
  `SearchResultsComponent` removed at Level 2; async pipe / Observable state properties
  rejected at Level 4.
- **`outcome.md`** — What was built, what was caught, what the Layer 0 constraints added.

**`levels/master-prompt.md`** — Filled example added below the blank template.

**`README.md`** — "Using Claude Code" added as a sixth Quick Start path.

**Deletability principle** — added throughout the framework.

- **`README.md`** — New "Design for Deletion" section.
- **`context/README.md`** — Design Constraints section connected to deletability.
- **`levels/README.md`** — New "The Conversation Record as Reconstruction Manual" section.
- **`guides/adoption.md`** — New "The Long Game — Deletability" section.

**Superpowers compatibility** — additive changes for Claude Code users.

- **`levels/level-4-spec-template.md`** — New file. Spec document output of Level 4 approval.
- **`levels/README.md`** — Superpowers reference paragraph.
- **`context/layer-0-generation-prompt.md`** — Note on priming Superpowers agents.

### Changed

- **`levels/level-5-implementation.md`** — Two-pass review: Pass 1 (Spec Compliance),
  Pass 2 (Code Quality).
- **`README.md`** — Quick Start updated; diagram updated.
- **`guides/tool-setup.md`** renamed to **`guides/copilot-setup.md`**.
- **`demo-app/`** removed — apps now live in `examples/NN-name/app/`.
- Scoped tooling to VS Code + GitHub Copilot throughout.

### Fixed

- **`README.md`** — `reduce-fiction-ai` corrected to `reduce-friction-ai`.

---

## v1.0.0 — 2026-03-08

Initial release.

### Added

- Six-layer context architecture (`context/`) implementing Garg's Knowledge Priming pattern
- Layer 0 generation prompt (Mode A: workspace access, Mode B: manual file paste)
- Five-level design conversation templates (`levels/`) implementing Garg's Design-First Collaboration pattern
- Worked example: RAG endpoint with full design conversation (`examples/01-rag-endpoint/`)
- Spring AI app — Spring Boot 3.4.3, Java 21, PGVector, single RAG endpoint
- Pre-configured VS Code + GitHub Copilot setup
- Guides: adoption, calibration, copilot setup
- 11 unit tests (Mockito + `@WebMvcTest`)
- Framework context files (L1+L2, L3, L4) for working on the repo itself
- Retrospective technique: "What context were you missing that would have changed your approach?"
- Presentation deck (`docs/design-first-ai.pptx`) — 9 slides

### Fixed (pre-release)

- README "No code dependencies" claim corrected
- Quick Start expanded from one path to four
- `adoption.md` Layer 0 shortcut added
- `copilot-instructions.md` date placeholder filled
- `demo-app/README.md` path corrections
- `guides/tool-setup.md` `@workspace` syntax corrected to `#file:`
- "Optimized for Sonnet 4.6" claim removed
- `levels/README.md` Layer 0 reference corrected
