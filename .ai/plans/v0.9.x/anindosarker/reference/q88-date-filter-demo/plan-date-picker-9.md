# Date picker version 9

Old section numbers, cited by earlier commits and agent notes: 2, 12, 13, 14 are in [date-picker-9-cases.md](date-picker-9-cases.md); 5, 6, 7, 8, 9, 11 and the Review notes are in [date-picker-9-design-notes.md](date-picker-9-design-notes.md).
Old sections 1, 3, 4 and 10 are condensed below, with their full text in the design notes. Where this plan and a reference file differ, this plan wins.

Paths: `components/` and `app/` mean `test-projects/next-app/...`; "7.4" means `components/date-picker-7-4`.

## 1. Architecture

### 1.1 Overview

Version 9 is one component, `<DatePicker type range? />`, rebuilt once from a plan in a new folder, `components/date-picker-9`. What a user sees and what `onChange` emits on 7.4 is frozen, apart from the listed fixes. The twelve pickers are built and committed in a flat folder. What is left is the owner's layout of 2026-11-22: folders, a `types.ts` for the public and shared types, no hook.

### 1.2 Goals

- One folder, 22 files: the entry, `types.ts`, `modes/`, `components/`, `utils/`.
- `types.ts` holds 27 types: the public ones and the ones two or more files use. 49 types stay at the top of the one file that uses them.
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
export type PopoverProps = Pick<React.ComponentProps<typeof Popover>, "open" | "defaultOpen" | "onOpenChange"> &
  Omit<React.ComponentProps<typeof PopoverContent>, "children">
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
  | (Two & { popoverProps?: Omit<PopoverProps, "open" | "defaultOpen" | "onOpenChange"> })
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

In `types.ts`, 27 types:

| Group | Types | Status |
|---|---|---|
| public | `DatePickerType`, `RangeValue`, `Preset`, `CalendarProps`, `PopoverProps`, `DialogProps`, `PresentationProps`, `One`, `Two`, `WithPresets`, `DateProps`, `DateTimeProps`, `TimeProps`, `WeekProps`, `MonthYearProps`, `TypedPickerProps`, `DatePickerProps` | keep, moved |
| values | `HtmlProps` (a `div`'s attributes without `defaultValue`, `onChange`, `children`), `Limits` (`{ min?: string; max?: string }`), `ControlProps<Value>`, `PeriodType` | keep, moved |
| range | `RangeEnd`, `RangeTimes` | keep, moved |
| clock | `ClockUnit` (one unit a clock column lists: `time.ts` works it out, `time-columns.tsx` draws it) | new |
| views | `ListBounds` | keep, moved |
| popup | `PopupOptions` (the three popup props as one plain object, for the picker's own parts), `PopupActions` | keep, moved |

Stays in its file, 49 types (status keep):

| File | Types |
|---|---|
| `modes/day-picker.tsx` | `DayPickerProps`, `DayPanelProps` |
| `modes/day-range-picker.tsx` | `DayRangePickerProps`, `DayRangePanelProps`, `RangeEndBoxProps` |
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
| `types.ts` | new | the 27 types of 1.6.3 | those types; `PickerLabels` passed on |
| `modes/day-picker.tsx` | keep, moved | box, calendar popup and, for datetime, the Time field | `DayPicker` |
| `modes/day-range-picker.tsx` | keep, moved | trigger, two end boxes and calendars, the two layouts | `DayRangePicker` |
| `modes/time-range-picker.tsx` | keep, moved | two time fields | `TimeRangePicker` |
| `modes/period-picker.tsx` | keep, moved | trigger (week, month) or box (year) and one view | `PeriodPicker` |
| `modes/period-range-picker.tsx` | keep, moved | trigger and two views; year boxes | `PeriodRangePicker` |
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
- Markup, class strings, the 7 states, 2 effects, 11 refs and 2 contexts (design notes, section 6).
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
- Task 1: `git mv` each file into its folder of 1.4; fix the relative imports; create `types.ts` with the 26 types of 1.6.3 in their groups; leave the 47 others at the top of their file, `export` dropped where one was written. No hook extraction. No line is changed that is not an import, a type or an export list. Commit `date picker 9: step 6 folders and types.ts`. Checks: 2.2; `rg "function use[A-Z]" components/date-picker-9` finds nothing and no `hooks/` folder exists; each of the 47 names is found in one file only

### Milestone: Verify loop

- Files owned: any file of `components/date-picker-9`, for findings only
- Depends on: Restructure
- Review: fable
- Local CI: none
- Task 1: one round. One builder, code only. Then, side by side: a reader with no history reads all 22 files against this plan and the design notes, and a script runner reruns the comparison scripts of the cases file (emitted values and pixels, Chromium). The builder fixes what both report. Checks: 2.2; the reader finds nothing; the scripts match the cases file
- Task 2: repeat task 1 until both are clean, three rounds at most; after a third round that is not clean, stop and report. The last clean round also runs the pixels in WebKit and the type cases of the cases file (old section 12). Checks: as task 1, plus WebKit pixels and the type cases
- Task 3: Cleanup. Delete scratch files; confirm no file is left flat in `components/date-picker-9` and none imports a removed path; report line counts per file next to 7.4's 3,524. Checks: 2.2; `git status` shows only the owner's `defaults.json` and `picks.json`

### 2.2 Checks

From `test-projects/next-app`, one at a time, each under `nice`. Green means zero errors and zero warnings.

- `pnpm exec tsc --noEmit`
- `pnpm exec eslint components/date-picker-9 app/date-filter-demo`
- `pnpm exec prettier --check components/date-picker-9 app/date-filter-demo/_cards`
