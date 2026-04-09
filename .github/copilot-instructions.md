# design-first-ai — Copilot Instructions

> Auto-loaded by GitHub Copilot for every chat session in this workspace.
> This is Layers 1 and 2 for working on the framework repo itself.
> Keep under 150 lines. Last reviewed: 2026-04-09.
>
> Load per task: `#file:.github/copilot-layer-3-skills.md` | `#file:.github/copilot-layer-4-templates.md`
> For story writing: `#file:context/skills/skill-business-story-narration.md`

---

## Project Identity

Public methodology repo implementing Rahul Garg's Knowledge Priming, Design-First
Collaboration, Context Anchoring, Encoding Team Standards, and Feedback Flywheel
patterns (martinfowler.com, Feb–Apr 2026).
Contains layer templates, worked examples with buildable apps, and docs.

- **Type:** Documentation and methodology repo. Buildable apps live inside `examples/NN-name/app/`.
- **Audience:** Working engineers. No hand-holding. No tutorials.
- **Tooling:** VS Code + GitHub Copilot. Methodology is tool-agnostic; implementation is not.

---

## Architecture — What Lives Where

| Folder | Contains | Rule |
|--------|----------|------|
| `.github/` | Copilot context for this repo — instructions, skills, templates | All Copilot markdown for this repo lives here |
| `context/` | Layer templates 0–5 (generic, with placeholders) | Templates only — never filled-in instances |
| `context/skills/` | Reusable skill files — one per concern | Stack-agnostic; framework-specific skills go in `.github/` |
| `docs/` | Workflow docs, setup guide, presentation deck | Reference docs for practitioners |
| `examples/` | Worked examples — each has `app/` with `.github/` and `docs/` | Full example per folder — never partial |
| `examples/NN/app/` | Buildable project with `.github/` context and `docs/` story documents | Separate project — open `app/` as its own VS Code workspace |

---

## Non-Negotiables

- `context/` templates stay generic — bracket placeholders, never filled-in for a specific project
- The methodology stays tool-agnostic — no Copilot-specific language in `context/` layer templates
- Every layer template and Layer 0 output file must have a "Design constraints" section
- Skills in `context/skills/` stay stack-agnostic — framework-specific patterns belong in `.github/`
- The retrospective question is exactly: *"What context were you missing that would have changed your approach?"* — this wording does not vary
- All documentation: compressed, imperative. No filler. No padding.

---

## What This Repo Is NOT

- Not a code generator or tool — it produces markdown, not runnable output
- Not a tutorial platform — readers are engineers, not beginners
- Not documentation for Copilot itself — methodology only

---

## File Naming Conventions

| File Type | Pattern | Example |
|-----------|---------|---------|
| Copilot instructions | `copilot-instructions.md` | `.github/copilot-instructions.md` |
| Copilot layer context | `copilot-layer-N-name.md` | `copilot-layer-3-skills.md` |
| Layer templates | `layer-N-name.md` | `layer-3-skills.md` |
| Skills | `context/skills/skill-name.md` | `skill-error-handling.md` |
| Story documents | `docs/[STORY-ID]-impl-guide.md` | `DEMO-001-impl-guide.md` |
| Docs | descriptive, hyphenated | `design-workflow.md` |
| Examples | `NN-kebab-name/` | `01-spring-mvc/` |
| Example apps | `examples/NN-name/app/` | `examples/01-spring-mvc/app/` |

---

## Documentation Style Rules

- **Imperative, not explanatory.**
- **State the constraint, not the reason.** Add the reason only when it is non-obvious.
- **No filler openers.**
- **Short sections.** If a section exceeds one screen, split or compress.
- **Design Constraints last in every section.**

---

## Repo Structure

```
design-first-ai/
├── .github/
│   ├── copilot-instructions.md          ← this file (L1+L2, auto-loaded)
│   ├── copilot-layer-3-skills.md        ← L3 skills for working on this repo
│   └── copilot-layer-4-templates.md     ← L4 prompt templates for this repo
├── README.md
├── CHANGELOG.md
├── context/                             ← generic layer templates (placeholders)
│   └── skills/                          ← reusable skill files (stack-agnostic)
│       ├── skill-error-handling.md
│       ├── skill-testing.md
│       ├── skill-logging.md
│       ├── skill-configuration.md
│       └── skill-business-story-narration.md
├── docs/                                ← workflow docs + setup + deck
├── examples/
│   ├── 01-spring-mvc/app/               ← open as own workspace
│   │   ├── .github/                     ← all Copilot context (layers 0–4)
│   │   └── docs/                        ← story documents (impl-guide, execution-report)
│   └── 02-angular-component/app/        ← open as own workspace
│       ├── .github/                     ← all Copilot context (layers 0–4)
│       └── docs/                        ← story documents (impl-guide, execution-report)
```

---

## Anti-Patterns — Never Propose These

- Do not fill in bracket placeholders in `context/layer-*.md` — those are templates
- Do not add framework-specific skills to `context/skills/` — they belong in project `.github/`
- Do not create new examples with `conversation/` or `outcome.md` — use `docs/` story documents
- Do not reference `context/framework-layer-*.md` — files moved to `.github/`
- Do not reference `guides/` — files moved to `docs/`
- Do not reference `levels/` — folder removed, replaced by `docs/design-workflow.md`
- Do not reference `context/layer-5-story-context.md` — replaced by `docs/[STORY-ID]-impl-guide.md`
- Do not reference `context/skill-business-story-narration.md` — moved to `context/skills/`
- Do not reference `demo-app/` — replaced by `examples/NN/app/`
- Do not reference `01-rag-endpoint/` — replaced by `01-spring-mvc/`
- Do not propose changes to an example app from the repo root workspace — open `app/` separately
