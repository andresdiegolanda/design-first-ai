# Design-First AI Collaboration

A practical implementation of Rahul Garg's [Design-First Collaboration](https://martinfowler.com/articles/reduce-friction-ai/design-first-collaboration.html) and [Knowledge Priming](https://martinfowler.com/articles/reduce-friction-ai/knowledge-priming.html) patterns, published on Martin Fowler's site in February–March 2026.

The methodology has no code dependencies — it is pure markdown templates and guides. The `demo-app/` folder contains a buildable Spring AI service used as the methodology baseline (requires Java 21 and Docker). The framework is model-agnostic and works with any AI coding assistant.

---

## The Problem

AI coding assistants collapse design and implementation into one step. You describe a feature, receive 400 lines of code, and discover the AI made a dozen architectural decisions you were never consulted on. Reviewing that code means simultaneously evaluating scope, architecture, integration, contracts, and code quality — all at once, all entangled.

This is what Garg calls the **Implementation Trap**. The fix is to reconstruct the whiteboard conversation that human pairs do naturally: explicit design alignment before any code exists.

---

## Two Complementary Models

### Knowledge Priming — Loading Context Before the Session

Before asking AI to design or build anything, give it the project context it needs. Without this, AI defaults to generic patterns from its training data — the "average of the internet," not your codebase.

This repo implements Knowledge Priming as a **six-layer context architecture**:

| Layer | Content | When Used |
|-------|---------|-----------|
| 0 — Generation | One-time prompt that produces Layers 1–4 from your codebase | Once at project onboarding |
| 1 — Base Instructions | Project-level rules, constraints, non-negotiables | Every session, automatically |
| 2 — File-Pattern Instructions | Language and framework-specific rules | Every session, automatically |
| 3 — Skills | Reusable knowledge patterns (error handling, testing, logging) | Per task, when relevant |
| 4 — Prompt Templates | Standardized workflows for recurring task types | Per task, when relevant |
| 5 — Story Context | Current task: requirements, constraints, decisions already made | Every task, always |

**Layer 0 is the onboarding step.** Run it once against your codebase and it generates Layers 1–4 for you — five specific, accurate context files rather than generic templates filled by hand. For new projects, skip Layer 0 and author Layers 1–4 manually as you make decisions.

### Design-First Collaboration — Structuring the Design Conversation

Once context is loaded, structure the design conversation through five progressive levels before writing any code:

| Level | Question | Output |
|-------|----------|--------|
| 1 — Capabilities | What does this need to do? | Scope, requirements, explicit exclusions |
| 2 — Components | What are the building blocks? | Services, modules, major abstractions |
| 3 — Interactions | How do components communicate? | Data flow, API calls, events |
| 4 — Contracts | What are the interfaces? | Function signatures, types, schemas |
| 5 — Implementation | Now write the code. | Code, generated against agreed design |

**The one rule: no code until Level 5 is approved.**

### How They Fit Together

```
ONBOARDING (once)
─────────────────────────────────────────────────────────
Layer 0: Generation prompt → produces ARCHITECTURE.md
                                      TECH_STACK.md
                                      CONTEXT.md
                                      CODEBASE.md
                                      DESIGN_PRINCIPLES.md

BEFORE EACH SESSION
─────────────────────────────────────────────────────────
Layer 1  (auto-loaded)    Project rules and constraints
Layer 2  (auto-loaded)    File patterns and conventions
Layer 3  (if relevant)    Skill patterns for this task type
Layer 4  (if relevant)    Prompt template for this task type
Layer 5  (every task) ──→ Seeds Level 1 Capabilities

DURING THE DESIGN CONVERSATION
─────────────────────────────────────────────────────────
Level 1: Capabilities     ← seeded by Layer 5 story context
Level 2: Components
Level 3: Interactions
Level 4: Contracts
Level 5: Implementation   ← first code written here

AFTER EVERY SESSION
─────────────────────────────────────────────────────────
Ask: "What context were you missing that would have changed your approach?"
Save answers → Design Constraints sections of relevant layer files
```

The layers eliminate the frustration loop Garg describes in Knowledge Priming. The levels eliminate the implementation trap he describes in Design-First. Neither model alone is complete.

---

## Quick Start

**I have an existing codebase:**
Run the Layer 0 generation prompt (`context/layer-0-generation-prompt.md`) against your project. It produces five context files. Configure your AI tool to load them automatically (`guides/tool-setup.md`). Done in 15 minutes.

**I'm starting a new project:**
Fill in the Layer 1 template (`context/layer-1-base-instructions.md`) manually. Add Layer 2 when you have conventions worth encoding. See `guides/adoption.md` for the week-by-week path.

**I want to see it in action first:**
Open `examples/01-rag-endpoint/conversation/design-conversation.md`. It shows a complete Design-First conversation with real corrections at Level 2 and Level 4 before any code was written.

**I'm ready to work on a task right now:**
Write a Layer 5 story context file using the template (`context/layer-5-story-context.md`). Load it in Copilot Chat. Paste `levels/master-prompt.md` as your opening message. Work through the levels.

**After every session:**
Ask the AI: *"What context were you missing that would have changed your approach?"* Save each answer into the relevant Design Constraints section. The context files improve with every task. The AI that generated generic patterns on day one is working from your actual architecture by week two.

---

## Repository Structure

```
design-first-ai/
├── README.md
├── CHANGELOG.md
│
├── context/                          # Knowledge Priming — layer templates
│   ├── README.md                     # Layer overview and the Design Constraints principle
│   ├── layer-0-generation-prompt.md  # One-time codebase analysis prompt → produces Layers 1–4
│   ├── layer-1-base-instructions.md  # Project identity, stack, non-negotiables, anti-patterns
│   ├── layer-2-file-patterns.md      # Structure, naming, canonical code patterns
│   ├── layer-3-skills.md             # Error handling, testing, logging, RAG pattern
│   ├── layer-4-prompt-templates.md   # New feature / single component / tests / bug / refactor
│   └── layer-5-story-context.md      # Current task — scope, constraints, open questions
│
├── levels/                           # Design-First — conversation level templates
│   ├── README.md                     # Complexity calibration + discipline notes
│   ├── master-prompt.md              # Single opening prompt to set the sequential pattern
│   ├── level-1-capabilities.md       # What to look for + approval template
│   ├── level-2-components.md
│   ├── level-3-interactions.md
│   ├── level-4-contracts.md
│   └── level-5-implementation.md
│
├── examples/                         # Worked examples against the demo app
│   └── 01-rag-endpoint/
│       ├── context/                  # Layer 0 and Layer 5 files loaded for this example
│       ├── conversation/             # Full design conversation with corrections shown
│       └── outcome.md               # What was built, what was caught before implementation
│
├── demo-app/                         # Minimal Spring AI baseline (buildable, Java 21 + Docker)
│
└── guides/
    ├── adoption.md                   # Incremental adoption: start with one layer
    ├── calibration.md               # Which levels for which task complexity
    └── tool-setup.md                # VS Code + Copilot setup (primary) and alternatives
```

---

## The Demo App

A minimal Spring AI service used as the baseline for all examples. One endpoint. One ChatClient call. One VectorStore query. Enough complexity to require design decisions at all five levels. Configured for VS Code + GitHub Copilot. See `demo-app/README.md`.

---

## References

- Rahul Garg, [Design-First Collaboration](https://martinfowler.com/articles/reduce-friction-ai/design-first-collaboration.html), martinfowler.com, March 2026
- Rahul Garg, [Knowledge Priming](https://martinfowler.com/articles/reduce-friction-ai/knowledge-priming.html), martinfowler.com, February 2026
