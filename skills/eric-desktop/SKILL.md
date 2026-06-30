---
name: eric-desktop
description: Apply Eric's desktop app standards. Use when implementing, refactoring, or reviewing Electron, Tauri, desktop renderer, local runtime, packaging, update, window/webview, IPC/router, generated contract, desktop data-fetching, or native integration code in Eric's style.
---

# Eric Desktop

Use this skill for desktop app implementation or desktop review.

## Workflow

1. Inspect the actual desktop stack, dev runner, packaged build flow, renderer entrypoint, native entrypoint, and generated contract flow.
2. Use `$eric-frontend` for renderer UI/data-flow work and `$eric-backend` for native service, persistence, validation, or Rust/TypeScript backend work.
3. For JavaScript, TypeScript, Node, package-manager, install, or script-runner work, also use `$eric-javascript`.
4. Keep native/runtime work off the UI thread and keep renderer data access behind the existing API/query layer.
5. Validate the path that matters: dev mode, packaged mode, generated contracts, typecheck, or packaging metadata depending on the change.

## Standards

- Use desktop when the product benefits from a local runtime, offline behavior, or OS-level integration; otherwise keep it web.
- Persist user data under the app data/user data directory, not the project tree.
- Use migrations for local schemas and treat packaging as a first-class runtime.
- Prefer Tauri v2 when Rust is already the native layer or the app mainly needs a thin WebView over native commands/services.
- Use generated contracts where possible, such as `tauri-typegen` for frontend commands and `ts-rs` DTO export for Rust APIs.
- Use Electron when the app needs a flexible browser stack for GUI, not just a browser wrapper.
- Treat Electron's value as controllable web content primitives, multiple renderer surfaces, and Node integration around the browser runtime.
- Use typed routers or typed IPC boundaries.
- Use TanStack Query for renderer data fetching and invalidation; treat desktop local data as server state from the renderer's point of view.
- Open external links in the system browser and keep WebView navigation explicitly allowed.

## Boundaries

- Do not treat Electron as only a browser wrapper; its value is the browser stack, web content primitives, multiple renderer surfaces, and Node integration around the browser runtime.
- Do not put desktop local data directly into ad hoc component state when the renderer should see it as server state.
- Do not hand-roll OS behavior when the framework or platform already provides the primitive.
