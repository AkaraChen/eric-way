# Linter Configuration

Linters should enforce mechanical rules that reviewers should not have to
remember. Architecture linting is for real module boundaries, not formatting,
style, or speculative layering.

## When to add ESLint boundaries

1. Use Biome or the existing formatter/linter for basic syntax, formatting,
   import sorting, and simple correctness rules.
2. Add ESLint when the repo needs framework rules, accessibility rules, or
   architecture rules that the baseline tool cannot express.
3. Add boundary rules only after the repo has named layers or slices. If the
   codebase is still a small `src/` folder, use `no-restricted-imports` for the
   one bad import path and stop there.

## Default stack

1. Use ESLint flat config.
2. Use `eslint-plugin-boundaries` for architectural dependencies.
3. In TypeScript repos, configure the TypeScript parser and resolver so aliases
   like `@/features/*` resolve the same way they do in the app.
4. Keep formatter ownership separate. Do not make ESLint, Biome, and Prettier
   fight over the same formatting rules.

## Rules to enable

1. `boundaries/no-unknown`: source files must match declared architectural
   elements when boundary rules inspect them. Missing matches mean the
   architecture map is stale.
2. `boundaries/no-private`: modules must import another element through its
   public entrypoint, not through private files.
3. `boundaries/dependencies`: local element imports are disallowed by default;
   each allowed dependency is explicit.

Use `boundaries/dependencies`, not the older `boundaries/element-types` rule
name.

Avoid `eslint-disable` for boundary violations. Move the code, expose a public
entrypoint, or change the architecture rule if the rule is wrong.

## Feature-Sliced frontend example

Use this shape for React apps that follow Feature-Sliced Design:

```js
// eslint.config.mjs
import tsParser from "@typescript-eslint/parser";
import boundaries from "eslint-plugin-boundaries";

export default [
  {
    files: ["src/**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
    },
    plugins: {
      boundaries,
    },
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
        },
      },
      "boundaries/elements": [
        { type: "app", pattern: "src/app/**", mode: "folder" },
        {
          type: "pages",
          pattern: "src/pages/*/**",
          mode: "folder",
          capture: ["slice"],
        },
        {
          type: "widgets",
          pattern: "src/widgets/*/**",
          mode: "folder",
          capture: ["slice"],
        },
        {
          type: "features",
          pattern: "src/features/*/**",
          mode: "folder",
          capture: ["slice"],
        },
        {
          type: "entities",
          pattern: "src/entities/*/**",
          mode: "folder",
          capture: ["slice"],
        },
        { type: "shared", pattern: "src/shared/**", mode: "folder" },
      ],
    },
    rules: {
      ...boundaries.configs.recommended.rules,
      "boundaries/no-private": "error",
      "boundaries/no-unknown": "error",
      "boundaries/dependencies": [
        "error",
        {
          default: "disallow",
          rules: [
            {
              from: { type: "app" },
              allow: {
                to: {
                  type: ["pages", "widgets", "features", "entities", "shared"],
                },
              },
            },
            {
              from: { type: "pages" },
              allow: {
                to: { type: ["widgets", "features", "entities", "shared"] },
              },
            },
            {
              from: { type: "widgets" },
              allow: {
                to: { type: ["features", "entities", "shared"] },
              },
            },
            {
              from: { type: "features" },
              allow: {
                to: { type: ["entities", "shared"] },
              },
            },
            {
              from: { type: "entities" },
              allow: {
                to: { type: ["entities", "shared"] },
              },
            },
            {
              from: { type: "shared" },
              allow: {
                to: { type: "shared" },
              },
            },
          ],
        },
      ],
    },
  },
];
```

This enforces one-way imports:

```text
app -> pages -> widgets -> features -> entities -> shared
```

Same-layer imports should be rare. Allow them only where the architecture
really permits it, such as `entities -> entities` for cross-entity types. If
feature-to-feature imports become common, move the shared behavior down to
`entities` or `shared`.

## Backend example

For a TypeScript backend with transport, service, repository, and infrastructure
layers, define elements that match the actual folders:

```js
"boundaries/elements": [
  { type: "transport", pattern: "src/transport/**", mode: "folder" },
  { type: "service", pattern: "src/service/**", mode: "folder" },
  { type: "repo", pattern: "src/repo/**", mode: "folder" },
  { type: "infra", pattern: "src/infra/**", mode: "folder" },
  { type: "model", pattern: "src/model/**", mode: "folder" },
  { type: "shared", pattern: "src/shared/**", mode: "folder" }
]
```

Then keep the dependency graph boring:

```js
"boundaries/dependencies": ["error", {
  default: "disallow",
  rules: [
    {
      from: { type: "transport" },
      allow: { to: { type: ["service", "model", "shared"] } }
    },
    {
      from: { type: "service" },
      allow: { to: { type: ["repo", "infra", "model", "shared"] } }
    },
    {
      from: { type: ["repo", "infra"] },
      allow: { to: { type: ["model", "shared"] } }
    },
    {
      from: { type: "model" },
      allow: { to: { type: ["model", "shared"] } }
    },
    {
      from: { type: "shared" },
      allow: { to: { type: "shared" } }
    }
  ]
}]
```

Transport should not call repositories or infrastructure directly when business
rules are involved. Route through `service`.

## Adoption checklist

1. Add element patterns for the current folders only.
2. Start with `default: "disallow"` and add the smallest allowlist that matches
   the architecture.
3. Run ESLint once and fix real violations by moving code or exposing public
   entrypoints.
4. If the first run is too noisy, enable the rule on one folder or layer first.
   Do not add broad ignores just to land the config.
5. Put the lint command in the existing package scripts and run it in CI with
   the same command developers run locally.
