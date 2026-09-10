---
name: eric-rust-quality-control-checklist
description: Apply before committing Rust changes. Check formatting, compilation, lint, tests, and dependency or unsafe-code risks when affected.
---

# Eric Rust Quality Control Checklist

Use the repository's equivalent commands when available.

- [ ] Run `cargo fmt -- --check`.
- [ ] Run `cargo check --workspace --all-targets`.
- [ ] Run Clippy. Use `cargo clippy --all-targets --all-features -- -D warnings` when the workspace can maintain zero warnings.
- [ ] Run relevant tests with `cargo test` or the project's existing runner.
- [ ] For dependency changes, consider `cargo audit` for shipped services with Cargo.lock and `cargo deny` for license, source, or duplicate-dependency policies. Run any repository-required audits.
- [ ] For changes with realistic unsafe-code risk, consider Miri.

## Tool Preferences

Add cargo-nextest only when the default test runner becomes a bottleneck; do not change runners merely to complete this checklist.

Use `$eric-quality-control-checklist` for shared commit checks and `$eric-writing-tests` for test selection.
