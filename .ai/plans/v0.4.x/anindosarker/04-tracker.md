# 04: docs, tracker

Deviations only. Plan: [04-docs.md](04-docs.md). Rulings: [decisions.md](decisions.md).

## Deviations

- `ST_TableProvider` is documented in one section, `### Compose with ST_TableProvider` in `guides/toolbar-customization.mdx` (anchor `#compose-with-st_tableprovider`), not a new `guides/table-provider.mdx`. `api/st-components.mdx` gains a `#### <ST_TableProvider />` entry (h4, so the a.mjs h5 count stays 30) that links to it. No `meta.json` or routes entry.
- Examples fixed outside the plan's 9 folders: `row-actions-menu-items` and `enable-cell-actions` (`table` prop on `ST_ActionMenuItem`), `enable-row-pinning-select` and `enable-row-pinning-sticky` (`stTableBodyRowProps` read `table.state` on the row table, which has none; now `table.store.state`). Guides outside the plan's 2: `cell-actions.mdx`, `row-pinning.mdx`, `column-grouping.mdx`.
- `customize-remove-column-grouping` `GroupedCell` and `enable-row-ordering` `stRowDragHandleProps` read `table.store.state` (cast through `ST_TableState<Person>` in the latter).
- Gate grep `<ST_[A-Za-z]+[^>]*table=\{table\}` matches only `<ST_TableProvider table={table}>`, the hand-composition shape of decision 4. Run it with `| grep -v ST_TableProvider`.
- `guides/memoization.mdx` removal also drops its `lib/routes.ts` nav entry.
- `guides/toolbar-customization.mdx`: `ST_GlobalFilterTextInput` (no such component) renamed to `ST_GlobalFilterTextField`.
- Source links in `api/st-components.mdx` and `api/st-hooks.mdx` point at `registry/radix/components/ui/shadcn-table/...`.

### Prop-table text taken from the changelog

- `tableOptions.ts` `filterFns`, `sortFns`, `aggregationFns`; `columnOptions.ts` `filterFn`, `sortFn`, `aggregationFn`: Breaking line on name resolution in core and `columnDef.filterFn` holding the mode name (`getColumnFilterFnName`).
- `tableOptions.ts` 15 ST `on*Change` entries (`onDensityChange`, `onIsFullScreenChange`, `onShowAlertBannerChange`, `onShowToolbarDropZoneChange`, `onDraggingColumnChange`, `onHoveredColumnChange`, `onDraggingRowChange`, `onHoveredRowChange`, `onCreatingRowChange`, `onEditingCellChange`, `onEditingRowChange`, `onColumnFilterFnsChange`, `onGlobalFilterFnChange`, `onShowColumnFiltersChange`, `onShowGlobalFilterChange`): Breaking setter line. `onGlobalFilterFnChange` lost its old text. `onActionCellChange` has no entry; none added.
- `stateOptions.ts` `showLoadingOverlay`, `showProgressBars`, `showSkeletons`: default `''` instead of `'false'`, text from the Fixed loading line.
- `tableInstanceAPIs.ts` `state`: Breaking line on renderer tables having no `state`.

### Page checks

- a.mjs: `/docs/api/table-options` prop count 201 to 199.
- c.mjs (not a or e, as plan 1.6.1 says): `/docs/guides/memoization` entry removed; localization tab count 38 to 39 and the `mk` tab check; toolbar-customization checks the `Compose with ST_TableProvider` h3. Run `check-pages.mjs c` with a and e.
- `next start` needs `NEXT_DIST_DIR=.next` when the build ran without `PORT`: `-p 5330` sets `PORT`, and `next.config.mjs` then reads `.next-5330`.

### Open (library)

- `check-pages.mjs b` and `d` fail one check each, examples untouched by this part: `enable-detail-panel-virtualized` renders no body rows (`tbody` sized, 0 `tr`), `enable-column-virtualization` renders no header or body cells (0 `th`, empty `tr`). Both virtualizers return no items; `getScrollElement: () => tableContainerRef.current` in `hooks/useST_ColumnVirtualizer.ts:75` and `hooks/useST_RowVirtualizer.ts:68` likely reads null on the first layout effect and `ST_Table` / `ST_TableBody` no longer re-render after mount.

## Gates (verifier, 2026-10-28, HEAD f4efcb3)

Run from the worktree root on a clean tree.

- `types:check`: pass (`✓ Types generated successfully`, `tsc --noEmit` exit 0).
- `lint`: pass (`✖ 3 problems (0 errors, 3 warnings)`, all `react-hooks/exhaustive-deps` in example sources).
- `build`: pass (`✓ Generating static pages using 14 workers (292/292)`).
- `next start -p 5330` with `NEXT_DIST_DIR=.next`; `check-pages.mjs a --base http://localhost:5330`: `260 passed, 0 failed`; `e`: `595 passed, 0 failed`; `c` (this part's checks): `280 passed, 0 failed`.
- Grep `<ST_[A-Za-z]+[^>]*table=\{table\}`: 18 hits, all `<ST_TableProvider table={table}>`; empty after `| grep -v ST_TableProvider`.
- Grep `memoMode\|expandRowsFn` in `content`, `lib`: empty.
- Grep `shadcn-table/locales/` in `content`, `examples`, `skills`, `registry/README.md`: empty.
- Playwright (scratch script, desktop width, Radix UI then Base UI via the header switch): `guides/column-grouping`, `guides/toolbar-customization` (`minimal`, `custom-top-toolbar`, `external-toolbar`), `api/st-components` (`ST_TableProvider` h4), `examples/advanced`, `examples/custom-filter-ui`, `examples/custom-headless`, `examples/customized-grouping`, `examples/editing-crud`, `guides/row-ordering-dnd`, `examples/minimal`, `guides/localization` (`mk` tab): every panel renders rows, no page error, no console error on either base. 150 checks, 0 failed.
- Vercel: `vercel whoami` logged in; `vercel ls shadcn-table` shows no preview for `v0.4/docs` (newest preview is from 2026-10-20, before the branch). a.mjs and e.mjs not run against a preview.
