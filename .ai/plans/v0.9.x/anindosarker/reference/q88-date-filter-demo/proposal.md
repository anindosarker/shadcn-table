# Q88 date picker: agreed points

Running notes from the discussion with the owner, 2026-11-20. Not decisions: nothing here is a D item until the owner says "record it". Only points the owner stated or agreed to are listed; points still under discussion stay in chat.

## Versions

- Default folder `components/date-picker/` holds the 4.AL code (owner: "looks good, promote").
- 4.AM (defects 1 to 5 and the small tidy-ups of audit 5) is the base going forward; 4.AO is 4.AM plus two fixes the owner reported (calendar background in the desktop dialog, clock column padding).
- 4.AN (native time picker, natural-height phone calendars, box over its own calendar, stock nav, no iOS placeholder) is rejected: "looks hideous".
- Old version folders `date-picker-4x` to `-4al` and their cards are deleted.
- react-day-picker stays as the calendar: it is what shadcn's `Calendar` is built on.

## Typed values and limits

- By default the box takes any real date. Today it refuses a date outside 1900 to 2100 and keeps the old value; that goes.
- A limit is opt-in: the user sets `min` and `max`, the browser's own attribute names and format, once. The picker passes them to the boxes and to the calendar, since both are connected.
- With `min` or `max` set, a typed date outside is flagged with the browser's own message and still passed on to `onChange`, as the browser box, React Aria and MUI X do. Days outside are greyed in the calendar; the year list and the arrows end at the limits.
- `min` and `max` also apply to the time-only modes; the browser's time box supports them.
- No invented props where the browser or the calendar library already has one.

## Year list

- Default list is 1900 to 2100.
- The list changes only when the value was changed by typing. A typed year outside the list grows it to that year's century, rounded down: typing 4 Nov 1443 gives 1400 to 2100. Above the list it rounds up: typing 2250 gives 1900 to 2300.
- The list grows when the box is left, not on each key: while 1443 is typed the browser reports the years 1, 14, 144.

## Calendar options

- The calendar's own documented options are passed through one prop, `calendarProps`. Its content is the react-day-picker API.
- `fixedWeeks` lives inside `calendarProps`, not at the top level, so it cannot be passed twice. Its type there is widened with our `"blank"` value.
- `startMonth`, `endMonth` and `classNames` are calendar options, so they are reached through `calendarProps` too.

## Presets

- One optional prop `presets`: a list of `{ label, value }`, where `value` has the picker's value format or is a function returning it, so "Last 7 days" is worked out at the click. This is Ant Design's shape. No built-in list.
- They render as stock buttons in a row under the calendar, as in shadcn's `calendar-presets` recipe, the same on every screen size. A click sets the value and moves the calendar there.

## Time step

- The browser's `step` attribute, in seconds, is passed straight to the time and date-time boxes. `step={900}` flags a time off the quarter hour; a step under 60 adds seconds to the box and to the value (`10:30:45`). shadcn's time recipes use `step="1"`.
- The clock columns follow it: the minute list by the step, a seconds column when the step is under 60.

## Props, as agreed so far

- Every mode: `mode`, `value`, `onChange`, `disabled`, `min`, `max`, and HTML attributes for the outer wrapper.
- Modes with a time: `step`.
- Modes with a calendar: `presentation`, `calendarProps`, `presets`.

## Known gaps, accepted as not built now

- Text in other languages (labels are English in the code).
- Use inside a form (`name`, `required` land on the wrapper, not the box).
- Uncontrolled use (`defaultValue`).
- Open state from outside (`open`, `onOpenChange`).

## Lookups read so far

- Typed out-of-range date: the browser box, React Aria and MUI X accept it and flag it; Ant Design rejects it. MUI X has a default limit of 1900-01-01 to 2099-12-31 that validates. react-day-picker separates navigation (`startMonth`, `endMonth`) from allowed days (`disabled`), hides days outside the navigation range and moves the month to its edge. Safari's date-time box has a date picker and no time picker by design, so the custom clock is what lets Safari users pick a time. shadcn recipes declare no limit; their dropdown caption gets react-day-picker's default of 100 years back to the end of this year, navigation only.
