---
name: eric-working-with-issue
description: Apply Eric's issue workflow when creating, scoping, splitting, or executing issues. Keep one outcome per issue and use sub-issues for hierarchical work.
---

# Eric Working With Issue

One issue does one thing. Scope it around one concrete outcome that can be understood, reviewed, and closed on its own.

## Choose The Boundary

- Read the issue and relevant discussion before changing its scope or starting work. Search existing issues before creating overlapping work.
- Keep implementation, focused tests, and documentation for the same outcome together. One issue does not mean one file, commit, or coding step.
- Split unrelated outcomes into separate issues, even when they touch the same code. Do not grow the current issue with incidental cleanup or discoveries.
- Give each issue a specific title and enough context to act: the problem, intended outcome, and known constraints. Preserve uncertainty instead of inventing requirements.

## Use Sub-Issues For Hierarchy

- When one outcome contains several independently deliverable parts, use a parent issue for the overall outcome and sub-issues for those parts. Nest further only when a child actually contains another level of work.
- Keep the parent focused on the shared goal, constraints, and completion condition. Put each child's actionable scope in that child; link shared context instead of maintaining duplicate plans.
- Keep ordinary implementation steps as a checklist inside the issue. Do not turn every small step into another issue.
- Distinguish hierarchy from dependency: a sub-issue is part of its parent's outcome; an issue that merely must finish first is a dependency. Record the dependency without inventing a parent-child relationship.
- Let independent children proceed together; start dependent work only when its prerequisites are ready. Use the tracker’s supported relationships and scheduling controls.
- Close a parent only when its required children and any parent-level integration are complete. If scope is dropped, record that decision rather than implying it shipped.

For example, “Add CSV export” can include implementation, tests, and usage documentation in one issue. If it requires separately deliverable export API and UI work, make those sub-issues under the export outcome. An unrelated login fix belongs in its own issue.

## Keep Execution Aligned

Work toward the issue's stated outcome. Record a newly discovered blocker or follow-up in the appropriate issue within the user's authorized scope, and link it where it affects completion. Report what was delivered, relevant verification, and remaining blockers before updating the status to match reality.

Use the current platform's tools and workflow for tracker operations. This skill defines scope and relationships; it does not grant permission to create, assign, notify, or publish beyond the user's request.
