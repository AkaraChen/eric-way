---
name: eric-domain-modeling
description: Apply when designing or reviewing business models, state machines, business rules, domain ownership, or side-effect boundaries in any language.
---

# Eric Domain Modeling

- Model business states and legal transitions explicitly. Commands produce plans/effects, events update state, and adapters perform external work.
- Organize code by feature slice: keep each business feature's models, rules, and use cases together rather than splitting the whole project into technical-layer folders. Within each slice, keep business decisions in the core and side effects in adapters.
- Introduce abstractions only for a real second implementation, test boundary, or ownership boundary.
