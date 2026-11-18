# Check of the audit-fix cards

- Pairs checked (fix card fixes original): 4.J fixes 4.I, 2.E fixes 2.D, 3.I fixes 3.G, 1.E fixes 1.A, 6.D fixes 6.A, 5.D fixes 5.A, 2.F fixes 2.A, 3.J fixes 3.A, 4.K fixes 4.A.
- next-app head commit: d106dec (round 1 fixes in 8566a62, round 2 fixes in d106dec, round 3 checked only).
- Rounds run: 3.
- Still open after round 3: 0 blocker, 3 major, 5 minor (8 distinct findings; the 4.J trigger cut-off was reported twice in round 3 and counts once).

## Summary for the owner

- Two independent checkers (look and behaviour) tested the nine fix cards against their originals over three rounds.
- Round 1 found one blocker: editing a filled range swapped the ends mid-typing and stored a wrong range (2.E, 2.F, 4.J, 4.K, 6.D). Fixed: the swap now waits until you leave the box.
- Also fixed: greyed 4.J boxes, uneven right corners on all eight one-button triggers, X spacing in Luma, card label height, clock picks on the wrong end, default times travelling with a swap, stuck red "incomplete" boxes, Escape dropping a typed year, double clicks reopening or ticking things.
- Round 2 fixed lost calendar clicks after typing, day clicks while the clock is open, hover titles that never showed, and 2.E's date text now matches 2.D.
- Still open, three major: the 4.J closed trigger cuts off the To time in a 12 hour locale; a reversed range stays reversed while focus stays in the box; the X or clock of the other box acts on the swapped value.
- These three wait for your choice: how 4.J shows a long range, and when the swap should happen.
- Still open, five minor: scroll thumb over the selected time (originals too), Firefox half-typed year, triple click under the closed calendar, a lost click after a one-digit year, and a typed date with no time that the clock cannot finish.
- Accepted and not fixable here: Firefox's own picker icon, filled boxes 1 px narrower, year 0000, 5.D half-typed hour, Base UI empty Tab stops, seconds in stored values, phones and real screen readers not tested.

## Per-card result

| Fix card | Fixes | Verdict | Worst open item |
| --- | --- | --- | --- |
| 1.E | 1.A | minor issues open | Triple click on a day ticks 2.A's Default box |
| 2.E | 2.D | has bugs | Other box's X clears the wrong end after reverse typing |
| 2.F | 2.A | has bugs | Other box's X clears the wrong end after reverse typing |
| 3.I | 3.G | minor issues open | Typed date with no time cannot be finished with the clock |
| 3.J | 3.A | minor issues open | Scroll thumb over the selected time (originals too) |
| 4.J | 4.I | has bugs | Closed trigger cuts off the To time in 12 hour locale |
| 4.K | 4.A | has bugs | Other box's X clears the wrong end after reverse typing |
| 5.D | 5.A | minor issues open | Scroll thumb over the selected time (originals too) |
| 6.D | 6.A | has bugs | Other box's X or clock acts on the swapped value |

## Open findings

### 1. 4.J closed trigger cuts off the To time in a 12 hour locale (major, 4.J)

- Steps: load the demo page at 1280x900, dark, default theme. Open 4.J. Type From 10 11 2026 09:00 AM and To 20 11 2026 05:00 PM. Press Escape. Variant: click Nov 17 then Nov 20. Repeat in Luma + Darkmatter.
- Observed: nova shows "Nov 10 9:00 AM - Nov 20 5:00 ..." (needs 213 px, has 212). Calendar default times need 230 px. Luma and Vega cut earlier (192 px). A From in another year needs 260 px. Only Lyra and Mira fit same-year cases. Printed value and accessible name are correct.
- Expected: both ends readable at card width, as 4.I shows the same value.
- Owner choice: two-line trigger when filled, drop ":00" for whole hours, or show the time only for ends whose time was chosen.

### 2. Reversed range stays stored while focus rests in the box or its own buttons (major, 2.E, 2.F, 4.J, 4.K, 6.D)

- Steps: open 4.J, click Nov 10, click Nov 20. In From type 25 11 2026 12:00 AM. Press Tab three times. 2.E: From 20 11 2026, To 10 11 2026, Tab once.
- Observed: after Tab 1 and Tab 2 (own X, own clock) the value and trigger read "Nov 25 12:00 AM - Nov 20 11:59 PM". Ordered only on Tab 3. 2.E stays from 2026-11-20, to 2026-11-10 after Tab 1. Enter orders at once.
- Expected: rule 1, the printed value and trigger never hold From after To.
- Owner choice: swap at once (boxes jump mid-edit) or swap on leave (current, with this gap and finding 3).

### 3. The other box's X or clock acts on the swapped value (major, 2.E, 2.F, 4.J, 4.K, 6.D)

- Steps: open 2.E. In From type 20 11 2026, in To type 10 11 2026 (focus stays in To). Click the X inside the From box. 4.J clock variant: From 20 11 2026 10:00 AM, To 10 11 2026 08:00 AM, click the From clock, click 30. 6.D: From 05:00 PM, To 09:00 AM, click the From X or clock.
- Observed: 2.E stores from "", to "2026-11-20"; Nov 10 is deleted instead of the shown Nov 20. Same on 2.F, 4.J, 4.K, 6.D. The 4.J From clock opens on 8:00 AM and stores from 2026-11-10T08:30. Same in Firefox. Own-box X and clock work.
- Expected: audit bug 3, the X removes the value its box showed when pressed; the clock edits the time that box showed.
- Follows from the swap-on-leave choice in finding 2.

