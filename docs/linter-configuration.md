# Linter Configuration

Linter configuration should describe the aspects a project protects, not copy a
concrete rule matrix into every repo. The exact tools, folders, layers, and
exceptions belong in the project that owns the code.

## Aspects

1. Formatting: one tool owns code shape.
2. Syntax and correctness: one linter owns common static mistakes.
3. Type safety: typed projects run a separate type-check gate.
4. Imports: one rule set owns import hygiene and forbidden paths.
5. Architecture boundaries: ESLint owns layer, slice, ownership, and public API
   boundaries when the repo has real architectural boundaries.
6. Surface rules: framework, runtime, accessibility, and test rules are enabled
   only for repos that use those surfaces.
7. Dependency and security checks: shipped services add dependency and
   security-focused gates when the risk justifies them.

## Adoption

1. Keep formatter, linter, type-check, tests, dependency checks, and security
   checks as separate commands.
2. Add architecture-boundary linting only after the boundaries have names.
3. Keep concrete allowlists, folder patterns, and exceptions in the target
   project, not in this shared guide.
4. Run the same commands in CI that developers run locally.
