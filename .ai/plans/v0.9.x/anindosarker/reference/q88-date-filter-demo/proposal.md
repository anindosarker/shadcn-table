# Q88 date picker: agreed points

Running notes from the discussion with the owner, 2026-11-20. Not decisions: nothing here is a D item until the owner says "record it". Only points the owner stated or agreed to are listed; points still under discussion stay in chat.

The owner agreed to every point below on 2026-11-20 ("I agree to all the proposals"). The owner gave the go for the build on 2026-11-20 ("rest lgtm. note decision and implement version"). Built as three versions on top of 4.AO, each on the one before: 4.AP typed values, limits, year list, `calendarProps`, `popoverProps`, `dialogProps`; 4.AQ `presets` and `step`; 4.AR `labels`, form use, `defaultValue`, open state.

## Versions

- Default folder `components/date-picker/` holds the 4.AL code (owner: "looks good, promote").
- 4.AM (defects 1 to 5 and the small tidy-ups of audit 5) is the base going forward; 4.AO is 4.AM plus two fixes the owner reported (calendar background in the desktop dialog, clock column padding).
- 4.AN (native time picker, natural-height phone calendars, box over its own calendar, stock nav, no iOS placeholder) is rejected: "looks hideous".
- Old version folders `date-picker-4x` to `-4al` and their cards are deleted.
- react-day-picker stays as the calendar: it is what shadcn's `Calendar` is built on.

## Types and range (2026-11-20, build started on the owner's go as 4.AS on 4.AR)

- The owner accepted 4.AR ("looks great"); card 4.AR got a presets on/off switch and translated preset labels at his request. Preset labels are the app's own text, so the app translates them, not the picker.
- `mode` mixed two things: what is picked and whether it is one value or a range. It is split into two props that combine freely: `type` (`date`, `datetime`, `time`, `week`, `month`, `year`; the browser's own word, `<input type>`) and `range` (off gives one value, on gives a pair).
- Today's six modes are three types with `range` on or off; behaviour unchanged.
- New types week, month and year, each single and range. Values in the browser's own formats: `2026-W47`, `2026-11`, `2026`.
- shadcn has no recipe that returns a week, month or year (its "Month and Year Selector" and "Week Numbers" sections still pick a day); read from the calendar docs source on 2026-11-20.

## Version numbers (owner, 2026-11-20)

- From the next version on, versions are numbered `4.<minor>.<patch>`, one number for the component, the same in every demo row: a new feature or changed behaviour is a minor (`4.7`), a fix on a version is a patch (`4.6.1`). A rejected version keeps its number.
- The owner then asked to rename everything, with the old names in brackets. Done in next-app commit 6cabea2: folders are `date-picker-4-1`, `-4-1-1`, `-4-2`, `-4-3`, `-4-4`, `-4-5`, `-4-6`; each card title reads `4.6 (4.AS) ...`. The old row-and-letter id stays as the saved tick key, so `picks.json` and `defaults.json` were not touched. New folders are named `date-picker-4-7`, `date-picker-4-6-1`.
- Mapping of the letters: 4.AL (default folder) 4.0, 4.AM 4.1, 4.AO 4.1.1, 4.AN 4.2 (rejected), 4.AP 4.3, 4.AQ 4.4, 4.AR 4.5, 4.AS 4.6.
- 4.AS (4.6) is built: `type` and `range` props, week, month and year types, six new demo rows 7 to 12. The browser's week and month boxes work only in Chrome on desktop (MDN compat data), so the three new types use a trigger button and no typed box.

## State after the owner's check (2026-11-20)

- Card titles read `<row>.<version> (<old id>)`, for example `7.6 (7.A)`: the owner asked for the section number first, since a leading 4 on every version meant nothing. The version is the same number in every row. Folders keep the `date-picker-4-6` pattern.
- `.6` (type and range props, week, month, year) looks good to the owner.
- `.7` (arrows page past 1900 and 2100) and `.8` (typed year box) are both rejected: "don't look good enough". Week, month and year keep the 1900 to 2100 list by hand; an app widens it through `calendarProps`.
- The twelve `.6` cards have a closed "Settings" section with one switch per supported prop (shared helper `_components/picker-settings.tsx`).
- `.6.1` is being built on the owner's "fix it": fixes only, on `.6`. Single week calendar reaching December of the last year, a visible message for a required empty picker with hidden inputs, the calendar returning to today's month after a far value is cleared, trigger text following the locale, month and year range panels kept apart, right-to-left arrow keys in the grid, `calendarProps` typed to what month and year use.
- Not done yet: a review of the code by a fresh reader, and a look in Firefox, real Safari and on an iPhone.

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
- They render as stock buttons in a row under the calendar, as in shadcn's `calendar-presets` recipe (reference the owner named: https://ui.shadcn.com/docs/components/radix/calendar#presets), the same on every screen size. A click sets the value and moves the calendar there.
- The owner confirms the presets UI on the card before it counts as accepted.

## Time step

- The browser's `step` attribute, in seconds, is passed straight to the time and date-time boxes. `step={900}` flags a time off the quarter hour; a step under 60 adds seconds to the box and to the value (`10:30:45`). shadcn's time recipes use `step="1"`.
- The clock columns follow it: the minute list by the step, a seconds column when the step is under 60.
- `step` exists only on modes with a time. The browser also takes `step` on a date box, in days, but MDN says day steps do not work well in any browser.

## Props, as agreed so far

- Every mode: `mode`, `value`, `onChange`, `disabled`, `min`, `max`, and HTML attributes for the outer wrapper.
- Modes with a time: `step`.
- Modes with a calendar: `presentation`, `calendarProps`, `presets`.
- Modes with a popup: `popoverProps`, `dialogProps`, `open`, `defaultOpen`, `onOpenChange`.
- Every mode also: `defaultValue`, `labels`, `name`, `required`, `form` (range modes: `startName`, `endName`).

## Inner parts

- Basic only: pass-through props for parts that have their own documented API, `calendarProps`, `popoverProps`, `dialogProps`. No props that replace a part, no per-part `classNames`.

## Display format

- Skipped. A page cannot set the format or language of a native date box (spec has no attribute; `lang` changed nothing in Chromium or WebKit), and every library with a format prop uses its own typed field. No format prop for our own text either.

## The four former gaps, now built

- Our words in other languages: one `labels` object for the picker's own text ("From", "To", "Done", "Today", placeholders). The calendar's words come through `calendarProps` (`locale`, `labels`).
- Form use: `name`, `required` and `form` reach a real input. Range modes take `startName` and `endName` and render hidden inputs, as React Aria does.
- Uncontrolled use: `defaultValue`.
- Open state: `open`, `defaultOpen`, `onOpenChange`, the names shadcn, Ant Design and React Aria use.

## Lookups read so far

- Typed out-of-range date: the browser box, React Aria and MUI X accept it and flag it; Ant Design rejects it. MUI X has a default limit of 1900-01-01 to 2099-12-31 that validates. react-day-picker separates navigation (`startMonth`, `endMonth`) from allowed days (`disabled`), hides days outside the navigation range and moves the month to its edge. Safari's date-time box has a date picker and no time picker by design, so the custom clock is what lets Safari users pick a time. shadcn recipes declare no limit; their dropdown caption gets react-day-picker's default of 100 years back to the end of this year, navigation only.
