---
name: eric-frontend
description: Apply Eric's frontend coding standards. Use when implementing, refactoring, or reviewing frontend web/app UI code, React components, TanStack Query usage, feature-folder organization, styling boundaries, app-vs-website UI decisions, frontend state, or frontend tests in Eric's style.
---

# Eric Frontend

Use this skill for frontend implementation or frontend review. Keep the codebase's existing framework and component system.

## Workflow

1. Inspect the existing frontend stack, folder layout, component system, styling setup, data-fetching layer, and test runner before changing code.
2. For TanStack Query, request files, query keys, mutation options, or invalidation work, also read `references/tanstack-query.md`.
3. If the task is React-specific, also use the repository's React conventions; do not add memoization or effects by default.
4. Keep changes local to the feature, shared primitive, request file, or store that already owns the behavior.
5. Leave one focused check when logic changes: a narrow test, typecheck, lint, or the smallest runnable verification the repo supports.

## Standards

- Prefer feature folders for product code; put reusable primitives, hooks, and utilities under shared locations.
- Keep app entrypoints thin: providers, router, theme, toast, query client, and startup wiring only.
- Use TypeScript for application code unless the repo already uses JavaScript for config or scripts.
- Use Tailwind utilities, component-system props, or existing UI primitives; keep global CSS for tokens, reset, fonts, third-party patches, and tiny shared animation utilities.
- Do not manually concatenate class names with strings or template literals. First find the repo's existing helper around `clsx`, `classnames`, `cva`, `twMerge`, or similar packages; if none exists, call the package export directly.
- Keep page-specific or feature-specific business classes out of global CSS.
- Treat non-trivial data as server state from the renderer's point of view, even when it is local.
- Keep interaction state such as toast, navigation, panel state, form reset, selected rows, search text, filters, and dialogs near the owner component.
- Put server state in TanStack Query; put persistent UI preferences in a small store or local storage wrapper with clamp, sanitize, and migration when needed.
- Test logic that can break independently of rendering: stores, query keys, reducers, sorting, parsing, state migration, boundary inputs, async behavior, keyboard behavior, selection, and cache invalidation.

## Boundaries

- Do not invent a new design system when the repo already has one.
- Do not move business/page styling into global CSS.
- Do not hand-roll class name composition when the repo has a helper or installed package for it.
- Do not put request functions, query keys, or invalidation logic inline in page components when the repo already has a request/cache layer.
