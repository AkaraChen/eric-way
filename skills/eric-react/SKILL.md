---
name: eric-react
description: Apply Eric's React and TSX component standards. Use when implementing, refactoring, or reviewing React components, hooks, providers, JSX/TSX props, local component state, memoization, effects, or React-specific tests in Eric's style.
---

# Eric React

- For new projects, default to shadcn's `nova-base` preset and Sidebar app shell unless the user specifies otherwise.
- Assume React Compiler unless the project proves otherwise. Add `useMemo` / `useCallback` only when an API, subscription, memoized child, or effect dependency requires stable identity.
- Prefer TanStack Query for fetching and `useSyncExternalStore` for external subscriptions. Reserve `useEffect` for synchronization.
- Declare props with `type XXXProps` and components with `FC<XXXProps>`. Import types and functions directly; never use the `React` namespace.
- Use `ReactNode` for children, slots, and other renderable content.
- Expose native props through `ComponentProps<"element">` on wrapper components and forward remaining props to the root native element.
- Put app-level providers in `src/providers.tsx`.
- Keep component and non-component exports in separate files for Fast Refresh.
- Use `useReducer` for related state transitions when a state manager is not convenient. Use a store or state machine when a reducer becomes unwieldy; do not introduce a store just to replace a small local reducer.

Use `$eric-frontend` for frontend structure and state ownership, and `$eric-javascript` for package commands.
