# Date picker version 9

Old section numbers, cited by earlier commits and agent notes: 2, 12, 13, 14 are in [date-picker-9-cases.md](date-picker-9-cases.md); 5, 6, 7, 8, 9, 11 and the Review notes are in [date-picker-9-design-notes.md](date-picker-9-design-notes.md).
Old sections 1, 3, 4 and 10 are condensed below, with their full text in the design notes. Where this plan and a reference file differ, this plan wins.

Paths: `components/` and `app/` mean `test-projects/next-app/...`; "7.4" means `components/date-picker-7-4`.

## 1. Architecture

### 1.1 Overview

Version 9 is one component, `<DatePicker type range? />`, rebuilt once from a plan in a new folder, `components/date-picker-9`. What a user sees and what `onChange` emits on 7.4 is frozen, apart from the listed fixes. The twelve pickers are built and committed in a flat folder. What is left is the owner's layout of 2026-11-22: folders, a `types.ts` for the public and shared types, no hook.

### 1.2 Goals

- One folder, 22 files: the entry, `types.ts`, `modes/`, `components/`, `utils/`.
- `types.ts` holds 28 types: the public ones and the ones two or more files use. 48 types stay at the top of the one file that uses them.
- No hook of our own. The range order is three plain functions.
- The restructure changes no behaviour, markup, class or type shape.
- Acceptance: `tsc`, `eslint` and `prettier` clean (2.2), and the comparison scripts give the same emitted values and the same pixels as before the restructure on all twelve rows, with only the allowed differences of the cases file.

### 1.3 Current structure

7.4, the frozen reference (22 files):

```
components/date-picker-7-4/
├── date-picker.tsx
├── modes/       date-mode, datetime-mode, period-mode, range-mode, time-mode, time-range-mode
├── components/  clock-popover, period-grid, picker-box, picker-calendar, picker-field, picker-frame,
│                picker-labels, picker-presets, picker-trigger, time-columns, time-field
├── hooks/       use-range-order.ts
└── utils/       date.utils, period.utils, popover.utils, range.utils
```

Version 9 as built today (21 files, flat, every type at the top of the file that first used it):

```
components/date-picker-9/
├── date-picker.tsx
├── day-picker.tsx, day-range-picker.tsx, time-range-picker.tsx, period-picker.tsx, period-range-picker.tsx
├── picker-field.tsx, picker-box.tsx, picker-trigger.tsx, picker-popup.tsx, picker-presets.tsx
├── day-calendar.tsx, period-views.tsx, view-nav.tsx, time-field.tsx, time-columns.tsx, labels.ts
└── values.ts, time.ts, range.ts, views.ts
```

### 1.4 Target structure

```
components/date-picker-9/
├── date-picker.tsx              ← entry only: DatePicker, the one switch, re-export of the public types
├── types.ts                     ← the public types and the types two or more files use
├── modes/
│   ├── day-picker.tsx           ← date and datetime, one value
│   ├── day-range-picker.tsx     ← date and datetime range
│   ├── time-range-picker.tsx    ← time range
│   ├── period-picker.tsx        ← week, month, year, one value
│   └── period-range-picker.tsx  ← week, month, year range
├── components/
│   ├── picker-field.tsx         ← the typed box
│   ├── picker-box.tsx           ← typed box whose button opens a popup
│   ├── picker-trigger.tsx       ← trigger button with its X that opens a popup
│   ├── picker-popup.tsx         ← the popover or dialog
│   ├── picker-presets.tsx       ← the presets row
│   ├── day-calendar.tsx         ← the stock Calendar as every picker draws it
│   ├── period-views.tsx         ← week calendar, month grid, year grid
│   ├── view-nav.tsx             ← previous, Today, next buttons of a header
│   ├── time-field.tsx           ← time box with its clock popover
│   ├── time-columns.tsx         ← the clock
│   └── labels.ts                ← the picker's words and their context
└── utils/
    ├── values.ts                ← the six value formats
    ├── time.ts                  ← time-of-day arithmetic
    ├── range.ts                 ← a pair's two ends, and their order
    └── views.ts                 ← which months, years or decades a view shows
```

- `type="time"` with one value has no mode file: the entry renders `TimeField`.
- No `hooks/` folder. No file name carries a suffix for its kind.
- Imports are relative inside the folder, because it is copied whole; stock parts come through `@/components/ui/...`.

### 1.5 Flow: none

### 1.6 Components

#### 1.6.1 Data artifacts: none

#### 1.6.2 Public types

What an app imports, from `@/components/date-picker-9/date-picker` and nowhere else. Written in `types.ts`, re-exported by the entry.

- Does: one union, written member by member, so a prop a type does not take fails to compile.
- Does NOT: offer `open` at the top level, `name`, `required`, `defaultValue`, hidden inputs or a display-format prop.

**Operations:**

| Operation | Status | Notes |
|---|---|---|
| The eight public types | keep | shapes as built; seven move into `types.ts` |
| `PickerLabels` | keep | stays in `components/labels.ts` as `typeof defaultLabels` (47 keys); `types.ts` passes it on |

**Interfaces:**

