# Changelog

All notable changes to this project are documented here.

---

## [Unreleased] — 2026-03-18

### Added

**Deletability principle** — added throughout the framework.

The principle: every artifact this framework produces must function without the person who
created it. Context files explain the project without the author. Design documents capture
decisions without the meeting. Code follows conventions without the engineer who established
them. Deleting any single layer — person, framework, documents, or code — leaves the
remaining layers functional.

- **`README.md`** — New "Design for Deletion" section added after "The Problem". Establishes
  the principle before the methodology is introduced.
- **`context/README.md`** — Design Constraints section now explicitly connects constraint
  documentation to deletability: a documented constraint survives the person who discovered it.
- **`levels/README.md`** — New "The Conversation Record as Reconstruction Manual" section.
  The design conversation saved in `conversation/` is not documentation — it is the manual
  for rebuilding the code if it is deleted. The design survives the code.
- **`guides/adoption.md`** — New "The Long Game — Deletability" section at the end. Connects
  the retrospective technique to the deletability goal: each answer saved to Design Constraints
  reduces dependence on any single person's memory.

**Superpowers compatibility** — additive changes referencing Jesse Vincent's
[Superpowers](https://github.com/obra/superpowers) framework for Claude Code users.

- **`levels/level-4-spec-template.md`** — New file. Structured spec document to fill after
  Level 4 approval. Captures agreed scope, components, data flow, contracts, and constraints
  in one page. Input to the Level 5 session; compatible with Superpowers' writing-plans
  skill format.
- **`levels/README.md`** — One paragraph noting that the Level 1–4 output maps to Superpowers'
  brainstorming spec format, and `level-4-spec-template.md` is compatible with its
  writing-plans input. No dependency required.
- **`context/layer-0-generation-prompt.md`** — Note added: Layer 0 output files prime
  Superpowers agents before the brainstorming skill fires, filling the codebase-context gap
  that Superpowers assumes is already solved.

### Changed

- **`levels/level-5-implementation.md`** — Restructured into two explicit review passes:
  Pass 1 (Spec Compliance) checks contracts match exactly; Pass 2 (Code Quality) checks
  conventions, logging, tests, and scope additions. Prevents evaluating both dimensions
  simultaneously, which is the primary source of missed deviations.

- **`README.md`** — Diagram updated: Level 4 now shows `level-4-spec-template.md` as
  output; Level 5 notes "against the spec". `levels/` structure block updated to show
  both new files with inline comments.

### Fixed

- **`README.md`** — `reduce-fiction-ai` corrected to `reduce-friction-ai` in the
  Design-First Collaboration reference URL.

---

## [Unreleased] — 2026-03-17

### Added

**Framework context files** — the repo now primes Copilot for working on itself.

- **`.github/copilot-instructions.md`** (root) — Layers 1+2 auto-loaded when working on the
  framework repo. Covers repo identity, folder responsibilities, documentation style rules,
  naming conventions, and anti-patterns specific to editing this repo.
- **`context/framework-layer-3-skills.md`** — Five skills for common framework tasks:
  writing layer templates, writing level templates, writing worked examples, writing Design
  Constraints sections, and documentation compression.
- **`context/framework-layer-4-templates.md`** — Five prompt templates for recurring tasks:
  add a worked example, extend a layer template, write a new skill, write or revise a guide,
  fix or improve documentation.

**Example app context files** — `examples/01-rag-endpoint/app/` now has the full layer structure.

- **`examples/01-rag-endpoint/app/context/layer-3-skills.md`** — Five skills filled in against
  the actual app code: error handling, testing, logging, Spring AI RAG, configuration.
- **`examples/01-rag-endpoint/app/context/layer-4-prompt-templates.md`** — Five prompt
  templates for app tasks: new RAG feature, new endpoint, test coverage, bug investigation,
  extend the RAG prompt.
- **`examples/01-rag-endpoint/app/.github/copilot-instructions.md`** — Updated to reference
  L3 and L4 files and to show `context/` in the project structure diagram.

### Changed

- **`demo-app/` removed — apps now live in `examples/NN-name/app/`.** The RAG endpoint app
  moved from `demo-app/` to `examples/01-rag-endpoint/app/`. All context files consolidated
  under `examples/01-rag-endpoint/app/context/` — previously split between
  `demo-app/context/` and `examples/01-rag-endpoint/context/`. The old `context/` subfolder
  at the example level is gone; `app/context/` is the single source of truth for all layers.

- **Structure principle established:** each example is self-contained. `conversation/` and
  `outcome.md` document the process. `app/` contains the result — code and all context layers.
  Open `app/` as its own VS Code workspace; it has its own `.github/copilot-instructions.md`.

- **`README.md`** — "The Demo App" section replaced with "The Example Apps". Repository
  structure diagram updated to reflect the new `examples/01-rag-endpoint/app/` layout.
  Quick Start updated to link example conversation to its app.

- **`.github/copilot-instructions.md`** (root) — `demo-app/` references replaced with
  `examples/NN/app/` pattern. Anti-patterns updated to explicitly flag `demo-app/` as gone.

- **`examples/01-rag-endpoint/outcome.md`** — File references updated from
  `../../demo-app/` to `app/`. Opening note added clarifying that `app/` is what the
  conversation produced.

- **`examples/01-rag-endpoint/app/README.md`** — Path references updated throughout.
  Project structure diagram updated to show `context/` folder with all layer files.

- Scoped implementation to VS Code + GitHub Copilot. The methodology (layers, levels) remains
  tool-agnostic; the tooling instructions commit to one environment.
- `guides/tool-setup.md` renamed to `guides/copilot-setup.md`. Alternative tool sections removed.
- "your AI tool" / "any AI coding assistant" / "model-agnostic" replaced with "Copilot" /
  "VS Code + GitHub Copilot" throughout adoption.md, context/README.md,
  layer-0-generation-prompt.md, levels/README.md.

---

## [Unreleased] — 2026-03-10

### Added

**Presentation deck** — `docs/design-first-ai.pptx`

9-slide framework overview covering:
1. Title and problem statement (the Implementation Trap)
2. The two complementary models
3. Knowledge Priming — all six context layers
4. Design-First Collaboration — all five conversation levels
5. How they fit together (onboarding → session → design conversation → retrospective loop)
6. Design constraints: weak vs strong priming with examples
7. The retrospective technique with the question prominently displayed
8. Quick start paths for five entry points
9. Closing summary

Intended for team onboarding and chapter demos. File referenced in README under new "Presentation" section. Repository structure diagram updated to include `docs/` folder.

---

## [Unreleased] — 2026-03-09

### Added

**Retrospective technique** — the primary new concept in this release.

At the end of every session, ask the AI: *"What context were you missing that would have changed your approach?"*
The AI surfaces what it had to infer. Save each answer into the relevant Design Constraints section. This is the core feedback loop for keeping context files useful over time. The files compound — each task makes the next one cheaper.

Source: adapted from a technique demonstrated publicly by an AI leadership practitioner at CTO Craft Con (March 2026).

Changes incorporating this technique:

- **`context/README.md`** — New subsection "The retrospective technique" added at the end of the Design Constraints section.
- **`context/layer-0-generation-prompt.md`** — "Keeping the Files Current" section restructured around the retrospective technique.
- **`README.md`** — "After every session" added as a fifth Quick Start path; diagram extended with `AFTER EVERY SESSION` block; `CHANGELOG.md` added to repo structure diagram.

### Fixed

- Phrasing derived too closely from source LinkedIn post replaced with original framing across context/README.md, layer-0-generation-prompt.md, README.md.
- Retrospective prompt updated from *"What should I have told you at the start?"* to *"What context were you missing that would have changed your approach?"*

---

## v1.0.0 — 2026-03-08

Initial release.

### Added

- Six-layer context architecture (`context/`) implementing Garg's Knowledge Priming pattern
- Layer 0 generation prompt (Mode A: workspace access, Mode B: manual file paste)
- Five-level design conversation templates (`levels/`) implementing Garg's Design-First Collaboration pattern
- Worked example: RAG endpoint with full design conversation and corrections at Level 2 and Level 4 (`examples/01-rag-endpoint/`)
- Spring AI app (`demo-app/`) — Spring Boot 3.4.3, Java 21, PGVector, single RAG endpoint
- Pre-configured VS Code + GitHub Copilot setup
- Guides: adoption path, complexity calibration, tool setup
- 11 unit tests (Mockito + `@WebMvcTest`), no external dependencies required

### Fixed (pre-release corrections)

- Root README falsely claimed "No code dependencies" — corrected to distinguish methodology from app
- Root README Quick Start had one path — expanded to four
- `guides/adoption.md` made no mention of Layer 0 — added Layer 0 shortcut section
- `copilot-instructions.md` contained unfilled `[date]` placeholder — filled
- `demo-app/README.md` `cd` path was wrong — corrected
- `demo-app/README.md` used `./mvnw` with no wrapper — replaced with `mvn`
- `guides/tool-setup.md` used wrong `@workspace` syntax — replaced with `#file:`
- README claimed "Optimized for Sonnet 4.6" — removed; model choice is a tradeoff
- `levels/README.md` referenced "Layers 1–5" — corrected to include Layer 0 equivalents
