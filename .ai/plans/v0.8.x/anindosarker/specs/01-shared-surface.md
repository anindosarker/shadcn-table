# 01: shared surface

## 1. Architecture

### 1.1 Overview

Every v0.8 workstream needs the same new types, options, icon keys, strings, state slices and drag helpers, and three of them would otherwise edit `types.ts`, `stConfigFeature.ts`, `icons.ts` and `en.ts` at once. This spec lands that surface first, in all three bases, with no default flip and no rendered change, so specs 02, 03 and 04 build on it in parallel (D3) (D9) (D11) (D17) (D18) (D20) (D21) (D24) (D35) (D36) (D37). It is the cycle's foundation (index, Run plan): branch `v0.8/shared-surface` from `claude/review`, worktree `01`, one builder, draft PR at the first push (P2), merged before any other workstream starts. It also captures the demo reference for the judged specs (D34) and opens the changelog section (D32).

### 1.2 Goals

- `types.ts`, `stConfigFeature.ts`, `stFeatures.ts`, `icons.ts`, the four icon-set maps and `en.ts` carry every v0.8 key, option and slice; `tsc` is green per base with no new `any`
- No stock table renders differently: `test:<base>` and the Storybook builds pass unchanged, except the one play test the cancel rule corrects (D20)
- The drag cancel rule is in (Escape or an outside drop reorders nothing) in the grab handle and the columns menu, with the grouping drop zone still working (D20)
- lucide-react is at a version that ships every D18 glyph; the Tabler, Phosphor, Hugeicons and Remix maps name a glyph or a documented substitute for every new key; `check:icons` is green (D18)
- The three bases stay byte-identical outside the diff-listed files; `check:bases` is green
- The fourteen demo reference captures exist under `reference/` with the demo commit hash (D34); `CHANGELOG.md` has `## Unreleased` with one `#### Spec NN` block per spec (D32)
- Acceptance: per base `tsc`, `lint`, `check:tailwind`, `check:icons`, `check:bases` exit 0; `test:base`, `test:radix`, `test:aria` exit 0; `node -e` over `reference/01-surface.json` (the key, option and string lists this spec commits) finds every listed `ST_IconKey` member in `types.ts`, every listed key in `shared/locales/en.ts` and every listed option in `stConfigFeature.ts`, in each base; `ls reference/01-*.png` lists the fourteen captures and `reference/01-demo-commit.txt` holds a 40-character hash (P6)

### 1.3 Current structure

