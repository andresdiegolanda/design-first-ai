# Layer 3 — Skills

> **What this is:** An explanation of the skills model and an index of available skills.
> **Skills location:** `context/skills/`
> **How to use skills:** Reference the relevant skill file by path in agent mode, or
> `#file:context/skills/skill-name.md` in chat mode.

---

## What Skills Are

Skills are self-contained instruction sets for recurring technical concerns. Each skill
file tells the agent how to handle one specific concern — error handling, testing, logging,
and so on — with rules, patterns, and design constraints.

Skills are the framework's implementation of Garg's Encoding Team Standards pattern.
Where `.github/copilot-instructions.md` encodes the team's generation standards (applied
every session automatically), skills encode the team's standards for specific activities
— refactoring, security review, code review — loaded only when that activity is relevant.
Each skill is a single-purpose instruction set that executes the team's judgment
consistently, regardless of who invokes it.

Skills are reusable across projects and tasks. They are not project-specific. When your
project has stronger or different conventions, add a Design Constraints section to your
Layer 1 or Layer 2 file and the project constraint wins.

The difference between a skill and a layer:
- **Layer files** are always loaded (Layers 1–2) or loaded per task (Layers 3–5) as context for the whole session.
- **Skill files** are loaded for a specific concern within a task. You load only what's relevant.

---

## Available Skills

| Skill | File | Load when |
|-------|------|-----------|
| Error Handling | `context/skills/skill-error-handling.md` | Implementing any method that can fail with a business reason |
| Testing | `context/skills/skill-testing.md` | Writing any new test or adding coverage |
| Logging | `context/skills/skill-logging.md` | Adding or reviewing log statements |
| Configuration | `context/skills/skill-configuration.md` | Adding any externalisable value |
| Business Story Narration | `context/skills/skill-business-story-narration.md` | Generating or improving user story descriptions |
| Refactoring | `context/skills/skill-refactoring.md` | Improving existing code without changing behaviour |
| Security Review | `context/skills/skill-security-review.md` | Checking code against the team's threat model |
| Code Review | `context/skills/skill-code-review.md` | Applying the team's quality gate to a piece of work |

---

## Adding a New Skill

Copy any existing skill file as a starting point. A skill file must contain:

1. A header block — what it does, when to load it, how to load it
2. **What This Skill Does** — one paragraph, the output and its purpose
3. **Rules** — numbered, imperative, no padding
4. **Pattern** — one or more concrete code or text examples
5. **Design Constraints** — explicit "Do not..." rules

Keep skills stack-agnostic where possible. Framework-specific skills (e.g. Spring AI RAG
pattern, Angular RxJS subscriptions) belong in project-level Layer 3 files, not here.
