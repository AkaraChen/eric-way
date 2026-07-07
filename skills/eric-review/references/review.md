# How to review in Eric way

1. First step, check for wierd code formatting, indentation, and naming conventions. Make sure the code is clean and follows the project's style guide.
2. Next, check for bad practices, such as overuse of defensive programming, unnecessary complexity, and lack of modularity. Make sure the code is easy to read and understand.
3. If the code already typed, there is no need for checking types at runtime, if the runtime checking is required, the code should be refactored to use types instead of runtime checking.

## New Concepts

When reviewing a PR, check whether it introduces a new concept: a domain term, lifecycle state, permission boundary, storage model, async contract, public API shape, or review category that future contributors must understand. If it does, require a clear name, one entry point, the invariant it owns, and tests or docs that teach the concept instead of leaving it implicit.

```text
New concept: workspace invitation lifecycle
entry point -> state owner -> permission rule -> persistence -> docs/tests
```

## Implementation Degradation Findings

Findings must call out implementation degradation even when the visible behavior works. Compare the new code against the old ownership, data flow, boundaries, complexity, performance, and test shape. A PR degrades the implementation when it spreads one responsibility across more places, duplicates an existing helper, weakens an invariant, moves business logic into the wrong layer, broadens an API for one caller, or makes the same behavior harder to test or change.

```text
Finding: implementation degradation
before: request cache owns invalidation
after: components duplicate query keys and refetch timing
impact: behavior works today, but correctness moved out of the cache layer
```

## GitHub PR Setup

For GitHub pull requests, use [GitHub PR Review Operations](gh-pr.md) before deep review. Start by auto-marking safe test-only and generated-only files as viewed with GitHub GraphQL so the remaining changed-files view stays focused on production code and review evidence.

## Frontend

1. Check for `any` type usage in TypeScript. Eric prefers to use specific types and avoid `any` as much as possible.
2. UI code such as JSX/SFC should be simple, avoid unnecessary complexity and over-engineering. Eric prefers to keep the UI code clean and easy to read. If there's is a `if-else` or `switch` statement in JSX, it should be refactored to a few simple components instead of a big component with many conditional rendering.
3. Flag manually concatenated class names in `className`. Prefer the project's existing `clsx`/`classnames`/`cva`/`twMerge` helper; if there is no wrapper, call the package export directly.

## React

1. Eric prefer react compiler enabled, so agent do not need to write `useMemo` or `useCallback` unnecessarily.
2. Respect react-fast-refresh, avoid a source file export both component and non-component, it will break react-fast-refresh. If you need to export both, please split them into two files.
3. If you are using `useEffect`, you are required to explain why, in most case there's no need for it, follow "You might not need an effect" rule. If you are using `useEffect` to fetch data, consider using `react-query` instead. If you need to connect data source, consider using `useSyncExternalStore` instead of `useEffect`.
