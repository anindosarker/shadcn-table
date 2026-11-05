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
- Fix: display body cells and display header cells centre their content (`justify-center text-center`, header inner div `p-0` for display columns), per the demo; row numbers `tabular-nums text-muted-foreground`. Owner, 2026-11-04 19:12; again 19:37 on `/docs/examples/row-virtualization` (row numbers at the cell's left edge, virtualized body too). Timing: item 3.

### F15 Data columns sized below the cell padding clip their text

- `apps/shadcn-table-docs/examples/<base>/export-to-csv/TS.tsx:17-20`: the `id` column has `size: 40`; with the 0.8 grid layout (flex basis from the size, `grow` in proportion) and `px-3` data cells the content box is 16.7 px at 1440 and the digits truncate. Under 0.7's semantic layout the column stretched. Fix: examples set no data column `size` below 56, or drop the `size`; the funnel icons on that page come from `columnFilterDisplayMode: 'popover'` (`TS.tsx:64`), intended. Timing: item 3, docs.

### F13 Persistent view example has nine rows and shows no sticky header

- `apps/shadcn-table-docs/examples/<base>/persistent-view/makeData.ts:10`: nine hand-written rows, options `persistViewSettings: true` and `id` only (`TS.tsx:44-51`); the mdx intro (`content/docs/examples/persistent-view.mdx:6`) lists the sticky header among the saved settings, but the table is shorter than the 70vh sticky max-height, so the setting shows nothing. Owner, 2026-11-04 19:14. Fix: D50 (the header demo's data and columns).

### F14 Docs page CSS clips the pagination in every example

- `apps/shadcn-table-docs/app/global.css:363-365`: `#nd-page .prose :is(p, ul, ol) { margin-block: 0.75rem }` reaches into the playground (`not-prose` does not stop an id-scoped rule) and gives the pagination `<ul>` 12 px top and bottom margin; the absolute pagination block becomes 77 px inside the `min-h-12 overflow-hidden` bottom toolbar (`ST_BottomToolbar.tsx:21, 66-70`), so the page box and arrows lose their bottom 29 px. Measured on `persistent-view` and `export-csv`, Base UI, 1440x900; the same rule adds the margin to any `<p>` inside a preview. Not caused by persistence. Owner, 19:36, on `/docs/examples/react-query` (sticky header, scrolling body, pages pagination): the same clip, the page buttons cut at the bottom. In that screenshot the first body row also sits half under the sticky header; check whether the scrolled container or the header overlap is at fault. Fix: scope the rule to exclude `.not-prose` (docs app only). Timing: item 3, docs.

### F16 Body cells misalign with the header when row numbers are turned on

- `/docs/examples/persistent-view`, Base UI, grid lines "all", row numbers on through the view settings: the header has `#` (about 67 px) then First Name to 775 px, but the body's First Name cell ends at about 565 px, its text truncates ("Michael", "Joseph") and an empty cell fills the rest up to the header's edge; the digits and `#` hug the left edge (F12). Owner screenshot 2026-11-04 19:20. Cause not confirmed; suspects: the body reads a column size variable that shifts when the row numbers column is inserted at runtime, or the stored view keeps column sizes from before the column existed. Run 2026-11-04 (cells story): the play `RowNumbersKeepAlignment` is green on the shipped code in every base, not reproduced in Storybook; needs a measurement on the docs page itself after the 06.2 data change (D50). Closed 2026-11-05: the owner rechecked `/docs/examples/persistent-view` with row numbers on, aligned.

### F17 A custom renderTopToolbar removes every column filter in chips mode

- `ST_TableLayout.tsx:117`: `renderTopToolbar` replaces `ST_TopToolbar`, and `ST_TopToolbar.tsx:75` is the only place `ST_FilterChips` mounts; `ST_FilterEditor` renders only inside it (`ST_FilterChips.tsx:149, 236, 347`), including the editor the column menu's Filter item opens (`ST_ColumnActionMenu.tsx:181-189` sets the chips slice only). With the 0.8 default `columnFilterDisplayMode: 'chips'`, an app with its own top toolbar has no chip row, no editor and a dead Filter menu item; only the global search works. The advanced example (`examples/<base>/advanced/TS.tsx:178-235`) does this and also renders `ST_ToggleFiltersButton`, which flips `showColumnFilters`, a no-op in chips mode (`ST_TableHeadCell.tsx:211-212, 365`). Owner, 2026-11-04 19:16 "Filters do not work".
- Two parts: library, the header-anchored editor and the Filter menu item must work without the built-in toolbar (the editor mounts from the head cell or the layout, not from the toolbar); docs, the advanced example uses `renderTopToolbarCustomActions` or renders `ST_FilterChips` in its toolbar, and drops the toggle button. Timing: item 3.

### F18 Group header cells drift from their leaves when a leaf is pinned or does not grow

- `style.utils.ts:76-77, 88-96` (three bases): a group header is never pinned and keeps `flex-grow` equal to its summed size, while a pinned leaf or a leaf with `grow: false` gets `flex 0 0 auto` (and `sticky` when pinned). The group cell then outgrows its leaves and scrolls away from them; the placeholder cells above pinned display columns (`expand`, `select` pinned start in the advanced example, `TS.tsx:115-236`) render empty (`ST_TableHeadCell.tsx:340-341`) with the display header's `px-3 text-start` while the body cells are `px-0` (F12). Owner, 2026-11-04 19:16 "the group header sizing is not correct". Fix: a group header takes the sum of its leaves' resolved flex (grow 0 when every leaf is pinned or non-growing, sticky with the same offset when all its leaves are pinned on one side); placeholder header cells follow their leaf's display styling. Timing: item 3, library.

### F19 Popover filter mode: the header funnel opens nothing and crowds the label

- `/docs/examples/export-csv`, Base UI (`columnFilterDisplayMode: 'popover'`, `TS.tsx:64`): every filterable header shows the funnel (`ST_TableHeadCellFilterLabel.tsx`, opacity 30 while inactive) beside the chevron; clicking it opens no filter popover, and "First Name", "Last Name" truncate to "First ...", "Last ..." because funnel plus chevron eat the cell. Owner screenshot 2026-11-04 19:21 "Filter looks different and broken, doesn't work". Suspects: the popover anchoring moved with D25 (real triggers) and spec 04's chips work left `ST_TableHeadCellFilterContainer.tsx:48` (`open={showColumnFilters || popover}`) without a trigger in popover mode; the pre-0.8 look showed the funnel only on hover or when active. Run 2026-11-04 (cells story): the popover opens on the shipped code in every base (synthetic and real presses, play `OpensWithRowSelection`); the funnel's extra `ms-1` dropped. The truncation is column width: a popover-mode header needs about 147 px for "First Name" and `export-to-csv` sizes it at 120, so the fix is the example's sizes (docs). The owner's dead click is not reproduced in Storybook; rechecked by the owner on `/docs/examples/export-pdf` after the merges (22:55): still dead, the chevron takes the focus ring after the funnel click. Investigation 2026-11-05 (headless, the docs page): from a clean load the funnel opens the popover in every scenario (row selection, tooltip open, small pointer move); the dead click reproduces only while the column menu is open: Base UI's modal menu backdrop (`ST_ColumnActionMenu.tsx:443`, default `modal`) swallows the outside click and `finalFocus` returns focus to the chevron, which matches the owner's screenshot. Real defect found: the funnel's hit target is 13.5 px (`scale-75` icon in a small button). Settled 2026-11-05: the funnel becomes a 24 px icon button (no `scale-75`), the column menu stays modal; the export examples leave popover mode (D56). Last fix story.

### F20 Row dragging has none of the column drag animation

- `/docs/examples/row-ordering`: dragging a row by its grip (`components/body/ST_TableBodyRowGrabHandle.tsx`, `hooks/display-columns/getST_RowDragColumnDef.tsx`) keeps the 0.7 behaviour (native drag image, drop on hover, no motion), while column drag got D20's Notion-style preview, catch-up slide and highlight (spec 03, `hooks/useST_ColumnFlip.ts`, `hooks/useST_DragAutoScroll.ts`). Owner, 2026-11-04 19:21: "We don't have the same animation on row dragging that we do for column dragging." Gap, not a regression; a row counterpart of D20 (preview row, rows slide out of the way, drop highlight, locked rows) needs its own decision. Owner, 19:22, on the cross-table row dragging example (`/docs/examples/row-dragging`, Nice List and Naughty List): a complex case, animations to be discussed, no library change for it now. Settled 2026-11-05 as D57: drop animation only (slide and highlight), the preview stays. Last fix story.

### F21 Row ordering example page copy says "column"

- `apps/shadcn-table-docs/content/docs/examples/row-ordering.mdx`: the intro reads "shows how to enable column to be re-arranged via drag and drop" and "Learn more about column ordering in the Row Ordering Feature Guide"; both should say row. `row-dragging.mdx` repeats "Learn more about column ordering" under a row dragging intro. Docs, timing: item 3.

### F22 Editing CRUD example: actions moved right and the delete button is gone

- `/docs/examples/editing-crud` (and the inline row, cell, table and tree variants, `apps/shadcn-table-docs/examples/<base>/editing-crud*/TS.tsx`): the 0.7 example rendered the row actions column first with an edit and a delete icon button (`renderRowActions`); on 0.8 the column sits last (D14 default `positionActionsColumn: 'last'`, pinned) and only the pencil shows. Owner, 2026-11-04 19:23: "The action menu should be on the left, missing the delete button."
- Two parts: the editing examples set `positionActionsColumn: 'first'` explicitly (docs); the missing delete is either the actions column's default width clipping the second button (`getST_RowActionsColumnDef.tsx` size, cell `truncate`/overflow from F12's display cell change) or the example's `renderRowActions` lost the delete control in spec 05's rewrite. Owner, 19:24, live 0.7.4 (`shadcn-table.com/docs/examples/editing-crud-inline-row`) versus local 0.8: live shows an "Actions" header label, edit plus delete at rest and cancel plus save while editing; 0.8 shows no label, edit alone at rest and cancel alone while editing. The second control vanishes in both states, so the actions cell clips it: the actions column default size (48 px, D14, `getST_RowActionsColumnDef.tsx`) fits one icon button and the cell hides overflow. Library fix: the actions column sizes to its content (or `renderRowActions` with more than one control widens it); the header label returns. Same on `/docs/examples/editing-crud-tree` (actions already first there, one pencil, no label, owner 19:25); the five editing examples are checked against live 0.7.4 one by one in the docs story. Timing: item 3.

### F23 Filter chip editor input has the wrong border radius

- `/docs/examples/expanding-tree-flat-parse`, Base UI, chip editor for Last Name (`components/toolbar/ST_FilterChips.tsx` editor, `ST_FilterTextField.tsx`): the text input inside the editor popover renders with a larger radius than the stock shadcn input (`rounded-md`) and the popover itself; owner, 2026-11-04 19:28. Checked: no override exists, every input part is `rounded-lg` like the popover. Parked as A10 (owner choice), no spec cites it.

### F24 Detail panel example: an expanded row shows no panel

- `/docs/examples/detail-panel`, Base UI: row 3 is expanded (chevron down) but no detail panel row renders under it, and the expand cell covers the start of the ID cell ("3" half hidden). `components/body/ST_TableDetailPanel.tsx` changed in spec 02 (F6 `w-full min-w-0`); suspects: the detail row gets no height or `hidden` under the grid layout, or `renderDetailPanel` output collapses inside `CollapsibleContent`; the overlap is the display cell `px-0` (F12) plus the expand button's own width. Owner, 2026-11-04 19:30. Run 2026-11-04 (cells story): the panel renders with height in every base (plays `PanelRenders`, `PanelRendersVirtualized` green on the shipped code). Root cause found: `hooks/useST_TableOptions.ts:219-222` (three bases) defaults `getRowCanExpand` to true for every row once `renderDetailPanel` is set, so a row whose panel renders null (row 3 of the conditional detail panel page) gets an enabled expand button and opens an empty panel. Fix story on the integration branch after the cells merge: `getRowCanExpand ?? ((row) => renderDetailPanel ? !!renderDetailPanel({ row, table }) : (enableExpanding ?? true) && !!row.subRows?.length)`, a play in `DetailPanel.stories.tsx` (a null panel row shows no expand button); the overlap is F12.

### F25 Chart detail panel example renders empty charts

- `/docs/examples/chart-detail-panel`, Base UI: every row opens expanded and each panel shows the recharts axes (0 to 60, #1 to #10, "Games Played") with no line or bars. F6 fixed the zero-width `ResponsiveContainer` in the detail cell (`ST_TableDetailPanel.tsx`, `w-full min-w-0`); the series still draws nothing, so either the panel's height collapses to the axes (`CollapsibleContent` height or the grid row height rule) or the example's data mapping broke in the spec 05 rewrite (`apps/shadcn-table-docs/examples/<base>/chart-detail-panel/TS.tsx`). Compare with live 0.7.4. Owner, 2026-11-04 19:31. Timing: item 3.

### F26 Filtering examples still show the 0.7 subheader filters

- `/docs/examples/filter-variants` (`apps/shadcn-table-docs/examples/<base>/customize-filter-variants/TS.tsx`, owned by spec 05) and the other filtering pages (faceted values, filter switching, popover filters, custom filter UI): the variants (checkbox, text, range slider, min/max range, select, autocomplete, date) still render as the subheader row of inputs instead of the 0.8 chips with their editor. Owner, 2026-11-04 19:31: "Example wasn't updated with new UI." Docs story: each filtering example shows its variants through the chip editor (D9); any variant the editor cannot show yet is a library finding of its own. Timing: item 3.

### F27 Examples with a custom toolbar lose the view settings button

- Owner, 2026-11-04 19:33: "A lot of the examples are missing the settings button" (shown on live 0.7.4 `/docs/examples/sticky-header`, which predates view settings). On 0.8 the button comes from `ST_ToolbarInternalButtons.tsx`; an example that sets `renderToolbarInternalActions` or `renderTopToolbar` (the advanced example, F17, and others) renders none. Docs story: every example shows the view settings button unless the page is about replacing the toolbar; those render `ST_ToggleViewSettingsButton` (or the internal buttons component) in their custom toolbar. Checked on local 0.8 (grep of `examples/base/*/TS.tsx`, radix and aria match): 109 of 116 examples show the button; seven do not. `advanced` (`renderTopToolbar`, TS.tsx:178), `custom-top-toolbar` (`renderToolbarInternalActions`, :68), `custom-headless` and `external-toolbar` (composed from `ST_TableProvider` with their own toolbar, the latter still using the 0.7 columns and density buttons), `custom-column-filtering-ui`, `enable-row-ordering` and `minimal` (composed, no toolbar; `minimal` by design). The button renders only from `ST_ToolbarInternalButtons.tsx:82-84` inside `ST_TopToolbar`. Docs story: the first four render `ST_ToggleViewSettingsButton` (or `ST_ToolbarInternalButtons`) in their toolbar; `custom-column-filtering-ui` and `enable-row-ordering` get the stock toolbar unless the page is about dropping it. Timing: item 3.

### F28 Semantic layout leaves the body select checkbox off centre

- `components/inputs/ST_SelectCheckbox.tsx` (three bases): the body checkbox span is `flex w-fit`; under `layoutMode: 'semantic'` the cell is `display: table-cell`, so F12's `justify-center` has no effect and the box sits at the start. Found by the cells story, 2026-11-04. Fix: `mx-auto` on that span, a play `CheckboxesAlignSemantic` in `Selection.stories.tsx`. Not in a story yet; grid is the default, so no 0.8 page shows it.

### F29 A multi-select filter on a string column matches no rows

- `shared/utils/column.utils.ts:154` (three bases): `getDefaultColumnFilterFn` picks `arrIncludesSome` for `filterVariant: 'multi-select'` (registered at `shared/fns/filterFns.ts:207`), and table-core 9.3.1's `filterFn_arrIncludesSome` returns false unless the row value is an array; the State column of `customize-filter-variants` and `subheader-filters` holds strings, so picking two states shows nothing. Found by the docs app story, 2026-11-04; the home demo's Filtering step uses a `select` value until this lands. Fix story on the integration branch: the default for `multi-select` accepts a scalar row value (`filterValue.includes(rowValue)`) and an array value as before; a play on a string column. Fixed 2026-11-04 (PR #106): the registered `arrIncludesSome` fn itself became scalar-tolerant (membership for a scalar, overlap for an array, every row for an empty selection), so an explicit `filterFn: 'arrIncludesSome'` on a scalar column now matches too; no new key, no new localization label. The home demo's Filtering step keeps a `select` value (works; the list value is optional follow-up).

### F30 Columns menu reorder may slide by the table's page offset

- `components/menus/ST_ShowHideColumnsMenuItems.tsx:83-91` (three bases) records viewport `left` values into `columnFlipPending`, while `hooks/useST_ColumnFlip.ts:42-55, 309-312` measures positions relative to the table, so a reorder from the columns menu may animate every column by the table's offset from the page edge. Found by reading, not reproduced (docs app story, 2026-11-04). Reproduce in `ColumnHiding.stories.tsx` with the table offset from the left before fixing.

### F31 The chip editor input has a different focus style from the stock input

- Owner screenshots 2026-11-04 22:19 (docs site, dark, Base UI): the toolbar search box focused shows the shadcn focus ring (3 px, `ring-ring/50`) on a `rounded-lg` box; the chip editor's "Filter by Status" input focused shows a thin 1 px blue border, no ring, slightly squarer corners. A10/F23 was this difference, not the radius alone. Cause: the input is the stock `InputGroup` with the 3 px ring, but `components/head/ST_TableHeadCellFilterContainer.tsx` wraps it in a `CollapsibleContent` with `overflow-hidden` (base :51, aria :69; radix has no clip at rest), so the ring and the rounded edge are cut off and only the 1 px `border-ring` remains. The search box reserves room with `-m-0.75 box-content overflow-hidden p-0.75` (`ST_GlobalFilterTextField.tsx:147`). Fix story: the same `-m-0.75 p-0.75` on the container in base and aria (radix too, for the open animation), a play that asserts the focused group's ring is not clipped.

### F32 Home demo: the edited column is off-screen

- `/` home demo (`apps/shadcn-table-docs/components/dev-home/v12/signal-table.tsx`): the 15 DefaultLook columns overflow the frame, so the Editing step changes Estimate out of view and the visitor sees nothing happen. Owner, 2026-11-04 22:24: "The editing demo is not visible. I think you have too many columns." Fix: the demo renders the seven columns its steps use (Name, Status, Assignee, Project, Due, Estimate, Priority); the data stays. Docs fix story. Fixed 2026-11-04 (PR #110) with a compromise: the frame beside the 300 px steps panel is 828 px at 1440 px, so the sizes shrank (Name 150, Status 105, Assignee 115, Project 100, Due 110, Estimate 110, Priority 85) and most header labels truncate ("St...", "Assi..."). The docs polish story (F33) restores readable headers: the steps panel narrows (or stacks under the table below 1440 px) in `components/dev-home/v12/v12.css` / `v5.css` so the table gets about 960 px, and the sizes go back to the demo's.

### F33 Home demo steps apply state without showing the interaction

- `/` home demo (`signal-demo.tsx`, `signal-table.tsx`): each 0.8 step sets table state (sorting, globalFilter, columnFilters, columnOrder, viewSettings) and pulses a control, but the visitor does not see the interaction the 0.7 demo showed (typing into the filter input, the search text appearing character by character, the edited cell). Owner, 2026-11-04 22:30: "each step shows the actions highlighted properly. But yours one doesn't do it. Previously, it showed the interaction." Fix story after F32: Sorting opens the sort editor, the rule row appears, then closes; Search opens the search box and types "billing"; Editing enters the Estimate cell and types the value; Filtering opens the chip editor from the Filter button, picks Status, types or picks "In Review"; Column order drags Project next to Name with the D37 flip; View settings opens the panel and flips the Alternating row colors switch; each with the cue pulse on the control it uses, the step's state applied at the end so a replay stays deterministic. Fixed 2026-11-05 (PR #112): the steps play on the real controls; the demo band spans gutter to gutter with a 240 px steps panel beside the table (under it below 1440 px), the table about 1085 px, three sizes differ from the demo (Name 196, Estimate 136, Priority 132) so the headers read in full.

### F34 Theme demo: replay pacing off and the table overflows the mock app

- `/` theme demo (`apps/shadcn-table-docs/components/dev-home/v12/theme-demo.tsx`, untouched by the 0.8 stories): the replay types the agent prompts and answers almost instantly, then holds each theme for a long beat; the mock app's member table runs past the bottom of its frame and the page viewport (the 0.8 chrome adds the toolbar row above the frame and the pages pagination, taller than the 0.7 table the frame was sized for). Owner, 2026-11-04 22:27. Fix with F33 (same home page story): pace the prompt typing and the answer like a real agent (visible typing, a short hold, the theme change as the beat), and size the mock table to its frame (fewer rows per page, or the frame grows; the table never scrolls the page). Fixed 2026-11-05 (PR #112): prompts type at 45 ms per character, answer after about 1.7 s, five themes in 40 s; the member table fits its frame from 700 to 1100 px tall; the change sits in `components/theme-demo/variants/whole-app.tsx` and `whole-app-site.tsx`.

### F35 Persistent view example: plain cells, locked Name, few rows, unpinned view items

- `/docs/examples/persistent-view` (`apps/shadcn-table-docs/examples/<base>/persistent-view/TS.tsx`): the DefaultLook columns came over with plain text cells, Name locked (`enableColumnOrdering: false`), 25 rows per page and only the default two view items pinned. Owner, 2026-11-04 22:32: Name unpinned and draggable; every view settings item pinned by default on this example; rows per page raised so the sticky header shows (50); the cells as colourful as the header demo (status and priority chips, tag chips, assignee, estimate, the demo's renderers in `test-projects/next-app/components/demos/header-demo/header-demo.tsx`, read-only reference). Owner, 22:40: "The filters aren't correct, it has different types of filters per column in the demo." The example copied the DefaultLook story's columns (the demo's data, plain columns), not the demo's column definitions. Docs story with F33 and F34: every column definition of the persistent-view example is the demo's (`header-demo.tsx`): `filterVariant` per column (select, multi-select, range, date range, text), `filterFn`, `filterSelectOptions`, cell renderers, `size`, `enableSorting`, `sortingFn`, `icon`; the tracker holds a column-by-column table example versus demo proving it; the home demo (D46) takes the same definitions for its seven columns. Fixed 2026-11-05 (PR #112): all 18 demo columns with the demo's definitions, every view item pinned, 50 rows, Name orderable; the tags "+n" is a Badge with a title tooltip (the demo's popover differs per base); Assignee and Due are plain text in the demo too.

### F36 Pin to toolbar does nothing in a custom toolbar

- `/docs/examples/advanced` (Base UI): the pin buttons in the view settings panel toggle `viewSettings.pins` but nothing appears, because the pinned icon buttons are rendered by `ST_ViewSettingsItems` inside `ST_ToolbarInternalButtons` only (`components/toolbar/ST_ToolbarInternalButtons.tsx`), and a custom `renderTopToolbar` or `renderToolbarInternalActions` that renders `ST_ViewSettingsButton` (F27) has no items. Owner, 2026-11-04 22:36: "Pinning doesn't work." Same on `/docs/examples/custom-headless` (22:39), and by construction on `custom-top-toolbar` and `external-toolbar`. Library fix (D11): `ST_ViewSettingsButton` renders `ST_ViewSettingsItems` before itself whenever it is not inside the stock internal button group (a context flag set by `ST_ToolbarInternalButtons`, which keeps rendering the items in the D8 order), so pins show next to the button in every toolbar; a play with a custom `renderTopToolbar`: pin Density, its stepper appears beside the button. Fixed 2026-11-04 (PR #111): `ST_ViewSettingsButton` renders the items unless `ST_InternalButtonsContext.insideInternalButtons` is set by the stock group; the context is exported through `index.ts`'s `export *` from `ST_ViewSettingsItems.tsx` (public by accident, harmless; move to an internal module in a later change).

### F37 Advanced example uses window.alert for its actions

- `/docs/examples/advanced` (`apps/shadcn-table-docs/examples/<base>/advanced/TS.tsx`, the Activate, Deactivate and Contact buttons and the row action items): each action calls `alert(...)`, a browser dialog. Owner, 2026-11-04 22:38: open a modal instead, the advanced example should show the shadcn `Dialog` (or `AlertDialog`) part with the message and the selected names. Docs story with F33 to F35. Fixed 2026-11-05 (PR #112): a shadcn Dialog with title, message and names; no `alert(` left.

### F38 Popover-mode examples still truncate their headers

- `/docs/examples/export-csv` (and `export-pdf`, `popover-filters`, any example with `columnFilterDisplayMode: 'popover'`): "First Name", "Last Name" show as "Fir...", "La..." because the example's `size` values (120, and 56 after F15) leave no room for label, funnel and chevron; a popover-mode header needs about 150 px for a two-word label (cells story note under F19). Owner, 2026-11-04 22:53: "Wasn't fixed." Docs fix: in popover-mode examples drop the `size` on text columns (the grid layout grows them) or set 160 or more; the ID column keeps 56; a page check asserts no header label has `scrollWidth > clientWidth` on those pages.

### F39 Resizing: the header hairline and the body guide line do not meet the column edge

- Storybook aria, `Click To Copy Enabled With Column Resizing` (owner screenshot 2026-11-05 00:4x): while dragging the First Name resize handle, the header cell shows its lit hairline about 2 px inside its edge and a bordered box around the cell, while the body shows the full-height guide line at a different x, so header and body boundaries do not meet. D6 (hairline on the trailing edge, `-inset-e-1` wrapper with a `w-px` line) and the body's resize guide (`ST_TableBodyCell` resizing border, spec 02) use different offsets; check the three bases and the `columnResizeMode` 'onChange' versus 'onEnd' paths. Reproduce in `stories/features/ColumnResizing.stories.tsx` (header hairline x equals body guide x equals the cell's right edge within 1 px while resizing), fix at the root. Last fix story.

### F40 Only the pinned view items animate in on load

- Storybook aria, `Custom Column Actions` (owner screenshot 2026-11-05 00:50): on page load the two pinned view items (Columns, Density) fade and zoom in (`ST_ViewSettingsItems` keyed icon swap, spec 04 1.6.5: `animate-in fade-in zoom-in-75 duration-200 motion-reduce:animate-none`), while search, filter, sort, full screen and view settings appear without motion. Owner: "Add animations to other buttons." Fix: every button of the internal group (`ST_ToolbarInternalButtons.tsx`, three bases) gets the same mount animation so the toolbar appears as one; no animation under reduced motion; a play asserts `getAnimations()` on each button right after mount. Last fix story.

### F41 The grouped column header shows no icon

- Storybook aria, `Grouping Column Mode Remove Custom Grouped Cell` (owner screenshot 2026-11-05 00:37): with `groupedColumnMode: 'remove'` (and `'reorder'`) the library builds the combined grouping column ("State, Gender", `hooks/display-columns/` or `useST_TableInstance.ts`) without `icon`, so its header is the only one without one while State and Gender carry icons (D3, D49). Fix: the grouping column def takes the grouped column's `icon`; with several grouped columns, the first one's. Three bases, a play in `ColumnGrouping.stories.tsx` (the grouped header contains an `svg`). Last fix story.

### F42 Three top-level routes in `lib/routes.ts` have no page

- `apps/shadcn-table-docs/lib/routes.ts` lists `/about`, `/changelog` and `/roadmap` (since `7b1f80fc` and `d035328d`, 2026-10-19), rendered by `components/table-of-contents-list.tsx`, with no app page behind them: a fetch returns 404. Found by the D58 sanity pass on `55ba7a7e` (every docs, api, examples and guides route is 200). Not a 0.8 regression. Fix: remove the three entries, or add the pages, in a later story.

### F43 Custom toolbar actions do not follow row selection

- `components/toolbar/ST_TopToolbar.tsx:76` (three bases) calls `renderTopToolbarCustomActions({ table })` in a render that is not subscribed to `rowSelection`, so a custom action reading the selection (story `CustomTopToolbarSelectionActions`, `stories/features/Toolbar.stories.tsx:176`) stays disabled after a row is selected while the selection banner updates; `ST_BottomToolbar.tsx:62` renders `renderBottomToolbarCustomActions` the same way. Found by the plays story (06.3, 2026-11-05); its play `CustomActionsRender` asserts render position and click only. Fix: render the custom actions inside `table.Subscribe` on the state they read, both toolbars, a play `CustomActionsFollowSelection`. Fix story on `claude/review` after 06.3.

### F44 Subheader filter mode: inputs overflow their columns, the slider caption overlaps the track

- `/docs/examples/subheader-filters`, Base UI (owner screenshot 2026-11-05 03:45): the Salary range slider's "Filter Mode: Between Inclusive" caption sits on the track and the thumbs reach past the cell edges; Age (`size: 80`, `TS.tsx:64`) shows "A", an input cut to "M" and "Filter Mode: B"; Hire Date's two date fields are cut at "dd/mm/yy" and "Filter Mode: Between Inclu"; nine columns at the 180 px default overflow with a scrollbar. Causes: the slider caption keeps a MUI negative margin `m-[-3px_-6px]` (`inputs/ST_FilterRangeSlider.tsx:157`) and the Base slider root has no vertical padding (`ui-base/slider.tsx:29`), its `data-horizontal:w-full` overrides the slider file's `w-[calc(100%-8px)]` (`slider.tsx:20`); the subheader filter container is a bare th child with no inline padding since the quiet header change `a86805e0` (`head/ST_TableHeadCell.tsx:370`) and clips at `overflow-hidden` (`head/ST_TableHeadCellFilterContainer.tsx:51`); range variants need two fields plus an 8 px gap (`inputs/ST_FilterRangeFields.tsx:18`, `min-w-18` or `min-w-35` per field, `inputs/ST_FilterTextField.tsx:445-458`), about 152 px for `'range'` and 288 px for `'date-range'`, while the th min-width pins the column at its `size` (`shared/utils/style.utils.ts:115`); the caption renders under the Min field only (`ST_FilterTextField.tsx:176, 650`). The Status checkbox has no mode caption by design (`inputs/ST_FilterCheckbox.tsx:81-118`). No play covers subheader mode with a range slider (`stories/features/Filtering.stories.tsx:364-403`, no play). Three bases identical.

### F45 Home demo: some steps never highlight, titles read as instructions

- Home page live demo (`apps/shadcn-table-docs/components/dev-home/v12/signal-demo.tsx`, D46), owner 2026-11-05 03:5x: as the replay runs, only some of the six steps get the active highlight; and the step titles are instructions ("Sort by due date in the sort editor", "Search all columns for "billing"", "Edit an estimate to 16h", "Filter the status with a chip", "Move Project next to Name", "Stripe the rows in the view settings") where the owner wants short feature titles ("Sort editor", "Global search", "Cell editing", "Filter chips", "Column order", "Striped rows" or similar), the code line under each unchanged. Page check `_helpers.mjs` DEMO_LAST and `e.mjs` home entry follow the titles.

### F46 React Aria range slider renders both thumbs at 0 with no fill

- `/docs/examples/subheader-filters`, aria base: the Salary `'range-slider'` filter (`inputs/ST_FilterRangeSlider.tsx`, aria copy) renders both thumbs at value 0 with no fill while the slider's min is 30000 and max 200000; radix and base render the thumbs at the ends. Found by the F44 build (2026-11-05), not changed there. Check the aria slider part's controlled value mapping (`value` versus `defaultValue`, `minValue`/`maxValue` props) in the aria copy of ST_FilterRangeSlider.

### F47 A column drop slides the moved column under the cells that follow it

- `hooks/useST_ColumnFlip.ts:312-329` (three bases) animates `translate` on every cell at the same stacking level, so during the D37 catch-up slide the moved column passes under the opaque cells later in the DOM: the eye sees it vanish at its old slot and pop in at the new one (home demo burst capture, 2026-11-05: Project's th at x 564, 482, 322, 249 with nothing drawn at 482). The home demo works around it with `z-1` on the moved column's cells (`signal-table.tsx`, merged in #119); that workaround goes once the hook raises the moved column (and its header) above the others for the slide's duration, `will-change` and `z-index` only while the animation runs. Play `MovedColumnOnTop` in `stories/features/ColumnDragging.stories.tsx`: mid-slide, `document.elementFromPoint` at the moved header's centre is that header.

### F48 The home demo's popovers flip up over the hero when the table is only partly in view

- Home page, owner screenshot 2026-11-05 09:05: the replay starts once 25 percent of the demo is visible (`apps/shadcn-table-docs/components/dev-home/v12/signal-demo.tsx:286-297`, IntersectionObserver threshold 0.25); with the toolbar at the bottom edge of the viewport the Sort popover has no room below, flips up and covers the hero and the install prompt. Same for the filter and view settings popovers. The replay must not scroll the page (#119). Fix per the owner's ruling on the start condition.

### F49 The home demo's cue is missing on the sort chip, the sort editor and the filter chip editor

- Home page live demo, owner screenshots 2026-11-05 09:1x: during the Sorting step neither the sort chip ("Due") nor the sort editor popover carries the demo's cue highlight; during Filtering the opened filter chip editor ("Status", "In Review", "Remove filter") carries none either. D46 puts the cue on the sort chip and on the filter chip; the editor each opens is the thing the step demonstrates. `apps/shadcn-table-docs/components/dev-home/v12/signal-demo.tsx` (SignalCue kinds and targets). Fix with F48's start condition merged first (same file).

### F50 RTL resizing story hides every header but the first

- Storybook aria, `Column Resizing Enabled On End RTL` (`stories/features/ColumnResizing.stories.tsx:182`), owner screenshot 2026-11-05 15:53: the header row shows only the "First Name" header at the right edge; the other header cells are missing while the body renders every column; an "Address" header with the D37 dashed drag outline floats over the first body row around the State and Phone columns. Not investigated (owner: record only). Check the other RTL stories of the file and the base base; suspects: physical `left`/`right` in the header width or sticky maths under `dir="rtl"` (`shared/utils/style.utils.ts`, `components/head/ST_TableHeadCell.tsx`), the column drag preview measuring `left` in RTL (`hooks/useST_ColumnFlip.ts`).

### F51 The advanced example's custom toolbar shows no sort chip

- `/docs/examples/advanced`, Base UI, owner screenshot 2026-11-05 16:01: Name and Email are sorted (header arrows) but the toolbar shows search, "+ Filter" and the custom actions only; the sort chip the stock toolbar renders while a sort exists (`ST_SortPopover` `variant="chip"`, spec 04) is missing. The example's `renderTopToolbar` (F27 made it render `<ST_FilterChips table={table} />`) does not render the sort chip. Fix: the custom toolbar renders `<ST_SortPopover table={table} variant="chip" />` before the filter chips as the stock toolbar does, three bases; check the other custom-toolbar examples (custom-top-toolbar, custom-headless, external-toolbar) and the page check for `advanced`.

### F52 Docs page descriptions written this cycle are too long and the persistent-view body never says localStorage

- `/docs/examples/persistent-view` (`content/docs/examples/persistent-view.mdx`, 111 words of body) and the preview blurb in `examples/<base>/persistent-view/TS.tsx:353`: the body lists every saved setting and links two guides but never says the settings go to localStorage (only the frontmatter description does); the Material React Table originals (`material-react-table-docs/pages/docs/examples/*.mdx`) are two or three sentences. Owner, 2026-11-05 16:05: "check the original ones and keep your descriptions short". Fix: the body says in one sentence that `persistViewSettings` stores the view settings in localStorage and restores them on reload, one sentence on what to try, one link; the blurb one sentence; the same cut on every example page this cycle wrote or rewrote (06, 06.2: subheader-filters at 51 words, advanced at 74, the filtering pages, the home demo copy) to the original's length, facts kept.

### F53 The editing examples confirm a delete with the browser alert

- `/docs/examples/editing-crud` (and editing-crud-cell, -row, -table, -tree, `examples/<base>/editing-crud*/TS.tsx`), owner screenshot 2026-11-05 16:07: the row delete action calls `window.confirm('Are you sure you want to delete this user?')`, a native browser dialog over the styled page. Fix: a shadcn `AlertDialog` (the part is in the registry for the three bases, `components/ui-<base>/`; install it with `pnpm add-part <base> alert-dialog` where missing, P5) with the same question, Cancel and Delete (destructive), opened from the delete icon; the five examples share one small confirm component or the same inline pattern; page checks for the editing pages assert the dialog role instead of a dialog handler; Material React Table's originals use `window.confirm` too, so this is a shadcn-table deviation on purpose.

### F54 Iconed headers in 80 px columns truncate to one letter

- `/docs/examples/filter-variants` (`examples/<base>/customize-filter-variants/TS.tsx`, Age `size: 80`), owner screenshot 2026-11-05 16:10: the Age header shows the cake icon, "A" and the chevron. With the 0.8 header (icon, label, full-opacity chevron, density padding; D2, D3) a header needs about 100 px before a three-letter label truncates; the Material React Table original fit "Age" in 80 px because it had no icon and a hover-only chevron. Same cause as the F44 Age column and the F15/F19 sizes. Fix in the examples (D56 precedent): every column with an icon and `size` under 110 gets 110 or loses the explicit size (customize-filter-variants, the five editing-crud examples with `size` 80 columns, any other hit of `size: [4-9]0`), three bases; `headerLabelsFit` runs on the filter-variants and editing pages' checks (it exists in `_helpers.mjs:62` and runs in b, d, e).

### F55 The filter chip editor grows sideways with every multi-select pick

- `/docs/examples/filter-variants`, State chip editor (multi-select), owner screenshot 2026-11-05 16:46: with five picks the editor popover is about 720 px wide and still grows; the chips field would wrap (`flex-wrap`) but the editor popover (`components/toolbar/ST_FilterChips.tsx`, the chip's editor content, spec 04) sets no width, so it sizes to its content. Fix: the editor content keeps its base width (about 260 px, the width it has with no value) with a max, the chips wrap onto new lines inside it, three bases; play in `stories/features/FilterChips.stories.tsx`: pick five options, the popover width is unchanged and the field height grew.

### F56 Header-width page checks measure before the web font loads

- `apps/shadcn-table-docs/scripts/page-checks/_helpers.mjs:62` `headerLabelsFit` reads `scrollWidth` against `clientWidth` as soon as the page is idle, without `document.fonts.ready`; the docs load Inter through `next/font` (`app/layout.tsx:6`, `global.css:30`), so on CI (Linux) the fallback system font, wider than Inter, was measured and `filter-variants` failed on "Departure Time" (109 over 106) while the same page passes locally. Visitors get Inter on every platform, so the widths chosen on the Mac stand. Fix: the check awaits `document.fonts.ready` before measuring (and any other text-width assertion does the same); the one-column widening at `19233ec3` stays.

### F57 The grouping column centres its breadcrumb and expand controls in a wide column

- `/docs/examples/column-grouping`, aria, `groupedColumnMode: 'remove'` grouped by State then Gender, owner screenshot 2026-11-05 21:26: the combined grouping column (D73 width, the sum of the grouped columns) renders its header (expand-all button, "State > Gender" breadcrumb) and its group cells (the expand chevrons, "Utah (1)", "Male (5)") centred, so a 150 px blank sits at the start of the column and the leaf rows' chevrons float mid-column. Cause: `st-row-expand` is a display column and display columns centre (`ST_TableHeadCell.tsx:233-234`, `ST_TableBodyCell.tsx:340-349`, F12), right for a 48 px control column, wrong for a wide grouping column. Fix: under `'remove'` with grouping active the def aligns start (head and body, through the def's `stTableHeadCellProps` and `stTableBodyCellProps` `align: 'left'` or the equivalent the cell props read), the expand-all button first, then the breadcrumb; the group cells' chevron and label at the start with the existing depth indent; three bases; play `GroupedHeaderAlignsStart` in `ColumnGrouping.stories.tsx` (breadcrumb's left edge within the cell's start padding, the group row chevron likewise). Also verify the D73 sum: the screenshot's column looks wider than State plus Gender.

### F58 The expand column centres its chevrons in grouping modes `false` and `reorder`

- `/docs/examples/column-grouping`, aria, grouped by State then Gender with `groupedColumnMode: false` (and `'reorder'`), owner screenshot 2026-11-05 21:47: the expand column is 100 px wide (the grouping fallback size, room for the depth indent, as Material React Table) and its chevrons sit centred, so the depth indent reads as a random offset and a blank sits at the start; F57 aligned the column at the start under `'remove'` only. Fix: `getST_RowExpandColumnDef.tsx` aligns the column at the start (head and body) whenever grouping is active, in every `groupedColumnMode`; a detail-panel-only table (no grouping) keeps the centred narrow control column; three bases; the play `GroupedHeaderAlignsStart` gains the `false` and `'reorder'` cases (chevron within 24 px of the cell start, depth indent increasing per level).

### F59 The icon editions still ship the old view settings icons

- D75 replaced the Lucide defaults (`icons.ts`, three bases) for grid lines, Columns and density, but the four editions (`icons/tabler.ts`, `phosphor.ts`, `remixicon.ts`, `hugeicons.ts`, three bases) still import the drawn glyphs from `components/icons/ST_GridLineIcons.tsx` and map their own rows icons, so a Tabler, Phosphor, Remix or Hugeicons install shows a different Grid lines, Columns and Density look than the docs (Lucide). Found by a side-agent note 2026-11-06 during the first release gate run (stopped by the owner). Fix: sub-spec 06.6 maps the eight keys per edition to that set's nearest icons (the owner picks from the candidate table in `reference/icons/edition-candidates.md`), rotation or mirroring through a className as the Lucide map does; the drawn glyph file stays (P5); `check:icons` green; then the release gate reruns.
