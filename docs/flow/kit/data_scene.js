// =====================================================================================================
// The scene: four zones (where each thing lives), the components, and the lines between them.
// Every fact comes from this repository: README.md, docs/design-workflow.md, docs/feedback-flywheel.md,
// context/README.md, the two story skills, and the worked example examples/01-spring-mvc (DEMO-001).
// Per page, a component has a state: normal, defect (with its trap number), new (with the pattern it
// belongs to), ghost (gone), unused, or absent (not drawn). The two pages are "before" (without the
// framework) and "after" (with it).
// =====================================================================================================
var AF = { W: 2360, H: 1240 };
var C = { around: "#c4b5fd", team: "#38bdf8", repo: "#2dd4bf", agent: "#818cf8" };

AF.zones = [
  { id: "around", x: 30, y: 40, w: 2300, h: 260, color: C.around, tx: 50, ty: 70,
    title: "Around the work", sub: "where stories come from, where code goes, where the team meets, and where the method comes from" },
  { id: "team", x: 30, y: 320, w: 630, h: 885, color: C.team, tx: 48, ty: 347, title: "The people", sub: "where judgment lives" },
  { id: "repo", x: 680, y: 320, w: 960, h: 885, color: C.repo, tx: 698, ty: 347, title: "The repository", sub: "files on disk: the only memory that survives a session" },
  { id: "agent", x: 1660, y: 320, w: 670, h: 885, color: C.agent, tx: 1678, ty: 347, title: "The agent", sub: "a chat session: a new expert every time" }
];

AF.groups = [
  { id: "g-layers", x: 695, y: 470, w: 930, h: 275, title: "Context layers · Layers 0 to 4", titles: { before: "Context layers · none: nothing tells the agent about this project" } },
  { id: "g-docs", x: 695, y: 770, w: 930, h: 160, title: "docs/ · two documents per story", titles: { before: "docs/ · none: the design was never written down" } },
  { id: "g-src", x: 695, y: 960, w: 930, h: 160, title: "src/ · code and tests", titles: { before: "src/ · the code, and nothing that explains it" } }
];

