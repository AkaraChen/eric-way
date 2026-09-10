---
name: eric-quality-control-checklist
description: Apply before creating a commit. Verify the pending changes with the relevant language checklist and the repository's existing checks.
---

# Eric Quality Control Checklist

Before committing:

- [ ] Review the pending diff and select the language checklists that apply.
- [ ] Run the repository's format, lint, type/compile, and relevant test commands, using the same checks as CI.
- [ ] Apply formatting and safe lint fixes; inspect unsafe fixes manually. Rerun affected checks after changing code.
- [ ] Check newly added diagnostic suppressions. Keep them only when the tool is wrong or a real constraint prevents a fix; scope them narrowly and explain why.
- [ ] Confirm required checks pass on the final code being committed. Report failed or unavailable checks explicitly.

Use the applicable `$eric-javascript-quality-control-checklist`, `$eric-rust-quality-control-checklist`, or `$eric-python-quality-control-checklist`. Use `$eric-writing-tests` to decide which behavior needs testing.
