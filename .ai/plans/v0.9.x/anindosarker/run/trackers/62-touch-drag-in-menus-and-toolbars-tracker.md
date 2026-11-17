# 62: Touch drag in menus and toolbars, tracker

Status: running
Branch `v0.9/touch-drag-menus-toolbars`, worktree 06
Checks:
- Check: touch plays fail before the change (P11), `ST_BASE=base vitest run` ColumnOrdering, SortPopover, ColumnGrouping at 7da8152e: fail as expected, 4 failed (Menu Reorder Moves Column, Locked Column Stays Put, Reorder Remove Delete: no ghost, no reorder; Group By Banner: a touch drag cancelled over the drop zone still groups), 40 passed

- Task 1 Touch plays first: done (7da8152e)
