# 65: Release 0.9.5, Release PR 0.9.5, tracker

Status: running
Branch `dev`, no worktree (operations only)
Checks:
- Check: PR opened, `gh pr create --base master --head dev --title "release: 0.9.5" --label release:patch` at 323f183a: PR 139, https://github.com/anindosarker/shadcn-table/pull/139
- Check: Task 1, `gh pr view 139 --json labels,autoMergeRequest` at 323f183a: `["release:patch", true]`, pass

- Check: pr.yml run 44389754666, attempt 1 at 323f183a: 2 red, both timing failures. Storybook Tests (radix): 1 failed, 644 passed, `ClickToCopy.stories.tsx` > `Click To Copy Disabled Per Column`, `expected [] to include 'Click to copy'`. Docs E2E Tests (aria): 1 failed of 117 pages, `/docs/getting-started/introduction @1440 live-demo: multi-select filter (Status) locator.click: Timeout 5000ms exceeded`. Every other job green
- Check: `gh run rerun 44389754666 --failed`, attempt 2 at 323f183a: both jobs green; `gh run view 44389754666 --json jobs --jq '[.jobs[] | select(.conclusion != "success" and .conclusion != "skipped")]'` lists only Prepare Release (waiting), pass
- Check: approval (D47), `gh api repos/anindosarker/shadcn-table/actions/runs/44389754666/pending_deployments -X POST -f state=approved -F 'environment_ids[]=26597343948' -f comment="D47"`: environment `release`, by anindosarker, created_at 2026-11-18T20:43:41Z

- Task 1 Open the PR with its label and auto-merge: done (323f183a, PR 139); watcher armed in the runner session
- Task 2 Full run green and the approval: done (323f183a, run 44389754666 attempt 2, approved 2026-11-18T20:43:41Z)
- Task 3 Bump run and merge: planned

## Attention

## Notes
- Two CI flakes on attempt 1, neither named in process.md P5, both green on the one rerun and green locally on three bases in every E15 and E16 milestone: the ClickToCopy play `Click To Copy Disabled Per Column` (radix; P5 names `Click Copies Value` of the same file) and the docs E2E live-demo step `multi-select filter (Status)` on the introduction page (aria). Neither was reproduced under `act`.
