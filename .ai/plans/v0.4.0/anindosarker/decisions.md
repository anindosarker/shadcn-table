# v0.4.0 part 06, TanStack Table v9 architecture: decisions

Decisions for the part 06 rewrite, taken 2026-10-21 to 2026-10-27. Earlier cycle decisions
(docs app, package layout, docs site, release flow, intermediate releases; all shipped in
0.3.1 to 0.3.3) are in [decisions-archive.md](decisions-archive.md). Plan:
[06-v9-architecture.md](06-v9-architecture.md). Phase 00 report: `06-00-comparison.md` on
branch `v0.4/v9-architecture`. Findings that feed these rulings: [findings.md](findings.md).

## Architecture

1. Rewrite the library internals on TanStack Table v9's own primitives, using MRT's v9 port
   as the checklist, not the target.
   - Reference: `TanStack/table` `main`, `examples/react/material-react-table/src/material-react-table/`,
     sparse clone at `React-table/tanstack-table` (`git pull` to update; `packages/table-core`
     and `packages/react-table` source are checked out too). The
     `React-table/material-react-table` clone is the v8 library and has no v9 code.
   - Shape: ST state, refs and setters become v9 custom features (`features/`); one
     `createTableHook` instance per mounted table (`hooks/stTableHook.ts`, item 4);
     components reach the table through `instance.table` or context, never a prop (item 5);
     render reads are subscriptions, handler reads are `.get()` (item 6).
   - Public API (`useShadcnTable`, `ShadcnTable`, `ST_TableOptions`, the per-call fn
     registries, user-side `table.state`) stays. The table hook and column helper stay
     internal.
   - MRT is deprecated. The 123-file twin map from `06-00-comparison.md` is a coverage
     checklist; where MRT's port is wrong or incomplete (fn registries, `table.state` in
     nested components, `memoMode`), ours diverges and the tracker says so in one line.
   - Why v9 primitives: the core table is what `row.table`, `cell.table`, `header.table` and
     `getContext().table` hand out; only features installed on it reach those paths. Every
     bolt-on in today's `useST_TableInstance` (21 `useState`, `Object.assign`) is invisible
     there, which is the root of the headless crash, the stale `editingCell` read and the
     unseeded `isSaving` in `findings.md`.
   - Ships as `0.4.0`.

2. Library folder structure (decided 2026-10-27). Per base, `registry/<base>/components/ui/shadcn-table/`:

   ```
   shadcn-table/
   ├── features/        stFeatures.ts + one st*Feature.ts per state group (11)
   ├── hooks/           stTableHook.ts, useShadcnTable.ts, useST_*.ts, display-columns/
   ├── components/      table/ head/ body/ footer/ toolbar/ buttons/ inputs/ menus/ modals/
   ├── shared/
   │   ├── fns/         filterFns.ts  sortFns.ts  aggregationFns.ts
   │   ├── utils/       cell, column, row, style, pagination, virtualization, displayColumn, utils
   │   └── locales/     38 + mk
   ├── ShadcnTable.tsx  ST_Tooltip.tsx  types.ts  icons.ts
   └── index.ts
   ```

   - Four top-level folders, one kind each: what a table is, how it is built, how it looks,
     plain data and helpers. `shared/` not `lib/`, because `@/lib` is the user's own folder in
     a shadcn project.
   - Twin map: `components/<x>` to MRT `components/<x>`, `shared/fns` to `fns`, `shared/utils`
     to `utils`, `shared/locales` to `locales`. `utils/tanstack.features.ts` is removed, its
     content becomes `features/stFeatures.ts`.
   - `index.ts` stays a full barrel, every module exported, as today and as MRT. The docs and
     stories import 14 internal components, 18 types and several hooks through it, and the one
     public import path is what lets the folders above move without a breaking change.
   - Internal files import siblings by path, never the barrel. The 38 locale files that import
     `index.ts` today switch to `types.ts` (phase 04).

