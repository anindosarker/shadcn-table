# CRUD dialog check waits for the rows (Q25), tracker

Status: merged (fff96d29; dev 634739d3)
Files owned: `test/docs-e2e/lib/examples.mjs`
Depends on: none
Branch `v0.9/crud-dialog-check-wait` (cut from `dev` 0a465c3e, D30 pattern: merged into `dev` then `claude/review`), worktree 03
Checks:
- Check: `pnpm test docs-e2e --base base /docs/examples/editing-crud-inline-row` at 4a374866 (working tree): pass, 15 passed 0 failed
- Check: `pnpm test docs-e2e --base base /docs/examples/editing-crud-inline-cell` at 4a374866 (working tree): pass, 15 passed 0 failed
- Check: `pnpm test docs-e2e --base base /docs/examples/editing-crud-inline-table` at 4a374866 (working tree): pass, 15 passed 0 failed
- Check: `pnpm test docs-e2e --base base /docs/examples/editing-crud-tree` at 4a374866 (working tree): pass, 16 passed 0 failed
- Check: `pnpm test docs-e2e --base base /docs/examples/editing-crud` at 4a374866 (working tree): pass, 15 passed 0 failed
- Check: `pnpm test docs-e2e --base radix /docs/examples/editing-crud-inline-row` at 4a374866 (working tree): pass, 15 passed 0 failed
- Check: `pnpm test docs-e2e --base radix /docs/examples/editing-crud-inline-cell` at 4a374866 (working tree): pass, 15 passed 0 failed
- Check: `pnpm test docs-e2e --base radix /docs/examples/editing-crud-inline-table` at 4a374866 (working tree): pass, 15 passed 0 failed
- Check: `pnpm test docs-e2e --base radix /docs/examples/editing-crud-tree` at 4a374866 (working tree): pass, 16 passed 0 failed
- Check: `pnpm test docs-e2e --base radix /docs/examples/editing-crud` at 4a374866 (working tree): pass, 15 passed 0 failed
- Check: act `act pull_request -W .github/workflows/pr.yml -j docs-e2e --matrix base:radix`: not run, act: Docker daemon not running (polled `docker info` every 30 s for 5 minutes, twice)

- Task 1 Settle wait: done (4a374866)

## Notes

- No changelog block; test file only.
- `settledRowCount` in `examples.mjs`: waits until no `tbody [data-slot="skeleton"]` is left and the `tbody tr` count is equal across two reads 300 ms apart, bounded at 10 s; `deleteDialog` reads `before` and `after` through it. Check names, messages and pass conditions unchanged.

## Attention

- The `claude/review` merge commit was made in worktree 03 (detached at `origin/claude/review`) and pushed, then the main checkout fast-forwarded: the main checkout's index held the lead's staged `pr-summary-draft.md`, so `git merge --no-ff` refused there.
- The `claude/review` merge also brings dev's `chore: version 0.9.0` bump (CHANGELOG.md and two package.json) into `claude/review`, since the branch was cut from `dev`.
- The branch was cut from `dev` after the 0.9.0 bump, so its `claude/review` merge (fff96d29) carried `chore: version 0.9.0` there: `package.json` 0.9.0 (fine, `master` lands there after the release) and the changelog's `## Unreleased` renamed to `## 0.9.0` with the E4 and E5 blocks under it; the runner moved those blocks back under a new `## Unreleased` in a98740f4. A later fix branch cut from `dev` after a bump needs the same move.
