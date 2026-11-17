# 60: Four small table fixes

Follow the project planning rules: docs/code-of-conduct/planning-guidelines.md, CLAUDE.md:9. Keep the expedition contract.

## 1. Architecture

### 1.1 Overview

Four library bugs found while the E14 run tried its own Try it steps in a browser. Each is small and each has one right behaviour: the Sticky header switch in View settings does nothing when the table was set up sticky (D120); only the left half of a column's resize grip can be dragged (D126); ticking a parent row unticks its sub-rows (D125); the Click to copy button overflows a narrow cell and on React Aria shows the wrong tooltip (D127). They are cut into two milestones by the files they share, so both run side by side.

Branch: each milestone's branch is created from `origin/claude/review` and merges into `claude/review` (process.md P1), so the fixes can ship in a patch release. They reach `v0.9/docs-layout` through spec 63.

### 1.2 Goals

- `enableStickyHeader` sets how the table starts; the `Sticky header` switch in `View settings` then turns the sticky header off and on, whatever the option says; full screen still forces it on (D120).
- A resize drag starts from anywhere on the grip, also on pinned and sticky header cells; the hairline stays where it is today (D126).
- Ticking a parent row ticks all its sub-rows, unticking it unticks them, ticking the last unticked sub-row ticks the parent (D125).
- The Click to copy button stays inside its cell with its text truncated, and hovering it with the pointer shows "Click to copy" on base, radix and aria (D127).
- All three registries get the same change; no public option or type is removed (process.md P7).
- Acceptance: programmatic. `pnpm test storybook-tests --base base|radix|aria`, `pnpm test typecheck --base base|radix|aria`, `pnpm test lint`, `pnpm test validate-repo` green; one play per fix, each recorded failing on the code before the fix (P11). References: for D125 the selection behaviour of Material React Table's sub-row selection (`material-react-table/packages/material-react-table/src/utils/row.utils.ts:175-225` in the workspace clone); for D126 a capture of the header of `Features/Column Resizing` on `claude/review` before the change, the hairline at the same pixel after.

### 1.3 Current structure

`L` = `packages/shadcn-table/registry/<base>/components/ui/shadcn-table`; the lines are base; radix and aria carry the same code unless noted.

```
L/components/head/ST_TableHead.tsx:67,72            ← enableStickyHeader || isFullScreen || stickyHeaderSetting
L/components/head/ST_TableHeadCell.tsx:152,183      ← the same test; :296 `sticky top-0 z-2`; :128,349 the resize handle
L/components/head/ST_TableHeadRow.tsx:55            ← reads the option only
L/components/body/ST_TableBodyRow.tsx:163,181       ← isStickyHeader = enableStickyHeader || stickyHeader
L/components/body/ST_TableBody.tsx:149,154
L/components/table/ST_TableContainer.tsx:129,152
L/features/stViewSettingsFeature.ts:60-79           ← viewSettings.stickyHeader, default false, table_setViewSettings
L/hooks/useST_TableInstance.ts:165-170              ← seeds viewSettings.stickyHeader from the option
L/hooks/useST_TableOptions.ts:162                   ← forces enableStickyHeader = true in one case
L/components/toolbar/ST_ViewSettingsItems.tsx:206,290   ← the switch writes setViewSettings
L/components/head/ST_TableHeadCellResizeHandle.tsx:57-64,87-93   ← `w-2`, `-inset-e-1` (half over the next cell), `inset-e-0` on the last column; the inner line
L/shared/utils/style.utils.ts:188-196               ← every head cell `relative` with its own z layer (aria: about :221-229)
L/shared/utils/row.utils.ts:158-183                 ← getST_RowSelectionHandler; :180-182 unticks the sub-rows after the toggle
L/components/buttons/ST_CopyButton.tsx:15-17,67-83  ← no shrink, no truncate (aria lacks line :81)
L/components/body/ST_OverflowText.tsx:44-63         ← base: the truncating span is the tooltip trigger; aria :51-75 opens its tooltip on pointer enter
L/components/ui/button.tsx                          ← `shrink-0`, size sm `px-2.5`; not edited
packages/shadcn-table/stories/styling/StickyHeader.stories.tsx      ← EnableStickyHeader (no play on the switch)
packages/shadcn-table/stories/features/ColumnResizing.stories.tsx   ← DragResizesColumn (play), ColumnResizingWithPinning (no play)
packages/shadcn-table/stories/features/SubRowTree.stories.tsx:220   ← SubRowTreeWithSelection (no play)
packages/shadcn-table/stories/features/ClickToCopy.stories.tsx      ← ClickToCopyEnabledWithColumnResizing (no play)
```

