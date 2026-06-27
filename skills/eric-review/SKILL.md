---
name: eric-review
description: Review code using Eric's standards. Use when the user asks for review, code review, frontend review, backend review, desktop review, React review, architecture review, PR review, or asks whether code matches Eric's style; prioritize concrete bugs, risks, overengineering, style drift, and missing focused tests.
---

# Eric Review

Use this skill for review tasks. Start from concrete findings, not a broad summary. Also check the relevant Eric skill for the code under review: `$eric-frontend`, `$eric-backend`, or `$eric-desktop`.

## Workflow

1. Inspect the actual diff or files under review before judging.
2. Read `$eric-frontend`, `$eric-backend`, or `$eric-desktop` when the diff touches that stack.
3. Check for correctness bugs, behavioral regressions, overengineering, style drift, missing focused tests, and boundary violations.
4. Lead with findings ordered by severity. Include file and line references when available.
5. If there are no issues, say so and mention remaining test gaps or residual risk.

## Standards

- First check formatting, indentation, naming, and local style consistency.
- Then check over-defensive code, unnecessary complexity, speculative abstraction, poor modularity, and missing focused tests.
- Do not ask for runtime validation that duplicates static types unless data crosses an untrusted boundary.
- Frontend: flag `any`, large render branching, manually concatenated `className` strings, business classes in global CSS, and inline request/query-key/invalidation code when the repo has a request/cache layer.
- React: assume compiler unless the repo proves otherwise; do not ask for `useMemo` or `useCallback` unless stable identity is required.
- React: challenge `useEffect`; prefer TanStack Query for data fetching and `useSyncExternalStore` for external subscriptions.
- Backend: keep transport thin, preserve service/core boundaries, use typed Rust errors in reusable code, and validate at trust boundaries.
- Desktop: check dev and packaged assumptions, renderer API/query boundaries, native/blocking work off the UI thread, and generated contracts.
- Output findings first, ordered by severity, with file and line references; keep summary secondary and short.

## Boundaries

- Do not turn a review into a rewrite unless the user asks for fixes.
- Do not spend findings on harmless preferences when there are real bugs.
- Do not ask for runtime validation that duplicates static types unless the boundary is untrusted.
