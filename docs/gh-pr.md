# GitHub PR Review Operations

This document covers GitHub-specific review mechanics that reduce visual noise before writing a Guided Review. The first operation is automatically marking low-risk test files as viewed so the reviewer can keep the changed-files UI focused on production code and review evidence.

## 1. Auto-Mark Test Files As Viewed

GitHub exposes file viewed state through GraphQL:

- `PullRequestChangedFile.viewerViewedState` reports `UNVIEWED`, `VIEWED`, or `DISMISSED`.
- `markFileAsViewed(input: { pullRequestId, path })` marks one PR file as viewed for the current viewer.
- `unmarkFileAsViewed` exists for undo.

Use this as a folding primitive, not as a substitute for review. The reviewer or agent should first inspect the test line enough to understand what the tests prove, then mark obvious test-only files as viewed to keep the remaining diff smaller.

### Query Changed Files

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

### Select Files To Mark

Start with conservative test-only path patterns:

```text
__tests__/
test/
tests/
*.test.*
*.spec.*
*.snap
```

Do not mark production code, migrations, public API changes, security-sensitive fixtures, generated client contracts, or snapshots whose change is the main review evidence. If a test file is the only proof for a risky behavior, keep it visible until the Guided Review calls out that evidence.

### Mark One File

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

With Octokit core request:

```ts
await octokit.request("POST /graphql", {
  query: `
    mutation MarkFileAsViewed($pullRequestId: ID!, $path: String!) {
      markFileAsViewed(input: { pullRequestId: $pullRequestId, path: $path }) {
        pullRequest { id }
      }
    }
  `,
  variables: { pullRequestId, path },
});
```

### Execution Rule

1. Fetch all PR files with pagination.
2. Keep files where `viewerViewedState !== "VIEWED"` and the path is test-only.
3. Read enough of those files to summarize the test line.
4. Call `markFileAsViewed` for each safe test file.
5. Continue the Guided Review on the remaining unviewed production, config, migration, generated-contract, and documentation files.

## Accuracy Notes

- The mutation input fields are `pullRequestId: ID!` and `path: String!`; this was verified against the live GitHub GraphQL schema with `gh api graphql`.
- The operation changes the current viewer's file-viewed state. It does not approve the PR, submit a review, alter code, or remove the need to understand tests.
- If GitHub rejects the token, use an authenticated token or app installation that can access the target PR and is allowed to update PR review UI state.

## Sources

- [GitHub GraphQL reference: mutations](https://docs.github.com/en/enterprise-cloud@latest/graphql/reference/mutations)
- [GitHub GraphQL changelog for 2020](https://docs.github.com/en/graphql/overview/changelog/2020)
