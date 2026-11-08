# 08: Copy and Import leave the theme panel, tracker

Status: running
Branch `v0.9/theme-panel-copy-import`, worktree 04
Checks:

- `pnpm test docs-e2e --base base /` at 9886cc07 plus the Task 1 assertion (shipped code, P11): fail as intended, "FAIL / @1440 theme: the palette button opens the panel heading=1 tabs=Colors,Typography,Other copyImport=2"; every other check pass (62 passed)
- `pnpm --filter shadcn-table-docs types:check` at Task 2 tree: pass
- `pnpm --filter shadcn-table-docs lint` at Task 2 tree: pass (0 errors, 9 warnings, none in owned files)
