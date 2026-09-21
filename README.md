# Eric Way

Code style notes and agent skills for Eric's preferred way of building software —
packaged as a plugin marketplace so a project only installs the skills it needs.

Twenty-four skills live in eleven plugins. `plugins.json` is the single source of
truth; every manifest in this repo is generated from it by
`node tools/sync-manifests.mjs`.

## Install

```sh
# Claude Code
/plugin marketplace add AkaraChen/eric-way
/plugin install frontend@eric-way

# Codex
codex plugin marketplace add AkaraChen/eric-way
codex plugin add frontend@eric-way

# Cursor (local directory)
cursor-agent --plugin-dir /path/to/eric-way/plugins/frontend
```

Plugin skills are namespaced by their plugin, so `eric-frontend` is now
`frontend@eric-way` and the skill itself is addressed as `frontend` inside it.

For a machine that cannot install plugins (opencode, amp, kimi), `install.sh`
mirrors `plugins/*/skills/*` into a plain skills directory:

```sh
./install.sh                                  # ~/.codex/skills and ~/.claude/skills
./install.sh --target ./project/.claude/skills
```

## Scenarios

Pick the row that matches the project and install exactly those plugins.

| Scenario | Plugins |
| --- | --- |
| TS/JS frontend | `project` + `js` + `frontend` |
| TS/JS backend service | `project` + `js` + `backend` |
| Tauri desktop app | `project` + `js` + `frontend` + `desktop` + `tauri` + `rust` |
| Electron desktop app | `project` + `js` + `frontend` + `desktop` + `electron` |
| Rust CLI or library | `project` + `rust` |
| Python script or service | `project` + `python` |
| Reviewing someone else's PR | `project` + `review` |

`global` is user-scoped: install it once and it applies everywhere.

`tauri` and `electron` are alternatives — install one, never both. Same for
`frontend` and `backend`.

### Per-project switching

**Claude Code** — `enabledPlugins` in the project's `.claude/settings.json`:

```jsonc
{
  "enabledPlugins": {
    "project@eric-way": true,
    "js@eric-way": true,
    "frontend@eric-way": true
  }
}
```

**Codex** — layer a scenario onto the base config with
`codex --profile <scenario>`, which reads `$CODEX_HOME/<scenario>.config.toml`:

```toml
# ~/.codex/frontend.config.toml
[plugins."project@eric-way"]
enabled = true
[plugins."js@eric-way"]
enabled = true
[plugins."frontend@eric-way"]
enabled = true
[plugins."backend@eric-way"]
enabled = false
```

## User-level — `global`

Install once, applies in every session.

- [repo](plugins/global/skills/repo/SKILL.md): Find the right repository before working — `~/Developer` first, then GitHub personal repos, then organization repos.
- [issue](plugins/global/skills/issue/SKILL.md): Keep one outcome per issue and organize independently deliverable parts as sub-issues.
- [opensource](plugins/global/skills/opensource/SKILL.md): Minimize maintainer disturbance when contributing to projects Eric does not lead.
- [grill](plugins/global/skills/grill/SKILL.md): Stress-test product, technical, and domain-modeling plans one question at a time.

## Project-level — `project`

Cross-language standards that apply to the project itself.

- [domain-modeling](plugins/project/skills/domain-modeling/SKILL.md): Model business states, legal transitions, ownership, and side-effect boundaries explicitly.
- [github-actions](plugins/project/skills/github-actions/SKILL.md): Check the source repo's latest stable release before choosing an external `uses:` version; lint changed workflows with actionlint.
- [writing-tests](plugins/project/skills/writing-tests/SKILL.md): Decide whether a test is worth writing, and choose unit vs integration coverage.
- [checklist](plugins/project/skills/checklist/SKILL.md): Run the repository's own checks on the exact code being committed.

## Language

- **`js`** — [javascript](plugins/js/skills/javascript/SKILL.md): default to Bun for new projects, Antfu's `ni` tools in existing ones. [js-checklist](plugins/js/skills/js-checklist/SKILL.md): formatting, lint, types, tests, and unused code for JS/TS changes.
- **`rust`** — [rust](plugins/rust/skills/rust/SKILL.md): data shapes, module structure, error handling, validation, generated contracts. [rust-checklist](plugins/rust/skills/rust-checklist/SKILL.md): fmt, check, Clippy, tests, dependency audits.
- **`python`** — [python-checklist](plugins/python/skills/python-checklist/SKILL.md): Ruff, type checking, pytest, dependency and security audits.

## Shape

- **`frontend`** — [frontend](plugins/frontend/skills/frontend/SKILL.md): feature-slice organization, styling boundaries, server-state and interaction-state ownership. [react](plugins/frontend/skills/react/SKILL.md): React and TSX component conventions. [e2e-testing](plugins/frontend/skills/e2e-testing/SKILL.md): browser end-to-end verification with screenshots and real interaction checks.
- **`backend`** — [backend](plugins/backend/skills/backend/SKILL.md): thin transport handlers, service/core ownership, DTO placement, bootstrap wiring. [node-backend-stack](plugins/backend/skills/node-backend-stack/SKILL.md): Hono, Drizzle, libsql, BullMQ.
- **`desktop`** — [desktop](plugins/desktop/skills/desktop/SKILL.md): local storage and migrations, cross-service contracts, renderer data, navigation, OS integration.
- **`tauri`** — [tauri](plugins/tauri/skills/tauri/SKILL.md): command responsiveness, async execution, blocking work, generated frontend contracts.
- **`electron`** — [electron](plugins/electron/skills/electron/SKILL.md): when to choose Electron, browser surfaces, Node integration, IPC.

## Action — `review`

- [review](plugins/review/skills/review/SKILL.md): concrete findings ordered by severity, implementation degradation, overengineering.
- [github-pr](plugins/review/skills/github-pr/SKILL.md): prepare a GitHub PR for review and manage changed-file viewed state.
- [guided-review](plugins/review/skills/guided-review/SKILL.md): Guided Review artifacts — reading order, line map, risk focus, and verification focus backed by code evidence.

## Docs

Longer notes referenced by the skills above:

- [Backend](docs/backend.md)
- [Desktop](docs/desktop.md)
- [Frontend](docs/frontend.md)
- [JavaScript](docs/javascript.md)
- [React](docs/react.md)
- [TanStack Query](docs/tanstack-query.md)
- [Rust](docs/rust.md)
- [Quality Control](docs/quality-control.md)
- [Project Creation](docs/project-creation.md)
- [Review](docs/review.md)
- [GitHub PR](docs/gh-pr.md)
- [GitHub PR viewed state](docs/gh-pr-viewed-state.md)
- [Testing](docs/testing/writing-test.md)
- [E2E Testing](docs/testing/e2e.md)
- [E2E Testing in Docker](docs/testing/e2e-docker.md)

## Related

`eric-design` (including `ui-audit`), `eric-ui`, and their vendored `design-dna`
dependency live in the sibling [`eric-design-skill`](https://github.com/AkaraChen/eric-design-skill)
repository. References to design skills in review and browser-testing guidance
point there.

The `review` plugin vendors [`guided-review`](https://github.com/AkaraChen/guided-review)
as a submodule.
