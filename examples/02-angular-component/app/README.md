# angular-user-search

Standalone Angular 17 application demonstrating the Design-First methodology on a frontend component.
Single feature: search users from JSONPlaceholder by name, username, or email.

This app lives at `examples/02-angular-component/app/`.
Story documents live at `app/docs/`.

---

## What It Does

Debounced search input (300ms) filters a list of users loaded from JSONPlaceholder.
Explicit loading, error (with Retry), and empty states — no async pipe.

---

## Stack

| Component | Technology | Version |
|-----------|------------|---------|
| Framework | Angular | 17.3.x |
| Language | TypeScript | 5.4.x |
| Reactive | RxJS | 7.8.x |
| Styles | SCSS | — |
| Build | Angular CLI | 17.3.x |

---

## Prerequisites

- Node.js 18+
- npm 9+

No Docker. No API key. JSONPlaceholder is a public API with no authentication.

---

## Setup

```bash
git clone https://github.com/andresdiegolanda/design-first-ai
cd design-first-ai/examples/02-angular-component/app
code .
```

VS Code will prompt you to install recommended extensions (`.vscode/extensions.json`):
GitHub Copilot, GitHub Copilot Chat, Angular Language Service.

```bash
npm install
ng serve
```

Open `http://localhost:4200`.

---

## Run Tests

```bash
ng test
```

8 tests. No network calls — UserService is mocked.

---

## Using Copilot with This Project

1. Open the workspace — `.github/copilot-instructions.md` auto-loaded (Layers 1+2)
2. For a new story, read `docs/[STORY-ID]-impl-guide.md` for context
3. Skills auto-discovered from `.github/skills/` — invoke with `/subscription-management`, `/debounced-search`, `/explicit-state-management`, `/testing`
4. Use a template from `.github/copilot-layer-4-templates.md` as your opening message
5. Produce `docs/[STORY-ID]-impl-guide.md`, iterate until correct, then execute

---

## Project Structure

```
.github/
├── copilot-instructions.md              ← Layers 1+2 auto-loaded by Copilot
├── copilot-layer-0-architecture.md      ← Architecture + design constraints
├── copilot-layer-0-design-principles.md ← Conventions + anti-patterns
├── copilot-layer-1-base-instructions.md ← Project identity + non-negotiables (source)
├── copilot-layer-2-file-patterns.md     ← Structure, naming, canonical patterns (source)
├── copilot-layer-3-skills.md            ← Skills index
├── copilot-layer-4-templates.md         ← Task prompt templates
└── skills/                              ← Agent skills (auto-discovered by Copilot)
    ├── subscription-management/SKILL.md ← takeUntil pattern for Observable cleanup
    ├── debounced-search/SKILL.md        ← FormControl + debounceTime pattern
    ├── explicit-state-management/SKILL.md ← loading/error/empty state pattern
    └── testing/SKILL.md                 ← Jasmine + TestBed patterns
docs/
├── DEMO-002-impl-guide.md              ← Story DEMO-002: intention (what + how)
└── DEMO-002-execution-report.md         ← Story DEMO-002: result (what was built)
.vscode/
├── settings.json                        ← Model config + Copilot settings
└── extensions.json                      ← Recommended extensions
src/app/
├── models/user.model.ts                 ← User interface
├── services/user.service.ts             ← HTTP layer
└── user-search/                         ← Feature folder
    ├── user-search.component.ts
    ├── user-search.component.html
    ├── user-search.component.scss
    └── user-search.component.spec.ts
```

---

## Story Documents

Every story produces exactly two documents in `docs/`:

| File | Purpose |
|------|---------|
| `docs/[STORY-ID]-impl-guide.md` | Intention — scope, components, interactions, contracts. Written before any code. |
| `docs/[STORY-ID]-execution-report.md` | Result — what was built, deviations, how to run, how to test, commit message. |

See `docs/DEMO-002-impl-guide.md` and `docs/DEMO-002-execution-report.md` for the
initial build of this application.
