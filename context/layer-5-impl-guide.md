# Layer 5 — Implementation Guide

> **What this is:** A discovery document. Not a template to fill in, not a file to load
> into Copilot. It explains where Layer 5 lives and how it is produced.

---

## Layer 5 is not a file in this folder.

Every story produces `docs/[STORY-ID]-impl-guide.md` in the project workspace.
That document is Layer 5.

It is built with the agent before any code is written, iterated until every section
is correct, and then handed to the agent for execution. It is a persistent document —
not a per-session load — and it lives in `docs/` alongside the execution report.

---

## What it contains

- **Scope** — what must be built, what is explicitly out of scope
- **Components** — building blocks with single-line purposes
- **Interactions** — data flow and error paths for every external call
- **Contracts** — method signatures, types, DTOs — no implementation
- **Constraints** — decisions already made that this story must respect

---

## How it is built

```
Give the agent:
  - The story
  - docs/app-description.md (project-level context)

Ask:
  "Build an implementation guide for this story.
   Save it as docs/[STORY-ID]-impl-guide.md.
   The guide must be usable as a prompt input and
   understandable by a human."

Iterate until every section is correct and clear.
Then execute.
```

Full workflow: `../docs/design-workflow.md`

---

## Design Constraints

- Do not load this file into Copilot — it is a pointer, not context
- Do not fill this file in — the impl-guide belongs in `docs/`, not here
- Do not use this file as a session-level Layer 5 substitute
