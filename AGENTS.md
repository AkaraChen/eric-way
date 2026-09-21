# Agent Notes

- Skill sources live in `plugins/<plugin>/skills/<skill>/`. That is the canonical
  copy. There is no longer a global skills directory to keep in sync — hosts read
  the installed plugin cache instead.
- Manifests are **generated** from `plugins.json`. Edit `plugins.json`, then run
  `node tools/sync-manifests.mjs`. Never hand-edit a generated file:
  - `plugins/<plugin>/plugin.json`
  - `plugins/<plugin>/.claude-plugin/plugin.json`
  - `plugins/<plugin>/.codex-plugin/plugin.json`
  - `plugins/<plugin>/agents/openai.yaml`
  - `.claude-plugin/marketplace.json`
  - `.agents/plugins/marketplace.json`

  Run `node tools/sync-manifests.mjs --check` before committing; it fails when a
  manifest is stale and also validates that each plugin's declared skills exist,
  that every `SKILL.md` frontmatter `name:` matches its directory, and that every
  scenario names plugins that exist.
- When a skill needs a file that already lives elsewhere in this repo (e.g.
  `docs/`), add a **relative** symlink under the skill's `references/` instead of
  copying the file. `install.sh` dereferences symlinks (`cp -RL`) at install time,
  so mirrored skills stay self-contained. Relative symlinks must be re-pointed
  when a skill changes directory depth.
- Cross-plugin skill references are written as prose (`the \`js\` plugin's
  \`javascript\``). `$skill-name` is only used for skills inside the same plugin,
  because hosts address plugin skills differently (Claude Code namespaces them,
  Codex uses `$name`).
- `tauri` / `electron` and `frontend` / `backend` are pick-one pairs. A project
  installs one of each, never both.
- Version bumps happen in `plugins.json` only; re-run the generator afterwards.
