// =====================================================================================================
// Page texts: names and labels of the two pages, the vocabulary the engine uses, the home panel of each
// page, the legend, the "How to use" window, and the Learn windows (the five dimensions, the six layers,
// a self-test, a glossary, and how to make a page like this). Loaded after data_things.js (it builds
// chips from AF.tokens) and before data_journeys.js.
// =====================================================================================================
function chip(id) {
  var t = AF.tokens.filter(function (x) { return x.id === id; })[0];
  return "<span class='tchip' data-token='" + id + "'><i style='background:" + t.color + "'>" + t.letter + "</i>" + (t.short || t.name) + "</span>";
}
function nodeBtn(id, label, k) { return "<li><button data-node='" + id + "'>" + label + (k ? "<span class='k'>" + k + "</span>" : "") + "</button></li>"; }
function dimRows(list) { return list.map(function (g) { return "<div class='dim-row " + (g[2] || "") + "'><span class='n'>" + g[0] + "</span><span>" + g[1] + "</span></div>"; }).join(""); }
function layerRows(list) { return list.map(function (g) { return "<div class='layer'><span class='n'>" + g[0] + "</span><span>" + g[1] + "</span></div>"; }).join(""); }
function reveal(q, a) { return "<details class='reveal'><summary>" + q + "</summary><p class='p'>" + a + "</p></details>"; }

var FIVE = [
  ["1", "<b>Scope.</b> Every requirement from the story is present; exclusions are explicit; no class names or paths yet; not larger, not smaller than the story. <i>Common problem:</i> the agent added caching, analytics, admin endpoints, rate limiting."],
  ["2", "<b>Components.</b> One clear responsibility each; existing components reused, not duplicated; no abstraction wrapping something that already works. <i>Ask:</i> what does this do that the dependency doesn't?"],
  ["3", "<b>Interactions.</b> The flow starts at the right entry point; every component appears; no unnecessary hops; <b>an error path for every external call</b>."],
  ["4", "<b>Contracts.</b> Specific types, never <code>Object</code> or <code>Map&lt;String, Object&gt;</code>; exceptions named; the project's naming; signatures only, no bodies."],
  ["5", "<b>Implementation.</b> The change map: one row per edit at <code>file:line</code>, what and why; every reference to a changed symbol is a row or listed under <i>Not changed</i>; no code. At execution: nothing added that the guide didn't say."]
];

