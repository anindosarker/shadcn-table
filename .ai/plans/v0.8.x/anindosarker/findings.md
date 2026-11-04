# v0.8.x findings

## Round 1: discussion, 2026-11-01

### F1 Reset view in the demo leaves column pinning as it is

- `test-projects/next-app/components/demos/header-demo/view-settings.tsx`: "Reset view" restores density, wrap, grid lines, sticky header, striped rows, row numbers, pins, column visibility and column order, but not column pinning; a column pinned by the user stays pinned after the reset. Owner noted 2026-11-01. Resolved by D11: Reset view also restores column pinning.

### F2 Resize handle gestures are undiscoverable

- Demo `column-header.tsx:297-316`: drag resizes and double-click resets the width, but nothing tells the user; the stock handle has no tooltip either (`ST_TableHeadCellResizeHandle.tsx`). Resolved by the D5 addendum: a Reset column size menu item while resized, no tooltip.

## Round 3: run, 2026-11-04

### F3 Overflow tooltip reads cell values on skeleton rows

- `components/body/ST_TableBodyCell.tsx` (spec 02): with `enableCellOverflowTooltip` on, `cell.getValue()` runs on placeholder rows while `isLoading` or `showSkeletons`, so an `accessorFn` over nested data throws (`fixed-bugs/loading` 'Accessor Key While Loading'). Found by spec 05's flips; fixed on `claude/review` in the round D fix commit.

### F4 Chips Filter item hands focus back to the chevron

- `components/menus/ST_ColumnActionMenu.tsx` (spec 03): in chips mode the Filter item opens the header chip editor and the trigger's `onCloseAutoFocus` then refocuses the chevron, so the editor input loses focus (MenuOpeners 'Column Actions', radix and base). Fixed with the round D fix commit.

### F5 View settings ignore enableDensityToggle false

- `components/toolbar/ST_ViewSettingsItems.tsx` (spec 04): the Density row and its pinned button render with `enableDensityToggle: false` (check-pages b 'disable-density-toggle'). Fixed with the round D fix commit.

### F6 Detail panel has no width under grid layout

- `components/body/ST_TableDetailPanel.tsx` (spec 02): with `layoutMode: 'grid'` the detail cell is flex and its `CollapsibleContent` shrinks to content, so a recharts `ResponsiveContainer` measures 0 width (check-pages b and d 'chart-detail-panel'). Fixed with the round D fix commit (`w-full min-w-0`).

### F7 Sort editor ignores maxMultiSortColCount

- `components/toolbar/ST_SortPopover.tsx:86`: "Add sort" is offered until every sortable column has a rule; `maxMultiSortColCount` is not read. Found by spec 06. Owner choice on timing: A4.

### F8 Scroll chevron jumps on press and misses the click

- `components/table/ST_ScrollButtons.tsx` (spec 02): the chevron button takes `active:not-aria-[haspopup]:translate-y-px` from `buttonVariants`, which replaces its `-translate-y-1/2` while pressed; the button moves 13 px down and a click at its centre lands on the header cell, so nothing scrolls (D22). All three bases. Found by the spec 07 gate.

### F9 React Aria Focusable warnings in the chip and sort editors

- Aria base: 58 console warnings `<Focusable> child must be focusable` while the filter chip editor (20) and the sort editor (38) are open, 18 more on choosing a sort column (spec 04). The release gate requires zero React Aria warnings (v0.7.x D40). Found by the spec 07 gate.

### F10 DefaultLook story sets every default explicitly

- `packages/shadcn-table/stories/styling/DefaultLook.stories.tsx:227`: the story's table helper passes `columnFilterDisplayMode="chips"`, `enableColumnOrdering`, `enableColumnPinning`, `enableColumnResizing`, `enableScrollButtons`, `enableSortPopover`, `enableViewSettings`, `enableCellOverflowTooltip`, `layoutMode="grid"`, `paginationDisplayMode="pages"`, `positionActionsColumn="last"` and the actions pinning seed, all of which spec 05 made the defaults; a reader takes them as required and the story no longer shows the stock table. Owner, 2026-11-04 19:05. Fix with A9: `ShadcnTable` with columns, data, `getRowId` and `enableRowActions` only; the same data becomes the docs example.


