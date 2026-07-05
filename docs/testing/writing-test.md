# Writing tests

Every test should have a clear reason to exist. Before writing it, decide
whether it is mostly a regression lock, a correctness check, or both.

## Two purposes

1. Regression locks protect behavior that already mattered. Use them after a
   bug fix, refactor, migration, or dependency upgrade so the same behavior does
   not accidentally change later.
2. Correctness checks prove behavior against a rule, contract, invariant, or
   product requirement. The expected result should come from the rule, not from
   copying the current implementation output.

## Rules

1. Name the purpose in the test name or scenario. A future reader should know
   what behavior the test protects.
2. For a regression test, reproduce the old failure first when possible. The
   test should fail on the broken code and pass after the fix.
3. For a correctness test, include the important boundary or adversarial cases,
   not only the happy path.
4. Test the public behavior of the unit, module, service, route, component, or
   command. Avoid testing private implementation details unless they are the
   real contract.
5. Keep fixtures small. Large setup usually hides the behavior the test is meant
   to protect.
6. One test should fail for one clear reason. Split unrelated assertions when
   they describe different behavior.
7. Avoid broad snapshots unless the output format itself is the contract.
8. If a test is hard to write, first ask whether the code boundary is wrong. A
   small refactor is better than a brittle test around tangled code.
9. Do not add tests just to increase counts or coverage. Coverage is useful only
   when it points at real unprotected behavior.
