# How Copilot + Claude Manage Context in Agent Mode

> **Scope:** GitHub Copilot with Claude as the model, in agent mode, inside VS Code.
> This document describes how the agent reads context, why files survive IDE restarts,
> and a concrete document-driven workflow that exploits this model effectively.

---

## The Core Insight

The agent does not work from a cache. It reads your workspace files from disk, on demand,
during every session. When you reference a file by name or path in natural language —
"use the implementation guide in docs/impl-guide.md" — the agent finds that file and reads
it fresh. The file does not need to have been loaded in a previous session. It just needs
to exist on disk.

This means:

- **Closing the IDE loses nothing** — the files are still there
- **Starting a new conversation loses nothing** — the files are still there
- **The conversation history is the only thing that doesn't survive** — but if you wrote
  the outputs to files, you don't need the conversation history

Context is not something you manage. It is your workspace. Keep the workspace clean and
well-documented, and the agent always has what it needs.

---

## What the Agent Reads

In agent mode, the agent can autonomously access:

- Any file in your workspace, referenced by path in natural language
- `.github/copilot-instructions.md` — read automatically on session start
- Files it determines are relevant to the current task (autonomously, without being asked)

You do not need `#file:` tags. Natural language is sufficient:

> "Follow the implementation guide in docs/impl-guide.md"
> "Use the application description in docs/app-description.md as context"
> "The tests are in src/test — run them and report results"

The agent reads these files from disk. If you open a new conversation tomorrow and say the
same thing, the agent reads the same files from disk. The outcome is identical.

---

## A Document-Driven Workflow

The following workflow uses this model deliberately. Each step produces a markdown file.
Each file is both a human-readable artifact and the input to the next step.

```
STEP 1 — Application description
  Input:   The codebase (workspace files)
  Ask:     "Build an md explaining this application."
  Output:  docs/app-description.md
  Purpose: Establishes shared vocabulary. The agent reads this in every
           subsequent step. You read it to verify the agent understood correctly.

STEP 2 — Implementation guide
  Input:   The story + app-description.md
  Ask:     "Given the application description in docs/app-description.md and
            this story [paste story], build an implementation guide. The guide
            must be usable as a prompt input and understandable by a human."
  Output:  docs/impl-guide.md
  Purpose: The design conversation, compressed into a document. Contains scope,
           components, interactions, contracts, and any constraints. Review and
           clarify until every part is understandable.

           If anything is unclear: "In impl-guide.md, section X is unclear —
           rewrite it so [reason]." Iterate until the guide is correct.

STEP 3 — Execution
  Input:   impl-guide.md
  Ask:     "Execute the implementation guide in docs/impl-guide.md. Run the
            tests to verify everything works. Then create a new document
            explaining what you did, any differences from the guide, how to
            run the app, how to run the tests, how to test manually, and
            include a compliant git commit message."
  Output:  Code in the expected locations + docs/execution-report.md
  Purpose: The agent implements against the guide. The execution report is the
           permanent record: what was built, how it deviates from the plan (if
           it does), and everything needed to operate and verify the result.
```

---

## Why This Works Across Sessions

Each document is a checkpoint. The agent can re-enter the workflow at any point:

| Scenario | What you do |
|----------|-------------|
| IDE closed and reopened | Reference the existing docs by name — agent reads from disk |
| New conversation, same task | "Continue from impl-guide.md" — agent reads it fresh |
| Colleague picks up the work | Same files, same natural language references, same outcome |
| Implementation needs a fix | "Refer to execution-report.md, fix [issue], update the report" |

No session state is required. The documents are the session state.

---

## The Role of `.github/copilot-instructions.md`

This file is auto-loaded on every session start, before you type anything. It is the one
piece of context that loads without you asking for it.

Use it for project-wide constraints that apply to every task — stack, naming conventions,
anti-patterns. Keep it short. Everything task-specific belongs in the implementation guide,
not here.

---

## What Gets Lost and What Doesn't

The only thing that does not survive a closed session is the conversation history — the
back-and-forth exchanges that weren't written to a file. If you wrote the outputs to files,
you have everything.

| What | Survives closing IDE | Why |
|------|---------------------|-----|
| `.github/copilot-instructions.md` | ✓ | File on disk, auto-loaded next session |
| `docs/app-description.md` | ✓ | File on disk, agent reads on reference |
| `docs/impl-guide.md` | ✓ | File on disk, agent reads on reference |
| `docs/execution-report.md` | ✓ | File on disk, agent reads on reference |
| Generated source code | ✓ | Files on disk |
| Conversation history | ✗ | Never written to disk |
| Clarifications made mid-conversation | ✗ unless written to a file | Live only in the session |

**Implication:** When you clarify or correct the implementation guide mid-session, write
the correction to the file immediately. Do not rely on the conversation history to carry
it forward. The file is permanent. The conversation is not.

---

## Comparison with Tag-Based Context Loading

Some documentation describes an alternative approach using `#file:` tags to explicitly
load files into the context window:

```
#file:context/layer-3-skills.md
#file:context/layer-5-story-context.md
```

This approach works but requires manual management — you track which files are loaded,
reload them if the context window fills, and rebuild the state after each session restart.

In agent mode, this management is unnecessary. The agent reads files from disk when they
are referenced in natural language. The document-driven workflow above produces the same
outcome with less overhead: each document is written once, referenced by name, and readable
by both the agent and any human who needs to understand the work.

---

## The Design-First Connection

This workflow runs **alongside** the Design-First framework, not instead of it. The
framework provides the structure for what goes into the implementation guide — scope,
components, interactions, contracts. The document-driven workflow provides the mechanism
for producing and persisting it. Use both together: work through the design levels to
produce a rigorous implementation guide, then hand the guide to the agent for execution.

| Framework concept | Document-driven equivalent |
|-------------------|---------------------------|
| Layer 0 — codebase analysis | `docs/app-description.md` |
| Levels 1–4 — design conversation | `docs/impl-guide.md` |
| Level 5 — implementation | Agent executes impl-guide.md |
| `conversation/design-conversation.md` | `docs/execution-report.md` |

The implementation guide is the spec document. The execution report is the record.
Both are permanent. Both can be read by the next engineer, the next agent session,
or the next conversation without any session history.
