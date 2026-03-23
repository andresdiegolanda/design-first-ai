# Skills — Reusable Knowledge Patterns

This folder contains skill files for Layer 3 of the Design-First framework.

---

## What skills are

A skill file is a self-contained instruction set for one recurring technical concern.
Each file tells the agent how to handle that concern — with rules, canonical patterns,
and design constraints.

Skills are **stack-agnostic**. They do not reference specific frameworks or libraries.
Framework-specific patterns belong in the project's own Layer 3 file inside `.github/`.

---

## How to use them

**Use as-is:** Reference the skill by path in your opening prompt or impl-guide.
The agent reads it and applies it for the duration of the task.

```
# In agent mode — reference by path in natural language
"Use the error handling skill at context/skills/skill-error-handling.md"

# In chat mode — attach with #file:
#file:context/skills/skill-error-handling.md
```

**Modify for your project:** Copy the file into your project's `.github/` folder,
rename it, and adapt the patterns and constraints to your stack. The original in
this folder stays generic.

---

## Available skills

| File | When to load |
|------|-------------|
| `skill-error-handling.md` | Any method that can fail with a business reason |
| `skill-testing.md` | Writing any new test or adding coverage |
| `skill-logging.md` | Adding or reviewing log statements |
| `skill-configuration.md` | Adding any externalisable value |
| `skill-business-story-narration.md` | Generating or improving user story descriptions |

---

## Adding a new skill

Copy any existing skill file as a starting point. Every skill must contain:

1. Header block — what it does, when to load it, how to load it
2. **What This Skill Does** — one paragraph
3. **Rules** — numbered, imperative, no padding
4. **Pattern** — at least one concrete code or text example
5. **Design Constraints** — explicit "Do not..." rules

Keep it stack-agnostic. If the skill requires a specific framework, it belongs in the
project's `.github/` folder, not here.
