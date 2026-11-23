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

- Task 1 identical files: done (89ee92d)
- Reader task 1 at 89ee92d: no deviation
- Task 2 differing files: done (e244ed0); `pnpm registry:build` not yet run. Plan line added first for `components/picker-popup.tsx` (table repository ddb8d00c, section 3.6): the unread `Button` import removed, the place of the `ButtonContext` import, prettier formatting

## Notes

- Waited on the owner cards Q154 to Q159 (2026-11-24); settled by D168 (K1), D169 (K2), D170 (K3), D171 (K4 to K6). RESUME 79 from the lead.
