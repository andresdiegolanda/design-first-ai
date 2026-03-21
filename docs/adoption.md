# Adoption Guide — Starting Small

The full framework has files across six context layers. Start with one thing. Add the rest when the first thing delivers value.

> **Shortcut for existing codebases:** Skip to the bottom of this file. Layer 0 generates the first four layers for you in one session.

---

## Week 1 — One Layer

Pick Layer 1. Fill in the template (`../context/layer-1-base-instructions.md`) for your current project. Configure Copilot to load it automatically (see `copilot-setup.md`).

That's it. You now have persistent project context. Copilot stops generating Express.js patterns for your Fastify project, or class-based services for your functional codebase.

**What to fill in:** Project identity, tech stack with versions, three to five non-negotiables, and the things your project explicitly is not. Skip the sections you don't have answers for yet.

**Measure:** How many corrections did you make to Copilot-generated code this week compared to last week?

---

## Week 2 — Add Layer 2

Add your file-pattern conventions (`../context/layer-2-file-patterns.md`). Project structure, naming rules, one real code example from your actual codebase.

You now have the Knowledge Priming baseline Garg describes. Copilot generates code that fits your project without being told every time.

**What to include:** The directory tree (two levels is enough), naming conventions as a table, one canonical example of a service or handler written the way your team writes them.

**Measure:** How long does it take to get a usable first draft from Copilot?

---

## Week 3 — Try the Design Workflow

Before your next story, follow the three-step workflow in `../docs/design-workflow.md`:

1. Ask Copilot to build an app description (`docs/app-description.md`)
2. Give it the story and ask for an implementation guide (`docs/impl-guide.md`)
3. Iterate on the guide until every section is clear, then execute it

Notice how the agent's output changes when it works from an implementation guide that it helped design. The first draft of the code is closer. The corrections are fewer.

**Measure:** How many structural changes did you request after seeing the generated code?

---

## Week 4 — Add Layer 3 Skills

Add a Layer 3 skills file when you notice Copilot consistently getting one concern wrong — error handling, logging, testing strategy. Write the skill once, reference it when relevant. Each skill is a permanent fix for a recurring mistake.

**How:** Copy `../context/layer-3-skills.md` as a starting point. Fill in the patterns specific to your project. Reference it by path in the agent session when the task involves that concern.

**Measure:** Does the same mistake still appear in generated code?

---

## When to Add the Rest

**Add Layer 4 (Prompt Templates)** when you find yourself writing the same type of opening prompt for the impl-guide repeatedly. Extract it. Reuse it.

**Add Layer 5 (Story Context)** when you want a structured template for the story input to the impl-guide. It reduces the information the agent has to infer.

---

## Shortcut — Layer 0 for Existing Codebases

If you have an existing codebase, Layer 0 generates your Layers 1–4 in one session rather than over four weeks.

Run the generation prompt (`../context/layer-0-generation-prompt.md`) against your codebase. Review the five output files. Place them where Copilot auto-loads them. You've skipped to Week 4.

The generated files will be mostly right and partly wrong — Copilot infers intent, you know the real decisions. The review step is not optional. Pay particular attention to the "Design constraints" sections — those are the guardrails that prevent recurring mistakes and are worth expanding beyond what the generation prompt produces.

---

## What Not to Do

Do not fill in all layers before writing any code. The templates will be wrong the first time. Fill them in for real work, correct them as you go, and let them improve through use.

Do not mandate the full framework for your team at once. Introduce Layer 1. Let people use it for a sprint. The value will be visible without argument.

---

## The Long Game — Deletability

Each answer saved to Design Constraints from the retrospective reduces the system's dependence on any single person's memory. The goal is context files that contain enough institutional knowledge that a new engineer loads them and produces expert-level output from day one — without asking anyone, without reading Slack history, without finding the person who originally made the decision.

When that's true, the author can leave. The knowledge stays.

Deletability achieved through iteration, not through documentation sprints.

The document-driven workflow in `docs/design-workflow.md` is deletability at the feature level — the implementation guide and execution report are the permanent record of every design decision, surviving sessions, IDE restarts, and engineer turnover.
