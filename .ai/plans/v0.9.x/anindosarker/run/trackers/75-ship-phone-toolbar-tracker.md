# 75: Ship the phone example toolbar, tracker

Status: done (84d1e91f)
Branch `dev`, worktree 03 for the branch sync (detached, operations only)
Checks:
- Check: Task 1, `git merge-base --is-ancestor origin/master origin/claude/review`: exit 0; trackers `72-ci-skip-label-fixes` `done (80f9cfdd)` and `74-example-toolbar-phone` `done (7f5545da)`; `git log --oneline origin/master..origin/claude/review -- . ':!.ai'` lists only the commits of specs 72 and 74; `origin/v0.9/filter-input-fixes` and `origin/v0.9/click-to-copy-tooltip-refocus` are not ancestors (exit 1 each); `gh pr list --state open --json number --jq length`: `0`, pass
- Check: Task 1, one push: `git push origin <claude/review head>:refs/heads/dev` (plain, fast-forward); `git rev-parse origin/dev` 1a299bb9 = the head of `claude/review`, pass
- Check: Task 2, PR 146, https://github.com/anindosarker/shadcn-table/pull/146, `docs: two-row example toolbar on a phone`, created with `gh pr create --label release:skip --label ci:skip`, auto-merge not enabled; `gh pr view 146 --json labels`: `["ci:skip","release:skip"]`, head 1a299bb9
- Check (D155): Task 2, the first run: three runs on 1a299bb9, all attempt 1: `PR checks` 44706614043 (pull_request, success), `PR labels` 44706615912 and 44706616525 (one per label, success). One push, no rerun. `gh pr view 146 --json mergeStateStatus --jq .mergeStateStatus` read three times 20 s apart after the runs ended, before auto-merge: `CLEAN`, `CLEAN`, `CLEAN` (`mergeable` `MERGEABLE`), pass
- Check: Task 2, run 44706614043: Head log `skip=true (label ci:skip)`; `gh run view 44706614043 --json jobs --jq '[.jobs[] | select(.conclusion != "success" and .conclusion != "skipped")] | length'`: `0` (19 success, 3 skipped: Lint, Validate Repo, Prepare Release); leg `Storybook Tests (radix)` steps: `Set up job` success, checkout, pnpm setup, node setup, `pnpm install --frozen-lockfile`, Playwright install, `pnpm test storybook-tests --ci --base radix`, `Hand the record to PR Summary` all skipped, `Complete job` success
- Check: Task 2, `gh pr merge 146 --auto --merge` after the read; `gh pr view 146 --json state`: `MERGED` as 84d1e91f
- Check: Task 3, `release.yml` run 44708135894 on 84d1e91f: Check Release success, Verify Deployment, Validate Production, Publish Release skipped; `git ls-remote --tags origin v0.9.8`: nothing; `origin/master` package.json `"version": "0.9.7"`
- Check: Task 3, branches: `git merge origin/master` on `claude/review` was a fast-forward; `git rev-parse origin/claude/review origin/dev origin/master`: 84d1e91f three times, pass
- Check: Task 3, `git ls-remote --heads origin 'v0.9/ci-skip-trial-*'`: nothing (the three trial branches were already deleted by milestone 72), pass

- Check: Task 3, live, `https://www.shadcn-table.com/docs/examples/basic` at 390: pass. Two rows: row 1 Previous, the name select, Next; row 2 Preview, Code, Both, Base, More actions (its right edge at 360, the header's content edge at 361); no Storybook link, Copy prompt or full screen button visible in the header. The new build showed 453 s after the first read
- Check: Task 3, live, More menu at 390: pass. Entries in order: Open in Storybook, Copy prompt, Copy install command, Fullscreen, separator, Open in GitHub, Open in StackBlitz (soon), Open in CodeSandbox (soon)
- Check: Task 3, live, at 1440: pass. One row: Previous, select, Next, Preview, Code, Both, Base, Storybook, Copy prompt, More actions (the arrow), Toggle full screen; its menu holds Copy install command, separator, Open in GitHub and the two soon entries
- Check: Task 3, capture at 390 with the menu open beside `reference/q145-after-390-menu.png`: the entries, icons, separator, soon tags and the two-row header match; the live capture is the full page top, the reference is cropped to the panel
- Check: Task 3, `https://www.shadcn-table.com/version.txt` and `https://storybook.shadcn-table.com/version.txt`: both `0.9.7`, pass; browser closed
- Task 1 The precondition and the fast-forward of dev: done (1a299bb9)
- Task 2 The PR with both labels, its first run, the CLEAN read, then auto-merge and the merge: done (84d1e91f, PR 146, run 44706614043)
- Task 3 After the merge: done (84d1e91f)

## Attention

## Notes