AF.nodes = [
  // ---------------------------------------------------------------- around the work
  { id: "garg", short: "The articles", zone: "around", x: 270, y: 180, w: 420, h: 100, color: C.around, icon: "doc",
    title: "Garg's five patterns", sub: "martinfowler.com, February to April 2026", tec: "the source of the method",
    before: { tec: "published, not applied", ev: "GARG" }, after: { ev: "GARG" },
    what: "Rahul Garg's five articles on reducing friction with AI coding assistants: <b>Knowledge Priming</b> (load context before the session), <b>Design-First Collaboration</b> (agree the design before any code), <b>Context Anchoring</b> (capture decisions in a living document), <b>Encoding Team Standards</b> (make the senior's judgment a versioned instruction) and the <b>Feedback Flywheel</b> (feed each session's lessons back into the shared artifacts).",
    notes: {
      before: "The patterns exist; nothing on this page applies them. The scene shows the problems the articles name: the Implementation Trap, the senior as bottleneck, the session that forgets, tribal knowledge.",
      after: "Each pattern has a home on the scene. Toggle <b>Patterns</b> in the header to see which component implements which; journey A walks them in one lap."
    },
    why: "The framework is an implementation, not an invention: every mechanism below answers one of these articles.",
    src: "README.md, References; docs/garg-mapping.md" },
  { id: "backlog", short: "Backlog", zone: "around", x: 700, y: 180, w: 330, h: 100, color: C.around, icon: "box",
    title: "The backlog", sub: "where a story comes from", tec: "DEMO-001 · product catalog API",
    before: { ev: "DEMO" }, after: { ev: "DEMO" },
    what: "The story: an ID, an intent, acceptance criteria, exclusions, and the facts about other systems the code cannot show. The worked example is <b>DEMO-001</b>: a four-endpoint, in-memory product catalog REST API in Spring Boot.",
    notes: { before: "The same story on both pages. What changes is what the engineer does with it.", after: "The story is one of the two inputs of the implementation guide; the codebase is the other. Nothing else." },
    src: "examples/01-spring-mvc/app/docs/DEMO-001-impl-guide.md" },
  { id: "ritual", short: "Checkpoints", zone: "around", x: 1190, y: 180, w: 420, h: 100, color: C.around, icon: "clock",
    title: "The team's checkpoints", sub: "closing a PR · standup · sprint retrospective · quarterly", tec: "the four cadences of the flywheel",
    before: { state: "unused", word: "NOT USED", ev: "GARG" }, after: { state: "new", mark: "flywheel", ev: "REPO" },
    what: "Moments the team already has. The Feedback Flywheel adds one question to each instead of a new meeting: after each session, at the standup, at the retrospective, and periodically when the team senses drift.",
    notes: {
      before: "The meetings happen; nothing about working with the AI is harvested in them. Each developer keeps their own intuition, and it doesn't transfer.",
      after: "After a session: <i>did anything happen that should change a shared artifact?</i> At standup: <i>did anyone learn something with the AI yesterday?</i> At the retro: what worked, what friction, what to update. Quarterly: which skills are loaded, which ignored, are the constraints still true."
    },
    src: "docs/feedback-flywheel.md, Four Cadences" },
  { id: "runner", short: "Build", zone: "around", x: 1620, y: 180, w: 330, h: 100, color: C.around, icon: "gear",
    title: "Build and tests", sub: "the project's own commands", tec: "mvn test · 17 tests",
    before: { ev: "DEMO" }, after: { ev: "DEMO" },
    what: "The project's build, lint and test commands, as the project defines them. The apply skill reads them from the build files and runs them; it never invents its own.",
    notes: { before: "Run by the engineer, after the fact, on code whose shape nobody agreed.", after: "Run by the agent during execution and again by the engineer before committing. DEMO-001: 17 tests, 0 failures, 100% coverage." },
    src: "context/skills/apply-implementation-guide/SKILL.md; DEMO-001-execution-report.md" },
  { id: "pr", short: "Pull request", zone: "around", x: 2100, y: 180, w: 420, h: 100, color: C.around, icon: "door",
    title: "The pull request", sub: "review comments, then the merge", tec: "the code's only door",
    before: { ev: "PRACTICE" }, after: { ev: "REPO" },
    what: "Where the code is reviewed and merged. A person opens it; the agent never commits, stages or pushes.",
    notes: {
      before: "The PR carries the code and nothing that explains it. The reviewer reconstructs the intent from the diff, or asks.",
      after: "The PR carries the code, the implementation guide and the execution report. A review comment becomes a prompt; its outcome is recorded in the report under <i>Review feedback addressed</i>, never in a separate analysis file."
    },
    src: "docs/design-workflow.md, Document 2" },

  // ---------------------------------------------------------------- the people
  { id: "engineer", short: "Engineer", zone: "team", x: 190, y: 535, w: 290, h: 84, color: C.team, icon: "person", actor: true,
    title: "The engineer", sub: "briefs, reviews, commits",
    before: { tec: "asks for code", ev: "GARG" }, after: { tec: "asks for the design first", ev: "REPO" },
    what: "The person doing the story. With the framework, her job moves up a level: she writes the brief, reviews the implementation guide against the five dimensions, and commits what the agent built. She never executes a guide she couldn't explain herself.",
    notes: { before: "Describes a feature, receives four hundred lines, and reviews scope, architecture, contracts and code quality at once.", after: "Reviews a document before any code exists; the code arrives already shaped by decisions she took." },
    src: "README.md, The Problem; docs/design-workflow.md, Step 2 Is Iterative" },
  { id: "senior", short: "Senior", zone: "team", x: 500, y: 535, w: 290, h: 84, color: C.team, icon: "badge", actor: true,
    title: "The senior", sub: "whose judgment sets the quality",
    before: { state: "defect", mark: 2, tec: "the bottleneck", ev: "GARG" }, after: { state: "new", mark: "standards", tec: "her judgment is in the files", ev: "GARG" },
    what: "The engineer who instinctively specifies architecture patterns, error handling, naming and test expectations when she prompts. Same AI, different quality gates: hers live in her head.",
    notes: {
      before: "<b>Trap ②.</b> Every review routes through her, not because she writes the code but because she is the only one who knows what to ask for.",
      after: "Her judgment is encoded as versioned instructions that execute for everyone: the Design Constraints and the skill files. The retrospective question is how it gets out of her head, one constraint at a time."
    },
    src: "README.md, Encoding Team Standards" },
  { id: "head", short: "Heads", zone: "team", x: 500, y: 685, w: 290, h: 84, color: C.team, icon: "cloud",
    title: "Tribal knowledge", sub: "what lives only in heads and chats",
    before: { state: "defect", mark: 4, tec: "a dozen rules, unwritten", holds: ["decision"], ev: "GARG" },
    after: { state: "ghost", word: "ENCODED", tec: "moved to the layer files", holds: [], ev: "REPO" },
    what: "Decisions, conventions and reasons that were never written down: they exist in the conversation that produced them and in the memory of whoever was there.",
    notes: {
      before: "<b>Trap ④.</b> Ask who decided UUIDs, or why there is no repository layer: the answer is a person, if they are still around.",
      after: "The framework is the opposite of tribal knowledge. Every decision has one home: a layer file, the implementation guide, or the execution report. What's left in heads is what nobody needs."
    },
    why: "Design for Deletion: if any single layer is deleted, person, framework, documents or code, the remaining layers still function.",
    src: "README.md, Design for Deletion" },
  { id: "reviewer", short: "Reviewer", zone: "team", x: 190, y: 855, w: 290, h: 84, color: C.team, icon: "person", actor: true,
    title: "The reviewer", sub: "reads the pull request",
    before: { ev: "PRACTICE" }, after: { ev: "REPO" },
    what: "A colleague who reviews the pull request. Their comments are the last design conversation of the story.",
    notes: { before: "Reviews code whose intent is nowhere written. Comments turn into chat, chat into nothing.", after: "Reads the guide and the report beside the diff. A comment becomes a prompt; the fix goes in the code, the outcome in the report." },
    src: "docs/design-workflow.md, Document 2" },
  { id: "newcomer", short: "Next person", zone: "team", x: 500, y: 855, w: 290, h: 84, color: C.team, icon: "person", actor: true,
    title: "The next person", sub: "arrives after the author left",
    before: { state: "defect", mark: 4, tec: "asks around, guesses", ev: "GARG" }, after: { state: "new", mark: "anchoring", tec: "reads the documents", ev: "REPO" },
    what: "The engineer, or the agent session, that picks the work up later: next sprint, next year, or tomorrow morning. The test of the whole framework is whether they can.",
    notes: { before: "Reads the code and guesses at the reasons. Asks whoever is left. Rebuilds what exists, or breaks it.", after: "Reads the app description, the guide and the report. Nothing broke when the author left." },
    src: "README.md, Design for Deletion" },
  { id: "question", short: "The question", zone: "team", x: 345, y: 1045, w: 520, h: 84, color: C.team, icon: "chat",
    title: "The retrospective question", sub: "“What context were you missing that would have changed your approach?”", tec: "asked after every session; the wording never varies",
    before: { state: "absent" }, after: { state: "new", mark: "flywheel", ev: "REPO" },
    what: "One question, asked to the agent at the end of a session. Each answer is a constraint that was in someone's head and is now a line in a file. It is the extraction mechanism of Encoding Team Standards and one instance of the Feedback Flywheel.",
    notes: { after: "The full post-session reflection asks four: context (what was missing), instruction (which phrasing worked or failed), workflow (did the conversation structure help), failure (what went wrong, and its root cause)." },
    src: ".github/copilot-instructions.md, Non-Negotiables; docs/feedback-flywheel.md" },

  // ---------------------------------------------------------------- the repository: context layers
  { id: "instructions", short: "Instructions", zone: "repo", x: 840, y: 535, w: 270, h: 84, color: C.repo, icon: "doc",
    title: ".github/copilot-instructions.md", sub: "Layers 1 + 2: identity, rules, file patterns",
    before: { state: "absent" }, after: { state: "new", mark: "priming", tec: "auto-loaded, every session", holds: ["ctx"], ev: "REPO" },
    what: "One file, under 150 lines, loaded by the tool at the start of every session without being asked. Layer 1 is the project's identity, stack and non-negotiables; Layer 2 the structure, naming and canonical code patterns. Both end with Design Constraints.",
    notes: { after: "The only thing the agent knows about the project before anyone types. Everything else must be referenced by path. In DEMO-001 it holds the rule that caught correction 2: <i>UUID for all product identifiers, never Long or int</i>." },
    why: "Without it the model defaults to generic patterns from its training data: the average of the internet, not your codebase.",
    src: "README.md, Knowledge Priming; docs/design-workflow.md, Understanding Sessions" },
  { id: "skills", short: "Skills", zone: "repo", x: 1150, y: 535, w: 270, h: 84, color: C.repo, icon: "braces",
    title: "context/skills/{name}/SKILL.md", sub: "Layer 3: reusable instruction sets",
    before: { state: "absent" }, after: { state: "new", mark: "standards", tec: "discovered by name, loaded per task", holds: ["skill"], ev: "REPO" },
    what: "One directory per skill, one <code>SKILL.md</code> each, with a name and a description in its front matter. The tool discovers them and loads one when the task matches, or when asked with <code>/skill-name</code>. The two that run a story: <code>/create-implementation-guide</code> and <code>/apply-implementation-guide</code>. Others: error handling, testing, logging, configuration, refactoring, security review, code review, pull-request review, story narration.",
    notes: { after: "The team's reusable judgment, versioned, changed by pull request, improved by the flywheel." },
    src: "context/skills/README.md; context/layer-3-skills.md" },
  { id: "templates", short: "Templates", zone: "repo", x: 1460, y: 685, w: 270, h: 84, color: C.repo, icon: "doc",
    title: "Prompt templates", sub: "Layer 4: recurring task shapes", tec: "new feature · bug · refactor · PR comments",
    before: { state: "absent" }, after: { state: "new", mark: "standards", holds: ["tmpl"], ev: "REPO" },
    what: "Standard openings for recurring kinds of task: a new feature, a single component, tests, a bug, a refactor, a round of pull-request comments. Referenced by path when needed.",
    notes: { after: "A workflow signal from the flywheel lands here: a conversation shape that worked becomes a template." },
    src: "context/layer-4-prompt-templates.md" },
  { id: "constraints", short: "Constraints", zone: "repo", x: 840, y: 685, w: 270, h: 84, color: C.repo, icon: "shield",
    title: "Design Constraints", sub: "the last section of every layer file", tec: "“Do not add a repository layer”",
    before: { state: "absent" }, after: { state: "new", mark: "standards", holds: ["rule"], ev: "REPO" },
    what: "The executable standard: not advice to remember but rules the agent applies. Every layer template and every Layer 0 output must have one. It is where the retrospective question's answers go.",
    notes: { after: "DEMO-001's two corrections were both already here: <i>service owns the store directly, no repository layer</i> (Layer 0 architecture) and <i>UUID, never Long</i> (the non-negotiables). The agent was held to them at review; after the flywheel, it respects them in the first draft." },
    src: "README.md, Encoding Team Standards; context/README.md" },
  { id: "appdesc", short: "App description", zone: "repo", x: 1150, y: 685, w: 270, h: 84, color: C.repo, icon: "doc",
    title: "docs/app-description.md", sub: "Layer 0 output: the application, explained", tec: "written once, read every step",
    before: { state: "absent" }, after: { state: "new", mark: "priming", holds: ["appd"], ev: "REPO" },
    what: "The agent's own account of the codebase, produced once at onboarding and corrected by the team: architecture, tech stack, context, codebase map, design principles. It establishes the shared vocabulary before any story work, and the agent reads it in every subsequent step.",
    notes: { after: "You read it to verify the agent understood the application correctly. Update it when the architecture changes significantly." },
    src: "docs/design-workflow.md, Step 1; README.md, Layer 0" },
  { id: "layer0", short: "Layer 0 prompt", zone: "repo", x: 1460, y: 535, w: 270, h: 84, color: C.repo, icon: "key",
    title: "Layer 0 prompt", sub: "context/layer-0-generation-prompt.md", tec: "run once, at onboarding",
    before: { state: "absent" }, after: { state: "new", mark: "priming", ev: "REPO" },
    what: "The one-time prompt that reads an existing codebase and produces Layers 1 to 4: the first draft of the team's knowledge, written by the agent and owned by the team. About fifteen minutes.",
    notes: { after: "A new project has no codebase to read, so Layer 1 is filled in by hand and Layer 2 added when there are conventions worth encoding." },
    src: "README.md, Quick Start; context/layer-0-generation-prompt.md" },

  // ---------------------------------------------------------------- the repository: the two documents
  { id: "implguide", short: "Impl guide", zone: "repo", x: 905, y: 855, w: 400, h: 84, color: C.repo, icon: "doc",
    title: "docs/DEMO-001-impl-guide.md", sub: "intention: scope · components · interactions · contracts · change map", tec: "built before any code, in passes",
    before: { state: "absent" }, after: { state: "new", mark: "design-first", holds: ["guide"], ev: "REPO" },
    what: "The whiteboard, as a document. Scope and exclusions; components with one purpose each; interactions with an error path for every external call; contracts (signatures and types, no bodies); a change map (one row per edit, where and what, never the code); verification per acceptance criterion; constraints; open questions. Built in two or three passes and reviewed against Garg's five dimensions; executed only when every section is correct and clear.",
    notes: { after: "DEMO-001's guide took two corrections at review, both before any code: no repository layer, and UUID instead of Long. Cost if missed: two files, a bean and wiring, a test refactor; and every signature, test and URL." },
    why: "The discipline: do not execute a guide you could not explain yourself. Unclear sections become assumptions; assumptions become code.",
    src: "docs/design-workflow.md, Document 1; context/skills/create-implementation-guide/SKILL.md" },
  { id: "report", short: "Exec report", zone: "repo", x: 1390, y: 855, w: 410, h: 84, color: C.repo, icon: "doc",
    title: "docs/DEMO-001-execution-report.md", sub: "result: what was built, deviations, how to run, evidence", tec: "written during execution",
    before: { state: "absent" }, after: { state: "new", mark: "anchoring", holds: ["rep"], ev: "REPO" },
    what: "The permanent record. What was implemented and where; deviations from the guide and why; how to run, test, and test by hand; each acceptance criterion met or not, with evidence; a compliant commit message; review feedback and how it was addressed. It replaces the conversation history.",
    notes: { after: "DEMO-001: nine files, 17 tests, no deviations, one Javadoc added because a non-negotiable required it. The two design-review corrections are recorded with their cost if missed." },
    why: "Garg's living ADR: the design conversation captured where the next engineer, or the next session, can read it without any session history.",
    src: "docs/design-workflow.md, Document 2; context/layer-5-execution-report.md" },

  // ---------------------------------------------------------------- the repository: the code
  { id: "code", short: "Code", zone: "repo", x: 905, y: 1045, w: 400, h: 84, color: C.repo, icon: "braces",
    title: "src/main", sub: "ProductController · ProductService · three records · the exception handler",
    before: { state: "defect", mark: 1, tec: "400 lines, a dozen silent decisions", holds: ["codeart"], ev: "GARG" },
    after: { state: "new", mark: "design-first", tec: "the change map, applied row by row", holds: ["codeart"], ev: "DEMO" },
    what: "The application code. In DEMO-001: a controller that delegates at once, a service that owns a <code>ConcurrentHashMap</code>, three records, a domain exception and a handler that maps it to 404 and validation errors to 400.",
    notes: {
      before: "<b>Trap ①.</b> It arrives whole, with architecture, contracts and scope decided inside it. Reviewing it means judging everything at once.",
      after: "It arrives as the guide said it would: the change map applied in order, nothing added that wasn't in scope. The review happened on the document."
    },
    src: "examples/01-spring-mvc/app/src/main" },
  { id: "tests", short: "Tests", zone: "repo", x: 1390, y: 1045, w: 410, h: 84, color: C.repo, icon: "badge",
    title: "src/test", sub: "8 plain JUnit · 9 @WebMvcTest", tec: "100% coverage",
    before: { tec: "tests for what got written", ev: "PRACTICE" }, after: { state: "new", mark: "design-first", tec: "one check per acceptance criterion", ev: "DEMO" },
    what: "The tests the guide's Verification rows describe: for each acceptance criterion, the behaviour that proves it. Service tests with no Spring context; controller tests with <code>@WebMvcTest</code> and a mocked service, asserting <code>$.code</code>, not the message.",
    notes: { before: "Written after the code, for the code that exists, with whatever framework the model preferred that day.", after: "Written from the Verification table, in the project's own style (a constraint in the guide), and run with the project's own command." },
    src: "DEMO-001-impl-guide.md, Constraints; DEMO-001-execution-report.md" },

  // ---------------------------------------------------------------- the agent
  { id: "session", short: "Session", zone: "agent", x: 1995, y: 535, w: 610, h: 84, color: C.agent, icon: "chat",
    title: "The chat session", sub: "a context window: empty at the start, gone at the end", tec: "a new expert every time",
    before: { state: "defect", mark: 3, tec: "treated as the memory", holds: [], ev: "GARG" }, after: { tec: "briefed from files", holds: ["ctx"], ev: "REPO" },
    what: "Each session is a blank slate. The agent has no memory of previous conversations: closing a chat and opening a new one starts completely fresh. What it knows is what is loaded now: the auto-loaded instructions, plus whatever is referenced by path.",
    notes: {
      before: "<b>Trap ③.</b> Decisions made in chat live only in chat. The session ends; the decision is gone; the next session makes the opposite one.",
      after: "The documents are the session state. A session is briefed, not resumed: <i>“We're continuing DEMO-001. Read docs/DEMO-001-impl-guide.md. Current state: … Continue from here.”</i>"
    },
    why: "A useful way to think about it: each session is a new expert who knows your project deeply through the documents you've built, and forgets everything the moment you close the chat.",
    src: "docs/design-workflow.md, Understanding Sessions" },
  { id: "model", short: "Model", zone: "agent", x: 1830, y: 685, w: 300, h: 84, color: C.agent, icon: "gear",
    title: "The model", sub: "defaults to the average of the internet", tec: "generic patterns unless primed",
    before: { state: "defect", mark: 1, ev: "GARG" }, after: { tec: "primed by the layers", ev: "GARG" },
    what: "The language model behind the agent. Unprimed, it answers from its training data: the most common shape of a product API, not yours. Primed, it answers inside your constraints.",
    notes: { before: "<b>Trap ①.</b> Asked for a catalog API with no context, it picks <code>Long</code> ids, a repository interface, pagination and a DTO mapper, because that is what most catalog APIs on the internet look like.", after: "The same model. With the layers loaded and the guide in front of it, its first draft already respects the non-negotiables." },
    src: "README.md, Knowledge Priming" },
  { id: "autoload", short: "Auto-load", zone: "agent", x: 2160, y: 685, w: 300, h: 84, color: C.agent, icon: "funnel",
    title: "Auto-load and discovery", sub: "what the tool loads without being asked", tec: "copilot-instructions.md · skills/",
    before: { state: "unused", word: "NOTHING TO LOAD", ev: "REPO" }, after: { state: "new", mark: "priming", ev: "REPO" },
    what: "The tool's own behaviour: at session start it loads <code>.github/copilot-instructions.md</code>; it discovers the skills under the skills directory and loads one when the task matches or when it is invoked by name. Everything else is read only when referenced by path.",
    notes: { before: "There is no instructions file and no skills directory. The session starts with nothing.", after: "Layers 1 and 2 are always there. Layers 3 and 4 by reference. Layer 0's output and the two story documents by path." },
    src: "README.md, Knowledge Priming table; docs/copilot-context-model.md" },
  { id: "tools", short: "Tool calls", zone: "agent", x: 1995, y: 855, w: 610, h: 84, color: C.agent, icon: "arrows",
    title: "Tool calls", sub: "read files · search the workspace · edit · run commands", tec: "how the agent touches the repository",
    before: { ev: "PRACTICE" }, after: { ev: "PRACTICE" },
    what: "The agent's hands: reading files it was pointed to, searching for every symbol a story touches, editing in place, running the build and test commands it read from the project.",
    notes: { before: "Used to write code straight from the ask.", after: "Used first to read (the story's files, every search hit), then to write what the change map says, then to run the project's own tests." },
    src: "context/skills/create-implementation-guide/SKILL.md, Read before writing" },
  { id: "skillrun", short: "Active skill", zone: "agent", x: 1995, y: 1045, w: 610, h: 84, color: C.agent, icon: "braces",
    title: "The active skill", sub: "/create-implementation-guide · /apply-implementation-guide", tec: "loaded on demand, one per task",
    before: { state: "absent" }, after: { state: "new", mark: "standards", holds: ["skill"], ev: "REPO" },
    what: "A skill, loaded into the session for this task. <code>/create-implementation-guide</code>: two inputs only, every claim about existing code cited at <code>file:line</code>, no method bodies, open questions for anything unproven, stop at <i>Draft, for review</i>. <code>/apply-implementation-guide</code>: the project's own build and test commands, adapt to mechanical mismatches, stop on any change of behaviour, security, interface or scope, one part per run, never commit.",
    notes: { after: "The skill is the senior's checklist, executing for whoever typed the slash command." },
    src: "context/skills/create-implementation-guide/SKILL.md; context/skills/apply-implementation-guide/SKILL.md" }
];

