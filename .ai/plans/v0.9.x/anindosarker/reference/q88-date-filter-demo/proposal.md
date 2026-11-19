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
- No invented props where the browser or the calendar library already has one.

## Year list

- Default list is 1900 to 2100.
- The list changes only when the value was changed by typing. A typed year outside the list grows it to that year's century, rounded down: typing 4 Nov 1443 gives 1400 to 2100.

## Calendar options

- The calendar's own documented options are passed through one prop, `calendarProps`. Its content is the react-day-picker API.
- `fixedWeeks` lives inside `calendarProps`, not at the top level, so it cannot be passed twice. Its type there is widened with our `"blank"` value.
- `startMonth`, `endMonth` and `classNames` are calendar options, so they are reached through `calendarProps` too.

## Props, as agreed so far

- Every mode: `mode`, `value`, `onChange`, `disabled`, `min`, `max`, and HTML attributes for the outer wrapper.
- Modes with a calendar: `presentation`, `calendarProps`.

## Known gaps, accepted as not built now

- Text in other languages (labels are English in the code).
- Use inside a form (`name`, `required` land on the wrapper, not the box).
- Uncontrolled use (`defaultValue`).
- Open state from outside (`open`, `onOpenChange`).

## Lookups read so far

- Typed out-of-range date: the browser box, React Aria and MUI X accept it and flag it; Ant Design rejects it. MUI X has a default limit of 1900-01-01 to 2099-12-31 that validates. react-day-picker separates navigation (`startMonth`, `endMonth`) from allowed days (`disabled`), hides days outside the navigation range and moves the month to its edge. shadcn recipes declare no limit; their dropdown caption gets react-day-picker's default of 100 years back to the end of this year, navigation only.
