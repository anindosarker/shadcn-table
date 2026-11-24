# 83: Release 0.9.8, Release PR 0.9.8, tracker

Status: running
Branch `dev`, no worktree (operations only)
Checks:
- Check: PR opened, `gh pr create --base master --head dev --title "release: 0.9.8" --label release:patch` at 2423d81a, 2026-11-24 11:22: PR 149, https://github.com/anindosarker/shadcn-table/pull/149
- Check: Task 1, `gh pr merge 149 --auto --merge`, then `gh pr view 149 --json labels,autoMergeRequest` at 2423d81a: `["release:patch", true]`, pass

- Task 1 Open the PR with its label and auto-merge: done (2423d81a, PR 149)

## Notes

## Attention
