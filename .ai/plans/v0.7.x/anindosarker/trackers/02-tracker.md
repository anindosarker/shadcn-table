# 02: lint parity, tracker

Status: running
Branch `v0.7/library-sweep`, worktree `library-sweep`, PR #72 (workstream S1, specs 02 to 07)
Gates:
- `pnpm --filter shadcn-table lint` at 8b493528: red by design (new config, 668 errors, 51 warnings) until the last set merges
- `pnpm --filter shadcn-table tsc:baseui`, `tsc:radix`, `tsc:aria` at d5e8abc7: green
- `pnpm --filter shadcn-table exec tsc -p tsconfig.stories.json` at ba367b60: green
- `pnpm check:bases` at d5e8abc7: green
- `pnpm --filter shadcn-table test:base`, `test:radix`, `test:aria` at ba367b60: green, 63 files, 448 tests each (`ColumnsHoldWhileResizing`, `ColumnsHoldWhileDragging` new)
- `ST_BASE=base vitest run` CustomFilterFns, Filtering, Sorting, Aggregation stories at d5e8abc7: green, 47 tests

- Milestone 01 config switch and baseline: done (8b493528)
- Lead step: 03 atoms (ba367b60), 05 registries and `getPlatform` (d5e8abc7); set worktrees `library-sweep-{a,b,c,d}` on `v0.7/library-sweep-{a,b,c,d}` cut at the lead head
- Set A: 90487682

Lint after the switch (`lint -f json` at 8b493528, 719 problems: library 691, stories 28, other 0)

| Rule | Library | Stories |
| --- | --- | --- |
| `@typescript-eslint/no-deprecated` | 158 | 0 |
| `react-hooks/refs` | 149 | 1 |
| `@typescript-eslint/no-explicit-any` | 105 | 0 |
| `@eslint-community/eslint-comments/require-description` | 82 | 0 |
| `react-hooks/immutability` | 44 | 24 |
| `react-hooks/exhaustive-deps` | 45 | 0 |
| `react-hooks/rules-of-hooks` | 42 | 0 |
| `react-hooks/use-memo` | 21 | 0 |
| `react-hooks/set-state-in-effect` | 12 | 3 |
| `react-hooks/preserve-manual-memoization` | 12 | 0 |
| `@typescript-eslint/no-unused-vars` | 9 | 0 |
| `react-hooks/incompatible-library` | 6 | 0 |
| `@typescript-eslint/no-unused-expressions` | 6 | 0 |

`no-deprecated` per base: `table.store` 44, `aggregationFns` 1, `filterFns` 1, `sortFns` 2, `navigator.platform` 2; aria also `onSelectionChange` 4 and `selectedKey` 4 (React Aria, see Attention).

Per file, problems per base (one number when the three bases agree, else base/radix/aria):

- Set A (456 over three bases): `useST_TableInstance` 47 (lead step), `filterFns` 21, `useST_ColumnVirtualizer` 13, `useST_TableOptions` 12, `useST_Effects` 11, `useST_RowVirtualizer` 8, `row.utils` 6, `cell.utils` 5, `tanstack.helpers` 5, `sortFns` 4, `useST_Rows` 3, `column.utils` 2, `utils` 2, `aggregationFns` 1, `pagination.utils` 1, `style.utils` 1, `ShadcnTable` 1, nine `st*Feature.ts` 1 each
- Set B (72): `ST_TableBodyCell` 5, `ST_TableBodyRow` 2, `ST_TableBodyRowPinButton` 2, `ST_TableDetailPanel` 2, `ST_TableFooter` 2, `ST_TableHead` 2, `ST_TableContainer` 2, `ST_TableBody` 1, `ST_TableBodyCellValue` 1, `ST_TableFooterCell` 1, `ST_TableHeadCell` 1, `ST_TableHeadCellResizeHandle` 1, `ST_TableHeadCellSortLabel` 1, `ST_TableLayout` 1
- Set C (163): `ST_FilterTextField` 7/7/13, `ST_ShowHideColumnsMenu` 8/7/7, `ST_FilterOptionMenu` 6/6/5, `ST_EditCellTextField` 3/3/5, `ST_EditActionButtons` 4, `ST_GlobalFilterTextField` 4, `ST_SelectCheckbox` 3/3/1, `ST_TablePagination` 1/1/3, `ST_ColumnActionMenu` 2/1/1, `ST_TopToolbar` 2, `ST_Tooltip` 0/0/2, `ST_RowActionMenu` 1/1/0, 1 each: `ST_ExpandAllButton`, `ST_ExpandButton`, `ST_ToggleGlobalFilterButton`, `ST_ToggleRowActionMenuButton`, `ST_FilterCheckbox`, `ST_FilterRangeSlider`, `ST_CellActionMenu`, `ST_EditRowModal`, `ST_BottomToolbar`, `ST_LinearProgressBar`, `ST_ToolbarAlertBanner`, `ST_ToolbarDropZone`
- Set D (28): `stories/features/Editing` 18, `Creating` 5, `ColumnGrouping` 1, `Filtering` 1, `Selection` 1, `stories/fixed-bugs/CallbackRefs` 2
- Outside the four sets: none (`types.ts`, `icons.ts`, `index.ts`, `.storybook`, `scripts` report nothing)

