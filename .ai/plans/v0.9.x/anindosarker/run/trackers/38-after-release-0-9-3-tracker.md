# 38: Release 0.9.3, After release, tracker

Status: merged (9378b9f8)
Branch `master` (read), `claude/review` and `dev` (sync), main checkout
Checks:
- `gh run watch 43313863214 --exit-status`, run 43313863214 (https://github.com/anindosarker/shadcn-table/actions/runs/43313863214): completed success; Check Release, Verify Deployment, Validate Production, Publish Release success
- `git ls-remote --tags origin v0.9.3`, 9378b9f8: one line (9378b9f8 refs/tags/v0.9.3)
- `gh release view v0.9.3 --json tagName --jq .tagName`: v0.9.3
- `curl -fsS https://www.shadcn-table.com/version.txt`: 0.9.3
- `curl -fsS https://storybook.shadcn-table.com/version.txt`: 0.9.3
- `curl -s https://www.shadcn-table.com/ | grep -o '<title>[^<]*</title>'`: <title>shadcn-table: React Data Table for shadcn/ui and TanStack</title>
- `curl -s https://www.shadcn-table.com/ | grep -c 'rel="canonical"'`: 1
- `curl -s -o /dev/null -w '%{http_code}' https://www.shadcn-table.com/docs/getting-started/comparison`: 404
- `curl -sI -H 'Accept: text/markdown' https://www.shadcn-table.com/docs/getting-started/introduction | grep -i '^content-type'`: content-type: text/markdown; charset=utf-8
- `curl -s -o /dev/null -w '%{http_code}' https://www.shadcn-table.com/opengraph-image`: 200
- `git rev-parse origin/claude/review origin/dev origin/master`: 4d134f58 9378b9f8 9378b9f8; dev fast-forwarded to master; claude/review is one merge commit (merge: master 0.9.3) past master, it carried plan commits (trackers, sprints.md) only
- `pnpm test validate-repo`, 4d134f58: pass

- Task 1 release.yml to green; tag v0.9.3; release; version.txt; live title, canonical, comparison 404, Markdown, OG image: done (9378b9f8, run 43313863214)
- Task 2 claude/review and dev up to master: done (4d134f58; handoff is the run manager's)

## Attention


## Notes
