# Layer 3 — Skills

> **What this is:** An explanation of the skills model and an index of available skills.
> **Skills location:** `context/skills/` — each skill in its own subdirectory with a `SKILL.md` file.
> **Convention:** [GitHub Copilot agent skills](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/cloud-agent/create-skills) —
> directory name matches skill name, file is always `SKILL.md`, YAML frontmatter with `name` and `description`.

---

## What Skills Are

Skills are self-contained instruction sets for recurring technical concerns. Each skill
directory contains a `SKILL.md` that tells the agent how to handle one specific concern —
error handling, testing, logging, and so on — with rules, patterns, and design constraints.

Skills are the framework's implementation of Garg's Encoding Team Standards pattern.
Where `.github/copilot-instructions.md` encodes the team's generation standards (applied
every session automatically), skills encode the team's standards for specific activities
— refactoring, security review, code review — loaded only when that activity is relevant.
Each skill is a single-purpose instruction set that executes the team's judgment
consistently, regardless of who invokes it.

Copilot auto-discovers skills based on the `description` field in frontmatter and invokes
them when relevant. You can also invoke a skill explicitly with `/skill-name` in chat.

Skills are reusable across projects and tasks. They are not project-specific. When your
project has stronger or different conventions, copy the skill into your project's
`.github/skills/` directory and adapt the constraints.

The difference between a skill and a layer:
- **Layer files** are always loaded (Layers 1–2) or loaded per task (Layers 3–5) as context for the whole session.
- **Skills** are loaded for a specific concern within a task. You load only what's relevant.

---

## Available Skills

| Skill | Directory | Load when |
|-------|-----------|-----------|
| Error Handling | `context/skills/error-handling/` | Implementing any method that can fail with a business reason |
| Testing | `context/skills/testing/` | Writing any new test or adding coverage |
| Logging | `context/skills/logging/` | Adding or reviewing log statements |
| Configuration | `context/skills/configuration/` | Adding any externalisable value |
| Business Story Narration | `context/skills/business-story-narration/` | Generating or improving user story descriptions |
| Refactoring | `context/skills/refactoring/` | Improving existing code without changing behaviour |
| Security Review | `context/skills/security-review/` | Checking code against the team's threat model |
| Code Review | `context/skills/code-review/` | Applying the team's quality gate to a piece of work |

---

## Adding a New Skill

1. Create a subdirectory under `context/skills/` named with lowercase hyphens.
2. Create `SKILL.md` inside with YAML frontmatter (`name` matching directory, `description`).
3. The body must contain: What This Skill Does, Rules, Pattern, Design Constraints.

Keep skills stack-agnostic where possible. Framework-specific skills (e.g. Spring AI RAG
pattern, Angular RxJS subscriptions) belong in project-level `.github/skills/`, not here.
