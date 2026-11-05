# Changelog

All notable changes to shadcn-table are recorded here, newest first, in the
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) format. Entries are
written while the work happens, under `## Unreleased`, below `### Breaking`,
`### Removed`, `### Added`, `### Changed`, `### Fixed` or `### Docs`. The version pull request
that the release workflow opens renames that heading to the version and the
date; merging it publishes the section as the GitHub release notes.

## 0.8.0 - 2026-11-05

### Added

#### Row drop slide (D57)

- D57: a row drop inside one table slides the rows into their new places and flashes the dropped row with the column drop highlight (`useST_RowFlip`); a drop into another table, reduced motion, row virtualization and more than 200 rows skip the slide.

#### Spec 01

- Options, none with a default: `enableViewSettings`, `enableSortPopover`, `enableScrollButtons`, `enableCellOverflowTooltip`, `persistViewSettings`, `nonce`, `showClearSearchButton`, `showColumnDragHandle`, `showSortIndex`; `columnFilterDisplayMode` accepts `'chips'`.
- Column options: `icon` (the column-type icon before the header label) and `overflowTooltip`.
- Icon keys, with a glyph in the Lucide, Tabler, Phosphor, Hugeicons and Remix editions: `AddIcon`, `ArrowUpwardIcon`, `DeleteIcon`, `GridLinesAllIcon`, `GridLinesColumnsIcon`, `GridLinesNoneIcon`, `GridLinesRowsIcon`, `LockIcon`, `PushPinOffIcon`, `RowNumbersOffIcon`, `RowNumbersOnIcon`, `SettingsIcon`, `SingleLineIcon`, `StickyHeaderOffIcon`, `StickyHeaderOnIcon`, `StripedOffIcon`, `StripedOnIcon`, `SwapVertIcon`, `WrapTextIcon`; the grid line glyphs ship as `ST_GridLinesAllIcon`, `ST_GridLinesRowsIcon` and `ST_GridLinesColumnsIcon`.
- Localization keys, optional, English only (other locales fall back to English): column menu `sortAscending`, `sortDescending`, `filter`, `pinToStart`, `pinToEnd`, `fixedPosition`, `fixed`, `hideThisColumn`, `columnMenu`, `sortedAscending`, `sortedDescending`; filter chips `addFilter`, `filterBy`, `noColumns`, `removeFilter`, `deleteAllFilters`, `clearFilters`, `backToColumns`, `isEmpty`, `isNotEmpty`, `showColumnToEditFilter`, `rangeSummary`, `yes`, `no`, `beforeValue`, `afterValue`; sort editor `sort`, `sortBy`, `ascending`, `descending`, `dragToReorder`, `removeSortOn`, `addSort`, `deleteSort`, `sortsCount`; view settings `viewSettings`, `columns`, `density`, `wrapCellText`, `singleLineCells`, `gridLines`, `stickyHeader`, `alternatingRowColors`, `pinToToolbar`, `unpinFromToolbar`, `resetView`, `columnsShown`, `gridLinesNone`, `gridLinesRows`, `gridLinesColumns`, `gridLinesAll`, `densityCompact`, `densityComfortable`, `densitySpacious`; scroll cues `scrollLeft`, `scrollRight`.
- State slices: `viewSettings` (`setViewSettings`, `resetViewSettings`, `onViewSettingsChange`), `filterChips` (`setFilterChips`, `onFilterChipsChange`) and `columnFlipPending` (`setColumnFlipPending`); `table.refs.tableRef` points at the `<table>`.
- Helpers: `getST_ColumnDropTargetProps`, `isColumnDragCancelled` and `applyColumnReorder` for column drags; the view storage functions `getViewSettingsKey`, `readStoredView`, `writeStoredView`, `removeStoredView`, `subscribeStoredView`, `getStoredViewSnapshot`, `getServerSnapshot` and `escapeForScript`.
- A column drag ended with Escape or dropped outside the table no longer reorders the columns, from the header grip and from the columns menu.
- The sticky header scroll box height reads `--st-sticky-max-height` when the table root sets it.

#### Spec 02

- The top toolbar sits above the table frame; the frame (`rounded-md border bg-background shadow`) holds the scroll box and the bottom toolbar with no inner padding, also in full screen, which now pads the window instead of stripping the frame. `stTableLayoutProps.className` restores the old box.
- Body rows are 40, 48 and 56 px tall at compact, comfortable and spacious with `px-2`, `px-3` and `px-4` cell padding; rows are split by hairlines, none under the last row, and `viewSettings.gridLines` draws column lines; hover tints the whole row evenly. The bottom toolbar's top edge is the same hairline; the empty row is 96 px, muted, not italic.
- The table root declares the tint tokens `--st-stripe`, `--st-hover`, `--st-selected` and `--st-edge-shadow` with dark twins; rows and pinned cells read them, and an ancestor or `stTableLayoutProps.className` overrides them. Pinned inner-edge cells cast the edge shadow towards the scrolling columns.
- With `layoutMode: 'grid'` data columns share the spare width in proportion to their sizes, while display and pinned columns keep their width; past the frame every column keeps its set width and the table scrolls sideways. Display columns default to `grow: false`; the row actions column is 48 px with a visually hidden header label and moves through the columns menu (`displayColumnDefOptions['st-row-actions']` sets it back).
- `enableScrollButtons: true` shows hover chevrons in the header row on a side with hidden columns; a click scrolls 80 percent of the unpinned width. `useST_HorizontalOverflow` and `ST_ScrollButtons` are exported for custom layouts.
- `enableCellOverflowTooltip: true` truncates plain text cells on one line and shows the full value in a tooltip only when it is cut off; `viewSettings.wrapText` shows the text in full; `columnDef.overflowTooltip` sets it per column; `ST_OverflowText` is exported for custom cells.
- The sticky header box caps at `var(--st-sticky-max-height, 70vh)` when the header is sticky by choice (`enableStickyHeader` or `viewSettings.stickyHeader`); a header forced sticky by row virtualization keeps the full-height rule.
- With `persistViewSettings` on, a server-rendered table renders one inline script (with the `nonce` option) that marks the root `data-st-view-pending` and `aria-busy` before first paint when a stored view differs from the defaults; the body shows a skeleton bar while marked. Nothing is rendered with persistence off.

#### Spec 03

