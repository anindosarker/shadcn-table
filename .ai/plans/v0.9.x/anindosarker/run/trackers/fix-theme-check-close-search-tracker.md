# Theme check closes the search dialog (Q24), tracker

Status: merged (dbc43fd6; dev 50ef8dd5)
Files owned: `test/docs-e2e/lib/getting-started.mjs`
Depends on: none
Branch `v0.9/theme-check-close-search` (cut from `dev` ea276251, D30 pattern: merged into `dev` then `claude/review`), worktree 03
Checks:
- Check: docs E2E `/` base, `pnpm test docs-e2e --base base /` at d912ec9a (worktree 03): pass (63 passed, 0 failed)
- Check: docs E2E `/` aria, `pnpm test docs-e2e --base aria /` at d912ec9a (worktree 03): fail, 1 check "theme: p restores it" (`#b91c1c -> #b91c1c`, before the changed code, CPU idle near 0 percent)
- Check: docs E2E `/` aria rerun, `pnpm test docs-e2e --base aria /` at d912ec9a (worktree 03): pass (63 passed, 0 failed)
- Check: merge into `claude/review` at dbc43fd6: clean auto-merge, no conflict, `node --check` passes; no run (the task runs one only on a conflict)
- Check: act, `act pull_request -W .github/workflows/pr.yml -j docs-e2e --matrix base:aria`: not run, act: Docker daemon not running (polled 15 min after both merges); the local base and aria runs above are the gate

- Task 1 Dialog close: done (d912ec9a)

Notes: no changelog block, test file only.
