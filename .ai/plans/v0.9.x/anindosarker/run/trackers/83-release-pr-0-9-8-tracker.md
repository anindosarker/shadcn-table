# 83: Release 0.9.8, Release PR 0.9.8, tracker

Status: done (a594a8a4)
Branch `dev`, no worktree (operations only)
Checks:
- Check: PR opened, `gh pr create --base master --head dev --title "release: 0.9.8" --label release:patch` at 2423d81a, 2026-11-24 11:22: PR 149, https://github.com/anindosarker/shadcn-table/pull/149
- Check: Task 1, `gh pr merge 149 --auto --merge`, then `gh pr view 149 --json labels,autoMergeRequest` at 2423d81a: `["release:patch", true]`, pass
- Check: Task 2, pr.yml run 45332870689 attempt 1 on 2423d81a (05:22 to about 05:50 UTC, 2026-11-24): conclusion failure. One red job, Docs E2E Tests (radix), job 138237988623: `examples: FAIL /docs/examples/sticky-row-selection @1440 enable-row-pinning-select: copied state` (examples 1115 passed, 1 failed; the prompt copy itself passed, `prompt copied len=1063`; every other docs section green). Every other job green; Prepare Release skipped. Not a P5 known flake, so no rerun; no code edited
- Check: Task 2, run 45332870689 attempt 2 (runner's one `gh run rerun --failed`) on 2423d81a: Docs E2E Tests (radix) success, every job green, Prepare Release waiting at 2026-11-24 06:00 UTC
- Check: Task 2, environment `release` (id 26597343948) approved through `pending_deployments`, state approved, comment D47, at 06:01 UTC: response deployment id 8020008155
- Check: Task 3, bump commit `chore: version 0.9.8` b9cef463 on `dev` (CHANGELOG.md and both package.json files), its PR checks run 45337393527 success at 06:02 UTC
- Check: Task 3, auto-merge merged PR 149 as a594a8a4 at 2026-11-24 06:02:40 UTC; `gh pr view 149 --json state` prints `MERGED`; `origin/master` packages/shadcn-table/package.json holds `"version": "0.9.8"`, pass

- Task 1 Open the PR with its label and auto-merge: done (2423d81a, PR 149)
- Task 2: done (2423d81a). Run 45332870689 attempt 2 green, Prepare Release approved (D47, deployment 8020008155)
- Task 3: done (a594a8a4). Bump commit b9cef463, run 45337393527 green, PR 149 merged as a594a8a4

## Notes

## Attention

- The release run 45332870689 failed one docs test on radix, the copied state of the copy prompt button on /docs/examples/sticky-row-selection, which P5 does not list as a known flake.
- Decisive lines (`gh run view --job 138237988623 --log-failed`): `PASS ... enable-row-pinning-select: prompt copied len=1063`, then `FAIL /docs/examples/sticky-row-selection @1440 enable-row-pinning-select: copied state`; `docs-e2e (radix): FAIL 5 sections, 117 pages, 1 failed`. The same copied-state check passed on every other page of the run. PR 149 stays open with auto-merge on; no rerun, no Prepare Release approval.
- Runner, 2026-11-24: the red of run 45332870689 (Docs E2E radix, sticky-row-selection copied state) is a timing miss of the check: test/docs-e2e/lib/helpers.mjs:313-327 clicks, waits a fixed 100 ms and counts the Copied button once; the same check passed on every other page and base. Rerun of the failed job started once (attempt 2); the check gets a fix milestone of spec 83 (wait for the button, no fixed time).
