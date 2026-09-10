---
name: eric-desktop
description: Apply shared desktop app principles when implementing or reviewing local storage, cross-service types, cross-language clients, renderer data, navigation, or OS integration.
---

# Eric Desktop

- Store user data in the app data/user data directory. Use migrations for local database schemas.
- For cross-service calls in the same language, prefer importing contract types directly from the service's package.
- For cross-language calls, prefer code generation for clients or client type definitions.
- Treat local service data as server state in the renderer. Use TanStack Query for fetching and invalidation through the API/query layer.
- Open external links in the system browser. Restrict WebView navigation to the app and explicitly allowed URLs.
- Prefer framework or OS primitives for system interactions.

Use `$eric-tauri` or `$eric-electron` for framework-specific conventions.
