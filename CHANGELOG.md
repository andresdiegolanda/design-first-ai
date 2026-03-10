# Changelog

All notable changes to this project are documented here.

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

- **`context/README.md`** — New subsection "The retrospective technique" added at the end of the Design Constraints section. Explains the question, the expected output, where to save the answers, and why to run it after good sessions as well as bad ones.

- **`context/layer-0-generation-prompt.md`** — "Keeping the Files Current" section restructured. Retrospective technique now leads the section with its own explanation. The structured trigger table moved below it, with the retrospective added as an explicit row (marked as the most important trigger). Previous framing ("AI made a mistake twice") was reactive; this replaces it with a proactive, session-end habit.

- **`README.md`** — Three changes:
  1. "After every session" added as a fifth Quick Start path, with the retrospective question stated explicitly.
  2. The "How They Fit Together" diagram extended with an `AFTER EVERY SESSION` block showing the feedback loop closing back into the layer files.
  3. `CHANGELOG.md` added to the Repository Structure diagram.

### Fixed

- **`context/README.md`**, **`context/layer-0-generation-prompt.md`**, **`README.md`** — Removed phrasing derived too closely from the source LinkedIn post. Replaced with original framing that preserves the core idea: the retrospective question, the feedback loop, and the compounding value of the files over time.

- **All files** — Retrospective prompt updated from *"What should I have told you at the start?"* to *"What context were you missing that would have changed your approach?"* — same intent, more precise framing: points at the AI's inferences rather than the human's omissions.

---

## v1.0.0 — 2026-03-08

Initial release.

### Added

- Six-layer context architecture (`context/`) implementing Garg's Knowledge Priming pattern
- Layer 0 generation prompt (Mode A: workspace access, Mode B: manual file paste)
- Five-level design conversation templates (`levels/`) implementing Garg's Design-First Collaboration pattern
- Worked example: RAG endpoint with full design conversation and corrections at Level 2 and Level 4 (`examples/01-rag-endpoint/`)
- Minimal Spring AI demo app (`demo-app/`) — Spring Boot 3.4.3, Java 21, PGVector, single RAG endpoint
- Pre-configured VS Code + GitHub Copilot setup (`.github/copilot-instructions.md`, `.vscode/settings.json`)
- Guides: adoption path, complexity calibration, tool setup for Copilot / Claude Code / Cursor / Claude.ai
- 11 unit tests in demo-app (Mockito + `@WebMvcTest`), no external dependencies required

### Fixed (pre-release corrections)

- Root README falsely claimed "No code dependencies" — corrected to distinguish methodology (no dependencies) from demo-app (Java 21 + Docker required)
- Root README Quick Start had one path (existing codebase only) — expanded to four explicit paths
- `guides/adoption.md` made no mention of Layer 0 — added Layer 0 shortcut section and guidance on what to include in each layer
- `demo-app/.github/copilot-instructions.md` contained unfilled `[date]` placeholder — replaced with `2026-03-08`
- `demo-app/README.md` `cd` path was wrong (`cd design-first-demo` → `cd design-first-ai/demo-app`)
- `demo-app/README.md` used `./mvnw` with no wrapper generated — replaced with `mvn` as primary command, wrapper generation documented as optional step
- `guides/tool-setup.md` used `@workspace /path/to/file` syntax for loading specific files — incorrect; replaced with `#file:path/to/file` and added callout distinguishing `@workspace` (codebase search) from `#file:` (load specific file)
- `README.md` and `demo-app/README.md` claimed "Optimized for Sonnet 4.6" — removed; the framework is model-agnostic; model choice documented as a speed/cost tradeoff
- `levels/README.md` referenced "Layers 1–5" when describing how to load context — corrected to include Layer 0 generated equivalents
