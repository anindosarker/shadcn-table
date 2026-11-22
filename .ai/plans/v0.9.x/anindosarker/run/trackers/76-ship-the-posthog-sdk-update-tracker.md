# 76: PostHog SDK update, Ship the PostHog SDK update, tracker

Status: running
Branch `dev`, worktree 03 for the branch sync (detached, operations only)
Checks:
- Check: before shipping, the attention point of milestone `PostHog SDK update` (the proxy guide's extra `/array` rewrite, not added): since 1.451.0 the SDK fetches its remote config from `/ingest/array/<token>/config`. Read on the live 0.9.7 site through the existing `/ingest` rewrite: 200, `application/json`, `cache-control: public, max-age=300`, 1085 bytes, the same answer `us.i.posthog.com` and `us-assets.i.posthog.com` give directly. No rewrite needed, pass
- Check: Task 1, `git merge-base --is-ancestor origin/master origin/claude/review`: exit 0; tracker `76-posthog-sdk-update` `done (404f2fec)`; `git log --oneline origin/master..origin/claude/review -- . ':!.ai'` lists c78a1df5 `chore(docs): posthog-js 1.453.2` only; `origin/v0.9/filter-input-fixes` and `origin/v0.9/click-to-copy-tooltip-refocus` are not ancestors (exit 1 each); `gh pr list --state open --json number --jq length`: `0`, pass
- Check: Task 1, one push: `git push origin <claude/review head>:refs/heads/dev` (plain, fast-forward); `git rev-parse origin/dev` a4cb7390 = the head of `claude/review`, pass
- Check: Task 2, PR 147, https://github.com/anindosarker/shadcn-table/pull/147, `chore(docs): posthog-js 1.453.2`, created with `gh pr create --label release:skip --label ci:skip`; `gh pr view 147 --json labels`: `["ci:skip","release:skip"]`, head a4cb7390
- Check: Task 2, the first run: `PR checks` 45085266143 and `PR labels` 45085266415, 45085266804, all success, attempt 1; one push, no rerun; `gh pr view 147 --json mergeStateStatus --jq .mergeStateStatus` read three times 20 s apart, before auto-merge: `CLEAN`, `CLEAN`, `CLEAN`, pass
- Check: Task 2, run 45085266143: Head log `skip=true (label ci:skip)`; `gh run view 45085266143 --json jobs --jq '[.jobs[] | select(.conclusion != "success" and .conclusion != "skipped")] | length'`: `0` (19 success, 3 skipped)
- Check: Task 2, `gh pr merge 147 --auto --merge` after the read; `gh pr view 147 --json state`: `MERGED` as a1f463a8
- Check: Task 3, `release.yml` run 45085496310 on a1f463a8: Check Release success, Verify Deployment, Validate Production, Publish Release skipped; `git ls-remote --tags origin v0.9.8`: nothing; `origin/master` package.json `"version": "0.9.7"`, docs app `"posthog-js": "^1.453.2"`
- Check: Task 3, branches: `git merge origin/master` on `claude/review` was a fast-forward; `git rev-parse origin/claude/review origin/dev origin/master`: a1f463a8 three times, pass

- Task 1 The precondition and the fast-forward of dev: done (a4cb7390)
- Task 2 The PR with both labels, its first run, the CLEAN read, auto-merge and the merge: done (a1f463a8, PR 147, run 45085266143)
- Task 3 After the merge: running (the live reads)

## Attention

## Notes
