# 07: home page crash hotfix, tracker

Decisions and deviations only. Branch `v0.4/07`, commits `3af7aa9`, `c592c33`, `6e93196`, merge `a2e9cab`. Two workflow runs: the first halted when the Radix bump alone did not stop the loop; a diagnosis agent found the real mechanism and the plan was amended (`69a58a0`). Second run: reviewer pass with two minor findings, gate agent green.

## Decisions

- The radix-ui 1.8.1 bump (`3af7aa9`) stays. The `SelectItemText` composed-ref loop in `@radix-ui/react-compose-refs` 1.1.3 was real but secondary: it is only where React first counted nested updates. Radix fixed it upstream in compose-refs 1.1.5 (release notes of June 30, 2026).
- The cause is the home demo, not the library. `components/dev-home/v12/signal-table.tsx` ran its replay edit effect with `table` in the dependency array while `useShadcnTable` returns a new table object every render and `useST_TableInstance` rebuilds the columns and cells every render, so `table.setEditingCell` ran on every commit until React's depth limit. The fix reads the latest `table` through a ref kept by a deps-free `useLayoutEffect` and depends on `editingRowId` only; a four-line comment records why the dependency must not come back. `useEffectEvent` was not used because the installed `@types/react` lacks it.
- Library source in both trees, the installed copies and the public API are unchanged. `ST_TableContainer`'s deps-free layout effect, where the error was thrown, is the same as MRT's twin and was left alone; a library-only guard would have hidden the demo bug while the passive loop kept running.
- The page check `demoLoop` in `scripts/page-checks/_helpers.mjs`, called by the `/` entry of `e.mjs`, holds the home page until "Now showing: Grouping" (at least 15 s, 30 s timeout) on Radix UI and then on Base UI picked through the command bar, and registers a renderer crash handler. It was proven red against production v0.3.0 and against a local build before the fix, and green after.
- The merge of `claude/review` (part 05's move to `apps/shadcn-table-docs`) was done on the branch as `a2e9cab` so the pull request runs CI; git followed the renames, no conflicts.

## Deviations

- The first diagnosis in the original plan text named the Radix loop as the cause; the amended 1.1 holds the verified mechanism.
- The crash happens with no click at all, about 9 s after loading the home page; the base switch the owner clicked was not the trigger.
- `check-pages.mjs a` fails on its first run after every server start on `/docs/api/row-instance-apis` (404 resource load from the `/docs/api/props` link in `content/docs/api/row-instance-apis.mdx`); reruns pass 269 of 269. Out of this part's scope; the link needs fixing or dropping in a follow-up so cluster a is deterministic.
- CI install and registry jobs run only on push to `claude/review`, so they are observed after the merge.
- Found for part 06: effects keyed on `table` or on a cell re-run every commit because of the new table object per render; the v9 rewrite should make the instance stable.

## Gate numbers

- `check-pages.mjs e /` after the fix, local `next start`: 21 passed, 0 failed; Radix held 17923 ms, Base UI 19530 ms, zero page and console errors, no crash.
- `check-pages.mjs e`: 595 passed, 0 failed. `a`: 269 passed, 0 failed on rerun.
- Library gates on the merged tree: `test` and `test:base` 400 of 400, `check:bases` 129 files, 23 allowed to differ; `registry:build` then `lib:install radix` and `lib:install base` leave `components/ui-radix` and `ui-base` unchanged.
- Lockfile: radix-ui 1.8.1, `@radix-ui/react-select` 2.4.1, `@radix-ui/react-compose-refs` 1.1.5 for both importers.