- D125: the v9 store updates at once, so after ticking a parent `row.getIsAllSubRowsSelected()` is already true and the block at `:180-182` clears the sub-rows. Callers `components/inputs/ST_SelectCheckbox.tsx:85` and `shared/utils/cell.utils.ts:96` do not change.
- D126: the handle's own `z-10` cannot rise above the next head cell, because each head cell is its own layer.
- `tools/registry/aria-diff.json` lists `ST_OverflowText` and `ST_CopyButton` as allowed to differ; `ST_TableHeadCell`, `ST_TableBodyRow`, `ST_TableBody` and `row.utils` must stay identical across bases.
- The story files are changed on `v0.9/docs-layout`. A play is therefore added to a story that exists; a new story is written only when no story shows the case, because a new story becomes a docs page there (D106) and spec 63 then has to give it its text.

### 1.4 Target structure: the same files; no new file, no new option

### 1.5 Flow: none

### 1.6 Components

#### 1.6.1 Data artifacts

- `CHANGELOG.md` (P9): `#### Spec 60 <milestone>` under `## Unreleased`, `### Fixed`, one line per fix.
- `registry.json` is generated (`pnpm registry:build`); no file is added, so it must not change.

#### 1.6.2 Sticky header switch (D120)

- Every sticky header test becomes `isFullScreen || viewSettings.stickyHeader`; the option is no longer joined in at the seven sites of 1.3. The option keeps seeding the setting at `useST_TableInstance.ts:165-170`, so a table with `enableStickyHeader: true` still starts sticky with the switch on.
- `ST_TableHeadRow.tsx:55` follows the same value instead of the option.
- The forced case of `useST_TableOptions.ts:162` keeps working: what it forces reaches the seed.
- Does NOT remove or rename `enableStickyHeader`; does NOT change the default (off).

#### 1.6.3 Resize grip (D126)

- The handle sits wholly inside its own cell on every column (as the last column's does today), so no neighbour covers it; its inner line is placed so the hairline is drawn at the same pixel as before.
- Does NOT change the handle's width, the touch handling (`touch-none`, `onTouchStart`) or the head cell layers.

#### 1.6.4 Sub-row selection (D125)

- `getST_RowSelectionHandler` reads whether all sub-rows were selected before it toggles the row, and unticks the sub-rows only when the parent is being unticked.
- Does NOT change `enableSubRowSelection`, single selection or the shift-click range.

#### 1.6.5 Copy button (D127)

- `ST_CopyButton`: the button may shrink and its label truncates, so it never overflows the cell.
- `ST_OverflowText`: with a copy button inside, a pointer over the button opens "Click to copy" and not the cell's overflow tooltip, on all three bases (aria's pointer timer included).
- Does NOT edit `components/ui/button.tsx`.

**Stays unchanged:** every other library file, every guide page (none states the old behaviour of these four), `index.ts`, `types.ts`.

### 1.7 Dependencies and env: none

## 2. Instructions for AI

### 2.1 Milestones

### Milestone: Sticky header switch and resize grip

