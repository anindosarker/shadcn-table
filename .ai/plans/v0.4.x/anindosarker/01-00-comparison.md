# 01-00: v9 architecture comparison report

Phase 00 output for part 06 ([01-v9-architecture.md](01-v9-architecture.md) 1.6.2). Read-only
comparison of our Radix tree against the MRT v9 port, every line verified by a second agent
against both sources (corrections applied, refuted findings in section 5). The owner reads
this before phase 01 starts.

Moved from `.ai/plans/v0.4.0/anindosarker/06-00-comparison.md` on 2026-10-27. D1 to D5 in
section 1.1 are ruled in [decisions.md](decisions.md) items 3 to 7, plus item 8 for the row
selection handler. Paths written `apps/docs/` are now `apps/shadcn-table-docs/`;
`migrating-v1.mdx` was deleted in 0.3.3. Line numbers are as of `e81beb4`.

## 1. Header

- Ours: `packages/shadcn-table/registry/radix/components/ui/shadcn-table/` at `e81beb4`
  (branch `v0.4/v9-architecture`). The Base UI tree differs only in the 23 files of
  `scripts/registry/base-diff.json`; a per-base note appears only where a finding differs per
  base.
- MRT: `tanstack-table/examples/react/material-react-table/src/material-react-table/` at
  `95c476849`. Core: `@tanstack/table-core` and `@tanstack/react-table` 9.3.1 dist.
- Name map: MRT `components/<group>/` is our `<group>/`; `MRT_` is `ST_`, `useMRT_` is
  `useST_`, `mrt*Feature` is `st*Feature`, `MaterialReactTable` is `ShadcnTable`.
- Paths in tables are relative to those two roots. "Ours" and "MRT" columns carry line
  numbers. Phases: P01 features and hook, P02 instance and options, P03 components, P04
  our-only and locales, Final cleanup and release.

Counts:

| Item                                  | Count |
| ------------------------------------- | ----- |
| Twin files covered                    | 123 of 123 (82 same-name code files, 38 locales, 3 renamed pairs) |
| Divergence lines in section 2         | 209 (in 77 twin files) |
| Twin files with zero divergences      | 46 (9 code files, 37 locales) |
| State ownership entries               | 53 |
| Our-only files                        | 5 |
| MRT-only files                        | 15 |
| Ruled out (refuted)                   | 9 |

### 1.1 Owner decisions this report depends on

These come up across many lines below. Each line that depends on one carries its tag in the
Action column. Section 6 lists them again with the work they unblock.

- **D1, table seam.** Every MRT component (57 call sites in 57 files) drops the `table` prop
  and reads the instance with `useMRTContext<TData>()` (`hooks/mrtTableHook.ts:44-48`, a cast
  over `createTableHook`'s `useTableContext`, provided by `<table.AppTable>` in
  `components/MaterialReactTable.tsx:35-45`). Part file 1.6.7 says component props stay
  unchanged. Options: (a) keep the `table` prop everywhere and record one tracker line for
  the whole tree; (b) make `table` optional with a `useSTContext()` fallback; (c) drop the
  prop as MRT did. Lines tagged D1 below are the per-file instances; their action reads
  "keep (D1)" which is the default under 1.6.7 until the owner rules.
- **D2, state reads.** decisions.md says components "read state through feature APIs instead
  of `table.state`". The twin does not: MRT keeps `table.state` (destructured `state`) in
  every component except `head/MRT_TableHeadCellSortLabel.tsx:32` (`table.Subscribe`) and
  `hooks/display-columns/getMRT_RowNumbersColumnDef.tsx:15` (`table.atoms.pagination.get()`),
  because `MRT_TableInstance` keeps `state: MRT_TableState` (`types.ts:285`) fed by the
  full-state selector (`hooks/useMRT_TableInstance.ts:253`). This report records reads as
  "keep" to match the twin. The recorded decision text needs amending, or the owner wants
  more than the twin does.
- **D3, Fn registries.** Core 9.3.1 resolves string `filterFn`, `sortFn`, `aggregationFn`
  and `globalFilterFn` names only through `table._rowModelFns`, filled from the features
  bundle (`table-core dist core/table/constructTable.js:26,38-42`); `options.filterFns` is
  never read by core. Ours merges built-ins into typed `filterFns`, `sortFns`,
  `aggregationFns` options and resolves names to functions before core sees them
  (`hooks/useST_TableOptions.ts:115-120`, `utils/column.utils.ts:65-92`,
  `hooks/useST_TableInstance.ts:285-286`, documented at `types.ts:921-923`). MRT dropped the
  merge (`hooks/useMRT_TableOptions.ts:198-202`, the comment there claims a merge that
  `useMRT_TableInstance.ts:245-252` does not do), so a custom `globalFilterFn` or
  `aggregationFn` name silently fails in MRT. Options: keep the ST resolution path and the
  three typed options as a recorded deviation, or build the registries per table. Copying
  MRT's pass-through is a regression. Part file 1.6.3 says features add no options the twin
  lacks, so either answer needs a tracker line.
- **D4, `stFeatures` export.** Ours exports `stFeatures` and `ST_Features` from `index.ts:4`
  and documents them (`apps/docs/content/docs/getting-started/migrating-v1.mdx:43`,
  `api/table-options.mdx:23`); MRT keeps `mrtFeatures` internal (`index.ts:1-91`). Keep the
  export at `features/stFeatures.ts` (1.2 public surface unchanged) or drop it to match MRT.
  Either way the docs path and counts change.
- **D5, `expandRowsFn`.** Declared at `types.ts:919`, read nowhere in the package, absent from
  MRT, documented in `apps/docs/lib/prop-tables/tableOptions.ts:752` and
  `guides/expanding-sub-rows.mdx:19`. Drop it (and the docs) or keep it in `stConfigFeature`
  as a recorded deviation.

Settled by an existing record, no owner call needed: shift range selection stays on v9
`enableRowRangeSelection` (owner decision 2026-10-19,
`.ai/plans/tanstack-v9/anindosarker/01-radix-tree.md:32-35`), so `enableBatchRowSelection`
and `refs.lastSelectedRowId` are not added; `getRowCanExpand` default stays (MRT has the bug,
see hooks); public `ST_*` names stay (1.6.5).

## 2. Per twin file

One row per divergence. Kind is one of structure, state-read, setter, feature-api, subscribe,
types, options, other. A setter, ref or state row marked P01 means the component call site
stays; only its provider moves from `useST_TableInstance` into the named `st*Feature`.

### 2.1 Table

**`ShadcnTable.tsx` / `components/MaterialReactTable.tsx`**

| Kind | Finding | Ours | MRT | Action | Phase |
| --- | --- | --- | --- | --- | --- |
| structure | MRT mounts `table.AppTable` (read with an `as any` cast, then JSX) so components resolve the table from context; ours renders `<ST_TableLayout table={table} />` inside `TooltipProvider` with no provider, because `useST_TableInstance.ts:277` calls `useTable`, which attaches no `AppTable`. In base-diff: radix `TooltipProvider skipDelayDuration` at 44, base `timeout` at 46; edit both trees by hand, `TooltipProvider` stays the outer wrapper. Needed by D1 (b) or (c); harmless for (a). | 43-47 (base 45-49) | 35-45 | align after P02 switches to `useAppTable` (D1) | P03 |
| other | `TooltipProvider` root has no MRT equivalent (MUI Tooltip needs none); per-base prop. | 37-46 | 41-45 | keep, recorded deviation | P04 |

**`table/ST_Table.tsx` / `components/table/MRT_Table.tsx`**

| Kind | Finding | Ours | MRT | Action | Phase |
| --- | --- | --- | --- | --- | --- |
| structure | MRT props `extends TableProps {}`, table from `useMRTContext()`, children get `{ columnVirtualizer }`; ours declares `table` and passes `{ columnVirtualizer, table }` to head, body, footer. | 19-36, 83-86 | 12-15, 53-55 | keep (D1) | P03 |

**`table/ST_TableContainer.tsx` / `components/table/MRT_TableContainer.tsx`**

| Kind | Finding | Ours | MRT | Action | Phase |
| --- | --- | --- | --- | --- | --- |
| structure | MRT renders `MRT_TableLoadingOverlay`, `MRT_Table`, `MRT_EditRowModal open`, `MRT_CellActionMenu` without props; ours passes `table={table}` to all four. | 18-34, 109-114 | 14-17, 97-100 | keep (D1) | P03 |
| state-read | Same `table.state` read of actionCell, creatingRow, editingRow, isFullScreen, isLoading, showLoadingOverlay. Providers move: isLoading and showLoadingOverlay to stLoadingFeature (`mrtLoadingFeature.ts:26-35`), isFullScreen to stFullScreenFeature (`mrtFullScreenFeature.ts:53-56`), actionCell to stCellActionsFeature (`mrtCellActionsFeature.ts:64`), creatingRow and editingRow to stEditingFeature (`mrtEditingFeature.ts:70-72`). Today: options.state fold (`useST_TableInstance.ts:186-195, 288`), useState (95-99, 136-137, 151). | 45-55 | 29-39 | keep read (D2), move providers | P01 |
| feature-api | `refs.bottomToolbarRef`, `tableContainerRef`, `topToolbarRef` same names; MRT from `mrtRefsFeature.ts:45-61`, ours `useRef` at `useST_TableInstance.ts:57-67, 297-309`. stRefsFeature keeps these keys. | 43, 69-74, 90 | 27, 53-58, 74 | align provider | P01 |

**`table/ST_TableLoadingOverlay.tsx` / `components/table/MRT_TableLoadingOverlay.tsx`**

| Kind | Finding | Ours | MRT | Action | Phase |
| --- | --- | --- | --- | --- | --- |
| structure | MRT props `extends CircularProgressProps {}` and context; ours adds `table` to props. | 11-23 | 8-13 | keep (D1) | P03 |

**`table/ST_TableLayout.tsx` / `components/table/MRT_TablePaper.tsx`** (role twin, our-only by name, see section 4)

| Kind | Finding | Ours | MRT | Action | Phase |
| --- | --- | --- | --- | --- | --- |
| structure | MRT props `extends PaperProps {}`, context, children without props; ours takes `table` and threads it to top toolbar, container, bottom toolbar. | 13-36, 77-85 | 10-13, 74-82 | keep (D1); `ShadcnTable.tsx:45` keeps passing it under (a) or (b) | P03 |
| feature-api | Ref key `refs.tableLayoutRef` (`types.ts:347`, `useST_TableInstance.ts:64, 307`) versus `refs.tablePaperRef` (`mrtRefsFeature.ts:19, 58`). `ST_TableInstance.refs` is public; stRefsFeature keeps `tableLayoutRef`. | 47, 64 | 24, 41 | keep, tracker line | P01 |
| setter | `table.setIsFullScreen(false)` on Escape. MRT setter is `table_setIsFullScreen`, `(updater: Updater<boolean>) => void` through `onIsFullScreenChange` with a `makeStateUpdater` default (`mrtFullScreenFeature.ts:23-25, 57-69`); ours is `onIsFullScreenChange ?? setIsFullScreen`, `Dispatch<SetStateAction<boolean>>` (`useST_TableInstance.ts:335-336`, `types.ts:361`). | 61 | 38 | align provider and type | P01 |
| options | `stTableLayoutProps` (`types.ts:1166`) versus `muiTablePaperProps` (`mrtConfigFeature.ts:382`): name stays, declaration moves to stConfigFeature. Same move for `enableBottomToolbar`, `enableTopToolbar`, `renderBottomToolbar`, `renderTopToolbar` (`types.ts:885, 918, 1225, 1298` versus `mrtConfigFeature.ts:113, 146, 420, 491`); defaults stay in the options hook on both sides (`useST_TableOptions.ts:47, 78`, `useMRT_TableOptions.ts:46, 77`). | 39-45, 52 | 17-22, 29 | align declarations | P01 |

Zero divergences: `icons.ts` (same 34 keys in the same order, ours 37-74, MRT 36-73; only the
icon source differs; the `icons` option declaration moves with `types.ts`, see 2.11).

### 2.2 Head

All nine files pair 1:1. FilterContainer and FilterLabel are in base-diff for popover and
collapsible markup only; every row applies to both trees.

**`head/ST_TableHead.tsx` / `components/head/MRT_TableHead.tsx`**

| Kind | Finding | Ours | MRT | Action | Phase |
| --- | --- | --- | --- | --- | --- |
| structure | Generic props with `table`, passed to `ST_ToolbarAlertBanner` (82) and `ST_TableHeadRow` (92); MRT non-generic props (9), context (17), children propless (70, 77-81). | 16 | 17 | keep (D1) | P03 |

**`head/ST_TableHeadRow.tsx` / `components/head/MRT_TableHeadRow.tsx`**

| Kind | Finding | Ours | MRT | Action | Phase |
| --- | --- | --- | --- | --- | --- |
| structure | `table` prop (19, 35) passed to `ST_TableHeadCell` (87); MRT context (27), cell without table (75-79). | 19 | 27 | keep (D1) | P03 |

**`head/ST_TableHeadCell.tsx` / `components/head/MRT_TableHeadCell.tsx`**

| Kind | Finding | Ours | MRT | Action | Phase |
| --- | --- | --- | --- | --- | --- |
| structure | `table` prop (29, 40) passed to six children: FilterLabel 304, SortLabel 307, GrabHandle 315, ColumnActionsButton 324, ResizeHandle 330, FilterContainer 335; MRT context (38), children propless (311-343). | 29 | 38 | keep (D1) | P03 |
| state-read | Ours reads `enableStickyHeader` (56) and `table.state.isFullScreen` (71) to build `stickyHeader` (105) and a sticky class (251); the MRT cell reads neither (options 42-56, state 60-67) and leaves stickiness to `MRT_TableHead` (50-52) and `MRT_TableHeadRow` (55-58), which ours already mirrors (`ST_TableHead.tsx:22, 48`, `ST_TableHeadRow.tsx:27, 65`). Drop the extra reads; verify sticky header in semantic and grid layouts. | 56, 71 | 60 | align | P03 |
| structure | Inline ref callback writes `tableHeadCellRefs.current![column.id] = node` (205-212); MRT uses a `useCallback` `handleRef` (162-174) guarded by `if (tableHeadCellRefs.current)` (165) because `mrtRefsFeature.ts:56` seeds `{ current: null }`. Take MRT's guarded callback; stRefsFeature seeds `{ current: {} }` (see 3) so the cell still registers. | 207 | 165 | align | P03 |
| other | Calls `getCommonSRTCellStyles` (15, 182) where MRT has `getCommonMRTCellStyles` (5, 243); stale `SRT` infix. Rename to `getCommonSTCellStyles` in `utils/style.utils.ts:40` (base-diff file, both trees) and every call site. | 182 | 243 | align | P03 |

**`head/ST_TableHeadCellColumnActionsButton.tsx` / `components/head/MRT_TableHeadCellColumnActionsButton.tsx`**

| Kind | Finding | Ours | MRT | Action | Phase |
| --- | --- | --- | --- | --- | --- |
| structure | `table` prop (24, 29) passed to `ST_ColumnActionMenu` (89); MRT context (24), menu propless (85-89). Both read only `table.options`. | 24 | 24 | keep (D1) | P03 |

**`head/ST_TableHeadCellFilterContainer.tsx` / `components/head/MRT_TableHeadCellFilterContainer.tsx`**

