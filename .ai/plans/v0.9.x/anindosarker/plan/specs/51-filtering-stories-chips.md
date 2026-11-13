# 51: Filtering stories show chips
- Epic: E13

Follow the project planning rules: docs/code-of-conduct/planning-guidelines.md, CLAUDE.md:9. Keep the expedition contract.

## 1. Architecture

### 1.1 Overview

`packages/shadcn-table/stories/features/Filtering.stories.tsx` has 37 stories; 21 pin `columnFilterDisplayMode: 'subheader'` while the library default is `'chips'`, so the deployed Storybook shows the old filter row for most filtering features. D98 moves the plain demos to the default and keeps the tested subheader stories as that mode's regression tests, named so a visitor knows what they show.

### 1.2 Goals

- The 10 subheader stories with no play follow the default chips (D98).
- The 11 subheader stories with a play keep the subheader row and their plays; each shows a name in the Storybook sidebar that says "Subheader" (D98).
- Story ids do not change: the export names stay.
- Acceptance: programmatic. `ST_BASE=<base> pnpm exec vitest run stories/features/Filtering.stories.tsx` green on the three bases with the same 18 plays as before; `git diff origin/claude/review -- packages/shadcn-table/stories/features/Filtering.stories.tsx` shows no changed line inside a `play` function; a grep of the file finds no `subheader` between the export line of each of the 10 stories and the next export.

### 1.3 Current structure

```
packages/shadcn-table/stories/features/Filtering.stories.tsx   (title Features/Filtering Examples, :30; no story sets name)
├── no play, pin subheader and showColumnFilters: true (export : pin)
│     FilterFnAndFilterVariants 175 : 268          FilterFnAndFilterVariantsFaceted 273 : 313
│     FilteringChangeModeEnabled 430 : 476         DisableSomeFilterTypesForCertainColumns 786 : 831
│     FilteringDisabledForCertainColumns 836 : 873 CustomFilterFunctionPerColumn 878 : 923
│     CustomFilterFns 928 : 974                    CustomFilterComponent 981 : 1033
│     CustomizeFilterTextFields 1040 : 1077        ExternalSetFilterValue 1112 : 1116
└── play on the subheader row (export)
      MultiSelectFieldControls 327        RangeSliderCustomBounds 398
      FilterModeMenuClosesInPlace 488     ← render: FilteringChangeModeEnabled, inherits its pin
      FilteringChangeModeEnabledFaceted 605   SubheaderRangeFieldsNarrow 668
      RangeFilterMinValue 1215            ModePickerByDefaultSubheader 1260
      TypeThenEnterAppliesAtOnce 1488     HalfTypedYearAppliesNothing 1513
      ControlledRerenderKeepsTypedFilter 1574 ← pin in RerenderingDebounceTable :1562
      CustomFilterDebounce 1659
```

- `showColumnFilters` has no effect under chips: the toggle button and the header filter row render only in subheader mode (`ST_ToolbarInternalButtons.tsx:73-74`, `ST_TableHeadCell.tsx:186`).
- No story id of this file is referenced outside it (docs, `test/`, `tools/`); no screenshot baseline is keyed by one.

### 1.4 Target structure

```
packages/shadcn-table/stories/features/Filtering.stories.tsx
├── the 10 plain stories   ← no columnFilterDisplayMode, no showColumnFilters: the default chips
└── the 11 tested stories  ← subheader kept; name: 'Subheader: <today's sidebar name>' where the name does not say Subheader yet
```

### 1.5 Flow: none

### 1.6 Components

#### 1.6.1 Data artifacts: none

A stories file is not a registry source; no changelog block (not shipped to users of the library).

#### 1.6.2 Plain demo stories (D98)

Status `refactor`.

- Each of the 10 stories loses its `columnFilterDisplayMode: 'subheader'` line and its `showColumnFilters: true` line; an `initialState` left empty by that is removed.
- Each still shows what its name says under chips: the builder opens every one on the three bases (Storybook on a P6 port) and records one line per story in the tracker. A story whose point cannot be seen under chips (for example a custom filter component that only the subheader row renders) is named under `## Attention` and keeps its pin; it is not reworked here.
- Does NOT change columns, data, or any option other than the two lines.

#### 1.6.3 Tested subheader stories (D98)

Status `refactor`.

- `FilterModeMenuClosesInPlace` gets a subheader render of its own: the table of `FilteringChangeModeEnabled` moves to one local component that takes the display mode, used by both stories. Its play is unchanged.
- The 9 stories whose sidebar name does not say Subheader get `name: 'Subheader: <current sidebar name>'`; `SubheaderRangeFieldsNarrow` and `ModePickerByDefaultSubheader` already say it and are untouched. Export names stay, so story ids stay.
- Does NOT change any play, the 5 popover stories, the chips stories or `FilterChips.stories.tsx`.

**Stays unchanged:** every registry file, `stories/features/FilterChips.stories.tsx`, `DateFilters.stories.tsx`.

### 1.7 Dependencies and env: none

## 2. Instructions for AI

### 2.1 Milestones

### Milestone: Filtering stories show chips

- Files owned: `packages/shadcn-table/stories/features/Filtering.stories.tsx`
- Depends on: none
- Review: none
- Local CI: `pnpm test typecheck --base base`, `pnpm test typecheck --base radix`, `pnpm test typecheck --base aria`, `pnpm test lint`, `pnpm test storybook-tests --base base`, `pnpm test storybook-tests --base radix`, `pnpm test storybook-tests --base aria`
- Task 1: The 10 plain stories (1.6.2) and the shared local component for `FilterModeMenuClosesInPlace` (1.6.3). Checks: `ST_BASE=<base> pnpm exec vitest run stories/features/Filtering.stories.tsx` green on the three bases; the per-story line in the tracker
- Task 2: The 9 `name:` lines (1.6.3). Checks: the Storybook sidebar shows them (one screenshot, path in the tracker); the story ids in the URL are unchanged
- Task 3: Cleanup: unused imports and helpers left by the removed lines, `pnpm format`. Checks: 2.2

### 2.2 Checks

- `pnpm test typecheck --base base`, `pnpm test typecheck --base radix`, `pnpm test typecheck --base aria`, `pnpm test lint`, `pnpm test storybook-tests --base base`, `pnpm test storybook-tests --base radix`, `pnpm test storybook-tests --base aria` green; the Storybook server stopped
- The three Acceptance checks of 1.2
- Review: none (stories only)
