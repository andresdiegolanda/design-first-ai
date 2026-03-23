# DEMO-002 — Implementation Guide
## User Search Component

> **Story:** DEMO-002
> **Status:** Executed — see `docs/DEMO-002-execution-report.md`
> **App description:** `.github/copilot-layer-0-architecture.md`

---

## Scope

Build a standalone Angular 17 component that searches users from JSONPlaceholder.

**What must be built:**
- Load all users from `https://jsonplaceholder.typicode.com/users` on `ngOnInit`
- Filter client-side by name, username, or email with 300ms debounced input
- Show four mutually exclusive states: loading, error (with Retry button), empty, results

**Explicitly out of scope:**
- No server-side search — JSONPlaceholder has no search endpoint
- No pagination
- No sorting
- No user detail view
- No NgModule

---

## Components

| Component / Service | Purpose |
|--------------------|---------|
| `UserSearchComponent` | Owns all search state: `users`, `filteredUsers`, `loading`, `error`. Handles debounce, filtering, and retry. |
| `UserService` | HTTP GET to JSONPlaceholder — no business logic. Returns `Observable<User[]>`. |
| `User` | Interface — `id`, `name`, `username`, `email` (minimum required fields). |

**Constraint:** No `SearchResultsComponent`. The filtered list is a `*ngFor` loop — it
does not justify its own component. `UserSearchComponent` owns all state and renders
everything.

---

## Interactions

```
On ngOnInit:
  → UserSearchComponent.loadUsers()
  → this.loading = true, this.error = null
  → UserService.getUsers()
  → GET https://jsonplaceholder.typicode.com/users
  → success: this.users = data, this.filteredUsers = data, this.loading = false
  → error: this.error = 'Failed to load users. Please try again.', this.loading = false

On searchControl.valueChanges (debounced 300ms, distinctUntilChanged):
  → UserSearchComponent.filterUsers(query: string)
  → if empty: this.filteredUsers = this.users
  → if non-empty: filter by name/username/email (case insensitive, includes)
  → Angular renders updated filteredUsers

On Retry click:
  → UserSearchComponent.retry()
  → calls loadUsers() — resets loading and error, retries HTTP call
```

---

## Contracts

### Component properties

| Property | Type | Initial value |
|----------|------|---------------|
| `searchControl` | `FormControl` | `new FormControl('')` |
| `users` | `User[]` | `[]` |
| `filteredUsers` | `User[]` | `[]` |
| `loading` | `boolean` | `false` |
| `error` | `string \| null` | `null` |
| `destroy$` (private) | `Subject<void>` | `new Subject<void>()` |

### Methods

```typescript
ngOnInit(): void           // calls loadUsers(), sets up valueChanges subscription
ngOnDestroy(): void        // destroy$.next() + destroy$.complete()
private loadUsers(): void  // HTTP call — sets users/filteredUsers/loading/error
private filterUsers(query: string): void  // filters users array, updates filteredUsers
retry(): void              // calls loadUsers()
```

### UserService

```typescript
getUsers(): Observable<User[]>   // GET https://jsonplaceholder.typicode.com/users
```

### User interface (minimum fields)

```typescript
export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}
```

### Template binding points

| Template element | Bound to |
|-----------------|----------|
| Search input | `[formControl]="searchControl"` |
| Loading block | `*ngIf="loading"` |
| Error block | `*ngIf="error && !loading"` |
| Retry button | `(click)="retry()"` |
| Empty block | `*ngIf="!loading && !error && filteredUsers.length === 0"` |
| Results list | `*ngIf="!loading && !error && filteredUsers.length > 0"` |
| Result items | `*ngFor="let user of filteredUsers"` |

---

## Constraints

- `takeUntil(this.destroy$)` on every subscription — no exceptions
- `debounceTime(300)` + `distinctUntilChanged()` in the valueChanges pipe
- `query ?? ''` — coerce null to empty string before passing to filterUsers
- `loading = true` and `error = null` at the start of every load call
- `loading = false` in both `next` and `error` callbacks
- Service tests use `jasmine.createSpyObj` — not `jasmine.createSpy`
- `fakeAsync` + `tick(300)` for debounce scenarios in tests
- Assert on component properties — not DOM
