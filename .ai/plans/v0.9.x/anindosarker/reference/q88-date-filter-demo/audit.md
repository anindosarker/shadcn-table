# Q88 date filter demo: audit of the ten picked cards

Counts: 2 blockers, 10 majors, 15 minors (not second-checked), 0 dropped (2 duplicate pairs merged).

- Cards: 1.A, 2.A, 2.B, 3.A, 3.G, 4.A, 4.G, 4.H, 5.A, 6.A. Library defaults: 1.A, 2.A, 3.G, 4.G, 5.A, 6.A. Example picks: 2.B, 4.H.
- `page.tsx` below means `test-projects/next-app/app/date-filter-demo/page.tsx`. Line numbers are the auditors', taken at next-app b55c8ac.
- The checker ran at next-app f393f9b (four commits later: new unpicked cards, 4.H time fields relabelled From and To). The lines re-read (:92-94, :116-120, :149, :517-518, :761-768, :955-972, :1282-1335, :1444-1460) were unchanged. Lines after :1460 may have shifted.
- Checker run: headless Chromium and Firefox, Playwright, 1400x1000, en-US, on 2026-11-15. Script and output: `/tmp/q88-audit2-check/chk.mjs`, `out-chromium.txt`, `ff-3A.png`.

## Summary for the owner

Blockers:
- 2.B and 4.H cannot pick any date after December 2026 or before January 1926. They have no box to type in, so such a date cannot be entered at all. The other calendar cards accept a typed 2027 date but their calendar cannot show it.
- 2.A and 4.G: with only the To end filled, one click on a calendar day empties both ends.

Majors:
- 2.B and 4.H: a screen reader hears only "Date range, button". The picked dates are not in the button's name.
- 2.B and 4.H: the first click stores a full one-day range, every click is a finished value, and a range with one open end is impossible.
- 2.B and 4.H have no box: no typing, no Enter to apply, nothing for the table to focus, and the current tests find no input.
- The time picker throws away seconds, and one click in it replaces a time that had seconds.
- A calendar day alone stores midnight (or 23:59 for the end) in 3.G, 4.G, 4.H; one picked hour stores a full time. The user never entered those parts.
- 3.A and 4.A do the opposite: dates show in the boxes but nothing is stored until a time is added.
- Firefox shows two calendar icons and two clock icons in every browser box.
- All text is English only and the time picker is 12 hour only.
- The range cards need one owner for both ends; the library has two separate fields today.
- Four new shadcn parts and two new packages are needed (calendar, scroll area, button group, card; react-day-picker, date-fns).

## Can 2.B ship

Kept findings that touch 2.B:
- Blocker: no date outside 1926 to 2026 can be picked, and 2.B has no typing fallback (B1).
- Major: the picked range is not in the trigger's accessible name (M1).
- Major: first click stores a one-day range, every click is a complete value, no one-ended range (M2).
- Major: no input, so no typing, no Enter or blur commit, no focus target, no E2E fill (M3).
- Major: trigger text and labels are fixed English (M8).
- Major: one owner for both ends against the library's two fields (M9).
- Major: needs calendar, button-group, react-day-picker and date-fns, none in the core item (M10).
- Minors that touch it: unnamed dialog, focus lands on the previous-month button, day button names, popover taller than the viewport at 200 percent zoom.

What the library loses with a button-only range control:
- Typed entry of a date.
- A range with one open end. The library stores and filters `[min, empty]` and `[empty, max]` today.
- The Enter or blur commit point. Each calendar click is a pick, so the table would refilter per click.
- The input the table focuses when the filter opens, and the input the E2E helper and the mobile date story count.
- The place where the mode button and the empty or notEmpty chip sit (an input group addon).
- Stored strings themselves are fine: `YYYY-MM-DD` per end, same as the library.

Verdict: yes after these fixes, as an example demo only: let the calendar reach years outside 1926 to 2026, and put the picked range in the button's accessible name. Not as a library default: it has no input and no one-ended range.

## Per-card verdicts

