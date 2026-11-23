# 79: Date picker Radix and React Aria versions, Date picker React Aria version, tracker

Status: running
Branch `date-picker-react-aria-version`, worktree /Users/anindosarker/Work/Personal/React-table/shadcn-date-picker.worktrees/date-picker-react-aria-version
Checks:
- Check: identical files, `cmp registry/base/components/date-picker/<file> registry/aria/components/date-picker/<file>` for each of the 13 files the plan marks identical for React Aria (`date-picker.tsx`, the five `modes/*.tsx`, `components/picker-box.tsx`, `components/picker-presets.tsx`, the five `utils/*.ts`) at 89ee92d: pass (13 of 13 exit 0)
- Check: file list, `diff -rq registry/base/components/date-picker registry/aria/components/date-picker` at 89ee92d: pass (lists only the plan's 9 differing files, as "Only in" base until task 2)
- Check: file count, `find registry/aria/components/date-picker -type f | wc -l` at e244ed0: pass (22)
- Check: differing files, `diff -rq registry/base/components/date-picker registry/aria/components/date-picker` at e244ed0: pass (lists exactly the plan's 9: `types.ts`, `components/day-calendar.tsx`, `components/period-views.tsx`, `components/picker-field.tsx`, `components/picker-popup.tsx`, `components/picker-trigger.tsx`, `components/time-columns.tsx`, `components/time-field.tsx`, `components/view-nav.tsx`)
- Check: no Base UI import, `grep -rn '@base-ui' registry/aria/components/date-picker` at e244ed0: pass (prints nothing)
- Check: `pnpm typecheck` at e244ed0: pass (exit 0)
- Check: `pnpm lint` at e244ed0: pass (exit 0)
- Check: JSDoc count, `grep -rc '/\*\*' registry/aria/components/date-picker | awk -F: '{s+=$2} END {print s}'` at e244ed0: pass (3)
- Check: `pnpm exec prettier --check registry/aria/components/date-picker` at e244ed0: pass
- Check: `pnpm registry:build` then `pnpm registry:check` at 425b257: pass (exit 0; `registry/aria/registry.json` holds one item `date-picker-aria`, "Date Picker (React Aria)", `registry:component`, 22 files under `generated/components/date-picker/`; `dependencies` `cn`, `date-fns`, `lucide-react`, `react-aria-components`, `react-day-picker`; `registryDependencies` the nine of the plan's 4.5, no `calendar`)
- Check: `pnpm lint` and `pnpm typecheck` at 425b257: pass (exit 0 each)
- Check: `git diff --stat origin/main -- stories .storybook tools package.json pnpm-lock.yaml registry/base registry/aria/components/ui` at 425b257 (origin/main ed74d58): pass (prints nothing)
- Check: `pnpm test --base base` at 425b257: pass (exit 0, 39 of 39 plays)
- Check: `pnpm test --base aria` at 425b257: FAIL (exit 1; run 1: 28 of 39 passed, run 2: 29 of 39; the failing plays are listed under Task 3, none is fixed here)
- Check: `git fetch origin && git merge origin/main` (108d72e, the stories fix 78.2) at 2be8d33: pass (no conflict, pushed)
- Check: `pnpm registry:check` at 2be8d33: pass (exit 0; `registry/aria/registry.json` up to date, one item `date-picker-aria`, "Date Picker (React Aria)", 22 files)
- Check: `pnpm test --base aria` at 2be8d33: pass (exit 0, 39 of 39 plays in the first run, no rerun; `Options` Open State passed)
- Check: `git diff --stat origin/main -- stories .storybook tools package.json pnpm-lock.yaml registry/base registry/aria/components/ui` at 2be8d33 (origin/main 108d72e): pass (prints nothing)
- Check: `pnpm test --base base` at 2be8d33: pass (exit 0, 39 of 39 plays)
- Check: `pnpm lint` and `pnpm typecheck` at 2be8d33: pass (exit 0 each)

- Task 1 identical files: done (89ee92d)
- Reader task 1 at 89ee92d: no deviation
- Task 2 differing files: done (e244ed0); `pnpm registry:build` not yet run. Plan line added first for `components/picker-popup.tsx` (table repository ddb8d00c, section 3.6): the unread `Button` import removed, the place of the `ButtonContext` import, prettier formatting
- Reader task 2 at e244ed0f0b433aa96b7b677ede5f177cca619c63: no deviation
- Task 3 item and plays: item, install files and README lines committed (425b257); `registry/aria/registry.ts` already held the item as spec 78 wrote it, unchanged. README per the plan's 5.2: the React Aria install block after the Base UI block, `## Differences between the bases` with the React Aria list before `## License` (the Radix list is not on main yet). Done at 2be8d33 (merge of origin/main 108d72e, no code change of the version): with the stories fix 78.2 every play passes on React Aria. What the plays showed at 425b257, before that fix, the version not changed for any of them:
  - A5 (plan 5.1), 8 plays: `Date` Range, `DateTime` Range, `Week` Range, `Month` Range, `Year` Range, `Options` Date Time Range Limits, Range Presets, Phone Layout. Assertion: `stories/support/play.ts:43`, `screen.findByRole("dialog", { name })` with the picker's `title` ("Date range", "Date and time range", "Week range", "Month range", "Year range"): "Unable to find role=dialog and name". On React Aria a range popover is named by its trigger button. Each fails at its first `openPopup`; what follows in these plays is not yet seen on React Aria
  - A1 (plan 5.1), 1 play: `Options` Presets, step "U2 Tab past the last control closes the popover" (`stories/Options.stories.tsx:566-571`): `expectClosed("Select date")` after `userEvent.tab()` on the last control; the stock popover keeps Tab inside, the dialog stays
  - Not in 5.1, 1 play: `Options` Year Presets, `stories/Options.stories.tsx:672-674`, `expect(screen.getByRole("dialog", { name: "Select year" })).toBeVisible()` outside `waitFor`: "Received element is not visible", the popup has `data-entering`. Failed in both full runs, passes alone. Measured with a scratch setup file that logs each `getComputedStyle` on the popup: the popup is in the page for about two frames at opacity 1 without `data-entering` (`openPopup` passes at once), then the stock part's `data-entering:fade-in-0` animation starts at opacity 0 and the play, 37 ms long, reads that first frame. The two frames are the library's: `react-aria-components` `Popover.mjs:91,103,185` defers `data-entering` by `runAfterKeyboard` (`react-aria` `utils/runAfterKeyboard.mjs`: two animation frames when `supportsKeyboard()`), and `utils/keyboard.mjs:195-210` answers yes on a touch device or after it saw the viewport shrink within 600 ms of a text box focus, which the plays' viewport changes and typed boxes produce. The same un-waited line ends Presets (`:562-564`), Week Presets (`:604-606`), Month Presets (`:637-639`) and Range Presets (`:707-709`). No file of the picker is involved: the classes are the stock `popover.tsx`
  - Flake, 1 play: `Options` Open State (`stories/Options.stories.tsx:428-429`, Escape then `expectClosed("Select time")`) failed in run 1 (the popup stayed with `data-exiting` for the 5 s wait), passed in run 2 and in 3 further runs of the file, and 15 of 15 Escape closes in a scratch browser script closed. Cause not found; likely the same deferred enter meeting the exit (unverified)

## Notes

- Waited on the owner cards Q154 to Q159 (2026-11-24); settled by D168 (K1), D169 (K2), D170 (K3), D171 (K4 to K6). RESUME 79 from the lead.
- Task 3 (2026-11-24): on a device with an on-screen keyboard the stock React Aria popover is in the page at full opacity for two frames before its fade-in starts from 0 (measured in the test browser, 34 ms; not looked at on a phone). Stock library and stock part; for the look task to check at 390 wide.
