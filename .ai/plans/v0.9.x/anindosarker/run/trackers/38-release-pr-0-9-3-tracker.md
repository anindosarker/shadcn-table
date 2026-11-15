# 38: Release 0.9.3, Release PR, tracker

Status: merged (9378b9f8)
Branch `dev`, main checkout (gh only)
Checks:
- Check: dev equals claude/review, `git rev-parse origin/dev origin/claude/review` at 4b81e672: pass (one sha)
- Check: label and auto-merge, `gh pr view 137 --json labels,autoMergeRequest --jq '[.labels[].name, .autoMergeRequest.enabledAt != null]'` at 4b81e672: pass (["release:patch",true])
- Check: run jobs, `gh run view 43311775619 --json jobs` at 4b81e672: pass (21 jobs success, Prepare Release waiting); twin run 43311771861 success (Prepare Release skipped)
- Check: D47 approve, `gh api repos/anindosarker/shadcn-table/actions/runs/43311775619/pending_deployments -f state=approved -F 'environment_ids[]=26597343948' -f comment=D47`: approved (deployment 7750548009, environment release, sha 4b81e672; approvals API state approved, comment D47, by anindosarker); Prepare Release completed success, run conclusion success, `[.jobs[] | select(.conclusion != "success" and .conclusion != "skipped")] | length` 0
- Check: D35/D44 bump contexts, `gh api repos/anindosarker/shadcn-table/commits/3f4e361f/check-runs --paginate` at 3f4e361f (bump run 43313740356 success): pass (22 contexts completed: 16 test legs success, Lint and Validate Repo skipped, Prepare Release skipped, Validate PR, PR Summary, Head success)
- Check: rollup, `gh pr view 137 --json statusCheckRollup`: pass (22 COMPLETED)
- Check: merge, `gh pr view 137 --json state,mergeCommit`: pass (MERGED by auto-merge, 9378b9f856013d3d00f0d936be07701c7df649f8)
- Check: version, `git show origin/master:packages/shadcn-table/package.json | grep '"version": "0.9.3"'` at 9378b9f8: pass
- Check: release.yml run on master, `gh run list --workflow release.yml --branch master --limit 1`: run 43313863214 at 9378b9f8, in_progress (After release milestone watches it)

- Task 1 Open the PR with label and auto-merge: done, PR 137 (https://github.com/anindosarker/shadcn-table/pull/137), pr.yml runs 43311771861 and 43311775619 (same head 4b81e672)
- Task 2 Full run green; approve Prepare Release (D47): done, run 43311775619 green, deployment approved, no red, no fix rounds
- Task 3 Bump run (test jobs skipped, D35) and merge: done, bump 3f4e361f (run 43313740356), merge 9378b9f8, release.yml run 43313863214

## Attention

## Notes

- PR body: scratch file from the 1.6.3 template; one paragraph per spec 24 to 37 and one for the direct fixes (D66, build tsconfig, sidebar row, D77, D78, D79, D80).
