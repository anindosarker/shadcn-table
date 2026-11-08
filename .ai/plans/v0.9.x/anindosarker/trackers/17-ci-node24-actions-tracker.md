# 17: Workflows use the Node 24 action majors, tracker

Status: running
Branch `v0.9/ci-node24-actions`, worktree `shadcn-react-table.worktrees/03`
Checks:
- Task 1, `gh api repos/<owner>/<repo>/contents/action.yml?ref=<tag> --jq .content | base64 -d` at 31d70572: pass, all six below

Action lines (Task 1):
- `actions/checkout` v7.0.1: `runs.using: node24`; inputs used here `fetch-depth`, `ref`, `token` exist
- `actions/setup-node` v7.1.0: `runs.using: node24`; inputs used here `node-version`, `cache` exist
- `actions/upload-artifact` v7.0.2: `runs.using: node24`; inputs used here `name`, `path`, `include-hidden-files`, `overwrite` exist
- `actions/download-artifact` v8.0.2: `runs.using: node24`; inputs used here `pattern`, `merge-multiple`, `path` exist
- `actions/cache` v6.1.0: `runs.using: node24`; inputs used here `path`, `key`, `restore-keys` exist
- `pnpm/action-setup` v6.1.1: `runs.using: node24`; no input passed here (version from `packageManager`)

Tasks:
- Task 1 action.yml check: done
- Task 2 uses lines: planned
- Task 3 cleanup, changelog: planned

Notes:

## Attention
