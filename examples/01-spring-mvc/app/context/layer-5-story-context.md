# Layer 5 — Story Context (Example: Product Catalog API)

## Story

**ID:** DEMO-001
**Title:** Implement product catalog CRUD API
**Type:** New feature

## What Must Be Built

A REST API with four endpoints:
- `GET /api/v1/products` — list all products
- `GET /api/v1/products/{id}` — get one product by UUID
- `POST /api/v1/products` — create a product (name + price required)
- `DELETE /api/v1/products/{id}` — delete a product by UUID

Products are stored in memory. No database.

## What Is Explicitly Out of Scope

- No update (PUT/PATCH) endpoint
- No search or filtering
- No pagination
- No authentication
- No persistence between restarts

## Constraints

- `UUID` for all product IDs — never `Long` or sequential int
- Name must be validated as not-blank; price must be positive
- HTTP 404 on get or delete of unknown ID
- HTTP 201 on successful create
- HTTP 204 on successful delete

## Decisions Already Made

- In-memory store: `ConcurrentHashMap<UUID, Product>` in the service
- No repository interface — service owns the map directly
- Records for `Product` and `CreateProductRequest`

## Open Questions

- Should the `ProductRepository` interface be introduced as an abstraction for the map?

## Skills Needed

- [x] Error Handling
- [x] Testing
- [x] In-Memory Store
