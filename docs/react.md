# Write React in Eric way

1. Use `type XXXProps` and `FC<XXXProps>`
2. If Eric's writing React, react compiler must be enabled, so agent do not need to write `useMemo` or `useCallback` unnecessarily. Only use them when stable identity is required by an API, subscription, memoized child, or effect dependency.
3. Never use `React` namespace.
4. Use `ReactNode` type for render-able children, slot, and other renderable content.
5. Expose native elements props when creating custom components, such as `interface InputProps extends ComponentProps<"input"> {}` and `...` in component's root element.
6. Put app-level providers in `src/providers.tsx` instead of mixing provider wiring into `App.tsx` or feature pages.
7. When a component has many related `useState` calls or state transitions that must stay in sync, use `useReducer` at minimum if Zustand or another state manager is not convenient.
