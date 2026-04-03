# Changelog

All notable changes to this project are documented here.

---

## [Unreleased]

### Added

- **`context/skills/skill-refactoring.md`** — New skill. Team standard for improving
  existing code without changing behaviour. Rules: preserve public contract, incremental
  changes, identify problem first, stop at the boundary of the stated problem. Prompt
  and response structure templates included. Design Constraints are stack-agnostic stubs.

- **`context/skills/skill-security-review.md`** — New skill. Team threat model as
  executable instruction. Three-tier severity model: critical (block merge), important
  (must address), advisory (track and evaluate). Design Constraints section contains
  placeholders — replace with team's actual threat model before use.

- **`context/skills/skill-code-review.md`** — New skill. Team quality gate as executable
  instruction. Rules: check impl-guide first, categorise before explaining, one finding
  per observation. Three-tier output: breaking / important / suggestions. Design
  Constraints section contains placeholders — replace with team's actual review criteria.

### Changed

- **`docs/garg-mapping.md`** — Updated from three to four patterns. New Pattern 4 section
  for Encoding Team Standards: article summary, framework mapping table, four instruction
  types (generation, refactoring, security, review), instruction anatomy table, Mermaid
  extraction diagram. Overview diagram updated. Composition section updated to four
  patterns. 'What the Framework Adds' table updated: Design Constraints and retrospective
  technique moved from framework additions into Pattern 4 mapping. Reading order extended.

- **`README.md`** — Updated from three to four complementary patterns. New Encoding Team
  Standards section added. 'How They Fit Together' diagram annotated with Pattern 4.
  Repository structure updated with three new skill files. References updated with
  article 4 link.

- **`context/README.md`** — Design Constraints section updated: named as the
  implementation of Garg's Encoding Team Standards pattern. Skills table updated with
  three new entries. 'What Not to Do' updated with copilot-instructions.md PR review
  requirement.

- **`context/layer-3-skills.md`** — Paragraph added connecting skills to Garg's
  Encoding Team Standards: skills are single-purpose instruction sets encoding team
  judgment for specific activities. Skills table updated with three new entries.

- **`context/skills/README.md`** — Updated with Encoding Team Standards framing. Skills
  table updated with three new entries. Modification guidance updated for security and
  code review placeholder constraints.

- **`docs/copilot-setup.md`** — 'Commit These Files' section updated: `context/skills/`
  added to committed files list. Closing paragraph rewritten with Pattern 4 framing:
  skill files are executable team standards, changes require PR review, same discipline
  as build configuration files.

---

## v1.3.0 — 2026-03-31

### Added

- **`docs/design-workflow.md` — Two-Document Rule section added.** Every story produces
  exactly two documents: `impl-guide.md` (intention) and `execution-report.md` (result).
  Defines what belongs in each, what belongs in neither, and why accumulation beyond two
  is a signal to consolidate. PR review analysis is a prompt exercise — outcome goes into
  the execution report under "Review feedback addressed."

- **`examples/01-spring-mvc/app/docs/DEMO-001-impl-guide.md`** — Story document 1 for
  the Spring MVC example. Scope, components, interactions, contracts. Replaces
  `layer-5-story-context.md` and the gate-model design conversation.

- **`examples/01-spring-mvc/app/docs/DEMO-001-execution-report.md`** — Story document 2
  for the Spring MVC example. What was built, deviations, how to run, how to test, commit
  message. Records the two corrections made during impl-guide review.

- **`context/skills/` folder** — New subfolder for reusable, stack-agnostic skill files.

- **`context/skills/skill-error-handling.md`** — Named exceptions, global handler pattern,
  failure category taxonomy. Design Constraints prevent bare RuntimeException and
  catch-and-rethrow.

- **`context/skills/skill-testing.md`** — Unit tests (Mockito, no Spring context) and
  controller tests (`@WebMvcTest`). Naming convention `method_condition_result`. Design
  Constraints prevent `@SpringBootTest` misuse and `should` naming.

- **`context/skills/skill-logging.md`** — SLF4J, level rules (DEBUG/INFO/WARN/ERROR),
  parameterised placeholders, PII exclusion. Design Constraints prevent
  `System.out.println` and string concatenation in log statements.

- **`context/skills/skill-configuration.md`** — `@ConfigurationProperties` + `@Validated`,
  `application.yml` first, fail-fast at startup. Design Constraints prevent hardcoded
  values and `@Value` sprawl.

- **`docs/garg-mapping.md`** — Maps all three Garg patterns to specific framework files
  and mechanisms. Includes four Mermaid diagrams. Includes a recommended reading order.

- **`docs/design-workflow.md`** — Three-step document-driven workflow, Garg's five
  dimensions as quality checklist, execution report, Context Anchoring connection.

- **`examples/01-spring-mvc/app/context/layer-2-file-patterns.md`** — Standalone Layer 2
  source file for the Spring MVC example.

- **`examples/02-angular-component/app/context/layer-2-file-patterns.md`** — Standalone
  Layer 2 source file for the Angular example.

### Changed