Expected `eslint-disable` lines per base after the sweep (`grep -rc "eslint-disable" ... | awk`): base 52, radix 52, aria 54; 51, 51, 53 once S3 drops the `icons.ts` line. Today 39, 39, 37.

| Lines | base, radix | aria |
| --- | --- | --- |
| 1.6.6 D19: per-line `@typescript-eslint/no-unused-vars` in the nine `st*Feature.ts` (3, 3, 4, 3, 4, 4, 2, 3, 4 reported lines) | 30 | 30 |
| 1.6.6 D19: `ShadcnTable.tsx` per-line `rules-of-hooks` (two reported lines) | 2 | 2 |
| 1.6.6 D7: `react-hooks/immutability` (`ST_TableBodyCell`, `ST_EditActionButtons`, `ST_EditCellTextField`, `ST_FilterTextField`; aria `comboboxAnchor` x2) | 4 | 6 |
| 1.6.6 D9: debounce memos `exhaustive-deps` (`ST_FilterTextField`, `ST_GlobalFilterTextField`) | 2 | 2 |
| 04 `keep` `no-explicit-any`: `types.ts` 5, `tanstack.helpers.ts:35` 1 (new, no disable today), `stConfigFeature.ts:367,378` 2 | 8 | 8 |
| existing reasoned `no-unused-vars` next-line in `stConfigFeature.ts:56,63` | 2 | 2 |
| existing reasoned `exhaustive-deps`: `ST_Table.tsx:68` (set B), `ST_FilterOptionMenu.tsx:170` (set C) | 2 | 2 |
| 05 `navigator.platform` fallback | 1 | 1 |
| `icons.ts:76` foundation disable (S3 removes) | 1 | 1 |

Rule for the sets: D12 effects list stable members and carry no disable; a set that keeps a reasoned D12 mount-only `[]` disable, or fixes the cause of one of the two existing `exhaustive-deps` lines, reports it and the lead adjusts this count at the merge.

Foundation: branch `v0.7/foundation`, worktree `foundation`, PR #70
- `pnpm --filter shadcn-table tsc:radix` at 4e76e415: green
- `pnpm --filter shadcn-table tsc:baseui` at 4e76e415: green
- `pnpm --filter shadcn-table tsc:aria` at 4e76e415: green
- `pnpm --filter shadcn-table lint` (old config) at 4e76e415: green, exit 0, 0 errors, 18 warnings (unused-directive on the six new `no-explicit-any` disables per base, the rule is off under the folded-core block until the S1 switch)
- `pnpm check:bases` at 4e76e415: green
- `pnpm install --frozen-lockfile` at 48c0e7e8: green, clean
- `pnpm --filter shadcn-table test:base` at 48c0e7e8: green, 63 files, 446 tests
- `pnpm --filter shadcn-table test:radix` at 48c0e7e8: green, 63 files, 446 tests
- `pnpm --filter shadcn-table test:aria` at 48c0e7e8: green, 63 files, 446 tests
- `pnpm --filter shadcn-table check:tailwind <base>` at 4e76e415: red as expected, 66 per base (base, radix, aria): 36 non-canonical sites, 22 distinct, plus 30 physical-direction sites; F13's 37th site was `getCommonToolbarStyles` (`style.utils.ts:183`), deleted in the foundation
- `pnpm check:icons` at 4e76e415: red as expected, 4 problems per base (the four `icons/<library>.ts` maps missing until S3), `icons.ts` 35 keys
- Baseline: `reference/02-lint-baseline.json` (old config at 48c0e7e8: 0 errors, 18 warnings, all unused-directive)

## Attention

