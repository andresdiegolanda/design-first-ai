# Skills — Reusable Knowledge Patterns

This folder contains skill directories for Layer 3 of the Design-First framework.

Skills are the framework's implementation of Garg's Encoding Team Standards pattern.
Each skill is a named subdirectory containing a `SKILL.md` file — a single-purpose
instruction set that encodes the team's judgment for one recurring activity, applied
consistently regardless of who invokes it.

Skills follow the [GitHub Copilot agent skills convention](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/cloud-agent/create-skills):
each skill lives in its own subdirectory, the file is always named `SKILL.md`, and the
directory name matches the skill's `name` field in YAML frontmatter.

---

## What skills are

A skill is a self-contained instruction set for one recurring technical concern.
Each `SKILL.md` tells the agent how to handle that concern — with rules, canonical patterns,
and design constraints.

Skills are **stack-agnostic**. They do not reference specific frameworks or libraries.
Framework-specific patterns belong in the project's own `.github/skills/` directory.

---

## How to use them

Copilot auto-discovers skills based on the `description` field in frontmatter. You can
also invoke a skill explicitly:

```
# In chat — slash command
/error-handling

# In agent mode — reference by name in natural language
"Use the /testing skill for this task"
```

**Modify for your project:** Copy the skill directory into your project's `.github/skills/`
folder and adapt the patterns and constraints to your stack. The security review
and code review skills in particular contain placeholder Design Constraints — replace
them with your team's actual threat model and review criteria before use.

---

## Available skills

| Skill | Directory | When to load |
|-------|-----------|-------------|
| Error Handling | `error-handling/` | Any method that can fail with a business reason |
| Testing | `testing/` | Writing any new test or adding coverage |
| Logging | `logging/` | Adding or reviewing log statements |
| Configuration | `configuration/` | Adding any externalisable value |
| Business Story Narration | `business-story-narration/` | Generating or improving user story descriptions |
| Refactoring | `refactoring/` | Improving existing code without changing behaviour |
| Security Review | `security-review/` | Checking code against the team's threat model |
| Code Review | `code-review/` | Applying the team's quality gate to a piece of work |

---

## Adding a new skill

1. Create a subdirectory under `context/skills/` named with lowercase hyphens (e.g., `my-skill/`).
2. Create `SKILL.md` inside with YAML frontmatter:

```yaml
---
name: my-skill
description: What this skill does and when Copilot should use it.
---
```

3. The `name` field must match the directory name.
4. The body must contain: What This Skill Does, Rules, Pattern, Design Constraints.
5. Keep it stack-agnostic. Framework-specific skills belong in `.github/skills/`.