- **`examples/01-spring-mvc` restructured — all Copilot context moved to `.github/`.**
  Layer files renamed with `copilot-` prefix and moved from `context/` to `.github/`:
  `copilot-layer-0-architecture.md`, `copilot-layer-0-design-principles.md`,
  `copilot-layer-1-base-instructions.md`, `copilot-layer-2-file-patterns.md`,
  `copilot-layer-3-skills.md`, `copilot-layer-4-templates.md`.
  `context/` folder removed. `conversation/` folder removed. `outcome.md` removed —
  content absorbed into `DEMO-001-execution-report.md`.
  `docs/` folder added for story documents.

- **`examples/01-spring-mvc/app/.github/copilot-instructions.md`** — Load hints updated
  to `.github/` paths. `docs/` story document pattern documented in header.

- **`examples/01-spring-mvc/app/README.md`** — Structure diagram updated for new layout.
  "Using Copilot" section updated to two-document workflow. Story documents table added.

- **`examples/01-spring-mvc/outcome.md` removed** — content absorbed into
  `docs/DEMO-001-execution-report.md`.

- **`README.md`** — Spring MVC example structure diagram updated. Quick Start "See it in
  action" path updated to story documents. "Example Apps" section updated.

- **`examples/02-angular-component` restructured — all Copilot context moved to `.github/`.**
  Layer files renamed with `copilot-` prefix and moved from `context/` to `.github/`:
  `copilot-layer-0-architecture.md`, `copilot-layer-0-design-principles.md`,
  `copilot-layer-1-base-instructions.md`, `copilot-layer-2-file-patterns.md`,
  `copilot-layer-3-skills.md`, `copilot-layer-4-templates.md`.
  `context/` folder removed. `conversation/` folder removed. `outcome.md` removed —
  content absorbed into `DEMO-002-execution-report.md`.
  `docs/` folder added for story documents.

- **`examples/02-angular-component/app/.github/copilot-instructions.md`** — Load hints updated
  to `.github/` paths. `docs/` story document pattern documented in header.

- **`examples/02-angular-component/app/README.md`** — Structure diagram updated for new layout.
  "Using Copilot" section updated to two-document workflow. Story documents table added.

- **`README.md`** — Angular example structure diagram updated. Quick Start Angular path
  updated to `docs/DEMO-002-impl-guide.md`.

- **`context/framework-layer-3-skills.md` moved to `.github/copilot-layer-3-skills.md`**
- **`context/framework-layer-4-templates.md` moved to `.github/copilot-layer-4-templates.md`**

  All Copilot markdown for this repo now lives in `.github/` — consistent with the
  Fidelity convention and with the principle that `.github/` is where Copilot context lives.

- **`.github/copilot-layer-3-skills.md`** — Renamed from `framework-layer-3-skills.md`.
  "Writing Level Templates" skill removed (levels/ folder no longer exists). "Writing
  Skill Files" skill added with the `context/skills/` model. File header updated.

- **`.github/copilot-layer-4-templates.md`** — Renamed from `framework-layer-4-templates.md`.
  "Write or Revise a Guide" template removed (`guides/` folder no longer exists). "Add a
  Worked Example" template updated to current folder structure. "Write a New Skill File"
  template updated to reference `context/skills/`. File header updated.

- **`.github/copilot-instructions.md`** — Load hints updated to `.github/copilot-layer-3-skills.md`
  and `.github/copilot-layer-4-templates.md`. Architecture table updated: `.github/` row
  added, `context/skills/` row updated. Repo structure diagram updated. Naming conventions
  table updated. Anti-patterns updated to flag `context/framework-layer-*.md` as stale.

- **`context/skill-business-story-narration.md` moved to `context/skills/`** — all skills
  now in one folder.

- **`context/layer-3-skills.md`** — Rewritten as a skills model explanation and index.

- **`context/README.md`** — Layer 3 row updated to reference `context/skills/`. Skills
  index table added. Deletability principle and "What Not to Do" rules added.

- **`levels/` folder removed** — replaced by `docs/design-workflow.md`.

- **`docs/adoption.md` deleted** — redundant. Useful content absorbed into `context/README.md`.

- **`guides/calibration.md` deleted** — levels-specific, no longer relevant.

- **`guides/copilot-setup.md` moved to `docs/copilot-setup.md`**.

- **`docs/copilot-context-model.md`** — Stripped to context mechanics only.

- **`README.md`** — `.github/` block updated with `copilot-layer-3-skills.md` and
  `copilot-layer-4-templates.md`. `context/` block: `framework-layer-*.md` removed,
  `context/skills/` retained. All other unreleased changes included.

- **`README.md`** — Example Apps section clarified: examples demonstrate workflow
  mechanics; framework value compounds on features with ambiguous scope, multi-service
  interactions, or cross-cutting concerns.

### Fixed

- **`examples/01-spring-mvc/app/docs/DEMO-001-impl-guide.md`** — Error code in
  GlobalExceptionHandler mapping table changed from `PRODUCT_NOT_FOUND` to `NOT_FOUND`
  to match the actual implementation and tests.

- **`examples/01-spring-mvc/app/docs/DEMO-001-execution-report.md`** — Manual testing
  step 5 updated to expect `NOT_FOUND` instead of `PRODUCT_NOT_FOUND`.

- **`.gitignore`** — Added Node.js entries (`node_modules/`, `dist/`, `.angular/`) to
  prevent Angular example build artifacts from appearing as untracked files.

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
