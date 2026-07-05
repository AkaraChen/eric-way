---
name: eric-writing-tests
description: Apply Eric's test-writing standards. Use when deciding whether to add tests, choosing unit vs integration coverage, writing focused regression or correctness tests, reviewing tests, or explaining test strategy.
---

# Eric Writing Tests

Use this skill for unit and integration test decisions. For stack-specific test code, also use the relevant Eric skill: `$eric-javascript`, `$eric-react`, `$eric-frontend`, `$eric-backend`, or `$eric-desktop`.

## Workflow

1. Start from a bug, rule, contract, invariant, or product requirement. Do not start from coverage numbers.
2. Decide what result the test protects:
   - Regression lock: existing behavior mattered and must not change again after a bug fix, refactor, migration, or dependency upgrade.
   - Correctness check: behavior is proved against a rule, contract, invariant, or requirement.
3. Choose the lightest method that proves the result:
   - Unit test: one unit's public behavior with collaborators controlled or replaced.
   - Integration test: real collaboration between project-owned pieces, such as route plus service, service plus repo, parser plus serializer, or adapter plus local test double.
4. Prefer a unit test when it proves the result. Use integration only when a unit test would fake away the risk.
5. For regressions, make the test fail on the old code when that is cheap to do.
6. Keep setup small. One test should fail for one clear reason.

## Standards

- Every test should explain which result it protects. If it cannot, skip it.
- Test the public boundary. Private details are targets only when they are the real contract.
- For correctness, include important adversarial cases: empty, missing, invalid, duplicate, out-of-order, permission-denied, or external-failure inputs.
- Expected results should come from the rule or requirement, not copied from the current implementation output.
- Do not add fixtures, mocks, snapshots, or helpers until they delete obvious repetition in the current tests.
- Do not add broad suites when one focused test locks the behavior.

## Boundaries

- This skill covers unit and integration tests, not browser end-to-end tests. Use `$eric-e2e-testing` for real browser flows.
- Do not write tests only to satisfy a coverage target.
- Do not test private implementation details when public behavior exposes the same risk.
