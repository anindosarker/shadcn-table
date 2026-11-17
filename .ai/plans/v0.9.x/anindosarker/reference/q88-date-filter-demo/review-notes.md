# Q88 date picker, owner code review notes

Code under review: `test-projects/next-app/components/date-picker/` (branch `playground/header-demo-theming`, from `c27be55`).
One line per finding, in the order raised. Status: open, in progress, fixed (commit).

## 2026-11-18

| # | File | Finding (owner) | Status |
|---|---|---|---|
| 1 | `date-picker.tsx` | `DatePickerProps` is six hand-written union lines. "fix the types. Use better typescript syntax", take the library's `types.ts` as the example. | in progress |
| 2 | `date-picker.tsx` | The `switch (props.mode)` has no `default`. Add one. | in progress |
| 3 | whole folder | Remove unnecessary comments. | in progress |
| 4 | `date-picker.tsx` | `void mode` in every case: what is it and why. It only silences the unused-variable lint after `const { mode, ...rest } = props`. Noise; remove. | in progress |
| 5 | `modes/date.tsx` | `dropDoubleClick()`: why is this needed. It swallows the second click of a double click on a day, because the first click picks the day and closes the calendar, so the second would hit whatever is under it. Done with capture listeners on `window` and a 1 s timer; only the date mode has it; shadcn's own date picker has no such guard. Keep or remove: owner's call. | open |

## Carried from the refactor review, not yet raised by the owner

- `hooks/use-date-box.tsx`: a `.tsx` hook file that also holds the native input component; the least tidy file.
- `calendar-caption.tsx` and `utils/style.utils.ts`: the two direct `react-day-picker` imports (`useDayPicker`, `getDefaultClassNames`).
- The bugs of `audit-4.md` are still in the code; its file and line references no longer match.
