# v0.4.x review rulings: decisions

Rulings the owner took on 2026-10-28 while reviewing the parts 01 to 04 run, item by item
from [ATTENTION-2026-10-28.md](ATTENTION-2026-10-28.md). They feed a follow-up part (04.1)
that lands before part 05. The rewrite's own rulings stay in [decisions.md](decisions.md);
nothing here re-decides those, items here extend them.

## Loading slices

1. `stLoadingFeature` seeds `isLoading` and `isSaving` to `false`; `showLoadingOverlay`,
   `showProgressBars` and `showSkeletons` stay unset.
   - The components test `x !== false`: unset means "follow `isLoading` or `isSaving`",
     an explicit `false` means "off even while loading". A `false` seed switched all three
     off. MRT v2 behaves like unset; MRT's v9 port carries the `false` bug.
   - Plan 1.6.3 and the `findings.md` entry that say `false` are corrected to match.

## Setter updater shape

2. Every ST setter (`setDensity`, `setEditingRow`, `setShowColumnFilters`, ...) hands its
   `on*Change` handler a function updater, never the raw argument. Kept as implemented.
   - Parity with core v9: `setStateSlice` (`table-core/src/utils.ts:244`) wraps the same
     way for every stock setter, so `onSortingChange` already receives a function. The
     TanStack state guide tells handler authors to resolve either form
     (`typeof updater === 'function' ? updater(old) : updater`); a React state setter does.
   - 0.3.x passed the raw argument through (v8 behaviour). The changelog Breaking line
     stays, worded "as TanStack's own setters do since v9".

## Table on context

3. `ST_TableProvider` renders the table's own `table.AppTable` (inside the Radix
   `TooltipProvider`). The stable handle kept in `useState`, the per-render `options` copy
   and the live `state` getter defined on the caller's wrapper are removed.
   - The table-context guide: the `table` wrapper "is therefore not a stable context
     value"; the stable handles are `table.store` and the atoms, read through `Subscribe`,
     which is what every ST component does already. `AppTable` publishes the newest
     wrapper through core's `tableRef` (`createTableHook.tsx:983-1021`), survives cached
     owner output (React Compiler, `memo`), and a different table gives a different
     component, so React remounts the subtree instead of silently serving the first table.
   - The Radix `TooltipProvider` stays in `ST_TableProvider` (moved there from
     `ShadcnTable` in part 01) so hand-composed pieces have tooltips.
   - Custom renderers read `table.state` as the snapshot of the render they run in, the
     v9 model. No `key` is needed to swap tables. No user-owned object is mutated.
   - Narrow re-renders (decision 5) are carried by the root selector in the props style,
     not by a frozen context value; the hook style re-renders with its owner, as the guide
     documents.

4. The component registry of `createTableHook` (`tableComponents`, `cellComponents`,
   `headerComponents`, `AppCell`, `AppHeader`, `AppFooter`, `useCellContext`,
   `useHeaderContext`) stays empty, as in MRT's port.
   - The guide marks it optional, for apps that want standardized reusable pieces. Ours
     take instances as props (decision 4 group 1), which the guide's own tip recommends
     over context. Registering would add 57 names to the public instance types and a second
     entry point per component for no internal gain. Candidate for a later cycle,
     restricted to the group 2 components if the `table.ST_X` composition style is wanted.

## Atom reads in hooks

5. `useST_Atom` (a hand-written `useSyncExternalStore` hook in `hooks/stTableHook.tsx`) is
   replaced by `useSelector(store, selector)` from `@tanstack/react-store`, the primitive
   the v9 source names (`useTable.ts:37`). `@tanstack/react-store` becomes a direct
   dependency of the package and of the registry items (installed transitively today at
   0.11.2; the pinned version follows what `@tanstack/react-table` 9.3.1 resolves).

## Instance types

7. `ST_Row`, `ST_Cell`, `ST_Column` and `ST_Header` declare `table: ST_TableInstance<TData>`
   through the same `Omit` plus overlay technique `types.ts` uses for the re-typed getters.
   The `as unknown as ST_TableInstance<TData>` casts at every `instance.table` read in
   `components/` go. Public names unchanged; only the `table` member narrows.

## Row pinning on select

9. Unselect all under `rowPinningDisplayMode: 'select-*'` clears every pin, hand-pinned rows
   included, as 0.3.3 did (`getST_SelectAllHandler` called `setRowPinning({ top: [], bottom: [] })`).
   The decision 8 subscription keeps pinning and unpinning the changed rows; the select-all
   path adds the full clear on unselect. Bugs found in the same stories are in
   [findings-review.md](findings-review.md).

## Barrel

10. `getColumnFilterFnName` and `selectST_TransformState` stay exported from the barrel.
    Harmless, and the stories use them.

## Forwarded refs

11. The six components that forward a ref (`ST_TableLayout`, `ST_TableContainer`,
    `ST_TableHead`, `ST_TableFooter`, `ST_TopToolbar`, `ST_BottomToolbar`) support React 19
    callback refs in full: `assignRef` returns the callback's result, each wrapper's ref
    callback returns a cleanup that runs the user's cleanup (or assigns `null` when the
    callback returned nothing) and clears the internal ref. The `if (node)` guards go.

## Unchanged after review

12. The props-style root (`ShadcnTable` built from options) selects only the slices its
   option-time transforms read, through the `useAppTable(options, selector)` argument; one
   module-level `tableContext` is passed into every per-mount hook so `useSTContext` is
   static; nested tables read the nearest provider. All three match the guides and stay.
