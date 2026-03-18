# Layer 5 — Story Context (Example: User Search Component)

## Story

**ID:** DEMO-002
**Title:** Implement `UserSearchComponent` with debounced search and explicit states
**Type:** New feature

## What Must Be Built

A standalone Angular component that:
- Loads all users from JSONPlaceholder on init
- Provides a text input that filters the loaded users client-side by name, username, or email
- Debounces input at 300ms
- Shows loading state during the HTTP call
- Shows error state with a Retry button if the HTTP call fails
- Shows empty state when the filter matches nothing

## What Is Explicitly Out of Scope

- No server-side search — JSONPlaceholder has no filter endpoint
- No pagination
- No sorting
- No user detail view or navigation
- No authentication

## Constraints

- Must use `FormControl` and `valueChanges` — not `(input)` or `(keyup)` bindings
- Must use `takeUntil(this.destroy$)` on every subscription
- State must be explicit properties (`loading`, `error`, `filteredUsers`) — no `async` pipe
- Must not use `NgModule` — standalone component only

## Decisions Already Made

- JSONPlaceholder `/users` returns 10 users — client-side filtering is appropriate
- Filter matches on `name`, `username`, and `email` fields — case insensitive
- Debounce: 300ms (project standard)
- No UI library — plain HTML + SCSS

## Open Questions

- Should the Retry button be styled as a link or a button?
- Should empty state distinguish between "no results for query" and "loaded with no data"?

## Skills Needed

- [x] Subscription Management
- [x] Debounced Search
- [x] Explicit State Management
- [x] Testing Angular Components
