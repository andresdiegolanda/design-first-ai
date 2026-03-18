# Changelog

All notable changes to this project are documented here.

---

## [Unreleased] — 2026-03-18

### Added

**`examples/02-angular-component/`** — Second worked example. Angular 17 standalone
component with debounced search, explicit state management, and 8 unit tests.
No Docker, no API key — runs with `npm install && ng serve`.

Contents:
- **`app/`** — Buildable Angular 17 app: `UserSearchComponent`, `UserService`, `User` model,
  8 Jasmine tests. Standalone components throughout, no NgModule.
- **`app/context/layer-0-architecture.md`** — Architecture + data flow + design constraints
  (includes the "no async pipe" constraint that catches the Level 4 correction).
- **`app/context/layer-0-design-principles.md`** — Coding conventions, naming patterns,
  state management approach, testing approach, design constraints.
- **`app/context/layer-1-base-instructions.md`** — Project identity, stack, non-negotiables,
  anti-patterns for this specific Angular app.
- **`app/context/layer-3-skills.md`** — Four skills: subscription management (`takeUntil`),
  debounced search (`FormControl.valueChanges`), explicit state management, testing Angular
  components with `fakeAsync`.
- **`app/context/layer-4-prompt-templates.md`** — Four prompt templates: new feature
  component, add filter behaviour, test coverage, bug investigation.
- **`app/context/layer-5-story-context.md`** — Story context for `UserSearchComponent`
  (DEMO-002), used as the example session input.
- **`app/.github/copilot-instructions.md`** — Layers 1+2 auto-loaded for this app.
- **`conversation/design-conversation.md`** — Full Level 1–5 exchange. Two corrections:
  `SearchResultsComponent` removed at Level 2; async pipe / Observable state properties
  rejected at Level 4 in favour of explicit `loading`/`error`/`filteredUsers` properties.
- **`outcome.md`** — What was built, what was caught, what the Layer 0 constraints added.

**`README.md`** — Quick Start updated to reference both examples. Repository structure
diagram updated to show `02-angular-component/` alongside `01-rag-endpoint/` with
condensed format. "The Example Apps" section updated with description of 02.

**Deletability principle** — added throughout the framework.

The principle: every artifact this framework produces must function without the person who
created it. Context files explain the project without the author. Design documents capture
decisions without the meeting. Code follows conventions without the engineer who established
them. Deleting any single layer — person, framework, documents, or code — leaves the
remaining layers functional.

- **`README.md`** — New "Design for Deletion" section added after "The Problem".
- **`context/README.md`** — Design Constraints section connects constraint documentation
  to deletability.
- **`levels/README.md`** — New "The Conversation Record as Reconstruction Manual" section.
- **`guides/adoption.md`** — New "The Long Game — Deletability" section.

**Superpowers compatibility** — additive changes referencing Jesse Vincent's
[Superpowers](https://github.com/obra/superpowers) framework for Claude Code users.

- **`levels/level-4-spec-template.md`** — New file. Structured spec document to fill after
  Level 4 approval. Compatible with Superpowers' writing-plans skill format.
- **`levels/README.md`** — Superpowers reference paragraph added.
- **`context/layer-0-generation-prompt.md`** — Note on priming Superpowers agents with
  Layer 0 output before the brainstorming skill fires.

### Changed

- **`levels/level-5-implementation.md`** — Restructured into two explicit review passes:
  Pass 1 (Spec Compliance) and Pass 2 (Code Quality).

- **`README.md`** — Diagram updated for Level 4 spec template output and Level 5 "against
  the spec" note.

### Fixed

- **`README.md`** — `reduce-fiction-ai` corrected to `reduce-friction-ai` in the
  Design-First Collaboration reference URL.

---

## [Unreleased] — 2026-03-17

### Added

**Framework context files** — the repo now primes Copilot for working on itself.

- **`.github/copilot-instructions.md`** (root) — Layers 1+2 auto-loaded when working on the
  framework repo.
- **`context/framework-layer-3-skills.md`** — Five skills for common framework tasks.
- **`context/framework-layer-4-templates.md`** — Five prompt templates for recurring tasks.

**Example app context files** — `examples/01-rag-endpoint/app/` now has the full layer structure.

- **`examples/01-rag-endpoint/app/context/layer-3-skills.md`** — Five skills for the RAG app.
- **`examples/01-rag-endpoint/app/context/layer-4-prompt-templates.md`** — Five prompt templates.
- **`examples/01-rag-endpoint/app/.github/copilot-instructions.md`** — Updated with L3/L4 references.

### Changed

- **`demo-app/` removed** — apps now live in `examples/NN-name/app/`. RAG endpoint app moved
  to `examples/01-rag-endpoint/app/`. All context consolidated under `app/context/`.
- Scoped implementation to VS Code + GitHub Copilot.
- `guides/tool-setup.md` renamed to `guides/copilot-setup.md`.
- "your AI tool" / "model-agnostic" replaced with "Copilot" throughout.

---

## [Unreleased] — 2026-03-10

### Added

**Presentation deck** — `docs/design-first-ai.pptx`. 9 slides. Intended for team onboarding
and chapter demos.

---

## [Unreleased] — 2026-03-09

### Added

**Retrospective technique** — "What context were you missing that would have changed your
approach?" Added to context/README.md, layer-0-generation-prompt.md, README.md, and
guides/adoption.md.

### Fixed

- Retrospective prompt updated from source-derived phrasing to original wording.

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
- Guides: adoption, calibration, tool setup
- 11 unit tests (Mockito + `@WebMvcTest`)

### Fixed (pre-release)

- README "No code dependencies" claim corrected
- Quick Start expanded from one path to four
- `adoption.md` Layer 0 shortcut added
- `copilot-instructions.md` date placeholder filled
- `demo-app/README.md` path corrections
- `guides/tool-setup.md` `@workspace` syntax corrected to `#file:`
- "Optimized for Sonnet 4.6" claim removed
- `levels/README.md` Layer 0 reference corrected
