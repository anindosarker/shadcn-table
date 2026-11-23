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

- Task 1 identical files: done (1b06b47)
- Reader task 1 at 1b06b475bdad8166fbf449eaade15799348ed603: no deviation
- Task 2 differing files: done (d5880df)
- Reader task 2 at d5880df4992ee5587ba74bfcc7d884fa239d947c: no deviation

## Notes

- Waited on the owner cards Q154 to Q159 (2026-11-24); settled by D168 (K1), D169 (K2), D170 (K3), D171 (K4 to K6). RESUME 79 from the lead.
