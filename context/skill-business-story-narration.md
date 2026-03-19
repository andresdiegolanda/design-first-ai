# Skill: Business Story Narration

> **What this is:** A reusable skill for generating well-formed user stories from technical context.
> **When to load it:** When generating or improving story descriptions for an issue tracker
> (Jira, Linear, Azure DevOps, or equivalent). Load alongside the Layer 5 story context
> file for the current task.
> **How to load it:** `#file:context/skill-business-story-narration.md`

---

## What This Skill Does

Produces two layers for every story:

- **Business description** — written in user-outcome language, no internal component names,
  readable by a product owner with no technical background.
- **Acceptance criteria** — measurable and testable, may reference technical behavior,
  written as Given/When/Then or a checklist.

The separation matters. The business description sets intent. The acceptance criteria set the
contract. Conflating the two produces stories that either over-specify implementation or
under-specify expected behavior.

---

## Inputs — Provide What You Have

| Input | What it contributes |
|-------|---------------------|
| Layer 5 story context | Technical scope, components affected, decisions already made |
| Figma design or exported diagram | Visual representation of the user experience |
| Architecture docs | System boundaries, integration points |
| Existing story title or description | Starting point to translate or improve |

**Figma:** When a design is available, reference it explicitly in your prompt
(`#file:figma-export.png` or paste the link). The design shows what the user experiences —
the business description should describe that experience, not the components rendering it.

---

## Business Description Rules

- Lead with what the user experiences, not what the system does
- No component names, no internal identifiers, no framework references
- No implementation details — no API paths, no event names, no class names
- One to three sentences maximum
- Present tense: "the user can..." not "the user will be able to..."

---

## Acceptance Criteria Rules

- Each criterion is independently verifiable
- Written as Given/When/Then or as a checkbox list
- Technical precision is allowed here — this is the engineer-facing layer
- Cover the happy path, the error path, and any explicit exclusions from scope

---

## Output Format

Produce in this order:

1. **User story statement** — As a / I want / So that
2. **Business description** — 1–3 sentences, plain language
3. **Acceptance criteria** — Given/When/Then or checklist
4. **Technical notes** *(optional)* — information that belongs in the story but not in
   the business description (affected components, API contracts, etc.)

---

## Example

**Before (technical language in story):**
> Story implements configuration change in the analytics provider setup.
> Updates the channel property in the tracking service initializer to read from
> consumer config rather than falling back to a hardcoded default value.
> Affects all downstream consumers of the shared component.

**After (business language):**

**User story statement:**
> As a product team integrating the shared component, I want analytics events to be
> attributed to my application automatically, so that my reporting reflects accurate
> usage without manual correction.

**Business description:**
> When a team deploys the component, analytics events are tagged with their application's
> identifier. No workaround is required. Each consumer sees their own data cleanly
> separated from others.

**Acceptance criteria:**
> - Given a consumer has provided their identifier, when the component initializes,
>   then all analytics events carry that identifier
> - Given no identifier is provided, when the component initializes, then an error
>   is logged and no events are sent with an incorrect default

**Out of scope:** Changes to the analytics event schema or tracking endpoint.

**Technical notes:**
> Affected component: TrackingService initializer. The channel property currently
> falls back to a hardcoded default — fix is to read from consumer-supplied config.
> Tracked under PROJ-1234.

---

## How to Use

Open Copilot Chat with your Layer 5 story context loaded. Ask:

> *"Using the Business Story Narration skill, produce a story description for [story title]."*

Provide whatever inputs you have. Review the business layer before copying into your issue tracker.

---

## Where to Iterate

This skill is a starting point, not a final answer. The output will be close but needs
calibration to how your product owners and stakeholders communicate.

The **Business description rules** section is where language tuning happens. The structure
and output format are stable — don't adjust those until the language quality is consistently
right first.

---

## Design Constraints

- Do not include component names, class names, or API paths in the business description
- Do not combine business description and acceptance criteria into a single section
- Do not list "out of scope" items as acceptance criteria — they are a separate declaration
- Do not write acceptance criteria in passive voice — use Given/When/Then with active subjects
- Do not omit technical notes when implementation details are known — they belong in the story, just not in the business description
