# 79: Date picker Radix and React Aria versions, Date picker Radix version, tracker

Status: running
Branch `date-picker-radix-version`, worktree /Users/anindosarker/Work/Personal/React-table/shadcn-date-picker.worktrees/date-picker-radix-version
Checks:
- Check: identical files, `cmp registry/base/components/date-picker/<file> registry/radix/components/date-picker/<file>` for each of the 18 files the design plan marks identical for Radix, at 1b06b47: pass (exit 0, 18 of 18)
- Check: file count, `find registry/radix/components/date-picker -type f | wc -l`, at d5880df: pass (22)
- Check: differing files, `diff -rq registry/base/components/date-picker registry/radix/components/date-picker`, at d5880df: pass (4 files: `types.ts`, `components/picker-popup.tsx`, `components/time-field.tsx`, `components/view-nav.tsx`, the plan's list for Radix)
- Check: no Base UI import, `grep -rn '@base-ui' registry/radix/components/date-picker`, at d5880df: pass (no line)
- Check: `pnpm typecheck`, at d5880df: pass (exit 0)
- Check: `pnpm lint`, at d5880df: pass (exit 0)
- Check: JSDoc count, `grep -rc '/\*\*' registry/radix/components/date-picker | awk -F: '{s+=$2} END {print s}'`, at d5880df: pass (3)
- Check: `pnpm exec prettier --check registry/radix/components/date-picker`, at d5880df: pass (exit 0)
- Check: `pnpm registry:check`, at 5224ac3: pass (exit 0; `registry/radix/registry.json` holds one item `date-picker-radix`, title `Date Picker (Radix UI)`, 22 files)
- Check: `pnpm lint`, at 5224ac3: pass (exit 0)
- Check: `pnpm typecheck`, at 5224ac3: pass (exit 0)
- Check: `pnpm test --base radix`, at 5224ac3: FAIL (exit 1; 37 of 39 plays passed; `stories/DateTime.stories.tsx > Range` and `stories/Options.stories.tsx > Presets` failed, each again on its rerun)
- Check: `git diff --stat origin/main -- stories .storybook tools package.json pnpm-lock.yaml registry/base registry/radix/components/ui`, at 5224ac3: pass (prints nothing)
- Check: `pnpm test --base base`, at 5224ac3: pass (exit 0, 39 of 39 plays)
- Check: `git merge origin/main` (108d72e, the stories fix 78.2), at 132d291: pass (merge commit, no conflict, pushed)
- Check: `pnpm registry:check`, at 132d291: pass (exit 0; `registry/radix/registry.json` holds one item `date-picker-radix`, title `Date Picker (Radix UI)`, 22 files)
- Check: `pnpm test --base radix`, at 132d291: pass (exit 0, 39 of 39 plays, first run, no rerun)
- Check: `git diff --stat origin/main -- stories .storybook tools package.json pnpm-lock.yaml registry/base registry/radix/components/ui`, at 132d291: pass (prints nothing)
- Check: `pnpm test --base base`, at 132d291: pass (exit 0, 39 of 39 plays)

- Task 1 identical files: done (1b06b47)
- Reader task 1 at 1b06b475bdad8166fbf449eaade15799348ed603: no deviation
- Task 2 differing files: done (d5880df)
- Reader task 2 at d5880df4992ee5587ba74bfcc7d884fa239d947c: no deviation
- Task 3 item definition and plays: done (5224ac3 item, generated install files and README; 132d291 merge of origin/main with the stories fix 78.2, every play passes)

## Notes

- Waited on the owner cards Q154 to Q159 (2026-11-24); settled by D168 (K1), D169 (K2), D170 (K3), D171 (K4 to K6). RESUME 79 from the lead.
- Task 3, origin/main taken at ed74d58 (already in the branch). The item's dependencies as the build derives them: `cn`, `date-fns`, `lucide-react`, `react-day-picker`; no `radix-ui`, because no file of the version imports it (the parts do). Registry dependencies: the same ten as the Base UI item.
- Task 3, plan line added first (c1f2836f, section 5.2): the install command of a base in `README.md`, its place and order.
- Task 3, blocked play 1: `stories/Options.stories.tsx > Presets`, step "U2 Tab past the last control closes the popover" (`:566-571`): `expectClosed("Select date")` after `userEvent.tab()` on the last control. A Base UI reading, named difference R1 (plan 5.1, D171): on Radix Tab goes to the first control and the popover stays open. Not fixed here.
- Task 3, blocked play 2: `stories/DateTime.stories.tsx > Range`, step "R16 opening an end's clock orders a reversed pair, then edits that end" (`:237-281`): the last `expectValue` gets `["2026-11-05T08:00","2026-11-20T10:00"]`, expected `["2026-11-05T08:00","2026-11-20T09:00"]`. Cause, read from an event log of the run: the first `dateKeys` call of the file runs the helper `isDayFirst` (`stories/support/play.ts:96-108`) while the range popup is open; it appends a probe `input` to `document.body` and focuses it. On Radix a focus outside an open popover closes it (`@radix-ui/react-popover@1.3.1/dist/index.mjs:273-274`, `@radix-ui/react-dismissable-layer@1.2.1/dist/index.mjs:86-88`); Base UI leaves it open. The popup and the clock opened in it are gone about 130 ms later (the exit animation), before the click on the hour. A user cannot do this: Tab stays in the popover (R1) and a press outside closes on both bases. Proof: a script that opens the `Date` range popup and focuses an `input` appended to `body` finds 1 dialog before and 0 after; with a real pointer and keys and no probe the step gives the expected value on Radix. A helper that relies on Base UI's popover staying open: a stories fix (for example the probe before the popup opens), not fixed here and the version not bent.
- Task 3, resumed after the stories fix 78.2 (origin/main 108d72e): both blocked plays pass on Radix at 132d291 with no change to the version.
