# 15: Only the active style's stylesheet loads, tracker

Status: running
Branch `v0.9/style-sheet-on-demand`, worktree 06
Checks:
- `pnpm test docs-e2e --base base /` at d2b4d0ae + Task 1 checks: fail as expected (P11), 5 failed: `sheet: one style link` ([]), `sheet: no style rules elsewhere` (.style-vega rules in the root bundle), `sheet: follows the Style select` (links=[]), `sheet: stored style at first paint` ([]), `perf: light/dark toggle` 318 ms; `perf: panel open` 246 ms passes
- Root stylesheet bytes before, `/` in `next dev` (port 5341), CSS `decodedBodySize` at d2b4d0ae: root chunk 2,761,408 B plus 52,399 B second chunk, total 2,813,807 B
- `pnpm install --frozen-lockfile` after the Task 2 dependency add: pass, clean (lockfile diff is the 3-line importer entry; a plain `pnpm install` also re-resolved unrelated @emnapi peers, not kept)
- `node lib/build-styles.mjs` (docs app) at Task 2 files: pass, eight files in public/styles/, 300 to 322 KB each unminified, 4 s
- nova rule compare, public/styles/style-nova.css against the shipped `next dev` root chunk at d2b4d0ae: match, 1255 `.style-nova ... .cn-*` selectors in each and every selector's declaration set equal once the `var(--x, fallback)` fallbacks `@reference` inlines are dropped; raw `grep -c '\.cn-'` is 1464 against 1586 because Lightning CSS in the build script merges adjacent same-selector blocks that the root pipeline keeps apart
- `eslint lib/build-styles.mjs` (docs app): pass

- Task 1 Reproduce (sheet checks red on the shipped code, root stylesheet bytes before): planned
- Task 2 Dependency and scripts (@tailwindcss/node, build-styles.mjs, predev, build, .gitignore): planned
- Task 3 Layout, pre-paint script, provider, global.css: planned
- Task 4 Every page and the build (P9 line, bytes after): planned
- Task 5 Cleanup: planned

## Attention

- [Staging for the ATTENTION file, one bullet per item, self-explanatory first line.]

## Notes

- [Optional: only what a later task, a resume or the owner would otherwise rediscover.]
