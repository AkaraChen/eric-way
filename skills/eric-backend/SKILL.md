---
name: eric-backend
description: Apply Eric's backend coding standards. Use when implementing, refactoring, or reviewing TypeScript or Rust backend code, service/repository boundaries, transport handlers, Hono/Elysia APIs, Drizzle schemas and migrations, Node.js queues, Rust domain models, typed errors, validation, adapters, or backend tests in Eric's style.
---

# Eric Backend

Use this skill for backend implementation or backend review.

## Workflow

1. Inspect the existing backend stack, entrypoints, transport layer, service/core layer, persistence layer, and test commands.
2. For JavaScript, TypeScript, Node, package-manager, install, or script-runner work, also use `$eric-javascript`.
3. Keep transport code thin and route business rules through the existing service/core layer.
4. Reuse current DTOs, schemas, repositories, migrations, and error types before adding new ones.
5. Verify with the narrowest backend check that covers the touched path.

## Standards

- Keep transport entrypoints thin: parse input, read state, call the service/core layer, and map the result.
- Put validation at trust boundaries before data enters the core layer.
- Prefer deterministic output when snapshots, generated contracts, or tests depend on ordering.
- TypeScript: prefer Hono.js, use Elysia.js second, use Drizzle ORM and Drizzle migrations, prefer BullMQ backed by Redis for queues in Node.js projects, and keep DTO/request/response types near the owner unless the repo has a shared contract layer.
- Rust: model the domain with explicit structs, enums, state types, and ID newtypes; large modules are not allowed.
- Rust: split modules by project scale and code relatedness: keep tightly coupled code together in small projects, then split by domain ownership or responsibility when a module mixes concepts, APIs, persistence, adapters, or state-machine concerns.
- Rust: choose the necessary module shape: use sibling files for different domains, and use a directory with `mod.rs` when one domain owns multiple entities or submodules.
- Rust: put side effects at the edge, prefer typed state transitions, and split code by responsibility such as `model`, `repo`, `service`/`core`, and `infra`.
- Rust: use `thiserror` for reusable errors and `anyhow` at application edges.
- Rust: use `garde` for input and DTO validation; use `serde`, `schemars`, generated types, or the repo's existing export flow for wire/data contracts.
- Test state-machine behavior, data boundaries, and adversarial external input.

## Boundaries

- Do not add abstraction without a real second implementation, test boundary, or ownership boundary.
- Do not let transport handlers bypass business rules to call persistence or infrastructure directly.
- Do not replace typed domain errors with stringly runtime checks in reusable code.
