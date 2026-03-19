# Design-First AI Collaboration

A practical implementation of Rahul Garg's [Design-First Collaboration](https://martinfowler.com/articles/reduce-friction-ai/design-first-collaboration.html) and [Knowledge Priming](https://martinfowler.com/articles/reduce-friction-ai/knowledge-priming.html) patterns, published on Martin Fowler's site in February–March 2026.

The methodology has no code dependencies — it is pure markdown templates and guides. Buildable example apps live inside `examples/` alongside the design conversations that produced them. Implemented for VS Code + GitHub Copilot.

---

## The Problem

AI coding assistants collapse design and implementation into one step. You describe a feature, receive 400 lines of code, and discover the AI made a dozen architectural decisions you were never consulted on. Reviewing that code means simultaneously evaluating scope, architecture, integration, contracts, and code quality — all at once, all entangled.

This is what Garg calls the **Implementation Trap**. The fix is to reconstruct the whiteboard conversation that human pairs do naturally: explicit design alignment before any code exists.

---

## Design for Deletion

Every artifact this framework produces must function without the person who created it.

Context files explain the project without the author present. Design documents capture decisions without the meeting. Code follows conventions without the engineer who established them. If any single layer is deleted — person, framework, documents, or code — the remaining layers still function independently.

This is the opposite of tribal knowledge. The expert's value shifts from *being irreplaceable* to *making their knowledge permanent*. The framework succeeds when the author can walk away and nothing breaks.

---

## Two Complementary Models

### Knowledge Priming — Loading Context Before the Session

Before asking Copilot to design or build anything, give it the project context it needs. Without this, Copilot defaults to generic patterns from its training data — the "average of the internet," not your codebase.

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
Level 4: Contracts        → fill in level-4-spec-template.md on approval
Level 5: Implementation   ← first code written here, against the spec

AFTER EVERY SESSION
─────────────────────────────────────────────────────────
Ask: "What context were you missing that would have changed your approach?"
Save answers → Design Constraints sections of relevant layer files
```

The layers eliminate the frustration loop Garg describes in Knowledge Priming. The levels eliminate the implementation trap he describes in Design-First. Neither model alone is complete.

---

## Quick Start

**I have an existing codebase:**
Run the Layer 0 generation prompt (`context/layer-0-generation-prompt.md`) against your project. It produces five context files. Configure Copilot to load them automatically (`guides/copilot-setup.md`). Done in 15 minutes.

**I'm starting a new project:**
Fill in the Layer 1 template (`context/layer-1-base-instructions.md`) manually. Add Layer 2 when you have conventions worth encoding. See `guides/adoption.md` for the week-by-week path.

**I want to see it in action first:**
Open `examples/01-spring-mvc/conversation/design-conversation.md` for a Java/Spring MVC example, or `examples/02-angular-component/conversation/design-conversation.md` for an Angular example. Both show the full Level 1–5 exchange with corrections caught before any code was written.

**I'm ready to work on a task right now:**
Write a Layer 5 story context file using the template (`context/layer-5-story-context.md`). Load it in Copilot Chat. Paste `levels/master-prompt.md` as your opening message. Work through the levels.

**After every session:**
Ask Copilot: *"What context were you missing that would have changed your approach?"* Save each answer into the relevant Design Constraints section. The context files improve with every task. Copilot that generated generic patterns on day one is working from your actual architecture by week two.

**Using Claude Code:**
The framework is compatible with Claude Code. The layers and levels work the same way — the context files load as project knowledge, the level conversation happens in the chat. See `levels/README.md` for how the framework maps to Superpowers, a Claude Code execution layer that pairs naturally with this design methodology.

---

## Presentation

A 9-slide deck covering the full framework is available at `docs/design-first-ai.pptx`. It walks through the problem, both models, all six layers, all five levels, the design constraints principle, the retrospective technique, and the quick start paths. Use it for team onboarding or chapter demos.

---

## Repository Structure

```
design-first-ai/
├── .github/
│   └── copilot-instructions.md        # L1+L2 for working on this repo (auto-loaded)
├── README.md
├── CHANGELOG.md
│
├── context/                           # Knowledge Priming — layer templates (generic)
│   ├── README.md                      # Layer overview and the Design Constraints principle
│   ├── layer-0-generation-prompt.md   # One-time codebase analysis prompt → produces Layers 1–4
│   ├── layer-1-base-instructions.md   # Project identity, stack, non-negotiables, anti-patterns
│   ├── layer-2-file-patterns.md       # Structure, naming, canonical code patterns
│   ├── layer-3-skills.md              # Error handling, testing, logging, RAG pattern
│   ├── layer-4-prompt-templates.md    # New feature / single component / tests / bug / refactor
│   ├── layer-5-story-context.md       # Current task — scope, constraints, open questions
│   ├── framework-layer-3-skills.md    # L3 skills for working on this repo
│   ├── framework-layer-4-templates.md # L4 prompt templates for working on this repo
│   └── skill-business-story-narration.md # Cross-cutting skill: user story generation
│
├── levels/                            # Design-First — conversation level templates
│   ├── README.md                      # Complexity calibration + Superpowers/Claude Code note
│   ├── master-prompt.md               # Opening prompt template + filled example
│   ├── level-1-capabilities.md        # What to look for + approval template
│   ├── level-2-components.md
│   ├── level-3-interactions.md
│   ├── level-4-contracts.md
│   ├── level-4-spec-template.md       # Fill after Level 4 approval — input to Level 5
│   └── level-5-implementation.md      # Two-pass review: spec compliance then code quality
│
├── examples/                          # Worked examples — design conversation + buildable app
│   ├── 01-spring-mvc/                 # Spring Boot 3.4 | Java 21 | no DB | no Docker
│   │   ├── app/                       # Buildable app (requires Java 21 + Maven only)
│   │   ├── conversation/
│   │   └── outcome.md
│   └── 02-angular-component/          # Angular 17 | TypeScript | RxJS | standalone
│       ├── app/                       # Buildable app (requires Node 18+ only)
│       ├── conversation/
│       └── outcome.md
│
├── docs/
│   └── design-first-ai.pptx          # 9-slide framework overview deck
│
└── guides/
    ├── adoption.md                    # Incremental adoption: start with one layer
    ├── calibration.md                 # Which levels for which task complexity
    └── copilot-setup.md              # VS Code + GitHub Copilot configuration
```

---

## The Example Apps

Each example in `examples/` contains a complete, buildable app alongside the design conversation that produced it. Open `examples/NN-name/app/` as its own VS Code workspace — it has its own `.github/copilot-instructions.md`, `.vscode/` config, and `context/` folder with all layer files filled in for that project.

**01-spring-mvc** — Spring Boot 3.4.3 | Java 21 | spring-boot-starter-web. In-memory product catalog CRUD API. Requires Java 21 + Maven only — no Docker, no API key. See `examples/01-spring-mvc/app/README.md`.

**02-angular-component** — Angular 17 | TypeScript 5.4 | RxJS 7.8 | standalone components. Debounced user search with explicit loading/error/empty states. Requires Node 18+ only — no API key, no Docker. See `examples/02-angular-component/app/README.md`.

---

## References

- Rahul Garg, [Design-First Collaboration](https://martinfowler.com/articles/reduce-friction-ai/design-first-collaboration.html), martinfowler.com, March 2026
- Rahul Garg, [Knowledge Priming](https://martinfowler.com/articles/reduce-friction-ai/knowledge-priming.html), martinfowler.com, February 2026
