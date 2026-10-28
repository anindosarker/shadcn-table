# v0.4.0 findings

### hooks/useST_TableInstance.ts

- `as any` on the `useTable` options (v9 port, `c04d8ba`) turned off type checking for the
  whole object; v8 had a scoped `@ts-expect-error`. Restored to `@ts-expect-error` in
  `1e71d80`.
- The only error under it is the column `filterFn` type: `ST_FilterOption` accepts any string,
  TanStack only names registered on `stFeatures.filterFns`. Goes away with D3.

  ```ts
  { accessorKey: 'name', filterFn: 'myCustomFilter' } // ok in ST_ColumnDef, not in TanStack ColumnDef
  ```

- User-supplied `filterFns`, `sortFns`, `aggregationFns` are not registered on the feature
  slots; the hook resolves `globalFilterFn` by hand from `options.filterFns`, which core never
  reads (D3).

- v9 `useTable` returns a copy (`{ ...table, state }`), and `Object.assign` adds refs and
  setters to that copy only. `header.getContext().table`, `cell.getContext().table`,
  `row.table` and `column.table` are the core table: no `state`, no `refs`, no ST setters.
  The library never reads them, but a user rendering ST display columns headless crashes
  (v8 passed the full instance):

  ```tsx
  flexRender(header.column.columnDef.header, header.getContext()) // ST_SelectCheckbox reads table.state: undefined
  ```

  Part 06 features put state, refs and setters on the core table, which fixes it.

### utils/row.utils.ts

- `getST_RowSelectionHandler` finds the rows a Shift-click range changed by diffing
  `table.baseAtoms.rowSelection` before and after `row.getToggleSelectedHandler()`. With
  controlled `rowSelection` (`onRowSelectionChange`) or an external `atoms.rowSelection`, v9
  calls the user handler and never writes the base atom (`table_setRowSelection`,
  `makeStateUpdater`), so the diff is empty: only the clicked row is pinned under
  `rowPinningDisplayMode: 'select-*'`, the rest of the range is not.
- `baseAtoms` is TanStack's internal write target ("mostly internal" in the v9 migration
  guide).

### toolbar/ST_LinearProgressBar.tsx

- Reads `isSaving` and `showProgressBars` from `table.state`, but nothing seeds them: no
  `useState`, no default. They exist only when the user passes them in `state`. Part 06
  removes the `options.state` merge, so stLoadingFeature must default `isSaving` (and
  `isLoading`) to `false` and leave `showProgressBars` unset, because unset follows
  `isSaving` while an explicit `false` turns the bar off (review ruling 1;
  `mrtLoadingFeature.ts:5-7, 29-31` seeds `false`, the bug MRT's v9 port carries).

### menus/ST_CellActionMenu.tsx

- Edit from the cell action menu is broken (`editDisplayMode="cell"`, any `memoMode`). Confirmed
  in Storybook "Cell Actions With Built Ins", 3 of 3: focus returns to the `td`, the edit input
  blurs and unmounts.
- Cause: `onCloseAutoFocus` checks `table.state.editingCell`, a render snapshot that is still
  `null` when the menu closes, so it refocuses the anchor. v8 read the live value with
  `table.getState()`.

  ```tsx
  onCloseAutoFocus={(event) => {
    event.preventDefault();
    if (!table.state.editingCell) anchorEl?.focus(); // v8: table.getState().editingCell
  }}
  ```

- `editingCell` is ST-only React state, so `table.store.state` has no live copy today. Part 06
  `stEditingFeature` makes it an atom: read `table.atoms.editingCell.get()`. A hotfix before
  that needs a ref flag set by the Edit item.
- `memoMode="rows"` freezes edit mode, selection checkboxes, density and column pinning in rows
  (same Storybook run). Not a v9 regression: MRT documents that `memoMode` stops these
  features.

### hooks/useST_TableOptions.ts

- v8 attached each `get*RowModel` only when its `enable*` flag was on and `manual*` was off;
  v9 row models are static `stFeatures` slots, cached on first use and gated only by
  `manual*` (`coreRowModelsFeature.utils.js`). Sorting and global filtering still check
  `getCanSort` / `getCanGlobalFilter` inside the model, so they match v8.
- Pagination gap: `manualPagination` is forced to `true` only when it is `undefined`, so
  `enablePagination: false` with `manualPagination: false` paginates to 10 rows in v9 (v8
  showed all rows). MRT has the same guard (`useMRT_TableOptions.ts:145`). Fix in part 06
  phase 02: force `manualPagination = true` whenever `enablePagination` is false.

  ```ts
  <ShadcnTable enablePagination={false} manualPagination={false} /> // v8: all rows, v9: 10 rows
  ```

- Column filter edge: with `enableFilters`, `enableColumnFilters` and `enableGlobalFilter` all
  false, `columnFilters` in state still filter rows in v9 (v8 had no filtered row model).
