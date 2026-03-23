# Layer 4 — Prompt Templates (angular-user-search)

> **When to load:** When your task matches one of the categories below.
> **How to load:** Reference by path in agent mode, or `#file:.github/copilot-layer-4-templates.md`
> Copy the relevant template, fill in `[BRACKETS]`, use as your opening message.

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

Build an implementation guide for this story.
The guide must be usable as a prompt input and understandable by a human.

Scope:
The component must [requirement 1], [requirement 2].
It must NOT [exclusion — e.g. no pagination, no server-side filter].

Components:
Existing: UserService (HTTP), User model.
Do not add new services unless this feature has a distinct HTTP endpoint.

Include:
- Scope section with explicit exclusions
- Components with single-line purposes
- Interactions: what triggers a fetch, what triggers a filter, error paths
- Contracts: component properties (name, type, initial value), service signatures if new,
  template binding points

No code in the guide. Wait for my approval before executing.
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

Build an implementation guide for this change.
Include: updated FormControl declarations, updated pipe chain, updated filter method signature.
No code. Wait for my approval before executing.
```

---

## Template: Test Coverage

Use when: Writing tests for a new or modified component.

```
I need tests for [ComponentName].

Scenarios:
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

Generate the tests. Follow patterns in user-search.component.spec.ts.
Run the tests when done and report results.
```

---

## Template: Bug Investigation

Use when: Diagnosing unexpected behaviour in a component.

```
I have unexpected behaviour in [ComponentName].

Observed: [what is happening]
Expected: [what should happen]
Conditions: [always / specific input / after specific action]

Component state at time of bug:
- loading: [value]
- error: [value]
- filteredUsers / filteredItems: [count or value]

Relevant code:
[paste the method or subscription chain]

Do not propose a fix yet.
First identify the most likely causes in order of probability.
For each, tell me what evidence confirms or eliminates it.
```
