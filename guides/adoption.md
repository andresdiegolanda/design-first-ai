# Adoption Guide — Starting Small

The full framework has files across six layers and five levels. Start with one thing. Add the rest when the first thing delivers value.

> **Shortcut for existing codebases:** Skip to the bottom of this file. Layer 0 generates the first four layers for you in one session.

---

## Week 1 — One Layer

Pick Layer 1. Fill in the template (`../context/layer-1-base-instructions.md`) for your current project. Configure your AI tool to load it automatically (see `tool-setup.md`).

That's it. You now have persistent project context. Your AI assistant stops generating Express.js patterns for your Fastify project, or class-based services for your functional codebase.

**What to fill in:** Project identity, tech stack with versions, three to five non-negotiables, and the things your project explicitly is not. Skip the sections you don't have answers for yet.

**Measure:** How many corrections did you make to AI-generated code this week compared to last week?

---

## Week 2 — Add Layer 2

Add your file-pattern conventions (`../context/layer-2-file-patterns.md`). Project structure, naming rules, one real code example from your actual codebase.

You now have the Knowledge Priming baseline Garg describes. The AI generates code that fits your project without being told every time.

**What to include:** The directory tree (two levels is enough), naming conventions as a table, one canonical example of a service or handler written the way your team writes them.

**Measure:** How long does it take to get a usable first draft from AI?

---

## Week 3 — Add Layer 5

Before your next story, write a Layer 5 file (`../context/layer-5-story-context.md`). It should take 10 minutes. Load it at the start of the AI session.

Notice how the first AI response changes. It already knows what you're building, what's out of scope, and what decisions were made upstream.

**What to include:** What must be built (specific), what is explicitly out of scope, constraints that apply to this task, decisions already made that this task must respect, and any open questions the design conversation should resolve.

**Measure:** How many back-and-forth corrections before the AI understands the task?

---

## Week 4 — Add One Level

Add Level 4 (Contracts) to your next feature session. Before asking for implementation, ask for method signatures and types only. Review them. Approve them. Then ask for implementation.

You don't need all five levels to start. Level 4 alone catches the most common problem: the AI implemented the wrong interface because you never specified the right one.

**How to do it:** Paste `../levels/level-4-contracts.md` checklist before asking for contracts. Use the approval template at the bottom of that file before proceeding to Level 5.

**Measure:** How many structural changes did you request after seeing the generated code?

---

## When to Add the Rest

**Add Layer 3 (Skills)** when you notice the AI consistently getting one concern wrong — error handling, logging, testing strategy. Write the skill once, load it when relevant. Each skill is a permanent fix for a recurring mistake.

**Add Layer 4 (Prompt Templates)** when you find yourself writing the same type of opening prompt repeatedly. Extract it. Reuse it.

**Add Levels 1–3** when you're building a multi-component feature and the implementation trap has cost you time — scope you didn't ask for, components you didn't want, a flow that doesn't match your architecture.

---

## Shortcut — Layer 0 for Existing Codebases

If you have an existing codebase, Layer 0 generates your Layers 1–4 in one session rather than over four weeks.

Run the generation prompt (`../context/layer-0-generation-prompt.md`) against your codebase. Review the five output files. Place them where your AI tool auto-loads them. You've skipped to Week 4.

The generated files will be mostly right and partly wrong — the AI infers intent, you know the real decisions. The review step is not optional. Pay particular attention to the "Design constraints" sections — those are the guardrails that prevent recurring AI mistakes and are worth expanding beyond what the AI generates.

---

## What Not to Do

Do not fill in all layers before writing any code. The templates will be wrong the first time. Fill them in for real work, correct them as you go, and let them improve through use.

Do not mandate the full framework for your team at once. Introduce Layer 1. Let people use it for a sprint. The value will be visible without argument.
