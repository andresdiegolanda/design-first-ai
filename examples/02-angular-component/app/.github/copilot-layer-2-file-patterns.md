# Layer 2 — File-Pattern Instructions (angular-user-search)

> **Source of record for Layer 2 content.**
> The content below is merged into `copilot-instructions.md` (auto-loaded).
> Edit this file, then update `copilot-instructions.md` accordingly.

## Project Structure

```
src/app/
├── models/               Interfaces only — no classes, no enums
│   └── user.model.ts
├── services/             HTTP only — no business logic
│   └── user.service.ts
└── [feature]/            One folder per feature component
    ├── [feature].component.ts
    ├── [feature].component.html
    ├── [feature].component.scss
    └── [feature].component.spec.ts

src/
├── main.ts               Bootstrap only
├── index.html
└── styles.scss           Global styles only — no component styles here
```

**Rule:** New features get their own folder under `src/app/`. One component per folder.
Models go in `src/app/models/`. Services go in `src/app/services/`.

## Naming Conventions

| Element | Pattern | Example |
|---------|---------|---------|
| Components | `{Feature}Component` | `UserSearchComponent` |
| Component files | `{feature-name}.component.ts` | `user-search.component.ts` |
| Services | `{Feature}Service` | `UserService` |
| Service files | `{feature-name}.service.ts` | `user.service.ts` |
| Models | `{Entity}.model.ts`, interface name = entity | `user.model.ts`, `User` |
| Spec files | `{source-file}.spec.ts` | `user-search.component.spec.ts` |
| Test descriptions | `method_condition_expectedResult` | `filterUsers_emptyQuery_returnsAllUsers` |

## Canonical Code Patterns

### Standalone component with subscription cleanup

```typescript
@Component({ standalone: true, ... })
export class [Feature]Component implements OnInit, OnDestroy {
  items: [Type][] = [];
  loading = false;
  error: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(private [feature]Service: [Feature]Service) {}

  ngOnInit(): void { this.load(); }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private load(): void {
    this.loading = true;
    this.error = null;
    this.[feature]Service.getItems().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (items) => { this.items = items; this.loading = false; },
      error: (err) => { this.error = 'Failed to load.'; this.loading = false; }
    });
  }
}
```

### Service — HTTP only

```typescript
@Injectable({ providedIn: 'root' })
export class [Feature]Service {
  constructor(private http: HttpClient) {}
  getItems(): Observable<[Type][]> {
    return this.http.get<[Type][]>(`${this.baseUrl}/[endpoint]`);
  }
}
```

### Model — interface only

```typescript
export interface [Entity] {
  id: number;
  name: string;
}
```

### Template state blocks — mutually exclusive

```html
<div *ngIf="loading">Loading…</div>
<div *ngIf="error && !loading">{{ error }} <button (click)="retry()">Retry</button></div>
<div *ngIf="!loading && !error && items.length === 0">No results.</div>
<ul *ngIf="!loading && !error && items.length > 0">
  <li *ngFor="let item of items">{{ item.name }}</li>
</ul>
```

## Design Constraints

- Do not create components outside a feature folder
- Do not put business logic in services — HTTP calls only
- Do not use `class` for models — interfaces only
- Do not name test descriptions with `should` — use `method_condition_expectedResult`
- Do not use `ngModel` — reactive forms (`FormControl`) only
- Do not import `BrowserModule` in standalone components — use `CommonModule`
