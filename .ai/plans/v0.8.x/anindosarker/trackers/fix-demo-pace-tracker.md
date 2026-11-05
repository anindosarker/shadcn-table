# Home demo pace, tracker

Status: verified
Branch `v0.8/fix-demo-pace`, worktree 02, PR #[n]
Gates:
- `pnpm --filter shadcn-table-docs types:check` at [commit]: green
- `node scripts/check-pages.mjs e --base base` at [commit]: [result]

- Milestone 01 timing constants: done ([commit])

## Notes

- Owner, 2026-11-05 21:29: "After one part of the demo finishes, there is a slight gap of 4 or 5 seconds. Reduce the gap." `signal-demo.tsx`: SHOW_MS 1200 to 800, HOLD_MS 2200 to 1200, LAST_HOLD_MS 3000 to 2000, REST_MS 1400 to 1000, MIN_STEP_MS 5200 to 3600. Main session, inline (mechanical edit).
