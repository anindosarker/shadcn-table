# 67: Release 0.9.6, After release 0.9.6, tracker

Status: running
Branch `master`, no worktree for Tasks 1 and 2 (operations only)
Checks:
- Check: `release.yml` run 44454822363 at 022f8770: Check Release, Verify Deployment, Validate Production, Publish Release all `success`
- Check: `git ls-remote --tags origin v0.9.6` at 022f8770: one line, `022f8770b749a8388e08c67c3b8276d40972fe90 refs/tags/v0.9.6`, pass
- Check: `gh release view v0.9.6 --json tagName --jq .tagName`: `v0.9.6`, pass
- Check: `https://www.shadcn-table.com/version.txt` and `https://storybook.shadcn-table.com/version.txt`: both `0.9.6`, pass

- Task 1: done (022f8770). `release.yml` run 44454822363 green
- Task 2: planned
- Task 3: planned

## Attention

## Notes
