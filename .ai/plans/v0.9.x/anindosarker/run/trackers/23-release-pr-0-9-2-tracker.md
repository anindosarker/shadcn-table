# 23: Release 0.9.2, Release PR, tracker

Status: running
Branch `dev`, main checkout (gh only)
Checks:
- Check: dev contains in claude/review, `git merge-base --is-ancestor origin/dev origin/claude/review` at ffc8ce56: pass (equal)
- Check: changelog, `git show origin/dev:CHANGELOG.md`: one `## Unreleased`, Spec 21 under Added, Spec 22 under Removed: pass
- Check: label and auto-merge, `gh pr view 136 --json labels,autoMergeRequest --jq '[.labels[].name, .autoMergeRequest.enabledAt != null]'` at ffc8ce56: pass (["release:patch",true])
- Check: run jobs, `gh run view 42675739651 --json jobs` at ffc8ce56: pass (21 jobs success, Prepare Release waiting)
- Check: D36, `gh run view 42675739651 --log | grep -c 'Node.js 20 is deprecated'`: pass (0; check-run annotations also 0)
- Check: D38 artifacts, `gh api repos/anindosarker/shadcn-table/actions/runs/42675739651/artifacts --jq '.artifacts[].name'`: pass (7, all test-out-installation-e2e-*)
- Check: D37/D38 comment, `gh pr view 136 --json comments` sticky pr-summary: pass (25 table rows incl. 19 result legs, `## release: 0.9.2`, status line, four bold group rows, `#### Changelog`)
- Check: D47 approve, `gh api .../runs/42675739651/pending_deployments -f state=approved -F 'environment_ids[]=26597343948' -f comment=D47`: approved (approvals API state approved, comment D47, by anindosarker) at 2026-11-09T18:50:23Z; Prepare Release completed success

- Task 1 Open the PR with label and auto-merge: done, PR 136, pr.yml run 42675739890 (twin run 42675739651, same head ffc8ce56)
- Task 2 Full run green; approve Prepare Release (D47): done, run 42675739651 green, deployment approved
- Task 3 Bump run (test jobs skipped, D35) and merge: planned

## Attention

- [Staging for the ATTENTION file, one bullet per item, self-explanatory first line.]

## Notes

- [Optional: only what a later task, a resume or the owner would otherwise rediscover.]
- PR 136 sticky comment, first twelve lines (run 42675739651):
  ```
  <!-- shadcn-table:pr-summary -->
  ## release: 0.9.2

  `release:patch` | [run 42675739651](https://github.com/anindosarker/shadcn-table/actions/runs/42675739651) | ✅ all green

  | Job | Result |
  | --- | --- |
  | **Typecheck** | |
  | &nbsp;&nbsp;base | ✅ tsc clean |
  | &nbsp;&nbsp;radix | ✅ tsc clean |
  | &nbsp;&nbsp;aria | ✅ tsc clean |
  | **Lint** | ✅ 9 warnings |
  ```
