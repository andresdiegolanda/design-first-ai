# Skill: Subscription Management (angular-user-search)

> **Use when:** Adding any Observable subscription to a component.

## The pattern — always `takeUntil`

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

## Rules

- Every component that subscribes must implement `OnDestroy`.
- Every subscription must pipe through `takeUntil(this.destroy$)`.
- `destroy$` is always private and never exposed.
- Call `this.destroy$.next()` then `this.destroy$.complete()` — both, in that order.
- Never call `.unsubscribe()` manually — `takeUntil` handles it.

## Design Constraints

- Do not store `Subscription` objects and call `.unsubscribe()` in `ngOnDestroy`
- Do not use `async` pipe as a substitute for `takeUntil` — they solve different problems
- Do not add `takeUntilDestroyed()` from Angular CDK — this project uses the explicit Subject pattern
