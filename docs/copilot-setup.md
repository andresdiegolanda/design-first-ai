# Copilot Setup — VS Code + GitHub Copilot

This framework is implemented for **VS Code with GitHub Copilot using Claude Sonnet 4.6**.

---

## Prerequisites

- VS Code 1.90+
- GitHub Copilot subscription (Individual, Business, or Enterprise)
- GitHub Copilot extension installed in VS Code

### Step 1 — Select Claude Sonnet 4.6 as the Copilot model

Open VS Code settings (`Ctrl+,` / `Cmd+,`), search for `copilot chat model`, or add directly to `.vscode/settings.json`:

```json
{
  "github.copilot.chat.defaultModel": "claude-sonnet-4-5"
}
```

> **Model identifier note:** GitHub Copilot uses its own model identifier strings that do not
> always match Anthropic's marketing names. The string `claude-sonnet-4-5` corresponds to
> Claude Sonnet 4.6 in Anthropic's naming. If this identifier is not available in your plan,
> open the model picker in the Copilot Chat panel (the selector at the bottom of the panel),
> find the most recent Claude Sonnet variant listed, and use that identifier in `settings.json`.
>
> **Sonnet vs. Opus:** Sonnet 4.6 is the recommended default — fast enough for iterative
> design conversations, capable enough for complex Java/Spring output. Switch to Opus 4.6
> for tasks requiring deep architectural reasoning where speed is not a concern.
> Opus costs significantly more per token in Copilot Business/Enterprise plans.

### Step 2 — Create the auto-loaded context file

GitHub Copilot loads `.github/copilot-instructions.md` automatically for every Copilot Chat session in the workspace. This is where Layers 1 and 2 live.

Create the file:
```
your-project/
└── .github/
    └── copilot-instructions.md   ← auto-loaded Layer 1 + Layer 2
```

**Run the Layer 0 generation prompt first** (`../context/layer-0-generation-prompt.md`).
Use the generated ARCHITECTURE.md and DESIGN_PRINCIPLES.md as inputs when filling in the structure below.

Minimum content structure for `copilot-instructions.md`:

```markdown
# [Project Name] — Copilot Instructions

## Project Identity
[one sentence: what this app does]
Stack: [language] [version] | [framework] [version] | [key dependencies]

## Architecture
[2–3 sentences: major components and how they interact]
Entry point: [where requests/events enter]
Key constraint: [the most important architectural rule]

## Non-Negotiables
- [rule 1 — something Copilot will violate without this]
- [rule 2]
- [rule 3]

## What This Project Is NOT
- Not [thing Copilot commonly adds that doesn't belong]
- Not [another common addition]

## Code Patterns
[paste your canonical service pattern — 10–15 lines]

## Naming Conventions
- Files: [convention + example]
- Classes: [convention + example]
- Methods: [convention + example]

## Anti-Patterns — Never Propose These
- [pattern 1 — specific enough that Copilot knows exactly what to avoid]
- [pattern 2]
- [pattern 3]
```

Keep it under 150 lines. Focused beats comprehensive.

### Step 3 — Create VS Code workspace settings

Add `.vscode/settings.json` to your project:

```json
{
  "github.copilot.chat.defaultModel": "claude-sonnet-4-5",
  "github.copilot.chat.codeGeneration.useInstructionFiles": true,
  "github.copilot.chat.reviewSelection.enabled": true,
  "github.copilot.renameSuggestions.triggerAutomatically": false,
  "editor.inlineSuggest.enabled": true
}
```

The critical setting is `"github.copilot.chat.codeGeneration.useInstructionFiles": true` — this ensures `.github/copilot-instructions.md` is loaded for code generation, not just chat.

### Step 4 — Load skills per task

Skills are not auto-loaded. In agent mode, reference them by path in natural language.
In chat mode, use `#file:`:

```
# Load a skill relevant to the current task
#file:context/skills/skill-error-handling.md

# Reference the current story's implementation guide
#file:docs/[STORY-ID]-impl-guide.md
```

Alternatively, use the paperclip icon in the Copilot Chat panel to attach files directly.

> **`@workspace` vs `#file:`:** `@workspace` in Copilot Chat searches your entire codebase
> and is useful for discovering existing components. To load a specific context file, always
> use `#file:path/to/file.md` or reference it by path in natural language. These are different
> operations.

### Step 5 — Start the design workflow

With context loaded, follow the three-step workflow in `../docs/design-workflow.md`:

1. Ask the agent to build an app description (`docs/app-description.md`)
2. Give it the story and ask for an implementation guide (`docs/[STORY-ID]-impl-guide.md`)
3. Iterate on the guide until every section is correct, then ask the agent to execute it

**Copilot Chat session boundary:** Starting a new chat clears the conversation but NOT
the auto-loaded `.github/copilot-instructions.md`. Layers 1 and 2 persist. Skills and
the implementation guide must be re-referenced for each new session.

---

## Copilot Chat vs. Inline Suggestions

Two modes in VS Code Copilot. Use them for different things:

| Mode | Use For |
|------|---------|
| **Copilot Chat panel** | Building the app description, iterating the implementation guide, design discussion |
| **Inline suggestions** (`Tab` to accept) | Completing method bodies during agent execution |

Do not rely on inline suggestions for design work — they generate code the moment you
start typing, before any design discussion has happened.

---

## Copilot-Specific Gotchas

**Context window in chat:** Copilot Chat has a limited context window. Long conversations
degrade output quality as earlier content scrolls out. For complex features, start a new
chat session for execution and re-reference the implementation guide explicitly.

**`@workspace` for component discovery:** Using `@workspace` gives Copilot access to
your codebase. Use it when building the implementation guide to ask "what existing
components handle X?" — Copilot will scan your actual files.

**Model availability:** Not all Claude models are available in all Copilot tiers. If
`claude-sonnet-4-5` is unavailable, check the model picker for the current available
identifier. Model identifiers in Copilot change as Anthropic releases new versions.

**Instruction file length:** `.github/copilot-instructions.md` above approximately 200
lines starts to dilute context. If you find yourself adding more, split into the
instructions file + separate skill files loaded per task.

---

## Commit These Files

`.github/copilot-instructions.md` and `.vscode/settings.json` go in version control.

```
.github/copilot-instructions.md   # committed — team-wide AI context
.vscode/settings.json             # committed — shared model configuration
.vscode/extensions.json           # committed — recommends Copilot extension
```

Changes to `copilot-instructions.md` go through pull request review. It is shared
infrastructure — a change to it changes how the entire team uses Copilot.
