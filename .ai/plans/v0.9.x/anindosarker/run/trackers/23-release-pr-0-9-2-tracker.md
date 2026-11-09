# 23: Release 0.9.2, Release PR, tracker

Status: running
Branch `dev`, main checkout (gh only)
Checks:
- Check: dev contains in claude/review, `git merge-base --is-ancestor origin/dev origin/claude/review` at ffc8ce56: pass (equal)
- Check: changelog, `git show origin/dev:CHANGELOG.md`: one `## Unreleased`, Spec 21 under Added, Spec 22 under Removed: pass
- Check: label and auto-merge, `gh pr view 136 --json labels,autoMergeRequest --jq '[.labels[].name, .autoMergeRequest.enabledAt != null]'` at ffc8ce56: pass (["release:patch",true])

- Task 1 Open the PR with label and auto-merge: done, PR 136, pr.yml run 42675739890 (twin run 42675739651, same head ffc8ce56)
- Task 2 Full run green; approve Prepare Release (D47): planned
- Task 3 Bump run (test jobs skipped, D35) and merge: planned

## Attention

- [Staging for the ATTENTION file, one bullet per item, self-explanatory first line.]

## Notes

- [Optional: only what a later task, a resume or the owner would otherwise rediscover.]
