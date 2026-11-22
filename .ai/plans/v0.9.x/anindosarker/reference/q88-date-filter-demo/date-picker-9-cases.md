# Date picker 9: cases and acceptance

What the verify loop tests against. The plan is [plan-date-picker-9.md](plan-date-picker-9.md); the implementation-level notes are [date-picker-9-design-notes.md](date-picker-9-design-notes.md).
Moved verbatim from the plan as it stood at commit faf90bc3, under the old section numbers, so "section N" and every case id (G, B, D, DT, C, T, R, P, PR, U) read as before. Sections 1, 3 to 11 and the Review notes are in the design notes.
Paths: `app/` and `components/` mean `test-projects/next-app/...`; `ui/` means `components/ui`; `nm/` means `node_modules`; "7.4" means `components/date-picker-7-4`.

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

### 2.11 month, typed in a box (version 9.1)

Version 9.1 only (`components/date-picker-9-1`, card 9.I). It replaces P4, P15 and P16 for `type="month"`; P5, P6, P12, P14, P17 and P18 hold as written. "From" names the version 9 case the row follows.
In Chromium a month is typed as its number, then the right arrow or Tab, then the four digits of the year. The value line and the calls line are the two lines under the card.

| # | Case | User sees | Value line, calls | From |
|---|---|---|---|---|
| M1 | Closed, empty | a month box (`<input type="month">`, `max` 9999-12 when the app sets none, `pattern` `[0-9]{4}-[0-9]{2}`, placeholder "yyyy-mm"), X hidden, calendar button "Select month". Chromium draws its own empty parts ("--------- ----") in the box, not the placeholder. iOS: "yyyy-mm" is drawn over the empty box (B9; read in the code, not run in a browser) | `""`, 0 | D1, P7 |
| M2 | A complete month is typed: 11, right arrow, 2031 | the box shows November 2031; the X shows | `"2031-11"`; four calls, one for each month the browser reports while the year is typed (0002-11, 0020-11, 0203-11, 2031-11), as a date box does | B1 |
| M3 | Half-typed: the year part of a typed month is deleted | the typed month name stays; no red mark while focused; after leaving: red border and the browser's message under the box | `""`, one call; leaving: no call | B2 |
| M4 | A complete month outside `min` or `max` is typed (Limits "min/max") | value kept; red border and the browser's range message after leaving | the month as typed | B3 |
| M5 | A month outside `min` or `max` arrives from the grid's value, a preset or the app | the box is flagged at once | - | B7; replaces P15 (the red trigger) |
| M6 | A far year is typed (5, right arrow, 1443), then the calendar button | the grid shows 1443 with May pressed; the year select runs 1400 to 2100 | `"1443-05"`, four calls; opening: no call | D7 |
| M7 | The same under Limits "min/max" | the year list does not grow; the box is flagged after leaving | the month as typed | D7, B3 |
| M8 | X | shown when the box holds a value or half-typed text; a press empties the box, half-typed text included | `""`, one call; no call when the value was already `""` | B6 |
| M9 | Calendar button after a typed month | the grid opens on the typed month's year, that month pressed | no call | D3 |
| M10 | A month is clicked in the grid after one was typed | the popup closes; the box shows the clicked month | `YYYY-MM`, one call; a click on the selected month: no call | P6, G1 |
| M11 | Preset | the grid moves to it; the popup stays open; the box shows it | the preset's value, one call | P17 |
| M12 | A fifth year digit: 07, right arrow, 20311 | Chromium: the year part takes four digits (the box holds `max` 9999-12), so the fifth digit starts the year over and the box shows July 0311, as the date box of card 1.9 does. A month with a five-digit year that a browser does report is not passed on | `"2031-07"` after four digits, then `"0311-07"`, one more call | B5 |
| M13 | Name | the app's `<label for>`, `aria-label` or `aria-labelledby` names the box; else "Month". The X is "Clear Month" | - | B10; replaces P16 |
| M14 | `disabled` | box and calendar button disabled, no X | never | G2 |
| M15 | A browser with no month control (Firefox, desktop Safari, Playwright's WebKit) | a text box with the placeholder "yyyy-mm". A text that is not four digits, a hyphen and two digits gets the browser's pattern message after leaving; no range message. Accepted as the browser draws it: there is no second code path | a text on the pattern is the value as typed; any other text is `""` | the decision of 2026-11-22; the year box's pattern test (P8) |

### 2.12 month range, typed in two boxes (version 9.1)

Version 9.1 only (card 10.I). The trigger, its text and its X are PR1 as written; PR4 to PR9 and PR12 hold as written. PR2 is replaced for `type="month"` by MR1.

| # | Case | User sees | Value line, calls | From |
|---|---|---|---|---|
| MR1 | Popup | per end: label, month box with its X (no calendar button), month grid; presets under both. Each column is as wide as its month box, as in the year range: the grid is 156 px wide at 1280 and 171 px at 390, against 152 on version 9. iOS: "yyyy-mm" is drawn over each empty end box (B9; read in the code) | - | PR3 |
| MR2 | An end is typed: From 6, right arrow, 2027 | both grids go to the years of the new pair: From's grid 2027 with Jun pressed, To's grid the year after | `["2027-06", ""]`; four calls, one per month the browser reports (M2) | R12 |
| MR3 | The other end is typed: To 3, right arrow, 2030 | From's grid 2027, To's grid 2030; the band runs from Jun 2027 to Mar 2030 | `["2027-06", "2030-03"]`, four calls | R12 |
| MR4 | Year list while an end is typed | the end being typed is left out of the year list until its box is left: the month box reports the years 1, 14 and 144 while 1443 is typed. From 5, right arrow, 1443: while the box has focus the list stays 1900 to 2100 and From's grid stays on 1900; when the box is left the list runs from 1400 and From's grid shows 1443 | `["1443-05", to]`, four calls; leaving: no call | R13 |
| MR5 | The typed pair is reversed (From 2030-06, To 2027-03), focus still in the To box | the band is drawn from the earlier month to the later | the reversed pair as typed | R14 |
| MR6 | Focus leaves both boxes for anything else (the popup's padding, a grid button, an arrow), or the popup closes | the ends swap; the grids go to the ordered years. A move from one box to the other never swaps. A box cleared by its X fires no blur, so the X never swaps | the ordered pair, once | R15, PR11 |
| MR7 | X on an end's box | that end is emptied; the other end stays | the pair with that end `""`, one call | B6 |
| MR8 | A month is clicked in a grid after an end was typed | the pick rule of PR4 to PR6; the boxes show the new pair; the popup stays open | the new pair, one call | PR4 to PR7 |
| MR9 | An end is half-typed (its year part deleted) | the typed month name stays; flagged after leaving | that end `""`, one call | B2 |
| MR10 | A typed end outside `min` or `max` | its box is flagged after leaving; the closed trigger is red; the year list does not grow | the pair as typed | B3, PR12, D7 |
| MR11 | A browser with no month control | each end box as M15 | as M15, per end | M15 |

## 12. Implementation steps

Each step is one commit in the `test-projects/next-app` repo (message `date picker 9: step N <name>`, staged by explicit path, no push; step 6 is two commits, as its row says). Each step ends with: the three checks of section 10 clean; then a reader with no history reviews the step's diff against this plan and the bar, and its findings are fixed, before the next step starts.

Cards: a version 9 card is a copy of the row's newest card with `usePickerSettings(type, range, "popup")`, `version="9"`, title "Rebuilt from the plan", the next free letter, an input id `fix-<row><letter>`, and the import `@/components/date-picker-9/date-picker`. Each step also adds a 7.4 reference card (`version="7.4"`, title "Reference", import `@/components/date-picker-7-4/date-picker`) to its rows. Both new cards of a row count `onChange` calls: `const [calls, setCalls] = React.useState(0)`, `onChange={(next) => { setValue(next); setCalls((count) => count + 1) }}`, and a second value line, `value={[["value", value], ["calls", calls]]}`. Acceptance compares both lines; "not called", "once" and "one call" in section 2 are read from the calls line. Letters: row 1 `AC` (7.4), `AD` (9); row 2 `AB`, `AC`; row 3 `AH`, `AI`; row 4 `AW`, `AX`; row 5 `N`, `O`; row 6 `N`, `O`; rows 7 to 10 `G`, `H`; rows 11 and 12 `L`, `M` (the existing 7.4 card `K` has no calls line and is left as it is). Row 4's cards keep the "Error from the form" switch. `_lib/labels.ts` is not edited: in the two translated languages the new and renamed keys fall back to English, which no screenshot shows.

| # | Step | Built | Files | Must not touch | Check against 7.4 |
|---|---|---|---|---|---|
| 1 | date, one value | the box, the popup, the day calendar, the entry for `type="date"` | `values.ts` (`HtmlProps`, `Limits`, `ControlProps`, `fromYmd`, `ymd`, `outsideLimits`, `checkedLimits` with the date format), `views.ts` (`ListBounds`, `listBounds`, `clampView`), `labels.ts`, `picker-field.tsx`, `picker-popup.tsx`, `picker-box.tsx`, `picker-presets.tsx`, `view-nav.tsx`, `day-calendar.tsx` (no band, no caption variants yet), `day-picker.tsx` (date path), `date-picker.tsx` (`DateProps`, one value); row 1 cards | anything outside the new folder except `_cards/row-1-date.tsx` | cases G1 to G5, B1 to B11 (B9 by string equality, section 2.2), D1 to D11, U1, U2, U4 to U9 on row 1; pixels of row 1 in every cell of the section 13 matrix; `PickerBox` and `PickerPopup` compile with no `as` cast |
| 2 | time, time range, datetime | the clock, the time field, the date-time path | `time.ts` (all of it), `values.ts` (`datePart`, `timePart`, `joinDateTime`, `checkedStep`, the date-time and time formats of `checkedLimits`), `range.ts` (`RangeValue`, `RangeEnd`, `rangeEnds`, `putEnd`), `time-columns.tsx`, `time-field.tsx`, `time-range-picker.tsx`, `day-picker.tsx` (date-time path), `date-picker.tsx` (`DateTimeProps` one value, `TimeProps`); cards of rows 3, 5, 6 | the other step 1 files | cases C1 to C9, T1 to T5, DT1 to DT11, U3 on rows 3, 5, 6; pixels of those rows |
| 3 | date and datetime range | the trigger, the range panel, the band, the phone-dialog layout, the swap | `range.ts` (`RangeTimes`, `isReversed`, `orderRange`, `selectRange`, `formatRange`, `leftBothBoxes`), `values.ts` (`dateLibFor`, `formatValue`), `views.ts` (`RangeViews`, `viewsForRange`, `shownViews`, `endBounds`), `picker-trigger.tsx`, `day-range-picker.tsx`, `day-calendar.tsx` (band, `FromCaption`, `ToCaption`), `date-picker.tsx` (date and date-time range); cards of rows 2, 4 | the clock, the box and every file not named | cases R1 to R20 on rows 2, 4; pixels of those rows, phone dialog included; `PickerTrigger` compiles with no `as` cast |
| 4 | week, month, year, one value | period values, the three views, the one-value period picker | `values.ts` (`PeriodType`, `inYear`, `periodOf`, `startOfPeriod`, `dayLimits`, `formatPeriod`, the week, month and year formats of `checkedLimits`), `views.ts` (`periodViewStart`, `periodViewMonths`, `periodBounds`), `range.ts` (`rangeState`, which `PeriodView` uses for one value and for a pair), `period-views.tsx`, `period-picker.tsx`, `date-picker.tsx` (`WeekProps`, `MonthYearProps`, one value); cards of rows 7, 9, 11 | day and time pickers and every file not named | cases P1 to P18 on rows 7, 9, 11; pixels of those rows |
| 5 | week, month, year range | the period range picker | `range.ts` (`pickRange`), `period-range-picker.tsx`, `date-picker.tsx` (final union); cards of rows 8, 10, 12 | every file not named | cases PR1 to PR12 on rows 8, 10, 12; pixels of those rows |
| 6 | folders and `types.ts`; then the whole-folder pass | First the restructure, which keeps the code: `git mv` each file into its folder of section 4; fix the relative imports; move the public types and the types two or more files use into `types.ts` in the groups of 4.2 (26 types; `PickerLabels` stays in `labels.ts`); the 47 types one file uses stay at the top of their file, their `export` dropped where one was written. No hook extraction: the swap handlers stay as built. No behaviour, markup, class or type-shape change. Checked by the three checks of section 10 and by rerunning the existing scratch comparison scripts for the R and PR cases and for the pixels of rows 2, 4, 8, 10, 12 against 7.4. Committed on its own as `date picker 9: step 6 folders and types.ts`. Then, nothing new: read all 22 files against sections 3 to 10; type cases; section 13 in full | restructure: all 21 built files (moved; imports edited; the shared and public type blocks moved out), new `types.ts`. Pass: any file of the folder, for findings only | the cards (their import path `@/components/date-picker-9/date-picker` does not change); in the restructure, any line that is not an import, a type or an export list | section 13 |

Steps 1 to 5 were built and reviewed on the flat layout with every type at the top of the file that first used it; a reviewer of those steps does not raise the layout or the types file: step 6 does both. The Files column of steps 1 to 5 names files and types as they were built then: flat, each type in the file listed.

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
