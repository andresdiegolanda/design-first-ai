# design-first-ai — Copilot Instructions

> Auto-loaded by GitHub Copilot for every chat session in this workspace.
> This is Layers 1 and 2 for working on the framework repo itself.
> Keep under 150 lines. Last reviewed: 2026-03-21.
>
> Load per task: `#file:context/framework-layer-3-skills.md` | `#file:context/framework-layer-4-templates.md`
> For story writing: `#file:context/skill-business-story-narration.md`

---

## Project Identity

Public methodology repo implementing Rahul Garg's Knowledge Priming, Design-First
Collaboration, and Context Anchoring patterns (martinfowler.com, Feb–Mar 2026).
Contains layer templates, worked examples with buildable apps, and docs.

- **Type:** Documentation and methodology repo. Buildable apps live inside `examples/NN-name/app/`.
- **Audience:** Working engineers. No hand-holding. No tutorials.
- **Tooling:** VS Code + GitHub Copilot. Methodology is tool-agnostic; implementation is not.

---

## Architecture — What Lives Where

| Folder | Contains | Rule |
|--------|----------|------|
| `context/` | Layer templates 0–5 (generic, with placeholders) | Templates only — never filled-in instances |
| `docs/` | Workflow docs, setup guide, adoption guide, presentation deck | Reference docs for practitioners |
| `examples/` | Worked examples — each has `app/`, `conversation/`, `outcome.md` | Full example per folder — never partial |
| `examples/NN/app/` | Buildable project + all its context files | Separate project — open `app/` as its own VS Code workspace |

---

## Non-Negotiables

- `context/` templates stay generic — bracket placeholders, never filled-in for a specific project
- The methodology stays tool-agnostic — no Copilot-specific language in `context/` layer templates
- Every layer template and Layer 0 output file must have a "Design constraints" section
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
| Layer templates | `layer-N-name.md` | `layer-3-skills.md` |
| Framework context | `framework-layer-N-*.md` | `framework-layer-3-skills.md` |
| Cross-cutting skills | `skill-name.md` | `skill-business-story-narration.md` |
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
├── .github/copilot-instructions.md      ← this file
├── README.md
├── CHANGELOG.md
├── context/                             ← generic layer templates (placeholders)
│   ├── framework-layer-3-skills.md
│   ├── framework-layer-4-templates.md
│   └── skill-business-story-narration.md
├── docs/                                ← workflow docs + setup + adoption + deck
├── examples/
│   ├── 01-spring-mvc/app/               ← open as own workspace
│   └── 02-angular-component/app/        ← open as own workspace
```

---

## Anti-Patterns — Never Propose These

- Do not fill in bracket placeholders in `context/layer-*.md` — those are templates
- Do not create new examples without `app/`, `conversation/`, and `outcome.md`
- Do not reference `guides/` — files moved to `docs/`
- Do not reference `levels/` — folder removed, replaced by `docs/design-workflow.md`
- Do not reference `tool-setup.md` — renamed to `copilot-setup.md`, now in `docs/`
- Do not reference `demo-app/` — replaced by `examples/NN/app/`
- Do not reference `01-rag-endpoint/` — replaced by `01-spring-mvc/`
- Do not propose changes to an example app from the repo root workspace — open `app/` separately
