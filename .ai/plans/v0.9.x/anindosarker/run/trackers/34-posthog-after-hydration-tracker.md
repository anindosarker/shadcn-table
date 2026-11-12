# 34: posthog-js loads after hydration, tracker

Status: running
Branch `v0.9/posthog-after-hydration`, worktree `shadcn-react-table.worktrees/04`
Checks:
- `NEXT_PUBLIC_POSTHOG_KEY=phc_dummy NEXT_PUBLIC_SITE_URL=http://localhost:5346 pnpm --filter shadcn-table-docs build` at 59a003a9: pass
- Before Lighthouse x3 (spec 30 1.2 line, port 5346) at 59a003a9, load avg 7.5, CPU 62 percent idle: 585 KB / 54 ms, 585 KB / 99 ms, 585 KB / 452 ms; median 585 KB, 99 ms
- Before chunk loop at 59a003a9: `1n4xmhkq_5igr.js` (provider, posthog-js/react), `409tytbgtbm4-.js` (posthog-js, 343 KB)

- Task 1 before numbers: done
