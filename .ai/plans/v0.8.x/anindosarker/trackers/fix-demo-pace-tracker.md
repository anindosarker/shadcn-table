# Home demo pace, tracker

Status: merged (b389c726)
Branch `v0.8/fix-demo-pace`, worktree 02, PR #[n]
Files owned: `apps/shadcn-table-docs/components/dev-home/v12/signal-demo.tsx`
Depends on: Home demo cues and last title (F49, D65)
Gates:
- `pnpm --filter shadcn-table-docs types:check` at 3d946632: green
- `node scripts/check-pages.mjs e --base base` at 3d946632: green (home entry, base)

- Milestone 01 timing constants: done (3d946632)

## Notes

- Owner, 2026-11-05 21:29: "After one part of the demo finishes, there is a slight gap of 4 or 5 seconds. Reduce the gap." `signal-demo.tsx`: SHOW_MS 1200 to 800, HOLD_MS 2200 to 1200, LAST_HOLD_MS 3000 to 2000, REST_MS 1400 to 1000, MIN_STEP_MS 5200 to 3600. Main session, inline (mechanical edit).