- CHANGELOG blocks are `#### Spec NN` under `### Changed`, not `### Spec NN`: `scripts/release/next-version.mjs` throws on any `### ` heading outside Breaking, Removed, Added, Changed, Fixed, Docs, which fails the `release impact` job and the release version PR. Each block keeps its lines with the category as leading label; regroup into the standard headings before the release, or teach the release scripts the blocks.
- `packages/shadcn-table/eslint.config.js` changed in the foundation: plugin 7 has no flat `recommended-latest`, so `lint` crashed after the bump; the first block now registers the plugin and names the two plugin 5 rules (`rules-of-hooks` error, `exhaustive-deps` warn). Same rule set, no React Compiler rules; S1's switch replaces it.
- `pr.yml` `registry` job waits for `http://localhost:5310/r/shadcn-table-base-core.json` and dry-runs the tabler edition and the example items from the dev registry, and `install.yml` adds `example-basic-<base>` from it, as spec 11 1.6.5 writes; the core, edition and dev example items exist only after S3 (`lib.mjs`, `build.mjs --dev`). Until S3 merges, the `registry` and `install` jobs are red on every PR, this one included.
- `icons.ts` gains `IndeterminateIcon: Minus` in the Lucide map (so the default map fills the new `ST_Icons` keys) and `ST_TablePagination.tsx` types its icons `ComponentType<ST_IconProps>` instead of `LucideIcon` (the type change broke `tsc` there); both are S3 or set C files, edited before those workstreams start.
- `useST_MenuAnchor` already carries the re-measure listeners and the second-click `toggle` (the Run plan foundation item), not only the interface the D26 addendum names; spec 10 wires the openers and adjusts behaviour if needed.
- S1 lead: aria `Select` `selectedKey` and `onSelectionChange` are deprecated in `react-aria-components` 1.22.1 (`value`, `onChange` replace them): 8 `no-deprecated` hits in aria `ST_EditCellTextField` (2), `ST_FilterTextField` (4), `ST_TablePagination` (2), outside the D11 and D13 lists. `lint` 0 needs them gone, so set C migrates them to `value` and `onChange` with the same selection behaviour, no disable. Revert means a reasoned disable per line and +8 on the aria expected count.
- S1 lead: the expected `eslint-disable` count uses 04's eight `no-explicit-any` keep lines (`types.ts` 5, `tanstack.helpers.ts:35`, `stConfigFeature.ts` 2), not the "five 04 keep lines" of 02 2.1.1, and keeps the reasoned `stConfigFeature.ts:56,63` `no-unused-vars` lines and the reasoned `exhaustive-deps` lines at `ST_Table.tsx:68` and `ST_FilterOptionMenu.tsx:170` (D12: adding `table` would recompute per render, or the read is once per mount by design).
- S1 lead: the harness gave no `Claude-Session:` line for this session, so the S1 lead commits and the PR #72 body carry none.
- Set A: `react-hooks/incompatible-library` still reports `useVirtualizer` in `useST_RowVirtualizer` and `useST_ColumnVirtualizer` (2 per base, 6 in all) with `'use no memo'` first in the body or at module level: plugin 7.1.1 logs the compile error for opted-out functions too, and the rule reports it. Left as is per 02 2.1.2 (Blocked), so `lint` stays red on these 6. Fix at the merge: one `// eslint-disable-next-line react-hooks/incompatible-library -- useVirtualizer returns mutable functions; the hook opts out with 'use no memo'` per hook, expected count +2 per base (base 54, radix 54, aria 56).
- Set A: Tailwind 4.3.3 canonicalizes `start-0` to `inset-s-0`, so `check:tailwind` fails on D31's `start-*`; `style.utils.ts` uses `data-[pinned=true]:before:inset-s-0` (same CSS, logical). Sets B and C will meet the same on their `start-0` and `end-0` sites.
- Set A: `useST_Rows` no longer memoizes the rows: a memo on `getST_Rows(table)` with the slices as dependencies fails `exhaustive-deps` (unnecessary dependencies), and with `table` alone it would go stale when the body re-renders from a subscription. The ten slice subscriptions stay, the rows are read on each body render; `ST_TableBodyRow` is not memoized, so the re-render set is unchanged (RenderCounts green). Revert means a reasoned `exhaustive-deps` disable on the memo list, +1 per base.
- Set A: the virtualizer hooks call every hook unconditionally (D4), so their `useSelector` calls select a constant while virtualization is off; without that a density change re-rendered every body cell (RenderCounts `Profiled Thousand Rows`).
