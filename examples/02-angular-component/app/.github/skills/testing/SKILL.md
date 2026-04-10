---
name: testing
description: Jasmine and TestBed patterns for Angular components. Use when writing any new test or adding coverage.
---

# Skill: Testing Angular Components (angular-user-search)

## Setup pattern

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

## Rules

- Use `jasmine.createSpyObj` — not `jasmine.createSpy`.
- `of(mockData)` for success, `throwError(() => new Error(...))` for errors.
- `fakeAsync` + `tick(300)` to advance the debounce timer.
- Assert on component properties — not DOM.

## Test naming

`method_condition_expectedResult`

## Design Constraints

- Do not use `fixture.debugElement` or `nativeElement` queries — component state only
- Do not use `TestBed.configureTestingModule` with full imports — import only what's needed
