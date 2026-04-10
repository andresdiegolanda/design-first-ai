# Layer 3 — Skills (spring-mvc-demo)

> **When to load:** When your task involves error handling, testing, or in-memory store work.
> **How to load:** Reference individual skill files by path in agent mode, or attach with
> `#file:` in chat mode. Load only the skills relevant to the task.

## Available Skills

| Skill | File | Load when |
|-------|------|-----------|
| Error Handling | `.github/skill-error-handling.md` | Adding any method that can fail with a domain reason |
| Testing | `.github/skill-testing.md` | Writing any new test or adding coverage |
| In-Memory Store | `.github/skill-in-memory-store.md` | Adding a new resource type with CRUD |

## Design Constraints

- Do not inline skill content in this file — each skill is a standalone file
- Do not load all skills at once — load only what the task requires
