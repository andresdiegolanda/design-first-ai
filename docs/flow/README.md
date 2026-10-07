# The flow pages — the framework, animated

> **Scope:** two interactive pages that show one story moving through the framework, and the kit
> that built them. The pages illustrate the method; the kit is the example to copy when a project
> needs a picture of a flow that a diagram cannot carry.

---

## The two pages

| Page | What it shows |
|------|---------------|
| `design-first-flow.html` | **With the framework.** One story, DEMO-001 (`examples/01-spring-mvc`), from onboarding to the merged pull request: Layer 0 primes the project, every session starts from files, the design is agreed as a document before any code, the agent executes it, the result is recorded, the lesson is fed back. Eight journeys. |
| `implementation-trap.html` | **Without the framework.** The same scene, the same story: one prompt, four hundred lines, the senior as bottleneck, the session that forgets, the author who leaves. Four journeys, one per trap. |

Open either file in a browser. No server, no network, nothing sent anywhere. The switch at the top
goes to the other page on the same journey; every card links to its counterpart.

**Suggested first visit:** `design-first-flow.html`, journey A (the five patterns in one lap), then
D (design) and E (execution). Then the trap page, journey A, for the contrast.

---

## What is on a page

- **The scene.** Four zones: around the work, the people, the repository, the agent. Components
  inside them, each with a card: what it is, why it matters, what it holds, which journeys stop
  there, and the same component on the other page in one line.
- **Journeys.** A dot moves from stop to stop. Its colour and letters say what it carries: the
  story, a prompt, a layer file, the implementation guide, the execution report, code, a signal.
  The bubble and the footer say what happens; the right panel adds the excerpt, the prompt and the
  source. Verdicts are drawn over the stops where something is decided.
- **Artifacts.** Every document, prompt and signal has a card: who makes it, who reads it, where it
  lives, how long it lasts. Picking one outlines where it sits and the lines it travels.
- **Marks.** On the framework page, the pattern each component belongs to (priming, design-first,
  anchoring, standards, flywheel). On the trap page, the trap number (① to ④).
- **Learn.** The current journey as plain text (for a document or a slide), the five dimensions of a
  design, the six context layers, an eight-question self-test, a glossary, and how to make a page
  like this.
- **Evidence tags.** `GARG` stated in one of the five articles · `REPO` in this repository's docs,
  templates or skills · `DEMO` in the worked example · `PRACTICE` how it is used, written in neither.
  Every excerpt is abridged or illustrative; the real documents are in `examples/01-spring-mvc`.

Keys: `→` `←` step · `space` play · `1`–`9` journey · `T` held artifacts · `M` marks · `F` fit ·
`R` start over · `Esc` close.

---

## The kit — making a page like this for another project

A flow page is data plus an engine. The engine, the stylesheet and the template never change from
one project to the next; the four data files do.

```
docs/flow/kit/
├── build.py            # concatenates everything into one HTML file per page
├── template.html       # the page skeleton (header, journey list, scene, panel, footer)
├── style.css           # the look
├── engine.js           # scene drawing, journeys, cards, windows, keyboard, deep links
├── data_scene.js       # zones, groups, components (one state per page), lines
├── data_things.js      # what travels: letter, colour, card, excerpt
├── data_meta.js        # page names, vocabulary, home panels, legend, the Learn windows
└── data_journeys.js    # the journeys: stops, what the dot carries, what to say
```

Build: `python docs/flow/kit/build.py` (writes the two pages into `docs/flow/`). Python 3, no
dependencies.

### The method

1. **Pick the two states** the pair compares: before and after, today and target, wrong and right.
   With one state, keep one page (`FILES` in `build.py` and `AF.meta.files` with one entry).
2. **Draw the zones**, three to five: where things live. Place the components inside them, one
   card each: `what`, `why`, `src`, and a state per page (`normal`, `defect` with a number, `new`
   with a mark, `ghost`, `unused`, `absent`).
3. **List what travels**, five to twelve things: a letter, a colour, and a card with who makes it,
   who reads it, where it lives, how long. An `example` becomes the excerpt card.
4. **Write the journeys** as stops: `at` (the component), `carry` (what the dot carries), `say`
   (one sentence), optionally `via`, `from`, `body`, `http`, `verdict`, `compare`, `src`. Six to
   fourteen stops each; six to nine journeys. Group them with `phase`.
5. **Draw the lines** the journeys need. A line with no `pts` is routed by the engine; a long one
   gets explicit `pts` in a lane that crosses nothing. A stop with no line to the previous one makes
   the dot fade and reappear: usually a missing line, sometimes intended (a tour).
6. **Build, open, walk every journey.** Fix the text where the dot's path surprises you.

### What is page-specific and where it goes

| Thing | Where |
|-------|-------|
| Page ids, file names, labels on the switch | `build.py` (`FILES`, `LABEL`, `PAGES`) and `AF.meta.files`, `labels`, `shortLabels`, `after` |
| The word for what travels (token, artifact, message, parcel) | `AF.meta.words` |
| The rows of a thing's card | `AF.meta.thingRows` |
| The evidence tags and their colours | `AF.meta.tagClasses` and the `.tag.*` rules in `style.css` |
| The legend's wording | `AF.meta.legend` |
| The home panel of each page | `AF.meta.<page>.intro`, `tokensIntro`, `panelTitle` |
| The Learn windows, in order | `AF.meta.modals` (`title`, `html`, optional `k`) |
| Group titles that differ per page | `titles: { before: …, after: … }` on a group |

### Design constraints

- One idea per stop; a verdict only where something is decided
- Every card cites a source; every excerpt says it is illustrative
- The other page is one line away from every card (`compare`, `notes`)
- The page loads nothing, sends nothing, and opens from a file
- Lines run in lanes; a line that crosses a box or a label is a layout bug, not a style
- Keep the engine generic: anything named after the subject belongs in the data files
