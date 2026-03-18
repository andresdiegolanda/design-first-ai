# angular-user-search

Standalone Angular 17 application demonstrating the Design-First methodology on a frontend component.
Single feature: search users from JSONPlaceholder by name, username, or email.

This app lives at `examples/02-angular-component/app/`. The design conversation that produced it
is at `examples/02-angular-component/conversation/design-conversation.md`.

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

### 1. Open in VS Code

```bash
git clone https://github.com/[your-username]/design-first-ai
cd design-first-ai/examples/02-angular-component/app
code .
```

VS Code will prompt you to install recommended extensions (`.vscode/extensions.json`).
Install them: GitHub Copilot, GitHub Copilot Chat, Angular Language Service.

### 2. Install dependencies

```bash
npm install
```

### 3. Run

```bash
ng serve
```

Open `http://localhost:4200`. Type in the search box to filter users.

### 4. Run tests

```bash
ng test
```

8 tests. No network calls — UserService is mocked.

---

## Using Copilot with This Project

### The flow

1. Copilot Chat opens → `.github/copilot-instructions.md` auto-loaded (Layers 1 and 2)
2. Load Layer 3 skills: `#file:context/layer-3-skills.md`
3. Load Layer 4 templates: `#file:context/layer-4-prompt-templates.md`
4. Write a Layer 5 story context for your task
5. Work through Levels 1–4 before any code is generated
6. Level 5: Copilot generates against the approved contracts

---

## Project Structure

```
.github/
└── copilot-instructions.md     ← Layers 1+2: auto-loaded by Copilot
.vscode/
├── settings.json               ← Model config + Copilot settings
└── extensions.json             ← Recommended extensions
context/
├── layer-0-architecture.md     ← Layer 0 output: architecture + design constraints
├── layer-0-design-principles.md ← Layer 0 output: conventions + anti-patterns
├── layer-1-base-instructions.md ← Layer 1: project identity + non-negotiables
├── layer-3-skills.md           ← Layer 3: subscriptions, debounce, state, testing
├── layer-4-prompt-templates.md ← Layer 4: task prompt templates
└── layer-5-story-context.md    ← Layer 5: story context (template — write new per task)
src/app/
├── models/user.model.ts        ← User interface
├── services/user.service.ts    ← HTTP layer
└── user-search/                ← Feature folder
    ├── user-search.component.ts
    ├── user-search.component.html
    ├── user-search.component.scss
    └── user-search.component.spec.ts
```

---

## This App Was Designed Using the Methodology

See `../conversation/design-conversation.md` for the complete Design-First conversation:
two corrections caught before any code was written — one at Level 2 (unnecessary component),
one at Level 4 (wrong state pattern).
