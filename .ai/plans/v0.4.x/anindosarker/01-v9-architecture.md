# 01: v9 architecture

## 1. Architecture

### 1.1 Overview

Our TanStack Table v9 port (0.3.0) kept the v8-shaped hooks: ST state in 21 `useState` calls,
setters and refs bolted on with `Object.assign`, names resolved to functions before core.
That shape is invisible on the core table that `row.table`, `cell.table` and
`getContext().table` hand out, which is the root of the headless crash, the stale
`editingCell` read and the unseeded `isSaving` in [findings.md](findings.md). This part
rebuilds the internals of `registry/radix` on v9's own primitives: custom features, a `createTableHook` instance
per mounted table, `instance.table` and context instead of a `table` prop, subscriptions
instead of `table.state`. Decisions: [decisions.md](decisions.md) items 1 to 8. MRT's v9
port is the coverage checklist, not the target (MRT is deprecated). Radix tree only; the
Base UI tree is [02-base-tree.md](02-base-tree.md), stories [03-storybook.md](03-storybook.md),
docs [04-docs.md](04-docs.md), release [05-release.md](05-release.md). Ships as `0.4.0`.

### 1.2 Goals

- `features/` holds every ST state slice, option, setter and ref as v9 custom features;
  `utils/tanstack.features.ts` gone (decisions 1, 2)
- Folder layout per decisions 2: `features/`, `hooks/`, `components/`, `shared/{fns,utils,locales}`,
  root files, full `index.ts`
- `hooks/stTableHook.ts` exports `createSTTableHook(options)`; `useST_TableInstance` calls it
  once per mount with the call's `filterFns`, `sortFns`, `aggregationFns` merged into the
  registry slots, so core resolves names (decision 3)
- No `table` prop on any component: instance-bearing components read `instance.table`,
  the rest read `useSTContext()`; `ST_TableProvider` exported for hand composition
  (decision 4)
- No `table.state` under `components/`: render reads through `Subscribe`, handler reads
  through `.get()`, root provides a stable handle; `memoMode` removed (decision 5)
- `ST_Features` exported as a type only; `expandRowsFn` removed (decisions 6, 7)
- Row pinning on select follows the `rowSelection` store (decision 8)
- Public surface otherwise unchanged: `useShadcnTable`, `ShadcnTable`, `ST_TableOptions`,
  every `ST_*` option, prop and type name, user-side `table.state`, the locale items
- Every file with an MRT twin is covered by the twin map in `01-00-comparison.md`; a
  deliberate divergence is one tracker line
- Radix tree green on every radix gate; registry builds; the findings in
  [findings.md](findings.md) closed in the radix tree

### 1.3 Current structure

Ours (per tree, `registry/<base>/components/ui/shadcn-table/`, 129 files):

```
shadcn-table/
├── body/ buttons/ fns/ footer/ head/ inputs/ locales/ menus/ modals/ table/ toolbar/
├── hooks/
│   ├── display-columns/
│   ├── useShadcnTable.ts  useST_TableInstance.ts  useST_TableOptions.ts  useST_Effects.ts
│   └── useST_Rows.ts  useST_ColumnVirtualizer.ts  useST_RowVirtualizer.ts
├── utils/
│   ├── tanstack.features.ts              ← tableFeatures of built-ins only
│   └── tanstack.helpers.ts  cell/column/displayColumn/row/style/pagination/virtualization .utils.ts  utils.ts
├── fns/sortFns.ts  aggregationFns.ts  filterFns.ts
└── icons.ts  index.ts  ShadcnTable.tsx  ST_Tooltip.tsx  types.ts
```

MRT v9 port (`../tanstack-table/examples/react/material-react-table/src/material-react-table/`,
139 files, head `95c476849`):

