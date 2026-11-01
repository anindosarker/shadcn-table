# v0.8.x findings

## Round 1: discussion, 2026-11-01

### F1 Reset view in the demo leaves column pinning as it is

- `test-projects/next-app/components/demos/header-demo/view-settings.tsx`: "Reset view" restores density, wrap, grid lines, sticky header, striped rows, row numbers, pins, column visibility and column order, but not column pinning; a column pinned by the user stays pinned after the reset. Owner noted 2026-11-01; to discuss with the view settings decision.

### F2 Resize handle gestures are undiscoverable

- Demo `column-header.tsx:297-316`: drag resizes and double-click resets the width, but nothing tells the user; the stock handle has no tooltip either (`ST_TableHeadCellResizeHandle.tsx`). Resolved by the D5 addendum: a Reset column size menu item while resized, no tooltip.
