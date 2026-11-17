# 62: Touch drag in menus and toolbars, tracker

Status: running
Branch `v0.9/touch-drag-menus-toolbars`, worktree 06
Checks:
- Check: touch plays fail before the change (P11), `ST_BASE=base vitest run` ColumnOrdering, SortPopover, ColumnGrouping at 7da8152e: fail as expected, 4 failed (Menu Reorder Moves Column, Locked Column Stays Put, Reorder Remove Delete: no ghost, no reorder; Group By Banner: a touch drag cancelled over the drop zone still groups), 40 passed
- Check: typecheck of the changed registry files, `tsc -p tsconfig.{baseui,radix,aria}.json --noEmit` at 80a997f1: pass (clean x3)
- Check: eslint and prettier on the changed files at 80a997f1: pass
- Check: touch and mouse plays of the four story files, `ST_BASE=<base> vitest run` ColumnOrdering, SortPopover, ColumnGrouping, ColumnHiding at 80a997f1: pass on base, radix, aria (55 of 55 each)

- Task 1 Touch plays first: done (7da8152e)
- Task 2 The three surfaces: done (80a997f1)