```
material-react-table/
├── components/  body/ buttons/ footer/ head/ inputs/ menus/ modals/ table/ toolbar/
├── features/
│   ├── mrtFeatures.ts                    ← tableFeatures({ ...stockFeatures, ...custom, row models, fn registries })
│   ├── mrtCellActionsFeature.ts  mrtColumnDraggingFeature.ts  mrtConfigFeature.ts  mrtDensityFeature.ts
│   ├── mrtEditingFeature.ts  mrtFilterModesFeature.ts  mrtFullScreenFeature.ts  mrtLoadingFeature.ts
│   └── mrtRefsFeature.ts  mrtRowDraggingFeature.ts  mrtToolbarsFeature.ts
├── hooks/
│   ├── mrtTableHook.ts                   ← createTableHook: useAppTable, useTableContext, useCellContext, useHeaderContext
│   ├── display-columns/  useMaterialReactTable.ts  useMRT_TableInstance.ts  useMRT_TableOptions.ts
│   └── useMRT_Effects.ts  useMRT_Rows.ts  useMRT_ColumnVirtualizer.ts  useMRT_RowVirtualizer.ts
├── fns/sortingFns.ts  aggregationFns.ts  filterFns.ts
├── locales/  utils/
└── icons.ts  index.ts  types.ts
```

File map: 123 twins. Ours only: `fns/sortFns.ts` (MRT `fns/sortingFns.ts`), `ST_Tooltip.tsx`,
`table/ST_TableLayout.tsx`, `toolbar/useST_MediaQuery.ts`, `utils/pagination.utils.ts`,
`utils/tanstack.features.ts`. MRT only: `features/` (12 features plus `mrtFeatures.ts`),
`hooks/mrtTableHook.ts`, `table/MRT_TablePaper.tsx`, `locales/mk.ts`.

### 1.4 Target structure

Per tree (`registry/radix` in this part, `registry/base` in part 02):

```
shadcn-table/
├── features/
│   ├── stFeatures.ts                     ← tableFeatures({ ...stockFeatures, ...custom, row models, built-in fn registries })
│   ├── stCellActionsFeature.ts  stColumnDraggingFeature.ts  stConfigFeature.ts  stDensityFeature.ts
│   ├── stEditingFeature.ts  stFilterModesFeature.ts  stFullScreenFeature.ts  stLoadingFeature.ts
│   └── stRefsFeature.ts  stRowDraggingFeature.ts  stToolbarsFeature.ts
├── hooks/
│   ├── stTableHook.ts                    ← createSTTableHook(options): createTableHook with the call's
│   │                                        fn registries merged (decisions.md D3); useSTContext on the shared context
│   ├── useST_TableInstance.ts            ← createSTTableHook once per mount (useState initializer), then useAppTable
│   ├── useShadcnTable.ts  useST_TableOptions.ts  useST_Effects.ts  useST_Rows.ts  virtualizers
│   └── display-columns/
├── components/                           ← table/ head/ body/ footer/ toolbar/ buttons/ inputs/ menus/ modals/
├── shared/
│   ├── fns/                              ← filterFns.ts  sortFns.ts  aggregationFns.ts (name kept, contents aligned)
│   ├── utils/                            ← tanstack.features.ts removed
│   └── locales/                          ← 38 + mk.ts
├── ShadcnTable.tsx  ST_Tooltip.tsx  icons.ts
├── types.ts                              ← derived from ST_Features
└── index.ts                              ← full barrel, unchanged
```

Folder decisions and the D3 mechanism: `decisions.md` items 2 and 4.

### 1.5 Flow

```mermaid
sequenceDiagram
  participant App
  participant useShadcnTable
  participant useST_TableInstance
  participant createSTTableHook as createSTTableHook (once per mount)
  participant useAppTable
  participant core as core table (features, store, atoms)
  App->>useShadcnTable: options (columns, data, filterFns, ...)
  useShadcnTable->>useST_TableInstance: defined options
  useST_TableInstance->>createSTTableHook: options.filterFns/sortFns/aggregationFns
  createSTTableHook-->>useST_TableInstance: useAppTable bound to stFeatures + call registries
  useST_TableInstance->>useAppTable: options + display columns + initialState
  useAppTable->>core: constructTable once; features install atoms, setters, refs
  useAppTable-->>useST_TableInstance: wrapper (core + state)
  useST_TableInstance-->>App: ST_TableInstance (wrapper, default selector)
  App->>ShadcnTable: table
  ShadcnTable->>ST_TableProvider: stable handle (first wrapper, kept in a ref)
  ST_TableProvider-->>components: useSTContext() or instance.table, Subscribe for reads
```

### 1.6 Components

#### 1.6.1 Data artifacts

- `CHANGELOG.md` `## Unreleased`, written as work lands; closed as `## 0.4.0` at release
- Registry items unchanged in name; `files[]` lists follow the folder moves (`features/*`,
  `components/*`, `shared/*`), lose `utils/tanstack.features.ts`, gain `locales/mk.ts`
