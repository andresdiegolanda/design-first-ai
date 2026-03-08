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

1. Load your context layers first (Layers 1–5 from `../context/`, or the Layer 0 generated equivalents).
2. Use `master-prompt.md` as your opening message to set the sequential discipline.
3. Use the individual level templates as checklists — they tell you what to look for at each level before approving and moving forward.

## The Discipline Problem

AI will try to skip levels. It is trained to be helpful, and "helpful" means producing tangible output quickly. Left unchecked, it will offer components with implementation sketches attached, or propose contracts with example code already written.

When this happens, say: "Stop. We are at Level [N]. Show me only [what Level N produces]. No code."

Protecting the level boundary is protecting your working memory from premature detail.
