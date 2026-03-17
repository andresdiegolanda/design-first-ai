# design-first-ai — Copilot Instructions

> Auto-loaded by GitHub Copilot for every chat session in this workspace.
> This is Layers 1 and 2 for working on the framework repo itself.
> Keep under 150 lines. Last reviewed: 2026-03-17.

---

## Project Identity

Public methodology repo implementing Rahul Garg's Knowledge Priming and Design-First
Collaboration patterns (martinfowler.com, Feb–Mar 2026). Contains layer templates,
level templates, worked examples with buildable apps, and guides.

- **Type:** Documentation and methodology repo. Buildable apps live inside `examples/NN-name/app/`.
- **Audience:** Working engineers. No hand-holding. No tutorials.
- **Tooling:** VS Code + GitHub Copilot. Methodology is tool-agnostic; implementation is not.

---

## Architecture — What Lives Where

| Folder | Contains | Rule |
|--------|----------|------|
| `context/` | Layer templates 0–5 (generic, with placeholders) | Templates only — never filled-in instances |
| `levels/` | Level templates 1–5 + master-prompt | Methodology descriptions only — no Copilot-specific content |
| `guides/` | adoption.md, calibration.md, copilot-setup.md | How-to docs for practitioners |
| `examples/` | Worked examples — each has `app/`, `conversation/`, `outcome.md` | Full example per folder — never partial |
| `examples/NN/app/` | Buildable project + all its context files | Separate project — open `app/` as its own VS Code workspace |
| `docs/` | Presentation deck | Binary assets only |

---

## Non-Negotiables

- `context/` templates stay generic — bracket placeholders, never filled-in for a specific project
- The methodology (layers, levels) stays tool-agnostic — no Copilot-specific language in `context/` or `levels/`
- Every layer template and Layer 0 output file must have a "Design constraints" section
- The retrospective question is exactly: *"What context were you missing that would have changed your approach?"* — this wording does not vary
- All documentation: compressed, imperative. No filler. No padding.

---

## What This Repo Is NOT

- Not a code generator or tool — it produces markdown, not runnable output
- Not a tutorial platform — readers are engineers, not beginners
- Not documentation for Copilot itself — methodology only
- Not multi-tool — Cursor, Claude Code, and other alternatives are not referenced

---

## File Naming Conventions

| File Type | Pattern | Example |
|-----------|---------|---------|
| Layer templates | `layer-N-name.md` | `layer-3-skills.md` |
| Level templates | `level-N-name.md` | `level-4-contracts.md` |
| Framework context | `framework-layer-N-*.md` | `framework-layer-3-skills.md` |
| Guides | descriptive, hyphenated | `copilot-setup.md` |
| Examples | `NN-kebab-name/` | `01-rag-endpoint/` |
| Example apps | `examples/NN-name/app/` | `examples/01-rag-endpoint/app/` |

---

## Documentation Style Rules

- **Imperative, not explanatory.** "Do not use glob patterns." Not "You should avoid using glob patterns because..."
- **State the constraint, not the reason.** Add the reason only when it is non-obvious.
- **No filler openers.** Never: "It's important to note that...", "Remember to...", "Please ensure..."
- **Short sections.** If a section exceeds one screen, it needs splitting or compression.
- **Design Constraints last in every section.** They are the most important part — not an afterthought.

---

## Repo Structure

```
design-first-ai/
├── .github/copilot-instructions.md      ← this file (L1+L2 for framework work)
├── README.md
├── CHANGELOG.md
├── context/                             ← generic layer templates (placeholders)
│   ├── framework-layer-3-skills.md      ← L3 for working on this repo
│   └── framework-layer-4-templates.md  ← L4 for working on this repo
├── levels/                              ← level templates (methodology)
├── examples/
│   └── 01-rag-endpoint/
│       ├── app/                         ← buildable Spring AI app (open as own workspace)
│       │   ├── .github/copilot-instructions.md
│       │   ├── context/                 ← all context files for this app
│       │   └── src/
│       ├── conversation/
│       └── outcome.md
├── guides/                              ← practitioner guides
└── docs/                               ← binary assets
```

---

## Anti-Patterns — Never Propose These

- Do not fill in bracket placeholders in `context/layer-*.md` — those are templates
- Do not add Copilot-specific or tool-specific language to `context/` or `levels/` files
- Do not create new examples without `app/`, `conversation/`, and `outcome.md`
- Do not use "model-agnostic" in tooling files — that phrase was removed deliberately
- Do not add motivational or encouraging language to documentation
- Do not reference `tool-setup.md` — it was renamed to `copilot-setup.md`
- Do not reference `demo-app/` — it no longer exists; apps live in `examples/NN/app/`
- Do not propose changes to an example app from the repo root workspace — open `app/` separately
