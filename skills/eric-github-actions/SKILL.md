---
name: eric-github-actions
description: Apply Eric's GitHub Actions standards. Use when creating, editing, reviewing, or debugging GitHub Actions workflows, reusable workflows, or action references; selecting versions for `uses`; or validating workflow YAML.
---

# Eric GitHub Actions

Keep GitHub Actions workflows small, explicit, current, and locally lintable.

## Workflow

1. Read the repository's instructions, existing workflows, actionlint configuration, and normal local quality commands before editing.
2. Keep each workflow focused on one purpose. Reuse the repository's existing commands instead of rebuilding its test, lint, or release logic in YAML.
3. Give workflows, jobs, and non-obvious steps descriptive names. Set the narrowest practical `permissions`, timeouts for jobs that can hang, and explicit concurrency behavior when duplicate runs would waste resources or race.
4. Before writing or updating **every** external `uses:` reference, identify its source repository and check that repository's current latest stable release. Never choose an action version from memory, an old workflow, copied documentation, or a cached example.
5. Use the newest stable release just verified. Respect an existing full-commit-SHA pinning policy by resolving that newest release tag to its commit SHA and retaining the release tag in a comment. Do not silently keep an older major or patch because it still works.
6. Recheck all external action and reusable-workflow references in the files touched, including references not originally added. Local paths such as `uses: ./...` and `docker://...` images are not GitHub action repositories; validate them through their own source and version policy.
7. After the workflow is complete, run `actionlint` against the changed workflow files. Fix every actionable diagnostic, then rerun it until it passes. Also run the repository's relevant local checks when the workflow changes their invocation.

## Resolve The Latest Version

For `uses: OWNER/REPO@REF` and `uses: OWNER/REPO/PATH@REF`, treat `OWNER/REPO` as the source repository. Query GitHub immediately before selecting `REF`:

```bash
repo='OWNER/REPO'
latest_tag="$(gh api "repos/$repo/releases/latest" --jq .tag_name)"
gh api "repos/$repo/releases/latest" --jq '{tag_name, published_at, html_url}'
```

Use the latest non-draft, non-prerelease release unless the repository explicitly opts into prereleases. If the repository does not publish GitHub Releases, inspect its official tags and documentation, choose the newest stable supported tag, and record that fallback in the handoff. Do not treat Marketplace pages, search snippets, third-party posts, or another repository's workflow as version authority.

When the repository pins actions to immutable commits, resolve the verified release tag instead of substituting an older SHA:

```bash
sha="$(gh api "repos/$repo/commits/$latest_tag" --jq .sha)"
```

Keep the human-readable version beside the SHA:

```yaml
- uses: OWNER/REPO@0123456789abcdef0123456789abcdef01234567 # v1.2.3
```

Treat moving branches such as `main` as unreleased code. Avoid floating references unless the upstream action only supports one and the repository has explicitly accepted that risk.

## Validate

Run the installed binary when available:

```bash
actionlint
```

When `actionlint` is not installed but Go is available, run the current tool without adding a repository dependency:

```bash
go run github.com/rhysd/actionlint/cmd/actionlint@latest
```

Pass explicit changed files when the shell globs do not match the repository layout. Do not claim validation passed if `actionlint` was skipped, unavailable, or failed; report the exact limitation instead.

## Boundaries

- Do not add third-party actions when a short, readable shell step or an already-approved action covers the need.
- Do not broaden secrets, token permissions, triggers, runner access, or deployment environments without a requirement.
- Do not expose secrets through command output, generated files, caches, artifacts, or untrusted pull-request contexts.
- Do not use `pull_request_target` for untrusted checkout-and-execute flows.
- Do not edit generated workflows directly; update their source and regenerate them.
