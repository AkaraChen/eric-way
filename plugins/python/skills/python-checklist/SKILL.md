---
name: python-checklist
description: Apply before committing Python changes. Check formatting, lint, types, relevant tests, and dependency or security risks when affected.
---

# Eric Python Quality Control Checklist

Use the repository's existing commands and tools.

- [ ] Run formatting and lint checks. For Ruff, use `ruff format --check` and `ruff check`; when fixing, run `ruff check --fix` before `ruff format`.
- [ ] Run the project's type checker.
- [ ] Run relevant pytest tests.
- [ ] For dependency changes in shipped services, run pip-audit. For security-sensitive Python changes, run Bandit.

## Tool Preferences

Prefer Ruff, Pyright, and pytest. Keep mypy where established or needed for plugins. These are selection preferences, not a requirement to replace tools before committing.

Use the `project` plugin's `checklist` for shared commit checks and `writing-tests` for test selection.
