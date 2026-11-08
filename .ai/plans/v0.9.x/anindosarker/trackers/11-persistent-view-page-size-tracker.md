# 11: Persistent view example starts at ten rows, tracker

Status: running
Branch `v0.9/persistent-view-page-size`, worktree 05
Checks:
- Check: docs-e2e red (P11), `pnpm test docs-e2e --base base /docs/examples/persistent-view` at 9886cc07 plus the uncommitted check: fail as expected, `ten rows on first load rows=50`, `rows per page reads 10 select=50`
- Check: docs-e2e, `pnpm test docs-e2e --base base /docs/examples/persistent-view` at Task 2 commit: pass (34 passed, rows=10, select=10)
- Check: validate-repo, `pnpm test validate-repo` at Task 2 commit: pass

- Task 1 Reproduce: done (cec58264)
- Task 2 Page size 10: running
- Task 3 Cleanup: planned
