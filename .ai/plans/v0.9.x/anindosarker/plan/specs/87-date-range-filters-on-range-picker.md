# 87: Date range filters on the range picker
- Epic: E29

Follow the project planning rules: docs/code-of-conduct/planning-guidelines.md, CLAUDE.md:9. Keep the expedition contract.

## 1. Architecture

### 1.1 Overview

Table 0.9.8 moved the date filters onto `DatePicker` of shadcn-date-picker (spec 82, D164). A range kept its two boxes, each a single picker, and the owner saw it live: "Isn't this example using the wrong type of the date picker? Because I already added support for date range here." D183 puts the picker's own range mode in their place. In the same captures a consumer's width class pushed the calendar button out of its box; D184 moves that class to the outer box.

Both decisions change `ST_FilterTextField.tsx` on the three bases, so they are one spec and one milestone: one builder holds that file.

Paths below are under `packages/shadcn-table/registry/<base>/components/ui/shadcn-table/` unless they start at the repo root. Line numbers are the base tree at `origin/claude/review` `8006cd67`; radix and aria carry the same code at other lines. `picker:` paths are `packages/shadcn-table/registry/<base>/components/date-picker/`, the installed copy of shadcn-date-picker `v0.1.1`: approved code, read only here.

### 1.2 Goals

- A date, date-time or time filter that shows two date boxes today shows one `DatePicker` in range mode: one box with its two ends, one popup for both ends. That is every such filter in a range mode (`between`, `betweenInclusive`), whether the column declares `date-range`, `datetime-range` or `time-range` or reaches the mode through the mode menu (D183).
- The same in every filter place: chips editor, header editor, popover filter, subheader (D183).
- Every other mode keeps the single picker; a mode change swaps single and range picker and keeps what the mode menu keeps of the value today (D183).
- One end alone still filters: only a start, or only an end (D183).
- The filter value stays the pair `[min, max]`; filter functions, modes, option names and the exported types do not change (D183, P7).
- A `className` passed in `stFilterTextFieldProps` sizes the whole filter box on every filter kind; the calendar button and every other control stay inside the box border (D184).
- Number ranges (`range`, `inNumberRange`), the range slider, text columns in a between mode and a column with its own `Filter` render keep their two fields (D183).
- Acceptance: table 0.9.8 as it is live, `https://www.shadcn-table.com/docs/examples/subheader-filters` (Hire Date) and `https://www.shadcn-table.com/docs/examples/filter-variants` (Hire Date in the editor), and `https://www.shadcn-table.com/docs/examples/advanced` (Start Date editor, the button outside the box), captured before; the range box itself against the picker's own range demo, `https://date-picker.shadcn-table.com/docs/date`. After captures of the same places beside them; the tracker names every difference and its cause.

### 1.3 Current structure

```
components/head/ST_TableHeadCellFilterContainer.tsx:50  ← isRangeFilter → ST_FilterRangeFields (used by the subheader, the popover label :178 and ST_FilterEditor.tsx:142)
components/inputs/ST_FilterRangeFields.tsx:51           ← two ST_FilterTextField, rangeFilterIndex 0 and 1, in a two-column grid
components/inputs/ST_FilterTextField.tsx
├── :126  args { column, rangeFilterIndex, table } for the consumer's props functions
├── :186  placeholder Min / Max by rangeFilterIndex
├── :238  commitFilterValue writes one end of the pair
├── :428  a changed column value is read back per end
├── :560-650  datePickerBoxProps: one single DatePicker (value string), className :594 carries dateBoxProps.className
├── :657  the outer box, filterTextFieldVariants() and a minimum width per kind
└── :529, :745, :789  textFieldProps.className on the inner input, the select trigger, the combobox chips
components/toolbar/ST_HeaderFilterEditor.tsx:28-37      ← a wider editor for a date-like range
shared/utils/column.utils.ts:262                        ← isRangeFilter: a range variant or a between mode
picker: types.ts:66-79                                  ← range: true, value [from, to], onChange([from, to])
picker: utils/range.ts:31-37                            ← putEnd writes one end; isReversed ignores an empty end
picker: date-picker.tsx:47-86                           ← DayRangePicker, TimeRangePicker, PeriodRangePicker
```

### 1.4 Target structure

```
components/inputs/ST_FilterRangeFields.tsx   ← a date-like range without columnDef.Filter: one ST_FilterTextField for the pair; every other range: the two fields as today
components/inputs/ST_FilterTextField.tsx     ← the date branch renders DatePicker with range and the pair when it stands for the pair; the consumer's className on the outer box only
```

**Stays unchanged:** `picker:` files and the `components/ui/*.tsx` parts; `types.ts` and `index.ts` exports (P7); filter functions, `ST_FilterOptionMenu.tsx` mode rules, `filterSummary.utils.ts` (the chip text reads the pair); `tools/`, `package.json`, the lockfile; `DATE_PICKER_TAG`.

### 1.5 Flow

