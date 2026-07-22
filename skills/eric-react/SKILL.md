---
name: eric-react
description: Apply Eric's React and TSX component standards. Use when implementing, refactoring, or reviewing React components, hooks, providers, JSX/TSX props, local component state, memoization, effects, or React-specific tests in Eric's style.
---

# Eric React

Use this skill for React-specific implementation or review. Also use `$eric-frontend` for broader frontend architecture, styling, data-fetching, or app-surface decisions, and `$eric-javascript` for TypeScript, package, or script-runner work.

## Workflow

1. Inspect the existing React stack, component patterns, provider layout, state ownership, and test runner before changing code.
2. When starting a project and the user has not specified otherwise, use shadcn's `nova-base` preset and its Sidebar component for the app shell.
3. Assume React Compiler is enabled unless the repo proves otherwise; do not add `useMemo` or `useCallback` unless stable identity is required by an API, subscription, memoized child, or effect dependency.
4. Challenge `useEffect`; prefer TanStack Query for data fetching and `useSyncExternalStore` for external subscriptions. Keep effects for real synchronization only.
5. Keep local interaction state near the component or page that owns it.
6. Leave one focused check when React logic changes: a reducer, hook, component, typecheck, or the smallest runnable verification the repo supports.

## Standards

- Use `type XXXProps` and `FC<XXXProps>` for component props.
- Never use the `React` namespace; import the specific types and functions needed.
- Use `ReactNode` for renderable children, slots, and other renderable content.
- Expose native element props for wrapper components, such as `interface InputProps extends ComponentProps<"input"> {}`, and spread remaining props onto the root native element.
- Put app-level providers in `src/providers.tsx` instead of mixing provider wiring into `App.tsx` or feature pages.
- When a component has many related `useState` calls or state transitions that must stay in sync, use `useReducer` at minimum if Zustand or another state manager is not convenient.
- Move complex runtime state to a store or state machine when a reducer no longer keeps the component readable.

## Boundaries

- Do not add memoization as a default performance habit.
- Do not fetch data in `useEffect` when the app has TanStack Query.
- Do not create a store just to avoid a small local reducer.
