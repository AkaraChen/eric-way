---
name: eric-backend
description: Apply when implementing or reviewing transport handlers, service/core boundaries, backend DTO ownership, input validation boundaries, or service bootstrap.
---

# Eric Backend

- Keep controllers as short and thin as possible. Prefer framework-native parsing, validation, binding, and response handling over handwritten controller plumbing, unless the project has an established convention. Keep business logic in service/core.
- Keep DTO/request/response types with their owning module, unless the project has a shared contract layer.
- Keep runtime setup, managed state, database initialization, migrations, logging, and shutdown wiring in the application entrypoint.
