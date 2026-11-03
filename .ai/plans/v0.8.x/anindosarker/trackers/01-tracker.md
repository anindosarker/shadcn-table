# 01: shared surface, tracker

Status: running
Branch `v0.8/shared-surface`, worktree 01, PR #[n]
Gates:
- `pnpm tsc:radix`, `tsc:baseui`, `tsc:aria` after the lucide-react bump at [m1]: green

- Milestone 01 dependency, captures and changelog: running
- Milestone 02 types, options, slices, helpers, icons, strings: planned
- Milestone 03 cleanup and gates once: planned

## Attention

## Notes

- lucide-react `^1.64.0` resolves to 1.67.0; no alias in `icons.ts` was renamed (tsc green in all three bases without an edit).
