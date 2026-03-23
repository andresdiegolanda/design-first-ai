# Copilot Layer 3 — Skills (Framework Repo)

> **What this is:** Reusable knowledge patterns for working on the design-first-ai repo itself.
> **When to load it:** When your task involves writing or editing templates, examples, docs, or skills.
> **How to load it:** `#file:.github/copilot-layer-3-skills.md`

---

## Skill: Writing Layer Templates

Use when: Adding a new layer template or extending an existing one in `context/`.

**Required structure:**

```markdown
# Layer N — [Name]

> **What this is:** [one sentence]
> **Where it lives:** [auto-loaded / per task / every task]
> **How to fill it in:** [one sentence instruction]

---

## [Section 1]

[Bracket placeholder or brief instruction]

## Design Constraints

[What Copilot must never do when using this layer]
```

**Rules:**
- Header block: exactly three lines — what it is, where it lives, how to fill it in.
- Every template ends with a "Design Constraints" section.
- Placeholders use `[BRACKET]` syntax — uppercase, descriptive.
- Include at least one concrete example inside brackets: `[Example: No business logic in controllers]`.
- No filled-in content — templates contain only structure and placeholders.
- Keep under 100 lines. If it exceeds that, compress or split.

**Design Constraints:**
- Do not add Copilot-specific instructions to `context/layer-*.md` — they are tool-agnostic
- Do not fill in placeholder examples with project-specific content — keep them generic
- Do not remove the Design Constraints section — it is mandatory in every template

---

## Skill: Writing Skill Files

Use when: Adding a new skill to `context/skills/`.

**Required structure:**

```markdown
# Skill: [Name]

> **What this is:** [one sentence]
> **When to load it:** [one sentence — the condition that makes this skill relevant]
> **How to load it:** `#file:context/skills/skill-name.md`

---

## What This Skill Does

[One paragraph. The output and its purpose.]

## Rules

[Numbered, imperative. No padding.]

## Pattern

[One or more concrete code or text examples.]

## Design Constraints

[Explicit "Do not..." rules.]
```

**Rules:**
- Skills are stack-agnostic — no framework-specific patterns in `context/skills/`
- Every skill has a concrete pattern section — not just rules
- Design Constraints use "Do not" — not "Avoid", "Prefer", or "Consider"

**Design Constraints:**
- Do not add framework-specific content to `context/skills/` — it belongs in project `.github/copilot-layer-3-skills.md`
- Do not write skills without a Pattern section — rules without examples are not actionable

---

## Skill: Writing Worked Examples

Use when: Adding a new example to `examples/`.

**Required folder structure:**

```
examples/NN-example-name/
└── app/                              ← buildable project (open as own workspace)
    ├── .github/
    │   ├── copilot-instructions.md   ← L1+L2, auto-loaded
    │   ├── copilot-layer-0-architecture.md
    │   ├── copilot-layer-0-design-principles.md
    │   ├── copilot-layer-1-base-instructions.md
    │   ├── copilot-layer-2-file-patterns.md
    │   ├── copilot-layer-3-skills.md
    │   └── copilot-layer-4-templates.md
    ├── docs/
    │   ├── [STORY-ID]-impl-guide.md        ← intention: scope, components, contracts
    │   └── [STORY-ID]-execution-report.md  ← result: what was built, how to run/test
    └── src/
```

**Rules for `docs/[STORY-ID]-impl-guide.md`:**
- Contains scope, components, interactions, contracts — no implementation
- Built iteratively with the agent before any code is written
- Must include at least one correction documented in the execution report

**Rules for `docs/[STORY-ID]-execution-report.md`:**
- Documents what was built, deviations from the impl-guide, and both corrections
- Includes how to run, how to run tests, how to test manually, and a commit message

**Design Constraints:**
- Do not create examples with `conversation/` or `outcome.md` — use `docs/` story documents
- Do not create partial examples — both `docs/` story documents must be present
- Do not put context files in `context/` — all Copilot context goes in `.github/`
- Do not fabricate Layer 0 output — it must reflect the actual project structure

---

## Skill: Writing Design Constraints Sections

Use when: Adding or improving a "Design Constraints" section in any file.

**Format:**
```markdown
## Design Constraints

- Do not [specific action] — [reason if non-obvious]
- Do not [specific action]
```

**Strong vs. weak:**

| Weak | Strong |
|------|--------|
| "Avoid Express.js patterns" | "Do not use `app.use()` middleware syntax" |
| "Keep services focused" | "Do not put HTTP status codes in service methods" |
| "Follow naming conventions" | "Do not use `Manager` or `Helper` as class name suffixes" |

**Rules:**
- Start every constraint with "Do not."
- Specific enough that a violation is unambiguous.
- 4–8 constraints per section.
- Reason only when non-obvious.

**Design Constraints:**
- Do not write constraints as positive instructions — use "Do not", not "Always use"
- Do not duplicate constraints across sections in the same file

---

## Skill: Documentation Compression

Use when: Writing or reviewing any documentation in this repo.

**The compression test:** Does this sentence contain information the reader cannot infer? If no, delete it.

**Patterns to eliminate:**

| Anti-pattern | Replace with |
|-------------|-------------|
| "It is important to note that X" | "X" |
| "Remember to always X" | "X" |
| "In order to do X, you need to Y" | "To X: Y" |
| "The reason for this is that X" | "(reason)" appended inline, or delete |

**Rules:**
- Under one screen per section.
- Never add a section because the document feels light — add it when the information is needed.

**Design Constraints:**
- Do not add introductory sentences that summarize what the section is about to say
- Do not end sections with "See also" links unless the linked document is not otherwise discoverable
