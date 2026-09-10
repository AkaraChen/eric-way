---
name: eric-e2e-testing
description: Apply Eric's browser end-to-end testing standards. Use when a task needs a real browser, UI smoke test, screenshot capture, browser bug reproduction, Dockerized browser test run, or agent-browser based verification.
---

# Eric E2E Testing

- Prefer `agent-browser` over Playwright when available.
- For visual UI work, inspect desktop (~1280px) and mobile (~390px) screenshots for overflow, contrast, empty states, and intended layout.
- For interactive features, perform the actual user actions and verify their outcomes; screenshots alone do not prove the interaction works.

For disposable Docker browser runs, read `references/docker.md`.
Use `$eric-writing-tests` for unit/integration tests and `$eric-design` for visual finish criteria.