## Round 4: triage of ATTENTION-2026-11-04

### F11 German locale misspells the row numbers label

- `shared/locales/de.ts:73` in the three bases: `rowNumbers: 'Zeilennumern'`, missing an m (`Zeilennummern`). Found while settling A1; fixed with D41.

### F12 Display column body cells lose their padding and nothing centres the content

- `components/body/ST_TableBodyCell.tsx:336` (three bases): display cells get `px-0` since `89c64f19` (spec 02), and the align chain at `:337-346` falls to `text-start` with no `justify-center`, so the row checkbox sits at x=0 of the 60 px select cell with 40 px empty on its right, while the header checkbox sits at x=12 because the header inner div keeps `px-3 text-start` (`ST_TableHeadCell.tsx:345-354`). `ST_SelectCheckbox.tsx:180-186` says "the cell centres it"; it does not. Measured on `/docs/examples/export-csv`, Base UI: select td padding 0, `justify-content: normal`, checkbox left 0; header checkbox left 12.
- The demo pairs `px-0` with centring: body `text-center` for row numbers (`header-demo.tsx:556-557`), display header cells `content-center p-0 text-center` (`column-header.tsx:411-433`). The library copied the `px-0` only.
- Fix: display body cells and display header cells centre their content (`justify-center text-center`, header inner div `p-0` for display columns), per the demo; row numbers `tabular-nums text-muted-foreground`. Owner, 2026-11-04 19:12. Timing: item 3.

### F15 Data columns sized below the cell padding clip their text

- `apps/shadcn-table-docs/examples/<base>/export-to-csv/TS.tsx:17-20`: the `id` column has `size: 40`; with the 0.8 grid layout (flex basis from the size, `grow` in proportion) and `px-3` data cells the content box is 16.7 px at 1440 and the digits truncate. Under 0.7's semantic layout the column stretched. Fix: examples set no data column `size` below 56, or drop the `size`; the funnel icons on that page come from `columnFilterDisplayMode: 'popover'` (`TS.tsx:64`), intended. Timing: item 3, docs.

### F13 Persistent view example has nine rows and shows no sticky header