- Files owned: `packages/shadcn-table/registry/*/components/ui/shadcn-table/components/head/ST_TableHead.tsx`, `packages/shadcn-table/registry/*/components/ui/shadcn-table/components/head/ST_TableHeadCell.tsx`, `packages/shadcn-table/registry/*/components/ui/shadcn-table/components/head/ST_TableHeadRow.tsx`, `packages/shadcn-table/registry/*/components/ui/shadcn-table/components/head/ST_TableHeadCellResizeHandle.tsx`, `packages/shadcn-table/registry/*/components/ui/shadcn-table/components/body/ST_TableBodyRow.tsx`, `packages/shadcn-table/registry/*/components/ui/shadcn-table/components/body/ST_TableBody.tsx`, `packages/shadcn-table/registry/*/components/ui/shadcn-table/components/table/ST_TableContainer.tsx`, `packages/shadcn-table/registry/*/components/ui/shadcn-table/hooks/useST_TableInstance.ts`, `packages/shadcn-table/stories/styling/StickyHeader.stories.tsx`, `packages/shadcn-table/stories/features/ColumnResizing.stories.tsx`
- Depends on: none
- Review: fable
- Local CI: `pnpm test typecheck --base base`, `pnpm test typecheck --base radix`, `pnpm test typecheck --base aria`, `pnpm test lint`, `pnpm test validate-repo`, `pnpm test storybook-tests --base base`, `pnpm test storybook-tests --base radix`, `pnpm test storybook-tests --base aria`
- Task 1: Two plays first (P11). On `EnableStickyHeader`: open `View settings`, switch `Sticky header` off, the `thead` is no longer sticky; switch it on, it is sticky again. On `ColumnResizingWithPinning`: a pointer drag that starts on the right half of a grip resizes the column, on a pinned and on an unpinned column. Both run on the code before the fix and fail. Checks: the two failures in the tracker
- Task 2: Sticky header switch (1.6.2) on base, radix and aria. Checks: the play passes on the three bases; `grep -rn "enableStickyHeader ||" packages/shadcn-table/registry` prints nothing; the stories `StickyHeaderDisabledDefault` and the `Features/View Settings` play that touches the sticky header still pass; a table in full screen is sticky with the switch off (asserted in the play)
- Task 3: Resize grip (1.6.3) on base, radix and aria. Checks: the play passes on the three bases; `DragResizesColumn`, `ResizeGuidesMeetEdge` and `DoubleClickResetsWidth` still pass; a capture of the `Features/Column Resizing` header before and after, the hairline at the same pixel
- Task 4: Cleanup: `pnpm format`, the changelog block, `pnpm registry:build` leaves `registry.json` unchanged. Checks: 2.2

### Milestone: Sub-row selection and copy button

- Files owned: `packages/shadcn-table/registry/*/components/ui/shadcn-table/shared/utils/row.utils.ts`, `packages/shadcn-table/registry/*/components/ui/shadcn-table/components/buttons/ST_CopyButton.tsx`, `packages/shadcn-table/registry/*/components/ui/shadcn-table/components/body/ST_OverflowText.tsx`, `packages/shadcn-table/stories/features/SubRowTree.stories.tsx`, `packages/shadcn-table/stories/features/ClickToCopy.stories.tsx`
- Depends on: none
- Review: none
- Local CI: `pnpm test typecheck --base base`, `pnpm test typecheck --base radix`, `pnpm test typecheck --base aria`, `pnpm test lint`, `pnpm test validate-repo`, `pnpm test storybook-tests --base base`, `pnpm test storybook-tests --base radix`, `pnpm test storybook-tests --base aria`
- Task 1: Two plays first (P11). On `SubRowTreeWithSelection`: tick a parent, all its sub-rows are ticked; untick it, they are unticked; tick the sub-rows one by one, the parent is ticked with the last. On `ClickToCopyEnabledWithColumnResizing`: with the copy column narrowed below the button's width, the button's box lies inside its cell and a pointer hover (not keyboard focus) shows "Click to copy". Both run on the code before the fix and fail (the tooltip part on aria, the overflow on all three). Checks: the failures per base in the tracker
- Task 2: Sub-row selection (1.6.4) on base, radix and aria. Checks: the play passes on the three bases; `SubRowTreeWithSelectionNoSubRowSelection` and `SubRowTreeWithSingleSelection` behave as before (a play assertion each, or their existing plays); the `Features/Selection` plays pass
- Task 3: Copy button (1.6.5) on base, radix and aria. Checks: the play passes on the three bases; `ClickCopiesValue` still passes (a known flake under load, P5: rerun once); a truncated cell without a copy button still shows its overflow tooltip (the existing overflow tooltip plays pass)
- Task 4: Cleanup: `pnpm format`, the changelog block, `tools/registry/aria-diff.json` still true, `pnpm registry:build` leaves `registry.json` unchanged. Checks: 2.2

### 2.2 Checks

- The Local CI line green, one base at a time (P5)
- The Acceptance checks of 1.2
- Review: fable on "Sticky header switch and resize grip" (the meaning of a public option changes); none on the second milestone
