# Layer 0 — Project Context Generation

> **What this is:** A one-time prompt that generates your Layers 1–4 context files by analyzing your codebase.
> **When to use it:** Once, at project onboarding. Again when major architectural changes happen.
> **Output:** Five markdown files that feed directly into the layer structure.

---

## Why This Exists

The layer templates in this folder have placeholders you fill in manually. That works. It also takes time and requires you to know the codebase well already.

This generation prompt inverts the process: give Copilot your codebase, get the context files back. The output is specific to your actual code — not generic descriptions, not guesses. You review and correct; you don't author from scratch.

This is Garg's Knowledge Priming operationalized as a generation step rather than a documentation exercise.

---

## Output Files and Layer Mapping

The generation prompt produces five files. Each maps to specific layers:

| Generated File | Feeds Into | Primary Content |
|----------------|-----------|-----------------|
| `ARCHITECTURE.md` | Layer 1 | App structure, data flow, architectural decisions |
| `TECH_STACK.md` | Layer 1 | Every dependency, version, why it was chosen |
| `CONTEXT.md` | Layer 2 | Framework patterns, env vars, gotchas, how to run |
| `CODEBASE.md` | Layer 2 | File-by-file map, dependencies, entry points |
| `DESIGN_PRINCIPLES.md` | Layer 3 | Conventions, naming, state management, anti-patterns |

After generation, these files become your auto-loaded context (Layers 1–3). Layer 4 (prompt templates) and Layer 5 (story context) are always written manually — they require human intent, not codebase analysis.

---

## The Generation Prompt

### Mode A — Full workspace access (GitHub Copilot workspace)

Use when Copilot can read your files directly via `@workspace`. Paste this as your first Copilot Chat message:

---

```
Analyze this entire codebase and generate five context files for GitHub Copilot.
These files will be loaded as persistent context before every coding session.
Be specific to THIS codebase. Flag anything non-standard or surprising.

Rules:
- Concise bullet points, not paragraphs
- Specific to what you actually find, not generic best practices
- Include a "Design constraints" section in each file listing what Copilot should NEVER propose
- Flag version constraints that affect API usage

---

FILE 1: ARCHITECTURE.md

Sections:
- App identity: what this app does in one sentence
- Architecture pattern: how it is structured (monolith / microservices / edge / etc.)
- Data flow: how a request moves from entry to exit, step by step
- Key components: the major moving parts and what each owns
- Folder structure: diagram with one-line purpose per folder
- Architectural decisions: the non-obvious choices made and why
- Design constraints: what Copilot must never propose (patterns that break this architecture)

---

FILE 2: TECH_STACK.md

Sections:
- Runtime and language: version, any constraints
- Framework and key libraries: name, version, why chosen
- External services and APIs: what they do, how they're accessed
- Dev tooling: build tools, test runners, linters, config files explained
- Version constraints: APIs that changed between versions relevant to this stack
- Design constraints: libraries NOT in use that Copilot will commonly suggest (and must not)

---

FILE 3: CONTEXT.md

Sections:
- Framework-specific patterns: the patterns THIS framework uses (not generic patterns)
  Examples: signals vs. state, loaders vs. fetch, workers vs. serverless functions
- Environment variables: every env var, what it does, which are required vs. optional
- Bindings and external dependencies: any platform-specific bindings (KV, D1, R2, etc.)
- How to run locally: exact commands
- How to build and deploy: exact commands and any gotchas
- Known gotchas: things that are surprising, non-obvious, or have caused bugs
- Design constraints: patterns that look valid but break in this environment

---

FILE 4: CODEBASE.md

Format so Copilot can find the right file without reading everything.

Sections:
- Entry points: where each major feature or flow begins (file path + one line)
- File index: every important file with a one-line description of what it does
- Dependency map: which files import from which (for the most important files)
- What NOT to touch: files or sections that are fragile, generated, or must not be modified
- Design constraints: file placement rules Copilot must follow when creating new files

---

FILE 5: DESIGN_PRINCIPLES.md

Sections:
- Coding conventions: the actual conventions used in this codebase (with examples)
- Naming patterns: files, components, functions, variables — with real examples from the code
- State management: how state is handled, where it lives, what approach is used
- Error handling: the actual pattern used — not what's possible, what's done here
- Testing approach: what is tested, what tooling, what is not tested
- What to avoid: anti-patterns found in or relevant to this codebase
- Design constraints: style rules Copilot must follow to produce code that fits
```

