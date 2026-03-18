# Design Conversation — User Search Component (DEMO-002)

This is a complete example of the Design-First conversation for the `UserSearchComponent`.
It shows the full exchange: what was asked at each level, what Copilot proposed, and what
was approved or corrected.

Context loaded before this conversation:
- `context/layer-0-architecture.md`
- `context/layer-0-design-principles.md`
- `context/layer-1-base-instructions.md`
- `context/layer-3-skills.md` (Subscription Management + Debounced Search + Explicit State skills)
- `context/layer-5-story-context.md`

---

## Opening Message (Master Prompt)

```
I need to build the UserSearchComponent (DEMO-002).

Before writing any code, walk me through the design one level at a time.

Level 1 — Capabilities
What this must do:
- Load all users from JSONPlaceholder on init
- Filter client-side by name, username, or email with 300ms debounce
- Show loading, error (with Retry), and empty states explicitly

What this must NOT do:
- No server-side search
- No pagination
- No user detail view
- No NgModule

Present only confirmed scope. Wait for my approval.

Level 2 — Components
Existing: UserService (HTTP), User model
Constraint: Do not add components unless strictly necessary.
Present only component list with one-line purpose each. No code. Wait for my approval.

Level 3 — Interactions
Entry: ngOnInit + user typing
Exit: updated filteredUsers array, loading/error booleans
Present only data flow. No signatures. Wait for my approval.

Level 4 — Contracts
Present component properties, service signatures, template binding points.
No implementation. Wait for my approval.

Level 5 — Implementation
Only after Level 4 approval.
```

---

## Level 1 — Capabilities

**Copilot proposed:**
> In scope: Load users on init, filter by name/username/email, 300ms debounce, explicit
> loading/error/empty states, Retry on error.
> Out of scope: Server-side search, pagination, sorting, user detail, NgModule.

**Human approved:**
> Level 1 approved. Confirmed scope.
> One open question to resolve at Level 2: the Retry button — link or button element?
> Proceed to Level 2.

---

## Level 2 — Components

**Copilot proposed:**
> 1. `UserSearchComponent` — owns all search state and filtering logic
> 2. `SearchResultsComponent` — renders the filtered list (new component)
> 3. `UserService` — existing, HTTP only
> 4. `User` model — existing interface

**Human pushed back:**
> Remove `SearchResultsComponent`. The filtered list is a `*ngFor` loop — it does not
> justify its own component. One component owns all state and renders everything.

**Copilot revised:**
> 1. `UserSearchComponent` — owns all state, filtering, and renders the result list
> 2. `UserService` — existing, HTTP only
> 3. `User` model — existing interface

**Human approved:**
> Level 2 approved. Two components (one new), one service, one model.
> Resolving the Retry open question: standard `<button>` element, styled minimally.
> Proceed to Level 3.

---

## Level 3 — Interactions

**Copilot proposed:**
```
On ngOnInit:
1. UserSearchComponent sets loading = true, error = null
2. UserSearchComponent → UserService.getUsers()
3. UserService → GET https://jsonplaceholder.typicode.com/users
4. Response → UserSearchComponent.users and filteredUsers = all users
5. loading = false
6. On error → error = message, loading = false

On searchControl.valueChanges (debounced 300ms):
1. filterUsers(query) called
2. If empty → filteredUsers = this.users
3. If non-empty → filter users by name/username/email (case insensitive)
4. filteredUsers updated → Angular renders list

On Retry click:
1. Calls loadUsers() — resets loading and error, retries HTTP call
```

**Human approved:**
> Level 3 approved. Flow is correct.
> Confirming: empty query resets to all users. Error on retry resets to error state again.
> Proceed to Level 4.

---

## Level 4 — Contracts

**Copilot proposed:**
```typescript
// Component properties
searchControl: FormControl<string | null> = new FormControl('');
users$: Observable<User[]>; // from UserService
filteredUsers$: Observable<User[]>; // derived from users$ + searchControl
loading$: Observable<boolean>;
error$: Observable<string | null>;

// Template: async pipe usage
// *ngIf="loading$ | async"
// *ngFor="let user of filteredUsers$ | async"
```

**Human pushed back:**
> Reject the Observable-per-state approach. This project uses explicit component properties,
> not async pipes. Loading and error states cannot be cleanly represented with async pipe.
> See layer-0-design-principles.md and the Explicit State Management skill.

**Copilot revised:**
```typescript
// Component properties
searchControl = new FormControl('');
users: User[] = [];
filteredUsers: User[] = [];
loading = false;
error: string | null = null;
private destroy$ = new Subject<void>();

// Methods
ngOnInit(): void        // calls loadUsers(), sets up valueChanges subscription
ngOnDestroy(): void     // destroy$.next() + destroy$.complete()
loadUsers(): void       // HTTP call, sets users/filteredUsers/loading/error
filterUsers(query: string): void  // filters users array, updates filteredUsers
retry(): void           // calls loadUsers()

// Service (existing, no change)
UserService.getUsers(): Observable<User[]>
```

**Human approved:**
> Level 4 approved. Explicit properties confirmed.
> Proceed to Level 5.

---

## What This Conversation Demonstrates

**Unnecessary component caught at Level 2.** `SearchResultsComponent` would have been a
standalone component file, a spec file, and an `@Input()` binding — all for a `*ngFor` loop
that belongs in the parent template. Removed before any file was created.

**Wrong state pattern caught at Level 4.** Copilot defaulted to `Observable<T>` properties
with async pipe — a valid Angular pattern in many contexts. The Design Constraints in
`layer-0-design-principles.md` explicitly disallow it when loading/error state is needed.
Without that constraint documented, the correction would not have been visible at Level 4.
It would have arrived as "please refactor this after I've written the tests."

**The constraint did the work.** The human didn't need to explain why async pipe was wrong.
They referenced the document. The conversation moved forward in one exchange.

**Total conversation before implementation:** approximately 12 minutes. Total structural
corrections required in the generated code: zero.
