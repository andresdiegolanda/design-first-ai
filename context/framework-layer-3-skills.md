# Layer 3 — Skills (Framework Repo)

> **What this is:** Reusable knowledge patterns for working on the design-first-ai repo itself.
> **When to load it:** When your task involves writing or editing templates, examples, guides, or skills.
> **How to use it:** Reference the relevant skill in your Layer 5 story context, or load the whole file when multiple skills apply.

---

## Skill: Writing Layer Templates

Use when: Adding a new layer template or extending an existing one in `context/`.

**The required structure for every layer template:**

```markdown
# Layer N — [Name]

> **What this is:** [one sentence]
> **Where it lives:** [auto-loaded / per task / every task]
> **How to fill it in:** [one sentence instruction]

---

## [Section 1]

[Bracket placeholder or brief instruction]

## [Section 2]

[Content]

## Design Constraints

[What Copilot must never do when using this layer]
```

**Rules:**
- Every template must have a header block (the `>` blockquote) with exactly three lines: what it is, where it lives, how to fill it in.
- Every template must end with a "Design Constraints" section.
- Placeholders use `[BRACKET]` syntax — uppercase, descriptive.
- Include at least one concrete example inside brackets to show the format. Example: `[Example: No business logic in controllers]`.
- No filled-in content — templates contain only structure and placeholders.
- Keep under 100 lines. If it exceeds that, split into two templates or compress.

**Design Constraints:**
- Do not add Copilot-specific instructions to `context/layer-*.md` templates — they are tool-agnostic
- Do not fill in placeholder examples with demo-app-specific content — keep them generic
- Do not remove the Design Constraints section — it is mandatory in every template

---

## Skill: Writing Level Templates

Use when: Adding a new level template or modifying an existing one in `levels/`.

**Structure for every level template:**

```markdown
# Level N — [Name]

## Purpose

[One sentence: what question this level answers and what it produces]

## What to Look For

[Checklist of things to verify before approving this level and moving to the next]

## Approval Template

> "Level [N] approved. [Summary of what was agreed]. Proceed to Level [N+1]."
```

**Rules:**
- Level templates are conversation guides, not checklists to copy verbatim.
- "What to Look For" should contain 4–8 items — enough to be useful, not so many that approving becomes bureaucratic.
- The Approval Template must be present on every level. It is what closes the level cleanly.
- Level 5 (Implementation) approval template is different — it opens rather than closes: "Approved. Generate the implementation now."
- Do not add implementation examples to levels 1–4 — code belongs in Level 5 only.

**Design Constraints:**
- Do not add tool-specific instructions (e.g. "In Copilot Chat, say...") to level templates
- Do not add "what to avoid" sections — that belongs in Design Constraints sections of context files

---

## Skill: Writing Worked Examples

Use when: Adding a new example to `examples/`.

**Required folder structure:**

```
examples/NN-example-name/
├── context/
│   ├── layer-0-[generated-file].md   ← one or more Layer 0 output files
│   ├── layer-1-base-instructions.md  ← filled-in Layer 1 for this example's project
│   └── layer-5-story-context.md      ← the task-specific context
├── conversation/
│   └── design-conversation.md        ← the full Level 1–5 conversation
└── outcome.md                        ← what was built and what was caught
```

**Rules for `conversation/design-conversation.md`:**
- Show the full exchange — both the human side and the Copilot response at each level.
- Include at least one correction at Level 2 or Level 4 — the value of the methodology is that corrections happen before code. An example with zero corrections is not useful.
- Do not fabricate corrections — they must reflect a real design decision gap.
- Format: alternating `**You:**` and `**Copilot:**` blocks. Keep Copilot responses tightly summarized — show structure, not verbatim output.

**Rules for `outcome.md`:**
- Must include a table of "What the design conversation prevented" with three columns: Problem / Level caught / Cost if discovered at Level 5.
- Must include a section on what the Layer 0 files specifically added — not generic praise, a concrete before/after.
- Must include a note on any Level 5 corrections needed — if zero, say so.

**Design Constraints:**
- Do not create partial examples — all three folders must be present
- Do not use the demo-app as the example project without linking to it clearly
- Do not fabricate Layer 0 output — it must reflect the actual project structure

---

## Skill: Writing Design Constraints Sections

Use when: Adding or improving a "Design Constraints" section in any file.

**What a design constraint is:**
An explicit statement of what Copilot must never propose. Not a guideline. Not a preference. A rule.

**Format:**
```markdown
## Design Constraints

- Do not [specific action] — [reason if non-obvious]
- Do not [specific action]
- Do not [specific action]
```

**Strong vs. weak:**

| Weak (avoid) | Strong (use) |
|-------------|-------------|
| "Avoid Express.js patterns" | "Do not use `app.use()` middleware syntax" |
| "Keep services focused" | "Do not put HTTP status codes in service methods" |
| "Follow naming conventions" | "Do not use `Manager` or `Helper` as class name suffixes" |

**Rules:**
- Start every constraint with "Do not" — not "Avoid", "Try to", "Prefer", or "Consider".
- Be specific enough that a violation is unambiguous. If you cannot tell from the code whether it violates the constraint, the constraint is too vague.
- 4–8 constraints per section. More than 8 means the priming document is doing too much.
- Add the reason only when non-obvious. "Do not use `var`" needs no reason. "Do not create service interfaces" needs: "— no interface unless multiple implementations exist."

**Design Constraints:**
- Do not write constraints as positive instructions ("Always use X") — use negative form ("Do not use Y")
- Do not add duplicate constraints across sections in the same file

---

## Skill: Documentation Compression

Use when: Writing or reviewing any documentation in this repo.

**The compression test:**
Read each sentence. Ask: does this sentence contain information the reader cannot infer? If no, delete it.

**Patterns to eliminate:**

| Anti-pattern | Replace with |
|-------------|-------------|
| "It is important to note that X" | "X" |
| "Remember to always X" | "X" |
| "You should make sure to X" | "X" |
| "This ensures that X will happen" | "X" |
| "In order to do X, you need to Y" | "To X: Y" |
| "The reason for this is that X" | "(reason is X)" appended inline, or delete |

**Section length:**
- Under one screen per section is the target.
- If a section exceeds one screen, identify what can be cut or split.
- Never add a section because the document "feels light" — add it when the information is needed.

**Design Constraints:**
- Do not add introductory sentences that summarize what the section is about to say — start with the content
- Do not end sections with "See also" links unless the linked document is not otherwise discoverable
