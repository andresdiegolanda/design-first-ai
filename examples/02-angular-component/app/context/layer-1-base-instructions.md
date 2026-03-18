# Layer 1 — Base Instructions (angular-user-search)

## Project Identity

- **Name:** angular-user-search
- **Purpose:** Standalone Angular 17 app demonstrating the Design-First methodology on a frontend component
- **Type:** Single-page application, single feature
- **Status:** Demo project — exists to illustrate the Design-First framework applied to Angular

## Architecture Overview

One component (`UserSearchComponent`) owns all search state. One service (`UserService`) handles
HTTP. All filtering is client-side. No routing, no state library, no UI library. The component
fetches all users once on init and filters the local array on every debounced input change.

## Tech Stack

| Component | Technology | Version |
|-----------|------------|---------|
| Framework | Angular | 17.x |
| Language | TypeScript | 5.4.x |
| Reactive | RxJS | 7.8.x |
| Styles | SCSS | — |
| Build | Angular CLI | 17.3.x |

## Non-Negotiables

- Standalone components — no NgModule
- No async pipe for state with loading/error conditions — explicit properties only
- Constructor injection — no `inject()` function
- `takeUntil(this.destroy$)` on every subscription
- 300ms debounce on search input — never raw keystroke events

## What This Project Is Not

- Not server-side filtered
- Not paginated
- Not authenticated
- Not using any UI component library

## Anti-Patterns

- No `NgModule` — standalone only
- No `async` pipe where loading/error state is needed
- No `inject()` — constructor only
- No unguarded subscriptions — always `takeUntil`
- No `any` type
