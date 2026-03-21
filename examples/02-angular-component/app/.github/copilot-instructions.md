# angular-user-search — Copilot Instructions

> Auto-loaded by GitHub Copilot for every chat session in this workspace.
> This is Layers 1 and 2 of the Design-First AI Collaboration framework.
> Keep under 150 lines. Last reviewed: 2026-03-19.
>
> Layer 2 source: `context/layer-2-file-patterns.md`
> Load per task: `#file:context/layer-3-skills.md` | `#file:context/layer-4-prompt-templates.md`

---

## Project Identity

Standalone Angular 17 application demonstrating the Design-First methodology.
Single feature: a user search component that queries JSONPlaceholder, filters results
client-side, and handles loading, error, and empty states explicitly.

- **Stack:** Angular 17 | TypeScript 5.4 | RxJS 7.8 | SCSS
- **Architecture:** Standalone components — no NgModule
- **Build:** Angular CLI (`ng serve`, `ng test`)

---

## Architecture

One feature component (`UserSearchComponent`) owns all search state.
One service (`UserService`) owns HTTP — no business logic.
No router. No state management library. No UI component library.

Data flow: `UserSearchComponent` → `UserService.getUsers()` → filter client-side → render.

---

## Non-Negotiables

- Standalone components only — no `NgModule` declarations
- No async pipe — state is managed as component properties (`users`, `filteredUsers`,
  `loading`, `error`)
- Constructor injection only — no `inject()` function
- `takeUntil(this.destroy$)` on every subscription — no manual `unsubscribe()`
- Debounce search input at 300ms — never on every keystroke

---

## What This Project Is NOT

- Not server-side filtered — JSONPlaceholder has no search endpoint; filter is client-side
- Not paginated — all 10 JSONPlaceholder users load at once
- Not authenticated
- Not using Angular Material or any other UI library — plain HTML + SCSS only

---

## Canonical Code Patterns

**Component with subscription cleanup:**
```typescript
@Component({ standalone: true, ... })
export class [Feature]Component implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.someService.getData().pipe(
      takeUntil(this.destroy$)
    ).subscribe({ next: ..., error: ... });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

**Service — HTTP only, no logic:**
```typescript
@Injectable({ providedIn: 'root' })
export class [Feature]Service {
  constructor(private http: HttpClient) {}

  getData(): Observable<[Type][]> {
    return this.http.get<[Type][]>(`${this.baseUrl}/[endpoint]`);
  }
}
```

---

## Naming Conventions

| Element | Pattern | Example |
|---------|---------|---------|
| Components | `{Feature}Component` | `UserSearchComponent` |
| Services | `{Feature}Service` | `UserService` |
| Models | `{Entity}.model.ts` | `user.model.ts` |
| Specs | `{file}.spec.ts` | `user-search.component.spec.ts` |
| SCSS files | same name as component | `user-search.component.scss` |

---

## Project Structure

```
src/app/
├── models/               Interfaces only — no classes
├── services/             HTTP services — no logic beyond HTTP calls
└── user-search/          Feature folder: component, template, styles, spec
```

New features get their own folder under `src/app/`. One component per folder.
Models go in `src/app/models/`. Services go in `src/app/services/`.

---

## Anti-Patterns — Never Propose These

- Do not use `NgModule` — standalone components only
- Do not use `async` pipe for state that has loading/error conditions — use explicit
  properties (`loading`, `error`, `data`)
- Do not use `inject()` — constructor injection only
- Do not subscribe without `takeUntil(this.destroy$)` — memory leaks
- Do not use `any` type — explicit types always
- Do not add Angular Material, PrimeNG, or any component library
- Do not add NgRx, Akita, or any state management library
- Do not add routing — this is a single-component demo
