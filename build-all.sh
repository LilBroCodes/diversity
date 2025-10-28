#!/usr/bin/env zsh
set -euo pipefail

VERBOSE_OPT=""
declare -a EXTRA_ARGS=()

# parse short options (-v) and allow passing --verbose explicitly or extra args after --
while (( "$#" )); do
  case "$1" in
    -v) VERBOSE_OPT="--verbose"; shift ;;
    --verbose) VERBOSE_OPT="--verbose"; shift ;;
    --) shift; EXTRA_ARGS=("$@"); break ;;
    *) EXTRA_ARGS+=("$1"); shift ;;
  esac
done

run_hydra() {
  local dir=$1; shift
  echo "==> $dir: running hydra extension --build ${VERBOSE_OPT} $*"
  cd "$dir"
  local args=(build)
  [[ -n $VERBOSE_OPT ]] && args+=("$VERBOSE_OPT")
  args+=("$@")
  hydra "${args[@]}"
  cd - >/dev/null
}

run_hydra logiscool "${EXTRA_ARGS[@]}"
run_hydra scoolcode "${EXTRA_ARGS[@]}"
