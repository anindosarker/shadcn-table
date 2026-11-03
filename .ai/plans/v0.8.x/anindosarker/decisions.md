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

- Clicking a header label opens the column menu, the same as the chevron. Sorting is a deliberate action taken from the menu (or the sort popover), never a side effect of clicking the label; this matches the shadcn data table pattern, where the header button opens a dropdown with the sort items.
- Changes: `ST_TableHeadCell` label becomes a menu trigger; the sort toggle on the label goes; no option re-enables it.
- Stays: a consumer who wants one-click sorting writes a custom `Header` that calls `column.toggleSorting`.

### D4 Label click opens the column menu

- Clicking a header label opens the column menu, the same as the chevron. Sorting is a deliberate action from the menu or the sort popover; no shadcn data-table reference sorts on label click, and an accidental sort on a wide table is costly.
- Changes: `ST_TableHeadCell` label becomes the second trigger of the column menu; the sort-on-click handler and its `cursor-pointer` go.
- Stays: a consumer who wants quick sort writes a custom `Header` with `column.getToggleSortingHandler()`; no `enableHeaderSortClick` option is added.

### D5 Column menu items

- The default column menu lists only what applies right now, in this order: Sort ascending, Sort descending, Clear sort (only while this column is sorted); Filter by column, Clear filter (only while this column has a filter value); Pin to start, Pin to end (each hidden while the column is already pinned there), Unpin (only while pinned); Hide column. Non-applicable items are omitted, not greyed out; the one greyed item is the sort direction already active on this column.
- Sorting from the menu follows the Notion rule: the same column replaces its own direction, another column is appended to the current sort (`column.toggleSorting(desc, true)`).
- Filter by column adds a filter chip for the column in the toolbar and opens it; Clear filter clears the value and removes the chip.
- Dropped from the default list: Show all columns (the columns menu has it) and Reset column size (double-click on the resize handle; the item stays available through `showResetColumnSizeMenuItem`).
- Stays: `renderColumnActionsMenuItems` for consumer items.
- Addendum 2026-11-01: Reset column size returns to the default menu, shown only while the column's width differs from its default (same omit rule as Clear sort); double-click on the handle stays as the shortcut; no tooltip on the handle (closes F2). `showResetColumnSizeMenuItem` is no longer needed as a gate for the default list.

### D6 Resize handle

- The handle is a full-height hairline on the column's trailing edge: invisible at rest, lit while the pointer is anywhere over the header cell, primary while dragging, `col-resize` cursor over the edge; double-click resets the width. No thicker divider: drag-to-resize is an expected table behaviour, the hover light and the cursor teach it.
- Changes: `ST_TableHeadCellResizeHandle` loses the short separator, the density offsets and the 2 px cell border while resizing.
- Stays: `columnResizeMode`, per-column `enableResizing`, `showResetColumnSizeMenuItem`.

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

- A new `columnFilterDisplayMode: 'chips'` becomes the default. Filters live in a chip row at the left of the top toolbar: one chip per filtered column showing the column icon (D3), label and a value summary; clicking a chip opens a popover with the column's filter input (the existing `ST_Filter*` inputs through `ST_TableHeadCellFilterContainer`); "+ Filter" opens a searchable column picker (`Combobox`) that adds a chip and opens it; "Clear filters" clears every value and chip; the column menu's Filter item adds and opens the chip (D5). A chip for a hidden column stays and says the column must be shown to edit it. Chips append in the order added. The header filter icon does not render in this mode.
- Reference: tablecn's faceted-filter buttons and Notion's chip row put filters in the toolbar; ui.shadcn.com and shadcn-vue show one toolbar input; no reference puts inputs under the headers.
- Changes: a `filterChips` state slice (active column ids, open chip) so a chip exists before it has a value; `ST_FilterChips`, `ST_ColumnPicker` components mounted in `ST_TopToolbar`; value summaries and labels through `localization`; `ST_TableHeadCellFilterLabel` hidden in chips mode.
- Stays: `subheader` and `popover` modes selectable; the filter functions, filter variants and `ST_Filter*` inputs unchanged.

### D10 Sort popover in the toolbar

- A sort button in the toolbar group (D8) opens an editor listing the active sort rules: one row per rule with a drag handle, a column select (columns already used by other rules excluded), a direction select and a remove button; "Add sort" opens the column picker (D9); "Delete sort" clears all. While sorts exist the button becomes a chip ("Priority", or "N sorts") placed before the filter chips with a separator; with no sort it opens the picker directly. On by default (`enableSortPopover`).
- Reference: Notion has this editor; the shadcn data tables offer header click or column menu only.
- Changes: `ST_SortPopover` component and chip, mounted by `ST_TopToolbar` and `ST_ToolbarInternalButtons`; labels through `localization`; icons through `icons`.
- Stacked sorts: `enableMultiSort` was already true by default, but the stock UI reached a second sort only by Shift-click on the header sort button. With the editor and the D5 menu rule, stacking is an explicit action with no modifier key.
- Stays: `enableMultiSort`, `enableSorting`, per-column `enableSorting`; the header shows the static sort arrow (D2); the sort index badge is not shown by default.

### D11 View settings button

