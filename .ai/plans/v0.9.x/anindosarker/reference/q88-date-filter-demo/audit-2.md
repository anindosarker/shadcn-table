# Break-it audit of the current picks

Counts: 4 blockers, 10 majors, 9 minors, 1 dropped, about 235 attempts tried (about 180 by three breakers, 53 by the checker).

- Picks: 1.A, 2.A, 2.D, 3.A, 3.G, 4.A, 4.I, 5.A, 6.A, 6.B. Library defaults: 1.A, 2.D, 3.G, 4.I, 5.A, 6.A.
- Rows: 1 date, 2 date-range, 3 datetime, 4 datetime-range, 5 time, 6 time-range.
- Page `http://localhost:3000/date-filter-demo` at next-app 202e5ea. `page.tsx` below means `test-projects/next-app/app/date-filter-demo/page.tsx`.
- Truth tested against: the value printed at the foot of each card.
- Three breakers attacked the page (values and typing; interaction, focus and layout; other engines and the code). They reported 42 bugs. The checker replayed every one from a fresh load and merged them into the 23 below.
- Checker run: own Playwright scripts, headless Chromium at 1440x1000 and 1280x900, Firefox for the Firefox bug, on 2026-11-15. Native boxes typed with real key presses (`keyboard.press`, one key at a time). agent-browser was not used. Scripts: `/tmp/q88-break-check/r1.js` to `r4.js`.
- Date boxes in Chromium followed the system region here (day, month, year). Steps below give dates as day month year; type them in the order your box shows.

## Summary for the owner

- 4.I is the weakest card. Pick a range in the calendar, open the To clock, change the minute: 11:59 PM becomes 12:30 AM. The clock does not know the time the box shows.
- On every range card with a calendar (2.A, 2.D, 4.A, 4.I): type only the To date, then click a day. The To date is thrown away and nothing is stored.
- On 2.A, 2.D, 4.I, 6.A: type the later value in From and the earlier in To, then press the X in the To box. The other value is deleted, the one you aimed at stays.
- Clicking the day that is already marked deletes the value (1.A, 3.A, 3.G, 2.D, 4.I). A double click on a day stores nothing on 2.D, 3.G, 4.I.
- No calendar can go past December 2026 or before 1926. Today that means next month is the last one you can click. Typing still works.
- 2.D and 4.I: with only a To value stored, the button still says "Pick a date".
- 4.I: the same input can store two different To times (00:00 or 23:59), depending on Escape or a click outside.
- 4.I: a clock pick on an empty end stores today's date without asking, and a To time can end up as From.
- 4.I: the From and To boxes can show the opposite order to the stored value, and stay so after reopening.
- 3.G: one Backspace in the popover's time box resets the whole time to 12:00 AM; its X does nothing.
- 3.G, 4.I: a date typed without a time stores nothing, and there is no X to clear it.
- 4.I at 1280 wide: the popover jumps left after the first click, so a second click on the same spot hits the next day.
- 4.A: typing the ends in reverse order loses the From time. Firefox cuts the month off in the 4.I boxes.
- Held up well: 6.B, 5.A, plain typing on 1.A, the Escape order of the nested popovers, time zones in stored values, narrow screens, and no crash or console error anywhere.

## Per-card verdicts

| Card | Default | Verdict | Worst bug |
| --- | --- | --- | --- |
| 1.A | yes | has bugs | Click on the marked day deletes the date |
| 2.A | no | has bugs | Calendar click wipes a To-only range |
| 2.D | yes | has bugs | Calendar click wipes a To-only range |
| 3.A | no | has bugs | Click on the marked day deletes the date |
| 3.G | yes | has bugs | Double click on a day stores nothing |
| 4.A | no | has bugs | Calendar click wipes a To-only range |
| 4.I | yes | broken | Clock ignores the shown time: 23:59 becomes 00:30 |
| 5.A | yes | minor issues | Picker ignores a half-typed hour |
| 6.A | yes | has bugs | X and clock of a box act on the other end |
| 6.B | no | held | none |

