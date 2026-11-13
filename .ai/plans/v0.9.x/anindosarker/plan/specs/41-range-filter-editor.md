# 41: Range filter editors fit and accept input
- Epic: E12

Follow the project planning rules: docs/code-of-conduct/planning-guidelines.md, CLAUDE.md:9. Keep the expedition contract.

## 1. Architecture

### 1.1 Overview

On the live 0.9.3 Filter Variants example (Base UI) the owner opened the Departure Time chip, mode "between inclusive": the editor shows two time inputs side by side, the second runs past the editor's right edge with its clock icon cut off, and the owner could not fill the inputs at all (Q73). From the code: the chip editor popover is a fixed 260 px (`filterEditorClassName = 'w-65'`), and every date-like field (date, datetime, time) keeps a 140 px minimum (`min-w-35`), so two of them plus the 8 px gap need 288 px. The cause of the failed input is not known from the code; with spec 39 merged a typed time value no longer commits per keystroke, which removes the most likely cause (a commit of a partial range value resetting the fields). D86: both inputs of a range filter fit inside the editor and accept input, on the three bases, for time, date, datetime and number ranges.

### 1.2 Goals

- In the chip editor (chip click, the toolbar picker and the header editor) both inputs of a range filter lie fully inside the editor, for `time-range`, `date-range`, `datetime-range` and `range` (number), on the three bases (D86).
- Both inputs take typed values and the filter applies the range (D86).
- The cause of the failed input is found in a browser before the fix and named in the tracker (D86).
- Editors of non-range filters keep their 260 px width.
- Acceptance: programmatic. Play `RangeEditorInputsFitAndFill` in `stories/features/FilterChips.stories.tsx`, one case per variant (`time-range`, `date-range`, `datetime-range`, `range`): open the column's chip editor, assert each input's bounding box lies inside the editor's box (1 px tolerance), fill both inputs, blur, and assert the table shows the expected rows. It fails on the code before the change on the three bases for `time-range` at least (P11, recorded) and passes after for the four variants. `ChipEditorKeepsWidth` still passes.

### 1.3 Current structure

Paths under `packages/shadcn-table/registry/<base>/components/ui/shadcn-table/`.

```
components/toolbar/ST_HeaderFilterEditor.tsx:16      ← export const filterEditorClassName = 'w-65' (base; radix and aria carry the same constant, the files differ elsewhere)
components/toolbar/ST_FilterChips.tsx:118,203        ← PopoverContent className={filterEditorClassName} (chip), editingColumn ? filterEditorClassName : pickerClassName (picker)
components/toolbar/ST_HeaderFilterEditor.tsx:94      ← the header-anchored editor, same class
components/toolbar/ST_FilterEditor.tsx:140-141       ← renders ST_TableHeadCellFilterContainer header open
components/inputs/ST_FilterRangeFields.tsx:17-21     ← 'grid grid-cols-[1fr_1fr] items-start gap-2': Min and Max side by side at every size (D61); identical on the three bases
components/inputs/ST_FilterRangeFields.tsx:50-56     ← two ST_FilterTextField with rangeFilterIndex 0 and 1
components/inputs/ST_FilterTextField.tsx:446-457     ← min widths: isDateFilter 'min-w-35', multi-select 'min-w-30', range 'min-w-18', else 'min-w-24' (isDateFilter wins over range)
components/inputs/ST_FilterTextField.tsx:420-426     ← date-like onChange (spec 39 changes how it commits)
shared/utils/column.utils.ts:252-254                 ← isDateFilter: variant starts with 'date' or 'time'
stories/features/FilterChips.stories.tsx:379         ← ChipEditorKeepsWidth
```

### 1.4 Target structure

```
components/toolbar/ST_HeaderFilterEditor.tsx   ← the editor width for a range filter of date-like fields grows to fit both inputs; 260 px stays the width for every other filter
components/inputs/ST_FilterRangeFields.tsx     ← only if the fit needs it (track sizing); Min and Max stay side by side (D61)
components/inputs/ST_FilterTextField.tsx       ← only if the input fix needs it (the cause found in Task 1)
stories/features/FilterChips.stories.tsx       ← RangeEditorInputsFitAndFill
CHANGELOG.md (P9)                              ← #### Spec 41 under ### Fixed
```

### 1.5 Flow: none

### 1.6 Components

#### 1.6.1 Data artifacts

- `CHANGELOG.md` (P9): `#### Spec 41 Range filter editors fit and accept input` under `## Unreleased`, `### Fixed` (D86).
- Generated (P9): `registry.json`, `apps/shadcn-table-docs/components/ui-<base>/`.

#### 1.6.2 Editor width (D86)

`components/toolbar/ST_HeaderFilterEditor.tsx`, status `refactor`, three bases.

