# Attention, 2026-10-28

Judgment calls taken during the unattended v0.4.x run that the owner may want to revert. Details in `01-tracker.md`.

- `stLoadingFeature` seeds `showLoadingOverlay`, `showProgressBars` and `showSkeletons` unset, not `false` as plan 1.6.3 and `findings.md` say; the components test `!== false`, so a `false` seed switched them off.
- Every ST setter now hands its `on*Change` handler a function updater, as the MRT twins and TanStack's own setters do; a handler that expected the raw value needs `functionalUpdate`. Changelog Breaking line.
- `ST_TableProvider` keeps a live `state` getter (`table.store.state`) on the stable handle, so `table.state` reads inside custom renderers stay current without a subscription; swapping the `table` prop after mount needs a `key`. Changelog line. The plan expected the getter to go.
- Components that read `instance.table` cast it with `as unknown as ST_TableInstance<TData>`; an `ST_Row` / `ST_Cell` / `ST_Column` / `ST_Header` `table` type override in `types.ts` would drop the casts.
- Select all now pins the selected rows and unselect all unpins them (decision 8); before, unselect all cleared every pin, including hand-pinned rows.
- `getColumnFilterFnName` and `selectST_TransformState` are new barrel exports (the stories need them); they could stay internal once part 03 consolidates the verify stories.
- `assignRef` replaces six ref-forwarding `@ts-expect-error` copies; a callback ref that returns a React 19 cleanup function is not supported (the wrapper returns nothing).
- `ST_TableProvider` also mounts the Radix `TooltipProvider` (moved out of `ShadcnTable`) so hand-composed pieces get tooltips.
- Em dashes in comments of six pre-existing component files were left as found.
- Narrow re-renders (decision 5) hold only when `ShadcnTable` builds the table from props: it then selects only the slices its option-time transforms read. With `useShadcnTable` plus `table={table}` the owner re-renders on every state change (the hook keeps the default selector, as decided) and the whole tree follows; the subscriptions below add nothing in that style. The Profiler checks ran on the props style. Most guides use the hook style. Options: memoize the layout root (option and data changes then need their own path to the components), document the difference in the guides, or accept it.
- The `@tanstack/react-table` augmentation must be identical in both trees because the docs app compiles both installed copies in one program. `stConfigFeature`'s part prop options (`stFilterCheckboxProps`, `stSelectCheckboxProps`, `stSelectAllCheckboxProps`, `stFilterSliderProps`, `stEditRowDialogProps`, `stCreateRowModalProps`, the display column def options) are typed `object` in the augmentation and precise only on `ST_TableOptions` and `ST_ColumnDef` through an optional `TParts` parameter. User code that reads `table.options.st*Props` or `column.columnDef.st*Props` sees `object`. Changelog line.
