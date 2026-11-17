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

## Carried from the refactor review, not yet raised by the owner

- `hooks/use-date-box.tsx`: a `.tsx` hook file that also holds the native input component; the least tidy file.
- `calendar-caption.tsx` and `utils/style.utils.ts`: the two direct `react-day-picker` imports (`useDayPicker`, `getDefaultClassNames`).
- The bugs of `audit-4.md` are still in the code; its file and line references no longer match.
