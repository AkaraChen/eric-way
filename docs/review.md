# How to review in Eric way

1. First step, check for wierd code formatting, indentation, and naming conventions. Make sure the code is clean and follows the project's style guide.
2. Next, check for bad practices, such as overuse of defensive programming, unnecessary complexity, and lack of modularity. Make sure the code is easy to read and understand.
3. If the code already typed, there is no need for checking types at runtime, if the runtime checking is required, the code should be refactored to use types instead of runtime checking.

## GitHub PR Setup

For GitHub pull requests, use [GitHub PR Review Operations](gh-pr.md) before deep review. Start by auto-marking safe test-only files as viewed with GitHub GraphQL so the remaining changed-files view stays focused on production code and review evidence.

## Frontend

1. Check for `any` type usage in TypeScript. Eric prefers to use specific types and avoid `any` as much as possible.
2. UI code such as JSX/SFC should be simple, avoid unnecessary complexity and over-engineering. Eric prefers to keep the UI code clean and easy to read. If there's is a `if-else` or `switch` statement in JSX, it should be refactored to a few simple components instead of a big component with many conditional rendering.
3. Flag manually concatenated class names in `className`. Prefer the project's existing `clsx`/`classnames`/`cva`/`twMerge` helper; if there is no wrapper, call the package export directly.

## React

1. Eric prefer react compiler enabled, so agent do not need to write `useMemo` or `useCallback` unnecessarily.
2. Respect react-fast-refresh, avoid a source file export both component and non-component, it will break react-fast-refresh. If you need to export both, please split them into two files.
3. If you are using `useEffect`, you are required to explain why, in most case there's no need for it, follow "You might not need an effect" rule. If you are using `useEffect` to fetch data, consider using `react-query` instead. If you need to connect data source, consider using `useSyncExternalStore` instead of `useEffect`.
