---
name: eric-node-backend-stack
description: Apply when choosing or reviewing Node.js backend technologies for API frameworks, database access, migrations, SQLite clients, or background job queues.
---

# Eric Node Backend Stack

- Prefer Hono.js; use Elysia.js when Hono is unsuitable.
- Use Drizzle ORM and Drizzle migrations.
- For SQLite, use libsql (`@libsql/client`), never `better-sqlite3`.
- Prefer BullMQ backed by Redis for background jobs.