## Bugs

### 1. Blocker. 4.I clock ignores the time shown in the box

- Cards: 4.I.
- Steps:
  1. Load the page.
  2. Click the 4.I trigger.
  3. Click Nov 10, then Nov 20. The To box shows 11:59 PM, printed to: 2026-11-20T23:59.
  4. Click the clock button in the To box.
  5. Click 30 in the Minute column.
- Observed: the picker opens with no hour, minute or AM/PM marked. After step 5 printed to: 2026-11-20T00:30.
- Variant: on a one-day pick, To clock, click only PM: To goes from 23:59 to 12:00.
- Expected: picker opens on 11, 59, PM; minute 30 gives 2026-11-20T23:30. 3.G does this right.
- Cause: `page.tsx:3145` passes the raw `range.toTime` (empty), not the shown default; the picker then falls back to 12, 0, AM at `page.tsx:764-766`.
- Engine: Chromium.
- Reproduced: yes. Pressed list was empty; stored 2026-11-20T00:30. PM-only variant stored 2026-11-10T12:00. Variant found by the checker.

### 2. Blocker. A calendar click wipes a To-only range

- Cards: 2.A, 2.D, 4.A, 4.I.
- Steps (2.D):
  1. Load the page.
  2. Click the 2.D trigger.
  3. In the To box type 20 11 2026. Printed to: 2026-11-20.
  4. Click Nov 10 in the calendar.
- Same on 4.I (To 20 11 2026 05:00 PM), and on 2.A and 4.A (type To, open the To calendar button, click a day).
- Also reached after a full range: clear From with its X, or press Backspace once in the From box, then click a day.
- Observed: printed from: "" and to: "", boxes empty, no day marked. A second click sets both ends to that day. On 4.I and 4.A the old To time stays hidden and is attached to the next pick (2026-11-12T17:00).
- Expected: the clicked day becomes From and the typed To is kept.
- Cause: `page.tsx:116-120` (`rangeOf` gives `{from: undefined, to}`), `:3051-3054` (2.D), `:3154` (4.I), `:968-971` (2.A): the calendar's empty answer is written straight into state.
- Engine: Chromium (breakers: also Firefox, WebKit).
- Reproduced: yes on all four cards.

### 3. Blocker. The X and the clock of a box act on the other end after the ends swap

- Cards: 2.A, 2.D, 4.I, 6.A (X); 4.I, 6.A (clock).
- Steps (2.D):
  1. Load the page.
  2. Click the 2.D trigger.
  3. In From type 20 11 2026.
  4. In To type 10 11 2026. Focus stays in To; the To box shows Nov 10.
  5. Click the X inside the To box.
- Observed: printed before the click from: 2026-11-10, to: 2026-11-20. After: from: 2026-11-10, to: "". Nov 20 is deleted, Nov 10 (the one in the To box) stays.
- 4.I (From 20 11 2026 10:00 AM, To 10 11 2026 08:00 AM): X leaves from: 2026-11-10T08:00, to: "".
- 6.A (From 05:00 PM, To 09:00 AM): X leaves from: 09:00, to: "".
- Clock variant: 4.I To clock opens on 10:00 AM (the other end); minute 30 stores to: 2026-11-20T10:30. 6.A To clock opens on 5:00 PM and stores to: 17:30.
- Expected: the X removes the value shown in its own box; the clock edits the time shown in its own box.
- Cause: pressing the button blurs the box, the blur swaps the ends, then the button acts on the swapped box. `page.tsx:534-540` (clear), order on blur at `:2993-2998`, `:3096-3102`, `:3148`, `:1204-1209`.
- Engine: Chromium (breakers: also Firefox, WebKit).
- Reproduced: yes on 2.A, 2.D, 4.I, 6.A for the X; on 4.I and 6.A for the clock.

### 4. Blocker. Clicking the marked day deletes the value; a double click stores nothing

