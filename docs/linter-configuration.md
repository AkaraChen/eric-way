# Linter Configuration

Linting should protect project intent, not copy a universal ruleset.

1. Keep linter rules local to the repo. They should follow the current code
   shape, ownership model, and risk, not a shared config package.
2. Use ESLint only when the baseline linter cannot express the rule. The usual
   reason is semantic checks around UI frameworks, imports, generated code, or
   architecture.
3. Boundary rules should describe dependency direction and ownership: which side
   may import which side, what is private, and what must go through a public
   entrypoint.
4. Prefer small targeted restrictions before a broad boundary framework. Add a
   framework only when the same boundary rule repeats across enough places.
5. Treat exceptions as debt. Keep them narrow, explain why the rule cannot hold
   yet, and remove them when the code moves.