| Card | Verdict | Blockers and majors |
| --- | --- | --- |
| 1.A | ready after fixes | calendar cannot show a date after 2026; Firefox double icon; English labels; new parts |
| 2.A | not ready | blocker: calendar click wipes a To-only range; calendar year limit; Firefox double icon; one owner for both ends |
| 2.B | not ready as built; ready after fixes as an example | blocker: no date after 2026; picked range not in the button name; one-day first click; no input |
| 3.A | ready after fixes | stores nothing until date and time both set; seconds lost in the picker; Firefox double icons; 12 hour picker; calendar year limit |
| 3.G | ready after fixes | day alone stores 00:00; seconds cut; Firefox double icon; 12 hour picker; calendar year limit |
| 4.A | ready after fixes | stores nothing until all four boxes set; seconds lost; Firefox double icons; one owner for both ends; calendar year limit |
| 4.G | not ready | blocker: calendar click wipes a To-only range; day alone stores 00:00 and 23:59; seconds cut; Firefox double icon |
| 4.H | not ready as built; ready after fixes as an example | blocker: no date after 2026; picked range not in the button name; no input; stores 00:00 and 23:59 |
| 5.A | ready after fixes | one pick rewrites a time with seconds; one hour stores a full time; Firefox double icon; 12 hour picker |
| 6.A | ready after fixes | same time picker majors as 5.A; ends swap on blur needs one owner |

## Code: implementation, quality, deviation from shadcn, libraries

Overview (auditor, not second-checked beyond the findings below):
- 1.A, 2.A, 3.A, 4.A, 5.A, 6.A keep the native box and store its string. 3.G and 4.G use a `datetime-local` box over a Date plus a time string. 2.B and 4.H are a button trigger over a calendar popover.
- Three effects in the picked cards, all cleaned up; no timers; no leak found.
- Stored strings matched the box in every typed, picked, cleared and reversed run.
- No local `components/ui` part is byte-equal to stock base-nova (class tokens and icon imports differ).
- Page code is Base UI specific (`render=`, `initialFocus`, `--available-height`).

Findings:
- **Major (M1). 2.B, 4.H. Picked value is not in the trigger's accessible name.** `page.tsx:1455` (`FieldLabel htmlFor="b-date-range"`), `:1299-1305` (Button id); 4.H trigger `#h-datetime-range`. WCAG 2.2 4.1.2 Name, Role, Value (A). The label wins the name computation; the date text is button content only.
  - Proof: Chromium CDP `{"role":"button","name":"Date range","nameFrom":["relatedElement:labelfor","contents:"]}`, no value, no description.
  - Checked: picked Nov 10 and Nov 20 in 2.B. Trigger text `Nov 10, 2026 - Nov 20, 2026`; CDP AX node `role=button, name="Date range"`, sources `relatedElement:labelfor, contents:`, no value. 4.H ariaSnapshot: `button "Date and time range": Nov 10 00:00 - Nov 10 23:59`. Kept as major, not blocker: selected days are exposed inside the open calendar, and no real screen reader was run.
- **Major (M2). 2.B, 4.H, and the range calendar in 2.A, 4.A, 4.G. First click stores a full one-day range; every click is a complete value; no one-ended range.** `page.tsx:1323-1330`, `:1449-1450`; react-day-picker 10.0.2. No in-progress state, no apply step, popover stays open. The library's two range boxes hold `[min, empty]` and `[empty, max]` (`shared/fns/filterFns.ts:263-274`). Merged from one code finding and one library-fit finding.
  - Proof: `click 10 => from: "2026-11-10" | to: "2026-11-10" open=1`; `click 20 => to 2026-11-20`.
  - Checked: 2.B click 10 gave `from: "2026-11-10" | to: "2026-11-10" open=1`, click 20 gave `to: "2026-11-20" open=1`. 4.H click 10 gave `from: "2026-11-10T00:00" | to: "2026-11-10T23:59"`. `between` reads an empty end as open at `filterFns.ts:268,273` (read). The three-click clear path was not rerun.
- **Major (M8). All cards. Display text is fixed English; the time picker is 12 hour only.** `page.tsx:1312-1316` (`format(..., "LLL dd, y")`, `Pick a date`), `:145-169`, `:637` (AM, PM), `:533`, `:570` (`Clear`). No `locale` prop on any Calendar. A 24 hour locale would show a 24 hour native box beside a 12 hour picker.
  - Checked: `grep -n locale page.tsx` returns only `localeCompare` at :313. 5.A picker groups read `Hour:12 buttons, Minute:60, AM or PM:2`. Rendering in a 24 hour locale: not verified.
