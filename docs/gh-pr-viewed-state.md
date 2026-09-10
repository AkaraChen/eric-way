# GitHub PR Viewed-State Operations

## State and Undo

- `PullRequestChangedFile.viewerViewedState` reports `UNVIEWED`, `VIEWED`, or `DISMISSED`.
- `markFileAsViewed(input: { pullRequestId, path })` marks one PR file as viewed for the current viewer.
- `unmarkFileAsViewed` exists for undo.


## Test-Only Path Patterns

```text
__tests__/
test/
tests/
*.test.*
*.spec.*
*.snap
```


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

## Accuracy Notes

- The mutation input fields are `pullRequestId: ID!` and `path: String!`.
- The operation changes the current viewer's file-viewed state only.
- It does not approve the PR, submit a review, alter code, or remove the need to understand tests.
