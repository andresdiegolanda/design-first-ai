---
name: review-pull-request
description: Review a pull request someone else opened, with evidence, ranked findings and the comment to post. Use when asked to review, analyze, or rate a colleague's pull request by number or branch.
---

# Skill: Review Pull Request

> **When to load it:** When a colleague's pull request needs a reviewer's verdict.
> Inputs: the pull request, the repository, and any earlier review of the same work.
> Output: a review report kept outside the reviewed branch, and a comment ready to post.

---

## What This Skill Does

Reviews another person's pull request the way a careful senior reviewer would: with
evidence. Fetches the pull request's head, runs what can run without credentials, checks
every changed file against the code it calls, tests, or configures, and records what
happened to the findings of any earlier review. Produces numbered findings ranked by
severity, each with file and lines, evidence, impact, and a fix that does not create a new
defect; the strengths worth keeping; observations outside the pull request's scope; a
decision; and a summary comment ready to paste. Every claim about runtime behaviour is
either proven by a run or labelled as needing confirmation.

Use `/code-review` instead for your own work before merge, or to answer comments on your
own pull request.

---

## Inputs

| Input | Authority on |
|-------|--------------|
| The pull request's head, fetched by ref | What changed. Line numbers refer to it |
| The code the change calls, tests, or configures | What the change must agree with |
| Earlier reviews of the same work | What was already found, and what to re-check |
| Facts from the requester (environments, owners, planned changes) | What the code cannot show |

---

## Rules

### Establish the scope

1. Fetch the head into its own ref; never check it out over the working tree. Record the
   repository, number, head and base commits, the commits, and the change set.
2. If the base branch or the pull request's page (description, threads, CI status) cannot
   be read, say so, and mark the base as inferred.
3. List every changed file and its kind of change. Number findings only for these files;
   anything else is an observation outside scope, not counted in the totals.
4. If an earlier review exists, give each of its findings this change touches a status:
   addressed, partially addressed, not addressed, changed but still broken, or worsened.

### Verify before judging

5. Run what needs no credentials: install, build, type-check, lint, discover the tests.
   Record each command and its result.
6. If nothing ran against a real environment, say so once, and label every runtime claim
   *needs runtime confirmation*.
7. Check each changed file against its counterpart: the client a test calls, the contract
   a handler implements, the configuration a deployment reads. Cite `file:line` on both
   sides.
8. Check every premise about the surrounding system (a gateway adds a header, a proxy
   strips one, a job cleans up) against code, configuration, or the requester's facts.
   A premise nothing proves is labelled as such and never used as a reason.

### Write the findings

9. One finding per defect: an ID, a title that states the defect, severity, file and
   lines, then **Evidence**, **Impact**, and **Required fix**.
10. High: the change does not do what it claims, or breaks something. Medium: it works
    but proves or protects less than it appears to. Low: clarity, hygiene, consistency.
11. Judge a test by what it would catch. A test that passes for both the correct and the
    broken behaviour is a finding, whatever its name says.
12. Check each required fix against the other findings, the scope, and the facts from the
    requester. A fix must not contradict another finding, and must not keep or add a
    behaviour that is known to be wrong.
13. Name the strengths worth keeping, each with its file or class.

### Decide and hand over

14. Decide: approve, approve with follow-ups, or request changes. Name the findings that
    block.
15. Write the summary comment: what improved in one sentence, the blocking items each
    with its fix, the should-fix items in one paragraph, the nits in one line.
16. Write the report outside the reviewed branch. The pull request's conversation is the
    durable record.
17. Stop. The reviewer posts, approves, or requests changes.

---

## Pattern

**Opening prompt:**

```
Use /review-pull-request.
Repository: [REPOSITORY]   Pull request: #[NUMBER]
Earlier review: [PATH, OR "none"]
Facts the code cannot show: [ENVIRONMENTS, OWNERS, PLANNED CHANGES]
```

**One finding, written to these rules:**

```markdown
### PR42-03: The isolation test makes the same assertions as the continuity test

- **Severity:** High
- **File:** `tests/conversation-isolation.spec` · **Lines:** 8-40

**Evidence** Both tests send a follow-up question and assert status 200 and a non-empty
answer. The service answers any follow-up with non-empty text, with or without history
(`ConversationService:71`).

**Impact** The test passes whether context is kept, lost, or leaked between conversations.

**Required fix** Assert on a value that reflects context (the rewritten query). Run the
continuity case in the same test as a positive control.
```

**Report skeleton:**

````markdown
# PR #[NUMBER] Review: [TITLE]

## Review scope
| Item | Value |
|------|-------|
| Repository · Pull request · Head branch · Head commit · Base · Commits · Change set | |

[What could not be read, and how the base was established.]

| File | Change |
|------|--------|

# 1. Verification performed
| Check | Result |
|-------|--------|

# 2. Executive assessment
[What improved. The blocking issues, one line each.]

| Severity | Count |
|----------|------:|

**Recommended decision:** [APPROVE | APPROVE WITH FOLLOW-UPS | REQUEST CHANGES]

# 3. Status of earlier findings
| Earlier finding | Status | Notes |
|-----------------|--------|-------|

# 4. Findings
## High
## Medium
## Low

# 5. Strengths worth keeping

# 6. Observations outside scope

# 7. Summary comment
> [READY TO PASTE]
````

---

## Design Constraints

- Do not number a finding for a file the pull request did not change
- Do not state runtime behaviour as fact without a run
- Do not rest a finding or a fix on a premise about the surrounding system that nothing proves
- Do not propose a fix that keeps or adds behaviour another finding or the requester's facts show is wrong
- Do not bundle several defects into one finding
- Do not copy secrets, tokens, or credential values into the report — cite the file and line
- Do not post, approve, merge, push, or commit to the reviewed branch
