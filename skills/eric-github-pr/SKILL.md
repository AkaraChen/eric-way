---
name: eric-github-pr
description: Apply Eric's GitHub pull request review operations. Use when operating on GitHub PR changed-file review state, marking safe test-only files viewed, preparing a GitHub PR for review, or using gh GraphQL review mechanics.
---

# Eric GitHub PR

Use this skill for GitHub-specific pull request mechanics that reduce review noise. This is operational support, not review judgment. For review findings use `$eric-review`; for Guided Review artifacts use `$eric-guided-review`.

## Auto-Mark Test Files As Viewed

GitHub exposes changed-file viewed state through GraphQL:

- `PullRequestChangedFile.viewerViewedState` reports `UNVIEWED`, `VIEWED`, or `DISMISSED`.
- `markFileAsViewed(input: { pullRequestId, path })` marks one PR file as viewed for the current viewer.
- `unmarkFileAsViewed` exists for undo.

Use this as a folding primitive only after reading enough of the test line to understand what the tests prove.

## Workflow

1. Fetch all PR files with pagination.
2. Keep files where `viewerViewedState !== "VIEWED"` and the path is test-only.
3. Read enough of those files to summarize the test line.
4. Mark each safe test-only file as viewed.
5. Continue review on remaining unviewed production, config, migration, generated-contract, and documentation files.

Conservative test-only patterns:

```text
__tests__/
test/
tests/
*.test.*
*.spec.*
*.snap
```

Do not mark production code, migrations, public API changes, security-sensitive fixtures, generated client contracts, or snapshots whose change is the main review evidence.

## GraphQL

Query changed files:

```graphql
query PullRequestFiles($owner: String!, $repo: String!, $number: Int!, $cursor: String) {
  repository(owner: $owner, name: $repo) {
    pullRequest(number: $number) {
      id
      files(first: 100, after: $cursor) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          path
          additions
          deletions
          changeType
          viewerViewedState
        }
      }
    }
  }
}
```

Mark one file:

```graphql
mutation MarkFileAsViewed($pullRequestId: ID!, $path: String!) {
  markFileAsViewed(input: { pullRequestId: $pullRequestId, path: $path }) {
    pullRequest {
      id
    }
  }
}
```

With GitHub CLI:

```bash
gh api graphql \
  -f query='mutation MarkFileAsViewed($pullRequestId: ID!, $path: String!) { markFileAsViewed(input: { pullRequestId: $pullRequestId, path: $path }) { pullRequest { id } } }' \
  -f pullRequestId='PR_NODE_ID' \
  -f path='tests/example.test.ts'
```

## Accuracy Notes

- The mutation input fields are `pullRequestId: ID!` and `path: String!`.
- The operation changes the current viewer's file-viewed state only.
- It does not approve the PR, submit a review, alter code, or remove the need to understand tests.
- If GitHub rejects the token, use an authenticated token or app installation that can access the target PR and update PR review UI state.
