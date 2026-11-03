# 02: frame and body

## 1. Architecture

### 1.1 Overview

The stock frame, rows, footer, tints, width rule, scroll cues, overflow text and reload behaviour change to the owner's header demo (D1) (D7) (D13) (D14) (D15) (D17) (D19) (D21) (D22) (D23) (D31) (D36) (D37). This spec owns the table, body and bottom toolbar files in all three bases: the toolbar moves above the frame, rows take fixed heights with rows-only lines, cells read the four tint tokens the root declares, the last data column grows, pinned edges cast the token shadow with hover chevrons for hidden columns, cut-off text gets a tooltip, and a persisted table reloads without painting the default order. Workstream A (index, Run plan): branch `v0.8/frame-body`, worktree `01`, cut from `claude/review` after spec 01 merged, one builder, draft PR at the first push (P2), one fable review on the whole diff (`Review: fable`). Default flips stay in spec 05; the header cell is spec 03's.

### 1.2 Goals

- The top toolbar renders above the bordered frame; the frame wraps the scroll container and the bottom toolbar with no inner padding; full screen keeps the frame inside a padded wrapper (D1)
- Body rows are 40, 48 and 56 px tall at compact, comfortable and spacious; horizontal hairlines between rows, none under the last; the `gridLines` setting draws column lines; hover tints the whole row evenly with no per-cell overlay (D7)
- The four tokens `--st-stripe`, `--st-hover`, `--st-selected`, `--st-edge-shadow` are declared as utilities on the table root with dark twins and read by body cells and pinned cells; no stylesheet, no global CSS (D23) (P8)
- The footer's top edge is a 1 px hairline, pages mode renders at D7 metrics, the empty row is 96 px, muted, not italic (D13) (D15)
- With `layoutMode: 'grid'` data columns grow in proportion, display and pinned columns keep their width, the table scrolls once the columns exceed the frame (D31)
- Pinned inner-edge cells cast the token shadow towards the scrolling content; a side with hidden columns shows a hover chevron that scrolls 80 percent of the unpinned width (D22)
- Plain text cells truncate on one line and show a tooltip only when cut off; `wrapText` shows them in full; display columns never (D17)
- The actions column is 48 px with a visually hidden header label and `grow: false`; locked body cells show the striped overlay only while a drag is active; body cells carry `data-flip-column` (D14) (D21) (D37)
- Sticky by choice caps at `var(--st-sticky-max-height, 70vh)`; sticky forced by row virtualization keeps today's clamp (D19)
- With `persistViewSettings` on under server rendering, the root carries `data-st-view-pending` before first paint when a stored view differs from the defaults, body cells show a CSS skeleton until hydration applies the stored view, and nothing is emitted when persistence is off (D36)
- Acceptance: programmatic, the play tests of 1.6.9 pass in `test:base`, `test:radix`, `test:aria` (row heights measured 40, 48, 56 and header 40; no `::after` hover overlay; the scroll chevron appears only with hidden columns and scrolls by 80 percent of the unpinned width; the tooltip opens for a truncated cell and not for a short one; the pending attribute is present with a seeded stored view and absent without; the sticky container height equals `70vh` by choice and today's clamp under virtualization); judged, captures of the `DefaultLook` story per base in light and dark against `reference/01-default-light.png` and `reference/01-default-dark.png` (D34), three judges on "toolbar above the frame, no inner padding, rows-only hairlines, row height and padding, pages footer with a hairline, stripes off, hover one even tint, same column proportions" (P6)

### 1.3 Current structure

```
packages/shadcn-table/registry/<base>/components/ui/shadcn-table/
├── components/table/ST_TableLayout.tsx        ← root carries the frame classes and p-2 (14-15); toolbar inside the frame (78-84)
├── components/table/ST_TableContainer.tsx     ← sticky maxHeight var fallback (01); toolbar height measure 77-100; no overflow tracking
├── components/table/ST_Table.tsx              ← grid variants 20-28; no min-width in grid mode
├── components/body/ST_TableBody.tsx           ← empty row italic py-8 (206); sticky check 144-147
├── components/body/ST_TableBodyRow.tsx        ← [&>td]:after overlay, dimmed and animated variants (31-49); defaultRowHeight 37/53/69 (191-192); after:bg-foreground/10 hover (206-216)
├── components/body/ST_TableBodyCell.tsx       ← border-b and hover:text-clip (37-39); selector subscribes isHoveredColumn (163-186); drag dashed borders (206-239); density p-2/p-4/p-6 (288-302)
├── components/toolbar/ST_BottomToolbar.tsx    ← inset shadow, min-h-14, fullscreen fixed bottom-0 (19-29)
├── shared/utils/style.utils.ts                ← getCommonPinnedCellStyles ::before layer and foreground shadow (14-32); grid flex 65-72; opacity-50 on drag 94-113; helpers from 01 unused
├── shared/utils/displayColumn.utils.ts        ← defaultDisplayColumnProps without grow (13-33)
├── hooks/display-columns/getST_RowActionsColumnDef.tsx ← size 70, visible header (13-27)
├── hooks/display-columns/getST_RowExpandColumnDef.tsx  ← no grow false (76-80)
├── hooks/useST_FullScreenContainer.ts         ← fullScreenClassName strips the frame (8-9)
└── hooks/useST_RowVirtualizer.ts              ← normalRowHeight 37/58/73 (61-62)
packages/shadcn-table/stories/                 ← RTL.stories asserts the old boxShadow (42-56); RenderCounts and TableProvider assert 'p-2'; RowPinning offsets; Virtualization estimates; StickyHeader maxHeight
```

### 1.4 Target structure

```
packages/shadcn-table/registry/<base>/components/ui/shadcn-table/
├── components/table/ST_TableLayout.tsx        ← root: tokens, data-st-view-pending, aria-busy; top toolbar; frame div (rounded-md border bg-background shadow, no padding) around container and bottom toolbar
├── components/table/ST_ViewPendingScript.tsx  ← new: the inline script, text/plain on the client
├── components/table/ST_TableContainer.tsx     ← scroll wrapper group/st-scroll with data-overflow-*, --st-pin-start/end; sticky rule; ST_ScrollButtons
├── components/table/ST_ScrollButtons.tsx      ← new: hover chevrons
├── components/table/ST_Table.tsx              ← grid mode min-width total size
├── components/body/ST_TableBody.tsx           ← TooltipProvider (radix, base); pending skeleton rules on tbody; empty row h-24
├── components/body/ST_TableBodyRow.tsx        ← group/row, no overlay, heights 40/48/56
├── components/body/ST_TableBodyCell.tsx       ← tokens, grid lines, density heights and padding, truncate or wrap, ST_OverflowText, locked overlay, data-flip-column, drop-target helper
├── components/body/ST_OverflowText.tsx        ← new, exported
├── components/toolbar/ST_BottomToolbar.tsx    ← border-t, no fixed variant
├── shared/utils/style.utils.ts                ← pinned cells: token backgrounds, edge shadow helper applied; grid: pinned flex-grow 0; no opacity-50 on body cells
├── shared/utils/displayColumn.utils.ts        ← grow: false default for display columns
├── hooks/display-columns/getST_RowActionsColumnDef.tsx ← size 48, sr-only header
├── hooks/useST_FullScreenContainer.ts         ← padded wrapper, frame kept
├── hooks/useST_HorizontalOverflow.ts          ← new
├── hooks/useST_RowVirtualizer.ts              ← 40/48/56
└── index.ts                                   ← ST_OverflowText, ST_ScrollButtons, useST_HorizontalOverflow
packages/shadcn-table/stories/styling/DefaultLook.stories.tsx ← new: the demo's column set, 50 rows, the v0.8 options set explicitly; captures for the judges; play tests of 1.6.9
packages/shadcn-table/scripts/registry/base-diff.json, aria-diff.json ← ST_OverflowText.tsx, ST_TableBody.tsx (aria)
```

### 1.5 Flow: none

### 1.6 Components

#### 1.6.1 Data artifacts

- `CHANGELOG.md` `#### Spec 02` under `### Added` (D32): toolbar above the frame, row metrics and grid lines, tint tokens, grow width rule, scroll cues, overflow tooltip, pending-view script, with the option that restores each (`stTableLayoutProps`, `layoutMode`, `enableScrollButtons: false`, `enableCellOverflowTooltip: false`, `persistViewSettings`)
- `registry.json` regenerated; `base-diff.json` gains `components/body/ST_OverflowText.tsx`; `aria-diff.json` gains `ST_OverflowText.tsx` and `ST_TableBody.tsx`

#### 1.6.2 Layout, frame and tokens

`ST_TableLayout.tsx`, `useST_FullScreenContainer.ts` (D1) (D23) (D36).

- Root `div`: `flex flex-col gap-2` plus the token declarations as utilities, light then dark: `[--st-stripe:color-mix(in_srgb,var(--muted)_70%,var(--background))] dark:[--st-stripe:color-mix(in_srgb,var(--muted)_25%,var(--background))]`, `--st-hover` from `--border` 50 percent light and `--muted` 55 percent dark, `--st-selected` from `--primary` 20 percent, `--st-edge-shadow` `oklch(from_var(--background)_calc(l_-_0.08)_c_h)` with `supports-[not(color:oklch(from_red_l_c_h))]:[--st-edge-shadow:var(--border)]`; `check:tailwind` decides the canonical spelling, the builder keeps whatever it accepts
- Order: `ST_TopToolbar`, then the frame `div` (`rounded-md border bg-background shadow overflow-hidden flex min-h-0 flex-col`) holding `ST_TableContainer` and `ST_BottomToolbar`
- Full screen: `fullScreenClassName` becomes `fixed inset-0 z-50 flex flex-col bg-background p-4`; the frame gets `flex-1 min-h-0`, the container `flex-1 min-h-0 overflow-auto`
- `data-st-view-pending` is set by the script (1.6.8) and removed by the layout once the stored view is applied; while set, `aria-busy`
- Does NOT keep `p-2`, border, radius or shadow on the root; `stTableLayoutProps.className` still wins for a consumer who wants the old box

**Stays unchanged:** `ST_TopToolbar` (spec 04); slot className props.

#### 1.6.3 Container, sticky rule, overflow and scroll buttons

`ST_TableContainer.tsx`, `useST_HorizontalOverflow.ts`, `ST_ScrollButtons.tsx` (D19) (D22).

- Sticky case: `enableStickyHeader || viewSettings.stickyHeader` (slice from 01) and not `enableRowVirtualization`: `maxHeight: var(--st-sticky-max-height, 70vh)`; `enableRowVirtualization`: `var(--st-sticky-max-height, clamp(350px, calc(100vh - var(--st-toolbar-height, 0px)), 9999px))`; full screen: `flex-1 min-h-0`, no maxHeight
- A wrapper `div.group/st-scroll relative flex min-h-0 flex-col` around the scroll box; `useST_HorizontalOverflow(wrapperRef, scrollRef)` writes `data-overflow-start`, `data-overflow-end`, `--st-scrollbar-y` and `--st-pin-start` / `--st-pin-end` (pinned widths from `table.getLeftTotalSize()` and `getRightTotalSize()`) on the wrapper, with a passive scroll listener and one ResizeObserver on the box and its first child, rAF-batched, RTL-aware (`scrollLeft` sign); no React state
- `ST_ScrollButtons`: two `Button size="icon-xs" variant="ghost"` with `ChevronLeftIcon` / `ChevronRightIcon`, `aria-label` `localization.scrollLeft` / `scrollRight`, absolutely placed `top-5 -translate-y-1/2 z-5 bg-background text-muted-foreground` at `inset-s-[calc(var(--st-pin-start)+--spacing(1))]` and `inset-e-[calc(var(--st-pin-end)+var(--st-scrollbar-y)+--spacing(1))]`; `invisible opacity-0 pointer-events-none` with `tabIndex={-1}` unless the wrapper is hovered (`group-hover/st-scroll:`) and the matching overflow attribute is set (`group-data-[overflow-start]/st-scroll:`); click scrolls `0.8 * (clientWidth - pinStart - pinEnd)` with `behavior: 'smooth'`; rendered only when `enableScrollButtons !== false`
- Does NOT change the scrollbar rules (28-30) or the toolbar height measure

**Interfaces:**

```typescript
export const useST_HorizontalOverflow: (wrapperRef: RefObject<HTMLElement | null>, scrollRef: RefObject<HTMLElement | null>, table: ST_TableInstance<any>) => void;
export const ST_ScrollButtons: <TData extends ST_RowData>(props: { table: ST_TableInstance<TData> }) => ReactNode;
```

#### 1.6.4 Body rows and cells

`ST_TableBody.tsx`, `ST_TableBodyRow.tsx`, `ST_TableBodyCell.tsx`, `useST_RowVirtualizer.ts` (D7) (D15) (D21) (D23) (D37).

- Row: `group/row` when `hover` is true; the `[&>td]:after` overlay, the `dimmed` opacity and the `animated` transition variants go; `defaultRowHeight` 40, 48, 56; the pinned-row tint `bg-primary/10` stays as the one non-token tint (pinned rows are a selection-like state); sticky checks read `enableStickyHeader || viewSettings.stickyHeader`
- Cell classes: `h-10 px-2`, `h-12 px-3`, `h-14 px-4` by density, display columns `px-0`; `content-center overflow-hidden`; `truncate` by default, `whitespace-normal break-words py-1` with `viewSettings.wrapText`; `gridLineClassName(viewSettings.gridLines, isLastColumn)` from 01 plus `group-last/row:border-b-0`; backgrounds `bg-background`, `odd:bg-(--st-stripe)` on the row's odd index when `viewSettings.striped`, `group-hover/row:bg-(--st-hover)`, `group-data-[selected=true]/row:bg-(--st-selected)` (the row marker is `data-selected`); pinned cells use the same tokens through `getCommonPinnedCellStyles`
- Selector: adds `gridLines`, `wrapText`, `striped`, and `dragActive` (true while `draggingColumn` is set, only for columns with `enableColumnOrdering: false`); drops `isHoveredColumn` and `isDraggingColumn` for column drags so a hover move never re-renders body cells; row-drag highlighting keeps its own classes
- Drag: `data-flip-column={column.id}` on every `td`; `getST_ColumnDropTargetProps(column)` from 01 replaces the local handlers; the column-drag dashed borders on body cells go; `lockedCellClassName(dragActive)` from 01 on locked columns
- Empty row: `h-24 text-center text-muted-foreground` and the existing texts; `renderEmptyRowsFallback` unchanged
- `ST_TableBody` wraps rows in one `TooltipProvider delayDuration={500}` on radix and base; aria has no provider and `ST_OverflowText` opens its tooltip standalone there (aria-diff)
- `useST_RowVirtualizer` `normalRowHeight` 40, 48, 56
- Does NOT change the head cell (spec 03) or the selection checkbox cell geometry

**Operations:**

| Operation | Status | Notes |
| --- | --- | --- |
| `tableBodyRowVariants` | refactor | overlay, dimmed, animated removed; `group/row` |
| `bodyCellVariants` | refactor | tokens, density heights, truncate |
| body cell selector | refactor | slice reads, no hover-column subscription |
| empty row | refactor | h-24, no italic |

**Stays unchanged:** `hover` prop; row drag feedback; `renderEmptyRowsFallback`; the texts.

#### 1.6.5 Overflow text

`ST_OverflowText.tsx`, exported (D17).

- `span.block min-w-0 truncate` around the value; on pointer enter it measures `scrollWidth > clientWidth` and opens the tooltip only then (controlled `open`); with `viewSettings.wrapText` it renders the plain span, no tooltip; `tooltip` prop `'value' | ReactNode`
- `ST_TableBodyCell` wraps `cellValue` (and the copy-button child) when `enableCellOverflowTooltip !== false` and `columnDef.overflowTooltip !== false`; `'value'` or undefined shows the string value, a function its result; display columns never
- Per base: radix `TooltipTrigger asChild`, base `render`, aria standalone `ST_Tooltip` mode with `placement`; listed in the diff files
- Does NOT add a `TooltipProvider` per cell; does NOT render while the pending skeleton is shown

**Interfaces:**

```typescript
export interface ST_OverflowTextProps { readonly children: ReactNode; readonly className?: string; readonly tooltip?: 'value' | ReactNode; readonly wrap?: boolean; }
```

#### 1.6.6 Pinned cells, width rule and display columns

`style.utils.ts`, `ST_Table.tsx`, `displayColumn.utils.ts`, `getST_RowActionsColumnDef.tsx` (D14) (D22) (D23) (D31).

- `getCommonPinnedCellStyles`: the `::before` background layer and the foreground box-shadow go; pinned cells get the same token backgrounds as unpinned ones (opaque mixes, D23) plus `pinnedEdgeShadowClassName(column)` from 01 on the inner-edge cell; `sticky` and offsets unchanged
- `getCommonSRTCellStyles`: a pinned column in grid mode gets `flex: 0 0 auto` (D31); the `opacity-50` on dragged and hovered columns no longer applies to body cells (head cells keep their own feedback in spec 03)
- `ST_Table.tsx`: grid mode sets `minWidth: table.getTotalSize()` on the table so columns keep exact widths once they exceed the frame
- `defaultDisplayColumnProps` sets `grow: false` before the `displayColumnDefOptions` spread; `getST_RowActionsColumnDef` size 48, `Header` renders `localization.actions` in an `sr-only` span, `enableColumnOrdering: true` (the column moves through the columns menu, D14)
- `showRowNumbersColumn` in `displayColumn.utils.ts` reads `enableRowNumbers || viewSettings.rowNumbers`, so the view settings switch (spec 04) adds and removes the `#` column pinned start (D11)
- Does NOT flip `layoutMode`, `positionActionsColumn` or default pinning (spec 05)

**Stays unchanged:** `reorderColumn`; the row spacer column (grid-no-grow only).

#### 1.6.7 Footer

`ST_BottomToolbar.tsx` (D13).

- `border-t` replaces the inset shadow; `min-h-12`; the fullscreen `fixed bottom-0` variant goes (the frame holds it)
- Does NOT change `ST_TablePagination` (pages mode exists; its default flips in spec 05)

#### 1.6.8 Pending-view script

`ST_ViewPendingScript.tsx`, rendered by `ST_TableLayout` as the root's first child only when `getViewSettingsKey(...)` returns a key (D36).

- `<script type={typeof window === 'undefined' ? 'text/javascript' : 'text/plain'} suppressHydrationWarning nonce={nonce} dangerouslySetInnerHTML>` with the fixed string: read `localStorage.getItem(<key>)`, and when it is non-null and differs from the defaults JSON, `document.currentScript.parentElement.setAttribute('data-st-view-pending', '')`; whole body in `try {} catch {}`; the key and the defaults JSON pass through `escapeForScript` from 01
- `ST_TableBody` tbody carries `group-data-[st-view-pending]/st:[&_td>*]:invisible` and `group-data-[st-view-pending]/st:[&_td]:before:...` drawing a `bg-muted h-4 w-3/5 rounded` bar; the root carries `group/st`
- The attribute is removed by spec 04's persistence hook in the commit that applies the stored view; this spec only renders the script and the pending styles
- Does NOT render when `persistViewSettings` is off (the default); does NOT render a second DOM tree

#### 1.6.9 Stories and play tests

`stories/styling/DefaultLook.stories.tsx` (new), updates to the stories the changed classes break.

- `DefaultLook`: the demo's columns (Name, Status, Project, Assignee, Due, Estimate, Priority, Tags, Reporter) with `columnDef.icon`, 50 rows, `enableRowActions`, the v0.8 options set explicitly (`layoutMode: 'grid'`, `enableColumnPinning`, `enableColumnResizing`, `enableColumnOrdering`, `paginationDisplayMode: 'pages'`, `positionActionsColumn: 'last'`, `initialState.columnPinning.right: ['st-row-actions']`); the capture source for the judges; plays: measure the first body row and the header heights at each density, assert no `::after` background on hover, scroll cue visibility and scroll delta, tooltip open on the truncated Name cell and closed on a short Project cell, the pending attribute with a seeded `localStorage` entry (`persistViewSettings: true`) and its absence without one, the sticky container height
- `RTL.stories.tsx`: the boxShadow assertion becomes a `filter` drop-shadow assertion on the inner-edge cell; `RenderCounts.stories.tsx` and `TableProvider.stories.tsx`: `'p-2'` assertions become `h-10 px-2`; `RowPinning`, `Virtualization`, `StickyHeader` offsets and heights follow the new metrics
- Does NOT touch stories spec 05 rewrites for the default flips (`Pagination`, `Filtering`, `Toolbar`, `ColumnDragging`)

### 1.7 Dependencies and env: none new

## 2. Instructions for AI

### 2.1 Milestones

#### 2.1.1 Milestone 1: One pass over 1.6.2 to 1.6.8

Lane: agent

- Radix tree first, then base and aria byte-identical except the diff-listed files; `ST_OverflowText` and `ST_TableBody` per base as 1.6.5 says
- `check:tailwind` after every class batch; physical utilities (`left-`, `right-`, `border-r`) are logical (`inset-s-`, `inset-e-`, `border-e`)
- Gates: per base `tsc`; `lint`; `check:tailwind`; `check:bases`

#### 2.1.2 Milestone 2: Stories, captures, judges

Lane: agent

- 1.6.9; captures of `DefaultLook` per base, light and dark, 1800 by 1150, into the session scratchpad; paths in `../trackers/02-tracker.md`
- Run the Acceptance plays and the judges; loop on failures
- Gates: `test:base`, `test:radix`, `test:aria`

#### 2.1.3 Final milestone: Cleanup and gates once

Lane: agent

- Delete the removed variants' dead imports; `pnpm format`; `pnpm registry:build`; `lib:install` per base; `#### Spec 02` changelog block
- Gates: 2.2

### 2.2 Gates

- Per base: `tsc`, `test:<base>` green; `storybook:build:<base>` green
- `lint`, `check:tailwind`, `check:bases`, `check:icons` green
- Judges: majority pass on the `DefaultLook` captures per base and theme against `reference/01-default-*.png`
- `node reference/01-check.mjs` still exits 0