- `scripts/registry/lib.mjs` path globs and `scripts/registry/base-diff.json` paths follow
  the folder moves (the base tree itself is part 02)

#### 1.6.2 Comparison report

`01-00-comparison.md`, phase 00 output, done (`d1a3a12`). 123 twin files, 209 divergence
rows, 53 ownership entries. D1 to D5 in its section 1.1 are ruled (decisions 3 to 7). Its
`apps/docs/` paths read `apps/shadcn-table-docs/`.

#### 1.6.3 Features and `stFeatures`

`features/`, one file per state group, mirroring MRT's twelve (decisions 1, 2).

- Each feature: `getInitialState`, `getDefaultTableOptions`, `constructTableAPIs` and the
  row, column, cell, header hooks the twin has, plus the `declare module` block (`Plugins`,
  `TableState_FeatureMap`, `TableOptions_FeatureMap`, `Table_FeatureMap`, and the row,
  column, cell, header maps where present)
- `stConfigFeature.ts` declares every ST-only option that has no state (the list in
  `types.ts` today, minus `expandRowsFn`), plus the three registry options `filterFns`,
  `sortFns`, `aggregationFns` and `memoMode` removed
- `stLoadingFeature.ts` defaults `isLoading`, `isSaving`, `showLoadingOverlay`,
  `showProgressBars`, `showSkeletons` to `false` (findings)
- `stRefsFeature.ts` puts `table.refs` on the core table as plain `{ current }` objects
- `stFeatures.ts` registers `...stockFeatures`, the eleven, every row model factory and the
  three built-in registries from `shared/fns`
- Does NOT add options or state the twin does not have, except the three registry options
  and `ST_TableProvider` (decisions 3, 4)

**Operations:**

| Operation                      | Status   | Notes                                           |
| ------------------------------ | -------- | ----------------------------------------------- |
| `features/st*Feature.ts` (11)  | new      | one per MRT feature                             |
| `features/stFeatures.ts`       | new      | replaces `utils/tanstack.features.ts`           |
| `utils/tanstack.features.ts`   | removed  |                                                 |
| `shared/fns/*.ts`              | refactor | built-ins through `constructFilterFn` /         |
|                                |          | `constructAggregationFn`; `sortFns.ts` name kept |

**Interfaces:**

```typescript
// features/stFeatures.ts
export const stFeatures = tableFeatures({
  ...stockFeatures,
  stCellActionsFeature, stColumnDraggingFeature, stConfigFeature, stDensityFeature,
  stEditingFeature, stFilterModesFeature, stFullScreenFeature, stLoadingFeature,
  stRefsFeature, stRowDraggingFeature, stToolbarsFeature,
  coreRowModel: createCoreRowModel(), /* other row models as today */
  filterFns: ST_FilterFns, sortFns: ST_SortFns, aggregationFns: ST_AggregationFns,
});
export type ST_Features = typeof stFeatures;   // exported from index.ts as a type only
```

#### 1.6.4 Table hook and context

`hooks/stTableHook.ts` (decisions 3, 4).

```typescript
export const createSTTableHook = <TData>(o: ST_DefinedTableOptions<TData>) =>
  createTableHook({
    features: tableFeatures({
      ...stFeatures,
      filterFns:      { ...ST_FilterFns,      ...o.filterFns },
      sortFns:        { ...ST_SortFns,        ...o.sortFns },
      aggregationFns: { ...ST_AggregationFns, ...o.aggregationFns },
    }),
  });

export const { tableContext, useTableContext: useSTContext } = createTableHookContexts<ST_Features>();
export const ST_TableProvider = ({ table, children }) => <tableContext.Provider value={table}>{children}</tableContext.Provider>;
```

- `createSTTableHook` and `useSTContext` internal; `ST_TableProvider` public
- The shared module-scoped context is the one `createTableHook` uses by default, so
  `useSTContext` reads any table regardless of which instance built it
- Does NOT register `tableComponents`, `cellComponents`, `headerComponents` (empty maps, as MRT)

#### 1.6.5 Types

`types.ts` derives from `ST_Features` as MRT's `types.ts` does.

- `ST_TableInstance`, `ST_TableState`, `ST_DefinedTableOptions`,
  `ST_StatefulTableOptions` collapse to thin wrappers over the feature-carried surface