| Kind | Finding | Ours | MRT | Action | Phase |
| --- | --- | --- | --- | --- | --- |
| structure | `table` prop (17, 22) passed to the four filter inputs (42, 44, 46, 48); MRT context (21), inputs propless (39-45). Base-diff: same edit by hand, same lines. | 17 | 21 | keep (D1) | P03 |

**`head/ST_TableHeadCellFilterLabel.tsx` / `components/head/MRT_TableHeadCellFilterLabel.tsx`**

| Kind | Finding | Ours | MRT | Action | Phase |
| --- | --- | --- | --- | --- | --- |
| structure | `table` prop (radix 40, 45; base 37, 42) passed to the filter container (radix 178; base 189-192); MRT context (28), container propless (171). `setShowColumnFilters` and `filterInputRefs` keep their shape; providers stFilterModesFeature and stRefsFeature. | 40 | 28 | keep (D1) | P03 |

**`head/ST_TableHeadCellGrabHandle.tsx` / `components/head/MRT_TableHeadCellGrabHandle.tsx`**

| Kind | Finding | Ours | MRT | Action | Phase |
| --- | --- | --- | --- | --- | --- |
| structure | `table` prop (15, 21) passed to `ST_GrabHandleButton` (87); MRT context (21), button propless (81-85). State reads and setters (columnOrder, draggingColumn, hoveredColumn; setColumnOrder, setColumnPinning, setDraggingColumn, setHoveredColumn) match. | 15 | 21 | keep (D1) | P03 |

**`head/ST_TableHeadCellResizeHandle.tsx` / `components/head/MRT_TableHeadCellResizeHandle.tsx`**

| Kind | Finding | Ours | MRT | Action | Phase |
| --- | --- | --- | --- | --- | --- |
| structure | `table` prop (13, 51); MRT context (18). density, `columnResizing.deltaOffset` and `setColumnResizing` match. | 13 | 18 | keep (D1) | P03 |

**`head/ST_TableHeadCellSortLabel.tsx` / `components/head/MRT_TableHeadCellSortLabel.tsx`**

| Kind | Finding | Ours | MRT | Action | Phase |
| --- | --- | --- | --- | --- | --- |
| structure | `table` prop (14, 35); MRT context (19). | 14 | 19 | keep (D1) | P03 |
| subscribe | Ours reads `sorting` from `table.state` (46) for the multi-sort badge (99); MRT reads only `isLoading, showSkeletons` from state (29) and wraps the render in `<table.Subscribe source={table.atoms.sorting}>` (32-33, closed 110), taking `sorting` from the render prop (33, 65). The only `Subscribe` in MRT. `table.Subscribe` and `table.atoms` exist on the 9.3.1 instance and survive the `ST_TableInstance` Omit (`types.ts:292-314`); needs the `useAppTable` table from P02. | 46 | 32 | align | P03 |

### 2.3 Body

Seven pairs. `body/ST_TableDetailPanel.tsx` is in base-diff (Base UI twin differs only at
137 and 139, Collapsible classes); every row applies to both trees.

**`body/ST_TableBody.tsx` / `components/body/MRT_TableBody.tsx`**

| Kind | Finding | Ours | MRT | Action | Phase |
| --- | --- | --- | --- | --- | --- |
| structure | `table` prop (interface 20-24, destructure 34) forwarded in `commonRowProps` (86); MRT context (import 7, call 21), non-generic props (13-15), `commonRowProps` carries only `columnVirtualizer` and `numRows` (68-71). | 20-24, 34, 86 | 7, 13-15, 21, 68-71 | keep (D1) | P03 |
| structure | `Memo_ST_TableBody` compares `prev.table.options.data` (231-234); MRT uses plain `memo` (214). Goes with the prop under D1 (b) or (c). | 231-234 | 214 | align if D1 drops the prop | P03 |
| types | Generic `<TData extends ST_RowData>` with no default, inferred from `table` (32-36); MRT defaults `= MRT_RowData` (17) because TData is no longer inferable once the table comes from context. Same default needed under D1 (b) or (c). | 20-24, 32-36 | 13-15, 17, 21 | align if D1 drops the prop | P03 |
| state-read | Same read of columnFilters, globalFilter, isFullScreen, rowPinning from `table.state`. P02 must keep `state` on the instance as MRT does (`types.ts:285`, selector `useMRT_TableInstance.ts:253`). | 55 | 26, 41 | keep (D2); constraint on P02 | P02 |
| feature-api | `refs.tableFooterRef`, `tableHeadRef`, `tableLayoutRef` versus `tableFooterRef`, `tableHeadRef`, `tablePaperRef`; providers `mrtRefsFeature.ts:45-61` versus `useST_TableInstance.ts:57-64, 297-308`. | 53, 153 | 39, 132 | keep names, move provider | P01 |

**`body/ST_TableBodyRow.tsx` / `components/body/MRT_TableBodyRow.tsx`**

| Kind | Finding | Ours | MRT | Action | Phase |
| --- | --- | --- | --- | --- | --- |
| structure | `table` in props (22-34), destructured (63), passed to every cell (257) and the detail panel (284); MRT context (10, 48), cells and panel without table (240-246, 267-273). | 22-34, 63, 257, 284 | 10, 26-36, 48, 240-246, 267-273 | keep (D1) | P03 |
| setter | `setHoveredRow(row)` call identical; MRT `table_setHoveredRow` from `mrtRowDraggingFeature.ts:30, 78-84` typed `Updater`, ours a useState alias (`useST_TableInstance.ts:334`, `types.ts:360`). | 89, 157 | 70, 136 | move provider | P01 |
| feature-api | `refs.tableFooterRef`, `refs.tableHeadRef` for sticky offsets; MRT owner `mrtRefsFeature.ts:16, 18`. | 88, 136-141 | 69, 116-121 | move provider | P01 |
| other | Our-only `hover?: boolean` prop split out of `tableRowProps` for the hover highlight; MRT uses MUI TableRow's own `hover`. Shadcn stand-in for a MUI part. | 25-26, 112, 173-177 | 153 | keep, recorded deviation | P03 |

**`body/ST_TableBodyCell.tsx` / `components/body/MRT_TableBodyCell.tsx`**

| Kind | Finding | Ours | MRT | Action | Phase |
| --- | --- | --- | --- | --- | --- |
| structure | `table` in props (33-41), destructured (53), threaded into `cellValueProps` (209), `ST_EditCellTextField` (349), `ST_CopyButton` (351); MRT context (14, 38), children take only `cell` (186-190, 318, 320). | 33-41, 53, 209, 349, 351 | 14, 20-28, 38, 186-190, 318, 320 | keep (D1) | P03 |
| setter | `setHoveredColumn` calls identical; MRT `table_setHoveredColumn` from `mrtColumnDraggingFeature.ts:32, 80`, ours `useST_TableInstance.ts:332`. | 75, 222, 225-227 | 58, 200, 203 | move provider | P01 |
| setter | `table.setActionCell(cell)` then `table.refs.actionCellRef.current = ...` identical; MRT owners `mrtCellActionsFeature.ts:32, 72` and `mrtRefsFeature.ts:9, 48`, ours `useST_TableInstance.ts:310, 57, 298`. | 241-242 | 217-218 | move provider | P01 |
| other | `getCommonSRTCellStyles` rename, same as head cell. | 27, 256 | 10, 282 | align | P03 |

**`body/ST_TableBodyCellValue.tsx` / `components/body/MRT_TableBodyCellValue.tsx`**

| Kind | Finding | Ours | MRT | Action | Phase |
| --- | --- | --- | --- | --- | --- |
| structure | `table` in props (11-17), destructured (24), `ST_TableInstance` import (5) for it; MRT context (3, 22), imports only `MRT_Cell` and `MRT_RowData` (5). | 5, 11-17, 24 | 3, 5, 9-14, 22 | keep (D1) | P03 |
| state-read | Same read of globalFilter and globalFilterFn from state and `columnDef._filterFn`; globalFilterFn provider moves to stFilterModesFeature. | 35, 81 | 24, 32, 78 | keep read, move provider | P01 |

**`body/ST_TableBodyRowGrabHandle.tsx` / `components/body/MRT_TableBodyRowGrabHandle.tsx`**

| Kind | Finding | Ours | MRT | Action | Phase |
| --- | --- | --- | --- | --- | --- |
| structure | `table` in props (11-16), destructured (21), passed to `ST_GrabHandleButton` (58); MRT context (2, 20), button propless (50-55). | 11-16, 21, 58 | 2, 8-13, 20, 50-55 | keep (D1) | P03 |
| setter | `setDraggingRow(row)`, `setDraggingRow(null)`, `setHoveredRow(null)` identical; MRT `mrtRowDraggingFeature.ts:29-30, 72-84`, ours `useST_TableInstance.ts:325-326, 334`. | 43, 48, 49 | 40, 45, 46 | move provider | P01 |

**`body/ST_TableBodyRowPinButton.tsx` / `components/body/MRT_TableBodyRowPinButton.tsx`**

| Kind | Finding | Ours | MRT | Action | Phase |
| --- | --- | --- | --- | --- | --- |
| structure | `table` in props (11-15), destructured (28), spread into `rowPinButtonProps` (41-45); MRT context (3, 18), props carry only `row` and rest (29-32). | 11-15, 28, 41-45 | 3, 8-12, 18, 29-32 | keep (D1) | P03 |

**`body/ST_TableDetailPanel.tsx` / `components/body/MRT_TableDetailPanel.tsx`**

| Kind | Finding | Ours | MRT | Action | Phase |
| --- | --- | --- | --- | --- | --- |
| structure | `table` in props (15-23), destructured (48); MRT context (5, 33). Base-diff file: edit by hand in both trees. | 15-23, 48 | 5, 15-23, 33 | keep (D1) | P03 |

### 2.4 Footer

Three pairs, footer/ byte-identical across bases. Option defaults match line for line.

**`footer/ST_TableFooter.tsx` / `components/footer/MRT_TableFooter.tsx`**

| Kind | Finding | Ours | MRT | Action | Phase |
| --- | --- | --- | --- | --- | --- |
| structure | Generic `table` prop threaded to `ST_TableFooterRow`; MRT props non-generic with only `columnVirtualizer`, context. The table arrives from `ST_Table.tsx:83-86, 106` versus `MRT_Table.tsx:53-55, 76`. | 12-16, 30, 87 | 3, 8-10, 16 | keep (D1) | P03 |
| state-read | `isFullScreen` read kept; slice source moves from the selector merge (`useST_TableInstance.ts:288`) to the stFullScreenFeature atom (`mrtFullScreenFeature.ts:53-56`). | 37 | 18, 22 | keep read, move provider | P01 |
| feature-api | `refs.tableFooterRef` identical; MRT assigns it in `mrtRefsFeature.ts:16, 46-61`, ours `useRef` at `useST_TableInstance.ts:67, 297-308`, typed inline at `types.ts:337-349`. | 35 | 20 | move provider | P01 |
| types | `stTableFooterProps`, `enableStickyFooter`, `enableTableFooter`, `layoutMode` declared on `ST_TableOptions` (`types.ts:913, 915, 937, 1142-1144`); MRT declares them in `MRT_TableOptions_Config` through `TableOptions_FeatureMap` (`mrtConfigFeature.ts:73-82, 141, 143, 153, 358-360`). Names unchanged. | 34 | 19 | align declarations | P01 |

**`footer/ST_TableFooterRow.tsx` / `components/footer/MRT_TableFooterRow.tsx`**

| Kind | Finding | Ours | MRT | Action | Phase |
| --- | --- | --- | --- | --- | --- |
| structure | `table` prop passed to `ST_TableFooterCell` (92); MRT context, cell gets only `footer` and `staticColumnIndex` (81-85). | 15-20, 31, 92 | 3, 14-19, 26, 81-85 | keep (D1) | P03 |
| types | `ST_HeaderGroup` and `ST_Header` are Omit-and-retype wrappers (`types.ts:740-751`); MRT aliases `HeaderGroup<MRT_Features, TData>` and `Header<...>` (`types.ts:365-373`). Collapse per 1.6.5. | 5-6, 18 | 7-8, 18 | align | P01 |
| types | `stTableFooterRowProps` declared at `types.ts:1145-1150` with ST wrapper args; MRT `muiTableFooterRowProps` with core `HeaderGroup`, `Table` args (`mrtConfigFeature.ts:361-365`). Same declaration move covers `layoutMode` read at ours 36, MRT 29. | 36, 39 | 29, 31 | align declarations | P01 |

**`footer/ST_TableFooterCell.tsx` / `components/footer/MRT_TableFooterCell.tsx`**

| Kind | Finding | Ours | MRT | Action | Phase |
| --- | --- | --- | --- | --- | --- |
| structure | `table` prop; MRT props only `footer` and `staticColumnIndex`, context. | 16-21, 30 | 6, 10-15, 22 | keep (D1) | P03 |
| state-read | `density` read kept; source moves from useState plus selector merge (`useST_TableInstance.ts:124, 288`) to the stDensityFeature atom (`mrtDensityFeature.ts:59-62`). | 41 | 25, 32 | keep read, move provider | P01 |
| types | `stTableFooterCellProps` (table level `types.ts:1136-1141`, column level `664-669`) and `enableKeyboardShortcuts` (`types.ts:904`) move to stConfigFeature (MRT `mrtConfigFeature.ts:352-357, 725-730, 133`). `enableColumnPinning` is a stock option on both sides and does not move. | 35-39, 54 | 26-30, 45 | align declarations | P01 |
| types | `columnDef.Footer` and `footer` declared on `ST_ColumnDef` (`types.ts:541-547`); MRT in `MRT_ColumnDef_Config` via `ColumnDef_FeatureMap` (`mrtConfigFeature.ts:606-617`). Render expression stays. | 62, 111-116 | 53, 96-101 | align declarations | P01 |
| types | `ST_Header` wrapper for the `footer` prop (`types.ts:740-745`) versus alias (`types.ts:365-369`). | 7, 18 | 7, 13 | align | P01 |

### 2.5 Toolbar

