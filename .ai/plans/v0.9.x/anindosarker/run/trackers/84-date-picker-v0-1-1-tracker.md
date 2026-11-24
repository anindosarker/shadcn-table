# 84: Date picker v0.1.1, tracker

Status: running
Branch `date-picker-v0-1-1`, worktree shadcn-date-picker.worktrees/date-picker-v0-1-1 (from origin/main c42b8bb)
Checks:
- Check: play red, `DP_BASE=base pnpm exec vitest run stories/Options.stories.tsx` at c42b8bb with the G3, G4 step rewritten (source unchanged): fail as expected (1 failed, 26 passed; Ignored Limits: `expected "spy" to not be called with arguments: [ StringContaining "DatePicker:" ]`, received `DatePicker: min "2026/11/05" is ignored: not a datetime value` and `DatePicker: step 1.5 is ignored: not a whole number of seconds above zero`)
- Check: no warning left, `grep -rn -E 'process\.|IgnoredProp|ignored\(' registry/*/components/date-picker` at 4873842: pass (no output)
- Check: same file, `cmp` of `utils/values.ts` base/radix and base/aria at 4873842: pass (exit 0, exit 0)
- Check: deletions only, `git diff origin/main --stat -- 'registry/*/components/date-picker/utils/values.ts'` at 4873842: pass (3 files, 6 insertions, 57 deletions; the 2 added lines per file are the callers `checkedLimits` and `checkedStep` yielding `undefined`)
- Check: tests base, `pnpm test --base base` at 4873842: pass (7 files, 39 tests; play green)
- Check: tests radix, `pnpm test --base radix` at 4873842: pass (7 files, 39 tests)
- Check: tests aria, `pnpm test --base aria` at 4873842: pass (7 files, 39 tests, no rerun)
- Note: cases G3 and G4 of `reference/q88-date-filter-demo/date-picker-9-cases.md` no longer print a console error (D176); the reference file is not edited.
- Check: arrow class, `grep -c 'rtl:rotate-180' registry/<base>/components/date-picker/components/period-views.tsx` at a05fb19: pass (base 2, radix 2, aria 2)
- Check: two lines per file, `git diff origin/main -- 'registry/*/components/date-picker/components/period-views.tsx'` at a05fb19: pass (2 insertions, 2 deletions per file, the two `GridHeader` chevrons)
- Check: right-to-left captures, Storybook dev of the branch on port 5341 with DP_BASE=base, `dir="rtl"` set on the preview document by the playwright script, plays left out of the served story modules, popup opened by a script click, at a05fb19: 8 captures under reference/q149-calendar-library/rtl/after/
- Check: rtl month-single 1280, after/month-single-1280.png against rtl/month-single-1280.png (spec 78) at a05fb19: arrows flipped (previous points right, next points left; nothing else differs)
- Check: rtl month-single 390, after/month-single-390.png against rtl/month-single-390.png (spec 78) at a05fb19: arrows flipped (previous points right, next points left; nothing else differs)
- Check: rtl month-range 1280, after/month-range-1280.png against rtl/month-range-1280.png (spec 78) at a05fb19: arrows flipped (previous points right, next points left; nothing else differs)
- Check: rtl month-range 390, after/month-range-390.png against rtl/month-range-390.png (spec 78) at a05fb19: arrows flipped (previous points right, next points left; nothing else differs)
- Check: rtl year-single 1280, after/year-single-1280.png against rtl/year-single-1280.png (spec 78) at a05fb19: arrows flipped (previous points right, next points left; nothing else differs)
- Check: rtl year-single 390, after/year-single-390.png against rtl/year-single-390.png (spec 78) at a05fb19: arrows flipped (previous points right, next points left; nothing else differs)
- Check: rtl year-range 1280, after/year-range-1280.png against rtl/year-range-1280.png (spec 78) at a05fb19: arrows flipped (previous points right, next points left; nothing else differs)
- Check: rtl year-range 390, after/year-range-390.png against rtl/year-range-390.png (spec 78) at a05fb19: arrows flipped (previous points right, next points left; nothing else differs)
- Check: Storybook server stopped by pid, `lsof -iTCP:5341 -sTCP:LISTEN` at a05fb19: pass (nothing listens)

- Task 1 warning removal: done (4873842); props row in stories/Introduction.mdx says a limit in another format is ignored
- Task 2 grid arrows: done (a05fb19); eight right-to-left captures committed
