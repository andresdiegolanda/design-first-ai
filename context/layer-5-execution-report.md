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

- **What was implemented** — file paths, function names, what changed
- **Deviations from the impl-guide** — what changed during execution and why
- **How to run** — the exact commands to start the application
- **How to run tests** — the exact commands to run the test suite
- **How to test manually** — step-by-step smoke test
- **Review feedback addressed** — PR comments received, analysis, and fix applied
- **Commit message** — ready to paste, follows project conventions
- **Feedback signal** — observations from execution worth feeding back into shared
  artifacts, classified by type: context (priming gaps), instruction (prompt quality),
  workflow (interaction patterns), failure (root causes)

---

## How it is produced

```
After executing the impl-guide, ask the agent:

  "Create the execution report as docs/[STORY-ID]-execution-report.md.
   Include: what was built and where, any deviations from the impl-guide
   and why, how to run the app, how to run the tests, how to test
   manually, a compliant git commit message, and any feedback signal
   (context gaps, instruction quality, workflow patterns, failure root
   causes) worth feeding back into shared artifacts."

Update it when PR review feedback arrives:
  Paste the review comment as a prompt.
  Apply the fix.
  Add the outcome to the execution report under 'Review feedback addressed.'
```

Full workflow: `../docs/design-workflow.md`
Two-document rule: `../docs/design-workflow.md#the-two-document-rule`

---

## Design Constraints

- Do not load this file into Copilot — it is a pointer, not context
- Do not fill this file in — the execution report belongs in `docs/`, not here
- Do not record review feedback in a separate analysis file — it goes in the execution report
