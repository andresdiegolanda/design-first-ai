# Layer 4 — Prompt Templates (angular-user-search)

> **What this is:** Standardized opening prompts for recurring task types in this project.
> **When to load it:** When your task matches one of the categories below.
> **How to use it:** Load with `#file:context/layer-4-prompt-templates.md`, copy the relevant template, fill in `[BRACKETS]`, use as your opening Copilot Chat message.

---

## Template: New Feature Component — Full Design-First Flow

Use when: Adding a new standalone component with HTTP data, state management, and filtering.

```
I need to build [feature name] in angular-user-search.

Context loaded:
- Stack: Angular 17 | TypeScript 5.4 | RxJS 7.8 | standalone components
- State pattern: explicit loading/error/data properties — no async pipe
- Subscription pattern: takeUntil(this.destroy$) — always
- No UI library — plain HTML + SCSS

Before writing any code, walk me through the design at each level.

Level 1 — Capabilities:
The component must [requirement 1], [requirement 2].
It must NOT [exclusion 1 — e.g. no pagination, no server-side filter].

Level 2 — Components:
Existing: UserService (HTTP), User model.
Do not add new services unless this feature has a distinct HTTP endpoint.
List only the components needed with one-line purposes. No code.

Level 3 — Interactions:
Entry: user interaction or lifecycle event
Exit: updated template state
Include: what triggers a fetch, what triggers a filter, what error paths exist.

Level 4 — Contracts:
Component properties (name, type, initial value).
Service method signatures if new.
Template binding points (which properties bind to which template elements).
No implementation. Wait for my approval.

No code until I approve Level 4.
```

---

## Template: Add a Filter or Search Behaviour

Use when: Adding a new filter field or modifying debounce/filter logic.

```
I need to [add / modify] [filter description] in [ComponentName].

Current filter behaviour: [describe what exists]
Required change: [describe what needs to change]

Constraints:
- Debounce at 300ms using FormControl.valueChanges
- distinctUntilChanged() must remain in the pipe
- Filter method must be synchronous — no Observable inside it
- takeUntil(this.destroy$) must remain on the subscription

Level 4 — Contracts:
Show me the updated FormControl declarations, the updated pipe chain,
and the updated filter method signature before writing implementation.
Wait for my approval.
```

---

## Template: Test Coverage

Use when: Writing tests for a new or modified component.

```
I need tests for [ComponentName].

Scenarios to cover:
- [scenario 1 — e.g. on init, data loads and populates filteredItems]
- [scenario 2 — e.g. filter by name returns matching items]
- [scenario 3 — e.g. empty query resets to all items]
- [scenario 4 — e.g. service throws, error state set]
- [scenario 5 — e.g. retry after error reloads data]

Setup:
- jasmine.createSpyObj for [ServiceName] with methods: [method1], [method2]
- TestBed.configureTestingModule with standalone component + ReactiveFormsModule
- fakeAsync + tick(300) for debounce scenarios

Assert on component properties only — not DOM.
Test names: method_condition_expectedResult

Generate the tests. Follow the patterns in user-search.component.spec.ts.
```

---

## Template: Bug Investigation

Use when: Diagnosing unexpected behaviour in a component.

```
I have unexpected behaviour in [ComponentName].

Observed: [what is happening]
Expected: [what should happen]
Conditions: [always / specific input / after specific action]

Relevant component state at the time of the bug:
- loading: [value]
- error: [value]
- filteredUsers / filteredItems: [count or value]

Relevant code:
[paste the method or subscription chain]

Do not propose a fix yet.
First identify the most likely causes. For each, tell me what evidence confirms or eliminates it.

Areas to check:
- takeUntil timing — is destroy$ completing too early?
- debounce — is tick(300) advancing past the timer correctly in tests?
- filter logic — is the null coercion (query ?? '') in place?
- distinctUntilChanged — could identical values be suppressed unexpectedly?
```
