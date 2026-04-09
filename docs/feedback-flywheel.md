# Feedback Flywheel

> **Pattern:** [Feedback Flywheel](https://martinfowler.com/articles/reduce-friction-ai/feedback-flywheel.html)
> (Rahul Garg, martinfowler.com, 8 April 2026)
>
> **Role in the framework:** Maintenance mechanism for all other patterns. Without active
> feedback, shared artifacts decay. The flywheel turns individual AI session experience
> into collective infrastructure improvement.

---

## The Problem It Solves

Teams plateau with AI tools. They adopt, develop some fluency, and stay there. The same
prompting habits, the same frustrations, the same results month after month. Not because
the tools stop improving, but because the team's practices around the tools stop improving.
Individual developers accumulate intuition — useful phrasings, effective workflows — but
that intuition stays personal. It does not transfer.

The four earlier patterns (Knowledge Priming, Design-First Collaboration, Context
Anchoring, Encoding Team Standards) create surfaces that can absorb learning. The Feedback
Flywheel is the practice of feeding learnings back into those surfaces.

---

## Four Types of Signal

Every AI session generates signal about what the team's artifacts capture well and what
they miss. Each type maps to a specific destination in the framework.

| Signal type | What it captures | Framework destination |
|-------------|-----------------|----------------------|
| **Context signal** | What the AI needed but didn't have — gaps, outdated info, missing conventions | Layers 1–2 (`.github/copilot-instructions.md`), Layer 0 outputs |
| **Instruction signal** | Prompts and phrasings that produced notably good or bad results | Skill files (`context/skills/skill-*.md`) |
| **Workflow signal** | Sequences of interaction that succeeded — conversation structures, task decomposition | `docs/design-workflow.md`, prompt templates (Layer 4) |
| **Failure signal** | Where the AI produced something wrong, and the root cause | Design Constraints sections, anti-pattern lists |

The root cause matters more than the symptom. A failure caused by missing context is a
priming gap. A failure caused by poor instruction is a command gap. A failure caused by a
model limitation is a boundary to document. Each failure points to a specific artifact.

---

## Four Cadences

The feedback loop works at four cadences, each matched to the weight of the update.

### After each session

One question: *did anything happen in this session that should change a shared artifact?*

Often the answer is no. When it is yes, the update is immediate: a line added to the
priming document, a check added to a skill, a note in a story document. Anchor the habit
to an existing checkpoint — closing the PR, closing the editor, the commit itself.

### At the standup

One additional question: *did anyone learn something with the AI yesterday that the rest
of us should know?* Turns one person's discovery into shared practice without adding
another meeting.

### At the retrospective

Agenda item in the existing sprint retrospective: what worked with AI this sprint? What
friction? What will we update? Outputs are concrete: a priming document revision, a skill
refinement, a new anti-pattern documented. The tech lead or designated owner makes the
final call on what gets committed.

### Periodically

Quarterly or when the team senses drift. Which skills are loaded? Which are ignored?
Where are the remaining gaps? Are version numbers current? Are Design Constraints still
accurate?

---

## The Retrospective Question — Extended

The framework already uses one instance of the flywheel:

> *"What context were you missing that would have changed your approach?"*

This captures **context signal**. The flywheel extends it to all four types. A complete
post-session reflection asks:

1. **Context:** What did the AI need that wasn't in the priming document?
2. **Instruction:** Did any prompt phrasing produce notably good or bad results?
3. **Workflow:** Did the conversation structure help or hinder the outcome?
4. **Failure:** Did the AI produce something wrong? What was the root cause?

Not every session warrants all four questions. The discipline is in the habit of asking,
not in the overhead of answering.

---

## What to Measure

Avoid measuring speed or volume — a fast output that requires extensive rework is not a
productivity gain. What matters:

- **First-pass acceptance rate** — how often the AI's initial output is usable without
  major revision
- **Iteration cycles** — how many back-and-forth rounds a task requires
- **Post-merge rework** — how much fixing happens after code ships
- **Principle alignment** — whether the output follows the team's architectural standards

The honest framing: these are difficult to track rigorously. The most reliable indicator
is often qualitative — the declining frequency of "why did the AI do *that*?"

---

## Calibration

Start with the foundational infrastructure first. The feedback loop that improves it comes
after. A team that asks "what should we update?" every two weeks and acts on the answer
will improve faster than a team that designs an elaborate harvesting process and abandons
it when deadlines tighten.

The AI ecosystem evolves on a cadence that makes traditional documentation decay look
glacial. Priming documents, skill files, and Design Constraints deserve the same
maintenance discipline as test suites — not written once and filed alongside onboarding
checklists.

---

## Design Constraints

- Do not create a separate meeting for feedback capture — use existing checkpoints
- Do not conflate all signal types — classify before routing to an artifact
- Do not skip root-cause analysis on failures — the symptom is not the fix
- Do not treat shared artifacts as static — they are living infrastructure
- Do not wait for the retrospective to make small updates — after-session fixes are immediate