// The lines. A line with no pts is routed by the engine (straight, or one bend when the boxes don't face
// each other). pages: drawn only there. cls: main, sec (reads or stores), bad (shouldn't happen), new.
// Long lines run in lanes: y 305 and 315 (the gap under the top zone), 375 to 475 (above the first row),
// 595 to 630 (between the first two rows), 758 to 790, 945, 1110 to 1185 (under the last row); x 652 and
// 665 to 675 (between the people and the repository), 995 (between the first two columns), 1600 to 1670
// (between the repository and the agent), 2320 (the agent's right margin).
AF.edges = [
  // around the work
  { id: "backlog-engineer", from: "backlog", to: "engineer", pts: [[700, 305], [200, 305]], label: "the story", lp: [450, 299] },
  { id: "garg-senior", from: "garg", to: "senior", cls: "sec", pts: [[400, 260], [520, 260]], label: "names the problem", lp: [528, 300], la: "start" },
  { id: "engineer-pr", from: "engineer", to: "pr", pts: [[310, 455], [505, 455], [505, 110], [2100, 110]], label: "opens the pull request, with the two documents", lp: [1300, 104], both: true },
  { id: "reviewer-pr", from: "reviewer", to: "pr", cls: "sec", pts: [[190, 790], [675, 790], [675, 315], [2180, 315]], label: "reads and comments", lp: [1300, 309], both: true },
  { id: "runner-tests", from: "runner", to: "tests", pts: [[1612, 230], [1612, 1045]], label: "mvn test", lp: [1604, 1000], la: "end", both: true },
  { id: "ritual-question", from: "ritual", to: "question", pages: ["after"], cls: "new", pts: [[1190, 260], [652, 260], [652, 1045]], label: "the same question, at every cadence", lp: [920, 254], both: true },
  { id: "ritual-constraints", from: "ritual", to: "constraints", pages: ["after"], cls: "new", pts: [[995, 230], [995, 685]], label: "what the team decided to update", lp: [1001, 592], la: "start" },

  // the people
  { id: "engineer-senior", from: "engineer", to: "senior", both: true },
  { id: "senior-head", from: "senior", to: "head", both: true },
  { id: "engineer-head", from: "engineer", to: "head", both: true },
  { id: "head-newcomer", from: "head", to: "newcomer", both: true },
  { id: "engineer-reviewer", from: "engineer", to: "reviewer", cls: "sec", both: true },
  { id: "engineer-question", from: "engineer", to: "question", pages: ["after"], cls: "new", pts: [[345, 560], [345, 1003]], both: true },
  { id: "newcomer-question", from: "newcomer", to: "question", pages: ["after"], cls: "sec" },

  // people <-> repository
  { id: "engineer-implguide", from: "engineer", to: "implguide", pages: ["after"], cls: "new", pts: [[250, 595], [665, 595], [665, 758], [905, 758]], label: "reviews the design, iterates", lp: [740, 752], both: true },
  { id: "engineer-code", from: "engineer", to: "code", pts: [[40, 535], [40, 1165], [930, 1165]], label: "reads, reworks, commits", lp: [480, 1159], both: true },
  { id: "newcomer-code", from: "newcomer", to: "code", pages: ["after"], cls: "sec", pts: [[675, 855], [675, 1145], [880, 1145]], label: "the code, read last", lp: [760, 1139] },
  { id: "engineer-layer0", from: "engineer", to: "layer0", pages: ["after"], cls: "new", pts: [[100, 375], [1460, 375]], label: "runs it once", lp: [1250, 369] },
  { id: "engineer-constraints", from: "engineer", to: "constraints", pages: ["after"], cls: "new", pts: [[280, 630], [680, 630], [680, 700]], label: "a line, after each session", lp: [420, 624], both: true },
  { id: "senior-constraints", from: "senior", to: "constraints", pages: ["after"], cls: "new", pts: [[560, 615], [690, 615], [690, 670]], label: "encoded", lp: [600, 609], la: "start" },
  { id: "senior-skills", from: "senior", to: "skills", pages: ["after"], cls: "new", pts: [[500, 395], [1150, 395]], label: "her checklist, as a skill", lp: [830, 389] },

  // inside the repository
  { id: "layer0-instructions", from: "layer0", to: "instructions", pages: ["after"], cls: "new", pts: [[1460, 610], [900, 610]], label: "produces", lp: [1180, 604] },
  { id: "instructions-constraints", from: "instructions", to: "constraints", cls: "sec", both: true },
  { id: "constraints-appdesc", from: "constraints", to: "appdesc", pages: ["after"], cls: "sec", both: true },
  { id: "constraints-implguide", from: "constraints", to: "implguide", pages: ["after"], cls: "sec", label: "rules the design respects", lp: [848, 800], la: "start" },
  { id: "appdesc-implguide", from: "appdesc", to: "implguide", pages: ["after"], cls: "sec", label: "read in every story", lp: [1068, 800], la: "start" },
  { id: "implguide-report", from: "implguide", to: "report", pages: ["after"], cls: "sec", label: "intention → result", lp: [1145, 849] },
  { id: "implguide-code", from: "implguide", to: "code", pages: ["after"], cls: "new", label: "the change map", lp: [913, 925], la: "start" },
  { id: "report-tests", from: "report", to: "tests", pages: ["after"], cls: "sec", label: "evidence", lp: [1398, 925], la: "start" },
  { id: "code-tests", from: "code", to: "tests", both: true },

  // repository <-> agent
  { id: "instructions-autoload", from: "instructions", to: "autoload", pages: ["after"], cls: "new", pts: [[840, 455], [2320, 455], [2320, 685]], label: "auto-loaded, every session", lp: [1900, 449] },
  { id: "skills-skillrun", from: "skills", to: "skillrun", pages: ["after"], cls: "new", pts: [[1150, 475], [1620, 475], [1620, 1045]], label: "loaded when the task matches, or by /name", lp: [1626, 598], la: "start" },
  { id: "implguide-tools", from: "implguide", to: "tools", pages: ["after"], cls: "new", pts: [[1000, 945], [1600, 945], [1600, 855]], label: "written, then read by path", lp: [1300, 939], both: true },
  { id: "report-tools", from: "report", to: "tools", pages: ["after"], cls: "new", pts: [[1650, 820]], label: "writes", lp: [1655, 814], la: "start", both: true },
  { id: "code-tools", from: "code", to: "tools", pts: [[1000, 1110], [1660, 1110], [1660, 875]], label: "reads, edits, runs", lp: [1300, 1104], both: true },

  // people <-> agent
  { id: "engineer-session", from: "engineer", to: "session", pts: [[240, 435], [1995, 435]], label: "the ask: a prompt in the chat", lp: [1100, 429], both: true },
  { id: "senior-session", from: "senior", to: "session", pages: ["before"], cls: "bad", pts: [[500, 415], [1900, 415]], label: "her long prompt, from her head", lp: [1100, 409] },
  { id: "question-session", from: "question", to: "session", pages: ["after"], cls: "new", pts: [[345, 1185], [1670, 1185], [1670, 535]], label: "asked at the end; the answer comes back as a signal", lp: [1000, 1179], both: true },
  { id: "head-session", from: "head", to: "session", pages: ["before"], cls: "bad", pts: [[1630, 685], [1630, 535]], label: "a decision made in chat, written nowhere", lp: [1100, 679], both: true },
  { id: "newcomer-session", from: "newcomer", to: "session", pages: ["before"], cls: "bad", pts: [[1640, 855], [1640, 555]], label: "asks the agent, which never knew either", lp: [1100, 849] },

  // inside the agent
  { id: "session-model", from: "session", to: "model", both: true },
  { id: "session-autoload", from: "session", to: "autoload", both: true },
  { id: "session-tools", from: "session", to: "tools", both: true },
  { id: "model-tools", from: "model", to: "tools", cls: "sec", both: true },
  { id: "tools-skillrun", from: "tools", to: "skillrun", pages: ["after"], both: true },
  { id: "autoload-skillrun", from: "autoload", to: "skillrun", pages: ["after"], cls: "sec", pts: [[2320, 685], [2320, 1045]], both: true }
];