- Cards: 1.A, 3.A, 3.G, 2.D, 4.I.
- Steps (1.A):
  1. Load the page.
  2. In the 1.A box type 10 11 2026. Printed 2026-11-10.
  3. Click the calendar button.
  4. Click Nov 10, the marked day.
- Observed: the popover closes, printed value: "", the box is empty.
- 3.A: same steps with a time; the date is removed, the time box keeps 02:30 PM, printed value: "".
- 3.G: open the calendar, double click Nov 20: printed value: "". With a typed value the time stays hidden and returns on the next pick.
- 2.D, 4.I: open, double click Nov 20: printed from: "" and to: "".
- Expected: a click on the picked day keeps it; a double click leaves the day picked.
- Cause: calendars in single and range mode can deselect. `page.tsx:933-943` (1.A), `:2452-2459` (3.G), `:2968-2977` (2.D, 4.I).
- Engine: Chromium (breakers: also Firefox, WebKit).
- Reproduced: yes on all five cards.

### 5. Major. No calendar can show or pick a date after December 2026 or before January 1926

- Cards: 1.A, 2.A, 2.D, 3.A, 3.G, 4.A, 4.I.
- Steps:
  1. Load the page.
  2. Click the 2.D trigger.
  3. Type From 10 03 2027 and To 20 03 2027.
- Observed: printed from: 2027-03-10, to: 2027-03-20 (correct). The calendar stays on November and December 2026, no day marked, next month disabled, year list 1926 to 2026 (101 entries).
- Expected: the calendar moves to March 2027 and marks the range; later years can be reached.
- Workaround: typing.
- Cause: `captionLayout="dropdown"` with no start or end month. `page.tsx:933-935`, `:2452-2454`, `:2968-2970`.
- Engine: Chromium (breakers: also Firefox, WebKit).
- Reproduced: yes on 2.D. Breakers saw it on 1.A, 3.G, 4.I; 2.A, 3.A, 4.A share the same calendar.

### 6. Major. The trigger shows the placeholder while a To value is stored

- Cards: 2.D, 4.I.
- Steps:
  1. Load the page.
  2. Click the 4.I trigger.
  3. In To type 20 11 2026 05:00 PM.
  4. Press Escape.
- Observed: printed to: 2026-11-20T17:00, trigger reads "Pick a date and time range". 2.D: printed to: 2026-11-20, trigger "Pick a date". Only the X beside the trigger hints at a value.
- Expected: the trigger shows the stored To end.
- Cause: `page.tsx:3015` (tests `date?.from` only), `:3133` (tests `first` only).
- Engine: Chromium.
- Reproduced: yes on both cards.

### 7. Major. 4.I stores a different To time depending on how the popover closes

- Cards: 4.I.
- Steps:
  1. Load the page.
  2. Click the 4.I trigger.
  3. Click Nov 20.
  4. In To type 10 11 2026 10:00 AM.
  5. Press Escape. Second run, same steps 1 to 4: click outside instead.
- Observed: Escape: printed to: 2026-11-20T00:00, and it stays. Click outside: printed to: 2026-11-20T23:59.
- Variant: click Nov 10 then Nov 20, type From 25 11 2026 12:00 AM: printed from: 2026-11-20T23:59. Press Tab: from: 2026-11-20T00:00. No input between.
- Expected: one stored value for the same input.
- Cause: the printed value applies the default times before the swap (`page.tsx:3071-3077`); `order()` swaps the raw empty times, so the other default applies after it (`:3096-3102`). `order()` runs only on a box blur.
- Engine: Chromium.
- Reproduced: yes, both the close variant and the Tab variant.

### 8. Major. 4.I clock on an empty end stores today's date, and a To time can become From

- Cards: 4.I.
- Steps:
  1. Load the page (today 2026-11-15).
  2. Click the 4.I trigger.
  3. In From type 20 12 2026 10:00 AM.
  4. Click the clock in the To box.
  5. Click 5 in Hour, then PM.
