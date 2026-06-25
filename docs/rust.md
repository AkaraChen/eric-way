# How to write Rust code in Eric way

## Structure

1. Model the domain first with explicit structs, enums, state types, and ID newtypes.
2. Keep modules small and named by what they own, not by vague layers like `utils`.
3. Put side effects at the edge and keep core functions easy to call from tests.
4. Prefer typed state transitions: commands produce plans or effects, events update state, and adapters translate effects into external work.

## Errors

1. Use `thiserror` for reusable code where callers may match, convert, serialize, or handle different failure kinds.
2. Use `thiserror` when the error is part of the API contract.
3. Use `anyhow` at application edges where nobody will match the error: binaries, scripts, setup code, tests, and glue code.

## Data

1. Use `garde` for validating input and DTO structs.
2. Put simple field rules in derive attributes and cross-field or collection invariants in custom validators.
3. Prefer deterministic maps and sets when output, snapshots, or tests should stay stable.
4. Make wire and data contracts explicit with `serde`, `schemars`, generated types, and narrow adapter modules.

## Tests

1. Test state-machine behavior and data boundaries, not only happy paths.
2. Add adversarial input cases where protocol, parsing, or validation code accepts external data.