- Header look: no band, a medium-weight muted label, the column `icon` before it, a full-opacity chevron at the end and a static sort arrow only while sorted; 40 px at every density, a hairline between columns only when grid lines are `columns` or `all`; the header row shadow and the 0.97 opacity are gone.
- The header label and the chevron open the same column menu, a second click on the chevron closes it, and a label click never sorts.
- The column menu lists only what applies, in order: Sort ascending, Sort descending, Clear sort; Filter, Clear filter; Pin to start, Pin to end, Unpin, Reset column size, Group by, Fixed position (disabled, locked columns); Hide. The active sort direction is the one disabled item, and sorting from the menu stacks onto the other columns' sorts. Show all columns leaves the menu (the columns menu has it).
- The resize handle is a full-height hairline: invisible at rest, lit while the pointer is over the header, primary while resizing, reset on double-click; a resize never starts a column drag.
- Columns drag by the header cell where they can be dragged; the grip renders only with `showColumnDragHandle`. While a column drags, the other headers slide aside to open a gap and the dragged header sits in it, faded with a dashed outline; on drop the body slides to catch up and the moved column highlights; Escape or a drop outside slides the headers back. Reduced motion keeps the static dashed feedback and the highlight. Near the inner edges of the unpinned area the table scrolls sideways.
- Locked columns (`enableColumnOrdering: false`) show striped "Fixed" headers only while another column drags.
- `ST_ColumnActionMenu` and `ST_FilterOptionMenu` accept a `trigger` element with optional `open` / `onOpenChange` beside `anchorEl` / `setAnchorEl`, which are now optional.
- New exports: `useST_ColumnFlip`, `useST_DragAutoScroll`, `ST_TableHeadCellLockedOverlay`, `getST_ColumnDragHandlers`.

#### Spec 04

- Filter chips (`columnFilterDisplayMode: 'chips'`): one chip per filtered column with its icon, label, mode and value; the toolbar filter button and "+ Filter" open a searchable column picker that swaps in place to the value editor (back button, 150 ms glide); Filter in a column menu opens the editor on the header cell; "Clear filters" clears every value and chip. `columnFilterDisplayMode: 'subheader'` keeps the filter row.
- Sort editor (`enableSortPopover`): the toolbar Sort button opens a column picker, then the editor with one row per rule (drag to reorder, column, direction, remove), "Add sort" and "Delete sort"; a sort chip before the filter chips opens it. `enableSortPopover: false` keeps today's toolbar.
- View settings (`enableViewSettings`): one panel for Columns, Density, Wrap cell text, Grid lines, Sticky header, Alternating row colors and Row numbers, each with a pin that places it in the toolbar as an icon button (Columns and Density pinned by default), and "Reset view". `enableViewSettings: false` keeps the columns and density buttons.
- `useST_ViewPersistence`, mounted with `persistViewSettings`: the view settings, pins, density, column visibility, order and pinning are saved to `localStorage` on every change and applied once after hydration; "Reset view" deletes the stored view.
- The search toggle is never disabled: open, one click clears the search and closes the field; the field's inline clear button renders only with `showClearSearchButton: true`.
- `ST_ShowHideColumnsMenu` and `ST_RowActionMenu` take a `trigger` element (with `open` and `onOpenChange`) beside `anchorEl`; the columns and row action buttons open their menus from it, so focus returns through the primitive.
- A drop in the columns menu slides header and body together and highlights the moved column.
- Exports: `ST_FilterChips`, `ST_FilterEditor`, `ST_FilterPickerButton`, `ST_ColumnPicker`, `ST_SortPopover`, `ST_ViewSettingsButton`, `ST_ViewSettingsItems`, `useST_PopupResize`, `useST_ViewPersistence` and the filter summary helpers.

### Changed

#### View settings icons (D75)

- Lucide defaults for the view settings: grid lines `Frame`, `Equal`, `Equal` rotated and `Square`; Columns `Columns3Cog`; density `ListChevronsDownUp`, mirrored `ListIndentDecrease`, `ListChevronsUpDown`.

#### Edition icons (06.6)

- The Tabler, Phosphor, Remix and Hugeicons editions take their own icons for grid lines, Columns and density (D77): Tabler `IconFrame`, `IconEqual`, `IconEqual` rotated, `IconTableOptions`; Phosphor `HashStraightIcon`, `EqualsIcon`, `EqualsIcon` rotated, `ArrowsInLineVerticalIcon`, mirrored `TextOutdentIcon`, `ArrowsOutLineVerticalIcon`; Remix `RiHashtag`, `RiEqualLine`, `RiEqualLine` rotated, `RiSquareLine`, `RiKanbanView`, `RiContractUpDownLine`, mirrored `RiIndentDecrease`, `RiExpandUpDownLine`; Hugeicons `FrameIcon`, `EqualIcon`, `EqualIcon` rotated, `Columns3CogIcon`, `ListChevronsDownUpIcon`, mirrored `ListIndentDecreaseIcon`, `UnfoldMoreIcon`.
- The drawn glyph file `components/icons/ST_GridLineIcons.tsx` and its `index.ts` export are removed (D76; added in this cycle, never released).

#### Spec 05

The stock table takes the v0.8 look by default. Each line names the option that restores the old behaviour.

- `enableColumnOrdering` defaults to `true`: headers are drag sources. Set `enableColumnOrdering: false` to restore static headers.
- `enableColumnPinning` defaults to `true`: the column menu has the pin items. Set `enableColumnPinning: false` to restore.
- `enableColumnResizing` defaults to `true`: headers have the resize handle. Set `enableColumnResizing: false` to restore.
- `paginationDisplayMode` defaults to `'pages'`: numbered page buttons. Set `paginationDisplayMode: 'default'` to restore the range text with previous and next.
- `columnFilterDisplayMode` defaults to `'chips'`: filters live in the toolbar chip row. Set `columnFilterDisplayMode: 'subheader'` to restore the inputs under the headers.
- `layoutMode` defaults to `'grid'` and no longer switches to `'grid-no-grow'` when resizing is on. Set `layoutMode: 'semantic'` (or `'grid-no-grow'` with resizing) to restore.
- `positionActionsColumn` defaults to `'last'`. Set `positionActionsColumn: 'first'` to restore.
- With `enableRowActions` and no `columnPinning` of its own, a table pins the actions column to the end (`initialState.columnPinning.end: ['st-row-actions']`), so `resetColumnPinning()` keeps it pinned. Pass your own `initialState.columnPinning` (for example `{ start: [], end: [] }`) to restore.
- `enableSortPopover` defaults to `true`: the toolbar sort editor. Set `enableSortPopover: false` to restore.
- `enableViewSettings` defaults to `true`: one view settings button replaces the separate columns and density buttons. Set `enableViewSettings: false` to restore.
- `enableScrollButtons` defaults to `true`: hover chevrons on a side with hidden columns. Set `enableScrollButtons: false` to restore.
- `enableCellOverflowTooltip` defaults to `true`: cut-off text shows a tooltip. Set `enableCellOverflowTooltip: false` to restore.

#### Spec 06.4 grouping

- D68: under `groupedColumnMode: 'remove'` the grouping column's header is a breadcrumb: the expand-all button, then per grouped column its icon and header name, a chevron between segments. It replaces "State, Gender" behind the first grouped column's icon (F41), and renders without `enableExpandAll` too. `'reorder'` is unchanged.
- D73: under `'remove'` the grouping column's default `size` is the sum of the grouped columns' sizes (each falls back to `defaultColumn.size`, then 180), recomputed as grouping changes. `displayColumnDefOptions['st-row-expand'].size` still wins.

#### Spec 06.4 filters

