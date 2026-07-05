# How to do quality control in Eric way

Quality control should catch mechanical, static, and behavior errors before
review. Keep the gates boring, fast, and close to the tools developers already
run locally.

## Common

1. Separate formatter, linter, type checker, tests, and dependency/security
   checks. They catch different failures and should not fight each other.
2. Use one command per gate in the repo's normal task runner. CI should run the
   same commands developers run locally.
3. Every PR should at least run format check, lint, type check or compile check,
   and focused tests for touched behavior.
4. Before adding or changing tests, decide whether each test is a regression
   lock, a correctness check, or both. See [Writing tests](testing/writing-test.md).
5. Auto-fix formatter output and safe lint fixes. Review unsafe lint fixes,
   dependency upgrades, and generated-code changes like normal code.
6. Add slower gates only for real risk: end-to-end tests for critical flows,
   dependency audits for shipped services, dead-code checks before cleanup work,
   and security linters around auth, crypto, file, process, or network input.
7. New projects should choose one tool per responsibility. Existing projects
   should keep their current stack unless replacing it deletes config and
   commands.

## How to fix

1. Gather context before editing: read the failing command, the exact diagnostic,
   the touched code, and nearby callers or related config.
2. Reproduce the failure with the smallest command that shows the formatter,
   lint, type, test, or dependency error.
3. Find the root cause before changing code. A lint error is usually pointing at
   design, typing, data flow, naming, or dead-code drift; fix that problem
   instead of hiding the diagnostic.
4. Do not add suppressions just to make the check pass. Avoid `eslint-disable`,
   `#[allow(...)]`, `# type: ignore`, `# noqa`, and similar escapes unless the
   tool is wrong or the surrounding constraint is real and documented.
5. If a suppression is the only reasonable fix, keep it narrow, put it on the
   smallest scope, and explain why the normal fix is not available.
6. After the fix, rerun the smallest failing check first, then the normal repo
   gate that would catch the same class of failure in CI.

## JavaScript and TypeScript

1. Default to TypeScript for application code. Run `tsc --noEmit` or the
   framework's type-check command in CI.
2. New simple repos can use Biome for formatting, import sorting, and baseline
   linting across JS, TS, JSX, TSX, JSON, CSS, and GraphQL.
3. Use ESLint when the project needs framework, accessibility, import-boundary,
   or custom domain rules that Biome does not cover.
4. Use Prettier when it is already configured, or when the repo has file types
   and formatting behavior Biome should not own yet. Do not run Prettier and the
   Biome formatter over the same files.
5. Use Vitest for Vite or lightweight TS unit tests, Jest when the existing
   project already owns Jest config, and Playwright for real browser flows.
6. Use Knip when a JS/TS repo has enough unused files, exports, or dependencies
   that manual cleanup is wasting review time.
7. Existing projects should run package commands through the existing scripts
   and Antfu's `ni`; do not hand-write package-manager-specific commands.

## Rust

1. Use `cargo fmt -- --check` in CI and `cargo fmt` locally. Rust formatting is
   not a review topic.
2. Use `cargo clippy --all-targets --all-features -- -D warnings` when the
   workspace is mature enough to keep warnings at zero.
3. Use `cargo check --workspace --all-targets` as the fast compile gate and
   `cargo test` for behavior.
4. Use `cargo audit` for shipped services with a `Cargo.lock`. Use `cargo deny`
   when license, source, or duplicate dependency policy matters.
5. Use Miri only for unsafe code, tricky data structures, or low-level crates
   where undefined behavior is a realistic risk.
6. Use cargo-nextest only after the test suite is large enough that the default
   test runner is a bottleneck.

## Python

1. Default to Ruff for formatting, import sorting, and linting:
   `ruff format --check` and `ruff check` in CI.
2. When auto-fixing Python, run `ruff check --fix` before `ruff format` so lint
   edits get formatted once.
3. Keep Black, isort, or Flake8 only when an existing project already owns that
   stack or Ruff has a compatibility gap that matters.
4. Use Pyright for fast editor and CI type checking. Use mypy when a project
   already has mypy config or depends on mypy plugins.
5. Type public APIs, DTOs, config, and cross-module boundaries first. Do not
   block useful Python work on typing every local variable.
6. Use pytest for behavior tests. Add coverage.py only when the team will act on
   the coverage signal instead of treating it as decoration.
7. Use pip-audit for dependency vulnerability checks on shipped services. Use
   Bandit only where Python code handles security-sensitive input or operations.
