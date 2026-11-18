# 65: Release 0.9.5, After release 0.9.5, tracker

Status: done (b47b5324)
Branch `master`, no worktree for Tasks 1 and 2 (operations only)
Checks:
- Check: release.yml run 44394527951 at da4f513f: Check Release, Verify Deployment, Validate Production, Publish Release all success
- Check: `git ls-remote --tags origin v0.9.5`: `da4f513f260ebef67f7ebf537799f3db42a0d629 refs/tags/v0.9.5`, one line, pass
- Check: `gh release view v0.9.5 --json tagName --jq .tagName`: `v0.9.5` (published 2026-11-18T20:54:26Z), pass
- Check: `curl -fsS https://www.shadcn-table.com/version.txt`: `0.9.5`; `curl -fsS https://storybook.shadcn-table.com/version.txt`: `0.9.5`, pass
- Check: live, story page `https://www.shadcn-table.com/docs/examples/more/features-sorting--sorted-on-load`: `200`, pass
- Check: live, D119 redirect `https://www.shadcn-table.com/docs/examples/react-query`: `308 https://www.shadcn-table.com/docs/examples/server-side-pagination`, pass
- Check: live, 404 page `https://www.shadcn-table.com/docs/examples/sticky-heder`: `404`, body contains `This page does not exist`, no `__next_error__`, pass
- Check: live, `curl -s https://www.shadcn-table.com/sitemap.xml | grep -c '/docs/examples/more/'`: `603` (at least 500), pass
- Check: live, `curl -s https://www.shadcn-table.com/docs/guides/sorting | grep -c 'features-sorting--sorted-on-load'`: `2` (at least 1), pass
- Check: live, story id `features-sorting--sorted-on-load` in `https://storybook.shadcn-table.com/base/index.json`, `/radix/index.json`, `/aria/index.json`: found in each, pass
- Check: live, hosted registry item `https://www.shadcn-table.com/r/base/shadcn-table-core.json`: `200`, contains `useST_TouchDrag` (18 occurrences; radix and aria the same). `shadcn-table.json` itself holds no source and so no match
- Check: `git merge origin/master -m "merge: master 0.9.5"` on claude/review in worktree 08: b47b5324, pushed; `git diff origin/master origin/claude/review -- . ':!.ai'` empty; dev fast-forwarded to master
- Check: Task 3, `git rev-parse origin/claude/review origin/dev origin/master`: `b47b5324`, `da4f513f`, `da4f513f`. dev equals master; claude/review is the merge commit above, because it carried plan commits past master (P4: a merge commit in that case), so the three are not one sha
- Check: `git ls-remote --heads origin v0.9/docs-layout`: nothing (deleted; it was an ancestor of master; no local branch and no worktree had it checked out); `git ls-remote --heads origin v0.9/filter-input-fixes`: one line, pass
- Check: `pnpm test validate-repo` on claude/review b47b5324 in worktree 08: green (645 stories, 603 story pages, 40 unit tests), pass

- Task 1 Watch release.yml to green: done (da4f513f, run 44394527951)
- Task 2 The live checks on the public addresses: done (da4f513f)
- Task 3 Branches up to master, docs branch deleted, handoff: done (b47b5324)

## Attention

## Notes
