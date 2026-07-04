#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
source_dir="$repo_root/skills"

if [[ ! -d "$source_dir" ]]; then
  echo "Missing skills directory: $source_dir" >&2
  exit 1
fi

targets=()
add_target() {
  local target="$1"
  local seen

  [[ -n "$target" ]] || return 0
  for seen in "${targets[@]}"; do
    [[ "$seen" == "$target" ]] && return 0
  done
  targets+=("$target")
}

add_target "${CODEX_HOME:-$HOME/.codex}/skills"
add_target "$HOME/.codex/skills"
add_target "${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills"
add_target "${CLAUDE_HOME:-$HOME/.claude}/skills"

source_real="$(cd "$source_dir" && pwd -P)"
installed=0

for target in "${targets[@]}"; do
  mkdir -p "$target"
  target_real="$(cd "$target" && pwd -P)"

  if [[ "$target_real" == "$source_real" ]]; then
    echo "Skipping source directory: $target"
    continue
  fi

  for skill in "$source_dir"/*; do
    [[ -d "$skill" ]] || continue

    name="$(basename "$skill")"
    tmp="$target/.${name}.tmp.$$"

    rm -rf "${tmp:?}"
    cp -R "$skill" "$tmp"
    rm -rf "${target:?}/$name"
    mv "$tmp" "$target/$name"
    echo "Installed $name -> $target/$name"
    installed=$((installed + 1))
  done
done

if [[ "$installed" -eq 0 ]]; then
  echo "No skills installed from $source_dir" >&2
  exit 1
fi