- `ST_FilterOption`, `ST_SortingOption`, `ST_AggregationOption` stay `LiteralUnion` over the
  built-in keys (custom names typecheck as any string, as today)
- `memoMode`, `expandRowsFn` and the `table` prop types removed; `ST_TableProviderProps` added
- Does NOT rename any public `ST_*` type

#### 1.6.6 Instance and options

- `useST_TableInstance`: `const [{ useAppTable }] = useState(() => createSTTableHook(options))`;
  builds `initialState` (pagination, columnOrder, grouping, columnResizing defaults) and the
  columns with display columns; calls `useAppTable`; returns the wrapper. No `useState` for ST
  slices, no `Object.assign`, no `@ts-expect-error`
- `useST_TableOptions`: defaults that moved into a feature's `getDefaultTableOptions` go;
  the registry merge at `:119-120` goes; `manualPagination` forced `true` whenever
  `enablePagination` is `false` (findings); `manualFiltering` forced when every filter flag
  is off
- `shared/utils/column.utils.ts`: the name-to-function swap and `_filterFn` go;
  `prepareColumns` writes the current mode name onto `columnDef.filterFn`
- `useST_Effects`: one store subscription on `rowSelection` that pins and unpins per
  `rowPinningDisplayMode` (decision 8); the diff in `getST_RowSelectionHandler` and the pin
  loop in `getST_SelectAllHandler` go
- `useST_Rows`, the virtualizer hooks: aligned with their twins

**Operations:**

| Operation                     | Status   | Notes                                       |
| ----------------------------- | -------- | ------------------------------------------- |
| `useST_TableInstance()`       | refactor | per-mount hook, then `useAppTable`           |
| `useST_TableOptions()`        | refactor | defaults to features, guards fixed           |
| `column.utils.ts`             | refactor | names stay names                             |
| `useST_Effects()`             | refactor | pin-on-select subscription                   |
| `row.utils.ts`                | refactor | handler diff and select-all pin loop removed |
| `useShadcnTable()`            | keep     | public entry                                 |

#### 1.6.7 Component clusters

`components/`: table, head, body, footer, toolbar, inputs, menus, buttons, modals; plus
`hooks/display-columns/`. 57 components, 51 read `table.state` today.

- Table access (decision 4): a component with `row`, `cell`, `header` or `column` reads
  `instance.table` and drops the `table` prop (about 35 files); a component with no instance
  reads `useSTContext()` (about 20 files). No pass-down of `table` anywhere
- State reads (decision 5): every render read inside `<Subscribe source={table.atoms.x}>` or
  `<Subscribe source={table.store} selector={...}>`; handler and effect reads through
  `table.atoms.x.get()` or `table.store.state.x`; writes `table.setX`. Grep gate: zero
  `table.state` under `components/`
- `ShadcnTable.tsx`: resolves the table from the `table` prop or from options, keeps the
  first wrapper in a ref as the stable handle, wraps `ST_TableLayout` in `ST_TableProvider`
- `ST_TableBody` subscribes to every slice that feeds `getRowModel()` (filters, global
  filter, sorting, grouping, expanded, pagination, row pinning) and to `data` through the
  owner render
- `ST_CellActionMenu` `onCloseAutoFocus` reads `table.atoms.editingCell.get()` (findings)
- `ST_SelectCheckbox` indeterminate gated with `getIsSomeRowsSelected() && !getIsAllRowsSelected()`
  (v9 semantics)
- `memoMode` branches (`Memo_ST_TableBodyRow`, `Memo_ST_TableBodyCell`) removed
- Radix tree only; part 02 ports to `registry/base`
- Does NOT change markup or class names beyond what the rewrite forces

**Stays unchanged:** every prop except `table`, class names, shadcn parts used.

#### 1.6.8 Our-only files and locales

- `ST_TableLayout.tsx`, `ST_Tooltip.tsx`, `useST_MediaQuery.ts`, `pagination.utils.ts`: kept
  as recorded deviations
- `shared/locales/mk.ts`: added (92 keys matching `en.ts`); the registry emits its item
- The 38 locale files import `types.ts` directly, not `index.ts`
- `ST_TablePaper`: stays out

#### 1.6.9 Changelog

