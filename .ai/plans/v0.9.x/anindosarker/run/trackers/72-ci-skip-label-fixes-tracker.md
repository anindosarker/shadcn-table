# 72: CI skip label fixes, tracker

Status: running
Branch `v0.9/ci-skip-label-fixes`, worktree 03
Checks:
- Check: Task 1, trial 1, PR 143, head `v0.9/ci-skip-trial-1` = 408e4287 (code before any change), base `master`, `gh pr create --label release:skip --label ci:skip`, one push: three runs of `pr.yml`, opened 44699735544 (suite 120991295186, 22 check runs, Head `skip=true`, 16 legs success), labeled 44699736449 (suite 120991297524, cancelled by the labels concurrency group), labeled 44699737060 (suite 120991299200, the newest, 10 check runs, no leg). `gh pr view 143 --json mergeStateStatus` three reads 30 s apart: `BLOCKED` x3 (`mergeable` MERGEABLE). Validate PR fails in both completed runs with `a PR into master comes from dev only (this PR comes from v0.9/ci-skip-trial-1)` (test/validate-pr/lib/source-branch.mjs, D83 addendum), so a trial branch into master is BLOCKED by Validate PR whatever the label runs do (see Attention)
- Check: Task 1, PR 142 re-read (head b2c5963c, the original fault, Validate PR success there): suites 120423320965 (opened run 44487960185, 22 check runs, legs success, rerun to attempt 2), 120423320930 (label run 44487960172, 10 check runs, rerun to attempt 2), 120423323111 (label run 44487961007, the newest suite, 10 check runs, no leg, never rerun). Its newest suite carries Lint, Validate Repo, Validate PR, PR Summary, Prepare Release and none of the 16 legs: exactly the `16 of 21 required status checks are expected` of the merge refusal
- Check: Task 1, trial 1 closed: `gh pr view 143 --json state --jq .state` `CLOSED`; `git ls-remote --heads origin 'v0.9/ci-skip-trial-*'` prints nothing: pass
- Check: Task 2, act, `act pull_request -W .github/workflows/pr.yml -j head -e <scratchpad>/event-<case>.json -P ubuntu-latest=catthehacker/ubuntu:act-latest --container-architecture linux/arm64 --container-options "-v <scratchpad>/gh:/usr/local/bin/gh:ro" -s GITHUB_TOKEN=<gh auth token>` through heavy.sh, in a throwaway clone of the worktree (origin set to github.com/anindosarker/shadcn-table, else `github.repository` is the local path and the read fails) with pr.yml at 8cef93c6 content; linux arm64 gh 2.83.1 mounted: labelled into dev (event of PR 143, which carries `ci:skip` live, with `base.ref` set to `dev` in the event file) `skip=false (none, base dev)`, no label read: pass; labelled into master (event of PR 143 as it is, base `master`, `ci:skip` live) `skip=true (label ci:skip)` from a live `gh pr view`: pass; unlabelled into master (event of merged PR 134, base `master`, labels `release:minor` live) `skip=false (none)`: pass. A failed read (first attempt, repo resolved to the local path) printed the warning and `skip=false (none, the label read failed)`: falls back to bumped. Not reproducible under act: the base of a real PR into `dev` that carries the label (none exists; the event file carries the base, and Head reads only the event's base)
- Check: Task 3, act at f83138ae content (same clone and flags as Task 2): `act pull_request -l` lists Head and the test jobs under `pull_request` for pr.yml and Validate PR, PR Summary for pr-labels.yml (act lists events, not activity types: the `types` filter is proven by the trials); Head labelled into dev `skip=false (none, base dev)`, labelled into master `skip=true (label ci:skip)`, unlabelled into master `skip=false (none)`: pass; `act pull_request -W .github/workflows/pr-labels.yml` with a `labeled` event of PR 143: Validate PR ran and failed on `a PR into master comes from dev only (this PR comes from v0.9/ci-skip-trial-1)` (source-branch, expected for that PR), PR Summary `comment updated on #143`, succeeded: pass
- Check: Task 3, trial 2, PR 144, head `v0.9/ci-skip-trial-2` = f83138ae, both labels, one push: `gh run list --branch v0.9/ci-skip-trial-2 --json databaseId --jq length` 3: one `PR checks` run 44703450307 (opened, suite 121001012197, 22 check runs holding all 21 contexts) and two `PR labels` runs, 44703450616 (suite 121001013022, completed) and 44703450651 (suite 121001013131, cancelled by the pr-labels concurrency group). The cancelled run has the newest suite id of PR labels although it started first: a cancelled `Validate PR` in the newest suite. Fix 22fe19cf drops the concurrency group of pr-labels.yml. `mergeStateStatus` `BLOCKED` x3, every non-success context `Validate PR` (source-branch failure, and the cancelled one). Closed: `CLOSED`, no trial branch left
- Check: Task 3, act at 22fe19cf content: `act pull_request -W .github/workflows/pr-labels.yml` with the `labeled` event of PR 143: Validate PR source-branch failure as above, PR Summary `comment updated on #143`: pass
- Check: Task 3, trial 3, PR 145, head `v0.9/ci-skip-trial-3` = 22fe19cf, `gh pr create --label release:skip --label ci:skip`, one push, no rerun: `gh run list --branch v0.9/ci-skip-trial-3 --json databaseId --jq length` 3, each attempt 1: `PR checks` 44704528731 (opened, suite 121003831407, 22 check runs, every one of the 21 required contexts present, the 16 legs success, Lint, Validate Repo, Prepare Release skipped, PR Summary success), `PR labels` 44704529266 (suite 121003832715) and 44704529376 (suite 121003832983), none cancelled. `mergeStateStatus` three reads 30 s apart: `BLOCKED` x3. The statusCheckRollup filter of Task 3 prints 3, all `Validate PR FAILURE` with `a PR into master comes from dev only (this PR comes from v0.9/ci-skip-trial-3)`; nothing else is red or missing. Closed: `gh pr view 145 --json state --jq .state` `CLOSED`, `git ls-remote --heads origin 'v0.9/ci-skip-trial-*'` prints nothing: pass
- Check: `pnpm test lint` (heavy.sh) at 22fe19cf: pass (0 errors, 9 warnings in unchanged files)
- Check: `pnpm test validate-repo` (heavy.sh) at 22fe19cf: pass (43 unit tests, worktree clean after)
- Not provable on a trial branch: `CLEAN`. test/validate-pr/lib/source-branch.mjs fails `Validate PR` on every PR into master whose head is not `dev`, so each trial is `BLOCKED` by that context whatever the label runs do; the spec's head branch name and the rule against pushing to dev leave no trial that can pass it (see Attention)

- Task 1 The trial PR on the code before any change, and the cause: done (408e4287, runs 44699735544 44699736449 44699737060)
- Task 2 The base branch condition: done (8cef93c6)
- Task 3 The fix of the cause and the comments: done (22fe19cf)
- Task 3 proof: the lead accepted trial 3 (PR 145, one `PR checks` run with all 21 required contexts, the source-branch rule of Validate PR its only red) as proof for the merge (plan/epics/E21.md, Notes, last bullet); the `CLEAN` proof is recorded on the next labelled PR from dev into master

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

## Two workflows, one context

`Validate PR` and `PR Summary` are reported by `PR checks` (pr.yml, on opened, synchronize, reopened) and by `PR labels` (pr-labels.yml, on labeled, unlabeled) on the same head sha. GitHub takes the required checks of each workflow from its newest check suite on the sha (Task 1, PR 142), so each of the two contexts has one candidate per workflow: pr.yml's one run on the head (it is the newest `PR checks` suite, since label events no longer start one) and the newest `PR labels` suite. Both runs read the labels live and run the same `pnpm test validate-pr --ci`, so both candidates agree once the labels are set; a label change afterwards starts a new `PR labels` run, whose result is the newest. The 16 legs and Lint, Validate Repo, Prepare Release come from pr.yml only, so a label event can no longer hide them. A cancelled label run would put a cancelled `Validate PR` in the newest `PR labels` suite (trial 2), hence no concurrency group there. A PR opened without any label change gets every context, both twins included, from its first pr.yml run. Unproven on GitHub: which candidate the ruleset prefers when the two disagree; with the labels read live they disagree only while a label change is in flight.

## Attention

- Nothing is left to decide for the merge: the lead accepted trial 3 as proof (plan/epics/E21.md, Notes). The `CLEAN` proof is owed on the next labelled PR from dev into master.
- Judgment call: pr-labels.yml has no concurrency group (trial 2: GitHub cancelled the run with the newest suite id). Cost: on two labels at creation two label runs of about 45 s each run in full.