- Observed: To box fills with 15 11 2026 05:00 PM. Printed from: 2026-11-15T17:00, to: 2026-12-20T10:00. The time picked for To is now the From end.
- With nothing typed: To clock, hour 9 stores to: 2026-11-15T09:00 and the trigger still shows the placeholder.
- Expected: a time picked with no date stores no date (as 3.G and 4.A do), or uses the other end's date.
- Cause: `page.tsx:3104-3109`.
- Engine: Chromium.
- Reproduced: yes.

### 9. Major. Range boxes show the opposite order to the stored value

- Cards: 4.I, 2.D.
- Steps (4.I):
  1. Load the page.
  2. Click the 4.I trigger.
  3. Click Nov 10.
  4. To clock: click hour 10. Press Escape once.
  5. From clock: click hour 11. Press Escape twice.
  6. Click the trigger again.
- Observed: printed from: 2026-11-10T10:00, to: 2026-11-10T11:00, trigger "Nov 10 10:00 - Nov 10 11:00". From box shows 11:00, To box 10:00. Stays so after close and reopen.
- 2.D: type From 20 11 2026, To 10 11 2026, Escape, reopen: boxes still From Nov 20, To Nov 10 while printed says Nov 10 to Nov 20. The next calendar click only swaps the boxes; the click itself is ignored.
- Found by the checker, 4.I: type From 10 11 2026 05:00 PM, To 20 11 2026 09:00 AM, click Nov 20 in the calendar. Printed from: 2026-11-20T09:00, to: 2026-11-20T17:00; From box shows 05:00 PM, To box 09:00 AM.
- Expected: boxes, trigger and printed value agree; a calendar click always changes the range.
- Cause: `order()` runs only from a native box blur (`page.tsx:3148`, `:3045`); time picks, calendar picks and popover close never call it.
- Engine: Chromium (breakers: also Firefox, WebKit).
- Reproduced: yes, all three cases.

### 10. Major. 3.G popover time box: one Backspace resets the time to 12:00 AM, and its X does nothing

- Cards: 3.G.
- Steps:
  1. Load the page.
  2. In the 3.G box type 20 11 2026 02:30 PM. Printed 2026-11-20T14:30.
  3. Click the calendar button.
  4. Focus the Time box in the popover, press Backspace once.
  5. Click the X in the Time box.
- Observed: after step 4 printed 2026-11-20T00:00, time box 12:00 AM. After step 5 nothing changes and the X stays.
- Expected: Backspace empties one segment; the X clears the time or is not shown.
- Cause: `page.tsx:2336` (`shownTime` falls back to 00:00), `:2467` (the box is bound to it).
- Engine: Chromium (breakers: also Firefox, WebKit).
- Reproduced: yes.

### 11. Major. A date typed without a time stores nothing and has no X

- Cards: 3.G, 4.I.
- Steps:
  1. Load the page.
  2. In the 3.G box type 20 11 2026 and press Tab until focus leaves.
  3. Click the calendar button.
- Observed: box shows the date with an empty time, printed value: "", no X, no day marked in the calendar. 4.I From box: same, and the typed date is gone after close and reopen.
- The same day picked in the calendar stores T00:00, so the two input paths disagree.
- Expected: the typed date stores the same default the calendar gives, or the box shows it is incomplete and offers the X.
- Cause: the native box reports empty until every segment is filled. `page.tsx:2421-2424`, `:2889-2892`.
- Engine: Chromium.
- Reproduced: yes on both cards.

### 12. Major. 4.I popover jumps 32 px left after the first pick

- Cards: 4.I.
- Steps:
  1. Load the page at 1280x900 (4.I sits in the right column).
  2. Click the 4.I trigger.
  3. Click Nov 17.
  4. Click again without moving the pointer.
- Observed: trigger right edge 1120 to 1088, popover 626..1120 to 594..1088, day 17 from 700..733 to 668..701. The second click stores from: 2026-11-17T00:00, to: 2026-11-18T23:59.
- Expected: the popover does not move while open.
- Cause: the X appears beside the trigger and shrinks it; the popover is anchored to the trigger. `page.tsx:2946-2958`.
- Engine: Chromium (breakers: same numbers in Firefox and WebKit).
- Reproduced: yes at 1280x900. At 1440x1000 the popover did not move (there the second click hit bug 4 instead). 2.D did not move at 1280.

