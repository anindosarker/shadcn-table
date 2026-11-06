# 05: defaults and stories

## 1. Architecture

### 1.1 Overview

Specs 02, 03 and 04 build the new chrome behind options whose defaults still point at the old look. This spec flips every default the decisions name, in one place, after the three workstreams merged, and brings every Storybook story, play test, docs example and page check that assumed the old defaults to the new ones (D9) (D10) (D11) (D13) (D14) (D19) (D20) (D31) (D32) (D36). Workstream D (index, Run plan): branch `v0.8/defaults-stories`, worktree `01`, cut from `claude/review` after A, B and C merged, one builder, draft PR at the first push (P1), one fable review on the whole diff (`Review: fable`). Docs guides are spec 06's; this spec touches the docs app only where the flips would turn `check-pages` red.

### 1.2 Goals

- `useST_TableOptions` defaults: `columnFilterDisplayMode: 'chips'`, `enableSortPopover: true`, `enableViewSettings: true`, `enableScrollButtons: true`, `enableCellOverflowTooltip: true`, `persistViewSettings: false`, `showClearSearchButton: false`, `showColumnDragHandle: false`, `enableColumnOrdering: true`, `enableColumnPinning: true`, `enableColumnResizing: true`, `paginationDisplayMode: 'pages'`, `positionActionsColumn: 'last'`, `layoutMode: 'grid'` with no auto-switch on resizing; `enableStickyHeader` stays `false` and the virtualization rule stays (D19)
- A table with `enableRowActions` and no `columnPinning` of its own seeds `columnPinning.end: ['st-row-actions']` (D14)
- Every story renders the stock look unless it demonstrates an alternative; every play test passes per base; the `MenuOpeners` tests use the trigger pattern (D25)
- The four docs filter examples and the alternate pagination example set their mode explicitly; the page checks that named old controls name the new ones; `check-pages` stays green per base at merge
- `CHANGELOG.md` `### Changed` lists every flipped default with the option that restores it (D32)
- `registry.json` and the docs library copies are regenerated
- Acceptance: programmatic, `node reference/05-check.mjs` (committed by this spec) greps `useST_TableOptions.ts` in each base for every default above and exits 0; `test:base`, `test:radix`, `test:aria` exit 0; `storybook:build:<base>` exits 0 per base; `check-pages.mjs --base <base>` exits 0 per base (P6)

### 1.3 Current structure

