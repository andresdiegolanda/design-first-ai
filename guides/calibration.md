# Calibration — Which Levels to Use

Not every task needs all five levels. This guide helps you decide where to start.

---

## The Complexity Table

| Task Type | Start At | Levels Used | Example |
|-----------|----------|-------------|---------|
| Trivial utility | Level 4 | 4 → 5 | Date formatter, string helper, constant extraction |
| Single method | Level 4 | 4 → 5 | Add a method to an existing service |
| Single component | Level 2 | 2 → 4 → 5 | New service, new controller endpoint |
| Multi-component feature | Level 1 | 1 → 2 → 3 → 4 → 5 | New feature touching controller + service + repository |
| System integration | Level 1 + deep Level 3 | All, with extended Level 3 | New third-party API, event pipeline, new database |

---

## The Deciding Question

Ask: "If the AI designs this wrong, how expensive is it to fix?"

- Fix costs minutes → Start at Level 4 or skip levels entirely
- Fix costs hours → Start at Level 1

The levels are not a ritual. They are a tool for managing the cost of misalignment. Use the minimum that protects you from expensive corrections.

---

## Level 3 Depth

Level 3 (Interactions) deserves extra attention for integrations with external systems. When the data flow involves:
- An external API with non-obvious error behavior
- An event-driven pipeline where ordering matters
- A database transaction spanning multiple operations

...spend more time at Level 3 than the template suggests. Draw out the error paths explicitly. Discover the edge cases before they appear inside 400 lines of generated code.

---

## When to Abort and Restart

If the AI jumps to implementation before you've approved a level, do not continue building on the wrong output. Say:

> "Stop. We are still at Level [N]. I have not approved this level yet. Go back and present only [what Level N produces]."

If the implementation diverges significantly from the approved contracts, do not patch it:

> "This doesn't match what we agreed at Level 4. Regenerate against the approved contracts."

One correct implementation is better than an iteratively-corrected one.
