# Date picker 9: design notes

Builders and reviewers read this; the owner's review is of [plan-date-picker-9.md](plan-date-picker-9.md).
Moved verbatim from the plan as it stood at commit faf90bc3, under the old section numbers, so "section N" reads as before. Sections 2, 12, 13 and 14 are in [date-picker-9-cases.md](date-picker-9-cases.md). Sections 1, 3, 4 and 10 are also condensed in the plan; where the two differ, the plan wins.
Paths: `app/` and `components/` mean `test-projects/next-app/...`; `ui/` means `components/ui`; `nm/` means `node_modules`; "7.4" means `components/date-picker-7-4`.
Every stock source line below was opened in the planning run (Base UI 1.9.0, react-day-picker 10.0.2, date-fns 4).

## 1. Goal and frame

- Version 9 is a new folder, `components/date-picker-9`, written from this plan. No file is copied from an older version; 7.4 is read only to check behaviour and to copy the class strings section 9 names.
- Frozen: what a user sees and what `onChange` emits on 7.4. The owner tested and approved it.
- Changed on purpose, and nothing else:
  - Owner calls: review-notes decisions 1 to 5 and calls 6 to 9 (one-route swap, stock popover with no focus trap, year as a four-digit text box, open state inside `popoverProps` and `dialogProps`, no hand-written arrow keys, file order), and the owner's folder layout and `types.ts` for the public and shared types, of 2026-11-22 (section 4).
  - Defects of audit 7 sections 6 and 7, and one more found in the plan review (DT11: the step base of the Time field and clock on a day other than `min`'s). Each is marked "7.4 wrong" in section 2.
  - The behaviour side of the audit's clear-cut removals (1.1, 1.2, 1.5, 1.8, 2.2, 2.5, 4.11, 11.1). Each is marked "differs from 7.4" in section 2.
- Looks are pixel-frozen (owner call 9, and call 8's rule: "where the look the owner approved would change, keep it and write its reason in one line"). An audit item whose fix would move a pixel is kept as a listed override in section 9 with its reason, not removed.
- Done means: section 13 passes. Twelve version 9 cards, the same emitted values as 7.4 for the named actions, pixel comparison clean except the listed differences, a final strict audit that finds nothing clear-cut.
- Rule for the implementer: where this plan and 7.4 disagree and the case is not listed here, stop and report. Never fill a gap with new machinery.

## 3. Public API

### 3.1 Exported types

All are written in `types.ts` (4.2) and re-exported by `date-picker.tsx`, so an app imports them from `@/components/date-picker-9/date-picker` and from nowhere else.

| Type | Written in |
|---|---|
| `DatePickerProps`, `DatePickerType`, `RangeValue`, `Preset`, `CalendarProps`, `PopoverProps`, `DialogProps` | `types.ts`, group "public" |
| `PickerLabels` | `components/labels.ts`, as the type of its `defaultLabels` table (4.2); `types.ts` passes it on |

`Popover`, `PopoverContent`, `Dialog` and `DialogContent` below are the stock parts, which `types.ts` imports with `import type` from `@/components/ui/...`.

```ts
export type DatePickerType =
  | "date"
  | "datetime"
  | "time"
  | "week"
  | "month"
  | "year"

/** A range: From, then To. "" is an empty end. */
export type RangeValue = [from: string, to: string]

/** A preset button: its text, and the value it sets, worked out at the click when a function. */
export type Preset<Value> = { label: string; value: Value | (() => Value) }

/** The picker's own words; every key has an English default. */
export type PickerLabels = typeof defaultLabels

/**
 * react-day-picker options the picker does not set itself. Dates are local,
 * so today and timeZone are not offered.
 */
export type CalendarProps = Omit<
  PropsBase,
  | "mode"
  | "required"
  | "month"
  | "defaultMonth"
  | "onMonthChange"
  | "numberOfMonths"
  | "components"
  | "hideNavigation"
  | "navLayout"
  | "fixedWeeks"
  | "today"
  | "timeZone"
> & {
  /** "blank" keeps six rows and hides a row of only other months' days. */
  fixedWeeks?: boolean | "blank"
}

/** The stock popover's content props. */
type PopoverContentProps = Omit<
  React.ComponentProps<typeof PopoverContent>,
  "children"
>

/** The stock popover's open state and content props. */
export type PopoverProps = Pick<
  React.ComponentProps<typeof Popover>,
  "open" | "defaultOpen" | "onOpenChange"
> &
  PopoverContentProps

/** The stock dialog's open state and content props. */
export type DialogProps = Pick<
  React.ComponentProps<typeof Dialog>,
  "open" | "defaultOpen" | "onOpenChange"
> &
  Omit<React.ComponentProps<typeof DialogContent>, "children" | "showCloseButton">
```

### 3.2 `DatePickerProps`, as written in `types.ts`, re-exported by `date-picker.tsx`

```ts
/** Each presentation takes the props of the popup it shows; auto shows either. */
type PresentationProps =
  | { presentation?: "popover"; popoverProps?: PopoverProps; dialogProps?: never }
  | { presentation: "dialog"; popoverProps?: never; dialogProps?: DialogProps }
  | { presentation: "auto"; popoverProps?: PopoverProps; dialogProps?: DialogProps }

/** One value. */
type One = {
  range?: false
  value: string
  onChange: (value: string) => void
}

/** A range. */
type Two = {
  range: true
  value: RangeValue
  onChange: (value: RangeValue) => void
}

type WithPresets =
  | (One & { presets?: Preset<string>[] })
  | (Two & { presets?: Preset<RangeValue>[] })

/** A prop a type does not take is written as never, so the type says so. */
type DateProps = PresentationProps &
  WithPresets & { type: "date"; step?: never; calendarProps?: CalendarProps }

type DateTimeProps = PresentationProps &
  WithPresets & {
    type: "datetime"
    /** Seconds, as the browser's step attribute. */
    step?: number
    calendarProps?: CalendarProps
  }

type TimeProps = { type: "time"; step?: number; presets?: never } & (
  | (One & { popoverProps?: PopoverProps })
  | (Two & { popoverProps?: PopoverContentProps })
)

type WeekProps = PresentationProps &
  WithPresets & {
    type: "week"
    step?: never
    calendarProps?: Omit<CalendarProps, "showWeekNumber" | "ISOWeek">
  }

type MonthYearProps = PresentationProps &
  WithPresets & {
    type: "month" | "year"
    step?: never
    calendarProps?: Pick<CalendarProps, "locale" | "startMonth" | "endMonth">
  }

export type DatePickerProps = HtmlProps &
  Limits & {
    disabled?: boolean
    labels?: Partial<PickerLabels>
  } & (DateProps | DateTimeProps | TimeProps | WeekProps | MonthYearProps)
```

`HtmlProps` and `Limits` are in group "values" of `types.ts`:

```ts
/** Attributes for the picker's root; id and aria-* reach the control. */
export type HtmlProps = Omit<
  React.ComponentProps<"div">,
  "defaultValue" | "onChange" | "children"
>

/** The earliest and latest value allowed, in the type's own value format. */
export type Limits = { min?: string; max?: string }
```

- No generic builds a member. `PresentationProps`, `One`, `Two`, `WithPresets` are plain unions; each type row is one intersection a reader can follow.
- `PresentationProps` is the public shape only, defined once, in group "public" of `types.ts`: decision 1 is about what an app may write. Inside the picker the three props travel as one plain object type, `PopupOptions`, defined once in group "popup" of `types.ts`:

```ts
/** The three popup props as the picker's own parts take them, by name. */
type PopupOptions = {
  presentation?: "popover" | "dialog" | "auto"
  popoverProps?: PopoverProps
  dialogProps?: DialogProps
}
```

- Reason for two types: a union loses its link between `presentation` and the two objects once its members are destructured, so a shell that names the three and hands them on would need a cast (TS2345). Every member of `PresentationProps` is assignable to `PopupOptions`, so the entry's rest spread compiles with no cast, and no part needs one.
- The two `never` kinds (`step` on four rows, `presets` on time) are the only fillers. Reason: the entry reads `step` and `presets` from any member (audit 12 keeps the entry's destructuring), and the type states that the prop does not exist there.

### 3.3 Which prop applies to which type

| Prop | date | datetime | time | week | month, year | Default | Why it applies there |
|---|---|---|---|---|---|---|---|
| `type` | yes | yes | yes | yes | yes | required | what is picked; the browser's `<input type>` words |
| `range` | yes | yes | yes | yes | yes | `false` | one value or a pair |
| `value`, `onChange` | yes | yes | yes | yes | yes | required | the app owns the value; string or `RangeValue` by `range` |
| `disabled` | yes | yes | yes | yes | yes | `false` | - |
| `min`, `max` | yes | yes | yes | yes | yes | none | plain strings, checked when used; computed strings compile (4.3) |
| `step` | no | yes | yes | no | no | none: every minute | only types with a time; day steps do not work in browsers (proposal) |
| `presentation` | yes | yes | no | yes | yes | `"popover"` | types with a calendar or grid popup; the clock is always a popover |
| `popoverProps` | yes | yes | yes | yes | yes | none | with `presentation` popover or auto; on time, the clock's popover |
| `dialogProps` | yes | yes | no | yes | yes | none | with `presentation` dialog or auto |
| `calendarProps` | full | full | no | no `showWeekNumber`, `ISOWeek` | `locale`, `startMonth`, `endMonth` | `fixedWeeks: "blank"`, `captionLayout: "dropdown"` | only options the picker would act on are offered |
| `presets` | yes | yes | no | yes | yes | none | a row under the calendar or grid; time has no popup to hold one |
| `labels` | yes | yes | yes | yes | yes | English | the picker's own text |
| HTML attributes | yes | yes | yes | yes | yes | - | `id`, `aria-label`, `aria-labelledby`, `aria-describedby`, `aria-invalid` go to the control (the input or the trigger button; for a time range see T4); the rest to the root |

Not props, never to be added: `open`, `defaultOpen`, `onOpenChange` at the top level, `name`, `required`, `form`, hidden inputs, `defaultValue`, a display-format prop.

### 3.4 `PickerLabels` keys (47)

`from`, `to`, `done`, `close`, `clear(name)`, `goToToday`, `selectDate`, `selectDateTime`, `selectTime`, `selectTimeFor(end)`, `emptyEnd`, `rangeJoin`, `date`, `dateTime`, `time`, `dateRange`, `dateTimeRange`, `pickDateRange`, `pickDateTimeRange`, `hour`, `minute`, `second`, `amPm`, `am`, `pm`, `weekValue(week, year)`, `year`, `yearPlaceholder`, `yearFormat`, `yearMin(min)`, `yearMax(max)`, `decade(first, last)`, `selectWeek`, `selectMonth`, `selectYear`, `weekRange`, `monthRange`, `yearRange`, `pickWeek`, `pickMonth`, `pickWeekRange`, `pickMonthRange`, `pickYearRange`, `previousYear`, `nextYear`, `previousYears`, `nextYears`.

- Version 9.1 has 47 keys too: `month` is added (the month box's noun), `pickMonth` is removed (the month trigger is gone). No `monthPlaceholder`: owner decision 2026-11-22, plain month input only.
- Version 9.2 has 47 keys too: `week` is added (the week box's noun, "Week"), `pickWeek` is removed (the week trigger is gone). `weekValue` stays: the week range's trigger writes its two ends with it.
- Default texts are 7.4's, unchanged (the visible text is frozen: `pickDateRange` stays "Pick a date").
- Against 7.4: `today` is now `goToToday`, `period` is now `amPm` (8.8); new `date` "Date" and `dateTime` "Date and time" (the box's noun, 7.1); new `decade`, default `first`, space, en dash, space, `last` as 7.4 draws it (10.6); gone `value`, `none`, `pickerValue`, `pickDateFirst`.

## 4. File layout

Three folders under one entry, 22 files. Reason: the owner's decisions of 2026-11-22 (Review notes): the layout of the earlier versions (`review-notes.md` line 23: "Layout decided by the owner: `date-picker.tsx` entry only, `modes/`, `components/`, `hooks/`, `utils/` ...") without `hooks/`, because the picker has no hook of its own ("if there is no hook needed, thats fine"; section 10), plus one `types.ts` for the types an app imports and the types more than one file uses ("if types are used by other components or other places, that means types.ts earns its place").

- `date-picker.tsx` is the entry only: `DatePicker`, `TypedPicker`, the re-export of the public types.
- `types.ts` holds the public types and every type two or more files use (4.2). A type one file uses stays at the top of that file.
- `modes/` holds one file per picker the entry can choose. `type="time"` with one value has no mode file: the entry renders `TimeField` directly.
- `components/` holds every part a mode draws. `labels.ts` sits there because it holds a React context.
- `utils/` holds the pure functions (4.1). No JSX, no React call.
- There is no `hooks/` folder: no hook of our own exists (section 10).
- File names carry no suffix for their kind (no `.utils`, no `.types`). No two files share a name, so in the sections below a bare file name (`range.ts`, `picker-popup.tsx`) means that file in its folder of the tree.
- Imports: relative between the folders and inside one (`../components/picker-field`, `./picker-popup`, `../types`), because the folder is copied whole; stock parts through `@/components/ui/...`. The types of `types.ts` are imported with `import type`, and by an app from `date-picker.tsx`.

```
components/date-picker-9/
├── date-picker.tsx              ← entry only: DatePicker, the one switch
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
    ├── range.ts                 ← a pair's two ends
    └── views.ts                 ← which months, years or decades a view shows
```

| File | Single responsibility | Exports | Upper bound: nothing else goes in | Why it exists |
|---|---|---|---|---|
| `date-picker.tsx` | Provide labels; check limits and step once; guard same-value once; pick the picker | `DatePicker`; re-exports the types of 3.1 | entry only: no markup beyond the provider and the six picker elements, no type of its own | one component for six types |
| `types.ts` | The public types and the types two or more files use, in the groups of 4.2 | every type it declares; `PickerLabels` passed on | types only: no value, no function, no JSX; no type that one file alone uses; `import type` only, from React, Base UI, react-day-picker, the stock `ui/` parts and `components/labels.ts` | the owner's decision: a type used in other places earns `types.ts` its place |
| `components/labels.ts` | Default words and `LabelsContext` | `defaultLabels`, `LabelsContext`, `PickerLabels` | no component, no hook, no JSX; readers call `React.useContext(LabelsContext)`; `PickerLabels` is declared here though public (4.2) | the `labels` prop, read by about twelve components |
| `modes/day-picker.tsx` | Box, calendar popup and, for datetime, the Time field | `DayPicker` | `DayPicker`, `DayPanel` | rows 1 and 3 |
| `modes/day-range-picker.tsx` | Trigger, the two end boxes and calendars, the two layouts | `DayRangePicker` | `DayRangePicker`, `DayRangePanel` | rows 2 and 4 |
| `modes/time-range-picker.tsx` | Two time fields | `TimeRangePicker` | one component | row 6 |
| `modes/period-picker.tsx` | Trigger (week, month) or box (year) and one view | `PeriodPicker` | `PeriodPicker`, `PeriodPanel` | rows 7, 9, 11 |
| `modes/period-range-picker.tsx` | Trigger and two views; year boxes | `PeriodRangePicker` | `PeriodRangePicker`, `PeriodRangePanel` | rows 8, 10, 12 |
| `components/picker-field.tsx` | One native or year input: draft, X, message, iOS overlay | `PickerField` | one component, `draftOf`, the input table | nine call sites type a value |
| `components/picker-box.tsx` | `PickerField` plus a calendar button that opens `PickerPopup` | `PickerBox` | one component | date, datetime and year share it |
| `components/picker-trigger.tsx` | Button with the value text, X, `PickerPopup` | `PickerTrigger` | one component | seven range and period pickers share it |
| `components/picker-popup.tsx` | Decide popover or dialog; render it; say "phone dialog" | `PickerPopup`, `PhoneDialogContext` | the only file that imports `ui/popover` and `ui/dialog` as values (`types.ts` imports their types); no hook; readers call `React.useContext(PhoneDialogContext)` | one place for the decision; with group "popup" of `types.ts`, all a port to another base rewrites |
| `components/picker-presets.tsx` | Buttons that set a value | `PickerPresets` | one component | four panels show presets |
| `components/day-calendar.tsx` | Stock `Calendar` with the picker's caption, limits, blank weeks, phone fill, range band | `DayCalendar` | the only file that imports `ui/calendar` as a value and react-day-picker's hooks | four panels draw a day calendar |
| `components/view-nav.tsx` | `NavArrow`, `TodayButton` | both | two components | the calendar caption and the two grid headers draw the same three buttons |
| `components/period-views.tsx` | Draw one week calendar, month grid or year grid for a view | `PeriodView` | `PeriodView`, `WeekCalendar`, `MonthGrid`, `YearGrid`, `GridHeader`, `PeriodGrid` | single and range period pickers both draw them |
| `components/time-field.tsx` | Time box plus clock popover | `TimeField`, `ClockPopover` | two components | time, time range, the date-time popup; `ClockPopover` alone in a date-time range end |
| `components/time-columns.tsx` | The clock's columns | `TimeColumns` | `TimeColumns`, `TimeColumn` | the native time picker is rejected; Safari has none in a date-time box |
| `utils/values.ts` | Parse, format and check the six formats | see 4.1 | pure functions; no JSX, no DOM | every picker reads values |
| `utils/time.ts` | Seconds, step, limits of a time of day | see 4.1 | pure functions | the clock and the day click share one sum (9.3) |
| `utils/range.ts` | Read, replace, order and select a pair's ends | see 4.1 | pure functions; `leftBothBoxes` reads a focus event; all the two range pickers and their panels share of the swap is here: `isReversed`, `orderRange`, `leftBothBoxes` | five range pickers |
| `utils/views.ts` | The year list and a range's two views | see 4.1 | pure functions | calendars and grids page the same way |

### 4.1 Pure functions

A function with three or more parameters takes one object (coding standards, Code).

| File | Function | Contract |
|---|---|---|
| `utils/values.ts` | `fromYmd(text)` | local `Date` for exactly `YYYY-MM-DD`, else `undefined` |
| | `ymd(date)` | `YYYY-MM-DD` |
| | `datePart(value)`, `timePart(value)`, `joinDateTime(date, time)` | split and join a date-time |
| | `inYear(year, month?)` | a `Date` in that year (`new Date(50, 0, 1)` is 1950) |
| | `periodOf(type, date)` | `YYYY-Www`, `YYYY-MM` or `YYYY` |
| | `startOfPeriod(type, value)` | first day of exactly that period, else `undefined` |
| | `dayLimits(type, limits)` | period limits as days: first day of `min`'s period, last of `max`'s |
| | `outsideLimits(value, limits)` | string compare; `""` is never outside |
| | `checkedLimits(type, limits)` | each limit kept only if it is a value of the type (G3) |
| | `checkedStep(step)` | kept only if a whole number above zero (G4) |
| | `dateLibFor(locale)` | react-day-picker's `DateLib` for the calendar's locale |
| | `formatValue(value, lib)` | trigger text of a date or date-time (`PP`, `PP p`, `PP pp`); the raw text when not a value |
| | `formatPeriod({ type, value, weekValue, lib })` | trigger text of a week, month or year |
| `utils/time.ts` | `toSeconds(time)` | seconds after midnight, `undefined` for other text |
| | `timeText(seconds)` | `HH:mm`, with `:ss` when not zero |
| | `firstOnStep({ from, to, base, step })` | first time on the step inside `from..to`, else `undefined` |
| | `clockColumns({ value, min, max, step, hour12 })` | what each clock column lists, as `ClockUnit`s (`index`, `selected`, `disabled`, and the `time` a press sets): `hour`, `minute`, `second` (`undefined` when the step is whole minutes), `halfDay` (`undefined` on a 24-hour clock). A unit is listed when a time on the step falls in it and greyed when none of those lies inside `min` and `max` (C3 to C7). `toSeconds`, `timeText`, `firstOnStep` and `allowedTime` are used inside `time.ts` only and are not exported |
| | `allowedTime({ time, min, max, step })` | the time brought inside `min..max`, on the step |
| | `edgeTime({ edge, step, min })` | first or last time of a day on the step; `00:00`, `23:59` without one |
| | `dayTimeLimits({ day, min, max, step })` | the `{ min, max }` times of one day, for its Time field and clock: `min`'s time on `min`'s day, `max`'s time on `max`'s day, else `undefined` (DT10). With a `step`, on a day other than `min`'s, `min` is `edgeTime({ edge: "first", step, min })`: the day's first time on the step limits nothing on the step and keeps the step counted from `min`'s time of day (DT11, C4) |
| | `timeOnDay({ day, time, min, max, step })` | the date-time a clicked day gets: `allowedTime` of `time` inside that day's `dayTimeLimits` (DT3 to DT5, R8, R9) |
| `utils/range.ts` | `rangeEnds` | `["from", "to"]` |
| | `putEnd({ range, end, text })` | the pair with that end replaced, by name |
| | `isReversed(range)` | both ends set and From after To |
| | `orderRange(range, times?)` | the pair in order; with `times` an end on its default time gets the other default (1.4) |
| | `selectRange({ range, picked, times?, limits? })` | the pair after react-day-picker's `DateRange` (R6 to R10). `times` and `limits` (`{ min, max, step }`) are given for a date-time range only: an end on a new day gets `timeOnDay({ day, time: times[end], ...limits })`, so a `min` or `max` day is brought inside its limit here and nowhere else (R8, R9); an end whose day did not change keeps its value. Without `times` an end is its day |
| | `pickRange(range, period)` | the pair after a period click (PR4 to PR6) |
| | `rangeState(selected, period)` | `"end"`, `"middle"` or `undefined` for one value or two ends |
| | `formatRange({ range, formatEnd, emptyEnd, rangeJoin })` | trigger text; `""` when both ends are empty |
| | `leftBothBoxes(event, boxes)` | whether focus was inside an end box and moved outside both: `event.target` is inside one of the two box elements and `event.relatedTarget` is inside neither. The first half matters: React sends a blur from inside an end's clock popup up to its end box too, and that is not a leave |
| `utils/views.ts` | `listBounds({ days, min, max, startMonth, endMonth })` | the year list as first and last month (D7, D8). Per side, the first that is set: `startMonth` or `endMonth`; the limit's month, whatever the days; 1900 or 2100 grown to the century of the furthest year beyond it among the days and the other side's limit (D8) |
| | `clampView(view, bounds)` | the view held inside the list. The grids and `shownViews` use it; the day calendar of one value gets `month` as it is, and react-day-picker holds it inside `startMonth` and `endMonth` and shows today's month when there is none (`nm/react-day-picker/dist/esm/helpers/getInitialMonth.js:13-26`) |
| | `periodViewStart(type, date)` | the month, the year's January, the decade's first January |
| | `periodViewMonths` | months one view spans: week 1, month 12, year 120. `step` names seconds everywhere in the folder; the months one view spans are `viewMonths` (the day range panel's constant is 1) |
| | `periodBounds({ type, days, min, max, startMonth, endMonth })` | a period picker's year list as views: `listBounds` with the limits as days (`dayLimits`), each side at its `periodViewStart`. Both period panels call it |
| | `viewsForRange(days, viewMonths)` | the two views for a pair (From's, To's or the next; To-only handled) |
| | `shownViews({ views, bounds, viewMonths })` | the two views held in the list and apart; when the list holds one view, both are that view (R17, PR9) |
| | `endBounds({ end, bounds, viewMonths })` | the views one end may show (From stops one view early, To starts one late); when the list holds one view, the whole list for both ends |

The input types of these functions (`SelectRangeInput`, `ListSource`, `TimeOnDayInput` and the like) are used by their own file only and stay at its top (4.2).

### 4.2 `types.ts` and the types that stay in their file

The rule: `types.ts` holds the public types (what an app imports; `date-picker.tsx` re-exports them) and every type that two or more files of the folder use. A type one file alone uses stays in that file, at its top. The sorting below is the built code, each type name searched across the folder. Shapes are the built ones, moved or left unchanged.

In `types.ts`, 28 types, under one short heading comment per group, each group ordered so a type is met before its use inside the group:

| Group | Types, in order | Why here |
|---|---|---|
| public | `DatePickerType`, `RangeValue`, `Preset`, `CalendarProps`, `PopoverContentProps`, `PopoverProps`, `DialogProps`, `PresentationProps`, `One`, `Two`, `WithPresets`, `DateProps`, `DateTimeProps`, `TimeProps`, `WeekProps`, `MonthYearProps`, `TypedPickerProps` (the union of 3.2 without `labels`), `DatePickerProps`; `PickerLabels` passed on | the eight types of 3.1 are what an app imports; the ten others are the members `DatePickerProps` is written from; `TypedPickerProps` is also the props of the entry's inner component, and `PopoverContentProps` the type of `TimeRangePicker`'s `popoverProps`. Six of the eight are used by other files of the folder too (`CalendarProps` by seven) |
| values | `HtmlProps`, `Limits`, `ControlProps<Value>` (`HtmlProps & Limits & { value: Value; onChange: (value: Value) => void; disabled?: boolean }`), `PeriodType` | `HtmlProps`: the entry, `PickerField`, `PickerTrigger`; `Limits`: the entry, the pickers, the calendar, the views, `time.ts`, `range.ts`; `ControlProps`: five mode files; `PeriodType`: the two period modes, `period-views.tsx`, `values.ts`, `views.ts` |
| range | `RangeEnd`, `RangeTimes` (`Record<RangeEnd, string>`: the first and last time on the step) | `RangeEnd`: `range.ts`, `views.ts`, `day-calendar.tsx`, `day-range-picker.tsx`; `RangeTimes`: `range.ts`, `day-range-picker.tsx` |
| clock | `ClockUnit` (`{ index: number; selected: boolean; disabled: boolean; time: string }`: one unit a clock column lists) | `time.ts` (`clockColumns` returns them), `time-columns.tsx` (draws them) |
| views | `ListBounds` | `views.ts`, `day-calendar.tsx`, `period-views.tsx` |
| popup | `PopupOptions`, `PopupActions` | `PopupOptions`: `picker-popup.tsx`, `picker-box.tsx`, `picker-trigger.tsx`; `PopupActions`: those three, `day-picker.tsx`, `period-picker.tsx` |

Stays in its file, 48 types, each used by that file alone:

| File | Types |
|---|---|
| `modes/day-picker.tsx` | `DayPickerProps`, `DayPanelProps` |
| `modes/day-range-picker.tsx` | `DayRangePickerProps`, `DayRangePanelProps` |
| `modes/time-range-picker.tsx` | `TimeRangePickerProps` |
| `modes/period-picker.tsx` | `PeriodPickerProps`, `PeriodPanelProps` |
| `modes/period-range-picker.tsx` | `PeriodRangePickerProps`, `PeriodRangePanelProps` |
| `components/picker-field.tsx` | `PickerFieldProps`, `Draft` |
| `components/picker-box.tsx` | `PickerBoxProps` |
| `components/picker-trigger.tsx` | `PickerTriggerProps` |
| `components/picker-popup.tsx` | `PickerPopupProps` |
| `components/picker-presets.tsx` | `PickerPresetsProps<Value>` |
| `components/day-calendar.tsx` | `DayCalendarProps`, `EndCaptionProps` |
| `components/view-nav.tsx` | `NavArrowProps`, `TodayButtonProps` |
| `components/period-views.tsx` | `ViewProps`, `WeekCalendarProps`, `PeriodViewProps`, `GridArrow`, `GridHeaderProps`, `GridCell`, `PeriodGridProps` |
| `components/time-field.tsx` | `TimeFieldProps`, `ClockPopoverProps` |
| `components/time-columns.tsx` | `TimeColumnsProps`, `TimeColumnProps` |
| `utils/values.ts` | `IgnoredProp`, `FormatPeriodInput` |
| `utils/time.ts` | `StepSearch`, `AllowedTimeInput`, `EdgeTimeInput`, `DayTimeLimitsInput`, `TimeOnDayInput`, `ClockInput`, `UnitList` |
| `utils/range.ts` | `PutEndInput`, `SelectRangeInput`, `FormatRangeInput`, `EndBoxes` (`Record<RangeEnd, React.RefObject<HTMLElement \| null>>`: the roots of the two end boxes; the panels build the object and do not name the type) |
| `utils/views.ts` | `ListSource`, `PeriodListSource`, `RangeViews`, `ShownViewsInput`, `EndBoundsInput` |

- `date-picker.tsx` and `components/labels.ts` keep no type of this list: the entry's types are all public, and `PickerLabels` is the case below.
- A file imports the shared types it names with `import type { ... } from "../types"` (`"./types"` in the entry). `date-picker.tsx` ends with the re-export of the eight public types of 3.1, so the public import path is unchanged and no card changes.
- `types.ts` imports no component, mode or util file; its one import from the folder is the type `PickerLabels`. Its imports, all `import type`: `React`; `Popover as PopoverPrimitive` from `@base-ui/react/popover` (`PopupActions`); `PropsBase` from react-day-picker (`CalendarProps`); `Popover`, `PopoverContent`, `Dialog`, `DialogContent` from the stock `ui/` files, read as `React.ComponentProps<typeof ...>` (a type-only import of a value may be read with `typeof`); `PickerLabels` from `./components/labels`.
- A type that stays is not exported: its file is its only user. `PickerBoxProps` and `TimeFieldProps` stay as built, `Omit<React.ComponentProps<typeof PickerField>, ...>`, so `PickerFieldProps` needs no second user.
- `PickerLabels` is public and stays in `components/labels.ts` as `typeof defaultLabels` (approved exception). It is read off the 47-key table of that file; moving it would drag the table into `types.ts` or need the 47 keys written a second time. `types.ts` imports it type-only and passes it on. There is no other case: no other type in the folder is a `typeof` of a constant of ours.
- A type moves to `types.ts` in the change that gives it a second file, and not before.

## 5. Component tree and data flow

Rules that hold for every kind:

- The value is the app's. No picker keeps a copy. Every change goes up through one guarded `onChange` made in `date-picker.tsx`.
- One open-state pattern: the stock root owns it (decision 1). Pickers that close on a pick hold a `popupActions` ref and call `popupActions.current?.close()`.
- One popup shell: `PickerPopup`. One "box with popup" shell: `PickerBox`. One trigger shell: `PickerTrigger`. One place that decides popover or dialog: `PickerPopup`.
- Everything inside a popup is a panel component. Its state starts when the popup opens, because closed popup content is not mounted (`nm/@base-ui/react/popover/portal/PopoverPortal.d.ts:13-17`). Nothing is reset by hand.
- A range's ends are read by name: `const [from, to] = value`, then `{ from, to }[end]`. Writes go through `putEnd`.
- The three popup options go from the entry to `PickerPopup` like this, and no other way: the entry's rest spread carries them to the picker; the picker's rest spread carries them, with the HTML attributes and `disabled`, to its shell (`PickerBox` or `PickerTrigger`); the shell names the three and gives them to the `PickerPopup` it renders. No calendar or grid picker and no panel names them. A time picker has `popoverProps` only: `TimeField` names it for its `ClockPopover`, and `TimeRangePicker` names it for its two `TimeField`s.
- The labels and "phone dialog" are read where they are used, with `React.useContext(LabelsContext)` and `React.useContext(PhoneDialogContext)`. No wrapper hook.

### 5.1 Entry

```
DatePicker                       labels → LabelsContext
└── TypedPicker                  checkedLimits, checkedStep, change (same-value guard)
    ├── range
    │   ├── date, datetime  → DayRangePicker (withTime)
    │   ├── time            → TimeRangePicker
    │   └── week, month, year → PeriodRangePicker
    └── one value
        ├── date, datetime  → DayPicker (withTime)
        ├── time            → TimeField (label = labels.time, pickerLabel = labels.selectTime)
        └── week, month, year → PeriodPicker
```

- `TypedPicker` destructures `type, range, value, onChange, presets, min, max, step, ...props`, narrows on `range`, then switches on `type`, each switch with a `default`.
- State: none.

### 5.2 date and datetime, one value

```
DayPicker                         ref popupActions
└── PickerBox                     type date | datetime-local
    ├── PickerField               state draft, resetKey; ref inputRef; effect
    └── PickerPopup inBox
        └── DayPanel              state month
            ├── DayCalendar       mode single, required
            ├── Field + TimeField (datetime only; required, disabled without a date)
            └── PickerPresets
```

- `DayPanel` owns `month`. A day click calls `onChange(ymd(day))` and `onPicked()` (date), or `onChange(timeOnDay(...))` (datetime). A preset calls `onChange(next)` and `setMonth`.
- `DayPicker` passes `onPicked={() => popupActions.current?.close()}` for date only.
- The Time field of a date-time gets its limits as `{...dayTimeLimits({ day, min, max, step })}` (DT10, DT11) and `required` (DT8, DT9). A complete typed or picked time calls `onChange(joinDateTime(day, time))`; an empty one calls nothing.

### 5.3 time, one value and range

```
TimeField                         one value: rendered by the entry
├── PickerField type time
└── ClockPopover                  ref popupRef
    └── PickerPopup inBox, presentation popover
        └── TimeColumns
            └── TimeColumn x 2 to 4   refs columnRef, selectedRef; effect

TimeRangePicker
└── FieldGroup role group
    └── Field x 2 → FieldLabel + TimeField
```

- No state in `TimeField`, `ClockPopover`, `TimeColumns` or `TimeRangePicker`: the shown columns are computed from `value`, `min`, `max`, `step`.
- `ClockPopover` gives `PickerPopup` `popoverProps={{ initialFocus: popupRef, ...popoverProps, ref: popupRef, className: cn("p-0", popoverProps?.className) }}`: focus goes to the popup itself when the clock opens (C2). `ref` is written after the app's props, so an app's `ref` cannot take the place of the one `initialFocus` points at; an app may still give its own `initialFocus`. The same in all four places a clock is drawn; no caller sets it.

### 5.4 date and datetime range

```
DayRangePicker                    times = first and last time on the step (datetime only)
└── PickerTrigger                 ref triggerRef; onClose orders the pair
    └── PickerPopup
        └── DayRangePanel         state views, typing; refs boxes.from, boxes.to
            ├── per end: FieldLabel + PickerField (ref boxes[end], onBlur leaveBox; + ClockPopover for datetime)
            ├── per end: DayCalendar mode range, rangeBand, captionEnd
            └── PickerPresets
```

- `DayRangePanel` owns the two views, the end being typed and the two box refs. Its `leaveBox(event)` clears `typing`; then, when `leftBothBoxes(event, boxes) && isReversed(value)`, it gives `orderRange(value, times)` to the panel's `changeAndShow(next)`, which calls `onChange(next)` and resets the views from it. A typed end and a preset call the same function.
- The swap has one function, `orderRange`, and two triggers, each written where it fires: the panel's `leaveBox`, and the picker's `onClose={() => onChange(orderRange(value, times))}` on the trigger. The trigger is outside the popup and the boxes are inside it, so the two are in two components; what they share is the three functions of `utils/range.ts` (5.8). `selectRange` also starts from the ordered pair, so a day click on a reversed pair is right.
- A day click calls `onChange(selectRange({ range: value, picked, times, limits: { min, max, step } }))`: the time and the limit of a new end are applied inside `selectRange` (R8, R9). The panel adds nothing to its result.
- An end's clock is inside its end box in the React tree, and its popup is outside both boxes in the DOM. Focus moves into the popup as it opens (5.3), the clock button's blur reaches `leaveBox` with the popup as the new target, and `leftBothBoxes` is true: a reversed pair is ordered at that moment, before a pick (R16). A blur between two options of the open clock also reaches `leaveBox` (React events cross the portal) and is not a leave, because its source is not inside a box. No handler on the clock, no open callback, no flag.
- The panel's `endBox(end)` returns that end's `PickerField` (a date box, or a date-time box with `dateTimeBoxClassName`) and, for a date-time, its `ClockPopover` with the day's limits as `{...dayTimeLimits({ day, min, max, step })}` (R20). There is no end-box component: the box is written once, in the panel. A clock pick calls `onChange` alone; a typed value sets `typing` and calls `changeAndShow`: only typing resets the views.
- `React.useContext(PhoneDialogContext)` picks the layout. Columns (R3, R4): per end one `Field` holding the label and the box, then the calendar. Fields first (R5): one grid whose four direct children are `FieldLabel`, `PickerField`, `FieldLabel`, `PickerField` (section 9 row 25), then the two calendars.

### 5.5 week, month, year, one value

```
PeriodPicker                      ref popupActions
├── year   → PickerBox type year → PickerPopup inBox → PeriodPanel
└── week, month → PickerTrigger  → PickerPopup       → PeriodPanel
PeriodPanel                       state view
├── PeriodView                    → WeekCalendar | MonthGrid | YearGrid
└── PickerPresets
```

- `PeriodPanel` owns `view` (a `Date`: the month, the year, the decade). A pick calls `onChange(period)` and `onPicked()`.
- Version 9.1: month joins the `PickerBox` branch (`<input type="month">`); week alone keeps `PickerTrigger`. Version 9.2: week joins it too (`<input type="week">`), so `PeriodPicker` has one branch, `PickerBox` with its three words read from `boxWords[type]`, and imports no `PickerTrigger`, `formatPeriod`, `dateLibFor` or `outsideLimits`. The week value is the control's own text, `yyyy-Www`, which `periodFormats.week` (`RRRR-'W'II`) already writes: nothing is converted. `valueAsNumber` and `step` of the control are not read.

### 5.6 week, month and year range

```
PeriodRangePicker
└── PickerTrigger                 onClose orders the pair
    └── PickerPopup
        └── PeriodRangePanel      state views; refs boxes.from, boxes.to (attached for year only)
            ├── per end: year → Field → FieldLabel + PickerField type year
            │            week, month → FieldTitle
            ├── per end: PeriodView
            └── PickerPresets
```

- A pick calls `onChange(pickRange(value, period))`. A typed year calls `onChange(putEnd(...))` and resets the views. The swap is as 5.4, with the same three functions: `leaveBox(event)` tests `leftBothBoxes(event, boxes) && isReversed(value)`, gives `orderRange(value)` to `onChange` and resets the views from it; the picker's `onClose` is `() => onChange(orderRange(value))`. No `times`: a period has no time.
- Version 9.1: a month end has a `PickerField` as a year end has, and the panel has the state `typing` (section 6, row 9.1). Version 9.2: a week end has one too, so every end is `Field` → `FieldLabel` + `PickerField type={type}`, the `FieldTitle` pair is gone, the two box refs are attached for every type, the end box's placeholder is read from `boxPlaceholders[type]`, and `typing` is set for week ends as for month ends. `PickerTrigger` stays: the three ranges open from it.

### 5.7 The popup

```
PickerPopup
├── popover: Popover → [InputGroupAddon →] PopoverTrigger render={trigger} + PopoverContent
└── dialog:  Dialog  → [InputGroupAddon →] DialogTrigger render={trigger}
             + DialogContent → header, X, PhoneDialogContext → body, footer Done
```

- `const phone = useIsMobile()`. Dialog when `presentation === "dialog"`, or `"auto"` and `phone`. "Dialog on a phone" is `phone` inside the dialog branch: it sets the full-screen classes and `PhoneDialogContext`. No CSS breakpoint repeats the test.
- `inBox`: the trigger is an icon button inside a typed box. It is wrapped in the box's end addon, and the popover uses the box offsets. The content stays outside the addon, so a click in the popup does not reach the addon's click-to-focus handler (`ui/input-group.tsx:55-60`).
- Root props (`open`, `defaultOpen`, `onOpenChange`) are split from content props here and nowhere else. `onOpenChange` calls `onClose` when closing, then the app's handler.

### 5.8 Props of the shared parts

Every own prop of every shared part, panel and inner part. A prop not in this table is not written. "Rest" is the part's `...props`, which goes to the element named. The six pickers themselves take `ControlProps<Value>`, the public props of their type (3.2), and `withTime` (the two day pickers) or `type` (the two period pickers); nothing else.

| Part | Prop | Type | Passed by | Why (user need) |
|---|---|---|---|---|
| `PickerField` | `type` | `"date" \| "datetime-local" \| "time" \| "year"` | every caller | which box is drawn (2.2); `"year"` is the text box |
| | `value`, `onValueChange` | `string`, `(value: string) => void` | every caller | the box shows the value and passes typed values on (B1, B2) |
| | `label` | `string` | every caller | the box's noun ("Date", "Time", "Year", "From", "To"): names the X always, names the box when the app gives no `id`, `aria-label` or `aria-labelledby` (B10) |
| | `placeholder` | `string?` | the callers of B9 and the year boxes | the year box's own placeholder; the iOS overlay's text (B9) |
| | `disabled`, `min`, `max`, `step` | `boolean?`, `string?`, `string?`, `number?` | every caller that has them | native attributes (G2, B3, B4) |
| | `required` | `boolean?` | `DayPanel`, through `TimeField`'s rest | native `required` flags an emptied time (DT8); a required box draws no X, because it cannot be empty (DT9). One caller, one hop, a native attribute |
| | `boxClassName` | `string?` | `DayRangePanel`, date-time only | classes for the box frame (`InputGroup`): section 9 row 23. `className` goes to the root, which also holds the message. One caller, one hop |
| | `children` | `React.ReactNode?` | `PickerBox`, `TimeField`, `DayRangePanel` | the popup button drawn inside the box after the X |
| | rest | `HtmlProps` | callers | `id`, `aria-label`, `aria-labelledby`, `aria-describedby`, `aria-invalid` go to the input; everything else (`className`, `ref`, `onBlur`, ...) to the root. The root is one stock `Field` holding the `InputGroup` and the `FieldError` (B11) |
| `PickerBox` | `pickerLabel` | `string` | `DayPicker`, `PeriodPicker` (year) | names the calendar button and the popup ("Select date") |
| | `popupActions` | `React.RefObject<PopupActions \| null>?` | `DayPicker`, `PeriodPicker` | the picker closes the popup on a pick (D4, P11) |
| | `presentation`, `popoverProps`, `dialogProps` | `PopupOptions` | the picker's rest | named here and given to `PickerPopup` |
| | `children` | `React.ReactNode` | the picker | the panel shown in the popup |
| | rest | `PickerFieldProps` without `children` | the picker | to `PickerField` |
| `PickerTrigger` | `label` | `string` | the four trigger pickers | the picker's noun ("Date range", "Select week"). The app's `aria-label` first, else this, names the popup and the X, as 7.4. It is never set on the trigger button (P16) |
| | `text`, `placeholder` | `string`, `string` | the trigger pickers | the value as text; `""` shows the placeholder and hides the X (R1, P1, P4, PR1) |
| | `onClear` | `() => void` | the trigger pickers | the X empties the value; the trigger then takes focus (R2) |
| | `onClose` | `(() => void)?` | `DayRangePicker`, `PeriodRangePicker` | the pair is ordered when the popup closes (R15, PR11) |
| | `popupActions` | as `PickerBox` | `PeriodPicker` (week, month) | close on a pick (P3, P6) |
| | `disabled` | `boolean?` | the picker's rest | G2 |
| | `presentation`, `popoverProps`, `dialogProps` | `PopupOptions` | the picker's rest | named here and given to `PickerPopup` |
| | `children` | `React.ReactNode` | the picker | the panel |
| | rest | `HtmlProps` | the picker's rest | `id`, `aria-label`, `aria-labelledby`, `aria-describedby`, `aria-invalid` go to the trigger button; the rest to the `ButtonGroup` root. A period picker merges "outside the limits" into `aria-invalid` before passing it (P15, PR12); there is no `invalid` prop |
| `PickerPopup` | `presentation`, `popoverProps`, `dialogProps` | `PopupOptions` | `PickerBox`, `PickerTrigger`, `ClockPopover` | which popup, and the app's props for it (U1 to U9) |
| | `title` | `string` | the same three | the popover's `aria-label`; the dialog's visible title |
| | `trigger` | `React.ReactElement` | the same three | the button that opens the popup, given to the stock trigger's `render`; it keeps its own children (section 7) |
| | `disabled` | `boolean?` | the same three | disables the stock trigger (G2; the end clock without a date, R20) |
| | `inBox` | `boolean?` | `PickerBox`, `ClockPopover` | the trigger is an icon inside a typed box: it is wrapped in the box's end addon and the popover hangs from the box's edge (5.7, section 9 row 19) |
| | `popupActions` | `React.RefObject<PopupActions \| null>?` | `PickerBox`, `PickerTrigger` | the root's `actionsRef` |
| | `onClose` | `(() => void)?` | `PickerTrigger` | called when the popup closes, before the app's `onOpenChange` |
| | `children` | `React.ReactNode` | the same three | the popup's content |
| `PickerPresets` | `presets` | `Preset<Value>[]?` | the four panels | the row; nothing is drawn without presets |
| | `onSelect` | `(value: Value) => void` | the four panels | a preset's value, worked out at the click; the panel sets it and moves its view (D9, R18, P17) |
| `DayCalendar` | `calendarProps` | `CalendarProps?` | `DayPanel`, `DayRangePanel`, `WeekCalendar` | the app's react-day-picker options. Merged here and nowhere else: its `disabled` matchers are joined with the limits' matchers; its `className`, `classNames`, `modifiers` and `modifiersClassNames` are spread after the picker's, so the app wins; `fixedWeeks: "blank"` picks the `BlankWeek` part |
| | `limits` | `Limits`, as days | the same three | days outside are greyed and cannot be clicked (D6) |
| | `bounds` | `ListBounds` | the same three | the first and last month this calendar pages to (D7, R17) |
| | `rangeBand` | `boolean?` | `DayRangePanel`; `WeekCalendar` when it belongs to a range | the range picker's own band (section 9 rows 9 to 12). A one-value week keeps the stock band, as 7.4 (P2) |
| | `captionEnd` | `RangeEnd?` | `DayRangePanel`, always | the end whose badge the caption shows; `DayCalendar` draws it only in the phone dialog, which it reads itself (R5). One caller, one hop |
| | rest | `React.ComponentProps<typeof Calendar>` | the same three | react-day-picker's own props, passed straight: `mode`, `selected`, `onSelect`, `required`, `month`, `onMonthChange`, `showWeekNumber`, `ISOWeek`, `className`, and the picker's `modifiers` and `modifiersClassNames` (the `oneDay` modifier of a one-day range, section 9 row 13) |
| `NavArrow` | `label` | `string` | the caption, `GridHeader` | the button's name |
| | `disabled` | `boolean` | the same two | no view that way: dimmed, does nothing, stays a tab stop (D11) |
| | `onClick` | `() => void` | the same two | pages one view |
| | `children` | `React.ReactNode` | the same two | the chevron. `NavArrow` draws no icon of its own, because 7.4's two headers draw different ones and the look is frozen: the caption passes lucide's chevron with `size-4 rtl:rotate-180` (the stock calendar's chevron size and its RTL rule, `ui/calendar.tsx:35-36, 151`); `GridHeader` passes lucide's chevron with no class (the button's own icon size; the grids follow the page, P18). react-day-picker's `Chevron` part and its class names are not used |
| `TodayButton` | `onClick` | `() => void` | the caption, `GridHeader` | goes to today's view (D10, P5, P10) |
| `PeriodView` | `type` | `PeriodType` | `PeriodPanel`, `PeriodRangePanel` | week calendar, month grid or year grid |
| | `selected` | `string[]` | the same two | the values to mark: `[value]` from a one-value picker, the pair from a range. Read as a set (empty ones dropped, then sorted), never by position |
| | `view`, `onViewChange` | `Date`, `(view: Date) => void` | the same two | the month, year or decade shown, and paging |
| | `bounds` | `ListBounds` | the same two | the views this one may show; a range end gets its `endBounds` |
| | `limits` | `Limits` | the same two | periods outside are greyed (P12) |
| | `calendarProps` | the type's `calendarProps` | the same two | the week calendar's options; the locale of the month names |
| | `onPick` | `(period: string) => void` | the same two | a clicked week, month or year (P3, P6, P11, PR4 to PR6) |
| | `rangeBand` | `boolean?` | `PeriodRangePanel` | week only: handed to `DayCalendar` (above) |
| `GridHeader` (in `period-views.tsx`) | `children`; `previous`, `next`; `onToday` | `React.ReactNode`; `{ label: string; disabled: boolean; onClick: () => void }` each; `() => void` | `MonthGrid`, `YearGrid` | the year select or the decade text, then the three buttons in order |
| `PeriodGrid` (in `period-views.tsx`) | `label`; `cells`; `onPick` | `string`; `{ value: string; text: string; disabled: boolean; today: boolean; state: "end" \| "middle" \| undefined }[]`; `(period: string) => void` | `MonthGrid`, `YearGrid` | the group's name; twelve months or ten years (P5, P10, P12, P14) |
| `TimeField` | `pickerLabel` | `string` | the entry, `TimeRangePicker`, `DayPanel` | names the clock button and its popup ("Select time", "Select time for From") |
| | `popoverProps` | `PopoverProps?` | the entry, `TimeRangePicker` | the app's props for the clock popover (T5) |
| | rest | `PickerFieldProps` without `type` and `children` | the same three | to `PickerField`; `value`, `onValueChange`, `disabled`, `min`, `max`, `step` are also given to the clock |
| `ClockPopover` | `label` | `string` | `TimeField`, `DayRangePanel` | names the clock button and the popup |
| | `disabled` | `boolean?` | the same two | G2, R20 |
| | `popoverProps` | `PopoverProps?` | `TimeField` | T5 |
| | rest: `value`, `onValueChange`, `min`, `max`, `step` | `React.ComponentProps<typeof TimeColumns>` | the same two | the clock's own props, handed on as the rest spread and not named here: the time shown and a picked time (C7), the options greyed and listed (C3 to C6) |
| `TimeColumns` | `value`, `onValueChange`, `min`, `max`, `step` | as `ClockPopover` | `ClockPopover` | the columns are computed from these five and nothing else |
| `TimeColumn` (in `time-columns.tsx`) | `label`; `units`; `texts`; `onPick` | `string`; `ClockUnit[]`; `string[]`; `(time: string) => void` | `TimeColumns` | one column: its name, the units `clockColumns` lists for it, the text of every unit by its `index`, and a pressed unit's `time`. No second shape of `ClockUnit`, no generic |
| `DayPanel` | `withTime` | `boolean` | `DayPicker` | date or date-time |
| | `value`, `onChange`, `min`, `max`, `step`, `calendarProps`, `presets` | as the picker's | `DayPicker` | the picker's own props, used here |
| | `onPicked` | `(() => void)?` | `DayPicker`, date only | called after a day click set the value; the date picker closes its popup (D4). Date-time passes none (DT3). One caller, one hop |
| `DayRangePanel` | `value`, `onChange`, `min`, `max`, `step`, `calendarProps`, `presets` | as the picker's | `DayRangePicker` | the picker's own props, used here |
| | `times` | `RangeTimes?` | `DayRangePicker` | set for a date-time range: the first and last time on the step, worked out once in the picker because its `onClose` needs them too (R8, R15). `undefined` means a date range; the panel has no separate `withTime` |
| `PeriodPanel` | `type`, `value`, `onChange`, `min`, `max`, `calendarProps`, `presets` | as the picker's | `PeriodPicker` | the picker's own props, used here |
| | `onPicked` | `() => void` | `PeriodPicker` | the picker closes its popup after a pick (P3, P6, P11) |
| `PeriodRangePanel` | `type`, `value`, `onChange`, `min`, `max`, `calendarProps`, `presets` | as the picker's | `PeriodRangePicker` | the picker's own props, used here |

Settled by this table:

- The inner Time field has no X because it is `required` (DT9): no "hide the X" prop.
- `label` is always the noun of the thing itself; `pickerLabel` is the name of the popup it opens. The popup's title is `pickerLabel` from a box, and the app's `aria-label` or else `label` from a trigger.
- No part takes a prop only to hand it on, except `rangeBand` through `PeriodView`, which is the switch between the three views and spreads its props to the one it draws.

The swap, whole. No hook and no fourth range function: the two range pickers and their panels share the three functions of `utils/range.ts` as built, `isReversed`, `orderRange`, `leftBothBoxes`, and nothing else.

```tsx
// DayRangePanel. PeriodRangePanel is the same without setTyping and times, and with its own viewMonths.
function changeAndShow(next: RangeValue) {
  onChange(next)
  setViews(viewsForRange(daysOf(next), viewMonths))
}

function leaveBox(event: React.FocusEvent) {
  setTyping(null)
  if (leftBothBoxes(event, boxes) && isReversed(value)) {
    changeAndShow(orderRange(value, times))
  }
}

// DayRangePicker, on its PickerTrigger. PeriodRangePicker passes no times.
onClose={() => onChange(orderRange(value, times))}
```

- What the two panels share is one test and one call, already two functions and one function of `range.ts`: a plain line each. A function for "left both boxes and reversed: the ordered pair" would take four inputs as one object (`event`, `boxes`, `range`, `times`) and return a pair or `undefined`, and each call site would still test the result, call `onChange` and reset its views: no line saved, one name added. So none is written.
- What they do not share stays in each panel's `leaveBox`:
  - `DayRangePanel` clears `typing` first, on every blur; `PeriodRangePanel` has no `typing` in version 9, and clears its own first in versions 9.1 and 9.2 (section 6, row 9.1).
  - Each has its own `changeAndShow(next)`, which a typed end, a preset and the swap call: `onChange(next)`, then `setViews(viewsForRange(daysOf(next), viewMonths))`, with `viewMonths` 1 and days read by `fromYmd(datePart(...))`, or `viewMonths` `periodViewMonths[type]` and days read by `startOfPeriod(type, ...)`.
  - Only the day range passes `times`.
- The two `onClose` handlers are one call each; `orderRange` returns an ordered pair as it is, and the entry's guard drops a same-value call (G1), so neither tests `isReversed` first.
- No hook: nothing here holds React state, a ref or an effect that two components share (the refs and the views are each panel's own, section 6), and a function that calls no React hook is not named `use...` (section 10).

## 6. Every state, effect, ref and context

7 states, 2 effects, 11 refs, 2 contexts, no hook of our own; version 9.1 adds one state (row 9.1), 8 in all. Version 9.2 adds none and removes none: the same 8 states, 2 effects, 11 refs and 2 contexts. The swap adds none of the four: `leftBothBoxes` is a pure function given the two refs of rows 14 and 15 (`DayRangePanel`) or 16 and 17 (`PeriodRangePanel`) at the call; the views it leads to are states 4 and 7, set by the panel.

| # | Kind | Name | File | Holds | Why it is needed | Stock mechanism considered |
|---|---|---|---|---|---|---|
| 1 | state | `draft` | `picker-field.tsx` | text the box holds that is not a storable value; the picker's value while the box holds it (`value`: the typed value, `""` for half-typed text, the unchanged value when nothing is passed on, B5); the browser's message; whether the box was left since (`left`) | a half-typed date reads `""` in the DOM and the message exists only on request; React has to draw the X, the red mark and the message (B2, B3, B6). A draft counts only while its `value` is the picker's value: that one comparison, where the draft is read, is what drops a stale draft; there is no reset | CSS `:user-invalid` (no message text, no X); the browser's validation bubble (forms only) |
| 2 | state | `resetKey` | `picker-field.tsx` | a counter used as the input's `key`, raised only by the X | the X must wipe half-typed parts; the value is already `""`, so React writes nothing and the parts stay. Writing `input.value = ""` wipes them in Chromium and not in WebKit (plan review probe). The remount drops the input's focus to the page (B6); nothing puts it back | setting `value` to `""` (a no-op when it already is); `autoFocus` on the remounted input (would also pull focus into a box that did not have it, and on iOS may open the native picker, which cannot be checked under section 14) |
| 3 | state | `month` | `day-picker.tsx` `DayPanel` | the month the calendar shows | the user pages without changing the value; a preset moves it (D9) | react-day-picker's own month state through `defaultMonth` (a preset cannot move it); used: its controlled `month`, `onMonthChange` |
| 4 | state | `views` | `day-range-picker.tsx` `DayRangePanel` | the month each calendar was last sent to, and which moved last | two calendars paged apart from the value; the one not moved gives way (R17) | one react-day-picker with `numberOfMonths={2}` (its months cannot be paged apart) |
| 5 | state | `typing` | `DayRangePanel` | the end whose box is being typed, or `null`; a box that reports `""` (its X, or a half-typed date) sets `null`, because the X fires no blur and an empty end has no year | a date box reports years 1, 14, 144 while 1443 is typed; that end stays out of the year list until its box is left (R13) | none: only the picker knows a value is mid-typing |
| 6 | state | `view` | `period-picker.tsx` `PeriodPanel` | the month, year or decade shown | same as 3 | same as 3 |
| 7 | state | `views` | `period-range-picker.tsx` `PeriodRangePanel` | as 4, for months, years or decades | same as 4 (PR9) | none: the grids are custom |
| 9.1 | state | `typing` | `period-range-picker.tsx` `PeriodRangePanel`, versions 9.1 and 9.2 | the end whose month box (9.1), or week or month box (9.2), is being typed in, or `null`; never set for a year end, and `null` when a box reports `""` (the X empties a box without a blur, and an empty end has no year to keep out of the list) | a week or month box reports the years 1, 14 and 144 while 1443 is typed, so that end stays out of the year list until its box is left (MR4, WR4). A year box reports whole years only | none: same as 5 |
| 8 | effect | re-read validity | `picker-field.tsx` | deps `value, min, max, step` | a value or limit that arrives from outside is checked like a typed one (B7, B8). It sets `draftOf(input, left)`, where `left` is the old draft's `left` when that draft is for this same value (the value was typed here, so the mark waits until the box is left), else `true` (the value came from outside, so it is flagged at once). Where the value came from is told by the draft, never by where focus is | handlers alone (they do not run for an outside change) |
| 9 | effect | centre the selection | `time-columns.tsx` `TimeColumn` | runs once on mount | the selected time is in view when the clock opens (C2) | `scrollIntoView` (scrolls the popup and the page too) |
| 10 | ref | `inputRef` | `picker-field.tsx` | the input | effect 8 reads `validity` and `validationMessage` | none |
| 11 | ref | `popupActions` | `day-picker.tsx` | the root's actions | date closes on a pick (D4) | this is the stock mechanism: `actionsRef.close()` |
| 12 | ref | `popupActions` | `period-picker.tsx` | same | week, month, year close on a pick; in 9.2 it is handed to `PickerBox` for every type | same |
| 13 | ref | `triggerRef` | `picker-trigger.tsx` | the trigger button | its X unmounts when the value empties; focus must land somewhere (R2) | Base UI `finalFocus` (for a closing popup only) |
| 14, 15 | ref | `boxes.from`, `boxes.to` | `DayRangePanel` | the two end boxes' roots | "focus left both boxes" (R15), tested by `leftBothBoxes` in the panel's `leaveBox`: the boxes sit in two columns with a calendar between them in the DOM, so no single element holds only the two | `currentTarget.contains(relatedTarget)` on one wrapper (there is none) |
| 16, 17 | ref | `boxes.from`, `boxes.to` | `PeriodRangePanel` | the two year boxes' roots; in 9.1 the month boxes' too, in 9.2 every period type's | same (PR11, MR6, WR6) | same |
| 18, 19 | ref | `columnRef`, `selectedRef` | `TimeColumn` | the scrolling column, the selected button | effect 9 sets the column's scroll from the button's position | a selector query for the pressed button (a DOM query) |
| 20 | ref | `popupRef` | `time-field.tsx` `ClockPopover` | the clock's popup element, given to the popup as `ref` and as `initialFocus` | focus must enter the clock as it opens, so that a reversed pair is ordered before an option can be pressed (R16; with focus left on the clock button the first press inside the clock ordered the pair and the pick landed on the other date), and must not land on an hour | Base UI's default `initialFocus` (focuses the first hour button with scrolling, which undoes effect 9: `nm/@base-ui/react/floating-ui-react/components/FloatingFocusManager.js:390, 409`); `initialFocus={false}` (the wrong-date pick above); used: `initialFocus` as a ref, which Base UI focuses without scrolling when it is the popup (`PopoverPopup.d.ts:43, 47`) |
| 21 | context | `LabelsContext` | `labels.ts` | the 47 words | about twelve components at every depth read them | props (a thread through every file) |
| 22 | context | `PhoneDialogContext` | `picker-popup.tsx` | `true` inside a dialog under 768 | the popup shell decides it; `DayCalendar` (fill classes, caption badge) and `DayRangePanel` (fields-first layout) are behind the shell's `children`, in two other files | props (through `PickerBox`, `PickerTrigger` and four panels); CSS keyed on the dialog's slot attribute (7.4: decided twice, and the layout changes DOM order, which CSS cannot) |

Not in the table because they do not exist: an open state of our own, a copy of the value, a month reset on open, a `picking` flag, a previous-value state, a memo, a callback memo, a context for the caption badge or for blank weeks (section 8), a roving tab stop.

## 7. Stock mechanisms used

| Need | Mechanism | Source |
|---|---|---|
| Typed date, date-time, time; their own validity messages; `min`, `max`, `step` | native `<input type>` through `InputGroupInput` | `ui/input-group.tsx:116-127`, `ui/input.tsx:5-17` |
| Year box limited to four digits | `type="text"`, `inputMode`, `maxLength`, `pattern` | decision 5 |
| A time box that cannot be empty | native `required` | DT8 |
| Box frame, X and popup button inside it | `InputGroup`, `InputGroupAddon`, `InputGroupButton` (already `type="button"`) | `ui/input-group.tsx:11-23, 44-64, 83-102` |
| Box and message laid out with the style's gap; labelled fields | `Field`, `FieldLabel`, `FieldTitle`, `FieldError`, `FieldGroup` | `ui/field.tsx:64-78, 93-108, 110-118, 162-211, 35-46` |
| Popover: open state, placement, portal | `Popover`, `PopoverTrigger`, `PopoverContent` | `ui/popover.tsx:7-47`; `nm/@base-ui/react/popover/root/PopoverRoot.d.ts:21, 25, 29` |
| No focus trap; Tab out closes | `modal` defaults to `false`; focus-out close | `PopoverRoot.d.ts:58`; `nm/@base-ui/react/floating-ui-react/components/FloatingFocusManager.js:130, 318` |
| Close on pick | `actionsRef.current.close()` on both roots | `PopoverRoot.d.ts:41, 81-84, 93`; `nm/@base-ui/react/dialog/root/DialogRoot.d.ts:58, 82-85` |
| Panel state starts fresh on each open | popup content is not mounted while closed | `nm/@base-ui/react/popover/portal/PopoverPortal.d.ts:13-17` |
| Clock opens with focus on the popup itself, nothing scrolled | `initialFocus` given a ref to the popup; Base UI focuses the popup without scrolling | `nm/@base-ui/react/popover/popup/PopoverPopup.d.ts:43, 47`; `nm/@base-ui/react/floating-ui-react/components/FloatingFocusManager.js:396, 409` |
| The trigger keeps its own children when passed as `render` | `mergeProps(props, render.props)` | `nm/@base-ui/react/internals/useRenderElement.js:132` |
| Popup scrolls inside the room left | `--available-height` | `nm/@base-ui/react/popover/positioner/PopoverPositionerCssVars.js:16` |
| Dialog: title, footer, close | `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogFooter`, `DialogClose` | `ui/dialog.tsx:10-12, 22-24, 39-77, 79-114, 116-124` |
| Under 768 | `useIsMobile` (768, Tailwind's `md`) | `hooks/use-mobile.ts:3, 5-20` |
| Day calendar: month paging, dropdown caption, navigation limits | `Calendar` with `month`, `onMonthChange`, `startMonth`, `endMonth`, `captionLayout`, `hideNavigation` | `ui/calendar.tsx:15-187`; `nm/react-day-picker/dist/esm/types/props.d.ts:85, 99, 106, 127, 150, 429` |
| Greyed days; a click on one does nothing | `disabled` matchers | `props.d.ts:280`; `nm/react-day-picker/dist/esm/DayPicker.js:156-165` |
| A second click on the selected day does not clear it | `mode="single" required` | `nm/react-day-picker/dist/esm/selection/useSingle.js:21-24`; `props.d.ts:492-499` |
| Range clicks, in order | `mode="range"` and `addToRange` | `nm/react-day-picker/dist/esm/selection/useRange.js:38, 51`; `utils/addToRange.js:15-92` |
| Week band and week pick | `mode="range"`, `selected` the week's seven days, `onSelect`'s second argument; `showWeekNumber`, `ISOWeek` | `DayPicker.js:319-325`; `props.d.ts:201, 226` |
| Six rows | `fixedWeeks` | `props.d.ts:179` |
| Custom caption, week row, day button | `components`; a row knows its days | `props.d.ts:254`; `DayPicker.js:271, 307` |
| Paging from inside the caption; the calendar's own names for its arrows | `useDayPicker()`: `previousMonth`, `nextMonth`, `goToMonth`, `labels`. Its `components` and `classNames` are not read: the chevrons are passed to `NavArrow` (5.8) | `nm/react-day-picker/dist/esm/useDayPicker.d.ts:24-54` |
| Cell size | the stock `--cell-size` variable | style sheet `cn-calendar` (`styles/style-vega.css:228`) |
| Text in the calendar's locale | `DateLib` | `nm/react-day-picker/dist/esm/classes/DateLib.d.ts:68, 237` |
| `DateRange`, default class names | exported type and helper | `types/shared.d.ts:171`; `helpers/getDefaultClassNames.d.ts:11` |
| Parse, format, validate, month and year sums | date-fns `parse`, `format`, `isValid`, `startOfMonth`, `startOfYear`, `startOfDecade`, `addMonths`, `clamp`, `endOfISOWeek`, `endOfMonth`, `endOfYear`, `endOfDecade`, `eachMonthOfInterval`, `eachYearOfInterval`, `setYear`, `getYear`, `isAfter`, `isBefore` | `nm/date-fns/<name>.d.ts` (`parse` 319, `format` 307, `isValid` 32, `clamp` 58, `endOfYear` 29) |
| Buttons, trigger group, year select, badge | `Button`, `ButtonGroup`, `NativeSelect`, `Badge` | `ui/button.tsx:35-48`, `ui/button-group.tsx:25-39`, `ui/native-select.tsx:9-36`, `ui/badge.tsx:25-45` |
| An arrow that is disabled but keeps focus | `disabled focusableWhenDisabled` | `nm/@base-ui/react/button/Button.d.ts:21`; `utils/useFocusableWhenDisabled.js:38-43`; `internals/use-button/useButton.js:84-90` |
| 12 or 24 hour clock | `new Intl.DateTimeFormat(undefined, { hour: "numeric" }).resolvedOptions().hour12`. The `hour` option is required: without it `hour12` is `undefined` and every locale would get the 24-hour clock | browser; 7.4 `time-columns.tsx:40-44` |
## 8. Deliberately custom pieces

| Piece | Why nothing stock does it | How small it is kept |
|---|---|---|
| Clock columns (`time-columns.tsx`) | The native time picker is rejected, and Safari's date-time box has none. No `ui/toggle-group`; Base UI's ToggleGroup empties the value on a second press | Plain `Button`s with `aria-pressed`, each a tab stop. No key handler, no `tabIndex`, no selector. All sums in `time.ts`. One mount effect with two refs centres the selection. A column takes its buttons as plain data (5.8), so it is not generic |
| Month and year grid (`period-views.tsx`) | react-day-picker picks days only; shadcn has no month or year recipe | `PeriodGrid`: `Button`s in `grid grid-cols-3`, `aria-pressed`, `aria-current`. `GridHeader`: a slot and three buttons. No key code (decision 2) |
| Caption with previous, Today, next at the right (`day-calendar.tsx`) | The stock arrows are rejected; react-day-picker's `Nav` cannot hold a third button between its two | A `MonthCaption` part that renders its children and `NavArrow`, `TodayButton`, `NavArrow`, paged through `useDayPicker()`; each arrow gets its chevron as children (5.8) |
| Variants of a react-day-picker part | A custom part cannot take our props | A variant is its own module-level component chosen in `components`: `BlankWeek` for `fixedWeeks: "blank"`, `FromCaption` and `ToCaption` for the phone dialog's badge. No context |
| Module-level `Root` and `DayButton` parts | The stock `Calendar` builds them inline, so every render remounts the days and a click can be lost (`ui/calendar.tsx:137, 170`) | `Root`: one component of a few lines, same markup as stock. `DayButton`: the stock `CalendarDayButton` itself, passed as the part; it gets no `locale`, which the stock part reads only for the button's `data-day` attribute, and nothing reads that attribute |
| iOS placeholder overlay (`picker-field.tsx`) | iOS shows an empty date box blank; `placeholder` does not apply to date inputs. Owner-approved | One `span` shown by `supports-[-webkit-touch-callout:none]`, hidden on focus |
| Draft and remount (`picker-field.tsx`) | See section 6 rows 1, 2, 8 | One state shape, one pure `draftOf(input, left)`, one effect |
| Growing year list (`views.ts` `listBounds`) | react-day-picker's default is 100 years back; the proposal's rule is 1900 to 2100 growing by century | One pure function; both limits always enter both ends (6.10) |
| Two views kept apart (`views.ts`) | No stock part pages two calendars as one range | Three pure functions and one state per range panel; one `endBounds` for every use (9.5) |
| One-route swap (`range.ts`) | Browsers do not order two inputs | Three pure functions, `isReversed`, `orderRange`, `leftBothBoxes`, called from two plain places: the blur handler of each range panel and the `onClose` of each range picker (5.8). No hook, no flag, no state. An end's clock needs no rule of its own: it takes focus as it opens (section 6 row 20), which is a leave like any other |
| Default-time fix after a swap (`orderRange`) | Call 8 keeps it: an untouched range would read 23:59 to 00:00 | Inside `orderRange`, with its one-line reason |
| Popover or dialog switch (`picker-popup.tsx`) | shadcn has no part that is either | One component, two branches, no context for its own parts |
| Soft limit and step check (`values.ts`) | The one guard against `step={0}` and a half-applied limit | Two functions called once in the entry |

## 9. Styling rules

- Stock Tailwind and shadcn parts. No `style` prop. No px and no bracket lengths except the listed rows. No fixed size where content or space can size it.
- A class that changes a stock part is allowed only if it is in the table below, and carries its reason as a one-line comment at the place it lives.
- Strings marked "7.4" are copied verbatim from the named 7.4 line, minus every `in-data-[slot=dialog-content]:max-md:` prefix: those utilities move, without the prefix, to the phone-dialog object.
- "Dialog on a phone" is decided once, in `PickerPopup` (5.7). `md:` and `max-md:` utilities remain only for rules about a narrow screen in any popup (rows 20, 23, 24).

| # | Lives in | Override | Reason | Source |
|---|---|---|---|---|
| 1 | `day-calendar.tsx` root | `bg-transparent p-0` | every picker calendar sits in a popup with its own padding and background | 3.6 |
| 2 | `calendarClassNames.month_caption` | 7.4 `picker-calendar.tsx:76` | the caption row holds the dropdowns left and the three buttons right | custom caption |
| 3 | `calendarClassNames.dropdowns` | 7.4 `:80-81` (`text-xs`) | two dropdowns and three buttons share one row | call 8 (5.6) |
| 4 | `calendarClassNames.today` | 7.4 `:67`, first five utilities. The first four are the stock class (`ui/calendar.tsx:122`); the fifth, `data-[selected=true]:bg-transparent`, is the override | a selected today shows the selection, not a muted square behind it | call 8 (5.7) |
| 5 | `calendarClassNames.outside` | 7.4 `:71-73` | an end in an other-month day shows in both calendars of a range; dimmed there | 1.9, look frozen (call 9) |
| 6 | `calendarClassNames.month`, `.week` | `gap-[calc(var(--cell-size)*0.4)]`, `mt-[calc(var(--cell-size)*0.2)]` | 7.4's row spacing, tied to the stock cell size; stock spacing makes every calendar 0.8rem taller | 10.4, look frozen (call 9) |
| 7 | `fillClassNames` (phone dialog) | root `w-full`; `week_number_header` `flex-1`; `months` `flex-1 gap-0`; `month` `flex-1 gap-1`; `month_grid`, `weeks` `flex flex-1 flex-col`; `week` `mt-0 min-h-9 flex-1 *:flex *:aspect-auto *:h-auto *:flex-1 *:items-center *:justify-center *:rounded-none`; `today` `not-data-[selected=true]:bg-transparent not-data-[selected=true]:*:bg-muted` | the calendar stretches to fill the phone screen; rows keep a height a finger can hit; today's shade moves to the button so a wide cell is not a muted bar | owner-approved dialog |
| 8 | `DayCalendar` root, phone dialog | `[--cell-size:--spacing(9)]` | cells large enough to tap, through the stock variable | call 8 (10.1) |
| 9 | `bandClassNames.range_start`, `.range_end` | 7.4 `range-mode.tsx:80-81, 92-101` | the stock band is off-centre in a cell wider than the day | audit 12 kept |
| 10 | `bandClassNames.day_button` | 7.4 `:103`, the transition utilities | the stock button's `transition-all` would fade the band on every change | call 8 (5.5) |
| 11 | `bandClassNames.root` | `w-full`; phone dialog adds `flex flex-1 flex-col` | a range's calendar is as wide as its end box | 7.4 |
| 12 | `bandFillClassNames` | `range_middle` `data-[selected=true]:bg-muted data-[selected=true]:data-[today=true]:bg-muted` (the second outranks today's own `data-[selected=true]:bg-transparent`, so today inside the band is the band's colour, as on 7.4); `day_button` `size-(--cell-size) data-[range-middle=true]:bg-transparent data-[range-middle=true]:hover:bg-foreground/10` | in stretched cells the band is drawn by the cell and the day stays a square | owner-approved dialog |
| 13 | `DayRangePanel`, `oneDay` modifier | `after:hidden` | a one-day range has no band half | audit 12 kept |
| 14 | `picker-field.tsx` input | `appearance-none [&::-webkit-calendar-picker-indicator]:hidden` | one calendar button, not two; `appearance-none` is how the owner tested the box on iOS and cannot be checked here | audit 12 kept; 5.8 |
| 15 | `picker-field.tsx` overlay | 7.4 `picker-field.tsx:195` | the iOS placeholder, placed like the input's own text | approved; call 8 (10.5) |
| 16 | `picker-field.tsx` X | `not-focus:invisible` when there is nothing to clear | the box keeps its width; an X holding keyboard focus stays visible | 7.4 |
| 17 | `picker-field.tsx` `FieldError` | `contain-inline-size` | a long browser message wraps under the box and does not widen a popup | 7.4 |
| 18 | `picker-popup.tsx` popover | `max-h-(--available-height) w-auto overflow-y-auto` | stock is `w-72` (`ui/popover.tsx:39`); the popup is as wide as its content and scrolls in the room left | 7.4 |
| 19 | `picker-popup.tsx` `boxPopover` | `align: "end"`, `alignOffset: -8`, `sideOffset: 10` | the popover hangs from an icon inside the box; these line it up with the box's edge. The stock part does not forward `anchor` | call 8 (10.3) |
| 20 | `picker-popup.tsx` dialog | `flex max-h-[calc(100dvh-2rem)] flex-col md:w-max md:max-w-[calc(100%-2rem)]`, verbatim from 7.4 `picker-frame.tsx:196` | the body scrolls inside the dialog; two calendars are wider than the stock `sm:max-w-md`; the dialog keeps the stock 1rem margin when taller or wider than the window (the stock dialog's own `max-w-[calc(100%-2rem)]`, `styles/style-vega.css:468`) | 7.4; look frozen (call 9) |
| 21 | `picker-popup.tsx` dialog, `phone` | content `h-dvh max-h-none max-w-none rounded-none ring-0`; body `-m-1 items-stretch p-1`; footer `rounded-none`; Done `w-full` | full screen on a phone; the body's negative margin and padding keep focus rings from being clipped by the scroll area | owner-approved dialog; 5.8 |
| 22 | `picker-popup.tsx` dialog X | `DialogClose` rendering a ghost `icon-sm` `Button` with `cn-dialog-close` and `aria-label={labels.close}`; `showCloseButton={false}` set after the app's props | the stock X says a fixed English "Close" (`ui/dialog.tsx:71`) | call 9 keeps X and Done |
| 23 | `day-range-picker.tsx` date-time end box (`PickerField`'s `boxClassName`, 5.8) | `overflow-hidden max-md:contain-inline-size *:data-[slot=input-group-addon]:pr-1 *:data-[slot=input-group-addon]:not-last-of-type:mr-0 *:data-[slot=input-group-control]:pr-0 *:data-[slot=input-group-control]:pl-2` | a date-time and two buttons must fit a box one month wide (owner finding 9); a long value must not widen the popup on iOS | 5.2 |
| 24 | `day-range-picker.tsx` date-time calendars | `max-md:[--cell-size:--spacing(9)]` | on a narrow screen the month is as wide as the date-time box above it | call 8 (10.1) |
| 25 | `day-range-picker.tsx` phone-dialog fields | not an override: our own wrapper `cn-field grid grid-cols-[auto_1fr] items-center gap-y-2` with four direct children, `FieldLabel`, `PickerField`, `FieldLabel`, `PickerField`. No `Field` per row, no subgrid, no class on a stock part. The gaps are 7.4's: the style's own field gap between label and box (the style-sheet hook `cn-field`: `gap-3` or `gap-2` by style) and `gap-2` between the rows | one label column as wide as the longer word, so the two boxes line up; the bracket is the one way to say "as wide as the labels, then the rest" | 1.3, look frozen (call 9) |
| 26 | `picker-trigger.tsx` `ButtonGroup` | `cn-button-group-orientation-horizontal` | the installed part hard-codes `lg` corners (`ui/button-group.tsx:14`); this style-sheet hook follows the style's radius | 1.10, look frozen (call 9) |
| 27 | `picker-trigger.tsx` button | `min-w-0 flex-1 justify-start px-2.5 font-normal` | the value reads as text, starts at the left and truncates | shadcn date picker recipe |
| 28 | `time-field.tsx` clock popover | `p-0` | the columns bring their own padding | 7.4 |
| 29 | `time-columns.tsx` column | `no-scrollbar max-h-56 min-w-18 overflow-y-auto` | a scrolling list needs a cap; `min-w` keeps 7.4's even columns and lets a long AM/PM grow | 10.2 |
| 30 | `picker-presets.tsx` row | `flex w-0 min-w-full flex-wrap gap-2 border-t pt-4` | many presets wrap and do not widen the popup | audit 12 kept |
| 31 | `period-views.tsx` cells | `font-normal tabular-nums`; `bg-muted` in a range; `bg-muted text-foreground` today | the stock calendar's own today and middle look | 7.4 |
| 32 | `view-nav.tsx` `NavArrow` | `aria-disabled:opacity-50` | a focusable disabled button is not `:disabled`, so the stock dimming does not match it; the stock calendar arrows use the same class (`ui/calendar.tsx:59`) | 2.5 |

Layout classes of our own elements (not overrides), all from 7.4: panels `flex flex-col gap-4`; a range's columns `flex flex-col gap-4 md:flex-row`, each `flex flex-col gap-2`; phone-dialog range `flex grow flex-col gap-2` with calendars in `flex flex-1 flex-col gap-2`; the Time field `border-t pt-4`; grid `grid grid-cols-3 gap-1`; grid and caption header `flex items-center justify-between gap-0.5`, its buttons in `flex shrink-0 items-center`; decade text `px-1 text-sm font-medium tabular-nums`; clock `flex divide-x`, a column's list `flex flex-col gap-1 p-1`; dialog body `flex min-h-0 grow flex-col items-center overflow-y-auto`; caption with a badge `flex min-w-0 items-center gap-2`; the caption's two chevrons `size-4 rtl:rotate-180` (5.8).

## 10. Code rules

- `docs/code-of-conduct/coding-standards.md`, section Code: no abstraction with one implementation; three or more parameters take one object; no dead code, no commented-out code, no stale `eslint-disable`; strict TypeScript; comments are JSDoc on exported API or one sentence on a non-obvious invariant or a browser or library quirk, no history, nothing that restates the next line. Section Style: no em dashes.
- Not applied here, applied at the port to the library: the `ST_` prefix and `@/` self-imports (section Naming, Imports).
- File order (decision 3): `"use client"` (component files), imports, that file's own types, constants (class-name objects, tables, contexts), then components and functions, one `export { ... }` list last. No type is declared further down a file.
- Where a type lives (the owner, 2026-11-22; 4.2): a public type, and a type two or more files use, is in `types.ts`; a type one file uses is at the top of that file and is not exported. `PickerLabels` in `labels.ts` is the one approved exception. Props are a named type, never an object type in a signature.
- Names: a component's props type is `<Component>Props`. The name of a control is `label`; a second name on the same component says what it names (`pickerLabel`). A value callback is `onChange` on pickers and panels, `onValueChange` on boxes and the clock. An end is `"from"` or `"to"`, never an index or a side. A view is a `Date`.
- Checks, from `test-projects/next-app`, one at a time, each under `nice`: `pnpm exec tsc --noEmit`; `pnpm exec eslint components/date-picker-9 app/date-filter-demo`; `pnpm exec prettier --check components/date-picker-9 app/date-filter-demo/_cards`. Zero errors, zero warnings.

Never, each drawn from a finding kind of audit 7:

- A key handler (`onKeyDown`, `onKeyUp`), a `tabIndex`, a roving tab stop.
- `querySelector`, `querySelectorAll`, `closest`, `document.activeElement`, `instanceof` on an event target. The one DOM test is `contains` in `leftBothBoxes`.
- A `focus()` call in `PickerField`, its X handler included, and `autoFocus` on its input (B6). The one `focus()` call in the folder is the trigger's, after its X (R2).
- `value[0]`, `value[1]`, an index for an end, a two-item array read by position, a loop that tests its index.
- A same-value test outside `TypedPicker`. A limit or step check outside the entry.
- State that copies a prop, a reset on open, a flag that suppresses another handler, a second commit of one change.
- A context other than the two of section 6. A hook of our own: none exists in this picker, because no two components share logic that holds React state, refs or effects. A function that calls no React hook named `use...`. A one-line reader of a context. `useMemo`, `useCallback`.
- A type in `types.ts` that one file alone uses; a type used by two or more files, or a public one, declared outside `types.ts`, except `PickerLabels` (4.2); a type declared below a file's constants or code. An import between the folders that is not relative.
- A generic type or component with one user; a helper around one call; a type derived from an internal component's props for the public API; template-literal value types; `as` casts; a second, loose copy of a public type other than `PopupOptions` (3.2).
- A prop that is not in the table of 5.8. A named prop a component takes only to hand on: a hand-on is the rest spread, or the one case 5.8 names.
- `type="button"` on a Base UI button; a `data-slot` of our own; a selector on a stock slot outside section 9.
- A fix for one browser applied to all, except the approved iOS overlay and the rows of section 9 that say so.
- A `title` tooltip as a hint, except `yearFormat` on the year box and the Today button (both 7.4).
- A ternary nested in a ternary; a parameter that shadows an import; two names for one thing.

## 11. How each audit 7 finding is designed out

| Design decision | Findings it removes |
|---|---|
| A. The clock is plain buttons; the popover opens with focus on the popup itself; no slot attributes | 1.1, 6.8, 9.14, 11.2 |
| B. The swap is one pure function with two triggers (leave both boxes, popup close), each a plain handler that calls the functions of `range.ts`: no hook, no flag, no state and no helper of its own, which is what 3.1 objected to in 7.4's hook; no clock handler; the X only prevents its mouse-down default and calls no `focus()` | 3.1, 3.4, 3.5, 4.9, 5.11, 6.5 (for pointer moves between the boxes and for the phone dialog; on desktop Tab from an end box enters its calendar and orders the pair, which is call 6 as worded: R15), 11.7 |
| C. Stock non-modal popover | 3.2 |
| D. View state lives in the panel inside the popup; one view state per panel; views are reset from the value on a typed change, a preset and a swap; one `endBounds` | 1.2, 3.3, 4.2, 6.7, 9.2, 9.5, 11.5 |
| E. One `PickerPopup` with a trigger prop; one JS test for "phone dialog", read through one context; calendar padding and background set once in `DayCalendar`; the presentation props are typed once for the app (the strict `PresentationProps` union) and once for the parts (the plain `PopupOptions`), both in `types.ts`, each with its reason (3.2), and no part needs a cast; `PopupActions` is Base UI's exported type; `showCloseButton` not in `DialogProps` | 1.7 (the double X; X and Done both stay, call 9), 2.8 (first half), 3.6, 4.4, 5.1, 8.4, 11.4 |
| F. Public props written directly, member by member, in `types.ts`; a part's own props are a named type at the top of its file, and a type two files use is in `types.ts`; the entry is the one guard and the one limit check; `ControlProps` is one type of group "values"; `TimeField` is rendered by the entry; one `CalendarProps` name; no `buttonVariant`, no `dir` | 2.10, 4.3, 4.6, 4.7, 5.13, 8.1, 8.5, 8.10, 8.11, 9.1, 11.3, 11.9 |
| G. react-day-picker's modes do the selecting: `required`, `mode="range"` for days and for weeks, `DateRange` as the type; no defaulted parameters | 2.1, 2.2, 2.3, 2.8 (second half), 9.11 |
| H. Period pickers split into one-value and range components with their own value types; one `PeriodView`; names as objects; presets passed as given; no year-list grey-out; no `typing` for years; `pickRange` knows a lone To; the decade text is one label; three header buttons written in order from `view-nav.tsx`; band classes live in `day-calendar.tsx` | 2.5, 4.1, 4.11, 4.12, 5.4, 5.10, 6.6, 7.3, 8.9, 9.8, 10.6, 11.1, 11.6, 11.8 |
| I. `PickerField` has one root, one noun (`label`), one draft shape, one effect with the limits in its deps, no key-up read, no `title` hint; `required` for the time inside a date-time | 1.5, 1.8, 6.1, 6.9, 7.1, 8.2, 8.3, 5.12, 9.12 |
| J. Time arithmetic is one file used by the clock and by day clicks; picked times are brought inside the limits; seconds whenever the step needs them; column size from a cap and a minimum | 6.2, 6.3, 6.4, 6.11, 9.3, 9.6, 9.9, 9.13, 10.2 |
| K. Each value helper exists once in `values.ts` and `views.ts`; date-fns results are used as they come; both limits enter the year list | 2.7, 4.10, 6.10, 9.7, 9.10 |
| L. Range panels read ends by name; one end box for date and date-time; ids from `useId` in the panel; `formatEnd`; the badge is a caption variant, not a prop through a context; the tight box loses its stock repeats | 2.9, 4.5 (mechanism; the look stays, call 8), 4.8, 5.2 (stock repeats), 5.3, 5.9, 9.4 |
| M. The trigger sets no name of its own; "outside the limits" is merged into `aria-invalid` at the caller; labels merged without a memo | 1.10 (memo), 7.2, 8.6 (mechanism) |
| N. A fixed `role="group"`; label keys renamed | 2.4, 8.8 (keys) |

Deliberately not addressed, and why:

| Finding | What stays | Why |
|---|---|---|
| 1.3 | From and To labels of equal width in the phone dialog | look frozen (call 9); the mechanism changes to one grid with an `auto` label column (section 9 row 25) |
| 1.4 | the default-time fix after a swap | call 8 |
| 1.6 | From and To titles over week and month range views | call 9 |
| 1.9 | dimmer other-month days | look frozen (call 9) |
| 1.10 (class) | `cn-button-group-orientation-horizontal` | look frozen (call 9) |
| 2.6, 9.15 | `formatValue` in two steps; "drop empty ends, then sort" inline | the audit's own verdict is keep |
| 5.2 (padding) | four padding overrides on the date-time end box | owner finding 9 |
| 5.5, 5.6, 5.7, 10.1, 10.3, 10.5 | band transition, small dropdown text, today classes, phone cell size, popup offsets, iOS placeholder padding | call 8 |
| 5.8 | `appearance-none`; the dialog body's `-m-1 p-1` | iOS cannot be checked under the hard rules, and the owner tested 7.4 with it; the second keeps focus rings whole. Each has its reason in the code |
| 6.12 | an open `auto` picker closes when the window crosses 768 | accepted and documented (call 8) |
| 8.6 (rule) | only period triggers turn red | call 9 |
| 8.7 | the iOS placeholder stays on the boxes that have it | call 9 |
| 8.8 (texts) | "Pick a date", "Select date", "Pick a week" | visible text frozen (call 9) |
| 10.4 | two bracket lengths in the calendar's spacing | look frozen (call 9) |

## Review notes

Two readers with no history reviewed this plan; their required changes are applied above. Asked and not applied as asked:

- "The X takes focus in its click handler, as 7.4": not applied. It is the third part of finding 3.4 and conflicts with the other reader's change, which is applied: B6 states the real outcome (focus on the page) and section 10 forbids a `focus()` call in `PickerField`.
- "No hook of our own except the two context readers": not applied. The other reader's change removes both hooks, which is less code; contexts are read with `React.useContext`. The folder has no hook of our own (section 10, and the owner's decisions below).
- "Write the real sequence as the outcome: the first press inside an end's clock orders the pair and the pick lands on the other date": not applied. That outcome writes a time onto a date the user did not pick it for. The clock takes focus as it opens instead, so the pair is ordered before a pick (R16).
- "`RangeEndBox` passes `popoverProps={{ initialFocus: true }}`; check the hour column's scroll when built": applied in another form. Base UI's default focus scrolls the first hour into view (`FloatingFocusManager.js:390, 409`), which would have left a check open; every clock gives `initialFocus` a ref to its popup, so there is one clock behaviour and nothing to check (section 6 row 20). The alternative, two more refs so a clock popup counts as inside its box, is not applied: more refs, and Safari would still order at the press on the clock button.
- "Pass `clockLimit(min, day) ?? edgeTime(...)` to `TimeField` and to the end's `ClockPopover`": applied as one function, `dayTimeLimits`, which replaces `clockLimit`, so the rule is written once and `timeOnDay` uses it too.
- "A props table for ... the five panels": there are four panels; `GridHeader`, `PeriodGrid` and `TimeColumn` are in the table as well.
- "`items-center` plus the gap the pixel check gives" (row 25): the gaps are written out from 7.4 (`gap-x-3 gap-y-2`), so no value is left to find.

Found while building, plan against code (step 1):

- Section 12, cards: the plan writes the calls line as `["calls", calls]`. `ValueLine` in `app/date-filter-demo/_lib/types.ts` is `[label: string, value: string]` and that file is not edited, so a number does not compile; the cards write `["calls", String(calls)]`, printed as `calls: "3"`.
- Section 2, G1, D5 and a repeated D9: the plan marks 7.4 "same". 7.4 calls `onChange` again with the unchanged value on a click of the selected day and on a repeated preset (7.4 `modes/date-mode.tsx:57-66`, audit 9.1 "missing at"); version 9 does not (G1). The calls lines of the two row 1 cards differ by one at each such action.

Found while building, plan against code (step 2):

- Section 2, G1 on a date-time: as the step 1 note. 7.4 calls `onChange` again with the unchanged value on a click of the selected day and on a repeated preset (7.4 `modes/datetime-mode.tsx:69-76, 103-106`); version 9 does not. The calls lines of the two row 3 cards differ by one at each such action.
- Section 4.1 lists no shared time format, and says `checkedLimits` (`values.ts`) keeps a limit "only if it is a value of the type" while `toSeconds` (`time.ts`) is "undefined for other text". Both need the grammar of a time, and `time.ts` imports `values.ts` (`datePart`, `timePart`, `joinDateTime`), so `values.ts` cannot call `toSeconds` without an import cycle. Built: `values.ts` exports one `timeFormat`, which its own check and `toSeconds` both test.
- Section 9 has no row for the clock's option buttons. 7.4 gives them `w-full font-normal tabular-nums` (7.4 `components/time-columns.tsx:87`) and the pixels are frozen (section 13). Built: `font-normal tabular-nums` with its reason in one line; `w-full` is not needed, the buttons stretch in their column.
- Section 13, datetime actions, "half-delete that time": in Playwright's WebKit the 7.4 card's page crashes on that key press (at that key 7.4 stores 00:00 and remounts the Time field's input, audit 6.1; the crash's cause was not looked into further), so there the 7.4 side of that one action is not run; the version 9 side is, in both browsers.
- Section 13, date actions, "Limits min/max: click a greyed day": the demo's limits are whole months and the year list ends at the limit's month (D7), and react-day-picker does not draw days outside `startMonth` to `endMonth` (`data-hidden`), so no greyed day shows on row 1. Greyed days are checked with Year list "year 1 to 3400" added, which puts the list past the limits.
- U7: the demo cards control `open` in both `popoverProps` and `dialogProps`, so an open `auto` picker stays open across 768 as the other popup, on 7.4 and on 9. "The picker closes" holds only for a picker whose open state the app does not control, which no card shows.
- Section 5.2, section 6 row 1 and section 8 ("one pure `draftOf(input, left)`"): a draft counts only while its `value` is the picker's value, so the Time field of DT8 cannot keep a half-typed time if the box passes `""` on and `DayPanel` drops it: that draft is stale at once. Built in `PickerField`: a `required` box does not pass an empty value on and its draft keeps the picker's value, the same rule as B5. The blur read needs the rule too, so the component has `read(input, left)`, which calls `draftOf` and applies it; the effect calls `draftOf` alone.
- B5: Chromium takes no fifth year digit in a date box whose `max` has a four-digit year (the box's default `max`), so B5 shows in WebKit only.
- Section 6 row 8 ("it sets `draftOf(input, left)`"): a refused text (B5; an emptied required box, DT8) is held by a draft that keeps the picker's value (row 1), and `draftOf` alone gives the box text as the draft's value, so a limit change (B8) dropped that draft and the box snapped to the stored value. The plan does not state where B5 meets B8; built as both rows read together: the effect stamps its draft with the picker's value (`{ ...draftOf(input, left), value }`), so the text stays and its message is re-read.
- Section 9 row 30 lists the presets row's classes only. 7.4 `components/picker-presets.tsx:30` also puts `flex-1` on each preset `Button`, so the buttons share a line's width; kept as a listed override of row 30 (look frozen, call 9), with its reason in the row's comment.
- Section 2, C7 ("the first time on the step from the start of the picked unit"): for a press on AM or PM the picked unit read by the letter is the half day, so a value off the step would lose its hour (10:07, step 900, PM gives 12:00). 7.4 moves the hour to the other half and searches from that hour (22:00; 7.4 `components/time-columns.tsx:194-198, 265-267`), and section 2 lists no such difference. Built as 7.4: off the step, a press on AM or PM searches from the replaced time's own hour, and takes the half's first time on the step when no later one is in it; the half-day list says so by name (`keepsHour` in `clockColumns`). Hour, minute and second picks are as C7 says.

Found while building, plan against code (step 3):

- Section 9 row 23 (`*:data-[slot=input-group-addon]:not-last:mr-0`, copied from 7.4, whose clock popover was modal): the stock non-modal popover of call 7 draws two focus guards and a span where its portal sits in the tree, after the clock's addon inside the box, while it is open (`nm/@base-ui/react/floating-ui-react/components/FloatingPortal.js:136, 185-201`). The clock's addon then stops being the last child, its stock `-mr-1` becomes 0, and the box, the popup and both calendars grow about 5px for as long as an end's clock is open. Built as `not-last-of-type:mr-0`: the X's addon is still the one named, and the popup keeps its size.
- Section 9 row 25 (`gap-x-3`, "the stock field gap ... `cn-field`, `gap-3`"): the field gap is the style's, `gap-3` in vega, luma, maia, rhea and sera and `gap-2` in lyra, mira and nova (`styles/style-*.css`, `.cn-field`), and the demo page runs a `gap-2` style: 7.4's label and box are 8px apart there, so `gap-x-3` moved the two boxes 4px. Built with the style-sheet hook `cn-field` on the grid in place of `gap-x-3` (and `gap-y-2` as planned), so the gap follows the style as 7.4's stock Field does.
- Section 2, B6 ("a box that held focus loses it to the page"): inside a popover Base UI moves focus lost with a removed element onto the popup (`nm/@base-ui/react/popover/popup/PopoverPopup.js:109`, `floating-ui-react/components/FloatingFocusManager.js:274-289`). An end box cleared by its X leaves focus on the range popup in Chromium and on the page in Playwright's WebKit; the press makes no call in both.
- Section 2, G1 on a range: as the step 1 and step 2 notes. 7.4 calls `onChange` again on a repeated preset (7.4 `modes/range-mode.tsx:311-315`); version 9 does not. The calls lines of the two cards of rows 2 and 4 differ by one there.
- Section 2, R10, last sentence: the lone To's typed time becomes the default when a later day is clicked, where To's day becomes From's. On a click of an earlier day or of To's own day, To's day does not change and To keeps its value: that is the `selectRange` contract of 4.1 on react-day-picker's order (`nm/react-day-picker/dist/esm/utils/addToRange.js:23-45`), and what is built.
- Section 13, datetime range actions, "pick the hour 9 (... 7.4: `[10th T09:00, 20th T10:00]` once the clock closes)": 7.4 gives `[10th T21:00, 20th T10:00]`, because its To box still holds 16:00 when the hour is picked and a picked hour keeps PM. Version 9 gives the value the plan names.
- Section 13, allowed difference 6, in Playwright's WebKit at 390 wide: the browser's range message of a date box is long enough to wrap once it starts at the box's edge, so the flagged row is one line taller than on 7.4 and everything under it sits lower.

Owner's decisions, 2026-11-22:

- Rejected: section 4's flat folder of 21 files. His words: "I agreed with the folder structure of the previous versions: this is not acceptable"; "Since it is gonna be a library, you can have a central file types.ts to define all the types there". Decided first: the layout of `review-notes.md` line 23 (`date-picker.tsx` entry only, `modes/`, `components/`, `hooks/`, `utils/`, one shared hook `use-range-order`), plus `types.ts` for every type; `type="time"` one value has no mode file; `labels.ts` in `components/`; file names unchanged. The two points below replace the hook and the "every type" part of it.
- No hook. His words: "if there is no hook needed, thats fine". The designed `useRangeOrder` called no React hook, so it was a plain helper with a hook's name. `hooks/` and `use-range-order.ts` are gone; the two range pickers and their panels share `isReversed`, `orderRange` and `leftBothBoxes` of `utils/range.ts` as built, and no fourth function is added (5.8). Rule in section 10: no hook of our own, a function that calls no React hook is never named `use...`, a one-line context reader is not written.
- `types.ts` holds only the public types and the types two or more files use. His words: "if types are used by other components or other places, that means types.ts earns its place". A type one file uses stays at the top of that file; file order is imports, own types, constants, code. `PickerLabels` stays in `components/labels.ts` as `typeof defaultLabels` (approved exception). Sorted against the built code in 4.2: 26 types in `types.ts`, 47 left in their files.
- Result: 22 files. Changed here: sections 1, 3 (public types written in `types.ts`, re-exported by the entry), 4 (tree, table, 4.1, 4.2), 5.4, 5.6, 5.8, 6, 8, 10 (file order, where a type lives, the hook rule), 11 (B, F) and 12 (step 6 is `git mv`, imports and `types.ts`; no hook extraction). Behaviour, public API shapes, states, effects, refs, contexts and styling are unchanged; the code built in steps 1 to 5 is kept and moved.
