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
| 11 | `components/period-grid.tsx:22-45` `moveFocus` | "an obscure implementation again." Hand-written arrow-key movement for the month and year grid: one tab stop, left and right by one cell (flipped under rtl), up and down by a row of three, disabled cells skipped, cells found by `querySelectorAll("button")`. No installed part gives two-way movement in a grid of buttons; Base UI's `ToggleGroup` and `RadioGroup` move along one line only (`toggle-group/ToggleGroup.d.ts:55, 61`). Ways out: a stock one-line group (arrows step through the months in order, no jump by a row), or plain buttons that are each a tab stop with no key code at all. | open |

### Review decisions (owner), to be built together in one new version after the review

Each line is the owner's ruling in the review chat. Not D items; the lead records those on "record it".

1. **Open state lives in the popup props, typed by `presentation`** (findings 10). 2026-11-21.
   - No top-level `open`, `defaultOpen`, `onOpenChange`. They are part of `popoverProps` and `dialogProps`, since they are the popover's and the dialog's own props.
   - TypeScript exposes the props by presentation: `presentation="popover"` (and the default) accepts only `popoverProps`; `presentation="dialog"` accepts only `dialogProps`; the other one is a compile error.
   - `presentation="auto"` accepts both objects, because the popup is a popover or a dialog at runtime; an app that controls open state there writes it in both. This part is the runner's recommendation; the owner agreed to the trick and did not rule on `auto` separately.
   - One object per popup holds root props (`open`, `defaultOpen`, `onOpenChange`) and content props (`side`, `align`, `className`, ...); the picker sends each key to the right part. Owner: that small piece of own code is fine.
   - `hooks/use-controllable.ts` goes: the popup root owns the state, and the modes that close on pick close it through the root (Base UI `actionsRef.close()`).
