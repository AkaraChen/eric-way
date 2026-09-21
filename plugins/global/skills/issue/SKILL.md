---
name: issue
description: Keep one outcome per issue and organize independently deliverable parts as sub-issues. Use when creating or splitting GitHub issues, linking or detaching sub-issues and dependencies with gh, or reading back issue hierarchy.
---

# Eric Working With Issue

- One issue, one outcome. Keep its implementation, tests, and docs together; put unrelated work in separate issues.
- Split by deliverable: use sub-issues for independently deliverable parts and checklists for ordinary steps. Dependencies do not imply parent-child relationships.

## Sub-issue operations

Requires `gh` 2.94.0+ and GitHub.com or GHES 3.17+ (relationships need 3.19+). Every argument below takes a number or a full issue URL.

```sh
# new issue straight under a parent
gh issue create --parent 100 --title "..." --body "..."

# attach an existing issue to a parent
gh issue edit 22 --parent 100

# add sub-issues from the parent's side; comma-separate to add several
gh issue edit 100 --add-sub-issue 22,23

# detach
gh issue edit 22 --remove-parent
gh issue edit 100 --remove-sub-issue 22
```

Keep hierarchy and dependency separate. Use the relationship flags for ordering instead of reparenting:

```sh
gh issue edit 22 --add-blocked-by 100   # 22 waits for 100
gh issue edit 100 --add-blocking 22
gh issue edit 22 --remove-blocked-by 100
gh issue edit 100 --remove-blocking 22
```

Confirm the link through the read model, not the command output:

```sh
gh issue view 100 --json subIssues --jq '.subIssues.nodes[].number'
gh issue view 22 --json parent --jq '.parent.number'
gh issue view 22 --json blockedBy --jq '.blockedBy.nodes[].number'
```
