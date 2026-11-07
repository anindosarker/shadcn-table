# 03: Column size reset animates
- Sprint: S1

Follow the project planning rules: docs/code-of-conduct/planning-guidelines.md, CLAUDE.md:9. Keep the expedition contract.

## 1. Architecture

### 1.1 Overview

A double-click on the resize handle and the "Reset column size" menu item call `column.resetSize()` and the width snaps (`ST_TableHeadCellResizeHandle.tsx:64-70`, `ST_ColumnActionMenu.tsx:127-131`). D5 animates that reset only, in CSS: the two call sites set `data-size-resetting` on the table element, Tailwind classes on the th and td transition width while the attribute is present, and the attribute clears on `transitionend`, the way the column flip gates `transition-[translate]` under `data-flip-sliding` (`ST_TableHeadCell.tsx:309`, `useST_ColumnFlip.ts:297-321`). Drags and every other width change stay instant. Three bases, byte-identical.

### 1.2 Goals

- Double-click on the handle and the menu reset animate the column back to its default width in 200 ms ease-out; a drag never animates; no other width change animates (D5).
- No `global.css` change, no JS animation, no timer (D5).
- `prefers-reduced-motion: reduce` gets no transition and no attribute.
- Acceptance: programmatic. The play `ResetSizeAnimates` of 1.6.4 passes in `test:base`, `test:radix` and `test:aria` and fails on the shipped code first (P11, the red line in the tracker); `pnpm test validate-repo` green (bases identical, tailwind classes valid).

### 1.3 Current structure

```
packages/shadcn-table/registry/<base>/components/ui/shadcn-table/
├── components/head/ST_TableHeadCellResizeHandle.tsx:64-70 ← onDoubleClick: clears isResizingColumn, column.resetSize()
├── components/menus/ST_ColumnActionMenu.tsx:127-131         ← handleResetColumnSize: the same, then closeMenu()
├── components/head/ST_TableHeadCell.tsx:291-311             ← th className with the flip transition classes at :307-309
├── components/body/ST_TableBodyCell.tsx:332-345             ← td className
├── shared/utils/drag.utils.ts:11                            ← ST_FLIP_SLIDING_ATTR
├── shared/utils/style.utils.ts:115-118                      ← width and minWidth from the `--header-<id>-size` and `--col-<id>-size` variables on the table
└── hooks/useST_ColumnFlip.ts:291-321                        ← sets the flip attribute on table.refs.tableRef.current, removes it on transitionend
packages/shadcn-table/stories/features/ColumnResizing.stories.tsx ← resizing stories, title 'Features/Column Resizing Examples'
```

### 1.4 Target structure

```
packages/shadcn-table/registry/<base>/components/ui/shadcn-table/
├── shared/utils/column.utils.ts                 ← ST_SIZE_RESETTING_ATTR and resetColumnSizeAnimated(column)
├── components/head/ST_TableHeadCellResizeHandle.tsx ← onDoubleClick calls resetColumnSizeAnimated
├── components/menus/ST_ColumnActionMenu.tsx     ← handleResetColumnSize calls resetColumnSizeAnimated
├── components/head/ST_TableHeadCell.tsx         ← th: the size-resetting transition classes beside the flip ones
└── components/body/ST_TableBodyCell.tsx         ← td: the same classes
packages/shadcn-table/stories/features/ColumnResizing.stories.tsx ← play ResetSizeAnimates
```

### 1.5 Flow: none

### 1.6 Components

#### 1.6.1 Data artifacts

- `CHANGELOG.md` (P9): `#### Epic 03 Resize animation` under `## Unreleased`: the column size reset animates (D5).
- `apps/shadcn-table-docs/components/ui-<base>/` and `public/r/`: regenerated at merge (P9).
- The tracker `trackers/03-resize-animation-tracker.md`: the red run of the play on the shipped code (P11).

#### 1.6.2 Reset helper (D5)

