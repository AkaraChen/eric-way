#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
source_dir="$repo_root/skills"

usage() {
  cat <<'EOF'
Usage: ./install.sh [--target DIR]...

Without --target:
  Codex: ${CODEX_HOME:-$HOME/.codex}/skills
  Claude Code: ${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills

Pass --target more than once to install into explicit skills directories.
Example: ./install.sh --target ./project/.codex/skills --target ./project/.claude/skills
EOF
}

die() {
  echo "$*" >&2
  exit 1
}

if [[ ! -d "$source_dir" ]]; then
  die "Missing skills directory: $source_dir"
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

while [[ "$#" -gt 0 ]]; do
  case "$1" in
    --target)
      [[ "$#" -ge 2 ]] || die "--target requires a directory"
      add_target "$2"
      shift 2
      ;;
    --target=*)
      target="${1#*=}"
      [[ -n "$target" ]] || die "--target requires a directory"
      add_target "$target"
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      usage >&2
      die "Unknown argument: $1"
      ;;
  esac
done

if [[ "${#targets[@]}" -eq 0 ]]; then
  add_target "${CODEX_HOME:-$HOME/.codex}/skills"
  add_target "${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills"
fi

source_real="$(cd "$source_dir" && pwd -P)"
installed=0

safe_target_real() {
  local target="$1"
  local target_name parent parent_real target_path target_real

  target_name="$(basename "$target")"
  [[ "$target_name" == "skills" ]] || die "Refusing unsafe target (must end with /skills): $target"

  parent="$(dirname "$target")"
  mkdir -p "$parent"
  parent_real="$(cd "$parent" && pwd -P)"
  [[ "$parent_real" != "/" ]] || die "Refusing unsafe target under filesystem root: $target"

  target_path="$parent_real/$target_name"
  mkdir -p "$target_path"
  target_real="$(cd "$target_path" && pwd -P)"

  [[ "$(basename "$target_real")" == "skills" ]] || die "Refusing unsafe target (resolved path is not /skills): $target"
  [[ "$target_real" != "$source_real" ]] || die "Refusing to install into source directory: $target"
  [[ "$target_real" != "$repo_root" ]] || die "Refusing to install into repo root: $target"
  [[ "$target_real" != "$HOME" ]] || die "Refusing to install into HOME: $target"
  [[ "$target_real" != "$HOME/skills" ]] || die "Refusing to install into HOME/skills: $target"
  [[ "$target_real" != "/skills" ]] || die "Refusing to install into /skills"

  printf '%s\n' "$target_real"
}

resolved_targets=()
add_resolved_target() {
  local target="$1"
  local seen

  for seen in "${resolved_targets[@]}"; do
    [[ "$seen" == "$target" ]] && return 0
  done
  resolved_targets+=("$target")
}

for target in "${targets[@]}"; do
  add_resolved_target "$(safe_target_real "$target")"
done

for target in "${resolved_targets[@]}"; do
  for skill in "$source_dir"/*; do
    [[ -f "$skill/SKILL.md" ]] || continue

    name="$(basename "$skill")"
    [[ -n "$name" && "$name" != "." && "$name" != ".." ]] || die "Refusing unsafe skill name: $name"

    tmp="$target/.${name}.tmp.$$"

    rm -rf "${tmp:?}"
    cp -R "$skill" "$tmp"
    rm -rf -- "${target:?}/$name"
    mv "$tmp" "$target/$name"
    echo "Installed $name -> $target/$name"
    installed=$((installed + 1))
  done
done

if [[ "$installed" -eq 0 ]]; then
  die "No skills installed from $source_dir"
fi
