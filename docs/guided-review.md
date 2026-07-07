# Guided Review

A Guided Review is a review artifact that turns a pull request diff into a readable map. The reviewer first reads the whole diff, reconstructs the change from end to end, separates the visible and hidden lines of change, and then writes a guided walkthrough that helps humans understand what matters.

It is not a file-by-file summary. It is not a replacement for review judgment. Its job is to reduce comprehension cost so a human reviewer can make a better approve / request-changes / comment-only decision.

## Industry Practices

Use these as inputs, not cargo-cult rules. Public guidance differs by company and tool, but the overlap is strong.

- Google frames code review around long-term code health. Reviewers should generally favor approval once a change definitely improves the system, even if it is not perfect. Google also tells reviewers to examine design, functionality, complexity, tests, naming, comments, style, documentation, context, and in the general case every line they were asked to review.
- Google's navigation advice is: first decide whether the change makes sense, then inspect the main part of the change, then read the rest of the CL in a logical sequence. If the main design is wrong, send that feedback early because the rest may be rewritten.
- Microsoft's reviewer guidance separates automated checks from human judgment. Linters and formatters can handle low-value checks; humans should focus on business-logic correctness, changed tests, design readability, maintainability, and team-specific error checklists. Microsoft also says reviewers should read every changed line, follow a logical order, and open the full file or check out the change when local context is missing.
- GitHub's pull request guidance emphasizes small focused PRs, clear titles and descriptions, links to context, reviewer guidance about file order, author self-review, and early security review. GitHub Copilot can generate summaries and review comments, but Copilot code review always leaves a comment review, not an approve or request-changes review, so it does not satisfy required human approvals or block merging by itself.
- GitLab splits review responsibility by role: reviewers evaluate the specifics of the chosen solution, while maintainers are responsible for the overall health, quality, and consistency of the codebase. GitLab also explicitly calls out domain experts for areas where specialized knowledge matters.
- Meta's Sapling / ReviewStack work highlights the value of stacked changes: smaller commits are easier to reason about and review, and stack-aware review tools preserve discussion around individual commits instead of forcing the entire PR to be reviewed as one large blob.
- Recent AI-review practice points in the same direction. Microsoft reported an internal AI code review assistant used on more than 90% of PRs across the company and more than 600K PRs per month, with AI handling routine comments, suggestions, summaries, and Q&A while authors remain in control of accepting changes. Google Cloud describes AI coding as shifting the bottleneck from writing code to reviewing and integrating it, which makes guardrails and human review focus more important.

## What A Guided Review Produces

A useful Guided Review has these parts:

1. **One-sentence thesis**: the core behavior or system change in the PR.
2. **Suggested reading order**: where to start, what to read next, and why.
3. **Line map**: the visible line, hidden line, and cross-cutting lines of the change.
4. **Risk focus**: the paths, boundaries, migrations, rollback points, implementation degradation, or assumptions that deserve attention.
5. **Concept focus**: any new domain term, lifecycle state, permission boundary, storage model, async contract, public API shape, or review category the PR expects future contributors to understand.
6. **Verification focus**: which tests, screenshots, logs, manual checks, or CI signals prove the change, and which claims remain unproven.
7. **Questions for the author**: only questions that affect understanding, correctness, risk, or review decision.
8. **Review recommendation**: approve, request changes, or comment only, with blockers separated from non-blocking follow-up.

## The Line Model

### Visible Line

The visible line is the PR's declared story.

- User-facing behavior: pages, APIs, CLI commands, permissions, states, and error messages that changed.
- Requirement mapping: which issue, design, incident, or product requirement each major change supports.
- Happy path: the normal path the PR wants to make possible.
- Removed behavior: what no longer exists and why the removal is safe.

### Hidden Line

The hidden line is what the diff assumes but does not explain directly.

- Invariants: states, fields, ordering, identities, permissions, or timing assumptions that must remain true.
- Coupling: modules whose semantics changed even if their code barely moved.
- History: old constraints, past incidents, compatibility requirements, and reasons the code used to look this way.
- Migration risk: old data, old clients, old configuration, and feature-flag states.
- Operational effect: logs, metrics, alerts, rollback, capacity, rate limits, and deploy sequencing.
- Review shape: unrelated changes bundled together, large diffs hiding small decisions, or social pressure to approve too much at once.

### Concept Line

The concept line names any new idea the PR adds to the codebase.

- Name: the term future contributors will search for and use in discussion.
- Entry point: where the concept first appears in code or user behavior.
- Owner: the module, type, table, state machine, or API that owns the concept's invariant.
- Proof: tests, docs, examples, or migration notes that teach the concept.

### Cross-Cutting Lines

Cross-cutting lines run through many files.

- Data line: input, validation, transformation, persistence, output.
- State line: loading, cache, refresh, invalidation, concurrency, retry.
- Permission line: identity, authorization, tenant isolation, auditability.
- Error line: failure classification, propagation, user messaging, retry, fallback.
- Test line: what the tests prove, what they do not prove, and whether they fail for the right reason.
- Complexity line: whether the PR adds abstraction for a current need or a speculative future need.
- Degradation line: whether the code now has worse ownership, data flow, boundaries, performance, or testability even if behavior works.

