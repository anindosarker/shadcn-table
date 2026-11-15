# Q88 date filter demo: report

## Where

- App repo: `test-projects/next-app` (own git repo, branch `playground/header-demo-theming`, not pushed).
- Final commits: page `b5015f7`, owner's picks `5931f23`.
- Page: `app/date-filter-demo/page.tsx`, at `/date-filter-demo` on the dev server.
- Picks: stored in `app/date-filter-demo/picks.json` through the route handler `app/api/date-filter-picks/route.ts` (GET reads, PUT replaces the whole list, ids `1.A` to `6.J`, atomic write). The page loads them on mount and on window focus, so every device on the dev server sees the same ticks; localStorage is only the fallback when the request fails.

## Owner's picks

- `picks.json` at `5931f23` holds: 1.A, 2.A, 2.B, 3.A, 3.G, 4.A, 4.G, 4.H, 5.A, 6.A.
- The lead's list also names 1.C; it is not in the committed file. Captures for 1.C were taken anyway.
- Per row: 1 date: A (and C per the lead). 2 date-range: A, B. 3 datetime: A, G. 4 datetime-range: A, G, H. 5 time: A. 6 time-range: A.

## Cards and what they are built from

- 1.A: native date box in an InputGroup, Calendar popover behind a calendar button.
- 1.B: docs date-picker Basic: outline Button trigger, Calendar popover.
- 1.C: docs date-picker Input: typed text Input, parsed on change, Calendar popover.
- 2.A: two native date boxes sharing one range Calendar, anchored to the pressed box.
- 2.B: docs Range Picker: one Button trigger, range Calendar (one month under 768 px).
- 2.C: two typed Inputs sharing one range Calendar.
- 3.A: native date box plus native time box, each with its picker.
- 3.B: docs Time Picker: date Button with Calendar, time Button with the built time picker.
- 3.C: typed date and typed time, each with its picker.
- 3.D: one Button trigger; one popover with Calendar and time picker columns side by side (stacked below 480 px).
- 3.E: one native datetime-local box; its calendar button opens 3.D's combined popover.
- 3.F: 3.D's trigger in front of the docs Calendar with Time card; its time field is 3.A's time box.
- 3.G: 3.E's native datetime-local box in front of 3.F's Calendar with Time card.
- 4.A: native From and To date and time boxes, one range Calendar.
- 4.B: docs Range Picker plus two time picker Buttons.
- 4.C: typed From and To dates and times, one range Calendar.
- 4.D: one Button trigger; range Calendar with From and To time picker Buttons under it.
- 4.E: one Button trigger; Tabs Start and End, each a single Calendar and a time picker Button.
- 4.F: one Button trigger; docs Calendar with Time in range mode with two native time fields.
- 4.G: two native datetime-local boxes sharing one Calendar with Time card (range Calendar, Start and End time as 3.A's time box).
- 4.H: 4.D's single trigger in front of 4.G's card.
- 5.A: native time box with the time picker. 5.B: time picker Button. 5.C: typed time with the time picker.
- 6.A: two native time boxes. 6.B: two time picker Buttons. 6.C: two typed times.

## Owner feedback applied during the run

- Month and year dropdown caption (`captionLayout="dropdown"`) on every Calendar.
- A built time picker: Popover with a ScrollArea and three button columns (hours, minutes, AM/PM); shadcn has none.
- Clear X on every control: an InputGroupButton for boxes, an outline Button in a ButtonGroup beside Button triggers; shown only with a value, focus returns to the field.
- Row and card numbering (`1 date`, `1.A ...`).
- Pick checkboxes per card with a "Picked:" summary, later moved from localStorage to the shared file.
- Single-component datetime cards: 3.D to 3.G.
- Single-button and shared-popover range cards: 4.D to 4.H.

## Per candidate style

- Browser box (A):
  - Works: typing, keyboard clearing, browser validation, year limit via `min` and `max`, mobile native pickers.
  - Cannot follow the theme: the segment text, the empty `dd/mm/yyyy` mask, and the native picker sheet are drawn by the browser; the format follows the browser locale, not the page.
- Button (B):
  - Works: fully themed, same look in every browser, exactly as the docs examples.
  - Limits: no typing; the clear X has to sit beside the trigger because a button cannot hold a button.
- Typed input (C):
  - Works: themed, free typing, the docs Input example's behavior.
  - Limits: parsing is loose (see facts); an unparsed text keeps the last date until the box is left.
- Where the docs differ from the brief:
  - None of the 8 date-picker examples (Base UI) has a clear control.
  - The docs have no time picker, only a native time field (Time Picker and Calendar with Time examples).
  - A range Calendar does not deselect on a second click; a single Calendar does.

## Facts found

- Input-group addon focus bug: the stock InputGroupAddon focuses the input on any click that is not on a button. React events bubble through the popover portal, so clicks on the Calendar's month and year selects moved focus to the input and closed the select. Fix: the Popover root and content sit outside the addon; only the trigger is inside.
- iOS Reset: React copies a controlled value into the `value` attribute (defaultValue), and the iOS picker's Reset returns to defaultValue, so the date or time iOS wrote on open came back. Fix: native boxes remove the `value` attribute whenever it is written (MutationObserver). Not verified on a real iPhone.
- iOS never allows keyboard typing in native date, time and date-time boxes; only the picker sheet.
- HTML has no range input for dates; every range here is two values or one Calendar in range mode.
- Typed dates parse with the browser's `new Date(text)` as the docs do, no parsing library; a bare `YYYY-MM-DD` is read as local parts.
- Next dev needs `allowedDevOrigins` for the Tailscale address (commit `f379e66`).

## Verification done

- One verifier round (visual, behavior, fidelity) on the first build only; its findings went to the fix pass.
- Everything after that was checked by the builder alone in Chromium (agent-browser) at 1280 and 360 px, dark, at the owner's request to iterate fast.
- No WebKit or Firefox run. Light theme and the other themes were not rechecked after the first round, apart from these captures.
- agent-browser cannot type into native date and time boxes, so desktop typing in A cells was driven with input events, not keystrokes.

## Open items

- The time picker columns do not scroll to the chosen hour and minute.
- 3.E's popover has no inner scroll; on a very short phone the stacked time columns can be cut off.
- The single-button trigger truncates a range in another year at 360 px (`Nov 14 '25 00:00 - Nov 28 '25 23:59`), hiding the end time.
- The playground header overflows at 360 px (app layout, not this page).
- The picks API replaces the whole list, so a stale tab can overwrite newer ticks from another device until it refetches on focus.
- 4.E's End tab Calendar does not show the start day, so the range is not visible while picking the end.
- The native boxes' format follows the browser locale (`14/11/2026` here), while Button triggers use the docs' English formats.

## Captures

- `page-light.png`, `page-dark.png`: full page at 1280 px.
- `<candidate>-<variant>-<light|dark>.png`: closed captures of the 11 cards, with values filled in.
- `a-date-open-dark.png`, `g-datetime-open-dark.png`, `g-datetime-range-open-dark.png`, `h-datetime-range-open-dark.png`: popover open, dark.