---

### Mode B — No file access (manual paste)

Use when you cannot use `@workspace` — first run on a new machine, or working in Copilot Chat without workspace indexing enabled. Prepare a file bundle and paste it with the prompt.

**Step 1 — Collect these files into a single message:**

```
Paste the following files in order, each preceded by its path:

--- package.json (or equivalent build file) ---
[paste content]

--- README.md ---
[paste content]

--- [your main config file: wrangler.toml / tsconfig.json / application.yml / etc.] ---
[paste content]

--- [2–3 of your most important source files] ---
[paste content]

--- [your folder structure — output of: find . -type f | head -60 or equivalent] ---
[paste output]
```

**Step 2 — Append the generation prompt from Mode A after the pasted files.**

---

## After Generation — What to Do

**1. Review, don't just accept.** The generated files will be mostly right. They will also contain:
- Assumptions about why things were done a certain way (Copilot infers; you know)
- Missing gotchas Copilot couldn't see from the files alone
- Generic "design constraints" that don't reflect your real non-negotiables

**2. Add what's missing.** The most valuable section in each file is "Design constraints." If the generated version is thin, expand it. These are the guardrails that prevent Copilot from proposing plausible-but-wrong code.

**3. Place the files.** Put the generated files in your project root or in a `context/` folder. Configure Copilot to load them automatically (see `../guides/copilot-setup.md`).

**4. Commit them.** These are infrastructure, not notes. They go in version control, they're reviewed like code, and they update when the codebase changes significantly.

---

## Keeping the Files Current

### The retrospective technique

At the end of every session — not just when something went wrong — ask Copilot:

> **"What context were you missing that would have changed your approach?"**

Copilot surfaces the gap between what it assumed and what is actually true in your project: the constraints it inferred, the conventions it guessed at, the decisions it had no way to know. Add each answer directly to the relevant Design Constraints section of the appropriate file.

Each answer narrows the distance between Copilot's model of your codebase and the real thing. The files compound — each task makes the next one cheaper.

### Structured triggers

| Trigger | Action |
|---------|--------|
| New dependency added | Update `TECH_STACK.md` |
| New architectural pattern introduced | Update `ARCHITECTURE.md` and `DESIGN_PRINCIPLES.md` |
| New env var or binding | Update `CONTEXT.md` |
| Major refactor changes file structure | Regenerate `CODEBASE.md` |
| Post-session retrospective ("What context were you missing that would have changed your approach?") | Add answers to the relevant Design Constraints sections |

The retrospective trigger is the most important. Run it after every completed task. A session that produced good output still contains missing context — Copilot just happened to guess right. The next session might not.

---

## Connection to the Rest of the Framework

Once the generated files are in place:

- They replace the manual Layer 1 and Layer 2 templates for your project
- Layer 3 skills can be written against them — the conventions are already documented
- Layer 5 story context references them by section rather than restating them
- Garg's Level 1 Capabilities conversation starts from a shared vocabulary that's already established
- If you use Claude Code and [Superpowers](https://github.com/obra/superpowers), run the Layer 0 generation prompt before the brainstorming skill fires. Superpowers assumes the agent already has codebase context; the Layer 0 output files provide exactly that — architecture, stack, conventions, and design constraints — so the agent works from your actual project rather than training data patterns.

The generation step is the onboarding. Everything else runs on top of it.
