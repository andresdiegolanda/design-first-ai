---
name: apply-implementation-guide
description: Apply a reviewed implementation guide to the codebase — code, tests, and the execution report — without committing. Use when asked to apply, execute, or implement docs/[STORY-ID]-impl-guide.md or one of its parts.
---

# Skill: Apply Implementation Guide

> **When to load it:** When `docs/[STORY-ID]-impl-guide.md` has been reviewed and has no
> blocking open questions. Inputs: the guide and the workspace. Output: changed code in the
> working tree and `docs/[STORY-ID]-execution-report.md`.

---

## What This Skill Does

Executes the guide's change map against the real code, writes the tests its Verification
section asks for, runs the build and the tests, and records the result in the execution
report: what changed, every deviation, how each acceptance criterion was met, how to run and
test, a commit message, and feedback for the shared artifacts. Adapts to small mismatches
between guide and code. Stops on large ones. Never commits.

---

## Inputs — Only These Two

| Input | Authority on |
|-------|--------------|
| The guide | Scope, what changes, why, and how it is proven |
| The code | What exists — names, paths, line numbers. Wins over the guide on these |

---

## Rules

### Before changing anything

1. Read the whole guide. If it has a blocking open question, stop and list it.
2. If the guide has parts, apply only the part named in the prompt. If none is named,
   apply the first part not yet in the execution report and say which.
3. Run `git status`. Record every file already modified or untracked and leave it untouched.
   If one of them is in the change map, stop and ask.
4. If the guide names a branch for the part and it is not the current branch, stop and ask.
5. Open every file in the change map at its anchor. Search for every symbol the part adds,
   removes, or renames. Compare with the guide — the code may have moved since it was read.

### Deviation gate

6. Adapt and record when the difference is mechanical: a moved line, a renamed file, a
   different import path, one more reference to a symbol the guide already removes.
7. Stop and ask when the difference changes behaviour, security, a public interface, or
   scope, or when a premise of the guide is false. Show `file:line`, what the guide says,
   and what the code says.

### Implement

8. Apply the change map row by row, in order. Match the existing style.
9. Edit nothing outside the change map except the tests rule 10 requires, the report,
   and the guide's Status line.
10. Write the tests the Verification section asks for, in the project's existing test
    framework and style. Never change production code to make a test pass — stop instead,
    unless the guide says so.

### Validate

11. Run the build, the linter if the project has one, the full test suite, and every
    command in Verification. Use the commands the guide records. If it records none, use
    the project's own (build file, package scripts) — never a generic default.
12. Fix failures this change caused. Record failures in code this part did not touch; do not
    fix them.

### Report

13. Create `docs/[STORY-ID]-execution-report.md`. For a later part, add a section for that
    part; leave earlier parts as written.
13a. What Was Implemented: one row per file changed, added, or deleted, sorted by folder
    (repository root first, then each folder path in alphabetical order, files within a
    folder in alphabetical order). Each row: the file, what changed in one line, the
    change-map row it came from. Below the table, a summary: files changed, added, and
    deleted; lines inserted and deleted; what the part did, in two or three sentences.
14. Copy each acceptance criterion from the guide verbatim and give its evidence. If the
    guide has none, write "None in the guide".
15. Commit message: follow the project's convention (instructions, recent history).
    If none, use Conventional Commits with the story ID as scope.
16. In the guide, change only the Status line: `Executed ([PART]) — see docs/[STORY-ID]-execution-report.md`.
17. Stop. List the files changed and the report path.

---

## Pattern

**Opening prompt — one line, the guide and the skill, nothing else:**

```
Apply the implementation guide docs/[STORY-ID]-impl-guide.md using the skill apply-implementation-guide.
```

Everything else the run needs is in this skill or in the guide: the commands, the deviation
gate, the report, what not to touch. The prompt names no branch, no report, no reminder. When
the guide has parts, rule 2 picks the first part not yet in the report; to choose one, add it
after the line: `Part B`.

**Report skeleton:**

`````markdown
# [STORY-ID] — Execution Report
## [SHORT TITLE]

> **Story:** [STORY-ID] · **Guide:** `docs/[STORY-ID]-impl-guide.md` · **Part:** [PART]
> **Status:** [Complete | Stopped — see Deviations]

## What Was Implemented
| Folder | File | Change | Change-map row |
|--------|------|--------|----------------|
| `.` | `[FILE]` | [ONE LINE] | [N] |
| `src/[FOLDER]/` | `[FILE]` | [ONE LINE] | [N] |

**Summary:** [N] files changed, [N] added, [N] deleted · [N] insertions, [N] deletions.
[WHAT THE PART DID, TWO OR THREE SENTENCES]

## Deviations from Implementation Guide
| Guide said | What was done | Why |
[Or: None.]

## Acceptance Criteria
| Criterion (verbatim from the guide) | Met? | Evidence |

## How to Run
[EXACT COMMANDS]

## How to Run Tests
[EXACT COMMANDS] — [SUITES, TESTS, FAILURES]

## How to Test Manually
1. [STEP]

## Review Feedback Addressed
None yet.

## Commit Message
```
[TYPE]([STORY-ID]): [SUMMARY]

[WHAT CHANGED AND WHY]
```

## Feedback Signal
| Type | Observation | Artifact to change |
|------|-------------|--------------------|
| Context | | |
| Instruction | | |
| Workflow | | |
| Failure | | |

*What context were you missing that would have changed your approach?* [ANSWER]
`````

---

## Design Constraints

- Do not stage, commit, push, or switch branches
- Do not edit files outside the change map except tests, the report, and the guide's Status line
- Do not edit, stage, or revert changes that existed before the run
- Do not continue past a deviation that changes behaviour, security, a public interface, or scope
- Do not apply more than one part per run
- Do not write acceptance criteria that are not in the guide
- Do not report a part complete without running the build and the tests
- Do not leave a changed file out of the What Was Implemented table, or list it out of folder order
- Do not put secrets, tokens, credentials, or environment values in the report
- Do not expect anything from the prompt beyond the guide's path and a part: a rule that only works when the prompt repeats it belongs in this skill or in the guide
