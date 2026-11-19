# 71: CI skip label, Ship the home page label, tracker

Status: running
Branch `dev`, no worktree (operations only)
Checks:
- Check: Task 1, `git merge-base --is-ancestor origin/master origin/claude/review`: exit 0; trackers `70-home-version-label` `done (c9d56119)` and `71-ci-skip-label` `done (4a3234bc)`; `git log --oneline origin/master..origin/claude/review -- . ':!.ai'` lists the commits of spec 70, of `CI skip label`, and the play fix 07c626e9 of spec 69 (test only, merged after the 0.9.7 fast-forward), pass
- Check: Task 1, `gh label create ci:skip`; `gh label list --json name --jq '[.[].name] | index("ci:skip") != null'`: `true`, pass
- Check: Task 1, `git push origin <claude/review head>:refs/heads/dev` (plain push, fast-forward): `git rev-parse origin/dev` b2c5963c, the head of `claude/review` at the push, pass
- Check: Task 2, PR 142 opened, https://github.com/anindosarker/shadcn-table/pull/142, `docs: version label on the home page`; `gh pr view 142 --json labels`: `["ci:skip","release:skip"]`; auto-merge on; head b2c5963c

- Task 1 The precondition, the label and the fast-forward of dev: done (b2c5963c)
- Task 2 The PR with both labels and auto-merge, its run and the merge: running (PR 142; watcher armed in the runner session)
- Task 3 After the merge: planned

## Attention

## Notes
