# 20: Release 0.9.1, Release PR, tracker

Status: merged (b0d53a11)
Branch `dev`, main checkout (gh only)
Checks:
- Check: dev ancestor, `git merge-base --is-ancestor origin/dev origin/claude/review` at 763f923b / fbf615ad: pass
- Check: changelog, `git show origin/dev:CHANGELOG.md` one `## Unreleased` with Spec 08 to 19 and Fix F22 at 763f923b: pass
- Check: label and auto-merge, `gh pr view 135 --json labels,autoMergeRequest --jq '[.labels[].name, .autoMergeRequest.enabledAt != null]'` at 763f923b: pass (["release:minor",true])
- Check: full run jobs, `gh run view 42518019709 --json status,conclusion,jobs` at 6746034c: pass (21 jobs success, Prepare Release waiting)
- Check: D36, `gh run view 42518019709 --log | grep -c 'Node.js 20 is deprecated'`: pass (0)
- Check: D38 artifacts, `gh api repos/anindosarker/shadcn-table/actions/runs/42518019709/artifacts --jq '.artifacts[].name'`: pass (7 names, all test-out-installation-e2e-*)
- Check: D38 comment, `gh pr view 135 --json comments --jq '... contains("shadcn-table:pr-summary") ...' | grep -c '✅\|❌\|⚪'`: pass (20; `## release: 0.9.1`, `|` status line, four bold group rows, `#### Changelog`)
- Check: Validate PR row of run 42518019709: fail (`✅ Ships as 0.10.0 (release:minor)`, spec target 0.9.1); deployment not approved
- Check: labeled run, `gh run view 42520968919` at 6746034c after relabel `release:patch` (D49): pass (success; Validate PR row `✅ Ships as 0.9.1 (release:patch)`; Prepare Release reads the label live via `gh pr view`)
- Check: approve (D47), `gh api .../runs/42518019709/pending_deployments -f state=approved -F 'environment_ids[]=26597343948' -f comment=D47` at 2026-11-08T20:38:09Z: pass (deployment 7641212415, environment release; Prepare Release in_progress)
- Check: bump run, `gh run view 42521146798 --json status,conclusion,headSha` at 26fa7e6f: pass (completed success)
- Check: D35, D44, `gh api repos/anindosarker/shadcn-table/commits/26fa7e6f/check-runs --paginate` at 26fa7e6f: pass (22 contexts completed; test legs success with steps skipped, Lint and Validate Repo skipped, Prepare Release skipped, Head, Validate PR, PR Summary success; none queued or missing)
- Check: Expected contexts, `gh pr view 135 --json statusCheckRollup` at 26fa7e6f: pass (22 COMPLETED, none Expected)
- Check: merged, `gh pr view 135 --json state,mergeCommit` : pass (MERGED, b0d53a11ff4b035ea19b3e0db2450c185142cea8)
- Check: master version, `git show origin/master:packages/shadcn-table/package.json | grep '"version": "0.9.1"'` at b0d53a11: pass
- Check: release run, `gh run list --workflow release.yml --branch master --limit 1` at b0d53a11: run 42521211641 in_progress

- Task 1 Open the PR with label and auto-merge: done, PR #135, pr.yml run 42514739346 (head 763f923b)
- Task 2 Full run green; the runner's Approve (D47): done, run 42518019709 green, relabelled `release:patch` (D49), deployment approved 2026-11-08T20:38:09Z
- Task 3 Bump run (test jobs skipped, D35) and merge; proof lines D35, D36, D38, D44: done, bump 26fa7e6f, run 42521146798, merge b0d53a11, release.yml run 42521211641

## Attention

- [Staging for the ATTENTION file, one bullet per item, self-explanatory first line.]

## Notes

- Two pr.yml runs started on 763f923b at 19:22:44Z (PR opened and labeled events): 42514739346 (20 jobs) and 42514739235 (8 jobs at first look); 42514739346 is the tracked full run.
- Run 42518019709 (head 6746034c) is the tracked full run for Task 2. Sticky comment, first twelve lines:
  ```
  <!-- shadcn-table:pr-summary -->
  ## release: 0.9.1

  `release:minor` | [run 42518019709](https://github.com/anindosarker/shadcn-table/actions/runs/42518019709) | ✅ all green

  | Job | Result |
  | --- | --- |
  | **Typecheck** | |
  | &nbsp;&nbsp;base | ✅ tsc clean |
  | &nbsp;&nbsp;radix | ✅ tsc clean |
  | &nbsp;&nbsp;aria | ✅ tsc clean |
  | **Lint** | ✅ 9 warnings |
  ```
- D35, D44 proof, bump commit 26fa7e6f, `check-runs` full list:
  ```
  Prepare Release completed skipped
  PR Summary completed success
  Lint completed skipped
  Validate Repo completed skipped
  Installation E2E / Installation E2E (existing) completed success
  Installation E2E / Installation E2E (nextjs-aria) completed success
  Typecheck / Typecheck (radix) completed success
  Installation E2E / Installation E2E (nextjs-base) completed success
  Installation E2E / Installation E2E (base) completed success
  Installation E2E / Installation E2E (aria) completed success
  Installation E2E / Installation E2E (nextjs-radix) completed success
  Storybook Tests / Storybook Tests (radix) completed success
  Installation E2E / Installation E2E (fresh) completed success
  Storybook Tests / Storybook Tests (aria) completed success
  Storybook Tests / Storybook Tests (base) completed success
  Docs E2E Tests / Docs E2E Tests (radix) completed success
  Docs E2E Tests / Docs E2E Tests (base) completed success
  Typecheck / Typecheck (base) completed success
  Docs E2E Tests / Docs E2E Tests (aria) completed success
  Typecheck / Typecheck (aria) completed success
  Head completed success
  Validate PR completed success
  ```
