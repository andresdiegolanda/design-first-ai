# Layer 4 — Prompt Templates (Framework Repo)

> **What this is:** Standardized opening prompts for recurring tasks when working on the design-first-ai repo.
> **When to load it:** When your task matches one of the categories below.
> **How to use it:** Copy the template, fill in the `[BRACKETS]`, use as your opening message in Copilot Chat.

---

## Template: Add a Worked Example

Use when: Creating a new example in `examples/`.

```
I need to add a worked example to the design-first-ai repo.

Example: [NN-example-name]
Project being demonstrated: [brief description of the project used as example]
Story being designed: [what feature or component the design conversation covers]

Context already loaded:
- This repo's structure and conventions (copilot-instructions.md)
- Framework skills (framework-layer-3-skills.md)

Before creating any files, walk me through the design:

Level 1 — Capabilities:
The example must show [what the example demonstrates].
The design conversation must include at least one correction at [Level 2 / Level 4].
It must NOT include [explicit exclusion — e.g. a trivial task, a fabricated correction].

Level 2 — Components:
The folder structure must be:
  examples/[NN-example-name]/
    context/layer-0-[file].md
    context/layer-1-base-instructions.md
    context/layer-5-story-context.md
    conversation/design-conversation.md
    outcome.md
Confirm which Layer 0 files are needed and what each contains.

Level 4 — Contracts:
Confirm the exact headers and sections for each file before writing any content.
Align with the existing example at examples/01-rag-endpoint/.

No content until I approve Level 4.
```

---

## Template: Extend a Layer Template

Use when: Adding a new section or improving an existing one in `context/layer-*.md`.

```
I need to extend [context/layer-N-name.md].

What needs to change: [description of the gap or addition]

Constraints:
- Template stays generic — no project-specific content
- All new content uses [BRACKET] placeholder syntax
- Any new section must end with or contribute to the Design Constraints section
- Layer must stay under 100 lines total

Start at Level 4 — Contracts.
Show me the exact section header, placeholder structure, and Design Constraints additions
before writing the full content.
Wait for my approval before writing the final content.
```

---

## Template: Write a New Skill File

Use when: Adding a new skill to `context/framework-layer-3-skills.md` or creating a standalone skill.

```
I need to write a new skill for the framework repo.

Skill: [skill name]
Use when: [one sentence — when does someone load this skill?]
What it covers: [2–3 sentences — what recurring problem does this skill solve?]

Context:
- Skill format: header, "Use when", pattern/rules, "Design Constraints" section
- Look at existing skills in framework-layer-3-skills.md for format reference
- Strong constraints use "Do not" — not "Avoid" or "Prefer"

Level 4 — Contracts first:
Show me the section header, the "Use when" line, the rules list structure,
and the Design Constraints entries before writing the full skill.
Wait for approval before writing the complete content.
```

---

## Template: Write or Revise a Guide

Use when: Adding a new guide to `guides/` or making significant changes to an existing one.

```
I need to [write / revise] guides/[guide-name].md.

Purpose: [what question does this guide answer for a practitioner?]
Audience: [working engineer / team lead / both]

[If revising — what is wrong with the current version?]
[list the specific problems: wrong information / missing information / too long / wrong framing]

Constraints:
- No tutorial framing — readers are engineers, not beginners
- Compressed — no filler language, no motivational openers
- References to other files use relative paths: ../context/layer-N.md
- References to copilot-setup.md for any tool-configuration questions
- Do not reference Cursor, Claude Code, or other tools

Level 1 — Capabilities:
What questions does this guide answer? What is explicitly out of scope?

Level 4 — Contracts:
What are the exact section headers and their one-line descriptions?
Show the full structure before writing any content.

No content until I approve Level 4.
```

---

## Template: Fix or Improve Documentation

Use when: Correcting errors, updating stale references, or compressing verbose sections.

```
I need to fix documentation in [file path].

Problem: [describe the specific issue]
Type: [wrong information / stale reference / too verbose / wrong framing / other]

[If stale reference — old value → new value:]
  Old: [old text or path]
  New: [new text or path]

[If verbose — paste the section:]
  [paste]

Constraints:
- Do not change meaning while compressing
- Do not add new information unless explicitly asked
- Maintain the existing section structure unless restructuring is the stated goal

For a stale reference fix: make the change directly, no levels needed.
For a compression task: show the compressed version at Level 4 before applying it.
For a restructure: treat as a full guide task and use the guide template above.
```