- `filterEditorClassName` stays the export every caller uses; it becomes a function of the column (or a second exported class for date-like range filters) so that an editor holding two date-like fields is at least as wide as both minimum widths, the gap and the popover padding (288 px of content today), capped at the viewport width minus the popover's side offset. The three call sites (`ST_FilterChips.tsx` chip and picker, `ST_HeaderFilterEditor.tsx`) pass the column; `ST_FilterChips.tsx` is edited only at those two lines.
- `useST_PopupResize` in the picker keeps animating the width change between the column list and the editor.
- Does NOT stack Min and Max (D61), shrink the date-like minimum width below what Chromium's native placeholder needs (the comment at `ST_FilterTextField.tsx:445`), or change the subheader and popover display modes.

#### 1.6.3 Input (D86)

- Task 1 reproduces on the code before the change, in a browser on the three bases: open the Departure Time chip editor (story or the Filter Variants example on a production build), type an hour, minutes and AM or PM into each field, and record what each field shows after every key and what `columnFilters` holds. The cause named there is fixed at its source in `ST_FilterTextField.tsx` or `ST_FilterRangeFields.tsx`. If the input already works after spec 39 (typed values held until Enter or blur), the tracker says so with the record and no input code changes.

**Stays unchanged:** `ST_FilterEditor.tsx`, `ST_TableHeadCellFilterContainer.tsx`, `shared/**`, the slider.

### 1.7 Dependencies and env: none

## 2. Instructions for AI

### 2.1 Milestones

### Milestone: Range filter editor

- Files owned: `packages/shadcn-table/registry/base/components/ui/shadcn-table/components/inputs/ST_FilterRangeFields.tsx`, `packages/shadcn-table/registry/radix/components/ui/shadcn-table/components/inputs/ST_FilterRangeFields.tsx`, `packages/shadcn-table/registry/aria/components/ui/shadcn-table/components/inputs/ST_FilterRangeFields.tsx`, `packages/shadcn-table/registry/base/components/ui/shadcn-table/components/toolbar/ST_HeaderFilterEditor.tsx`, `packages/shadcn-table/registry/radix/components/ui/shadcn-table/components/toolbar/ST_HeaderFilterEditor.tsx`, `packages/shadcn-table/registry/aria/components/ui/shadcn-table/components/toolbar/ST_HeaderFilterEditor.tsx`, `packages/shadcn-table/registry/base/components/ui/shadcn-table/components/inputs/ST_FilterTextField.tsx`, `packages/shadcn-table/registry/radix/components/ui/shadcn-table/components/inputs/ST_FilterTextField.tsx`, `packages/shadcn-table/registry/aria/components/ui/shadcn-table/components/inputs/ST_FilterTextField.tsx`, `packages/shadcn-table/stories/features/FilterChips.stories.tsx`, `packages/shadcn-table/registry/base/components/ui/shadcn-table/components/toolbar/ST_FilterChips.tsx`, `packages/shadcn-table/registry/radix/components/ui/shadcn-table/components/toolbar/ST_FilterChips.tsx`, `packages/shadcn-table/registry/aria/components/ui/shadcn-table/components/toolbar/ST_FilterChips.tsx`
- Depends on: 39
- Review: none
- Local CI: `pnpm test typecheck --base base`, `pnpm test typecheck --base radix`, `pnpm test typecheck --base aria`, `pnpm test lint`, `pnpm test validate-repo`, `pnpm test storybook-tests --base base`, `pnpm test storybook-tests --base radix`, `pnpm test storybook-tests --base aria`
- Task 1: The play first (P11) and the browser record of 1.6.3 on the code before the change, three bases. Checks: `ST_BASE=<base> pnpm exec vitest run stories/features/FilterChips.stories.tsx -t "Range Editor Inputs Fit And Fill"` fails as required; the per-key record and the named cause are in the tracker
- Task 2: The width (1.6.2) and the input fix (1.6.3). Checks: the play passes for the four variants on the three bases; `ChipEditorKeepsWidth` passes; `pnpm test typecheck --base <base>`
- Task 3: Regenerate (`pnpm lib:install` per base, `pnpm registry:build`), `pnpm format`, the changelog block. Checks: 2.2

### 2.2 Checks

- `pnpm test typecheck --base base`, `pnpm test typecheck --base radix`, `pnpm test typecheck --base aria`, `pnpm test lint`, `pnpm test validate-repo`, `pnpm test storybook-tests --base base`, `pnpm test storybook-tests --base radix`, `pnpm test storybook-tests --base aria` green
- `RangeEditorInputsFitAndFill` on the three bases, with the before-the-change failure recorded
- One screenshot per base of the open time range editor after the change, paths in the tracker
- Review: none (layout class and one input fix proven by the play; P7 untouched)
