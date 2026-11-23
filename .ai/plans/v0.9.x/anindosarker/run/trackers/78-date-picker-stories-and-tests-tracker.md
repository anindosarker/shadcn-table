# 78: Date picker repository, Date picker stories and tests, tracker

Status: done
Branch `date-picker-stories-and-tests`, worktree /Users/anindosarker/Work/Personal/React-table/shadcn-date-picker.worktrees/date-picker-stories-and-tests
Merge: 4ef057a8a4e9e5e9835ed50292a077c129bf7b0d on main (branch and worktree removed)
- Deploy: Vercel status of 4ef057a: success, deployment dpl_2FoDit6jk6w3XaarpFnNsnEKE4sq (https://vercel.com/anindo-sarkers-projects/shadcn-date-picker/2FoDit6jk6w3XaarpFnNsnEKE4sq), target preview, not production
- Live: https://date-picker.shadcn-table.com/version.txt 404 NOT_FOUND; https://date-picker.shadcn-table.com/base/ 404 NOT_FOUND; the domain still serves production dpl_F3JtxETRT8GogN4K719MFoH2JE6x (58 min before the merge, 2 s build)
- Cause: the Vercel project production branch is `master`; the repository branch is `main`, so main builds land as previews (see Attention)
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
- Check: `pnpm storybook:build` at cd48b75: pass (`storybook-static/index.html`, `storybook-static/base/index.html`, `storybook-static/version.txt` = `0.1.0`)
- Check: `storybook-static/radix` and `storybook-static/aria` at cd48b75: pass (do not exist)
- Check: landing page links at cd48b75: pass (`./base/` and the GitHub repository only)
- Check: `act push -W .github/workflows/ci.yml -P ubuntu-latest=catthehacker/ubuntu:act-latest --env npm_config_store_dir=/tmp/pnpm-store` at cd48b75 (run on the working tree before the push): pass (job succeeded: install, lint, typecheck, registry:check, Playwright Chromium, test 32 passed)
- Check: what `act` could not reproduce at cd48b75: the run is a linux/arm64 container on this Mac, not GitHub's x64 runner; `actions/checkout` copies the local tree instead of fetching; without `npm_config_store_dir` pnpm put its store in the workspace under act and `prettier --check .` failed on `.pnpm-store/` (a first run, act only; GitHub keeps the store outside the checkout)
- Check: `grep -c deploymentEnabled vercel.json` at cd48b75: pass (0)
- Check: right-to-left look, 24 lines below, Storybook dev of the branch on port 5341 with DP_BASE=base, plays left out of the served story modules so each story shows its first render, `dir="rtl"` set on the preview document by the script at cd48b75: pass (16 clean, 8 card pending, one finding)
- Check: `git diff --stat origin/main -- stories .storybook .github` names no file with `rtl` at cd48b75: pass
- Check: Storybook server on port 5341 stopped at cd48b75: pass (nothing listens on 5341)
- Check: Local CI `pnpm lint`, `pnpm typecheck`, `pnpm registry:check`, `pnpm test`, `pnpm storybook:build`, one at a time, at cd48b75: pass (test: 7 files, 32 plays)
- Check (verifier): `git diff --name-only origin/main...HEAD` at cd48b75: pass (18 files, all owned); `git diff --stat origin/main -- registry package.json pnpm-lock.yaml`: pass (prints nothing)
- Check (verifier): `diff -r test-projects/next-app/components/date-picker registry/base/components/date-picker` at cd48b75: pass (prints nothing)
- Check (verifier): stories at cd48b75: pass (seven files, twelve type stories, controlled, value and calls as text; the grep prints nothing; no class name or library attribute asserted; no fixed wait, `asyncUtilTimeout` 5000 on conditions only)
- Check (verifier): `pnpm test` at cd48b75: pass (7 files, 32 passed)
- Check (verifier): case table at cd48b75: fail (111 lines, every covered line names a play that runs the case; seven "not covered" lines give no reason a play cannot cover the case on Chromium: D8, R9, R13, R16, P13, PR8, P17)
- Check (verifier): vercel.json, ci.yml, site output at cd48b75: pass (install, build, output as 1.6.6, no deploymentEnabled; one job, push to main and pull_request; `storybook-static/base/index.html`, `version.txt` 0.1.0, no radix or aria, landing links `./base/` only)
- Check (verifier): right to left at cd48b75: pass (24 lines; 8 screenshots committed for the 8 non-clean lines, none for clean; no rtl file in stories, .storybook, .github; nothing listens on 5340 to 5360)
- Check: `pnpm test` at 1f87b05: pass (7 files, 39 plays)
- Check: new real-key steps run, R13 and R16 each with one expectation changed on purpose, `vitest run` of Date and DateTime at 1f87b05: fail as meant (2 failed), files restored
- Check: `pnpm lint`, `pnpm exec tsc -p tsconfig.stories.json`, `pnpm storybook:build` at 1f87b05: pass
- Check: `git diff --stat origin/main -- registry package.json pnpm-lock.yaml` at 1f87b05: pass (prints nothing)
- Check: case table at 1f87b05: pass (D8, R9, R13, R16, P13, PR8, P17 now name a play)
- Check (verifier): `git diff --name-only origin/main...HEAD` at 1f87b05: pass (18 files, all owned); `git diff --stat origin/main -- registry package.json pnpm-lock.yaml`: pass (prints nothing)
- Check (verifier): `diff -r test-projects/next-app/components/date-picker registry/base/components/date-picker` at 1f87b05: pass (prints nothing)
- Check (verifier): stories at 1f87b05: pass (seven files, twelve type stories, controlled, value and calls as text; the grep prints nothing; plays assert roles, text, values and ARIA states only; no fixed wait)
- Check (verifier): case table at 1f87b05: pass (111 ids, 111 lines; D8, R9 (R8 defaults brought to 09:10 and 17:00), R13 (F5), R16, P13, PR8, P17 plays exercise their rows; the not covered reasons hold)
- Check (verifier): `pnpm lint`, `pnpm typecheck`, `pnpm exec tsc -p tsconfig.stories.json`, `pnpm registry:check` at 1f87b05: pass
- Check (verifier): `pnpm test` at 1f87b05: pass (7 files, 39 passed)
- Check (verifier): `pnpm storybook:build` at 1f87b05: pass (`index.html`, `base/index.html`, `version.txt` 0.1.0; no radix or aria; landing links `./base/` and the GitHub repository only)
- Check (verifier): vercel.json, ci.yml at 1f87b05: pass (as 1.6.6, no deploymentEnabled; one job, push to main and pull_request; ci.yml unchanged since the act run at cd48b75)
- Check (verifier): right to left at 1f87b05: pass (24 lines; 8 screenshots committed for the 8 non-clean lines, none for clean; no rtl file in stories, .storybook, .github; nothing listens on 5340 to 5360)

- Task 1 Vite, Vitest and Storybook on `DP_BASE`, seven story files: done (69a66a2)
- Task 2 plays and the case table: done (69a66a2, 59de146)
- Task 3 site build, Introduction.mdx, vercel.json, CI workflow: done (cd48b75)
- Fix: plays for D8, R9, R13 (F5), R16, P13, PR8, P17: done (1f87b05)
- Task 4 right-to-left look: done (e931cf5c in the table repository; no change in the date picker repository)

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
- D8: Options MaxBeforeList "D8" (1800 to 1850), Options MinAfterList "D8" (2250 to 2300)
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
- R9: Options DateTimeRangeLimits "R9" (min's day 09:10, max's day 17:00)
- R10: Types/Date Range "R10"
- R11: Types/Date Range "R7, R11"
- R12: Types/Date Range "R12, R14" (Vitest only)
- R13: Types/Date Range "R13, F5" (Vitest only; 9.3.4 F5 applies: the value at every digit 0001, 0014, 0144, 1443, year list from 1400 with focus still in the box, the first click on a day picks, one call)
- R14: Types/Date Range "R12, R14" (Vitest only)
- R15: Types/Date Range "R15" (Vitest only), Options PhoneLayout "R15" (Tab box to box, no swap)
- R16: Types/DateTime Range "R16" (Vitest only; typed reversed pair ordered once as To's clock opens, the hour then replaces the time of the end To's box holds)
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
- P13: Options YearOutsideList "P13" (min 2000, 2105 in the 2100 decade enabled and picked)
- P14: Types/Month Single "P14"
- P15: not covered: 9.1 M5, 9.2 W5 and 9.3.2 N3 replace it; nothing is drawn
- P16: Options TriggerName "P16" (range trigger); one value: Options InputAttributes (B10, M13, W13)
- P17: Options Presets "D9" (date), Options WeekPresets, MonthPresets, YearPresets "P17"
- P18: not covered by a play: text direction is the right-to-left look below (D167)
- PR1: Types/Week Range, Types/Month Range, Types/Year Range "PR1"
- PR2: Types/Week Range "WR1", Types/Month Range "MR1, PR9" (9.1 MR1 and 9.2 WR1 replace PR2)
- PR3: Types/Year Range "PR3, PR9"
- PR4: Types/Week Range "PR4, PR7", Types/Month Range "PR4, PR7", Types/Year Range "PR4, PR5"
- PR5: Types/Week Range "PR5", Types/Month Range "PR5", Types/Year Range "PR4, PR5"
- PR6: Types/Week Range "PR6"
- PR7: Types/Week Range "PR4, PR7", Types/Month Range "PR4, PR7"
- PR8: Types/Week Range "PR8" (From cleared, closed, reopened: To's calendar on October, From's on September)
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

## Right to left

Base UI picker, popup open, `dir="rtl"` on the preview document. Screenshots of clean lines stay in /private/tmp/claude-501/dp-rtl/.

- Types/Date Single, 1280: clean
- Types/Date Single, 390: clean
- Types/Date Range, 1280: clean
- Types/Date Range, 390: clean
- Types/DateTime Single, 1280: clean
- Types/DateTime Single, 390: clean
- Types/DateTime Range, 1280: clean
- Types/DateTime Range, 390: clean
- Types/Time Single, 1280: clean
- Types/Time Single, 390: clean
- Types/Time Range, 1280: clean
- Types/Time Range, 390: clean
- Types/Week Single, 1280: clean
- Types/Week Single, 390: clean
- Types/Week Range, 1280: clean
- Types/Week Range, 390: clean
- Types/Month Single, 1280: card pending: period grid arrows
- Types/Month Single, 390: card pending: period grid arrows
- Types/Month Range, 1280: card pending: period grid arrows
- Types/Month Range, 390: card pending: period grid arrows
- Types/Year Single, 1280: card pending: period grid arrows
- Types/Year Single, 390: card pending: period grid arrows
- Types/Year Range, 1280: card pending: period grid arrows
- Types/Year Range, 390: card pending: period grid arrows

## Attention

- The spec's check `pnpm test --base base` fails at 59de146 with `node: bad option: --base`: the `test` script in package.json (milestone 1, not owned here) runs `node -e`, which takes `--base` as its own option. `pnpm test -- --base base` and `pnpm test` work. Fix: put `--` before the forwarded arguments in the script, or read the base from `DP_BASE`.
- `pnpm typecheck` does not run `tsconfig.stories.json` (package.json, milestone 1), so the stories are type-checked only by hand. Fix: add `tsc -p tsconfig.stories.json` to the `typecheck` script.
- Spec 1.6.5 lists `required` for the Options file, but the approved `DatePickerProps` (types.ts) has no `required` prop; it reaches the box only untyped through `...props`. The Options file has no Required story. The code stays.
- Right to left (D167), card pending "period grid arrows": the previous and next arrows of the month and year grids point the wrong way in right-to-left (the chevrons of `GridHeader` in `period-views.tsx` have no `rtl:rotate-180`, those of `MonthCaption` in `day-calendar.tsx` have), in Types/Month Single, Types/Month Range, Types/Year Single and Types/Year Range at 1280 and 390; screenshots .ai/plans/v0.9.x/anindosarker/reference/q149-calendar-library/rtl/month-single-1280.png, month-single-390.png, month-range-1280.png, month-range-390.png, year-single-1280.png, year-single-390.png, year-range-1280.png, year-range-390.png.
- Vercel production branch is `master` (project prj_aQAJqyzoX3sKR0A70BDOYTMigiB8), but the repository has only `main`: the merge build 4ef057a deployed as a preview and date-picker.shadcn-table.com still serves the older production deployment (404 on version.txt and /base/). Fix: set the production branch to `main` in the Vercel project settings, then redeploy 4ef057a to production. A Vercel setting, not changed by the merger.
