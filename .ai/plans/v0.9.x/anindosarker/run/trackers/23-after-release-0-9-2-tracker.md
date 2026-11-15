# 23: Release 0.9.2, After release, tracker

Status: merged (e4f4662d)
Branch `master` (read), `claude/review` and `dev` (sync), main checkout
Checks:
- `gh run view 42677803985 --json status,conclusion,jobs`, run 42677803985: completed success; Check Release, Verify Deployment, Validate Production, Publish Release success
- `git ls-remote --tags origin v0.9.2`, 8feb7940: one line (8feb7940 refs/tags/v0.9.2)
- `gh release view v0.9.2 --json tagName --jq .tagName`: v0.9.2
- `curl -fsS https://www.shadcn-table.com/version.txt`: 0.9.2
- `curl -fsS https://storybook.shadcn-table.com/version.txt`: 0.9.2
- `curl -s -o /dev/null -w '%{http_code}' https://www.shadcn-table.com/sitemap.xml`: 200
- `curl -s -o /dev/null -w '%{http_code}' https://www.shadcn-table.com/robots.txt`: 200
- `curl -s -o /dev/null -w '%{http_code}' https://www.shadcn-table.com/dev`: 404
- `git rev-parse origin/claude/review origin/dev origin/master`: e4f4662d 8feb7940 8feb7940; claude/review is one merge commit (merge: master 0.9.2) past master, it carried plan commits
- `pnpm test validate-repo`, e4f4662d: pass

- Task 1 release.yml to green; tag v0.9.2; version.txt; live sitemap, robots, /dev: done
- Task 2 claude/review and dev up to master; handoff: done (handoff is the main session's)

## Attention


## Notes

