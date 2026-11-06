# 03: header, column menu and dragging

## 1. Architecture

### 1.1 Overview

The header becomes the demo's quiet band with one chevron menu per column, the column menu lists only what applies, the resize handle is a hairline, and columns reorder by dragging the header with the Notion-style preview, catch-up slide and highlight; locked columns say so only while a drag is active (D2) (D3) (D4) (D5) (D6) (D18) (D20) (D21) (D25) (D37). This spec owns the head files, the column action and filter option menus, the two drag hooks and the grab handle in all three bases. Workstream B (index, Run plan): branch `v0.8/header-menu-drag`, worktree `02`, cut from `claude/review` after spec 01 merged, parallel to specs 02 and 04, one builder, draft PR at the first push (P1), one fable review on the whole diff (`Review: fable`). Body cells, the container and the table element belong to spec 02: this spec reaches them only through `table.refs.tableRef`, `tableContainerRef` and the attributes spec 02 renders (`data-flip-column`); the default flip of `enableColumnOrdering` is spec 05's.

### 1.2 Goals

- Header cells have no background, a medium-weight muted label, an optional icon before it, a full-opacity chevron at the end, a sort arrow only while sorted, 40 px at every density, a hairline between columns only when grid lines are `columns` or `all`; the header row shadow and the 0.97 opacity are gone (D2) (D3) (D7)
- Clicking the label or the chevron opens the same column menu; a second click closes it; sorting never happens on a label click (D4) (D25)
- The column menu lists, in order and only when applicable: Sort ascending, Sort descending, Clear sort; Filter by column, Clear filter; Pin to start, Pin to end, Unpin; Reset column size; Fixed position (disabled, locked columns); Hide column; the active sort direction is the one disabled item; sorting from the menu stacks (D5) (D21)
- The resize handle is an invisible full-height hairline that lights on header hover, turns primary while dragging and resets on double-click; a drag on it never starts a column drag (D6)
- The header cell is the drag source with a grab cursor only where draggable; the grip renders only with `showColumnDragHandle`; Escape or an outside drop reorders nothing; the box auto-scrolls near the unpinned edges (D20)
- While dragging, the other headers slide aside 200 ms to open a gap, the dragged header sits faded with a dashed `--primary` outline in the gap, the body stays still; on drop the body slides to catch up and the moved column highlights 600 ms; the column's own slot restores the order; a Columns menu drop slides header and body together; reduced motion keeps D20's dashed feedback and the highlight only; no stylesheet, no per-frame JavaScript (D37) (P8)
- Locked columns look normal at rest and show the striped overlay with the lock icon and "Fixed" for the whole drag, with the not-allowed cursor (D21)
- Every menu opener still accepts `anchorEl` / `setAnchorEl`; nothing public is removed (D25 addendum)
- Acceptance: programmatic, the play tests of 1.6.8 pass in `test:base`, `test:radix`, `test:aria` (label click opens the menu and does not sort; chevron second click closes; menu items match the omit rule in four states; Notion stacking; reset size item appears only after a resize; a header drag over the next column gives that header a non-zero `translate` and body cells none, the drop reorders and the moved column's cells run an animation, Escape restores; a locked column shows the overlay only during the drag and its menu has the disabled item; the handle has no visible line at rest and `bg-primary` while resizing); judged, captures of the `DefaultLook` story header at rest, with the Status menu open, and mid-drag of Assignee over Project, per base, against `reference/01-default-*.png`, `reference/01-column-menu-*.png` and `reference/01-drag-*.png` (D34), three judges on "quiet header with chevrons, same menu items in the same order, header-only preview with a gap and a faded dashed dragged header" (P6)

### 1.3 Current structure

```
packages/shadcn-table/registry/<base>/components/ui/shadcn-table/
├── components/head/ST_TableHeadCellFilterContainer.tsx ← `open` prop from 01; `ST_TableHeadCellFilterLabel.tsx` is spec 04's
├── components/head/ST_TableHeadCell.tsx            ← font-bold band (27-29); showDragHandle 161-176; resize and drag borders 178-199; sort on click 300-315; grip and actions 330-345; drag handlers 73-90
├── components/head/ST_TableHeadCellSortLabel.tsx   ← button with tooltip, SyncAlt when unsorted (15-123)
├── components/head/ST_TableHeadCellColumnActionsButton.tsx ← MoreVert at opacity-30 (17-19); anchorEl state and useST_MenuAnchor (47-57); tooltip (71-102)
├── components/head/ST_TableHeadCellResizeHandle.tsx ← density offsets, Separator (14-29, 56-97)
├── components/head/ST_TableHeadCellGrabHandle.tsx  ← cancel rule and applyColumnReorder from 01 (63-87)
├── components/head/ST_TableHeadRow.tsx, ST_TableHead.tsx ← row shadow (21-29), opacity-[0.97] (18)
├── components/menus/ST_ColumnActionMenu.tsx        ← anchor span (153-175); sort handlers 71-84; filter 119-127; items 190-368 with disabled instead of omitted; Show all columns item
├── components/menus/ST_FilterOptionMenu.tsx        ← anchorEl and isSubMenu paths (114-135, 297-329)
├── components/toolbar/ST_ToolbarDropZone.tsx       ← dropEffect move from 01
├── shared/utils/style.utils.ts                     ← opacity-50 on dragged and hovered columns for every cell (98-100), z-2 (105-109); spec 02 edits this file
├── shared/utils/drag.utils.ts, column.utils.ts     ← helpers from 01
├── features/stColumnDraggingFeature.ts             ← columnFlipPending from 01
└── features/stRefsFeature.ts                       ← tableRef from 01
packages/shadcn-table/stories/                      ← Sorting, TableProvider, RenderCounts click 'Sort by ... ascending' and 'Column Actions'; MenuOpeners and MenuFocusReturn test the span pattern; ColumnDragging uses the grip; RTL finds .cursor-col-resize
```

### 1.4 Target structure

```
packages/shadcn-table/registry/<base>/components/ui/shadcn-table/
├── components/head/ST_TableHeadCell.tsx            ← group/th; label button, icon, static sort arrow, chevron trigger; one controlled menu state; drag source; locked overlay; transition utilities keyed on the table's data-flip-sliding
├── components/head/ST_TableHeadCellSortLabel.tsx   ← span or null
├── components/head/ST_TableHeadCellColumnActionsButton.tsx ← chevron Button, trigger of ST_ColumnActionMenu, open and onOpenChange from the head cell
├── components/head/ST_TableHeadCellResizeHandle.tsx ← hairline handle
├── components/head/ST_TableHeadCellGrabHandle.tsx  ← optional grip, shared drag start and end
├── components/head/ST_TableHeadCellLockedOverlay.tsx ← new: stripes, Lock icon, "Fixed"
├── components/head/ST_TableHeadRow.tsx, ST_TableHead.tsx ← no shadow, no opacity; ST_TableHead mounts useST_ColumnFlip and useST_DragAutoScroll
├── components/menus/ST_ColumnActionMenu.tsx        ← trigger, open, onOpenChange beside anchorEl; D5 list
├── components/menus/ST_FilterOptionMenu.tsx        ← trigger beside anchorEl; submenu path unchanged
├── hooks/useST_ColumnFlip.ts                       ← new: per instance; header preview, drop and menu slides, highlight, hit test by layout slots
├── hooks/useST_DragAutoScroll.ts                   ← new
└── index.ts                                        ← useST_ColumnFlip, useST_DragAutoScroll, ST_TableHeadCellLockedOverlay
packages/shadcn-table/stories/features/ColumnDragging.stories.tsx ← header drag, preview, cancel, locked plays; grip story keeps showColumnDragHandle
packages/shadcn-table/stories/features/ColumnActions.stories.tsx ← omit-rule plays added
packages/shadcn-table/scripts/registry/base-diff.json, aria-diff.json ← ST_ColumnActionMenu.tsx, ST_FilterOptionMenu.tsx, ST_TableHeadCellColumnActionsButton.tsx already listed (aria); add per-base trigger differences where they arise
```

### 1.5 Flow

```mermaid
sequenceDiagram
  participant H as header cell (source)
  participant T as table dragover (flip hook)
  participant S as draggingColumn, hoveredColumn, columnFlipPending
  participant B as body cells (spec 02)
  H->>S: dragstart: draggingColumn = column
  T->>T: dragover: slot = columnAt(clientX), dropEffect move or none
  T->>S: hoveredColumn = slot column
  T->>H: translate per header (preview, CSS transition)
  H->>S: dragend: not cancelled: columnFlipPending = {positions, movedId, dragDrop: true}; applyColumnReorder
  S->>T: order changed: take pending, animate body cells from old positions, highlight
  B-->>T: cells found by data-flip-column
```

### 1.6 Components

#### 1.6.1 Data artifacts

- `CHANGELOG.md` `#### Spec 03` under `### Added` (D32): header look, column menu rule, resize handle, header drag with animation, locked columns, `trigger` prop on the two menus, `showColumnDragHandle`
- `registry.json` regenerated; diff files updated for any per-base copy of a touched file

#### 1.6.2 Header cell

`ST_TableHeadCell.tsx`, `ST_TableHeadCellSortLabel.tsx`, `ST_TableHeadCellColumnActionsButton.tsx` (D2) (D3) (D4) (D7) (D25).

- Classes: `group/th relative h-10 p-0 font-medium text-muted-foreground border-b` plus `gridLineClassName` from 01 for the column hairline (`border-e` only for `columns` and `all`, not on the last column); no background except `bg-background` when sticky or pinned; `font-bold` and `[&:hover_button]:opacity-100` go; density padding becomes `px-2`, `px-3`, `px-4` on the inner flex row
- Inner row `flex h-full items-center gap-1.5`: optional icon (`columnDef.icon`: an element renders as is, anything else renders as a component, `size-3.5 shrink-0 opacity-70`), the label as a `button type="button"` (`min-w-0 truncate text-sm hover:text-foreground`, `aria-label` `localization.columnMenu` with the column name) that sets the menu open, the sort span, then the chevron button `ms-auto`
- One `useState` open flag per header cell, passed to `ST_TableHeadCellColumnActionsButton` as `open` / `onOpenChange`; the chevron is the primitive trigger (radix `asChild`, base `render`, aria the `MenuTrigger` child); the label is a plain button that sets `open` to true (a radix trigger opens on pointerdown and would fight the drag); a second click on the chevron closes through the primitive
- `ST_TableHeadCellSortLabel`: `null` when unsorted; sorted renders a `span` with `ArrowUpwardIcon` or `ArrowDownwardIcon` `size-3 text-muted-foreground/80` and `aria-label` `sortedAscending` / `sortedDescending`; the multi-sort index badge renders only with `showSortIndex` (01, D10 addendum) while more than one sort exists; no button, no tooltip
- `ST_TableHeadCellColumnActionsButton`: `Button size="icon-xs" variant="ghost"` with `ExpandMoreIcon`, `aria-label` `localization.columnActions`, no tooltip; renders `<ST_ColumnActionMenu trigger={button} open onOpenChange />`; the `anchorEl` path remains for a consumer who renders the menu elsewhere
- `ST_TableHeadRow`: the `shadow-[4px_0_8px...]` goes; `ST_TableHead`: `opacity-[0.97]` goes
- Does NOT call `column.getToggleSortingHandler()` anywhere; does NOT render the grip unless `showColumnDragHandle`; does NOT render the filter label in chips mode (spec 04 checks it inside the label)

**Operations:**

| Operation | Status | Notes |
| --- | --- | --- |
| `headCellVariants` | refactor | band removed, group, logical borders |
| label button | new | opens the menu |
| icon slot | new | `columnDef.icon` |
| `ST_TableHeadCellSortLabel` | refactor | span or null |
| chevron trigger | refactor | `ExpandMoreIcon`, trigger prop |

**Stays unchanged:** `renderColumnActionsMenuItems`; `stTableHeadCellProps`; pinned sticky offsets; the aria `handleClick` guard.

#### 1.6.3 Column menu

`ST_ColumnActionMenu.tsx`, `ST_FilterOptionMenu.tsx` (D5) (D21) (D25).

- Props: `trigger?: ReactElement`, `open?: boolean`, `onOpenChange?: (open: boolean) => void` beside `anchorEl` / `setAnchorEl` (now optional); with `trigger` the content mounts under the primitive trigger (radix `DropdownMenuTrigger asChild`, base `render`, aria `MenuTrigger` with `isOpen`), `align="end"`, `w-44`; without it the span anchor path from `useST_MenuAnchor` stays as today; `closeMenu` routes to whichever is in use
- Items, in order, each omitted unless its condition holds: `sortAscending` and `sortDescending` when `column.getCanSort()` (the active direction disabled, `toggleSorting(desc, true)`); `clearSort` while sorted; separator; `filter` when `column.getCanFilter()` (chips mode: `setFilterChips` adds the id, sets `openColumnId` to it and `openAnchor` to `'header'`; spec 04 renders the editor anchored to this header cell and returns focus to the chevron on close (D38); other modes: today's `setShowColumnFilters` path); `clearFilter` while the column has a value; the filter-mode submenu when `enableColumnFilterModes` (existing `DropdownMenuSub` form); separator; `pinToStart` unless pinned start, `pinToEnd` unless pinned end (`PushPinIcon` with `rotate-90`), `unpin` while pinned, all when `column.getCanPin()`; `resetColumnSize` while `columnSizing[id]` is set and differs from `columnDef.size`; Group by when `enableGrouping` (existing); separator; `fixedPosition` disabled with `LockIcon` when the column is locked (`enableColumnOrdering === false` on the column or table); `hideThisColumn` when `column.getCanHide()`; the Show all columns item goes; `renderColumnActionsMenuItems` appended as today
- Icons through `icons`: `ArrowUpwardIcon`, `ArrowDownwardIcon`, `CloseIcon`, `FilterListIcon`, `PushPinIcon`, `PushPinOffIcon`, `LockIcon`, `VisibilityOffIcon`; strings through `localization` (01)
- `ST_FilterOptionMenu`: `trigger` / `open` / `onOpenChange` beside `anchorEl`; the `isSubMenu` path unchanged
- Does NOT grey out anything but the active sort direction and Fixed position

**Interfaces:**

```typescript
export interface ST_ColumnActionMenuProps<TData extends ST_RowData> extends ComponentPropsWithRef<typeof DropdownMenuContent> {
  readonly anchorEl?: HTMLElement | null;
  readonly header: ST_Header<TData>;
  readonly onOpenChange?: (open: boolean) => void;
  readonly open?: boolean;
  readonly setAnchorEl?: (anchorEl: HTMLElement | null) => void;
  readonly trigger?: ReactElement;
}
```

**Stays unchanged:** `useST_MenuAnchor.ts`; `ST_ActionMenuItem`; the cell action menu.

#### 1.6.4 Resize handle

`ST_TableHeadCellResizeHandle.tsx` (D6).

- `absolute top-0 z-10 flex h-full w-2 cursor-col-resize touch-none select-none justify-center -inset-e-1` (`inset-e-0` on the last column); inner `span h-full w-px bg-transparent transition-colors group-hover/th:bg-foreground/15`, `bg-primary group-hover/th:bg-primary` while `column.getIsResizing()`; `onMouseDown` and `onTouchStart` call `preventDefault` before the TanStack handler so the draggable `th` never starts a column drag; double-click calls `column.resetSize()`
- The density offsets, the `display` variant and the `Separator` go
- Does NOT render a tooltip (D5 addendum) (F2)

#### 1.6.5 Drag source, grip and locked overlay

`ST_TableHeadCell.tsx`, `ST_TableHeadCellGrabHandle.tsx`, `ST_TableHeadCellLockedOverlay.tsx` (D20) (D21).

- `canDrag` (the demo's rule): table `enableColumnDragging !== false`, column `enableColumnDragging !== false`, and (`enableColumnDragging` or (`enableColumnOrdering` and column `enableColumnOrdering !== false`)); display columns opt out by default, the row actions column opts into ordering only (spec 02 sets its def)
- With `canDrag` the `th` gets `draggable`, `cursor-grab active:cursor-grabbing`, `onDragStart` (sets `draggingColumn`, `setDragImage(th, 0, 0)`), `onDragEnd` (reorder through `applyColumnReorder` unless `isColumnDragCancelled`, after `setColumnFlipPending` with the positions the flip hook recorded, then clears both atoms); `data-flip-column={column.id}`, `data-flip-pinned` when pinned; `onDragOver` from `getST_ColumnDropTargetProps`
- The grip (`ST_TableHeadCellGrabHandle`) renders only when `canDrag && showColumnDragHandle`; its handlers are the same functions as the `th`
- `ST_TableHeadCellLockedOverlay`: `pointer-events-none absolute inset-0 flex items-center justify-center gap-1 bg-[color-mix(in_srgb,var(--muted)_60%,var(--background))] text-xs font-normal text-muted-foreground transition-opacity duration-150` plus the stripes from `lockedHeaderClassName` (01), `LockIcon size-3` and `localization.fixed` (icon alone on display columns), `opacity-100` while `draggingColumn` is set, else `opacity-0`; rendered as the last child of a locked header cell
- `ST_ToolbarDropZone`: unchanged from 01 (`dropEffect = 'move'`)
- Does NOT render feedback on body cells (spec 02 renders the locked overlay and the flip attribute there)

#### 1.6.6 Flip and auto-scroll hooks

`useST_ColumnFlip.ts`, `useST_DragAutoScroll.ts`, mounted once in `ST_TableHead.tsx` with `table.refs.tableRef` and `tableContainerRef` (D20) (D37).

- `useST_ColumnFlip(table)`: per instance, refs and DOM only, no state. While `draggingColumn` is set: measures the unpinned header boxes once, listens to `dragover` on the table element, resolves the target slot from `clientX` against the layout boxes (not the slid cells), sets `hoveredColumn` and `dropEffect` (`'none'` over a locked or pinned-region column it cannot preview), computes each unpinned header's shift from the preview order (`reorderColumn` applied to the visible ids) and writes `style.translate` on the header cells through refs; sets `data-flip-sliding` on the table so the head cells' transition utilities apply (`[table[data-flip-sliding]_&]:transition-[translate] [table[data-flip-sliding]_&]:duration-200 [table[data-flip-sliding]_&]:ease-out [table[data-flip-sliding]_&]:will-change-[translate]` on `th`); the dragged header gets `opacity-50 relative z-1` and a `2px dashed var(--color-primary)` outline; on cancel the shifts clear with the transition still on, then the attribute drops after 200 ms
- On a `columnOrder` change with `columnFlipPending` set: takes and clears it; for `dragDrop` the headers already show the new order, so only body and footer cells slide: for every moved column, each cell with `data-flip-column` animates `translate` from the recorded position to 0 with `element.animate([{translate: 'Xpx'}, {translate: '0px'}], {duration: 200, easing: 'ease-out'})`; for a menu drop header and body slide together; then the moved column's cells animate a `box-shadow` inset `--primary` tint from 20 percent to none over 600 ms; `will-change` set inline only while an animation runs; an order change without a pending entry (hydration, stored view, Reset view) animates nothing
- Limits: no body slide when `enableRowVirtualization`, when header groups exist (`table.getHeaderGroups().length > 1`) or when more than 200 rows are rendered; no preview with column virtualization; `prefersReducedMotion` (matched once per drag) skips every slide and keeps the highlight and D20's dashed feedback (`ST_TableHeadCell` reads the same flag for its classes)
- `useST_DragAutoScroll(table)`: the demo's loop on the container: 64 px hot zones inside `--st-pin-start` / `--st-pin-end`, up to 20 px per frame, rAF while the pointer stays in a zone and a drag is active, re-sends a `dragover` with the pointer position to `elementFromPoint` each scrolled frame (the hook ignores its own synthetic events through `isTrusted`), stops on `dragend`, `drop` or pointer leaving the window; it scrolls and dispatches only, never writes styles
- Does NOT create a stylesheet, use `document.adoptedStyleSheets`, keep module-level state, or write styles from `requestAnimationFrame` (P8) (D37 addendum)

**Interfaces:**

```typescript
export const useST_ColumnFlip: <TData extends ST_RowData>(table: ST_TableInstance<TData>) => void;
export const useST_DragAutoScroll: <TData extends ST_RowData>(table: ST_TableInstance<TData>) => void;
```

**Stays unchanged:** `reorderColumn`; `stColumnDraggingFeature` atoms (01 shape); `ST_Table.tsx`, `ST_TableContainer.tsx`, `ST_TableBodyCell.tsx` (spec 02).

#### 1.6.7 Style utilities touched through spec 02

`style.utils.ts` is spec 02's file. This spec needs: no `opacity-50` on head cells from `getCommonSRTCellStyles` (the head cell applies its own drag classes). Spec 02 removes that rule for every cell kind (its 1.6.6); this spec adds nothing there.

#### 1.6.8 Stories and play tests

- `ColumnActions.stories.tsx` (existing, extended): four states (unsorted unfiltered unpinned, sorted and filtered, pinned start, locked) with plays asserting the exact item list per state, the disabled active direction, the disabled Fixed position, stacking (`sorting.length` 2 after two columns), the reset size item after a programmatic resize
- `ColumnDragging.stories.tsx`: the default story drags by the header (`fireEvent.dragStart` on the `th`, `dragOver` on the table with `clientX` inside the next slot, `dragEnd`); plays assert the preview translate on the target header and none on a body cell mid-drag, the reorder after drop, an animation on the moved column's cells (`getAnimations().length > 0` right after the drop), Escape (a `dragEnd` with `dropEffect: 'none'`) restoring the order, the locked overlay opacity during the drag; a `WithGrip` story keeps the grip play with `showColumnDragHandle`
- `Sorting`, `TableProvider`, `RenderCounts`: the "Sort by ... ascending" clicks open the chevron (`aria-label` columnActions) and click the `sortAscending` item; `MenuOpeners` and `MenuFocusReturn` are not edited here (spec 05 rewrites both; their column menu plays are red until then and the two files are excluded from this spec's `test:<base>` runs, noted in the tracker); `RTL`: the handle lookup follows the new class; `AriaTooltips`: the column actions tooltip expectation goes
- `DefaultLook` captures (spec 01's story, read-only here): header at rest, Status menu open, mid-drag of Assignee over Project, per base, light and dark, for the judges
- Does NOT edit the `Filtering`, `Pagination`, `Toolbar` stories (spec 05)

### 1.7 Dependencies and env: none new

## 2. Instructions for AI

### 2.1 Milestones

### Milestone: Header, column menu and dragging

- Files owned: `components/head/*.tsx` except components/head/ST_TableHeadCellFilterLabel.tsx (grab handle and filter container after F), `components/menus/{ST_ColumnActionMenu,ST_FilterOptionMenu,ST_ActionMenuItem}.tsx`, `hooks/useST_ColumnFlip.ts`, `hooks/useST_DragAutoScroll.ts`, `components/toolbar/ST_ToolbarDropZone.tsx` (after F), in the three bases; `stories/features/{ColumnActions,ColumnDragging,Sorting,ColumnResizing}.stories.tsx`, `stories/fixed-bugs/AriaTooltips.stories.tsx`
- Depends on: 01
- Review: fable
- Task 1: Header, menu and handle (Lane: agent): 1.6.2 to 1.6.4 in the radix tree, then base and aria (the trigger wiring differs per base and is listed in the diff files). Checks: per base `tsc`; `lint`; `check:tailwind`; `check:bases`
- Task 2: Drag, flip, locked (Lane: agent): 1.6.5 and 1.6.6; the three bases identical for the hooks. Checks: per base `tsc`; `check:bases`
- Task 3: Stories, captures, judges (Lane: agent): 1.6.8; captures into the session scratchpad, paths in `../trackers/03-tracker.md`; the Acceptance plays and the judges, loop on failures. Checks: `test:base`, `test:radix`, `test:aria`, each with `stories/fixed-bugs/MenuOpeners.stories.tsx` and `MenuFocusReturn.stories.tsx` excluded
- Task 4: Cleanup and checks once (Lane: agent): Remove dead imports (`SyncAltIcon` use in the sort label, the Separator in the handle, `MoreVertIcon` in the actions button); `pnpm format`; `pnpm registry:build`; `pnpm --filter shadcn-table-docs lib:install <base>` per base; `#### Spec 03` changelog block. Checks: 2.2

### 2.2 Checks

- Per base: `tsc`, `test:<base>` green with the two MenuOpeners and MenuFocusReturn files excluded; `storybook:build:<base>` green
- `lint`, `check:tailwind`, `check:bases`, `check:icons` green
- Judges: majority pass on the three header captures per base and theme against the named references
- `node reference/01-check.mjs` still exits 0
