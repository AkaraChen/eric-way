# How to write desktop app in Eric way

1. Use a desktop app when the product benefits from a local runtime, offline behavior, or OS-level integration. If it is just CRUD over a remote API, keep it web.
2. Persist user data under the app data/user data directory, not the project tree. Use migrations for local schemas.
3. Keep blocking/native work off the UI thread. Use a background task, async process API, or dedicated runtime/service.
4. Treat packaging as a first-class runtime. Validate dev mode, packaged mode, bundled resources, native dependencies, environment setup, and release metadata.

## Tauri

1. Prefer Tauri v2 when Rust is already the native layer or the app mainly needs a thin WebView over native commands/services.
2. Use generated contracts whenever possible: `tauri-typegen` for Tauri commands and `ts-rs` DTO export for Rust APIs.

## Electron

1. Use Electron when the app needs a flexible browser stack for a GUI app, not just a browser wrapper. Its value is controllable web content primitives, multiple renderer surfaces, and Node integration around the browser runtime.
2. Use typed routers for Electron IPC.

## Renderer

1. Use TanStack Query for renderer data fetching and invalidation. Desktop local data is still server state from the renderer's point of view.
2. External links must leave the app through the system browser. The WebView should only navigate inside the app unless the URL is explicitly allowed.
3. Use the OS instead of custom UI where it matters. Prefer framework or platform primitives before hand-written replacements.
