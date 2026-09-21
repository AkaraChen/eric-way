---
name: js-checklist
description: Apply before committing JavaScript or TypeScript changes. Check formatting, lint, types, relevant tests, and unused code when affected.
---

# Eric JavaScript Quality Control Checklist

Use the repository's existing commands and tools for the affected packages.

- [ ] Run formatting and lint checks.
- [ ] Run `tsc --noEmit` or the framework's type-check command for TypeScript code.
- [ ] Run relevant tests with the project's test runner.
- [ ] For file, export, or dependency cleanup, run Knip when applicable.

## Tool Preferences

These guide tool selection when needed, not installation or migration during every commit:

- Prefer Biome for simple new projects; use ESLint for framework, accessibility, import-boundary, or custom rules.
- Use Prettier only when already configured or needed for uncovered formats.
- Prefer Vitest for Vite/lightweight TS projects; keep Jest where established.

Use the `project` plugin's `checklist` for shared commit checks and `writing-tests` for test selection, the `frontend` plugin's `e2e-testing` for browser checks, and `$javascript` for package commands.
