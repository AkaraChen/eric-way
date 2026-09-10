---
name: eric-rust
description: Apply when implementing or reviewing Rust types, module structure, errors, validation, serialization, or generated data contracts in any application.
---

# Eric Rust

- Use structs and enums for explicit data shapes, and newtypes for IDs.
- Keep Rust modules small: keep tightly coupled code together, split distinct concepts into sibling files, and use a directory with `mod.rs` when one feature owns multiple submodules.
- Use `thiserror` for reusable/API errors and `anyhow` at application edges. Match typed error variants instead of checking error strings.
- Use `garde` for input and DTO validation: derive attributes for field rules, custom validators for cross-field or collection invariants.
- Use `schemars` for JSON Schema and `ts-rs` for TypeScript DTO export, unless the project has an established contract export flow.
