# 48: Release 0.9.4, Release PR, tracker

Status: planned (stopped by the run manager 2026-11-14 01:24, owner hold for the Q83 fix)
Branch `dev`, main checkout (gh only)
Checks:
- Check: dev equals claude/review, `git rev-parse origin/dev origin/claude/review` at f7905db9: pass (one sha); `git merge-base --is-ancestor origin/master origin/dev`: pass

- Task 1 Open the PR with label and auto-merge: running
- Task 2 Full run green; approve Prepare Release (D47): planned
- Task 3 Bump run (test jobs skipped, D35) and merge: planned

## Attention

## Notes

## Notes

- 2026-11-14 01:24: the owner's hold (E12 note, Q83) arrived after Integration had fast-forwarded dev and PR 138 was open. The run manager stopped the workflow, turned auto-merge off, made PR 138 a draft and cancelled pr.yml run 43490656009 before Prepare Release; no approval was given, no bump commit exists. When the fix has merged: fast-forward dev again, mark PR 138 ready, enable auto-merge, continue at Task 1's check.
