# Layer 3 — Skills (angular-user-search)

> **When to load:** When your task involves subscriptions, debounced search, state management, or testing.
> **How to load:** Reference individual skill files by path in agent mode, or attach with
> `#file:` in chat mode. Load only the skills relevant to the task.

## Available Skills

| Skill | File | Load when |
|-------|------|-----------|
| Subscription Management | `.github/skill-subscription-management.md` | Adding any Observable subscription |
| Debounced Search | `.github/skill-debounced-search.md` | Implementing search or filter inputs |
| Explicit State Management | `.github/skill-explicit-state-management.md` | Loading data with loading/error/empty states |
| Testing | `.github/skill-testing.md` | Writing any new test or adding coverage |

## Design Constraints

- Do not inline skill content in this file — each skill is a standalone file
- Do not load all skills at once — load only what the task requires