- `apps/shadcn-table-docs/examples/<base>/persistent-view/makeData.ts:10`: nine hand-written rows, options `persistViewSettings: true` and `id` only (`TS.tsx:44-51`); the mdx intro (`content/docs/examples/persistent-view.mdx:6`) lists the sticky header among the saved settings, but the table is shorter than the 70vh sticky max-height, so the setting shows nothing. Owner, 2026-11-04 19:14. Fix: D50 (the header demo's data and columns).

### F14 Docs page CSS clips the pagination in every example

- `apps/shadcn-table-docs/app/global.css:363-365`: `#nd-page .prose :is(p, ul, ol) { margin-block: 0.75rem }` reaches into the playground (`not-prose` does not stop an id-scoped rule) and gives the pagination `<ul>` 12 px top and bottom margin; the absolute pagination block becomes 77 px inside the `min-h-12 overflow-hidden` bottom toolbar (`ST_BottomToolbar.tsx:21, 66-70`), so the page box and arrows lose their bottom 29 px. Measured on `persistent-view` and `export-csv`, Base UI, 1440x900; the same rule adds the margin to any `<p>` inside a preview. Not caused by persistence. Fix: scope the rule to exclude `.not-prose` (docs app only). Timing: item 3, docs.

### F16 Body cells misalign with the header when row numbers are turned on

- `/docs/examples/persistent-view`, Base UI, grid lines "all", row numbers on through the view settings: the header has `#` (about 67 px) then First Name to 775 px, but the body's First Name cell ends at about 565 px, its text truncates ("Michael", "Joseph") and an empty cell fills the rest up to the header's edge; the digits and `#` hug the left edge (F12). Owner screenshot 2026-11-04 19:20. Cause not confirmed; suspects: the body reads a column size variable that shifts when the row numbers column is inserted at runtime, or the stored view keeps column sizes from before the column existed. Reproduce on `test-projects/` first (P6). Timing: item 3, library.

### F17 A custom renderTopToolbar removes every column filter in chips mode

- `ST_TableLayout.tsx:117`: `renderTopToolbar` replaces `ST_TopToolbar`, and `ST_TopToolbar.tsx:75` is the only place `ST_FilterChips` mounts; `ST_FilterEditor` renders only inside it (`ST_FilterChips.tsx:149, 236, 347`), including the editor the column menu's Filter item opens (`ST_ColumnActionMenu.tsx:181-189` sets the chips slice only). With the 0.8 default `columnFilterDisplayMode: 'chips'`, an app with its own top toolbar has no chip row, no editor and a dead Filter menu item; only the global search works. The advanced example (`examples/<base>/advanced/TS.tsx:178-235`) does this and also renders `ST_ToggleFiltersButton`, which flips `showColumnFilters`, a no-op in chips mode (`ST_TableHeadCell.tsx:211-212, 365`). Owner, 2026-11-04 19:16 "Filters do not work".
- Two parts: library, the header-anchored editor and the Filter menu item must work without the built-in toolbar (the editor mounts from the head cell or the layout, not from the toolbar); docs, the advanced example uses `renderTopToolbarCustomActions` or renders `ST_FilterChips` in its toolbar, and drops the toggle button. Timing: item 3.

### F18 Group header cells drift from their leaves when a leaf is pinned or does not grow

- `style.utils.ts:76-77, 88-96` (three bases): a group header is never pinned and keeps `flex-grow` equal to its summed size, while a pinned leaf or a leaf with `grow: false` gets `flex 0 0 auto` (and `sticky` when pinned). The group cell then outgrows its leaves and scrolls away from them; the placeholder cells above pinned display columns (`expand`, `select` pinned start in the advanced example, `TS.tsx:115-236`) render empty (`ST_TableHeadCell.tsx:340-341`) with the display header's `px-3 text-start` while the body cells are `px-0` (F12). Owner, 2026-11-04 19:16 "the group header sizing is not correct". Fix: a group header takes the sum of its leaves' resolved flex (grow 0 when every leaf is pinned or non-growing, sticky with the same offset when all its leaves are pinned on one side); placeholder header cells follow their leaf's display styling. Timing: item 3, library.

### F19 Popover filter mode: the header funnel opens nothing and crowds the label

- `/docs/examples/export-csv`, Base UI (`columnFilterDisplayMode: 'popover'`, `TS.tsx:64`): every filterable header shows the funnel (`ST_TableHeadCellFilterLabel.tsx`, opacity 30 while inactive) beside the chevron; clicking it opens no filter popover, and "First Name", "Last Name" truncate to "First ...", "Last ..." because funnel plus chevron eat the cell. Owner screenshot 2026-11-04 19:21 "Filter looks different and broken, doesn't work". Suspects: the popover anchoring moved with D25 (real triggers) and spec 04's chips work left `ST_TableHeadCellFilterContainer.tsx:48` (`open={showColumnFilters || popover}`) without a trigger in popover mode; the pre-0.8 look showed the funnel only on hover or when active. Reproduce on `test-projects/` first (P6). Timing: item 3, library.

### F20 Row dragging has none of the column drag animation

- `/docs/examples/row-ordering`: dragging a row by its grip (`components/body/ST_TableBodyRowGrabHandle.tsx`, `hooks/display-columns/getST_RowDragColumnDef.tsx`) keeps the 0.7 behaviour (native drag image, drop on hover, no motion), while column drag got D20's Notion-style preview, catch-up slide and highlight (spec 03, `hooks/useST_ColumnFlip.ts`, `hooks/useST_DragAutoScroll.ts`). Owner, 2026-11-04 19:21: "We don't have the same animation on row dragging that we do for column dragging." Gap, not a regression; a row counterpart of D20 (preview row, rows slide out of the way, drop highlight, locked rows) needs its own decision. Owner, 19:22, on the cross-table row dragging example (`/docs/examples/row-dragging`, Nice List and Naughty List): a complex case, animations to be discussed, no library change for it now. Parked for a discussion round, not item 3.

### F21 Row ordering example page copy says "column"

- `apps/shadcn-table-docs/content/docs/examples/row-ordering.mdx`: the intro reads "shows how to enable column to be re-arranged via drag and drop" and "Learn more about column ordering in the Row Ordering Feature Guide"; both should say row. `row-dragging.mdx` repeats "Learn more about column ordering" under a row dragging intro. Docs, timing: item 3.

### F22 Editing CRUD example: actions moved right and the delete button is gone

- `/docs/examples/editing-crud` (and the inline row, cell, table and tree variants, `apps/shadcn-table-docs/examples/<base>/editing-crud*/TS.tsx`): the 0.7 example rendered the row actions column first with an edit and a delete icon button (`renderRowActions`); on 0.8 the column sits last (D14 default `positionActionsColumn: 'last'`, pinned) and only the pencil shows. Owner, 2026-11-04 19:23: "The action menu should be on the left, missing the delete button."
- Two parts: the editing examples set `positionActionsColumn: 'first'` explicitly (docs); the missing delete is either the actions column's default width clipping the second button (`getST_RowActionsColumnDef.tsx` size, cell `truncate`/overflow from F12's display cell change) or the example's `renderRowActions` lost the delete control in spec 05's rewrite. Owner, 19:24, live 0.7.4 (`shadcn-table.com/docs/examples/editing-crud-inline-row`) versus local 0.8: live shows an "Actions" header label, edit plus delete at rest and cancel plus save while editing; 0.8 shows no label, edit alone at rest and cancel alone while editing. The second control vanishes in both states, so the actions cell clips it: the actions column default size (48 px, D14, `getST_RowActionsColumnDef.tsx`) fits one icon button and the cell hides overflow. Library fix: the actions column sizes to its content (or `renderRowActions` with more than one control widens it); the header label returns. Same on `/docs/examples/editing-crud-tree` (actions already first there, one pencil, no label, owner 19:25); the five editing examples are checked against live 0.7.4 one by one in the docs story. Timing: item 3.

