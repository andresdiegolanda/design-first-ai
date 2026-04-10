---
name: in-memory-store
description: ConcurrentHashMap CRUD pattern for the Spring MVC demo. Use when adding a new resource type with in-memory CRUD.
---

# Skill: In-Memory Store (spring-mvc-demo)

## Pattern — `ConcurrentHashMap` in the service

```java
@Service
public class [Resource]Service {
    private final Map<UUID, [Resource]> store = new ConcurrentHashMap<>();

    public [Resource] create(Create[Resource]Request request) {
        UUID id = UUID.randomUUID();
        [Resource] item = new [Resource](id, request.name(), ...);
        store.put(id, item);
        return item;
    }

    public [Resource] getById(UUID id) {
        [Resource] item = store.get(id);
        if (item == null) throw new [Resource]NotFoundException(id);
        return item;
    }

    public void delete(UUID id) {
        if (store.remove(id) == null) throw new [Resource]NotFoundException(id);
    }
}
```

## Rules

- `ConcurrentHashMap` — thread-safe without external locking.
- `UUID.randomUUID()` for every new ID — never accept IDs from the client.
- `store.remove(id) == null` is the idiomatic not-found check for delete.
- `new ArrayList<>(store.values())` for list — returns a snapshot, safe to return.

## Design Constraints

- Do not accept IDs from the request body — always generate with `UUID.randomUUID()`
- Do not add a `ProductRepository` interface — the map is the store
- Do not expose the map directly — always through service methods
