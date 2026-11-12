# 23: Release 0.9.2, Release PR, tracker

Status: merged (8feb7940)
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
- Check: D35/D44 bump contexts, `gh api repos/anindosarker/shadcn-table/commits/1fa765ce/check-runs --paginate` at 1fa765ce (bump run 42677646898 success): pass (22 contexts completed: 16 test legs success, Lint and Validate Repo skipped, Prepare Release skipped, Validate PR, PR Summary, Head success; none queued, missing or failed)
- Check: rollup, `gh pr view 136 --json statusCheckRollup`: pass (22 COMPLETED, none Expected)
- Check: merge, `gh pr view 136 --json state,mergeCommit`: pass (MERGED, 8feb7940026928bf57a5bbed4e504da4bb061944)
- Check: version, `git show origin/master:packages/shadcn-table/package.json | grep '"version": "0.9.2"'` at 8feb7940: pass
- Check: release.yml run on master, `gh run list --workflow release.yml --branch master --limit 1`: run 42677803985 at 8feb7940, in_progress

- Task 1 Open the PR with label and auto-merge: done, PR 136, pr.yml run 42675739890 (twin run 42675739651, same head ffc8ce56)
- Task 2 Full run green; approve Prepare Release (D47): done, run 42675739651 green, deployment approved
- Task 3 Bump run (test jobs skipped, D35) and merge: done, bump 1fa765ce (run 42677646898), merge 8feb7940, release.yml run 42677803985

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
- Bump commit 1fa765ce check runs (D35, D44 proof):
  ```
  Docs E2E Tests / Docs E2E Tests (aria) completed success
  Docs E2E Tests / Docs E2E Tests (base) completed success
  Docs E2E Tests / Docs E2E Tests (radix) completed success
  Head completed success
  Installation E2E / Installation E2E (aria) completed success
  Installation E2E / Installation E2E (base) completed success
  Installation E2E / Installation E2E (existing) completed success
  Installation E2E / Installation E2E (fresh) completed success
  Installation E2E / Installation E2E (nextjs-aria) completed success
  Installation E2E / Installation E2E (nextjs-base) completed success
  Installation E2E / Installation E2E (nextjs-radix) completed success
  Lint completed skipped
  PR Summary completed success
  Prepare Release completed skipped
  Storybook Tests / Storybook Tests (aria) completed success
  Storybook Tests / Storybook Tests (base) completed success
  Storybook Tests / Storybook Tests (radix) completed success
  Typecheck / Typecheck (aria) completed success
  Typecheck / Typecheck (base) completed success
  Typecheck / Typecheck (radix) completed success
  Validate PR completed success
  Validate Repo completed skipped
  ```
