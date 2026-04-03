# Design-First AI Collaboration

A practical implementation of Rahul Garg's [Design-First Collaboration](https://martinfowler.com/articles/reduce-friction-ai/design-first-collaboration.html), [Knowledge Priming](https://martinfowler.com/articles/reduce-friction-ai/knowledge-priming.html), [Context Anchoring](https://martinfowler.com/articles/reduce-friction-ai/context-anchoring.html), and [Encoding Team Standards](https://martinfowler.com/articles/reduce-friction-ai/encoding-team-standards.html) patterns, published on Martin Fowler's site in February–March 2026.

The methodology has no code dependencies — it is pure markdown templates and guides. Buildable example apps live inside `examples/` alongside the story documents that produced them. Implemented for VS Code + GitHub Copilot.

> **Diagram rendering:** Several documents in this repo contain **Mermaid** diagrams.
> To render them use a Mermaid-aware viewer: VS Code extension
> [Markdown Preview Mermaid Support](https://marketplace.visualstudio.com/items?itemName=bierner.markdown-mermaid),
> GitHub (renders natively), or [mermaid.live](https://mermaid.live).
> PlantUML diagrams use `@startuml` / `@enduml` syntax and can be rendered with the
> [PlantUML VS Code extension](https://marketplace.visualstudio.com/items?itemName=jebbs.plantuml)
> or [plantuml.com/plantuml](https://www.plantuml.com/plantuml).

---

## The Problem

AI coding assistants collapse design and implementation into one step. You describe a feature, receive 400 lines of code, and discover the AI made a dozen architectural decisions you were never consulted on. Reviewing that code means simultaneously evaluating scope, architecture, integration, contracts, and code quality — all at once, all entangled.

This is what Garg calls the **Implementation Trap**. The fix is to reconstruct the whiteboard conversation that human pairs do naturally: explicit design alignment before any code exists.

A second problem compounds this: two developers on the same team, same codebase, same tool, produce different quality because the senior's judgment lives in her head. The junior asks the AI to "create a notification service." The senior instinctively specifies architecture patterns, error handling, naming, test expectations. Same AI. Different quality gates. The fix is to encode that judgment as versioned, shared instructions that execute for everyone.

---

## Design for Deletion

Every artifact this framework produces must function without the person who created it.

Context files explain the project without the author present. Design documents capture decisions without the meeting. Code follows conventions without the engineer who established them. If any single layer is deleted — person, framework, documents, or code — the remaining layers still function independently.

This is the opposite of tribal knowledge. The expert's value shifts from *being irreplaceable* to *making their knowledge permanent*. The framework succeeds when the author can walk away and nothing breaks.

---

## Four Complementary Patterns

### Knowledge Priming — Loading Context Before the Session

Before asking Copilot to design or build anything, give it the project context it needs. Without this, Copilot defaults to generic patterns from its training data — the "average of the internet," not your codebase.

This repo implements Knowledge Priming as a **six-layer context architecture**:

| Layer | Content | Copilot File | When Loaded |
|-------|---------|--------------|-------------|
| 0 — Generation | One-time prompt that produces Layers 1–4 from your codebase | — | Once at project onboarding |
| 1 — Base Instructions | Project-level rules, constraints, non-negotiables | `.github/copilot-instructions.md` | Every session, automatically |
| 2 — File-Pattern Instructions | Language and framework-specific rules | `.github/copilot-instructions.md` | Every session, automatically |
| 3 — Skills | Reusable skill files in `context/skills/` | `context/skills/skill-*.md` | Per task, on demand |
| 4 — Prompt Templates | Standardized workflows for recurring task types | `context/layer-4-prompt-templates.md` | Per task, on demand |
| 5a — Impl Guide | Intention — scope, components, interactions, contracts | `docs/[STORY-ID]-impl-guide.md` | Per story — built before execution |
| 5b — Execution Report | Result — what was built, deviations, how to run, how to test | `docs/[STORY-ID]-execution-report.md` | Per story — built during execution |

**Layers 1 and 2 share a single Copilot file: `.github/copilot-instructions.md`.** Copilot loads this automatically at session start — no action required. Layers 3–4 are referenced by path when needed: by natural language in agent mode, or `#file:` in chat mode.

**Layer 5 is two documents per story, not one session file.** The impl-guide captures intention before execution. The execution report captures result after. Both live in `docs/` and persist across sessions. See `context/layer-5-impl-guide.md` and `context/layer-5-execution-report.md` for how each is built.

**Layer 0 is the onboarding step.** Run it once against your codebase and it generates Layers 1–4 for you.

### Design-First Collaboration — Design Before Code

No code until the design is agreed. Garg's five design dimensions — scope, components, interactions, contracts, implementation — are the quality bar for a complete design. Each represents a category of decision that should be explicit before any code is written.

This framework implements Design-First through an iterative implementation guide. The guide is built in two or three passes, reviewed against Garg's five dimensions, and handed to the agent for execution only when every section is correct. See `docs/design-workflow.md` for the full workflow.

### Context Anchoring — Making Design Durable

The design conversation produces decisions worth preserving. Context Anchoring is the practice of capturing those decisions in a living document — the implementation guide and execution report — that persists across sessions, survives IDE restarts, and can be read by the next engineer or the next agent without any session history.

The documents are the session state.

### Encoding Team Standards — Making Quality Consistent

Individual context is not enough. When each developer prompts the AI differently, the senior becomes a bottleneck — not because she writes the code, but because she is the only one who knows what to ask for. The solution is to encode her judgment as versioned AI instructions that execute for everyone.

This framework implements Encoding Team Standards through the layer files and skill files themselves. The Design Constraints section in every layer file is the executable standard — not advice to remember, but a rule the agent applies. The skill files in `context/skills/` are the team's reusable instruction sets for recurring concerns. Both live in the repository, change through pull requests, and improve through the retrospective technique after each task.

The retrospective question — *"What context were you missing that would have changed your approach?"* — is the extraction mechanism. Each answer is a constraint that was in someone's head and is now in a file.

### How They Fit Together

```
ONBOARDING (once)
─────────────────────────────────────────────────────────
Layer 0: Generation prompt → produces ARCHITECTURE.md
                                      TECH_STACK.md
                                      CONTEXT.md
                                      CODEBASE.md
                                      DESIGN_PRINCIPLES.md

FOR EACH FEATURE
─────────────────────────────────────────────────────────
Layer 1  }  auto-loaded from .github/copilot-instructions.md
Layer 2  }  (team standards for generation — Pattern 4)
                        ↓
         docs/app-description.md  (once per project)
                        +
         story
                        ↓
         docs/[STORY-ID]-impl-guide.md  ←  iterate until every section
         (scope, components,                is correct and clear
          interactions,
          contracts)
                        ↓
         Agent executes impl-guide
                        ↓
         Code + docs/[STORY-ID]-execution-report.md

AFTER EVERY SESSION
─────────────────────────────────────────────────────────
Ask: "What context were you missing that would have changed your approach?"
Save answers → Design Constraints sections of relevant layer files
              (tacit knowledge → executable standard — Pattern 4)
```

---

## Quick Start

**I have an existing codebase:**
Run the Layer 0 generation prompt (`context/layer-0-generation-prompt.md`) against your project. It produces five context files. Configure Copilot to load them automatically (`docs/copilot-setup.md`). Done in 15 minutes.

**I'm starting a new project:**
Fill in the Layer 1 template (`context/layer-1-base-instructions.md`) manually. Add Layer 2 when you have conventions worth encoding.

**I want to understand the workflow:**
Read `docs/design-workflow.md`. Three-step document-driven process: app description → implementation guide → execution. Includes Garg's five design dimensions as the quality review checklist.

**I want to see how the framework maps to Garg's articles:**
Read `docs/garg-mapping.md`.

**I want to see it in action first:**
Open `examples/01-spring-mvc/app/docs/DEMO-001-impl-guide.md` and `examples/01-spring-mvc/app/docs/DEMO-001-execution-report.md` for the Spring MVC story documents, or `examples/02-angular-component/app/docs/DEMO-002-impl-guide.md` for the Angular example.

**After every session:**
Ask Copilot: *"What context were you missing that would have changed your approach?"* Save each answer into the relevant Design Constraints section. The context files improve with every task.

**Using Claude Code:**
The framework is compatible with Claude Code. The context layers work the same way — files load on natural language reference. For agent execution, [Superpowers](https://github.com/obra/superpowers) by Jesse Vincent pairs naturally with this framework. The implementation guide is the spec document Superpowers' writing-plans skill expects. Layer 0 output primes the agent before the brainstorming skill fires.

---

## Presentation

A 9-slide deck covering the full framework is available at `docs/design-first-ai.pptx`. Use it for team onboarding or chapter demos.

---

## Repository Structure

```
design-first-ai/
├── .github/
│   ├── copilot-instructions.md        # L1+L2 for working on this repo (auto-loaded)
│   ├── copilot-layer-3-skills.md      # L3 skills for working on this repo
│   └── copilot-layer-4-templates.md   # L4 prompt templates for this repo
├── README.md
├── CHANGELOG.md
│
├── context/                           # Knowledge Priming — layer templates (generic)
│   ├── README.md                      # Layer overview, Design Constraints, retrospective technique
│   ├── layer-0-generation-prompt.md   # One-time codebase analysis prompt → produces Layers 1–4
│   ├── layer-1-base-instructions.md   # Project identity, stack, non-negotiables, anti-patterns
│   ├── layer-2-file-patterns.md       # Structure, naming, canonical code patterns
│   ├── layer-3-skills.md              # Skills model explanation + index
│   ├── layer-4-prompt-templates.md    # New feature / single component / tests / bug / refactor
│   ├── layer-5-impl-guide.md          # Discovery doc — what the impl-guide is and how to build it
│   ├── layer-5-execution-report.md    # Discovery doc — what the execution report is and how to build it
│   └── skills/                        # Reusable skill files — Garg's executable team standards
│       ├── README.md
│       ├── skill-error-handling.md
│       ├── skill-testing.md
│       ├── skill-logging.md
│       ├── skill-configuration.md
│       ├── skill-business-story-narration.md
│       ├── skill-refactoring.md       # Team standards for improving existing code
│       ├── skill-security-review.md   # Team threat model as executable instruction
│       └── skill-code-review.md       # Team quality gate as executable instruction
│
├── examples/                          # Worked examples — story documents + buildable app
│   ├── 01-spring-mvc/                 # Spring Boot 3.4 | Java 21 | no DB | no Docker
│   │   └── app/                       # Buildable app (requires Java 21 + Maven only)
│   │       ├── .github/               # All Copilot context (layers 0–4)
│   │       └── docs/                  # Story documents (impl-guide, execution-report)
│   └── 02-angular-component/          # Angular 17 | TypeScript | RxJS | standalone
│       └── app/                       # Buildable app (requires Node 18+ only)
│           ├── .github/               # All Copilot context (layers 0–4)
│           └── docs/                  # Story documents (impl-guide, execution-report)
│
└── docs/
    ├── garg-mapping.md               # How Garg's four articles map to this framework
    ├── design-workflow.md            # Primary workflow: impl-guide + agent execution
    ├── copilot-context-model.md      # How Copilot + Claude manage context in agent mode
    ├── copilot-setup.md              # VS Code + GitHub Copilot configuration
    └── design-first-ai.pptx          # 9-slide framework overview deck
```

---

## The Example Apps

Each example in `examples/` contains a complete, buildable app alongside the story documents that produced it. Open `examples/NN-name/app/` as its own VS Code workspace.

**01-spring-mvc** — Spring Boot 3.4.3 | Java 21 | spring-boot-starter-web. In-memory product catalog CRUD API. Requires Java 21 + Maven only — no Docker, no API key. See `examples/01-spring-mvc/app/README.md`.

**02-angular-component** — Angular 17 | TypeScript 5.4 | RxJS 7.8 | standalone components. Debounced user search with explicit loading/error/empty states. Requires Node 18+ only. See `examples/02-angular-component/app/README.md`.

---

## References

- Rahul Garg, [Encoding Team Standards](https://martinfowler.com/articles/reduce-friction-ai/encoding-team-standards.html), martinfowler.com, March 2026
- Rahul Garg, [Design-First Collaboration](https://martinfowler.com/articles/reduce-friction-ai/design-first-collaboration.html), martinfowler.com, March 2026
- Rahul Garg, [Knowledge Priming](https://martinfowler.com/articles/reduce-friction-ai/knowledge-priming.html), martinfowler.com, February 2026
- Rahul Garg, [Context Anchoring](https://martinfowler.com/articles/reduce-friction-ai/context-anchoring.html), martinfowler.com, 2026
