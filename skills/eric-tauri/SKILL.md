---
name: eric-tauri
description: Apply when choosing Tauri or implementing and reviewing Tauri command responsiveness, async execution, contracts, or frontend/native integration.
---

# Eric Tauri

- Prefer Tauri v2 when Rust is already the native layer or the app mainly needs a thin WebView over native commands/services.
- When designing a Tauri command, first assess its expected duration, blocking I/O or CPU work, and whether the interaction is latency-sensitive. Prefer async commands to keep the UI responsive; reserve synchronous commands for short, predictably fast operations. Async alone does not make blocking work non-blocking: move blocking I/O or CPU-heavy work to `spawn_blocking` or a background worker.
- Prefer generated frontend command contracts with `tauri-typegen`.

Use `$eric-desktop` for shared desktop principles and `$eric-rust` when writing Rust code.
