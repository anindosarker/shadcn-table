# 50: Filter input fixes

Follow the project planning rules: docs/code-of-conduct/planning-guidelines.md, CLAUDE.md:9. Keep the expedition contract.

## 1. Architecture

### 1.1 Overview

Two faults in the filter inputs, both in `ST_FilterTextField.tsx`, so one builder holds them. First: clearing an `empty` or `notEmpty` filter resets the column's mode to `allowedColumnFilterOptions?.[0] ?? 'fuzzy'`; a date column with no allowed list lands on `fuzzy`, not the `equals` default that `getDefaultColumnFilterFn` gives it since spec 40 (D93). Second: a native Chromium date, datetime or time input puts the caret on the segment under the pointer, so a click at the centre of a filter box lands on the year and typed digits fill only the year; the owner could not fill the range inputs on live 0.9.3 (D96).

### 1.2 Goals

- Clearing an `empty` or `notEmpty` filter on a column that lists no allowed filter options returns the mode to `getDefaultColumnFilterFn(columnDef)`; a column that lists allowed options keeps today's reset to its first option (D93).
- In the filter date, datetime and time inputs, single and range, on the three bases, a pointer click into a field that does not have focus puts the caret on the first segment (D96).
- The native picker icon, keyboard navigation between segments and a click on a field that already has focus keep the browser's behavior (D96).
- The tracker names, for Chromium, Firefox and Safari, what each browser allows for the first-segment caret and what the fix does there (D96).
- ISO date-time text values keep comparing as dates: `shared/fns/filterFns.ts` is not changed (D92).
- Acceptance: programmatic. Two plays in `stories/features/DateFilters.stories.tsx`, on the three bases, both failing on the code before the change (P11, failures recorded) and passing after: `ClearEmptyReturnsDateDefaultMode` (a date column with no allowed list: set is-empty, clear it, the mode is `equals`) and `ClickCentreOfDateRangeInputTypesFullDate` (a real pointer click at the centre of the first date range input, a full date typed with real key presses, the input's value is that full date).

### 1.3 Current structure

```
packages/shadcn-table/registry/<base>/components/ui/shadcn-table/
├── components/inputs/ST_FilterTextField.tsx
│     base, radix :370 (handleClearEmptyFilterChip :362), aria :418   ← reset to allowedColumnFilterOptions?.[0] ?? 'fuzzy'
│     base :595, :602, :609; radix :596, :603, :610; aria :661, :668, :675 ← native time, datetime-local, date inputs
│     base :485, :528; aria :532, :575                                 ← commonTextFieldProps, commonDatePickerProps: onBlur, onKeyDown, onChange, ref; no pointer or focus handler
├── components/inputs/ST_FilterRangeFields.tsx:10, :52                 ← renders one ST_FilterTextField per bound
├── components/menus/ST_ColumnActionMenu.tsx  base :170, radix :169, aria :164 ← the same reset
└── shared/utils/column.utils.ts:207-222                               ← getDefaultColumnFilterFn(columnDef): equals for date, datetime, time

packages/shadcn-table/stories/features/DateFilters.stories.tsx:46, :148-160 ← DateTable helper (subheader, enableColumnFilterModes); PlainDateVariantDefaultsToEquals
```

- Plays run in Chromium only (`packages/shadcn-table/vitest.config.ts:58`).
- The other `?? 'fuzzy'` (`hooks/useST_TableInstance.ts:164`, the global filter) is not part of D93.

### 1.4 Target structure

```
components/inputs/ST_FilterTextField.tsx      ← reset through getDefaultColumnFilterFn; first-segment caret on a pointer click
components/menus/ST_ColumnActionMenu.tsx      ← reset through getDefaultColumnFilterFn
stories/features/DateFilters.stories.tsx      ← the two plays of 1.2
CHANGELOG.md (P9)                             ← #### Spec 50 under ### Fixed
```

### 1.5 Flow: none

### 1.6 Components

#### 1.6.1 Data artifacts

- `CHANGELOG.md` (P9): `#### Spec 50` under `## Unreleased`, `### Fixed`: clearing an is-empty filter returns the column to its default mode (D93); a click in a date or time filter box starts typing at its first part (D96).
- Generated (P9): `apps/shadcn-table-docs/components/ui-<base>/` by `pnpm -w registry:build` and `pnpm --filter shadcn-table-docs lib:install <base>`.

#### 1.6.2 Mode reset (D93)

`ST_FilterTextField.tsx` and `ST_ColumnActionMenu.tsx`, status `refactor`, the three bases.

- The reset of a cleared `empty` or `notEmpty` mode becomes `allowedColumnFilterOptions?.[0] ?? getDefaultColumnFilterFn(columnDef)`; the existing `column.utils` import gains the name.
- Does NOT change the reset of a column with an allowed list, the global filter default, or `getDefaultColumnFilterFn` itself.

#### 1.6.3 First-segment caret (D96)

`ST_FilterTextField.tsx`, status `refactor`, the three bases; the range fields get it through the same component.

- Applies only to the native `date`, `datetime-local` and `time` filter inputs, and only to a pointer press on a field that does not have focus.
- A press on the native picker icon opens the picker as today; a press on a focused field places the caret where the browser puts it; Tab, arrow keys and typing are untouched.
- The builder first measures, in Chromium, Firefox and WebKit (Playwright ships the three), where the caret lands on a centre click today and which mechanism each browser allows; the result per browser goes in the tracker. A browser that allows none keeps its behavior and is named there.
- Does NOT replace the native inputs, add a dependency, or change what the inputs send (`event.target.value` strings) or when they commit.

**Stays unchanged:** `shared/fns/filterFns.ts` (D92), `shared/utils/column.utils.ts`, `ST_FilterRangeFields.tsx`, `stories/features/FilterChips.stories.tsx` (owned by spec 41.3 while it runs; the new plays go in `DateFilters.stories.tsx` for that reason), the exported names in `index.ts` (P7).

### 1.7 Dependencies and env: none

## 2. Instructions for AI

### 2.1 Milestones

### Milestone: Filter input fixes

- Files owned: `packages/shadcn-table/registry/base/components/ui/shadcn-table/components/inputs/ST_FilterTextField.tsx`, `packages/shadcn-table/registry/radix/components/ui/shadcn-table/components/inputs/ST_FilterTextField.tsx`, `packages/shadcn-table/registry/aria/components/ui/shadcn-table/components/inputs/ST_FilterTextField.tsx`, `packages/shadcn-table/registry/base/components/ui/shadcn-table/components/menus/ST_ColumnActionMenu.tsx`, `packages/shadcn-table/registry/radix/components/ui/shadcn-table/components/menus/ST_ColumnActionMenu.tsx`, `packages/shadcn-table/registry/aria/components/ui/shadcn-table/components/menus/ST_ColumnActionMenu.tsx`, `packages/shadcn-table/stories/features/DateFilters.stories.tsx`
- Depends on: none
- Review: fable
- Local CI: `pnpm test typecheck --base base`, `pnpm test typecheck --base radix`, `pnpm test typecheck --base aria`, `pnpm test lint`, `pnpm test validate-repo`, `pnpm test storybook-tests --base base`, `pnpm test storybook-tests --base radix`, `pnpm test storybook-tests --base aria`
- Task 1: Plays first (P11): the two plays of 1.2 in `DateFilters.stories.tsx`; run them on the code before the change on the three bases and record the failures. Checks: `ST_BASE=<base> pnpm exec vitest run stories/features/DateFilters.stories.tsx` fails on those two and passes on the existing plays
- Task 2: The mode reset (1.6.2), the six sites. Checks: `ClearEmptyReturnsDateDefaultMode` passes on the three bases; `pnpm test typecheck --base <base>`
- Task 3: The browser measurement and the first-segment caret (1.6.3). Checks: `ClickCentreOfDateRangeInputTypesFullDate` passes on the three bases; the per-browser record (Chromium, Firefox, WebKit) is in the tracker; `Filtering.stories.tsx` plays `TypeThenEnterAppliesAtOnce` and `HalfTypedYearAppliesNothing` and `FilterChips.stories.tsx` play `RangeEditorInputsFitAndFillDate` unchanged and green
- Task 4: Cleanup: regenerate the docs copies (`pnpm -w registry:build`, `pnpm --filter shadcn-table-docs lib:install <base>` per base), `pnpm format`, the changelog block. Checks: 2.2

### 2.2 Checks

- `pnpm test typecheck --base base`, `pnpm test typecheck --base radix`, `pnpm test typecheck --base aria`, `pnpm test lint`, `pnpm test validate-repo`, `pnpm test storybook-tests --base base`, `pnpm test storybook-tests --base radix`, `pnpm test storybook-tests --base aria` green
- The two plays on the three bases, with their before-the-change failures recorded
- `git diff origin/claude/review -- packages/shadcn-table/registry/*/components/ui/shadcn-table/index.ts | grep '^-export'` prints nothing (P7)
- Review: fable (a shared input used by every date filter surface, and a pointer behavior)