- The `multi-select` filter field ends in a chevron, vertically centred however many rows its chips take; its clear button shows once a value exists and the empty slot takes no room; the chips and the typing input wrap inside the field. On radix and base typing highlights the first match and Enter picks it (D72).
- The chip editor popover is 260 px wide (`w-65`): a multi-select's chips wrap and the field grows in height instead of widening the editor (F55).

### Fixed

#### Spec 06.1 toolbar

- With a custom `renderTopToolbar` in chips mode, the column menu's Filter item opens the header-anchored editor again: the new exported `ST_HeaderFilterEditor` is mounted by the table layout, outside the toolbar, and `ST_FilterChips` renders the chips row only.
- The sort editor hides "Add sort" once the rule count reaches `maxMultiSortColCount`.
- The columns menu shows the column icon before its label.
- `localization.rowNumbers` reads "Row numbers" in English and "Zeilennummern" in German.

#### Spec 06.1 cells

- Display cells (select, expand, pin, drag, row numbers, actions) centre their control in the body and the header, so the header and row checkboxes share one x; row numbers render as muted tabular digits.
- A group header spans exactly its leaves: it grows only by its growing leaves, keeps its width when every leaf is pinned or has `grow: false`, and sticks with its leaves when they are all pinned to one side.
- With `renderRowActions` the actions column shows the "Actions" header label, is 96 px wide by default (`displayColumnDefOptions['st-row-actions'].size` wins) and centres every control it returns; without it the column stays 48 px with the dots button.
- The popover filter funnel no longer adds its own margin beside the header label.
- With `renderDetailPanel`, a row whose panel renders nothing keeps a disabled expand button and Expand all skips it, instead of opening an empty detail row; rows with sub rows still expand.

#### Fix F29

