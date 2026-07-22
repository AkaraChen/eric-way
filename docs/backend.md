# How to write backend code in Eric way

## TypeScript

1. Prefer Hono.js over any other backend framework since it is lightweight, fast, and can be deployed to many platforms.
2. When Hono.js is not suitable, use Elysia.js as the second choice.
3. Use Drizzle ORM for database interactions, as it provides a simple and efficient way to manage database operations.
4. Always use Drizzle migrations for database schema changes, as it allows for version control and easy rollback of changes.
5. For queues in Node.js projects, prefer BullMQ backed by Redis.

## Rust

1. Keep transport entrypoints thin. They should parse input, read state, call the service/core layer, and map the result back to the caller.
2. Split backend code by responsibility: `model` for shared data types, `repo` for persistence, `service` for business rules, and `infra` for adapters to external systems.
3. Do not allow large Rust modules. For small projects, keep closely related code together; as the project grows, split modules by domain ownership and responsibility instead of piling unrelated logic into one file.
4. Do not let transport code call `repo` or `infra` directly when business rules are involved; route it through `service` or `core`.
5. Keep app bootstrap in the entrypoint: runtime setup, managed state, database initialization, migrations, logging, and shutdown cleanup.
