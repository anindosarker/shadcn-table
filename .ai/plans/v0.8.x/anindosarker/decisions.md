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
- Tint order, owner note 2026-11-01: the header band is darker than the striped-row tint, which is darker than the row hover tint, all steps from the page background (the reference's four-step scheme: stripe, hover, header, grid line). The header must always read as one step above alternating rows.

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

### D16 Columns grow to fill the table by default

- The default column width rule is grow: every column stretches in proportion to its set width so the table always fills its container, with no spacer column; when the widths exceed the container the table scrolls sideways. Chosen on the demo's width-rule switch (`/header-demo-v9`) over fill-last-column and exact-plus-spacer.
- In today's terms `layoutMode` defaults to `grid` whether or not resizing is on; `grid-no-grow` (exact widths plus spacer) and `semantic` stay selectable; the demo's fill-last rule is not added.
- Known trade-off, accepted: a resized width is a ratio, so dragging a handle by 20 px moves the edge by less and shifts the other columns; widths persisted by D12 restore the same proportions, not the same pixels.
- Changes: `useST_TableOptions.ts:134-140` default rule; `displayColumn.utils.ts` stops adding `st-row-spacer` by default.
- Stays: CSS-variable widths (virtualization reads them); per-column `grow: false` keeps a column at its exact width inside the grow rule.