- `CHANGELOG.md` `## Unreleased`, written as each phase lands: Breaking (table prop,
  `memoMode`, `expandRowsFn`, `stFeatures` value, `filterFns` resolution now in core),
  Fixed (findings), Added (`ST_TableProvider`, `mk` locale). Docs, stories and the release
  are parts 03 to 05

### 1.7 Dependencies and env

Reused: `@tanstack/react-table` 9.3.1 (pinned in both `package.json` files, both
`registry.ts`, the registry items, the CI `existing` scenario). Reference clone
`../tanstack-table` (sparse: docs, the MRT and shadcn examples, `packages/table-core` and
`packages/react-table` source), updated with `git -C ../tanstack-table pull` before each
phase; the tracker records the head commit used. Name map: `MRT_` to `ST_`, `useMRT_` to
`useST_`, `mrt*Feature` to `st*Feature`, `MaterialReactTable` to `ShadcnTable`; MRT
`components/<group>/` is our `components/<group>/`, `fns/` `utils/` `locales/` are under
`shared/`. v9 guides: custom-features, composable-tables, table-context, table-state,
react-compiler, column-filtering under
https://tanstack.com/table/latest/docs/framework/react/guide/.

## 2. Instructions for AI

Tracker `01-tracker.md`, decisions and deviations only. One Workflow run per phase,
resumable; agents in `shadcn-react-table.worktrees/<name>` on their own branches, push only;
the lead merges onto `v0.4/v9-architecture`; the part merges into `dev` when the final
phase is green. Each phase ends with every gate in 2.2 green and one commit per cluster.
The base tree is not touched in this part; `pnpm check:bases` is expected red until part 02
lands and is not a gate here. Before phase 01: merge `dev` into
`v0.4/v9-architecture` and move `06-00-comparison.md` to
`.ai/plans/v0.4.x/anindosarker/01-00-comparison.md` on that branch.

Halt and ask the owner on: a public API choice not covered by `decisions.md`, more than 3
review bounces, an unfixable gate, a finding that contradicts a recorded decision.

### 2.1 Phases

#### 2.1.1 Phase 00: Comparison

Done, `01-00-comparison.md`.

#### 2.1.2 Phase 01: Folders, features, hook, types

- Folder moves per decisions 2 (`components/`, `shared/`), registry globs and
  `base-diff.json` paths follow; `tsc:radix` green before any feature lands
- 1.6.3, 1.6.4, 1.6.5; one coder per feature, reviewer bounce up to 3, gates on the merged
  result
- Verify: decisions item 3 list (custom names through `filterFns`, `sortFns`,
  `aggregationFns` resolve in core; two tables with different registries; unknown name
  warns; no `@ts-expect-error`)

#### 2.1.3 Phase 02: Instance and options

- 1.6.6
- Verify: decisions item 8 list (pin-on-select under internal, controlled and external-atom
  selection); `enablePagination: false` with `manualPagination: false` shows all rows;
  headless render of a display column header no longer crashes

#### 2.1.4 Phase 03: Components

- 1.6.7, per cluster: coder, reviewer who walks the twin and checks every state read is a
  subscription or a `.get()`, verifier who runs the gates and the cluster's stories on the
  radix Storybook through Playwright
- Verify: decisions items 4 and 5 lists (nested table, portals, custom renderers, no
  provider throws; React Profiler counts for hover, density, select; data replacement;
  cell action menu edit keeps focus), on the radix Storybook

#### 2.1.5 Phase 04: Our-only files and locales

- 1.6.8

#### 2.1.6 Final phase: Cleanup

- Delete every helper the features made dead; `index.ts` exports per decisions 2, 6
- `CHANGELOG.md` `## Unreleased` complete for the library; `pnpm format`; every gate in
  2.2; merge into `dev`

### 2.2 Gates (radix)

- `pnpm --filter shadcn-table tsc:radix`, `tsc -p tsconfig.stories.json`, `lint`; `test`
  (vitest browser mode, radix); `storybook:build`; `node scripts/check-storybook.mjs`
- `grep -rn "table\.state" packages/shadcn-table/registry/radix/components/ui/shadcn-table/components` returns nothing
- `pnpm registry:build`; `pnpm --filter shadcn-table-docs lib:install radix` leaves
  `components/ui-radix` consistent with the registry
- Stories that compose sub-components with `table={table}` are updated in this part only as
  far as `test` needs to pass; the rest is part 03
