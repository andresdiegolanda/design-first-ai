# Copilot Layer 4 — Prompt Templates (Framework Repo)

> **What this is:** Standardized opening prompts for recurring tasks when working on the design-first-ai repo.
> **When to load it:** When your task matches one of the categories below.
> **How to load it:** `#file:.github/copilot-layer-4-templates.md`
> Copy the template, fill in the `[BRACKETS]`, use as your opening message.

---

## Template: Add a Worked Example

Use when: Creating a new example in `examples/`.

```
I need to add a worked example to the design-first-ai repo.

Example: [NN-example-name]
Project: [brief description of the project used as the example]
Story: [what feature or component the design conversation covers]

Context loaded:
- .github/copilot-instructions.md (auto-loaded)
- .github/copilot-layer-3-skills.md

Before creating any files, confirm the structure:

The folder structure must be:
  examples/[NN-example-name]/
    app/
      .github/copilot-instructions.md
      context/
        layer-0-architecture.md
        layer-0-design-principles.md
        layer-1-base-instructions.md
        layer-2-file-patterns.md
        layer-3-skills.md
        layer-4-prompt-templates.md
        layer-5-story-context.md
      src/
    conversation/
      design-conversation.md
    outcome.md

The design conversation must include at least one correction.
It must NOT include [explicit exclusion].

Confirm which Layer 0 files are needed and what each contains.
Show the exact headers and sections for each file before writing any content.
No content until I approve the structure.
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

Show me the exact section header, placeholder structure, and Design Constraints additions
before writing the full content. Wait for my approval before writing.
```

---

## Template: Write a New Skill File

Use when: Adding a new skill to `context/skills/`.

```
I need to write a new skill file.

Skill: [skill name]
File: context/skills/skill-[name].md
When to load it: [one sentence — what condition makes this skill relevant?]
What it covers: [2–3 sentences — what recurring problem does this skill solve?]

Constraints:
- Stack-agnostic — no framework-specific patterns
- Required sections: header block, What This Skill Does, Rules, Pattern, Design Constraints
- Design Constraints use "Do not" — not "Avoid" or "Prefer"
- Look at context/skills/skill-error-handling.md for format reference

Show me the section headers, the Rules list, and the Design Constraints entries
before writing the full skill. Wait for approval before writing complete content.
```

---

## Template: Write a New Doc

Use when: Adding a new document to `docs/`.

```
I need to write docs/[doc-name].md.

Purpose: [what question does this document answer?]
Audience: working engineers

Constraints:
- No tutorial framing
- Compressed — no filler, no motivational openers
- References use paths relative to the repo root
- Mermaid diagrams where a visual adds clarity that prose cannot

Show me the exact section headers and one-line descriptions for each section
before writing any content. Wait for my approval before writing.
```

---

## Template: Fix or Improve Documentation

Use when: Correcting errors, updating stale references, or compressing verbose sections.

```
I need to fix documentation in [file path].

Problem: [describe the specific issue]
Type: [wrong information / stale reference / too verbose / wrong framing]

[If stale reference:]
  Old: [old text or path]
  New: [new text or path]

[If verbose — paste the section to compress]

Constraints:
- Do not change meaning while compressing
- Do not add new information unless explicitly asked
- Maintain existing section structure unless restructuring is stated goal

For a stale reference: make the change directly.
For compression: show the compressed version before applying.
For a restructure: use the Write a New Doc template instead.
```