```
range mode + date-like variant
  → ST_FilterRangeFields → one ST_FilterTextField (the pair)
    → DatePicker range value=[min, max]
      onChange([from, to]) → the pair is committed by the rules of D88
  → column.setFilterValue([min, max])   (same shape as today)
```

### 1.6 Components

#### 1.6.1 One end only, proven first (D183)

- Before any table code changes: a story in the table's Storybook renders `DatePicker` with `range` for `date`, `datetime` and `time` on each base, and a play types a start only, then an end only, and reads `onChange`. Read so far, not run: `picker: utils/range.ts:31-37` writes one end and leaves the other `''`.
- The pair must reach the table with one end set for the three types on the three bases. If one of them cannot, the milestone stops there with a queue card naming the type, the base and the picker line. No workaround in the table, no edit of the picker (D176, D177: a change to the approved code is the owner's).
- The proof story is deleted before the merge unless it is one of the plays of 1.6.4.

#### 1.6.2 The range picker in the filter box (D183)

- `ST_FilterRangeFields` decides: a date-like variant (`date`, `datetime`, `time` and their `-range` forms) with no `columnDef.Filter` gets one field for the pair; everything else keeps the two-field grid. The mode caption below stays.
- The field for the pair mounts the same `DatePicker` the single box mounts, with `range`, the pair as value and the type and step of today. One clear control for the box, as spec 82 1.6.2 settled it; clearing empties both ends.
- Commit rules are those of D88 and of the fix of Q171, per end: a complete typed end applies on Enter and on blur, a pick in the popup applies at once, a half-typed end never applies. A pick equal to the typed value still applies.
- A changed column value (stored view, Clear filters, Remove filter, a mode change) is read back into both ends.
- Labels: the two ends are named by `localization.min` and `localization.max` through the picker's `labels`, where the picker offers a label per end; otherwise the picker's own range labels stay and the tracker says so. No new localization key.
- `table.refs.filterInputRefs`: keys `<column id>-0` and `<column id>-1` keep pointing at the start and the end input, so focus-on-open and the code that reads them work as today.
- The consumer's props functions (`stFilterDatePickerProps`, `stFilterDateTimePickerProps`, `stFilterTimePickerProps`, `stFilterTextFieldProps`) are called once for the box, with `rangeFilterIndex: 0`; what D175 forwards (`min`, `max`, `step`, `disabled`, `id`, `className`, `style`, `aria-*`, `data-*`, `onFocus`, `onBlur`, `onKeyDown`) applies to the one box. The changelog names this: a function that returned different props for index 1 no longer has a second box.
- Width: the one box takes the width the two boxes had, by the grid and stock Tailwind classes, no pixel value. In the subheader a column narrower than the box still clips it (the container's `contain-inline-size` stays). `ST_HeaderFilterEditor.tsx:28-37` is read: its wider editor for a date-like range stays if the box needs it, and goes if it does not; the captures decide.
- Code that only served the per-end date box and has no reader left is removed; nothing that stays is refactored.

#### 1.6.3 The width class on the outer box (D184)

- `textFieldProps.className` (and the `dateBoxProps.className` built from it) is applied once, on the outer box (`:657`), and leaves the picker's group (`:594`), the inner input (`:529`), the select trigger (`:745`) and the combobox chips (`:789`), on the three bases.
- The Advanced example keeps its class (`apps/shadcn-table-docs/examples/<base>/advanced/TS.tsx:139`).
- The changelog names it: a class meant for the inner input's text now lands on the box.

#### 1.6.4 Stories, examples, docs

- Plays, each run on the shipped code first; the failure is in the tracker (P11):
  - D184: a date filter with a width class; the calendar button's box lies inside the filter box's box. One per base.
  - D183: a date range column and a date column switched to `between`, each in the chips editor and the subheader: one box, a start alone filters, an end alone filters, both filter, a pick applies at once, clear empties both. The same once for `datetime` and `time`.
- Existing plays that drive the Min and Max date boxes (`DateFilters.stories.tsx`, `FilterChips.stories.tsx`, `Filtering.stories.tsx`, `Customization.stories.tsx`, `ServerData.stories.tsx`, `ViewSettings.stories.tsx`) are run before any edit and changed only where they fail. Story names and ids do not change, so no docs address changes.
- Story pages under `apps/shadcn-table-docs/content/docs/examples/more/` and `content/docs/guides/column-filtering.mdx` that describe two date boxes are reworded to what the page now shows; pages about number ranges are untouched.
- The examples need no source change. The docs copies are regenerated with `pnpm lib:install <base>`.
- `CHANGELOG.md`: one `#### Spec 87` block under `## Unreleased`.

#### 1.6.5 Checks

- Type check, lint and `validate-repo` on the three bases.
- `git diff --stat origin/claude/review -- 'packages/shadcn-table/registry/*/components/date-picker' 'packages/shadcn-table/registry/*/components/ui/*.tsx' tools package.json pnpm-lock.yaml` prints nothing.
- `git diff origin/claude/review -- 'packages/shadcn-table/registry/*/components/ui/shadcn-table/types.ts' 'packages/shadcn-table/registry/*/components/ui/shadcn-table/index.ts' | grep '^-export'` prints nothing (P7).
- Captures before and after, per base at 1280 and 390 wide: subheader date range, chips editor date range, header editor date range, popover filter date range, the Start Date editor of the Advanced example. One tracker line per capture pair.
- Storybook tests, docs E2E and installation E2E, one base at a time (P5).

### 1.7 Dependencies and env

- Table 0.9.8 on `origin/claude/review`, the picker at `v0.1.1` in the three trees.
- No new package. No release in this spec.

## 2. Instructions for AI

### 2.1 Milestones

### Milestone: Date range filters on the range picker

- Files owned: `packages/shadcn-table/registry/base/components/ui/shadcn-table/components/inputs/ST_FilterTextField.tsx`, `packages/shadcn-table/registry/radix/components/ui/shadcn-table/components/inputs/ST_FilterTextField.tsx`, `packages/shadcn-table/registry/aria/components/ui/shadcn-table/components/inputs/ST_FilterTextField.tsx`, `packages/shadcn-table/registry/base/components/ui/shadcn-table/components/inputs/ST_FilterRangeFields.tsx`, `packages/shadcn-table/registry/radix/components/ui/shadcn-table/components/inputs/ST_FilterRangeFields.tsx`, `packages/shadcn-table/registry/aria/components/ui/shadcn-table/components/inputs/ST_FilterRangeFields.tsx`, `packages/shadcn-table/registry/base/components/ui/shadcn-table/components/toolbar/ST_HeaderFilterEditor.tsx`, `packages/shadcn-table/registry/radix/components/ui/shadcn-table/components/toolbar/ST_HeaderFilterEditor.tsx`, `packages/shadcn-table/registry/aria/components/ui/shadcn-table/components/toolbar/ST_HeaderFilterEditor.tsx`, `packages/shadcn-table/stories/features/DateFilters.stories.tsx`, `packages/shadcn-table/stories/features/FilterChips.stories.tsx`, `packages/shadcn-table/stories/features/Filtering.stories.tsx`, `packages/shadcn-table/stories/features/Customization.stories.tsx`, `packages/shadcn-table/stories/features/ServerData.stories.tsx`, `packages/shadcn-table/stories/features/ViewSettings.stories.tsx`, `apps/shadcn-table-docs/content/docs/guides/column-filtering.mdx`, `apps/shadcn-table-docs/content/docs/examples/more`
- Depends on: none
- Review: fable
- Local CI: `pnpm test typecheck`, `pnpm test lint`, `pnpm test validate-repo`, `pnpm test storybook-tests`, `pnpm test docs-e2e`, `pnpm test installation-e2e`, the last three one base at a time (P5)
- Task 1: One end only, proven in the picker (1.6.1, D183). Checks: the proof play passes for `date`, `datetime` and `time` with `ST_BASE=base`, `radix`, `aria`, nine lines in the tracker; a failing line stops the milestone with a queue card and no table code is changed
- Task 2: The site map and the before captures (1.6.5). Checks: the tracker lists every line of the three `ST_FilterTextField.tsx` that reads `rangeFilterIndex` or a consumer `className`, and every story, docs page and test that drives two date boxes, each with what happens to it; 30 before captures (five places, three bases, two widths) under `test/.out/spec87/before/`
- Task 3: The width class on the outer box, the three bases (1.6.3, D184). Checks: the D184 play fails on `origin/claude/review` on each base, the lines in the tracker, and passes after; `pnpm test typecheck --base base`, `--base radix`, `--base aria` green
- Task 4: The range picker in the box, Base UI first, then Radix and React Aria (1.6.2, D183). Checks: the D183 plays fail on `origin/claude/review` and pass after on the three bases; `pnpm test typecheck` green per base; the two `git diff` commands of 1.6.5 print nothing; `pnpm -w registry:build` passes
- Task 5: The existing plays and the look (1.6.4, 1.6.5). Checks: `pnpm test storybook-tests --base base`, `--base radix`, `--base aria` green; 30 after captures under `test/.out/spec87/after/` and 30 tracker lines; a difference a user would notice that no decision covers is a queue card with its two captures
- Task 6: Docs texts, docs copies, the changelog (1.6.4). Checks: `pnpm lib:install base`, `radix`, `aria` run clean; `pnpm --filter shadcn-table-docs types:check` green; `pnpm test docs-e2e --base base`, `--base radix`, `--base aria` green; `pnpm test installation-e2e` green; `pnpm test lint` and `pnpm test validate-repo` green; `grep -c '^#### Spec 87' CHANGELOG.md` prints `1`
- Does NOT edit a file under `packages/shadcn-table/registry/*/components/date-picker` or a `components/ui/*.tsx` part; does NOT change an exported type or add an option; does NOT rename a story; does NOT touch number ranges, the range slider or a custom `Filter` render; does NOT release.

### 2.2 Checks

- The checks of each task above and of 1.6.5; the known flakes of P5 are rerun once before a check counts as failed.
