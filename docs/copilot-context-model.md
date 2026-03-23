# How Copilot + Claude Manage Context in Agent Mode

> **Scope:** GitHub Copilot with Claude as the model, in agent mode, inside VS Code.
> This document explains how the agent reads context and what survives session boundaries.
> For the design and execution workflow, see `docs/design-workflow.md`.

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

> "Follow the implementation guide in docs/[STORY-ID]-impl-guide.md"
> "Use the application description in docs/app-description.md as context"
> "The tests are in src/test — run them and report results"

The agent reads these files from disk. If you open a new conversation tomorrow and say the
same thing, the agent reads the same files from disk. The outcome is identical.

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
| `docs/[STORY-ID]-impl-guide.md` | ✓ | File on disk, agent reads on reference |
| `docs/[STORY-ID]-execution-report.md` | ✓ | File on disk, agent reads on reference |
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
#file:context/skills/skill-error-handling.md
#file:docs/[STORY-ID]-impl-guide.md
```

This approach works but requires manual management — you track which files are loaded,
reload them if the context window fills, and rebuild the state after each session restart.

In agent mode, this management is unnecessary. The agent reads files from disk when they
are referenced in natural language. Write documents once, reference them by name, and they
are readable by both the agent and any human who needs to understand the work.
