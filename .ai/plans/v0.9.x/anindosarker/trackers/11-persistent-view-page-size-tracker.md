# 11: Persistent view example starts at ten rows, tracker

Status: done
Branch `v0.9/persistent-view-page-size`, worktree 05
Checks:
- Check: docs-e2e red (P11), `pnpm test docs-e2e --base base /docs/examples/persistent-view` at 9886cc07 plus the uncommitted check: fail as expected, `ten rows on first load rows=50`, `rows per page reads 10 select=50`
- Check: docs-e2e, `pnpm test docs-e2e --base base /docs/examples/persistent-view` at b5e4e468: pass (34 passed, rows=10, select=10)
- Check: validate-repo, `pnpm test validate-repo` at b5e4e468: pass
- Check: typecheck, `pnpm test typecheck --base radix` at b5e4e468 plus changelog: pass
- Check: format, `pnpm format`: no changes

- Task 1 Reproduce: done (cec58264)
- Task 2 Page size 10: done (b5e4e468)
- Task 3 Cleanup: done (this commit, see git log)
