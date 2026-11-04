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

