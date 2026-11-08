# 11: Persistent view example starts at ten rows, tracker

Status: done
Branch `v0.9/persistent-view-page-size`, worktree 05
Checks:
- Check: docs-e2e red (P11), `pnpm test docs-e2e --base base /docs/examples/persistent-view` at 9886cc07 plus the uncommitted check: fail as expected, `ten rows on first load rows=50`, `rows per page reads 10 select=50`
- Check: docs-e2e, `pnpm test docs-e2e --base base /docs/examples/persistent-view` at b5e4e468: pass (34 passed, rows=10, select=10)
- Check: validate-repo, `pnpm test validate-repo` at b5e4e468: pass
- Check: typecheck, `pnpm test typecheck --base radix` at b5e4e468 plus changelog: pass
- Check: format, `pnpm format`: no changes
- Check: verifier at e7fd4e96: no rerun; `git diff --name-only b5e4e468..e7fd4e96` touches only the tracker and CHANGELOG.md, so the recorded typecheck, validate-repo and docs-e2e (Acceptance 1.2) results at b5e4e468 stand: pass

- Task 1 Reproduce: done (cec58264)
- Task 2 Page size 10: done (b5e4e468)
- Task 3 Cleanup: done (this commit, see git log)
