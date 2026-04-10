---
name: debounced-search
description: FormControl with debounceTime pattern for search inputs. Use when implementing any search or filter input.
---

# Skill: Debounced Search (angular-user-search)

## The pattern — `FormControl` + debounce

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

## Rules

- `debounceTime(300)` — 300ms standard. Do not lower.
- `distinctUntilChanged()` — prevents redundant filter runs.
- `query ?? ''` — `valueChanges` can emit `null`; always coerce to string.
- The filter method takes a plain string and is synchronous.

## Template binding

```html
<input type="text" [formControl]="searchControl" aria-label="..." />
```

## Design Constraints

- Do not use `(input)` or `(keyup)` event bindings — use `FormControl.valueChanges`
- Do not use `ngModel` — reactive forms only
- Do not debounce at less than 300ms
