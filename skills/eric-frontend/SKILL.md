---
name: eric-frontend
description: Apply Eric's frontend coding standards. Use when implementing, refactoring, or reviewing frontend web/app UI code, TanStack Query usage, feature-folder organization, styling boundaries, app-vs-website UI decisions, frontend state, or frontend tests in Eric's style. For React-specific components, hooks, providers, memoization, effects, or local reducer work, also use $eric-react.
---

# Eric Frontend

- Organize product code by feature slice; put reusable primitives, hooks, and utilities in shared locations.
- Keep app entrypoints limited to providers, router, theme, toast, query client, and startup wiring.
- Use TypeScript for application code; existing JavaScript config and scripts can stay JavaScript. Prefer specific types over `any`.
- Split complex conditional rendering into smaller components.
- Default to Tailwind CSS for new projects. Reserve global CSS for tokens, reset, fonts, third-party patches, and small shared animations.
- Use the npm package `cn` to merge class names.
- When i18n is configured, put user-visible copy through its translation resources and API.
- Use TanStack Query for server state, including local service data. Keep requests, query keys, and invalidation in the request/cache layer. Follow `references/tanstack-query.md` for its structure.
- Keep interaction state with its owning component. Persist UI preferences in a small store or local-storage wrapper, with clamping, sanitization, and migration where needed.
- Test behavior independently of rendering where possible: stores, query keys, reducers, sorting, parsing, migrations, boundary inputs, async behavior, keyboard interactions, selection, and invalidation.

Use `$eric-react` for React conventions, `$eric-javascript` for package commands, and `$eric-writing-tests` for test selection.
