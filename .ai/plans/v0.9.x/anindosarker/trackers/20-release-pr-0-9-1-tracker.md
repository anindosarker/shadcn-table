# 20: Release 0.9.1, Release PR, tracker

Status: running
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

- Task 1 Open the PR with label and auto-merge: done, PR #135, pr.yml run 42514739346 (head 763f923b)
- Task 2 Full run green; the runner's Approve (D47): done, run 42518019709 green, relabelled `release:patch` (D49), deployment approved 2026-11-08T20:38:09Z
- Task 3 Bump run (test jobs skipped, D35) and merge; proof lines D35, D36, D38, D44: planned

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
