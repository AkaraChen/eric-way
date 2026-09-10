---
name: eric-github-pr
description: Apply Eric's GitHub pull request review operations. Use when operating on GitHub PR changed-file review state, marking safe test-only files viewed, preparing a GitHub PR for review, or using gh GraphQL review mechanics.
---

# Eric GitHub PR

- Read the PR's test changes and understand what they prove before marking safe test-only files as viewed.
- Keep production code, migrations, public API changes, security-sensitive fixtures, generated client contracts, and snapshots that provide key review evidence unviewed during this automatic folding step.
- Fetch all changed files with pagination and skip files already viewed.

For GitHub viewed-state operations, read `references/viewed-state.md`.
Use `$eric-review` for review judgment and `$guided-review` for walkthroughs.
