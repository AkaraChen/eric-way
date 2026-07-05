# Linter Configuration

Linter config should stay small. Use it for code and architecture violations
that review should not catch by hand.

1. Boundary: use ESLint boundary rules when a repo has layers, slices, modules,
   or ownership zones. The config should define the allowed import direction.
2. Public API: cross-boundary imports should go through the public entrypoint;
   private or internal paths should be forbidden.
3. Restricted imports: ban shortcuts that skip the intended owner, layer, or
   module boundary.
4. Unknown or stale imports: catch unresolved imports, unknown boundary
   elements, and unused code when the project lint stack supports it.
5. Exceptions: keep disables local, rare, and documented with the reason.
