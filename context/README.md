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
| 5 | Story context | **Per story — lives in `docs/[STORY-ID]-impl-guide.md`** (see below) |

**Layers 1 and 2 share a single file: `.github/copilot-instructions.md`.** Copilot loads this automatically at session start when `"github.copilot.chat.codeGeneration.useInstructionFiles": true` is set in `.vscode/settings.json`.

**Layer 5 is the impl-guide, not a standalone context file.** Under the two-document rule, every story produces `docs/[STORY-ID]-impl-guide.md`. This document is both the story context and the design record. It is built iteratively with the agent, reviewed against Garg's five dimensions, then executed. See `../docs/design-workflow.md` for the full workflow.

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

## Layer 4 — Prompt Templates

`layer-4-prompt-templates.md`

Standardized opening prompts for recurring task types. Each template drives toward building an implementation guide before any code is written. Copy, fill in brackets, paste as opening message.

## Layer 5 — Story Context → Implementation Guide

`layer-5-story-context.md` is the **template** for building `docs/[STORY-ID]-impl-guide.md`.

Under the two-document rule, you do not load a separate story context file. Instead:

1. Give the agent the story and `docs/app-description.md`
2. Ask it to build `docs/[STORY-ID]-impl-guide.md` using the template in `layer-5-story-context.md` as structure
3. Iterate until every section is correct
4. Execute

The impl-guide is both the story context (what to build) and the design record (how to build it). It replaces the Layer 5 file as a session artifact — it is a persistent document, not a per-session load.

---

## The Design Constraints Sections

Every context file should contain a "Design constraints" section. This is the difference between a context file that informs and one that actively shapes output.

**Weak priming (informs):**
> "This project uses Fastify."

**Strong priming (shapes):**
> "Do not use Express.js patterns. Do not use `app.use()` middleware syntax. Do not wrap Fastify in a class."

The retrospective technique — ask at the end of every session: **"What context were you missing that would have changed your approach?"** — is how these sections grow. Each answer saved here reduces the system's dependence on any single person's memory.

---

## What Not to Do

Do not fill in all layers before writing any code. The templates will be wrong the first time. Fill them in for real work, correct them as you go, and let them improve through use.

Do not create a separate Layer 5 story context file per session. Use `docs/[STORY-ID]-impl-guide.md` — it persists across sessions and contains the same information, plus the design.
