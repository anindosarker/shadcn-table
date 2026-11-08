# 07: Release 0.9.0, Release PR, tracker

Status: running
Branch `dev` at 0adce149, main checkout (gh only)
Checks:
- Check: label and auto-merge, `gh pr view 134 --json labels,autoMergeRequest --jq '[.labels[].name, .autoMergeRequest.enabledAt != null]'` at 0adce149: pass (`["release:minor", true]`)

- Task 1 Open the PR with label and auto-merge: done (PR 134, https://github.com/anindosarker/shadcn-table/pull/134, pr.yml run 42488458376, watcher armed 20:13)
- Task 2 Approve the Prepare Release deployment (D15): superseded by D28, the owner approves; the runner stops when the job waits
- Task 3 Merged on green: running; pr.yml run 42488458376 red on `Storybook Tests (aria)` only (`SubRowTree` plays "Expand Shows Children" and "Expand All Collapse All", `getByRole` on an undefined container; 616 of 618 pass; green locally at df90bd27 three times today), rerun once when the run completes (P5)

## Attention

- [Staging for the ATTENTION file, one bullet per item, self-explanatory first line.]

## Notes

- [Optional: only what a later task, a resume or the owner would otherwise rediscover.]
