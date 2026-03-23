# DEMO-002 — Execution Report
## User Search Component

> **Story:** DEMO-002
> **Implementation guide:** `docs/DEMO-002-impl-guide.md`
> **Status:** Complete

---

## What Was Implemented

| File | Change | Location |
|------|--------|----------|
| `user-search.component.ts` | New — debounced FormControl, explicit state, HTTP load, filter, retry | `user-search/` |
| `user-search.component.html` | New — four mutually exclusive state blocks, `*ngFor` results | `user-search/` |
| `user-search.component.scss` | New — minimal styles | `user-search/` |
| `user-search.component.spec.ts` | New — 8 tests | `user-search/` |
| `user.service.ts` | New — single `getUsers()` method, HTTP only | `services/` |
| `user.model.ts` | New — `User` interface | `models/` |

**Test results:** 8 tests, 0 failures. No network calls — `UserService` mocked with `jasmine.createSpyObj`.

---

## Deviations from Implementation Guide

None. All contracts from the guide were implemented as specified.

Two minor additions during execution:
- `aria-label="Search users"` added to the search input — omitted from contracts but required for accessibility
- SCSS nesting depth reduced by one level — guide did not specify depth, agent defaulted to deeper nesting; flattened for readability

---

## Design Review Corrections

Two corrections were made during implementation guide review, before any code was written.

**Correction 1 — No SearchResultsComponent (Components section)**

The initial impl-guide draft proposed a separate `SearchResultsComponent` to render the filtered
list. Removed — a `*ngFor` loop does not justify its own component. The constraint is in
`.github/copilot-layer-0-architecture.md`: single feature component owns all state and rendering.

Cost if missed: new component file + spec file + `@Input()` binding + refactor of state ownership.

**Correction 2 — Explicit properties, not async pipe (Contracts section)**

The initial impl-guide draft proposed `Observable<T>` component properties with async pipe:
`users$: Observable<User[]>`, `loading$: Observable<boolean>`, etc. Rejected — async pipe cannot
represent loading and error states that depend on the same subscription. The constraint is in
`.github/copilot-layer-0-design-principles.md`: "Do not use async pipe when loading/error state
is needed."

Cost if missed: complete component rewrite — every property, every template binding, every test
would need to change once the loading/error state requirement surfaced.

Both corrections required one iteration of the impl-guide. Neither required touching any code.

---

## How to Run

```bash
npm install
ng serve
```

Open `http://localhost:4200`. Type in the search box to filter the user list.

---

## How to Run Tests

```bash
ng test
```

8 tests. No network calls — `UserService` is mocked.

---

## How to Test Manually

1. Start: `ng serve`
2. Open `http://localhost:4200`
3. Observe loading state on page load
4. Verify all 10 users appear after load
5. Type "Leanne" — verify list filters to one user
6. Type a username — verify filtering works
7. Type an email fragment — verify filtering works
8. Clear input — verify all users return
9. Type something with no match — verify empty state message
10. Disconnect network, click Retry — verify error state

---

## Commit Message

```
feat(DEMO-002): user search component with explicit state management

Standalone Angular 17 component with debounced client-side search.
Loads users from JSONPlaceholder on init. Filters by name, username, email.
Explicit loading/error/empty states — no async pipe.
8 tests: load, filter (3 fields), empty query, no match, error, retry.
```
