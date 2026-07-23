---
name: eric-review
description: Review code using Eric's standards. Use when the user asks for review, code review, frontend review, backend review, desktop review, React review, architecture review, PR review, or asks whether code matches Eric's style; prioritize concrete bugs, risks, overengineering, style drift, and missing focused tests.
---

# Eric Review

Use this skill for review tasks. Start from concrete findings, not a broad summary. Also check the relevant Eric skill for the code under review: `$eric-react`, `$eric-frontend`, `$eric-backend`, `$eric-desktop`, or `$eric-ui`.

For detailed review guidance, read `references/review.md`. For guided-review walkthroughs or examples, use `$guided-review`.
For any UI diff, also use `$eric-ui` and read
[`references/ui.md`](references/ui.md).

## Workflow

1. Inspect the actual diff or files under review before judging.
2. For GitHub PRs, after inspecting enough test and generated evidence, mark safe test-only and generated-only files as viewed so the remaining changed-files view stays focused.
3. Read `$eric-react`, `$eric-frontend`, `$eric-backend`, or `$eric-desktop` when the diff touches that stack.
4. For JavaScript, TypeScript, Node, package-manager, install, or script-runner review, also use `$eric-javascript`.
5. For UI changes, check every added line for user value, inappropriate data
   disclosure, leaked implementation detail, and avoidable cognitive load.
6. Check for correctness bugs, behavioral regressions, implementation degradation, newly introduced concepts, overengineering, style drift, missing focused tests, and boundary violations.
7. Lead with findings ordered by severity. Include file and line references when available.
8. If there are no issues, say so and mention remaining test gaps or residual risk.

## Standards

- First check formatting, indentation, naming, and local style consistency.
- Then check over-defensive code, unnecessary complexity, speculative abstraction, implementation degradation, poor modularity, and missing focused tests.
- Treat implementation degradation as a real finding: flag changes that keep behavior working while worsening ownership, data flow, boundaries, complexity, performance, or testability.
- If a PR introduces a new concept, require a clear name, one entry point, the invariant it owns, and tests or docs that make the concept teachable.
- Do not ask for runtime validation that duplicates static types unless data crosses an untrusted boundary.
- Frontend: flag `any`, large render branching, manually concatenated `className` strings, hard-coded user-visible UI strings when the repo has i18n config, business classes in global CSS, and inline request/query-key/invalidation code when the repo has a request/cache layer.
- UI: flag fields, statuses, metadata, controls, and decoration without concrete
  user value; raw internal details; unauthorized disclosure; and interfaces that
  become data dashboards or design showcases instead of supporting the task.
- React: assume compiler unless the repo proves otherwise; do not ask for `useMemo` or `useCallback` unless stable identity is required.
- React: challenge `useEffect`; prefer TanStack Query for data fetching and `useSyncExternalStore` for external subscriptions.
- Backend: keep transport thin, preserve service/core boundaries, use typed Rust errors in reusable code, and validate at trust boundaries.
- Desktop: check dev and packaged assumptions, renderer API/query boundaries, native/blocking work off the UI thread, and generated contracts.
- Output findings first, ordered by severity, including implementation degradation findings, with file and line references; keep summary secondary and short.

## Boundaries

- Do not turn a review into a rewrite unless the user asks for fixes.
- Do not spend findings on harmless preferences when there are real bugs.
- Do not ask for runtime validation that duplicates static types unless the boundary is untrusted.
