# 48: Release 0.9.4, After release, tracker

Status: merged (7b37986610565ff36f191c89932edfcdda4385af)
Branch `master` (read), `claude/review` and `dev` (sync), main checkout
Checks:
- `gh run watch 43503728164 --exit-status`, run 43503728164 (https://github.com/anindosarker/shadcn-table/actions/runs/43503728164): completed success; Check Release, Verify Deployment, Validate Production, Publish Release success
- `git ls-remote --tags origin v0.9.4`, 7b379866: one line (7b37986610565ff36f191c89932edfcdda4385af refs/tags/v0.9.4)
- `gh release view v0.9.4 --json tagName --jq .tagName`: v0.9.4
- `curl -fsS https://www.shadcn-table.com/version.txt`: 0.9.4
- `curl -fsS https://storybook.shadcn-table.com/version.txt`: 0.9.4
- `curl -s https://www.shadcn-table.com/ | sed 's/<[^>]*>//g' | grep -c 'The open-source shadcn data table for React'`: 2
- `curl -s https://www.shadcn-table.com/ | grep -o '<title>[^<]*</title>'`: <title>shadcn-table: React Data Table for shadcn/ui and TanStack</title>
- `curl -s -o /dev/null -w '%{http_code}' https://www.shadcn-table.com/docs/getting-started/comparison`: 200
- Hosted hook: `apps/shadcn-table-docs/public/r/base/` has no `shadcn-table-base.json` (the spec's example name serves 404); the hook ships in `shadcn-table-core.json` (the only file there with it). `curl -s https://www.shadcn-table.com/r/base/shadcn-table-core.json | grep -c useST_DebouncedCallback`: 6
- `git rev-parse origin/claude/review origin/dev origin/master`: e0dee2e6 7b379866 7b379866; dev fast-forwarded to master (13db000a..7b379866); claude/review is one merge commit (merge: master 0.9.4) past master, it carried plan commits only (decisions.md, queue.md, status/sprints.md, 48 trackers)
- `pnpm test validate-repo`, e0dee2e6: pass (40 unit tests, registry valid and fresh, tree clean)

- Task 1 release.yml to green; tag v0.9.4; release; version.txt; live hero, title, comparison 200, hosted hook: done (7b379866, run 43503728164)
- Task 2 claude/review and dev up to master: done (e0dee2e6; handoff is the run manager's)

## Attention

## Notes
