# Design Levels — Design-First Conversation Templates

This folder contains the five-level design conversation structure from Rahul Garg's [Design-First Collaboration](https://martinfowler.com/articles/reduce-friction-ai/design-first-collaboration.html).

## The One Rule

**No code until Level 5 is approved.**

This rule is the entire discipline. Everything else follows from it.

## When to Use Which Levels

Not every task needs all five levels. Use this table:

| Task Complexity | Start At | Typical Tasks |
|----------------|----------|---------------|
| Trivial utility | Level 4 | Date formatter, string helper, constant class |
| Single component | Level 2 | New service method, new controller endpoint |
| Multi-component feature | Level 1 | New feature spanning service + controller + repository |
| New system integration | Level 1 + deep Level 3 | Third-party API, new database, event-driven pipeline |

## How to Use These Templates

1. Load your context layers first (Layers 1–2 auto-load via `.github/copilot-instructions.md`; load Layers 3–5 explicitly with `#file:` as needed).
2. Use `master-prompt.md` as your opening message in Copilot Chat to set the sequential discipline.
3. Use the individual level templates as checklists — they tell you what to look for at each level before approving and moving forward.
4. After approving Level 4, fill in `level-4-spec-template.md` before opening the Level 5 session. This is the authoritative input to implementation — load it with `#file:spec-[story-id].md`.

## The Discipline Problem

Copilot will try to skip levels. It is trained to be helpful, and "helpful" means producing tangible output quickly. Left unchecked, it will offer components with implementation sketches attached, or propose contracts with example code already written.

When this happens, say: "Stop. We are at Level [N]. Show me only [what Level N produces]. No code."

Protecting the level boundary is protecting your working memory from premature detail.

## The Conversation Record as Reconstruction Manual

The design conversation saved in `conversation/design-conversation.md` is not documentation — it is a reconstruction manual. If the code is deleted, the conversation teaches anyone how to rebuild it: what scope was agreed, what was rejected and why, what contracts were approved, what the error paths look like. The design survives the code.

Save the conversation record. It is not optional.

## For Claude Code Users — Superpowers

If you use Claude Code rather than VS Code + Copilot, [Superpowers](https://github.com/obra/superpowers) by Jesse Vincent implements a compatible autonomous execution layer. The Level 1–4 conversation output maps directly to Superpowers' brainstorming spec format, and the `level-4-spec-template.md` document is compatible with its writing-plans skill input. The Knowledge Priming layers (Layers 0–2) address a gap in Superpowers — it assumes the agent already has codebase context; running the Layer 0 generation prompt before the brainstorming skill fires gives the agent the project-specific constraints it would otherwise infer from training data. No integration or dependency required — the frameworks are complementary by design.