- A `multi-select` filter on a column of plain values keeps the rows whose value is picked; array values still match on any overlap and an empty selection keeps every row (`arrIncludesSome`, the variant's default).

#### Fix F31

- The focused filter input shows the full focus ring and rounded edge in the chip editor, the header-anchored editor and the subheader filter row; the filter container no longer clips them.

#### Fix F36

- The view items pinned to the toolbar render before `ST_ViewSettingsButton` wherever it is placed, so pins show in a custom `renderTopToolbar` or `renderToolbarInternalActions`; the stock toolbar keeps its order and renders them once.

#### Fix F19, F28, F30, F39, F40, F41, D56

- F19: the popover-mode header funnel is a 24 px icon button (it was a 12 px target), 30% opaque at rest and full while active or hovered.
- F28: under `layoutMode: 'semantic'` the body select checkbox is centred in its cell.
- F30: a Columns menu reorder slides each header by the distance it moved, not by the table's offset from the page edge.
- F39: while a column resizes, the header hairline and the body guide are one 1 px line ending on the column's trailing edge; the body guide no longer is a 2 px border inside the cell.
- F40: every built-in toolbar button fades and zooms in once on mount, as the pinned view items do; none under reduced motion.
- F41: under `groupedColumnMode: 'remove'` the grouping column's header shows the first grouped column's icon.
- D56: the export to CSV and export to PDF examples run on the chips filter default instead of popover mode.

#### Fix F43

- `renderTopToolbarCustomActions` and `renderBottomToolbarCustomActions` re-render when the row selection, filters or sorting change, so an action that reads the selected rows enables once a row is selected; the rest of the toolbar does not re-render.

#### Fix F44

- Subheader filters fit their columns: the filter row takes the label row's inline padding per density and a bottom padding, and adds no width to its column, so a column keeps its `size` and clips a wider filter.
- The range slider's "Filter Mode" caption renders below the track, like the text field's caption, and the slider stays inside its cell.
- Range filters keep Min and Max side by side at every column width (D61); their "Filter Mode" caption spans the whole range group instead of the Min field.
- The subheader filters example sizes its columns to fit their filters.

#### Fix F47

- A column drop or a Columns menu reorder slides the moved column on top of the cells it passes, under the pinned columns, instead of under the cells that follow it in the DOM; the lift lasts only for the slide.

#### Spec 06.4 filters

- The built-in toolbar buttons fade in from 0 opacity on mount, the same animation as the pinned view items, instead of from 10 percent (D70).
- The aria `range-slider` filter reads `min` and `max` from `stFilterSliderProps` as radix and base do, so its thumbs start at the given bounds instead of 0; aria `SliderProps` accepts the two keys (F46).
- In an RTL table a column drag preview lays the columns right to left: every header stays inside the table and only the dragged and target columns shift (F50).

#### Fix F57

- Under `groupedColumnMode: 'remove'` with grouping active, the grouping column aligns its header (expand-all button, then the breadcrumb), its group cells and its row chevrons to the start instead of the centre; the narrow expand column stays centred.

#### Fix F58

- With grouping active, the expand column aligns its chevrons to the start under `groupedColumnMode: false` and `'reorder'` too, so the depth indent steps right from the cell's start; without grouping the narrow control column stays centred.

### Docs

#### Home demo pace

- The home demo holds each step 1.2 s after it lands (was 2.2 s) with a 3.6 s floor per step (was 5.2 s), so the loop runs about 25 s instead of 34 s.

#### Fix F56

- The header-width page check waits for the web font before measuring, so CI measures Inter, not the Linux fallback.

#### Theme demo speed

- The home page theme demo cycles its five themes in 25 s instead of 40 s: 25 ms per typed character, a 0.7 s reply, a 2.2 s hold per theme.

#### Spec 06

- New guides for the v0.8 surfaces: Column Icons, Filter Chips, Sort Editor, View Settings and Persistence, Overflow Tooltip, Scroll Cues and Tint Tokens.
- Guides rewritten for the v0.8 defaults and chrome: column actions, column filtering, column ordering (header dragging, locked columns, drag animation), column grouping, column pinning, column resizing, column size, display columns, row actions, pagination, density, column hiding, toolbar, global filtering, full screen, sticky header, virtualization, styling, icons, localization, state management, row pinning, detail panel, usage and best practices; the ST Components API page lists the new toolbar components, `ST_OverflowText`, `ST_ScrollButtons`, `ST_TableHeadCellLockedOverlay` and the menus' `trigger` prop.
- The prop tables list every new option, column option and state slice with its shipped default.
- New Persistent View example (`persistViewSettings` with column icons) in all three bases; the Multi-Sorting example works through the sort editor.

#### Spec 06.2

- Every example column carries a Lucide icon; loop-built columns take theirs from a lookup by key.
- The home demo renders the stock table on the header demo's data, and its replay plays the sort editor, search, a cell edit, a filter chip, a column move and the view settings.
- The Persistent View example renders the header demo's 50 rows and 15 columns.
- The filtering examples use the filter chips; the new Subheader Filters Example keeps the filter row under the headers with the filter variants and the filter mode picker (`columnFilterDisplayMode: 'subheader'`).
- The docs prose spacing no longer clips the pagination of the example previews; the Chart Detail Panel example draws its lines; the editing examples put the actions column first; the custom toolbar examples show the view settings button.

#### Spec 06.2 stories

- Every Storybook story column carries a Lucide icon, the same pick per field as the docs examples.
- The Default Look story renders the stock table: columns, data, `getRowId` and the row actions only.

#### Fix F32

- The home demo shows seven columns (Name, Status, Assignee, Project, Due, Estimate, Priority) that fit its frame, so the Editing step's estimate change is in view.

#### Fix F38

- The Export to CSV and Export to PDF examples (popover filter mode) let the First Name and Last Name columns take the default width and size the ID column at 112 px, so no header label is cut off beside the funnel and the chevron.

#### Docs polish

- The home demo plays each step on the table's own controls before its state lands: the sort editor, the search box typing "billing", the Estimate cell edit, the Filter picker and its Status select, the Project column move and the view settings switch, each with a pulse on the control it uses.
- The home demo's seven columns take the persistent-view definitions and read their headers in full: the demo band runs gutter to gutter with the steps beside the table from 1440px and under it below.
- The home theme demo types its prompts at a reading pace, answers after a short beat and cycles the five themes in about 40 s; the mock app's member table stays inside its frame at every screen height.
- The persistent view example uses the header demo's column definitions: filter variants, filter fns, select options, status, priority and tag chips, progress, PR link and archived cells, sizes and the priority sort; Name is orderable, every view settings item is pinned and 50 rows show per page.
- The advanced example's Activate, Deactivate and Contact buttons and row action items open a dialog with the selected names instead of a browser alert.

#### Fix F45

- The home demo keeps every step active, with its check mark and "Now showing" label, for its whole run (at least 5.2 s), and the step titles name the feature: Sort editor, Global search, Cell editing, Filter chips, Column order, Striped rows.

#### Home demo polish

- The home demo replay leaves no tooltip, focus ring or page scroll behind when it closes a popover, keeps the table frame and the step list in place (a page of ten rows fits, the status keeps one height), slides the moved column over the others, opens the filter from the "+ Filter" pill and types the new estimate with no empty field.

#### Fix F48

- The home demo plays only while its toolbar has room for the popovers below it (360 px under the toolbar, below the sticky nav): until then it holds on "Starting", scrolled away mid-step it pauses with its popover closed, and it resumes when the room is back, so the sort, filter and view settings popovers never flip up over the hero.

#### Fix F49

- The home demo's cue marks the editor or panel a control opens as well as the control: the sort picker, the "Due" chip and its sort editor, the filter picker, the "Status" chip editor and the "Status: In Review" chip, and the view settings panel; the cue inside a popover now shows (it was invisible there), and the last step is titled "Alternating row colors".

#### Spec 06.5

- The sidebar no longer lists About, Changelog and Roadmap, which had no page behind them (F42).
- The Advanced and External Toolbar examples show the sort chip in their custom toolbars while a sort is set, as the stock toolbar does (F51).
- The Persistent View, Subheader Filters and Custom Headless pages are shorter; Persistent View says it stores the view in localStorage (F52).
- The editing examples confirm a delete with a shadcn AlertDialog instead of a browser confirm, in the three bases (F53).
- Example columns with an icon are wide enough to show their whole header label (F54).

## 0.7.4 - 2026-11-03

### Fixed

- Single-row selection is one radio group per table: arrow keys move between rows and screen readers announce the row count.
- The loading state is localizable (`localization.loading`); every progress bar carries it as its label.

## 0.7.3 - 2026-11-02

### Fixed

- The row select checkbox is centred in its cell and the select-all checkbox sits on the header line, the same in every base.

## 0.7.2 - 2026-11-02

### Fixed

- Loading placeholders no longer cause a hydration warning on server-rendered tables; the platform helper reads `navigator.userAgent` instead of the deprecated `navigator.platform`.
- React Aria: the select and filter checkboxes and grouped values show their tooltips again.

### Docs

- The Column Dragging story and guide show that dragging needs column ordering or grouping as its drop target.
- A docs `next start` on any port serves the default build; the per-port build directory applies to `next dev` only.

## 0.7.1 - 2026-11-01

### Fixed

- Pinned columns are opaque and their edge shadow falls on the scrolled columns, so they read on top in light mode too; the bottom toolbar shadow falls on the table body.
- React Aria: the library logs no development warnings; Escape on the focused full-screen toggle leaves full screen.
- The search field shows its focus ring after a click on the toggle.

### Docs

- The docs page checks run on every pull request; a dev server on another port no longer rewrites the docs `tsconfig.json`.

## 0.7.0 - 2026-10-31

### Breaking

- shadcn-table needs React 19.2 or later and Tailwind CSS 4.3 or later.

### Added

- `useST_FullScreenContainer(table)` for headless layouts; the toolbar buttons accept the shadcn Button `size` and `variant` props by type.
- Icon editions: `shadcn-table-tabler`, `shadcn-table-phosphor`, `shadcn-table-hugeicons` and `shadcn-table-remixicon` install the table with that icon library instead of Lucide; `shadcn-table` stays the Lucide edition. Switch later with the edition item and `--overwrite`.

### Changed

- `ST_Checkbox` moved to `components/inputs/`, `ST_Tooltip` to `components/buttons/`, `useST_MediaQuery` to `hooks/`; barrel imports are unchanged, deep imports follow the new paths.
- `react` and `react-dom` move to `^19.2.0` (consumer minimum React 19.2, for `useEffectEvent`); the library lint adds `eslint-plugin-react-hooks` 7.1.1 and `@eslint-community/eslint-plugin-eslint-comments` 4.8.1.
- Public types no longer use `any`: `DropdownOption.value` is `string`, `enableRowPinning` callbacks receive `ST_Row`, the `ST_TableRefs` ref maps are non-null, `row.columnFiltersMeta` is `RankingInfo`, the row selection handlers accept `ST_SelectionEvent`, `flexRender` takes `Renderable<never>` and `object` props.
- No deprecated TanStack or DOM API is used: the function registries come from the individual `*Fn_*` exports, state reads go through `table.Subscribe` and `table.atoms`, in the library, the stories and the docs examples; `getDefaultColumnOrderIds` and the display column helpers take only the `columnOrder`, `creatingRow` and `grouping` state they read; `table.atoms` is typed per row type.
- `tailwindcss` and `@tailwindcss/vite` move to `^4.3.3` (consumer minimum Tailwind 4.3, for `scrollbar-thin` and canonical classes).
- Tailwind classes use their canonical forms (`z-1` for `z-[1]`, `min-h-25` for `min-h-[100px]` and 20 more), so Tailwind 4.3 IntelliSense reports no hints in the installed files; same CSS.
- Direction classes are logical (`ms-`, `me-`, `inset-s-`, `inset-e-`, `text-start`, `text-end`) and pinned offsets use the inline axis, so the table follows `dir` on any ancestor; set `columnResizeDirection: 'rtl'` on RTL pages for the drag math.
- Toolbar and header shadows take their color from the theme instead of fixed `rgba` values.
- Two shared hooks, `useST_ComposedRef` (one callback ref for the internal and the user's ref) and `useST_MenuAnchor` (the anchor of the five menus).
- Library comments state contracts only: porting history, restated code and repeated rationale are gone, and the five menus share one anchor hook.
- `getCommonToolbarStyles` is gone from `shared/utils/style.utils.ts`; nothing in the library used it.
- The package adds the Tabler, Phosphor, Hugeicons and Remix Icon React packages as development dependencies for the icon sets.
- `ST_Icons` values are typed `ComponentType<ST_IconProps>`; the table's own files import icons through `icons.ts` only; the checkbox's indeterminate dash is the new `IndeterminateIcon` key.
- The library files without an icon map are the new `shadcn-table-core` item; `shadcn-table`, the icon set items, the locale items and the example items depend on it.

### Fixed

- The installed table lints clean under `eslint-config-next` 16 with the React Compiler rules: hooks run unconditionally, no ref is touched during render, no state is set inside an effect.
- Column definitions are rebuilt when a column resize or a drag ends, also when the owner's table selector leaves those slices out.
- A Min or Max value in a range filter filters the rows, and range inputs on number columns take numbers only.
- Clearing the sort with the default `enableGlobalFilterRankedResults` stays cleared.
- A `className` in `stPaginationProps` lands on the pagination's outer element, so it can change the padding.
- The search field and the progress bar, alert banner, detail panel and column filter panels open and close smoothly in every base; the search field focuses its input on open, is inert while closed, and Escape clears a typed value first, then closes the empty field and returns focus to the toggle.
- Every menu opener announces `aria-haspopup` and `aria-expanded`, a second click on it closes its menu, Tab skips the anchor spans, a menu follows its opener on resize and scroll, and focus returns to the opener in every base.
- Show and hide columns toggles a column with Enter and Space; the pin buttons and drag handle sit beside the menu item and take Tab.
- Parts used as designed in `ST_TableHeadCellFilterLabel`, `ST_ColumnActionMenu`, `ST_ActionMenuItem`, `ST_EditCellTextField`, `ST_FilterTextField`, `ST_TableContainer`, `ST_EditRowModal`, `ST_FilterRangeSlider`, `ST_ToolbarAlertBanner`, `ST_SelectCheckbox` and the React Aria tooltips: the filter popover opens from its trigger with the input focused, filter modes open as a submenu, helper text describes the edit input, the filter chip clear button has a name, the edit modal plays its exit, and the slider composes a consumer ref.
- The React Aria resize handle takes its width and height.
- The checkbox's indeterminate dash reads `icons.IndeterminateIcon` from the table icons.

### Docs

- The Localization guide installs any locale with the base, package manager and locale selectors and shows its import; every example toolbar has a base select.
- The docs name the registry namespace `@shadcn-table` (was `@st`); a project that registered `@st` keeps working, the name is local to its `components.json`.
- The install command picks the icon library edition and offers a short registry-namespace form, served for any `style` of a base; the install page covers projects created with shadcn create; the headless example documents the spacer column and the full-screen container hook.

## 0.6.4 - 2026-10-29

### Docs

- The API reference index explains versioning: everything exported is public, the three bases stay at parity, TanStack Table is pinned to `^9`, renamed options keep an alias for one minor, upgrade is `shadcn add --overwrite` plus this changelog.

## 0.6.3 - 2026-10-29

### Changed

- The Storybook base picker shows a chevron before the base name.
- The shadcn base is called base everywhere, in the Storybook picker, the docs and the
  maintainer scripts; edition is gone.
- Maintainer renames: `scripts/registry/bases.mjs` (`BASES`, `REFERENCE_BASE`, `DEFAULT_BASE`,
  `BASE_LABELS`, `BASE_PORTS`, `resolveBase`, `baseItemName`), `.storybook/base-tool.ts`,
  `check-pages.mjs --url <url> --base <base>` (was `--base <url> --edition <base>`), and
  `check-storybook.mjs --url <url>` (was `--base <url>`).

## 0.6.2 - 2026-10-29

### Changed

- Base UI is listed first wherever the editions appear: the docs edition tabs and menus, the
  Storybook edition switch, the README, the install pages and the agent skill read Base UI,
  Radix UI, React Aria. The README's quick start installs the Base UI edition; Radix UI and
  React Aria sit in the fold.
- The docs header's edition switch is a select button showing the current edition, opening a
  menu with the three editions; the edition tabs on the install, init and best-practices pages
  stay tabs. The Storybook edition switch is the toolbar's own select, like the viewport and
  background pickers, in place of three buttons.
- Maintainers: every edition script names its edition. `storybook`, `storybook:build` and
  `test` become `storybook:radix`, `storybook:build:radix` and `test:radix` (the `:base` and
  `:aria` scripts are unchanged); the root `storybook:build` builds all three, Base UI first.
  `ST_BASE` unset or unknown now means the Base UI tree, not Radix UI, for `vite`, `vitest`
  and `storybook`.

## 0.6.1 - 2026-10-28

### Changed

- Base UI is the edition shown first: the docs edition tabs and the command bar open on Base UI
  until the reader picks one (a stored pick is kept), and the Storybook root
  (`storybook.shadcn-table.com/`) redirects to the Base UI build. The three Storybook builds
  live under `/radix/`, `/base/` and `/aria/`; `/base/` and `/aria/` links keep working, old
  root links land on Base UI. The Storybook edition tool marks the current edition's button.
- Every committed registry item is named by its edition: the GitHub-namespace addresses of the
  Radix UI items are `anindosarker/shadcn-table/shadcn-table-radix`,
  `shadcn-table-radix-locale-<code>` and `example-<slug>-radix`. The plain GitHub addresses
  (`anindosarker/shadcn-table/shadcn-table`, `shadcn-table-locale-<code>`, `example-<slug>`)
  now install the Base UI edition, as aliases of the `-base` items; before, they installed
  the Radix UI items. The hosted item names are unchanged:
  `/r/radix/shadcn-table.json`, `/r/radix/shadcn-table-locale-<code>.json` and
  `/r/radix/example-<slug>.json` as before.

### Fixed

- The Base UI and React Aria hosted locale items' descriptions name the hosted item
  `shadcn-table` (`/r/base/` and `/r/aria/` said `shadcn-table-base` and `shadcn-table-aria`).
- shadcn parts re-added by a deterministic `add-part`: `pnpm add-part <edition> <part>` now
  writes the same bytes whatever the invocation order (the `'use client'` directive is set per
  file from the upstream item, `font-heading` survives the CLI's class resolution), and every
  part of every edition was re-added once with it. Repo-internal; nothing changes for users.
- Radix UI and Base UI: installing shadcn-table no longer replaces the project's
  `components/ui/checkbox.tsx` with a fork. The indeterminate dash on the select-all and
  partially selected row checkboxes is drawn by the library's own `ST_Checkbox` wrapper on
  every edition, and `checkbox` arrives as a plain registry dependency. The checkbox filter's
  unset state on React Aria now shows the same dash as on Radix UI and Base UI instead of a
  check.

## 0.6.0 - 2026-10-28

### Changed

- Docs examples per edition: `apps/shadcn-table-docs/examples/<edition>/<slug>/` holds one
  hand-written set per edition (Radix UI, Base UI, React Aria) in place of one Radix source
  rewritten per base; the code view, the GitHub link and the agent prompt show the selected
  edition's source, and `pnpm check:bases` guards the three sets the way it guards the
  library trees (`scripts/registry/examples-<edition>-diff.json`). GitHub-namespace example
  items are `example-<slug>`, `example-<slug>-base` and `example-<slug>-aria`; the hosted
  `/r/<edition>/example-<slug>.json` names are unchanged. `custom-headless` renders the shadcn
  `Table` parts on Radix UI and Base UI and the React Aria `Table` collection on React Aria.

### Fixed

- Registry example items for Base UI and React Aria: `/r/base/example-<slug>.json` and
  `/r/aria/example-<slug>.json` carried the Radix source (`asChild`, `disabled` on `Button`,
  `onValueChange` on `RadioGroup`, the Radix tooltip composition), which those editions' parts
  reject; they now carry that edition's code.
- React Aria edition: the `label` part is what shadcn ships (`add-part.mjs` output), the hand
  edit that dropped its unused `import * as React` is reverted, and `shadcn-table-aria` lists
  `label` as a registryDependency like every other part instead of shipping its own copy.
  Unused locals and parameters are checked by ESLint (`@typescript-eslint/no-unused-vars`, `_`
  prefix tolerated, parts ignored), no longer by `noUnusedLocals` and `noUnusedParameters` in
  the tsconfigs.

## 0.5.1 - 2026-10-28

### Changed

- Release flow: `.github/workflows/pr.yml` replaces `ci.yml` and adds a `release impact` job
  that asks every pull request for one `release:` label (`release:patch`, `release:minor`,
  `release:major`, `release:skip`); the `registry` and `install` jobs now run on every pull
  request. `.github/workflows/release.yml` computes the next version from that label or the
  `## Unreleased` headings (`scripts/release/next-version.mjs`), opens or updates the
  `chore: version <v>` pull request from `release/next`, and on its merge tags, smokes,
  installs, publishes the GitHub release and comments on the shipped pull requests.
  `scripts/release.mjs` and the root `release` script are gone.

## 0.5.0 - 2026-10-28

### Added

- React Aria edition: a third edition of the table on shadcn's React Aria parts (`aria-nova`
  style, `react-aria-components`), same API. Registry item `shadcn-table-aria` plus its 38
  locale items (`shadcn-table-aria-locale-<code>`). Install on an `aria-*` style with
  `pnpm dlx shadcn@latest add https://www.shadcn-table.com/r/aria/shadcn-table.json`, or
  `pnpm dlx shadcn@latest add @st/shadcn-table` with the `@st` namespace registered.
- Docs: the edition switch offers Radix UI, Base UI and React Aria; every example renders
  on the selected edition, and the install page, the agent skill and the registry addresses
  list the React Aria commands.

### Changed

- `ST_PartPropTypes` gains `button` and `select`. `table.options` and `column.columnDef`
  hold the button and select `st*Props` (`stCopyButtonProps`, `stExpandButtonProps`,
  `stPaginationProps` and the like) tree-neutral, like the checkbox, slider and dialog
  ones, so one program can hold several editions; the options as written
  (`ST_TableOptions`, `ST_ColumnDef`) keep the edition's types.

## 0.4.0 - 2026-10-28

### Breaking

- Sub-components no longer take a `table` prop. They read it from the `row`, `cell`,
  `header` or `column` they render (`instance.table`), or from the `ST_TableProvider`
  context; wrap hand-composed pieces in `ST_TableProvider`.
- Renderers and `st*Props` callbacks of components that render a row, cell, header or
  column (`Cell`, `GroupedCell`, `Header`, `Footer`, `renderRowActions`,
  `renderRowActionMenuItems`, `renderColumnActionsMenuItems`, `renderDetailPanel`,
  `stRowDragHandleProps` and the like) receive `instance.table`, which has no `state`. Read
  `table.store.state` or `table.atoms.<slice>.get()` there. `table.store.state` is typed over
  `ST_RowData`; cast the row slices (`draggingRow`, `hoveredRow`) through
  `ST_TableState<TData>` when the row type matters.
- The props types of components that render no row, cell, header or column
  (`ST_TableLayoutProps`, `ST_TableContainerProps`, `ST_TableProps`, `ST_TableBodyProps`,
  `ST_TableHeadProps`, `ST_TableFooterProps`, the toolbar, toggle button, menu and modal
  props) no longer take a `TData` parameter. Drop the type argument.
- `ST_TopToolbarProps` is removed; `ST_TopToolbar` takes no props.
- `memoMode` is removed, with the memoized row and cell components
  (`Memo_ST_TableBodyRow`, `Memo_ST_TableBodyCell`) it switched to.
- `expandRowsFn` is removed. It was never implemented.
- The `stFeatures` value is no longer exported. `ST_Features` stays, as a type.
- `filterFns`, `sortFns` and `aggregationFns` names are resolved by TanStack Table core. A
  `filterFn`, `globalFilterFn`, `sortFn` or `aggregationFn` string must be a built-in name or
  one registered through the table option of the same name; an unknown name logs core's
  development warning and filters, sorts or aggregates nothing. A column's `filterFn` keeps
  the name: `columnDef.filterFn` holds the current filter mode name instead of the resolved
  function, and `columnDef._filterFn` is removed.
- Every ST setter (`table.setDensity`, `setIsFullScreen`, `setShowAlertBanner`,
  `setShowToolbarDropZone`, `setDraggingColumn`, `setHoveredColumn`, `setDraggingRow`,
  `setHoveredRow`, `setCreatingRow`, `setEditingCell`, `setEditingRow`,
  `setColumnFilterFns`, `setGlobalFilterFn`, `setShowColumnFilters`, `setShowGlobalFilter`
  and `setActionCell`) hands its `on*Change` handler a function updater, as TanStack's own
  setters do since v9. A handler resolves it with `functionalUpdate` or a React state
  setter.

### Added

- mk (Macedonian) locale.
- `ST_TableProvider` puts a table on the context the library's components read.
  `ShadcnTable` renders it around its layout.
- `ST_TableProvider` renders the table's `table.AppTable`. Swapping its `table` prop for a
  different table remounts the subtree.
- `useShadcnTable` takes an optional selector as its second argument, as `useTable` does,
  so the owner re-renders only on the state it selects.
- `@tanstack/react-store` is a dependency.
- `getColumnFilterFnName` and `selectST_TransformState` are exported from the barrel.
- Docs: the `localization-i18n-mk` example, and a "Compose with ST_TableProvider" section
  in the toolbar customization guide, linked from the ST components page.

### Changed

- Components subscribe to the state slices they render. A state change re-renders the
  components that show it, not the whole table; `ShadcnTable` itself re-renders only on
  the slices its column and data transforms read.
- Docs: examples and guides compose sub-components without a `table` prop, under
  `ST_TableProvider` outside `ShadcnTable`. Locale imports read
  `@/components/ui/shadcn-table/shared/locales/<code>` in the guides, `/SKILL.md` and the
  registry README. The prop tables follow the name resolution in core, the function
  updater on the ST `on*Change` handlers and the unset `show*` loading slices.
- The table's keyframes ship inside the components as a hoisted `<style>` tag; `shadcn add`
  no longer writes to your global CSS. Remove the `st-` keyframes and the
  `.st-progress-indeterminate` rule an earlier install added there. A strict Content Security
  Policy needs a nonce or `style-src 'unsafe-inline'` for the tag.
- `row.table`, `cell.table`, `column.table` and `header.table` are typed
  `ST_CoreTableInstance`, the core table without state; read `table.store.state` or
  subscribe. The `table` argument of every part prop, renderer and handler that also
  receives a row, cell, column or header, and of `createRow`, has the same type.

### Removed

- Docs: the memoization guide and the `memoMode` and `expandRowsFn` prop table entries.

### Fixed

- The row action Edit button hands the edit modal the live row; a spread copy lost the v9 row prototype and `row.getAllCells` threw.
- `isLoading` and `isSaving` default to `false`, and every loading slice (`isLoading`,
  `isSaving`, `showLoadingOverlay`, `showProgressBars`, `showSkeletons`) is in the table
  store from the first render. The three `show*` slices start unset, so they still follow
  `isLoading` and `isSaving` until they are set.
- The core table at `row.table`, `cell.table` and `header.getContext().table` carries the
  ST state, refs and setters.
- A custom `aggregationFn` name typechecks: `ST_AggregationOption` accepts any string, as
  `ST_FilterOption` and `ST_SortingOption` do.
- `enablePagination: false` with `manualPagination: false` shows every row instead of the
  first page.
- With `enableFilters`, `enableColumnFilters` and `enableGlobalFilter` all `false`, filters
  in state no longer filter the rows.
- Row pinning on select (`rowPinningDisplayMode: 'select-*'`) follows the selection state:
  a Shift range pins every row in it under controlled `rowSelection` or an external
  `atoms.rowSelection` too, select all pins the rows it selects (it cleared every pin), and
  programmatic selection (`row.toggleSelected`, `table.toggleAllRowsSelected`) pins and
  unpins.
- Under `rowPinningDisplayMode: 'select-*'`, unselect all (the select-all checkbox, its
  keyboard toggle and `Clear selection`) clears every pin, rows pinned by hand included, as
  0.3.3 did.
- Rows pinned together on select (a Shift range, select all) keep the row model order,
  whatever order the selection lists them in. Under `select-sticky` the rows pinned on
  another page show above or below the page rows in row model order; they came first.
- Under `rowPinningDisplayMode: 'select-*'` the pagination label covers the pinned rows
  kept from other pages (`keepPinnedRows`): select all with `selectAllMode: 'all'` on 8 rows
  at page size 5 reads `1-8 of 8`, the rows the body shows, not `1-5 of 8`.
- Sticky pinned rows (`rowPinningDisplayMode: 'sticky'` or `'select-sticky'`) stay below
  the table head: with more pinned rows than the container holds they covered the head and
  its select-all checkbox. A pinned stack taller than the container keeps its rows below the
  head and sticks them at the top only. Pinned rows kept from another page take their place
  in the sticky offsets; they were offset by minus one row.
- Switching a column's filter mode re-filters the current filter value with the new mode.
  While a column or global filter is set, a controlled `onColumnFiltersChange` receives an
  identity updater (`(old) => [...old]`) on each `setColumnFilterFns` and `setGlobalFilterFn`
  call so the row model re-filters; a handler that only stores the value needs no change.
- Editing a cell from the cell action menu (`editDisplayMode: 'cell'`) keeps the edit input
  focused when the menu closes.
- Rendering an ST display column header headless
  (`flexRender(header.column.columnDef.Header, header.getContext())`) no longer throws.
- A callback `ref` in `stTableLayoutProps`, `stTableContainerProps`, `stTableHeadProps`,
  `stTableFooterProps`, `stTopToolbarProps` or `stBottomToolbarProps` receives the node;
  only ref objects did.
- Those six refs follow React 19 ref cleanup: a cleanup the callback ref returns runs on
  unmount, and a callback that returns none, or a ref object, gets `null`. The
  `stTableContainerProps` and `stBottomToolbarProps` refs never got `null`, and no cleanup
  ran.
- Both installed trees type-check in one program: a project holding the Radix UI and the
  Base UI copy no longer fails with TS2717 on `stConfigFeature`, and each copy types
  `stFilterCheckboxProps`, `stFilterSliderProps`, `stSelectCheckboxProps`,
  `stSelectAllCheckboxProps`, `stEditRowDialogProps` and `stCreateRowModalProps` for its
  own parts. `table.options` and `column.columnDef` hold them as `ST_PartProps` (`object`).

## 0.3.3 - 2026-10-22

### Removed

- The "Migrating to v1" docs page and its sidebar entry. The table has shipped on TanStack
  Table v9 since 0.3.0; there is no v1 and no migration to document.
- Version-specific wording in the docs: the v9 and v8 mentions on the install page, the
  API option pages, the aggregation guide and the prop tables.

### Changed

- The prop tables link to the current TanStack Table docs (`/table/latest/`) instead of
  the v8 docs.
- Releases happen by merging a pull request. `pnpm release <version>` now bumps the
  versions, closes the `Unreleased` changelog section, pushes a `release/<version>` branch
  and opens the pull request; `release.yml` runs on every push to `master`, tags
  `v<version>` when the tag is missing, then verifies production and creates the GitHub
  release as before. Pushing a `v*` tag by hand still works.

## 0.3.2 - 2026-10-21

### Fixed

- Docs site: broken internal links on eight docs pages, the `custom-headless` example
  (crashed on `r.state`), the detail-panel conditional check and the localization tab
  count, so the release smoke passes on production.

## 0.3.1 - 2026-10-21

### Added

- Automated releases: `pnpm release <version>` bumps both `package.json` versions,
  commits `chore: version <version>`, tags `v<version>` and pushes; the tag runs
  `.github/workflows/release.yml`, which waits for production to serve the version,
  smokes the hosted registry, Storybook, `/SKILL.md` and the docs pages, installs the
  table per base from the public URL and creates the GitHub release from this file.
  Any failed check means no release.
- `GET /version.txt` on the docs site returns the library version.
- `release.yml` on `workflow_dispatch` with `dry_run` runs every check and skips the
  release.
- Privacy-preserving analytics on the docs site with PostHog, sent through a first-party
  `/ingest` proxy; no cookie banner, no session replay. The events are listed in
  `CONTRIBUTING.md`.

### Changed

- The CI install matrix (fresh, existing, base, nextjs) lives in the reusable
  `.github/workflows/install.yml`; `ci.yml` and `release.yml` both call it.
- The library source is two complete trees, `registry/radix` and `registry/base`, kept in
  step by the CI guard `pnpm check:bases`; registry scripts live under `scripts/registry`.
  Install addresses are unchanged.
- Docs pages are far lighter: example code is highlighted in the browser on demand
  (`/docs/guides/editing` went from 4.7 MB to 1.05 MB).
- The docs app is back at `apps/shadcn-table-docs`, with one installed copy per base
  (`components/ui-radix`, `components/ui-base`) and one installer,
  `scripts/install.mjs <base>`. The example code view shows `@/components/ui` imports,
  as a user has them.

### Fixed

- The install command bar on the home page stacks on small screens and no longer
  overflows at 390 and 440 px.
- The docs home page no longer crashes with React error #185 ("Maximum update depth
  exceeded") about 9 seconds after load: the live demo opened its edited salary cell from
  an effect that re-ran on every render, because `useShadcnTable` returns a new table
  object each render. The effect now runs only when the replayed row changes.
- `radix-ui` is bumped to 1.8.1, which carries Radix's fix for the React 19 re-render loop
  in `Select` composed refs (`@radix-ui/react-select` 2.4.1,
  `@radix-ui/react-compose-refs` 1.1.5). The registry item already installs the fixed
  version for new users.
- Docs: internal links to pages that do not exist (`/docs/api/props`,
  `/docs/features/*`, `/docs/guides/aggregation-and-grouping` and other old guide paths,
  in pages and in the option tables) point at the right pages. The custom headless example
  renders again: it passed `header.getContext()`, whose `table` has no `table.state`, to
  the select-all header. The one-panel-at-a-time detail panel example opens its panel.
  The command bar's copy button is named "Copied" again after a click, not only its text.

## 0.3.0 - 2026-10-20

Everything since v0.1.1 in one branch for review: the Base UI edition, the shared-source
layout, and the TanStack Table v9 port.

### Install

- Radix UI: `pnpm dlx shadcn@latest add https://www.shadcn-table.com/r/radix/shadcn-table.json`
- Base UI: `pnpm dlx shadcn@latest add https://www.shadcn-table.com/r/base/shadcn-table.json`
- Namespace: `shadcn registry add @st=https://www.shadcn-table.com/r/{style}/{name}.json`,
  then `shadcn add @st/shadcn-table`
- GitHub addresses still work: `anindosarker/shadcn-table/shadcn-table` and
  `anindosarker/shadcn-table/shadcn-table-base`.

### Added

- Base UI edition: two editions of the table, one per shadcn base, same API. Registry
  items `shadcn-table` (Radix UI) and `shadcn-table-base` (Base UI), 37 locale items each,
  114 base-neutral example items.
- Hosted registry per base on the docs site: `https://www.shadcn-table.com/r/radix/<name>.json`
  and `/r/base/<name>.json`, namespace form
  `@st=https://www.shadcn-table.com/r/{style}/{name}.json`.
- Docs: site-wide base selector (header pill and the command-bar dropdown on the home
  page); install commands, rendered examples and code views follow it. Storybook ships
  both editions (`/` and `/base/`) with a toolbar button to the other edition;
  `pnpm storybook:all` runs both locally.
- CI: library and test matrix on both editions, install scenarios fresh, existing, base,
  nextjs.
- Detail-panel rows get a `getRowCanExpand` default (v9 refuses to expand rows without
  `subRows`).

### Changed

- TanStack Table v9 (`@tanstack/react-table` 9.3.1): full v9 API, no legacy hook, no
  compatibility layer. Public renames are listed on the docs page
  getting-started/migrating-v1 (17 items): `sortFn`, `sortFns`, `columnResizing`,
  `columnPinning: { start, end }`, `table.state`, `constructAggregationFn` definitions,
  native Shift-click range selection, `getIsSomeRowsSelected` semantics, exports
  `stFeatures` / `ST_Features`.
- Structure: one shared library source `packages/shadcn-table/shared/` plus 23 Base UI
  override files under `bases/base/components/ui/shadcn-table/`; resolution base-first
  then shared (tsconfig paths and a Vite resolver). No stub `package.json` files inside
  `bases/`.
- All registry scripts under `packages/shadcn-table/registry/`; docs app folder
  `apps/docs`; `tsc:radix` / `tsc:baseui`.
- Installed output unchanged: 92 files per item, same targets.

### Known

- Base UI tooltips have no skip-delay grouping. React Aria is not supported.
- Sidebar "Extra Storybook Examples" and the dev-home footer link the Radix UI Storybook
  regardless of the selector; home page tiles render Radix UI only.

## 0.1.1 - 2026-10-18

Patch release. Install or update with the same command; `--overwrite` updates an existing
install: `pnpm dlx shadcn@latest add anindosarker/shadcn-table/shadcn-table --overwrite`.

### Fixed

- Cell action menu stays open on a real right-click (Chrome on macOS fired the right
  button's pointerup into the first menu item).
- Icon buttons wrapped in `ST_Tooltip` without a name now get the tooltip title as
  `aria-label` (column pin, column filter, show/hide columns).
- `<caption>` renders at the bottom by default, like MRT; `[&>caption]:caption-top` on
  `stTableProps` restores the top.
- `ST_Tooltip` and `useST_MediaQuery` are exported from the barrel.

### Added

- `stTableBodyRowProps.hover`: `false` removes the row hover background.
- `stEditTextFieldProps.helperText` and `error`: inline validation text under the edit
  field, `aria-invalid` on error.

### Docs

- Guide samples no longer pass MUI-only props (`color`, `variant`, `startIcon`, `stTheme`).
- Docs app lint is clean and part of CI.

## 0.1.0 - 2026-10-18

First public release of shadcn-table: a full-featured React data table for shadcn/ui,
built on TanStack Table v8, installed into your app with the shadcn CLI. A port of
material-react-table to shadcn/ui (Radix base).

Install: `pnpm dlx shadcn@latest init --base radix`, then
`pnpm dlx shadcn@latest add anindosarker/shadcn-table/shadcn-table`. Docs:
https://www.shadcn-table.com. Storybook: https://storybook.shadcn-table.com.

### Added

- Sorting, filtering (column, global, faceted, filter modes), grouping, aggregation,
  expanding and tree data, row and column pinning, column ordering, resizing, hiding,
  density, full screen.
- Editing (cell, row, modal, table), row selection, row actions, cell actions, click to
  copy, detail panels, row numbers, row and column virtualization, sticky header and
  footer, pagination.
- 38 locales as separate registry items (`anindosarker/shadcn-table/shadcn-table-locale-<code>`).
- Every docs example installable as `anindosarker/shadcn-table/example-<slug>`.
- AI agent entry points: https://www.shadcn-table.com/SKILL.md,
  `npx skills add anindosarker/shadcn-table`, https://www.shadcn-table.com/llms.txt.

### Requirements

- React 18+, Tailwind CSS v4, shadcn/ui on the Radix base. Base UI and React Aria are not
  supported in this release.

### Known

- Cell action menu does not stay open on a real right-click in some browsers.
- Tooltip triggers have no accessible name.
- `<caption>` renders at the top; no caption-bottom default.
- A few docs samples still pass MUI-era props the types do not declare.
