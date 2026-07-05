# Writing tests

A test has a result and a method. This document only covers unit tests and
integration tests.

## Core results

1. Regression locks protect behavior that already mattered. Use them after a
   bug fix, refactor, migration, or dependency upgrade so the same behavior does
   not accidentally change later.
2. Correctness checks prove behavior against a rule, contract, invariant, or
   product requirement. The expected result should come from the rule, not from
   copying the current implementation output.

Every test should explain which result it protects. If it cannot, skip it.

## Methods

1. Unit tests check one unit's public behavior with collaborators controlled or
   replaced. Use them when the rule can be proved without real storage, network,
   process, or framework behavior.
2. Integration tests check real collaboration between project-owned pieces: for
   example service plus repo, route plus service, parser plus serializer, or
   adapter plus local test double. Use them when the risk lives in wiring,
   persistence, transactions, configuration, or data shape.

Choose a unit test when it proves the result. Choose an integration test only
when a unit test would fake away the risk.

## Methodology

1. Start from a rule or a bug. Do not start from coverage numbers.
2. For regression, make the test fail on the old code when it is cheap to do so.
3. For correctness, include the important adversarial cases: empty, missing,
   invalid, duplicate, out-of-order, permission-denied, or external-failure
   inputs.
4. Test the public boundary. Private details are test targets only when they are
   the real contract.
5. Keep setup small. One test should fail for one clear reason.
