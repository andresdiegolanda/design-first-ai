---
name: create-implementation-guide
description: Build the implementation guide for one story from the story text and the codebase, and nothing else. Use when asked to design, plan, or write an implementation guide (impl-guide) for a story before any code is written.
---

# Skill: Create Implementation Guide

> **When to load it:** When a story is ready and no code has been written for it.
> Inputs: the story file and the workspace. Output: `docs/[STORY-ID]-impl-guide.md`.
> The prompt is one line; the story, the ID, the guide's name and place and every
> convention come from the story file, the workspace and this skill.

---

## What This Skill Does

Turns one story into the design document the agent will execute. The guide states scope,
components, interactions, contracts, and constraints; a change map that names every edit
and where it lands; how each acceptance criterion will be proven; and the questions only a
human can answer. Every statement about existing code is checked against the code and cites
`file:line`. The guide is reviewed and iterated until correct, then handed to
`/apply-implementation-guide`.

---

## Inputs — Only These Two

| Input | What it contributes | Source |
|-------|---------------------|--------|
| The story | ID, intent, acceptance criteria, exclusions, facts about systems the code cannot show | The story file: `story.txt` or `story.html` at the workspace root or in the repository's guide folder, or the file the repository's instructions name. `story.html` is an issue tracker's export of the story (Jira's printable issue view, saved as is); `part.html` beside it, the export of one sub-task, names the part and holds its scope. A file the prompt names, or text pasted into the prompt, only when it says so |
| The code | What exists — structure, conventions, build and test commands, every place a change touches | The workspace: source, tests, build files, `.github/` instructions, `docs/app-description.md` if present |

A fact neither input proves is an open question, not an assumption.

---

## Rules

### Read before writing

1. Open the story file: `story.txt` or `story.html` at the workspace root or in the
   repository's guide folder, or the file the repository's instructions name, unless the
   prompt names a file or pastes the text. If there is no story, stop and ask. Take the
   story ID from it; if it has none, ask before writing.
1a. A tracker export (`story.html`) is read like this: the ID and title from its heading;
    the intent from its description; the acceptance criteria from the field of that name,
    verbatim, without the checkbox marks; the steps from its sub-tasks (key, summary,
    status). People, dates, links, comments and the tracker's own banners are ignored.
    The part to write is the sub-task in progress, or the first one not done; its scope and
    its facts are the section of the description headed with that sub-task's key. If the
    description has no section for it, stop: that is a blocking open question. Sub-tasks
    already done are executed parts and stay as written in the guide.
1b. When `part.html`, the export of one sub-task, sits beside `story.html`, it names the
    part: the part is that sub-task, its description is the part's scope and facts, and the
    story's ID, intent and acceptance criteria still come from `story.html`. With `part.html`
    alone, the story's key is the parent named in its heading, and the guide has no
    acceptance criteria: raise the blocking open question of rule 2.
2. Copy the acceptance criteria verbatim. If the story has none, write "None in the story"
   and raise a blocking open question.
3. Read the project instructions, then the build and test configuration. Record the exact
   build, lint, and test commands the project uses, and the branch and commit read.
4. Open every file the story touches. Search the workspace for every symbol, route, key,
   and file the story adds, removes, renames, or changes. Open every hit.

### Write the guide

5. Write the sections in the order of the skeleton below. Keep each under one screen.
6. Cite `file:line` and the symbol for every statement about existing code.
7. Contracts: signatures, types, and payloads only. No method bodies.
8. Change map: one row per edit, in execution order — file and anchor, what changes, why.
   Every search hit from rule 4 is either a row or listed under "Not changed" with the reason.
9. Split into parts when the story is applied in more than one run: because it ships as more
   than one pull request, or because its steps are applied and reviewed one at a time. Name
   the parts as the story names its steps; otherwise A, B, C. Each part must build and pass
   its tests alone. State what each part depends on.
10. Verification: for each acceptance criterion, the check that proves it — a test to write
    (the behaviour, not the code), a command, or a manual step.
11. Open questions: everything neither input proves. Mark each blocking or non-blocking.
12. If the guide passes ~300 lines, stop and propose a story split under Open questions.

### Hand over

13. Self-check before handing over:
    - Every requirement in the story appears in Scope; nothing else does.
    - Every component appears in Interactions.
    - Every external call has an error path.
    - Every change-map row traces to Scope or Contracts.
    - Every acceptance criterion has a Verification row.
14. Write the guide as `docs/[STORY-ID]-impl-guide.md`, or in the folder the repository's
    instructions name for guides. If that guide exists and its Status says a part is executed,
    keep the executed parts as written and add or rewrite only the part the story file
    describes: one story, one guide, parts added as the story goes. Set Status to
    `Draft — for review` and stop.
15. On review comments, change the guide in place. Where a decision changes, keep one line
    stating what it replaced and why.

---

## Pattern

**Opening prompt — one line, always the same:**

```
Create the implementation guide using the skill create-implementation-guide.
```

The story is in `story.txt`; the ID, the guide's name and place, and every convention come
from the story file, the workspace and this skill, so the prompt repeats none of them. Only
when the story is elsewhere does the prompt say so, after the line: `Story: docs/stories/X.md`,
or the pasted text.

**Guide skeleton:**

````markdown
# [STORY-ID] — Implementation Guide
## [SHORT TITLE]

> **Story:** [STORY-ID] · **Status:** Draft — for review
> **Code read:** [BRANCH] @ [COMMIT] · **Build:** `[COMMAND]` · **Test:** `[COMMAND]`

## Scope
**Must:** [REQUIREMENT — one line each]
**Out of scope:** [EXPLICIT EXCLUSION — one line each]

## Components
| Component | Existing (`file:line`) or New | Purpose |

## Interactions
[One flow per entry point. Error path for every external call.
Mermaid sequence diagram when more than two components take part.]

## Contracts
[Signatures, types, payloads. No bodies.]

## Change Map
| # | Part | File and anchor | Change | Why |
|---|------|-----------------|--------|-----|
| 1 | A | `src/orders/order.service:42` (`cancel`) | Reject cancel when status is `SHIPPED` | Scope: no cancel after shipping |
| 2 | A | `src/orders/order.controller:17` (`cancel` route) | Map the rejection to 409 | Interactions: cancel error path |

**Not changed:** `[FILE:LINE]` — [REASON].

## Parts
| Part | Rows | Pull request | Depends on |

## Verification
| Acceptance criterion (verbatim) | Proven by |

## Constraints
- [DECISION THIS STORY MUST RESPECT] — [SOURCE: story or `file:line`]

## Open Questions
| # | Question | Blocking? | Who can answer |
````

Omit Parts when the story ships as one pull request.

---

## Design Constraints

- Do not state a fact that neither the story nor the workspace proves — make it an open question
- Do not state anything about existing code without `file:line`
- Do not write method bodies, whole files, or test code
- Do not add scope the story does not ask for
- Do not leave a search hit for a changed symbol out of both the change map and "Not changed"
- Do not define a part that cannot build and pass its tests alone
- Do not modify any file except the guide
- Do not split the guide into more than one document
- Do not expect anything from the prompt that the story file, the workspace or this skill already holds: a rule that only works when the prompt repeats it belongs here or in the story
