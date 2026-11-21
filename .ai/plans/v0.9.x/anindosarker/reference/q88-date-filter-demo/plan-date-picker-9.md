# Plan: date picker version 9

Design plan for one component, `<DatePicker type range? />`, rebuilt once from this plan.
Paths: `app/` and `components/` mean `test-projects/next-app/...`; `ui/` means `components/ui`; `nm/` means `node_modules`; "7.4" means `components/date-picker-7-4`.
Every stock source line below was opened in the planning run (Base UI 1.9.0, react-day-picker 10.0.2, date-fns 4).

## 1. Goal and frame

- Version 9 is a new folder, `components/date-picker-9`, written from this plan. No file is copied from an older version; 7.4 is read only to check behaviour and to copy the class strings section 9 names.
- Frozen: what a user sees and what `onChange` emits on 7.4. The owner tested and approved it.
- Changed on purpose, and nothing else:
  - Owner calls: review-notes decisions 1 to 5 and calls 6 to 9 (one-route swap, stock popover with no focus trap, year as a four-digit text box, open state inside `popoverProps` and `dialogProps`, no hand-written arrow keys, file order).
  - Defects of audit 7 sections 6 and 7, and one more found in the plan review (DT11: the step base of the Time field and clock on a day other than `min`'s). Each is marked "7.4 wrong" in section 2.
  - The behaviour side of the audit's clear-cut removals (1.1, 1.2, 1.5, 1.8, 2.2, 2.5, 4.11, 11.1). Each is marked "differs from 7.4" in section 2.
- Looks are pixel-frozen (owner call 9, and call 8's rule: "where the look the owner approved would change, keep it and write its reason in one line"). An audit item whose fix would move a pixel is kept as a listed override in section 9 with its reason, not removed.
- Done means: section 13 passes. Twelve version 9 cards, the same emitted values as 7.4 for the named actions, pixel comparison clean except the listed differences, a final strict audit that finds nothing clear-cut.
- Rule for the implementer: where this plan and 7.4 disagree and the case is not listed here, stop and report. Never fill a gap with new machinery.

## 2. Behaviour contract

Value formats (the browser's own): date `YYYY-MM-DD`, datetime `YYYY-MM-DDTHH:mm` (`:ss` when seconds are not zero), time `HH:mm` (`:ss` likewise), week `YYYY-Www` (ISO), month `YYYY-MM`, year `YYYY`. Empty is `""`. A range is `[from, to]`.

### 2.1 Every picker

| # | Case | User sees | `onChange` | 7.4 |
|---|---|---|---|---|
| G1 | Any action that leaves the value as it is | no change | not called | same (9.1: guarded in nine places) |
| G2 | `disabled` | box or trigger disabled, popup button disabled, no X | never | same |
| G3 | `min` or `max` not in the type's format | limit ignored whole; `console.error` outside production | - | same |
| G4 | `step` not a whole number above zero | step ignored; `console.error` outside production | - | same |
| G5 | `labels` | the picker's own words replaced key by key | - | same; keys renamed, see 3.4 |

### 2.2 Every typed box

Applies to the date, date-time, time and year boxes, the two boxes of a date, date-time, year or time range, and the time box in the date-time popup.

| # | Case | User sees | The box passes on | 7.4 |
|---|---|---|---|---|
| B1 | A complete valid value is typed | the value | the value, once | same |
| B2 | Half-typed (a date part missing; a year under four digits) | the typed text stays; no red mark while focused; after leaving: red border and the browser's message under the box | `""` once, if the value was not empty | same |
| B3 | A complete value outside `min` or `max` | value kept; red border and the browser's range message after leaving | the value | same |
| B4 | A time off `step` | value kept; the browser's step message after leaving. Step counts from `min`, else from 00:00 | the value | same |
| B5 | A year of five digits or more in a date or date-time box | the browser flags it (box `max` is 9999-12-31 when the app sets none) | nothing | same |
| B6 | X | shown when the box holds a value or half-typed text and is enabled; a press empties the box, half-typed text included. The mouse press itself moves no focus (its mouse-down default is prevented). The input is remounted to wipe half-typed parts, so a box that held focus loses it to the page; a box that did not hold focus changes nothing; an X reached by Tab keeps focus and stays visible | `""` | differs from 7.4: there focus was moved onto the X (3.4); after a first date part typed into an empty box the X appears when the box is left or the date completes (1.8) |
| B7 | A value arrives from a click, the clock, a preset or the app | the box shows it; if it breaks `min`, `max` or `step` it is flagged at once | - | same |
| B8 | The app changes `min`, `max` or `step` | the mark and message are re-read | - | 7.4 wrong (6.9): not refreshed |
| B9 | iOS, empty date or date-time box | the placeholder text is drawn over the blank box; gone on focus. Only the boxes that pass a placeholder on 7.4: date, date-time, the range end boxes, the time box in the date-time popup | - | same (call 9). Not checked in a browser: Playwright's WebKit on macOS does not match the iOS test and iOS devices are forbidden (section 14); checked by string equality of the overlay's markup and classes with 7.4 `picker-field.tsx:192-198` |
| B10 | The box has an `id` or `aria-labelledby` from the app | the app's label names the box; else the box's own noun ("Date", "Time", "Year", "From", "To") | - | same rule; the X is always "Clear" plus that noun. 7.4 wrong (7.1): "Clear value" |
| B11 | The box and its message | one root element; the message sits under the box inside it | - | 7.4 wrong (8.2): two sibling roots |

### 2.3 date, one value

| # | Case | User sees | `onChange` | 7.4 |
|---|---|---|---|---|
| D1 | Closed | date box, X, calendar button | - | same |
| D2 | Calendar button | popup: one calendar (month and year dropdowns, previous, Today, next at the right), then the presets row | - | same |
| D3 | Opening month | the value's month, else today's, held inside the year list | - | same |
| D4 | Click a day | popup closes | `YYYY-MM-DD` | same |
| D5 | Click the selected day | popup closes | not called | same |
| D6 | A day outside `min` or `max` | greyed; a click does nothing | - | same |
| D7 | Year list | 1900 to 2100, each side on its own. A side with no limit grows to the century of a value's year beyond it (1443 gives 1400 to 2100, 2250 gives 1900 to 2300). A side with `min` or `max` ends at the limit's month, whatever the value: a value beyond a limit never grows the list. `calendarProps.startMonth` and `endMonth` win over both | - | same |
| D8 | Only `max` before 1900, or only `min` after 2100 | the list still runs first month to last month | - | 7.4 wrong (6.10): start after end |
| D9 | Preset | the calendar moves to its month; popup stays open | the preset's value | same |
| D10 | Today | calendar shows today's month | - | same |
| D11 | An arrow at the end of the list | dimmed, does nothing, stays a tab stop | - | differs from 7.4 (2.5): there it left the tab order |

### 2.4 datetime, one value

| # | Case | User sees | `onChange` | 7.4 |
|---|---|---|---|---|
| DT1 | Closed | date-time box, X, calendar button | - | same |
| DT2 | Popup | calendar, a Time field (time box with clock button), presets | - | same |
| DT3 | Click a day, no value yet | popup stays open | day plus the first time: `00:00`, or with `step` the first time on the step counted from `min`'s time | same |
| DT4 | Click a day, value exists | popup stays open | day plus the value's time | same |
| DT5 | Click `min`'s day or `max`'s day | - | the time is brought inside that day's limit, on the step | 7.4 wrong (6.2): a time before `min` or after `max` |
| DT6 | Time field, no date yet | disabled | - | same; the hover tooltip "Pick a date first" is gone (1.5) |
| DT7 | A complete time is typed in the Time field | - | date plus that time | same |
| DT8 | The Time field is half-typed or emptied | it keeps the typed text; flagged after leaving ("fill out this field" for an empty one); the value does not change | not called | 7.4 wrong (6.1): snaps to the first time and drops focus |
| DT9 | X on the Time field | there is none: a date-time cannot have an empty time. The outer box's X clears the whole value | - | 7.4 wrong (6.1): an X that set 00:00, dead at 00:00 |
| DT10 | Limits of the Time field and its clock | `min`'s time limits them only on `min`'s day, `max`'s only on `max`'s day | - | same |
| DT11 | `step` and `min` set, the value's day is not `min`'s day | the Time field and its clock count the step from `min`'s time of day, as the outer box does (`min` `...T09:10`, step 900: 00:10, 00:25, 00:40, ...). Nothing is flagged after a day click; the clock lists only times the outer box accepts | a picked time is on the outer box's step | 7.4 wrong (found in the plan review, not in audit 7): there they counted from 00:00, so the Time field turned red right after a day click and a clock pick was flagged by the outer box |

### 2.5 The clock (time, time range, date-time popup, date-time range)

| # | Case | User sees | The clock passes on | 7.4 |
|---|---|---|---|---|
| C1 | Clock button | popover with columns: hour (12 or 24 by the browser's locale), minute, second (see C3), AM/PM (12-hour) | - | same |
| C2 | Opening | each column shows its selected option centred; focus moves to the clock popup itself, no option is focused and nothing scrolls. Tab then reaches the first hour | - | differs from 7.4 (1.1): there focus moved to the selected hour |
| C3 | Columns by `step` | no step: every minute. `step` 900: 00, 15, 30, 45 from the step base. Seconds column whenever `step` is not a whole number of minutes | - | 7.4 wrong (6.11): seconds only under 60, so step 90 stored off-step times |
| C4 | Step base | the time of day of the picker's `min`, on every day; else 00:00:00 | - | same for time and time range; 7.4 wrong in the date-time popup and in a range end's clock on a day other than `min`'s (DT11) |
| C5 | Options outside `min` or `max` | greyed. AM or PM is greyed when its whole half is outside | - | 7.4 wrong (6.3): AM/PM never greyed |
| C6 | Empty value, `min` set | the minute column lists the minutes of the first allowed hour | - | 7.4 wrong (6.4): whole minute column greyed |
| C7 | Pick an option | popover stays open | the current time with that unit replaced. From an empty box: the hour of a picked minute or second is the first allowed hour (C6), every unit smaller than the picked one is 0, and a picked AM gives hour 0, a picked PM hour 12 (7.4's rule, not the first allowed hour moved to that half). Then, in this order: the first time on the step from the start of the picked unit; then brought inside `min` and `max` | 7.4 wrong (6.3, 6.11): could store a time outside the limits or a different minute |
| C8 | Keyboard | every option is a plain button and a tab stop; Enter or Space picks; no arrow, Home or End keys. The typed box is the keyboard path | - | differs from 7.4 (1.1, decision 2); 7.4 wrong (6.8): a column with no option on the current time could not be reached |
| C9 | Width | a long translated AM/PM grows its column | - | 7.4 wrong (10.2): cut at a fixed width |

### 2.6 time, one value and range

| # | Case | User sees | `onChange` | 7.4 |
|---|---|---|---|---|
| T1 | time | time box, X, clock button | typed and picked times | same |
| T2 | time range | a From field and a To field, each a time box with its clock | `[from, to]` | same |
| T3 | time range order | never reordered: 22:00 to 06:00 is kept | - | same |
| T4 | time range `id` | goes to the From box; the To box gets `id + "-to"`; `aria-invalid` and `aria-describedby` go to both boxes; `aria-label` and `aria-labelledby` name the group, which always has `role="group"` | - | same; role is no longer conditional (2.4) |
| T5 | time `popoverProps` | open state and content props of the clock popover. A time range takes content props only: one open flag cannot name two clocks | - | same |

### 2.7 date and datetime range

| # | Case | User sees | `onChange` | 7.4 |
|---|---|---|---|---|
| R1 | Closed | a button with a calendar icon and the two ends as text ("Nov 3, 2026 - Nov 12, 2026", an empty end as "..."), placeholder "Pick a date" or "Pick a date and time range"; X beside it when an end is set | - | same |
| R2 | X on the trigger | focus returns to the trigger | `["", ""]` | same |
| R3 | Popup, desktop | two columns, From then To: label, end box, calendar; presets under both | - | same |
| R4 | Popup, under 768 wide, popover | the two columns stacked | - | same |
| R5 | Phone dialog | From row and To row on top (label and box on one line, the two boxes lined up), two calendars sharing the rest of the screen with a From or To badge in each caption, presets, Done | - | same |
| R6 | Click a day, both ends empty | - | `[d, d]` | same |
| R7 | Click a day, range set | react-day-picker's range rule: before From replaces From; after From replaces To; the only day of a one-day range clears both | the new pair | same |
| R8 | datetime: a picked day | - | a new From day gets the first time, a new To day the last (`00:00` and `23:59`; with `step` the first and last on the step); an end whose day did not change keeps its time | same |
| R9 | datetime: a picked `min` or `max` day | - | its time is brought inside that day's limit | 7.4 wrong (same cause as 6.2) |
| R10 | Only To set, click a day | - | the clicked day and To's day in order. A click on To's own day gives a one-day range. In a date-time range the lone To's typed time becomes the default | differs from 7.4 (2.2): there To's own day did nothing and the typed time was kept |
| R11 | Calendars on a click | both stay on their months | - | same |
| R12 | Type in an end box | both calendars go to the months of the new pair (From's month, To's month, never the same month) | the pair with that end replaced, on every change | differs from 7.4 (1.2): a reversed typed To no longer pulls its calendar; the other calendar returns to its own end's month |
| R13 | Year list while typing | the end being typed is left out of the year list until its box is left (a date box reports the years 1, 14, 144 while 1443 is typed) | - | same |
| R14 | Typed range reversed | the band is still drawn from the earlier day to the later | the reversed pair as typed | same |
| R15 | Focus leaves both end boxes for anything else, or the popup closes | the ends swap; the calendars go to the ordered months. In a date-time range an end still on its default time (first or last) gets the other default. A move from one end box to the other never swaps: a click from box to box at any width, and Tab from box to box in the phone dialog, where the two boxes follow each other. On desktop each end's calendar follows its box in tab order (R3), so Tab out of the From box enters the From calendar and orders the pair before To is reached (call 6 as worded). A box cleared by its X fires no blur (B6), so the X never swaps | the ordered pair, once | call 6. 7.4 wrong (6.5): swapped when one box was left, so typing From then To lost the typed From. Removed for pointer moves and for the phone dialog; the desktop Tab path still orders at the first Tab out of a box |
| R16 | An end's clock is opened (date-time range) | focus moves into the clock popup (C2), which is outside both boxes, so R15 runs as the clock opens: a reversed pair is ordered before an option can be pressed, and the clock then edits the end its box now holds. The columns stay scrolled where they opened. The same in every browser: where a clicked button takes no focus (Safari), the press on the clock button already left both boxes | the ordered pair, once; then each pick replaces the time of the end the box holds | differs from 7.4: there the swap waited until the clock closed (the `picking` flag call 6 removes), so the clock edited the end as typed |
| R17 | Calendar navigation | the two calendars never show the same month: the one not moved gives way; with one month in the list both show it | - | same |
| R18 | Preset | calendars go to its months; popup stays open | the preset's pair | same |
| R19 | A range outside `min` or `max` | the end boxes flag it; the trigger is not red | - | same (call 9) |
| R20 | An end's clock (date-time range) | its button is disabled while that end is empty; its limits and step base are those of that end's day (DT10, DT11) | a pick replaces that end's time and keeps its date. A pick that makes a same-day pair reversed is kept as picked while focus stays in the clock; the pair is ordered by R15 when focus next leaves both boxes or the popup closes | same, except the step base (DT11) and the moment of the swap (7.4: when the clock closed) |

### 2.8 week, month, year

| # | Case | User sees | `onChange` | 7.4 |
|---|---|---|---|---|
| P1 | week, closed | trigger button "Week 47, 2026", placeholder "Pick a week"; X when set | - | same |
| P2 | week popup | a calendar with ISO week numbers, Monday first; the selected week as a band | - | same |
| P3 | Click any day of a week | popup closes | `YYYY-Www` | same |
| P4 | month, closed | trigger "Nov 2026", placeholder "Pick a month" | - | same |
| P5 | month popup | header: year select over the year list, previous year, Today, next year; twelve month buttons in three columns, names from `calendarProps.locale` | - | same |
| P6 | Click a month | popup closes | `YYYY-MM` | same |
| P7 | year, closed | a four-digit text box (`inputMode` numeric, `maxLength` 4, placeholder "yyyy"), X, calendar button | - | same |
| P8 | year typed | only a complete year from 0001 is stored; `195` or letters store nothing and get the browser's pattern message after leaving | the year, or `""` once | same |
| P9 | year outside `min` or `max` | flagged at once with "Value must be 2025 or later." (`labels.yearMin`, `yearMax`) | the year | same |
| P10 | year popup | header: decade text, previous decade, Today, next decade; ten year buttons | - | same |
| P11 | Click a year | popup closes | `YYYY` | same |
| P12 | A month or year outside `min` or `max` | greyed | - | same |
| P13 | A year outside the year list but inside the limits | not greyed | - | differs from 7.4 (4.11) |
| P14 | Today's month or year | muted background; `aria-current="date"` | - | 7.4 wrong (7.3): no `aria-current` |
| P15 | A week or month value outside `min` or `max` | the trigger is red (`aria-invalid`) | - | same (call 9) |
| P16 | Trigger name | the app's `<label for>` or `aria-label` names it; the picker sets no `aria-label` of its own | - | 7.4 wrong (7.2): its own label always won |
| P17 | Preset | the view moves to it; popup stays open | the preset's value | same |
| P18 | Text direction | the grids follow the page | - | differs from 7.4 (8.11, call 8): `calendarProps.dir` is not read by the grids |

### 2.9 week, month and year range

| # | Case | User sees | `onChange` | 7.4 |
|---|---|---|---|---|
| PR1 | Closed | trigger "Week 44, 2026 - Week 47, 2026", "Aug 2026 - Nov 2026", "2020 - 2024"; placeholders "Pick a week range", "Pick a month range", "Pick a year range" | - | same |
| PR2 | week and month popup | two views titled From and To | - | same (call 9 keeps the titles) |
| PR3 | year popup | per end: label, year box, decade grid | - | same |
| PR4 | Click, both ends empty or both set | - | `[p, ""]` | same |
| PR5 | Click, only From set | - | the two in order | same |
| PR6 | Click, only To set (a typed To, or From cleared by its X) | - | the two in order | 7.4 wrong (6.6): the To was thrown away |
| PR7 | Popup does not close on a click | - | - | same |
| PR8 | Only To set, opening | the To view shows To; the From view the one before | - | 7.4 wrong (6.7): both jumped to today |
| PR9 | Views | never the same view; step is one month (week), one year (month), one decade (year). With one view in the list both show it and no arrow pages (the demo's Limits "min/max" gives this for a year range and a month range) | - | same |
| PR10 | year: a far year typed (1443) | on a side with no limit the year list grows and that end's grid follows at once. On a side with a limit the list does not grow (D7): the grid stays at the list's edge and only the box is flagged (P9) | the pair | differs from 7.4 (11.1): there the grid waited for the box to be left |
| PR11 | year: typed range reversed, then focus leaves both boxes or the popup closes | the ends swap; the grids follow | the ordered pair, once | call 6 |
| PR12 | Trigger red | when an end is outside `min` or `max` | - | same |

### 2.10 Popup

| # | Case | User sees | 7.4 |
|---|---|---|---|
| U1 | `presentation="popover"` (default) | a popover under the control. From a box it lines up with the box's end; from a trigger with its start. It scrolls inside the room the screen leaves | same |
| U2 | Popover and keyboard | Tab past the last control closes it; Escape and a press outside close it; no focus trap, no hidden Close button | call 7. 7.4: trapped focus |
| U3 | A clock opened inside the date-time popup | the popup behind it stays open | to check when built (call 7) |
| U4 | `presentation="dialog"`, 768 wide or more | centred dialog as wide as its content: title, X, body, Done | same |
| U5 | `presentation="dialog"`, under 768 | full screen; calendars stretch to fill it; Done is full width | same |
| U6 | `presentation="auto"` | dialog under 768, popover from 768 | same |
| U7 | `auto`, window crosses 768 while open | the picker closes | accepted and documented (6.12) |
| U8 | Open state | `open`, `defaultOpen`, `onOpenChange` inside `popoverProps` and `dialogProps`; with `auto` an app that controls it writes it in both | same (decision 1) |
| U9 | `dialogProps` and the X | the app cannot switch a second X on | 7.4 wrong (1.7): `showCloseButton` got through |

## 3. Public API

### 3.1 Exported types

All are exported from `date-picker.tsx`; the "Lives in" file defines them.

| Type | Lives in |
|---|---|
| `DatePickerProps`, `DatePickerType` | `date-picker.tsx` |
| `RangeValue` | `range.ts` |
| `Preset` | `picker-presets.tsx` |
| `PickerLabels` | `labels.ts` |
| `CalendarProps` | `day-calendar.tsx` |
| `PopoverProps`, `DialogProps` | `picker-popup.tsx` |

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

/** The stock popover's open state and content props. */
export type PopoverProps = Pick<
  React.ComponentProps<typeof Popover>,
  "open" | "defaultOpen" | "onOpenChange"
> &
  Omit<React.ComponentProps<typeof PopoverContent>, "children">

/** The stock dialog's open state and content props. */
export type DialogProps = Pick<
  React.ComponentProps<typeof Dialog>,
  "open" | "defaultOpen" | "onOpenChange"
> &
  Omit<React.ComponentProps<typeof DialogContent>, "children" | "showCloseButton">
```

### 3.2 `DatePickerProps`, as written in `date-picker.tsx`

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
  | (Two & {
      popoverProps?: Omit<PopoverProps, "open" | "defaultOpen" | "onOpenChange">
    })
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

`HtmlProps` and `Limits` come from `values.ts`:

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
- `PresentationProps` is the public shape only, defined once, here: decision 1 is about what an app may write. Inside the picker the three props travel as one plain object type, `PopupOptions`, defined once in `picker-popup.tsx`:

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

- Default texts are 7.4's, unchanged (the visible text is frozen: `pickDateRange` stays "Pick a date").
- Against 7.4: `today` is now `goToToday`, `period` is now `amPm` (8.8); new `date` "Date" and `dateTime` "Date and time" (the box's noun, 7.1); new `decade`, default `first`, space, en dash, space, `last` as 7.4 draws it (10.6); gone `value`, `none`, `pickerValue`, `pickDateFirst`.

## 4. File layout

Flat folder, 21 files. Reason: the kind of a file is told by its name (`*-picker.tsx` a picker, `picker-*.tsx` a shared part, `*.ts` a file with no JSX: pure functions, and the labels), so folders would add a level and tell nothing. Components import siblings relatively (the folder is copied whole); stock parts through `@/components/ui/...`.

```
components/date-picker-9/
├── date-picker.tsx          ← entry: public types, DatePicker, the one switch
├── labels.ts                ← the picker's words and their context
├── day-picker.tsx           ← date and datetime, one value
├── day-range-picker.tsx     ← date and datetime range
├── time-range-picker.tsx    ← time range
├── period-picker.tsx        ← week, month, year, one value
├── period-range-picker.tsx  ← week, month, year range
├── picker-field.tsx         ← the typed box
├── picker-box.tsx           ← typed box whose button opens a popup
├── picker-trigger.tsx       ← trigger button with its X that opens a popup
├── picker-popup.tsx         ← the popover or dialog
├── picker-presets.tsx       ← the presets row
├── day-calendar.tsx         ← the stock Calendar as every picker draws it
├── view-nav.tsx             ← previous, Today, next buttons of a header
├── period-views.tsx         ← week calendar, month grid, year grid
├── time-field.tsx           ← time box with its clock popover
├── time-columns.tsx         ← the clock
├── values.ts                ← the six value formats
├── time.ts                  ← time-of-day arithmetic
├── range.ts                 ← a pair's two ends
└── views.ts                 ← which months, years or decades a view shows
```

| File | Single responsibility | Exports | Upper bound: nothing else goes in | Why it exists |
|---|---|---|---|---|
| `date-picker.tsx` | Public types; provide labels; check limits and step once; guard same-value once; pick the picker | `DatePicker`, the types of 3.1 | no markup beyond the provider and the six picker elements | one component for six types |
| `labels.ts` | Default words and `LabelsContext` | `defaultLabels`, `LabelsContext`, `PickerLabels` | no component, no hook, no JSX; readers call `React.useContext(LabelsContext)` | the `labels` prop, read by about twelve components |
| `day-picker.tsx` | Box, calendar popup and, for datetime, the Time field | `DayPicker` | `DayPicker`, `DayPanel` | rows 1 and 3 |
| `day-range-picker.tsx` | Trigger, the two end boxes and calendars, the two layouts | `DayRangePicker` | `DayRangePicker`, `DayRangePanel`, `RangeEndBox` | rows 2 and 4 |
| `time-range-picker.tsx` | Two time fields | `TimeRangePicker` | one component | row 6 |
| `period-picker.tsx` | Trigger (week, month) or box (year) and one view | `PeriodPicker` | `PeriodPicker`, `PeriodPanel` | rows 7, 9, 11 |
| `period-range-picker.tsx` | Trigger and two views; year boxes | `PeriodRangePicker` | `PeriodRangePicker`, `PeriodRangePanel` | rows 8, 10, 12 |
| `picker-field.tsx` | One native or year input: draft, X, message, iOS overlay | `PickerField` | one component, `draftOf`, the input table | nine call sites type a value |
| `picker-box.tsx` | `PickerField` plus a calendar button that opens `PickerPopup` | `PickerBox` | one component | date, datetime and year share it |
| `picker-trigger.tsx` | Button with the value text, X, `PickerPopup` | `PickerTrigger` | one component | seven range and period pickers share it |
| `picker-popup.tsx` | Decide popover or dialog; render it; say "phone dialog" | `PickerPopup`, `PhoneDialogContext`, `PopoverProps`, `DialogProps`, `PopupOptions`, `PopupActions` | the only file that imports `ui/popover` and `ui/dialog`; no hook; readers call `React.useContext(PhoneDialogContext)` | one place for the decision; the one file a port to another base rewrites |
| `picker-presets.tsx` | Buttons that set a value | `PickerPresets`, `Preset` | one component | four panels show presets |
| `day-calendar.tsx` | Stock `Calendar` with the picker's caption, limits, blank weeks, phone fill, range band | `DayCalendar`, `CalendarProps` | the only file that imports `ui/calendar` and react-day-picker's hooks | four panels draw a day calendar |
| `view-nav.tsx` | `NavArrow`, `TodayButton` | both | two components | the calendar caption and the two grid headers draw the same three buttons |
| `period-views.tsx` | Draw one week calendar, month grid or year grid for a view | `PeriodView` | `PeriodView`, `WeekCalendar`, `MonthGrid`, `YearGrid`, `GridHeader`, `PeriodGrid` | single and range period pickers both draw them |
| `time-field.tsx` | Time box plus clock popover | `TimeField`, `ClockPopover` | two components | time, time range, the date-time popup; `ClockPopover` alone in a date-time range end |
| `time-columns.tsx` | The clock's columns | `TimeColumns` | `TimeColumns`, `TimeColumn`, `uses12Hour` | the native time picker is rejected; Safari has none in a date-time box |
| `values.ts` | Parse, format and check the six formats | see 4.1 | pure functions and types; no JSX, no DOM | every picker reads values |
| `time.ts` | Seconds, step, limits of a time of day | see 4.1 | pure functions | the clock and the day click share one sum (9.3) |
| `range.ts` | Read, replace, order and select a pair's ends | see 4.1 | pure functions and types; `leftBothBoxes` reads a focus event | five range pickers |
| `views.ts` | The year list and a range's two views | see 4.1 | pure functions and types | calendars and grids page the same way |

### 4.1 Pure functions

A function with three or more parameters takes one object (coding standards, Code).

| File | Function | Contract |
|---|---|---|
| `values.ts` | `fromYmd(text)` | local `Date` for exactly `YYYY-MM-DD`, else `undefined` |
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
| `time.ts` | `toSeconds(time)` | seconds after midnight, `undefined` for other text |
| | `timeText(seconds)` | `HH:mm`, with `:ss` when not zero |
| | `firstOnStep({ from, to, base, step })` | first time on the step inside `from..to`, else `undefined` |
| | `allowedTime({ time, min, max, step })` | the time brought inside `min..max`, on the step |
| | `edgeTime({ edge, step, min })` | first or last time of a day on the step; `00:00`, `23:59` without one |
| | `dayTimeLimits({ day, min, max, step })` | the `{ min, max }` times of one day, for its Time field and clock: `min`'s time on `min`'s day, `max`'s time on `max`'s day, else `undefined` (DT10). With a `step`, on a day other than `min`'s, `min` is `edgeTime({ edge: "first", step, min })`: the day's first time on the step limits nothing on the step and keeps the step counted from `min`'s time of day (DT11, C4) |
| | `timeOnDay({ day, time, min, max, step })` | the date-time a clicked day gets: `allowedTime` of `time` inside that day's `dayTimeLimits` (DT3 to DT5, R8, R9) |
| `range.ts` | `rangeEnds` | `["from", "to"]` |
| | `putEnd(range, end, text)` | the pair with that end replaced, by name |
| | `isReversed(range)` | both ends set and From after To |
| | `orderRange(range, times?)` | the pair in order; with `times` an end on its default time gets the other default (1.4) |
| | `selectRange({ range, picked, times?, limits? })` | the pair after react-day-picker's `DateRange` (R6 to R10). `times` and `limits` (`{ min, max, step }`) are given for a date-time range only: an end on a new day gets `timeOnDay({ day, time: times[end], ...limits })`, so a `min` or `max` day is brought inside its limit here and nowhere else (R8, R9); an end whose day did not change keeps its value. Without `times` an end is its day |
| | `pickRange(range, period)` | the pair after a period click (PR4 to PR6) |
| | `rangeState(selected, period)` | `"end"`, `"middle"` or `undefined` for one value or two ends |
| | `formatRange({ range, formatEnd, emptyEnd, rangeJoin })` | trigger text; `""` when both ends are empty |
| | `leftBothBoxes(event, boxes)` | whether focus was inside an end box and moved outside both: `event.target` is inside one of the two box elements and `event.relatedTarget` is inside neither. The first half matters: React sends a blur from inside an end's clock popup up to its end box too, and that is not a leave |
| `views.ts` | `listBounds({ days, min, max, startMonth, endMonth })` | the year list as first and last month (D7, D8). Per side, the first that is set: `startMonth` or `endMonth`; the limit's month, whatever the days; 1900 or 2100 grown to the century of the furthest year beyond it among the days and the other side's limit (D8) |
| | `clampView(view, bounds)` | the view held inside the list; today's when `undefined` |
| | `periodViewStart(type, date)` | the month, the year's January, the decade's first January |
| | `periodViewStep` | months one view spans: week 1, month 12, year 120 |
| | `viewsForRange(days, step)` | the two views for a pair (From's, To's or the next; To-only handled) |
| | `shownViews({ views, bounds, step })` | the two views held in the list and apart; when the list holds one view, both are that view (R17, PR9) |
| | `endBounds({ end, bounds, step })` | the views one end may show (From stops one view early, To starts one late); when the list holds one view, the whole list for both ends |

Types: `values.ts` also exports `PeriodType`, `ControlProps<Value>` (`HtmlProps & Limits & { value: Value; onChange: (value: Value) => void; disabled?: boolean }`, six pickers, two value types). `range.ts` exports `RangeValue`, `RangeEnd`, `RangeTimes` (`Record<RangeEnd, string>`: the first and last time on the step). `views.ts` exports `ListBounds`, `RangeViews`.

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
- `ClockPopover` gives `PickerPopup` `popoverProps={{ ref: popupRef, initialFocus: popupRef, ...popoverProps, className: cn("p-0", popoverProps?.className) }}`: focus goes to the popup itself when the clock opens (C2). The same in all four places a clock is drawn; no caller sets it.

### 5.4 date and datetime range

```
DayRangePicker                    times = first and last time on the step (datetime only)
└── PickerTrigger                 ref triggerRef; onClose → onChange(orderRange(value, times))
    └── PickerPopup
        └── DayRangePanel         state views, typing; refs boxes.from, boxes.to
            ├── per end: FieldLabel + RangeEndBox (ref boxes[end], onBlur leaveBox)
            │                    RangeEndBox → PickerField (+ ClockPopover for datetime)
            ├── per end: DayCalendar mode range, rangeBand, captionEnd
            └── PickerPresets
```

- `DayRangePanel` owns the two views, the end being typed, and the blur route of the swap: `leaveBox(event)` clears `typing`; if `leftBothBoxes` and `isReversed(value)` it calls `onChange(orderRange(value, times))` and resets the views.
- The swap has one function, `orderRange`, and two triggers: `leaveBox` in the panel and `onClose` on the trigger. `selectRange` also starts from the ordered pair, so a day click on a reversed pair is right.
- A day click calls `onChange(selectRange({ range: value, picked, times, limits: { min, max, step } }))`: the time and the limit of a new end are applied inside `selectRange` (R8, R9). The panel adds nothing to its result.
- An end's clock is inside its end box in the React tree, and its popup is outside both boxes in the DOM. Focus moves into the popup as it opens (5.3), the clock button's blur reaches `leaveBox` with the popup as the new target, and `leftBothBoxes` is true: a reversed pair is ordered at that moment, before a pick (R16). A blur between two options of the open clock also reaches `leaveBox` (React events cross the portal) and is not a leave, because its source is not inside a box. No handler on the clock, no open callback, no flag.
- `RangeEndBox` gives its clock the day's limits as `{...dayTimeLimits({ day, min, max, step })}` (R20). A clock pick calls `onTimeChange`, a typed value `onValueChange`: only typing sets `typing` and resets the views.
- `React.useContext(PhoneDialogContext)` picks the layout. Columns (R3, R4): per end one `Field` holding the label and the box, then the calendar. Fields first (R5): one grid whose four direct children are `FieldLabel`, `RangeEndBox`, `FieldLabel`, `RangeEndBox` (section 9 row 25), then the two calendars.

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

### 5.6 week, month and year range

```
PeriodRangePicker
└── PickerTrigger                 onClose → onChange(orderRange(value))
    └── PickerPopup
        └── PeriodRangePanel      state views; refs boxes.from, boxes.to (attached for year only)
            ├── per end: year → Field → FieldLabel + PickerField type year
            │            week, month → FieldTitle
            ├── per end: PeriodView
            └── PickerPresets
```

- A pick calls `onChange(pickRange(value, period))`. A typed year calls `onChange(putEnd(...))` and resets the views. The blur route is the same `leftBothBoxes` test.

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
| | `boxClassName` | `string?` | `RangeEndBox`, date-time only | classes for the box frame (`InputGroup`): section 9 row 23. `className` goes to the root, which also holds the message. One caller, one hop |
| | `children` | `React.ReactNode?` | `PickerBox`, `TimeField`, `RangeEndBox` | the popup button drawn inside the box after the X |
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
| `ClockPopover` | `label` | `string` | `TimeField`, `RangeEndBox` | names the clock button and the popup |
| | `value`, `onValueChange` | `string`, `(value: string) => void` | the same two | the time shown and a picked time (C7) |
| | `disabled`, `min`, `max`, `step` | as `PickerField` | the same two | G2, R20; the options greyed and listed (C3 to C6) |
| | `popoverProps` | `PopoverProps?` | `TimeField` | T5 |
| `TimeColumns` | `value`, `onValueChange`, `min`, `max`, `step` | as `ClockPopover` | `ClockPopover` | the columns are computed from these five and nothing else |
| `TimeColumn` (in `time-columns.tsx`) | `label`; `options` | `string`; `{ text: string; selected: boolean; disabled: boolean; onSelect: () => void }[]` | `TimeColumns` | one column: its name, and its buttons as plain data. No generic |
| `DayPanel` | `withTime` | `boolean` | `DayPicker` | date or date-time |
| | `value`, `onChange`, `min`, `max`, `step`, `calendarProps`, `presets` | as the picker's | `DayPicker` | the picker's own props, used here |
| | `onPicked` | `(() => void)?` | `DayPicker`, date only | called after a day click set the value; the date picker closes its popup (D4). Date-time passes none (DT3). One caller, one hop |
| `DayRangePanel` | `value`, `onChange`, `min`, `max`, `step`, `calendarProps`, `presets` | as the picker's | `DayRangePicker` | the picker's own props, used here |
| | `times` | `RangeTimes?` | `DayRangePicker` | set for a date-time range: the first and last time on the step, worked out once in the picker because its `onClose` needs them too (R8, R15). `undefined` means a date range; the panel has no separate `withTime` |
| `RangeEndBox` (in `day-range-picker.tsx`) | `end` | `RangeEnd` | `DayRangePanel` | From or To: the box's label and the clock's name |
| | `withTime` | `boolean` | `DayRangePanel` | a date box, or a date-time box with a clock |
| | `value`, `onValueChange` | `string`, `(value: string) => void` | `DayRangePanel` | that end, and a typed end (R12) |
| | `onTimeChange` | `(time: string) => void` | `DayRangePanel` | a clock pick (R20). Separate from `onValueChange` because only typing sets `typing` and resets the views |
| | `min`, `max`, `step` | as `PickerField` | `DayRangePanel` | B3, B4; the clock's day limits |
| | rest | `HtmlProps` | `DayRangePanel` | `id`, `ref` and `onBlur` to `PickerField` (the label's target, the box element of R15, `leaveBox`) |
| `PeriodPanel` | `type`, `value`, `onChange`, `min`, `max`, `calendarProps`, `presets` | as the picker's | `PeriodPicker` | the picker's own props, used here |
| | `onPicked` | `() => void` | `PeriodPicker` | the picker closes its popup after a pick (P3, P6, P11) |
| `PeriodRangePanel` | `type`, `value`, `onChange`, `min`, `max`, `calendarProps`, `presets` | as the picker's | `PeriodRangePicker` | the picker's own props, used here |

Settled by this table:

- The inner Time field has no X because it is `required` (DT9): no "hide the X" prop.
- `label` is always the noun of the thing itself; `pickerLabel` is the name of the popup it opens. The popup's title is `pickerLabel` from a box, and the app's `aria-label` or else `label` from a trigger.
- No part takes a prop only to hand it on, except `rangeBand` through `PeriodView`, which is the switch between the three views and spreads its props to the one it draws.

## 6. Every state, effect, ref and context

7 states, 2 effects, 11 refs, 2 contexts.

| # | Kind | Name | File | Holds | Why it is needed | Stock mechanism considered |
|---|---|---|---|---|---|---|
| 1 | state | `draft` | `picker-field.tsx` | text the box holds that is not a storable value; the picker's value while the box holds it (`value`: the typed value, `""` for half-typed text, the unchanged value when nothing is passed on, B5); the browser's message; whether the box was left since (`left`) | a half-typed date reads `""` in the DOM and the message exists only on request; React has to draw the X, the red mark and the message (B2, B3, B6). A draft counts only while its `value` is the picker's value: that one comparison, where the draft is read, is what drops a stale draft; there is no reset | CSS `:user-invalid` (no message text, no X); the browser's validation bubble (forms only) |
| 2 | state | `resetKey` | `picker-field.tsx` | a counter used as the input's `key`, raised only by the X | the X must wipe half-typed parts; the value is already `""`, so React writes nothing and the parts stay. Writing `input.value = ""` wipes them in Chromium and not in WebKit (plan review probe). The remount drops the input's focus to the page (B6); nothing puts it back | setting `value` to `""` (a no-op when it already is); `autoFocus` on the remounted input (would also pull focus into a box that did not have it, and on iOS may open the native picker, which cannot be checked under section 14) |
| 3 | state | `month` | `day-picker.tsx` `DayPanel` | the month the calendar shows | the user pages without changing the value; a preset moves it (D9) | react-day-picker's own month state through `defaultMonth` (a preset cannot move it); used: its controlled `month`, `onMonthChange` |
| 4 | state | `views` | `day-range-picker.tsx` `DayRangePanel` | the month each calendar was last sent to, and which moved last | two calendars paged apart from the value; the one not moved gives way (R17) | one react-day-picker with `numberOfMonths={2}` (its months cannot be paged apart) |
| 5 | state | `typing` | `DayRangePanel` | the end whose box is being typed, or `null` | a date box reports years 1, 14, 144 while 1443 is typed; that end stays out of the year list until its box is left (R13) | none: only the picker knows a value is mid-typing |
| 6 | state | `view` | `period-picker.tsx` `PeriodPanel` | the month, year or decade shown | same as 3 | same as 3 |
| 7 | state | `views` | `period-range-picker.tsx` `PeriodRangePanel` | as 4, for months, years or decades | same as 4 (PR9) | none: the grids are custom |
| 8 | effect | re-read validity | `picker-field.tsx` | deps `value, min, max, step` | a value or limit that arrives from outside is checked like a typed one (B7, B8). It sets `draftOf(input, left)`, where `left` is the old draft's `left` when that draft is for this same value (the value was typed here, so the mark waits until the box is left), else `true` (the value came from outside, so it is flagged at once). Where the value came from is told by the draft, never by where focus is | handlers alone (they do not run for an outside change) |
| 9 | effect | centre the selection | `time-columns.tsx` `TimeColumn` | runs once on mount | the selected time is in view when the clock opens (C2) | `scrollIntoView` (scrolls the popup and the page too) |
| 10 | ref | `inputRef` | `picker-field.tsx` | the input | effect 8 reads `validity` and `validationMessage` | none |
| 11 | ref | `popupActions` | `day-picker.tsx` | the root's actions | date closes on a pick (D4) | this is the stock mechanism: `actionsRef.close()` |
| 12 | ref | `popupActions` | `period-picker.tsx` | same | week, month, year close on a pick | same |
| 13 | ref | `triggerRef` | `picker-trigger.tsx` | the trigger button | its X unmounts when the value empties; focus must land somewhere (R2) | Base UI `finalFocus` (for a closing popup only) |
| 14, 15 | ref | `boxes.from`, `boxes.to` | `DayRangePanel` | the two end boxes' roots | "focus left both boxes" (R15): the boxes sit in two columns with a calendar between them in the DOM, so no single element holds only the two | `currentTarget.contains(relatedTarget)` on one wrapper (there is none) |
| 16, 17 | ref | `boxes.from`, `boxes.to` | `PeriodRangePanel` | the two year boxes' roots | same (PR11) | same |
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
| Paging from inside the caption; the calendar's own names for its arrows; the locale for a day button | `useDayPicker()`: `previousMonth`, `nextMonth`, `goToMonth`, `labels`, `dayPickerProps`. Its `components` and `classNames` are not read: the chevrons are passed to `NavArrow` (5.8) | `nm/react-day-picker/dist/esm/useDayPicker.d.ts:24-54` |
| Cell size | the stock `--cell-size` variable | style sheet `cn-calendar` (`styles/style-vega.css:228`) |
| Text in the calendar's locale | `DateLib` | `nm/react-day-picker/dist/esm/classes/DateLib.d.ts:68, 237` |
| `DateRange`, default class names | exported type and helper | `types/shared.d.ts:171`; `helpers/getDefaultClassNames.d.ts:11` |
| Parse, format, validate, month and year sums | date-fns `parse`, `format`, `isValid`, `startOfMonth`, `addMonths`, `addDays`, `clamp`, `endOfISOWeek`, `endOfMonth`, `endOfYear`, `setYear`, `getYear`, `isAfter`, `isBefore` | `nm/date-fns/<name>.d.ts` (`parse` 319, `format` 307, `isValid` 32, `clamp` 58, `endOfYear` 29) |
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
| Module-level `Root` and `DayButton` parts | The stock `Calendar` builds them inline, so every render remounts the days and a click can be lost (`ui/calendar.tsx:137, 170`) | Two components of a few lines each, same markup as stock |
| iOS placeholder overlay (`picker-field.tsx`) | iOS shows an empty date box blank; `placeholder` does not apply to date inputs. Owner-approved | One `span` shown by `supports-[-webkit-touch-callout:none]`, hidden on focus |
| Draft and remount (`picker-field.tsx`) | See section 6 rows 1, 2, 8 | One state shape, one pure `draftOf(input, left)`, one effect |
| Growing year list (`views.ts` `listBounds`) | react-day-picker's default is 100 years back; the proposal's rule is 1900 to 2100 growing by century | One pure function; both limits always enter both ends (6.10) |
| Two views kept apart (`views.ts`) | No stock part pages two calendars as one range | Three pure functions and one state per range panel; one `endBounds` for every use (9.5) |
| One-route swap (`range.ts`) | Browsers do not order two inputs | `isReversed`, `orderRange`, `leftBothBoxes`; called from one blur handler per range panel and one `onClose` per range picker. No hook, no flag. An end's clock needs no rule of its own: it takes focus as it opens (section 6 row 20), which is a leave like any other |
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
| 12 | `bandFillClassNames` | `range_middle` `data-[selected=true]:bg-muted`; `day_button` `size-(--cell-size) data-[range-middle=true]:bg-transparent data-[range-middle=true]:hover:bg-foreground/10` | in stretched cells the band is drawn by the cell and the day stays a square | owner-approved dialog |
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
| 23 | `day-range-picker.tsx` date-time end box (`PickerField`'s `boxClassName`, 5.8) | `overflow-hidden max-md:contain-inline-size *:data-[slot=input-group-addon]:pr-1 *:data-[slot=input-group-addon]:not-last:mr-0 *:data-[slot=input-group-control]:pr-0 *:data-[slot=input-group-control]:pl-2` | a date-time and two buttons must fit a box one month wide (owner finding 9); a long value must not widen the popup on iOS | 5.2 |
| 24 | `day-range-picker.tsx` date-time calendars | `max-md:[--cell-size:--spacing(9)]` | on a narrow screen the month is as wide as the date-time box above it | call 8 (10.1) |
| 25 | `day-range-picker.tsx` phone-dialog fields | not an override: our own wrapper `grid grid-cols-[auto_1fr] items-center gap-x-3 gap-y-2` with four direct children, `FieldLabel`, `RangeEndBox`, `FieldLabel`, `RangeEndBox`. No `Field` per row, no subgrid, no class on a stock part. The gaps are 7.4's: the stock field gap between label and box (`cn-field`, `gap-3`) and `gap-2` between the rows | one label column as wide as the longer word, so the two boxes line up; the bracket is the one way to say "as wide as the labels, then the rest" | 1.3, look frozen (call 9) |
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
- File order (decision 3): `"use client"` (component files), imports, every type, constants (class-name objects, tables, contexts), then components and functions, one `export { ... }` list last. Props are a named type in the top block, never an object type in a signature.
- Names: a component's props type is `<Component>Props`. The name of a control is `label`; a second name on the same component says what it names (`pickerLabel`). A value callback is `onChange` on pickers and panels, `onValueChange` on boxes and the clock. An end is `"from"` or `"to"`, never an index or a side. A view is a `Date`.
- Checks, from `test-projects/next-app`, one at a time, each under `nice`: `pnpm exec tsc --noEmit`; `pnpm exec eslint components/date-picker-9 app/date-filter-demo`; `pnpm exec prettier --check components/date-picker-9 app/date-filter-demo/_cards`. Zero errors, zero warnings.

Never, each drawn from a finding kind of audit 7:

- A key handler (`onKeyDown`, `onKeyUp`), a `tabIndex`, a roving tab stop.
- `querySelector`, `querySelectorAll`, `closest`, `document.activeElement`, `instanceof` on an event target. The one DOM test is `contains` in `leftBothBoxes`.
- A `focus()` call in `PickerField`, its X handler included, and `autoFocus` on its input (B6). The one `focus()` call in the folder is the trigger's, after its X (R2).
- `value[0]`, `value[1]`, an index for an end, a two-item array read by position, a loop that tests its index.
- A same-value test outside `TypedPicker`. A limit or step check outside the entry.
- State that copies a prop, a reset on open, a flag that suppresses another handler, a second commit of one change.
- A context other than the two of section 6. A hook of our own, a one-line reader of a context included. `useMemo`, `useCallback`.
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
| B. The swap is one pure function with two triggers (leave both boxes, popup close); no hook, no flag, no clock handler; the X only prevents its mouse-down default and calls no `focus()` | 3.1, 3.4, 3.5, 4.9, 5.11, 6.5 (for pointer moves between the boxes and for the phone dialog; on desktop Tab from an end box enters its calendar and orders the pair, which is call 6 as worded: R15), 11.7 |
| C. Stock non-modal popover | 3.2 |
| D. View state lives in the panel inside the popup; one view state per panel; views are reset from the value on a typed change, a preset and a swap; one `endBounds` | 1.2, 3.3, 4.2, 6.7, 9.2, 9.5, 11.5 |
| E. One `PickerPopup` with a trigger prop; one JS test for "phone dialog", read through one context; calendar padding and background set once in `DayCalendar`; the presentation props are typed once for the app (the strict `PresentationProps` union, in the entry) and once for the parts (the plain `PopupOptions`, in `picker-popup.tsx`), each with its reason (3.2), and no part needs a cast; `PopupActions` is Base UI's exported type; `showCloseButton` not in `DialogProps` | 1.7 (the double X; X and Done both stay, call 9), 2.8 (first half), 3.6, 4.4, 5.1, 8.4, 11.4 |
| F. Public props written directly in the entry; internal props are named types; the entry is the one guard and the one limit check; `ControlProps` lives in `values.ts`; `TimeField` is rendered by the entry; one `CalendarProps` name; no `buttonVariant`, no `dir` | 2.10, 4.3, 4.6, 4.7, 5.13, 8.1, 8.5, 8.10, 8.11, 9.1, 11.3, 11.9 |
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

## 12. Implementation steps

Each step is one commit in the `test-projects/next-app` repo (message `date picker 9: step N <name>`, staged by explicit path, no push). Each step ends with: the three checks of section 10 clean; then a reader with no history reviews the step's diff against this plan and the bar, and its findings are fixed, before the next step starts.

Cards: a version 9 card is a copy of the row's newest card with `usePickerSettings(type, range, "popup")`, `version="9"`, title "Rebuilt from the plan", the next free letter, an input id `fix-<row><letter>`, and the import `@/components/date-picker-9/date-picker`. Each step also adds a 7.4 reference card (`version="7.4"`, title "Reference", import `@/components/date-picker-7-4/date-picker`) to its rows. Both new cards of a row count `onChange` calls: `const [calls, setCalls] = React.useState(0)`, `onChange={(next) => { setValue(next); setCalls((count) => count + 1) }}`, and a second value line, `value={[["value", value], ["calls", calls]]}`. Acceptance compares both lines; "not called", "once" and "one call" in section 2 are read from the calls line. Letters: row 1 `AC` (7.4), `AD` (9); row 2 `AB`, `AC`; row 3 `AH`, `AI`; row 4 `AW`, `AX`; row 5 `N`, `O`; row 6 `N`, `O`; rows 7 to 10 `G`, `H`; rows 11 and 12 `L`, `M` (the existing 7.4 card `K` has no calls line and is left as it is). Row 4's cards keep the "Error from the form" switch. `_lib/labels.ts` is not edited: in the two translated languages the new and renamed keys fall back to English, which no screenshot shows.

| # | Step | Built | Files | Must not touch | Check against 7.4 |
|---|---|---|---|---|---|
| 1 | date, one value | the box, the popup, the day calendar, the entry for `type="date"` | `values.ts` (`HtmlProps`, `Limits`, `ControlProps`, `fromYmd`, `ymd`, `outsideLimits`, `checkedLimits` with the date format), `views.ts` (`ListBounds`, `listBounds`, `clampView`), `labels.ts`, `picker-field.tsx`, `picker-popup.tsx`, `picker-box.tsx`, `picker-presets.tsx`, `view-nav.tsx`, `day-calendar.tsx` (no band, no caption variants yet), `day-picker.tsx` (date path), `date-picker.tsx` (`DateProps`, one value); row 1 cards | anything outside the new folder except `_cards/row-1-date.tsx` | cases G1 to G5, B1 to B11 (B9 by string equality, section 2.2), D1 to D11, U1, U2, U4 to U9 on row 1; pixels of row 1 in every cell of the section 13 matrix; `PickerBox` and `PickerPopup` compile with no `as` cast |
| 2 | time, time range, datetime | the clock, the time field, the date-time path | `time.ts` (all of it), `values.ts` (`datePart`, `timePart`, `joinDateTime`, `checkedStep`, the date-time and time formats of `checkedLimits`), `range.ts` (`RangeValue`, `RangeEnd`, `rangeEnds`, `putEnd`), `time-columns.tsx`, `time-field.tsx`, `time-range-picker.tsx`, `day-picker.tsx` (date-time path), `date-picker.tsx` (`DateTimeProps` one value, `TimeProps`); cards of rows 3, 5, 6 | the other step 1 files | cases C1 to C9, T1 to T5, DT1 to DT11, U3 on rows 3, 5, 6; pixels of those rows |
| 3 | date and datetime range | the trigger, the range panel, the band, the phone-dialog layout, the swap | `range.ts` (`RangeTimes`, `isReversed`, `orderRange`, `selectRange`, `formatRange`, `leftBothBoxes`), `values.ts` (`dateLibFor`, `formatValue`), `views.ts` (`RangeViews`, `viewsForRange`, `shownViews`, `endBounds`), `picker-trigger.tsx`, `day-range-picker.tsx`, `day-calendar.tsx` (band, `FromCaption`, `ToCaption`), `date-picker.tsx` (date and date-time range); cards of rows 2, 4 | the clock, the box and every file not named | cases R1 to R20 on rows 2, 4; pixels of those rows, phone dialog included; `PickerTrigger` compiles with no `as` cast |
| 4 | week, month, year, one value | period values, the three views, the one-value period picker | `values.ts` (`PeriodType`, `inYear`, `periodOf`, `startOfPeriod`, `dayLimits`, `formatPeriod`, the week, month and year formats of `checkedLimits`), `views.ts` (`periodViewStart`, `periodViewStep`), `range.ts` (`rangeState`, which `PeriodView` uses for one value and for a pair), `period-views.tsx`, `period-picker.tsx`, `date-picker.tsx` (`WeekProps`, `MonthYearProps`, one value); cards of rows 7, 9, 11 | day and time pickers and every file not named | cases P1 to P18 on rows 7, 9, 11; pixels of those rows |
| 5 | week, month, year range | the period range picker | `range.ts` (`pickRange`), `period-range-picker.tsx`, `date-picker.tsx` (final union); cards of rows 8, 10, 12 | every file not named | cases PR1 to PR12 on rows 8, 10, 12; pixels of those rows |
| 6 | whole-folder pass | nothing new: read all 21 files against sections 3 to 10; type cases; section 13 in full | any file of the folder, for findings only | the cards | section 13 |

Rules for the table:

- A pure function or type lands in the step whose code first calls it, so every step compiles alone. The lists above are the expected first uses: a function may land one step earlier when that step's code calls it, never later. `DatePickerProps` grows by the members named per step and is the union of 3.2 at step 5.
- A shared part is written whole, as 5.8 has it, in the step that creates it (`PickerField` with its four types, `PickerPopup` with both branches, `labels.ts` with all 47 keys): one component is reviewed once against one table. The one exception is `day-calendar.tsx`, whose range pieces land in step 3 as listed.
- Every "Must not touch" has one exception: a fix that a finding of this step's review names, in whatever file the defect is. The fix is listed in the step's commit message.

Step 6 type cases: a scratch file in the session scratchpad, compiled with a scratch `tsconfig.json` that extends the app's. It must show that these fail to compile: `step` on date, week, month, year; `presets`, `presentation`, `dialogProps`, `calendarProps` on time; `popoverProps` with `presentation="dialog"`; `dialogProps` with the default presentation; a string `value` with `range`; `open` in a time range's `popoverProps`; `showWeekNumber` in a week's `calendarProps`; `dir` in a month's. And that these compile: every row of the table in 3.3 marked yes, with a computed `min` string.

## 13. Acceptance

- **Cards.** The demo page `app/date-filter-demo` has twelve rows; each has a version 9 card built with `usePickerSettings` and a 7.4 reference card to compare with, both with a calls line (section 12).
- **Tool.** Playwright is not installed in `test-projects/next-app` and is not added (section 14). Scripts in the session scratchpad load version 1.64.1 by absolute path, `createRequire("/Users/anindosarker/Work/Personal/React-table/shadcn-react-table/package.json")("playwright")`; its Chromium and WebKit builds are in `~/Library/Caches/ms-playwright`. They open the owner's page on port 3000 read-only.
- **Emitted values.** For each action below, the value line and the calls line printed under the version 9 card equal the 7.4 card's, except where section 2 marks "7.4 wrong" or "differs from 7.4"; there they equal section 2.

| Type | Actions |
|---|---|
| date | type a full date; delete its day part; click a day; click the selected day; preset Tomorrow; X; type 1443-11-04 and reopen (year list from 1400); Limits "min/max": type a day before `min`, click a greyed day |
| datetime | click a day with no value; type a time in the Time field; half-delete that time (9: value unchanged); click another day (time kept); Step "15 min" then click a day; Limits "one month": click the first allowed day (9: time 09:10) and the last; Limits "one month" with Step "15 min": click the 16th (9: `T00:10`, the Time field not flagged), open the clock (9: minutes 10, 25, 40, 55), pick 25 (9: `T00:25`, nothing flagged; 7.4: `T00:15`, flagged); preset; X |
| time | type 10:30; clock: pick an hour from empty, a minute, PM; Step "15 min": pick 10 then 15; Step "seconds": pick a second; Limits "min/max": pick 8 (greyed), pick PM then 5; Limits "one month" with Step "15 min": pick 9 (9: 09:10) |
| time range | type From 22:00 and To 06:00 (kept); pick each end from its clock; X on each |
| date range | click day A; click a later day B; click a day between; click A; click the only day of a one-day range; type To earlier than From and click into From (no swap), then click a calendar arrow (swap); type a reversed pair and press Escape (one call, ordered); with the 10th to the 20th set, desktop, keyboard only: type the 25th into From and press Tab until focus is in the From calendar (9: `[20th, 25th]`; the order is one call, made at the first Tab out of the box; reported, call 6); the same in the phone dialog, Tab from the From box to the To box (9: no swap, `[25th, 20th]`), then type the 30th (9: `[25th, 30th]`); type a full date in From, delete its day part and click From's X with the mouse (9: the box is empty, focus is on the page and the X press makes no call; 7.4: focus on the X); clear From with its X then click a later day; preset "Last 7 days"; X on the trigger |
| datetime range | click two days (first and last times); type a time in From then click a new To day (From's time kept); Step "15 min" then click two days; Limits "one month": click the first allowed day as From (9: time 09:10) and the last as To (9: time 17:00); reversed typed pair then close (ordered, default times refitted); pick a time from an end's clock; type From the 20th 10:00 and To the 10th 16:00, click To's clock button (9: `[10th T16:00, 20th T10:00]` as the clock opens, one call), pick the hour 9 (9: `[10th T16:00, 20th T09:00]`; 7.4: `[10th T09:00, 20th T10:00]` once the clock closes); with one day set as both ends, 09:00 to 12:00, set From's time to 16:00 from its clock (9: `[T16:00, T12:00]` while the clock is open, no swap between two picks), then close the clock and the popup (9: `[T12:00, T16:00]`, the order is one call) |
| week | click a day; click a day in another week; preset "Last week"; X; Limits "min/max": click a greyed day |
| week range | click a week; click an earlier week; click a third week (new start); preset "Last 4 weeks"; X |
| month | click a month; change the year in the select and click; Today; preset; X |
| month range | click a month; click an earlier month; click a third; preset; X |
| year | type 2031; type 195 and leave; type 0000; click a year; Limits "min/max": type a year outside; type 1443 and open (decade 1440); X |
| year range | type From 2030 and To 2020, click outside the boxes (swap); type To only then click a year (9: ordered pair); click a year, then an earlier one; type 1443 in From (9: grid follows at once); preset "Last 5 years"; X |

- **Pixels.** Screenshots of the 7.4 card's picker and the version 9 card's picker, cropped to the control and to its popup, compared pixel by pixel.
  - Matrix: twelve rows; closed empty, closed with a value, open with a value; viewport 1280 by 800 and 390 by 844; `presentation` popover and dialog (rows 5 and 6: the clock popover only); Chromium and WebKit through Playwright. If WebKit cannot be started on this machine, report it; a phone is not a substitute.
  - Settings left at their defaults, plus one pass each with Presets on, Limits "min/max", Step "15 min" on the rows that have the switch.
  - Scripts and images stay in the session scratchpad.
  - Outside the matrix: the iOS placeholder overlay (B9, section 9 row 15). It is checked by string equality of its markup and classes with 7.4 `picker-field.tsx:192-198`, not in a browser.
- **Allowed differences, and only these:**

| # | Difference | From |
|---|---|---|
| 1 | No hidden Close button gets focus at the end of a popover | call 7 |
| 2 | A reversed range is ordered at a different moment (R15, R16, R20, PR11): when focus leaves both boxes or the popup closes, which includes the moment an end's clock opens. With a reversed typed date-time pair, a pick in an end's clock therefore changes the end the box holds after the swap, not the end as typed | call 6 |
| 3 | The clock opens with focus on its popup: no focus ring on the selected hour (C2) | 1.1, decision 2 |
| 4 | Clock: AM or PM greyed under limits; the minute column not all greyed with `min` and no value; a seconds column for a step that is not whole minutes; a long AM/PM not cut | 6.3, 6.4, 6.11, 10.2 |
| 5 | The Time field in the date-time popup has no X and keeps a half-typed time | 6.1 |
| 6 | A box's message sits under the box inside one root; in the phone dialog's From and To rows it starts at the box's edge, not the row's, and the row's label is then centred on the box and its message together | 8.2 |
| 7 | With only To set, a year range opens on To's decade | 6.7 |
| 8 | A far year typed in a year range shows before the box is left | 11.1 |
| 9 | A year outside the year list but inside the limits is not greyed | 4.11 |
| 10 | After a first date part typed into an empty box, the X appears when the box is left | 1.8 |
| 11 | After the X of a box is pressed with the mouse, the X has no focus ring and hides at once; a box that held focus has lost it to the page (B6) | 3.4 |
| 12 | While an end is typed, the other calendar returns to its own end's month | 1.2 |
| 13 | Date-time with `step` and `min`, on a day other than `min`'s: the Time field is not red after a day click, and the clock lists the minutes of `min`'s step (DT11) | defect found in the plan review |

- **Final audit.** A fresh strict audit of `components/date-picker-9` under the bar of this plan's brief, given this plan (sections 6, 8, 9 and the "not addressed" table are the kept list). It must find nothing clear-cut. Findings are fixed and the audit rerun until it does.
- **Line count.** Reported per file and in total next to 7.4's 3,524. It is a fact to report, not a target.

## 14. Hard rules for the implementer

- Port 3000 is the owner's dev server. Use it read-only for the demo page. Never start, stop or restart it, and never start another server.
- Never run `next build`.
- No `git stash`. No push. Stage by explicit path; never `git add -A` or `git add .`.
- Never touch `app/date-filter-demo/defaults.json` or `picks.json` (the owner's uncommitted edits), and never tick Pick or Default on the page: a tick writes those files.
- Never edit `components/date-picker/`, any existing version folder, or any existing card. A row file gains new cards only. Never edit `components/ui/`, `app/date-filter-demo/_components/` or `_lib/`.
- Never run the `format` script (it rewrites the whole app). Run prettier on the named paths only.
- No new dependency.
- Checks one at a time, each under `nice`.
- Scratch files only in the session scratchpad.
- Never use an iOS simulator or iPhone Mirroring.
- This app's `AGENTS.md` applies. The picker uses no Next.js API; every component file starts with `"use client"`.
- A case this plan does not cover: stop and report. Do not decide it.

## Review notes

Two readers with no history reviewed this plan; their required changes are applied above. Asked and not applied as asked:

- "The X takes focus in its click handler, as 7.4": not applied. It is the third part of finding 3.4 and conflicts with the other reader's change, which is applied: B6 states the real outcome (focus on the page) and section 10 forbids a `focus()` call in `PickerField`.
- "No hook of our own except the two context readers": not applied. The other reader's change removes both hooks, which is less code; contexts are read with `React.useContext`.
- "Write the real sequence as the outcome: the first press inside an end's clock orders the pair and the pick lands on the other date": not applied. That outcome writes a time onto a date the user did not pick it for. The clock takes focus as it opens instead, so the pair is ordered before a pick (R16).
- "`RangeEndBox` passes `popoverProps={{ initialFocus: true }}`; check the hour column's scroll when built": applied in another form. Base UI's default focus scrolls the first hour into view (`FloatingFocusManager.js:390, 409`), which would have left a check open; every clock gives `initialFocus` a ref to its popup, so there is one clock behaviour and nothing to check (section 6 row 20). The alternative, two more refs so a clock popup counts as inside its box, is not applied: more refs, and Safari would still order at the press on the clock button.
- "Pass `clockLimit(min, day) ?? edgeTime(...)` to `TimeField` and to the end's `ClockPopover`": applied as one function, `dayTimeLimits`, which replaces `clockLimit`, so the rule is written once and `timeOnDay` uses it too.
- "A props table for ... the five panels": there are four panels; `RangeEndBox`, `GridHeader`, `PeriodGrid` and `TimeColumn` are in the table as well.
- "`items-center` plus the gap the pixel check gives" (row 25): the gaps are written out from 7.4 (`gap-x-3 gap-y-2`), so no value is left to find.

Found while building, plan against code (step 1):

- Section 12, cards: the plan writes the calls line as `["calls", calls]`. `ValueLine` in `app/date-filter-demo/_lib/types.ts` is `[label: string, value: string]` and that file is not edited, so a number does not compile; the cards write `["calls", String(calls)]`, printed as `calls: "3"`.
- Section 2, G1, D5 and a repeated D9: the plan marks 7.4 "same". 7.4 calls `onChange` again with the unchanged value on a click of the selected day and on a repeated preset (7.4 `modes/date-mode.tsx:57-66`, audit 9.1 "missing at"); version 9 does not (G1). The calls lines of the two row 1 cards differ by one at each such action.
- Section 13, date actions, "Limits min/max: click a greyed day": the demo's limits are whole months and the year list ends at the limit's month (D7), and react-day-picker does not draw days outside `startMonth` to `endMonth` (`data-hidden`), so no greyed day shows on row 1. Greyed days are checked with Year list "year 1 to 3400" added, which puts the list past the limits.
- U7: the demo cards control `open` in both `popoverProps` and `dialogProps`, so an open `auto` picker stays open across 768 as the other popup, on 7.4 and on 9. "The picker closes" holds only for a picker whose open state the app does not control, which no card shows.
- Section 5.2, section 6 row 1 and section 8 ("one pure `draftOf(input, left)`"): a draft counts only while its `value` is the picker's value, so the Time field of DT8 cannot keep a half-typed time if the box passes `""` on and `DayPanel` drops it: that draft is stale at once. Built in `PickerField`: a `required` box does not pass an empty value on and its draft keeps the picker's value, the same rule as B5. The blur read needs the rule too, so the component has `read(input, left)`, which calls `draftOf` and applies it; the effect calls `draftOf` alone.
- B5: Chromium takes no fifth year digit in a date box whose `max` has a four-digit year (the box's default `max`), so B5 shows in WebKit only.
- Section 6 row 8 ("it sets `draftOf(input, left)`"): a refused text (B5; an emptied required box, DT8) is held by a draft that keeps the picker's value (row 1), and `draftOf` alone gives the box text as the draft's value, so a limit change (B8) dropped that draft and the box snapped to the stored value. The plan does not state where B5 meets B8; built as both rows read together: the effect stamps its draft with the picker's value (`{ ...draftOf(input, left), value }`), so the text stays and its message is re-read.
- Section 9 row 30 lists the presets row's classes only. 7.4 `components/picker-presets.tsx:30` also puts `flex-1` on each preset `Button`, so the buttons share a line's width; kept as a listed override of row 30 (look frozen, call 9), with its reason in the row's comment.
