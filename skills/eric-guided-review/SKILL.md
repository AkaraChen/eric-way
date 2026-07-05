---
name: eric-guided-review
description: Produce Guided Review artifacts for pull requests. Use when the user asks for a guided review, PR walkthrough, line map, suggested reading order, review artifact, or structured PR review summary with risk and verification focus.
---

# Eric Guided Review

A Guided Review turns a pull request diff into a readable map. It is not a file-by-file summary and not a replacement for review judgment. Its job is to reduce comprehension cost so a human reviewer can make a better approve, request-changes, or comment-only decision.

Use `$eric-review` for normal code review findings. For GitHub PR changed-file operations such as marking safe test-only files viewed, use `$eric-github-pr` before deep review.

## Output

A useful Guided Review has:

1. One-sentence thesis: the core behavior or system change.
2. Suggested reading order: where to start, what to read next, and why.
3. Line map: visible line, hidden line, and cross-cutting lines.
4. Risk focus: paths, boundaries, migrations, rollback points, or assumptions that deserve attention.
5. Verification focus: tests, screenshots, logs, manual checks, CI signals, and unproven claims.
6. Questions for the author: only questions affecting understanding, correctness, risk, or review decision.
7. Review recommendation: approve, request changes, or comment only, with blockers separated from non-blocking follow-up.

## Line Model

- Visible line: the PR's declared story: user-facing behavior, requirement mapping, happy path, removed behavior.
- Hidden line: assumptions the diff does not explain directly: invariants, coupling, history, migration risk, operational effect, and review shape.
- Data line: input, validation, transformation, persistence, output.
- State line: loading, cache, refresh, invalidation, concurrency, retry.
- Permission line: identity, authorization, tenant isolation, auditability.
- Error line: failure classification, propagation, user messaging, retry, fallback.
- Test line: what tests prove, what they do not prove, and whether they fail for the right reason.
- Complexity line: whether abstraction serves a current need or a speculative future need.

## Process

1. Establish scope: read the PR title, description, linked issue, design notes, incident context, CI status, and review requests. Write down what the PR claims to solve before judging the diff.
2. Inventory the diff: list added, modified, deleted, renamed, generated, config, test, and documentation files. Group by responsibility. Identify entry points, core logic, schemas, migrations, state management, public APIs, or UI surfaces.
3. For GitHub PRs, use `$eric-github-pr` to prepare the changed-files view when safe test-only files can be marked viewed after reading enough test evidence.
4. Reconstruct the change graph:

```text
entry point -> validation -> core decision -> state/storage -> side effect -> output -> proof
```

5. Extract lines: visible first, hidden second, cross-cutting third. Do not invent lines to make the artifact look complete.
6. Re-read by line instead of by file: follow visible behavior, hidden assumptions, tests, and deletions to completion.
7. Classify risk:
   - Blocker: correctness, security, data integrity, compatibility, deployability, rollback, or the main requirement is broken.
   - Should fix: likely maintenance cost, test gap, or misuse risk.
   - Nit / follow-up: optional polish or separate work.

## Template

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

### Key Risks
- Blocker: ...
- Should fix: ...
- Follow-up: ...

### Questions For The Author
- ...

### Review Recommendation
Approve / Request changes / Comment only: reason.
```

## Accuracy Rules

- Separate observed facts from synthesis.
- Prefer precise wording over broad wording.
- Do not treat AI output as authoritative. Use AI to draft line maps, summarize routine context, and propose questions; keep humans responsible for semantic correctness, risk judgment, and merge decisions.
- If the PR is small, keep the Guided Review small. A one-screen review is better than a ceremonial template.

## Anti-Patterns

- Summarizing each file without reconstructing system behavior.
- Commenting on naming or formatting before understanding the main design.
- Spending human review time on checks automation should handle.
- Forcing unrelated changes into one fake thesis.
- Reviewing added code while ignoring deleted code, configuration, tests, and docs.
- Producing a walkthrough with no judgment.
