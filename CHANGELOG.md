# Changelog

All notable changes to this project are documented here.

---

## [Unreleased] — 2026-03-09

### Added

**Retrospective technique** — the primary new concept in this release.

After every completed session, ask the AI: *"What should I have told you at the start?"*
The AI identifies what context was missing. Save each answer into the relevant Design Constraints section. This is the core feedback loop for keeping context files useful over time.

Source: adapted from a technique demonstrated publicly by an AI leadership practitioner at CTO Craft Con (March 2026).

Changes incorporating this technique:

- **`context/README.md`** — New subsection "The retrospective technique" added at the end of the Design Constraints section. Explains the question, the expected output, where to save the answers, and why to run it after good sessions as well as bad ones.

- **`context/layer-0-generation-prompt.md`** — "Keeping the Files Current" section restructured. Retrospective technique now leads the section with its own explanation. The structured trigger table moved below it, with the retrospective added as an explicit row (marked as the most important trigger). Previous framing ("AI made a mistake twice") was reactive; this replaces it with a proactive, session-end habit.

- **`README.md`** — Two changes:
  1. "After every session" added as a fifth Quick Start path, with the retrospective question stated explicitly.
  2. The "How They Fit Together" diagram extended with an `AFTER EVERY SESSION` block showing the feedback loop closing back into the layer files.
  3. `CHANGELOG.md` added to the Repository Structure diagram.

### Fixed (carried forward from previous session)

The following fixes were applied before this change and are recorded here for completeness:

- Root README falsely claimed "No code dependencies" — corrected to distinguish methodology (no dependencies) from demo-app (Java 21 + Docker required)
- Root README Quick Start had one path (existing codebase only) — expanded to four explicit paths
- `guides/adoption.md` made no mention of Layer 0 — added Layer 0 shortcut section and guidance on what to include in each layer
- `demo-app/.github/copilot-instructions.md` contained unfilled `[date]` placeholder — replaced with `2026-03-08`
- `demo-app/README.md` `cd` path was wrong (`cd design-first-demo` → `cd design-first-ai/demo-app`)
- `demo-app/README.md` used `./mvnw` with no wrapper generated — replaced with `mvn` as primary command, wrapper generation documented as optional step
- `guides/tool-setup.md` used `@workspace /path/to/file` syntax for loading specific files — incorrect. Replaced with `#file:path/to/file`. Added callout distinguishing `@workspace` (codebase search) from `#file:` (load specific file)
- `README.md` and `demo-app/README.md` claimed "Optimized for Sonnet 4.6" — removed. The framework is model-agnostic. Model choice is documented as a speed/cost tradeoff, not a technical optimization
- `guides/tool-setup.md` Sonnet identifier note was ambiguous — clarified that `claude-sonnet-4-5` is the Copilot identifier for Claude Sonnet 4.6, and that identifiers change with new releases
- `levels/README.md` referenced "Layers 1–5" when describing how to load context — corrected to "Layer 0 through 5 / generated equivalents"
