# 69: Release 0.9.7, Release PR 0.9.7, tracker

Status: running
Branch `dev`, no worktree (operations only)
Checks:
- Check: PR opened, `gh pr create --base master --head dev --title "release: 0.9.7" --label release:patch` at 81a2c015: PR 141, https://github.com/anindosarker/shadcn-table/pull/141
- Check: Task 1, `gh pr view 141 --json labels,autoMergeRequest` at 81a2c015: `["release:patch", true]`, pass
- Check: pr.yml run 44464259152, attempt 1 at 81a2c015: red in one job, Storybook Tests (radix), 1 failed of 626: the play `Click To Copy Disabled Per Column` of `stories/features/ClickToCopy.stories.tsx` (AssertionError). Not touched by spec 68; the same play failed once on radix in 0.9.5's first attempt and passed on rerun. Log read before the rerun; `gh run rerun 44464259152 --failed` once the run completes
- Check: lead note of 2026-11-19 (D150 supersedes D148, the release waits for the milestone `69 Storybook version in the toolbar`): `gh pr merge 141 --disable-auto`, `autoMergeRequest` null. Prepare Release is not approved on any run of 81a2c015. After that milestone merges: dev fast-forwarded again, auto-merge back on, the new run is the one that counts

- Task 1 Open the PR with its label and auto-merge: done (81a2c015, PR 141); watcher armed in the runner session
- Task 2 The full run green, the approval: running
- Task 3 The bump run and the merge: planned

## Attention

## Notes
