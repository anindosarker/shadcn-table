# 77: PostHog setup fixes, Ship the PostHog setup fixes, tracker

Status: done (83e13730)
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

- Check: Task 3, live, the new build: the text `defaults:"2026-08-30"` is in the lazily loaded chunk `0seu5kkkpdclj.js` of `https://www.shadcn-table.com/` (not in a chunk the page HTML lists)
- Check: Task 3, live, config request after the first interaction on `/`: pass. `GET /ingest/array/<token>/config` 200, JSON body, `content-type: application/json`, `cache-control: public, max-age=300`; once per full page load
- Check: Task 3, live, capture request: pass. `POST /ingest/e/` 200; SDK version `1.453.2`, source: `$lib_version` in the decoded body (no `ver` query parameter)
- Check: Task 3, live, one `$pageview` per route change (header link Examples, client navigation to `/docs/examples/basic`): pass. Exactly 1 `$pageview` in 10 s
- Check: Task 3, live, `base_switched`: pass. Control: header Base menu, Base UI to Radix UI
- Check: Task 3, live, `install_command_copied`: pass. Control: More actions, Copy install command on `/docs/examples/basic`
- Check: Task 3, live, `example_code_opened`: pass. Control: View mode group, Code on `/docs/examples/basic`
- Check: Task 3, live, `example_file_viewed`: pass. Control: the tree row `makeData.ts` on `/docs/examples/inline-editing` (basic has one file)
- Check: Task 3, live, `storybook_opened`: pass. Control: Open example group, Storybook link
- Check: Task 3, live, `outbound_clicked`: pass. Control: header GitHub link
- Check: Task 3, live, `search_used`: pass. Control: Cmd+K, the search dialog opened
- Check: Task 3, live, static assets: pass. 200 each, no 404: `/ingest/static/1.453.2/web-vitals-with-attribution.js`, `dead-clicks-autocapture.js`, `surveys.js`, `posthog-recorder.js`
- Check: Task 3, live, console: pass. No error or warning at all
- Check: Task 3, live, event names beyond the expected: none. Seen: `$pageview`, `$$heatmap`, `$web_vitals`, `$snapshot` and the seven custom events; no `$rageclick`, no `$pageleave` in the session
- Check: Task 3, live, session recording: seen. `POST /ingest/s/` 200, first about 10 s after the first PostHog request
- Check: Task 3, live, URL hash: a full load of `/docs/examples/basic#x` sent `$current_url` `https://www.shadcn-table.com/docs/examples/basic` (the hash is left out, as the dated defaults set it)
- Check: Task 3, `https://www.shadcn-table.com/version.txt` and `https://storybook.shadcn-table.com/version.txt`: both `0.9.7`, pass; browser closed
- Task 1 The precondition and the fast-forward of dev: done (78253c50)
- Task 2 The PR with both labels, its first run, the CLEAN read, auto-merge and the merge: done (83e13730, PR 148, run 45087766469)
- Task 3 After the merge: done (83e13730)

## Attention

## Notes

- The live read cannot tell which PostHog host answered `/ingest/array/<token>/config`: the rewrite happens on the server, and the path answered 200 with the same headers before the change too (tracker `76-ship-the-posthog-sdk-update`). That the request now goes to the assets host is proven by the rewrite order in the built `routes-manifest.json` (tracker `77-posthog-setup-fixes`), not by the live read.
- No `$pageleave` was seen in the live session; `capture_pageleave: true` is still set by hand. The session closed its pages without an unload the recorder waited for, so this says nothing either way; not compared with the earlier build.
- A deploy check that searches only the chunks the page HTML lists never finds the options chunk: it is loaded lazily. Search the chunks referenced from other chunks.
- Nothing is left for the owner in PostHog or Vercel: no project setting, Vercel setting or env var was needed.
