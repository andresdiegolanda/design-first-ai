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

### Step 4 — Load Layers 3–5 per task

Layers 3–5 are not auto-loaded. Reference them explicitly in Copilot Chat using the `#file:` syntax:

```
# Attach a specific file in the chat panel
#file:context/layer-3-skills.md

# Attach the story context for the current task
#file:context/layer-5-story-context.md
```

Alternatively, use the paperclip icon in the Copilot Chat panel to attach files directly.

For Layer 5 (story context), pasting the content inline is the most reliable method — it keeps the task context visible in the conversation and forces you to read it before the session starts.

> **`@workspace` vs `#file:`:** `@workspace` in Copilot Chat searches your entire codebase
> and is useful for questions like "what existing components handle authentication?" — use it
> at Level 2 (Components) to find reusable code. To load a specific context file, always
> use `#file:path/to/file.md`. These are different operations.

### Step 5 — Use the master prompt

Once context is loaded, paste `../levels/master-prompt.md` (filled in) as your first Copilot Chat message. Copilot Chat maintains conversation history within a session — the level discipline holds as long as you keep the chat panel open and do not start a new conversation mid-task.

**Copilot Chat session boundary:** Starting a new chat clears the conversation but NOT the auto-loaded `.github/copilot-instructions.md`. Layers 1 and 2 persist. Layers 3–5 must be re-loaded for each new chat session.

---

## Copilot Chat vs. Inline Suggestions

Two modes in VS Code Copilot. Use them for different things:

| Mode | Use For | Design-First Role |
|------|---------|-------------------|
| **Copilot Chat panel** | Design conversations, levels 1–4, explaining decisions | Levels 1–5 conversation |
| **Inline suggestions** (`Tab` to accept) | Completing method bodies after contracts are approved | Level 5 only |

Do not use inline suggestions until Level 4 is approved. Inline suggestions are the fastest path to the implementation trap — they generate code the moment you start typing, before any design discussion has happened.

**Recommendation:** During levels 1–4, keep your cursor in a markdown note or a comment block, not in a Java file. This prevents inline suggestions from firing during design conversations.

---

## Copilot-Specific Gotchas

**Context window in chat:** Copilot Chat has a limited context window. Long conversations degrade output quality as earlier levels scroll out of context. For complex features, start a new chat session at Level 5 and re-load the approved contracts explicitly before asking for implementation.

**`@workspace` for component discovery:** Using `@workspace` gives Copilot access to your codebase. Use it at Level 2 (Components) to ask "what existing components handle X?" — Copilot will scan your actual files. This is one of the most underused features for design conversations.

**Model availability:** Not all Claude models are available in all Copilot tiers. If `claude-sonnet-4-5` is unavailable, check the model picker for the current available identifier. Model identifiers in Copilot change as Anthropic releases new versions.

**Instruction file length:** `.github/copilot-instructions.md` above approximately 200 lines starts to dilute context. If you find yourself adding more, split into the file + separate skill files loaded per task with `#file:`.

---

## Commit These Files

`.github/copilot-instructions.md` and `.vscode/settings.json` go in version control.

```
.github/copilot-instructions.md   # committed — team-wide AI context
.vscode/settings.json             # committed — shared model configuration
.vscode/extensions.json           # committed — recommends Copilot extension
```

Changes to `copilot-instructions.md` go through pull request review. It is shared infrastructure — a change to it changes how the entire team uses Copilot.
