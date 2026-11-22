# Q88 date picker, owner code review notes

Code under review: `test-projects/next-app/components/date-picker/` (branch `playground/header-demo-theming`, from `c27be55`).
One line per finding, in the order raised. Status: open, in progress, fixed (commit).
Nothing is implemented until the owner says go; a first builder pass on findings 1 to 4 was started without one and reverted uncommitted (it had also added a `types.ts` the owner did not ask for).

## 2026-11-18

| # | File | Finding (owner) | Status |
|---|---|---|---|
| 1 | `date-picker.tsx` | `DatePickerProps` is six hand-written union lines. "fix the types. Use better typescript syntax", take the library's `types.ts` as the example. | open |
| 2 | `date-picker.tsx` | The `switch (props.mode)` has no `default`. Add one. | open |
| 3 | whole folder | Remove unnecessary comments. | open |
| 4 | `date-picker.tsx` | `void mode` in every case: what is it and why. It only silences the unused-variable lint after `const { mode, ...rest } = props`. Noise; remove. | open |
| 5 | `modes/date.tsx` | `dropDoubleClick()`: why is this needed. It swallows the second click of a double click on a day, because the first click picks the day and closes the calendar, so the second would hit whatever is under it. Done with capture listeners on `window` and a 1 s timer; only the date mode has it; shadcn's own date picker has no such guard. Keep or remove: owner's call. | open |
| 6 | `components/single-calendar.tsx`, `range-calendar.tsx`, `time-picker.tsx` | "Why did we create a new popover wrapper?" Three components wrap the stock popover: `SingleCalendarPopover`, `RangeCalendarPopover`, `TimePickerPopover` (trigger button, `PopoverContent`, fixed align and offsets). The agreed rule was no popover wrapper; modes should compose stock `Popover` directly. They came from the old code's popover files and were kept as second exports. | open |
| 7 | all `modes/*`, `hooks/use-date-box.tsx`, `hooks/use-range-value.ts`, `components/date-box.tsx` | "Why do we have so many states on all the files? ... a lot of them has the repair state as well." 17 `useState`, 5 refs and a `repair` counter threaded through all six modes, the box and both hooks (22 mentions). `repair` is a counter bumped on every pick to force the box's sync effect to run again: the typed box is an uncontrolled native input and is only rewritten when `value` changes, so picking the day that is already stored would leave half-typed text in the box. Root cause of most of the state: the uncontrolled native box. | open |
| 8 | `hooks/use-date-box.tsx` | "seems like unnecessary hook". 230 lines: a hook that returns rendered JSX (`input`, `hint`) plus `leave`, `clear`, `showClear`, and also holds the `NativeInput` component and two helpers. Two callers: `components/date-box.tsx` (a 20-line shell around it) and `modes/datetime-range.tsx` (its own box layout with the clock inside the same addon). It exists as a hook only so those two layouts can share the box logic; a hook returning JSX is a component in disguise. | open |

## Rewrite, 2026-11-18

- Owner asked for a review by fresh Fable agents with no history, then a full rewrite from that review plus findings 1 to 8. Result: 19 files and 2,594 lines became 7 files and 1,558 lines; merged into `playground/header-demo-theming` at `0ca1d4c`. Findings 1 to 8: resolved in the rewrite, confirmed by a fresh check.
- Layout decided by the owner: `date-picker.tsx` entry only, `modes/`, `components/`, `hooks/`, `utils/`; renames `DateField` to `PickerField`, `TimePicker` to `TimeColumns`; one shared hook `use-range-order`. In progress on `rewrite/date-picker`.
- Owner's first look at the rewritten defaults: "this looked good".

| # | Where | Finding (owner) | Status |
|---|---|---|---|
| 9 | datetime-range (card 4.W), phone | "When I select a date time, the entire box gets bigger because there is not enough space. Most probably it's a styling issue and by default we need to make sure there is enough space." | open, lookup running |

Left as built by the rewrite, no ruling yet: half-typed text stays in the box with its X after leaving it; a typed year under 1000 is not stored; four spacing overrides keep the datetime range end box tight.

## Carried from the refactor review, not yet raised by the owner

