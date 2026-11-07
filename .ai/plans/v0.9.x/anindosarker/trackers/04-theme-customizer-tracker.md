# 04: Theme customizer, tracker

Status: running
Branch `v0.9/theme-customizer`, worktree 03
Checks:
- Check: red, `pnpm test docs-e2e --base base /` at 546bcabd (shipped code plus the new checks): fail as expected, 7 failed: default look (no design system style element), stale choice (entry not removed), panel (no Customize theme button), r, p, Shift+R (no shortcut), token edit (no panel)

- Task 1 Reproduce (docs E2E theme checks red on the shipped code): done
- Task 2 Dependencies (react-hotkeys, sheet part): planned
- Task 3 Core and provider: planned
- Task 4 Panel, controls, layout, demo: planned
- Task 5 Cleanup: planned

## Attention


## Notes

- The shipped build computes `--primary` as `lab(...)` (Lightning CSS rewrites oklch in compiled CSS); the design system's inline style element keeps the `oklch(...)` strings the checks compare.
