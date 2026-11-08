# 17: Workflows use the Node 24 action majors, tracker

Status: merged (9c38efcc45ebe98bb538f33c377046cc5521e12d)
Branch `v0.9/ci-node24-actions`, worktree `shadcn-react-table.worktrees/03`
Checks:
- Task 1, `gh api repos/<owner>/<repo>/contents/action.yml?ref=<tag> --jq .content | base64 -d` at 31d70572: pass, all six below
- `grep -rn '@v4' .github/workflows/` at e5457999 and b0c07db0: pass, prints nothing (47 lines changed: checkout 14, setup-node 13, upload-artifact 8, pnpm/action-setup 8, cache 3, download-artifact 1)
- `act -W .github/workflows/pr.yml -l` at e5457999: pass, all 10 jobs listed
- `act -W .github/workflows/release.yml -l` at e5457999: pass, all 4 jobs listed
- `act pull_request -W .github/workflows/pr.yml -j lint -e normal17.json -P ubuntu-latest=catthehacker/ubuntu:act-latest` at e5457999 (scratch clone, after `docker pull catthehacker/ubuntu:act-latest`): pass line met, Head green (`checkout@v7`), Lint `checkout@v7`, `pnpm/action-setup@v6`, `setup-node@v7`, `pnpm install --frozen-lockfile` green; `pnpm test lint --ci` red on the 9 known TS.tsx eslint warnings, then `upload-artifact@v7` red on `Unable to get the ACTIONS_RUNTIME_TOKEN env variable` (act has no artifact server)
- `pnpm test validate-repo` at b0c07db0: pass, 32 unit tests, 0 failed
- Verifier at 5e5da57e: every 2.2 and 1.2 local check is recorded at e5457999 or b0c07db0, and `git diff --name-only` from both to HEAD touches only the tracker and `CHANGELOG.md`; no rerun, CI is the second run
- Verifier: the 2.2 line "next GitHub run, `grep -c 'Node.js 20 is deprecated'` prints 0" needs the 0.9.1 release PR run; not a local check, left open

Action lines (Task 1):
- `actions/checkout` v7.0.1: `runs.using: node24`; inputs used here `fetch-depth`, `ref`, `token` exist
- `actions/setup-node` v7.1.0: `runs.using: node24`; inputs used here `node-version`, `cache` exist
- `actions/upload-artifact` v7.0.2: `runs.using: node24`; inputs used here `name`, `path`, `include-hidden-files`, `overwrite` exist
- `actions/download-artifact` v8.0.2: `runs.using: node24`; inputs used here `pattern`, `merge-multiple`, `path` exist
- `actions/cache` v6.1.0: `runs.using: node24`; inputs used here `path`, `key`, `restore-keys` exist
- `pnpm/action-setup` v6.1.1: `runs.using: node24`; no input passed here (version from `packageManager`)

Tasks:
- Task 1 action.yml check: done
- Task 2 uses lines: done (e5457999)
- Task 3 cleanup, changelog: done (b0c07db0)

Notes:
- The act lint proof ran green on the first invocation, `-P ubuntu-latest=catthehacker/ubuntu:act-latest` after a fresh `docker pull` of that image; no `full-latest` or `linux/amd64` needed. setup-node@v7 ran under act's node 24.19.0 toolcache.
- `pnpm/action-setup@v6` bootstraps pnpm 11 and switches to `pnpm@10.13.1` from `packageManager` ("Switching pnpm from v11.28.10 to v10.13.1"); install ran on 10.13.1.
- The zero "Node.js 20 is deprecated" annotations check needs the next GitHub `pr.yml` run (the 0.9.1 release PR); out of this milestone's reach.

## Attention
- The act lint proof (e5457999) is counted as green although the act job ended red: `pnpm test lint --ci` failed on 9 TS.tsx eslint warnings and `upload-artifact@v7` on the missing ACTIONS_RUNTIME_TOKEN (act has no artifact server); every action step on the new majors ran green and the same lint job is green on GitHub (dev run 42503995049). The verifier kept the recorder's call; the GitHub run of the 0.9.1 PR settles it.