- **Major (M10). All ten. Four shadcn parts and two packages are not in the core item.** `packages/shadcn-table/registry.json`; calendar (1.A, 2.A, 2.B, 3.A, 3.G, 4.A, 4.G, 4.H), scroll-area (3.A, 3.G, 4.A, 4.G, 4.H, 5.A, 6.A), button-group (2.B, 4.H), card (3.G, 4.G, 4.H). Packages: react-day-picker 10.0.2 MIT, date-fns 4.4.0 MIT. Auditor gzip: day picker imports 20,505 B, `format` adds 7 B.
  - Checked: `ls registry/{base,radix,aria}/components/ui | grep -c 'calendar\|scroll-area\|button-group\|card'` gives 0 for each base; the same grep on `registry.json` gives 0. `node_modules` package.json: react-day-picker 10.0.2 MIT, date-fns 4.4.0 MIT. `https://ui.shadcn.com/r/styles/base-nova/calendar.json` lists `['cn', 'react-day-picker@latest', 'date-fns']`. Gzip sizes not rerun. No license problem seen.
- Minor, not second-checked. 4.H, 4.G. `focusTimePicker` (`page.tsx:802-808`) queries the whole document; with two time pickers mounted, focus can land outside the open one. Script clicks only.
- Minor, not second-checked. 4.H. Trigger label (`page.tsx:2022-2030`) parses the stored string as a local instant; a time in a DST gap shows one hour off while the stored string is right.
- Minor, not second-checked. All calendar cards; value loss only in 3.G, 4.G. `fromYmd` (`page.tsx:70-90`) rejects days the local zone skipped (Pacific/Apia 2011-12-30).
- Minor, not second-checked. All native-box cards. `NativeInput` (`page.tsx:839-864`) strips the `value` attribute with a MutationObserver that depends on React's write order.
- Minor, not second-checked. Time picker cards. One partial pick stores a full time (`page.tsx:761-769`): minute 30 on an empty field stores `00:30`.
- Minor, not second-checked. All ten. The demo's `components/ui` files are not stock CLI output (calendar 46 diff lines, popover 16, input-group 65, scroll-area 16, button-group 4, field 92, card 37).

## Browser: accessibility and cross-browser

Overview (auditor, not second-checked beyond the findings below):
- Playwright 1.64.1, Chromium, Firefox, WebKit, 1440x1000, axe-core on the ten cards.
- Keyboard works in all three engines: open, arrows, Enter, Escape, focus return, clear X by Tab.
- axe with cards closed: 0 violations. Contrast: 0 violations, light and dark. No touch target under 24 by 24.
- Time picker tree: groups Hour, Minute, AM or PM with pressed toggle buttons; no live region.

Findings:
- **Blocker (B1). 2.B, 4.H (no workaround); major for 1.A, 2.A, 3.A, 3.G, 4.A, 4.G (typing works). Calendar is limited to January 1926 through December 2026.** `page.tsx:1323-1330` and every other `captionLayout="dropdown"` Calendar; no `startMonth` or `endMonth` in the file. `node_modules/react-day-picker/dist/esm/helpers/getNavMonth.js:17,23`.
  - Proof: `startMonth = startOfYear(addYears(props.today ?? today(), -100));` and `endMonth = endOfYear(props.today ?? today());`.
  - Checked: read those two lines in `getNavMonth.js`. `grep startMonth\|endMonth page.tsx` is empty. 2.B open: year select `1926..2026 n=101`, next-month button disabled, months `Nov 2026, Dec 2026`. 4.H: years `1926..2026`. 1.A with `2027-03-10` typed: footer `value: "2027-03-10"`, calendar shows `Dec 2026`, 0 selected days. 2.B has 0 inputs and typed digits on the trigger changed nothing.
- **Major (M1, same finding as in Code).** The browser auditor saw the same name in all three engines.
- **Major (M5). 1.A, 2.A, 3.A, 3.G, 4.A, 4.G, 5.A, 6.A and the time boxes inside popovers. Firefox shows the native picker icon beside the custom one.** `page.tsx:517-518`: `hideNativeIcon` only targets `::-webkit-calendar-picker-indicator` plus `appearance-none`.
  - Checked: Firefox screenshot `/tmp/q88-audit2-check/ff-3A.png` of 3.A with values: date box shows calendar icon, X, calendar icon; time box shows clock, X, clock. Whether the Firefox icon opens Firefox's own picker: not verified.
