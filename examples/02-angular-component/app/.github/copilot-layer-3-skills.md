# Layer 3 — Skills (angular-user-search)

> **When to load:** When your task involves subscriptions, debounced search, state management, or testing.
> **How to load:** Reference by path in agent mode, or `#file:.github/copilot-layer-3-skills.md`

---

## Skill: Subscription Management

Use when: Adding any Observable subscription to a component.

**The pattern — always `takeUntil`:**
```typescript
private destroy$ = new Subject<void>();

ngOnInit(): void {
  this.someObservable$.pipe(
    takeUntil(this.destroy$)
  ).subscribe({ next: ..., error: ... });
}

ngOnDestroy(): void {
  this.destroy$.next();
  this.destroy$.complete();
}
```

**Rules:**
- Every component that subscribes must implement `OnDestroy`.
- Every subscription must pipe through `takeUntil(this.destroy$)`.
- `destroy$` is always private and never exposed.
- Call `this.destroy$.next()` then `this.destroy$.complete()` — both, in that order.
- Never call `.unsubscribe()` manually — `takeUntil` handles it.

**Design Constraints:**
- Do not store `Subscription` objects and call `.unsubscribe()` in `ngOnDestroy`
- Do not use `async` pipe as a substitute for `takeUntil` — they solve different problems
- Do not add `takeUntilDestroyed()` from Angular CDK — this project uses the explicit Subject pattern

---

## Skill: Debounced Search

Use when: Implementing any input that triggers a search or filter operation.

**The pattern — `FormControl` + debounce:**
```typescript
searchControl = new FormControl('');

ngOnInit(): void {
  this.searchControl.valueChanges.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    takeUntil(this.destroy$)
  ).subscribe(query => this.filterItems(query ?? ''));
}
```

**Rules:**
- `debounceTime(300)` — 300ms standard. Do not lower.
- `distinctUntilChanged()` — prevents redundant filter runs.
- `query ?? ''` — `valueChanges` can emit `null`; always coerce to string.
- The filter method takes a plain string and is synchronous.

**Template binding:**
```html
<input type="text" [formControl]="searchControl" aria-label="..." />
```

**Design Constraints:**
- Do not use `(input)` or `(keyup)` event bindings — use `FormControl.valueChanges`
- Do not use `ngModel` — reactive forms only
- Do not debounce at less than 300ms

---

## Skill: Explicit State Management

Use when: A component loads data from HTTP and must show loading/error/empty states.

**The pattern — three explicit state properties:**
```typescript
items: Item[] = [];
loading = false;
error: string | null = null;

private loadItems(): void {
  this.loading = true;
  this.error = null;
  this.itemService.getItems().pipe(
    takeUntil(this.destroy$)
  ).subscribe({
    next: (items) => { this.items = items; this.loading = false; },
    error: (err) => {
      this.error = 'Failed to load items. Please try again.';
      this.loading = false;
      console.error('[ComponentName]: failed to load items', err);
    }
  });
}
```

**Template state blocks (mutually exclusive):**
```html
<div *ngIf="loading">Loading…</div>
<div *ngIf="error && !loading">{{ error }} <button (click)="retry()">Retry</button></div>
<div *ngIf="!loading && !error && items.length === 0">No results.</div>
<ul *ngIf="!loading && !error && items.length > 0">...</ul>
```

**Rules:**
- `loading = true` and `error = null` at the start of every load call.
- `loading = false` in both `next` and `error` callbacks.
- Error message is user-readable — never expose technical details.
- `retry()` simply calls the load method again.

**Design Constraints:**
- Do not use `async` pipe when loading/error states are needed
- Do not throw errors from the error callback — set `this.error` and stop

---

## Skill: Testing Angular Components

Use when: Writing tests for any component in this project.

**Setup pattern:**
```typescript
let userServiceSpy: jasmine.SpyObj<UserService>;

beforeEach(async () => {
  userServiceSpy = jasmine.createSpyObj('UserService', ['getUsers']);
  await TestBed.configureTestingModule({
    imports: [UserSearchComponent, ReactiveFormsModule],
    providers: [{ provide: UserService, useValue: userServiceSpy }]
  }).compileComponents();
});
```

**Rules:**
- Use `jasmine.createSpyObj` — not `jasmine.createSpy`.
- `of(mockData)` for success, `throwError(() => new Error(...))` for errors.
- `fakeAsync` + `tick(300)` to advance the debounce timer.
- Assert on component properties — not DOM.

**Test naming:** `method_condition_expectedResult`

**Design Constraints:**
- Do not use `fixture.debugElement` or `nativeElement` queries — component state only
- Do not use `TestBed.configureTestingModule` with full imports — import only what's needed
