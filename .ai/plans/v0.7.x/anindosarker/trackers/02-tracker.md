# 02: lint parity, tracker

Status: running
Branch `v0.7/library-sweep`, worktree `library-sweep`, PR #72 (workstream S1, specs 02 to 07)
Gates:
- Verifier (spec 02 to 07 verify agent) at 2172c9a0; `git diff --name-only c06bd679..2172c9a0` touches only `.ai/`, so every c06bd679 line below stays valid and was not rerun (tsc stories, scratch stories config, `check:bases`, `test:base`, `test:radix`, `test:aria`, docs `types:check`, `lint`, `build`, computed-style spot check):
- 02 Acceptance (verifier) at 2172c9a0: `pnpm --filter shadcn-table lint` exit 0; `grep -rc "eslint-disable" ... | awk` base 54, radix 54, aria 56, equal to the expected count
- 03 Acceptance (verifier) at 2172c9a0: `eslint --rule '{"react-hooks/refs":"error"}'` on `useST_TableInstance.ts` exit 0 in base, radix, aria; `grep -nE "tableRef|columnDefsRef|table\.store"` empty; the three copies diff empty
- 04 Acceptance (verifier) at 2172c9a0: `eslint --rule '{"@typescript-eslint/no-explicit-any":"error"}' registry/<base>/components/ui/shadcn-table` exit 0 per base; `no-explicit-any` count 9 per base (8 plus the `icons.ts` foundation line, this branch predates the S3 merge)
- 05 Acceptance (verifier) at 2172c9a0: `grep -rn 'table.store'` over the registry, stories, docs examples and `row-pinning.mdx` empty; `lint` exit 0 with `no-deprecated` on; `grep -rn 'navigator.platform'` one line per base
- 06 Acceptance (verifier) at 2172c9a0: `pnpm check:tailwind` exit 0 (base 1215, radix 1187, aria 1193 candidates, 0 not canonical or physical); `grep -rn "rgba("` over the three registries empty
- 06 judged captures (verifier) at 2172c9a0: `reference/06-capture.mjs` per base from Storybook dev on ports 5353 (base), 5354 (radix), 5355 (aria), run concurrently; 30 captures in the session scratchpad `v07-verify/cap/`, not in the repo. Pixel comparison against `reference/06-*`: `resize-handle` identical (0 px) in the three bases and both themes; `ltr` same layout, only the bottom toolbar top shadow differs (the 1 px line under the border, light 245 against 234, dark 18 against 21, and the 1 px side edges); `pinned-columns` end edge at the same x (738), start edge moves with the faker column width, edge gradient lighter (light peak 240 against 223, dark 23 against 26); `header-shadows` light identical on the sticky edge, dark gains a faint 5 px band under the header (16 to 11 over 10) the baseline lacks; `toolbar` and the rest of `header-shadows` and `pinned-columns` differ in faker rows and row heights. Verdict (one reader, pixel level): same position everywhere; shadows present at every baseline site, lighter in light mode and a new faint header band in dark, the intensity of the spec 06 1.6 `color-mix(... var(--foreground) 15%|10%, transparent)` replacements. Three judges pending in the main session
- 07 Acceptance (verifier) at 2172c9a0: `grep -rniE 'MUI|MRT|material-react-table|@mui|upstream|edition|forkedUi|getCommonToolbarStyles' --exclude=icons.ts --exclude-dir=icons` empty; `tsc:radix`, `tsc:baseui`, `tsc:aria` exit 0; 07 2.2 second grep (`tree-neutral (ST_NeutralPartPropTypes)|so they are hook subscriptions|The live store|getCommonToolbarStyles` over `registry` and docs `components`) empty
- `pnpm registry:build` (verifier) at 2172c9a0: green, tree clean after (`registry.json` unchanged, 06 2.2)
- `pr.yml` on PR #72 (CI, read by the verifier): red at 2d17f033 (run 41192997375): `library` lint fails in the three matrix entries on the merge ref with `claude/review`, 6 errors each: S3's `icons/hugeicons.ts:47` `'_children' is defined but never used` (`no-unused-vars`) and `icons/remixicon.ts:94` `LayoutThreeColumnIcon` deprecated (`no-deprecated`), per base; run 41193474990 at 2172c9a0 in progress with the same three `library` jobs failed at the lint step; `bases`, `install` x5, `registry`, `release impact`, `test (base)` green
- Review fixes at c06bd679 (radio props cec2e5cc, range slider note c06bd679, docs copies regenerated with `registry:build` and `lib:install base`, `radix`, `aria`):
- `pnpm --filter shadcn-table tsc:baseui`, `tsc:radix`, `tsc:aria` at c06bd679: green
- `pnpm --filter shadcn-table lint` at c06bd679: green, exit 0, 0 problems
- `pnpm --filter shadcn-table exec tsc -p tsconfig.stories.json` at c06bd679: green
- 04 2.1.2 scratch `tsconfig.stories.base.json` (extends `tsconfig.baseui.json`, `registry/base`, `stories`, `.storybook`, `vite/client` and `node` types) `tsc -p` at c06bd679: green; file deleted, not committed
- `pnpm check:bases` at c06bd679: green (145 library files, 24 and 38 allowed to differ; 216 example files, 2 and 10)
- `pnpm check:tailwind` at c06bd679: green, 0 not canonical or physical in base (1215), radix (1187), aria (1193); `grep -rn "rgba("` over the three registries: empty
- `pnpm --filter shadcn-table test:base` (port 5341), `test:radix` (5344), `test:aria` (5347) at c06bd679: green, 64 files, 453 tests each
- `pnpm --filter shadcn-table-docs types:check` at c06bd679: green; `lint`: exit 0, 0 errors, 9 warnings (same 9 as at 27ad7a70); `build`: green, tree clean after
- 06 judged at c06bd679: `reference/06-capture.mjs` per base from Storybook dev (ports 5350 to 5352), 30 captures next to the 30 `reference/06-*` files: `resize-handle` and `ltr` pixel-identical in all three bases and both themes (12 files); `pinned-columns`, `toolbar`, `header-shadows` differ only in the faker row data and the row heights it wraps to, pinned-edge shadows, toolbar edges and the sticky-header shadow in the same position with the same visible shadow; verdict same (one judge, see Attention)
- 06 computed-style spot check at c06bd679: sticky header `position: sticky`, `z-index: 2` (`styling-sticky-header-examples--enable-sticky-header`), empty body `min-height: 100px` (`features-virtualization--empty-data-virtualization`) in base, radix and aria
- S1 merge gates at 27ad7a70 (sets A to D merged, docs copies regenerated, CHANGELOG, two lead fixes):
- `pnpm --filter shadcn-table lint` at 27ad7a70: green, exit 0, 0 problems (0 errors, 0 warnings); at d84bd445 it reported 6 `incompatible-library` warnings, fixed in b97c059b
- `pnpm --filter shadcn-table tsc:radix` at 27ad7a70: green
- `pnpm --filter shadcn-table tsc:baseui` at 27ad7a70: green
- `pnpm --filter shadcn-table tsc:aria` at 27ad7a70: green
- `pnpm check:bases` at 27ad7a70: green (145 library files, 24 and 38 allowed to differ; 216 example files, 2 and 10)
- `pnpm check:tailwind` at 27ad7a70: green, 0 not canonical or physical in base (1215 candidates), radix (1187), aria (1193)
- 02 Acceptance `grep -rc "eslint-disable" ... | awk` at 27ad7a70: base 54, radix 54, aria 56, equal to the expected 52, 52, 54 plus the two virtualizer `incompatible-library` lines per base (Set A attention)
- 03 Acceptance at 27ad7a70: `eslint --rule '{"react-hooks/refs":"error"}'` on `useST_TableInstance.ts` 0 in each base; `grep -nE "tableRef|columnDefsRef|table\.store"` empty; three copies identical
- 04 Acceptance at 27ad7a70: `eslint --rule '{"@typescript-eslint/no-explicit-any":"error"}' registry/<base>` exit 0 per base; `no-explicit-any` count 9 per base (8 plus the `icons.ts` foundation line until S3)
- 05 Acceptance at 27ad7a70: `grep -rn 'table.store'` over the registry, stories, docs examples and `row-pinning.mdx` empty; `lint` exit 0 with `no-deprecated` on
- 07 Acceptance at 27ad7a70: `grep -rniE 'MUI|MRT|material-react-table|@mui|upstream|edition|forkedUi|getCommonToolbarStyles' --exclude=icons.ts --exclude-dir=icons` empty (8 `MUI` hits in `style.utils.ts` at d84bd445, fixed in 27ad7a70); `tsc:radix`, `tsc:baseui`, `tsc:aria` exit 0
- `grep -rn "rgba(" packages/shadcn-table/registry/*/components/ui/shadcn-table` at 27ad7a70: empty
- `pnpm --filter shadcn-table test:base` at 27ad7a70 (`--browser.api.port 5341`): green, 64 files, 453 tests
- `pnpm --filter shadcn-table test:radix` at 27ad7a70 (port 5344): green, 64 files, 453 tests
- `pnpm --filter shadcn-table test:aria` at 27ad7a70 (port 5347): green, 64 files, 453 tests
- `pnpm --filter shadcn-table-docs types:check` at 27ad7a70: green
- `pnpm --filter shadcn-table-docs lint` at 27ad7a70: green, exit 0, 0 errors, 9 warnings (`<img>` in `examples/<base>/advanced/TS.tsx` x2 and `exhaustive-deps` in `examples/<base>/expanding-tree-flat-parse/TS.tsx` per base)
- `pnpm --filter shadcn-table-docs build` at 27ad7a70: green, tree clean after
- `pnpm --filter shadcn-table lint` at 8b493528: red by design (new config, 668 errors, 51 warnings) until the last set merges
- `pnpm --filter shadcn-table tsc:baseui`, `tsc:radix`, `tsc:aria` at d5e8abc7: green
- `pnpm --filter shadcn-table exec tsc -p tsconfig.stories.json` at ba367b60: green
- `pnpm check:bases` at d5e8abc7: green
- `pnpm --filter shadcn-table test:base`, `test:radix`, `test:aria` at ba367b60: green, 63 files, 448 tests each (`ColumnsHoldWhileResizing`, `ColumnsHoldWhileDragging` new)
- `ST_BASE=base vitest run` CustomFilterFns, Filtering, Sorting, Aggregation stories at d5e8abc7: green, 47 tests

