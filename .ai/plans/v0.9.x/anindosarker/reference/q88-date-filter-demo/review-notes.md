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
