#!/bin/sh
# Robust, PEP-668-safe runner for scaffolding a new lenguados monorepo package.
#
# Invoked by `npm run tools:create-package`. Reads the cookiecutter version
# constraint from requirements.txt (the single source of truth), then runs
# cookiecutter in an isolated runner so a system `pip install` is never needed:
#   1. `pipx run`  -- ephemeral isolated venv (PEP-668-immune)
#   2. `uvx`       -- uv's ephemeral runner (PEP-668-immune)
#   3. global `cookiecutter` on PATH -- uses whatever is installed (no pin)
# If none is available it prints actionable install instructions and exits 1,
# rather than emitting a cryptic Python / PEP 668 error.
#
# Behavior is preserved exactly: every branch forwards the original cookiecutter
# arguments (the tools/package template, --overwrite-if-exists, and the
# packages/ output dir). Paths are resolved from this script's own location so
# the command is correct regardless of the caller's working directory.
set -eu

# Resolve this script's real path through any symlinks (portable; no `readlink -f`),
# so SCRIPT_DIR/REPO_ROOT are correct even when invoked via a symlink.
src=$0
while [ -h "$src" ]; do
  dir=$(CDPATH= cd -- "$(dirname -- "$src")" && pwd)
  src=$(readlink -- "$src")
  case $src in
    /*) ;;
    *) src="$dir/$src" ;;
  esac
done
SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$src")" && pwd)
REPO_ROOT=$(CDPATH= cd -- "$SCRIPT_DIR/.." && pwd)
REQ="$REPO_ROOT/requirements.txt"

# Read the cookiecutter pin from requirements.txt (sole source of truth):
# skip full-comment lines, take the first cookiecutter entry, drop any inline
# comment and all whitespace -> e.g. "cookiecutter>=2.6.0,<3".
PIN=cookiecutter
if [ -f "$REQ" ]; then
  found=$(grep -v '^[[:space:]]*#' "$REQ" | grep cookiecutter | head -n 1 | sed 's/#.*//' | tr -d '[:space:]' || true)
  if [ -n "$found" ]; then
    PIN="$found"
  else
    printf 'warning: no cookiecutter pin found in %s; using latest (unpinned)\n' "$REQ" >&2
  fi
else
  printf 'warning: %s not found; using latest cookiecutter (unpinned)\n' "$REQ" >&2
fi

# Cookiecutter arguments (absolute paths so the invocation is CWD-independent).
# --overwrite-if-exists is deliberately NOT passed: cookiecutter's default is to
# refuse when packages/<name>/ already exists, which prevents silently clobbering
# an existing package. Delete or rename the target directory to regenerate.
set -- "$REPO_ROOT/tools/package" --output-dir "$REPO_ROOT/packages"

if command -v pipx >/dev/null 2>&1; then
  exec pipx run --spec "$PIN" cookiecutter "$@"
elif command -v uvx >/dev/null 2>&1; then
  exec uvx --from "$PIN" cookiecutter "$@"
elif command -v cookiecutter >/dev/null 2>&1; then
  exec cookiecutter "$@"
fi

cat >&2 <<'EOF'
error: no cookiecutter runner found.

Scaffolding a new package needs cookiecutter, run via an isolated Python
runner -- never `pip install` into system Python (it fails under PEP 668).

Install one of:
  pipx:  python3 -m pip install --user pipx && python3 -m pipx ensurepath
  uv:    https://docs.astral.sh/uv/   (provides `uvx`)

Then re-run:  npm run tools:create-package
The cookiecutter version is pinned in requirements.txt.
EOF
exit 1