### 13. Major. 4.A: typing the ends in reverse order loses the From time

- Cards: 4.A.
- Steps:
  1. Load the page.
  2. Type From date 20 11 2026, From time 10:00 AM.
  3. Type To date 10 11 2026, To time 08:00 AM.
  4. Click outside.
- Observed: printed from: "", to: 2026-11-20T08:00. From time box empty. The typed 10:00 is gone.
- Expected: from: 2026-11-10T08:00, to: 2026-11-20T10:00.
- Cause: leaving the To date box swaps dates and times while the To end is half typed. `page.tsx:1137-1144`.
- Engine: Chromium (breakers: also Firefox, WebKit).
- Reproduced: yes.

### 14. Major. Firefox cuts off the month in the 4.I boxes and shows its own calendar icon

- Cards: 4.I (the extra icon also on the other native boxes).
- Steps:
  1. Open the page in Firefox.
  2. Click the 4.I trigger.
  3. In From type 11 10 2026 09:15 AM, in To type 12 20 2026 11:45 PM.
- Observed: boxes read "/10/2026, 09:15 AM" and "/20/2026, 11:45 PM", followed by Firefox's calendar icon, then the X and the clock. November and December look the same.
- Expected: the full date and time, one icon set.
- Cause: `page.tsx:517-518` hides the native icon for WebKit only; fixed box width at `:2963`.
- Engine: Firefox.
- Reproduced: yes. Capture `/tmp/q88-break-check/firefox-4I.png`.

### 15. Minor. The time picker ignores a half-typed box

- Cards: 5.A (same picker on 3.A, 4.A, 6.A).
- Steps: 1. Load. 2. In 5.A type 09. 3. Click the clock. 4. Click 30 in Minute.
- Observed: printed 00:30, box 12:30 AM. Also: type 02:30 PM, Backspace, clock, minute 45: printed 00:45.
- Expected: the typed hour is kept.
- Cause: `page.tsx:760-769`.
- Engine: Chromium. Reproduced: yes, both cases.

### 16. Minor. Hidden times survive a wipe

- Cards: 4.I, 3.G.
- Steps (4.I): 1. Load. 2. Open. 3. Type From 10 11 2026 09:00 AM, To 10 11 2026 05:00 PM. 4. Click Nov 10. 5. Click Nov 18.
- Observed: after step 4 printed empty, but two X stay in the popover and one beside the trigger. After step 5 printed from: 2026-11-18T09:00, to: 2026-11-18T17:00: the old times return.
- 3.G: time picked with no date (clock, hour 4, Escape twice): box empty, printed empty, X shown on the empty box.
- Expected: a wipe clears the times; a fresh pick gets the defaults.
- Cause: `page.tsx:3154`, `:2337`.
- Engine: Chromium. Reproduced: yes, both.

### 17. Minor. 4.I trigger text can misstate the stored value

- Cards: 4.I.
- Steps: 1. Load. 2. Open. 3. Type From 01 01 0099 12:00 AM, To 31 12 9999 11:59 PM.
- Observed: trigger "Jan 1 '99 00:00 - Dec 31 '99 23:59".
- Time zone America/New_York, From 08 03 2026 02:30 AM: trigger "Mar 8 03:30 -", printed 2026-03-08T02:30.
- A From-only value ends with a hanging " -".
- Expected: an unambiguous year, the stored time, no hanging dash.
- Cause: `page.tsx:2025-2033`, `:3134`.
- Engine: Chromium. Reproduced: yes, all three.

### 18. Minor. The calendar opens on a stale month