```ts
export type DatePickerType = "date" | "datetime" | "time" | "week" | "month" | "year"
/** A range: From, then To. "" is an empty end. */
export type RangeValue = [from: string, to: string]
/** A preset button: its text, and the value it sets, worked out at the click when a function. */
export type Preset<Value> = { label: string; value: Value | (() => Value) }
/** react-day-picker options the picker does not set itself. */
export type CalendarProps = Omit<
  PropsBase,
  "mode" | "required" | "month" | "defaultMonth" | "onMonthChange" | "numberOfMonths"
  | "components" | "hideNavigation" | "navLayout" | "fixedWeeks" | "today" | "timeZone"
> & { fixedWeeks?: boolean | "blank" }
/** The stock popover's, and the stock dialog's, open state and content props. */
type PopoverContentProps = Omit<React.ComponentProps<typeof PopoverContent>, "children">
export type PopoverProps = Pick<React.ComponentProps<typeof Popover>, "open" | "defaultOpen" | "onOpenChange"> &
  PopoverContentProps
export type DialogProps = Pick<React.ComponentProps<typeof Dialog>, "open" | "defaultOpen" | "onOpenChange"> &
  Omit<React.ComponentProps<typeof DialogContent>, "children" | "showCloseButton">

type PresentationProps =
  | { presentation?: "popover"; popoverProps?: PopoverProps; dialogProps?: never }
  | { presentation: "dialog"; popoverProps?: never; dialogProps?: DialogProps }
  | { presentation: "auto"; popoverProps?: PopoverProps; dialogProps?: DialogProps }
type One = { range?: false; value: string; onChange: (value: string) => void }
type Two = { range: true; value: RangeValue; onChange: (value: RangeValue) => void }
type WithPresets = (One & { presets?: Preset<string>[] }) | (Two & { presets?: Preset<RangeValue>[] })

type DateProps = PresentationProps & WithPresets & { type: "date"; step?: never; calendarProps?: CalendarProps }
type DateTimeProps = PresentationProps & WithPresets & { type: "datetime"; step?: number; calendarProps?: CalendarProps }
type TimeProps = { type: "time"; step?: number; presets?: never } & (
  | (One & { popoverProps?: PopoverProps })
  | (Two & { popoverProps?: PopoverContentProps })
)
type WeekProps = PresentationProps & WithPresets & {
  type: "week"; step?: never; calendarProps?: Omit<CalendarProps, "showWeekNumber" | "ISOWeek">
}
type MonthYearProps = PresentationProps & WithPresets & {
  type: "month" | "year"; step?: never; calendarProps?: Pick<CalendarProps, "locale" | "startMonth" | "endMonth">
}

/** Everything but the labels, which DatePicker gives to its context. */
export type TypedPickerProps = HtmlProps & Limits & { disabled?: boolean } &
  (DateProps | DateTimeProps | TimeProps | WeekProps | MonthYearProps)
export type DatePickerProps = TypedPickerProps & { labels?: Partial<PickerLabels> }
```

`step` is seconds, as the browser's attribute. Which prop applies to which type, with defaults and reasons: design notes 3.3.

#### 1.6.3 Where a type lives

The rule: `types.ts` holds the public types and every type two or more files of the folder use. A type one file uses stays at the top of that file and is not exported. Sorted against the built code, each name searched across the folder.

- Does: keep heading comments per group in `types.ts`; import with `import type` only.
- Does NOT: hold a type one file alone uses; import a component, mode or util file (its one import from the folder is the type `PickerLabels`).

In `types.ts`, 28 types:

