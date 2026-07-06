---
name: eric-grill
description: Stress-test product, technical, and domain-modeling plans before implementation in Eric's style. Use when the user asks to grill, challenge, validate, or sharpen a plan/design/domain model; when terminology, boundaries, invariants, or ADR-worthy decisions are fuzzy; or before implementing a feature where shared understanding matters.
---

# Eric Grill

Use this skill to grill a plan while actively sharpening the project's domain model. The goal is shared understanding before implementation, not a prettier checklist.

## Ground Rule

Assume the repo has multiple domain contexts. `CONTEXT-MAP.md` is the default routing document. Do not introduce or recommend a single catch-all context model.

Create files lazily: only when a term, context boundary, relationship, or ADR-worthy decision has actually crystallized.

## Workflow

1. Read `CONTEXT-MAP.md` first when it exists. Use it to find the relevant context, glossary artifact, and ADR location.
2. If no map exists, keep working until a context boundary or term is settled, then create the smallest useful `CONTEXT-MAP.md`.
3. Restate the plan in one tight paragraph: outcome, actors, changed behavior, and assumptions.
4. Walk down the design tree one dependency at a time. Resolve domain terms and boundaries before API, persistence, UI, rollout, or test details.
5. Ask exactly one question at a time. For each question, include your recommended answer.
6. If the answer can be found by exploring the codebase, inspect the code instead of asking.
7. Do not enact the plan until the user confirms the shared understanding.

## During The Session

### Challenge Against The Map

When the user uses a term that conflicts with the mapped domain language, call it out immediately:

```text
The map defines "Cancellation" as an order-level event, but you seem to mean item-level removal. Which one is this?
```

### Sharpen Fuzzy Language

When the user uses vague or overloaded terms, propose a precise canonical term:

```text
You're saying "account" — do you mean Customer or User? Those are different concepts.
```

### Discuss Concrete Scenarios

Invent scenarios that probe edge cases and force precise boundaries: duplicate events, partial failure, retries, cancellation, permission denied, missing state, out-of-order updates, and cross-context ownership.

### Cross-Reference With Code

When the user states how something works, check whether the code agrees. Surface contradictions plainly:

```text
The code cancels whole orders, but this plan assumes partial cancellation. Which behavior is correct?
```

### Update The Model Inline

When a term, boundary, or relationship is resolved, update `CONTEXT-MAP.md` immediately. Do not batch domain-model updates for later.

## Context Map Format

Use the repo's existing format if one exists. Otherwise use:

```markdown
# Context Map

## Contexts

- [Ordering](./src/ordering/domain.md) — receives and tracks customer orders
- [Billing](./src/billing/domain.md) — generates invoices and processes payments

## Relationships

- **Ordering → Billing**: Ordering emits `OrderPlaced`; Billing consumes it to generate an invoice.
- **Billing ↔ Ordering**: Shared identifiers are references only; each context owns its own state.

## Language

**Order**: A customer's request to purchase one or more items.
_Avoid_: Purchase, transaction
```

Rules:

- Be opinionated. Pick one term and list rejected synonyms under `_Avoid_`.
- Keep definitions to one or two sentences.
- Only include project-specific domain concepts, not general programming terms.
- Keep implementation details, specs, scratch notes, and ADR content out of the map.
- If the relevant context is unclear, ask one question before writing.

## ADRs

Offer an ADR only when all three are true:

1. Hard to reverse: changing it later has meaningful cost.
2. Surprising without context: a future reader will wonder why.
3. Real trade-off: there were genuine alternatives.

Use the ADR location from `CONTEXT-MAP.md` when it exists; otherwise use `docs/adr/`. Scan for the highest existing number and increment it.

Default ADR format:

```markdown
# Short Title

One to three sentences: what context mattered, what decision was made, and why.
```

Only add status, considered options, or consequences sections when they carry real value.

## Output

When grilling, ask one question and wait. Do not bundle multiple questions.

When the plan is clear, summarize:

```markdown
Shared understanding:
- Terms:
- Boundaries:
- Decisions:
- Non-blockers:

Ready to implement?
```
