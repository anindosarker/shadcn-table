# 15: Only the active style's stylesheet loads, tracker

Status: done
Branch `v0.9/style-sheet-on-demand`, worktree 06
Checks:
- `pnpm test docs-e2e --base base /` at d2b4d0ae + Task 1 checks: fail as expected (P11), 5 failed: `sheet: one style link` ([]), `sheet: no style rules elsewhere` (.style-vega rules in the root bundle), `sheet: follows the Style select` (links=[]), `sheet: stored style at first paint` ([]), `perf: light/dark toggle` 318 ms; `perf: panel open` 246 ms passes
- Root stylesheet bytes before, `/` in `next dev` (port 5341), CSS `decodedBodySize` at d2b4d0ae: root chunk 2,761,408 B plus 52,399 B second chunk, total 2,813,807 B
- `pnpm install --frozen-lockfile` after the Task 2 dependency add: pass, clean (lockfile diff is the 3-line importer entry; a plain `pnpm install` also re-resolved unrelated @emnapi peers, not kept)
- `node lib/build-styles.mjs` (docs app) at Task 2 files: pass, eight files in public/styles/, 300 to 322 KB each unminified, 4 s
- nova rule compare, public/styles/style-nova.css against the shipped `next dev` root chunk at d2b4d0ae: match, 1255 `.style-nova ... .cn-*` selectors in each and every selector's declaration set equal once the `var(--x, fallback)` fallbacks `@reference` inlines are dropped; raw `grep -c '\.cn-'` is 1464 against 1586 because Lightning CSS in the build script merges adjacent same-selector blocks that the root pipeline keeps apart
- `eslint lib/build-styles.mjs` (docs app): pass
- `pnpm --filter shadcn-table-docs types:check` at Task 3 files: pass
- `eslint` on layout.tsx, config.ts, design-system-provider.tsx, build-styles.mjs: pass
- `pnpm test docs-e2e --base base /` with the 1.6.3 layout as specified (server-rendered default link, script swaps it): fail, `sheet: stored style at first paint` (two links) and `no hydration / React errors` (Minified React error #418): React 19 matches a <head> link by href while hydrating, so the swapped link fails hydration and the client render adds the default link back
- `pnpm test docs-e2e --base base /` at Task 3 files (the script creates the one link): pass, 79 passed; `perf: panel open` 92 ms, `perf: light/dark toggle` 113 ms
- Root stylesheet bytes after, `/` in `next dev` (port 5341), CSS `decodedBodySize` at 61fc16d2: root chunk 337,228 B plus the same 52,399 B second chunk; the one active sheet `/styles/style-nova.css` is 315,935 B unminified (file size; the entry read 0 from cache). Root 337 KB against the 351 KB baseline, root plus the active sheet 653 KB against 667 KB (351 + 316): within 10 percent (D29). No console errors in `next dev`
- `pnpm test docs-e2e --base base` at 61fc16d2 + P9 line: pass, 4 sections, 107 pages, 0 failed; `perf: panel open` 90 ms, `perf: light/dark toggle` 124 ms. Its build step is `pnpm --filter shadcn-table-docs build` (build-styles --minify: 258 to 277 KB per sheet, next build compiled): pass
- `pnpm format` at 96ea0c48: no change beyond the changelog block
- `pnpm test typecheck --base radix` at 96ea0c48: pass, tsc clean
- `pnpm test lint` at 96ea0c48: pass (9 warnings, 0 errors, none in this milestone's files)
- `pnpm test validate-repo` at 96ea0c48: pass
- `pnpm install --frozen-lockfile` at 96ea0c48: pass, clean
- The docs-e2e and docs build lines at 61fc16d2 + P9 line stand: the commits after it touch only CHANGELOG.md and plan files
- Verifier at 1768570c: no rerun. typecheck, lint, validate-repo, install --frozen-lockfile recorded at 96ea0c48 (diff to HEAD: tracker only); docs build and `docs-e2e --base base` (every page, sheet and perf checks) recorded at 49fd03b3 (diff to HEAD: tracker and CHANGELOG.md); Acceptance (1.2) lines all recorded: red first (P11), bytes before and after within 10 percent. Review: fable is the reviewer's, not run here

- Task 1 Reproduce (sheet checks red on the shipped code, root stylesheet bytes before): done, a3c070b6
- Task 2 Dependency and scripts (@tailwindcss/node, build-styles.mjs, predev, build, .gitignore): done, ef231f8c
- Task 3 Layout, pre-paint script, provider, global.css: done, 61fc16d2
- Task 4 Every page and the build (P9 line, bytes after): done, 49fd03b3
- Task 5 Cleanup: done, 96ea0c48

## Attention

- The style sheet link is created by the pre-paint script, not rendered by app/layout.tsx (spec 1.6.3 deviation). Measured: with the server-rendered default link swapped by the script, `/` with a stored style failed hydration (React error #418, React 19 matches <head> links by href) and ended with two style links. The script now appends the one link (`blocking="render"`) for the stored or default style, as it already does for the theme style element; no link without JavaScript, like the theme tokens. Revert means a different hydration-safe swap.

## Notes

- build-styles.mjs runs every sheet through `optimize()` (minify only with `--minify`), so dev sheets are flattened like the root bundle; the entry also states the root layer order (`theme, base, components, utilities`) so a sheet parsed first does not reorder the layers.
- `@reference` inlines theme fallbacks (`var(--spacing, .25rem)`); the values are the root's own, so rendering is unchanged.
