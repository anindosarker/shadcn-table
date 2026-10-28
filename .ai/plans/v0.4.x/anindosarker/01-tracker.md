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

## Phase 03

TanStack reference: `React-table/tanstack-table` at `c14e0221b` (not pulled, same as phase 02). Installed `@tanstack/react-table` 9.3.1.

### Pattern (decisions 4, 5)

- Table access: a component with `row`, `cell`, `header` or `column` reads `instance.table`; one without reads `useSTContext()` from `hooks/stTableHook`. No `table` prop, never passed to a child.
- Render reads: one slice `<Subscribe source={table.atoms.density}>`, several `<Subscribe source={table.store} selector={(s) => ({ ... })}>` (the `Subscribe` exported by `@tanstack/react-table`), inside the component that renders the value; row model and state getters sit inside it and the selector lists every slice that feeds them. A value that feeds a hook (memo, effect deps, virtualizer) comes from `useST_Atom(table.atoms.x)`, one call per slice.
- Handlers, effects and callbacks read `table.atoms.x.get()` or `table.store.state.x`; writes stay `table.setX`. Shared utils read `table.store.state` and the caller's selector lists their slices: `getCommonSRTCellStyles` `draggingColumn`, `hoveredColumn`; `getST_Rows` `creatingRow`, `pagination` plus `getIsRankingRows` and `getCanRankRows` `globalFilter`, `sorting`, `expanded`, `globalFilterFn`.
- Root: `ShadcnTable` built from options calls `useST_TableInstance(options, selectST_TransformState)`, which hands the selector to `useAppTable(options, selector)`; it re-renders only on the slices its option-time transforms read. `ShadcnTable table={table}` re-renders with its owner; `useShadcnTable` keeps the default selector.
- Provider: `ST_TableProvider` keeps the first instance as the context handle (`useState`), refreshes `handle.options` each render, and its context value never changes identity.
- Custom renderer arguments (`Cell`, `Header`, `Footer`, `render*`, `st*Props`) still receive `table`: the handle or `instance.table`.

### Transition

- `ecde993`: the 58 components with a required `table` prop take it optionally and resolve `props.table ?? useSTContext()`, so the clusters work in parallel with `tsc` green. Each cluster drops the prop in its files.
- `ST_TableLayout` calls `useST_Atom(table.store)` and `ST_TableProvider` puts a live `state` getter (`table.store.state`) on the handle, so components not yet on subscriptions keep rendering current state. Both go in the integration step after the five clusters merge; the decision 5 Profiler counts are only meaningful after that.
- Integration: clusters `v0.4/01` to `v0.4/05` merged in `954c878`; `2fb6fa6` drops the 27 `table?` transition props and `useST_Atom(table.store)` from `ST_TableLayout`, so a state change re-renders only its subscribers. The handle's live `state` getter stays (deviations).

### Deviations

