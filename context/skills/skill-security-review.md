# Skill: Security Review

> **What this is:** The team's threat model as an executable instruction.
> **When to load it:** When checking code for security issues before merge or during review.
> **How to load it:** Reference by path in agent mode, or `#file:context/skills/skill-security-review.md`

---

## What This Skill Does

Applies a structured security check to a piece of code using the team's prioritised threat
model. Produces a categorised findings report: critical issues (block merge), important
concerns (must address before merge), and advisories (track and evaluate). The categories
encode the team's judgment about severity — not a generic checklist.

**Populate the Design Constraints section below with your team's specific threat model.**
The placeholders are a starting structure. A security skill without project-specific
constraints is generic and less useful than running a standard scanner.

---

## Rules

1. Check in priority order: critical first, then important, then advisory. Stop and
   report critical issues immediately — do not continue to lower priority items.
2. State the specific line or pattern, not a general observation. "Line 47 passes
   `userId` directly into the query string" not "SQL injection risk present."
3. Distinguish confirmed issues from suspected issues. Flag where you cannot determine
   risk without runtime context.
4. Do not propose fixes in the same pass. Findings first. Fixes are a separate prompt.
5. Cover every external boundary in the code under review: HTTP inputs, database queries,
   file system operations, external API calls, environment variables.

---

## Pattern

Opening prompt structure:

```
Review the following code for security issues.

Apply the security review skill at context/skills/skill-security-review.md.

Code under review:
[paste the code]

Context:
- Entry point: [HTTP endpoint / background job / CLI / other]
- Caller trust level: [authenticated user / anonymous / internal service]
- Data sensitivity: [PII / financial / internal / public]
```

Response structure the skill produces:

```
## Critical — Block Merge
[Finding]: [specific location] — [what the risk is]

## Important — Address Before Merge
[Finding]: [specific location] — [what the risk is]

## Advisory — Track and Evaluate
[Finding]: [specific location] — [what the risk is, why it is lower priority]

## Boundaries checked
- HTTP inputs: [checked / not present]
- Database queries: [checked / not present]
- File system: [checked / not present]
- External API calls: [checked / not present]
- Environment / secrets: [checked / not present]
```

---

## Design Constraints

Replace the placeholders below with your team's specific threat model. These are the
checks the team applies instinctively — the ones a senior would catch without consulting
a checklist.

**Critical (block merge):**
- Do not allow [YOUR CRITICAL CHECK 1 — e.g. SQL injection via unparameterised queries]
- Do not allow [YOUR CRITICAL CHECK 2 — e.g. missing authorization on data-modifying endpoints]
- Do not allow [YOUR CRITICAL CHECK 3 — e.g. secrets hardcoded in source]

**Important (must address before merge):**
- Do not allow [YOUR IMPORTANT CHECK 1 — e.g. input validation missing on public endpoints]
- Do not allow [YOUR IMPORTANT CHECK 2 — e.g. sensitive data logged at DEBUG or INFO level]

**Advisory (track and evaluate):**
- Flag [YOUR ADVISORY CHECK — e.g. overly broad CORS configuration]

**Generic checks this skill does NOT replace:**
- Do not use this skill as a substitute for automated SAST scanning
- Do not use this skill for cryptographic implementation review — that requires a specialist
