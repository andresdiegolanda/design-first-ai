# Layer 3 — Skills (angular-user-search)

> **When to load:** When your task involves subscriptions, debounced search, state management, or testing.
> **Skills location:** `.github/skills/` — each skill in its own subdirectory with a `SKILL.md` file.
> **How to invoke:** `/skill-name` in chat, or reference by name in agent mode.

## Available Skills

| Skill | Directory | Load when |
|-------|-----------|-----------|
| Subscription Management | `.github/skills/subscription-management/` | Adding any Observable subscription |
| Debounced Search | `.github/skills/debounced-search/` | Implementing search or filter inputs |
| Explicit State Management | `.github/skills/explicit-state-management/` | Loading data with loading/error/empty states |
| Testing | `.github/skills/testing/` | Writing any new test or adding coverage |

## Design Constraints

- Do not inline skill content in this file — each skill is a `SKILL.md` in its own directory
- Do not load all skills at once — load only what the task requires