```
packages/shadcn-table/registry/<base>/components/ui/shadcn-table/
├── types.ts                               ← ST_IconKey 152-187, ST_DensityState 214, ST_Localization 273-368 (92 required keys), ST_DefinedTableOptions 440-446 (aria shifted: 163, 225, 284, 451)
├── features/stConfigFeature.ts            ← columnFilterDisplayMode 76, enableCellActions 95, enableTopToolbar 124, onCreatingRowCancel 357, paginationDisplayMode 380, selectAllMode 482, Header 582-588, PlaceholderCell 683
├── features/stFeatures.ts                 ← tableFeatures({...}) 17-27, 46-56
├── features/stRefsFeature.ts              ← tableContainerRef, tableHeadRef, tableHeadCellRefs; no table ref
├── features/stColumnDraggingFeature.ts    ← draggingColumn, hoveredColumn atoms
├── hooks/useST_TableOptions.ts            ← id replaced by useId() at 99-100; localization merge 104-110; no new options
├── shared/locales/en.ts                   ← ST_Localization_EN, 92 keys, `{column}` interpolation
├── icons.ts, icons/{tabler,phosphor,hugeicons,remixicon}.ts ← ST_Default_Icons; existing keys cover ChevronDown, ArrowDown, ListFilter, Pin, EyeOff, X, GripVertical, Columns3, ChevronLeft/Right, Rows4/3/2, RotateCcw, MoreHorizontal, Search, SearchOff
├── shared/utils/column.utils.ts           ← reorderColumn 102-117; the same reorder-and-repin code at ST_TableHeadCellGrabHandle 71-81 and ST_ShowHideColumnsMenuItems 84-92
├── shared/utils/style.utils.ts            ← getCommonPinnedCellStyles 14-33 (foreground shadow), getCommonSRTCellStyles (aria +33 lines)
├── components/head/ST_TableHeadCellGrabHandle.tsx ← dragend reorders on any hoveredColumn, Escape included (63-87)
├── components/menus/ST_ShowHideColumnsMenuItems.tsx ← the same at 80-94 (aria 68-83)
├── components/toolbar/ST_ToolbarDropZone.tsx ← grouping drop, dragover preventDefault, no dropEffect (37-44)
└── components/table/ST_TableContainer.tsx ← sticky maxHeight clamp 144-148
packages/shadcn-table/package.json         ← lucide-react ^0.544.0 (42): GapVertical and SquareCenterlineDashedVertical missing
packages/shadcn-table/scripts/check-icons.mjs ← diffs every map's keys against icons.ts (18-34)
packages/shadcn-table/scripts/registry/lib.mjs ← icons/ files are icon-set maps (63-64); the core item carries no lucide (123-127)
CHANGELOG.md                               ← top heading `## 0.7.4` at 10, no `## Unreleased`
```

### 1.4 Target structure

```
packages/shadcn-table/registry/<base>/components/ui/shadcn-table/
├── types.ts                               ← new ST_IconKey members; ST_GridLinesState, ST_ViewSettingsItemId, ST_ViewSettingsState, ST_FilterChipsState, ST_ColumnFlipPending; optional ST_Localization keys; ST_DefinedTableOptions.localization: Required<ST_Localization>
├── features/stConfigFeature.ts            ← columnDef.icon, columnDef.overflowTooltip; 'chips' in columnFilterDisplayMode; enableCellOverflowTooltip, enableViewSettings, enableSortPopover, enableScrollButtons, persistViewSettings, nonce, showClearSearchButton, showColumnDragHandle
├── features/stViewSettingsFeature.ts      ← new: viewSettings slice
├── features/stFilterChipsFeature.ts       ← new: filterChips slice
├── features/stColumnDraggingFeature.ts    ← columnFlipPending atom and setter (D37 hand-over between the columns menu and the flip hook)
├── features/stRefsFeature.ts              ← tableRef
├── features/stFeatures.ts                 ← the two new features registered
├── hooks/useST_TableOptions.ts            ← raw `id` kept as `viewSettingsKey` input before useId; new options destructured with no default (pass-through)
├── shared/utils/viewSettingsStorage.utils.ts ← new: key, read, write, remove, subscribe and getSnapshot for useSyncExternalStore
├── shared/utils/drag.utils.ts             ← new: drop-target props, cancel rule, flip attribute constants, locked-cell class
├── shared/utils/column.utils.ts           ← applyColumnReorder(column, target, table) beside reorderColumn
├── shared/utils/style.utils.ts            ← ST_TINT_VARS names, pinnedEdgeShadowClassName, gridLineClassName (unused until 02 and 03)
├── components/icons/ST_GridLineIcons.tsx  ← new: GridLinesAll, GridLinesRows, GridLinesColumns as plain SVG, no lucide import
├── icons.ts, icons/*.ts                   ← every new key mapped
├── shared/locales/en.ts                   ← every new string, typed Required<ST_Localization>
├── components/head/ST_TableHeadCellGrabHandle.tsx, components/menus/ST_ShowHideColumnsMenuItems.tsx ← reorder through applyColumnReorder, cancel rule
├── components/toolbar/ST_ToolbarDropZone.tsx ← dragover sets dropEffect 'move'
├── components/table/ST_TableContainer.tsx ← sticky maxHeight reads var(--st-sticky-max-height, <today's clamp>)
└── index.ts                               ← exports for drag.utils, viewSettingsStorage.utils, ST_GridLineIcons
packages/shadcn-table/package.json, pnpm-lock.yaml ← lucide-react ^1.64.0
.ai/plans/v0.8.x/anindosarker/reference/   ← 01-default-{light,dark}.png, 01-column-menu-*.png, 01-sort-editor-*.png, 01-chips-*.png, 01-view-settings-*.png, 01-drag-*.png, 01-scroll-cues-*.png (light and dark each), 01-demo-commit.txt, 01-surface.json
CHANGELOG.md                               ← `## Unreleased` with `#### Spec 01` to `#### Spec 06` under `### Added` / `### Changed` / `### Docs`
```

### 1.5 Flow: none

### 1.6 Components

#### 1.6.1 Data artifacts

- `packages/shadcn-table/package.json` and `pnpm-lock.yaml`: `lucide-react` to `^1.64.0` (the demo's), one non-frozen `pnpm install`; every existing Lucide alias used in `icons.ts` verified by `tsc` after the bump (P5: the cycle's one dependency change)
- `CHANGELOG.md`: `## Unreleased` above `## 0.7.4` with `### Added`, `### Changed`, `### Docs`; under `### Added` one `#### Spec 01` block listing each new option, column option, icon key, localization key and slice; empty `#### Spec 02` to `#### Spec 06` blocks under the section each spec names (02, 03, 04 Added; 05 Changed; 06 Docs), filled by their workstreams only (D32)
- `reference/01-demo-commit.txt`: the `test-projects/next-app` HEAD hash at capture time; `reference/01-*.png`: twelve captures per 1.6.8; `reference/01-surface.json`: the lists the Acceptance script reads (`iconKeys`, `localizationKeys`, `options`, `columnOptions`)
- `packages/shadcn-table/registry.json`: regenerated with `pnpm registry:build` (new files per base)
- `packages/shadcn-table/scripts/registry/base-diff.json`, `aria-diff.json`: unchanged unless a per-base copy of a touched file must differ (none expected: every touched file is byte-identical today except the ones already listed, `ST_ShowHideColumnsMenuItems.tsx`, `style.utils.ts`, `ST_ColumnActionMenu.tsx` and `ST_FilterOptionMenu.tsx` in both files and `types.ts` in aria)

#### 1.6.2 Options and column options

Type additions in `stConfigFeature.ts`, pass-through in `useST_TableOptions.ts` (no defaults; spec 05 flips them).

- Adds `enableViewSettings?: boolean` (D11), `enableSortPopover?: boolean` (D10), `enableScrollButtons?: boolean` (D22), `enableCellOverflowTooltip?: boolean` (D17), `persistViewSettings?: boolean | string` (D36), `nonce?: string` (D36), `showClearSearchButton?: boolean` (D35), `showColumnDragHandle?: boolean` (D20), `showSortIndex?: boolean` (D10 addendum); `'chips'` joins the `columnFilterDisplayMode` union (D9)
- Adds `columnDef.icon?: ComponentType<ST_IconProps> | ReactNode` after `Header` (D3) and `columnDef.overflowTooltip?: false | 'value' | ((props: { cell; column; row; table }) => ReactNode)` before `PlaceholderCell` (D17)
- `useST_TableOptions.ts`: the raw `id` prop is read into `viewSettingsKeyInput` before line 99 replaces a missing id with `useId()`; `persistViewSettings` and `nonce` pass through; every other new option passes through `...rest`
- Does NOT set a default for any new option; does NOT flip `enableColumnOrdering`, `enableColumnPinning`, `enableColumnResizing`, `layoutMode`, `paginationDisplayMode`, `positionActionsColumn` (spec 05)

**Operations:**

| Operation | Status | Notes |
| --- | --- | --- |
| `ST_TableOptions_Config` additions | refactor | eight options, `'chips'` |
| `ST_ColumnDef_Config.icon`, `.overflowTooltip` | refactor | `ComponentType`, `ST_IconProps` imported |
| `useST_TableOptions` raw id capture | refactor | `viewSettingsKeyInput: string | undefined` on the defined options |

**Interfaces:**

```typescript
// stConfigFeature.ts, ST_TableOptions_Config
columnFilterDisplayMode?: 'chips' | 'custom' | 'popover' | 'subheader';
enableCellOverflowTooltip?: boolean;
enableScrollButtons?: boolean;
enableSortPopover?: boolean;
enableViewSettings?: boolean;
nonce?: string;
persistViewSettings?: boolean | string;
showClearSearchButton?: boolean;
showColumnDragHandle?: boolean;
showSortIndex?: boolean;
// ST_ColumnDef_Config
icon?: ComponentType<ST_IconProps> | ReactNode;
overflowTooltip?: false | 'value' | ((props: { cell: ST_Cell<TData, TValue>; column: ST_Column<TData, TValue>; row: ST_Row<TData>; table: ST_TableInstance<TData> }) => ReactNode);
```

**Stays unchanged:** every existing option and default; `ColumnDef_FeatureMap` carries the two column options onto `ST_ColumnDef` with no `types.ts` edit.

#### 1.6.3 State slices

Two new TanStack features on the `stDensityFeature` pattern, one atom in an existing feature, one ref.

- `stViewSettingsFeature.ts`: state `viewSettings: ST_ViewSettingsState`, option `onViewSettingsChange`, API `setViewSettings(updater)`, `resetViewSettings()`; defaults `{ wrapText: false, gridLines: 'rows', stickyHeader: <enableStickyHeader option>, striped: false, rowNumbers: <enableRowNumbers option>, pins: ['columns', 'density'] }` (D7) (D11); the slice is the source of truth for sticky and row numbers from spec 02 on, so `useST_TableInstance.ts` adds `viewSettings` to `ST_TRANSFORM_SLICES` and `transformStateDefaults` here
- `stFilterChipsFeature.ts`: state `filterChips: ST_FilterChipsState` `{ columnIds: string[]; openColumnId: string | null }`, option `onFilterChipsChange`, API `setFilterChips(updater)` (D9)
- `stColumnDraggingFeature.ts`: atom `columnFlipPending: ST_ColumnFlipPending | null` with `setColumnFlipPending`; a reorder source (drop, columns menu drop) sets it right before `setColumnOrder`, the flip hook (spec 03) takes and clears it (D37)
- `stRefsFeature.ts`: `tableRef: RefObject<HTMLTableElement | null>`; `ST_Table.tsx` attaches it (one line, this spec)
- Does NOT read the slices anywhere in this spec; nothing renders differently

**Interfaces:**

```typescript
// types.ts
export type ST_GridLinesState = 'all' | 'columns' | 'none' | 'rows';
export type ST_ViewSettingsItemId = 'columns' | 'density' | 'gridLines' | 'rowNumbers' | 'stickyHeader' | 'striped' | 'wrapText';
export interface ST_ViewSettingsState {
  readonly gridLines: ST_GridLinesState;
  readonly pins: readonly ST_ViewSettingsItemId[];
  readonly rowNumbers: boolean;
  readonly stickyHeader: boolean;
  readonly striped: boolean;
  readonly wrapText: boolean;
}
export interface ST_FilterChipsState {
  readonly columnIds: readonly string[];
  readonly openColumnId: string | null;
}
export interface ST_ColumnFlipPending {
  readonly dragDrop: boolean;           // headers already sit in the preview order
  readonly movedId: string;             // the column to highlight
  readonly positions: ReadonlyMap<string, number>; // shown left per column before the commit
}
```

**Stays unchanged:** `stDensityFeature.ts` (density stays its own slice; the view settings Density row reads it).

#### 1.6.4 Persistence adapter

`shared/utils/viewSettingsStorage.utils.ts` (D36). Pure functions and a `useSyncExternalStore` pair; nothing calls it until spec 02 (pending script) and spec 04 (reset, writes).

- `getViewSettingsKey({ idInput, persistViewSettings, leafColumnIds })`: `null` when `persistViewSettings` is `false` or `undefined`; the string when a string; else `shadcn-table:<id or hash>:view` where the hash is a short stable digest (djb2, base36) of the leaf column ids joined in definition order
- `readStoredView(key)`, `writeStoredView(key, view)`, `removeStoredView(key)`: `localStorage` behind `try/catch`; a stored view whose `columnOrder` or `columnVisibility` names an id the table lacks is dropped as a whole and one development-only `console.info` says the view was reset (D36)
- `subscribeStoredView(key, cb)` / `getStoredViewSnapshot(key)` / `getServerSnapshot()` (always `null`): the server snapshot is `null` so server HTML and hydration render the defaults
- `escapeForScript(text)`: every `<` becomes the six characters backslash, `u`, `0`, `0`, `3`, `c` (the JSON unicode escape), for the inline script spec 02 builds
- Does NOT touch cookies; does NOT persist sorting or column filters

**Interfaces:**

```typescript
export interface ST_StoredView {
  readonly columnOrder?: readonly string[];
  readonly columnPinning?: { left?: readonly string[]; right?: readonly string[] };
  readonly columnVisibility?: Readonly<Record<string, boolean>>;
  readonly density?: ST_DensityState;
  readonly viewSettings?: Partial<ST_ViewSettingsState>;
}
export const getViewSettingsKey: (input: { idInput: string | undefined; leafColumnIds: readonly string[]; persistViewSettings: boolean | string | undefined }) => string | null;
```

#### 1.6.5 Drag helpers and the cancel rule

`shared/utils/drag.utils.ts` (new), `column.utils.ts` (one helper), two callers (D20) (D21) (D37).

- `getST_ColumnDropTargetProps(column)`: `onDragEnter` sets `hoveredColumn` to the column when droppable (table and column `enableColumnOrdering` not false), else `null`; `onDragOver` prevents default and sets `dataTransfer.dropEffect` to `'move'` or `'none'`
- `isColumnDragCancelled(event)`: true only when `event.dataTransfer` exists and its `dropEffect` is `'none'`; a null `dataTransfer` (the Storybook `fireEvent` drags) counts as accepted
- `applyColumnReorder(column, target, table)` in `column.utils.ts`: `reorderColumn` plus `setColumnOrder` plus the pinning filter, the code `ST_TableHeadCellGrabHandle.tsx:71-81` and `ST_ShowHideColumnsMenuItems.tsx:84-92` repeat today
- Constants: `ST_FLIP_COLUMN_ATTR = 'data-flip-column'`, `ST_FLIP_SLIDING_ATTR = 'data-flip-sliding'`, `ST_FLIP_LAYER_ATTR = 'data-flip-layer'`, `lockedCellClassName(dragActive)` (the D21 stripes over `bg-muted/60`, on `::after`, opacity by `dragActive`), `lockedHeaderClassName(dragActive)`
- `ST_TableHeadCellGrabHandle.tsx` and `ST_ShowHideColumnsMenuItems.tsx`: `dragend` reorders through `applyColumnReorder` only when not cancelled; the grouping path (`hoveredColumn.id === 'drop-zone'`) stays first; `ST_ToolbarDropZone.tsx` `onDragOver` sets `dropEffect = 'move'` so its drop is never read as cancelled
- Does NOT change the head or body cell drag handlers (spec 02 and 03 swap them to the helper); does NOT render the locked overlay

**Operations:**

| Operation | Status | Notes |
| --- | --- | --- |
| `getST_ColumnDropTargetProps`, `isColumnDragCancelled` | new | `drag.utils.ts` |
| `applyColumnReorder` | new | `column.utils.ts` |
| grab handle `handleDragEnd` | refactor | cancel rule, helper |
| columns menu `handleDragEnd` | refactor | cancel rule, helper, `setColumnFlipPending` left to spec 04 |
| drop zone `onDragOver` | refactor | `dropEffect = 'move'` |

**Stays unchanged:** `reorderColumn`; `ST_GrabHandleButton`; the `ColumnDragging` story expectation (reorder happens, `dataTransfer` null).

#### 1.6.6 Style helpers

`style.utils.ts` additions, all unused until spec 02 and 03 (D22) (D23).

- `ST_TINT_VARS = { stripe: '--st-stripe', hover: '--st-hover', selected: '--st-selected', edgeShadow: '--st-edge-shadow' } as const`
- `pinnedEdgeShadowClassName(column)`: the inner-edge pinned cell (last visible pinned start, first visible pinned end, hidden pinned columns skipped) returns `drop-shadow-sm drop-shadow-(color:--st-edge-shadow)` with the logical clip (`[clip-path:inset(0_-8px_0_0)]` start, `[clip-path:inset(0_0_0_-8px)]` end, `rtl:` twins), else `undefined`
- `gridLineClassName(gridLines, isLastColumn)`: `border-border` plus `border-b` for rows and all, `border-e` for columns and all when not last
- Does NOT change `getCommonPinnedCellStyles` or `getCommonSRTCellStyles` (spec 02)

#### 1.6.7 Icons

`types.ts` `ST_IconKey`, `icons.ts`, the four maps, one SVG component file (D18).

- New keys, Lucide defaults: `ArrowUpwardIcon` ArrowUp, `LockIcon` Lock, `PushPinOffIcon` PinOff, `AddIcon` Plus, `DeleteIcon` Trash2, `SwapVertIcon` ArrowUpDown, `SettingsIcon` Settings2, `WrapTextIcon` WrapText, `SingleLineIcon` ArrowRightToLine, `GridLinesAllIcon`, `GridLinesRowsIcon`, `GridLinesColumnsIcon` (library SVG), `GridLinesNoneIcon` Square, `StickyHeaderOnIcon` PanelTop, `StickyHeaderOffIcon` PanelTopDashed, `StripedOnIcon` GapVertical, `StripedOffIcon` SquareCenterlineDashedVertical, `RowNumbersOnIcon` ListOrdered, `RowNumbersOffIcon` List
- Reused existing keys, no change: `ExpandMoreIcon` (chevron trigger), `ArrowDownwardIcon`, `FilterListIcon`, `PushPinIcon` (pin to start; pin to end is the same icon with `rotate-90`, applied by the menu), `VisibilityOffIcon`, `CloseIcon`, `DragHandleIcon`, `ViewColumnIcon`, `ChevronLeftIcon`, `ChevronRightIcon`, `DensitySmallIcon` (Rows4, compact), `DensityMediumIcon` (Rows3, comfortable), `DensityLargeIcon` (Rows2, spacious), `RestartAltIcon`, `MoreHorizIcon`, `SearchIcon`, `SearchOffIcon`; `SortIcon` keeps ArrowDownWideNarrow
- `components/icons/ST_GridLineIcons.tsx`: three components taking `ST_IconProps`, 24 viewBox, `currentColor` stroke width 2, rows `M4 9h16 M4 15h16`, columns `M9 4v16 M15 4v16`, all both; outside `icons/` so `lib.mjs` keeps them in the core item, and free of lucide so the Tabler, Phosphor, Hugeicons and Remix editions do not gain a lucide dependency
- Each set map names a glyph per new key or, where the set lacks one, the nearest glyph with a `// substitute for <Lucide name>` comment; the grid keys import `ST_GridLineIcons` in every map
- `icons.ts` keeps one `Key: Glyph,` per line (the `check:icons` regex)

**Stays unchanged:** every existing key and default.

#### 1.6.8 Localization and the reference captures

- `ST_Localization` gains these optional keys, English in `en.ts`, brace interpolation (D24): column menu `sortAscending` "Sort ascending", `sortDescending` "Sort descending", `filter` "Filter", `pinToStart` "Pin to start", `pinToEnd` "Pin to end", `fixedPosition` "Fixed position", `fixed` "Fixed", `hideThisColumn` "Hide", `columnMenu` "{column} column menu", `sortedAscending` "Sorted ascending", `sortedDescending` "Sorted descending"; chips `addFilter` "Filter", `filterBy` "Filter by...", `noColumns` "No columns", `removeFilter` "Remove filter", `deleteAllFilters` "Delete all filters", `clearFilters` "Clear filters", `showColumnToEditFilter` "Show the column to edit this filter.", `rangeSummary` "{min} to {max}", `yes` "Yes", `no` "No", `beforeValue` "before {value}", `afterValue` "after {value}"; sort `sort` "Sort", `sortBy` "Sort by...", `ascending` "Ascending", `descending` "Descending", `dragToReorder` "Drag to reorder", `removeSortOn` "Remove sort on {column}", `addSort` "Add sort", `deleteSort` "Delete sort", `sortsCount` "{n} sorts"; view settings `viewSettings` "View settings", `columns` "Columns", `density` "Density", `wrapCellText` "Wrap cell text", `singleLineCells` "Single-line cells", `gridLines` "Grid lines", `stickyHeader` "Sticky header", `alternatingRowColors` "Alternating row colors", `rowNumbers` "Row numbers", `pinToToolbar` "Pin to toolbar", `unpinFromToolbar` "Unpin from toolbar", `resetView` "Reset view", `columnsShown` "{n} shown", `gridLinesNone` "None", `gridLinesRows` "Rows", `gridLinesColumns` "Columns", `gridLinesAll` "All", `densityCompact` "Compact", `densityComfortable` "Comfortable", `densitySpacious` "Spacious"; scroll `scrollLeft` "Scroll left", `scrollRight` "Scroll right"
- `ST_DefinedTableOptions.localization` becomes `Required<ST_Localization>`; `en.ts` is typed `Required<ST_Localization>`; the 38 other locale files stay untouched (`tsc` is their gate: optional keys pass)
- Reference captures (D34), taken by the builder with agent-browser against `http://localhost:3000/header-demo` at 1800 by 1150, light and dark each, saved as `reference/01-<view>-<theme>.png`: `default`, `column-menu` (Status menu open), `sort-editor` (two sorts), `chips` (two chips, one open), `view-settings` (panel open), `drag` (Assignee dragged over Project mid-drag), `scroll-cues` (window narrowed so columns overflow, hover); `reference/01-demo-commit.txt` from `git -C ../test-projects/next-app rev-parse HEAD`; the demo repository is read-only and its server is never started or stopped (P5)
- `reference/01-surface.json`: `{ "iconKeys": [...], "localizationKeys": [...], "options": [...], "columnOptions": ["icon", "overflowTooltip"] }` exactly the lists above

**Stays unchanged:** existing keys and texts (`sortByColumnAsc`, `pinToLeft`, `hideColumn`, `clearSearch`, `showHideColumns`, `toggleDensity` stay for their current callers); `useST_TableOptions` merge.

### 1.7 Dependencies and env

- `lucide-react` `^1.64.0` in `packages/shadcn-table/package.json`, lockfile committed (1.6.1); no other package change

## 2. Instructions for AI

### 2.1 Milestones

#### 2.1.1 Milestone 1: Dependency, captures and changelog

Lane: agent

- 1.6.1: bump lucide-react, `pnpm install`, commit lockfile; `tsc` per base to prove the existing aliases survive; fix any renamed alias in `icons.ts` in all three bases
- Capture the fourteen references and the demo hash per 1.6.8; commit under `reference/`
- `CHANGELOG.md` `## Unreleased` and the six spec blocks
- Gates: `tsc:radix`, `tsc:baseui`, `tsc:aria` green

#### 2.1.2 Milestone 2: Types, options, slices, helpers, icons, strings

Lane: agent

- 1.6.2 to 1.6.8 in the radix tree, then copied byte-identical to base and aria (`style.utils.ts` and `types.ts` in aria keep their listed differences; apply the same hunks)
- `ST_Table.tsx` attaches `tableRef`; `ST_TableBodyCell.tsx` renders `data-flip-column={column.id}` on the `td`; `displayColumn.utils.ts` `showRowNumbersColumn` reads `enableRowNumbers || viewSettings.rowNumbers`; `ST_TableHeadCellFilterContainer.tsx` gains `open?: boolean` that forces the Collapsible open; `ST_TableContainer.tsx` sticky maxHeight reads `var(--st-sticky-max-height, clamp(350px, calc(100vh - var(--st-toolbar-height, 0px)), 9999px))`
- `index.ts` exports: `drag.utils`, `viewSettingsStorage.utils`, `ST_GridLineIcons`
- Write `reference/01-surface.json` and the Acceptance script `reference/01-check.mjs` (node, no dependencies) that reads it and greps the three files per base
- `pnpm registry:build`; `pnpm --filter shadcn-table-docs lib:install radix|base|aria` so the docs copies carry the new types
- `stories/styling/DefaultLook.stories.tsx`: the demo's columns (Name, Status, Project, Assignee, Due, Estimate, Priority, Tags, Reporter) with `columnDef.icon`, 50 rows, `enableRowActions` with three items, `enableColumnOrdering: false` on Name and Due, and the v0.8 options set explicitly (`layoutMode: 'grid'`, `enableColumnPinning`, `enableColumnResizing`, `enableColumnOrdering`, `paginationDisplayMode: 'pages'`, `positionActionsColumn: 'last'`, `columnFilterDisplayMode: 'chips'`, `enableSortPopover`, `enableViewSettings`, `enableScrollButtons`, `enableCellOverflowTooltip`, `initialState.columnPinning.right: ['st-row-actions']`); no plays here (spec 02 adds them); the capture source for specs 02, 03 and 04
- Gates: per base `tsc`; `lint`; `check:tailwind`; `check:icons`; `check:bases`; `node reference/01-check.mjs`

#### 2.1.3 Final milestone: Cleanup and gates once

Lane: agent

- `pnpm format`; remove any helper left unused by mistake (every helper above is meant to be unused until its consumer spec, so none is deleted for that reason)
- `#### Spec 01` changelog block filled
- Gates: 2.2

### 2.2 Gates

- Per base: `tsc` (`tsconfig.radix.json`, `tsconfig.baseui.json`, `tsconfig.aria.json`) green; `test:<base>` green, the `ColumnDragging` play included
- `lint`, `check:tailwind`, `check:icons`, `check:bases` green; `pnpm install --frozen-lockfile` clean
- `storybook:build:base` green (one base; CI runs the others)
- `node .ai/plans/v0.8.x/anindosarker/reference/01-check.mjs` exits 0; `reference/01-*.png` fourteen files; `reference/01-demo-commit.txt` present