### 4. Time picker scroll thumb covers the right end of the selected button (minor, all time cards and their originals)

- Steps: Luma + Darkmatter, 1280x900, dark. In 5.D type 09:30 AM, open the clock.
- Observed: the scrollbar thumb sits on the right edge of the selected 9 and 30 pills. 5.A looks the same.
- Expected: selected button fully visible. Shared with the originals; owner decides if in scope.

### 5. Firefox: half-typed year gives two results by close path, box not flagged (minor, 2.E, 4.J, same box code on 1.E, 2.F, 3.I, 3.J, 4.K)

- Steps: Firefox 1440x1000. Open 2.E, click Nov 10, click Nov 20. In To, Tab to the year, type 25. Then Escape, or outside click, or Tab out, or Enter then Escape.
- Observed: box shows 0025, printed to stays 2026-11-20, no flag or note. Escape and Enter keep 2026-11-10 to 2026-11-20. Outside click and Tab store from 0025-11-20, to 2026-11-10. Chromium is consistent and flags the box.
- Expected: rule 6, one result on every close path; rules 1 and 7, the differing box is flagged.

### 6. Triple click on a day lands on the control under the closed calendar (minor, 1.E, 3.J)

- Steps: block the picks POST first. Open the 1.E calendar, triple click Nov 20.
- Observed: stores 2026-11-20, then sends a POST ticking 2.A's Default box (blocked in the test; files unchanged). Double click is fixed.
- Expected: clicks on a day store the day and do nothing else.

### 7. Calendar click lost after a one-digit year edit (minor, 2.E, 4.J)

- Steps: open 2.E, click Nov 10, click Nov 20. In To, Tab to the year, type 1. Click Nov 25.
- Observed: the year commits on leave, the calendar jumps to January 1900 under the pointer, Nov 25 is not applied. Stored from 0001-11-20, to 2026-11-10.
- Expected: audit bug 9, a calendar click always changes the range. Owner call whether this edge matters.

### 8. Typed date with no time is a dead end (minor, 4.J, 3.I)

- Steps: open 4.J. In From type 12 11 2026, stop. Hover the From clock. Click Nov 20.
- Observed: box shows the date but is red and "incomplete"; the clock says "Pick a date first". Clicking Nov 20 drops the typed Nov 12. 3.I: the footer time box and clock are disabled the same way.
- Expected: not covered by the ten rules. Owner choice: store the typed date with the default time (audit bug 11's first option), or accept.

## Fixed in this check

### Round 1 (next-app 8566a62)

- 4.J boxes no longer look disabled: only the clock dims, the box keeps its normal look.
- All eight one-button triggers (1.B, 2.B, 2.D, 2.E, 3.D, 4.H, 4.I, 4.J): the right end now takes the theme radius, same as the left end, in every style. Look-only change on the originals, allowed by the owner.
- Fix boxes put X and picker in two addons like the originals; the Luma 4 px shift is gone (4.J keeps one joined addon for audit bug 22).
- Fix cards use the original card's description, so labels line up with the original in every row.
- Blocker fixed: typing in a filled range no longer swaps ends mid-typing; the range settles when focus leaves the box group, on Enter, or on close.
- Clock picks stay on their own end until the clock closes (6.D 17:00 to 21:00, 4.J and 4.K 09:00 to 14:00).
- Default times follow the end's new position after a swap, unless the time was chosen (audit bug 13 now stores 08:00 to 10:00 correctly).
- A half-typed box filled by a calendar or clock pick is repaired and no longer flagged.
- The "(box incomplete, kept)" note is per box: 3.I footer box flagged, 4.K date and time separate, cleared when the box goes away.
- Escape now stores a typed year under 1000 the same as outside click.
- Double click on the X beside the trigger no longer reopens the popover (audit bug 21).

### Round 2 (next-app d106dec)

- Calendar clicks right after typing are no longer lost (stable day buttons in the fix calendars; the shared calendar component untouched).
- A day click while the clock is open picks the day, as in 4.I and 3.G.
- Picking the already marked day or time repairs a half-typed box.
- A year under 1000 waiting for blur is flagged as incomplete.
- Double click on a day no longer ticks a box under the closed calendar (1.E, 3.J).
- "Pick a date first" title now shows on hover (moved to the element that takes the pointer).
- 2.E trigger text matches 2.D ("Nov 10, 2026 - Nov 20, 2026").

### Round 3

- No fixes; check only.

## Not fixed and why

- 4.J trigger cut-off (finding 1): no single-line text with both full date-times and AM/PM fits the card; every option changes 4.J's look or rule 10 differently. Waits for the owner's pick.
- Swap timing (findings 2 and 3): swapping on every commit follows rule 1 literally but makes boxes jump mid-edit; printing an ordered range while boxes wait breaks "boxes and printed value agree". Waits for the owner's pick.
- Audit bug 7 Tab variant: the checker expected From 23:59; the fix stores 00:00 because the day came from a calendar click with no chosen time (rule 5). Kept on purpose.
- One-digit year then calendar click (finding 7): the year commit on leave follows rule 6 and the month jump follows rule 4; only the lost click is open.

## Accepted limits

- Firefox draws its own picker icon in native boxes.
- Filled fix boxes are 1 px narrower than the originals.
- Year 0000 cannot be entered or stored.
- 5.D: a half-typed hour behaves as the native box allows.
- Base UI leaves empty Tab stops in some popovers.
- Stored values may carry seconds from the native input.
- iOS, Android and a real screen reader were not verified.