- One settings button at the right end of the toolbar group opens a panel with these rows: Columns (opens the columns menu), Density (select), Wrap cell text (switch), Grid lines (select, D7), Sticky header (switch), Alternating row colors (switch), Row numbers (switch), and Reset view. Each row has a pin toggle that places that control in the toolbar as an icon button; pinned by default: columns and density. Row icons follow the current value. On by default (`enableViewSettings`), replacing the separate columns and density buttons.
- Reset view restores every row to its default and also resets column pinning (closes F1).
- Reference: ui.shadcn.com, shadcn-vue and tablecn have a "View" dropdown with column toggles only; Notion keeps wrap and layout in its view menu; none pins controls to the toolbar.
- Changes: `ST_ViewSettingsButton` and panel; a `viewSettings` state slice (`wrapText`, `gridLines`, `striped`, `rowNumbers`, `pins`; density and sticky header map to their existing state and option); `ST_ToolbarInternalButtons` renders the pinned items; labels through `localization`, icons through `icons`.
- Stays: `ST_ShowHideColumnsMenu` as the columns menu body; `enableDensityToggle`, `enableHiding`, `enableStickyHeader`, `enableRowNumbers` as the switches' gates; persistence is off (own item).

### D11 View settings panel

- One view settings button at the far right of the toolbar group opens a panel with seven rows: Columns (opens the columns menu), Density (select), Wrap cell text (switch), Grid lines (select: none, rows, columns, all), Sticky header (switch), Alternating row colors (switch), Row numbers (switch), and a Reset view action. Each row has a pin toggle that places that control in the toolbar between sort and full screen as an icon button whose icon follows the current value; default pins are Columns and Density. Search, filter, sort and full screen are fixed toolbar buttons, never pinnable. Reset view restores every row, the pins and column pinning (closes F1). On by default (`enableViewSettings`), replacing the separate columns and density buttons.
- Reference: ui.shadcn.com, shadcn-vue and tablecn expose only a "View" column toggle in the toolbar; Notion keeps wrap, layout and property settings behind its view menu; none offers pin-to-toolbar.
- Changes: `ST_ViewSettingsButton` and the pinned-item buttons in `ST_ToolbarInternalButtons`; a `viewSettings` state slice (`wrapText`, `gridLines`, `stickyHeader`, `striped`, `rowNumbers`, `pins`) beside the existing density state; `gridLines` and `wrapText` take effect in the head and body cells; labels through `localization`, icons through `icons`.
- Stays: `ST_ShowHideColumnsMenu` as the Columns row's menu; `enableStickyHeader`, `enableRowNumbers` as the option-level defaults the switches change at runtime; persistence of these settings is a separate decision.

### D12 View settings persist per table

- The D11 rows, the pins, column visibility and column order are saved to `localStorage` under `shadcn-table:<id>:view`, one entry per table, on by default. The first render always uses the defaults and the stored state is applied after mount, so server-rendered tables hydrate cleanly; Reset view deletes the entry. The key needs a stable per-table name, so persistence runs only when the consumer sets the `id` option; without one it stays off and development mode logs one warning that names the option. `persistViewSettings: false` turns it off explicitly; a string overrides the key.
- Reference: the demo stores one config under a fixed key (`view-settings.tsx:98`); no shadcn reference persists; Notion persists per view server-side.
- Changes: a storage adapter behind the `viewSettings` slice (`useSyncExternalStore`, blocked storage tolerated), wired to column visibility and order state.
- Stays: controlled `state` and `on*Change` props win over stored values when a consumer provides them.

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
- Feedback: the dragged column gets a 1 px dashed `--muted-foreground` border and 50 percent opacity, the drop target a 2 px dashed `--primary` border, both down the whole column (today's values). Any cell of a column is a drop target; a drop takes the target's pinning. While dragging near an inner edge of the unpinned area the box scrolls sideways (64 px hot zone, up to 20 px per frame, with hit-tested `dragenter` for cells scrolling under a still pointer). Esc or dropping outside the table cancels: `dragover` sets `dropEffect` to `move` or `none` and `dragend` reorders only when the effect is not `none`; this also fixes today's library, which reorders on a cancelled drag.
- Display columns stay non-draggable by default; the row actions column takes drops and moves through the columns menu but its header is not a drag source (D14). The order persists under D12 and Reset view restores it.
- Reference: the demo (`column-header.tsx:234-327`, `use-drag-auto-scroll.ts`); Notion and Airtable drag the header with no grip; MRT shows a grip; the shadcn data tables have no reordering.
- Changes: `useST_TableOptions` default; `ST_TableHeadCell` becomes the drag source and drops the grip unless the option is set; `ST_TableHeadCellGrabHandle` and the `dragend` handlers take the cancel rule; a `useDragAutoScroll` hook on `ST_TableContainer`.
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

## Round 2: v0.7.x carry-overs, 2026-11-03

### D26 Single-row selection uses one RadioGroup around the body

- When `enableMultiRowSelection` is `false`, `ST_TableBody` renders one `RadioGroup` (value: the selected row id) around the rows, and the select cell renders only `RadioGroupItem` with `value={row.id}`; arrow keys move between rows and screen readers announce "n of m". All three bases, no public API change. Replaces the one-group-per-row shape (`ST_SelectCheckbox.tsx` base :181, radix :174, aria :173).
- Source: v0.7.x F45

### D27 The loading state has a localization key

- `ST_Localization` gains `loading` (default `'Loading'`); the aria `ST_LinearProgressBar` reads `localization.loading` for its `aria-label`, and the base and radix bars set `aria-label={localization.loading}` too, so all three announce the same. Overridable through `stLinearProgressProps` as before. Rides along with the first v0.8.x spec that touches localization or the toolbar.
- Source: v0.7.x D57
