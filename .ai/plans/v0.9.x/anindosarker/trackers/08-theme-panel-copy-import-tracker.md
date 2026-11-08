# 08: Copy and Import leave the theme panel, tracker

Status: done
Branch `v0.9/theme-panel-copy-import`, worktree 04
Checks:
- `pnpm test docs-e2e --base base /` at 9886cc07 plus the Task 1 assertion (shipped code, P11): fail as intended, "FAIL / @1440 theme: the palette button opens the panel heading=1 tabs=Colors,Typography,Other copyImport=2"; every other check pass (62 passed)
- `pnpm --filter shadcn-table-docs types:check` at 7e907a9a: pass
- `pnpm --filter shadcn-table-docs lint` at 7e907a9a: pass (0 errors, 9 warnings, none in owned files)
- `pnpm format` at 6ca4e6ab: no changes
- `pnpm test typecheck --base radix` at 6ca4e6ab: pass (tsc clean)
- `pnpm test lint` at 6ca4e6ab: pass (0 errors, 9 warnings)
- `pnpm test docs-e2e --base base /` at 6ca4e6ab: pass (63 passed, 0 failed; panel check copyImport=0)
- `grep -rn "encodeConfig\|decodeConfig\|importPreset\|CopyMenu\|ImportPreset" apps/shadcn-table-docs` at 6ca4e6ab: prints nothing
- Verifier at 68ed1ff8: every 2.2 check and the 1.2 Acceptance lines are recorded at 6ca4e6ab; `git diff --name-only 6ca4e6ab..68ed1ff8` touches only `.ai/`, so none rerun; all green

- Task 1 Reproduce: done (51aef72e)
- Task 2 Remove Copy, Import and the codec: done (7e907a9a)
- Task 3 Cleanup: done (6ca4e6ab)

## Attention

- `shuffleConfig` (Random, which stays per D21) used `encodeConfig` and `decodeConfig` for its curated presets, a use 1.1 missed ("nothing else reads or writes a preset code"). Random keeps its behavior: a private `curatedPreset` decodes the curated codes with `decodePreset` (kept as an import; `encodePreset`, `isPresetCode`, `V1_CHART_COLOR_MAP` removed, every curated code is V2 with a chartColor) and a private `sameLook` field compare replaces the code compare. Revert option: drop `SHUFFLE_PRESETS` and shuffle by `randomFields` only, which also drops `decodePreset`.
