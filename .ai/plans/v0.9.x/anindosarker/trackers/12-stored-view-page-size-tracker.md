# 12: Stored view persists rows per page, tracker

Status: running
Branch `v0.9/stored-view-page-size`, worktree 05
Checks:
- Check: Persistence play red (P11), `ST_BASE=base vitest run stories/features/ViewSettings.stories.tsx` (package `shadcn-table`) on the shipped code plus the extended play: fail as expected, `Persistence` at `toContain('"pageSize":20')`, stored view `{"columnOrder":[...],"density":"spacious","viewSettings":{...}}` has no pageSize; 10 other stories pass

- Task 1 Reproduce: running
