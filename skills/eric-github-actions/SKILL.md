---
name: eric-github-actions
description: Apply Eric's GitHub Actions standards. Use when creating, editing, reviewing, or debugging GitHub Actions workflows, reusable workflows, or action references; selecting versions for `uses`; or validating workflow YAML.
---

# Eric GitHub Actions

- Before selecting an external `uses:` version, check the source repository's latest stable release live. Never choose from memory or copied workflows. Recheck every external action and reusable workflow in files you modify.
- Use upstream Releases as the authority. If none exist, inspect official tags and documentation and report that fallback. Use prereleases or floating branches only when the project explicitly allows them.
- If the project pins full commit SHAs, resolve the verified release to its SHA and keep the release version in a comment.
- Run `actionlint` on changed workflows and fix actionable diagnostics. If unavailable locally, use: `go run github.com/rhysd/actionlint/cmd/actionlint@latest`. Report skipped, unavailable, or failed validation accurately.

Local `uses: ./...` and `docker://...` references follow their own source/version policies.
