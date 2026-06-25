# How to write Rust code in Eric way

## Structure

1. Keep modules small and named by what they own, not by vague layers like `utils`.
2. Put side effects at the edge and keep core functions easy to call from tests.

## Errors

1. Use `thiserror` for reusable code where callers may match, convert, serialize, or handle different failure kinds.
2. Use `thiserror` when the error is part of the API contract.
4. Use `anyhow` at application edges where nobody will match the error: binaries, scripts, setup code, tests, and glue code.

## Data

1. Use `garde` for validating input and DTO structs.