- `shared/utils/column.utils.ts`: `export const ST_SIZE_RESETTING_ATTR = 'data-size-resetting'` and `export const resetColumnSizeAnimated = (column: ST_Column<TData>) => void`. It reads the table element from `column.table.refs.tableRef.current`; when the element exists, the column's current size differs from its default (`column.getSize()` against `columnDef.size ?? defaultColumn.size`, the width `resetSize` returns to) and `matchMedia('(prefers-reduced-motion: reduce)').matches` is false, it sets the attribute and adds one `transitionend` listener (`{ once: true }`) on the table element that removes the attribute when `event.propertyName` is `width` or `min-width`; then it calls `column.resetSize()`. Without an element, with no size change or under reduced motion it only calls `column.resetSize()`, so the attribute never sticks when no transition will fire. No timer.
- `ST_TableHeadCellResizeHandle.tsx:64-70` and `ST_ColumnActionMenu.tsx:127-131`: `column.resetSize()` replaced by `resetColumnSizeAnimated(column)`; the `isResizingColumn` reset and `closeMenu()` stay.
- Does NOT touch `useST_ColumnFlip.ts`, `drag.utils.ts`, `style.utils.ts` or the drag path of the handle.

#### 1.6.3 Transition classes (D5)

- `ST_TableHeadCell.tsx` th className (`:291-311`), one entry beside the flip line, for every th: `'[table[data-size-resetting]_&]:transition-[width,min-width] [table[data-size-resetting]_&]:duration-200 [table[data-size-resetting]_&]:ease-out motion-reduce:[table[data-size-resetting]_&]:transition-none'`.
- `ST_TableBodyCell.tsx` td className (`:332-345`): the same string.
- Tailwind arbitrary variants as the flip uses; `test/validate-repo/lib/tailwind-classes.mjs` must accept them. No `global.css` edit.
- Does NOT animate anything else: no class on the table, no change to `headCellVariants` or `bodyCellVariants`.

#### 1.6.4 Play (P11)

- `ColumnResizing.stories.tsx`: `ResetSizeAnimates`, a resizing-enabled table with `initialState.columnSizing` widening the first column. The play double-clicks the first column's resize handle, asserts the table element has `data-size-resetting` right after the click, `waitFor`s the attribute to clear, and asserts the column's width is back at its default; then it resizes again through state, opens the column menu, clicks Reset column size and asserts the same sequence. On the shipped code the first attribute assertion fails. The red line goes to the tracker.

### 1.7 Dependencies and env: none

## 2. Instructions for AI

### 2.1 Milestones

### Milestone: Resize animation

- Files owned: `packages/shadcn-table/registry/<base>/components/ui/shadcn-table/shared/utils/column.utils.ts`, `.../components/head/ST_TableHeadCellResizeHandle.tsx`, `.../components/menus/ST_ColumnActionMenu.tsx`, `.../components/head/ST_TableHeadCell.tsx`, `.../components/body/ST_TableBodyCell.tsx` (three bases), `packages/shadcn-table/stories/features/ColumnResizing.stories.tsx`
- Depends on: none
- Review: none
- Local CI: `pnpm test typecheck --base <base>` and `pnpm test storybook-tests --base <base>` for base, radix and aria one after another (P5), `pnpm test lint`, `pnpm test validate-repo`
- Task 1: Reproduce: write the play of 1.6.4, run it on the shipped code, record the red line in the tracker. Checks: `ST_BASE=radix vitest run stories/features/ColumnResizing.stories.tsx` red on `ResetSizeAnimates`
- Task 2: Library: 1.6.2 and 1.6.3 in radix, then base and aria as byte-identical copies. Checks: `pnpm --filter shadcn-table tsc:radix`, `tsc:baseui`, `tsc:aria`; `ST_BASE=<base> vitest run stories/features/ColumnResizing.stories.tsx stories/features/ColumnOrdering.stories.tsx` per base, one after another (P5), green on `ResetSizeAnimates` and the flip plays; `pnpm --filter shadcn-table lint`
- Task 3: Cleanup: `pnpm format`, the changelog block of 1.6.1. Checks: 2.2

### 2.2 Checks

- `pnpm test typecheck --base <base>` and `pnpm test storybook-tests --base <base>` green for base, radix and aria, one base at a time (P5); `pnpm test lint` green
- `pnpm test validate-repo` green: bases identical, tailwind classes valid, registry valid
- Review: none (checks only; one new export, no option change, P7)
