# How to create projects in Eric way

1. Start with the boring default stack unless the product has a real constraint
   that rules it out.
2. Keep the first scaffold small: app entrypoint, routing, data access, styling,
   tests, and formatting. Add generators, extra packages, or repo automation only
   when the project actually needs them.

## Frontend

1. Default to React, React Router, TanStack Query, and Zustand.
2. Use React Router for application routing and route-level loading boundaries.
3. Use TanStack Query for server state, async data, cache invalidation, and
   background refetching.
4. Use Zustand for shared client runtime state that is not server state, form
   state, or route state.
5. Keep simple interaction state in the owning component until it is shared.

## Rust

1. Default new Rust projects to a monorepo.
2. Use a Cargo workspace at the repo root, with crates split by real ownership:
   apps, shared domain crates, infrastructure adapters, and test helpers.
3. Keep closely related code in one crate until a separate crate removes a real
   dependency, build, ownership, or release boundary.
