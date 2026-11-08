# 20: Release 0.9.1, Release PR, tracker

Status: running
Branch `dev`, main checkout (gh only)
Checks:
- Check: dev ancestor, `git merge-base --is-ancestor origin/dev origin/claude/review` at 763f923b / fbf615ad: pass
- Check: changelog, `git show origin/dev:CHANGELOG.md` one `## Unreleased` with Spec 08 to 19 and Fix F22 at 763f923b: pass
- Check: label and auto-merge, `gh pr view 135 --json labels,autoMergeRequest --jq '[.labels[].name, .autoMergeRequest.enabledAt != null]'` at 763f923b: pass (["release:minor",true])

- Task 1 Open the PR with label and auto-merge: done, PR #135, pr.yml run 42514739346 (head 763f923b)
- Task 2 Full run green; the runner's Approve (D47): planned
- Task 3 Bump run (test jobs skipped, D35) and merge; proof lines D35, D36, D38, D44: planned

## Attention

- [Staging for the ATTENTION file, one bullet per item, self-explanatory first line.]

## Notes

- Two pr.yml runs started on 763f923b at 19:22:44Z (PR opened and labeled events): 42514739346 (20 jobs) and 42514739235 (8 jobs at first look); 42514739346 is the tracked full run.
