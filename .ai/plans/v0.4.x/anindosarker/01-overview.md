# Part 01 overview: current package vs the v9 architecture

Written 2026-10-26 for the owner, before the D1 to D5 rulings. Radix base only; the base tree
is identical in shape. Companion to `01-v9-architecture.md` (the plan) and
`01-00-comparison.md` (the per-file report on branch `v0.4/v9-architecture`).

## 1. How the current package works

Root: `packages/shadcn-table/registry/radix/components/ui/shadcn-table/`.

```TypeScript
shadcn-table/
├── ShadcnTable.tsx            <ShadcnTable table={table} /> or options as props; renders table/ST_TableLayout
├── hooks/
│   ├── useShadcnTable.ts      useST_TableInstance(useST_TableOptions(options))
│   ├── useST_TableOptions.ts  defaults, enable*/manual* guards, locale merge
│   ├── useST_TableInstance.ts the big one: 21 useState calls (density, editingCell, isFullScreen,
│   │                          showColumnFilters, ...), merged into options.state, then useTable(),
│   │                          then Object.assign(table, { refs, setDensity, setEditingCell, ... })
│   ├── useST_Effects.ts  useST_Rows.ts  useST_ColumnVirtualizer.ts  useST_RowVirtualizer.ts
│   └── display-columns/       select, expand, actions, numbers, drag, pin column defs
├── utils/
│   ├── tanstack.features.ts   stFeatures = tableFeatures({ stock features, row models, ST fn registries })
│   └── tanstack.helpers.ts  cell/column/displayColumn/row/style/pagination/virtualization .utils.ts
├── fns/                       filterFns.ts  sortFns.ts  aggregationFns.ts (ST registries)
├── types.ts                   ST_TableOptions, ST_TableState, ST_TableInstance written by hand
├── body/ head/ footer/ toolbar/ buttons/ inputs/ menus/ modals/ table/
│                              57 components, every one takes a `table` prop
└── locales/ (38)  icons.ts  index.ts  ST_Tooltip.tsx
```

Flow today:

1. `useShadcnTable(options)` runs `useST_TableOptions` for defaults and guards.
2. `useST_TableInstance` keeps every ST-only state slice in React `useState`. TanStack sees those
   slices only because the hook spreads them into `options.state` before calling `useTable()`.
3. `useTable()` returns a copy of the core table with `state` attached. The hook then
   `Object.assign`s ST setters, refs and helper APIs onto that copy.
4. `ShadcnTable` passes the result down as a `table` prop. Components read `table.state.density`,
   call `table.setDensity`, touch `table.refs.tableContainerRef`.

What this shape costs (see `findings.md`):

- The bolt-on lives on the copy, not on the core table. `header.getContext().table`,
  `cell.getContext().table`, `row.table` and `column.table` have no `state`, no `refs`, no ST
  setters. Headless rendering of ST display columns crashes.
- `editingCell`, `isSaving`, `showProgressBars` and the rest have no store entry, so there is no
  live read outside render. `ST_CellActionMenu` reads a stale snapshot and breaks cell edit.
- Row models are static slots on `stFeatures`, so the old per-flag `get*RowModel` gating is gone.
  `enablePagination: false` with `manualPagination: false` now paginates.
- `getST_RowSelectionHandler` diffs `table.baseAtoms.rowSelection`, which is empty under
  controlled selection.

## 2. What the v9 architecture changes

Target per `01-v9-architecture.md` section 1.4, mirroring the MRT v9 port at
`../tanstack-table/examples/react/material-react-table/src/material-react-table/`.

```TypeScript
shadcn-table/
├── features/                              new
│   ├── stFeatures.ts                      tableFeatures({ ...stockFeatures, 11 st*Feature, row models, fn registries })
│   ├── stDensityFeature.ts                state { density }, default onDensityChange, table.setDensity
│   ├── stEditingFeature.ts                editingCell, editingRow, creatingRow as atoms
│   ├── stLoadingFeature.ts                isLoading, isSaving, showProgressBars with defaults
│   ├── stRefsFeature.ts                   tableContainerRef, topToolbarRef, ... on the core table
│   ├── stToolbarsFeature.ts  stFullScreenFeature.ts  stFilterModesFeature.ts
│   └── stCellActionsFeature.ts  stColumnDraggingFeature.ts  stRowDraggingFeature.ts  stConfigFeature.ts
├── hooks/
│   ├── stTableHook.ts                     new: createSTTableHook(options) wraps createTableHook with the call's
│   │                                      fn registries merged; useSTContext, ST_TableProvider
│   ├── useST_TableInstance.ts             shrinks: createSTTableHook once per mount, initialState,
│   │                                      display columns, then useAppTable(options)
│   ├── useShadcnTable.ts  useST_TableOptions.ts  useST_Effects.ts  useST_Rows.ts  virtualizers
│   └── display-columns/                   same roles
├── utils/                                 tanstack.features.ts removed (moved to features/)
├── types.ts                               ST_TableState, ST_TableOptions, ST_TableInstance derived from ST_Features
├── ShadcnTable.tsx                        wraps the layout in <table.AppTable> (context provider)
├── components/ (57 components)            no table prop: instance.table or useSTContext(); Subscribe for reads
└── fns/  locales/ (+mk)  icons.ts  index.ts  ST_Tooltip.tsx
```