Seven pairs. `table.state` reads stay (no `Subscribe` in MRT's toolbar). Three toolbar files
are in base-diff for markup only.

**`toolbar/ST_BottomToolbar.tsx` / `components/toolbar/MRT_BottomToolbar.tsx`**

| Kind | Finding | Ours | MRT | Action | Phase |
| --- | --- | --- | --- | --- | --- |
| structure | `table` prop, threaded to `ST_LinearProgressBar`, `ST_ToolbarAlertBanner`, `ST_ToolbarDropZone`, `ST_TablePagination` (81, 85, 89, 105); MRT `extends BoxProps {}`, context, children propless (65, 67, 70, 98). | 15-18, 36-39 | 13-16 | keep (D1) | P03 |
| state-read | `isFullScreen` read kept; provider useState (`useST_TableInstance.ts:151`) folded by the selector (288) moves to stFullScreenFeature (`mrtFullScreenFeature.ts:15, 54, 58`). | 51 | 18, 29 | move provider | P01 |
| feature-api | `refs.bottomToolbarRef` identical; MRT `mrtRefsFeature.ts:10, 49`, ours `useST_TableInstance.ts:58, 299`. | 49, 67 | 27, 45 | move provider | P01 |

**`toolbar/ST_TopToolbar.tsx` / `components/toolbar/MRT_TopToolbar.tsx`**

| Kind | Finding | Ours | MRT | Action | Phase |
| --- | --- | --- | --- | --- | --- |
| structure | `table` prop, threaded into the global filter props and every child (63-66, 84-120); MRT empty props, context, passes `table` only into `globalFilterProps` (51), children propless. | 29-35, 63-66 | 13-16, 45-52 | keep (D1) | P03 |
| state-read | `isFullScreen` and `showGlobalFilter` reads kept; providers move to stFullScreenFeature (`mrtFullScreenFeature.ts:15`) and stFilterModesFeature (`mrtFilterModesFeature.ts:19, 73, 80`), from useState at `useST_TableInstance.ts:151, 178`. | 51 | 18, 33 | move provider | P01 |
| feature-api | `refs.topToolbarRef` identical; MRT `mrtRefsFeature.ts:20, 59`, ours `useST_TableInstance.ts:65, 308`. | 48, 72 | 30, 58 | move provider | P01 |

**`toolbar/ST_LinearProgressBar.tsx` / `components/toolbar/MRT_LinearProgressBar.tsx`**

| Kind | Finding | Ours | MRT | Action | Phase |
| --- | --- | --- | --- | --- | --- |
| structure | `table` in props; MRT props are `LinearProgressProps & { isTopToolbar }`, context. | 12-16, 27-31 | 7-15 | keep (D1) | P03 |
| state-read | `isSaving` and `showProgressBars`: MRT seeds both in `mrtLoadingFeature.getInitialState` (`mrtLoadingFeature.ts:5-7, 29-31`); ours has no state for them (type only, `types.ts:419, 424`) and relies on the options.state spread (`useST_TableInstance.ts:288`). stLoadingFeature must default them to `false` so the read survives the selector removal. | 35 | 17, 20 | align provider | P01 |

**`toolbar/ST_TablePagination.tsx` / `components/toolbar/MRT_TablePagination.tsx`**

| Kind | Finding | Ours | MRT | Action | Phase |
| --- | --- | --- | --- | --- | --- |
| feature-api | Last-page button reuses `disableNext` (computed 107, used 309); MRT computes `disableLast = !table.getCanLastPage() \|\| disabled` (79) and uses it (228). `getCanLastPage` is stock 9.3.1 (`rowPaginationFeature.types.d.ts:59`) and appears nowhere in our tree. | 106-107, 309 | 79, 228 | align | P03 |
| structure | `table` in props; MRT props carry only `position` and the MUI partial. | 40-50, 56-60 | 20-35 | keep (D1) | P03 |
| state-read | `pagination` read is the same; the slice is a useState with a guarded `onPaginationChange` in the hook (`useST_TableInstance.ts:154-156, 168-171, 282`) where MRT only seeds a default (`useMRT_TableInstance.ts:122`). See 2.11. | 75-77 | 40, 50-52 | keep read, hook change | P02 |

**`toolbar/ST_ToolbarAlertBanner.tsx` / `components/toolbar/MRT_ToolbarAlertBanner.tsx`**

| Kind | Finding | Ours | MRT | Action | Phase |
| --- | --- | --- | --- | --- | --- |
| structure | `table` in props, threaded into `ST_SelectCheckbox` (182); MRT context, propless checkbox (165). | 16-20, 34-38, 182 | 15-23, 165 | keep (D1) | P03 |
| feature-api | Width clamp reads `refs.tableLayoutRef` where MRT reads `refs.tablePaperRef` (`mrtRefsFeature.ts:19, 58`); name follows our-only ST_TableLayout. | 54, 148 | 39, 117 | keep, tracker line | P04 |
| state-read | density, grouping, rowSelection, showAlertBanner reads kept; density moves to stDensityFeature (`mrtDensityFeature.ts:16, 60`), showAlertBanner to stToolbarsFeature (`mrtToolbarsFeature.ts:56`), the grouping useState mirror (`useST_TableInstance.ts:142`) goes to stock. | 56 | 27, 41 | move provider | P01 |
| types | `table.getColumn(columnId).columnDef.header` and `.toggleGrouping()` compile without `!` only because `ST_TableInstance` overrides `getColumn` to non-undefined (`types.ts:300, 322`); MRT uses core's `Column \| undefined` and writes `getColumn(columnId)!`. Add `!` when 1.6.5 collapses the instance type. Base twin: 115, 121. | 114, 116 | 96-97 | align after P01 types | P03 |

**`toolbar/ST_ToolbarDropZone.tsx` / `components/toolbar/MRT_ToolbarDropZone.tsx`**

| Kind | Finding | Ours | MRT | Action | Phase |
| --- | --- | --- | --- | --- | --- |
| structure | `table` in props; MRT `extends BoxProps {}`, context. | 9-12, 26-29 | 11-14 | keep (D1) | P03 |
| setter | `setHoveredColumn`, `setShowToolbarDropZone` calls identical; MRT feature APIs typed `(updater: Updater<...>) => void` (`mrtColumnDraggingFeature.ts:32-34, 80`, `mrtToolbarsFeature.ts:26, 72`), ours `onXChange ?? useState` aliases typed `Dispatch<SetStateAction<...>>` (`useST_TableInstance.ts:332-333, 343-345`, `types.ts:359, 365`). | 32-33, 40, 49 | 18-19, 25, 34 | align provider and type | P01 |
| state-read | draggingColumn, hoveredColumn, showToolbarDropZone reads kept; MRT owners `mrtColumnDraggingFeature.ts:15-18, 63-71`, `mrtToolbarsFeature.ts:57, 62`; ours useState at `useST_TableInstance.ts:127, 145, 181`. | 36-37, 48 | 15, 22, 33 | move provider | P01 |

**`toolbar/ST_ToolbarInternalButtons.tsx` / `components/toolbar/MRT_ToolbarInternalButtons.tsx`**

| Kind | Finding | Ours | MRT | Action | Phase |
| --- | --- | --- | --- | --- | --- |
| structure | `table` in props, threaded into all five toggle buttons; MRT context, propless children. Option reads identical. | 14-17, 22-25, 56-68 | 11-16, 49-59 | keep (D1) | P03 |

### 2.6 Inputs

Seven pairs. ST_SelectCheckbox and ST_FilterTextField are in base-diff; only their line
numbers shift there (given in the row).

**`inputs/ST_EditCellTextField.tsx` / `components/inputs/MRT_EditCellTextField.tsx`**

| Kind | Finding | Ours | MRT | Action | Phase |
| --- | --- | --- | --- | --- | --- |
| structure | `table` prop; MRT `useMRTContext<TData>()` and no prop (MRT commit 5f84b24de). | 40, 44 | 5, 16-20 | keep (D1) | P03 |
| state-read | creatingRow and editingRow reads kept; owner `mrtEditingFeature.ts:64, 76-78`. | 57 | 22, 31 | move provider | P01 |
| setter | `setCreatingRow`, `setEditingCell`, `setEditingRow` calls unchanged; MRT feature APIs (`mrtEditingFeature.ts:33-39, 82-98`) versus aliases (`useST_TableInstance.ts:311-329`). | 51-53, 134-137, 152 | 25-27, 68-70, 85 | move provider | P01 |
| feature-api | `refs.editInputRefs` same shape; MRT `mrtRefsFeature.ts:11, 50`, ours `useST_TableInstance.ts:297`. | 50, 158, 186, 252 | 24, 91, 105 | move provider | P01 |
| types | Ours keeps `//@ts-expect-error` on `row._valuesCache[column.id]`; MRT removed it because `MRT_Row` is `Row<MRT_Features, TData>` (`types.ts:376`) with core `_valuesCache: Record<string, unknown>`. Ours re-types `_valuesCache` in `ST_Row` (`types.ts:756, 764`). Drop the directive after the 1.6.5 collapse. | 132-133 | 66 | align after P01 types | P03 |

**`inputs/ST_FilterCheckbox.tsx` / `components/inputs/MRT_FilterCheckbox.tsx`**

| Kind | Finding | Ours | MRT | Action | Phase |
| --- | --- | --- | --- | --- | --- |
| structure | `table` prop versus context. | 37, 42 | 6, 16-20 | keep (D1) | P03 |
| state-read | density read kept; owner `mrtDensityFeature.ts:16, 64`. | 48 | 22, 25 | move provider | P01 |

**`inputs/ST_FilterRangeFields.tsx` / `components/inputs/MRT_FilterRangeFields.tsx`**

| Kind | Finding | Ours | MRT | Action | Phase |
| --- | --- | --- | --- | --- | --- |
| structure | Takes and forwards `table` to `ST_FilterTextField`; MRT props only `header`, no pass-through. | 14, 24, 37 | 7-16, 28-32 | keep (D1) | P03 |

**`inputs/ST_FilterRangeSlider.tsx` / `components/inputs/MRT_FilterRangeSlider.tsx`**

| Kind | Finding | Ours | MRT | Action | Phase |
| --- | --- | --- | --- | --- | --- |
| structure | `table` prop versus context. | 16, 33 | 6, 16-20 | keep (D1) | P03 |
| options | Ours calls `column.getFacetedMinMaxValues()` only when `enableFacetedValues` is true; MRT calls it unconditionally (the row model is registered on both sides, `mrtFeatures.ts:63`, `tanstack.features.ts:61`). Same gate as `utils/column.utils.ts` (2.12); both sites stay gated (v8 behaviour, option still declared by MRT with default false). | 39, 62-64 | 22, 39-42 | keep, tracker line | P03 |
| types | MRT writes `columnDef._filterFn!` because `mrtConfigFeature.ts:524` declares `_filterFn?` on the column-def map; ours declares it required (`types.ts:724`). Add `!` once stConfigFeature carries the optional `_filterFn` (2.11). | 48 | 28 | align after P01 types | P03 |
| feature-api | `refs.filterInputRefs` same shape; MRT `mrtRefsFeature.ts:12, 51`. | 43, 122 | 23, 101 | move provider | P01 |

**`inputs/ST_FilterTextField.tsx` / `components/inputs/MRT_FilterTextField.tsx`**

| Kind | Finding | Ours | MRT | Action | Phase |
| --- | --- | --- | --- | --- | --- |
| structure | `table` prop, forwarded to `ST_FilterOptionMenu` (651; base 667); MRT context, passes only anchorEl, header, setAnchorEl, setFilterValue. | 67, 73, 651 | 21, 34-39, 561-566 | keep (D1) | P03 |
| types | `_filterFn` reads: ours `includes(currentFilterOption)` with no `!` (147) and redundant `?.` (150-151, 638-639; base 654-655); MRT `currentFilterOption!` (101) and the same chains (104-105, 310-311). Root cause is the optional `_filterFn` on MRT's column-def map (`mrtConfigFeature.ts:524`) versus required on ours (`types.ts:724`). Follow the stConfigFeature typing. | 147, 150-151, 638-639 | 101, 104-105, 310-311 | align after P01 types | P03 |
| other | Debounce: local `debounce` util (`utils/utils.ts:32`) inside `useCallback(..., [])`; MRT `useDebouncedCallback` from `@tanstack/react-pacer/debouncer` (MRT commit c93e055f1, not part of the v9 change). Keep: no new runtime dependency for registry users. | 52, 201-219 | 14, 151-164 | keep, tracker line | P04 |
| setter | `setColumnFilterFns` call unchanged; MRT `mrtFilterModesFeature.ts:30, 84`, ours alias `useST_TableInstance.ts:320`. | 89, 281 | 53, 221 | move provider | P01 |
| feature-api | `refs.filterInputRefs` keyed `${column.id}-${rangeFilterIndex ?? 0}` on both sides. | 88, 386-388 | 52, 317-319 | move provider | P01 |

**`inputs/ST_GlobalFilterTextField.tsx` / `components/inputs/MRT_GlobalFilterTextField.tsx`**

| Kind | Finding | Ours | MRT | Action | Phase |
| --- | --- | --- | --- | --- | --- |
| structure | Generic props with `table`, forwarded to `ST_FilterOptionMenu` (157); MRT props non-generic, context, no pass-through. | 28-31, 34, 157 | 10, 15-20, 148-152 | keep (D1) | P03 |
| state-read | globalFilter and showGlobalFilter reads kept; showGlobalFilter owner `mrtFilterModesFeature.ts:19, 73, 80`, globalFilter is stock. | 48 | 22, 33 | move provider | P01 |
| other | Debounce: ours passes the event to a local debounce, MRT passes the value to `useDebouncedCallback`; same wait values. | 22, 61-70, 74 | 7, 46-51, 55 | keep, tracker line | P04 |
| feature-api | `refs.searchInputRef` same; MRT `mrtRefsFeature.ts:14, 53`. | 45-46, 133 | 30-31, 142 | move provider | P01 |

**`inputs/ST_SelectCheckbox.tsx` / `components/inputs/MRT_SelectCheckbox.tsx`**

| Kind | Finding | Ours | MRT | Action | Phase |
| --- | --- | --- | --- | --- | --- |
| structure | `table` prop (base 43, 49), `ST_TableInstance` import (11); MRT context (11, 30), props without table (18-23). | 38, 44 | 11, 25-30 | keep (D1) | P03 |
| state-read | density and isLoading reads kept (base 61); owners `mrtDensityFeature.ts:16`, `mrtLoadingFeature.ts:4`. | 56 | 32, 41 | move provider | P01 |
| feature-api | Indeterminate adds `&& !allRowsSelected` and `&& !row.getIsAllSubRowsSelected()`; MRT uses the bare calls. In 9.3.1 both guards are redundant (`rowSelectionFeature.utils.js:244` is excluded by the `!isChecked && selectAll` branch; `utils.js:340` `row_getIsSomeSelected` is `'some'`, exclusive of `'all'`). Base 160, 162. | 152-162 | 124-128 | align | P03 |

### 2.7 Menus

Seven pairs; Base UI twins differ only in trigger and focus-return markup. Cluster note:
MRT reads `density` in five menus only for MUI `dense` list mode (CellActionMenu 26, 84-91;
ColumnActionMenu 62, 310; FilterOptionMenu 140, 246; RowActionMenu 30, 40, 70;
ShowHideColumnsMenu 49, 108); shadcn menus have no dense mode, so ours has no read. Keep.

**`menus/ST_ActionMenuItem.tsx` / `components/menus/MRT_ActionMenuItem.tsx`**

| Kind | Finding | Ours | MRT | Action | Phase |
| --- | --- | --- | --- | --- | --- |
| structure | Generic props with `table`; MRT non-generic, context (`mrtTableHook.ts:44-48`). | 15-24, 32-39 | 9-13, 21-26 | keep (D1) | P03 |

**`menus/ST_CellActionMenu.tsx` / `components/menus/MRT_CellActionMenu.tsx`**

| Kind | Finding | Ours | MRT | Action | Phase |
| --- | --- | --- | --- | --- | --- |
| structure | Generic props with `table`, passed to both `ST_ActionMenuItem` children (64, 76); MRT `extends Partial<MenuProps> {}`, context, children propless. | 16-25, 64, 76 | 9, 11-12, 44-64 | keep (D1) | P03 |
| types | MRT casts `actionCell! as MRT_Cell<MRT_RowData>` because the non-generic feature state stores `Cell<any, any, any> \| null` (`mrtCellActionsFeature.ts:15-22`); ours uses `actionCell!` uncast. Same cast to `ST_Cell<ST_RowData>` once `ST_TableState` derives from `ST_Features`. | 39-42 | 27-32 | align after P01 types | P03 |
| setter | `table.setActionCell(null)` and clearing `refs.actionCellRef.current` identical; providers stCellActionsFeature (`mrtCellActionsFeature.ts:72-78`) and stRefsFeature (`mrtRefsFeature.ts:9, 48`). | 36, 45-49 | 24, 34-38 | move provider | P01 |
| other | Our-only `table.state.editingCell` read in `onCloseAutoFocus` (base: `finalFocus` callback) decides focus return; MUI Menu restores focus itself. Radix and Base UI need. | 135-138 | 83-101 | keep | P03 |

**`menus/ST_ColumnActionMenu.tsx` / `components/menus/MRT_ColumnActionMenu.tsx`**

| Kind | Finding | Ours | MRT | Action | Phase |
| --- | --- | --- | --- | --- | --- |
| structure | `table={table}` at 13 sites: 12 `ST_ActionMenuItem` (163 to 320) plus `ST_FilterOptionMenu` (235); MRT context (3, 24), props without table (10-16), children propless (150-156, 217-223). | 17-23, 25-32, 163, 235 | 10-16, 18-24, 150-156, 217-223 | keep (D1) | P03 |
| setter | `setColumnFilterFns`, `setColumnOrder`, `setColumnResizing`, `setShowColumnFilters`, `refs.filterInputRefs` identical; providers stFilterModesFeature (`mrtFilterModesFeature.ts:84, 96`) and stRefsFeature (`mrtRefsFeature.ts:12, 51`). | 61-65, 91, 108, 116-119, 124-125 | 54-58, 84, 101, 109-112, 117-118 | move provider | P01 |
| types | MRT writes `columnDef._filterFn!` in `handleClearFilter`; ours has none. Needed only if the column def here is typed through the optional stConfigFeature `_filterFn` (2.11). | 115 | 108 | align after P01 types if the compiler asks | P03 |

**`menus/ST_FilterOptionMenu.tsx` / `components/menus/MRT_FilterOptionMenu.tsx`**

| Kind | Finding | Ours | MRT | Action | Phase |
| --- | --- | --- | --- | --- | --- |
| structure | `table` prop (120), destructured (130), passed to `ST_ActionMenuItem` (319; base 326); MRT context (126), props without table (108-116), children propless (279-287). | 112-121, 123-132, 319 | 108-116, 118-126, 279-287 | keep (D1) | P03 |
| setter | `setColumnFilterFns`, `setGlobalFilterFn` identical; provider stFilterModesFeature (`mrtFilterModesFeature.ts:84, 90`). | 142-143, 178, 182-185 | 137-138, 172, 175-178 | move provider | P01 |
| types | Filter-option string casts differ (MRT `MRT_FilterOption` and `MRT_InternalFilterOption`, `types.ts:395, 400-405`; ours `types.ts:793, 799-804`). Base map cast at 324. | 200, 215, 221, 317 | 193, 207, 212, 284 | align | P03 |

**`menus/ST_RowActionMenu.tsx` / `components/menus/MRT_RowActionMenu.tsx`**

| Kind | Finding | Ours | MRT | Action | Phase |
| --- | --- | --- | --- | --- | --- |
| structure | `table` prop, forwarded to `ST_ActionMenuItem`; MRT context, children propless. | 22-30, 32-51, 60-66 | 10-18, 20-40, 46-51 | keep (D1) | P03 |

**`menus/ST_ShowHideColumnsMenu.tsx` / `components/menus/MRT_ShowHideColumnsMenu.tsx`**

| Kind | Finding | Ours | MRT | Action | Phase |
| --- | --- | --- | --- | --- | --- |
| structure | Generic props with `table`, forwarded to the items (185); MRT props non-generic, component `TData = MRT_RowData`, context, items propless. | 18-24, 26-32, 185 | 16-20, 22-29, 173-180 | keep (D1) | P03 |
| setter | Hide all and show all toggle column by column; MRT reduces into one map and calls `table.setColumnVisibility` once. Type the accumulator `ST_VisibilityState` (`types.ts:148`; MRT names it `MRT_ColumnVisibilityState`). | 53-57 | 11, 51-60 | align | P03 |
| feature-api | `getDefaultColumnOrderIds(table.options)` works only because `options.state` is patched today (`useST_TableInstance.ts:277-289`, Pick at `types.ts:378-402`); MRT passes `{ ...table.options, state }` (`types.ts:299-302`). | 147-151 | 138-148 | align after P02 | P03 |

**`menus/ST_ShowHideColumnsMenuItems.tsx` / `components/menus/MRT_ShowHideColumnsMenuItems.tsx`**

| Kind | Finding | Ours | MRT | Action | Phase |
| --- | --- | --- | --- | --- | --- |
| structure | `table` prop passed to `ST_GrabHandleButton`, `ST_ColumnPinningButtons` and the recursive items; MRT context, all three propless. | 29-37, 39-49, 148, 155, 192 | 18-26, 28-36, 135-138, 144, 179-186 | keep (D1) | P03 |

### 2.8 Buttons

All 13 pair 1:1, none in base-diff (edit radix, copy to base). Cluster note: every state read
(EditActionButtons 41/38, ExpandAllButton 46/25, ExpandButton 49/34, ToggleDensePadding
25/20, ToggleFilters 25/20, ToggleFullScreen 26/21, ToggleGlobalFilter 26/22,
ToggleRowActionMenu 49/53, ours/MRT) is `table.state` on both sides and stays (D2).

| File (ours / MRT `components/buttons/`) | Kind | Finding | Ours | MRT | Action | Phase |
| --- | --- | --- | --- | --- | --- | --- |
| `ST_ColumnPinningButtons` | structure | `table` prop versus `useMRTContext<TData>()`. | 18, 24 | 19 | keep (D1) | P03 |
| `ST_CopyButton` | structure | `table` prop versus context; option reads match. | 22, 27 | 21 | keep (D1) | P03 |
| `ST_EditActionButtons` | structure | `table` prop versus context. | 16, 22-40 | 11-23 | keep (D1) | P03 |
| `ST_EditActionButtons` | setter | `setCreatingRow(null)`, `setEditingRow(null)` unchanged; MRT `table_setCreatingRow` and `table_setEditingRow` typed `Updater` (`mrtEditingFeature.ts:33-39, 82-110`), ours aliases typed `Dispatch` (`useST_TableInstance.ts:311-329`, `types.ts:352, 357`). | 38-39, 49, 52, 73, 80 | 35-36, 46, 49, 68, 75 | move provider | P01 |
| `ST_EditActionButtons` | feature-api | `refs.editInputRefs.current` unchanged; MRT `mrtRefsFeature.ts:11, 50`, ours `useST_TableInstance.ts:59, 297-300`. | 37, 60 | 34, 56 | move provider | P01 |
| `ST_EditActionButtons` | state-read | creatingRow, editingRow, isSaving reads kept; owners stEditingFeature (`mrtEditingFeature.ts:70-72`) and stLoadingFeature (`mrtLoadingFeature.ts:5, 29`); ours useState (`useST_TableInstance.ts:98, 136`) injected at 185-207, isSaving user-supplied only. | 41 | 25, 38 | move provider | P01 |
| `ST_EditActionButtons` | types | `row._valuesCache = {} as any`, `as object` and `@ts-expect-error` exist because `ST_Row` re-types `_valuesCache` (`types.ts:754-764`); MRT writes them uncast (`types.ts:376`). Collapse `ST_Row` in P01, remove the casts in P03. | 54-55, 65, 67-68 | 51, 61, 63 | align | P01 then P03 |
| `ST_ExpandAllButton` | structure | Generic with `table`; MRT non-generic `extends IconButtonProps {}`, context. | 25-31 | 8-11 | keep (D1) | P03 |
| `ST_ExpandButton` | structure | `table` prop versus context; row APIs match. | 31, 37-48 | 11-22 | keep (D1) | P03 |
| `ST_GrabHandleButton` | structure | Generic with `table`; MRT non-generic, context. | 27-38 | 9-20 | keep (D1) | P03 |
| `ST_RowPinButton` | structure | `table` prop versus context. | 16, 22 | 24 | keep (D1) | P03 |
| `ST_ShowHideColumnsButton` | structure | Generic with `table`, passed to `ST_ShowHideColumnsMenu` (52); MRT non-generic, context, menu propless. | 13, 17, 52 | 9, 14, 41-44 | keep (D1) | P03 |
| `ST_ToggleDensePaddingButton` | structure | Generic with `table`; MRT non-generic, context. | 9-15 | 6-11 | keep (D1) | P03 |
| `ST_ToggleDensePaddingButton` | setter | `setDensity(nextDensity)` unchanged; MRT `table_setDensity` `Updater` (`mrtDensityFeature.ts:25, 68`), ours alias (`useST_TableInstance.ts:124, 322`, `types.ts:353`). | 23, 34 | 18, 29 | move provider | P01 |
| `ST_ToggleFiltersButton` | structure | Generic with `table`; MRT non-generic, context. | 9-15 | 6-11 | keep (D1) | P03 |
| `ST_ToggleFiltersButton` | setter | `setShowColumnFilters` unchanged; MRT `mrtFilterModesFeature.ts:32, 96`, ours `useST_TableInstance.ts:175, 339-340`. | 23, 28 | 18, 23 | move provider | P01 |
| `ST_ToggleFullScreenButton` | structure | Generic with `table`; MRT non-generic, context. | 10-16 | 7-12 | keep (D1) | P03 |
| `ST_ToggleFullScreenButton` | setter | `setIsFullScreen` unchanged; MRT `mrtFullScreenFeature.ts:24, 62`, ours `useST_TableInstance.ts:151, 335-336`. | 24, 32 | 19, 27 | move provider | P01 |
| `ST_ToggleGlobalFilterButton` | structure | Generic with `table`; MRT non-generic, context. | 9-15 | 6-11 | keep (D1) | P03 |
| `ST_ToggleGlobalFilterButton` | setter | `setShowGlobalFilter` unchanged; MRT `mrtFilterModesFeature.ts:33, 104`, ours `useST_TableInstance.ts:178, 341-342`. | 24, 29 | 20, 25 | move provider | P01 |
| `ST_ToggleGlobalFilterButton` | feature-api | `searchInputRef.current?.focus()` unchanged; MRT `mrtRefsFeature.ts:14, 53`, ours `useST_TableInstance.ts:61, 297-302`. | 23, 30 | 19, 26 | move provider | P01 |
| `ST_ToggleRowActionMenuButton` | structure | `table` prop forwarded to `ST_EditActionButtons` (77) and `ST_RowActionMenu` (120); MRT context, both children without table (81, 112-118). | 26, 33, 77, 120 | 24-38, 81, 112-118 | keep (D1) | P03 |
| `ST_ToggleRowActionMenuButton` | setter | `setEditingRow({ ...row })` (v8 shape, from init commit 7633f11); MRT v9 passes the row reference `setEditingRow(row)` as its other callers do (`MRT_EditCellTextField.tsx:70`). | 68 | 72 | align | P03 |
| `ST_ToggleRowActionMenuButton` | setter | `setEditingRow` provider: useState alias (`useST_TableInstance.ts:136, 329`, `types.ts:357`) versus `table_setEditingRow` (`mrtEditingFeature.ts:39, 98`). | 46 | 50 | move provider | P01 |

### 2.9 Modals

**`modals/ST_EditRowModal.tsx` / `components/modals/MRT_EditRowModal.tsx`** (base-diff:
Base UI differs only in `onOpenChange` arity, 73-74 and 85)

| Kind | Finding | Ours | MRT | Action | Phase |
| --- | --- | --- | --- | --- | --- |
| structure | Generic props with `table` (rendered from `ST_TableContainer.tsx:112`), passes `table={table as any}` to `ST_EditCellTextField` (67); MRT non-generic props, `TData` default, context, rendered `open` from `MRT_TableContainer.tsx:99`, children read context. Under D1 (b) or (c) this file, its two children and the container change together and the `as any` goes. | 21-33, 67 | 13-21, 49, 98 | keep (D1) | P03 |
| state-read | `{ creatingRow, editingRow } = table.state` read kept. Ours: useState atoms (`useST_TableInstance.ts:98-100, 136-138`) folded into options.state (185-207) and into `table.state` by the selector (288), typed via `ST_TableState` (`types.ts:404-427`). MRT: `mrtEditingFeature` `getInitialState` (69-74) and `TableState_FeatureMap` (46-48), surfaced by the full-state selector. | 47 | 22, 36 | move provider | P01 |
| setter | `setCreatingRow(null)`, `setEditingRow(null)` unchanged. Ours: hand-rolled aliases with the `true` sugar resolved before the call (`useST_TableInstance.ts:311-319, 329`), typed `Dispatch` (`types.ts:352, 357`). MRT: `assignTableAPIs` in `mrtEditingFeature.ts:80-105` (`true` sugar inside the updater, 86-88), typed `Updater` (29-40) via `Table_FeatureMap` (55-60). | 44-45, 77, 80 | 33-34, 58, 61 | move provider and type | P01 |
| options | `onCreatingRowChange` and `onEditingRowChange`: ours default at call time with `??` to a local setter; MRT defaults them once in `getDefaultTableOptions` with `makeStateUpdater` (`mrtEditingFeature.ts:75-79`), so the option always exists and writes the core atom. | 77, 80 | 58, 61 | align in stEditingFeature | P01 |
| types | The six options read here (`stCreateRowModalProps`, `stEditRowDialogProps`, `onCreatingRowCancel`, `onEditingRowCancel`, `renderCreateRowDialogContent`, `renderEditRowDialogContent`) are declared on `ST_TableOptions` (`types.ts:982-999, 1183-1200, 1256-1268`); MRT declares the twins in `mrtConfigFeature.ts:196-201, 208-213, 392-395, 402-405, 449-453, 458-462`. Names stay. | 36-42 | 25-31 | align declarations | P01 |
| types | `row._valuesCache = {} as any` plus eslint-disable because `ST_Row` re-types `_valuesCache` (`types.ts:754-770`); MRT uncast (`types.ts:376`). | 48, 82-83 | 37, 63 | align | P01 then P03 |
| types | `columnDef.columnDefType` declared on `ST_ColumnDef` (`types.ts:484-486`); MRT via `ColumnDef_FeatureMap` (`mrtConfigFeature.ts:554-556`). Filter line stays. | 60 | 48 | align declarations | P01 |
| types | `ST_TableInstance` is the Omit-and-retype at `types.ts:292-366` (setters 350-365, options 336, state via `ST_TableState`); MRT `Omit<ReactTable<MRT_Features, TData>, 'options' \| 'state'>` plus narrowed options and state (`types.ts:278-286`). After the collapse the file type-checks without the `as any` at 67, under any D1 answer. | 26, 51-53 | 21, 40-42 | align | P01 |

### 2.10 Display columns

Seven pairs, none in base-diff. Getter signatures, option reads, `defaultDisplayColumnProps`
spread order and `ST_DefaultDisplayColumn` reuse already match.

**`hooks/display-columns/getST_RowNumbersColumnDef.tsx` / `getMRT_RowNumbersColumnDef.tsx`**

| Kind | Finding | Ours | MRT | Action | Phase |
| --- | --- | --- | --- | --- | --- |
| state-read | Ours bakes `pageIndex`, `pageSize` from `tableOptions.state.pagination` into the column def at build time and the Cell closes over them; MRT reads `table.atoms.pagination.get()` (15) inside Cell, so prepared columns stay stable across page changes once column preparation is memoized (`useMRT_TableInstance.ts:137-171`, see 2.11). Our Cell prop type already carries `table` (`types.ts:468-477`); only the Cell body changes. | 12-20 | 14-21 | align | P03 |

**`hooks/display-columns/getST_RowExpandColumnDef.tsx` / `getMRT_RowExpandColumnDef.tsx`**

| Kind | Finding | Ours | MRT | Action | Phase |
| --- | --- | --- | --- | --- | --- |
| types | `table.getColumn(...)` used without `!` because ours narrows `getColumn` (`types.ts:300, 322`); MRT asserts with `!` against core's `Column \| undefined` (`types.ts:278-285`). Resolves with the 1.6.5 collapse. | 41, 66 | 49, 74 | align after P01 types | P03 |
| structure | Passes `table` into `expandButtonProps` and to `ST_ExpandAllButton`; MRT passes `{ row, staticRowIndex }` and a propless `MRT_ExpandAllButton`. | 33, 61 | 35, 69 | keep (D1) | P03 |

| File | Kind | Finding | Ours | MRT | Action | Phase |
| --- | --- | --- | --- | --- | --- | --- |
| `getST_RowActionsColumnDef.tsx` | structure | Passes `table` to `ST_ToggleRowActionMenuButton`; MRT Cell destructures `{ cell, row, staticRowIndex }` only. | 13-19 | 13-18 | keep (D1) | P03 |
| `getST_RowDragColumnDef.tsx` | structure | Passes `table` to `ST_TableBodyRowGrabHandle`; MRT Cell `{ row, rowRef }` only (handle reads context, `MRT_TableBodyRowGrabHandle.tsx:20`). | 14-19 | 14-18 | keep (D1) | P03 |
| `getST_RowPinningColumnDef.tsx` | structure | Passes `table` to `ST_TableBodyRowPinButton`; MRT `({ row }) => <MRT_TableBodyRowPinButton row={row} />`. | 13-15 | 13 | keep (D1) | P03 |
| `getST_RowSelectColumnDef.tsx` | structure | Passes `table` to `ST_SelectCheckbox` in Cell and Header; MRT Cell `{ row, staticRowIndex }`, Header `() => <MRT_SelectCheckbox />`. | 15-25 | 15-21 | keep (D1) | P03 |

Zero divergences: `getST_RowSpacerColumnDef.tsx` (only `style` versus `sx`, markup).

### 2.11 Hooks and types

None of these files is in base-diff; every row applies to both trees.

**`hooks/useST_TableInstance.ts` / `hooks/useMRT_TableInstance.ts`** (MRT also
`hooks/mrtTableHook.ts` and the feature files)

| Kind | Finding | Ours | MRT | Action | Phase |
| --- | --- | --- | --- | --- | --- |
| state-read | 20 slices held in React `useState`: 16 ST-only (each gets a feature base atom through `getInitialState`) and 4 core (columnOrder 117, columnResizing 120, grouping 142, pagination 154) that stock features already own. MRT's hook holds no state. | 95-183 | 42-47 | drop (move to features) | P01, P02 |
| state-read | Hook writes those slices into `definedTableOptions.state` (controlled state, 20 keys, includes draggingColumn 192 and hoveredColumn 198, so feature atoms would never own them) and the selector spreads `options.state` over the store (288). MRT builds `stateForTransforms` from defaults, initialState, `options.state` and the previous render's `tableRef.current.state`, never passes ST-only slices as controlled state, and uses an identity selector (253). react-table 9.3.1 `useTable` already publishes a user `options.state` into base atoms (`dist/useTable.js` `table_publishExternalState`). | 185-211, 288 | 105-135, 245-254 | replace with tableRef-fed `stateForTransforms` and identity selector | P02 |
| feature-api | `useTable` with `features: stFeatures` per call; MRT `useAppTable` from `createTableHook` (features bound once), cast to `MRT_TableInstance`. | 277-287 | 18, 245-254 | align | P02 |
| setter | 16 setter aliases (`options.onXChange ?? useState setter`) Object.assigned onto the instance; in v9 each feature's `getDefaultTableOptions` defaults `onXChange` to `makeStateUpdater` and `constructTableAPIs` assigns `table.setX`. | 294-347 | 42-47 | drop | P02 |
| setter | Alias semantics differ from MRT: aliases pass a value, not an updater; `setCreatingRow` resolves `true` to `createRow(table)` only when the argument itself is `true` (a functional updater returning `true` stores literal `true`), then `onCreatingRowChange?.(row) ?? _setCreatingRow(row)` also runs the internal setter after a void user handler. MRT runs `functionalUpdate` first, maps `true` inside the updater, and always routes through `options.onXChange` (`mrtEditingFeature.ts:75-104, 82-91`; `mrtCellActionsFeature.ts:67-78`). No current caller uses the updater form. Retype setters `(updater: Updater<T>) => void`. | 310-345 (types.ts 350-365) | `mrtEditingFeature.ts:75-104` | port MRT setter shape per feature | P01 |
| setter | Four core setters passed as explicit useState setters (`onColumnOrderChange`, `onColumnResizingChange`, `onGroupingChange`, `onPaginationChange`); MRT passes none. | 117-123, 142-144, 168-171, 279-282 | 245-254 | drop | P02 |
| other | `mounted` ref plus `onPaginationChange` guard against the `autoResetPageIndex` microtask firing before mount under React 19. MRT has none because pagination is a stock base atom, so the microtask updates the store. | 157-171, 282 | 52-54 (none) | remove with the pagination useState; verify grouping and sorting stories on both bases | P02 |
| feature-api | 11 refs created with `useRef` and attached as `table.refs`; MRT's `mrtRefsFeature` assigns plain `{ current }` objects in `constructTableAPIs` (12 keys, incl. `lastSelectedRowId`, not added here per the recorded range-selection decision; `tablePaperRef` maps to `tableLayoutRef`). Seed `tableHeadCellRefs` with `{ current: {} }`, not MRT's `{ current: null }` (`mrtRefsFeature.ts:56`), which never registers a head cell even with the guard. | 57-67, 297-309 | `mrtRefsFeature.ts:45-61` | drop here, add stRefsFeature | P01, P02 |
| structure | initialState: columnFilterFns is a separate useState; MRT computes it into `initialState.columnFilterFns` (overriding the feature `{}` default) and narrows `globalFilterFn` to a string (`'fuzzy'` for a raw FilterFn, 90-95). | 70-93, 101-116 | 62-103 | align | P02 |
| structure | columnFilterFns precedence is inverted: ours lets `col.filterFn` win over `initialState.columnFilterFns[id]` (108-113); MRT starts from initialState and fills only missing ids (65-79). Users passing both get different filters. | 101-116 | 62-79 | align to MRT order; check filter-mode stories | P02 |
| other | `initialState.columnPinning` partial normalized to `{ start: [], end: [] }`; MRT lacks it. Still needed on 9.3.1: `columnPinningFeature.js:16-23` re-spreads the raw partial after the defaults, leaving `end` undefined. | 82-89 | 62-97 (none) | keep, tracker line, consider upstream issue | P02 |
| structure | Column preparation: MRT gates `prepareColumns` on a 30-entry `columnPreparationDeps` list compared with `Object.is` (140-179) and freezes only when `columnDefsRef` already holds columns (180-186); ours reruns every render unless resizing or dragging (215-243), so the column array identity changes on pagination and other state. | 213-244 | 137-213 | align | P02 |
| structure | Mutates the incoming options in place (initialState 93, state 185, columns 215, data 247) and assigns skeleton data back onto `statefulTableOptions.data`; MRT builds `optionsForTransforms` and passes `columns`, `data`, `initialState`, `globalFilterFn` as fresh fields (only `initialState` via a cast, 99-103). | 93, 185, 215, 247-272, 283 | 99-103, 132-135, 216-252 | align | P02 |
| state-read | Option-time transforms read isLoading, showSkeletons, `pagination.pageSize`, `columnResizing.isResizingColumn`, draggingColumn, draggingRow from the controlled `options.state` it just built, so client-only slices are undefined unless passed; MRT seeds `transformStateDefaults` for exactly these keys (114-124) then overlays initialState, `options.state` and the previous table state (125-130). | 216-218, 249-254 | 114-130 | copy the `transformStateDefaults` key set | P02 |
| structure | No `tableRef`; MRT keeps `tableRef.current = table` so the next render's transforms read the previous full state. | 294-351 | 52, 129, 256 | add | P02 |
| options | Resolves `globalFilterFn` to a function from `options.filterFns` before `useTable`; MRT passes the string. For built-in names this is redundant (core resolves from `_rowModelFns`, `globalFilteringFeature.utils.js:45-50`, and ours registers `ST_FilterFns` at `tanstack.features.ts:62`); for user-supplied names it is the D3 path. | 285-286 | 251 | align per D3 | P02 |
| structure | MRT binds features once with `createTableHook` and exports `useAppTable`, `useTableContext`, `useCellContext`, `useHeaderContext`, `createAppColumnHelper` (zero callers in MRT) (20-31) plus `useMRTContext` (44-48, 57 call sites). Ours has no table hook. Add `hooks/stTableHook.ts` with the same exports plus `useSTContext`, importing from `features/stFeatures`; internal, not in `index.ts` (1.6.4). | 2, 38, 277 | `mrtTableHook.ts:2, 20-48` | add | P01 |

**`hooks/useST_TableOptions.ts` / `hooks/useMRT_TableOptions.ts`**

| Kind | Finding | Ours | MRT | Action | Phase |
| --- | --- | --- | --- | --- | --- |
| options | Destructures `aggregationFns`, `filterFns`, `sortFns` and merges built-ins with `useMemo` and empty deps (so later client changes are ignored); MRT removed all three (registries on `mrtFeatures`, client fns through `...rest`, `filterFns` and `sortFns` in `columnPreparationDeps`, `useMRT_TableInstance.ts:145-146`). | 38, 79, 102, 115-120, 169, 210, 241 | 98, 198-202, 224 | per D3 | P02 |
| options | Our-only `getRowCanExpand` default (renderDetailPanel or subRows). MRT sets none, and in v9 `row.getCanExpand()` is false without subRows (`rowExpandingFeature.utils.js:247-248`) so `row.toggleExpanded()` returns early (189-194): MRT's detail-panel rows without subRows never expand (`MRT_ExpandButton.tsx:42, 47`). Ours is the correct v9 behaviour. | 80, 98, 211-219, 237 | 203 | keep, recorded deviation; optional upstream report | P02 |
| options | MRT defaults `enableBatchRowSelection = true` (45, 165). Ours has no such option by the 2026-10-19 decision (native `enableRowRangeSelection`). | 47 (absent) | 45, 165 | keep absent | P02 |

**`hooks/useST_Effects.ts` / `hooks/useMRT_Effects.ts`**

| Kind | Finding | Ours | MRT | Action | Phase |
| --- | --- | --- | --- | --- | --- |
| state-read | Calls `getDefaultColumnOrderIds(table.options)`, which carries state only because the hook patches `options.state` (`useST_TableInstance.ts:185`); MRT passes `{ ...table.options, state }` (60-65). The `state` destructure versus `table.state` is cosmetic. | 13-27, 61-65 | 9-24, 58-67 | align with the options.state removal | P02 |

Zero divergences: `hooks/useShadcnTable.ts` (same composition, ours 9-12, MRT
`useMaterialReactTable.ts` 5-8), `hooks/useST_Rows.ts`, `hooks/useST_ColumnVirtualizer.ts`,
`hooks/useST_RowVirtualizer.ts` (same reads and deps; the `as any` casts at 93 and 79 are
type-only).

**`types.ts` / `types.ts`** (MRT also `features/mrtConfigFeature.ts`)

| Kind | Finding | Ours | MRT | Action | Phase |
| --- | --- | --- | --- | --- | --- |
| types | `ST_Features` imported from `utils/tanstack.features`; MRT from `./features/mrtFeatures`. | 54 | 32 | align | P01 |
| types | No `declare module '@tanstack/react-table'` anywhere in our tree. MRT augments `Plugins` in 11 feature files; `TableState_FeatureMap` in 9 (CellActions, ColumnDragging, Density, Editing, FilterModes, FullScreen, Loading, RowDragging, Toolbars); `TableOptions_FeatureMap` in 9 (Config plus all of the previous except Loading); `Table_FeatureMap` in 9 (previous list minus Loading, plus Refs); `ColumnDef_FeatureMap` in Config only (83). No row, column, cell or header map anywhere. | 1-54 | `mrtConfigFeature.ts:73-90`, `mrtDensityFeature.ts:28-47` | add per feature | P01 |
| types | `ST_TableInstance` omits 20 core getters plus `options` (21 keys, 294-314), retypes them to ST wrappers, narrows `state` through ReactTable's third generic (293), and adds refs (337-349) and 16 `Dispatch<SetStateAction>` setters (350-365) by hand. MRT: `Omit<ReactTable<MRT_Features, TData>, 'options' \| 'state'> & { options; state }`, refs and setters from feature maps. | 292-366 | 278-286 | collapse, keep name | P01 |
| types | `ST_TableState` extends `TableState<ST_Features>` and hand-lists 21 slices (`actionCell` optional); `ST_StatefulTableOptions.state` is a Pick of 19 keys. MRT: `MRT_TableState = TableState<MRT_Features>` (`actionCell` required in `mrtCellActionsFeature.ts:21`), `MRT_StatefulTableOptions` adds the full state. | 378-427 | 299-308 | collapse, keep names | P01 |
| types | `ST_DefinedTableOptions` omits and re-adds `icons`, `localization`; MRT adds `features: MRT_Features`, `icons`, `localization`, `mrtTheme` (ours drops `mrtTheme` by convention). | 368-376 | 288-297 | align | P01 |
| types | `ST_TableOptions` is a hand-written interface over `Omit<Partial<TableOptions<ST_Features, TData>>, 9 keys>` redeclaring `columns`, `data`, `defaultColumn`, `enableRowSelection`, `getRowId`, `globalFilterFn` (string only), `initialState`, `state`, and about 146 members. MRT: `Omit<TableOptions<MRT_Features, TData>, 'features'> & { features?: MRT_Features }` (no Partial) with 120 options in `MRT_TableOptions_Config` (`mrtConfigFeature.ts:92-512`) and the `onXChange` handlers in their own features. After the mui to st renaming every non-Props member type matches. | 824-1328 (header 825-836) | 424-427 | new `stConfigFeature.ts` with `ST_TableOptions_Config`; collapse to a thin alias, keep name | P01 |
| types | 16 `on*Change` handlers on `ST_TableOptions` belong to their owning features in MRT: FilterModes (`mrtFilterModesFeature.ts:23-26`), Editing (`mrtEditingFeature.ts:24-26`), RowDragging (21-22), CellActions (25), FullScreen (20), ColumnDragging (21-22), Density (21), Toolbars (20-21); config omits them (`mrtConfigFeature.ts:67-69`). | 1181-1216 | as listed | move to the owning st*Feature | P01 |
| types | MRT duplicates `enableDensityToggle` (`mrtConfigFeature.ts:125`) and `enableFullScreenToggle` (130), also declared by `mrtDensityFeature.ts:20` and `mrtFullScreenFeature.ts:19`, against its own comment (67-69). Declare each once, on stDensityFeature and stFullScreenFeature; defaults stay in `useST_TableOptions.ts:54, 60`. | 896, 901 | 125, 130 | align, tracker line | P01 |
| types | `ST_ColumnDef` is a hand-written interface (49 members) over `Omit<ColumnDef<...>, 10 keys>`; MRT `ColumnDef<MRT_Features, TData, TValue>` with 44 members in `MRT_ColumnDef_Config` (514-766). With the Omit gone, carry `cell?: never` (543-547) and an optional `_filterFn` (519-524) in `ST_ColumnDef_Config`; keep the required narrowing in `ST_DefinedColumnDef`. | 429-707, 720-728 | 310-313 | collapse, keep name | P01 |
| types | `ST_DisplayColumnDef` omits accessor keys, `ST_GroupColumnDef` requires `columns`; MRT plain alias and optional `columns?: ReadonlyArray`, plus `MRT_IdentifiedColumnDef`, `MRT_AccessorFnColumnDef`, `MRT_AccessorKeyColumnDef`, `MRT_AccessorColumnDef` that ours lacks. `ST_DefinedColumnDef` omits and re-adds where MRT intersects. | 708-727 | 315-357 | align, add the four types | P01 |
| types | `ST_Column`, `ST_Header`, `ST_HeaderGroup`, `ST_Row`, `ST_Cell` are Omit-and-retype wrappers and `ST_RowModel` is hand-declared; MRT aliases core types with `MRT_Features`. | 286-290, 729-779 | 263-266, 359-382 | align | P01 |
| types | Fn types use `ST_Features`; MRT types them on `StockFeatures` and casts the registries `as any`. Names `ST_AggregationOption`, `ST_AggregationFn`, `ST_AggregationFns` stay (MRT `MRT_RowAggregation*`). | 781-797 | 384-398 | keep generic form and names, tracker line | P01 |
| types | `ST_ColumnHelper`: `accessor` takes `ST_DisplayColumnDef` and returns `ST_ColumnDef` for both kinds, `display` and `group` return `ST_ColumnDef`, no `columns()`; MRT conditions param and return on the accessor kind, returns the specific def types and adds `columns<TColumns>()`. | 171-185 | 101-155 | align | P01 |
| types | Typed `aggregationFns?`, `filterFns?`, `sortFns?` table options; MRT declares none (core puts registries on `TableFeatures`, `TableFeatures.d.ts:151, 209, 250`), reads client fns untyped. Public, documented (`apps/docs/lib/prop-tables/tableOptions.ts:18, 762, 2044`). | 840-843, 923, 1323 | `mrtConfigFeature.ts:92-512` | per D3 | P01 |
| types | `expandRowsFn` dead and absent from MRT. | 919 | none | per D5 | P01 |
| types | `enableBatchRowSelection` absent (recorded native range selection). | 824-1328 | `mrtConfigFeature.ts:112` | keep absent, tracker line | P01 |

### 2.12 Utils, fns and locales

Only `utils/style.utils.ts` is in base-diff (a comment at 149-151); no row differs per base.

**`index.ts` / `index.ts`**

| Kind | Finding | Ours | MRT | Action | Phase |
| --- | --- | --- | --- | --- | --- |
| structure | Re-exports `utils/tanstack.features` (`stFeatures`, `ST_Features`); MRT exports neither `mrtFeatures` nor `mrtTableHook`. After the move, the export points at `features/stFeatures.ts` or goes; docs path and counts change either way (15 features and 8 row models become 17 stock plus 11 custom and 9 row models). | 4 | 1-22 | per D4 | P01, Final |
| other | Exports our-only `toolbar/useST_MediaQuery`, `ST_Tooltip`, `table/ST_TableLayout` (MRT exports `MRT_TablePaper` at 83). | 18, 28, 86 | 15-25, 79-83 | keep | P04 |

**`utils/tanstack.helpers.ts` / `utils/tanstack.helpers.ts`**

| Kind | Finding | Ours | MRT | Action | Phase |
| --- | --- | --- | --- | --- | --- |
| feature-api | `createSRTColumnHelper` lacks `columns()` and the accessor-kind typing: ours `accessorKey` branch lacks MRT's `as any` cast (MRT 50-53), `display` and `group` cast in the impl where MRT is identity (59-60). Lands with the `ST_ColumnHelper` types row. | 26-44 | 40-62 | align | P01 |
| types | `createRow` passes explicit `<ST_Features, TData>` generics with a type-only `ST_Features` import; MRT calls `constructRow(table as any, ...)` untyped (9.3.1 infers from the table). Drop the generics and the import: twin shape, and the file then no longer depends on `utils/tanstack.features.ts`. Behaviour identical. | 15, 46-68 | 64-86 | align | P01 |
| types | `table.options.columns` passed uncast to `getAllLeafColumnDefs`; MRT casts `as any` (78). Needed once options columns are `ColumnDef<ST_Features, TData, any>[]`. | 60 | 78 | align | P01 |
| other | Exported as `createSRTColumnHelper` (pre-rename prefix; map gives `createSTColumnHelper`). Public via `index.ts:5`. | 26 | 40 | keep name, tracker line | P04 |

**`utils/column.utils.ts` / `utils/column.utils.ts`**

| Kind | Finding | Ours | MRT | Action | Phase |
| --- | --- | --- | --- | --- | --- |
| feature-api | `prepareColumns` resolves string `aggregationFn` against `tableOptions.aggregationFns` and turns an array `aggregationFn` into `constructAggregationFn`; MRT dropped both (resolves only through the `mrtFeatures` registry, 72), so the array column form (`types.ts:467`) is our-only. | 46, 65-80 | 54-59, 73-83 | per D3 | P02 |
| types | Destructures `filterFns`, `sortFns`, `aggregationFns` from typed `ST_DefinedTableOptions`; MRT reads them off `tableOptions as any`. | 45-51 | 51-59 | per D3 | P02 |
| types | Reads and writes `id`, `accessorKey`, `header`, `columns`, `columnDefType`, `_filterFn` directly on `ST_ColumnDef`; MRT views the def `as any` because `MRT_ColumnDef` is the core union. Changes only if `ST_ColumnDef` collapses to the core union (it does, 2.11). | 16-36, 52-101 | 15-42, 60-91 | align after P01 types | P02 |
| options | `getColumnFilterInfo` returns a shared empty Map unless `enableFacetedValues` (v8 behaviour); MRT always calls `getFacetedUniqueValues()` while still declaring the option (`mrtConfigFeature.ts:128`, default false at `useMRT_TableOptions.ts:56`). Same gate as `ST_FilterRangeSlider`. | 132, 142, 167-171 | 129-131, 155 | keep, tracker line | P02 |

**`utils/row.utils.ts` / `utils/row.utils.ts`**

| Kind | Finding | Ours | MRT | Action | Phase |
| --- | --- | --- | --- | --- | --- |
| feature-api | Shift range selection: ours delegates to stock `row.getToggleSelectedHandler()` (`enableRowRangeSelection` default true, `rowSelectionFeature.js:26-28`); MRT keeps `refs.lastSelectedRowId`, `enableBatchRowSelection`, a pagination-offset walk and clears the ref on select-all (156-214, 244, 253). Stock already clears its anchor on select-all and reset (`rowSelectionFeature.utils.js:45, 63, 92`). | 141-199 | 139-254 | keep stock path (recorded 2026-10-19), tracker line | P01 |
| state-read | Diffs `table.baseAtoms.rowSelection.get()` before and after the toggle to collect changed ids; `baseAtoms` is the internal writable atom (read precedence is `options.atoms` over `options.state` over `baseAtoms`, `coreTablesFeature.types.d.ts:33, 179`), so a controlled `rowSelection` can be missed. The only `baseAtoms` read in the tree; no MRT counterpart. Read `table.atoms.rowSelection.get()` instead. | 164, 170 | 173-175 | align | P01 |
| types | `creatingRow` inserted uncast because `types.ts:408` types it `ST_Row<TData> \| null`; MRT casts `as MRT_Row<TData>` because the feature types it `Row<any, any> \| null` (`mrtEditingFeature.ts:18`). | 76 | 73 | align if stEditingFeature mirrors the slice type | P01 |

**`utils/style.utils.ts` / `utils/style.utils.ts`**

| Kind | Finding | Ours | MRT | Action | Phase |
| --- | --- | --- | --- | --- | --- |
| other | `getCommonSRTCellStyles` name (stale `SRT`); rename to `getCommonSTCellStyles` with its call sites in head and body. Reads of draggingColumn and hoveredColumn from `table.state` match. Base-diff file: edit both trees. | 40, 51-54 | 101-105 | align | P03 |

**`utils/utils.ts` / `utils/utils.ts`**

| Kind | Finding | Ours | MRT | Action | Phase |
| --- | --- | --- | --- | --- | --- |
| other | Our-only ports of MUI `debounce` (25-49) and `createFilterOptions` (51-111); MRT's file holds only `parseFromValuesOrFunc` and `getValueAndLabel`, both matching ours (3-23). MRT v9 uses `@tanstack/react-pacer` for debounce and MUI Autocomplete filtering; the swap question belongs to the two input files (2.6). | 25-111 | 1-23 | keep | P04 |

**fns**

| File | Kind | Finding | Ours | MRT | Action | Phase |
| --- | --- | --- | --- | --- | --- | --- |
| `fns/sortFns.ts` / `fns/sortingFns.ts` | other | Name kept (1.6.8). Ours builds `fuzzy` with the v9 `constructSortFn({ sort })` builder; MRT keeps a plain `(rowA, rowB, columnId)` function on `Row<StockFeatures>` with `as any` casts. Keep the builder. | 8-20 | 7-23 | keep | P01 |
| `fns/aggregationFns.ts` | types | Registry `ST_AggregationFns` versus `MRT_RowAggregationFns`; 1.6.5 forbids renaming public types. | 3 | 3 | keep name, tracker line | P01 |
| `fns/filterFns.ts` | types | Filter fns generic on `<TFeatures, TData>` with optional `addMeta`; MRT on `Row<StockFeatures, TData>`, `addMeta` required. Bodies and registry identical (ours 193-209, MRT 178-194). The generic form lets `stFeatures` skip the `as any` casts. | 13-18 | 7-12 | keep | P01 |

**locales**

| File | Kind | Finding | Ours | MRT | Action | Phase |
| --- | --- | --- | --- | --- | --- | --- |
| `locales/fr.ts` | other | `noRecordsToDisplay`: ours "Aucun enregistrement à afficher", MRT "Aucune entrée à afficher"; the only value drift. | 61 | 61 | align | P04 |

Zero divergences: `utils/cell.utils.ts` (same option reads, refs, setters, row and column
APIs; ours 1-234, MRT 1-231), `utils/displayColumn.utils.ts` (type-level deltas at ours 28
and 136 follow from `types.ts`), `utils/virtualization.utils.ts`, and 37 locales: `ar`,
`az`, `bg`, `cs`, `da`, `de`, `el`, `en`, `es`, `et`, `fa`, `fi`, `he`, `hr`, `hu`, `hy`,
`id`, `it`, `ja`, `ko`, `nl`, `no`, `np`, `pl`, `pt`, `pt-BR`, `ro`, `ru`, `sk`, `sr-Cyrl-RS`,
`sr-Latn-RS`, `sv`, `tr`, `uk`, `vi`, `zh-Hans`, `zh-Hant`.

## 3. State ownership map

Every piece of state, ref, setter and state-adjacent option our hooks hold today, and its
owner in MRT. "Held in" cites ours; "MRT ref" cites MRT. Paths without a folder in the MRT
column are under `features/`. Sorted by MRT owner: the eleven custom features and the bundle
first, then stock features, then hook-local or none. This is the work list for 1.6.3 and
1.6.6. Every entry applies to both trees.

| State | Held in (ours) | MRT owner | MRT ref | API note |
| --- | --- | --- | --- | --- |
| actionCell, setActionCell | `useST_TableInstance.ts:95-97` useState, options.state 186, alias 310; `types.ts:406` (optional), 350, option 1181 | mrtCellActionsFeature | `mrtCellActionsFeature.ts:63-66` initial, 67-69 `onActionCellChange` default, 70-78 `table_setActionCell` | `table.state.actionCell`, `table.setActionCell(updater)`; always routed through the option |
| draggingColumn, setDraggingColumn | `useST_TableInstance.ts:127-129`, options.state 192, alias 323-324, freeze read 217; `types.ts:410, 354`, option 1195 | mrtColumnDraggingFeature | `mrtColumnDraggingFeature.ts:64, 69, 74-79` | `table.state.draggingColumn`, `table.setDraggingColumn` |
| hoveredColumn, setHoveredColumn | `useST_TableInstance.ts:145-147`, options.state 198, alias 332-333; `types.ts:415, 359`, option 1210 | mrtColumnDraggingFeature | `mrtColumnDraggingFeature.ts:65, 70, 80-85` | `table.state.hoveredColumn`, `table.setHoveredColumn` |
| columnVirtualizerInstanceRef (option ref) | `useST_ColumnVirtualizer.ts:20, 117-120` | mrtConfigFeature (option only) | `mrtConfigFeature.ts:100`; written `hooks/useMRT_ColumnVirtualizer.ts:22, 118-121` | `options.columnVirtualizerInstanceRef`; identical hook body |
| rowVirtualizerInstanceRef (option ref) | `useST_RowVirtualizer.ts:25, 81-84` | mrtConfigFeature (option only) | `mrtConfigFeature.ts:505`; written `hooks/useMRT_RowVirtualizer.ts:27, 83-86` | `options.rowVirtualizerInstanceRef`; identical |
| enableBatchRowSelection option | none | mrtConfigFeature (type), default in options hook | `mrtConfigFeature.ts:112`; `hooks/useMRT_TableOptions.ts:45, 165`; `utils/row.utils.ts:156, 178` | not added: native range selection, recorded 2026-10-19 |
| density, setDensity | `useST_TableInstance.ts:124-126`, options.state 191, alias 322; `types.ts:409, 353`, option 1194; read `useST_Effects.ts:20, 104`, `useST_RowVirtualizer.ts:30, 52-53` | mrtDensityFeature | `mrtDensityFeature.ts:59-62, 63-65, 66-75`; `enableDensityToggle` at 20 | `table.state.density`, `table.setDensity`, options `onDensityChange`, `enableDensityToggle` |
| creatingRow, setCreatingRow | `useST_TableInstance.ts:98-100`, options.state 190, setter 311-319 (`true` resolved before the call); `types.ts:408, 352`, option 1187 | mrtEditingFeature | `mrtEditingFeature.ts:69-74, 76, 82-91` (`true` resolved inside the updater) | `table.state.creatingRow`, `table.setCreatingRow(updater or true)` |
| editingCell, setEditingCell | `useST_TableInstance.ts:133-135`, options.state 194, alias 327-328; `types.ts:412, 356`, option 1197 | mrtEditingFeature | `mrtEditingFeature.ts:71, 77, 92-97` | `table.state.editingCell`, `table.setEditingCell` |
| editingRow, setEditingRow | `useST_TableInstance.ts:136-138`, options.state 195, alias 329; `types.ts:413, 357`, option 1202 | mrtEditingFeature | `mrtEditingFeature.ts:72, 78, 98-103` | `table.state.editingRow`, `table.setEditingRow` |
| features passed per `useTable` call | `useST_TableInstance.ts:38, 284`; `utils/tanstack.features.ts:38-67` | mrtTableHook plus mrtFeatures | `hooks/mrtTableHook.ts:20-31`; `mrtFeatures.ts:43-75`; consumed `hooks/useMRT_TableInstance.ts:18, 245` | `useAppTable` binds the bundle once; `stTableHook.ts` replaces the per-call option |
| filterFns, sortFns, aggregationFns option merge | `useST_TableOptions.ts:115-120`, returned 169, 210, 241; consumed `utils/column.utils.ts:65-92`, `useST_TableInstance.ts:285-286` | mrtFeatures registries (core resolves names only there) | `mrtFeatures.ts:70-72`; `hooks/useMRT_TableOptions.ts:198-202` (merge removed); `utils/column.utils.ts:56-57` | core copies `features.filterFns` into `_rowModelFns` (`constructTable.js:26, 38-42`) and never reads `options.filterFns`; D3 |
| columnFilterFns, setColumnFilterFns | `useST_TableInstance.ts:101-116` useState seeded from column defs, options.state 187, alias 320-321; `types.ts:407, 351`, option 1182 | mrtFilterModesFeature (initial map built in the instance hook) | `mrtFilterModesFeature.ts:70` (`{}`), 77, 84-89; seeded `hooks/useMRT_TableInstance.ts:65-79` | `table.state.columnFilterFns`, `table.setColumnFilterFns`; precedence inverted (2.11) |
| globalFilterFn, setGlobalFilterFn | `useST_TableInstance.ts:81` initialState default (may be a function), 139-141 useState, options.state 196, alias 330-331, resolved 285-286; `types.ts:414, 358`, option 1209 | mrtFilterModesFeature | `mrtFilterModesFeature.ts:71, 78, 90-95`; narrowed `hooks/useMRT_TableInstance.ts:90-95`, string at 251 | `table.state.globalFilterFn`, `table.setGlobalFilterFn`; string resolved from the bundle registry |
| showColumnFilters, setShowColumnFilters | `useST_TableInstance.ts:175-177`, options.state 203, alias 339-340; `types.ts:421, 363`, option 1214 | mrtFilterModesFeature | `mrtFilterModesFeature.ts:72, 79, 96-103` | `table.state.showColumnFilters`, `table.setShowColumnFilters` |
| showGlobalFilter, setShowGlobalFilter | `useST_TableInstance.ts:178-180`, options.state 204, alias 341-342; `types.ts:422, 364`, option 1215 | mrtFilterModesFeature | `mrtFilterModesFeature.ts:73, 80, 104-109` | `table.state.showGlobalFilter`, `table.setShowGlobalFilter` |
| isFullScreen, setIsFullScreen | `useST_TableInstance.ts:151-153`, options.state 200, alias 335-336; `types.ts:417, 361`, option 1212; read `useST_Effects.ts:22, 43-58` | mrtFullScreenFeature | `mrtFullScreenFeature.ts:53-56, 57-59, 60-69`; `enableFullScreenToggle` at 19 | `table.state.isFullScreen`, `table.setIsFullScreen`, options `onIsFullScreenChange`, `enableFullScreenToggle` |
| isLoading | `types.ts:418` type only; arrives only through controlled options.state and the selector (`useST_TableInstance.ts:288`); read 249, 269, `useST_Effects.ts:23, 69` | mrtLoadingFeature | `mrtLoadingFeature.ts:28` (initial only, no setter); read `hooks/useMRT_TableInstance.ts:121, 218`, `useMRT_Effects.ts:20, 71` | controlled-only slice; needs a base atom so options.state syncs without the selector merge |
| isSaving | `types.ts:419` type only; read `buttons/ST_EditActionButtons.tsx:41`, `toolbar/ST_LinearProgressBar.tsx:35` | mrtLoadingFeature | `mrtLoadingFeature.ts:29` | controlled-only, default false |
| showLoadingOverlay | `types.ts:423` type only; read `table/ST_TableContainer.tsx:51-55` | mrtLoadingFeature | `mrtLoadingFeature.ts:30` | controlled-only, default false |
| showProgressBars | `types.ts:424` type only; read `toolbar/ST_LinearProgressBar.tsx:35, 42` | mrtLoadingFeature | `mrtLoadingFeature.ts:31` | controlled-only, default false |
| showSkeletons | `types.ts:425` type only; read `useST_TableInstance.ts:250, 270`, `useST_Effects.ts:25, 69` | mrtLoadingFeature | `mrtLoadingFeature.ts:32`; read `hooks/useMRT_TableInstance.ts:123, 218` | controlled-only, default false |
| actionCellRef | `useST_TableInstance.ts:57` useRef, exposed 298; `types.ts:338` | mrtRefsFeature | `mrtRefsFeature.ts:48` (type 9) | `table.refs.actionCellRef`; plain `{ current: null }` from `constructTableAPIs` |
| bottomToolbarRef | `useST_TableInstance.ts:58`, 299; `types.ts:339` | mrtRefsFeature | `mrtRefsFeature.ts:49` (type 10) | `table.refs.bottomToolbarRef` |
| editInputRefs | `useST_TableInstance.ts:59`, 300; `types.ts:340` | mrtRefsFeature | `mrtRefsFeature.ts:50` (type 11) | `table.refs.editInputRefs`; both `{ current: {} }` |
| filterInputRefs | `useST_TableInstance.ts:60`, 301; `types.ts:341` | mrtRefsFeature | `mrtRefsFeature.ts:51` (type 12) | `table.refs.filterInputRefs`; both `{ current: {} }` |
| lastSelectedRowId | none (stock anchor; `utils/row.utils.ts:161-170`) | mrtRefsFeature | `mrtRefsFeature.ts:52` (type 13); used `utils/row.utils.ts:162, 178-187, 214, 244, 253` | not added: core owns the anchor (`rowSelectionFeature.js:26-28`, `rowSelectionFeature.utils.js:427`), recorded 2026-10-19 |
| searchInputRef | `useST_TableInstance.ts:61`, 302; `types.ts:342` | mrtRefsFeature | `mrtRefsFeature.ts:53` (type 14) | `table.refs.searchInputRef` |
| tableContainerRef | `useST_TableInstance.ts:62`, 303; `types.ts:343`; read `useST_ColumnVirtualizer.ts:25, 70`, `useST_RowVirtualizer.ts:28, 63` | mrtRefsFeature | `mrtRefsFeature.ts:54` (type 15) | `table.refs.tableContainerRef` |
| tableFooterRef | `useST_TableInstance.ts:67`, 304; `types.ts:344` | mrtRefsFeature | `mrtRefsFeature.ts:55` (type 16) | `table.refs.tableFooterRef` |
| tableHeadCellRefs | `useST_TableInstance.ts:63` (initial `{}`), 305; `types.ts:345` | mrtRefsFeature | `mrtRefsFeature.ts:57` (type 17, initial `{ current: null }`) | seed `{ current: {} }` in stRefsFeature; MRT's null seed never registers a cell |
| tableHeadRef | `useST_TableInstance.ts:66`, 306; `types.ts:346` | mrtRefsFeature | `mrtRefsFeature.ts:56` (type 18) | `table.refs.tableHeadRef` |
| tableLayoutRef | `useST_TableInstance.ts:64`, 307; `types.ts:347`; read `table/ST_TableLayout.tsx:47, 64`, `body/ST_TableBody.tsx:53, 153`, `toolbar/ST_ToolbarAlertBanner.tsx:54, 148` | mrtRefsFeature (as `tablePaperRef`) | `mrtRefsFeature.ts:58` (type 19) | key stays `tableLayoutRef` (ST_TableLayout replaces MRT_TablePaper) |
| topToolbarRef | `useST_TableInstance.ts:65`, 308; `types.ts:348` | mrtRefsFeature | `mrtRefsFeature.ts:59` (type 20) | `table.refs.topToolbarRef` |
| draggingRow, setDraggingRow | `useST_TableInstance.ts:130-132`, options.state 193, alias 325-326, freeze read 218; `types.ts:411, 355`, option 1196; read `useST_RowVirtualizer.ts:30, 42-48` | mrtRowDraggingFeature | `mrtRowDraggingFeature.ts:62, 67, 72-77` | `table.state.draggingRow`, `table.setDraggingRow` |
| hoveredRow, setHoveredRow | `useST_TableInstance.ts:148-150`, options.state 199, alias 334; `types.ts:416, 360`, option 1211 | mrtRowDraggingFeature | `mrtRowDraggingFeature.ts:63, 68, 78-83` | `table.state.hoveredRow`, `table.setHoveredRow` |
| showAlertBanner, setShowAlertBanner | `useST_TableInstance.ts:172-174`, options.state 202, alias 337-338; `types.ts:420, 362`, option 1213 | mrtToolbarsFeature | `mrtToolbarsFeature.ts:56, 61, 66-71` | `table.state.showAlertBanner`, `table.setShowAlertBanner` |
| showToolbarDropZone, setShowToolbarDropZone | `useST_TableInstance.ts:181-183`, options.state 205, alias 343-345; `types.ts:426, 365`, option 1216 | mrtToolbarsFeature | `mrtToolbarsFeature.ts:57, 62, 72-79` | `table.state.showToolbarDropZone`, `table.setShowToolbarDropZone` |
| columnOrder, onColumnOrderChange | `useST_TableInstance.ts:72-80` initialState default, 117-119 useState, options.state 188, passed 279; `types.ts:383`; reset `useST_Effects.ts:61-65` | stock columnOrderingFeature | `columnOrderingFeature.js:9`; `hooks/useMRT_TableInstance.ts:81-89` (initialState default kept), 115; reset `useMRT_Effects.ts:58-67` | `table.state.columnOrder`, `table.setColumnOrder`; keep only the initialState default |
| initialState.columnPinning normalization | `useST_TableInstance.ts:82-89` | stock columnPinningFeature | `columnPinningFeature.js:16-23`; `hooks/useMRT_TableInstance.ts:62-97` (none) | still needed on 9.3.1 (trailing spread re-applies the partial); keep |
| columnResizing, onColumnResizingChange | `useST_TableInstance.ts:120-123`, options.state 189, passed 280, freeze read 216; `types.ts:384` | stock columnResizingFeature | `columnResizingFeature.js:9`; `hooks/useMRT_TableInstance.ts:116, 182` | `table.state.columnResizing`, `table.setColumnResizing`; drop the useState |
| grouping, onGroupingChange | `useST_TableInstance.ts:142-144`, options.state 197, passed 281; `types.ts:392` | stock columnGroupingFeature | `columnGroupingFeature.js:10`; `hooks/useMRT_TableInstance.ts:120, 150` | `table.state.grouping`, `table.setGrouping`; drop the useState |
| pagination, onPaginationChange | `useST_TableInstance.ts:154-156` useState, 168-171 guarded setter, options.state 201, passed 282, pageSize read 254; `types.ts:396`; read `useST_Effects.ts:24, 68-78`, `useST_Rows.ts:20, 34-35` | stock rowPaginationFeature | `rowPaginationFeature.js:9` (auto reset `rowPaginationFeature.utils.js:35-38`); `hooks/useMRT_TableInstance.ts:122, 221` | `table.state.pagination`, `table.setPagination`; drop the useState and the guard |
| options.state patch and full-state selector merge | `useST_TableInstance.ts:185-207` (20 keys), 210-211 cast, 288 selector; `types.ts:378-402` (Pick of 19) | none (feature atoms through `useAppTable`) | `hooks/useMRT_TableInstance.ts:105-135` (`stateForTransforms` from `tableRef`, not controlled), 253 identity selector | `useTable` already publishes a controlled `options.state` into base atoms (`dist/useTable.js`); both go once ST-only slices are atoms |
| mounted ref and `onPaginationChange` guard | `useST_TableInstance.ts:161-171`, passed 282 | none | `hooks/useMRT_TableInstance.ts:52-54` (no equivalent) | React 19 pre-mount guard; removable once pagination is a stock atom; verify grouping and sorting stories |
| getRowCanExpand default | `useST_TableOptions.ts:80, 214-218` | none | `hooks/useMRT_TableOptions.ts:203` (only `getSubRows`) | not state; ours-only v9 fix (comment 211-213), stays in the options hook |
| columnDefsRef | `useST_TableInstance.ts:214, 219, 244` (freeze 215-218) | none (hook-local in MRT too) | `hooks/useMRT_TableInstance.ts:53, 181, 187, 213` (freeze 180-184) | stays in the hook; MRT freezes only when the ref is non-empty |
| columnPreparationDepsRef | none | none (hook-local) | `hooks/useMRT_TableInstance.ts:54, 140-179, 186, 211` | add in P02: 30-entry dep list keeps prepared columns stable |
| tableRef | none | none (hook-local) | `hooks/useMRT_TableInstance.ts:52, 125-130, 256` | add in P02: previous render's state for option-time transforms |
| rerender (useReducer) | `useST_Effects.ts:32, 101` | none (hook-local) | `hooks/useMRT_Effects.ts:29, 103` | identical |
| initialBodyHeight (useRef) | `useST_Effects.ts:33, 38, 49` | none (hook-local) | `hooks/useMRT_Effects.ts:30, 35, 46` | identical |
| previousTop (useRef) | `useST_Effects.ts:34, 46, 50-55` | none (hook-local) | `hooks/useMRT_Effects.ts:31, 43, 47-52` | identical |
| appliedSort (useRef) | `useST_Effects.ts:81-86, 93` | none (hook-local) | `hooks/useMRT_Effects.ts:83-88, 95` | identical |

Totals: 11 refs move into stRefsFeature (`lastSelectedRowId` not added); 20 useState slices,
of which 16 go to 8 custom features (cellActions 1, editing 3, filterModes 4, density 1,
columnDragging 2, rowDragging 2, fullScreen 1, toolbars 2) and 4 to stock features; 5
controlled-only loading flags get stLoadingFeature atoms; the options.state patch, the
selector merge, the 16 setter aliases and the mounted guard have no MRT counterpart and go.

## 4. Our-only and MRT-only files

### 4.1 Our-only (5)

| File | Decision | Reason |
| --- | --- | --- |
| `table/ST_TableLayout.tsx` | keep | Role twin of `MRT_TablePaper.tsx` (same options, Escape handler, child order, ours 33-88, MRT 12-85); name and export (`index.ts:86`) stay per 1.6.8. Its divergences are in 2.1. |
| `ST_Tooltip.tsx` | keep | No MRT twin (MUI Tooltip inline); pure UI shim, reads no state or options (50-82). In base-diff, untouched by the rewrite. |
| `toolbar/useST_MediaQuery.ts` | keep | `matchMedia` hook replacing MUI `useMediaQuery` (MRT_BottomToolbar 3, 31; MRT_TopToolbar 2, 35-36; MRT_TablePagination 11, 37); no v9 API; public via `index.ts:18`. |
| `utils/pagination.utils.ts` | keep | Port of MUI `usePagination` consumed by `toolbar/ST_TablePagination.tsx:31, 205`; MRT renders MUI Pagination (`MRT_TablePagination.tsx:5-6`); no v9 state or API. |
| `utils/tanstack.features.ts` | drop | Replaced by `features/stFeatures.ts` (twin of `mrtFeatures.ts`). Ours lists 15 stock features by hand (39-53), registers no `coreRowModel` and no custom features; MRT spreads `...stockFeatures` (44), which adds `cellSelectionFeature` and `cellSpanningFeature` (`stockFeatures.js:25-43`) and their state and options members to `ST_TableState` and `ST_TableOptions`; registers `createCoreRowModel()` (56, runtime-neutral: core falls back to it, `coreRowModelsFeature.utils.js:16`); casts the registries `as any` (70-72), which ours can skip while the fn types stay generic. `autoResetCellSelection` runs only once the feature is registered and resets empty state. Importers to repoint: `index.ts:4`, `types.ts:54`, `utils/tanstack.helpers.ts:15`, `hooks/useST_TableInstance.ts:38`. |

Renamed pairs, not our-only: `ShadcnTable.tsx` (MRT `MaterialReactTable.tsx`),
`hooks/useShadcnTable.ts` (MRT `useMaterialReactTable.ts`), `fns/sortFns.ts` (MRT
`fns/sortingFns.ts`, name kept per 1.6.8).

### 4.2 MRT-only (15)

| File | Decision | Reason and what ours holds today |
| --- | --- | --- |
| `features/mrtCellActionsFeature.ts` | add `stCellActionsFeature` | actionCell state, `onActionCellChange` default, `table_setActionCell` (20-80). Ours: `useST_TableInstance.ts:95-97, 186, 310`; `types.ts:350, 406, 1181`. State type: MRT non-generic required `Cell<any, any, any> \| null` (15-22), setter `Updater` (28-35); ours optional generic and `Dispatch`. |
| `features/mrtColumnDraggingFeature.ts` | add `stColumnDraggingFeature` | draggingColumn, hoveredColumn, defaults, setters, 4 augmentations (15-88). Ours: `useST_TableInstance.ts:127-129, 145-147, 323-324, 332-333`; `types.ts:354, 359, 410, 415, 1195, 1210`. |
| `features/mrtConfigFeature.ts` | add `stConfigFeature` | Runtime no-op `{}` (71) carrying 120 table options (92-512) and 44 column-def members (514-766) through `TableOptions_FeatureMap` and `ColumnDef_FeatureMap` (73-90). Ours: `ST_TableOptions` (`types.ts:824-1328`, 146 members) and `ST_ColumnDef` (`types.ts:429-707`, 49 members); our extras are core re-declarations and the 17 `on*Change` handlers that belong to sibling features. Carry `cell?: never` and optional `_filterFn`; omit `enableDensityToggle` and `enableFullScreenToggle` (declared by their features), `enableBatchRowSelection` (recorded), and decide `expandRowsFn` (D5) and the fn registry options (D3). |
| `features/mrtDensityFeature.ts` | add `stDensityFeature` | density (`'comfortable'`, 59-62), `onDensityChange` via `makeStateUpdater` (63-65), `enableDensityToggle` and `onDensityChange` types (19-22), `table_setDensity` (66-75), 4 augmentations (28-47). Ours: `useST_TableInstance.ts:124-126, 191, 288, 322`; `types.ts:353, 386, 409, 896, 1194`. `ST_DensityState` (`types.ts:129`) stays in `types.ts` as MRT's does. |
| `features/mrtEditingFeature.ts` | add `stEditingFeature` | creatingRow, editingCell, editingRow, defaults, three setters with the `true` sugar inside the updater, 4 augmentations (17-106). Ours: `useST_TableInstance.ts:98-100, 133-138, 190, 194-195, 311-319, 327-329`; `types.ts:352, 356-357, 408, 412-413, 1187, 1197, 1202`. |
| `features/mrtFilterModesFeature.ts` | add `stFilterModesFeature` | columnFilterFns (`{}`, overridden by the hook's initialState), globalFilterFn (`'fuzzy'`), showColumnFilters, showGlobalFilter, defaults, four setters, 4 augmentations (15-112). Ours: `useST_TableInstance.ts:81, 101-116, 139-141, 175-180, 185-207, 285-288, 320-321, 330-331, 339-342`; `types.ts:351, 358, 363-364, 407, 414, 421-422, 1182, 1209, 1214-1215`. |
| `features/mrtFullScreenFeature.ts` | add `stFullScreenFeature` | isFullScreen (53-56), `onIsFullScreenChange` default (57-59), option types (18-21), `table_setIsFullScreen` (60-69), 4 augmentations (27-46). Ours: `useST_TableInstance.ts:151-153, 200, 335-336`; `types.ts:361, 395, 417, 901, 1212`. Default `enableFullScreenToggle = true` stays in the options hook on both sides. |
| `features/mrtLoadingFeature.ts` | add `stLoadingFeature` | `MRT_TableState_Loading` (3-9), `Plugins` and `TableState_FeatureMap` only (11-18), `getInitialState` defaulting isLoading, isSaving, showLoadingOverlay, showProgressBars, showSkeletons to false (26-34), no setters (controlled through `options.state`, comment 20-25). Ours: type only (`types.ts:418-419, 423-425`), no default, values only via the client spread (`useST_TableInstance.ts:206, 288`). |
| `features/mrtRefsFeature.ts` | add `stRefsFeature` | `MRT_TableRefs` (8-21), `Plugins` and `Table_FeatureMap` (28-36), 12 plain refs in `constructTableAPIs` (45-61). Ours: 11 `useRef` (`useST_TableInstance.ts:57-67, 297-309`, `types.ts:337-349`). Keys: `tableLayoutRef` instead of `tablePaperRef`; no `lastSelectedRowId` (recorded); `tableHeadCellRefs` seeded `{ current: {} }`. |
| `features/mrtRowDraggingFeature.ts` | add `stRowDraggingFeature` | draggingRow, hoveredRow, defaults (66-69), setters (70-85), 4 augmentations (35-54). Ours: `useST_TableInstance.ts:130-132, 148-150, 325-326, 334`; `types.ts:355, 360, 411, 416, 1196, 1211`. |
| `features/mrtToolbarsFeature.ts` | add `stToolbarsFeature` | showAlertBanner, showToolbarDropZone (14-17, 55-59), defaults (19-22, 60-63), setters (64-81), 4 augmentations (29-48). Ours: `useST_TableInstance.ts:172-174, 181-183, 202, 205, 337-338, 343-345`; `types.ts:362, 365, 397, 400, 420, 426, 1213, 1216`. |
| `features/mrtFeatures.ts` | add as `features/stFeatures.ts` | `tableFeatures({ ...stockFeatures, 11 custom, coreRowModel plus 8 row models, 3 fn registries })`, `MRT_Features = typeof mrtFeatures` (43-75). Replaces `utils/tanstack.features.ts` (4.1). Export per D4. |
| `hooks/mrtTableHook.ts` | add `hooks/stTableHook.ts` | `createTableHook` with empty component registries (20-31), `useMRTContext` (44-48). Add `useSTContext` too (1.6.4 lists only the four core exports); internal. |
| `components/table/MRT_TablePaper.tsx` | do not add | Covered by `ST_TableLayout.tsx`; no file depends on it (1.6.8). |
| `locales/mk.ts` | add `locales/mk.ts` (`ST_Localization_MK`) | 92 keys matching `en.ts` (1-97). Registry items need no hand edit (`scripts/registry/lib.mjs:189-233` emits one item per locale file on both bases). Docs list locales by hand: add `mk` to `apps/docs/content/docs/guides/localization.mdx:25`, `apps/docs/example-groups/LocaleExamples.tsx:34, 74, 115`, `apps/docs/examples/map.ts:97`, and an `apps/docs/examples/localization-i18n-mk/` folder. |

## 5. Ruled out

| Claim | Verifier's reason |
| --- | --- |
| `body/ST_TableDetailPanel.tsx:65-73` strips the our-only `hover` flag (MRT 47-52, 73) | `hover` is a MUI TableRow prop a plain `<tr>` rejects; MUI versus shadcn, outside 1.6.2, already recorded with the ST_TableBodyRow hover deviation. |
| `getST_RowSelectColumnDef.tsx:12, 30` option reads differ from MRT 12, 26 | Identical reads and the same `enableSelectAll ? 60 : 70` size; no divergence. |
| `useST_TableOptions.ts` `mrtTheme` and `theme.direction` replaced by fixed `'ltr'` (89, 113-114, 138-142, 228) | MUI theme versus shadcn tokens is outside 1.6.2; recorded project convention. |
| `useST_TableOptions.ts:39-101` some `enable*` or `position*` default moved into a feature | Absence statement: the eight MRT `getDefaultTableOptions` hold only `on*Change` `makeStateUpdater` entries; nothing else moves. |
| `useST_TableOptions.ts` rollup "keep ours-only defaults as recorded deviations" | Duplicates the individual lines and would keep the fn merge, which is D3's call; enableBatchRowSelection is settled by the 2026-10-19 decision. |
| `useShadcnTable.ts` duplicate no-divergence entry | Duplicate; only import style differs (alias versus relative paths). |
| `useST_Rows.ts:12-23` reads `table.state` where MRT destructures `state` | Same object, keys and deps; destructure form is style. |
| `useST_ColumnVirtualizer.ts:18-27, 93` state read and `as any` | Same `table.state` read; the cast tracks the pinned `@tanstack/react-virtual` version, not a v9 table API. |
| `useST_RowVirtualizer.ts:20-30, 79` state read and `as any` | Same read; superfluous cast on a react-virtual value, no table API involved. |

## 6. Work list by phase

Derived from the Action and Phase columns above. "Provider" lines in section 2 need no edit
in the component; they are covered by the P01 and P02 items here.

### Before phase 01: owner rulings

- D1 table seam (keep prop, optional prop with context fallback, or drop as MRT).
- D2 amend the decisions.md wording on state reads to match the twin (`table.state` stays;
  `Subscribe` in SortLabel, atom read in RowNumbers).
- D3 Fn registries and the three typed `*Fns` options.
- D4 `stFeatures` and `ST_Features` public export.
- D5 `expandRowsFn`.

### Phase 01: features and hook

- `features/st*Feature.ts`, 11 files (CellActions, ColumnDragging, Config, Density, Editing,
  FilterModes, FullScreen, Loading, Refs, RowDragging, Toolbars) per 4.2, each with MRT's
  `getInitialState`, `getDefaultTableOptions` (`makeStateUpdater` defaults),
  `constructTableAPIs` setters typed `(updater: Updater<T>) => void` that always route through
  the option, and the module augmentation the twin has (counts in 2.11).
- Setter semantics: port `setCreatingRow` with `functionalUpdate` first and the `true` sugar
  inside the updater.
- stRefsFeature: 11 keys, `tableLayoutRef`, `tableHeadCellRefs` seeded `{ current: {} }`, no
  `lastSelectedRowId`.
- stLoadingFeature: five flags default `false`.
- stConfigFeature: options and column-def members from `types.ts`, plus `cell?: never` and
  optional `_filterFn`; leaves out the 16 `on*Change` handlers (to their features),
  `enableDensityToggle`, `enableFullScreenToggle`, `enableBatchRowSelection`; D3 and D5
  answers applied.
- `features/stFeatures.ts`: `...stockFeatures`, the 11, `coreRowModel` plus the 8 row
  models, the 3 registries (uncast while fn types stay generic); tracker note for the two new
  stock features.
- `hooks/stTableHook.ts`: `createTableHook` exports plus `useSTContext`; internal.
- `types.ts` collapse (1.6.5): `ST_TableInstance`, `ST_TableState`,
  `ST_StatefulTableOptions`, `ST_DefinedTableOptions`, `ST_TableOptions`, `ST_ColumnDef`,
  wrappers for Column, Header, HeaderGroup, Row, Cell, RowModel; add the four
  Identified/Accessor column-def types; `ST_ColumnHelper` typing and `columns()`; import from
  `features/stFeatures`. Names unchanged.
- `utils/tanstack.helpers.ts`: helper typing and `columns()`; drop `createRow` generics and
  the `ST_Features` import; `as any` on `table.options.columns`.
- `utils/row.utils.ts`: read `table.atoms.rowSelection.get()` instead of `baseAtoms`;
  `creatingRow` cast if stEditingFeature mirrors MRT's slice type.
- Tracker lines: native range selection, `tableLayoutRef`, fn type names and generic form,
  sortFns builder, config duplicates omitted.

### Phase 02: instance and options

- `useST_TableInstance`: wrap `useAppTable`; drop the 20 useState slices, 16 aliases, 4 core
  setters, 11 `useRef`, the options.state patch and the selector merge; add `tableRef`,
  `stateForTransforms` with MRT's `transformStateDefaults` key set, identity selector;
  `columnFilterFns` into `initialState` with MRT's precedence; `globalFilterFn` narrowed per
  D3; 30-entry `columnPreparationDeps`; no in-place mutation of options; remove the mounted
  pagination guard; keep the `columnPinning` normalization (tracker, upstream issue). Keep
  `state` on the instance (body, footer, toolbar reads depend on it).
- `useST_TableOptions`: fn merge per D3; keep `getRowCanExpand` (tracker, optional upstream
  report); no `enableBatchRowSelection`.
- `useST_Effects`: `getDefaultColumnOrderIds({ ...table.options, state })`.
- `utils/column.utils.ts`: aggregation resolution and typed destructure per D3; `as any`
  views if the column-def type needs them; keep the `enableFacetedValues` gate (tracker).
- Verify filter-mode, grouping and sorting stories on both bases.

### Phase 03: components

- D1 applied tree-wide (every "keep (D1)" line, plus `ShadcnTable.tsx` `AppTable` mount,
  `Memo_ST_TableBody` comparator and `TData` defaults if the prop goes). Base-diff files by
  hand in both trees: `ShadcnTable.tsx`, FilterContainer, FilterLabel, DetailPanel,
  FilterTextField, SelectCheckbox, FilterOptionMenu, ColumnActionMenu, ToolbarAlertBanner,
  EditRowModal, `style.utils.ts`.
- SortLabel: `table.Subscribe` on `table.atoms.sorting`.
- RowNumbers column: `table.atoms.pagination.get()` inside Cell.
- HeadCell: drop the extra sticky reads; guarded `handleRef`.
- `getCommonSRTCellStyles` to `getCommonSTCellStyles` (util and call sites).
- TablePagination: `table.getCanLastPage()` for the last-page button.
- ShowHideColumnsMenu: one batched `setColumnVisibility`; `{ ...table.options, state }`.
- ToggleRowActionMenuButton: `setEditingRow(row)`.
- SelectCheckbox: drop the redundant indeterminate guards.
- Type follow-ups after the collapse: `getColumn(...)!` (ToolbarAlertBanner, RowExpand
  column), `actionCell` cast (CellActionMenu), `_filterFn` assertions (FilterRangeSlider,
  FilterTextField, ColumnActionMenu where the compiler asks), filter-option casts
  (FilterOptionMenu), remove `_valuesCache` casts and directives (EditCellTextField,
  EditActionButtons, EditRowModal) and the `table as any` in EditRowModal.

### Phase 04: our-only files and locales

- Keep `ST_TableLayout`, `ST_Tooltip`, `useST_MediaQuery`, `pagination.utils.ts`, the MUI
  ports in `utils/utils.ts`, the local debounce in the two input files, `TooltipProvider`,
  `createSRTColumnHelper` name; one tracker line each.
- Add `locales/mk.ts` and its docs entries (4.2); fix `fr.ts:61`.

### Final phase

- Delete `utils/tanstack.features.ts`; `index.ts` per D4; docs: `migrating-v1.mdx:43` path
  and counts, any option removed by D3 or D5 in `apps/docs/lib/prop-tables/tableOptions.ts`.
