# 15: Only the active style's stylesheet loads, tracker

Status: running
Branch `v0.9/style-sheet-on-demand`, worktree 06
Checks:
- `pnpm test docs-e2e --base base /` at d2b4d0ae + Task 1 checks: fail as expected (P11), 5 failed: `sheet: one style link` ([]), `sheet: no style rules elsewhere` (.style-vega rules in the root bundle), `sheet: follows the Style select` (links=[]), `sheet: stored style at first paint` ([]), `perf: light/dark toggle` 318 ms; `perf: panel open` 246 ms passes
- Root stylesheet bytes before, `/` in `next dev` (port 5341), CSS `decodedBodySize` at d2b4d0ae: root chunk 2,761,408 B plus 52,399 B second chunk, total 2,813,807 B

- Task 1 Reproduce (sheet checks red on the shipped code, root stylesheet bytes before): planned
- Task 2 Dependency and scripts (@tailwindcss/node, build-styles.mjs, predev, build, .gitignore): planned
- Task 3 Layout, pre-paint script, provider, global.css: planned
- Task 4 Every page and the build (P9 line, bytes after): planned
- Task 5 Cleanup: planned

## Attention

- [Staging for the ATTENTION file, one bullet per item, self-explanatory first line.]

## Notes

- [Optional: only what a later task, a resume or the owner would otherwise rediscover.]
