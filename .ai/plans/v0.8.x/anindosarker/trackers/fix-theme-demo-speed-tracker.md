# Theme demo speed, tracker

Status: merged (800ea815c1c4201b4d450a632fe8a45edc23dc73)
Branch `v0.8/fix-theme-demo-speed`, worktree 03, PR #[n]
Files owned: `apps/shadcn-table-docs/components/theme-demo/variants/whole-app.tsx`
Depends on: Last fixes (F19, F28, F30, F39, F40, F41, D56, D57)
Checks:
- `pnpm --filter shadcn-table-docs types:check` at 5b426b83: green
- `pnpm --filter shadcn-table-docs lint` at 5b426b83: green (0 errors, 9 existing warnings)

- Milestone 01 timing constants: done (5b426b83)

## Notes

- Owner, 2026-11-05 09:08: "Make this demo faster." `whole-app.tsx` constants: STEP_MS 90 to 60, ADD_MS 140 to 100, CHAR_MS 45 to 25, SEND_MS 500 to 300, THINK_MS 1200 to 700, CYCLE_MS 8000 to 5000 (the longest prompt types and lands in about 2.8 s, the app holds about 2.2 s). Main session, inline (mechanical edit).
