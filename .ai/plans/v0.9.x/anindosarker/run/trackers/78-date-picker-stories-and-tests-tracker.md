# 78: Date picker repository, Date picker stories and tests, tracker

Status: running
Branch `date-picker-stories-and-tests`, worktree /Users/anindosarker/Work/Personal/React-table/shadcn-date-picker.worktrees/date-picker-stories-and-tests
Checks:
- Check: `pnpm typecheck` at 69a66a2: pass
- Check: `pnpm exec tsc -p tsconfig.stories.json` at 69a66a2: pass (the `typecheck` script does not run this config; see Attention)
- Check: `DP_BASE=base pnpm storybook:build` at 69a66a2: pass (writes `storybook-static/base/index.html`)
- Check: `git diff --stat origin/main -- registry package.json pnpm-lock.yaml` at 69a66a2: pass (prints nothing)
- Check: `pnpm test --base base` at 59de146: fail (`node: bad option: --base`, the `test` script of package.json; see Attention)
- Check: `pnpm test -- --base base` at 59de146: pass (7 files, 32 plays passed)
- Check: case table below, one line per case id of `date-picker-9-cases.md` at 59de146: pass
- Check: `grep -rn -E 'data-(open|popup|starting|ending|side)|base-ui' stories` at 59de146: pass (prints nothing)
- Check: `diff -r test-projects/next-app/components/date-picker registry/base/components/date-picker` at 59de146: pass (prints nothing)

- Task 1 Vite, Vitest and Storybook on `DP_BASE`, seven story files: done (69a66a2)
- Task 2 plays and the case table: done (69a66a2, 59de146)

## Notes

- This machine's region sets the short date to `d/M/yy`, so Chromium's date box takes the day before the month here; the plays find the order with a hidden probe box (stories/support/play.ts `isDayFirst`).

## Cases

Plays run in Vitest browser mode, Chromium. "Vitest only": the step types real keys into a browser date box and is skipped in the Storybook UI. The approved code is 9.3.6, so 2.11 to 2.16 (M, MR, W, WR, N, F) apply where they replace a row.