### F23 Filter chip editor input has the wrong border radius

- `/docs/examples/expanding-tree-flat-parse`, Base UI, chip editor for Last Name (`components/toolbar/ST_FilterChips.tsx` editor, `ST_FilterTextField.tsx`): the text input inside the editor popover renders with a larger radius than the stock shadcn input (`rounded-md`) and the popover itself; owner, 2026-11-04 19:28. Check whether the Base UI `Input` part or a `rounded-*` on the editor wrapper sets it, and that the radix and aria editors match. Timing: item 3, library.

### F24 Detail panel example: an expanded row shows no panel

- `/docs/examples/detail-panel`, Base UI: row 3 is expanded (chevron down) but no detail panel row renders under it, and the expand cell covers the start of the ID cell ("3" half hidden). `components/body/ST_TableDetailPanel.tsx` changed in spec 02 (F6 `w-full min-w-0`); suspects: the detail row gets no height or `hidden` under the grid layout, or `renderDetailPanel` output collapses inside `CollapsibleContent`; the overlap is the display cell `px-0` (F12) plus the expand button's own width. Owner, 2026-11-04 19:30. Reproduce on `test-projects/` and in `stories/features/DetailPanel.stories.tsx` first. Timing: item 3, library.

### F25 Chart detail panel example renders empty charts

- `/docs/examples/chart-detail-panel`, Base UI: every row opens expanded and each panel shows the recharts axes (0 to 60, #1 to #10, "Games Played") with no line or bars. F6 fixed the zero-width `ResponsiveContainer` in the detail cell (`ST_TableDetailPanel.tsx`, `w-full min-w-0`); the series still draws nothing, so either the panel's height collapses to the axes (`CollapsibleContent` height or the grid row height rule) or the example's data mapping broke in the spec 05 rewrite (`apps/shadcn-table-docs/examples/<base>/chart-detail-panel/TS.tsx`). Compare with live 0.7.4. Owner, 2026-11-04 19:31. Timing: item 3.

### F26 Filtering examples still show the 0.7 subheader filters

- `/docs/examples/filter-variants` (`apps/shadcn-table-docs/examples/<base>/customize-filter-variants/TS.tsx`, owned by spec 05) and the other filtering pages (faceted values, filter switching, popover filters, custom filter UI): the variants (checkbox, text, range slider, min/max range, select, autocomplete, date) still render as the subheader row of inputs instead of the 0.8 chips with their editor. Owner, 2026-11-04 19:31: "Example wasn't updated with new UI." Docs story: each filtering example shows its variants through the chip editor (D9); any variant the editor cannot show yet is a library finding of its own. Timing: item 3.
