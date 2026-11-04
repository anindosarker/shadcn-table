# Home demo columns (F32), tracker

Status: verified
Branch `v0.8/fix-home-columns`, worktree 02, PR #110
Gates:
- `pnpm --filter shadcn-table-docs types:check` at d0576c27: green
- `pnpm --filter shadcn-table-docs lint` at d0576c27: green (0 errors, 9 warnings, all in untouched example files)
- `node scripts/check-pages.mjs e --base radix --url http://localhost:5341` at d0576c27: green (672 passed, 0 failed; includes `/ @1440 demo: seven data columns` and `demo: no horizontal scroll overflow=0px`)
- `pnpm --filter shadcn-table-docs build` at e49db729: green (verifier)
- `node scripts/check-pages.mjs e --base base --url http://localhost:5342` at e49db729: green (672 passed, 0 failed; seven data columns, overflow=0px) (verifier)
- `node scripts/check-pages.mjs e --base aria --url http://localhost:5342` at e49db729: green (672 passed, 0 failed; seven data columns, overflow=0px) (verifier)
- types:check, lint and radix cluster e at d0576c27 stay valid: `git diff --name-only d0576c27..e49db729` touches only the tracker and `CHANGELOG.md` (verifier)

- Milestone 01 Seven demo columns: done (a88298e3, d0576c27)

## Attention

- Home demo column sizes shrank (Name 150, Status 105, Assignee 115, Project 100, Due 110, Estimate 110, Priority 85; were 260, 150, 160, 130, 130, 120, 120). At 1440 px the table frame is 828 px (page width minus the 300 px steps panel); the old sizes need 1118 px, and seven untruncated headers with the stock chrome (icon, label, sort mark, menu chevron) need about 960 px. So the table now fits with no horizontal scrollbar and Estimate in view, but most header labels truncate (St..., Assi..., P..., Est...). Revert path: widen the frame (the 300 px steps panel in `v5.css`) or drop columns.

## Notes

- Browser check: Playwright headless against `PORT=5341 pnpm --filter shadcn-table-docs dev`, 1440 and 1280 px: table 828 px in an 828 px scroller, no overflow; the Editing step's Estimate cell (task-40, 16h) visible. Server stopped after.