- G1: Types/Date Single "D5, G1"; Types/Week Single "W10, G1"; Types/Month Single "M10, G1"
- G2: Options Disabled, Options DisabledRange
- G3: Options IgnoredLimits
- G4: Options IgnoredLimits
- G5: Options Labels
- B1: Types/Date Single "B1", Types/Time Single "B1", Types/Week Single "W2", Types/Month Single "M2" (Vitest only)
- B2: Types/Date Single "B2, N1" (Vitest only; 9.3.2 N1: no mark, the X shows, value "")
- B3: Options Limits "B3, N3" (Vitest only; 9.3.2 N3: value kept, nothing drawn)
- B4: Options StepTyped "B4, N4" (Vitest only; value kept)
- B5: not covered: Chromium stops the year at four digits (F1); only WebKit takes a fifth digit and no WebKit run is in scope (1.6.5)
- B6: Types/Date Single "B6" (value and half-typed text), Types/Time Range "B6", Types/Week Single "W8", Types/Month Single "M8"
- B7: Types/Date Single "D4, B7" (the box shows a clicked day); the "flagged at once" half is gone in 9.3.2 (N3)
- B8: not covered: 9.3.2 N12, the picker draws no mark to re-read
- B9: not covered: the iOS overlay shows only on iOS, the owner's own test (D167)
- B10: Options InputAttributes; default nouns in Types/* D1, DT1, T1, W1, M1, P7
- B11: not covered: 9.3.2 N13 makes the box frame the root, a structure a play cannot see by role, label or text
- D1: Types/Date Single "D1"
- D2: Types/Date Single "D2, D3, D7"
- D3: Types/Date Single "D2, D3, D7" (the value's month); Types/Date Range "R6" opens on today's month when empty
- D4: Types/Date Single "D4, B7"
- D5: Types/Date Single "D5, G1"
- D6: Options Limits "D6"
- D7: Types/Date Single (1900 to 2100), Options Limits "D7" (a side with a limit ends at it), Types/Year Single "P10" (1443 opens its decade)
- D8: not covered: no story sets only a `max` before 1900 or only a `min` after 2100
- D9: Options Presets "D9"
- D10: Types/Date Single "D10"
- D11: Options Limits "D11"
- DT1: Types/DateTime Single "DT1"
- DT2: Types/DateTime Single "DT2, DT9"
- DT3: Types/DateTime Single "DT6, DT3"; Options DateTimeStep "DT3, DT11"
- DT4: Types/DateTime Single "DT4"
- DT5: Options DateTimeLimits "DT5"
- DT6: Types/DateTime Single "DT6, DT3"
- DT7: Types/DateTime Single "DT7" (Vitest only)
- DT8: Types/DateTime Single "DT8" (Vitest only; 9.3.2 N7: nothing drawn)
- DT9: Types/DateTime Single "DT2, DT9"
- DT10: Options DateTimeLimits "DT10"
- DT11: Options DateTimeStep "DT3, DT11"
- C1: Types/Time Single "C1, C2, C3"
- C2: Types/Time Single "C1, C2, C3", Types/DateTime Single "U3, C2"
- C3: Types/Time Single (no step, 60 minutes), Options Step (900), Options StepSeconds (90)
- C4: Options DateTimeStep "DT3, DT11" (minutes 10, 25, 40, 55 from `min`'s time)
- C5: Options TimeLimits "C5, C6"
- C6: Options TimeLimits "C5, C6"
- C7: Types/Time Single "C7" (a unit replaced; from empty), Options TimeLimits "C7" (brought inside the limits)
- C8: Types/Time Single "C8"
- C9: not covered: the width of a long AM/PM is a look, with no role, label or text change
- T1: Types/Time Single "T1"
- T2: Types/Time Range "T2"
- T3: Types/Time Range "T3"
- T4: Options TimeRangeAttributes "T4" (group name and ids; `aria-invalid` and `aria-describedby` on both boxes not asserted)
- T5: Options OpenState "U8, T5"
- R1: Types/Date Range "R1", Types/DateTime Range "R1"
- R2: Types/Date Range "R2", Types/DateTime Range "R2, R20"
- R3: Types/Date Range "R3", Types/DateTime Range "R3"
- R4: not covered: the stacked columns of a popover under 768 differ only in layout
- R5: Options PhoneLayout "U5, U6, R5"
- R6: Types/Date Range "R6, R7"
- R7: Types/Date Range "R7, R11" and "R6, R7"
- R8: Types/DateTime Range "R8"
- R9: not covered: no date-time range story sets limits; the rule is the one of DT5 (Options DateTimeLimits)
- R10: Types/Date Range "R10"
- R11: Types/Date Range "R7, R11"
- R12: Types/Date Range "R12, R14" (Vitest only)
- R13: not covered: 9.3.4 F5 replaced it (the list follows every digit); no play types a far year into a range end
- R14: Types/Date Range "R12, R14" (Vitest only)
- R15: Types/Date Range "R15" (Vitest only), Options PhoneLayout "R15" (Tab box to box, no swap)
- R16: not covered: the swap as a date-time range end's clock opens needs a typed reversed date-time pair; not written
- R17: Types/Date Range "R17"
- R18: Options RangePresets "R18"
- R19: not covered: 9.3.2 N3 and N11, the picker marks nothing
- R20: Types/DateTime Range "R20" and "R2, R20"
- P1: Types/Week Single "W1" (9.2 W1 replaces P1 for one week)
- P2: Types/Week Single "P2"
- P3: Types/Week Single "P3"
- P4: Types/Month Single "M1" (9.1 M1 replaces P4)
- P5: Types/Month Single "P5, M9" and "P5 the year select"
- P6: Types/Month Single "P6"
- P7: Types/Year Single "P7"
- P8: Types/Year Single "P8" and "P8, N2"
- P9: not covered: 9.3.2 N6 removes the message; the kept value is the typed path of P8
- P10: Types/Year Single "P10"
- P11: Types/Year Single "P11"
- P12: Options MonthLimits "P12"
- P13: not covered: no story has a year outside the year list but inside the limits
- P14: Types/Month Single "P14"
- P15: not covered: 9.1 M5, 9.2 W5 and 9.3.2 N3 replace it; nothing is drawn
- P16: Options TriggerName "P16" (range trigger); one value: Options InputAttributes (B10, M13, W13)
- P17: not covered for week, month and year: the same preset row as D9 (Options Presets)
- P18: not covered by a play: text direction is the right-to-left look below (D167)
- PR1: Types/Week Range, Types/Month Range, Types/Year Range "PR1"
- PR2: Types/Week Range "WR1", Types/Month Range "MR1, PR9" (9.1 MR1 and 9.2 WR1 replace PR2)
- PR3: Types/Year Range "PR3, PR9"
- PR4: Types/Week Range "PR4, PR7", Types/Month Range "PR4, PR7", Types/Year Range "PR4, PR5"
- PR5: Types/Week Range "PR5", Types/Month Range "PR5", Types/Year Range "PR4, PR5"
- PR6: Types/Week Range "PR6"
- PR7: Types/Week Range "PR4, PR7", Types/Month Range "PR4, PR7"
- PR8: not covered: no story opens a period range with only To set
- PR9: Types/Month Range "MR1, PR9" and "PR9", Types/Year Range "PR3, PR9"
- PR10: Types/Year Range "PR10"
- PR11: Types/Year Range "PR11"
- PR12: not covered: 9.3.2 N11, the trigger is not red
- U1: not covered: placement is pixels; seen in the right-to-left look below
- U2: Types/Date Single "D10" (Escape) and "U2" (press outside), Options Presets "U2" (Tab past the last control)
- U3: Types/DateTime Single "U3, C2"
- U4: Options Dialog "U4, U9" and "U4 Done closes"
- U5: Options PhoneLayout "U5, U6, R5" (Vitest only, 390 wide)
- U6: Options PhoneLayout "U6" and "U5, U6, R5" (Vitest only)
- U7: Options PhoneLayout "U7" (Vitest only)
- U8: Options OpenState "U8, T5"
- U9: Options Dialog "U4, U9" (one Close button)

## Attention

- The spec's check `pnpm test --base base` fails at 59de146 with `node: bad option: --base`: the `test` script in package.json (milestone 1, not owned here) runs `node -e`, which takes `--base` as its own option. `pnpm test -- --base base` and `pnpm test` work. Fix: put `--` before the forwarded arguments in the script, or read the base from `DP_BASE`.
- `pnpm typecheck` does not run `tsconfig.stories.json` (package.json, milestone 1), so the stories are type-checked only by hand. Fix: add `tsc -p tsconfig.stories.json` to the `typecheck` script.
- Spec 1.6.5 lists `required` for the Options file, but the approved `DatePickerProps` (types.ts) has no `required` prop; it reaches the box only untyped through `...props`. The Options file has no Required story. The code stays.