- Cards: 1.A, 2.D.
- Steps: 1. Load. 2. Open 2.D, type From 10 03 2020, To 20 03 2020, Escape. 3. Click the X beside the trigger. 4. Open again.
- Observed: calendar on March and April 2020 with empty boxes. 1.A after its X: June 2025.
- Found by the checker: 1.A with 2026-11-10 stored, open the calendar, choose year 1990, Escape, open again: calendar on November 1990, not on the stored month.
- Expected: the current month when empty, the stored month when set.
- Cause: the month state is never reset. `page.tsx:914`, `:2988`.
- Engine: Chromium. Reproduced: yes.

### 19. Minor. Half-typed text has no X; year 0000 turns into 0001

- Cards: 1.A, 2.A, 2.D, 5.A (shared native boxes).
- Steps: 1. Load. 2. In 1.A type 15 06, press Tab twice. Second case: type 15 06 0000, press Tab.
- Observed: case 1: printed empty, no X, text stays. Case 2: printed empty while focused, then 0001-06-15 after Tab.
- Expected: the X whenever the box shows text; a year the user did not type is not stored.
- Cause: `page.tsx:898`, `:891`.
- Engine: Chromium. Reproduced: yes, both.

### 20. Minor. Tab walks out of the open 4.I popover; empty tab stops after the time picker

- Cards: 4.I, 5.A.
- Steps: 1. Load. 2. Open 4.I. 3. Press Tab about 22 times. Second case: 5.A clock, Tab 4 times.
- Observed: 4.I: after the year list, focus lands on two empty elements, then in the 5.A box on the page behind; only then the popover closes. 5.A: Tab 4 lands on an empty 16 px element, Tab 5 on another as the picker closes.
- Expected: no empty tab stops.
- Engine: Chromium. Reproduced: yes, by reading the focused element; no visual check.

### 21. Minor. A double click on the X beside the trigger reopens the popover

- Cards: 4.I (2.D shares the part).
- Steps: 1. Load. 2. Open 4.I, click Nov 20, Escape. 3. Double click the X beside the trigger.
- Observed: value cleared, then the popover opens (the trigger grew under the pointer).
- Expected: cleared, popover closed.
- Cause: `page.tsx:566-578`.
- Engine: Chromium. Reproduced: yes.

### 22. Minor. 4.I box: the X and the clock overlap by 5 px

- Cards: 4.I.
- Steps: 1. Load at 1280x900. 2. Open 4.I. 3. Click Nov 17. 4. Measure the From box buttons.
- Observed: X spans 790..814, clock 809..833.
- Expected: no shared area between two different actions.
- Cause: `page.tsx:2882`.
- Engine: Chromium. Reproduced: yes.

### 23. Minor. The popovers have no accessible name

- Cards: 2.D, 3.G, 4.I.
- Steps: 1. Load. 2. Open the 4.I popover. 3. Read the dialog's `aria-label` and `aria-labelledby`.
- Observed: `role="dialog"`, both empty.
- Expected: a named dialog.
- Cause: `page.tsx:2956-2960`.
- Engine: Chromium. Reproduced: yes on 4.I.

## What we tried that held

