# Skill: Code Review

> **What this is:** The team's quality gate as an executable instruction.
> **When to load it:** When reviewing a completed piece of work before merge.
> **How to load it:** Reference by path in agent mode, or `#file:context/skills/skill-code-review.md`

---

## What This Skill Does

Applies the team's quality gate to a piece of work. Produces a categorised review report:
breaking issues (block merge), important findings (must address), and suggestions (optional
improvements). The categories encode the team's judgment about what matters — not a
generic style guide. The result is the analysis the senior engineer would produce, applied
consistently regardless of who runs it.

**Populate the Design Constraints section below with your team's specific review criteria.**
The placeholders are a starting structure. The skill without project-specific constraints
produces generic output.

---

## Rules

1. Check against the implementation guide first, if present. Deviations from the
   impl-guide are findings. Unrequested additions are findings.
2. Categorise every finding before explaining it. Breaking / important / suggestion —
   stated first, not inferred from tone.
3. One finding per observation. Do not bundle multiple issues into a single comment.
4. Reference the specific file, class, method, or line for every finding.
5. Do not comment on style unless the style violates a project convention in Layer 1 or
   Layer 2. Personal preference is not a review finding.
6. End with a summary: merge / merge with changes / do not merge.

---

## Pattern

Opening prompt structure:

```
Review the following code.

Apply the code review skill at context/skills/skill-code-review.md.
[Optional: Also load the implementation guide at docs/[STORY-ID]-impl-guide.md
to check for deviations from the agreed design.]

Code under review:
[paste the diff or the relevant files]
```

Response structure the skill produces:

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
- Do not use this skill for security review — use skill-security-review.md separately
- Do not apply this skill to generated code mid-execution — review happens after the
  feature is complete
