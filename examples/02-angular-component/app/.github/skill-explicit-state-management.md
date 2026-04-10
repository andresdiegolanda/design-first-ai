# Skill: Explicit State Management (angular-user-search)

> **Use when:** A component loads data from HTTP and must show loading/error/empty states.

## The pattern — three explicit state properties

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

## Template state blocks (mutually exclusive)

```html
<div *ngIf="loading">Loading…</div>
<div *ngIf="error && !loading">{{ error }} <button (click)="retry()">Retry</button></div>
<div *ngIf="!loading && !error && items.length === 0">No results.</div>
<ul *ngIf="!loading && !error && items.length > 0">...</ul>
```

## Rules

- `loading = true` and `error = null` at the start of every load call.
- `loading = false` in both `next` and `error` callbacks.
- Error message is user-readable — never expose technical details.
- `retry()` simply calls the load method again.

## Design Constraints

- Do not use `async` pipe when loading/error states are needed
- Do not throw errors from the error callback — set `this.error` and stop
