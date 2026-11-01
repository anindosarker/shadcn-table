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
