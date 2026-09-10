---
name: eric-review
description: Review code using Eric's standards. Use when the user asks for review, code review, frontend review, backend review, desktop review, React review, architecture review, PR review, or asks whether code matches Eric's style; prioritize concrete bugs, risks, overengineering, style drift, and missing focused tests.
---

# Eric Review

- Review against the applicable language, framework, and domain skills.
- Flag implementation degradation even when behavior still works: scattered ownership, duplicated logic, weakened invariants, misplaced business rules, unnecessary API expansion, or worse performance/testability.
- For each new concept, require a clear name, entry point, owned invariant, and tests or documentation that explain it.
- Challenge unnecessary defensive code and speculative abstractions. Do not request runtime checks that merely repeat static types; validate data crossing untrusted boundaries.
- Lead with concrete findings ordered by severity and cite file/line evidence. Prioritize bugs and meaningful risks over harmless preferences. If no issues are found, say so and identify any unverified areas.

Use `$eric-github-pr` for GitHub viewed-state operations, `$guided-review` for walkthroughs, `$eric-ui` for UI review, and `$eric-writing-tests` for test judgments.
