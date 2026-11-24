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

- Task 1 warning removal: done (4873842); props row in stories/Introduction.mdx says a limit in another format is ignored