```
packages/shadcn-table/registry/<base>/components/ui/shadcn-table/
├── hooks/useST_TableOptions.ts                  ← subheader 36; ordering false 46; pinning and resizing false 47-48; default 84; first 85; layoutMode rule 134-135
└── hooks/useST_TableInstance.ts                 ← default columnPinning without the actions column (162-169)
packages/shadcn-table/stories/
├── fixed-bugs/MenuOpeners.stories.tsx           ← span anchor checks (33-110)
├── features/{TableProvider,NestedTable,Pagination}.stories.tsx ← 'N-M of T' range asserts
├── features/{Filtering,CustomFilterFns,SubRowTree}.stories.tsx, fixed-bugs/{AriaTooltips,useEffects,mobile-date-pickers,dragging-virtual-when-filtered}.stories.tsx ← subheader inputs through showColumnFilters
├── features/{ColumnDragging,Sorting,ColumnHiding,RowActions,LayoutMode,ColumnPinning,ColumnResizing,ColumnOrdering}.stories.tsx, styling/RenderCounts.stories.tsx, fixed-bugs/{RTL,FilterPopover,MenuFocusReturn}.stories.tsx ← old controls, redundant props
apps/shadcn-table-docs/
├── examples/<base>/{customize-filter-variants,enable-filter-facet-values,customize-filter-modes,customize-filter-components}/TS.tsx ← showColumnFilters without a mode
├── examples/<base>/alternate-pagination/TS.tsx  ← pages (now the default)
├── scripts/page-checks/b.mjs, e.mjs             ← thead 'Move' grip, thead separator, 'Show/Hide columns', subheader controls
└── components/ui-<base>/                        ← tracked library copies
CHANGELOG.md                                     ← `#### Spec 05` block under `### Changed` (from 01)
```

### 1.4 Target structure

```
packages/shadcn-table/registry/<base>/components/ui/shadcn-table/hooks/useST_TableOptions.ts ← the flips, no other change
packages/shadcn-table/registry/<base>/components/ui/shadcn-table/hooks/useST_TableInstance.ts ← actions column seeded into initialState.columnPinning.end
packages/shadcn-table/stories/**                 ← stock look everywhere; explicit modes only where a story demonstrates one
apps/shadcn-table-docs/examples/<base>/{four filter examples}/TS.tsx ← columnFilterDisplayMode: 'subheader'
apps/shadcn-table-docs/examples/<base>/alternate-pagination/TS.tsx ← paginationDisplayMode: 'default'
apps/shadcn-table-docs/scripts/page-checks/{a,b,c,e}.mjs ← selectors and needles follow the shipped chrome
apps/shadcn-table-docs/components/ui-<base>/     ← regenerated
.ai/plans/v0.8.x/anindosarker/reference/05-check.mjs ← the Acceptance script
```

### 1.5 Flow: none

### 1.6 Components

#### 1.6.1 Data artifacts

- `CHANGELOG.md` `#### Spec 05` under `### Changed` (D32), one line per flip: `enableColumnOrdering` (restore `false`), `enableColumnPinning` (`false`), `enableColumnResizing` (`false`), `paginationDisplayMode` (`'default'`), `columnFilterDisplayMode` (`'subheader'`), `layoutMode` (`'semantic'` or `'grid-no-grow'`), `positionActionsColumn` (`'first'`), default actions pinning (`initialState.columnPinning`), `enableSortPopover` (`false`), `enableViewSettings` (`false`), `enableScrollButtons` (`false`), `enableCellOverflowTooltip` (`false`); no `### Breaking` (D25 addendum)
- `registry.json`: `pnpm registry:build`, no diff expected beyond what 02 to 04 added; `apps/shadcn-table-docs/components/ui-<base>/`: `pnpm lib:install <base>` per base
- `reference/05-check.mjs`: node, no dependencies, one regex per default per base

#### 1.6.2 Defaults

`useST_TableOptions.ts`, `useST_TableInstance.ts` (D9) (D10) (D11) (D13) (D14) (D19) (D20) (D22) (D17) (D31) (D35) (D36).

- Destructure with defaults: `columnFilterDisplayMode = 'chips'`, `enableCellOverflowTooltip = true`, `enableColumnOrdering = true`, `enableColumnPinning = true`, `enableColumnResizing = true`, `enableScrollButtons = true`, `enableSortPopover = true`, `enableViewSettings = true`, `paginationDisplayMode = 'pages'`, `persistViewSettings = false`, `positionActionsColumn = 'last'`, `showClearSearchButton = false`, `showColumnDragHandle = false`; every one returned on the defined options (an option left in `...rest` would reach components as `undefined`)
- `layoutMode = layoutMode || 'grid'`; the `enableColumnResizing ? 'grid-no-grow' : 'semantic'` branch goes; the virtualization upgrade from an explicit `'semantic'` stays
- `enableStickyHeader = false` stays; lines 143-145 stay
- `ST_DefaultDisplayColumn.enableColumnOrdering: false` stays (display columns stay non-draggable; the actions column def from spec 02 overrides it)
- `useST_TableInstance.ts`: when `enableRowActions`, `positionActionsColumn === 'last'`, `enableColumnPinning` and neither `initialState.columnPinning` nor `state.columnPinning` is given, the seed `{ end: ['st-row-actions'] }` is written into `initialState.columnPinning` (the normalisation at 162-169), so the first render and `resetColumnPinning()` both keep the actions column pinned (D14); a consumer's pinning wins untouched
- Does NOT change any type (spec 01) or component (specs 02 to 04)

#### 1.6.3 Stories and play tests

`packages/shadcn-table/stories/**` (D25 and every flip).

- `MenuOpeners.stories.tsx`: rewritten to the trigger pattern: opener `aria-expanded`, second press closes, Escape returns focus to the opener, no span assertions; the ColumnActions play's "Filter" item asserts the chip popover input receives focus (chips mode)
- `MenuFocusReturn.stories.tsx`: openers renamed to the shipped `aria-label`s (`columnActions`, `showHideColumns`); the filter-mode case sets `columnFilterDisplayMode: 'subheader'`
- `TableProvider`, `NestedTable`, `Pagination`: stories that assert the `N-M of T` range set `paginationDisplayMode: 'default'` explicitly, or assert the pages controls; the `PaginationEnabledDefault*` stories show pages, one story keeps `default`
- `Filtering`, `CustomFilterFns`, `SubRowTree`, `AriaTooltips`, `useEffects`, `mobile-date-pickers`, `dragging-virtual-when-filtered`: stories that type into subheader inputs set `columnFilterDisplayMode: 'subheader'`; `Filtering` gains one chips-mode story pointing at `FilterChips.stories.tsx` (spec 04)
- `ColumnDragging`: the header-drag plays from spec 03 stand; the grip story keeps `showColumnDragHandle`; `Sorting` and `ColumnHiding`: openers follow the shipped labels; `RowActions`: the "last" variants become "first" variants (`positionActionsColumn: 'first'`); `LayoutMode`: `DefaultSemantic` renamed `Semantic`, a `DefaultGrid` story added; `ColumnPinning`, `ColumnResizing`, `ColumnOrdering`: redundant `enable*` props removed, one `enable*: false` story each; `RTL`: re-verified under grid; `FilterPopover`: the `[aria-expanded]` selector excludes the column menu label; `RenderCounts`: counts re-verified under the new defaults, the `Profiled Thousand Rows` budget updated only if the measured count changed for a reason the tracker names
- `.storybook/preview.tsx`: unchanged
- Does NOT delete a story; a story whose premise no longer exists (grip by default) keeps its name with the option set explicitly

#### 1.6.4 Docs examples and page checks

`apps/shadcn-table-docs/` (kept green at merge; spec 06 owns the text).

- `customize-filter-variants`, `enable-filter-facet-values`, `customize-filter-modes`, `customize-filter-components`: `columnFilterDisplayMode: 'subheader'` beside `showColumnFilters`, identical in radix, base and aria; `alternate-pagination`: `paginationDisplayMode: 'default'`
- `page-checks/b.mjs`: the `enable-column-ordering` check counts `thead [draggable="true"]` instead of the `Move` grip; the resize check finds the handle by `.cursor-col-resize`; the `Show/Hide columns` check clicks the pinned Columns button (same `aria-label`); `c.mjs`: the multi-sort marker reads the sorted header's `aria-label` (`sortedAscending` / `sortedDescending`); `a.mjs`: the `alternate-pagination` needle follows the example; `e.mjs`: unchanged (the examples pin subheader)
- Does NOT edit guides, prop tables, routes or `meta.json` (spec 06)

### 1.7 Dependencies and env: none new

## 2. Instructions for AI

### 2.1 Milestones

### Milestone: Defaults and stories

- Files owned: `hooks/useST_TableOptions.ts`, `hooks/useST_TableInstance.ts` in the three bases; every file under `packages/shadcn-table/stories/`; `apps/shadcn-table-docs/examples/<base>/{customize-filter-variants,enable-filter-facet-values,customize-filter-modes,customize-filter-components,alternate-pagination}/TS.tsx`; `apps/shadcn-table-docs/scripts/page-checks/*.mjs`; `reference/05-check.mjs`
- Depends on: 02, 03, 04
- Review: fable
- Task 1: Flips and seed (Lane: agent): 1.6.2 in the radix tree, copied to base and aria; `reference/05-check.mjs`. Checks: per base `tsc`; `node reference/05-check.mjs`; `check:bases`
- Task 2: Stories and docs examples (Lane: agent): 1.6.3 and 1.6.4; `pnpm registry:build`; `pnpm --filter shadcn-table-docs lib:install <base>` per base; docs `types:check` and `lint`. Checks: `test:base`, `test:radix`, `test:aria`; `storybook:build:<base>` per base; `check-pages.mjs --base <base>` per base against the agent's own dev server (`PORT` in 5340 to 5360, P5)
- Task 3: Cleanup and checks once (Lane: agent): `pnpm format`; `#### Spec 05` changelog lines. Checks: 2.2

### 2.2 Checks

- Per base: `tsc`, `test:<base>`, `storybook:build:<base>`, `check-pages.mjs --base <base>` green
- `lint`, `check:tailwind`, `check:bases`, `check:icons` green; docs `types:check`, `lint` green
- `node reference/05-check.mjs` and `node reference/01-check.mjs` exit 0