- Milestone 01 config switch and baseline: done (8b493528)
- Lead step: 03 atoms (ba367b60), 05 registries and `getPlatform` (d5e8abc7); set worktrees `library-sweep-{a,b,c,d}` on `v0.7/library-sweep-{a,b,c,d}` cut at the lead head
- Set A: 90487682
- Set B: 77a0eba8 (`eslint --max-warnings 0` and `prettier --check` on `components/{body,head,footer,table}` of the three bases: 0; `tsc:baseui`, `tsc:radix`, `tsc:aria`: green; `check:tailwind`: 0 sites in set B per base)
- Set C: ff32d364 (at ff32d364: `eslint --max-warnings 0` and `prettier --check` on the set C files of all three bases zero, `tsc:radix`, `tsc:baseui`, `tsc:aria`, `tsc -p tsconfig.stories.json`, `check:bases` green, `test:base`, `test:radix`, `test:aria` green, 64 files, 453 tests each, `check:tailwind` zero hits in set C files, set C `eslint-disable` lines base 6, radix 6, aria 8)
- Set D: cde17938
- Milestone S1 merge: done (27ad7a70); sets A to D merged (5599c724, 9dda6b63, b0d23112, da9eee9a), docs copies regenerated (ec16ade5), CHANGELOG (d84bd445), set worktrees removed, branches kept

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
- Set B: Tailwind 4.3.3 canonicalizes `end-*` to `inset-e-*` (`end-1 -> inset-e-1` from `check:tailwind`), so the resize handle and the sort badge use `inset-e-1`, `inset-e-0`, `inset-e-[14%]` instead of 06 1.6.4's `end-*`; same CSS (`inset-inline-end`). Sets A and C (`start-0`, `end-0`) meet the same rule.
- Set B: the body cell skeleton width is now drawn once at mount in the `useState` initializer (02 1.6.6, D8), not when loading first turns on; a column resized before loading starts keeps the mount-time width.
- Set C: `ST_CellActionMenu` calls `useST_MenuAnchor` at the top of a file-local inner component rendered under the kept `Subscribe source={table.atoms.actionCell}`, with `anchorEl={table.refs.actionCellRef.current}` read in that render prop. Reading the ref at the component top (07 1.6.2) is a `react-hooks/refs` error once it feeds the hook, and the element exists only in the ref that set B's `ST_TableBodyCell` writes. `closeMenu` no longer nulls `actionCellRef` (it captured a ref inside the render props); the inner component's unmount cleanup does. Revert means a state-published anchor element in set B's handler.
- Set C: Tailwind 4.3.3 canonicalizes `start-0` and `end-0` to `inset-s-0` and `inset-e-0`, so set C uses those (06 1.6.4 names `start-`/`end-`; `check:tailwind` rejects them). Sets A and B hit the same on `before:start-0` and `end-[14%]`.
- Set C: aria menus keep `role="button"` on the span (spec 10 drops it per D26) and call no `focusAnchor`: React Aria restores focus to the opener itself, which the `MenuFocusReturn` play tests confirm in all three bases.
- Set D: the cell-edit stories in `Editing.stories.tsx` lost their four `@ts-expect-error column id is a string key of Person` lines; the immutable row copy (`{ ...r, [cell.column.id]: value }`) typechecks, so `tsc -p tsconfig.stories.json` reported them unused. `GroupingColumnsSetState` and `VirtualizedDataSetAfterMount` set their after-mount data in a `setTimeout` (still one batch) instead of synchronously in the effect (`set-state-in-effect`). Revert means a reasoned disable per site.
- S1 merge: `lint` kept 6 `react-hooks/incompatible-library` warnings on `useVirtualizer` (Set A attention); b97c059b adds one reasoned `eslint-disable-next-line` per virtualizer hook and base, so the expected `eslint-disable` count is base 54, radix 54, aria 56. Revert means `lint` red until plugin 7 stops reporting opted-out functions.
- S1 merge: `pnpm format` changed nothing after the merges, so step 3 has no format commit.
- S1 merge: the CHANGELOG lines go into the existing `#### Spec NN` blocks under `### Changed` (the foundation's headings, see the first bullet), not `### Spec NN`.
- Review fixes: the single-selection radio again receives every `stSelectCheckboxProps` field (`id`, `name`, `style`, `data-*`, handlers) except the checkbox-only `checked` and `title`, through an entries filter cast once to `ComponentProps<typeof RadioGroupItem>` (no `any`, no `_` bindings); the old spread also passed `checked` and `title: undefined`, which `RadioGroup` overrides. Revert means the typed five-field pick of set C.
- Review fixes: the 06 judged Acceptance ran with one judge (this fixer) on pixel diffs and side-by-side reads, not three: the fixer session has no sub-agent tool. 12 of 30 captures are pixel-identical; the rest differ only in random story data.
- Review fixes: `ST_CellActionMenu` keeps the render-prop read of `actionCellRef` (Set C bullet) and `useST_Rows` keeps no memo (Set A bullet); both are owner calls the review left open, the recorded revert paths stand.
- Review fixes: the fixer harness gave no `Claude-Session:` line either, so cec2e5cc, c06bd679 and the tracker commit carry none; P5 (trailer) against coding-standards Style (no trailers) is left to the owner.
- Verifier: `pr.yml` is red on the PR merge ref, not on the branch: `claude/review` now carries S3's `icons/` maps, and S1's lint config reports 6 errors per base there (`icons/hugeicons.ts:47` unused `_children`, `icons/remixicon.ts:94` deprecated `LayoutThreeColumnIcon`). Every local gate at the branch tip is green. Merging needs `origin/claude/review` into `v0.7/library-sweep` and a fix of those two S3 lines (an `icons/` file S3 owns, P5), then the counts move: 04 `no-explicit-any` 8 per base and 02 `eslint-disable` base 53, radix 53, aria 55 once S3's `icons.ts` drops the foundation line. The verifier changed no code.
- Verifier: the c06bd679 record of `resize-handle` and `ltr` as pixel-identical does not reproduce at 2172c9a0 (no library change since): `ltr` differs in the bottom toolbar top shadow (light 245 against 234). The shadows changed with the spec 06 table's prescribed `color-mix` values; the verifier records them as same position, lighter shadow, and leaves "same visible shadow" to the three judges.