| Group | Types | Status |
|---|---|---|
| public | `DatePickerType`, `RangeValue`, `Preset`, `CalendarProps`, `PopoverContentProps` (the popover's content props: half of `PopoverProps`, and all a time range offers), `PopoverProps`, `DialogProps`, `PresentationProps`, `One`, `Two`, `WithPresets`, `DateProps`, `DateTimeProps`, `TimeProps`, `WeekProps`, `MonthYearProps`, `TypedPickerProps`, `DatePickerProps` | keep, moved |
| values | `HtmlProps` (a `div`'s attributes without `defaultValue`, `onChange`, `children`), `Limits` (`{ min?: string; max?: string }`), `ControlProps<Value>`, `PeriodType` | keep, moved |
| range | `RangeEnd`, `RangeTimes` | keep, moved |
| clock | `ClockUnit` (one unit a clock column lists: `time.ts` works it out, `time-columns.tsx` draws it) | new |
| views | `ListBounds` | keep, moved |
| popup | `PopupOptions` (the three popup props as one plain object, for the picker's own parts), `PopupActions` | keep, moved |

Stays in its file, 48 types (status keep):

| File | Types |
|---|---|
| `modes/day-picker.tsx` | `DayPickerProps`, `DayPanelProps` |
| `modes/day-range-picker.tsx` | `DayRangePickerProps`, `DayRangePanelProps` |
| `modes/time-range-picker.tsx` | `TimeRangePickerProps` |
| `modes/period-picker.tsx` | `PeriodPickerProps`, `PeriodPanelProps` |
| `modes/period-range-picker.tsx` | `PeriodRangePickerProps`, `PeriodRangePanelProps` |
| `components/picker-field.tsx` | `PickerFieldProps`, `Draft` |
| `components/picker-box.tsx`, `picker-trigger.tsx`, `picker-popup.tsx`, `picker-presets.tsx` | `PickerBoxProps`, `PickerTriggerProps`, `PickerPopupProps`, `PickerPresetsProps<Value>`, one each |
| `components/day-calendar.tsx` | `DayCalendarProps`, `EndCaptionProps` |
| `components/view-nav.tsx` | `NavArrowProps`, `TodayButtonProps` |
| `components/period-views.tsx` | `ViewProps`, `WeekCalendarProps`, `PeriodViewProps`, `GridArrow`, `GridHeaderProps`, `GridCell`, `PeriodGridProps` |
| `components/time-field.tsx` | `TimeFieldProps`, `ClockPopoverProps` |
| `components/time-columns.tsx` | `TimeColumnsProps`, `TimeColumnProps` |
| `utils/values.ts` | `IgnoredProp`, `FormatPeriodInput` |
| `utils/time.ts` | `StepSearch`, `AllowedTimeInput`, `EdgeTimeInput`, `DayTimeLimitsInput`, `TimeOnDayInput`, `ClockInput`, `UnitList` |
| `utils/range.ts` | `PutEndInput`, `SelectRangeInput`, `FormatRangeInput`, `EndBoxes` |
| `utils/views.ts` | `ListSource`, `PeriodListSource`, `RangeViews`, `ShownViewsInput`, `EndBoundsInput` |

A type moves to `types.ts` in the change that gives it a second file, and not before.

#### 1.6.4 Files

Status is against what is built today. "keep, moved": `git mv` into its folder, imports edited, nothing else. "refactor": also loses the shared or public types named, which go to `types.ts`.

| File | Status | Single responsibility | Exports |
|---|---|---|---|
| `date-picker.tsx` | refactor: its 12 types | provide labels; check limits and step once; guard same-value once; pick the picker | `DatePicker`; re-exports the eight public types |
| `types.ts` | new | the 28 types of 1.6.3 | those types; `PickerLabels` passed on |
| `modes/day-picker.tsx` | keep, moved | box, calendar popup and, for datetime, the Time field | `DayPicker` |
| `modes/day-range-picker.tsx` | keep, moved | trigger, two end boxes and calendars, the two layouts | `DayRangePicker` |
| `modes/time-range-picker.tsx` | keep, moved | two time fields | `TimeRangePicker` |
| `modes/period-picker.tsx` | keep, moved | box and one view (version 9: a trigger for week and month) | `PeriodPicker` |
| `modes/period-range-picker.tsx` | keep, moved | trigger, two end boxes and two views (version 9: boxes for year only) | `PeriodRangePicker` |
| `components/picker-field.tsx` | keep, moved | one native or year input: draft, X, message, iOS overlay | `PickerField` |
| `components/picker-box.tsx` | keep, moved | `PickerField` plus a button that opens `PickerPopup` | `PickerBox` |
| `components/picker-trigger.tsx` | keep, moved | button with the value text, X, `PickerPopup` | `PickerTrigger` |
| `components/picker-popup.tsx` | refactor: `PopoverProps`, `DialogProps`, `PopupOptions`, `PopupActions` | decide popover or dialog; render it; say "phone dialog" | `PickerPopup`, `PhoneDialogContext` |
| `components/picker-presets.tsx` | refactor: `Preset` | buttons that set a value | `PickerPresets` |
| `components/day-calendar.tsx` | refactor: `CalendarProps` | stock `Calendar` with the picker's caption, limits, blank weeks, phone fill, range band | `DayCalendar` |
| `components/period-views.tsx` | keep, moved | one week calendar, month grid or year grid for a view | `PeriodView` |
| `components/view-nav.tsx` | keep, moved | the header's three buttons | `NavArrow`, `TodayButton` |
| `components/time-field.tsx` | keep, moved | time box plus clock popover | `TimeField`, `ClockPopover` |
| `components/time-columns.tsx` | keep, moved | the clock's columns | `TimeColumns` |
| `components/labels.ts` | keep, moved | default words and their context | `defaultLabels`, `LabelsContext`, `PickerLabels` |
| `utils/values.ts` | refactor: `HtmlProps`, `Limits`, `ControlProps`, `PeriodType` | parse, format and check the six formats | pure functions (design notes 4.1) |
| `utils/time.ts` | keep, moved | seconds, step, limits of a time of day | pure functions |
| `utils/range.ts` | refactor: `RangeValue`, `RangeEnd`, `RangeTimes` | read, replace, order and select a pair's ends | pure functions, 1.6.5 among them |
| `utils/views.ts` | refactor: `ListBounds` | the year list and a range's two views | pure functions |

#### 1.6.5 Range order

- Three plain functions in `utils/range.ts`, as built: `isReversed(range)`, `orderRange(range, times?)`, `leftBothBoxes(event, boxes)`.
- Two call sites per range picker: the panel's blur handler (focus left both end boxes and the pair is reversed: order it, reset the views) and the trigger's `onClose` (order it).
- No hook and no fourth function: each call site is two or three plain lines, and nothing shared holds React state, a ref or an effect.

**Operations:**

| Operation | Status | Notes |
|---|---|---|
| `isReversed`, `orderRange`, `leftBothBoxes` | keep | moved with `range.ts` |
| the four swap handlers in the two range mode files | keep | not extracted |

#### 1.6.6 Rules

Full text: design notes, section 10.

- File order in every file: `"use client"` (component files), imports, that file's own types, constants, code, one `export { ... }` list last.
- Props are a named type, `<Component>Props`. Three or more parameters take one object. Strict TypeScript, no `as` cast.
- Comments: JSDoc on exported API, or one sentence on a non-obvious invariant or a browser or library quirk. No dead code.
- Styling: stock Tailwind and shadcn parts; a class that changes a stock part must be a row of the override table (design notes, section 9) and carry its reason in one line.

Never:

- A hook of our own: no two components share logic that holds React state, refs or effects. A function that calls no React hook named `use...`. A one-line context reader. `useMemo`, `useCallback`.
- A type in `types.ts` that one file uses; a shared or public type outside `types.ts`, `PickerLabels` excepted; a type below a file's constants or code.
- A key handler, a `tabIndex`, a DOM query (`contains` in `leftBothBoxes` is the one DOM test), a `focus()` call in `PickerField`.
- An end read by index; a same-value test outside the entry; a limit or step check outside the entry.
- State that copies a prop, a reset on open, a flag that suppresses a handler, a context other than the two that exist.
- A generic or helper with one user; a prop a part takes only to hand on; a fix for one browser applied to all, except the listed ones.

#### 1.6.7 Stays unchanged

- Behaviour: every case of the cases file (ids G, B, D, DT, C, T, R, P, PR, U) and what `onChange` emits.
- Markup, class strings, the 7 states (8 from 9.1), 2 effects, 11 refs and 2 contexts (design notes, section 6).
- Every type's shape, and the public import path `@/components/date-picker-9/date-picker`.
- The cards of `app/date-filter-demo`, its `defaults.json` and `picks.json`, `_components/` and `_lib/`.
- `components/date-picker-7-4`, every other version folder, `components/date-picker`, `components/ui`.

### 1.7 Dependencies and env: none

No new package. Playwright 1.64.1 is loaded by absolute path from the `shadcn-react-table` repo, by scratch scripts only.

## 2. Instructions for AI

All work is in the `test-projects/next-app` repo: one commit per task, staged by explicit path, no push. The hard rules of the cases file (old section 14) hold for every task: port 3000 is the owner's server, read-only; no `next build`; no `git stash`; no iOS simulator.

### 2.1 Milestones

### Milestone: Twelve pickers (done)

- Files owned: `components/date-picker-9/*` (flat), new cards in `app/date-filter-demo/_cards/row-*.tsx`
- Depends on: none
- Review: fable, a reader with no history per step
- Local CI: none
- Task 1: date, one value. Done: `ac7600f`, fixes `26720f2`. Checks: 2.2; cases G, B, D, U on row 1
- Task 2: time, time range, datetime. Done: `1b8833e`, fixes `0df2d8a`, `8b26cf5`. Checks: 2.2; cases C, T, DT on rows 3, 5, 6
- Task 3: date and datetime range. Done: `bc7eddb`, fixes `65e719e`. Checks: 2.2; cases R on rows 2, 4
- Task 4: week, month, year, one value. Done: `4c8d55c`. Checks: 2.2; cases P on rows 7, 9, 11
- Task 5: week, month, year range. Done: `0d9919f`. Checks: 2.2; cases PR on rows 8, 10, 12

### Milestone: Restructure

- Files owned: every file of `components/date-picker-9`
- Depends on: Twelve pickers; the owner's read of this plan
- Review: none (the verify loop reviews it)
- Local CI: none
- Task 1: `git mv` each file into its folder of 1.4; fix the relative imports; create `types.ts` with the 28 types of 1.6.3 in their groups; leave the 48 others at the top of their file, `export` dropped where one was written. No hook extraction. No line is changed that is not an import, a type or an export list. Commit `date picker 9: step 6 folders and types.ts`. Checks: 2.2; `rg "function use[A-Z]" components/date-picker-9` finds nothing and no `hooks/` folder exists; each of the 48 names is found in one file only

### Milestone: Verify loop

- Files owned: any file of `components/date-picker-9`, for findings only
- Depends on: Restructure
- Review: fable
- Local CI: none
- Task 1: one round. One builder, code only. Then, side by side: a reader with no history reads all 22 files against this plan and the design notes, and a script runner reruns the comparison scripts of the cases file (emitted values and pixels, Chromium). The builder fixes what both report. Checks: 2.2; the reader finds nothing; the scripts match the cases file
- Task 2: repeat task 1 until both are clean, three rounds at most; after a third round that is not clean, stop and report. The last clean round also runs the pixels in WebKit and the type cases of the cases file (old section 12). Checks: as task 1, plus WebKit pixels and the type cases
- Task 3: Cleanup. Delete scratch files; confirm no file is left flat in `components/date-picker-9` and none imports a removed path; report line counts per file next to 7.4's 3,524. Checks: 2.2; `git status` shows only the owner's `defaults.json` and `picks.json`

### Milestone: Month box (9.1)

The owner's decision of 2026-11-22. `type="month"` is typed in a box, as the date of card 1.9 is: one value is `<input type="month">` in the box-with-calendar-button shell (`PickerBox` around `PickerField`); a range has a From and a To month box over its two grids, as the year range has. One plain month input for every browser. No browser test, no second code path.

Owner decision 2026-11-22, plain month input only: a plain `<input type="month">` and nothing else, no implementation for separate browsers. The input has no `pattern` and no placeholder of its own; a browser without the control (Firefox, desktop Safari) draws a text box that takes any text, and that is accepted.

- Files owned: `components/date-picker-9-1/*`, a full copy of `components/date-picker-9`, which stays frozen; one new card (letter `I`) in `app/date-filter-demo/_cards/row-9-month.tsx` and in `row-10-month-range.tsx`
- Depends on: Verify loop
- Review: fable, a reader with no history
- Local CI: none
- Task 1: `cp -R components/date-picker-9 components/date-picker-9-1`, then the four files of the table below; the two cards (version `9.1`, title "Month typed in a box", ids `fix-9i`, `fix-10i`, import `@/components/date-picker-9-1/date-picker`, the calls line of the `H` card). Commit `date picker 9.1: month and month range typed in a month input`. Checks: 2.2 on `components/date-picker-9-1`; `diff -rq components/date-picker-9 components/date-picker-9-1` lists the four files only; cases M and MR of the cases file (2.11, 2.12) on cards 9.I and 10.I in Chromium at 1280 by 800 and 390 by 844; on rows 9 and 10 every version 9 step that does not involve the trigger button gives the 9 card's value and calls lines on the 9.1 card; M15 once in WebKit at 1280

Against version 9:

| File | Status | Change |
|---|---|---|
| `components/picker-field.tsx` | refactor | `type` also takes `"month"`. `nativeInputs` gains the month row (last value `9999-12`); the month box takes `type`, `min` and `max` from its row exactly as the date box does. The refusal of a five-digit year reads the value's text (`/^\d{5,}-/`: five digits or more, then the hyphen) in place of `valueAsNumber >= Date.UTC(10000, 0, 1)`: a month input counts `valueAsNumber` in months, so the old test never refused one. For a date and a date-time the two tests agree on every value; the year box's text has no hyphen, so it is never refused, as in version 9 |
| `modes/period-picker.tsx` | refactor | week alone goes to `PickerTrigger`. Month and year share the one `PickerBox` branch; their three words (noun, button name, placeholder) come from one lookup by type. The month's placeholder is `selectMonth`, as the date box passes `selectDate`: it feeds the iOS overlay only |
| `modes/period-range-picker.tsx` | refactor | month and year share the one end-box branch (`PickerField` with `type={type}`); week keeps its two titles. The end box's placeholder is `selectMonth` for a month and `yearPlaceholder` for a year. New state `typing`, for month ends only (case MR4) |
| `components/labels.ts` | refactor | new key `month` ("Month": the box's noun, B10); `pickMonth` is removed, nothing reads it. 47 keys |
| the other 18 files | keep | byte for byte as in version 9 |

New pieces, each with what a user loses without it:

- `nativeInputs.month`: without it there is no month box.
- `/^\d{5,}-/` (replaces `yearTenThousand`): a month with a five-digit year would be stored, which is not `yyyy-MM` (B5).
- `labels.month`: the box's name and the X's name ("Clear Month").
- `typing` in `PeriodRangePanel`: a month box reports the years 2, 20 and 203 while 2031 is typed, exactly as a date box does (R13). Without the state the year list would run from year 0 on every typed year and both grids would jump there. The date range has the same state for the same reason; a year box reports whole years only, so it sets none and PR10 holds as built.

Stays unchanged: week (a trigger, one value and range); the month grid, its year select, arrows, Today, presets, limits; the popup (the range popup is as wide as its two month boxes, MR1); the month range's trigger and its text; every other type; the stored format `yyyy-MM`; `types.ts`; version 9's folder, cards and every other version.

### Milestone: Week box (9.2)

The owner's decision of 2026-11-22, with a link to MDN's page for `<input type="week">` ("Need to update this one as well"). `type="week"` is typed in a box, as the month of 9.1 is: one value is `<input type="week">` in the box-with-calendar-button shell (`PickerBox` around `PickerField`); a range has a From and a To week box over its two calendars. One plain week input for every browser. No `pattern`, no placeholder attribute, no browser test, no second code path, no check of our own. A browser without the control (Firefox, desktop Safari) draws a text box that takes any text, and that is accepted.

The stored value does not change and is the control's own: `periodFormats.week` in `utils/values.ts` is date-fns `RRRR-'W'II`, which writes `yyyy-Www` (ISO week-numbering year in four digits, `W`, the week in two digits). Checked against Chromium's control for 42,819 days from year 1 to 9999: `format(day, "RRRR-'W'II")` equals the value the control gives for that day, and `startOfPeriod` reads every one back. The picker reads neither `valueAsNumber` (milliseconds at the week's Monday, UTC) nor `step` (weeks): a week takes no `step` (`step?: never`), and the year test reads the value's text.

- Files owned: `components/date-picker-9-2/*`, a full copy of `components/date-picker-9-1`, which stays frozen; one new card in `app/date-filter-demo/_cards/row-7-week.tsx` and `row-8-week-range.tsx` (letter `I`) and in `row-9-month.tsx` and `row-10-month-range.tsx` (letter `J`), so the newest version carries one number on the four rows
- Depends on: Month box (9.1)
- Review: fable, a reader with no history
- Local CI: none
- Task 1: `cp -R components/date-picker-9-1 components/date-picker-9-2`, then the five files of the table below; the four cards (version `9.2`; title "Week typed in a box" on rows 7 and 8, "Month typed in a box" on rows 9 and 10; ids `fix-7i`, `fix-8i`, `fix-9j`, `fix-10j`; import `@/components/date-picker-9-2/date-picker`; the calls line of the row's newest card). Commit `date picker 9.2: week and week range typed in a week input`. Checks: 2.2 on `components/date-picker-9-2`; `diff -rq components/date-picker-9-1 components/date-picker-9-2` lists the five files only; `rg "pattern=|placeholder="` on the five files finds nothing new; cases W and WR of the cases file (2.13, 2.14) on cards 7.I and 8.I in Chromium at 1280 by 800 and 390 by 844; on rows 7 and 8 every version 9 step that does not involve the trigger button gives the 9 card's value and calls lines on the 9.2 card; cases M and MR on cards 9.J and 10.J give the lines of cards 9.I and 10.I. No WebKit or Firefox run: neither has a week control

Against version 9.1:

| File | Status | Change |
|---|---|---|
| `components/picker-field.tsx` | refactor | `type` also takes `"week"`. `nativeInputs` gains the week row (last value `9999-W52`, the last week of a four-digit year; no step base, a week takes no step); the week box takes `type`, `min` and `max` from its row exactly as the month box does. The refusal of a five-digit year (`/^\d{5,}-/`) already reads `10000-W01`. Three comments name the week. No other line |
| `modes/period-picker.tsx` | refactor | the trigger branch is removed: `boxWords` gains the week row (noun `week`, button name `selectWeek`, no placeholder) and every period type returns the one `PickerBox`. The imports of `PickerTrigger`, `formatPeriod`, `dateLibFor` and `outsideLimits` go with it |
| `modes/period-range-picker.tsx` | refactor | every end is a `PickerField`; the two `FieldTitle`s of the week range and their import go. The end box's placeholder comes from one lookup by type (none for a week, `selectMonth`, `yearPlaceholder`). `typing` is set for week ends as for month ends (case WR4) |
| `components/labels.ts` | refactor | new key `week` ("Week": the box's noun, B10); `pickWeek` is removed, nothing reads it. 47 keys |
| `components/picker-trigger.tsx` | refactor | the `popupActions` prop and the `PopupActions` import are removed: its one passer was the week branch of `PeriodPicker`. The week, month and year ranges and the date ranges still open from the trigger, and none of them closes on a pick |
| the other 17 files | keep | byte for byte as in version 9.1 |

New pieces, each with what a user loses without it:

- `nativeInputs.week`: without it there is no week box. Its `max` 9999-W52 holds the year part at four digits, as the date and month rows do (B5).
- `boxWords.week`: the box's noun and the calendar button's name, as month and year have.
- `labels.week`: the box's name when the app names nothing, and the X's name ("Clear Week").
- `typing` for week ends (the state exists since 9.1): a week box reports the years 2, 20 and 203 while 2031 is typed, as a month box does. Without it the year list would run from year 0 on every typed year and both calendars would jump there.

Removed, each with what read it:

- The `PickerTrigger` branch of `PeriodPicker`: its last user was the week. With it go the red trigger of P15 (the box flags itself, W5) and the trigger text "Week 47, 2026" for one value (the box shows the week as the browser writes it).
- `labels.pickWeek`: the week trigger's placeholder.
- `PickerTrigger`'s `popupActions` prop: the week branch of `PeriodPicker` passed it to close on a pick. `PickerPopup` keeps its own for `PickerBox`.
- No week placeholder: a placeholder on a native box feeds only the overlay drawn on every iOS (B9), and iOS before 18.2 has no week control (MDN browser-compat-data, `safari_ios` 18.2), so there it would be our text over a plain text box. A week box passes none, in the single picker and in the range's end boxes: nothing of ours is drawn in a week box on any browser. On iOS 18.2 or later an empty week box is as iOS draws it; not seen on a device.
- The `FieldTitle` pair of `PeriodRangePanel`: each end's box has a `FieldLabel` in its place.

Stays unchanged: the week calendar, its header, year and month selects, arrows, Today, week numbers, presets, limits; the popup; the week range's trigger, its text ("Week 44, 2026 - Week 47, 2026") and its X; the swap rule (`isReversed`, `orderRange`, `leftBothBoxes`), now reached by week ends too; month, year and every other type; the stored format `yyyy-Www`; `types.ts`; the folders of versions 9 and 9.1, their cards and every other version.

### Milestone: Full version (9.3)

The owner's request of 2026-11-22: one version that carries everything. 9.3 is 9.2 (month and week typed in a box) plus the Firefox rule chosen from the three icon variants, 9.1.3: Firefox's own picker button at the end of a date, date-time or time box is clipped away. Nothing else is new. The review of 9.3 then made one type stricter: `PickerTrigger`'s `onClose` is required, since both callers left after 9.2 pass it; no behaviour changes.

- Files owned: `components/date-picker-9-3/*`, a full copy of `components/date-picker-9-2`, which stays frozen; one new card, version `9.3`, title "Full version", in each of the twelve row files (letters `AH`, `AG`, `AM`, `BB`, `S`, `S`, `J`, `J`, `K`, `K`, `N`, `N` for rows 1 to 12); `app/date-filter-demo/page.tsx` and `_components/card-shell.tsx` for the top list
- Depends on: Week box (9.2); the 9.1.3 variant (brief: `firefox-icon-brief.md`)
- Review: none; both parts were reviewed where they were built
- Local CI: none
- Task 1: `cp -R components/date-picker-9-2 components/date-picker-9-3`, then the one file of the table below; the twelve cards, each a copy of its row's newest feature card (rows 1 to 6, 11 and 12: the 9 card; rows 7 to 10: the 9.2 card) with ids `fix-1ah`, `fix-2ag`, `fix-3am`, `fix-4bb`, `fix-5s`, `fix-6s`, `fix-7j`, `fix-8j`, `fix-9k`, `fix-10k`, `fix-11n`, `fix-12n` and import `@/components/date-picker-9-3/date-picker`; the "Picked / Default" list at the top of the page is removed, every section header shows it by version, and the "Save failed" notice stays. Commit `date picker 9.3: full version, 9.2 plus Firefox's icon removed by clipping; top summary removed`. Checks: 2.2 on `components/date-picker-9-3` and `app/date-filter-demo`; `diff -rq components/date-picker-9-2 components/date-picker-9-3` lists `picker-field.tsx` and, after the review, `picker-trigger.tsx`; the class change in `picker-field.tsx` is that of 9.1 against 9.1.3; Chromium at 1280 by 800: page 200, no console error, the 9.3 card first in each of the twelve sections, `clip-path: none` and `margin-right: 0` on the date box (the classes do not apply); Firefox 160: the date, date-time and time boxes of cards 1, 3 and 5 have the box geometry, `padding-right`, `margin-right` and `clip-path` of their 9.1.3 cards, a mouse click on every 4 px across the place of Firefox's button opens no Firefox picker, typing gives `2026-11-22`, `2026-11-22T14:45`, `14:45`; the week, month and year boxes have `clip-path: none` and `margin-right: 0`

Against version 9.2:

| File | Status | Change |
|---|---|---|
| `components/picker-field.tsx` | refactor | the input's `className` gains three classes under `supports-[-moz-appearance:none]:[&:is([type=date],[type=datetime-local],[type=time])]:`: `-mr-[calc(min(16px,1em)+0.525em)]`, `pr-0` and `[clip-path:inset(0_calc(min(16px,1em)+0.525em)_0_0)]`, with a three-line comment. The classes are byte for byte those of 9.1.3; the review of 9.3 added to the comment why `pr-0` is there and what the rule leaves (keyboard, right-to-left). Design notes section 9 row 33 |
| `components/picker-trigger.tsx` | refactor | review of 9.3: `onClose?: () => void` becomes `onClose: () => void`; both callers pass it, the third went in 9.2. Type only |
| the other 20 files | keep | byte for byte as in version 9.2 |

New piece, with what a user loses without it:

- The three Firefox classes: without them Firefox draws its own calendar button beside ours in a date, date-time and time box, two buttons for one job, and a click on it opens Firefox's picker in place of ours. The length is the width of Firefox's button from its `toolkit/content/widgets/datetimebox.css`, not a size of ours. A week or month box gets no button in Firefox (it draws a text field), so the selector leaves both alone.

Left on the keyboard in Firefox, known and accepted: Space in a date part still opens Firefox's picker, and so does Tab to the hidden button, then Enter. Right-to-left is not covered.

Stays unchanged: everything of 9.2 in every other browser (the classes sit behind `supports-[-moz-appearance:none]`); the WebKit rule `[&::-webkit-calendar-picker-indicator]:hidden`; `types.ts`; the folders of versions 9, 9.1, 9.1.1, 9.1.2, 9.1.3 and 9.2 and their cards.

### Milestone: Size jump fix (9.3.1)

- Cause: Firefox sizes a date-time box by its text, so a filled From or To box is 19 px wider than an empty one (192.67 to 211.7), and on a wide screen the popup of the date-time range took its width from those boxes: the boxes and both calendars grew 19 px, the calendars 16 px taller, the popup 37.6 by 16.3 px at the first pick. Versions 9 and 7.4 do the same; Chromium, the narrow popover and the phone dialog do not.
- Fix: `components/date-picker-9-3-1/modes/day-range-picker.tsx`, the rule the narrow screen already had now holds at every width: the date-time box has `contain-inline-size` (was `max-md:`) and its month `[--cell-size:--spacing(9)]` (was `max-md:`), so the month sets the width (252) and the box follows; the popup is 540 wide in every browser (was 492 in Chromium, 485 then 523 in Firefox). One new card `9.3.1`, "Full version, no size jump", per row (letters `AI`, `AH`, `AN`, `BC`, `T`, `T`, `K`, `K`, `L`, `L`, `O`, `O`); 9.3 stays frozen.
- Check: card 4.9.3.1 in Chromium at 1280 by 800 and 390 by 844 and in Firefox 160, popover and dialog: no box changes width or height from empty through two picks, a clock pick, a typed time, a cleared end; the closed control of rows 1 to 12, empty and filled, is the size of the 9.3 card's; the value and calls lines of rows 2 and 4 equal the 9.3 card's.

Week and month typed as text (9.3.1, second commit). Owner decision 2026-11-22, replacing for validation only the decision of the same day that removed every fallback piece: a browser with no week or month control (Firefox, desktop Safari) draws a text box, and what is typed there is checked. Still no browser detection, no second code path, no own text box, no placeholder.

- `components/picker-field.tsx`: the `nativeInputs` table gains a `pattern` column, month `[0-9]{4}-[0-9]{2}` (as MDN writes it), week `[0-9]{4}-W[0-9]{2}` (MDN's week page writes none); a browser with the control ignores it. Text off the pattern reads `""` and carries the browser's own message, as the year box does; a text on the pattern that is no real period (`2026-W99`, `2026-13`, week 53 of a 52-week year) reads `""` too, with the new label `invalidValue` ("Please enter a valid value."); a real value outside `min` or `max` is kept and gets the year box's `yearMin` or `yearMax` message, only where the browser has no message of its own. All three are marked once the box is left.
- Check: Firefox 160 on cards 7, 8, 9 and 10 of 9.3.1: typing `2026-W47` is one `onChange` call; `2026-W434`, `2026-W4`, `2026-W99`, `2026-13` give value `""` and a flagged box after leaving; a value outside Limits is kept and flagged; X clears; a pick after a bad text shows the pick with no flag; a pair typed in reverse still swaps. Chromium at 1280 by 800: the case scripts of rows 7 to 10 give the same lines on the 9.3.1 cards as on the 9.3 cards (only the `pattern` attribute differs).

### Milestone: No own message (9.3.2)

Owner decision 2026-11-23 ("remove the picker's own message, build 9.3.2"): the picker is always used inside a form wrapper (React Hook Form, TanStack Form) that shows its own error. So the picker shows no message and marks nothing invalid by itself. Nothing is added in its place: no prop that turns messages on, no callback that reports validity.

- Built from: `components/date-picker-9-3-1`, a full copy, which stays frozen. One new card `9.3.2`, "Full version, no own message", per row (letters `AJ`, `AI`, `AO`, `BD`, `U`, `U`, `L`, `L`, `M`, `M`, `P`, `P` for rows 1 to 12; ids `fix-1aj`, `fix-2ai`, `fix-3ao`, `fix-4bd`, `fix-5u`, `fix-6u`, `fix-7l`, `fix-8l`, `fix-9m`, `fix-10m`, `fix-11p`, `fix-12p`), each a copy of its row's 9.3.1 card with the import `@/components/date-picker-9-3-2/date-picker`.
- Folded in from the review of 9.3.1: the week pattern refuses year 0000, as the year box's does: `(?!0000)[0-9]{4}-W[0-9]{2}`; the comment on `isUnreal` says what it returns (true when the week or month does not exist).

Against version 9.3.1:

| File | Status | Change |
|---|---|---|
| `components/picker-field.tsx` | refactor | 298 lines to 228. Removed: the `FieldError` under the box and its `messageId`; the `Field` wrapper (the root is now the `InputGroup`); the own `aria-invalid` and the message id added to `aria-describedby`; the limit texts for a year, week or month; the effect that re-read the box on a new value or limit, and its `inputRef`; the draft's `message` and `left`; the `boxClassName` prop. The draft gains `filled` (the box holds a text or typed parts), read from `validity.badInput`, which the X and the iOS placeholder asked the message for before. A draft whose value is no longer the picker's is dropped in render, the job the effect did. Week pattern and `isUnreal` comment as above |
| `components/labels.ts` | refactor | `invalidValue`, `yearMin`, `yearMax` removed: only the message used them. 45 keys |
| `modes/period-range-picker.tsx` | refactor | the trigger no longer gets `aria-invalid` when an end is outside `min` or `max`; the app's `aria-invalid` reaches it through the rest props as given |
| `modes/day-range-picker.tsx` | refactor | the date-time box's classes go in `className` (was `boxClassName`) |
| the other 18 files | keep | byte for byte as in version 9.3.1 |

Stays, each with its reason:

- `aria-invalid`, `aria-describedby`, `id`, `aria-label`, `aria-labelledby` from the app reach the input or the trigger exactly as given: the form marks the control and ties its own message to it.
- `disabled`, and `required` on the Time field of the date-time popup (a date-time always has a time): native attributes.
- `min`, `max`, `step` and `pattern` on the input, and `title` on the year box: the browser's own control reads them (greyed parts, spin steps, the format hint), and `validity.patternMismatch` is how a text off its pattern is told from a value.
- The value rules: a text off its pattern, and a week or month that does not exist, give `""`; a typed value outside `min` or `max` is kept and passed on; a calendar pick replaces a bad text; a box that cannot be empty keeps the value when it is emptied; a year of five digits is not passed on; the X clears a box that holds a value or any text.
- The read of the box when it is left: the first part typed into an empty date box changes no value, so React sends no change, and the X would not show.
- `console.error` outside production for a `min`, `max` or `step` the picker ignores (`utils/values.ts`): a note to the developer, not a message of the control.
- `outsideLimits` (`utils/values.ts`): the month and year grids grey their buttons with it.

What a user loses: the red border and the text under a box that the picker drew by itself. The form draws both. The browser still knows the input is invalid (`:invalid`, `validity`); nothing in the picker or the stock styles shows it.

- Checks: 2.2 on `components/date-picker-9-3-2` and `app/date-filter-demo`; `diff -rq components/date-picker-9-3-1 components/date-picker-9-3-2` lists the four files of the table. Chromium at 1280 by 800: page 200, no console error, the 9.3.2 card first in each of the twelve sections; the closed control of rows 1 to 12 and the popups of rows 2, 3, 4, 8, 10 and 12 are the size of the 9.3.1 card's; the states of "9.3.2: allowed differences from 9.3.1" in `date-picker-9-cases.md` show no `role="alert"` and no `aria-invalid`, with the value line of 9.3.1; row 4's "Error from the form" still gives the trigger `aria-invalid` and `aria-describedby`. Firefox on cards 7, 8, 9 and 10 of 9.3.2: the value and calls lines of the 9.3.1 run, no flag and no message; `0000-W01` gives `""`.

### 2.2 Checks

From `test-projects/next-app`, one at a time, each under `nice`. Green means zero errors and zero warnings.

- `pnpm exec tsc --noEmit`
- `pnpm exec eslint components/date-picker-9 app/date-filter-demo`
- `pnpm exec prettier --check components/date-picker-9 app/date-filter-demo/_cards`