Each ST state slice becomes a TanStack feature. One file declares the state key, its default
option and its setter through `assignTableAPIs`. Core then provides, for free: a base atom,
`table.state.<slice>`, controlled-state sync through `on<X>Change`, and `table.Subscribe` or
`table.atoms.<slice>` for narrow reads. Refs ride the same mechanism in `stRefsFeature`.

Because features install onto the core table, the same object reaches `getContext().table`,
`row.table` and `column.table`. That alone fixes the headless crash, the missing `isSaving`
default and the stale `editingCell` read.

Density, today versus after, for scale:

```ts
// today: hooks/useST_TableInstance.ts:124 and :295
const [density, setDensity] = useState<ST_DensityState>(initialState.density ?? 'comfortable');
// ... spread into options.state
Object.assign(table, { setDensity: statefulTableOptions.onDensityChange ?? setDensity });

// after: features/stDensityFeature.ts, mirror of mrtDensityFeature.ts (76 lines)
export const stDensityFeature: TableFeature = {
  getInitialState: (s) => ({ density: 'comfortable', ...s }),
  getDefaultTableOptions: (table) => ({ onDensityChange: makeStateUpdater('density', table) }),
  constructTableAPIs: (table) =>
    assignTableAPIs('stDensityFeature', table, {
      table_setDensity: {
        fn: (u) => table.options.onDensityChange?.((old) => functionalUpdate(u, old)),
      },
    }),
};
```

The public API does not move: `useShadcnTable`, `ShadcnTable`, option names, `table.state.x`,
`table.setX`, `table.refs.x`. What changes is where each piece is implemented.

## 3. Where the findings land

| Finding (`findings.md`)                                     | Resolved by                                                                           |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `as any` on `useTable` options                            | done, `1e71d80`                                                                     |
| `filterFn` string type, unregistered user fns               | D3 ruling, then phase 01                                                              |
| `getContext().table` has no state, refs, setters            | phase 01 and 02 (features on the core table)                                          |
| `isSaving`, `showProgressBars` never seeded               | phase 01, `stLoadingFeature` defaults                                               |
| `ST_CellActionMenu` stale `editingCell`                   | phase 03 reads `table.atoms.editingCell.get()`; hotfix possible now with a ref flag |
| `getST_RowSelectionHandler` diffs `baseAtoms`             | phase 02 or 04, read `table.atoms.rowSelection` before and after                    |
| `manualPagination` guard, `columnFilters` without filters | phase 02, `useST_TableOptions`                                                      |

## 4. Core v9 changes relevant to the decisions

From `tanstack-table/docs/framework/react/guide/migrating.md` (pulled 2026-10-23).

- `createTableHook` is optional. It binds features once and returns `useAppTable`,
  `useTableContext`, `createAppColumnHelper`. `useTableContext` throws outside `<table.AppTable>`.
  This is D1.
- `table.state` is the full registered state by default and the guide's recommended read.
  `table.Subscribe` and `table.atoms.<slice>` are the narrow forms, listed as optional. MRT keeps
  `table.state` in 55 of 57 components. This is D2.
- Fn registries are slots on `tableFeatures`. String names resolve only through what is
  registered; `options.filterFns` is never read by core. Spreading the full built-in registries
  is deprecated in favor of per-function imports. This is D3.
- Custom features register state, options and APIs through the same feature system. D4 is only
  whether `stFeatures` stays exported.
- Nothing in the guide touches `expandRowsFn`. D5 is housekeeping.

Items from the guide that part 06 should carry and the plan does not list yet:

- `onStateChange` is removed. Check the prop tables do not document it.
- `getIsSomeRowsSelected()` is now true at full selection. Indeterminate checkboxes need
  `getIsSomeRowsSelected() && !getIsAllRowsSelected()`. Audit `ST_SelectCheckbox`.
- Custom aggregation callables must become `constructAggregationFn({ aggregate, merge? })`.
  Audit `fns/aggregationFns.ts`.
- `row.getToggleSelectedHandler()` does Shift range selection by default. Already ruled: keep
  `enableRowRangeSelection`.