## Process

### 0. Establish Scope

- Read the PR title, description, linked issue, design notes, incident context, CI status, and review requests.
- Write down what the PR claims to solve before judging whether the diff actually solves it.
- If the description lacks context, mark the missing context and see whether the diff or tests fill the gap.

### 1. Inventory The Diff

- List added, modified, deleted, renamed, generated, config, test, and documentation files.
- Group files by responsibility instead of trusting the platform's default file order.
- Identify the main files: entry points, core service logic, schemas, migrations, state management, public APIs, or UI surfaces.
- On GitHub PRs, prepare the changed-files view with [GitHub PR Review Operations](gh-pr.md): after reading enough to understand the test line and generated-source relationship, mark safe test-only and generated-only files as viewed so the remaining diff stays focused.
- Generated files and large static data can be sampled, but human-written logic should not be skipped unless the review scope explicitly excludes it.

### 2. Reconstruct The Change Graph

Turn the diff back into a system flow:

```text
entry point -> validation -> core decision -> state/storage -> side effect -> output -> proof
```

For each flow, answer:

- Where does this change enter the system?
- Which fact, invariant, or contract does it change?
- Who depends on that new fact later?
- Does it introduce a new concept that should be named, owned, documented, or tested?

### 3. Extract Lines

Extract the visible line first, the hidden line second, and the cross-cutting lines third.

- Write the visible line in product or user language: who can now do what.
- Write the hidden line in engineering language: what must be true for this to be safe.
- Write the concept line when the PR adds a new term, state, boundary, storage model, async contract, public API shape, or review category.
- Write cross-cutting lines in reviewer language: security, concurrency, performance, compatibility, observability, tests, rollback.

Do not invent lines to make the artifact look complete. If evidence is missing, mark the line as unproven or ask the author.

### 4. Re-Read By Line

On the second pass, stop reading file by file. Follow each line to completion.

- Follow the visible line through entry point, core logic, output, and tests.
- Follow the hidden line through edge cases, old data, failure paths, permissions, and concurrency.
- Follow the concept line through naming, ownership, invariants, docs, examples, and tests.
- Follow the degradation line through old vs new ownership, duplicated helpers, broadened APIs, weakened invariants, complexity, performance, and testability.
- Follow the test line through test names, fixtures, assertions, and failure mode.
- Follow the deletion line through callers, configuration, docs, migrations, and user habits.

### 5. Classify Risk

Use three levels:

- **Blocker**: correctness, security, data integrity, compatibility, deployability, rollback, or the main requirement is broken.
- **Should fix**: not immediately catastrophic, but likely to increase maintenance cost, degrade implementation quality, create test gaps, or invite misuse.
- **Nit / follow-up**: optional polish or separate work that should not block the PR.

In Eric way reviews, especially watch for implementation degradation, unclear new concepts, over-defensive code, speculative abstractions, runtime validation that duplicates static types, large render branches, manual `className` concatenation where a helper exists, unnecessary `useMemo` / `useCallback`, and avoidable `useEffect`.

### 6. Write The Guided Review

Use this template:

```md
## Guided Review

### Thesis
One sentence describing the core change.

### Suggested Reading Order
1. `path/to/main`: why this is the entry point.
2. `path/to/core`: why this contains the main decision.
3. `path/to/tests`: why this proves or fails to prove the behavior.

### Line Map
- Visible line: ...
- Data line: ...
- State line: ...
- Permission line: ...
- Error line: ...
- Test line: ...
- Hidden line: ...
- Concept line: ...
- Degradation line: ...

### Key Risks
- Blocker: ...
- Implementation degradation: ...
- Should fix: ...
- Follow-up: ...

### Questions For The Author
- ...

### Review Recommendation
Approve / Request changes / Comment only: reason.
```

## Accuracy Rules

- Separate observed facts from synthesis. If a claim says what a company does, keep it precise and verifiable.
- Prefer precise wording over broad wording. For example, say "GitHub Copilot code review does not count toward required approvals" instead of "AI cannot approve PRs" because other tools may differ.
- Do not claim a company-wide practice from a single blog post unless the post itself says it is company-wide.
- Do not treat AI output as authoritative. Use AI to draft line maps, summarize routine context, and propose questions; keep humans responsible for semantic correctness, risk judgment, and merge decisions.
- If the PR is small, keep the Guided Review small. A one-screen review is better than a ceremonial template.

## Anti-Patterns

- Summarizing each file without reconstructing system behavior.
- Commenting on naming or formatting before understanding the main design.
- Spending human review time on checks that automation already handles.
- Forcing unrelated changes into one fake thesis.
- Reviewing added code while ignoring deleted code, configuration, tests, and docs.
- Producing a walkthrough with no judgment.
- Producing judgment with no reading path, so the next reviewer still starts from zero.
