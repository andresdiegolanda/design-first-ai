# Demo Script — Design-First AI Collaboration (English)

> Translated from the Sebastian/Statum demo. 12 slides.
> Each entry: what the slide shows, what to say, what to watch for in the room.

---

## Slide 1 — Title

**What it shows:** Design-First AI Collaboration. v1.5.0. Your credentials.

**Say:**
> "This is a practical implementation of five patterns published by Rahul Garg on martinfowler.com — the most referenced engineering site in the industry. We're going to look at what the patterns solve, how the framework implements them, and what the difference looks like in actual code."

**Watch:** If they don't know martinfowler.com, one sentence is enough — "it's the reference site for software engineering practices." Don't over-explain before you've earned their attention.

---

## Slide 2 — The Origin

**What it shows:** Martin Fowler and Rahul Garg introductions. Five pattern cards in a 3+2 grid.

**Say:**
> "Rahul Garg spent early 2026 publishing five patterns on how to use AI in engineering teams — not as a productivity tool, but as a collaborator. The patterns address five specific failure modes. This framework is the working implementation of all five."

**Watch:** Don't read the pattern names. Let them see the grid. The point is that these are validated, published patterns — not something invented here.

---

## Slide 3 — Author Validation

**What it shows:** Garg's LinkedIn post (paste screenshot) and his quote: "the greatest compliment a writer can receive."

**Say:**
> "When we sent Garg a link to the implementation, this was his response. He starred the repo and posted publicly. That's not a testimonial we asked for — it's the author of the patterns saying the implementation is correct."

**Watch:** Let the quote breathe. Pause after reading it. This is the credibility slide — don't rush past it.

---

## Slide 4 — The Problem

**What it shows:** Five bullets on the left ("Without context, AI decides for you"). Garg's quote on the right ("You describe a feature, you receive 400 lines of code...").

**Say:**
> "Here's the failure mode everyone has hit. You write a prompt. You get 400 lines of code. You go to review it and discover the AI made architectural decisions — injection patterns, abstractions, data types — that nobody asked for and don't fit the project. Garg calls this the Implementation Trap."

**Watch:** If someone nods, slow down and name what they're nodding at. "Has that happened on a recent story?" One real example from the room lands better than five bullets.

---

## Slide 5 — The Solution: Context in Layers

**What it shows:** Five column cards — L0 through L5 — each with label, description, file path, and loading mechanism. Bottom bar: "Same tool · Same model · Same prompt · The only difference is context."

**Say:**
> "The solution is context. The AI isn't failing — it's generating the average of its training data because it doesn't know your project. These five layers give it that knowledge. Layers 1 and 2 load automatically on every Copilot session. You never have to think about them again after setup. The story documents in Layer 5 are the design contract for each feature."

**Watch:** The bottom bar is the key point. If they push back with "we already prompt well," agree — and point to the bottom bar. Same prompt. Different output. That's the proof.

---

## Slide 6 — Without Context: What Copilot Generates

**What it shows:** Prompt bar. Dark code block with bad output (@Autowired, Page<Product>, repository). Right panel: four decisions nobody asked for, each in coral red.

**Say:**
> "This is the real output. Same prompt, no context. Four decisions the AI made on its own: field injection, an invented repository layer, Spring Data pagination, and Long instead of UUID. Every one of these is wrong for this project."

**Watch:** Go slowly through the right panel. Each item on the list is a potential refactor if it gets merged. Let the cost land before moving to the next slide.

---

## Slide 7 — With Context: Same Prompt, Different Output

**What it shows:** Same prompt bar, now noting `.github/copilot-instructions.md` is loaded. Code block with correct output. Right panel: five enforcements in teal.

**Say:**
> "Same prompt. The only change is the context file is loaded. Constructor injection — private final, no @Autowired. No repository layer. UUID for IDs. Javadoc on the public method. All five of these are in the constraint file. The AI read it and applied it."

**Watch:** Let them compare slides 6 and 7 side by side mentally. If someone asks how the context file is built — that's slide 8. Hold them there.