- Root selector is not `() => null`: the option-time transforms run in the root render. `selectST_TransformState` selects `columnFilterFns` (`prepareColumns` writes the mode name onto `columnDef.filterFn`), `globalFilterFn` (passed as the core option), `grouping` and `creatingRow` (display columns), `isLoading`, `showSkeletons` and `pagination.pageSize` (skeleton rows). The freeze guards (`isResizingColumn`, `draggingColumn`, `draggingRow`) read the live store, not selected.
- `useST_Atom` is new in `hooks/stTableHook.tsx`: `useSyncExternalStore` over one atom's `subscribe` and `get`. `Subscribe` cannot feed a hook and `useSelector` lives in `@tanstack/react-store`, not a direct dependency. Used by `ST_Table` (column size memo, `isResizingColumn`) and `useST_ColumnVirtualizer`. Review round 3: the column size memo also lists `columnOrder`, `columnPinning` and `grouping`, since a pin or reorder under header groups splits a parent header into new ids (`<depth>_<groupId>_<firstChildHeaderId>`) and the root no longer re-renders on those slices.
- `useST_Effects` has no render reads: column order and the page check run on owner renders against the store; full screen body styles, the page check after state changes (`table.store.subscribe`), the ranking sort (`atoms.globalFilter`, `atoms.sorting`) and the pinned row re-render (`atoms.density`) are subscriptions. The full screen styles and the store-triggered page check wait a task (`setTimeout`), for the layout commit and so the row count is not memoized before the root writes a new filter mode.
- `getST_RowNumbersColumnDef`: the `Cell` subscribes to `table.atoms.pagination`; the column defs rebuild on root renders only, so static numbers no longer close over the page.
- `ST_TableContainer` observes the toolbars with a `ResizeObserver` besides the per-render measure: the alert banner changes the top toolbar height on state the container does not subscribe to.
- `ST_TableLayout`, `ST_TableContainer`, `ST_Table`, `ST_TableLoadingOverlay` props are plain aliases (`DivProps`, `TableProps`, `ST_CircularProgressProps`) without `TData`, as in the twins. Children are created outside the `Subscribe` render function, so a slice change re-renders only the element that shows it.
- `stFilterModesFeature`: `setColumnFilterFns` and `setGlobalFilterFn` emit `onColumnFiltersChange((old) => [...old])` after the change; the raw handler, since `setColumnFilters` would drop filters by the old mode's auto-remove rules. `ST_FilterOptionMenu` loses its four nudge branches. A programmatic switch with a live value now re-filters (phase 02 owner call). Review round 2: the emit is skipped while no column or global filter is set, so a mode change alone calls no `onColumnFiltersChange`; `ST_ExpandAllButton` selects `columnFilterFns` and `globalFilterFn` itself instead of relying on the emit.
- Fixtures in `stories/features/PhaseThreeVerify.stories.tsx`, ids under `features-phase-three-verify--`: `programmatic-global-filter-mode`, `programmatic-column-filter-mode`, `root-skips-state-renders` (a proxy on `displayColumnDefOptions` counts root renders: none over paging, sorting, density, selection, search and full screen), `data-replacement`, `controlled-pagination`.
- `ST_TableProvider` keeps the live `state` getter on the handle (planned to go). `render*` and `st*Props` of the context components receive the handle, whose own `state` is the first render's selected slices only (with `selectST_TransformState`, not even the full state), so a user `table.state` read there would be stale or undefined (`Editing.stories` `renderTopToolbarCustomActions` reads `table.state.creatingRow`). The library reads none (grep gate). Owner call. If the getter stays, the 0.4.0 changelog states that renderer `table.state` reads on the handle are live, unsubscribed snapshots (prefer `table.store.state`), and that swapping the `table` prop of `ST_TableProvider` after mount needs a `key` (review round 3).
- Instance typing: `row.table`, `cell.table`, `header.table`, `column.table` and `footer.table` are the core `Table` (no `Subscribe`, `state` or ST option types) and types.ts has no helper, so every instance component casts `X.table as unknown as ST_TableInstance<TData>` with a comment, as `useSTContext` does. Final phase: a `table: ST_TableInstance<TData>` override on `ST_Row`, `ST_Cell`, `ST_Column`, `ST_Header` would drop the casts.
- Renderers in instance components receive `instance.table`, which has no `state`: `Cell`, `GroupedCell`, `Header`, `Footer`, `st*CellProps`, `renderRowActions`, `renderRowActionMenuItems`, `renderColumnActionsMenuItems`, `renderDetailPanel`, `onCreatingRow*`/`onEditingRow*` from the row buttons, `stCopyButtonProps`, `stExpandButtonProps`, `stRowDragHandleProps`. Changelog Breaking line; `Aggregation` and `ColumnGrouping` `GroupedCell` and the three `RowOrdering` `onDragEnd` stories read `table.store.state`; two keep `as ST_TableState<Person>`, without it `hoveredRow as ST_Row<Person>` fails TS2352 in the stories tsc.
- `useST_Atom` in place of `Subscribe` where the value feeds a hook: `ST_TableHeadCellFilterLabel`, `ST_FilterTextField`, `ST_FilterRangeSlider` (`columnFilters`, `globalFilter` for the faceted memos and sync effects), `ST_GlobalFilterTextField` (`globalFilter`), `ST_ToolbarDropZone` (`draggingColumn`, `grouping`), `ST_ShowHideColumnsMenu` (`columnOrder`, `columnPinning`), `ST_TableBody` (`rowPinning`), `ST_TableBodyCell` (`isLoading`, `showSkeletons`), `useST_Rows` (ten row model slices), `useST_RowVirtualizer` (`density`, `draggingRow`, `expanded`, after its early return).
- `ST_SelectCheckbox` reads the context for both forms (the row form could use `row.table`): one hook order whether or not `row` is given. The row form selects `getIsAllSubRowsSelected()` beside `getIsRowSelected` and `getIsSomeSelected()`, since the indeterminate state reads it (review round 1). `ST_FilterOptionMenu` reads the context, not `header.table`: the global filter menu has no header; its handler reads `column.getFilterValue()` live.
- Per-instance selectors so a hover, selection, pin or resize re-renders only its row, cell or column: `ST_TableBodyRow` (`isHoveredRow`, `isRowSelected`, `isDraggingRow`; cells in their own `Subscribe` on the column slices), `ST_TableBodyCellValue` (`globalFilter`, `globalFilterFn`, `columnFilterFns` for the column filter mode behind `matchExactly`, review round 3, and `grouping`), `ST_TableBodyCell` (`isEditingCell`, `isHoveredColumn` and seven other booleans, `columnSizing` only while pinned), `ST_TableHeadCell` (`columnResizing.isResizingColumn`, not the slice; `columnSizing` only while pinned), `ST_TableHeadCellResizeHandle` (`isResizing` and `deltaOffset` only while this column resizes, in place of `getIsResizing()`).
- `useMemo`s that read subscribed values became plain computations inside the `Subscribe` render function: `ST_TableHeadCell` `headerPL` and `draggingBorders`, `ST_TableBodyCell` `draggingBorders`, `ST_TableBodyRow` pinned index, `ST_ToolbarAlertBanner` `selectedRowCount`, `ST_RowActionMenu` `menuItems` (review round 2: `row.table` and `row` are stable, so a stable `renderRowActionMenuItems` froze the items); their `exhaustive-deps` disables went.
- `ST_TableHeadCell` hands the grab handle a live ref object (`get current()` over `tableHeadCellRefs`): the snapshot held `null` until a re-render after mount that narrow renders never bring, so the drag image was lost.
- `ST_TableFooterCell` also selects `columnFilters`, `expanded`, `globalFilter`, `grouping`, `pagination`, `rowSelection` and `sorting`, for a custom `Footer` that totals the filtered, grouped, paginated or selected rows; it narrows resizing and sizing as the head cell does (review round 2). `ST_TableBody` builds its rows outside a `Subscribe` on `columnFilters`, `columnVisibility`, `globalFilter`, `isFullScreen` (`rowPinning` comes from the `useST_Atom` beside the pinned row memo, review round 2); `Memo_ST_TableBody` is `memo` with the default comparator, as in the twin.
- `ST_TablePagination` `showFirstButton` and `showLastButton` default inside the `Subscribe` through `??` (a destructure default before; only `null` differs).
- `ST_CellActionMenu` subscribes to `atoms.actionCell` and renders nothing without one; `onCloseAutoFocus` reads `table.atoms.editingCell.get()` (findings; the edit input keeps focus, checked on `cell-actions-with-built-ins`).
- Display columns: the Expand `Cell` keeps the argument table for `getColumn` and `GroupedCell`; the Expand `Header` keeps `tableOptions.state.grouping` as in the twin (grouping is in the root selector).
- Casts removed with the rewrite: `_valuesCache` resets are `{} as ST_Row<TData>['_valuesCache']` (`ST_EditRowModal`, `ST_EditActionButtons`), `ST_EditActionButtons` lost a `@ts-expect-error`, `ST_ToggleRowActionMenuButton` calls `renderRowActionMenuItems` typed with `closeMenu`. Under `components/` and `hooks/display-columns/`: `as any` 13 to 6, `@ts-expect-error` 11 to 10, `eslint-disable` without a reason 37 to 25, em dash lines 40 to 29; review round 1 took them to `as any` 4 (`ST_ActionMenuItem` types `onOpenSubMenu` as `MouseEventHandler<HTMLElement>`), `eslint-disable` without a reason 20, em dash lines 15; review round 2: `eslint-disable` without a reason 18, em dash lines 13; the rest are pre-existing lines left as found (body files, menus other than `ST_FilterOptionMenu`, the ref-forwarding `@ts-expect-error`s).
- Ref-forwarding `@ts-expect-error ref can be either RefCallback or RefObject` stays in `ST_TableLayout`, `ST_TableContainer`, `ST_TableFooter`, `ST_TableHead`, the body copies, `ST_TopToolbar` and `ST_BottomToolbar`, as in the twins. Cleanup phase: a typed `assignRef(refProp, node)` helper in `shared/utils` replaces them (review rounds 1 to 3).
- Props types: `ST_TopToolbarProps` is no longer exported (it only held `table`; MRT keeps an empty one). Context-only props types are non-generic as in the twins; an empty one is a type alias (`= ButtonProps`, `= InputProps`) because lint rejects an empty interface, where MRT keeps `interface ... extends IconButtonProps {}`.
- Stories, as far as the gates need: `Selection` and `Toolbar` drop `table={table}` (both render inside the table's provider), `CellActions` drops it on `ST_ActionMenuItem`, `FnRegistries` reads through `ST_TablePagination` under `ST_TableProvider` instead of importing `useSTContext` from `hooks/stTableHook`.
- No Fixed line for the select-all indeterminate state: `getIsSomeRowsSelected() && !allRowsSelected` shipped in 0.3.3 on 9.3.1 (`v0.3.3` `inputs/ST_SelectCheckbox.tsx:155`), unchanged here.
- Superseded by part 04.1 (review rulings 3 and 5): the provider handle, its live `state` getter and the `key` note are gone; `ST_TableProvider` renders `table.AppTable`, and `useST_Atom` gave way to `useSelector` from `@tanstack/react-store`.

### Phase 02 leftovers

- [x] The tooltip provider lives in `ST_TableProvider` (`c09047d`): every ST tooltip under the provider, hand-composed pieces included, has its Radix provider.
- [x] Headless `flexRender(header.column.columnDef.Header, header.getContext())` for the expand and select columns renders without a throw: `headless-display-column-header-components`, attempt 2 on `c09047d`, still green in `pnpm test`.

### Gates

On `2922bf6`: `tsc:radix`, stories tsc, `lint`, `test` (58 files, 420 tests), `registry:build` green. `grep "table\.state" components` has 39 hits, all in cluster files; `hooks/display-columns` has none.

On `bae235b` (integration): `tsc:radix`, stories tsc, `lint`, `test` (58 files, 420 tests), `storybook:build`, `check-storybook` (14 of 14 on a static server on 5418; base manager output from the failing `storybook:build:base`, part 02), `registry:build` green. Greps over `components/` and `hooks/display-columns/`: `table\.state` 0, `table?: ST_TableInstance` or `table: ST_TableInstance` 0, any `table?:` prop 0, `props.table ??` 0, `table={` 0; over `stories/`, `table={table}` only on `ShadcnTable` and `ST_TableProvider`. Browser sanity on the static build: row select checks one row and sets the header to mixed with the banner up, density, next page, sort and full screen all render.

### Verify list, attempt 1 (verifier, on `52a8077`)

Browser: radix Storybook dev server on 6036, Playwright against `iframe.html` scoped to `#storybook-root`, each story loaded until `storyRendered` or `playFunctionThrewException`, console errors and page errors recorded per story, 41 checks, 38 pass; the 3 failures are one library finding (below). Fixtures: `stories/features/PhaseThreeVerify.stories.tsx` (`8bead9b`, extended in `52a8077` with the hover section, the `positionToolbarAlertBanner` arg and `OptionChangeAfterMount`); the Profiler story counts commits with a `Profiler` around the table and around each toolbar button, `st*Props` functions for cell, row and head cell component renders, and a display column `Cell`/`Header` for the td and th subscription commits. Gates on `52a8077`: `tsc:radix`, stories tsc, `lint`, `storybook:build`, `check-storybook` (14 of 14 on a static server on 6036 after the still failing `storybook:build:base` wrote its manager output, part 02), `registry:build` green; `test` red: 58 files, 429 tests, 1 failed (`Profiled Thousand Rows`, `select: probe cells: expected 2000 to be +0`, the finding below). `grep "table\.state"` over `components/` and `hooks/display-columns/`: no hits; `grep "table={"` over `components/`: no hits.

- [x] Hover a row in the 1,000-row table: `profiled-thousand-rows`; a mouse hover is CSS (`hover:[&>td]:after:*` on the `tr`), 0 table commits, 0 td commits; the library writes `hoveredRow` only during a row drag (`onDragEnter`), so `table.setHoveredRow({ id: 'First0006' })` from a toolbar button stands in: td commits `{ First0006: 1 }`, 0 cell, row or head component renders, 1 table commit.
- [x] Toggle density: 1,000 td commits (one per probe cell), 1 th commit, 0 cell, row or head cell component renders, button commits `{ density: 1 }` only (search, filters, columns, full screen 0).
- [ ] Select a row: with a selection already up, selecting another row is narrow (0 td commits, 0 component renders, 3 table commits, the row gets `data-selected`, select-all `aria-checked="mixed"`). The first selection and the deselection back to none re-render the whole table: first select 10,000 cell component renders (1,000 rows x 5 cells x 2), 2,000 row renders, 2,000 td commits, 10 head renders, 8 table commits; deselect to none twice that. With `positionToolbarAlertBanner: 'none'` (story arg) both are narrow (0 renders, 7 table commits), so the cause is the alert banner changing the top toolbar height: `ST_TableContainer` measures the toolbars in a `ResizeObserver` and a deps-less layout effect and writes `setTotalToolbarHeight`, and its render creates `<ST_Table />` anew, so every container render re-renders `ST_Table`, the head, `ST_TableBody` (not memoized outside a resize) and every row. Library fix.
- [x] Sort, filter, paginate, expand, group from toolbar setters: `row-model-follows-state`, body shows `P25` first after sort desc, `P25..P21` under filter `P2`, `P20, P12, P02` on page 2, `P23-child, P22, P22-child, P21, P21-child` after expand all, five `(5)` groups after group by age.
- [x] Replace `data` from outside: `data-replacement`, `P01, P02, P03` then `P11, P12, P13` after the button, no state change.
- [x] Cell action menu edit keeps focus: `cell-action-menu-edit-keeps-focus`, after Edit the `activeElement` is the `input` inside the td with the menu closed, still after 300 ms.
- [x] Nested table in `renderDetailPanel`: `nested-detail-panel-table`, outer `ST_TablePagination` reads `1-3 of 3`, the inner one `1-5 of 5`, 15 inner cells over 3 panels.
- [x] Menus, dialogs, tooltips in portals read the context: `portals-read-context`, column actions menu (`Sort by First Name ascending`) rendered outside the `table` element, create dialog with one input outside the `table`, density tooltip `Toggle density` outside the table; no page error.
- [x] Custom renderers receive `table`: `Cell` `Mason (3)`, `Header` `First Name (3)`, `Footer` `Footer (3)`, `renderRowActions` `Actions (3)`, `renderDetailPanel` `Detail (3)`, inner `Cell` `Inner1 (5)` (`table.options.data.length`).
- [x] Group 2 component without a provider: `no-provider-throws`, `ST_TablePagination` inside a boundary prints `` `useTableContext` must be used within an `AppTable` component. Make sure your component is wrapped with `<table.AppTable>...</table.AppTable>`. `` at mount (TanStack's message, not a silent undefined).
- [x] Controlled state: `controlled-pagination` (owner `pageIndex` 1, first row `P06`), `controlled-density-and-selection` (owner density `compact`, td has `p-2`, owner selection `1`, one `data-selected` row).
- [x] External atoms: `external-atoms-density-and-selection`, `density.set('compact')` gives `p-2`, `rowSelection.set({ 0: true, 2: true })` gives 2 `data-selected` rows and select-all `mixed`.
- [x] `localization` and `enableRowSelection` changed after mount: `option-change-after-mount`, density button `aria-label` becomes `Dichte umschalten`, 3 row checkboxes appear.
- [x] Root opts out: `root-skips-state-renders` play green (no root render over paging, sorting, density, selection, search, full screen).
- [x] Programmatic filter mode switches: `programmatic-global-filter-mode`, `programmatic-column-filter-mode`, both `No results found` under Starts With.
- [x] Existing stories: `filtering-change-mode-enabled`, `-faceted`, `-hidden`, 9 FnRegistries and 5 RowPinningOnSelect stories render with no play exception, console error or page error, and stay green in `pnpm test`.

### Verify list, attempt 2 (verifier, on `1005a83`)

Re-run after the container fix (`1005a83`: the toolbar height goes to a `--st-toolbar-height` CSS variable on the container node, not React state). Same fixtures (`stories/features/PhaseThreeVerify.stories.tsx`, no story change needed), same method: radix Storybook dev server on 6036, Playwright against `iframe.html`, each story loaded until `storyRendered` or `playFunctionThrewException`, console and page errors recorded per story. 47 checks, 47 pass. Gates on `1005a83`: `tsc:radix`, stories tsc, `lint`, `test` (58 files, 429 tests, 0 failed), `storybook:build`, `check-storybook` (14 of 14 on a static server on 6036, base manager output from the still failing `storybook:build:base`, part 02), `registry:build` green. `grep "table\.state"` over `components/` and `hooks/display-columns/`: no hits; `grep "table={"` over `components/`: no hits.

- [x] Select a row, the attempt 1 finding: now narrow in every case on `profiled-thousand-rows` with the banner on top. First selection (banner shows): 0 probe cell commits, 0 cell, row or head renders, 4 table commits. Second selection with the banner up: 0, 0, 3 table commits, row gets `data-selected`, select-all `aria-checked="mixed"`. Deselect to none (banner hides): 0, 0, 10 table commits. With `positionToolbarAlertBanner: 'none'`: 0, 0, 7. `pnpm test` runs the same assertions in the play and is green.
- [x] Container fix, full screen: `--st-toolbar-height` is `166px` after mount with one row selected; full screen computed `max-height` `834px` = `innerHeight 1000 - 166`; deselecting in full screen (banner hides) moves the variable to `112px` through the `ResizeObserver` and the computed `max-height` to `888px`; leaving full screen clears the inline `max-height`; no console or page error.
- [x] Container fix, sticky header: `styling-sticky-header-examples--enable-sticky-header` computed `max-height` `888px` = `clamp(350px, 1000 - 112, 9999px)`.
- [x] Hover, density, sort/filter/paginate/expand/group, data replacement, cell action menu edit focus, nested detail panel table, portals, custom renderers, no provider throws, controlled state, external atoms, option change after mount, root opts out, programmatic filter modes, existing Filtering change-mode, FnRegistries and RowPinningOnSelect stories: same evidence as attempt 1, all green.
- [ ] Decision 4 "every guide example that composes sub-components renders in `check-pages.mjs`": `apps/` is part 04, not run here.

## Final phase

### Deleted

- `flipIconStyles` (`shared/utils/style.utils.ts`, `a799752`): no reference in LIB, stories or the docs app outside the installed copies, not exported by the barrel (`style.utils` is not re-exported). Already unread on claude/review.
- Nothing else qualified. Proof: every `export` under LIB checked for references across LIB, `stories/` and the docs app (`content`, `examples`, `example-groups`, `app`, `lib`, `components` minus `ui-radix` and `ui-base`), against the same scan on claude/review. Newly unreferenced since claude/review: the per-feature `ST_TableState_*`, `ST_TableOptions_*`, `ST_Table_*` and `ST_TableRefs` types (read by their own `declare module` blocks) and `ST_GroupingState` (`types.ts`, barrel, kept). `tsc:radix` runs with `noUnusedLocals` and `noUnusedParameters`, and `eslint --report-unused-disable-directives registry/radix` is clean, so no dead import, local or disable is left. Greps under LIB for `memoMode`, `expandRowsFn`, `_filterFn`, `Memo_ST_TableBodyRow`, `Memo_ST_TableBodyCell`, `tanstack.features`, `baseAtoms` and the old registry lookups: no hits. Every option declared in `features/` is read outside `features/`.

### Ref helper

- `assignRef(ref, node)` in `shared/utils/utils.ts` (`f1442c5`): calls a callback ref, sets a ref object's `current`. Replaces the six `@ts-expect-error` copies in `ST_TableLayout`, `ST_TableContainer`, `ST_TableHead`, `ST_TableFooter`, `ST_TopToolbar` and `ST_BottomToolbar`; each keeps its own null guard. Ref objects behave as before; a callback ref, which got a `current` property set on the function before, now receives the node (changelog Fixed).
- Kept: `ST_FilterRangeSlider` assigns the node onto the `sliderProps.ref` prop (twin no-op, recorded with its own reason), and the two virtualizer `@ts-expect-error`s.

### Barrel versus claude/review

- `index.ts` unchanged in this phase; it already follows decisions 2 and 6 (full barrel as MRT, `ST_Features` type only, `ST_TableProvider` added; `stFeatures`, `createSTTableHook`, `useSTContext`, `tableContext`, `useTableContext`, `useST_Atom` not exported). No story imports an internal hook path.
- Export names, TypeScript `getExportsOfModule` on both trees, 237 each. Removed: `stFeatures`, `Memo_ST_TableBodyRow`, `Memo_ST_TableBodyCell`, `ST_TopToolbarProps`. Added: `ST_TableProvider`, `ST_TableProviderProps`, `getColumnFilterFnName`, `selectST_TransformState`.

### Changelog, format, registry

- `## Unreleased` completed (`1a761e9`): Breaking adds the props types without `TData`, the live `table.state` read on the handle and the `ST_TableProvider` `key` note; Added the two new helper exports; Changed the subscription re-render scope; Fixed the headless display column header and callback refs.
- `pnpm format` pass `f1ca0b7`: only `apps/shadcn-table-docs/lib/utils.ts`.
- `35f9d16`: `components/ui-radix/shadcn-table` reinstalled; the installer does not delete, so the 110 files of the old layout (`body/`, `buttons/`, `fns/`, `footer/`, `head/`, `inputs/`, `locales/`, `menus/`, `modals/`, `table/`, `toolbar/`, `utils/`) were removed by hand. The copy now has the same 143 paths as LIB; contents equal after the `@/components/ui/` to `@/components/ui-radix/` rewrite, except the shadcn CLI drops the leading file comment of the eleven `features/st*Feature.ts` and `shared/utils/pagination.utils.ts`. `packages/shadcn-table/registry.json` unchanged.

### Gates

On `35f9d16`, from `packages/shadcn-table`:

- `pnpm tsc:radix`: exit 0, no output.
- `npx tsc -p tsconfig.stories.json --noEmit`: exit 0, no output.
- `pnpm lint`: exit 0, no output.
- `pnpm test`: `Test Files 58 passed (58)`, `Tests 429 passed (429)`.
- `pnpm storybook:build`: `Storybook build completed successfully`.
- `node scripts/check-storybook.mjs --base http://localhost:6046` (static server on 6046, base manager output from the failing `storybook:build:base`): `14 passed, 0 failed`.
- `grep -rn "table\.state" .../shadcn-table/components`: no hits.
- Worktree root: `pnpm registry:build` `Building registry.`; `pnpm --filter shadcn-table-docs lib:install radix` `143 table files (38 locales merged in), 28 parts`, then `git status` clean.

### Gates, final

On `819b7c6`, clean tree, from `packages/shadcn-table` unless noted:

- `pnpm tsc:radix`: pass, exit 0, no output.
- `npx tsc -p tsconfig.stories.json --noEmit`: pass, exit 0, no output.
- `pnpm lint`: pass, exit 0, no output.
- `pnpm test`: pass, `Test Files 58 passed (58)`, `Tests 429 passed (429)`.
- `pnpm storybook:build`: pass, `Storybook build completed successfully`.
- `node scripts/check-storybook.mjs --base http://localhost:6046` (static server on 6046, base manager output from the failing `storybook:build:base`, part 02): pass, `14 passed, 0 failed`.
- `grep -rn "table\.state"` over `components/` and `hooks/display-columns/`: pass, no hits.
- Worktree root, `pnpm registry:build`: pass, `Building registry.`, then `git status` clean.
- Worktree root, `pnpm --filter shadcn-table-docs lib:install radix`: pass, `143 table files (38 locales merged in), 28 parts`, then `git status` clean.

### Two trees in one program

- The docs app compiles both installed copies, so both `declare module '@tanstack/react-table'` blocks merge and each feature-map member must have identical types, checked deeply. `stConfigFeature` types its eight part-prop members (`stCreateRowModalProps`, `stEditRowDialogProps`, `stFilterCheckboxProps`, `stFilterSliderProps`, `stSelectAllCheckboxProps`, `stSelectCheckboxProps`, `defaultDisplayColumn`, `displayColumnDefOptions`; column `stFilterCheckboxProps`, `stFilterSliderProps`) through a `TParts` parameter that defaults to `ST_NeutralPartPropTypes` (`ST_PartProps = object`); the augmentation and everything it reaches (`ST_TableInstance.options` as `ST_DefinedTableOptions`, `column.columnDef` as `ST_DefinedColumnDef`, the display column defs and `column.utils`) use the neutral map, while `ST_TableOptions`, `ST_ColumnDef` and `ST_DisplayColumnDef` default `TParts` to this tree's `ST_PartPropTypes`, and the four reading components (`ST_FilterCheckbox`, `ST_FilterRangeSlider`, `ST_SelectCheckbox`, `ST_EditRowModal`) re-type the members with a `Pick<ST_TableOptions<TData>, ...>` or `Pick<ST_ColumnDef<TData>, ...>` annotation. Overlaying only `ST_TableOptions` and `ST_ColumnDef` was tried first: it makes `ST_TableInstance`, `ST_Row`, `ST_Cell` and `ST_Column` tree-specific, and five features then fail TS2717 (282 errors in the docs tsc).

### Known red, deferred

- Part 02: `pnpm storybook:build:base` (run, `UNLOADABLE_DEPENDENCY`: stories import radix-only `components/` and `shared/` paths); `pnpm check:bases`, `pnpm tsc:baseui` (expected red, not run).
- Part 04: the docs app `types:check`, `lint`, `build` and `check-pages.mjs` (expected red, not run: guides and examples still use the `table` prop and removed names).
- Open from phase 03: a `table: ST_TableInstance<TData>` override on `ST_Row`, `ST_Cell`, `ST_Column`, `ST_Header` would drop the `X.table as unknown as ST_TableInstance<TData>` casts; not done here (public type change, owner call).
