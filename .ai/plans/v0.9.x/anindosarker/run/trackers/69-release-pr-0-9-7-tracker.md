# 69: Release 0.9.7, Release PR 0.9.7, tracker

Status: running
Branch `dev`, no worktree (operations only)
Checks:
- Check: PR opened, `gh pr create --base master --head dev --title "release: 0.9.7" --label release:patch` at 81a2c015: PR 141, https://github.com/anindosarker/shadcn-table/pull/141
- Check: Task 1, `gh pr view 141 --json labels,autoMergeRequest` at 81a2c015: `["release:patch", true]`, pass

- Task 1 Open the PR with its label and auto-merge: done (81a2c015, PR 141); watcher armed in the runner session
- Task 2 The full run green, the approval: running
- Task 3 The bump run and the merge: planned

## Attention

## Notes
