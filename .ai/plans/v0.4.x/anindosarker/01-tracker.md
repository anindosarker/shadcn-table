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
- Verify story `stories/features/FnRegistries.stories.tsx` imports `useSTContext` from `hooks/stTableHook` because no public reader exists until phase 03 drops the `table` prop; part 03 consolidates the story.

### Verify list (decisions item 3)

Browser: radix Storybook, Playwright against `iframe.html`, DOM text and console assertions. Story ids under `features-fn-registries--`.

- [x] Column `filterFn: 'customFilterFn'` from the call's `filterFns` filters rows: `custom-column-filter-fn`, rows `["Mason"]`.
- [x] `globalFilterFn: 'customFilterFn'` filters rows: `custom-global-filter-fn`, rows `["Jackson","Lily","Mason","Tom"]`.
- [x] `'fuzzy'` default works and the highlight renders: `default-fuzzy-global-filter`, rows `["Mason"]`, `mark[data-slot="st-match-highlight"]` text `Mas`.
- [x] Custom `sortFn` name sorts: `custom-sort-fn`, rows `["Tom","Lily","Mason","Brooke","Jackson","Anderson"]`.
- [x] Custom `aggregationFn` name aggregates: `custom-aggregation-fn`, grouped cells `29-41`, `22-50`.
- [x] Two tables with different `filterFns` do not see each other's names: `two-tables-different-registries`, table A `["Mason"]`, table B `["Brooke"]`, console `filterFn 'tableAFilterFn' for column 'firstName' is not registered`.
- [x] Unknown name logs core's dev warning, filters nothing, no throw: `unknown-filter-fn-name`, 6 rows, console `filterFn 'doesNotExist' for column 'firstName' is not registered`, no page error.
- [x] Filter-mode switch via the column action menu changes the applied function on the next value change: `features-filtering-examples--filtering-change-mode-enabled`, fuzzy `egane` shows `Megane`, Starts With hides it, Contains shows it; label `Filter Mode: Starts With` / `Filter Mode: Contains`.
- [ ] Filter-mode switch re-filters an unchanged value: same story, value typed first, then Starts With, row `Megane` stays until the value is retyped. Same on claude/review `3aa3257` (checked in a throwaway worktree), so pre-existing, not phase 01; `ST_FilterOptionMenu.handleSelectFilterMode` calls `column.setFilterValue(currentFilterValue)` and the row model does not recompute.
- [x] No `@ts-expect-error` on the `useAppTable` call; `pnpm tsc:radix` clean. `tsc:baseui` is part 02. Remaining `as any` and `@ts-expect-error` hits under `hooks/` are the virtualizer ones already on claude/review (`useST_RowVirtualizer.ts:79,82`, `useST_ColumnVirtualizer.ts:93,118,122`).
- [x] `useSTContext()` inside a component rendered by `<ShadcnTable>` and beside it under `ST_TableProvider` returns its own table with two mounted: `provider-with-two-tables`, readers `first:2`, `first:2`, `second:4`, `second:4`.
- [x] No remount of `AppTable` across re-renders: `controlled-input-in-custom-toolbar`, typing `focus kept` keeps `document.activeElement` on the input, echo `focus kept`.
- [x] Filter-mode submenu opens from the item's arrow button only; clicking the item itself closes the Radix menu (same on claude/review).