- `hooks/use-date-box.tsx`: a `.tsx` hook file that also holds the native input component; the least tidy file.
- `calendar-caption.tsx` and `utils/style.utils.ts`: the two direct `react-day-picker` imports (`useDayPicker`, `getDefaultClassNames`).
- The bugs of `audit-4.md` are still in the code; its file and line references no longer match.

## Review of the promoted `.6.2` code, 2026-11-21

Code under review: `test-projects/next-app/components/date-picker/` at `5f529b1` (3,395 lines, 23 files). The sections above are about earlier code that no longer exists. Nothing is implemented until the owner says go.

| # | File | Finding (owner) | Status |
|---|---|---|---|
| 10 | `hooks/use-controllable.ts`, callers `modes/date-mode.tsx:41`, `modes/period-mode.tsx:365` | "What's this hook? Is it necessary?" It lets the two modes that close on pick hold the open state while the app may also control it. Base UI already does both: its Popover and Dialog roots take `open`, `defaultOpen`, `onOpenChange`, and `actionsRef` has `close()` (`@base-ui/react` 1.9.0, `popover/root/PopoverRoot.d.ts:39`, `dialog/root/DialogRoot.d.ts:84`). Plainer: every mode passes the three props straight through, the two modes call `actionsRef.current.close()`; the hook file goes. Port note: `actionsRef` is Base UI only, the radix copy needs its own way. | decided, see review decision 1 |
| 11 | `components/period-grid.tsx:22-45` `moveFocus` | "an obscure implementation again." Hand-written arrow-key movement for the month and year grid: one tab stop, left and right by one cell (flipped under rtl), up and down by a row of three, disabled cells skipped, cells found by `querySelectorAll("button")`. No installed part gives two-way movement in a grid of buttons; Base UI's `ToggleGroup` and `RadioGroup` move along one line only (`toggle-group/ToggleGroup.d.ts:55, 61`). Ways out: a stock one-line group (arrows step through the months in order, no jump by a row), or plain buttons that are each a tab stop with no key code at all. | decided, see review decision 2 |

### Review decisions (owner), to be built together in one new version after the review

Each line is the owner's ruling in the review chat. Not D items; the lead records those on "record it".

1. **Open state lives in the popup props, typed by `presentation`** (findings 10). 2026-11-21.
   - No top-level `open`, `defaultOpen`, `onOpenChange`. They are part of `popoverProps` and `dialogProps`, since they are the popover's and the dialog's own props.
   - TypeScript exposes the props by presentation: `presentation="popover"` (and the default) accepts only `popoverProps`; `presentation="dialog"` accepts only `dialogProps`; the other one is a compile error.
   - `presentation="auto"` accepts both objects, because the popup is a popover or a dialog at runtime; an app that controls open state there writes it in both. This part is the runner's recommendation; the owner agreed to the trick and did not rule on `auto` separately.
   - One object per popup holds root props (`open`, `defaultOpen`, `onOpenChange`) and content props (`side`, `align`, `className`, ...); the picker sends each key to the right part. Owner: that small piece of own code is fine.
   - `hooks/use-controllable.ts` goes: the popup root owns the state, and the modes that close on pick close it through the root (Base UI `actionsRef.close()`).
2. **The hand-written arrow keys in the month and year grid go** (finding 11). 2026-11-21.
   - `moveFocus` in `components/period-grid.tsx` is removed with the single tab stop it serves and the `dir` it reads for this. The cells are plain buttons, each a normal tab stop; Enter or Space picks.
   - Owner: it does not earn its place. Nothing breaks without it; it was added on the runner's brief, not on a request.
   - If arrow keys are wanted later, they come from a stock part, not from own key code.
3. **File order: imports, then type definitions, then constants, then the code.** 2026-11-21.
   - Owner: "you should define the types at the beginning of the component, not inside randomly."
   - Every file starts with its imports, then all its types, then its constants, then components and functions. No type declared between functions or in the middle of a file.
   - Runner's reading, to confirm on the first file: a component's props are a named type in that top block, not an object type written inline in the function signature.
