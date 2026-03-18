# Master Prompt

> **What this is:** The single opening message that sets the Design-First pattern in motion.
> **When to use it:** At the start of any multi-component design session.
> **How to use it:** Copy this, fill in the brackets, paste as your first message. The AI will present each level and wait for approval before continuing.

---

```
I need to build [feature name].

Before writing any code, walk me through the design one level at a time:

Level 1 — Capabilities
What this must do: [requirement 1], [requirement 2], [requirement 3]
What this must NOT do: [exclusion 1], [exclusion 2]
Present only the confirmed scope. Wait for my approval.

Level 2 — Components
Existing components available: [component 1], [component 2]
Constraint: Do not introduce new abstractions unless strictly necessary.
Present only the component list with a one-line purpose for each. No code. Wait for my approval.

Level 3 — Interactions
Entry point: [how this feature is triggered]
Exit point: [what it returns or produces]
Present only the data flow between components. No method signatures yet. Wait for my approval.

Level 4 — Contracts
Conventions: [naming convention], [type conventions]
Present only method signatures, types, and DTOs. No implementation. Wait for my approval.

Level 5 — Implementation
Only after I approve Level 4: write the code.
Follow all conventions from the loaded context.
No unrequested additions — implement exactly what the approved design specifies.
```

---

## Filled Example — Angular Component (DEMO-002)

The opening message below produced the design conversation in
`examples/02-angular-component/conversation/design-conversation.md`.
Compare the bracket density above to the specificity below — the quality of Level 5 output
is proportional to the specificity here.

```
I need to build the UserSearchComponent (DEMO-002).

Before writing any code, walk me through the design one level at a time.

Level 1 — Capabilities
What this must do:
- Load all users from JSONPlaceholder on init
- Filter client-side by name, username, or email with 300ms debounce
- Show loading, error (with Retry), and empty states explicitly
What this must NOT do: no server-side search, no pagination, no NgModule
Present only confirmed scope. Wait for my approval.

Level 2 — Components
Existing: UserService (HTTP), User model
Constraint: Do not add components unless strictly necessary.
Present only component list with one-line purpose. No code. Wait for my approval.

Level 3 — Interactions
Entry: ngOnInit + user typing in search input
Exit: updated filteredUsers array, loading/error booleans
Present only data flow. No signatures. Wait for my approval.

Level 4 — Contracts
Present component properties (name, type, initial value), service signatures, and
template binding points. No implementation. Wait for my approval.

Level 5 — Implementation
Only after Level 4 approval.
```

The key differences between the template and this filled version:
- Requirements are sentences, not noun phrases
- Exclusions are specific, not generic
- Existing components are named — Copilot knows not to recreate them
- Level 3 names the entry and exit points rather than describing them abstractly
- Level 4 specifies what kind of contracts to show (not just "contracts")