---

## Slide 8 — The File That Makes the Difference

**What it shows:** Four dark code blocks showing the actual content of `.github/copilot-instructions.md` — Non-Negotiables, Anti-Patterns, What This Project Is NOT, Architecture.

**Say:**
> "This is the file. It's a markdown file in the repo. Copilot reads it automatically at the start of every session — you never reference it manually. It contains the constraints: what's non-negotiable, what the AI must never propose, what the project explicitly is not, and the architecture in three lines. Every rule in this file was written because the AI got it wrong once."

**Watch:** The "## Anti-Patterns — Never Propose" section usually gets a reaction. It's the most direct the file gets. Let them read it.

---

## Slide 9 — The Two-Document Rule

**What it shows:** Two white cards side by side. Document 1 (blue top) = Implementation Guide, BEFORE the code. Document 2 (teal top) = Execution Report, AFTER the code. Arrow between them.

**Say:**
> "Every story produces exactly two documents. The implementation guide is written before any code — scope, components, interactions, contracts. No implementation, no code. The agent executes against it. The execution report is what was actually built: deviations from the guide, how to run it, how to test it, the commit message. These two documents replace the conversation history. They survive session restarts, IDE restarts, engineer changes."

**Watch:** If they ask "why not just write the code?" — that's slide 10. Hold them there.

---

## Slide 10 — Design Corrections: Before the Code

**What it shows:** Two correction cards with coral left border. Each has the problem, the correction, and a dark code block showing the cost if not caught.

**Say:**
> "Here's why the guide matters. During the first draft, the AI used field injection and Long IDs — both wrong. We caught them in the document. One iteration. Zero lines of code touched. If those errors had reached code, the cost would have been every controller, every test, every URL. The earlier you catch a design error, the cheaper it is. At the document level, it's free."

**Watch:** The cost blocks on the right are the argument. Read them aloud slowly. "All controllers + all wiring tests" versus "one line in a markdown file."

---

## Slide 11 — How to Start

**What it shows:** Three numbered cards — Layer 0 (15 minutes), First story, Continuous improvement.

**Say:**
> "Three steps. First: run the Layer 0 prompt against your existing codebase. It analyzes the code and generates the context layers automatically. No code changes, 15 minutes. Second: pick a small feature. Write the implementation guide before the code. The difference is visible in the first session. Third: after every session, ask the AI 'what context were you missing that would have changed your approach?' Each answer improves the files. It compounds."

**Watch:** Step 3 usually generates questions about what "the answer" looks like. The answer is always a constraint — something the AI assumed or guessed that should have been explicit. Write it into the constraint file. Next session it's enforced.

---

## Slide 12 — Next Step

**What it shows:** Dark closing slide. "This ran against a generic CRUD app. The real value is when it runs against your code. If you're interested, next time we do it against one of your features."

**Say:**
> "This demo ran against a generic example — a CRUD app anyone could build. The framework's value multiplies when it runs against a real project with real constraints, real architectural decisions, real naming conventions. If what you've seen is relevant to how your team works, the next step is doing this against one of your own stories."

**Watch:** Don't pitch. State it once and stop. "A las órdenes" energy — available, not pushing. If they're interested, they'll say so. If there's silence, that's fine.

---

## General Notes

**Time:** The deck runs 20–25 minutes at a presentation pace. Slides 6–8 are the technical core — budget 8 minutes there.

**Questions to expect:**
- "Does this work with tools other than Copilot?" — Yes. The layer files are tool-agnostic. Copilot is the implementation; the methodology works with any agent-mode tool.
- "How long does Layer 0 take to set up?" — 15 minutes for an existing codebase. The generation prompt analyzes your code and produces the layer files.
- "What if the team doesn't agree on the constraints?" — That's the conversation the constraint file forces. Writing it down is how you resolve it. Currently it lives in each person's head and never gets resolved.
- "Is the repo public?" — Yes. MIT license. github.com/andresdiegolanda/design-first-ai.
