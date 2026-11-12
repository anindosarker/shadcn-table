# 38: Release 0.9.3, Release PR, tracker

Status: running
Branch `dev`, main checkout (gh only)
Checks:
- Check: dev equals claude/review, `git rev-parse origin/dev origin/claude/review` at 4b81e672: pass (one sha)
- Check: label and auto-merge, `gh pr view 137 --json labels,autoMergeRequest --jq '[.labels[].name, .autoMergeRequest.enabledAt != null]'` at 4b81e672: pass (["release:patch",true])

- Task 1 Open the PR with label and auto-merge: done, PR 137 (https://github.com/anindosarker/shadcn-table/pull/137), pr.yml runs 43311771861 and 43311775619 (same head 4b81e672)
- Task 2 Full run green; approve Prepare Release (D47): running
- Task 3 Bump run (test jobs skipped, D35) and merge: planned

## Attention

## Notes
