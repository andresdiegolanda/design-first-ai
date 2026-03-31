# Git Stage and Commit — Repo-Level Copilot Context Updates

## Stage

```bash
git add .github/copilot-instructions.md
git add .github/copilot-layer-3-skills.md
git add .github/copilot-layer-4-templates.md
git status
```

## Confirm and commit

```bash
git commit -m "fix: update repo-level Copilot context for two-document rule

.github/copilot-instructions.md — Architecture table examples/ row
  updated: conversation/ and outcome.md replaced with .github/ and
  docs/. Repo structure diagram updated with .github/ and docs/ under
  each example app. Anti-patterns updated: conversation/outcome.md
  entry replaced with docs/ story documents entry; layer-5-story-
  context.md added as stale reference to avoid.

.github/copilot-layer-3-skills.md — Writing Worked Examples skill
  completely rewritten. Old structure (context/, conversation/,
  outcome.md) replaced with new structure (.github/, docs/). Rules
  updated to describe impl-guide and execution-report instead of
  design-conversation and outcome. Design Constraints updated.

.github/copilot-layer-4-templates.md — Add a Worked Example template
  folder structure updated: context/ and conversation/ replaced with
  .github/ and docs/. Story reference updated from design-conversation
  to impl-guide/execution-report."

git push
```
