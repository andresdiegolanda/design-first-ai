# Changelog

All notable changes to this project are documented here.

---

## [Unreleased]

### Added

- **`docs/design-workflow.md`** — New primary workflow document. Describes the three-step
  document-driven process (app description → implementation guide → agent execution),
  the iterative nature of Step 2, and Garg's five design dimensions as a quality review
  guide for the implementation guide. Connects to Context Anchoring — Garg's third pattern.
  Replaces the `levels/` folder as the practical guide for running a design session.

- **`examples/01-spring-mvc/app/context/layer-2-file-patterns.md`** — Standalone Layer 2
  file. Project structure, naming conventions, canonical patterns for controller, service,
  exception, request record. Authored source for the content merged into
  `.github/copilot-instructions.md`.

- **`examples/02-angular-component/app/context/layer-2-file-patterns.md`** — Standalone
  Layer 2 file. Project structure, naming conventions, canonical patterns for component,
  service, model, template state blocks. Authored source for the content merged into
  `.github/copilot-instructions.md`.

### Changed

- **`levels/` folder removed** — replaced by `docs/design-workflow.md`. The sequential
  conversation gate model (five explicit approval checkpoints) is superseded by the
  document-driven iterative model. Garg's five design dimensions are preserved as a quality
  review guide within `design-workflow.md`.

- **`guides/calibration.md` deleted** — described calibration for the levels gate model
  which no longer exists.

- **`guides/adoption.md` moved to `docs/adoption.md`**
- **`guides/copilot-setup.md` moved to `docs/copilot-setup.md`**

  The `guides/` folder is now empty and removed. All practitioner documentation lives in
  `docs/`.

- **`docs/copilot-context-model.md`** — Stripped to context mechanics only: how the agent
  reads workspace files, what survives session boundaries, the role of
  `.github/copilot-instructions.md`, and tag-based vs natural language context loading.
  The document-driven workflow content moved to `docs/design-workflow.md`.

- **`README.md`** — Restructured around three Garg patterns (Knowledge Priming, Design-First,
  Context Anchoring). Levels table and sequential gate diagram replaced with the
  document-driven workflow diagram. `levels/` and `guides/` removed from structure diagram.
  `docs/` block updated with all moved and new files. Context Anchoring added to References.
  Quick Start paths updated.

- **`docs/adoption.md`** — Rewritten to reflect the document-driven workflow. Week 3
  introduces the impl-guide workflow. Week 4 is Layer 3 skills. References to `levels/`
  removed. Deletability section updated.

- **`context/README.md`** — `../guides/copilot-setup.md` reference updated to
  `../docs/copilot-setup.md`.

- **`context/layer-0-generation-prompt.md`** — `../guides/copilot-setup.md` reference
  updated to `../docs/copilot-setup.md`. Stale Garg Level reference removed from
  Connection section.

- **`.github/copilot-instructions.md`** (root) — `guides/` and `levels/` removed from
  architecture table and repo structure diagram. Anti-patterns updated to flag both as
  stale references.

- Both example app `copilot-instructions.md` headers — reference `layer-2-file-patterns.md`
  as the Layer 2 source file.

- Both example app READMEs — structure diagrams updated to include `layer-2-file-patterns.md`.

---

## v1.2.1 — 2026-03-19

### Fixed

- **`context/skill-business-story-narration.md`** — Three issues corrected in the example:
  1. All four output sections now labeled to match the Output Format spec.
  2. "Out of scope" declaration moved out of the acceptance criteria bullet list.
  3. Technical notes section shown in the example with a generic implementation reference.
  4. Company-specific references in Technical notes replaced with generic equivalents.
  5. Two new Design Constraints added covering issues 2 and 3.

---

## v1.2.0 — 2026-03-19

### Added

- **`context/skill-business-story-narration.md`** — New cross-cutting Layer 3 skill.
  Produces two layers from technical context: a business description in plain language
  (no component names, no implementation details, readable by a product owner) and
  acceptance criteria in Given/When/Then format (technical precision allowed).
  Stack-agnostic. Includes before/after example.

- **`examples/01-spring-mvc/`** — Replaced `examples/01-rag-endpoint/`. Plain Spring MVC
  in-memory product catalog CRUD API. No database, no AI, no Docker, no API key.
  17 tests. Two corrections in design conversation: repository interface removed at Level 2,
  Long IDs replaced with UUID at Level 4.

### Changed

- **`examples/01-rag-endpoint/` removed** — replaced by `examples/01-spring-mvc/`.
- **`.github/copilot-instructions.md`** (root) — load hint, anti-patterns, naming conventions updated.
- **`README.md`** — Quick Start, structure diagram, Example Apps section updated.

---

## v1.1.0 — 2026-03-18

### Added

- **`examples/02-angular-component/`** — Angular 17 standalone component, debounced search,
  8 unit tests. No Docker, no API key.
- **`levels/master-prompt.md`** — Filled example added.
- **`levels/level-4-spec-template.md`** — New file.
- **`README.md`** — "Using Claude Code" Quick Start path, "Design for Deletion" section.
- Deletability principle added to context/README.md, levels/README.md, guides/adoption.md.
- Superpowers compatibility notes in levels/README.md and context/layer-0-generation-prompt.md.

### Changed

- **`levels/level-5-implementation.md`** — Two-pass review structure.
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