- **Major (M6). 3.A, 4.A. Nothing is stored until date and time are both set; 3.G, 4.G, 4.H default the time instead.** `page.tsx:92-94` (`return date && time ? ... : ""`). Dates stay visible in the boxes with no hint that the value is empty. It matches the library's native `datetime-local` box (empty until complete), so this is a rule to decide, not broken code.
  - Checked: 3.A date only gave `value: ""`. 4.A with both dates and no times gave `from: "" | to: ""`. 3.G day only gave `value: "2026-11-10T00:00"`.
- Minor, not second-checked. 1.A, 2.A, 3.A, 4.A. Chromium: a fifth digit typed in the year shifts the stored year (2026 becomes 0267); in 3.G the extra digit spills into the hour.
- Minor, not second-checked. All ten. Every popover is `role=dialog` with no accessible name (axe `aria-dialog-name`).
- Minor, not second-checked. Calendar cards. Opening a calendar puts focus on the previous-month button; the day grid is 3 to 4 Tabs away.
- Minor, not second-checked. Calendar cards. Day buttons show `1` and are named `Sunday, November 1st, 2026`; axe flags 2.5.3 Label in Name. Stock react-day-picker labels.
- Minor, not second-checked. 2.A, 4.A, 4.G, 6.A. Two buttons named `Clear` in one card, no From or To in the name (`page.tsx:533`).
- Minor, not second-checked. Time picker cards. The minute column scroll viewport is an unnamed Tab stop (`page.tsx:680`).
- Minor, not second-checked. 2.B (also 1.A and 3.G at 360x250). 2.B popover has no height limit and runs past the viewport at 200 percent zoom (`page.tsx:1322`).
- Minor, not second-checked. 3.G. A time picked with no date leaves the box and value empty but shows the clear X.

## Fit for the library

Overview (auditor, not second-checked beyond the findings below):
- Library today: one native input per value, string stored from `event.target.value`; typed values apply on Enter or blur, a keyless change applies at once.
- Range: two independent `ST_FilterTextField`, each writing its own slot; one end alone is valid.
- Stored strings of 1.A, 2.A, 3.A, 4.A, 5.A, 6.A and 2.B are byte-equal to the library's. 3.G, 4.G, 4.H add default times and cut seconds.
- `stories/fixed-bugs/mobile-date-pickers.stories.tsx:96-98` expects 3 inputs each of `date`, `datetime-local`, `time`. It holds for the six defaults; it fails with 3.A or 4.A (no `datetime-local`) and with 2.B or 4.H (no input).
- `test/docs-e2e/lib/helpers.mjs:785` fills `input[type="date"]`; it survives 1.A and fails on a button card.

Findings:
- **Blocker (B2). 2.A, 4.G. A calendar click wipes a To-only range.** `page.tsx:116-120` (`rangeOf` returns `{from: undefined, to}`), `:961-972` (2.A `onSelect`), 4.G card `:2531-2536`. A To-only range is valid in the library today (`filterFns.ts:268,273`). Lost stored value.
  - Proof: `2.A To only  from: "" | to: "2026-11-20"` then `click day 5  from: "" | to: ""`.
  - Checked: 2.A filled To `2026-11-20`, opened the To calendar, clicked day 5: `from: "" | to: ""`. 4.G filled To `2026-11-20T08:00`, clicked day 5: `from: "" | to: ""`; a second click on day 8 gave `from: "2026-11-08T00:00" | to: "2026-11-08T08:00"`.
- **Major (M7). 3.A, 4.A, 5.A, 6.A, 3.G, 4.G, 4.H. The time picker rewrites a time that has seconds; 3.G and 4.G cut seconds.** `page.tsx:149` (regex reads `HH:mm` only), `:761-768` (defaults 12, 0, AM), `:2419`, `:2639` (`slice(0, 5)`). The library compares seconds (`filterFns.ts:77-106`).
  - Checked: 5.A filled `14:30:45`, footer `"14:30:45"`; picker shows no pressed button; minute 15 clicked: `value: "00:15"`. 3.G filled `2026-11-12T14:30:45`: `value: "2026-11-12T14:30"`, box the same. `filterFns.ts:79-84` read: seconds are compared when present.
