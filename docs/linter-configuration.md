# Linter Configuration

Eric's repos keep linting project-local and boring. Do not copy the dedicated
ESLint config repo as the source of truth; learn from the app and library repos
that actually run the checks.

1. JS/TS: use the repo's current baseline first. Simple projects usually use
   Biome or Ultracite. Add ESLint only when the project needs plugin rules the
   baseline cannot cover.
2. ESLint: start from the existing base config and append local rules. Keep
   rules tied to real surfaces such as React, Tailwind, Electron, imports, or
   generated files.
3. Boundary: prefer targeted import restrictions before a full boundary
   framework. Block the bad direction directly, such as renderer-to-main,
   app-to-private-internals, or cross-owner shortcuts.
4. Public API: imports across a boundary should go through the element's public
   entrypoint. Private folders and generated folders should be ignored or
   forbidden explicitly.
5. Rust: use Cargo-native linting. Put `cargo clippy --workspace -- -D warnings`
   behind `just lint` when the repo wants a strict lint gate.
6. Go: stay with native Go commands unless the repo proves it needs more. A
   `Makefile` with `go test ./...` and `go mod tidy` is enough for small CLIs.
7. Commands: keep auto-fix and check commands separate when the tool supports
   it, for example `lint` for fixing and `lint:check` or `check` for CI.