4. **The year type is a typed box, like the date type, built on a number input.** 2026-11-21.
   - Owner: "This should be like the default HTML input for date, but only year variant." HTML has no year input (its date and time types are `date`, `datetime-local`, `month`, `week`, `time`), so the box is `<input type="number">` with `min`, `max` and a `yyyy` placeholder, in the same input group frame the date box uses: the X to clear and a calendar button that opens the year grid.
   - The typed year is the value. The browser gives digits, arrow-key stepping and its own message for a year outside `min`/`max`. A typed year outside 1900 to 2100 is accepted and grows the list by the agreed rule, as in the date boxes; arrows stop at the list's ends.
   - Year range follows the date range: From and To boxes inside the popup, one above each grid.
   - The popup header keeps its plain decade text, arrows and Today.
   - Month and week keep their trigger button and grid; no box there.
   - Not the rejected `.8`: that version put a year box in the month and week headers, removed their dropdowns, and its box only moved the view.

### Built from the review decisions (next-app, not pushed)

- `.6.3` (`ab89e48`, folder `components/date-picker-6-3`, cards on all twelve rows): decisions 1 to 3.
- `.7` (`a9840a8`): decision 4, year type as a typed number box. A second reader with no history found 6 must-fix; `.7.1` (`0e428d5`) fixed them, stores only a complete four-digit year (typing 1443 emits `1443` once; a year under 1000 is typed `0195`) and moved the date, date-time and year boxes onto one shell, `components/picker-box.tsx`. Round 2 found 2 small must-fix; `.7.2` (`230655f`, folder `components/date-picker-7-2`, cards `11.7.2`, `12.7.2`) fixed them: `0000` is not stored, the single-year branch says what it tests.
- `.7.2` is the latest; the default folder `components/date-picker/` still holds `.6.2`. Rows 1 to 10 give the same values on `.7.1` as on `.6.3`.
- From now on a second reader checks every version's diff before the owner sees it.
- Open for the owner on `.7.2`: a short year like `195` shows a red border and no text (probe: a number box with `min` 1000 would give the browser's own range message); ArrowUp in an empty year box goes to 1 (stock number box); in the year range, typing over a year shows today's decade until the fourth digit, as the date range does when a date is typed over; `presentation="auto"` with no `open` passed probably closes when resized across phone width while open (since `.6.3`, not tested); spinner arrows and mouse-wheel stepping of the number box are left as the browser draws them.

5. **The year box is a text box limited to four digits, not a number box.** 2026-11-21 (amends decision 4).
   - Owner, on `.7.2`: "invalid years, the arrows look bad on empty space", with a screenshot of a year box holding some thirty digits beside the browser's spinner arrows; then "fix" on the runner's recommended option.
   - The box becomes `<input type="text">` with `inputMode="numeric"`, `maxLength={4}` and a four-digit `pattern`, all stock attributes, in the same frame as before. Typing stops at four characters; no spinner arrows, no mouse-wheel stepping, no ArrowUp jump to year 1; a short entry like `195` gets the browser's own `pattern` message.
   - Accepted cost: letters can be typed and are flagged, not stored; no arrow-key stepping; the browser does not check `min`/`max` on a text box, so a year outside the limits is flagged by the picker's own check for the year type.
   - Everything else of decision 4 stands: the typed year is the value, only a complete four-digit year is stored, year range has From and To boxes in the popup.
- `.7.3` (`8930267`): decision 5, the year box as a four-digit text box (`maxLength`, `pattern`, `inputMode`); the number-box code removed. The second reader's round 3 found 3 must-fix (an unneeded second effect with `setCustomValidity`, `type === "text"` standing for "year", two dead map entries); `.7.4` (`96b85f4`, folder `components/date-picker-7-4`, cards `11.7.4`, `12.7.4`, 3,524 lines) fixed them. Round 4: ready for the owner, no must-fix.
- `.7.4` is the latest. A complete year outside `min`/`max` is flagged as soon as its fourth digit is typed.
- Open for the owner on `.7.4`: `title={labels.yearFormat}` ("Four digits, for example 2026") shows only as a hover tooltip in Chromium, whose message under the box for `195` stays "Please match the requested format."; options are our hint as the message, tooltip only, or dropped.

### Owner calls on audit 7 (`audit-7.md`, 107 items on `.7.4`; 88 clear-cut ones are built as `.7.5`, 17 are choices)

6. **Keep the From/To swap, one route only** (audit 7 item 3.1). 2026-11-21.
   - A reversed typed range is still put in order. It happens once: when focus leaves both boxes, or when the popup closes. No per-box route, no second commit.
   - This removes the order being fixed one Tab late from the To box (item 6.5) and the double commit, and most of the hook, flag and helpers that exist for the swap.
7. **Stock popover, no focus trap** (audit 7 item 3.2). 2026-11-21.
   - `modal="trap-focus"` goes from the calendar popover and the clock popover, with the hidden Close button that exists only for the trap, its class and the two direct Base UI imports.
   - Tab past the last control closes the popup, as in every stock shadcn popover. The dialog on phones keeps its own stock focus handling.
   - To check when built: the clock popover inside the date-time popup without the trap.
8. **The remaining 15 choice items of audit 7 are settled by the runner, not asked.** 2026-11-21. Owner: "Why are you asking me these questions? This should have been resolved by you automatically." Rule used: where a user loses nothing, take the plain way; where the look or behaviour the owner approved would change, keep it and write its reason in one line. The owner can reopen any line.
   - 1.7 phone dialog: Done only; the hand-made X and `labels.close` go.
   - 1.6 week and month range: the From and To panel titles go, since a click in either panel does the same thing.
   - 6.12 `presentation="auto"`: an open picker closing when the window crosses phone width is accepted and documented.
   - 8.6 a range outside `min`/`max` turns its trigger red for every range kind, one rule.
   - 8.7 the iOS placeholder overlay is given to every time box, one rule (to confirm on an iPhone).
   - 8.11 and 11.3 the month and year grids no longer set their own `dir`; they follow the page.
   - Kept, each with a one-line reason in the code: 1.4 the default-time fix after a swap (else an untouched range reads 23:59 to 00:00); 4.5 the From/To badge in the phone calendar header (own line would cost height, owner-approved dialog); 5.5 the range band's transition override, 5.6 the smaller dropdown text and 5.7 the today cell classes (owner-approved look); 10.1 the phone cell size, 10.3 the popup offsets and 10.5 the iOS placeholder's padding (owner-approved look, no stock route verified).
9. **UX is frozen as on `.7.4`; the cleanup is code only; the owner is told only when it is ready.** 2026-11-21. Owner: "The UX behavior is fine by me. I have already tested it. So you should do an audit and fix everything and let me know only when it's ready and I can check the code."
   - `.7.5` must look and behave like `.7.4`. Visible differences are allowed only from the owner's own calls 6 and 7 (swap with one route, no focus trap) and from real defects (a wrong value, a value outside the limits from a click, a box that cannot be cleared).
   - This reverses four lines of call 8: the phone dialog keeps both the X and Done; the From and To titles above the week and month range panels stay; range triggers are not newly turned red; the iOS placeholder stays where it is.
   - Loop until clean, without reports in between: build, second reader on the diff, fix, then a fresh strict audit of the result; repeat until an audit finds nothing clear-cut. Then one message to the owner.
10. **Plan first, then build; the picker is rebuilt once from a reviewed plan.** 2026-11-21. Owner: "I think you are using an OPUS agent and not creating plans before implementing the demo. That is why the code quality is bad. Maybe you should follow the best practice first, have a clear cut plan, then start implementation." And: "After you have created the plan, roll over and start implementation."
   - The patch run on `.7.5` is stopped. It had applied audit 7 sections 9, 11, 1, 2, 4, 5, 3, 6 and 7 in `components/date-picker-7-5` (18 commits, last `9d2a20c`), section 8 half done and never verified end to end; its unfinished edits are saved as a patch in the session scratchpad. `.7.5` is reference material, not a version to review.
   - Version 9 is a clean rebuild in `components/date-picker-9` from `plan-date-picker-9.md` in this folder: behaviour frozen as on `.7.4` plus calls 6 and 7, structure designed. Planner and reviewers are fable agents; the implementer is too.
   - After the plan is written and reviewed, the runner rolls over and the next session implements it step by step, each step's diff read by a reader with no history, ending with the same-values and pixel comparison against `.7.4` and a strict audit. The owner is told when the code is ready to read.

## Version 9 built, 2026-11-22

- Folder `test-projects/next-app/components/date-picker-9`, head `ba18488` (next-app, not pushed). 22 files, 3,598 lines (7.4: 23 files, 3,524).
- Layout decided by the owner on 2026-11-22: `date-picker.tsx` (entry), `types.ts` (public types and types used by more than one file), `modes/`, `components/`, `utils/`. No hook of our own: nothing shared holds React state. `PickerLabels` stays beside the word list.
- Commits: steps 1 to 5 `ac7600f`, `26720f2`, `1b8833e`, `0df2d8a`, `8b26cf5`, `bc7eddb`, `65e719e`, `4c8d55c`, `0d9919f`; folders and `types.ts` `407b4c9`; review rounds `b8a3991`, `9390332`, `ba18488`.
- Plan: `plan-date-picker-9.md` (template, 305 lines), `date-picker-9-cases.md`, `date-picker-9-design-notes.md`.
- Review: three rounds, each by a reader with no history asking the owner's questions of every piece (440, 520 and 410 pieces). 29 findings, 25 fixed, the rest below.
- Comparison with 7.4 at `ba18488`, all twelve rows, Chromium and WebKit, 1280 by 800 and 390 by 844: 563 scripted steps and 706 pixel crops per browser and size. No difference outside the allowed table. Type cases: 14 of 14 must-fail lines fail, 14 must-compile pickers compile.
- Allowed differences seen: 2, 3, 4, 5, 6, 7, 8, 9, 11, 13 of the table in `date-picker-9-cases.md`, and the marked "7.4 wrong" cases. Pixels differ only in: the Time field's X in the date-time popup (row 3), the box message in the phone dialog under limits (rows 2 and 4), month-arrow edge shading after a first pick (row 8, Chromium only, same markup and styles).
- Left as on 7.4, raised by a reader, not changed (same behaviour as 7.4, outside the cases):
  - A swapped date-time range under `min` or `max` can get a default time outside that day's limit.
  - A date-time `step` that does not divide a day (25 min, 5 h) lands picks on times the box flags.
  - A year under 100 makes the year grid's first decade show 0001 twice.
  - The X of a week or month trigger is named "Clear Select week" / "Clear Select month".
  - With the Time field half typed, a press on the clock's highlighted time does nothing.
- Demo only: under the Deutsch labels three words stay English on the version 9 cards, because the demo's label file carries 7.4's key names.
- Not seen: Firefox, real Safari, iPhone, the iOS placeholder overlay in a browser (checked by string equality with 7.4).

## Version 9.3, the full version, 2026-11-22

- Folder `test-projects/next-app/components/date-picker-9-3`, head `3011fd6` (next-app, not pushed). 22 files. Cards "Full version" on all twelve rows.
- Built from: 9 (the rebuild), 9.1 (month typed in `<input type="month">`), 9.2 (week typed in `<input type="week">`), and the Firefox rule of 9.1.3.
- Owner decisions on the way: plain native inputs, nothing added for a browser that lacks a control (a `pattern` and placeholder were built for 9.1 and removed on his word); versions numbered from their base (icon variants of 9.1 are 9.1.1 shown, 9.1.2 invisible, 9.1.3 clipped).
- Firefox's own picker button: no selector reaches it. The colour trick (9.1.2) leaves it clickable. Clipping the input's right edge by the button's own box, `min(16px, 1em) + 0.525em` from Firefox's `datetimebox.css`, with the same negative margin, removes paint, gap and mouse click (proven in Firefox 160.0.1). Left: Space in a date part and Tab then Enter on the hidden button still open Firefox's picker; right-to-left not covered.
- Checks at `3011fd6`: a full read by a reviewer with no history (clean; three small points fixed); Chromium at both sizes, each 9.3 card against the card it came from, values and pixels (clean); real Firefox on all twelve rows, range popups included (clean).
- Demo page: rows are accordion sections, newest card first, one open/close-all button, a sort button, card titles by row and version, the id letters kept only as the saved tick key.
- Not seen: Safari, iPhone, right-to-left. In Firefox and desktop Safari the month and week boxes are plain text fields.

## Version 9.3.1, no size jump and typed week and month checked, 2026-11-23

- Folder `test-projects/next-app/components/date-picker-9-3-1`, head `8b670e7` (next-app, not pushed). 22 files. Cards "Full version, no size jump" on all twelve rows. Differs from 9.3 in `modes/day-range-picker.tsx`, `components/picker-field.tsx`, `components/labels.ts`.
- Size jump: the date-time range popup keeps its size through empty, two picks, a clock pick, a typed time, a cleared From and close (Chromium 1280 and 390 wide, Firefox 1280 and 500 wide). Cause: Firefox sizes a datetime-local box by its text. Cost: in Chrome on desktop the popup is 540 px wide, 492 before.
- Validation, on the owner's word after Firefox accepted `2026-W434`: MDN's `pattern` on the month and week inputs plus a real-value and limits check, one code path, no browser detection, no placeholder, no own text box. Firefox, rows 7 to 10: malformed text and a week or month that does not exist give no value and the browser's message; a value outside the limits is kept and flagged.
- Review on 2026-11-23 by a reader with no history, of the 9.3.1 diff and the review fixes of 9.3 (`3011fd6`) and 9.2 (`ca11940`): no major finding; the two older fixes are clean. Five minor points, all in `components/picker-field.tsx`, not built, for the next version if one is made:
  - A week text box accepts year 0000 (`0000-W01`); month and year refuse it.
  - The year box shows its limit message while typing, week and month only after the box is left.
  - `labels.yearMin` and `labels.yearMax` now also serve week and month; the names no longer fit.
  - The comment on `isUnreal` says the opposite of what the function returns.
  - Week and month text boxes have a `pattern` but no `title`, so the browser's message names no format.
- Not checked in a browser: a date-time range with a `step` under 60 seconds shows seconds in the box, which may be clipped at the fixed popup width.
- Not seen: desktop Safari, iPhone, right-to-left, Firefox below 500 px wide. The month case script was not rerun on 9.3.1.

## Version 9.3.2, no own message, 2026-11-23

- Owner decision: the picker is always inside a form wrapper that shows its own error, so the picker shows no message and marks nothing invalid by itself ("remove the picker's own message, build 9.3.2").
- Folder `test-projects/next-app/components/date-picker-9-3-2`, head `43bd90a` (next-app, not pushed). Cards "Full version, no own message" on all twelve rows. Differs from 9.3.1 in `components/picker-field.tsx` (298 to 228 lines), `components/labels.ts` (48 to 45 keys), `modes/period-range-picker.tsx`, `modes/day-range-picker.tsx`.
- Removed: the message under the typed box and its wrapper, the picker's own `aria-invalid`, the own limit and not-a-real-week texts, the read of the browser's message, one effect and its ref, the prop `boxClassName`, three label keys.
- Kept: `aria-invalid`, `aria-describedby`, `disabled`, `required`, `min`, `max`, `step` passed through; the value rules (bad text gives no value, a value outside the limits is kept, a pick replaces bad text, the X clears any text); `pattern` on year, week and month and the `title` on the year box.
- Also in: a typed week refuses year 0000; the `isUnreal` comment corrected.
- Checks: a reader with no history (clean; his own Chromium runs: positions and sizes of every part equal to 9.3.1 on all twelve rows at 1280, 390 and 320 wide, 43 value states equal). Real Firefox at 1280 on all twelve rows (clean). Chromium step scripts at 1280, all twelve rows: values equal. The full Chromium pixel chain and the 390 pass were stopped on the owner's word for speed.
- Open, not built:
  - `draftOf` in `picker-field.tsx` has one caller left (`read`); the two can be one function.
  - Firefox, date-time range, blank band under the calendars: looked up the same day, not a defect and not new. 9.3.1 and 9.3.2 measure the same in Firefox and Chromium at 1280 (popup 540 by 409.88 in empty, one pick, two picks, From cleared). The band is the sixth week row kept blank so the popup keeps its height from month to month (`components/day-calendar.tsx`, `fixedWeeks = "blank"`), as in 7.4. The first run's 375 px for an empty 9.3.1 popup did not reproduce.
  - Not seen: Safari, iPhone (the placeholder overlay now reads the box, not the message), the picker inside a real form library.

## Version 9.3.3, one read helper, 2026-11-23

- Folder `test-projects/next-app/components/date-picker-9-3-3`, head `9f04e6c` (next-app, not pushed). Cards "Full version, one read helper" on all twelve rows. Differs from 9.3.2 in `components/picker-field.tsx` only: `draftOf`, left with one caller, is merged into `read`. Same rules, no behaviour change.
- Checks: `tsc`, `eslint`, `prettier` clean; diff read by the runner; Chromium 1280, rows 1 and 11 against 9.3.2: value and calls lines equal at each step, no console error.