AF.meta = {
  files: { before: "implementation-trap.html", after: "design-first-flow.html" },
  labels: { before: "Without the framework", after: "With the framework" },
  shortLabels: { before: "Without", after: "With" },
  after: "after",
  words: { one: "artifact", many: "artifacts", Many: "Artifacts", held: "Artifacts it holds", all: "Every artifact, where it comes from and where it goes", listTitle: "Artifacts", travels: "The dot" },
  tagClasses: { garg: "garg", repo: "repo", demo: "demo", practice: "practice", trap: "trap" },
  thingRows: [["issuedBy", "Made by"], ["audience", "Read by"], ["proves", "Says"], ["heldBy", "Held by"], ["stored", "Lives in"], ["lifetime", "Lasts"], ["sentTo", "Goes to"], ["renewedBy", "Kept current by"]],

  legend: {
    states: {
      normal: "as it is in both pages",
      defect: "one of the four traps, with its number (① to ④)",
      "new": "what the framework adds or changes, with the pattern it belongs to",
      ghost: "gone with the framework (drawn so you can see what went)",
      unused: "exists, but nothing on this page uses it"
    },
    lines: { main: "something that happens", sec: "reads, or is read by path", bad: "something the framework removes", "new": "something the framework adds" },
    dot: "It is what travels: a prompt, a document, code, a signal. Its colour and letters say what it carries; the full list is in the bubble under it.",
    tags: "<span class='tag garg'>GARG</span> stated in one of the five articles · <span class='tag repo'>REPO</span> in this repository's docs, templates or skills · <span class='tag demo'>DEMO</span> in the worked example DEMO-001 · <span class='tag practice'>PRACTICE</span> how it is used in practice, not written in either"
  },

  before: {
    panelTitle: "Without the framework",
    intro:
      "<p class='p'><button class='btn primary' data-pick='0'>▶ Start with journey A: one prompt, four hundred lines</button></p>" +
      "<div class='plain'><b>What this page shows:</b> the same story, DEMO-001, done the way most teams do it: a one-line ask, code at once, review of everything at the same time. The four traps the articles name are marked ① to ④.</div>" +
      "<p class='p'>Four zones: <b>around the work</b> (the backlog, the pull request, the team's checkpoints, the articles), <b>the people</b>, <b>the repository</b> (only code: no context files, no documents) and <b>the agent</b> (a session that starts empty every time). Pick a journey on the left and follow the dot.</p>" +
      "<div class='h3'>The four traps</div><ul class='actions'>" +
      nodeBtn("model", "<b>①</b> The implementation trap: design and code in one step", "the model · the code") +
      nodeBtn("senior", "<b>②</b> The senior is the bottleneck: her judgment is in her head", "the people") +
      nodeBtn("session", "<b>③</b> The conversation as memory: the session forgets", "the agent") +
      nodeBtn("head", "<b>④</b> Tribal knowledge: the reasons leave with the author", "the people") +
      "</ul>" +
      "<div class='h3'>What travels here</div>" +
      "<table class='t wide'><tr><th>Artifact</th><th>Comes from</th><th>Ends up</th></tr>" +
      "<tr><td>" + chip("prompt") + "</td><td>whoever types it</td><td>the model. It carries the whole design, so it has to be long, and only the senior writes it well.</td></tr>" +
      "<tr><td>" + chip("decision") + "</td><td>the chat</td><td>nowhere. Gone when the session ends.</td></tr>" +
      "<tr><td>" + chip("codeart") + "</td><td>the model, at once</td><td>the pull request, with nothing that explains it.</td></tr></table>" +
      "<p class='p soft'>Suggested order: <b>A</b> (one prompt), <b>B</b> (two developers), <b>C</b> (the session ends), <b>D</b> (the author leaves). Then switch to <b>With the framework</b>: each journey links to its counterpart.</p>",
    tokensIntro: "Everything that travels on this page, grouped. Most of the framework's artifacts don't exist here: no instructions file, no skills, no documents. What does travel is a long prompt, decisions nobody writes down, and code that arrives whole."
  },

  after: {
    panelTitle: "With the framework",
    intro:
      "<p class='p'><button class='btn primary' data-pick='0'>▶ Start with journey A: the five patterns, in one lap</button></p>" +
      "<p class='p'><button class='btn' data-pick='3'>▶ Then journey D: a story becomes an implementation guide</button></p>" +
      "<div class='plain'><b>What this page shows:</b> one story, DEMO-001, through the Design-First AI framework: the project primed once (Layer 0), every session started from files rather than memory, the design agreed as a document before any code, the agent executing that document, the result recorded, and the lesson fed back. <b>Green</b> is what the framework adds, with the pattern it belongs to; <b>dashed grey</b> is what it makes unnecessary.</div>" +
      "<div class='h3'>The five patterns, and where they live</div><ul class='actions'>" +
      nodeBtn("instructions", "<b>Knowledge Priming</b>: context before the session", "Layers 0 to 4") +
      nodeBtn("implguide", "<b>Design-First Collaboration</b>: the guide before the code", "Layer 5a") +
      nodeBtn("report", "<b>Context Anchoring</b>: the record that outlives the chat", "Layer 5b") +
      nodeBtn("constraints", "<b>Encoding Team Standards</b>: judgment as versioned instructions", "constraints · skills") +
      nodeBtn("question", "<b>Feedback Flywheel</b>: every session improves the files", "the question · the cadences") +
      "</ul>" +
      "<div class='h3'>The six layers</div>" + layerRows([
        ["L0", "the generation prompt, run once: it writes the first draft of everything below from the codebase"],
        ["L1 + L2", "<code>.github/copilot-instructions.md</code>: identity, non-negotiables, file patterns. Auto-loaded, every session"],
        ["L3", "skills, one directory each: discovered by name, loaded per task"],
        ["L4", "prompt templates for recurring task shapes"],
        ["L5a", "<code>docs/[STORY]-impl-guide.md</code>: intention, built before execution"],
        ["L5b", "<code>docs/[STORY]-execution-report.md</code>: result, built during execution"]]) +
      "<div class='h3'>What travels here</div>" +
      "<table class='t wide'><tr><th>Artifact</th><th>Comes from</th><th>Ends up</th></tr>" +
      "<tr><td>" + chip("ctx") + "</td><td>Layer 0, then the team</td><td>every session, unasked.</td></tr>" +
      "<tr><td>" + chip("guide") + "</td><td>the story + the code, through a skill</td><td>reviewed by a person; then executed by the agent.</td></tr>" +
      "<tr><td>" + chip("rep") + "</td><td>the execution</td><td>beside the code in the pull request; read by the next person.</td></tr>" +
      "<tr><td>" + chip("signal") + "</td><td>the retrospective question</td><td>one line in a layer file, skill, template or constraint.</td></tr></table>" +
      "<p class='p soft'>Suggested order: <b>A</b> (the lap), <b>B</b> (onboarding), <b>C</b> (a session starts), <b>D</b> (design), <b>E</b> (execution), <b>F</b> (review), <b>G</b> (the flywheel), <b>H</b> (the author leaves). Toggle <b>Patterns</b> in the header to show or hide the pattern on each component.</p>",
    tokensIntro: "Everything that travels on this page, grouped by the pattern it serves. Two things do most of the work: " + chip("guide") + ", reviewed by a person before any code exists, and " + chip("rep") + ", which replaces the conversation as the record. One thing goes away: " + chip("decision") + "."
  },

  howto:
    "<div class='legend-grid'><div>" +
    "<div class='h3'>Follow a journey</div>" +
    "<p class='p'>Pick one on the left (or press <kbd>1</kbd>–<kbd>9</kbd>). The <b>dot</b> is what travels: a prompt, a document, code, a signal; its colour and letters say what it carries. Press <kbd>→</kbd> or click the dot for the next stop, <kbd>←</kbd> to go back, <kbd>space</kbd> to play. The footer and the bubble say what happens; the right panel adds the excerpt, the prompt and the source.</p>" +
    "<div class='h3'>Explore on your own</div>" +
    "<p class='p'><b>Click</b> a component: what it is, what it holds, which journeys stop there. <b>Right-click</b>: quick actions. The small circles under a component are the artifacts it holds; click one for its card. <b>Artifacts</b> in the header lists them all; picking one outlines where it sits and the lines it travels.</p>" +
    "<div class='h3'>Move around</div>" +
    "<p class='p'>Drag to pan, wheel to zoom, <kbd>F</kbd> to see everything. <b>↺ Start over</b> (or <kbd>R</kbd>) puts everything back. <b>Fit</b> is the default: the whole scene stays in view while the dot moves. Switch <b>Follow</b> on to have the view track the journey.</p>" +
    "</div><div>" +
    "<div class='h3'>Compare the two pages</div>" +
    "<p class='p'>The switch at the top goes to the other page, on the same journey when there is one. Every component and artifact card ends with a one-line comparison and a link to the same item on the other page.</p>" +
    "<div class='h3'>Learn</div>" +
    "<p class='p'>The <b>Learn</b> menu has the current journey as plain text (to paste into a document or a slide), the five dimensions, the six layers, a self-test, a glossary, and <b>how to make a page like this</b> for your own project.</p>" +
    "<div class='h3'>Keys</div>" +
    "<p class='p kbd-row'><kbd>→</kbd> <kbd>←</kbd> step · <kbd>space</kbd> play · <kbd>Home</kbd> first stop · <kbd>1</kbd>–<kbd>9</kbd> journey · <kbd>T</kbd> held artifacts · <kbd>M</kbd> marks · <kbd>F</kbd> fit · <kbd>R</kbd> start over · <kbd>Esc</kbd> close</p>" +
    "<div class='h3'>What's real and what isn't</div>" +
    "<p class='p'>Components, lines and claims come from this repository and from the five articles, and each card cites its source. Every prompt, excerpt and document shown is <b>abridged or illustrative</b>; the real ones are in <code>examples/01-spring-mvc</code>. Evidence tags say where a statement comes from: " +
    "<span class='tag garg'>GARG</span> <span class='tag repo'>REPO</span> <span class='tag demo'>DEMO</span> <span class='tag practice'>PRACTICE</span>.</p>" +
    "<p class='p soft'>The page is self-contained: it loads nothing and sends nothing.</p>" +
    "</div></div>",

  modals: {
    dimensions: { title: "The five dimensions of a design", k: "the review checklist", html:
      "<p class='p'>Garg's Design-First model names five categories of decision. A complete implementation guide covers all five; a review reads it against them, in this order. Each row says what to check, and the mistake the agent most often makes there.</p>" +
      dimRows(FIVE) +
      "<p class='p soft'>Journey D stops at this checklist, with DEMO-001's two failures: a repository layer nobody asked for (Components) and <code>Long</code> ids (Contracts). Source: <code>docs/design-workflow.md</code>, What a Good Implementation Guide Contains.</p>" },

    layers: { title: "The six context layers", k: "Knowledge Priming", html:
      "<p class='p'>Before asking the agent to design or build anything, give it the project. Six layers, each with a file, a moment it is loaded, and an owner.</p>" +
      "<table class='t wide'><tr><th>Layer</th><th>Content</th><th>File</th><th>Loaded</th></tr>" +
      "<tr><td>0 · Generation</td><td>one prompt that produces Layers 1 to 4 from the codebase</td><td><code>context/layer-0-generation-prompt.md</code></td><td>once, at onboarding</td></tr>" +
      "<tr><td>1 · Base instructions</td><td>identity, stack, non-negotiables, anti-patterns</td><td rowspan='2'><code>.github/copilot-instructions.md</code></td><td rowspan='2'>every session, automatically</td></tr>" +
      "<tr><td>2 · File patterns</td><td>structure, naming, canonical code</td></tr>" +
      "<tr><td>3 · Skills</td><td>reusable instruction sets, one directory each</td><td><code>context/skills/{name}/SKILL.md</code></td><td>per task, by discovery or <code>/name</code></td></tr>" +
      "<tr><td>4 · Prompt templates</td><td>recurring task shapes</td><td><code>context/layer-4-prompt-templates.md</code></td><td>per task, by path</td></tr>" +
      "<tr><td>5a · Impl guide</td><td>intention: scope, components, interactions, contracts, change map</td><td><code>docs/[STORY-ID]-impl-guide.md</code></td><td>per story, before execution</td></tr>" +
      "<tr><td>5b · Execution report</td><td>result: what was built, deviations, how to run and test, evidence</td><td><code>docs/[STORY-ID]-execution-report.md</code></td><td>per story, during execution</td></tr></table>" +
      "<div class='plain'><b>The rule every layer shares:</b> it ends with a Design Constraints section, and the section is the executable standard, not advice. The retrospective question is how the sections grow.</div>" +
      "<p class='p soft'>Source: <code>README.md</code>, Knowledge Priming; <code>context/README.md</code>.</p>" },

    selftest: { title: "Check your understanding", k: "eight questions", html:
      "<p class='p'>Answer first, then open. The answers are on the scene: each one names the journey that shows it.</p>" +
      reveal("1. The agent produced a clean, well-tested service with pagination and caching. The story asked for neither. Which dimension failed, and when should it have been caught?",
        "Scope. At the review of the implementation guide, before any code: unrequested capabilities are the common problem of dimension 1. At execution the apply skill stops on a scope change; anything that still slips through goes to a separate story. Journey D, stops 9 to 12.") +
      reveal("2. Yesterday's session agreed to use UUIDs. This morning's first draft uses Long. What went wrong?",
        "The decision lived in the conversation, and the session is a blank slate. It needed a home on disk: a Design Constraint (a standing rule) or the guide (this story). Without the framework: journey C. With it: journey C, stop 2, and journey G.") +
      reveal("3. What is the one file the agent knows without anyone asking, and what is in it?",
        "<code>.github/copilot-instructions.md</code>: Layers 1 and 2, identity, non-negotiables, file patterns, Design Constraints. Everything else, the app description and the two story documents included, is read only when referenced by path. Journey C, stops 3 to 5.") +
      reveal("4. Where does a review comment's outcome go, and where does it not go?",
        "Into the execution report, under <i>Review feedback addressed</i>. Not into a separate analysis file: the two-document rule. The comment itself was prompt input. Journey F.") +
      reveal("5. The senior writes much better prompts than the junior. What does the framework do about it?",
        "Encodes her judgment where it executes for everyone: Design Constraints and skill files, versioned, changed by pull request, grown by the retrospective question. Same AI, same quality gate. Without: journey B. With: journey A, stop 5, and journey G.") +
      reveal("6. The agent says: “I didn't know ids are UUIDs here.” Which signal is that, and where does it go?",
        "A context signal: something the AI needed and didn't have. Destination: Layers 1 and 2, as a line in the Design Constraints. An instruction signal would go to a skill, a workflow signal to the templates or the workflow doc, a failure signal to the constraints or anti-pattern lists. Journey G, stops 4 and 5.") +
      reveal("7. Name the two documents a story produces, and what each captures.",
        "The implementation guide, intention, built before execution; the execution report, result, built during it. Exactly two: more documents mean more review surface and no single home for a decision. Journeys D and E.") +
      reveal("8. The engineer who built DEMO-001 left. What does the next person read, in which order?",
        "The instructions load themselves; then the app description (what the application is), the implementation guide (why it was built this way), the execution report (what was built, how to run and test it). Then the code, which follows the conventions the documents state. Journey H.") },

    glossary: { title: "Glossary", k: "the framework's words", html:
      "<table class='t'>" +
      "<tr><th>Implementation Trap</th><td>Describing a feature and receiving four hundred lines in which a dozen architectural decisions were made without you. Design and implementation collapsed into one step.</td></tr>" +
      "<tr><th>Knowledge Priming</th><td>Loading the project's context before the session, so the model answers from your codebase and not from the average of the internet. The six layers.</td></tr>" +
      "<tr><th>Design-First Collaboration</th><td>No code until the design is agreed. Here: the implementation guide, built in passes and reviewed against five dimensions.</td></tr>" +
      "<tr><th>Context Anchoring</th><td>Capturing the design conversation's decisions in a living document that persists across sessions: the guide, then the execution report. The documents are the session state.</td></tr>" +
      "<tr><th>Encoding Team Standards</th><td>Turning the senior's judgment into versioned instructions that execute for everyone: Design Constraints, skills, templates.</td></tr>" +
      "<tr><th>Feedback Flywheel</th><td>Harvesting signal from sessions and feeding it back into the shared artifacts. Four signal types, four cadences.</td></tr>" +
      "<tr><th>Layer</th><td>One of the six kinds of context file, with its own moment of loading: generation (0), base instructions (1), file patterns (2), skills (3), prompt templates (4), the two story documents (5a, 5b).</td></tr>" +
      "<tr><th>Design Constraints</th><td>The last section of every layer file: rules the agent applies. The executable standard.</td></tr>" +
      "<tr><th>Implementation guide</th><td><code>docs/[STORY-ID]-impl-guide.md</code>: scope, components, interactions, contracts, change map, verification, constraints, open questions. No method bodies, no whole files, no test code.</td></tr>" +
      "<tr><th>Change map</th><td>One row per edit, in execution order: file and anchor, what changes, why. Every search hit for a changed symbol is a row or is listed under <i>Not changed</i>.</td></tr>" +
      "<tr><th>Execution report</th><td><code>docs/[STORY-ID]-execution-report.md</code>: what was built and where, deviations, how to run and test, each acceptance criterion with evidence, the commit message, review feedback addressed.</td></tr>" +
      "<tr><th>Two-document rule</th><td>Every story produces exactly these two. Research output, spike analysis and review analysis are prompt input, not deliverables.</td></tr>" +
      "<tr><th>Skill</th><td>A reusable instruction set in <code>{name}/SKILL.md</code>, discovered by the tool, invoked with <code>/name</code>. The story runs on two of them.</td></tr>" +
      "<tr><th>Session</th><td>One chat. A blank slate at the start; gone at the end. Briefed, never resumed.</td></tr>" +
      "<tr><th>The retrospective question</th><td>“What context were you missing that would have changed your approach?” Asked after every session; the wording never varies. Each answer becomes a line in a file.</td></tr>" +
      "<tr><th>Signal</th><td>What a session taught that should change a shared artifact: context, instruction, workflow or failure, each with a destination.</td></tr>" +
      "<tr><th>Design for Deletion</th><td>Every artifact must function without the person who created it. If any single layer is deleted, person, framework, documents or code, the rest still work.</td></tr>" +
      "</table>" },

    kit: { title: "How to make a page like this", k: "for your own project", html:
      "<p class='p'>This page is a <b>flow page</b>: a scene of zones and components, things that travel between them, and journeys that move a dot from stop to stop while a bubble, the footer and the panel explain. The scene is drawn from data; the engine is the same for every pair of pages. You write four data files and run one script.</p>" +
      "<div class='two'><div>" +
      "<div class='h3'>The kit, in <code>docs/flow/kit/</code></div>" +
      "<table class='t'><tr><th><code>data_scene.js</code></th><td>zones, groups, components (with a state per page), lines</td></tr>" +
      "<tr><th><code>data_things.js</code></th><td>what travels: a letter, a colour, a card, an excerpt</td></tr>" +
      "<tr><th><code>data_meta.js</code></th><td>page names, vocabulary, home panels, legend, these windows</td></tr>" +
      "<tr><th><code>data_journeys.js</code></th><td>the journeys: stops, what the dot carries, what to say</td></tr>" +
      "<tr><th><code>build.py</code></th><td>concatenates template + style + engine + data into one HTML file per page</td></tr>" +
      "<tr><th><code>engine.js</code>, <code>style.css</code>, <code>template.html</code></th><td>unchanged from one project to the next</td></tr></table>" +
      "<div class='h3'>The method, in order</div>" +
      "<p class='p'>1. <b>Pick the two states</b> the pair compares: before and after, today and target, wrong and right. If there is only one, keep one page.<br>2. <b>Draw the zones</b>: where things live (three to five). <b>Place the components</b> inside them, one card each: what it is, why it matters, a source.<br>3. <b>List what travels</b> (five to twelve things): each gets a letter and a colour, and a card with who makes it, who reads it, where it lives, how long.<br>4. <b>Write the journeys</b> as stops: at which component, what the dot carries, one sentence to say, an excerpt for the panel, a verdict where something is decided. Six to fourteen stops each; six to nine journeys.<br>5. <b>Mark the states</b>: a trap or defect number on the before page, the pattern or the story step on the after page.<br>6. <b>Build, open, walk every journey.</b> Fix the text where the dot's path surprises you: a surprising path is a wrong edge or a missing stop.</p>" +
      "</div><div>" +
      "<div class='h3'>A stop, as data</div>" +
      "<pre class='pw'>{ at: \"implguide\",                 <span class='c'>// the stop</span>\n  via: [\"tools\"],                  <span class='c'>// passed on the way (optional)</span>\n  carry: [\"guide\"],                <span class='c'>// ids from data_things.js</span>\n  ev: \"REPO\",                      <span class='c'>// the evidence tag</span>\n  say: \"First draft: &lt;b&gt;Scope&lt;/b&gt;…\",   <span class='c'>// bubble and footer</span>\n  body: \"&lt;div class='plain'&gt;…&lt;/div&gt;\", <span class='c'>// the panel (optional)</span>\n  http: { title: \"The prompt\", text: \"…\" },\n  verdict: { text: \"✓ correct\", tone: \"good\" },\n  compare: \"&lt;b&gt;Without the framework:&lt;/b&gt; …\",\n  src: \"docs/design-workflow.md\" }</pre>" +
      "<div class='h3'>A component, as data</div>" +
      "<pre class='pw'>{ id: \"implguide\", zone: \"repo\", icon: \"doc\",\n  x: 905, y: 855, w: 400, h: 84,\n  title: \"docs/DEMO-001-impl-guide.md\", sub: \"intention: …\",\n  before: { state: \"absent\" },\n  after:  { state: \"new\", mark: \"design-first\",\n            holds: [\"guide\"], ev: \"REPO\" },\n  what: \"…\", notes: { after: \"…\" }, why: \"…\", src: \"…\" }</pre>" +
      "<div class='h3'>What makes it teach</div>" +
      "<p class='p'>One idea per stop. A verdict only where something is decided. Every card cites a source. Every excerpt says it is illustrative. The other page is one line away from every card. The transcript window turns any journey into prose for a document. And the page loads nothing, sends nothing, and opens from a file.</p>" +
      "<p class='p soft'>Build: <code>python docs/flow/kit/build.py</code>. The README in <code>docs/flow/</code> has the longer version.</p>" +
      "</div></div>" }
  }
};
