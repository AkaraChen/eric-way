---
name: eric-writing-tests
description: Apply Eric's test-writing standards. Use when deciding whether to add tests, choosing unit vs integration coverage, writing focused regression or correctness tests, reviewing tests, or explaining test strategy.
---

# Eric Writing Tests

- Before adding a test, check both: does the investment fit the product's stage and risk, and can the test catch a failure that matters? If either answer is no, explain why and skip it.
- Test project-owned behavior, not trivial code or a copy of the implementation. Start from a bug, rule, or contract, never a coverage target.
- Do not test a library's documented or expected behavior to guarantee the library itself works. Protect our integration, configuration, and business rules instead.
- Prefer unit tests when they prove the behavior. Use integration tests when mocking collaborators would hide the risk.
- Test public behavior; test private details only when they are the contract. Derive expected results from requirements, not current implementation output.
- Cover business state transitions and data boundaries, including relevant empty, invalid, duplicate, out-of-order, permission-denied, and external-failure cases.
- For regression tests, verify failure on the old code when inexpensive.
- Keep setup small and each test's failure reason clear. Prefer one focused test over a broad suite.
- Add fixtures, mocks, snapshots, or helpers only when they remove concrete repetition in the tests.

Use `$eric-e2e-testing` for real browser flows.
