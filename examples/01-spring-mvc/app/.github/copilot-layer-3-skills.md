# Layer 3 — Skills (spring-mvc-demo)

> **When to load:** When your task involves error handling, testing, or in-memory store work.
> **Skills location:** `.github/skills/` — each skill in its own subdirectory with a `SKILL.md` file.
> **How to invoke:** `/skill-name` in chat, or reference by name in agent mode.

## Available Skills

| Skill | Directory | Load when |
|-------|-----------|-----------|
| Error Handling | `.github/skills/error-handling/` | Adding any method that can fail with a domain reason |
| Testing | `.github/skills/testing/` | Writing any new test or adding coverage |
| In-Memory Store | `.github/skills/in-memory-store/` | Adding a new resource type with CRUD |

## Design Constraints

- Do not inline skill content in this file — each skill is a `SKILL.md` in its own directory
- Do not load all skills at once — load only what the task requires
