---
name: eric-grill
description: Stress-test product, technical, and domain-modeling plans before implementation in Eric's style. Use when the user asks to grill, challenge, validate, or sharpen a plan/design/domain model; when terminology, boundaries, invariants, or ADR-worthy decisions are fuzzy; or before implementing a feature where shared understanding matters.
---

# Eric Grill

Use this skill to force clarity before building. Be direct, concrete, and code-aware.

## Workflow

1. Read existing context through the context-map first:
   - If `CONTEXT-MAP.md` exists, use it to choose the relevant bounded context, area, or linked artifact.
   - Do not fall back to a single catch-all context file by default.
   - If no map exists and a domain term becomes settled, create `CONTEXT-MAP.md` with just that term and area.
   - Read relevant ADRs only when the plan touches an existing decision.
2. Restate the plan in one tight paragraph: outcome, actors, changed behavior, and assumptions.
3. Inspect code instead of asking whenever the answer can be found cheaply.
4. Grill one blocking question at a time. Each question includes:
   - why it matters
   - your recommended answer
   - the decision that becomes unblocked if accepted
5. Walk the dependency tree: resolve domain terms and boundaries before APIs, persistence, UI, rollout, or test details.
6. Do not implement the plan until the user confirms the shared understanding.

## What to Challenge

- Fuzzy or overloaded terms: propose one canonical term.
- Domain relationships: actors, entities, ownership, lifecycle states, and invariants.
- Edge cases: empty, missing, duplicate, out-of-order, permission-denied, partial failure, retry, cancellation, and concurrency cases.
- Existing behavior claims: cross-check against code and call out contradictions.
- Decision weight: separate reversible choices from decisions that need explicit agreement.
- Scope creep: name what can be skipped now and what evidence would justify adding it.

## Domain Model Updates

When a domain term is resolved, update `CONTEXT-MAP.md` immediately. Keep entries scoped by area so future agents can load only the relevant context.

Use this format:

```markdown
# Context Map

## Glossary

- `<area>` / `Term`: Meaning in domain language. Include key distinctions, not implementation details.
```

The context-map is a glossary and routing layer. Do not put implementation details, specs, scratch notes, or ADR content in it.

## ADRs

Offer an ADR only when all three are true:

1. The decision is hard to reverse.
2. The decision will surprise future maintainers without context.
3. The decision resolves a real trade-off.

Use the repo's existing ADR format if one exists. Otherwise create the next numbered file under `docs/adr/` with:

```markdown
# Title

## Status

Accepted

## Context

## Decision

## Consequences
```

Skip the ADR when a short comment, test name, or glossary update carries the context well enough.

## Output

During grilling, ask exactly one question and wait for the user's answer. Do not bundle several questions into a checklist.

When the plan is clear, summarize:

```markdown
Shared understanding:
- Terms:
- Decisions:
- Non-blockers:

Ready to implement?
```
