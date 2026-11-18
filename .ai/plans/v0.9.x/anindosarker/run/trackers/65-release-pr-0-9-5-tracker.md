# 65: Release 0.9.5, Release PR 0.9.5, tracker

Status: running
Branch `dev`, no worktree (operations only)
Checks:
- Check: PR opened, `gh pr create --base master --head dev --title "release: 0.9.5" --label release:patch` at 323f183a: PR 139, https://github.com/anindosarker/shadcn-table/pull/139
- Check: Task 1, `gh pr view 139 --json labels,autoMergeRequest` at 323f183a: `["release:patch", true]`, pass

- Task 1 Open the PR with its label and auto-merge: done (323f183a, PR 139); watcher armed in the runner session
- Task 2 Full run green and the approval: planned
- Task 3 Bump run and merge: planned

## Attention

## Notes
