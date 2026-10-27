# 01: v9 architecture, tracker

Decisions and deviations per phase. Plan: [01-v9-architecture.md](01-v9-architecture.md). Rulings: [decisions.md](decisions.md).

## Phase 01

TanStack reference: `React-table/tanstack-table` at `c14e0221b`. Installed `@tanstack/react-table` 9.3.1.

### Deviations

- stDensityFeature: state `density` ('comfortable'); options `enableDensityToggle`, `onDensityChange`; api `setDensity`; twin diff none beyond ST_ names.
- stFullScreenFeature: state `isFullScreen` (false); options `enableFullScreenToggle`, `onIsFullScreenChange`; api `setIsFullScreen`; twin diff none.
- stLoadingFeature: `isLoading` and `isSaving` seed false, `showLoadingOverlay`, `showProgressBars`, `showSkeletons` seed undefined (components test `!== false`; a false seed turned the skeletons, overlay and progress bars off; MRT's port has that bug); plan 1.6.3 and the findings.md ST_LinearProgressBar entry still say false.
- stToolbarsFeature: state `showAlertBanner`, `showToolbarDropZone` (false); apis `setShowAlertBanner`, `setShowToolbarDropZone`; twin diff none.
- stRefsFeature: `table.refs` with `tableLayoutRef` instead of `tablePaperRef`, no `lastSelectedRowId`, `tableHeadCellRefs` seeded `{ current: {} }` (twin seeds null).
- stEditingFeature, stFilterModesFeature, stCellActionsFeature: setters wrap the updater as `(old) => functionalUpdate(updater, old)` like every other ST setter; `setCreatingRow(true)` resolves inside the functional updater as in the twin; `actionCell` is required with null (today optional).
- stColumnDraggingFeature, stRowDraggingFeature: options and setters generic over TData, state slice erased to `ST_Column<ST_RowData>` / `ST_Row<ST_RowData>` because `TableState_FeatureMap` has no TData and ST_Row/ST_Column are invariant in TData; one documented cast per option in `getDefaultTableOptions`; `enableColumnDragging` and `enableRowDragging` live in stConfigFeature as in the twins.
- stConfigFeature: no `enableBatchRowSelection`, `memoMode`, `mrtTheme`, columnDef `_filterFn` (decision 3); adds `filterFns`, `sortFns`, `aggregationFns` (decision 3); `expandRowsFn` dropped (decision 7); core members (`columns`, `data`, `getRowId`, `globalFilterFn`, `state`, `initialState`, column `accessorKey`, `filterFn`, `sortFn`, `aggregationFn`, `id`) stay narrowed in types.ts because a feature map can only narrow.
- New exported types declared in feature files: `ST_TableState_*`, `ST_TableOptions_*`, `ST_Table_*` per feature, `ST_TableRefs`; `ST_Updater<T>` replaces `Dispatch<SetStateAction<T>>` in api params.
- Breaking: every ST setter now hands `on*Change` a function updater, not the raw value or updater.
- Each `declare module` block carries a scoped `no-unused-vars` disable: declaration merging repeats the TanStack type parameters; `features/` is not in the eslint override list.
- Integration keeps the generic `ST_TableOptions<TData>` / `ST_TableState<TData>` overlays in types.ts (Omit plus TData shapes); `ST_StatefulTableOptions.state` is the full `ST_TableState<TData>`; `ST_TableInstance.options` is `ST_DefinedTableOptions`.
- `ST_AggregationOption` is `LiteralUnion` over the built-in keys, like `ST_FilterOption` and `ST_SortingOption`.
- Table hook: `createSTTableHook` passes the module-level `tableContext` explicitly (`createTableHook` falls back to a context private to the package, `createTableHookContexts` always creates a fresh one); `useSTContext` and `ST_TableProvider` read and provide it; `ST_TableProvider` holds the first instance in `useState` and refreshes `handle.options` each render; `ShadcnTable` passes the per-render wrapper into the provider.
- Kept casts, no `as any`, no `@ts-expect-error`: provider value `as unknown as ContextType<typeof tableContext>`; `useSTContext` result `as unknown as ST_TableInstance<TData>`; `useAppTable` input `as Omit<TableOptions<ST_Features, TData>, 'features'>`; `useAppTable` result `as unknown as ST_TableInstance<TData>`; `createRow` table `as unknown as ST_TableInstance<ST_RowData>`.
- Column and data transforms read the live store (`tableRef.current.store.state`) with this render's controlled state on top; MRT reads the previous render's `table.state`.
- Plan 1.6.6 deviation kept for behavior: `column.utils` still swaps names for functions until phase 02, so `prepareColumns` is handed the hook's `appFeatures` registries; `globalFilterFn` goes to core as a name from the `globalFilterFn` state slice.
- Removed the `onPaginationChange` mount guard (pagination lives in core atoms); `initialState.pagination.pageIndex` is kept.
- `ST_ToolbarDropZone`: removed the `table.options.state?.showToolbarDropZone !== undefined` guard (always false once the instance stopped filling `options.state`).
- memoMode removal: `Memo_ST_TableBodyRow` and `Memo_ST_TableBodyCell` gone with the Memod story and the two Virtualization memoMode stories; `Memo_ST_TableBody` kept for `isResizingColumn` as in the twin.
- Barrel: `ST_Features` type only, `ST_TableProvider` added; `stFeatures`, `createSTTableHook`, `useSTContext`, `tableContext`, `useTableContext` not exported. Names lost versus claude/review: `stFeatures` (decision 6), `Memo_ST_TableBodyRow`, `Memo_ST_TableBodyCell`.
- `pnpm storybook:build:base` fails since the folder move in 42d83ad (stories import radix-only `components/` and `shared/` paths); part 02.
- Em dashes already in comments of touched component files left as found; none added.
- `pnpm format` rewrites `apps/shadcn-table-docs/lib/utils.ts` every run (pre-existing); reverted before each commit, never committed.
- `ST_FilterOptionMenu.handleSelectFilterMode`: the four `perform new filter render` branches emit `column.table.options.onColumnFiltersChange((old) => [...old])` instead of `column.setFilterValue(currentFilterValue)`; v9 `setStateSlice` drops a structurally equal update, so the filtered row model stayed on the previous mode's function. Handler read off the core table because the ST instance's `options` are the raw caller options. The global filter mode switch (`setGlobalFilterFn`) is not covered and may have the same staleness.
- Verify story `stories/features/FnRegistries.stories.tsx` imports `useSTContext` from `hooks/stTableHook` because no public reader exists until phase 03 drops the `table` prop; part 03 consolidates the story.

### Verify list (decisions item 3)

Browser: radix Storybook, Playwright against `iframe.html`, DOM text and console assertions. Story ids under `features-fn-registries--`. Re-run on `4b02bb7`: 10 of 10 browser checks pass; gates `tsc:radix`, stories tsc, `lint`, `test` (55 files, 403 tests), `storybook:build`, `check-storybook` (14 of 14 against a static server on 5362, base manager output from the failing `storybook:build:base`), `registry:build` green. `grep "table\.state" components` has 44 hits; that gate belongs to phase 03 (decision 5).

- [x] Column `filterFn: 'customFilterFn'` from the call's `filterFns` filters rows: `custom-column-filter-fn`, rows `["Mason"]`.
- [x] `globalFilterFn: 'customFilterFn'` filters rows: `custom-global-filter-fn`, rows `["Jackson","Lily","Mason","Tom"]`.
- [x] `'fuzzy'` default works and the highlight renders: `default-fuzzy-global-filter`, rows `["Mason"]`, `mark[data-slot="st-match-highlight"]` text `Mas`.
- [x] Custom `sortFn` name sorts: `custom-sort-fn`, rows `["Tom","Lily","Mason","Brooke","Jackson","Anderson"]`.
- [x] Custom `aggregationFn` name aggregates: `custom-aggregation-fn`, grouped cells `29-41`, `22-50`.
- [x] Two tables with different `filterFns` do not see each other's names: `two-tables-different-registries`, table A `["Mason"]`, table B `["Brooke"]`, console `filterFn 'tableAFilterFn' for column 'firstName' is not registered`.
- [x] Unknown name logs core's dev warning, filters nothing, no throw: `unknown-filter-fn-name`, 6 rows, console `filterFn 'doesNotExist' for column 'firstName' is not registered`, no page error.
- [x] Filter-mode switch via the column action menu changes the applied function on the next value change: `features-filtering-examples--filtering-change-mode-enabled`, fuzzy `egane` shows `Megane`, Starts With hides it, Contains shows it; label `Filter Mode: Starts With` / `Filter Mode: Contains`.
- [x] Filter-mode switch re-filters an unchanged value: same story, value `ils` typed under fuzzy (row `Nils` shown), Starts With via the column action menu hides it with the value untouched, Contains shows it again; label `Filter Mode: Starts With` / `Filter Mode: Contains`, no page error. Fixed in `4b02bb7`.
- [x] No `@ts-expect-error` on the `useAppTable` call; `pnpm tsc:radix` clean. `tsc:baseui` is part 02. Remaining `as any` and `@ts-expect-error` hits under `hooks/` are the virtualizer ones already on claude/review (`useST_RowVirtualizer.ts:79,82`, `useST_ColumnVirtualizer.ts:93,118,122`).
- [x] `useSTContext()` inside a component rendered by `<ShadcnTable>` and beside it under `ST_TableProvider` returns its own table with two mounted: `provider-with-two-tables`, readers `first:2`, `first:2`, `second:4`, `second:4`.
- [x] No remount of `AppTable` across re-renders: `controlled-input-in-custom-toolbar`, typing `focus kept` keeps `document.activeElement` on the input, echo `focus kept`.
- [x] Filter-mode submenu opens from the item's arrow button only; clicking the item itself closes the Radix menu (same on claude/review).

## Phase 02

TanStack reference: `React-table/tanstack-table` at `c14e0221b` (not pulled, same as phase 01). Installed `@tanstack/react-table` 9.3.1.

### Deviations

- `useST_TableOptions`: `manualPagination` is forced `true` whenever `enablePagination` is `false`, and `manualFiltering` when `enableFilters`, `enableColumnFilters` and `enableGlobalFilter` are all `false`; the twin keeps the `manualPagination === undefined` guard and has no filtering guard. Everything else already matched the twin.
- `prepareColumns` writes the `columnFilterFns` name onto `columnDef.filterFn`, except while a `filterFn` function still runs under its own name (its initial mode is `fn.name`); sort and single aggregation names pass through untouched. The twin still swaps names for functions and sets `_filterFn`.
- An `aggregationFn` array still becomes one `constructAggregationFn` that returns an array, as the aggregation guide documents; each name resolves at aggregate time through `context.table._rowModelFns.aggregationFns`. Core's own multiple aggregation returns an object keyed by name, which would break `AggregatedCell` readers.
- New `getColumnFilterFnName(columnDef)` in `column.utils`: the mode name, or `''` while a function runs (where `_filterFn` was undefined). `getColumnFilterInfo` (so `ST_FilterTextField` and `ST_TableHeadCellFilterLabel`), `ST_FilterOptionMenu`, `ST_FilterRangeSlider`, `ST_ColumnActionMenu` and `ST_TableBodyCellValue` read it; `getDefaultColumnFilterFn` reads only `filterVariant` and is unchanged.
- `ST_FilterOptionMenu` column switch keeps the `onColumnFiltersChange((old) => [...old])` nudge and its comment: core memoizes the filtered row model on the pre-filtered model and the `columnFilters` and `globalFilter` atoms only, so neither the new `columnDef.filterFn` name nor the `columnFilterFns` change re-runs it. With the nudge off, the rows lag one switch behind (`ar`: Starts With showed the fuzzy rows).
- Global filter mode switch through the menu is not stale: `ST_GlobalFilterTextField` clears the search on select (`onSelect={handleClear}`, as in the twin), so no nudge was added. A programmatic `table.setGlobalFilterFn` (or `setColumnFilterFns`) with a live filter value stays stale until the value changes; fixing it needs a re-run in the `stFilterModesFeature` setters (owner call).
- `useST_Effects`: one `table.atoms.rowSelection.subscribe` per mount, in an effect with `[]` deps that returns the unsubscribe. It diffs the previous and next selection and reads `enableRowPinning` and `rowPinningDisplayMode` from the latest render's options through a ref. One `setRowPinning` update covers every changed row (selected rows are appended to `top`, or `bottom` under `select-bottom`; unselected rows are removed), instead of one `row.pin` per row. The twin has no subscription and pins in the handler.
- `row.utils`: `getST_RowSelectionHandler` loses the `baseAtoms` diff and the pin loop (the sub-row unselect stays). `getST_SelectAllHandler` loses `setRowPinning({ bottom: [], top: [] })`, so select all now pins the rows it selects and unselect all unpins them; the twin clears every pin.
- Step 4 skipped: `useST_Rows`, `useST_RowVirtualizer` and `useST_ColumnVirtualizer` differ from the twins only in import paths, `T[]` array types, `table.state` versus a destructured `state`, and the known virtualizer `as any` and `@ts-expect-error`.
- Extra commit `80f28a0`: `stories/features/RowPinningOnSelect.stories.tsx` (five fixtures with play functions) and `PaginationDisabledManualPaginationFalse` in the pagination stories.

### Verify list (plan 2.1.3, decisions item 8)

Browser: radix Storybook, static server on 5362, Playwright against `iframe.html`, DOM `tbody tr[data-pinned]` and `tr[data-selected]`. Story ids under `features-row-pinning-on-select--`. Gates on `1dbac8d`: `tsc:radix`, stories tsc, `lint`, `test` (56 files, 409 tests), `storybook:build`, `check-storybook` (14 of 14; base manager output from the failing `storybook:build:base`), `registry:build` green.

- [x] Shift range, internal selection: `shift-range-internal-state`, pinned `Anderson`, `Lily`, `Tom`, `Brooke`.
- [x] Shift range, controlled selection: `shift-range-controlled-state`, the same four pinned; unselecting `Lily` unpins her.
- [x] Shift range, external `atoms.rowSelection` (`createAtom` from `@tanstack/store`, `select-top`): the same four pinned; `atom.set({ 0: true, 3: true })` pins `Mason` and `Tom` and unpins the rest. Temporary story, not committed: the package has no direct `@tanstack/store` dependency.
- [x] Select all, `selectAllMode: 'page'`: `select-all-page-mode`, the five page rows pinned; unselect all unpins every row.
- [x] Select all, `selectAllMode: 'all'`: `select-all-all-mode`, all eight rows pinned across pages.
- [x] `row.toggleSelected(true)` from a toolbar button: `programmatic-toggle-selected`, `Jackson` pinned at the bottom (`select-bottom`).
- [x] `enablePagination: false` with `manualPagination: false`: `features-pagination-examples--pagination-disabled-manual-pagination-false`, all 21 rows.
- [x] Column filter mode switch re-filters an unchanged value: `features-filtering-examples--filtering-change-mode-enabled`, `ar` under fuzzy 10 rows, Starts With 2 rows (same as retyping), Contains 10 rows; label `Filter Mode: Starts With` / `Filter Mode: Contains`.
- [x] `aggregationFn: ['count', 'mean']` renders `[3,35]` per group (temporary story).
- [x] Decisions item 3 fixtures (`features-fn-registries--`) stay green in `pnpm test`.
- [ ] Headless render of a display column header still crashes: `ST_SelectCheckbox` destructures `table.state`, which the core table at `header.getContext().table` does not have (`TypeError: Cannot destructure property 'density' of 'n.state' as it is undefined`). Needs the phase 03 component reads (decision 5); components are fenced in this phase.

### Verify list, attempt 1 (verifier, on `77ba5f9`)

Browser: radix Storybook dev server on 6026, Playwright against `iframe.html` scoped to `#storybook-root` (the argstable block outside it is a second `table`), DOM and console assertions, 21 checks, 20 pass. Fixtures added in `0723fbf`: `stories/features/PhaseTwoVerify.stories.tsx` (external atom, 25 rows, headless headers, every filter flag off, global filter mode switch); the row pinning fixtures stay in `RowPinningOnSelect.stories.tsx`. Gates on `77ba5f9` plus the story: `tsc:radix`, stories tsc, `lint`, `test` (57 files, 415 tests), `storybook:build`, `check-storybook` (14 of 14 on a static server on 5362; the base manager output comes from the failing `storybook:build:base`, part 02), `registry:build` green. `grep` under LIB for `_filterFn`, `baseAtoms` and the old registry lookup names (`ST_FilterFns[`, `options.filterFns?.[` and the sort and aggregation twins): no hits.

- [x] Shift range, internal selection: `shift-range-internal-state`, pinned and selected `Anderson`, `Lily`, `Tom`, `Brooke`; unselecting `Tom` unpins him.
- [x] Shift range, controlled selection: `shift-range-controlled-state`, after the play (range, unselect `Lily`) pinned `Anderson`, `Tom`, `Brooke`; reselecting `Lily` pins her again.
- [x] Shift range, external `atoms.rowSelection`: `features-phase-two-verify--shift-range-external-atom`, the atom comes from a seed table's `_reactivity.createWritableAtom` (no `@tanstack/store` dependency); after the range then `atom.set({ 0: true, 3: true })` pinned and selected `Mason`, `Tom`; a click on `Lily` afterwards pins her.
- [x] Select all, `selectAllMode: 'page'`: `select-all-page-mode`, the five page rows pinned; unselect all unpins every row.
- [x] Select all, `selectAllMode: 'all'`: `select-all-all-mode`, all eight rows pinned (8 tbody rows on a page of 5); unselect all unpins every row.
- [x] `row.toggleSelected(true)` from a toolbar button: `programmatic-toggle-selected`, `Jackson` the only `[data-pinned]` row and the last tbody row (`select-bottom`).
- [x] `enablePagination: false` with `manualPagination: false` on 25 rows: `pagination-disabled-twenty-five-rows`, 25 tbody rows, no pagination element.
- [x] Headless `flexRender(header.column.columnDef.header, header.getContext())` for the select and expand columns inside `ST_TableProvider`: `headless-display-column-headers`, renders `Expand` and `Select`, no throw.
- [ ] Headless `flexRender(header.column.columnDef.Header, header.getContext())`, the library's own header render path: `headless-display-column-header-components`, boundary message `Cannot destructure property 'density' of 'table.state' as it is undefined.` thrown by `ST_ExpandAllButton` (`components/buttons/ST_ExpandAllButton.tsx:46`, `ST_SelectCheckbox.tsx:46` reads the same). The core table at `header.getContext().table` has no `state`; phase 03 component reads (decision 5), components fenced in this phase.
- [x] `columnFilters` in `state` with `enableFilters`, `enableColumnFilters`, `enableGlobalFilter` all false: `column-filters-with-every-filter-flag-off`, all eight rows.
- [x] FnRegistries stories (decisions item 3): 9 of 9 pass with the same evidence as phase 01.
- [x] Column filter mode switch re-filters an unchanged value: `features-filtering-examples--filtering-change-mode-enabled`, `ar` under fuzzy 10 rows, Starts With `Arvid`, `Arch`, `Arden` (same rows after retyping `ar`), Contains 10 rows all containing `ar`; labels `Filter Mode: Starts With` / `Filter Mode: Contains`; input still `ar`.
- [x] Global filter mode switch via the search field's menu: `global-filter-mode-switch`, `ily` under fuzzy `Lily`; Starts With clears the search, `ily` 0 rows, `Li` `Lily`; Contains `ily` `Lily`.

### Verify list, attempt 2 (verifier, on `c09047d`)

Browser: radix Storybook dev server on 6026, Playwright against `iframe.html` scoped to `#storybook-root`, each story loaded until the `storyRendered` channel event (so the play function has finished), `playFunctionThrewException`, console errors and page errors recorded per story, 54 checks, 54 pass. No new fixtures: `stories/features/PhaseTwoVerify.stories.tsx` from `0723fbf` plus the `c09047d` play on `HeadlessDisplayColumnHeaderComponents` and `RowPinningOnSelect.stories.tsx` cover the list. Gates on `c09047d`: `tsc:radix`, stories tsc, `lint`, `test` (57 files, 415 tests), `storybook:build`, `check-storybook` (14 of 14 on a static server on 6026 after `storybook:build:base` wrote its manager output; that build still fails, part 02), `registry:build` green. `grep` under LIB for `_filterFn`, `baseAtoms`, `ST_FilterFns[`, `ST_SortingFns[`, `ST_AggregationFns[` and `options.{filterFns,sortFns,sortingFns,aggregationFns}?.[`: no hits.

- [x] Shift range, internal selection: `shift-range-internal-state`, pinned and selected `Anderson`, `Lily`, `Tom`, `Brooke`; unselecting `Tom` leaves `Anderson`, `Lily`, `Brooke` pinned.
- [x] Shift range, controlled selection: `shift-range-controlled-state`, after the play (range, unselect `Lily`) pinned `Anderson`, `Tom`, `Brooke`; reselecting `Lily` pins and selects all four.
- [x] Shift range, external `atoms.rowSelection`: `features-phase-two-verify--shift-range-external-atom`, after the range then `atom.set({ 0: true, 3: true })` pinned and selected `Mason`, `Tom`; clicking `Lily` pins her; unselecting `Mason` unpins him.
- [x] Select all, `selectAllMode: 'page'`: `select-all-page-mode`, after the play nothing pinned; select all pins the five page rows (5 tbody rows); unselect all unpins every row.
- [x] Select all, `selectAllMode: 'all'`: `select-all-all-mode`, all eight rows pinned (8 tbody rows on a page of 5); unselect all unpins every row, 5 rows again.
- [x] `row.toggleSelected(true)` from a toolbar button: `programmatic-toggle-selected`, `Jackson` the only `[data-pinned]` row and the last row of the second tbody (`select-bottom`).
- [x] `enablePagination: false` with `manualPagination: false` on 25 rows: `pagination-disabled-twenty-five-rows`, 25 tbody rows, no `Rows per page` or `Go to next page` element.
- [x] Headless `flexRender(header.column.columnDef.header, header.getContext())` for the select and expand columns inside `ST_TableProvider`: `headless-display-column-headers`, renders `Expand` and `Select`, no boundary message, no page error.
- [x] Headless `flexRender(header.column.columnDef.Header, header.getContext())`: `headless-display-column-header-components`, the expand column renders one button and the select column one checkbox and one button, no boundary message, no page error (fixed in `c09047d`: `ST_ExpandAllButton` and `ST_SelectCheckbox` subscribe to `table.store` instead of reading `table.state`, `ST_TableProvider` mounts the tooltip provider).
- [x] `columnFilters` in `state` with `enableFilters`, `enableColumnFilters`, `enableGlobalFilter` all false: `column-filters-with-every-filter-flag-off`, all eight rows.
- [x] FnRegistries stories (decisions item 3): 9 of 9 play functions finish without an exception or page error in the browser, and stay green in `pnpm test`.
- [x] Column filter mode switch re-filters an unchanged value: `features-filtering-examples--filtering-change-mode-enabled` (random data, so the term is the first two letters of the first row's name, `bi` in this run): fuzzy 6 rows (`Abigale`, `Bianka`, `Boris`, `Gabrielle`, `Jabari`, `Libbie`), Starts With `Bianka` (same after retyping `bi`), Contains `Abigale`, `Bianka`, `Libbie`; labels `Filter Mode: Starts With` / `Filter Mode: Contains`; input still `bi`.
- [x] Global filter mode switch via the search field's menu: `global-filter-mode-switch`, `ily` under fuzzy `Lily`; Starts With clears the search, `ily` then `No results found`, `Li` `Lily`; Contains `ily` `Lily`.
