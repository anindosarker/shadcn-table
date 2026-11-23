# 77: PostHog setup fixes, Ship the PostHog setup fixes, tracker

Status: running
Branch `dev`, worktree 03 for the branch sync (detached, operations only)
Checks:
- Check: Task 1, `git merge-base --is-ancestor origin/master origin/claude/review`: exit 0; tracker `77-posthog-setup-fixes` `done (333060ce)`; `git log --oneline origin/master..origin/claude/review -- . ':!.ai'` lists d5c01b5a and 00ec323f only; `origin/v0.9/filter-input-fixes` and `origin/v0.9/click-to-copy-tooltip-refocus` are not ancestors (exit 1 each); `gh pr list --state open --json number --jq length`: `0`, pass
- Check: Task 1, one push: `git push origin <claude/review head>:refs/heads/dev` (plain, fast-forward); `git rev-parse origin/dev` 78253c50 = the head of `claude/review`, pass
- Check: Task 2, PR 148, https://github.com/anindosarker/shadcn-table/pull/148, `chore(docs): posthog setup follows the guides`, created with `gh pr create --label release:skip --label ci:skip`; `gh pr view 148 --json labels`: `["ci:skip","release:skip"]`, head 78253c50
- Check: Task 2, the first run: `PR checks` 45087766469 (success, attempt 1) and four `PR labels` runs (45087766401, 45087766404, 45087766808, 45087767592, all success, attempt 1; four for two labels, PR 147 had two); one push, no rerun; `gh pr view 148 --json mergeStateStatus --jq .mergeStateStatus` read three times 20 s apart, before auto-merge: `CLEAN`, `CLEAN`, `CLEAN`, pass
- Check: Task 2, run 45087766469: Head log `skip=true (label ci:skip)`; `gh run view 45087766469 --json jobs --jq '[.jobs[] | select(.conclusion != "success" and .conclusion != "skipped")] | length'`: `0` (19 success, 3 skipped)
- Check: Task 2, `gh pr merge 148 --auto --merge` after the read; `gh pr view 148 --json state`: `MERGED` as 83e13730
- Check: Task 3, `release.yml` run 45088028479 on 83e13730: Check Release success, the other three jobs skipped; `git ls-remote --tags origin v0.9.8`: nothing; `origin/master` package.json `"version": "0.9.7"`
- Check: Task 3, branches: `git merge origin/master` on `claude/review` was a fast-forward; `git rev-parse origin/claude/review origin/dev origin/master`: 83e13730 three times, pass

- Task 1 The precondition and the fast-forward of dev: done (78253c50)
- Task 2 The PR with both labels, its first run, the CLEAN read, auto-merge and the merge: done (83e13730, PR 148, run 45087766469)
- Task 3 After the merge: running (the live reads)

## Attention

## Notes
