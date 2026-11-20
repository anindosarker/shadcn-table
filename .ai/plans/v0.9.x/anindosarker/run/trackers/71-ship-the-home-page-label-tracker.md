# 71: CI skip label, Ship the home page label, tracker

Status: done (229e6113)
Branch `dev`, no worktree (operations only)
Checks:
- Check: Task 1, `git merge-base --is-ancestor origin/master origin/claude/review`: exit 0; trackers `70-home-version-label` `done (c9d56119)` and `71-ci-skip-label` `done (4a3234bc)`; `git log --oneline origin/master..origin/claude/review -- . ':!.ai'` lists the commits of spec 70, of `CI skip label`, and the play fix 07c626e9 of spec 69 (test only, merged after the 0.9.7 fast-forward), pass
- Check: Task 1, `gh label create ci:skip`; `gh label list --json name --jq '[.[].name] | index("ci:skip") != null'`: `true`, pass
- Check: Task 1, `git push origin <claude/review head>:refs/heads/dev` (plain push, fast-forward): `git rev-parse origin/dev` b2c5963c, the head of `claude/review` at the push, pass
- Check: Task 2, PR 142 opened, https://github.com/anindosarker/shadcn-table/pull/142, `docs: version label on the home page`; `gh pr view 142 --json labels`: `["ci:skip","release:skip"]`; auto-merge on; head b2c5963c

- Check: Task 2, first head b2c5963c: three runs (opened 44487960185; one per label, 44487960172 and 44487961007). Run 44487960185: Head `skip=true (label ci:skip)`, 19 jobs success, Lint, Validate Repo, Prepare Release skipped, every matrix leg with all steps skipped. The merge stayed blocked: `gh api -X PUT .../pulls/142/merge` answered `16 of 21 required status checks are expected` (the 16 matrix legs, each `success` on the commit). `gh run rerun 44487960172`, then `gh run rerun 44487960185`: no change. Card Q144
- Check: Task 2, `dev` fast-forwarded to 94aff145 (a plan commit, plain push), one run 44490268925 on that head: Head log `skip=true (label ci:skip)`; `gh run view 44490268925 --json jobs --jq '[.jobs[] | select(.conclusion != "success" and .conclusion != "skipped")] | length'`: `0` (19 success, 3 skipped); leg `Docs E2E Tests (base)` steps: `Set up job` success, checkout, pnpm setup, node setup, `pnpm install --frozen-lockfile`, Playwright steps, `pnpm test docs-e2e --ci --base base`, `Hand the record to PR Summary` all skipped, `Complete job` success; `gh pr view 142 --json state`: `MERGED` as 229e6113 by auto-merge. This run is the live proof of the label read that `act` could not give (tracker `71-ci-skip-label`)
- Check: Task 3, `release.yml` run 44490378214 on 229e6113: Check Release success, Verify Deployment, Validate Production, Publish Release skipped; `git ls-remote --tags origin v0.9.8`: nothing; `origin/master` package.json `"version": "0.9.7"`
- Check: Task 3, live, `https://www.shadcn-table.com/` at 1440: pass. In `header.v4-nav` one visible link `v0.9.7`, the next link after the home link, not inside it, href `https://github.com/anindosarker/shadcn-table/releases`. The deploy showed it 319 s after the first read
- Check: Task 3, live, `https://www.shadcn-table.com/` at 390: pass. Same text and href; no header element ends past 390
- Check: Task 3, live, `https://www.shadcn-table.com/nope` (status 404) at 1440 and at 390: pass. Same header, `v0.9.7`, same href
- Check: Task 3, live, `https://www.shadcn-table.com/docs/examples/basic` at 1440 and at 390: pass. Docs header (`#nd-subnav`) still shows `v0.9.7`, same href
- Check: Task 3, `https://www.shadcn-table.com/version.txt`: `0.9.7`, pass; browser closed
- Check: Task 3, branches: `git merge origin/master` on `claude/review` was a fast-forward; `git rev-parse origin/claude/review origin/dev origin/master`: 229e6113 three times at the push (plan commits follow on `claude/review`), pass
- Task 1 The precondition, the label and the fast-forward of dev: done (b2c5963c)
- Task 2 The PR with both labels and auto-merge, its run and the merge: done (229e6113, PR 142, run 44490268925)
- Task 3 After the merge: done (229e6113)

## Attention

## Notes

- The home link's text on the live page is `//shadcn-table` without a space (two spans); a check that matches `// shadcn-table` literally finds nothing.
- Review of `CI skip label` left one minor open by choice: the label is read on a PR into any base (card Q143).
