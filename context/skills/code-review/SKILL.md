---
name: code-review
description: Team quality gate as executable instruction. Use when reviewing completed work before merge, or when processing PR review comments received from other reviewers.
---

# Skill: Code Review

> **When to load it:** When reviewing completed work before merge, or when responding to
> PR review comments.

---

## What This Skill Does

Applies the team's quality gate to a piece of work. Produces a categorised review report:
breaking issues (block merge), important findings (must address), and suggestions (optional
improvements). The categories encode the team's judgment about what matters — not a
generic style guide. The result is the analysis the senior engineer would produce, applied
consistently regardless of who runs it.

Also handles the inverse: when a PR has received review comments from other reviewers,
this skill classifies each comment and produces the corrected code, suggested reply text,
and a commit message — one prompt per round.

**Populate the Design Constraints section below with your team's specific review criteria.**
The placeholders are a starting structure. The skill without project-specific constraints
produces generic output.

---

## Rules

### Reviewing code before merge

1. Check against the implementation guide first, if present. Deviations from the
   impl-guide are findings. Unrequested additions are findings.
2. Categorise every finding before explaining it. Breaking / important / suggestion —
   stated first, not inferred from tone.
3. One finding per observation. Do not bundle multiple issues into a single comment.
4. Reference the specific file, class, method, or line for every finding.
5. Do not comment on style unless the style violates a project convention in Layer 1 or
   Layer 2. Personal preference is not a review finding.
6. End with a summary: merge / merge with changes / do not merge.

### Responding to reviewer comments

1. Classify each comment before acting: fix (reviewer is right), clarify (code is correct,
   needs a reply with evidence), or discuss (design question, give options with trade-offs).
2. For fixes: apply the corrected code. Do not commit.
3. For clarifications: write reply text citing specific lines or types from the diff.
   Never open with "No." Acknowledge the point first.
4. For style comments (naming, formatting, Javadoc): fix without classifying. Not worth
   the overhead.
5. If the same type of comment appears across multiple PRs: add the rule to
   `.github/copilot-instructions.md`. That turns one reviewer's feedback into a permanent
   team standard.

---

## Patterns

### Pattern 1 — Pre-merge review

```
Review the following code.

Use the /code-review skill.
[Optional: Also load the implementation guide at docs/[STORY-ID]-impl-guide.md
to check for deviations from the agreed design.]

Code under review:
[paste the diff or the relevant files]
```

Response structure:

```
## Breaking — Block Merge
[file/method]: [finding] — [why it blocks merge]

## Important — Address Before Merge
[file/method]: [finding] — [why it matters]

## Suggestions — Optional
[file/method]: [suggestion] — [what it improves]

## Verdict
[Merge / Merge with changes / Do not merge]
[One sentence rationale]
```

---

### Pattern 2 — PR review comment response

**File naming convention:**

```
prXXX-diff-NN.md      ← diff from "Files changed" tab (stays the same until you push)
prXXX-comments-NN.md  ← review comments from "Conversation" tab (new file each round)
```

Where `XXX` is the PR number and `NN` is the round (01, 02, ...).

**Opening prompt:**

```
Read pr[XXX]-diff-[NN].md and pr[XXX]-comments-[NN].md.

Use the /code-review skill.

For each review comment: classify as fix, clarify, or discuss.
- Fix: the reviewer is right — give me the corrected code.
- Clarify: the code is correct — write a reply with evidence from the diff.
- Discuss: it is a design question — give me options with trade-offs.

Apply fixes to the codebase. Do not commit.

Write a document pr[XXX]-comments-[NN]-response.md containing:
- Each comment and its classification
- What was changed and why (for fixes)
- Suggested reply text (for clarifications and discussions)
- A commit message summarising all changes
```

**Output:** Two things — code changes in the working tree (not committed), and
`prXXX-comments-NN-response.md`. Review both before staging.

**Next round:** Push fixes. If new comments arrive:
- Diff changed → new `prXXX-diff-02.md`
- New comments → new `prXXX-comments-02.md`
- Same process. Each round produces its own response document.

---

## Design Constraints

Replace the placeholders below with your team's specific review criteria. These are the
things the senior catches instinctively — the patterns that trigger an immediate rejection
or a required change.

**Breaking (block merge):**
- Do not merge if [YOUR BREAKING CHECK 1 — e.g. error paths are unhandled in methods
  that call external services]
- Do not merge if [YOUR BREAKING CHECK 2 — e.g. public API contract changed without
  updating the impl-guide]
- Do not merge if [YOUR BREAKING CHECK 3 — e.g. test coverage dropped below team threshold]

**Important (must address):**
- Flag if [YOUR IMPORTANT CHECK 1 — e.g. a new component was added that is not in the
  impl-guide scope]
- Flag if [YOUR IMPORTANT CHECK 2 — e.g. naming does not follow project conventions
  from Layer 2]

**What this skill does NOT cover:**
- Do not use this skill instead of running the test suite — tests must pass before review
- Do not use this skill for security review — use the /security-review skill separately
- Do not apply this skill to generated code mid-execution — review happens after the
  feature is complete