3. D3, fn registries (decided 2026-10-27). `filterFns`, `sortFns`, `aggregationFns` stay
   per-call table options, same as v8 and MRT v2.
   - Mechanism: v9 keeps the registries inside the `features` object and copies them once at
     construction (`table-core/src/core/table/constructTable.ts:70`), and `useAppTable` omits
     `features` from per-table options (`react-table/src/createTableHook.tsx:953`). So
     `useST_TableInstance` creates its own `createTableHook` instance once per mount, inside a
     `useState` initializer, with the call's registries merged over the built-ins:

     ```ts
     // hooks/stTableHook.ts
     export const createSTTableHook = (o) => createTableHook({
       features: tableFeatures({
         ...stFeatures,
         filterFns:      { ...ST_FilterFns,      ...o.filterFns },
         sortFns:        { ...ST_SortFns,        ...o.sortFns },
         aggregationFns: { ...ST_AggregationFns, ...o.aggregationFns },
       }),
     });
     export const { useTableContext: useSTContext } = createTableHookContexts<ST_Features>();

     // hooks/useST_TableInstance.ts
     const [{ useAppTable }] = useState(() => createSTTableHook(definedOptions));
     const table = useAppTable({ ...definedOptions, columns, initialState });
     ```

   - Core resolves every name itself. Removed: the registry merge in
     `useST_TableOptions.ts:119-120`, the name-to-function swap and `_filterFn` in
     `column.utils.ts:83-93`, the hand-resolved `globalFilterFn` in
     `useST_TableInstance.ts:286-287`. `prepareColumns` writes the current mode name onto
     `columnDef.filterFn`; `globalFilterFn` is passed as a name.
   - `useSTContext` is defined once at module level on the shared context that
     `createTableHook` uses by default (`createTableHook.tsx:46-50, 713-715`), so components
     read any table regardless of which instance built it.
   - Deviation from MRT: MRT's port passes the options through unread, so a custom name
     silently filters nothing. Not copied. One tracker line.
   - Why not the alternatives: resolving names to functions before core skips core's lookup;
     a cast past `Omit<..., 'features'>` and a feature that rewrites `_rowModelFns` lean on
     internals; a per-project `createShadcnTable` factory and `useTable` without
     `useAppTable` change the public API or drop the hook.
   - Caveats, accepted:
     - `createTableHook` runs once per mounted table instead of once per app. A few closures
       and three small components.
     - Registries are read on the first render only, as today (`useMemo(..., [])`).
     - Exact string typing for custom names is not available; `ST_FilterOption` stays
       `LiteralUnion`, as today.
     - Aggregation: plain callables passed in `aggregationFns` are wrapped with
       `constructAggregationFn` before registration.
   - Verify in phase 01 and 02 (tests, both bases):
     - A column with `filterFn: 'customFilterFn'` from the call's `filterFns` filters rows.
     - `globalFilterFn: 'customFilterFn'` filters rows; `'fuzzy'` default still works.
     - A custom `sortFn` name sorts; a custom `aggregationFn` name aggregates.
     - Two tables on one page with different `filterFns` do not see each other's names.
     - Filter-mode switch via `ST_FilterOptionMenu` changes the applied function; the menu
       label, `ST_FilterTextField`, `ST_FilterRangeSlider`, `ST_ColumnActionMenu` and the fuzzy
       highlight in `ST_TableBodyCellValue` read the name from `columnDef.filterFn`.
     - An unknown name logs core's dev warning and filters nothing, no throw.
     - `useAppTable` call has no `@ts-expect-error`; `pnpm tsc:radix` and `tsc:baseui` clean.
     - `useSTContext()` inside a component rendered by `<ShadcnTable>` returns the right table
       when two tables are mounted.
     - No remount of `AppTable` across re-renders (controlled input in a custom toolbar keeps
       focus while typing).

4. D1, the `table` prop (decided 2026-10-27). Dropped from every component. Two ways to reach
   the table, per the TanStack table-context guide:
   - Components that receive an instance (`row`, `cell`, `header`, `column`) read
     `instance.table`. About 35 of 57 files: body rows and cells, head cells and their menus,
     filter and edit inputs, row buttons, cell action menu. No context, no provider needed, so
     they compose anywhere. Depends on phase 01 putting ST atoms, setters and `refs` on the core
     table; today `row.table` is the bare core table (findings: headless display columns).
     The core table never carries `table.state`; see item 5.
   - Components with no instance read `useSTContext()`. About 20 files: `ST_TableContainer`,
     `ST_TableLayout`, `ST_Table`, head, body and footer roots, toolbars and toolbar buttons,
     pagination, alert banner, drop zone, global filter field, edit modal, show-hide menu.
     `useSTContext` is the `useTableContext` from `createTableHookContexts<ST_Features>()` in
     `hooks/stTableHook.ts`; it throws outside a provider.
   - `ShadcnTable.tsx` wraps `ST_TableLayout` in `tableContext.Provider`. New public export
     `ST_TableProvider`, a typed wrapper over that provider, for hand composition:

     ```tsx
     const table = useShadcnTable({ columns, data });
     return (
       <ST_TableProvider table={table}>
         <ST_TableContainer />
       </ST_TableProvider>
     );
     ```

   - Why dropped rather than optional: no users yet, so compatibility buys nothing; one code
     path per component instead of a `prop ?? context` fallback in 20 files; an optional prop
     can be added later without a break, removing one cannot. Matches MRT's port.
   - Breaking, 0.4.0 changelog: sub-components no longer take `table`; wrap hand-composed
     pieces in `ST_TableProvider`. Docs: 7 guides and 2 docs-app layout files pass
     `table={table}` to sub-components today (`toolbar-customization`, `column-pinning`,
     `density-toggle`, `full-screen-toggle`, `row-actions`, `sorting`, `global-filtering`
     among them); about 15 stories. Rewritten in phase 03.
   - Verify in phase 03:
     - Nested table in `renderDetailPanel`: inner `ShadcnTable` consumers read the inner table.
     - Radix portals (menus, dialogs, tooltips) still see the context.
     - Custom renderers (`Cell`, `Header`, `renderRowActions`, `renderDetailPanel`) still
       receive `table` in their argument object; that surface is unchanged.
     - A group 2 component rendered without a provider throws the `useSTContext` error at
       mount, not a silent undefined.
     - Every guide example that composes sub-components renders in `check-pages.mjs`.

