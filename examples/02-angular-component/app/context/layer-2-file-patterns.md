# Layer 2 — File-Pattern Instructions (angular-user-search)

> **What this is:** Project structure, naming conventions, and canonical code patterns
> specific to this codebase.
> **Where it lives in Copilot:** This content is merged into `.github/copilot-instructions.md`
> alongside Layer 1. Both layers are auto-loaded at session start.
> **How to update:** Edit this file, then copy the changed sections into
> `copilot-instructions.md`. The standalone file is the source of record.

---

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

---

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

---

## Canonical Code Patterns

### Standalone component with subscription cleanup

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-[feature]',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './[feature].component.html',
  styleUrls: ['./[feature].component.scss']
})
export class [Feature]Component implements OnInit, OnDestroy {
  items: [Type][] = [];
  loading = false;
  error: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(private [feature]Service: [Feature]Service) {}

  ngOnInit(): void {
    this.load();
  }

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
      error: (err) => { this.error = 'Failed to load. Please try again.'; this.loading = false; }
    });
  }
}
```

### Service — HTTP only

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class [Feature]Service {
  private readonly baseUrl = 'https://[api-host]';

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
  // ...
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

---

## Design Constraints

- Do not create components outside a feature folder
- Do not put business logic in services — HTTP calls only
- Do not use `class` for models — interfaces only
- Do not name test descriptions with `should` — use `method_condition_expectedResult`
- Do not use `ngModel` — reactive forms (`FormControl`) only
- Do not import `BrowserModule` in standalone components — use `CommonModule`
