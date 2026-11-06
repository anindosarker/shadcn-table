# v0.8.x decisions

## Round 1: discussion, 2026-11-01

The reference for every look decision is the owner's header demo (`test-projects/next-app/app/header-demo`, branch `playground/header-demo-theming`). It is a visual reference, not an implementation: decisions name what the user sees and does, specs choose classes, components and state.

### D1 Toolbar above the frame

- The top toolbar renders as a plain row above the bordered table frame, not inside it. The reference reads as page chrome over a data surface, which is how shadcn pages lay out filters above a table.
- Changes: `ST_TableLayout` puts the toolbar before the frame; the frame (`rounded-md border bg-background shadow`) wraps only the scroll container and the bottom toolbar and has no inner padding; full screen keeps the frame intact inside a padded fixed wrapper instead of stripping border and radius.
- Stays: the bottom toolbar inside the frame; the slot className props (`stTableLayoutProps`, `stTopToolbarProps`) for consumers who want the old box.

### D2 Header band

- Header cells sit on a muted band with a hairline between columns; labels are medium weight in the muted foreground; each cell ends with a chevron menu trigger at full opacity; the sort arrow shows only while the column is sorted. The reference's header reads as a band, not as a bold first row.
- Changes: `ST_TableHeadCell` background and dividers, label weight and colour, the column actions button becomes a chevron without the 30 percent opacity, `ST_TableHeadCellSortLabel` renders nothing when unsorted and a plain arrow when sorted (no button, no multi-sort index by default); the header row shadow and the 0.97 opacity go.
- Stays: sorting state and multi-sort behaviour; `renderColumnActionsMenuItems`; the sort index badge as an opt-in (decided with the sort popover item).
- Addendum 2026-11-01: no background on the header row. The owner checked the common shadcn data tables (ui.shadcn.com, tablecn, shadcn.io, shadcn-vue, shadcnstudio) and none tints the header; the demo was updated to match. The band is told apart by the muted label colour, the bottom hairline and the chevrons only. The tint-order note below applies to striped rows and hover only.
- Tint order, owner note 2026-11-01: the header band is darker than the striped-row tint, which is darker than the row hover tint, all steps from the page background (the reference's four-step scheme: stripe, hover, header, grid line). The header must always read as one step above alternating rows. Superseded by D23 (hover reads stronger than stripe; header has no tint).

### D3 Optional column icon

- `columnDef.icon` is an optional icon component or node. When set, it renders before the label in the header cell and wherever the column is named by the chrome: filter chips, the column picker, the columns menu and the view settings rows. When unset, nothing renders and the layout is the same as today; consumers are never required to provide one.
- Changes: `ST_ColumnDef_Config` gains `icon`; `ST_TableHeadCell`, the chip, picker and columns menu read it.
- Stays: a custom `Header` render stays possible for anything beyond an icon; the library ships no default icon per column type.

### D4 Label click opens the column menu

- Clicking a header label opens the column menu, the same as the chevron. Sorting is a deliberate action from the menu or the sort popover; no shadcn data-table reference sorts on label click, and an accidental sort on a wide table is costly.
- Changes: `ST_TableHeadCell` label becomes the second trigger of the column menu; the sort-on-click handler and its `cursor-pointer` go.
- Stays: a consumer who wants quick sort writes a custom `Header` with `column.getToggleSortingHandler()`; no `enableHeaderSortClick` option is added.

### D5 Column menu items

- The default column menu lists only what applies right now, in this order: Sort ascending, Sort descending, Clear sort (only while this column is sorted); Filter by column, Clear filter (only while this column has a filter value); Pin to start, Pin to end (each hidden while the column is already pinned there), Unpin (only while pinned); Hide column. Non-applicable items are omitted, not greyed out; the one greyed item is the sort direction already active on this column.
- Sorting from the menu follows the Notion rule: the same column replaces its own direction, another column is appended to the current sort (`column.toggleSorting(desc, true)`).
- Filter by column adds a filter chip for the column in the toolbar and opens it; Clear filter clears the value and removes the chip. (Superseded in part by D38: the Filter item opens the value editor anchored to the header cell and only flashes the chip.)
- Dropped from the default list: Show all columns (the columns menu has it) and Reset column size (double-click on the resize handle).
- Stays: `renderColumnActionsMenuItems` for consumer items.
- Addendum 2026-11-01: Reset column size returns to the default menu, shown only while the column's width differs from its default (same omit rule as Clear sort); double-click on the handle stays as the shortcut; no tooltip on the handle (closes F2). No gating option exists or is added for it (wording fix 2026-11-04: an earlier draft named `showResetColumnSizeMenuItem`, which never existed).

### D6 Resize handle

- The handle is a full-height hairline on the column's trailing edge: invisible at rest, lit while the pointer is anywhere over the header cell, primary while dragging, `col-resize` cursor over the edge; double-click resets the width. No thicker divider: drag-to-resize is an expected table behaviour, the hover light and the cursor teach it.
- Changes: `ST_TableHeadCellResizeHandle` loses the short separator, the density offsets and the 2 px cell border while resizing.
- Stays: `columnResizeMode`, per-column `enableResizing`.
- Addendum 2026-11-05: applies to `columnResizeMode: 'onEnd'` too: the hairline follows the pointer, nothing else; no body guide line, no slide on release (A12).
- Addendum 2026-11-05: the bordered box the owner saw while resizing in aria was the 2 px cell border this decision removes; gone with F39, guarded by the play `ResizeGuidesMeetEdge` (A13).
- Source: A12, A13

### D7 Row heights and grid lines

- Body rows are one fixed height per density: compact 40 px, comfortable 48 px (default), spacious 56 px; the header row is 40 px at every density. Measured against the common shadcn data tables (header 40 px, rows 41 to 49 px, 14 px text, 8 px cell padding) and chosen with the owner on the demo (`h-10 / h-12 / h-14`, header `h-10`).
- Lines: horizontal hairlines between rows, none under the last row, no vertical lines by default; a grid-lines setting (`none`, `rows`, `columns`, `all`) defaults to `rows`.
- Hover tints the whole row evenly; the per-cell overlay layer, the row transition and the opacity drop while dragging go.
- Changes: `ST_TableBodyRow`, `ST_TableBodyCell`, `ST_TableHeadCell` density classes and borders; the row-height estimates used by virtualization follow the new values.
- Stays: 8 px horizontal cell padding at comfortable (the demo's `px-2 / px-3 / px-4` per density); the `hover` prop on `ST_TableBodyRow`.

### D8 Toolbar button group

- The top toolbar's built-in buttons form one right-aligned group in this order: search field and its toggle, filter picker, sort, the view items pinned to the toolbar, full screen, view settings. Buttons are `size="icon"` ghost and turn `secondary` with `aria-pressed` while their feature is active. The search field expands inline to the left of the group.
- Changes: `ST_ToolbarInternalButtons` order and contents; `ST_ToggleGlobalFilterButton`, `ST_ToggleFullScreenButton` and the new buttons carry the active style; the separate columns and density buttons are replaced by the pinned view items (view settings item).
- Addendum 2026-11-02: the `secondary` fill applies only to the filter button while any filter exists, the sort button while any sort exists, and the chips themselves (`filter-bar.tsx:239`, `sort-popover.tsx:101`). Search, full screen, settings and every pinned view button stay ghost and show state through their icon only.
- Stays: `renderToolbarInternalActions` replaces the whole group; `positionGlobalFilter`.

### D9 Filter chips are the default filter display

- A new `columnFilterDisplayMode: 'chips'` becomes the default. Filters live in a chip row at the left of the top toolbar: one chip per filtered column showing the column icon (D3), label and a value summary; clicking a chip opens a popover with the column's filter input (the existing `ST_Filter*` inputs through `ST_TableHeadCellFilterContainer`); "+ Filter" opens a searchable column picker (`Combobox`) that adds a chip and opens it; "Clear filters" clears every value and chip; the column menu's Filter item adds and opens the chip (D5). (Superseded in part by D38: where the editor opens.) A chip for a hidden column stays and says the column must be shown to edit it. Chips append in the order added. The header filter icon does not render in this mode.
- Reference: tablecn's faceted-filter buttons and Notion's chip row put filters in the toolbar; ui.shadcn.com and shadcn-vue show one toolbar input; no reference puts inputs under the headers.
- Changes: a `filterChips` state slice (active column ids, open chip) so a chip exists before it has a value; `ST_FilterChips`, `ST_ColumnPicker` components mounted in `ST_TopToolbar`; value summaries and labels through `localization`; `ST_TableHeadCellFilterLabel` hidden in chips mode.
- Stays: `subheader` and `popover` modes selectable; the filter functions, filter variants and `ST_Filter*` inputs unchanged (see D39 for the chips-mode gate in `ST_FilterTextField`).

### D10 Sort popover in the toolbar

- A sort button in the toolbar group (D8) opens an editor listing the active sort rules: one row per rule with a drag handle, a column select (columns already used by other rules excluded), a direction select and a remove button; "Add sort" opens the column picker (D9); "Delete sort" clears all. While sorts exist the button becomes a chip ("Priority", or "N sorts") placed before the filter chips with a separator; with no sort it opens the picker directly. On by default (`enableSortPopover`).
- Reference: Notion has this editor; the shadcn data tables offer header click or column menu only.
- Changes: `ST_SortPopover` component and chip, mounted by `ST_TopToolbar` and `ST_ToolbarInternalButtons`; labels through `localization`; icons through `icons`.
- Stacked sorts: `enableMultiSort` was already true by default, but the stock UI reached a second sort only by Shift-click on the header sort button. With the editor and the D5 menu rule, stacking is an explicit action with no modifier key.
- Stays: `enableMultiSort`, `enableSorting`, per-column `enableSorting`; the header shows the static sort arrow (D2); the sort index badge is not shown by default.
- Addendum 2026-11-04, agent-settled: the opt-in for the multi-sort index badge is a new table option `showSortIndex` (default `false`); with it on, the sorted header's arrow carries the 1-based index while more than one sort exists.

### D11 View settings panel

- One view settings button at the far right of the toolbar group opens a panel with seven rows: Columns (opens the columns menu), Density (select), Wrap cell text (switch), Grid lines (select: none, rows, columns, all), Sticky header (switch), Alternating row colors (switch), Row numbers (switch), and a Reset view action. Each row has a pin toggle that places that control in the toolbar between sort and full screen as an icon button whose icon follows the current value; default pins are Columns and Density. Search, filter, sort and full screen are fixed toolbar buttons, never pinnable. Reset view restores every row, the pins and column pinning (closes F1). On by default (`enableViewSettings`), replacing the separate columns and density buttons.
- Reference: ui.shadcn.com, shadcn-vue and tablecn expose only a "View" column toggle in the toolbar; Notion keeps wrap, layout and property settings behind its view menu; none offers pin-to-toolbar.
- Changes: `ST_ViewSettingsButton` and the pinned-item buttons in `ST_ToolbarInternalButtons`; a `viewSettings` state slice (`wrapText`, `gridLines`, `stickyHeader`, `striped`, `rowNumbers`, `pins`) beside the existing density state; `gridLines` and `wrapText` take effect in the head and body cells; labels through `localization`, icons through `icons`.
- Stays: `ST_ShowHideColumnsMenu` as the Columns row's menu; `enableStickyHeader`, `enableRowNumbers` as the option-level defaults the switches change at runtime; persistence of these settings is a separate decision.

### D12 (superseded by D36) View settings persist per table

Superseded by D36 (2026-11-04), addenda included: persistence is opt-in, the key is automatic.

- The D11 rows, the pins, column visibility and column order are saved to `localStorage` under `shadcn-table:<id>:view`, one entry per table, on by default. The first render always uses the defaults and the stored state is applied after mount, so server-rendered tables hydrate cleanly; Reset view deletes the entry. The key needs a stable per-table name, so persistence runs only when the consumer sets the `id` option; without one it stays off and development mode logs one warning that names the option. `persistViewSettings: false` turns it off explicitly; a string overrides the key.
- Reference: the demo stores one config under a fixed key (`view-settings.tsx:98`); no shadcn reference persists; Notion persists per view server-side.
- Changes: a storage adapter behind the `viewSettings` slice (`useSyncExternalStore`, blocked storage tolerated), wired to column visibility and order state.
- Stays: controlled `state` and `on*Change` props win over stored values when a consumer provides them.
- Addendum 2026-11-04: persistence needs no setup. The storage key is automatic, `shadcn-table:<hash of the column ids in definition order>:view`; the `id` option, when set, replaces the hash; `persistViewSettings` stays on by default, `false` turns it off, a string sets the key. No development warning for a missing `id`; the one development line left says a stored view was reset because its column ids no longer match the table. Two tables with identical column ids share one view; a column added, removed or renamed starts the view from the defaults.

### D13 Footer and pagination defaults

- `paginationDisplayMode` defaults to `pages` (rows-per-page select, numbered page buttons, previous and next), right-aligned. The footer's top edge is a plain 1 px hairline (`border-t`), the same line as between rows, instead of the inset shadow. The left side stays empty by default.
- Reference: shadcn.io shows numbered pages; ui.shadcn.com and shadcn-vue show Previous and Next only; tablecn shows arrows with "Page 1 of 5".
- Changes: `useST_TableOptions` default; `ST_BottomToolbar` border and height follow D7's row metrics.
- Stays: `default` mode selectable; `renderBottomToolbarCustomActions` for a count or anything else on the left; page size and `rowsPerPageOptions` unchanged.

### D14 Pinning and resizing on by default; actions column last and pinned

- `enableColumnPinning` and `enableColumnResizing` default to true: the column menu's pin items (D5) and the resize handle (D6) are part of the default look. The row actions column (`enableRowActions`) is placed last (`positionActionsColumn: 'last'`), 48 px wide, pinned to the end so it stays visible while the table scrolls sideways, with a horizontal-dots trigger and a visually hidden header label.
- Reference: every shadcn data table puts a horizontal-dots actions button in the last column with an empty header; none pins it because their tables do not scroll sideways; the demo pins it.
- Changes: `useST_TableOptions` defaults; `getST_RowActionsColumnDef` size, header and default pinning; `ST_ToggleRowActionMenuButton` icon.
- Stays: every piece is a table option a consumer can set back (`enableColumnPinning: false`, `positionActionsColumn: 'first'`, `displayColumnDefOptions['st-row-actions']`, `initialState.columnPinning`); the actions column is still defined through options, never in `columns`.

### D15 Empty state keeps its texts, loses the italic

- The empty table keeps one row spanning the columns with `localization.noRecordsToDisplay` (or `noResultsFound` while filters are active), centred and muted, 96 px tall, not italic, matching the shadcn references' "No results." row.
- Changes: `ST_TableBody` empty row classes only.
- Stays: the texts, `renderEmptyRowsFallback`.

D16: number unused (no decision was written).

### D17 Cut-off text gets a tooltip

- Cell text is cut with an ellipsis on one line by default; the wrap view setting (D11) shows it in full. A tooltip with the full value opens only when the text is actually cut off (`scrollWidth > clientWidth`), after the normal delay. Plain text cells get it automatically; custom cells opt in through the exported `ST_OverflowText`; `columnDef.overflowTooltip` sets it per column (`false`, `'value'`, or a render); display columns never show it.
- Reference: Notion, Airtable and Linear show the full value on hover of a truncated cell; the shadcn data tables do not truncate.
- Changes: `ST_TableBodyCell` wraps the value in `ST_OverflowText`; one `TooltipProvider` per table body; `enableCellOverflowTooltip` option default true.
- Stays: `hover:text-clip` goes; a tag list with a "+n" popover stays an app-level custom `Cell`, not a library component.

### D18 Chrome icons are the demo's picks

- The library's `icons` map gains a key for every chrome icon the new look uses, with the demo's exact Lucide picks (`test-projects/next-app/components/demos/header-demo/*.tsx` at `2c0269f`):
  - Column header: `ChevronDown` (menu trigger), `ArrowUp` and `ArrowDown` (sort state), `ListFilter` (filter item), `Pin` and `Pin` rotated 90 degrees (pin to start, pin to end), `PinOff` (unpin), `EyeOff` (hide), `X` (clear sort, clear filter), `Lock` (fixed position).
  - Filter chips and picker: `ListFilter`, `Plus` ("+ Filter"), `Trash2` (remove, delete all), `X` (clear filters), `ChevronDown` (chip caret).
  - Sort editor: `ArrowUpDown` (toolbar button and chip), `GripVertical` (rule handle), `Plus`, `Trash2`, `X`.
  - View settings: `Settings2` (button), `Columns3` (columns), `ChevronRight` (columns row), density `Rows4`, `Rows3`, `Rows2` (compact, comfortable, spacious), wrap `WrapText` off and `ArrowRightToLine` on, grid lines as four library-drawn glyphs (`createLucideIcon` from plain row and column lines: all, rows, columns; `Square` for none), sticky header `PanelTop` on and `PanelTopDashed` off, alternating rows `GapVertical` on and `SquareCenterlineDashedVertical` off, row numbers `ListOrdered` on and `List` off, pin toggle `Pin` and `PinOff`, reset `RotateCcw`.
  - Row actions: `MoreHorizontal` (existing key). Sideways scroll cue: `ChevronLeft`, `ChevronRight`.
- Column-type icons (`Type`, `User`, `Calendar`, `Hash`, `Tags`, and the rest of `demo-context.tsx`) are app choices passed through `columnDef.icon` (D3); the library ships none.
- Changes: new keys in `icons.ts` and `ST_IconKey`; the four grid-line glyphs ship in the library; every icon set from v0.7 (Tabler, Phosphor, Hugeicons, Remix) maps every new key, with a documented substitute where a set lacks the glyph; `check:icons` covers the new keys.
- Stays: existing keys and their defaults; consumers override any key through `icons`.

### D19 Sticky header scroll box capped at 70 percent of the window

- `enableStickyHeader` stays off by default (forced on under row virtualization as today). When on, the scroll container owns the y axis and its height is capped by the CSS variable `--st-sticky-max-height`, default `70vh`; a consumer who owns the page layout sets the variable (`calc(100vh - 12rem)`, `none`) instead of a prop. Full screen keeps filling the padded window (D1). Pinned header cells sit above both scroll directions.
- Reference: the demo (`header-demo.tsx:653-655`, `max-h-[70vh]`); MRT's inherited `clamp(350px, calc(100vh - toolbar), 9999px)` lets the header scroll out whenever page content sits above the table; the "fill the window height" variant needs runtime measurement and has no reference (v5 deleted).
- Changes: `ST_TableContainer` max-height rule for the sticky case.
- Stays: `enableStickyHeader`, `stTableContainerProps` style override, the full-screen rule.
- Addendum 2026-11-03: the `70vh` default applies only when the sticky header is on by choice (the option or the view setting). A table whose sticky header is forced by `enableRowVirtualization` (`useST_TableOptions.ts:144`) keeps today's full-height rule (`clamp(350px, calc(100vh - toolbar), 9999px)`); it reads the same `--st-sticky-max-height` variable, only the default differs. No silent shrink for virtualized tables.

### D20 Column dragging on by default, header cell as the drag source

- `enableColumnOrdering` defaults to true. The header cell itself is the drag source: grab cursor on hover only where the column can be dragged, a click still opens the column menu (D4), only a real drag moves the column. The grip button is optional and off by default (`showColumnDragHandle`, default false); `ST_GrabHandleButton` stays for row dragging and the columns menu.
- Feedback: the dragged column gets a 1 px dashed `--muted-foreground` border and 50 percent opacity, the drop target a 2 px dashed `--primary` border, both down the whole column (today's values). Superseded by D37 (2026-11-04): this static feedback remains only as the reduced-motion fallback. Any cell of a column is a drop target; a drop takes the target's pinning. While dragging near an inner edge of the unpinned area the box scrolls sideways (64 px hot zone, up to 20 px per frame, with hit-tested `dragenter` for cells scrolling under a still pointer). Esc or dropping outside the table cancels: `dragover` sets `dropEffect` to `move` or `none` and `dragend` reorders only when the effect is not `none`; this also fixes today's library, which reorders on a cancelled drag.
- Display columns stay non-draggable by default; the row actions column takes drops and moves through the columns menu but its header is not a drag source (D14). The order persists under D12 and Reset view restores it.
- Reference: the demo (`column-header.tsx:234-327`, `use-drag-auto-scroll.ts`); Notion and Airtable drag the header with no grip; MRT shows a grip; the shadcn data tables have no reordering.
- Changes: `useST_TableOptions` default; `ST_TableHeadCell` becomes the drag source and drops the grip unless the option is set; `ST_TableHeadCellGrabHandle` and the `dragend` handlers take the cancel rule; a `useST_DragAutoScroll` hook mounted from `ST_TableHead` on the container element (amended 2026-11-04 for the ownership split).
- Stays: `enableColumnOrdering: false` on the table or a column, `enableColumnDragging`, the grouping drop zone, `stColumnDragHandleProps`.

### D21 Locked columns show their lock only while a drag is active

- A column with `enableColumnOrdering: false` is locked: it looks normal at rest, shows no grab cursor and cannot be dragged. While another column drags, every cell of the locked column shows diagonal stripes (`repeating-linear-gradient(135deg, color-mix(in srgb, var(--muted-foreground) 12%, transparent) 0 6px, transparent 6px 12px)`) fading in over a muted fill, the header label gives way to the lock icon and "Fixed" (icon alone on narrow display columns), and the cursor shows not-allowed over it (`dropEffect: "none"`). The column menu lists a disabled "Fixed position" item with the lock icon, the one greyed item beside D5's active sort direction.
- Which columns are locked is an app choice; the library locks only the row numbers column by default. The row actions column moves (D14).
- Reference: the demo (`column-header.tsx:134-232, 437-439, 565-570`); Notion and Airtable fix the primary column with no cue; MRT hides the grip only.
- Changes: `ST_TableHeadCell` and `ST_TableBodyCell` locked overlay driven by `draggingColumn`; the column menu item; `localization.fixedPosition`, `localization.fixed`; `icons.Lock` (D18).
- Stays: `enableColumnOrdering: false` as the flag; the columns menu hides the grip for locked columns as today.

### D22 Hidden-columns cue: pinned-edge shadow and hover scroll chevrons

- The inner-edge pinned cells, header and body, cast a small soft shadow towards the scrolling content (`drop-shadow-sm` tinted `--border` in light mode and black at 50 percent in dark mode, clipped so only the inner side shows), always on while that side has visible pinned columns; a side with nothing pinned gets no shadow. On a side with hidden columns, hovering the table shows a ghost icon button (`bg-background text-muted-foreground`) centred in the header row just inside the pinned columns' inner edge; a click scrolls 80 percent of the visible unpinned width, smooth; hidden buttons are `invisible` and out of the tab order. The thin always-visible scrollbar stays. On by default (`enableScrollButtons`).
- Overflow state is tracked with a passive scroll listener and a ResizeObserver writing `data-overflow-start` / `data-overflow-end` on the scroll wrapper, with no re-render per scroll.
- Reference: the demo (`column-header.tsx:95-124`, `horizontal-overflow.tsx`; v13 promoted at `cca3413`); Airtable and Linear show the edge shadow only; Notion shows nothing beyond the scrollbar.
- Changes: `style.utils.ts` pinned shadow colour and placement; a `useHorizontalOverflow` hook and `ST_ScrollButtons` in `ST_TableContainer`; `icons.ChevronLeft` / `ChevronRight` (D18); `localization.scrollLeft` / `scrollRight`.
- Stays: the container scrollbar rules; pinned cells keep opaque backgrounds (D7, 0.7.1 D47).
- Addendum 2026-11-03: the shadow colour comes from the `--st-edge-shadow` token (D23), not from `--border` light / black dark.

### D23 Tint tokens: four theme-derived CSS variables, declared inside the components

- The table root (`ST_TableLayout`) declares four CSS variables through Tailwind arbitrary-property utilities with `dark:` twins; no stylesheet, no registry `cssVars`, a library install never touches `globals.css`. Cells read them (`bg-(--st-stripe)`, `group-hover/row:bg-(--st-hover)`, `data-[state=selected]:bg-(--st-selected)`, `drop-shadow-(color:--st-edge-shadow)` on the pinned inner-edge cells).
- Defaults, all opaque mixes with `--background` so pinned cells reuse the same token and never turn see-through (0.7.1 D47): `--st-stripe` = `color-mix(in srgb, var(--muted) 70%, var(--background))` light, 25 percent dark; `--st-hover` = `--border` 50 percent light, `--muted` 55 percent dark; `--st-selected` = `--primary` 20 percent (today's value); `--st-edge-shadow` = `oklch(from var(--background) calc(l - 0.08) c h)` in both modes, `--border` where relative colour syntax is unsupported (`supports-[…]:` variant).
- Order rule: hover replaces the stripe on a hovered row and reads stronger than it; selection reads stronger than hover; the header stays `--background`; grid lines stay `--border`. The demo's percentages are the defaults; a spec may tune them only within this order. No hard-coded colour anywhere.
- Override: `stTableLayoutProps.className` or any ancestor sets the same variable; no new table options.
- Reference: the demo (`column-header.tsx:60-69, 113-117`); ui.shadcn.com, shadcn-vue and tablecn use `hover:bg-muted/50` and `data-[state=selected]:bg-muted` with no variables.
- Changes: `ST_TableLayout` root classes; `ST_TableBodyRow` and `ST_TableBodyCell` lose the per-cell `::after` overlay (D7) and read the tokens; `style.utils.ts` pinned shadow reads `--st-edge-shadow`.
- Stays: the `hover` prop on `ST_TableBodyRow`; the selected-row state.

### D24 New localization keys are optional, English only, other locales fall back

- Every new user-facing string of the v0.8 chrome (column menu items D5 and D21, chips and picker D9, sort editor D10, view settings D11, scroll buttons D22, overflow and locked cues) is a key in `ST_Localization`. The new keys are optional members with English values in `en.ts` only; the other 38 locale files are untouched and fall back to English through the existing merge over `ST_Localization_EN` (`useST_TableOptions.ts:104-108`). Components read the merged object typed as `Required<ST_Localization>`. A full locale object such as `ST_Localization_DE` keeps type-checking. Translations arrive later per locale as ride-alongs.
- Wording that differs from an existing key gets a new key and the old key stays: `sortAscending` / `sortDescending` beside `sortByColumnAsc` / `sortByColumnDesc`; `pinToStart` / `pinToEnd` beside `pinToLeft` / `pinToRight`; `hideThisColumn` beside `hideColumn`. Interpolation stays `{name}` style (`{n} sorts`, `{n} shown`).
- Reference: MRT ships every key in every locale; the shadcn data tables hard-code English; the demo's strings are the English values (`view-settings.tsx:198-213`, `sort-popover.tsx`, `filter-bar.tsx`, `horizontal-overflow.tsx:100,115`, `column-header.tsx:489,568`).
- Changes: `types.ts` `ST_Localization`; `shared/locales/en.ts`; the locale gate accepts a missing optional key and fails on a missing required one; every new component reads `localization`, never a literal.
- Stays: existing keys and their texts; the `localization` option and the merge.

### D25 Menus open from real triggers; the span anchor stays for the cell context menu only

- Behaviour: every menu and popover of the chrome opens from the element the user presses (chevron and label for the column menu, D4; row actions dots; sort button and chip; filter chips and picker; view settings button, its pinned buttons and its Columns row; scroll buttons) and a second press on that element closes it. The cell context menu opens at the pointer position on right-click as today.
- Implementation is the agent's call; the accepted shape: each exported menu takes its opener as a `trigger` element (radix `asChild`, base `render`, aria's equivalent) with optional controlled `open` / `onOpenChange`; the label and the chevron are two triggers of one controlled column menu; the filter-mode menu becomes a submenu or trigger menu; `useST_MenuAnchor` remains for `ST_CellActionMenu` only; `anchorEl` / `setAnchorEl` leave the four exported menus and the changelog lists the break. Supersedes v0.7.x D26 for every menu but the cell menu.
- Reference: the demo (`column-header.tsx:481, 500-508`, `columns-menu.tsx:24-55`); the shadcn data tables open every menu from a `DropdownMenuTrigger`.
- Changes: `ST_ColumnActionMenu`, `ST_RowActionMenu`, `ST_ShowHideColumnsMenu`, `ST_FilterOptionMenu` and their openers in all three bases; the `MenuOpeners` play test moves to the trigger pattern.
- Stays: `ST_CellActionMenu` with `actionCell` / `onActionCellChange`; `renderColumnActionsMenuItems`, `renderRowActionMenuItems`.
- Addendum 2026-11-03: nothing public is removed. The four exported menus accept a `trigger` element beside the existing `anchorEl` / `setAnchorEl`; both stay supported, the chrome uses `trigger`, a consumer with no trigger element keeps `anchorEl`. The `useST_MenuAnchor` export and its types stay. P5 holds as written; the changelog lists the v0.8 default flips under `### Changed` with the option that restores each, no `### Breaking` block.

## Round 2: v0.7.x carry-overs, 2026-11-03

### D26 Single-row selection uses one RadioGroup around the body (moved to v0.7.x D65)

- When `enableMultiRowSelection` is `false`, `ST_TableBody` renders one `RadioGroup` (value: the selected row id) around the rows, and the select cell renders only `RadioGroupItem` with `value={row.id}`; arrow keys move between rows and screen readers announce "n of m". All three bases, no public API change. Replaces the one-group-per-row shape (`ST_SelectCheckbox.tsx` base :181, radix :174, aria :173).
- Source: v0.7.x F45
- Deferred to v0.7.x (shipped there as the moved decision)

### D27 The loading state has a localization key (moved to v0.7.x D66)

- `ST_Localization` gains `loading` (default `'Loading'`); the aria `ST_LinearProgressBar` reads `localization.loading` for its `aria-label`, and the base and radix bars set `aria-label={localization.loading}` too, so all three announce the same. Overridable through `stLinearProgressProps` as before. Rides along with the first v0.8.x spec that touches localization or the toolbar.
- Source: v0.7.x D57
- Deferred to v0.7.x (shipped there as the moved decision)

### D28 One full-screen table at a time; no container-scoped Escape

- Full screen is a `fixed inset-0` overlay, so a second table reaches full screen only from code, never from a user; the document-level Escape listener stays as it is and no `containerProps` ref is added. No work; v0.7.x D58 closed as accepted.
- Source: v0.7.x D58

### D29 No length-driven refactor; the mode folder is the shape for a new mode, not a rewrite

- v0.7.x F21 (19 functions over 150 lines) and F22 (3 files over 600 lines) close as accepted; `coding-standards.md` keeps its limits as guidance for new code and names the existing files as accepted. No split of `ST_FilterTextField`, `ST_TablePagination` or `stConfigFeature.ts` now.
- When a mode is added to a component that switches on one (`ST_FilterTextField` on `filterVariant`, `ST_TablePagination` on `paginationDisplayMode`), that change moves the component into its own folder: the shell, a `modes.ts` with the key union, a map and a `get<X>Mode` function, and `modes/` with one file per mode. Not before.
- Source: v0.7.x F21, F22

## Round 3: discussion continued, 2026-11-03

### D30 (superseded by D31) Width rule: `semantic` is the default layout mode

Superseded by D31 (2026-11-03): the owner compared `semantic` and `grow` on `/header-demo-v14` and picked `grow`.

- `layoutMode` defaults to `semantic` in every case except virtualization (which still needs `grid`). A semantic table spreads spare width over every column in proportion to its size, display and pinned columns included; once the columns exceed the frame every column renders at its set width and the table scrolls sideways. Sticky offsets are computed from set widths and are exact whenever the table can scroll (measured on `/header-demo-v14`, 2026-11-03: with spare width the table cannot scroll, so the offset difference never shows).
- Resizing stays on (D14) in semantic: the auto-switch to `grid-no-grow` when `enableColumnResizing` is true (`useST_TableOptions.ts:135`) goes. While spare width exists a dragged edge moves faster than the pointer; accepted.
- Reference: the owner's `/header-demo-v14` with the `semantic` width rule; ui.shadcn.com, tablecn and shadcn-vue render semantic tables.
- Changes: `useST_TableOptions` default rule; the resize handle and `columnResizeMode` verified in semantic; Storybook `LayoutMode` stories unchanged.
- Stays: `grid` and `grid-no-grow` selectable; `columnDef.grow`; virtualization forces `grid`.

### D31 Width rule: proportional grow, narrow columns fixed

- Supersedes D30. The default is the library's `grid` layout mode with `grow: false` on every display column and every pinned column: data columns split the spare width in the ratio of their sizes, the row numbers and row actions columns and any pinned column keep their set width, sticky offsets stay exact. Once the columns exceed the frame every column renders at its set width and the table scrolls sideways. Virtualization already uses `grid`.
- Resizing stays on (D14): while spare width exists a dragged edge moves faster than the pointer (the column keeps its share of the spare width); accepted, same as semantic.
- Reference: the owner's `/header-demo-v14` with the `grow` width rule (`header-demo.tsx:627-633`, pinned and display columns excluded from the growable set); Storybook `Features/Layout Mode Examples` `Grid`.
- Changes: `useST_TableOptions` default `layoutMode: 'grid'`, no auto-switch on resizing; `getST_RowActionsColumnDef`, `getST_RowNumbersColumnDef` and the other display column defs set `grow: false`; pinned columns get `flex-grow: 0` from `style.utils.ts` while pinned.
- Stays: `semantic` and `grid-no-grow` selectable; `columnDef.grow` on a data column overrides.
- Addendum 2026-11-04: the mechanism is the agent's call. The demo now sizes columns with CSS `grid-template-columns` (pinned and display columns in px, data columns `minmax(px, fr)`, commit `d4e1d61`); the library may keep its flex-row grid mode or move to grid tracks, whichever keeps today's pinned offsets and resize behaviour. Acceptance compares behaviour, not pixels: the same columns grow, the same columns stay at their set width, proportions within 2 px per column at the reference viewport, exact widths and sideways scroll once the columns exceed the frame.

### D32 Version 0.8.0 as a minor release

- The cycle ships once as 0.8.0 with the `release:minor` label, after 0.7.4. No public option, type or export is removed (D25 addendum, P5); every default that flips in v0.8 (column ordering, pinning and resizing on; `paginationDisplayMode: 'pages'`; `columnFilterDisplayMode: 'chips'`; `layoutMode: 'grid'`; actions column last and pinned; view settings and sort popover on) is listed under `### Changed` with the option that restores the old behaviour.
- Reference: 0.7.0 shipped as a minor with the same changelog shape; the package is pre-1.0.
- Changes: the release spec and the index name the label and the bump.
- Stays: P1 to P7.

### D33 Docs ship with 0.8.0

- The docs site is updated in this cycle as its own workstream: every guide whose behaviour v0.8 changes is rewritten from the shipped code, and a guide is added for each new surface (column icons, filter chips and picker, sort editor, view settings and persistence, overflow tooltip, scroll cues, tint tokens). The agent decides the pages; the owner does not review the list. The docs workstream merges after the library workstreams and before the release spec, with `check-pages.mjs` per base as its gate (P4).
- Stays: the generated per-base library copies in `apps/shadcn-table-docs/components/ui-<base>/`; the live example pages.

### D34 Acceptance reference is the live demo, pinned by a capture at the foundation

- Agent-settled. The visual reference for every look spec is `/header-demo` in `/Users/anindosarker/Work/Personal/React-table/test-projects/next-app` (branch `playground/header-demo-theming`, a separate repository), served at `http://localhost:3000/header-demo` by the owner's dev server. Builders and judges read the demo code for exact values and open the page for comparison; they never edit that repository and never start, stop or restart that server (it runs outside P5's port range).
- The foundation step records the demo commit hash and captures light and dark screenshots at 1800 by 1150 of the default view, the column menu, the sort editor, the filter chips and picker, the view settings panel, a column drag in progress and the scroll cues under `.ai/plans/v0.8.x/anindosarker/reference/`, so Acceptance has a fixed reference if the demo branch moves during the run.

### D35 One clear control for the search

- The search toggle is never disabled. Closed, it shows the magnifier and a click opens the field and focuses it; open, it shows the crossed-out magnifier and one click clears the value and closes the field. Escape in the field clears the text first, then closes the empty field (as today). The field renders no inline clear X by default; `showClearSearchButton` (default false) brings it back for a consumer who shows the search without the toggle.
- Reference: the demo after `2b5c664` (own input without the inner clear button, report §6); Notion and Linear close and clear with one X; ui.shadcn.com and tablecn have a plain input.
- Changes: `ST_ToggleGlobalFilterButton` loses the `disabled` rule and gains the clear-and-close click; `ST_GlobalFilterTextField` renders the inline button only with the option; `localization.clearSearch` stays for both.
- Stays: `positionGlobalFilter`, `enableGlobalFilter`, the Escape rule.

### D36 View persistence is opt-in

- Supersedes D12 and its addenda. `persistViewSettings` defaults to false: a stock table writes nothing to storage, renders no inline script and shows no skeleton. `persistViewSettings: true` saves the D11 rows, the pins, column visibility, order and pinning to `localStorage` under `shadcn-table:<key>:view`; the key is a hash of the column ids in definition order, replaced by the `id` option when set, or by a string given as the option value. Sorts and filters are not persisted. Reset view deletes the entry. Controlled `state` with `on*Change` wins over stored values. Two tables with identical column ids share one view; a column added, removed or renamed starts the view from the defaults, with one development line saying so. No warning for a missing `id`.
- Reload without a flash (server rendering only): the table root renders one fixed inline script (`text/plain` on the client, `suppressHydrationWarning`) that marks the root `data-st-view-pending` before first paint when storage holds a view for this key that differs from the defaults; while marked, body cell content is invisible and a CSS skeleton bar shows (rules once on the body, no second tree, P7), `aria-busy` on; hydration applies the stored view in one render and clears the mark. A visitor with nothing stored sees the server-rendered table at once. The key is escaped for script embedding (`<` as `\u003c`); a `nonce` option passes through for strict Content Security Policy apps, which otherwise fall back to the default-order paint. Client-only apps read storage before the first paint and need none of this.
- Reference: the demo (`header-demo-v20/view-settings.tsx:113-127`, `inline-script.tsx`), the `next-themes` pattern; no library reference persists on its own; Notion and Airtable persist server-side.
- Changes: `persistViewSettings` option; a storage adapter behind the `viewSettings` slice (`useSyncExternalStore`, blocked storage tolerated); `ST_TableLayout` script and pending styles; the docs guide opens with the opt-in line.
- Stays: D11 rows and pins; `initialState` as the defaults the stored view overrides.

### D37 Column drag animation, Notion style

- Supersedes D20's feedback bullet. While a column drags, only the header row previews the move: the other headers slide aside (200 ms `ease-out`, a CSS transition on `translate`) to open a gap where the column will land, and the dragged header, faded with a dashed `--primary` outline, sits in that gap; the body does not move and shows no lines; `columnOrder` changes only on drop. On drop the body columns slide to catch up with the header and the moved column fades a `--primary` tint for 600 ms. Dragging back over the column's own slot restores the order and dropping there changes nothing; drop targets follow the layout slots, not the slid cells. Esc or a drop outside the table slides the headers back. A Columns menu drop slides header and body together and highlights the same way. Only a reorder the user makes animates; hydration, a stored view and Reset view apply at once. With reduced motion nothing slides, the highlight stays and D20's dashed feedback returns. Locked columns keep the D21 overlay for the whole drag; auto-scroll re-sends `dragover` with the pointer position on each scrolled frame.
- Implementation (agent's call): header preview as inline `translate` per header cell through refs, the transition as Tailwind utilities active under `data-flip-sliding` on the table; drop and menu slides and the highlight through `element.animate()`; `will-change` only while a slide runs; no constructed or injected stylesheet (P8); no re-render per frame; state per table instance.
- Limits: header groups and column virtualization get the highlight only; row virtualization previews the header and skips the body slide; the body slide is skipped above 200 rendered rows; a drop into a pinned region is not previewed; touch screens have no drag (unchanged).
- Reference: the demo (`use-column-flip.ts`, `use-drag-auto-scroll.ts`, report §13); Notion previews in the header and slides the body on drop; MRT and the shadcn tables animate nothing.
- Changes: a `useST_ColumnFlip` hook mounted from `ST_TableHead` on the table element (amended 2026-11-04 for the ownership split), head and body cell `data-flip-column` attributes, `ST_ShowHideColumnsMenuItems` drop path calls the flip prepare, `ST_TableHeadCell` drag feedback per state.
- Stays: D20's drag source, drop rule and cancel rule; D21.
- Addendum 2026-11-04, owner: animate with CSS, never with per-frame JavaScript. The header preview is a CSS `translate` transition as in the demo; the drop and menu slides use the demo's `element.animate()` (compositor-run) or an equivalent CSS transition; no `requestAnimationFrame` loop writes styles per frame. The auto-scroll loop (D20) scrolls the box and dispatches events only.

### D38 The filter editor stays where it was opened

- Three entry points, one value editor. The toolbar filter button and "+ Filter" open the searchable "Filter by..." column list; picking a column swaps that same popover to the column's value editor, with a "Back to columns" button at the top; the popover glides to its new width and height over 150 ms ease-out on the swap, not on open, and resizes at once under reduced motion. Filter in a column menu opens the value editor in a popover anchored to that column's header cell; closing it returns focus to the column's chevron. Every entry point adds the chip in the chip row in the background and flashes it for 600 ms, the same highlight a column drop uses (D37). A chip click opens the same editor on the chip. An empty value keeps the chip; only "Remove filter", "Clear filters" and "Delete all filters" drop it. "+ Filter" shows while a sort or a filter exists; "Clear filters" only while a filter chip exists.
- Supersedes the "adds a chip and opens it" wording of D5 and D9; the chips, the picker and the summaries stay as decided.
- Reference: the demo at `4fde6ea` (`filter-bar.tsx:215-321, 385-495`, `column-header.tsx:587-603`, `use-popup-resize.ts`, report §5); Notion opens its filter editor in place from "+ Add filter" and on the header from the property menu.
- Implementation (agent's call): the `filterChips` slice records where the open editor is anchored (`chip`, `toolbar` or `header`); the toolbar chrome renders every editor, including the header-anchored one, from the header cell ref; the column menu only sets the slice; the glide is a measured inline `width` and `height` transition on the popup, no stylesheet (P8).
- Changes: `ST_FilterChips` and a shared `ST_FilterEditor`; the column menu's Filter item; `stFilterChipsFeature` state shape.
- Stays: `ST_TableHeadCellFilterContainer` and the `ST_Filter*` inputs as the editor's body; subheader and popover modes untouched.

### D39 Filter modes live on the editor's top line in chips mode

- In chips mode, a column with `enableColumnFilterModes` and `columnFilterModeOptions` shows an operator picker on the editor's top line ("Name [contains ▾]"): a stock dropdown menu radio list of the library's filter modes with their symbols and labels, the first option the default. Empty and not empty hide the value input and keep the filter active. Remove filter, Clear filters and Delete all filters put the mode back to the first option. The chip summary carries the mode ("Name contains: foo", "Name is empty", plain "Name" without a value). The in-field mode button and the "Filter Mode: X" line do not render in chips mode; subheader and popover modes keep them. No new option: `enableColumnFilterModes` stays off by default at table level and per column; `filterVariant` is unchanged.
- Reference: the demo at `4fde6ea` (`filter-bar.tsx:93-215`, report §5); Notion and Airtable put the operator on the editor's top line.
- Changes: `ST_FilterEditor` top line; the chip summary helper; `ST_FilterTextField` turns `showChangeModeButton` off in chips mode (its mode button, empty-mode badge and "Filter Mode: X" line go together).
- Stays: `ST_FilterOptionMenu` and `columnFilterFns`; the existing `localization.changeFilterMode` and `filterMode` keys.

## Round 3: run rulings, 2026-11-04

### D40 v0.8 run commits carry no Claude-Session line

- Workflow sub-agents receive no harness reminder, so the v0.8.x run's commits, PR bodies and merge commits go out without the `Claude-Session:` trailer; the owner accepted the gap for this run ("ignore"). P5 stays as written for sessions that get the reminder.
- Source: A2

## Round 4: triage of ATTENTION-2026-11-04

### D41 The view settings row reads "Row numbers"

- The English text of `localization.rowNumbers` becomes "Row numbers" (sentence case). It is the only title-case row label in the view settings; the other six rows, the demo (`view-settings.tsx:214`) and the 38 non-English locales are sentence case, and the only caller is `ST_ViewSettingsItems.tsx:75`. The row numbers display column uses the separate key `rowNumber` ("#"), unchanged.
- Changes: `shared/locales/en.ts:113` in the three bases, with the `de.ts` typo (F11) in the same commit. Lands with the follow-up release (D45).
- Source: A1

### D42 Header cells show no hairline between them at rest

- Kept as built: with the default `gridLines: 'rows'` neither the demo (`column-header.tsx:139-144, 633-634` at `4fde6ea9`, unchanged at HEAD) nor the library draws a trailing edge on a header cell at rest; the trailing line is the grid-line border under `columns` or `all`, or the resize hairline on hover (D6). The captures were read wrong; D2 addendum and D6 stand without change.
- Source: A3

### D43 Every built-in display column is locked by default, except row actions

- Addendum to D21: the library default locks select, expand, pin, drag, row numbers and spacer (`ST_DefaultDisplayColumn.enableColumnOrdering: false`, `useST_TableOptions.ts:23`, spread by `displayColumn.utils.ts:26-34`); row actions opts in (`getST_RowActionsColumnDef.tsx:25-34`). The demo enables only row numbers and row actions and says the same in its own comment (`header-demo.tsx:597-604`, "Display columns do not reorder by default"); an app unlocks a column through `displayColumnDefOptions`. The docs describe this (`guides/display-columns.mdx:28`, `guides/column-ordering-dnd.mdx:132`).
- D21's "the library locks only the row numbers column by default" reads as "every built-in display column except row actions".
- Source: A6

### D44 Tint tokens are overridden on the table root only

- Addendum to D23: the four tokens are declared with plain values on the table root (`ST_TableLayout.tsx:24`), so an ancestor's value never reaches the cells; the override is `stTableLayoutProps.className`, as the tint-tokens guide says (`guides/tint-tokens.mdx:29-42`). A self-referencing fallback (`var(--st-stripe, …)`) is invalid CSS, and a second name per token (`--st-stripe-override`) would be new public surface; neither is wanted. D23's "or any ancestor sets the same variable" is withdrawn.
- Source: A7

### D45 Column icons stay opt-in; the examples and the home demo set them

- D3 confirmed: the library never picks an icon for a column. Notion and Airtable show type icons because every property has a type chosen at creation; TanStack columns are untyped, and a guess from `filterVariant` or the data would be wrong on IDs and date strings. Owner, 2026-11-04.
- The Basic, Minimal and Advanced quick examples (`apps/shadcn-table-docs/examples/<base>/{basic,minimal,advanced}/TS.tsx`) and the home demo set `icon` on every column definition, a Lucide icon each, as the demo and the DefaultLook story do, so the first table a visitor sees matches the demo.
- Source: A9

### D46 The docs home demo is the stock table with the header demo's look

- Owner, 2026-11-04 19:07: the home demo at `apps/shadcn-table-docs/components/dev-home/v12/` is the 0.7 look (subheader filter inputs, filter icon in the header, selection column, "Clear selection" banner) and "should look like the demo table in my next app".
- The home demo renders `ShadcnTable` with the DefaultLook data and columns (F10), `getRowId`, `enableRowActions` and an icon per column (D45); no pinned option that the stock defaults already give (chips, sort editor, view settings, row numbers, actions last, pages pagination). `columnFilterDisplayMode: 'subheader'` goes (`signal-table.tsx:156`).
- The scripted steps (`signal-demo.tsx:68-134`) are rewritten for the 0.8 chrome: sort through the sort editor, search, a filter chip, a column drag, view settings. The selection and grouping steps go: they add a selection column and a grouping banner the demo look does not show. Editing stays only if it needs no chrome beyond a cell edit.
- Timing: item 3 of the triage (0.8.0 or 0.8.1).
- Source: A8

### D47 The sort editor honours maxMultiSortColCount

- Fix F7: "Add sort" is offered only while the rule count is below `maxMultiSortColCount` (`ST_SortPopover.tsx:86`, radix and base; aria :81); the editor writes through `table.setSorting`, which bypasses the cap table-core applies in `toggleSorting`. A play test in `stories/features/SortPopover.stories.tsx` covers the cap.
- Timing: item 3 of the triage (0.8.0 or 0.8.1), owner decides later.
- Source: A4

### D48 The columns menu shows the column icon

- D3 stands: `ST_ShowHideColumnsMenuItems.tsx:120-128` renders the icon before the label through the exported `ST_ColumnIcon` (`ST_ColumnPicker.tsx:33`), as the chips and the picker do; nothing when the column has none.
- Timing: item 3 of the triage, owner decides later.
- Source: A5

### D49 Every docs example and every story sets column icons

- Extends D45: every column definition in `apps/shadcn-table-docs/examples/<base>/*/TS.tsx` (116 examples per base, 1 with icons today) and in every `packages/shadcn-table/stories/**/*.stories.tsx` (76 files, 4 with icons today) carries `icon`, a Lucide icon per column. Owner, 2026-11-04: "every example gets icons".
- Opt-in in the library stays (D3, D45); the examples and stories show the opted-in look everywhere. Play tests that assert on header text keep passing: the icon renders before the label, the label text is unchanged.
- Timing: with the docs work of item 3.
- Source: A9

### D50 The persistent view example uses the header demo's data

- `apps/shadcn-table-docs/examples/<base>/persistent-view/TS.tsx` renders the header demo's columns and data (the DefaultLook data set, F10, D46): many rows and columns, so the sticky header, the column order and the view settings the example describes are visible without scrolling the page. Owner, 2026-11-04 19:15. Finding F13.
- Timing: with the docs work of item 3.

### D51 One example page keeps the subheader filter system

- Every filtering example moves to the 0.8 chips (F26); one new page under Filtering Examples, "Subheader Filters Example", shows `columnFilterDisplayMode: 'subheader'` with the filter variants and the filter mode picker as 0.7 showed them, beside the Popover Filters page which keeps `'popover'`. The way back for the flipped default (D32) is visible in the docs, not only in the changelog. Owner, 2026-11-04 19:32.
- Timing: with the docs work of item 3.

### D52 The actions column fits the controls renderRowActions returns

- Addendum to D14: without `renderRowActions` the column stays 48 px with the hidden header label and the dots button. With `renderRowActions` set, the column shows the "Actions" header label (`localization.actions`, as 0.7.4) and sizes to its controls: 96 by default, `displayColumnDefOptions['st-row-actions'].size` wins; the cell never clips a control. The editing examples set `positionActionsColumn: 'first'` so their edit and delete controls sit where 0.7.4 showed them. Owner, 2026-11-04 19:23 and 19:24 (F22).
- Source: A9

### D53 The chip editor input keeps the stock radius; its clipped focus ring is a bug

- A10 asked about the editor input's radius. The radius is the stock `rounded-lg`; what the owner saw (2026-11-04 22:19) was the 3 px focus ring and the rounded edge clipped by the filter container's `overflow-hidden` (F31). No radius change; F31 is fixed as a bug, the input then looks exactly like the search box.
- Source: A10

### D54 The home demo shows seven columns

- Addendum to D46: the home demo table shows Name, Status, Assignee, Project, Due, Estimate and Priority only, so every scripted step acts in view at the home page width; the other DefaultLook columns are not defined for it (not hidden through visibility). Owner, 2026-11-04 22:24 (F32).

### D55 The persistent view example and the home demo render the demo's cells

- Addendum to D46 and D50: the persistent-view example and the home demo use the header demo's column definitions in full (`test-projects/next-app/components/demos/header-demo/header-demo.tsx`, read-only): cell renderers (status and priority chips, tag chips, assignee, estimate, due date), the filter variant and filter fn per column, select options, sizes, sorting settings, icons; the only differences are the import path and what the page demonstrates (persistence options). The example pins every view settings item by default, leaves Name orderable, and shows 50 rows per page. Owner, 2026-11-04 22:32 and 22:40 (F35).

### D56 Only the Popover Filters page pins popover mode

- `export-to-csv` and `export-to-pdf` (and any other example that is not about popover filters) drop `columnFilterDisplayMode: 'popover'` and run on the chips default (D9, D32); `alternate-column-filtering` (the Popover Filters page) is the one example that keeps `'popover'`. Their page checks follow (chips assertions instead of the funnel). Owner, 2026-11-05 (item 4 discussion).

### D57 Row drop slides the rows into place

- Row dragging keeps its current drag preview. On drop, the rows slide from their old to their new positions and the moved row gets the D37 highlight, the same slide and flash a column drop plays; within one table only (a cross-table drop just appears in the target table). Reduced motion: no slide. Owner, 2026-11-05 (F20).

### D58 A page sanity pass on the merged head before the release gate

- After the last fix story merges and before spec 07's gate: on a worktree at the merged `claude/review` head, `examples:variants`, docs `types:check`, `lint`, `build` (a tracked file the build changes is a finding), `check-pages.mjs` every cluster for radix, base and aria one after another against a dev server whose log is scanned for errors (`Error`, `doesn't exist`, `not found in module`, `Unhandled`), and every route of `lib/routes.ts` fetched once; report only, findings for anything red. Owner, 2026-11-05: planned, not run now (the owner's dev server showed stale generated copies; they rebuild on `predev` at server start). Script: `scratchpad/v0.8-sanity-pages.js` (session-local), to be rewritten from this text if lost.

### D59 Every story file gets plays, as a v0.8.x epic

- On `claude/review` 79 story files hold 542 stories and 101 plays; 47 files have none (ColumnResizing, ColumnOrdering, ColumnPinning, Editing, Pagination, Toolbar, Search, RowPinning, LayoutMode, DefaultLook, StickyHeader among them), so `test:<base>` proves only that they mount. A new epic in this cycle, sub-spec 06.3 with its own spec file, gives every story file at least one play and each feature file one play per behaviour it demonstrates (resize drag and reset, pin and unpin, edit and save, page and page size, sticky header on scroll, and so on), written to fail when the behaviour is broken; it runs before the release and after the last fix story. The rule becomes P10. Owner, 2026-11-05.

### D60 Header group cells carry no icon by default

- A group column def may set `icon` and the header renders it before the label (D3); the examples and stories set icons on leaf columns only (D49), so group headers stay plain. Owner, 2026-11-05.

## Round 5: run rulings, 2026-11-05

### D61 Range filters keep Min and Max side by side at every column width

- A `'range'`, `'date-range'`, `'datetime-range'` or `'time-range'` filter renders its two fields side by side in the subheader at every column width, as Material React Table does; a column narrower than the two fields clips them and the consumer sizes the column. No stacking in the library. The "Filter Mode" caption spans the whole range group, not the Min field only; the slider caption sits below the track; the subheader filter container keeps the label row's inline padding (F44). The subheader-filters page sets column sizes that fit. Owner, 2026-11-05 (F44, side-agent note).

### D62 The home demo keeps its narrow-width layout

- Below 1440 px the step list stays under the table with its code lines; that it does not fit a 720 px viewport together with the table is accepted. Owner, 2026-11-05.
- Source: A17

### D63 The home demo plays only while its popovers have room below the toolbar

- The replay starts and resumes only while the toolbar and about 360 px below it are inside the viewport (the demo at least 70 percent visible); otherwise it holds on "Starting" or pauses where it is. The page never scrolls itself. Owner, 2026-11-05 (F48).

### D64 The demo keeps the stock stripe tint

- The View settings step lands the library's default `--st-stripe` (`--muted` at 25 percent in dark, 70 percent in light); neither the library default nor the demo's root changes. Owner, 2026-11-05.
- Source: A18

### D65 The demo's last step is titled "Alternating row colors"

- The step list's sixth title reads "Alternating row colors" (was "Striped rows"); the feature label and `DEMO_LAST` ("Now showing: View settings") stay. The cue (pulse outline) marks the control that acts and the editor or panel it opens: the sort chip and the sort editor, the filter pill and the chip editor, the view settings button and its panel (F49). Owner, 2026-11-05.

### D66 A subheader filter never widens its column

- The subheader filter container keeps `contain-inline-size overflow-hidden` for every filter variant: a column keeps its `size` and clips a wider filter; the consumer sizes a filterable column, as Material React Table. Extends D61 from range fields to all variants. Owner, 2026-11-05.
- Source: A16

### D67 The sort chip keeps the swap icon

- The sort chip shows the swap icon, the first sort's label and a chevron; the sort direction shows in the sorted header's arrow only. Owner, 2026-11-05.
- Source: A19

### D68 The combined grouping header lists every grouped column with its icon

- Under `groupedColumnMode: 'remove'` the grouping column's header keeps the expand chevron as it is, then one segment per grouped column in grouping order, each segment the column's icon followed by its header name, segments separated by a `>` chevron (a breadcrumb), replacing "State, Gender" with a single icon. Under `'reorder'` the expand column keeps its empty header (A11). Supersedes the "first grouped column's icon" part of the F41 fix. Owner, 2026-11-05.
- Source: A11

### D69 The home demo waits for the visitor to scroll it into view

- The D63 room rule stays at 360 px for every step: on a first load where the toolbar sits within 360 px of the bottom edge the demo shows "Starting" and plays once the visitor scrolls it up. Owner, 2026-11-05.
- Source: A20

### D70 Every internal toolbar button mounts with the pinned items' animation, unchanged

- `ST_ToolbarInternalButtons` uses the exact spec 04 1.6.5 animation (`animate-in fade-in zoom-in-75 duration-200 motion-reduce:animate-none`), from 0 opacity, as `ST_ViewSettingsItems` does; the play `ChipsDisplayMode` (`stories/features/Filtering.stories.tsx`) waits for the mount animation instead of the code starting at 10 percent (no test-driven deviation, no-hack rule). Agent, 2026-11-05.
- Source: A14

### D71 Custom toolbar actions subscribe to the state they read

- `renderTopToolbarCustomActions` and `renderBottomToolbarCustomActions` render inside a `table.Subscribe` on `rowSelection`, `columnFilters`, `globalFilter` and `sorting` (per-atom subscriptions, v0.7.x D13); only the actions re-render. No public API change. Agent, 2026-11-05.
- Source: A15

### D72 The multi-select filter field shows a chevron, a clear button and the first match highlighted

- The `multi-select` filter (shadcn `Combobox` with `multiple`, the chips field) keeps its stock composition in place, with: the chips and the typing input in an inner wrapping box; a `ComboboxTrigger` chevron in its own column at the end of the field, vertically centred however many rows the chips take; the existing clear X in the group's trailing slot beside it once a value exists (the empty slot hidden until then, no gap); the chip editor popover at a fixed `w-65` so the chips wrap instead of widening it (F55); `autoHighlight` so typing highlights the first match and Enter picks it. Three bases. Previewed on the docs copy and accepted. Owner, 2026-11-05.
- The accepted diff, to apply as is to `ST_FilterTextField.tsx` in the three bases (paths rewritten from the docs copy to the registry), plus `filterEditorClassName = 'w-65'` in `ST_HeaderFilterEditor.tsx`:

```diff
diff --git a/packages/shadcn-table/registry/<base>/components/ui/shadcn-table/components/inputs/ST_FilterTextField.tsx b/packages/shadcn-table/registry/<base>/components/ui/shadcn-table/components/inputs/ST_FilterTextField.tsx
index 94a82564..02f86b2e 100644
--- a/packages/shadcn-table/registry/<base>/components/ui/shadcn-table/components/inputs/ST_FilterTextField.tsx
+++ b/packages/shadcn-table/registry/<base>/components/ui/shadcn-table/components/inputs/ST_FilterTextField.tsx
@@ -19,6 +19,7 @@ import {
   ComboboxInput,
   ComboboxItem,
   ComboboxList,
+  ComboboxTrigger,
   ComboboxValue,
   useComboboxAnchor,
 } from '@/components/ui/combobox';
@@ -337,7 +338,13 @@ export const ST_FilterTextField = <TData extends ST_RowData>({
           // The select addon overlays the trigger so the trigger spans the whole
           // group and the popper (sized from the trigger) matches the field.
           isSelectFilter && 'absolute inset-y-0 inset-e-0',
-          hasFilterValue ? 'visible' : 'invisible',
+          // The multi-select field carries its own chevron, so the empty clear
+          // slot takes no room there.
+          hasFilterValue
+            ? 'visible'
+            : isMultiSelectFilter
+              ? 'hidden'
+              : 'invisible',
         )}
       >
         <ST_Tooltip side="right" title={localization.clearFilter ?? ''}>
@@ -583,6 +590,7 @@ export const ST_FilterTextField = <TData extends ST_RowData>({
           ) : isMultiSelectFilter ? (
             // Combobox items raise no ChangeEvent, so a user onChange cannot fire.
             <Combobox
+              autoHighlight
               disabled={!!filterChipLabel || textFieldProps.disabled}
               items={multiSelectItems}
               itemToStringLabel={optionLabel}
@@ -593,14 +601,14 @@ export const ST_FilterTextField = <TData extends ST_RowData>({
               <ComboboxChips
                 className={cn(
                   nestedGroupClassName,
-                  'px-1.5 py-0.5',
+                  'flex-nowrap px-1.5 py-0.5',
                   textFieldProps.className,
                 )}
                 onClick={(e) => e.stopPropagation()}
               >
                 <ComboboxValue>
                   {(values: string[]) => (
-                    <>
+                    <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1">
                       {values.map((value) => (
                         <ComboboxChip className="h-5 text-xs" key={value}>
                           {optionLabel(value)}
@@ -617,9 +625,10 @@ export const ST_FilterTextField = <TData extends ST_RowData>({
                         placeholder={values.length ? '' : filterPlaceholder}
                         title={filterPlaceholder}
                       />
-                    </>
+                    </div>
                   )}
                 </ComboboxValue>
+                <ComboboxTrigger className="ms-auto shrink-0 self-center" />
               </ComboboxChips>
               <ComboboxContent anchor={comboboxAnchor}>
                 <ComboboxEmpty>{localization.noResultsFound}</ComboboxEmpty>
```

### D73 The grouping column's default width is the sum of the grouped columns' widths

- Under `groupedColumnMode: 'remove'` the combined grouping column's default `size` is the sum of the grouped columns' sizes (each grouped column leaves the table and its width moves into the combined one), recomputed as grouping changes; an explicit `displayColumnDefOptions['st-row-expand'].size` wins; the breadcrumb header (D68) never truncates. Owner, 2026-11-05.

### D74 The aria multi-select filter keeps no first-match highlight

- React Aria Components `ComboBox` has no `autoHighlight`; on aria, typing in the multi-select filter highlights nothing and Enter picks nothing until ArrowDown. Accepted as a base gap; radix and base keep D72's `autoHighlight`. Owner, 2026-11-05.
- Source: A21

### D75 View settings icons: Lucide picks for grid lines, columns and density

- The default Lucide map (`icons.ts`, three bases) changes: grid lines all `Frame`, rows `Equal`, columns `Equal` rotated 90 degrees, none `Square`; the view settings Columns row and its pinned button `Columns3Cog`; density compact `ListChevronsDownUp`, comfortable `ListIndentDecrease` mirrored horizontally, spacious `ListChevronsUpDown`. The drawn glyphs in `components/icons/ST_GridLineIcons.tsx` stay (the Tabler, Phosphor, Remix and Hugeicons editions keep importing them, no edition change); the file stays at its path (P5). Previewed on the docs copy and accepted. Owner, 2026-11-06.
- The accepted diff, to apply as is to `icons.ts` in the three bases (paths rewritten from the docs copy to the registry); `check:icons` keeps one `Key: Glyph,` per line, the two wrappers sit above the map:

```diff
diff --git a/packages/shadcn-table/registry/<base>/components/ui/shadcn-table/icons.ts b/packages/shadcn-table/registry/<base>/components/ui/shadcn-table/icons.ts
index d099d3a0..d778bfba 100644
--- a/packages/shadcn-table/registry/<base>/components/ui/shadcn-table/icons.ts
+++ b/packages/shadcn-table/registry/<base>/components/ui/shadcn-table/icons.ts
@@ -11,17 +11,22 @@ import {
   ChevronLeft,
   ChevronRight,
   ChevronsDown,
-  Columns3,
+  Columns3Cog,
   Copy,
+  Equal,
   Eraser,
   EyeOff,
   Filter,
   FilterX,
+  Frame,
   GapVertical,
   GripVertical,
   Layers,
   List,
+  ListChevronsDownUp,
+  ListChevronsUpDown,
   ListFilter,
+  ListIndentDecrease,
   ListOrdered,
   Lock,
   Maximize,
@@ -36,9 +41,6 @@ import {
   PinOff,
   Plus,
   RotateCcw,
-  Rows2,
-  Rows3,
-  Rows4,
   Save,
   Search,
   SearchX,
@@ -49,13 +51,23 @@ import {
   WrapText,
   X,
   XCircle,
+  type LucideProps,
 } from 'lucide-react';
+import { createElement } from 'react';
+import { cn } from '@/lib/utils';
 import type { ST_Icons } from '@/components/ui/shadcn-table/types';
-import {
-  ST_GridLinesAllIcon,
-  ST_GridLinesColumnsIcon,
-  ST_GridLinesRowsIcon,
-} from '@/components/ui/shadcn-table/components/icons/ST_GridLineIcons';
+
+const EqualVertical = (props: LucideProps) =>
+  createElement(Equal, {
+    ...props,
+    className: cn('rotate-90', props.className),
+  });
+
+const ListIndentDecreaseFlipped = (props: LucideProps) =>
+  createElement(ListIndentDecrease, {
+    ...props,
+    className: cn('-scale-x-100', props.className),
+  });
 
 export const ST_Default_Icons = {
   AddIcon: Plus,
@@ -69,9 +81,9 @@ export const ST_Default_Icons = {
   CloseIcon: X,
   ContentCopy: Copy,
   DeleteIcon: Trash2,
-  DensityLargeIcon: Rows2,
-  DensityMediumIcon: Rows3,
-  DensitySmallIcon: Rows4,
+  DensityLargeIcon: ListChevronsUpDown,
+  DensityMediumIcon: ListIndentDecreaseFlipped,
+  DensitySmallIcon: ListChevronsDownUp,
   DragHandleIcon: GripVertical,
   DynamicFeedIcon: Layers,
   EditIcon: Pencil,
@@ -82,10 +94,10 @@ export const ST_Default_Icons = {
   FirstPageIcon: ChevronFirst,
   FullscreenExitIcon: Minimize,
   FullscreenIcon: Maximize,
-  GridLinesAllIcon: ST_GridLinesAllIcon,
-  GridLinesColumnsIcon: ST_GridLinesColumnsIcon,
+  GridLinesAllIcon: Frame,
+  GridLinesColumnsIcon: EqualVertical,
   GridLinesNoneIcon: Square,
-  GridLinesRowsIcon: ST_GridLinesRowsIcon,
+  GridLinesRowsIcon: Equal,
   IndeterminateIcon: Minus,
   KeyboardDoubleArrowDownIcon: ChevronsDown,
   LastPageIcon: ChevronLast,
@@ -109,7 +121,7 @@ export const ST_Default_Icons = {
   StripedOnIcon: GapVertical,
   SwapVertIcon: ArrowUpDown,
   SyncAltIcon: ArrowLeftRight,
-  ViewColumnIcon: Columns3,
+  ViewColumnIcon: Columns3Cog,
   VisibilityOffIcon: EyeOff,
   WrapTextIcon: WrapText,
 } satisfies ST_Icons;
```

### D76 The drawn grid-line glyphs go in 0.8.0

- Sub-spec 06.6 maps the D75 keys in the four icon editions to their own sets and deletes `components/icons/ST_GridLineIcons.tsx` (three bases, its registry entries and docs copies follow): the file was added in this cycle and never released, so no shipped registry path is lost (P5 protects released paths only). Owner, 2026-11-06.

### D77 Edition icon picks for the D75 keys

- The owner delegated the picks ("find relevant icons and update", 2026-11-06): each edition takes the recommended column of `reference/icons/edition-candidates.md`. Rotation and mirroring go through a wrapper above the map that adds `rotate-90` or `-scale-x-100` with `cn`, the shape of D75's `EqualVertical` and `ListIndentDecreaseFlipped`, applied in place in each map (P12), one `Key: Glyph,` line per key. The owner reviews the result on the docs copies before the release.
- Tabler (`@tabler/icons-react`): `GridLinesAllIcon: IconFrame`, `GridLinesRowsIcon: IconEqual`, `GridLinesColumnsIcon: IconEqual` rotated, `GridLinesNoneIcon: IconSquare` (kept), `ViewColumnIcon: IconTableOptions`, density `IconBaselineDensitySmall`, `IconBaselineDensityMedium`, `IconBaselineDensityLarge` (kept).
- Phosphor (`@phosphor-icons/react`): `GridLinesAllIcon: HashStraightIcon`, `GridLinesRowsIcon: EqualsIcon`, `GridLinesColumnsIcon: EqualsIcon` rotated, `GridLinesNoneIcon: SquareIcon` (kept), `ViewColumnIcon: ColumnsIcon` (kept), `DensitySmallIcon: ArrowsInLineVerticalIcon`, `DensityMediumIcon: TextOutdentIcon` mirrored, `DensityLargeIcon: ArrowsOutLineVerticalIcon`.
- Remix (`@remixicon/react`): `GridLinesAllIcon: RiHashtag`, `GridLinesRowsIcon: RiEqualLine`, `GridLinesColumnsIcon: RiEqualLine` rotated, `GridLinesNoneIcon: RiSquareLine`, `ViewColumnIcon: RiKanbanView`, `DensitySmallIcon: RiContractUpDownLine`, `DensityMediumIcon: RiIndentDecrease` mirrored, `DensityLargeIcon: RiExpandUpDownLine`; every entry through the map's existing `icon()` helper.
- Hugeicons (`@hugeicons/core-free-icons`): `GridLinesAllIcon: FrameIcon`, `GridLinesRowsIcon: EqualIcon`, `GridLinesColumnsIcon: EqualIcon` rotated, `GridLinesNoneIcon: SquareIcon` (kept), `ViewColumnIcon: Columns3CogIcon`, `DensitySmallIcon: ListChevronsDownUpIcon`, `DensityMediumIcon: ListIndentDecreaseIcon` mirrored, `DensityLargeIcon: UnfoldMoreIcon`; every entry through the map's existing `icon()` helper.
- With the editions off the drawn glyphs, `components/icons/ST_GridLineIcons.tsx` is deleted in the three bases with its `index.ts` export line, `registry.json` and `public/r/` entries and docs copies (D76).

## Round 6: 0.8.1 release automation, 2026-11-06

### D78 The release gate is a CI step, not an agent

- The 0.8.0 release took 80 minutes with 13 agents and 1.8M tokens; the three gate agents spent 35 minutes re-deriving by hand what 138 Storybook plays per base and `install.yml` already prove. From 0.8.1 the runtime gate of spec 07 1.6.2 is a checked-in Playwright file run as a step of `install.yml` on the Next app it scaffolds: console zero warnings and errors on the gate, persisted and RTL pages, the persisted page's `data-st-view-pending` timing on a real reload, the RTL header and handle boxes, the two default-state captures per base. The checks the plays already cover (toolbar order, column menu, filter, sort, view settings, drag, locked column, scroll chevron, search, actions column) are not repeated. No gate agent. Ships as 0.8.1 (sub-spec 07.1), no library change. Owner, 2026-11-06 ("fix the scripts, add new ones if needed, and from future plan it properly"; "v0.8.1").

### D79 Captures are compared by pixel diff, judges removed

- The gate step compares each capture with a reference PNG committed in the repo using `pixelmatch` (per-pixel colour tolerance, a maximum differing-pixel count); above the maximum the step fails and uploads the diff image as a CI artifact. The "three judges" line of spec 07 2.2 goes. Nobody looks at a passing diff. A failing diff: the owner in triage; the main session reads the diff image only in an unattended run before fixing forward. Owner, 2026-11-06 ("yes, that can reduce ai cost and time").

### D80 The pipeline releases; no releaser agent

- The release is: the `dev` into `master` PR created with its `release:` label and auto-merge enabled; `version-pr.mjs` labels the bot version PR `release:skip` and enables auto-merge on it; `release.yml` does the rest as today (tag, production wait, smoke, installs, GitHub release). An agent appears only on a red check. Repository settings, done by the agent with the owner's one-time authorization (P5 exception, "you can do it"): "Allow auto-merge" on, the `master` ruleset gets the `pr.yml` jobs as required status checks. Order: the label fixes of D78 to D81 land first so the bot PR is green, then the settings. Owner, 2026-11-06.

### D81 Branch flow: stories merge locally, CI on `dev`, one PR per release

- Stories: branch from `claude/review`, local gates (the `pr.yml` pnpm scripts), merge commit into `claude/review`, branch deleted, no PR. `claude/review` fast-forwards into `dev` at every merge; `pr.yml` runs on every push to `dev` (the Linux run). The one PR per release is `dev` into `master` with its `release:` label, the owner's approval and auto-merge (D80). `act -j <job>` only for stories that change fonts, layout measurements or a workflow file. P1, P2 and P13 are folded into one rule (P1); the 18 story PRs of this cycle were a consequence of the old P2 only. Owner, 2026-11-06.
- Addendum 2026-11-06: no `actionlint`; a workflow edit is proven by running its job (`act` or the `dev` push). Owner.

### D82 Plan vocabulary and files: release, epic, milestone, task, sprint; ownership generated

- Words: release (one folder, one version), epic (one planned unit of work, `epics/NN-<slug>.md`, may span sprints), milestone (a schedulable chunk of an epic: one branch, one worktree, one tracker, one merge, fits one sprint; the rows of the grid), task (an ordered step inside a milestone with its gates, ticket-sized), sprint (milestones that run together; the columns). "Cycle", "spec", "story" and "index" are dropped from the skill, the templates and the plan files.
- Files: `plan.md` (authored: goals, the epic table only), `epics/` (authored; each epic's section 2 holds one `### Milestone: <name>` block per milestone with `Files owned:`, `Depends on:`, `Review:` and its tasks with gates), `ownership.md` (generated by `ownership.py` from the milestone blocks: milestone, epic, depends on, files, the critical path line; never edited), `sprints.md` (generated once by `sprints.py` from `ownership.md`, then ticked by the run; grid only), `trackers/` (one per milestone; a fix milestone has a tracker and a grid row, no epic), `attentions/`, `handoffs/`, `reference/`, `decisions.md`, `findings.md`, `process.md` unchanged.
- Critical path is arithmetic from the blocks: an edge from A to B when B depends on A or the two share a file (lower epic number first); a milestone's column is the longest chain ending at it plus one; the critical path is the longest chain, ending at the release milestone; a collision or a cycle is a script error fixed in the epic. The judgment (files owned, dependencies, the split into milestones) stays with the epic writer.
- Scripts in the expedition skill: `new_cycle.py`, `new_epic.py` (was `new_spec.py`), `ownership.py`, `sprints.py`, `new_fix.py` (tracker stub plus grid row), `status.py` (reads the new names, flags a grid out of step with the epics). The main agent calls scripts, never does a script's job by hand, never spawns an agent to call one. The overlap agent and the hand-written story table go.
- Applied to v0.8.x in place (files renamed, headings reworded, `ownership.md` generated from the existing specs' milestones) and to the skill, templates and scripts; earlier cycles stay as they are, `status.py` reads both layouts. Start on the owner's approval. Owner, 2026-11-06.

### D83 Release flow: one PR, the version bumped by CI after green

- Milestones (D82 words): branch from `claude/review` in a pool worktree, the tasks with the gates the epic names, verifier, merge commit into `claude/review`, branch deleted local and remote. How a column is orchestrated (one Workflow per milestone, several, or one for several) is the run manager's judgment.
- `dev` stays untouched during the sprints; `claude/review` fast-forwards into `dev` once, after the last feature column merges. The release epic's first milestone is integration: a verifier runs the suite on `dev`, records the tracker, reports; a red becomes fix milestones on `claude/review`, then `dev` again and a rerun. `act pull_request` (nektos act) is available to any agent at any stage when it helps, never required, never forbidden; the integration milestone is its usual place.
- One PR per release: `dev` into `master` with the `release:` label and auto-merge; only `dev` may open a PR into `master`. `pr.yml` runs all jobs including the gate step (D78, D79); its last job, after every other job is green, runs `release:prepare` (the `version-pr.mjs` logic as a local script: both `package.json` bumped, `## Unreleased` renamed to `## <version> - <date>`), commits `chore: version <version>` to `dev` with a GitHub App token so `pr.yml` reruns once, and skips when the head is already bumped. The owner approves the PR with the bump in it; auto-merge merges on green; Vercel publishes `master`.
- `release.yml` runs once on that push: tag, wait for production, smoke, installs, GitHub release, PR comment; then `claude/review` and `dev` fast-forward to `master`. Deleted: the `version` job, `version-pr.mjs`, branch `release/next`. Supersedes the version-PR half of v0.5.x decision 7 (the accumulating bot PR fitted many merges into `master`; D81 gives `master` one PR per release).
- Repo settings, the owner's one-time authorization: the App token secret, auto-merge on, the `pr.yml` jobs as required checks, the `dev`-only source rule on the `master` ruleset. Code changes in epic 07.1; the rest is process (P1). Owner, 2026-11-06.

### D84 "Check" replaces "gate"; the browser run on an installed app is "install smoke"; repo-level checks live in `test/checks/`

- A check is a command that must pass before a merge or a release; a required check is one the `master` ruleset lists. "Gate" is retired from the skill, `process.md`, templates, trackers and epics: "Gates:" lines become "Checks:", a tracker line reads `- Check: <name>, <command> at <sha>: pass | fail`, "green" becomes "pass", "a red gate" becomes "a failing check". The name after "Check:" says what is checked (typecheck (radix), lint, play tests (base), bases identical, docs pages (aria), release label, version bump, install smoke). Inputs and outputs of a check carry its name without the prefix (the install smoke pages, the `install-smoke-<base>` artifact).
- The specific check of spec 07 1.6.2 (a fresh Next app per base, console, persisted view, RTL, captures diffed against references) is "Check: install smoke". Its files move from `packages/shadcn-table/test/release/` to `test/checks/install-smoke/` at the repo root (`smoke.mjs`, `init.js`, `pages/app/install-smoke/`, `reference/<base>/`); `playwright`, `pixelmatch`, `pngjs` become root devDependencies; the `install.yml` step is named "Check: install smoke" and the routes `install-smoke/`. The move is a fix milestone before PR #132 merges.
- `test/checks/` is the home of every repo-level check (one subfolder per check: `bases`, `icons`, `tailwind`, `registry`, `install`, `release` with `decide.test.mjs`, `prepare.test.mjs`, `smoke.mjs`); the package's tests stay in `packages/shadcn-table/stories/` (every story a render test, a `play:` the behaviour test; no separate plays folder) with `test/unit/` for pure functions when the first one comes; the docs app's checks stay in `apps/shadcn-table-docs/scripts/page-checks/`. The remaining moves and one root `pnpm test:checks` are a 0.9 epic. Merged milestone names keep "Gate step (07.1)". Owner, 2026-11-06.
