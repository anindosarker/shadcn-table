# 72: CI skip label fixes, tracker

Status: running
Branch `v0.9/ci-skip-label-fixes`, worktree 03
Checks:
- Check: Task 1, trial 1, PR 143, head `v0.9/ci-skip-trial-1` = 408e4287 (code before any change), base `master`, `gh pr create --label release:skip --label ci:skip`, one push: three runs of `pr.yml`, opened 44699735544 (suite 120991295186, 22 check runs, Head `skip=true`, 16 legs success), labeled 44699736449 (suite 120991297524, cancelled by the labels concurrency group), labeled 44699737060 (suite 120991299200, the newest, 10 check runs, no leg). `gh pr view 143 --json mergeStateStatus` three reads 30 s apart: `BLOCKED` x3 (`mergeable` MERGEABLE). Validate PR fails in both completed runs with `a PR into master comes from dev only (this PR comes from v0.9/ci-skip-trial-1)` (test/validate-pr/lib/source-branch.mjs, D83 addendum), so a trial branch into master is BLOCKED by Validate PR whatever the label runs do (see Attention)
- Check: Task 1, PR 142 re-read (head b2c5963c, the original fault, Validate PR success there): suites 120423320965 (opened run 44487960185, 22 check runs, legs success, rerun to attempt 2), 120423320930 (label run 44487960172, 10 check runs, rerun to attempt 2), 120423323111 (label run 44487961007, the newest suite, 10 check runs, no leg, never rerun). Its newest suite carries Lint, Validate Repo, Validate PR, PR Summary, Prepare Release and none of the 16 legs: exactly the `16 of 21 required status checks are expected` of the merge refusal
- Check: Task 1, trial 1 closed: `gh pr view 143 --json state --jq .state` `CLOSED`; `git ls-remote --heads origin 'v0.9/ci-skip-trial-*'` prints nothing: pass
- Check: Task 2, act, `act pull_request -W .github/workflows/pr.yml -j head -e <scratchpad>/event-<case>.json -P ubuntu-latest=catthehacker/ubuntu:act-latest --container-architecture linux/arm64 --container-options "-v <scratchpad>/gh:/usr/local/bin/gh:ro" -s GITHUB_TOKEN=<gh auth token>` through heavy.sh, in a throwaway clone of the worktree (origin set to github.com/anindosarker/shadcn-table, else `github.repository` is the local path and the read fails) with pr.yml at 8cef93c6 content; linux arm64 gh 2.83.1 mounted: labelled into dev (event of PR 143, which carries `ci:skip` live, with `base.ref` set to `dev` in the event file) `skip=false (none, base dev)`, no label read: pass; labelled into master (event of PR 143 as it is, base `master`, `ci:skip` live) `skip=true (label ci:skip)` from a live `gh pr view`: pass; unlabelled into master (event of merged PR 134, base `master`, labels `release:minor` live) `skip=false (none)`: pass. A failed read (first attempt, repo resolved to the local path) printed the warning and `skip=false (none, the label read failed)`: falls back to bumped. Not reproducible under act: the base of a real PR into `dev` that carries the label (none exists; the event file carries the base, and Head reads only the event's base)

- Task 1 The trial PR on the code before any change, and the cause: done (408e4287, runs 44699735544 44699736449 44699737060)
- Task 2 The base branch condition: done (8cef93c6)
- Task 3 The fix of the cause and the comments: planned

## Task 1: required contexts on 408e4287 (trial 1, PR 143)

| Context | Newest suite 120991299200 (run 44699737060, labeled) | Other entries (run: conclusion, completed at) |
|---|---|---|
| Lint | skipped, 2026-11-20T08:05:17Z | 44699736449: skipped, 2026-11-20T08:05:06Z; 44699735544: skipped, 2026-11-20T08:05:16Z |
| Validate Repo | skipped, 2026-11-20T08:05:17Z | 44699736449: skipped, 2026-11-20T08:05:06Z; 44699735544: skipped, 2026-11-20T08:05:16Z |
| Validate PR | failure, 2026-11-20T08:05:45Z | 44699735544: failure, 2026-11-20T08:05:34Z; 44699736449: cancelled, 2026-11-20T08:05:07Z |
| PR Summary | success, 2026-11-20T08:05:58Z | 44699736449: success, 2026-11-20T08:05:16Z; 44699735544: success, 2026-11-20T08:05:43Z |
| Prepare Release | skipped, 2026-11-20T08:05:58Z | 44699736449: cancelled, 2026-11-20T08:05:16Z; 44699735544: skipped, 2026-11-20T08:05:43Z |
| Typecheck / Typecheck (base) | none | 44699735544: success, 2026-11-20T08:05:21Z |
| Storybook Tests / Storybook Tests (base) | none | 44699735544: success, 2026-11-20T08:05:26Z |
| Docs E2E Tests / Docs E2E Tests (base) | none | 44699735544: success, 2026-11-20T08:05:23Z |
| Typecheck / Typecheck (radix) | none | 44699735544: success, 2026-11-20T08:05:20Z |
| Storybook Tests / Storybook Tests (radix) | none | 44699735544: success, 2026-11-20T08:05:22Z |
| Docs E2E Tests / Docs E2E Tests (radix) | none | 44699735544: success, 2026-11-20T08:05:22Z |
| Typecheck / Typecheck (aria) | none | 44699735544: success, 2026-11-20T08:05:22Z |
| Storybook Tests / Storybook Tests (aria) | none | 44699735544: success, 2026-11-20T08:05:22Z |
| Docs E2E Tests / Docs E2E Tests (aria) | none | 44699735544: success, 2026-11-20T08:05:20Z |
| Installation E2E / Installation E2E (fresh) | none | 44699735544: success, 2026-11-20T08:05:23Z |
| Installation E2E / Installation E2E (existing) | none | 44699735544: success, 2026-11-20T08:05:22Z |
| Installation E2E / Installation E2E (base) | none | 44699735544: success, 2026-11-20T08:05:21Z |
| Installation E2E / Installation E2E (aria) | none | 44699735544: success, 2026-11-20T08:05:20Z |
| Installation E2E / Installation E2E (nextjs-base) | none | 44699735544: success, 2026-11-20T08:05:23Z |
| Installation E2E / Installation E2E (nextjs-radix) | none | 44699735544: success, 2026-11-20T08:05:22Z |
| Installation E2E / Installation E2E (nextjs-aria) | none | 44699735544: success, 2026-11-20T08:05:21Z |

Cause: GitHub resolves the required contexts of a ruleset from the newest check suite of a workflow on the head sha, and a PR created with labels starts one `pr.yml` run per label event after the opened run, so the newest `pr.yml` suite is a label run whose caller jobs are skipped and which reports none of the 16 matrix-leg contexts (PR 142: newest suite 120423323111 of label run 44487961007; trial 1: newest suite 120991299200 of label run 44699737060), while the reruns of PR 142 only added attempts to older suites. The leg check runs of the opened run exist with success in both, `gh pr checks --required` and `statusCheckRollup` list them as pass (they dedupe by name), and GitHub still counts them as expected: what the merge reads is the suite, not the name.

## Attention
