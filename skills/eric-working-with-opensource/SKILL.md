---
name: eric-working-with-opensource
description: Apply Eric's contribution etiquette when preparing issues, patches, pull requests, or review replies for open-source projects the user does not lead. Prioritize reducing maintainer interruptions and review effort.
---

# Eric Working With Opensource

For a project the user does not lead, reducing disturbance is the highest priority. Make participation feel easy for its maintainers: do the investigation, keep the contribution focused, and leave them a clear decision with little extra work.

Determine the user's role from the task and repository context. A fork or write access alone does not establish project leadership. When leadership is unclear, use this contribution posture while continuing local work; do not contact maintainers just to settle that question.

## Prepare Before Contact

- Read the project's contribution guidance, issue and PR templates, and relevant existing discussions. Search for duplicates, prior decisions, and work already in progress.
- Investigate locally first. Bring a reproducible problem, concrete evidence, or a reviewable patch instead of asking maintainers to debug an unexamined report.
- Follow the project's architecture, style, tooling, and contribution process. Do not impose Eric's personal conventions on another maintainer's project.
- For a large or directional change, look for existing agreement and the project's preferred proposal route before investing in implementation. When a decision is needed, prepare one concise proposal with the problem, scope, and tradeoff; send it only within the user's authorization. Small established fixes need no ceremonial discussion unless the project requires it.

## Make Review Easy

- Keep one coherent outcome per contribution. Leave unrelated formatting, refactors, dependency upgrades, and speculative features out.
- Run the relevant existing checks and describe what was verified and what could not be verified. Reducing disturbance never means concealing failures or submitting unfinished work as ready.
- Write an issue or PR that stands on its own: explain the problem, resulting behavior, and evidence. Link existing context and follow the template without pasting agent logs or internal planning.
- Keep internal task decomposition in the user's tracker when useful. Do not mirror every internal sub-issue upstream or flood maintainers with tiny dependent PRs; choose a reviewable boundary for the project.

## Spend Maintainer Attention Carefully

- Use the existing relevant thread. Consolidate findings, questions, and review responses instead of sending a comment for every intermediate step.
- Ask only questions that require maintainer judgment and cannot be answered from the repository or prior discussion. Make the decision and its implications clear.
- Avoid unsolicited mentions, assignment, review requests, repeated status pings, and cross-posting. Do not send acknowledgement-only replies or automated progress reports that add no useful information.
- Address actionable review feedback together when practical, verify the changes, and summarize the result once. Do not require maintainers to manage the agent's workflow.
- Respect “no,” project scope, and maintainers' pace. Silence is not approval or a reason to escalate. Follow the project's stated follow-up practice; otherwise wait for a material update or a user-authorized follow-up instead of inventing a reminder cadence.

Preparing a contribution does not authorize publishing it or contacting anyone. Carry existing user authorization forward; do not ask again for an already authorized action. If external contact is not authorized, finish the local draft or patch and present the concrete result to the user.
