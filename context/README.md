# Context Layers — Knowledge Priming Templates

This folder implements Garg's Knowledge Priming as a structured layer architecture. Load these files into Copilot before starting any design or implementation session.

---

## Two Paths to the Same Destination

**Path A — Generation (recommended for existing codebases):**
Run the Layer 0 generation prompt against your codebase. Get Layers 1–4 produced for you. Review and correct. This is faster and more accurate than writing from scratch.

**Path B — Manual authoring (recommended for new projects):**
Fill in the Layer 1–4 templates with placeholders replaced. Slower, but you're building the context as you make the decisions.

Both paths produce the same result: auto-loaded context that primes Copilot before every session.

---

## Layer Overview

| Layer | File | How Copilot Loads It |
|-------|------|----------------------|
| 0 | Generation prompt | One-time. Produces Layers 1–4 from codebase analysis. |
| 1 | Base instructions | **Auto-loaded** — content goes in `.github/copilot-instructions.md` |
| 2 | File-pattern instructions | **Auto-loaded** — content goes in `.github/copilot-instructions.md` |
| 3 | Skills | Per task — see `context/skills/` for available skills |
| 4 | Prompt templates | Per task — referenced by path in natural language (agent mode) or `#file:` (chat mode) |
| 5a | Implementation guide | **Per story** — `docs/[STORY-ID]-impl-guide.md` — see `layer-5-impl-guide.md` |
| 5b | Execution report | **Per story** — `docs/[STORY-ID]-execution-report.md` — see `layer-5-execution-report.md` |

**Layers 1 and 2 share a single file: `.github/copilot-instructions.md`.** Copilot loads this automatically at session start when `"github.copilot.chat.codeGeneration.useInstructionFiles": true` is set in `.vscode/settings.json`.

**Layer 5 is two documents, not one file.** Every story produces an impl-guide (intention) and an execution report (result). Both live in `docs/`. Neither is loaded as a session file — they are referenced by the agent by path. The files `layer-5-impl-guide.md` and `layer-5-execution-report.md` in this folder are discovery documents that explain how each is built. See `../docs/design-workflow.md` for the full workflow.

**Layers 3–4 are task-specific.** In agent mode, reference them by path in natural language. In chat mode, attach with `#file:`.

See `../docs/copilot-setup.md` for the full configuration walkthrough.

---

## Layer 0 — Generation Prompt

`layer-0-generation-prompt.md`

A one-time prompt that produces your Layers 1–4 by analyzing the codebase. Two modes: full workspace access (Copilot workspace) and manual file paste (any chat interface). Output is five files — ARCHITECTURE.md, TECH_STACK.md, CONTEXT.md, CODEBASE.md, DESIGN_PRINCIPLES.md — each with a "Design constraints" section.

## Layer 1 — Base Instructions

`layer-1-base-instructions.md`

Project-level rules that apply to every session. What the app is, what stack it uses, what is non-negotiable, what it explicitly is not. **Place this content in `.github/copilot-instructions.md`**.

## Layer 2 — File-Pattern Instructions

`layer-2-file-patterns.md`

How code is structured and named in this project. Directory layout, naming conventions, canonical patterns for controllers, services, tests. **Place this content in `.github/copilot-instructions.md`** alongside Layer 1.

## Layer 3 — Skills

`layer-3-skills.md` explains the skills model. Individual skills live in `context/skills/`:

| Skill | File | Load when |
|-------|------|-----------|
| Error Handling | `skills/skill-error-handling.md` | Any method that can fail with a business reason |
| Testing | `skills/skill-testing.md` | Writing any new test or adding coverage |
| Logging | `skills/skill-logging.md` | Adding or reviewing log statements |
| Configuration | `skills/skill-configuration.md` | Adding any externalisable value |
| Business Story Narration | `skills/skill-business-story-narration.md` | Generating or improving user story descriptions |
| Refactoring | `skills/skill-refactoring.md` | Improving existing code without changing behaviour |
| Security Review | `skills/skill-security-review.md` | Checking code against the team's threat model |
| Code Review | `skills/skill-code-review.md` | Applying the team's quality gate to a piece of work |

## Layer 4 — Prompt Templates

`layer-4-prompt-templates.md`

Standardized opening prompts for recurring task types. Each template drives toward building an implementation guide before any code is written. Copy, fill in brackets, paste as opening message.

## Layer 5 — Story Documents

Two discovery files explain how each story document is built:

**`layer-5-impl-guide.md`** — What the implementation guide is, what it contains, and how to
produce it with the agent. The impl-guide captures intention: scope, components, interactions,
contracts. Built before any code is written.

**`layer-5-execution-report.md`** — What the execution report is, what it contains, and how to
produce it. The execution report captures result: what was built, deviations, how to run, how
to test, review feedback addressed. Built during and after execution.

Neither file is loaded into Copilot. Both are discovery documents for the developer.

---

## The Design Constraints Sections

Every context file should contain a "Design constraints" section. This is the difference between a context file that informs and one that actively shapes output.

**Weak priming (informs):**
> "This project uses Fastify."

**Strong priming (shapes):**
> "Do not use Express.js patterns. Do not use `app.use()` middleware syntax. Do not wrap Fastify in a class."

This mechanism is the framework's implementation of Garg's Encoding Team Standards pattern — tacit judgment made explicit and shared. The retrospective technique — ask at the end of every session: **"What context were you missing that would have changed your approach?"** — is how these sections grow. Each answer saved here is a constraint that was in someone's head and is now in the shared infrastructure.

Changes to `.github/copilot-instructions.md` and the layer files are changes to shared infrastructure. Review them through pull requests.

---

## What Not to Do

Do not fill in all layers before writing any code. The templates will be wrong the first time. Fill them in for real work, correct them as you go, and let them improve through use.

Do not load `layer-5-impl-guide.md` or `layer-5-execution-report.md` into Copilot. They are pointers, not context files. The actual documents they describe live in `docs/`.

Do not treat `.github/copilot-instructions.md` as a personal file. It is team infrastructure — a change to it changes how every developer uses Copilot on this project.