- 1.A: years 0001, 0099, 1899, 1925, 2027, 9999; five and six digit years; Feb 29 2024; Feb 29 2025, Feb 30, Apr 31 (stores empty); month 13; Backspace and retype; double click on a day; double click on the X; year list ends and the nav buttons at the ends; a day whose midnight does not exist (America/Santiago).
- 2.D: From then To; To before From (printed stays ordered); From only, then clicks before, after and inside; range picked, then click the To day, the From day; half-typed From, close, reopen; reversed, then click outside; 26 Tabs with no trap; X inside the popover; trigger clicked while open; 360 and 320 px wide.
- 3.G: 12:00 AM, 12:00 PM, 11:59 PM, hour 13; years 0001 and 9999 with a time; time first, then a day; time columns for minute only, PM only, hour only; typing in the box with the popover open; Escape order of clock, then calendar, with focus back; clear, then a new pick gets 00:00 (no leftover time); the clock opens on the stored time (11, 59, PM) and 12 AM gives 00:59; keyboard in the time columns.
- 4.I: one and two calendar clicks; second click earlier than the first; a third click; From only, then clicks on the same and an earlier day; typed From then To; same day with To time before From time; switching From clock to To clock; outside click with the clock open; X beside the trigger while open; Enter in a box; arrows, Enter, Space, PageDown in the day grid; resize 1280 to 360 and back; reload with the popover open; 20 open and close cycles with no leftover nodes; five fast clock clicks; arrow keys in a box moving To below From (printed stays ordered).
- 3.A: time first, then date typed or picked; clear time stores empty; minute only gives 00:15.
- 4.A: dates only store nothing; same day with To time before From time; From date after To date with times.
- 5.A: 12:00 AM, 12:00 PM, 11:59 PM, hour 13; no AM/PM, hour only (stores empty); minute 60 and 99; every picker column and key; AM, 12, PM in a row; pressing a marked button again; X with focus return; typing with the picker open.
- 6.A: To before From (swap); both midnight; To only; From clock moved past To (same box keeps the edit, boxes swap on close).
- 6.B: From 5 PM, To 9 then PM; To 9 AM then click outside; both X buttons; To only; minute only.
- All: no console error and no page error in any run, Chromium, Firefox or WebKit.

## Earlier audit findings on the current picks

- B1, calendar years 1926 to 2026: still happens on 1.A, 2.A, 2.D, 3.A, 3.G, 4.A, 4.I. Bug 5.
- B2, calendar click wipes a To-only range: still happens on 2.A, 2.D, 4.A, 4.I. Bug 2.
- M1, picked value not in the trigger's accessible name: still happens on 2.D and 4.I (button named "Date range" and "Date and time range", the dates are content only). No screen reader run.
- M2, first click stores a full one-day range: still happens on 2.D and 4.I (one click on Nov 17 stores 17 to 17).
- M3, no input in the one-button range cards: gone. 2.D and 4.I have typed boxes in the popover.
- M4, defaults stored for parts the user never entered: gone on 3.A and 4.A. Still on 3.G (T00:00 after a calendar pick), 4.I (T00:00 and T23:59 after a calendar pick, today's date after a clock pick, bug 8), 5.A (one picker click fills the rest).
- M5, Firefox double icons: still happens; seen by the checker on 4.I, by a breaker on 1.A, 2.D, 3.G and the time boxes. On 4.I it now also cuts the text. Bug 14.
- M6, nothing stored until date and time are both set: still on 4.A (and 3.A by the same code); now also 3.G and 4.I for a typed date. Bug 11.
- M7, seconds lost: not checked on the page (no box takes seconds by keys). A breaker read the code as unchanged (`page.tsx:149`, `:2424`, `:2891`).
- M8, 12 hour and English only: still happens on every time picker and trigger text. 4.I shows 24 hour text in the trigger beside 12 hour boxes.
- M9, swap on blur with one owner for both ends: still happens on 2.A, 2.D, 4.A, 4.I, 6.A. It is the cause of bugs 3, 7, 9 and 13.
- M10, extra shadcn parts and packages: not a break-it item, not rechecked.

## Dropped

- 1 dropped. Firefox 4.I "AM/PM cut off after a calendar pick": not seen. In the checker's Firefox run AM/PM was visible and the month was cut off instead; kept as bug 14 in that form.
- 19 reports were duplicates across the three breakers and were merged, not dropped.

## Not verified

- iOS and Android, real Safari, the native pickers on touch devices.
- A real screen reader.
- WebKit and most Firefox paths: the checker ran Chromium, and Firefox only for bug 14. "Also Firefox, WebKit" above is the breakers' result.
- Paste into the native boxes (headless paste did nothing).
- Seconds in a stored time.
- A 24 hour locale and a month-first Chromium region.
- True browser zoom at 200 percent (a 640x450 viewport stood in for it).
- Sideways scroll of the whole page at 360 and 390 px (document 437 px wide); source not traced, may be outside the picked cards.
- Arrow keys on the month and year lists (no change in headless Chromium, not conclusive).
