---
name: eric-quality-control
description: Apply Eric's quality-control standards. Use when setting up or fixing formatter, linter, type-check, compile, test, dependency, security, or CI gates; reproducing quality failures; or choosing boring project quality checks.
---

# Eric Quality Control

Use this skill for mechanical, static, and behavior gates before review. Keep gates boring, fast, and close to the commands developers already run locally. When adding or changing tests, also use `$eric-writing-tests`.

## Workflow

1. Separate formatter, linter, type checker or compile check, tests, and dependency or security checks. They catch different failures.
2. Use one command per gate in the repo's normal task runner. CI should run the same commands developers run locally.
3. Every PR should at least run format check, lint, type check or compile check, and focused tests for touched behavior.
4. Before fixing, read the failing command, exact diagnostic, touched code, and nearby callers or config.
5. Reproduce the failure with the smallest command that shows the formatter, lint, type, test, or dependency error.
6. Fix the root cause. Do not hide diagnostics just to make the gate pass.
7. Rerun the smallest failing check first, then the normal repo gate that catches the same class of failure in CI.

## Standards

- Auto-fix formatter output and safe lint fixes.
- Review unsafe lint fixes, dependency upgrades, and generated-code changes like normal code.
- Add slower gates only for real risk: end-to-end tests for critical flows, dependency audits for shipped services, dead-code checks before cleanup, and security linters around auth, crypto, file, process, or network input.
- New projects should choose one tool per responsibility. Existing projects should keep their current stack unless replacing it deletes config and commands.
- Avoid suppressions such as `eslint-disable`, `#[allow(...)]`, `# type: ignore`, and `# noqa` unless the tool is wrong or the surrounding constraint is real.
- If a suppression is the only reasonable fix, keep it narrow, put it on the smallest scope, and explain why the normal fix is not available.

## Tool Defaults

- JavaScript and TypeScript: use TypeScript for app code; run `tsc --noEmit` or the framework type-check command in CI. Use Biome for new simple repos, ESLint for framework/a11y/import-boundary/custom rules, Prettier only when already configured or needed for uncovered file types, Vitest for Vite/lightweight TS tests, Jest when the repo already owns Jest, Playwright for real browser flows, Knip when unused files/exports/deps waste review time, and Antfu's `ni` for package commands.
- Rust: use `cargo fmt -- --check`, `cargo check --workspace --all-targets`, `cargo test`, and `cargo clippy --all-targets --all-features -- -D warnings` when the workspace can keep warnings at zero. Use `cargo audit` for shipped services with `Cargo.lock`, `cargo deny` when license/source/duplicate policy matters, Miri only for realistic unsafe-code risk, and cargo-nextest only after the default runner is a bottleneck.
- Python: default to Ruff with `ruff format --check` and `ruff check`. Run `ruff check --fix` before `ruff format` when auto-fixing. Use Pyright for fast typing, mypy when the project already owns it or needs plugins, pytest for behavior, pip-audit for shipped services, and Bandit only around security-sensitive Python operations.

## Boundaries

- Do not add a new tool when an existing repo gate already covers the need.
- Do not make formatting a review topic when the formatter can decide it.
- Do not block useful work on exhaustive typing or coverage when focused boundaries catch the real risk.