- **Major (M3). 2.B, 4.H. No input: typing, the Enter or blur commit, focus on open and the E2E fill have nothing to act on.** `page.tsx:1298-1332` (2.B), 4.H trigger and cell. Library side: `ST_FilterTextField.tsx:493-497`, `ST_HeaderFilterEditor.tsx:40-48`, `ST_TableHeadCellFilterLabel.tsx:125-132`, `helpers.mjs:785`.
  - Checked: 2.B card has 0 inputs; 4.H has 0 inputs with the popover closed; digits typed on the 2.B trigger changed nothing and opened nothing; the popover stayed open after each pick. The library focus and helper lines were not re-read.
- **Major (M4). 3.G, 4.G, 4.H, 5.A. Parts the user never entered are stored.** `page.tsx:2324`, `:2592-2595`, `:761-768`. A day alone stores `T00:00` (start) or `T23:59` (end); one hour stores `HH:00`. On a `datetime` column in `equals` mode a day plus `T00:00` matches only rows at 00:00. A decision, not a code bug.
  - Checked: 3.G day 10 gave `value: "2026-11-10T00:00"`; 4.H day 10 gave `T00:00` and `T23:59`. The 5.A single-hour pick and the `equals` row match were not rerun.
- **Major (M9). 2.A, 4.A, 4.G, 6.A, 2.B, 4.H. Range cards need one owner for both ends; the library has two independent fields.** `page.tsx:955-1000`, `:1077-1082`, `:1198-1215`; library `ST_FilterRangeFields.tsx:51-57`. Shared calendar, swap of reversed ends on blur, one pick writing both ends. The swap rewrites what the user typed in each box.
  - Checked: `ST_FilterRangeFields.tsx:51-57` renders two `ST_FilterTextField` by index (read). 6.A filled From `17:00`, To `09:00`: footer already `from: "09:00" | to: "17:00"`; after blur the boxes read `09:00,17:00`. 2.A and 4.G swap not rerun.
- Minor, not second-checked. Native-box cards. The demo stores on each change; the library holds a typed date until Enter or blur. The clear X is new for date boxes (the library hides it for `isDateFilter`). The cards open a popover inside the chip editor's popover, three levels in 3.G, 4.G, 4.H; behavior inside the real editor not run.

## Dropped

- 0 dropped. Every blocker and major was reproduced.
- Merged, not dropped: the accessible name finding was reported by two auditors (one kept, M1); "first click stores a one-day range" and "2.B cannot hold a one-ended range" are one behavior (one kept, M2).
- Severity changes: none. B1 is a blocker for 2.B and 4.H only; for the cards with a typeable box it is a major.

## Not verified

- iOS Safari and Android Chrome: no device run. The iOS Reset behavior the `value` attribute removal targets.
- A real screen reader (VoiceOver, NVDA). All screen reader statements come from the accessibility tree.
- WebKit: not run by the checker. Typing in WebKit native boxes (the auditor's script keystrokes left the box empty).
- Firefox: the checker ran the double icon only. Whether the Firefox icon opens Firefox's own picker.
- 24 hour locale rendering of the native time box beside the 12 hour picker.
- The cards inside the real chip editor (nested popover, `closeOnEscape`, `initialFocus`): the demo page has no table.
- Radix and React Aria bases: no run. What the React Aria base would use for a calendar.
- Whether a stock shadcn way exists for each custom part (time picker, clear X, value attribute observer, popover outside the addon, shared range calendar). Line by line comparison with the shadcn docs examples.
- `@date-fns/tz` version and license. Gzip sizes (auditor's numbers, not rerun).
- 2.B showing a To-only value from outside as `Pick a date` with the clear X: code read only.
- 2.A and 4.G swap on a plain Tab-out. Clicking the 2.B field label. Month and year select by keyboard in 2.B.
- Horizontal page scroll at 360 px: seen by the auditor, source not attributed.
- Contrast by hand for nodes axe left incomplete.
- Auditor note: the working-tree `defaults.json` lists 6.B, not 6.A, as the time-range default; 6.A was audited as told.
- The fifteen minors: not second-checked.
