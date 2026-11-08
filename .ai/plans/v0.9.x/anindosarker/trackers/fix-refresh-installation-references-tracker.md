# Installation references refreshed (F20), tracker

Status: merged (db8a27fc; dev 0adce149)
Files owned: `test/installation-e2e/fixtures/reference/base/default-light.png`, `test/installation-e2e/fixtures/reference/base/default-dark.png`, `test/installation-e2e/fixtures/reference/radix/default-light.png`, `test/installation-e2e/fixtures/reference/radix/default-dark.png`, `test/installation-e2e/fixtures/reference/aria/default-light.png`, `test/installation-e2e/fixtures/reference/aria/default-dark.png`
Depends on: none
Branch `v0.9/refresh-installation-references` (cut from df90bd27, the `dev` head), worktree 07
Checks:
- Check: installation-e2e captures, `gh workflow run pr.yml --ref v0.9/refresh-installation-references -f installation-e2e-only=true` run 42446914317 at df90bd27: pass, six PNGs replaced from the nextjs-<base> artifacts

- Task 1 References replaced: done (56d3f995)

## Notes

- No changelog block: the change is test fixtures only.
- Run: https://github.com/anindosarker/shadcn-table/actions/runs/42446914317. All six captures 1800x1150; the new base light reference shows `Rows per page [10]  1-10 of 50`, otherwise the same table as the old one. Local diff not run (F21).

## Attention

- Branch `v0.9/refresh-installation-references` kept, not deleted (exception to P3, per the lead).
- Merge order reversed: `claude/review` (db8a27fc) was merged before the D30 instruction arrived; `dev` (0adce149, from df90bd27) followed. The `dev` merge ran in worktree 07 on a detached `origin/dev`, pushed as `HEAD:dev`, so the main checkout, shared with other agents, never switched branch or ran `reset --hard`.
- The fix commit has no trailer: the builder prompt asked for the harness trailer, and none was given in the session.
