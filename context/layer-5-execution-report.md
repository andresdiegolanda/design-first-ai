# Layer 5 — Execution Report

> **What this is:** A discovery document. Not a template to fill in, not a file to load
> into Copilot. It explains where the execution report lives and how it is produced.

---

## The execution report is not a file in this folder.

Every story produces `docs/[STORY-ID]-execution-report.md` in the project workspace.
That document is the permanent record of what was built.

It is created after execution begins and updated as each significant phase completes.
It replaces the conversation history. Anyone who needs to understand, operate, or
continue the work reads this document first.

---

## What it contains

- **What was implemented** — one table, every file changed, added, or deleted, sorted by
  folder, with what changed in one line and the change-map row; then a summary (counts,
  insertions and deletions, what the part did)
- **Deviations from the impl-guide** — what changed during execution and why
- **How to run** — the exact commands to start the application
- **How to run tests** — the exact commands to run the test suite
- **How to test manually** — step-by-step smoke test
- **Acceptance criteria** — each criterion from the guide, met or not, with evidence
- **Review feedback addressed** — PR comments received, analysis, and fix applied
- **Commit message** — ready to paste, follows project conventions
- **Feedback signal** — observations from execution worth feeding back into shared
  artifacts, classified by type: context (priming gaps), instruction (prompt quality),
  workflow (interaction patterns), failure (root causes)

---

## How it is produced

```
Execute the impl-guide with the skill — it writes the report as it goes:

  "Use /apply-implementation-guide.
   Guide: docs/[STORY-ID]-impl-guide.md"

A story shipped as several pull requests is applied one part per run.
Each run adds its part to the same report.

Update it when PR review feedback arrives:
  Paste the review comment as a prompt.
  Apply the fix.
  Add the outcome to the execution report under 'Review feedback addressed.'
```

Skill: `skills/apply-implementation-guide/SKILL.md`
Full workflow: `../docs/design-workflow.md`
Two-document rule: `../docs/design-workflow.md#the-two-document-rule`

---

## Design Constraints

- Do not load this file into Copilot — it is a pointer, not context
- Do not fill this file in — the execution report belongs in `docs/`, not here
- Do not record review feedback in a separate analysis file — it goes in the execution report