5. D2, state reads (decided 2026-10-27). Full subscriber pattern inside the library. Item 1 records the same rule.
   - Fact behind it: `useTable` returns a fresh wrapper per render with `state` attached
     (`react-table/src/useTable.ts:207, 223`); the core table at `row.table`, `cell.table`,
     `header.table`, `column.table` is stable and has no `state`, only `store`, `atoms`,
     `Subscribe` and the setters. D1 group 1 lands on the core table.
   - Rules:
     - Render reads subscribe. One slice: `<Subscribe source={table.atoms.density}>`.
       Several: `<Subscribe source={table.store} selector={(s) => ({ ... })}>`. The
       `Subscribe` sits inside the component that renders the value, per the React Compiler
       guide, never around a child that is handed a stable instance.
     - Handlers and effects read the current value: `table.atoms.x.get()` or
       `table.store.state.x`. Never `table.state` (findings: `ST_CellActionMenu`
       `onCloseAutoFocus` reads a stale snapshot).
     - Writes stay `table.setX(...)`.
     - No `table.state` anywhere under `components/`.
   - Root opts out of state re-renders, or subscriptions below it are decoration:
     `ShadcnTable` provides a stable handle on context, not the per-render wrapper. The
     handle is the first wrapper kept in a ref (`useState(() => table)`): its `store`,
     `atoms`, `refs` and setters are live, its `state` is unused. Data and option changes
     still flow because `useAppTable` re-renders the owner and `AppTable` republishes.
   - Public surface unchanged: `useShadcnTable` returns the wrapper with the default
     selector, so user code reading `table.state.sorting` keeps re-rendering and working.
   - `memoMode` option removed. Its job (skip cell and row re-renders) is done by the
     subscriptions, without the frozen density, selection and pinning MRT documents.
     Breaking line in the 0.4.0 changelog; `memo-mode` guide and the Storybook story go.
   - Why full rather than MRT's shape (default selector, `table.state` in 55 of 57 files,
     `Subscribe` in two): we ship to row counts we do not control; narrow re-renders are the
     product, not an optimization to add later. The guide's "start with the default selector"
     is advice for one app table.
   - Caveats, accepted:
     - Every component declares the slices it renders. A missed slice is a stale render,
       same class as today's `memoMode` bugs, now explicit and testable.
     - Larger rewrite than the MRT mirror in phase 03; the twin diff grows in every
       component. MRT is deprecated, the twin map is a checklist, not a target.
     - `table.getRowModel()` depends on filtering, sorting, grouping, expansion and
       pagination; the body subscription selector must list every slice that feeds it.
   - Verify in phase 03 (Storybook and tests, both bases):
     - Hover a row in a 1,000-row table: only that row's cells re-render (React Profiler).
     - Toggle density: cells and head cells re-render, toolbar buttons do not.
     - Select a row: that row's checkbox and the select-all header update; other rows do not
       render.
     - Sort, filter, paginate, expand, group: the body re-renders with the new row model.
     - Replace `data` from outside: the body shows the new rows with no state change.
     - Cell action menu edit (`editDisplayMode="cell"`) keeps the input focused on close.
     - Every `table.state` read under `components/` is gone (grep gate in the tracker).
     - Controlled state (`state` plus `on*Change`) and external `atoms` both drive the
       subscriptions.

6. D4, `stFeatures` export (decided 2026-10-27). `ST_Features` stays public as a type;
   `stFeatures` the value leaves the barrel and stays internal to `features/`.
   - Why the value goes: with D3 the features a table runs on are built per mount with the
     call's registries merged in; the exported bundle is not what any table uses, and
     `createColumnHelper<typeof stFeatures, T>()` would type names the table does not have.
     Nothing outside the library imports it today. Matches MRT.
   - Why the type stays: every common generic is wrapped (`ST_Row`, `ST_ColumnDef`,
     `ST_FilterFn`, ...); the type is for the raw ones we do not wrap, such as
     `createColumnHelper<ST_Features, T>()`, explicit `constructAggregationFn` generics, or a
     user custom feature's `declare module` block. A type cannot build a mismatched table.
   - Docs: `api/table-options.mdx:23` drops its mention of `stFeatures`.

7. D5, `expandRowsFn` (decided 2026-10-27). Dropped.
   - Never implemented. MRT added it as a type line in `403629fe5` (v1.4, 2022-12-02) and no
     MRT version through v3.0.0 reads it; its prop-table entry carries an empty description
     and a `//?`. Ours copied the same three lines in the first commit `7633f11` and never
     read it either.
   - Remove `types.ts:919` and the `Omit` key, `lib/prop-tables/tableOptions.ts:752`, and
     the key in `guides/expanding-sub-rows.mdx:19`. Changelog, Removed: "`expandRowsFn`,
     never implemented".
